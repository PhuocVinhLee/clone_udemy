import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import {
 
  getAllChapterByCourseId,
 



} from "@/lib/actions/chapter.action";

import { getUserById } from "@/lib/actions/user.actions";
import Courses from "@/lib/database/models/courses.model";

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

  
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }

    const course = await Courses.findById(courseId);

    if (!course || course?.userId.toHexString() !== user._id) {
      throw new Error("Unauthorized or Course not found");
    }

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
      isPublished: isPublished,
    };
    const updatedCourse = await Courses.findByIdAndUpdate(
      course._id,
      DataCourse,
      {
        new: false,
      }
    );

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.log("erorr in Update chapter", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
