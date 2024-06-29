import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface BotAvatarProps{
    src: string
}

export default function BotAvatar({src} : BotAvatarProps) {
  return (
    <Avatar className="h-12 w-12">
        <AvatarImage src={src} />
        <AvatarFallback>BOT</AvatarFallback>
    </Avatar>
  )
}
