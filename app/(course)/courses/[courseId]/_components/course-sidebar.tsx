import { ChapterType } from "@/lib/database/models/chapters.model";
import { CourseType } from "@/lib/database/models/courses.model";
import Purchase from "@/lib/database/models/purchase.model";
import { UserProgressType } from "@/lib/database/models/userProgress.model";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { useId } from "react";

import CourseSidebarItem from "./course-sidebar-item";
import { getPurchaseByUserIdAndCourseId } from "@/lib/actions/purchases.actions";
import CourseProgress from "@/components/course-progress";

interface CourseSidebarProps {
  course: CourseType & {
    chapters: (ChapterType & {
      userProgress: UserProgressType | null;
    })[];
  };
  progressCount: number;
}
async function CourseSidebar({ course, progressCount }: CourseSidebarProps) {
  
  const { userId } = auth();
  if (!userId) redirect("/");
  // get purcher bu userId and courseId
  const purchase = await getPurchaseByUserIdAndCourseId( course._id, userId);
  console.log("purchase 1",purchase)

  return (
    <div className=" h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className=" p-8 flex flex-col border-b">
        <h1 className=" font-semibold">{course.title}</h1>

        {
          purchase && (
            <div className="mt-10">
              {/* {progressCount} */}
              <CourseProgress variant="success" 
              value={progressCount} size="sm">

              </CourseProgress>

            </div>
          )
        }
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
          />
        ))}
      </div>
    </div>
  );
}

export default CourseSidebar;
