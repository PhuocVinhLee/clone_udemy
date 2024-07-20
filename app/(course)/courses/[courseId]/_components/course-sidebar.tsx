"use client";
import { ChapterType } from "@/lib/database/models/chapters.model";
import { CourseType } from "@/lib/database/models/courses.model";
import Purchase from "@/lib/database/models/purchase.model";
import { UserProgressType } from "@/lib/database/models/userProgress.model";
// import { auth } from "@clerk/nextjs/server";
import { redirect, usePathname } from "next/navigation";

import CourseSidebarItem from "./course-sidebar-item";
import { getPurchaseByUserIdAndCourseId } from "@/lib/actions/purchases.actions";
import CourseProgress from "@/components/course-progress";
import { cn } from "@/lib/utils";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";

interface CourseSidebarProps {
  course: CourseType & {
    chapters: (ChapterType & {
      userProgress: UserProgressType | null;
    } & { questions: QuestionChapterType[] } )[];
  };
  purchase: any;
  progressCount: number;
  mode?: boolean | null;
}
function CourseSidebar({
  course,
  progressCount,
  purchase,
  mode,
}: CourseSidebarProps) {
  // const { userId } = auth();
  // if (!userId) redirect("/");
  // get purcher bu userId and courseId
  const pathname = usePathname();
  const isQuestion = pathname?.includes("/questions");

  console.log("mode", mode);
  return (
    <div
      className={cn(
        " hidden",
        !isQuestion && "md:flex hidden",
        " h-full w-80  border border-red-400 flex-col  fixed inset-y-0 "
      )}
    >
      <div
        className={cn(
          "  h-full border-r flex flex-col overflow-y-auto shadow-sm"
        )}
      >
        <div className=" p-8 flex flex-col border-b">
          <h1 className=" font-semibold border ">{course.title}</h1>

          {purchase && (
            <div className="mt-10">
              {/* {progressCount} */}
              <CourseProgress
                variant="success"
                value={progressCount}
                size="sm"
              ></CourseProgress>
            </div>
          )}
        </div>

        <div className="flex flex-col w-full">
          {course.chapters.map((chapter) => (
            <CourseSidebarItem
              key={chapter._id}
              id={chapter._id}
              label={chapter.title}
              isCompleted={!!chapter?.userProgress?.isCompleted}
              courseId={course._id}
              isLocked={!chapter.isFree && !purchase}
              questions={chapter?.questions}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseSidebar;
