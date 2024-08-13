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

import { getUserById } from "@/lib/actions/user.actions";
import QandA from "@/lib/database/models/qanda.model";
import Notification from "@/lib/database/models/notification .model";
import Chapters from "@/lib/database/models/chapters.model";


export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthention", {
        status: 401,
      });
    }

    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }
    

    const notifications = await Notification.find({ userIdReceve: user._id })
      .populate("userId", "_id username photo role")
      .populate({ path: 'chapterId', select: '_id title videoUrl', model: Chapters })
      .populate({ path: 'courseId', select: '_id title imageUrl', model: Courses })
      .sort({ createdAt: -1 })
      .exec();

   
    return NextResponse.json(notifications);
  } catch (error) {
    console.log("erorr in Notifications", error);
    return new NextResponse("Inter Error Notifications", { status: 500 });
  }
}
