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

   
    console.log("asnclasknclnascljalkschkljasbckabscjkasjkcjkavsckjvaschv", payload, questionId)
    const dataQuestionStudent = {
      flag: payload?.flag,
      updatedAt: new Date(),
    };

    const QuestionUpdated = await QuestionStudents.findOneAndUpdate(
      { questionId: questionId, userId: user._id },
      dataQuestionStudent,
      {
        new: true,
        upsert: true,
      }
    );
    return NextResponse.json(QuestionUpdated);
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
