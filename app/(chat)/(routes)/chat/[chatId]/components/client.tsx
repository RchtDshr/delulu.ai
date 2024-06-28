'use client'

import ChatHeader from "@/components/chat-header"
import { Companion, Message } from "@prisma/client"

interface ChatClientProps{
    companion: Companion & {
        msgs: Message[],
        _count: {
            msgs: number
        }
    }
}

export default function ChatClient({companion}:ChatClientProps) {

  return (
    <div className="p-1 flex flex-col space-y-2">
        <ChatHeader companion={companion} />
    </div>
  )
}
