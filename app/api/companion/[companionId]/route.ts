import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function PATCH(req: Request, {params} : {params: {companionId: string}}) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, desc, instructs, seed, categoryId } = body;

    if (!params.companionId){
        return new NextResponse("Companion ID is required", {status: 400});
    }

    if (!user || !user.id || !user.firstName){
        return new NextResponse('Unauthorized', {status: 401})
    }

    if ( !src || !name || !desc || !instructs || !seed || !categoryId) {
        return new NextResponse('Missing required field', {status: 400});
    }

    const companion = await prismadb.companion.update({
        where: { userId: user.id, id: params.companionId },
        data: {
            categoryId,
            userId: user.id,
            userName: user.firstName,
            src,
            name,
            desc,
            instructs,
            seed
        }
    });
    return NextResponse.json(companion);

  } catch (err){
    console.log("[Companion_patch error]", err)
    return new NextResponse('Internal error', {status: 500})
  }
}

export async function DELETE(req: Request, {params} : {params: {companionId: string}}) {
  try {
    const {userId} = auth();

    // if user is not logged in 
    if (!userId) {
      return new NextResponse("Unauthorized", {status: 401}) 
    }
    
    const companion = await prismadb.companion.delete({
      where: {
        userId: userId, //only user thaat has made that companion can delete it
        id: params.companionId
      }
    })

    return NextResponse.json(companion);

  } catch (error) {
    console.log("Companion_delete error ", error);
    return new NextResponse("Internal error", {status: 500})
  }
}