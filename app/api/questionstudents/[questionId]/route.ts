import { getUserById } from "@/lib/actions/user.actions";
import Courses from "@/lib/database/models/courses.model";
import Questions from "@/lib/database/models/questions.model";
import QuestionStudents from "@/lib/database/models/questionstudents.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const { userId } = auth();
    const { questionId } = params;
    const payload = await req.json();

    if (!userId) return new NextResponse("UnAuthention", { status: 401 });
    await connectToDatabase();

    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }

    // const questionToUpdate = await Questions.findById(questionId);

    // if (!questionToUpdate || questionToUpdate?.userId.toHexString() !== user._id) {
    //   throw new Error("Unauthorized or Question S not found");
    // }

    console.log("payload", payload);
    const dataQuestionStudent = {
      userId: user._id,
      questionId: questionId,
      // subAnswer: payload?.subAnswer,
      answer: payload?.answer,
      isCorrect: false,
      gotAnwsers: payload.gotAnwsers,
      updatedAt: new Date(),
    };
    let checkIsCorrect = true;

    for (const answer of payload?.gotAnwsers) {
      if (answer.output != answer.got) {
        checkIsCorrect = false;
      }
    }
    const questionStudent = await QuestionStudents.findOne( { questionId: questionId, userId: user._id });
    console.log("questionStudent", questionStudent)
    if (questionStudent?.isCorrect) {
      console.log("isCorrect")
      const QuestionUpdated = await QuestionStudents.findOneAndUpdate(
        { questionId: questionId, userId: user._id },
        {
          updatedAt: new Date(),
          subAnswer: payload?.answer,
        },
        {
          new: false,
        }
      );
      return NextResponse.json(QuestionUpdated);
    } else {
      console.log("NotisCorrect")
      const QuestionUpdated = await QuestionStudents.findOneAndUpdate(
        { questionId: questionId, userId: user._id },
        { ...dataQuestionStudent, isCorrect: checkIsCorrect },
        {
          new: true,
          upsert: true,
        }
      );
      return NextResponse.json(QuestionUpdated);
    }
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
