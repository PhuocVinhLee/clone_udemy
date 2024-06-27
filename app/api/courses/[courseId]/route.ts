import { updateCourse } from "@/lib/actions/courses.action";
import { getUserById } from "@/lib/actions/user.actions";
import Categorys from "@/lib/database/models/categorys.model";
import Courses from "@/lib/database/models/courses.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const payload = await req.json();

    if (!userId) return new NextResponse("UnAuthention", { status: 401 });
    await connectToDatabase();

    const user = await getUserById(userId); 
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }

    const courseToUpdate = await Courses.findById(courseId);

    if (!courseToUpdate || courseToUpdate?.userId.toHexString() !== user._id) {
      throw new Error("Unauthorized or Course not found");
    }
    const dataCourse = {
      title: payload?.title,
      description: payload?.description,
      imageUrl: payload?.imageUrl,
      categoryId: payload?.categoryId,
      price: payload?.price,
    };

    const CourseUpdated = await Courses.findByIdAndUpdate(
      courseId,
      dataCourse,
      {
        new: false,
      }
    );
    return NextResponse.json(CourseUpdated);
  } catch (error) {
    console.log(error)
    return new NextResponse("Inter Error", { status: 500 });
  }
}
