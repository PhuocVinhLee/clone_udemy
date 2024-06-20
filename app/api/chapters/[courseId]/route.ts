import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  createChapter,
  getAllChapterByCourseId,
  updateArrayChapter,
  getChapterHasEndPosition
} from "@/lib/actions/chapter.action";

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

    //const allChapters: any[] = await getAllChapterByCourseId(courseId);
    //Product.findOne().sort({ best: -1 }).exec()
    const chapterEndPosition = await getChapterHasEndPosition(courseId);

    const position = chapterEndPosition ? chapterEndPosition.position  + 1: 1;

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
export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } =  auth();
    const { courseId } = params;
    const { arrayChapter } = await req.json();
    if (!userId) {
      return new NextResponse("Anauthorrided Error", { status: 401 });
    }

    const respon = await updateArrayChapter({
      userId,
      courseId,
      arrayChapter: arrayChapter,
    });
    console.log("after userId1", userId);
    return NextResponse.json(respon);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
