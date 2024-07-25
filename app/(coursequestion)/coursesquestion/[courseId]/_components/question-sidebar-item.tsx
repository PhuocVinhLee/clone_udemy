"use client";
import { ChapterType } from "@/lib/database/models/chapters.model";
import { CourseType } from "@/lib/database/models/courses.model";
import Purchase from "@/lib/database/models/purchase.model";
import { UserProgressType } from "@/lib/database/models/userProgress.model";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Flag, FlagOff, Icon, Lock, PlayCircle } from "lucide-react";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import React from "react";
import { from } from "svix/dist/openapi/rxjsStub";
import Link from "next/link";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QuestionSidebaItemProps {
  title: string;
  courseId: string;
  chapterId: string;
  id: string;
  isCorrect: boolean;
  level: string;
  id_questionstudents: string;
  flag: boolean;
}
function QuestionSidebaItem({
  title,
  courseId,
  chapterId,
  id,
  isCorrect,
  level,
  id_questionstudents,
  flag
}: QuestionSidebaItemProps) {
  const pathname = usePathname();

  const router = useRouter();

  const isActive = pathname?.includes(id);

  //  console.log("Is questionId", questionId);
  const onClick = () => {
    router.push(
      `/coursesquestion/${courseId}/chapters/${chapterId}/questions/${id}`
    );
  };

  return (
    <>
      <div className=" relative    ">
        <div
          className={cn(
            "  border  flex items-center justify-between gap-x-2 text-sm font-[500] pl-2 transition-all hover:text-slate-600 hover:bg-slate-300/20",
            isActive &&
              " bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
            isCorrect && "text-green-500 hover:text-emerald-700",
            isCorrect && isActive && "bg-emerald-200/20"
          )}
        >
          <button
            type="button" 
            onClick={onClick}
            className="  flex items-center justify-between gap-x-2  py-1 w-full px-1 "
          >
            <span className=" line-clamp-1"> {title}</span>

            <div className="flex flex-col gap-y-2">
            {/* disabled={isLoading} onClick={HandleToggleFlag} */}
            <Button 
          
          size="sm"
          variant="ghost"
        >
          {flag ?  <Flag ></Flag> : ( <FlagOff/>)} 
        </Button>
            <div
              className={cn(
                level === "medium" && " text-yellow-500",
                level === "hard" && "  text-red-500",
                level === "easy" && " text-green-500"
              )}
            >
              <span className=" capitalize"> {level ? level : "None"}</span>
            </div>
            </div>
          </button>
        </div>
        <div
          className={cn(
            " absolute left-0 top-0 opacity-0 border-2 border-slate-700 h-full transition-all",
            isActive && "  opacity-100",
            isCorrect && "border-emerald-700"
          )}
        ></div>
      </div>
    </>
  );
}

export default QuestionSidebaItem;
