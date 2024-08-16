import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { ActionGetAllCoursesByUserId } from "@/lib/actions/courses.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const UsersPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const ArrayCourse = await ActionGetAllCoursesByUserId(userId);
  if (!ArrayCourse) {
    redirect("/");
  }

  return (
    <div className="p-6">
      <DataTable
        options={ArrayCourse?.map((course: { title: string; _id: string }) => ({
          label: course.title,
          value: course._id,
        }))}
        columns={columns}
        courses={ArrayCourse}
      />
    </div>
  );
};

export default UsersPage;
