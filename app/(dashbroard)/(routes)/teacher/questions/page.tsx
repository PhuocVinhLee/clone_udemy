import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { ActionGetAllCoursesByUserId } from "@/lib/actions/courses.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SearchInput from "@/components/search-input";
import Categories from "../../search/_components/Categories";
import { getAllCategory } from "@/lib/actions/categorys.action";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
    return null;
  }

  const ArrayCourse = await ActionGetAllCoursesByUserId(userId);
  if (!ArrayCourse) {
    redirect("/");
    return null;
  }
  const ArrCategories = await getAllCategory();



  return (
    <div className="p-6">
      <div className=" md:hidden md:mb-0 block mb-6">
        <SearchInput ></SearchInput>
      </div>
      <Categories items={ArrCategories}></Categories>
      <DataTable columns={columns} data={ArrayCourse} />
    </div>
  );
};

export default CoursesPage;
