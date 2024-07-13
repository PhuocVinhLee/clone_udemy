import { getUserById } from "@/lib/actions/user.actions";
import Courses from "@/lib/database/models/courses.model";
import Questions from "@/lib/database/models/questions.model";
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

    const questionToUpdate = await Questions.findById(questionId);

    if (!questionToUpdate || questionToUpdate?.userId.toHexString() !== user._id) {
      throw new Error("Unauthorized or Question not found");
    }

    const dataQuestion = {
      title: payload?.title,
      description: payload?.description,
      imageUrl: payload?.imageUrl,
      categoryId: payload?.categoryId,
      answer: payload?.answer,
      questionTypeId: payload?.questionTypeId,
      template: payload?.template,
      testCases: payload?.testCases,
      updatedAt: new Date()
    };
    console.log("dataQuestion",dataQuestion)

    
    const QuestionUpdated = await Questions.findByIdAndUpdate(
      questionId,
      dataQuestion,
      {
        new: false,
      }
    );
    return NextResponse.json(QuestionUpdated);
  } catch (error) {
    console.log("error", error)
    return new NextResponse("Inter Error", { status: 500 });
  }
}
