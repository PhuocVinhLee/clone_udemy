import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import CodeMirror from "./code-mirror";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TestCaseForm } from "./test-case-form";
import { getQuestionById } from "@/lib/actions/question.action";
import PanelReSize from "./panel-resize";

export default async function CodeTestCasesPage({
  params,
}: {
  params: { questionId: string };
}) {
  const question = await getQuestionById(params.questionId);
  console.log("question in page", question)

  return (
    <div className="h-full flex flex-col">
      
        <Link
          href={`/teacher/questions/${params.questionId}`}
          className="flex p-2  h-[40px]  items-center  text-sm hover:opacity-75 transition "
        >
          <ArrowLeft className="h-4  w-4 mr-2"></ArrowLeft>
          Back to course set up
        </Link>
      
      <div className="h-full flex-1 overflow-hidden">
      <PanelReSize question={question}></PanelReSize>
      </div>
    </div>
  );
}
