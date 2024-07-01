import { ChapterType } from "@/lib/database/models/chapters.model";
import { CourseType } from "@/lib/database/models/courses.model";
import Purchase from "@/lib/database/models/purchase.model";
import { UserProgressType } from "@/lib/database/models/userProgress.model";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { from } from "svix/dist/openapi/rxjsStub";
import CourseSidebarItem from "./course-sidebar-item";
import NavbarRoutes from "@/components/navbar-routes";
import CourseMoblieSidebar from "./course-moblie-sidebar";
import CourseMobileSidebar from "./course-moblie-sidebar";

interface CourseNavbarProps {
  course: CourseType & {
    chapters: (ChapterType & {
      userProgress: UserProgressType | null;
    })[];
  };
  progressCount: number;
}
function CourseNavbar({ course, progressCount }: CourseNavbarProps) {
  // const { userId } = auth();
  // if (!userId) return redirect("/");

  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
      ></CourseMobileSidebar>

      <NavbarRoutes></NavbarRoutes>
    </div>
  );
}

export default CourseNavbar;
