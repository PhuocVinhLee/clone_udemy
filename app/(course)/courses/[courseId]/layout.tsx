import { getCourseWithChaptersAndUserProgres } from "@/lib/actions/courses.action";
import CourseSidebar from "./_components/course-sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseNavbar from "./_components/course-navbar";
import { getProgress } from "@/lib/actions/userprogress.action";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();
  if (!userId) redirect("/");

  const course = await getCourseWithChaptersAndUserProgres(userId, params.courseId);
  if (!course) redirect("/");
  const progressCount = await getProgress(params.courseId, userId);
  console.log("course nek ",course.chapters)


  return (
    <div className=" h-full">
      <div className=" h-[50px]  fixed inset-y-0 w-full z-50">
        
        <CourseNavbar
          course={course}
          progressCount={progressCount}
        ></CourseNavbar>
      </div>

      {/* <div className=" hidden md:flex  h-full w-80  flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div> */}

      <main className="  h-full pt-[50px] w-auto overflow-x-hidden"> {children}</main>
    </div>
  );
};

export default CourseLayout;
