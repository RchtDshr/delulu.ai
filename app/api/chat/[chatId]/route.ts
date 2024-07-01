import { LangChainAdapter, StreamingTextResponse } from 'ai';

import { CallbackManager } from "@langchain/core/callbacks/manager";
import { Replicate } from "@langchain/community/llms/replicate";

import { NextResponse } from 'next/server';

import { MemoryManager } from '@/lib/memory';
import { rateLimit } from '@/lib/rate-limit';

import prismadb from '@/lib/prismadb';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request, {params}: {params: {chatId: string}}){
    try {
        const {prompt} = await req.json();
        const user = await currentUser();

        if (!user || !user.firstName || !user.id){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const identifier = req.url + '-' + user.id;
        const {success} = await rateLimit(identifier);

        if(!success){
            return new NextResponse("Rate limit exceeded", {status: 420})
        }

        // update companion 
        const companion = await prismadb.companion.update({
            where:{
                id: params.chatId,
            },
            data:{
                msgs: {
                    create:{ //create a new msg.. store the prompt which we typed into conetent adn give roles
                        content: prompt,
                        role: "user",
                        userId: user.id
                    }
                }
            }
        });

        if(!companion){
            return new NextResponse("Companion not found", {status: 404})
        }

        // files needed for memory manager
        const name = companion.id;
        const companion_file_name = name + '.txt';

        const companionKey = {
            companionName: name,
            userId: user.id,
            modelName: "llama2-13b"
        }

        const memoryManager = await MemoryManager.getInstance();

        //any memory for the companion already exists
        const records = await memoryManager.readLatestHistory(companionKey);

        if (records.length === 0){ //if we dont have any chat history, take this seed chat
            await memoryManager.seedChatHistory(companion.seed, "\n\n",companionKey)
        }

        // add the data/chats/msgs to the vector db bcoz abhi tak bs prisma db me gye       
        await memoryManager.writeToHistory("User: " + prompt + '\n', companionKey);

        // read for that exact user and the companion
        const recentChatHistory = await memoryManager.readLatestHistory(companionKey);

        // search for similar docs
        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory, companion_file_name
        );

        //  to get the relevant history, to make this ai model as good as possible
        let relevantHistory = "";

        if (!!similarDocs && similarDocs.length !== 0){
            relevantHistory = similarDocs.map(doc => doc.pageContent).join("\n");
        }

        const { handlers } = LangChainAdapter;

        // create model
        const model = new Replicate({
            model: "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input: {
                max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbacks: CallbackManager.fromHandlers(handlers)
        })

        model.verbose = true ///add useful logs to our console

        // instructions for ai model 
        const resp = String(
            await model
                .invoke( // so that ai doesnt respond with its own name. next is instructions for the ai. next pass the relevant histoory into the prompt. next we add recent chat history.
                    `
                    ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix. 
                    ${companion.instructs}
                    Below are the relevant details about ${name}'s past and the conversation you are in.
                    ${relevantHistory} 
                    ${recentChatHistory}\n${name}:
                    `
                )
                .catch(console.error)
        );
        const cleaned = resp.replaceAll(',', "");
        const chunks = cleaned.split('\n');
        const response = chunks[0];

        //write response to history
        await memoryManager.writeToHistory("" + response.trim(), companionKey);
        var Readable = require("stream").Readable; // readable stream

        let s = new Readable();
        s.push(response);
        s.push(null);

        // to check if response is not correct 
        if (response !== undefined && response.length > 1){
            memoryManager.writeToHistory("" + response.trim(), companionKey);

            await prismadb.companion.update({
                where: {
                    id: params.chatId
                },
                data: {
                    msgs: {
                        create: {
                            content: response.trim(),
                            role: "system",
                            userId: user.id
                        }
                    }
                }
            })
        }
        return new StreamingTextResponse(s);
    } catch (err) {
        console.log("CHATPOST_ERROR", err)
        return new NextResponse("Internal Error", {status: 500})
    }
}