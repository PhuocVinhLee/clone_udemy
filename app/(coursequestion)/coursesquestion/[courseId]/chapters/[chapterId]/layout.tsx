import { getCourseWithChaptersAndQuestionAndUserProgres } from "@/lib/actions/courses.action";
import CourseSidebar from "../../_components/chapter-sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChapterNavbar from "../../_components/chapter-navbar";
import { getProgress } from "@/lib/actions/userprogress.action";
import { getPurchaseByUserIdAndCourseId } from "@/lib/actions/purchases.actions";
import { getQuestionsWithStudentStatus } from "@/lib/actions/questionchapter.action";
import { getChapterById } from "@/lib/actions/chapter.action";

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
  const chapter = await getChapterById(params.chapterId);

  const questionsWithStudentStatus = await getQuestionsWithStudentStatus(
    params.chapterId,
    userId
  );
  console.log("questionsWithStudentStatus", questionsWithStudentStatus);
  return (
    <div className=" h-full">
      <div className="  h-[50px]  fixed inset-y-0 w-full ">
        <ChapterNavbar
          courseId={params.courseId}
          chapter={chapter}
          purchase={purchase}
          progressCount={progressCount}
          questionChapterWithStaus={questionsWithStudentStatus}
        ></ChapterNavbar>
      </div>

      <main className="  h-full pt-[50px] w-auto overflow-x-hidden">
        {" "}
        {children}
      </main>
    </div>
  );
};

export default CourseLayout;
