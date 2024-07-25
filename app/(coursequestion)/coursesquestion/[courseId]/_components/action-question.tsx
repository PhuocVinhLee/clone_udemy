"use client"
import { Button } from "@/components/ui/button";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Flag, FlagOff } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ActionQuestionProp {
  courseId: string;
  chapterId?: string | null;

  questionChapterWithStaus: (QuestionChapterType & {
    isCorrect: boolean;
    flag: boolean;
    id_questionstudents: string;
  })[];
}
const ActionQuestion = ({
  chapterId,
  courseId,
  questionChapterWithStaus,
}: ActionQuestionProp) => {
  const [isLoading, setIsLoading]= useState(false)
  const pathname = usePathname();
  const router = useRouter();
  const isQuestion = pathname?.includes("/questions");
  const pathSegments = pathname?.split("/");
  const questionId = pathSegments
    ? pathSegments[pathSegments.length - 1]
    : null;

  const indexQuestion = questionChapterWithStaus?.findIndex((question) => {
    return question?._id === questionId;
  });

  console.log("questionChapterWithStaus", questionChapterWithStaus)

  const NextQuestion = () => {
    if (indexQuestion + 1 < questionChapterWithStaus?.length) {
      router.push(
        `/coursesquestion/${courseId}/chapters/${chapterId}/questions/${
          questionChapterWithStaus[indexQuestion + 1]?._id
        }`
      );
    }
  };
  const PreviousQuestion = () => {
    if (indexQuestion > 0) {
      router.push(
        `/coursesquestion/${courseId}/chapters/${chapterId}/questions/${
          questionChapterWithStaus[indexQuestion - 1]?._id
        }`
      );
    }
  };
  const HandleToggleFlag = async () => {
   try {
    setIsLoading(true);
    const respone = await axios.patch(
      `/api/questionstudents/${questionChapterWithStaus[indexQuestion]._id}/flag`,
      {flag: !questionChapterWithStaus[indexQuestion].flag}
    );
    console.log("ahkajhdkahd",respone)
    setIsLoading(false);
    router.refresh();
   } catch (error) {
    setIsLoading(false)
    toast.error("Some thing went wrong!")
   }
  };
  return (
    <div className={cn("  hidden gap-x-2", isQuestion && "flex")}>
      <Button
        disabled={indexQuestion - 1 < 0}
        onClick={PreviousQuestion}
        size="sm"
        variant="outline"
      >
        Previous
      </Button>
      <Button
        className={cn(
          questionChapterWithStaus[indexQuestion]?.isCorrect &&
            " text-green-500 border border-green-500"
        )}
        size="sm"
        variant="outline"
      >
        <span> {indexQuestion + 1}</span>
      </Button>
      <Button
        disabled={indexQuestion + 1 >= questionChapterWithStaus?.length} // 4 5
        onClick={NextQuestion}
        size="sm"
        variant="outline"
      >
        Next
      </Button>
      <div>
        <Button disabled={isLoading} onClick={HandleToggleFlag}
          className={cn(
             " "
          )}
          size="sm"
          variant="outline"
        >
          {questionChapterWithStaus[indexQuestion]?.flag ? <Flag ></Flag>: <FlagOff></FlagOff>}
          
        </Button>
      </div>
    </div>
  );
};

export default ActionQuestion;
