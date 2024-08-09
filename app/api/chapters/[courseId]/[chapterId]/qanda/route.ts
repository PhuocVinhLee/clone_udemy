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
import { createNotification } from "@/lib/actions/notification.action";
import { pusherServer } from "@/lib/pusher";
import User from "@/lib/database/models/user.model";

export async function POST(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const { userId } = auth();
    const current_User = await currentUser();
    if (!userId) {
      return new NextResponse("UnAuthention in Update Chapter", {
        status: 401,
      });
    }
    const { chapterId, courseId } = params;
    const payload = await req.json();

    const isTeacher = current_User?.publicMetadata?.role === "teacher";

    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }
    const course = await Courses.findById(courseId);
    const userReplay = await User.findById(course.userId).select(
      "username role photo _id"
    );
    if (!course || !userReplay) {
      return new NextResponse("User replay or course not found", {
        status: 401,
      });
    }

    const DataQandA = {
      chapterId: chapterId,
      courseId: courseId,

      message: payload?.message,
      userId: user._id,

      root: true,
      createdAt: new Date(),
    };

    const message = await QandA.create(DataQandA);
    if (!message) {
      return new NextResponse("An  error  when create NotificationT ", {
        status: 500,
      });
    }
   

    if (user._id != course.userId.toHexString()) {
      const notification = await createNotification({
        userId: user._id,
        userIdReceve: course.userId,
        chapterId: chapterId,
        courseId: courseId,
        id_message: message._id,
        type: "NEW:QANDA",
        title: "New a question",
        message: payload?.message,
        createdAt: new Date(),
      });
      await pusherServer.trigger(
        userReplay.username,
        "notification:new",
        notification
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.log("erorr in Update chapter", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
