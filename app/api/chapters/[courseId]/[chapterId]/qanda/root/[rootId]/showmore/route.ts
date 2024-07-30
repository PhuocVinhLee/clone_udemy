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
  { params }: { params: { rootId: string } }
) {
  try {
    const { userId } = auth();
    const current_User = await currentUser();
    if (!userId) {
      return new NextResponse("UnAuthention in Update Chapter", {
        status: 401,
      });
    }
    const { rootId } = params;
    
    console.log(current_User);
    const isTeacher = current_User?.publicMetadata?.role === "teacher";

    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }
    const showMoreMessage = await QandA.find({
      root: false,
      rootId: rootId,
    }).sort({ createdAt: 1 }).populate('userId', 'username photo role') // Specify the fields you want to include from the Chapters model
    .populate('userIdReplay', 'username photo role').exec();
    if (!showMoreMessage) {
      return new NextResponse("ShowMoreMessage not found", { status: 401 });
    }

//console.log(".sort({ createdAt: 1 })",showMoreMessage )
    return NextResponse.json(showMoreMessage);
  } catch (error) {
    console.log("erorr in Update chapter", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
