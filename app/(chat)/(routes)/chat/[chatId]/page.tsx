import prismadb from "@/lib/prismadb";
import { RedirectToSignIn } from "@clerk/nextjs";
import { auth, redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatClient from "./components/client";

interface ChatProps{
  params: {
    chatId: string;
  };
}

export default async function Chat({params}:ChatProps) {
  const {userId} = auth();

  // if user is not signed in then redirect to sign in page
  if (!userId){
    return auth().redirectToSignIn()
  }

  // extract a specific comapnion with id that is entered in url which is companion id but by the folder structure we used chatId so we extarct it by using chatId.
  // we then include all the msgs that are in that companion for a specific user only and then sort it by date
  const companion = await prismadb.companion.findUnique({
    where:{
      id: params.chatId
    },
    include: {
      msgs: {
        orderBy:{
          createdAt: 'asc'
        },
        where: {
          userId: userId
        }
      },
      _count: {
        select:{
          msgs: true
        }
      }
    }
  })

  // if companion is not found then redirect to home page
  if (!companion){
    return redirect('/')
  }

  return (
    <ChatClient companion={companion} />
  )
}
