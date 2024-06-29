'use client'

import { Companion } from "@prisma/client"
import ChatMessage, { ChatMessageProps } from "./chat-message"

interface ChatMessagesProps{
    messages : ChatMessageProps[],
    isLoading: boolean,
    companion: Companion
}
// for all chat msgs in which we will have different chat components oen for system adn one for user
// depending on the role chat message will be displayed
// sys msg will be on left side and user msg will be on right side, so we create different component and design for two different types
export default function ChatMessages({messages =[], isLoading,  companion} : ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto pr-4">
      
      <ChatMessage
      role="system"
      src={companion.src}
      content= {`Hello! I am ${companion.name}, ${companion.desc}`}
      />
      <ChatMessage
      role="user"
      content= {`Hello! I am Eren Yeager's fan`}
      />
    </div>
  )
}
