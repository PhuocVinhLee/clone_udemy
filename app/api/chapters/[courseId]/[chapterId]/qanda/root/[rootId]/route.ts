import { auth, currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import {
  createMuxdata,
  deleteMuxdataByChapterId,
  deleteMuxdta,
  getMuxdataByChapterId,
} from "@/lib/actions/muxdata.action";

import Courses from "@/lib/database/models/courses.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import Chapters from "@/lib/database/models/chapters.model";
import { getUserById } from "@/lib/actions/user.actions";
import QandA from "@/lib/database/models/qanda.model";

export async function GET(
  req: Request,
  { params }: { params: { rootId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const current_User = await currentUser();
    if (!userId) {
      return new NextResponse("UnAuthention in Update Chapter", {
        status: 401,
      });
    }
    const { rootId, chapterId } = params;

    console.log(current_User);
    const isTeacher = current_User?.publicMetadata?.role === "teacher";

    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }
    const message = await QandA.findById(
      rootId
    ).populate("userId", "_id username photo role"); // Specify the fields you want to include from the Chapters model
    const qandaWithRelay = message.toObject();
    qandaWithRelay.length_of_relay = 0;
    //console.log(".sort({ createdAt: 1 })",showMoreMessage )
    return NextResponse.json(qandaWithRelay);
  } catch (error) {
    console.log("erorr in Update chapter", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
