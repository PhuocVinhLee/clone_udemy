import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  createChapter,
  getAllChapterByCourseId,
  updateArrayChapter,
} from "@/lib/actions/chapter.action";


export async function POST(req: Request) {
  try {
    const { userId }: { userId: string | null } = auth();
    const { title, courseId } = await req.json();
    if (!userId) {
      return new NextResponse("Anauthorrided Error", { status: 401 });
    }
    const allChapters: any[] = await getAllChapterByCourseId(courseId);
    const position = allChapters ? allChapters.length : 1;

    const chapter = await createChapter({
      courseId,
      title,
      position,
    });
    return NextResponse.json(chapter);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const { userId } =  await auth();
    console.log("userId1",userId)
    const { arrayChapter, courseId } = await req.json();
    if (!userId) {
      return new NextResponse("Anauthorrided Error", { status: 401 });
    }
   
    const respon = await updateArrayChapter({
      userId,
      courseId,
      arrayChapter: arrayChapter,
    });
    console.log("after userId1",userId)
    return NextResponse.json(respon);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
