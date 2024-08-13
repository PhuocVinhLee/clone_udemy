import { Button } from "@/components/ui/button";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { QuestionType } from "@/lib/database/models/questions.model";
import { Review } from "@/components/review";

import Image from "next/image";
import Example from "./example";
import { cn } from "@/lib/utils";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";
interface QuestionInforProp {
  question: QuestionChapterType;
}
const QuestionInfor = ({ question }: QuestionInforProp) => {
  return (
    <div className="px-2 py-2 flex flex-col gap-y-3 relative  overflow-auto h-full">
      <div className="flex gap-x-2 flex-wrap ">
        <p className=" text-sm flex">
          {" "}
          <span className=" font-bold">{question?.title}</span>
        </p>
        <Badge
          className={cn(
            question.level === "medium" && " bg-yellow-500",
            question.level === "hard" && "  bg-red-500",
            question.level === "easy" && " bg-green-500"
          )}
        >
          <span className="capitalize">
            {" "}
            {question?.level ? question?.level : "None"}
          </span>
        </Badge>
      </div>
      <div className=" relative mt-2 ">
        <Image
          width={300}
          height={300}
          alt="questionImg"
          className="object-cover rounded-md"
          src={question?.imageUrl}
        />
      </div>
      <span className=" font-semibold gap-x-0"> Description:</span>
      <Review value={question?.description!}></Review>

      <Example examples={question?.testCases}></Example>
    </div>
  );
};

export default QuestionInfor;
