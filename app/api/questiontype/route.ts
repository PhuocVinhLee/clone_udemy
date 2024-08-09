
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/database/mongoose";

import QuestionTypes from "@/lib/database/models/questionTypes.model";

export async function GET() {
  try {
    await connectToDatabase();
    const questionType = await QuestionTypes.find()
    console.log("question typw", questionType)
    if(questionType){
      return NextResponse.json(questionType);
    }
    return new NextResponse("Not found question type", { status: 400 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  
) {
  try {


    await connectToDatabase();
    const payload = await req.json();

    const message = await QuestionTypes.create({template: payload.template, name: payload.name})

    return NextResponse.json(message);
  } catch (error) {
    console.log("erorr in Seen Q and A", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
