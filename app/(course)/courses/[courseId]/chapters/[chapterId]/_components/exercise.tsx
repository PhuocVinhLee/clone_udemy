"use client";

import coursesId from "@/app/(dashbroard)/(routes)/teacher/courses/[courseId]/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


interface ExerciseProps {
  questions: QuestionChapterType[] | null;
  chapterId: string;
  courseId: string;
}
const Exercise = ({ questions, chapterId, courseId }: ExerciseProps) => {
  return (
    <div className=" px-4 py-2 flex flex-col gap-y-4">
      {questions?.map((question, index) => {  
        return (
          <div
            className="  rounded-sm flex flex-row items-center justify-between  gap-y-4 bg-slate-200 dark:bg-slate-800 p-3 "
            key={index}
          >
            <div className="flex items-center justify-between">
              <span className=" line-clamp-1">
                {" "}
                Question {index + 1}: <Link href={`/coursesquestion/${courseId}/chapters/${chapterId}/questions/${question?._id}`} className=" text-blue-600 hover:text-blue-800 hover:underline ">{question.title}</Link>
              </span>
              <Badge className="  ms-2 bg-yellow-400" variant="outline">
                Medium
              </Badge>
            </div>

            
          </div>
        );
      })}
    </div>
  );
};

export default Exercise;
