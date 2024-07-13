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
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

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
    <div className="p-4 border-b h-full flex items-center justify-between  bg-white shadow-sm">

      <div className=" flex items-center justify-between   border  border-blue-600 ">
        <CourseMobileSidebar
          course={course}
          progressCount={progressCount}
        ></CourseMobileSidebar>

        <div className="flex gap-x-2">
          <Button size="sm">Previous</Button>
          <Button size="sm">1</Button>
          <Button size="sm">Next</Button>
          <div>
            <Button size="sm">
              <Flag></Flag>
            </Button>
          </div>
        </div>
      </div>

      <div className= " flex gap-x-2">
Chapter:
        <h4>Khoa hoc node js Viet Nam</h4>
      </div>
      <div className="">
      <NavbarRoutes></NavbarRoutes>
      </div>
    </div>
  );
}

export default CourseNavbar;
