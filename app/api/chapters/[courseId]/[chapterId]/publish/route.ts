import { auth } from "@clerk/nextjs/server";

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

export async function PATCH(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const { userId } = auth();
    const { chapterId, courseId } = params;
    const { isPublished } = await req.json();

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

    const Muxdata = await getMuxdataByChapterId(chapterId);
    const chapter = await Chapters.findById(chapterId);

    if (
      isPublished &&
      (!chapter ||
        !Muxdata ||
        !chapter.title ||
        !chapter.description ||
        !chapter.videoUrl)
    ) {
      return new NextResponse("Missing required fields", {
        status: 400,
      });
    }
    

    const DataChapter = {
      courseId: params.courseId,
      isPublished: isPublished,
    };

    const updatedChapter = await Chapters.findByIdAndUpdate(
      chapterId,
      DataChapter,
      {
        new: false,
      }
    );

    if (!isPublished) {
      const chapterOfCourse = await Chapters.find({
        courseId: courseId,
        isPublished: true,
      })
      console.log("chapterOfCourse", chapterOfCourse)
      if (!chapterOfCourse.length) {
        await Courses.findByIdAndUpdate(courseId, { isPublished: false });
      }
    }
    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.log("erorr in Update chapter", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
