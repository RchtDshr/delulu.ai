import prismadb from "@/lib/prismadb";
import CompanionForm from "./components/companion-form";
import { auth, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface CompanionIdPageProps {
    params: {
        companionId: string;
    };
};

export default async function CompanionIdPage({params}: CompanionIdPageProps) {
    const { userId } = auth();
    
    // if user is not logged in 
    if (!userId) {
        return auth().redirectToSignIn() 
      }

    const companion = await prismadb.companion.findUnique({
        where: {
            userId: userId,
            id: params.companionId
        }
    })

    const categories = await prismadb.category.findMany();

  return (
    <CompanionForm
    initialData={companion}
    categories={categories}
    />
  )
}
