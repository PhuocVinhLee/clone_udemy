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

export async function PATCH(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { isPublished } = await req.json();

    console.log("userId in chapter", userId);
    if (!userId) {
      return new NextResponse("UnAuthention in Update Chapter", {
        status: 401,
      });
    }

    const course = await getCoursById(courseId);
    if (!course) {
      return new NextResponse("UnAuthention in Update Chapter", {
        status: 401,
      });
    }
    console.log("csacasc", course);

    const chapterArray = await getAllChapterByCourseId(courseId);
    console.log("chapterArray", chapterArray);

    const hasPublishedChapter = chapterArray?.some((ct: any) => ct.isPublished);

    if (
      isPublished &&
      (!course.title ||
        !course.description ||
        !course.imageUrl ||
        !course.categoryId ||
        !hasPublishedChapter)
    ) {
      return new NextResponse("Missing required fields", {
        status: 400,
      });
    }

    const DataCourse = {
      courseId: params.courseId,
      isPublished: isPublished,
    };

    const chapterUpdated = await updateCourse({
      course: DataCourse,
      userId,
    });

    return NextResponse.json(chapterUpdated);
  } catch (error) {
    console.log("erorr in Update chapter", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
