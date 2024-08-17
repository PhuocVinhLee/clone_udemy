import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Questions from "@/lib/database/models/questions.model";
import { getUserById } from "@/lib/actions/user.actions";
import Categorys from "@/lib/database/models/categorys.model";
import QuestionTypes from "@/lib/database/models/questionTypes.model";

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
export async function GET(req: Request) {
  try {
    const { userId }: { userId: string | null } = auth();

    if (!userId) {
      return new NextResponse("Anauthorrided Error", { status: 401 });
    }
    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }

    const questions = await Questions.find({ userId: user._id })
      .populate({
        path: "questionTypeId",
        select: "name",
        model: QuestionTypes,
      })
      .populate({ path: "categoryId", select: "name", model: Categorys })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .lean()
      .exec();

    const questionsStranform = questions.map((question) => ({
      ...question,
      questionTypeId: question.questionTypeId.name,
      categoryId: question.categoryId.name,
    }));

  console.log(questionsStranform)
    return NextResponse.json(questionsStranform);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
    //return NextResponse.json({ message: "NOTOK", error: error });
  }
}
