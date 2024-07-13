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

interface CourseMoblieSidebarProps {
  course: CourseType & {
    chapters: (ChapterType & {
      userProgress: UserProgressType | null;
    })[];
  };
  progressCount: number;
}

const CourseMobileSidebar = ({
  course,
  progressCount,
}: CourseMoblieSidebarProps) => {
  
  return (
    <Sheet>
      <SheetTrigger className="  pr-4 hover:opacity-75 transition">
        <Menu></Menu>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar
          course={course}
          progressCount={progressCount}
        ></CourseSidebar>
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
