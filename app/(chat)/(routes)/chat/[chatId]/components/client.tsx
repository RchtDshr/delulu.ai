"use client";

import ChatHeader from "@/components/chat-header";
import { Companion, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useCompletion } from "ai/react";
import ChatForm from "@/components/chat-form";
import ChatMessages from "@/components/chat-messages";
import { ChatMessageProps } from "@/components/chat-message";

interface ChatClientProps {
  companion: Companion & {
    msgs: Message[];
    _count: {
      msgs: number;
    };
  };
}

export default function ChatClient({ companion }: ChatClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(companion.msgs);

  // from npm i ai package which provides tool for ai chat ui
  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      ///usecompletion is somethinf like useform hook but which provides versatile functionality made for ai tool
      api: `/api/chat/${companion.id}`, // api call which will generate ai msgs
      onFinish(prompt, completion) {
        // for ai msg
        const systemMessage : ChatMessageProps = {
          role: "system", //all the system will be stored. ai will take time to generate msg so we have isFinished and content completion type of remarks to help us understand when the ai has completed generating msg
          content: completion,
        };
        setMessages((current) => [...current, systemMessage]);
        setInput("");

        router.refresh();
      },
    });

  // for user as user will submit his reply using a form
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    //when user clicks send or submit buttun is clicked
    const userMessage: ChatMessageProps = {
      role: "user", //user reply is stored with role user
      content: input,
    };

    setMessages((current) => [...current, userMessage]); // the reply is appended into list with all the prev msgs there

    handleSubmit(e);
  };

  return (
    <div className="p-1 flex h-[100vh] flex-col space-y-2">
      <ChatHeader companion={companion} />

      <ChatMessages
      companion={companion}
      isLoading={isLoading}
      messages={messages}
      />

      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
