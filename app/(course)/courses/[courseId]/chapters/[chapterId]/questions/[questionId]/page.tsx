"use server";

import { getQuestionById } from "@/lib/actions/question.action";
import PanelResize from "./_components/panel-resize";

export default async function QuestionIdPage({
  params,
}: {
  params: { questionId: string };
}) {
  const question = await getQuestionById(params?.questionId);

  console.log("question in Page",question)

  return <PanelResize question={question}></PanelResize>;
}
