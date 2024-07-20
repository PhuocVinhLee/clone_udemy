"use server";

import { getQuestionChapterById } from "@/lib/actions/questionchapter.action";
import PanelResize from "./_components/panel-resize";
import { auth } from "@clerk/nextjs/server";
import { getQuestionStudentByQuestionId } from "@/lib/actions/questionstudent.action";
import { redirect } from "next/navigation";


export default async function QuestionIdPage({
  params,
}: {
  params: { questionId: string; chapterId: string };
}) {
  const { userId } = auth();
  if(!userId){ redirect("/");}
  const question = await getQuestionChapterById(params?.questionId);
  const questionStudent = await getQuestionStudentByQuestionId(
    userId,
    params?.questionId
  );
  console.log("questionStudent in Page", questionStudent);

  return (
    <div className="w-full h-full overflow-hidden">
      <PanelResize questionStudent={questionStudent} question={question}></PanelResize>
    </div>
  );
}
