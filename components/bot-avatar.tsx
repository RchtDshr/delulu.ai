import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface BotAvatarProps{
    src: string
}

export default function BotAvatar({src} : BotAvatarProps) {
  return (
    <Avatar className="h-16 w-16">
        <AvatarImage src={src} />
        <AvatarFallback>BOT</AvatarFallback>
    </Avatar>
  )
}
