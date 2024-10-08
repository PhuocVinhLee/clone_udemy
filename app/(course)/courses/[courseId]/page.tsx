
import { getCourseWithChapters } from "@/lib/actions/courses.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const CourseIdPage =  async({params}: {params:{courseId: string}}) => {
  // const {userId} = auth();
  // if(!userId) return redirect("/");

  const course = await getCourseWithChapters(params.courseId)
  

  if(!course || !course.chapters[0]._id) return redirect("/");
  return  redirect(`/courses/${course._id}/chapters/${course.chapters[0]._id}/overview`)
}

export default CourseIdPage