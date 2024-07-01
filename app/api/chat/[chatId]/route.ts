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
                userId: user.id,
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

        // add the data/chats to the vector db         
        await memoryManager.writeToHistory("User: " + prompt + '\n', companionKey);

    } catch (err) {
        console.log("CHATPOST_ERROR", err)
        return new NextResponse("Internal Error", {status: 500})
    }
}