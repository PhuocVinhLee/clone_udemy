import { auth  } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  createChapter,
  getAllChapterByCourseId,
  updateArrayChapter,
  updateChapter,
} from "@/lib/actions/chapter.action";

export async function PATCH(
  req: Request,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { chapterId } = params;
    const payload = await req.json();
    console.log(payload);
    // const body = JSON.stringify(payload);
    console.log("userId in chpaer", userId)
    if (!userId) return new NextResponse("UnAuthention in Update Chapter", { status: 401 });
    const DataChapter = {
      courseId: payload.courseId,
      title: payload?.title,
      description: payload?.description,
      position: payload?.position,
      isPublished: payload?.isPublished,
      isFree: payload?.isFree,
    };

    const course = await updateChapter({
      chapter: DataChapter,
      userId,
      chapterId,
    });
    return NextResponse.json(course);
  } catch (error) {
    return new NextResponse("Inter Error", { status: 500 });
  }
}
