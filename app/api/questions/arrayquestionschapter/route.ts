import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";

import { getUserById } from "@/lib/actions/user.actions";
import QuestionsChapter from "@/lib/database/models/questionschapter.model";
import Courses from "@/lib/database/models/courses.model";
import Questions from "@/lib/database/models/questions.model";

export async function POST(req: Request) {
  try {
    const { userId }: { userId: string | null } = auth();
    const { arrayQuestion } = await req.json();

    if (!userId) {
      return new NextResponse("Anauthorrided Error", { status: 401 });
    }
    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }

    const createdQuestions = [];
    const errors = [];
    for (const question of arrayQuestion) {
      try {
        const questionData = {
          title: question?.title,
          description: question?.description,
          imageUrl: question?.imageUrl,
          answer: question?.answer,
          questionTypeId: question?.questionTypeId,
          template: question?.template,
          testCases: question?.testCases,
          categoryId: question?.categoryId,
          createAt: new Date(),
          userId: user._id,
          level: question?.level
        };
        const newQuestion = await Questions.create(questionData);
        createdQuestions.push(newQuestion);
      } catch (error: any) {
        errors.push({
          question,
          error: error.message,
        });
      }
    }

    return NextResponse.json({ createdQuestions, errors });
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Error", { status: 500 });
    //return NextResponse.json({ message: "NOTOK", error: error });
  }
}
