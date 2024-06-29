'use client'

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";

export default function UserAvatar() {
  const {user} = useUser();
  return (
    <Avatar className="h-12 w-12">
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>User</AvatarFallback>
    </Avatar>
  )
}
