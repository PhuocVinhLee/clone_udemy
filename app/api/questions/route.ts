import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Questions from "@/lib/database/models/questions.model";
import { getUserById } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  try {
    const { userId }: { userId: string | null } = auth();
    const { title } = await req.json();
    
    if (!userId) {
      return new NextResponse("Anauthorrided Error", { status: 401 });
    }
    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }
   
    const newQuestion = await Questions.create({ title, userId: user._id }); // { userId: 1233; title: test;}
    return NextResponse.json(newQuestion);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
    //return NextResponse.json({ message: "NOTOK", error: error });
  }
}
