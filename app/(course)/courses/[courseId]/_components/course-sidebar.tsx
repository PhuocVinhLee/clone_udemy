import { ChapterType } from "@/lib/database/models/chapters.model";
import { CourseType } from "@/lib/database/models/courses.model";
import Purchase from "@/lib/database/models/purchase.model";
import { UserProgressType } from "@/lib/database/models/userProgress.model";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

import CourseSidebarItem from "./course-sidebar-item";

interface CourseSidebarProps {
  course: CourseType & {
    chapters: (ChapterType & {
      userProgress: UserProgressType[] | null;
    })[];
  };
  progressCount: number;
}
function CourseSidebar({course, progressCount}: CourseSidebarProps) {
    const {userId} = auth();
    if(!userId) redirect("/");
    // get purcher bu userId and courseId
    const  purchase = null;

  return <div className=" h-full border-r flex flex-col overflow-y-auto shadow-sm">
    <div className=" p-8 flex flex-col border-b">
        <h1 className=" font-semibold">{course.title}</h1>

    </div>

    <div className="flex flex-col w-full">
        {course.chapters.map((chapter)=> (  
          <div>
           
            <CourseSidebarItem  key={chapter._id}  id={chapter._id} label={chapter.title} 
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted} courseId={course._id}
                isLocked = {!chapter.isFree && !purchase}
            />      
          </div>
          
        ))
        }

    </div>
  </div>;
}

export default CourseSidebar;
