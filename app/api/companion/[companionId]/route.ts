import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
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
        where: { id: params.companionId },
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
