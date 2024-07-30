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

    const notifications = await QandA.find({ userIdReplay: user._id })
      .populate("userId", "_id username photo role")
      .populate("chapterId", "_id title videoUrl") // Specify the fields you want to include from the Chapters model
      .sort({ createdAt: -1 })
      .exec();

    console.log("notifications", notifications);
    return NextResponse.json(notifications);
  } catch (error) {
    console.log("erorr in Notifications", error);
    return new NextResponse("Inter Error Notifications", { status: 500 });
  }
}
