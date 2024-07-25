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

export async function POST(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const { userId, has } = auth();
    const current_User = await currentUser();
    const { chapterId, courseId } = params;
    const payload= await req.json();

    console.log(current_User)
    const canManage = has({ permission:"admin" });//org:member
    console.log(canManage)
    if (!userId) {
      return new NextResponse("UnAuthention in Update Chapter", {
        status: 401,
      });
    }

    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }

    const DataQandA = {
      chapterId: params.chapterId,
      name: current_User?.username,
      massage: "",
      userId: user._id,
      isTeacher: "",
      urlAvatar: current_User?.imageUrl,
      root: true,
      createdAt: new Date()
    };
 


   // const message = await QandA.create({});


  

    return NextResponse.json({a:"oke"});
  } catch (error) {
    console.log("erorr in Update chapter", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
