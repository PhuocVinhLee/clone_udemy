import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


import { getUserById } from "@/lib/actions/user.actions";

import Questions from "@/lib/database/models/questions.model";

export async function PATCH(
  req: Request,
  { params }: { params: { questionId: string} }
) {
  try {
    const { userId } = auth();
    const { questionId } = params;
    const { isPublished } = await req.json();

    console.log("userId in chapter", userId);
    if (!userId) {
      return new NextResponse("UnAuthention in Update Question", {
        status: 401,
      });
    }

  
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }

    const question = await Questions.findById(questionId);

    if (!question || question?.userId.toHexString() !== user._id) {
      throw new Error("Unauthorized or Question not found");
    }


 
    if (
      isPublished &&
      (!question.title ||
        !question.description ||
        !question.imageUrl ||
        !question.answer ||
        !question.questionTypeId ||
        !question.template ||
        !question.categoryId ||
        question.testCases.length == 0)
    ) {
      return new NextResponse("Missing required fields", {
        status: 400,
      });
    }

    const DataQuestion = {
      isPublished: isPublished,
    };
    const updatedQuestion = await Questions.findByIdAndUpdate(
      question._id,
      DataQuestion,
      {
        new: false,
      }
    );

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.log("erorr in Update question", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
