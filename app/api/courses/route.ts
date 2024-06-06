import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createCourses } from "@/lib/actions/courses.action";
import { useId } from "react";

export async function POST(req: Request) {
  try {
   
    const { userId } : { userId: string | null } = auth();
    const { title } = await req.json();
    if (!userId) {
      return new NextResponse("Anauthorrided Error", { status: 401 });
    }
    const course = await createCourses({
      userId,
      title,
    });
    return NextResponse.json(course);
 
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal Error", { status: 500 });
  }
}
