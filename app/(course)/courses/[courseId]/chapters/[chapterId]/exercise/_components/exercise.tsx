"use client";

import coursesId from "@/app/(dashbroard)/(routes)/teacher/courses/[courseId]/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ExerciseProps {
  questions: QuestionChapterType[] | null;
  chapterId: string;
  courseId: string;
}
const Exercise = ({ questions, chapterId, courseId }: ExerciseProps) => {
  console.log( "question", questions)
  return (
    <div className="  flex flex-col gap-y-4">
      {questions?.length
        ? questions?.map((question, index) => {
            return (
              <div
                className="  rounded-sm flex flex-row items-center justify-between  gap-y-4 bg-slate-200 dark:bg-slate-800 p-3 "
                key={index}
              >
                <div className="flex items-center justify-between">
                  <span className=" line-clamp-1">
                    {" "}
                    Question {index + 1}:{" "}
                    <Link
                      href={`/coursesquestion/${courseId}/chapters/${chapterId}/questions/${question?._id}`}
                      className=" text-blue-600 hover:text-blue-800 hover:underline "
                    >
                      {question.title}
                    </Link>
                  </span>

                  <Badge
                    className={cn(
                      question?.level === "medium" && " text-yellow-500",
                      question?.level === "hard" && "  text-red-500",
                      question?.level === "easy" && " text-green-500"
                    )}
                    variant="outline"
                  >
                    
                    <span className=" capitalize">
                     
                      {  question?.level ?  question?.level : "None"}
                    </span>
                  </Badge>
                </div>
              </div>
            );
          })
        : "Question not found!"}
    </div>
  );
};

export default Exercise;
