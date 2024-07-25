"use client";
import { ChapterType } from "@/lib/database/models/chapters.model";
import { CourseType } from "@/lib/database/models/courses.model";
import Purchase from "@/lib/database/models/purchase.model";
import { UserProgressType } from "@/lib/database/models/userProgress.model";
// import { auth } from "@clerk/nextjs/server";
import { redirect, usePathname } from "next/navigation";

import QuestionSidebaItem from "./question-sidebar-item";
import { getPurchaseByUserIdAndCourseId } from "@/lib/actions/purchases.actions";
import CourseProgress from "@/components/course-progress";
import { cn } from "@/lib/utils";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";

interface ChapterSidebarProps {
  chapter: ChapterType;
  courseId: string;
  purchase: any;
  

  questionChapterWithStaus: (QuestionChapterType & { isCorrect: boolean; id_questionstudents: string ; flag: boolean})[];
}
function ChapterSidebar({
  courseId,
  chapter,
  questionChapterWithStaus,
}: ChapterSidebarProps) {
  // const { userId } = auth();
  // if (!userId) redirect("/");
  // get purcher bu userId and courseId
  const pathname = usePathname();
  const isQuestion = pathname?.includes("/questions");

  return (
    <div
      className={cn(
      "flex",
        " h-full w-80   flex-col  fixed inset-y-0 "
      )}
    >
      <div
        className={cn(
          "  h-full border-r flex flex-col overflow-y-auto shadow-sm"
        )}
      >
        <div className=" p-8 flex flex-col border-b">
          <h1 className=" font-semibold ">{chapter.title}</h1>
        </div>

        <div className="flex flex-col w-full">
         {questionChapterWithStaus?.map((question)=>{
          return (
            <QuestionSidebaItem
            key={question._id}
            id={question._id}
            title={question.title}
            isCorrect={question.isCorrect}
            courseId={courseId}
            chapterId={chapter._id}
            level={question.level}
            id_questionstudents={question?.id_questionstudents}
            flag={question.flag}
          
          />
          )
         })}
        </div>
      </div>
    </div>
  );
}

export default ChapterSidebar;
