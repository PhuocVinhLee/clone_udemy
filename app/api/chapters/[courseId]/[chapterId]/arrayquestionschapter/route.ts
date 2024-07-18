import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";

import { getUserById } from "@/lib/actions/user.actions";
import QuestionsChapter from "@/lib/database/models/questionschapter.model";
import Courses from "@/lib/database/models/courses.model";

export async function POST(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
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
    const questionEndPosition = await QuestionsChapter.findOne({
      chapterId: params.chapterId,
    })
      .sort({ position: -1 })
      .exec();
    let position = questionEndPosition ? questionEndPosition.position + 1 : 0;
    const createdQuestions = [];
    const errors = [];
    for (const question of arrayQuestion) {
      try {
        const questionData = {
          _id: question?._id,
          title: question?.title,
          description: question?.description,
          imageUrl: question?.imageUrl,
          
          answer: question?.answer,
          questionTypeId: question?.questionTypeId,
          template: question?.template,
          testCases: question?.testCases,
          createAt: new Date(),
          chapterId: params.chapterId,
          userId: user._id,
          position: position++,
        };
        const newQuestion = await QuestionsChapter.create(questionData);
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
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { arrayQuestions } = await req.json();
    if (!userId) {
      return new NextResponse("Anauthorrided Error", { status: 401 });
    }
    await connectToDatabase();

    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }
    const coursToUpdate = await Courses.findById(courseId);

    if (!coursToUpdate || coursToUpdate?.userId.toHexString() !== user._id) {
      throw new Error("Unauthorized or Course not found");
    }
    for (const question of arrayQuestions) {
      const updatedQuestion = await QuestionsChapter.findByIdAndUpdate(
        question._id,
        { position: question.position },
        {
          new: false,
        }
      );
    }
    return NextResponse.json(coursToUpdate);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
