import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {

  getAllChapterByCourseId,
 
  
} from "@/lib/actions/chapter.action";
import { connectToDatabase } from "@/lib/database/mongoose";
import Chapters from "@/lib/database/models/chapters.model";
import Courses from "@/lib/database/models/courses.model";
import { getUserById } from "@/lib/actions/user.actions";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId }: { userId: string | null } = auth();
    const { courseId } = params;
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Anauthorrided Error", { status: 401 });
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

    const chapterEndPosition = await Chapters.findOne({ courseId: courseId })
      .sort({ position: -1 })
      .exec();
    const position = chapterEndPosition ? chapterEndPosition.position + 1 : 0;
    const chapterData = {
      courseId,
      title,
      position,
    };

    const newChapter = await Chapters.create(chapterData); // { userId: 1233; title: test;}

    return NextResponse.json(newChapter);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { arrayChapter } = await req.json();
    if (!userId) {
      return new NextResponse("Anauthorrided Error", { status: 401 });
    }
    await connectToDatabase();

    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }
    const coursToUpdate = await Courses.findById(courseId);

    if (!coursToUpdate || coursToUpdate?.userId.toHexString() !== user._id) {
      throw new Error("Unauthorized or Course not found");
    }
    for (const chapter of arrayChapter) {
      const updatedChapter = await Chapters.findByIdAndUpdate(
        chapter._id,
        { position: chapter.position },
        {
          new: false,
        }
      );
    }
    return NextResponse.json(coursToUpdate);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
