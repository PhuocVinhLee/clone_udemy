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


interface CourseNavbarProps {
  course: CourseType & {
    chapters: (ChapterType & {
      userProgress: UserProgressType | null;
    })[];
  };
  progressCount: number;
  purchase: any;
}
function CourseNavbar({ course, progressCount, purchase }: CourseNavbarProps) {
  // const { userId } = auth();
  // if (!userId) return redirect("/");
  const pathname = usePathname();

  return (
    <div className={cn(" md:pl-80 ")}>
      <div
        className={cn(
          "  bg-white dark:bg-customDark p-4 border-b   h-[50px] flex flex-row w-full items-center justify-between shadow-sm "
        )}
      >
        <div className=" flex items-center justify-between    ">
          <CourseMobileSidebar
            purchase={purchase}
            course={course}
            progressCount={progressCount}
          ></CourseMobileSidebar>
        </div>

        <div className=" ">
          <NavbarRoutes></NavbarRoutes>
        </div>
      </div>
    </div>
  );
}

export default CourseNavbar;
