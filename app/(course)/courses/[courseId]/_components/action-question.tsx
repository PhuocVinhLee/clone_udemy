import { Button } from "@/components/ui/button";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";
import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface ActionQuestionProp {
  courseId: string;
  chapterId?: string | null;
  questions: QuestionChapterType[] | [];
}
const ActionQuestion = ({
  questions,
  chapterId,
  courseId,
}: ActionQuestionProp) => {
  const pathname = usePathname();
  const router = useRouter();
  const isQuestion = pathname?.includes("/questions");
  const pathSegments = pathname?.split("/");
  const questionId = pathSegments
    ? pathSegments[pathSegments.length - 1]
    : null;

  const indexQuestion = questions?.findIndex((question) => {
    return question?._id === questionId;
  });

  const NextQuestion = () => {
    if (indexQuestion + 1 < questions?.length) {
      router.push(
        `/courses/${courseId}/chapters/${chapterId}/questions/${
          questions[indexQuestion + 1]?._id
        }`
      );
    }
  };
  const PreviousQuestion = () => {
    if (indexQuestion > 0) {
      router.push(
        `/courses/${courseId}/chapters/${chapterId}/questions/${
          questions[indexQuestion - 1]?._id
        }`
      );
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
      <Button size="sm" variant="outline">
        {indexQuestion + 1}
      </Button>
      <Button
        disabled={indexQuestion + 1 >= questions?.length} // 4 5
        onClick={NextQuestion}
        size="sm"
        variant="outline"
      >
        Next
      </Button>
      <div>
        <Button size="sm" variant="outline">
          <Flag></Flag>
        </Button>
      </div>
    </div>
  );
};

export default ActionQuestion;
