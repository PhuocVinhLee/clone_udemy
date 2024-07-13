import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import {
  getAllChapterByCourseId,
 
} from "@/lib/actions/chapter.action";
import {
  createMuxdata,
  deleteMuxdataByChapterId,
  deleteMuxdta,
} from "@/lib/actions/muxdata.action";
import Mux from "@mux/mux-node";

import { connectToDatabase } from "@/lib/database/mongoose";
import Courses from "@/lib/database/models/courses.model";
import Chapters from "@/lib/database/models/chapters.model";
import { getUserById } from "@/lib/actions/user.actions";
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
// dont use 
export async function DELETE(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
  
    const { userId } = auth();
    if (!userId)
      return new NextResponse("UnAuthention in Update Chapter", {
        status: 401,
      });

    const { chapterId } = params;
    const chapterDeleted = await Chapters.findByIdAndDelete(chapterId);

  
    if (!chapterDeleted) {
      return new NextResponse("Some thing went wrong", { status: 401 });
    }

    console.log("chapterDeleted", chapterDeleted);
    if (chapterDeleted && chapterDeleted.videoUrl) {
      const muxdataDeleted = await deleteMuxdta(chapterId);
      console.log("muxdataDeleted", muxdataDeleted);

      if (muxdataDeleted && muxdataDeleted.assertId) {
        await mux.video.assets.delete(muxdataDeleted.assertId);
      }
    }
   
    // find allchapter => check this course has any chapter to publish
    const allChapterByCourseId = await getAllChapterByCourseId(
      params?.courseId
    );
    if (!allChapterByCourseId?.length) {
      
      const DataCourse = {
        isPublished: false,
      };
      const updatedCourse = await Courses.findByIdAndUpdate(
        params?.courseId,
        DataCourse,
        {
          new: false,
        }
      );
    }

    console.log("End delete chapter\n");
    console.log(params?.courseId);

    try {
      
    } catch (err) {
      console.error("Error revalidating path:", err);
      return new NextResponse("'Error revalidating path'", { status: 500 });
    }
    return NextResponse.json(chapterDeleted);
  } catch (error) {
    console.log("An error in Delete Chapter out", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const { userId } = auth();
    const { chapterId, courseId } = params;
    const payload = await req.json();
    if (!userId)
      return new NextResponse("UnAuthention in Update Chapter", {
        status: 401,
      });
    await connectToDatabase();

    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }

    const courseToUpdate = await Courses.findById(courseId);

    if (!courseToUpdate || courseToUpdate?.userId.toHexString() !== user._id) {
      throw new Error("Unauthorized or Course not found");
    }

    const DataChapter = {
      courseId: courseId,
      title: payload?.title,
      description: payload?.description,
      videoUrl: payload.videoUrl,
      position: payload?.position,
      isPublished: payload?.isPublished,
      isFree: payload?.isFree,
    };
    if (DataChapter.videoUrl) {
      const MuxDeleted = await deleteMuxdataByChapterId(chapterId);

      if (MuxDeleted) {
        await mux.video.assets.delete(MuxDeleted.assertId);
      }

      const asset = await mux.video.assets.create({
        input: DataChapter.videoUrl,
        playback_policy: ["public"],
        test: false,
      });
      if (asset.id) {
        await createMuxdata({
          assertId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
          chapterId,
        });
      }
    }
    const updatedChapter = await Chapters.findByIdAndUpdate(
      chapterId,
      DataChapter,
      {
        new: false,
      }
    );

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.log("erorr in Update chapter :", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
