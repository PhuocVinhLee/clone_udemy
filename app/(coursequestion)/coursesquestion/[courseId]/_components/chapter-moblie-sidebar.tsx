"use client";
import { ChapterType } from "@/lib/database/models/chapters.model";
import { CourseType } from "@/lib/database/models/courses.model";
import { UserProgressType } from "@/lib/database/models/userProgress.model";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ChapterSidebar from "./chapter-sidebar";
import { Menu } from "lucide-react";
import Purchase from "@/lib/database/models/purchase.model";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";

interface ChapterMobileSidebarProps {
  courseId: string;
  chapter: ChapterType;
  progressCount: number;
  purchase: any;
  questionChapterWithStaus: (QuestionChapterType & { isCorrect: boolean; id_questionstudents: string ; flag: boolean})[];
}

const ChapterMobileSidebar = ({
  courseId,
  chapter,
  progressCount,
  purchase,
  questionChapterWithStaus
}: ChapterMobileSidebarProps) => {
  const pathname = usePathname();
  const isQuestion = pathname?.includes("/questions");
  return (
    <Sheet>
      <SheetTrigger
        className={cn( " pr-4 hover:opacity-75 transition ",
          !isQuestion && " md:hidden ",
          isQuestion && "block"
        )}
        // className={cn( "  pr-4 hover:opacity-75 transition",
       
         
        // )}
      >
        <Menu></Menu>
      </SheetTrigger>
      <SheetContent side="left" className="p-0  w-80">
       
      <ChapterSidebar
        questionChapterWithStaus={questionChapterWithStaus}
        purchase={purchase}
        chapter={chapter}
      courseId={courseId}
      />
      </SheetContent>
    </Sheet>
  );
};

export default ChapterMobileSidebar;
