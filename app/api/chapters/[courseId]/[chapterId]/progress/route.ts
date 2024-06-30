import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCoursById, updateCourse } from "@/lib/actions/courses.action";
import {
  createChapter,
  getAllChapterByCourseId,
  updateArrayChapter,
  updateChapter,
  deleteChapter,
  getChapterById,
} from "@/lib/actions/chapter.action";
import {
  createMuxdata,
  deleteMuxdataByChapterId,
  deleteMuxdta,
  getMuxdataByChapterId,
} from "@/lib/actions/muxdata.action";
import Mux from "@mux/mux-node";
import Courses from "@/lib/database/models/courses.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import Chapters from "@/lib/database/models/chapters.model";
import { getUserById } from "@/lib/actions/user.actions";
import UserProgress from "@/lib/database/models/userProgress.model";
import mongoose from "mongoose";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PUT(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const { userId } = auth();
    const { chapterId, courseId } = params;

    const { isCompleted } = await req.json();

    console.log("userId in chapter", userId);
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

    const courseToUpdate = await Courses.findById(courseId);

    if (!courseToUpdate || courseToUpdate?.userId.toHexString() !== user._id) {
      throw new Error("Unauthorized or Course not found");
    }

    const filter = {
      userId: new mongoose.Types.ObjectId(user._id),
      chapterId: new mongoose.Types.ObjectId(chapterId),
    };
    const update = { isCompleted: isCompleted, updatedAt: new Date() };

    const options = { new: true, upsert: true, setDefaultsOnInsert: true };

    const result = await UserProgress.findOneAndUpdate(
      filter,
      update,
      options
    ).exec();

    return NextResponse.json(result);
  } catch (error) {
    console.log("erorr in Update Progress", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
