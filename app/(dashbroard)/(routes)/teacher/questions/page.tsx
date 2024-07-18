
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SearchInput from "@/components/search-input";
import Categories from "../../search/_components/Categories";
import { getAllCategory } from "@/lib/actions/categorys.action";
import { ActionAllQuestionByUserId } from "@/lib/actions/question.action";

const QuestionPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
    return null;
  }

  const AllQuestion = await ActionAllQuestionByUserId(userId);

console.log("All question",AllQuestion)


  return (
    <div className="p-6">
      {/* <div className=" md:hidden md:mb-0 block mb-6">
        <SearchInput ></SearchInput>
      </div>
      <Categories items={ArrCategories}></Categories> */}
      <DataTable columns={columns} data={AllQuestion} />
    </div>
  );
};

export default QuestionPage;
