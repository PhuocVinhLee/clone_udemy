"use client";
import { ChapterType } from "@/lib/database/models/chapters.model";
import { CourseType } from "@/lib/database/models/courses.model";
import Purchase from "@/lib/database/models/purchase.model";
import { UserProgressType } from "@/lib/database/models/userProgress.model";

// import {  usePathname } from "next/navigation";
import React from "react";

import CourseSidebarItem from "./question-sidebar-item";
import NavbarRoutes from "@/components/navbar-routes";

import ChapterMobileSidebar from "./chapter-moblie-sidebar";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";
import ActionQuestion from "./action-question";
import Link from "next/link";

interface ChapterNavbarProps {
  courseId: string;
  chapter: ChapterType;
  progressCount: number;
  purchase: any;
  questionChapterWithStaus: (QuestionChapterType & { isCorrect: boolean ; id_questionstudents: string; flag: boolean})[];
}
function ChapterNavbar({
  courseId,
  chapter,
  progressCount,
  purchase,
  questionChapterWithStaus,
}: ChapterNavbarProps) {
  // const { userId } = auth();
  // if (!userId) return redirect("/");
  const pathname = usePathname();

  console.log("chapter", chapter);

  return (
    <div>
      <div
        className={cn(
          "   p-4 border-b  h-[50px] flex flex-row w-full items-center justify-between shadow-sm "
        )}
      >
        <div className=" flex items-center justify-between    ">
          <ChapterMobileSidebar
            questionChapterWithStaus={questionChapterWithStaus}
            purchase={purchase}
            chapter={chapter}
            progressCount={progressCount}
            courseId={courseId}
          ></ChapterMobileSidebar>

          <ActionQuestion
            questionChapterWithStaus={questionChapterWithStaus}
            courseId={courseId}
            chapterId={chapter?._id}
          ></ActionQuestion>

          <Button className="ms-2" size="sm" variant="outline">
           <Link href={`/courses/${courseId}/chapters/${chapter._id}`}> Go back</Link>
          </Button>
        </div>

        <div className=" ">
          <NavbarRoutes></NavbarRoutes>
        </div>
      </div>
    </div>
  );
}

export default ChapterNavbar;
