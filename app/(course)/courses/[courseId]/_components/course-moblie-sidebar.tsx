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
import CourseSidebar from "./course-sidebar";
import { Menu } from "lucide-react";
import Purchase from "@/lib/database/models/purchase.model";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import CourseSidebarQuestion from "./course-sidebar-question";

interface CourseMoblieSidebarProps {
  course: CourseType & {
    chapters: (ChapterType & {
      userProgress: UserProgressType | null;
    } & { questions: QuestionChapterType[] })[];
  };
  progressCount: number;
  purchase: any;
}

const CourseMobileSidebar = ({
  course,
  progressCount,
  purchase,
}: CourseMoblieSidebarProps) => {
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
      <SheetContent side="left" className="p-0 bg-white w-80">
       
      <CourseSidebarQuestion
          purchase={purchase}
          course={course}
          progressCount={progressCount}
          
        ></CourseSidebarQuestion>
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
