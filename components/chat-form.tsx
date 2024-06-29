"use client";

import { ChatRequestOptions } from "ai";
import { ChangeEvent, FormEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";

interface ChatFormProps {
  isLoading: boolean;
  input: string;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
}
export default function ChatForm({
  isLoading,
  input,
  handleInputChange,
  onSubmit,
}: ChatFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center py-2 gap-x-2 border-t border-primary/10"
    >
      {/* <div className="input flex w-full py-3 gap-x-3 relative"> */}
        <Input
          disabled={isLoading}
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="bg-primary/10 rounded-lg"
        />
        <Button variant="ghost">
          <SendHorizonal/>
        </Button>
      {/* </div> */}
    </form>
  );
}
