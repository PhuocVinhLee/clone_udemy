import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { ActionGetAllChapterByUserId } from "@/lib/actions/courses.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
    return null;
  }
  
  const ArrayCourse = await ActionGetAllChapterByUserId(userId);
  if (!ArrayCourse) {
    redirect("/");
    return null;
  }

  return (
    <div className="p-6">
      <DataTable columns={columns} data={ArrayCourse} />
    </div>
  );
};

export default CoursesPage;
