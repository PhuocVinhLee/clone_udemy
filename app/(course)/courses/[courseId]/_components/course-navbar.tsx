"use client";
import { ChapterType } from "@/lib/database/models/chapters.model";
import { CourseType } from "@/lib/database/models/courses.model";
import Purchase from "@/lib/database/models/purchase.model";
import { UserProgressType } from "@/lib/database/models/userProgress.model";

// import {  usePathname } from "next/navigation";
import React from "react";

import CourseSidebarItem from "./course-sidebar-item";
import NavbarRoutes from "@/components/navbar-routes";

import CourseMobileSidebar from "./course-moblie-sidebar";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";
import ActionQuestion from "./action-question";

interface CourseNavbarProps {
  course: CourseType & {
    chapters: (ChapterType & {
      userProgress: UserProgressType | null;
    } & { questions: QuestionChapterType[] })[];
  };
  progressCount: number;
  purchase: any;
}
function CourseNavbar({ course, progressCount, purchase }: CourseNavbarProps) {
  // const { userId } = auth();
  // if (!userId) return redirect("/");
  const pathname = usePathname();
  const isQuestion = pathname?.includes("/questions");
  // const isChapter = pathname?.includes();
  const pathSegments = pathname?.split("/");
  const chapterId = pathSegments ? pathSegments[pathSegments.length - 3] : null;
  const chapter = course?.chapters?.find((chapter) => {
    return chapter?._id === chapterId;
  });
  console.log("chapter", chapter);

  return (
    <div className={cn(!isQuestion && " md:pl-80 ")}>
      <div
        className={cn(
          " p-4 border-b  h-[50px] flex flex-row w-full items-center justify-between  bg-white shadow-sm "
        )}
      >
        <div className=" flex items-center justify-between    ">
          <CourseMobileSidebar
            purchase={purchase}
            course={course}
            progressCount={progressCount}
          ></CourseMobileSidebar>

          <ActionQuestion
          courseId={course._id} chapterId={chapter?._id}
            questions={chapter?.questions ? chapter?.questions : []}
          ></ActionQuestion>
        </div>

        <div className={cn("  hidden gap-x-2", isQuestion && "flex")}>
          <h4 className=" font-bold">{chapter?.title}</h4>
        </div>

        <div className=" ">
          <NavbarRoutes></NavbarRoutes>
        </div>
      </div>
    </div>
  );
}

export default CourseNavbar;
