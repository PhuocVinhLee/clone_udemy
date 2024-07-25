import { getCourseWithChaptersAndQuestionAndUserProgres } from "@/lib/actions/courses.action";
import CourseSidebar from "./_components/course-sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseNavbar from "./_components/course-navbar";
import { getProgress } from "@/lib/actions/userprogress.action";
import { getPurchaseByUserIdAndCourseId } from "@/lib/actions/purchases.actions";
import { getQuestionsWithStudentStatus } from "@/lib/actions/questionchapter.action";
import { cn } from "@/lib/utils";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = await auth();
  if (!userId) return;
  // redirect("/");

  const course = await getCourseWithChaptersAndQuestionAndUserProgres(
    userId,
    params.courseId
  );
  console.log("course", course);
  //  if (!course) redirect("/");
  const progressCount = await getProgress(params.courseId, userId);

  const purchase = await getPurchaseByUserIdAndCourseId(
    params.courseId,
    userId
  );

  const questionsWithStudentStatus = await getQuestionsWithStudentStatus(
    params.chapterId,
    userId
  );
  console.log("questionsWithStudentStatus", questionsWithStudentStatus);
  return (
    <div className=" h-full">
      <div className="  h-[50px]  bg-white dark:bg-customDark z-[50] fixed inset-y-0 w-full ">
        <CourseNavbar
          purchase={purchase}
          course={course}
          progressCount={progressCount}
        ></CourseNavbar>
      </div>

      <div
        className= "md:flex hidden border-r h-full w-80 z-[51]  flex-col  fixed inset-y-0 "
      >
        <CourseSidebar
          purchase={purchase}
          course={course}
          progressCount={progressCount}
        />
      </div>

      <main className="  h-full pt-[50px] w-auto overflow-x-hidden">
        {" "}
        {children}
      </main>
    </div>
  );
};

export default CourseLayout;
