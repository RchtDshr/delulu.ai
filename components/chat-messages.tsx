"use client";

import { Companion } from "@prisma/client";
import ChatMessage, { ChatMessageProps } from "./chat-message";
import { ElementRef, useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  companion: Companion;
}

// this is a container file for all msgs
// in which chat message component is rendered, differently for user and system
export default function ChatMessages({
  messages = [],
  isLoading,
  companion,
}: ChatMessagesProps) {

  // we need to scroll to the bottom of the chat window
  const scrollRef = useRef<ElementRef<"div">>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  },[messages.length]) //happen everytime msg ki length is changed so that we always at the latest msg
  
  return (
    <div className="flex-1 overflow-y-auto px-2">
      <ChatMessage
        role="system"
        src={companion.src}
        content={`Hello! I am ${companion.name}, ${companion.desc}`}
      />

      {/* a dummy for checking user msg ui */}
      {/* <ChatMessage
      role="user"
      content= {`Hello! I am Eren Yeager's fan`}
      /> */}

      {/* actual msg which will render all the msg from user and ai */}
      {messages.map((msg) => (
        <ChatMessage
          key={msg.content}
          role={msg.role}
          src={companion.src}
          content={msg.content}
        />
      ))}

      {/* while ai is loading the msg we need to show a dummy chat msg */}
      {isLoading && (
        <ChatMessage
          role="system"
          src={companion.src}
          isLoading
        />
      )}
      <div ref={scrollRef}></div>
    </div>
  );
}
