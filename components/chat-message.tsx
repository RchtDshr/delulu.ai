"use client";

import { cn } from "@/lib/utils";
import BotAvatar from "./bot-avatar";
import UserAvatar from "./user-avatar";

// this is for system / ai msg ui

export interface ChatMessageProps {
  role: "system" | "user";
  src?: string;
  content?: string;
  isLoading?: boolean;
}

export default function ChatMessage({
  role,
  content,
  isLoading,
  src,
}: ChatMessageProps) {
  // const { toast } = useToast();
  return (
    <div
      className={cn(
        "group flex items-start gap-2 py-3 w-full", //msg is by sys so items at start
        role === "user" && "justify-end" //if msg is send by user we want msg to be displayed at end
      )}
    >
      {role !== "user" && src && <BotAvatar src={src} />}
      <div className="text-sm max-w-sm bg-primary/10 rounded-lg px-3 py-2">
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          content
        )}
      </div>
      {role === "user" && <UserAvatar />}
    </div>
  );
}
