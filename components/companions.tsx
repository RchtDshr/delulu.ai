import { Companion } from "@prisma/client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";

interface CompanionsProps {
  // passing a list of data which conatins companion and their count
  data: (Companion & {
    _count: {
      msgs: number;
    };
  })[];
}

export default function Companions({ data }: CompanionsProps) {
  if (data.length == 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="relative w-80 h-80">
          <Image
            fill
            className="grayscale"
            src="/notfound.png"
            alt="Not Found"
          />
        </div>
        <h1 className="text-xl">No companions found</h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grip-cols-5 lg:grid-cols-5 gap-2 ">
      {data.map((item) => (
        <Card
          key={item.id}
          className="bg-primary/10 py-3 cursor-pointer hover:opacity-75 transition border-3 pt-0 pb-0"
        >
          <Link href={`/chat/${item.id}`}>
            <CardHeader className="flex flex-col justify-center items-center text-left gap-3 pb-2">
              <div className="relative rounded h-[10rem] w-[10rem] ">
                <Image fill className="rounded-md object-cover" src={item.src} alt={`${item.name}`} />
              </div>
              {/* <CardTitle> */}
                <p className="text-left text-md w-full font-bold"> {item.name}</p>
              {/* </CardTitle> */}
            </CardHeader>
            <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="lowercase">
                @{item.userName}
                </div>
                <div className="flex items-center gap-1 ">
                  
                        <MessagesSquare className="w-4" />
                  
                  
                        {item._count.msgs}
                  
                </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
}
