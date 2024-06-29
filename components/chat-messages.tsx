'use client'

import { Companion } from "@prisma/client"

interface ChatMessagesProps{
    messages : any[],
    isLoading: boolean,
    companion: Companion
}
// for all chat msgs in which we will have different chat components oen for system adn one for user
// sys msg will be on left side and user msg will be on right side, so we create different component and design for two different types
export default function ChatMessages({messages =[], isLoading,  companion} : ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto pr-4">ChatMessages</div>
  )
}
