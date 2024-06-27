"use client";

import { Companion, Message } from "@prisma/client";
import { Button } from "./ui/button";
import { ChevronLeft, MessagesSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "./ui/avatar";
import BotAvatar from "./bot-avatar";
import { useAuth, useUser } from "@clerk/nextjs";
import { useToast } from "./ui/use-toast";
import axios from "axios";

interface ChatHeaderProps {
  companion: Companion & {
    msgs: Message[];
    _count: {
      msgs: number;
    };
  };
}

export default function ChatHeader({ companion }: ChatHeaderProps) {
  const router = useRouter();
  const {user} = useUser();
  const {toast}=useToast();

  async function onDelete() {
    try {
        // if user wants to delete, use companion id to delete and call a delete call for api
        await axios.delete(`/companion/${companion.id}`);
        toast({
            description:"Companion deleted",
            variant: "destructive"
        })
    } catch (error) {
        toast({
            description:"Some went wrong",
            variant: "destructive"
        })
    }
  }
//   or
//   const {userId} = useAuth();

  return (
    <div className="chat-header h-full w-full flex justify-between items-center border-b border-primary/10 p py-4">
      <div className="back-button flex justify-start items-center gap-3">
        <Button size="icon" variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <BotAvatar src={companion.src} />
        <div className="flex flex-col items-start gap-1">
          <div className="flex gap-2">
            <p className="text-lg font-bold">{companion.name}</p>
            <div className="text-muted-foreground flex items-center">
              <MessagesSquare className="h-4 " /> {companion._count.msgs}
            </div>
          </div>
          <div className="text-muted-foreground text-md"> Created by {companion.userName}</div>
        </div>
      </div>

{/* if the companion is made by that user  */}
    {user?.id === companion.userId && (
        <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => router.push(`/companion/${companion.id}`) } >Edit</Button>
            <Button size="sm" variant="ghost" onClick={onDelete}>Delete</Button>
        </div>
    )}

    </div>
  );
}
