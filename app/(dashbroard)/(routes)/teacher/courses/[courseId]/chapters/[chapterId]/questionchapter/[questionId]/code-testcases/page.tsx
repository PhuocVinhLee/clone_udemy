import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";


import PanelReSize from "@/components/question/code-testcases/panel-resize";
import { getQuestionChapterById } from "@/lib/actions/questionchapter.action";

export default async function CodeTestCasesPage({
  params,
}: {
  params: { questionId: string;  courseId: string; chapterId: string };
}) {
  const question = await getQuestionChapterById(params.questionId);
  console.log("question in page", question)

  const pathToUpdateAndGet = `/api/chapters/${params.courseId}/${params.chapterId}/questionschapter/${params.questionId}`;
  return (
    <div className="h-full flex flex-col">
      
        <Link
          href={`/teacher/courses/${params.courseId}/chapters/${params.chapterId}/questionchapter/${params.questionId}`}
          className="flex p-2  h-[40px]  items-center  text-sm hover:opacity-75 transition "
        >
          <ArrowLeft className="h-4  w-4 mr-2"></ArrowLeft>
          Back to course set up
        </Link>
      
      <div className="h-full flex-1 overflow-hidden">
      <PanelReSize pathToUpdateAndGet={pathToUpdateAndGet} question={question}></PanelReSize>
      </div>
    </div>
  );
}
