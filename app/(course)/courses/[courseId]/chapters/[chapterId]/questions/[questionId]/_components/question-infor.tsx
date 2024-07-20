import { Button } from "@/components/ui/button";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { QuestionType } from "@/lib/database/models/questions.model";
import { Review } from "@/components/review";

import Image from "next/image";
import Example from "./example";
interface QuestionInforProp {
  question: QuestionType;
}
const QuestionInfor = ({ question }: QuestionInforProp) => {
  return (
    <div className="px-2 py-2 flex flex-col gap-y-3 relative  overflow-auto h-full">
      <div className="flex gap-x-2 flex-wrap ">
        <p className=" text-sm flex">
          {" "}
          <span className=" font-bold">{question?.title}</span>
        </p>
        <Badge className="  bg-yellow-400" variant="outline">
          Medium
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
