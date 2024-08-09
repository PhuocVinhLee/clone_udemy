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
import Reviews from "@/lib/database/models/review.model";
import Purchase from "@/lib/database/models/purchase.model";
import { pusherServer } from "@/lib/pusher";
import User from "@/lib/database/models/user.model";
import { createNotification } from "@/lib/actions/notification.action";

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
    const checkMessageExist = await Reviews.findOne({
      userId: user._id,
      chapterId: chapterId,
    });
    const checkPurchase = await Purchase.findOne({
      userId: user._id,
      courseId: courseId,
    });
    const course =  await Courses.findById(courseId)
    if (!checkMessageExist || !checkPurchase) {
      return new NextResponse("You should just have only review!", {
        status: 401,
      });
    }
    

    const DataReview = {
      chapterId: chapterId,
      courseId: courseId,

      message: payload?.message,
      userId: user._id,
      starRating: payload?.starRating,
      root: true,
      createdAt: new Date(),
    };
 

    const message = await Reviews.create(DataReview);

    const userReplay = await User.findById(course.userId).select(
      "username role photo _id"
    );
    const notification = await createNotification({
      userId: user._id,
      userIdReceve: course.userId,
      chapterId: chapterId,
      courseId: courseId,
      id_message: message._id,
      type: "NEW:REVIEW",
      title: "New a review",
      message: payload?.message,
      createdAt: new Date(),
    });
     pusherServer.trigger(
      userReplay.username,
      "notification:new",
      notification
    );
    return NextResponse.json(message);
  } catch (error) {
    console.log("erorr in create Review", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
