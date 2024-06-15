import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import {
  createChapter,
  getAllChapterByCourseId,
  updateArrayChapter,
  updateChapter,
} from "@/lib/actions/chapter.action";
import {
  createMuxdata,
  deleteMuxdataByChapterId,
} from "@/lib/actions/muxdata.action";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
  req: Request,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { chapterId } = params;
    const payload = await req.json();

    console.log("userId in chpaer", userId);
    if (!userId)
      return new NextResponse("UnAuthention in Update Chapter", {
        status: 401,
      });
    const DataChapter = {
      courseId: payload.courseId,
      title: payload?.title,
      description: payload?.description,
      videoUrl: payload.videoUrl,
      position: payload?.position,
      isPublished: payload?.isPublished,
      isFree: payload?.isFree,
    };
    if (DataChapter.videoUrl) {
      const MuxDeleted = await deleteMuxdataByChapterId(chapterId);
      console.log("MuxDeleted",MuxDeleted)
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

    const chapter = await updateChapter({
      chapter: DataChapter,
      userId,
      chapterId,
    });
    return NextResponse.json(chapter);
  } catch (error) {
    console.log("erorr in Update chapter",error)
    return new NextResponse("Inter Error", { status: 500 });
  }
}
