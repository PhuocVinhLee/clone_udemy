import CoursesList from "@/components/courses-list";
import { Button } from "@/components/ui/button";
import { getDashboarhCourses } from "@/lib/actions/courses.action";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CheckCheckIcon, CheckCircle, Clock } from "lucide-react";

import Image from "next/image";
import { redirect } from "next/navigation";
import InforCard from "./_components/infor-card";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  const  {coursesInProgress,completedCourses} = await getDashboarhCourses(userId);
  console.log("coursesInProgress",coursesInProgress)
  console.log("completedCourses",completedCourses)
  return (
    <div className="p-6 space-y-4">

      <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">

      <InforCard icon={Clock} label="In Progress" numberOfItems={coursesInProgress?.length}>

      </InforCard>
      <InforCard icon={CheckCircle} label="Completed" numberOfItems={completedCourses?.length} variant="succes">

      </InforCard>
      </div>

      <CoursesList items={[...coursesInProgress,...completedCourses]}></CoursesList>
    </div>
  );
}
