"use client";
import { ChapterType } from "@/lib/database/models/chapters.model";
import { CourseType } from "@/lib/database/models/courses.model";
import Purchase from "@/lib/database/models/purchase.model";
import { UserProgressType } from "@/lib/database/models/userProgress.model";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { redirect, usePathname, useRouter } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import React from "react";
import { from } from "svix/dist/openapi/rxjsStub";
import Link from "next/link";

interface CourseSidebarItemProps {
  label: string;
  courseId: string;
  id: string;
  isCompleted: boolean;
  isLocked: boolean;
}
function CourseSidebaItem({
  label,
  courseId,
  isLocked,
  id,
  isCompleted,
}: CourseSidebarItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const isActive = pathname?.includes(id);

  console.log("Is Active", isCompleted);
  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <div className=" relative   ">
            <div
              className={cn(
                "    flex items-center justify-between gap-x-2 text-slate-500 text-sm font-[500] pl-2 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive &&
                  "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
                isCompleted && "text-emerald-700 hover:text-emerald-700",
                isCompleted && isActive && "bg-emerald-200/20"
              )}
            >
              <button
                type="button"
                onClick={onClick}
                className="flex items-center gap-x-2  py-4"
              >
                <Icon
                  size={22}
                  className={cn(
                    "text-slate-500",
                    isActive && " text-slate-700",
                    isCompleted && " text-emerald-700"
                  )}
                />
                {label}
              </button>

              <AccordionTrigger></AccordionTrigger>
            </div>
            <div
              className={cn(
                " absolute left-0 top-0 opacity-0 border-2 border-slate-700 h-full transition-all",
                isActive && "  opacity-100",
                isCompleted && "border-emerald-700"
              )}
            ></div>
          </div>

          <AccordionContent>
            <Link    href={`/courses/${courseId}/chapters/${id}/questions/12345`} className=" pl-2 line-clamp-1">
             
              Q.1: Yes. It adheres to the WAI-ARIA design pattern.
            </Link>
          </AccordionContent>
          <AccordionContent>
            <p className=" pl-2 line-clamp-1">
              
              Q.2: Yes. It adheres to the WAI-ARIA design pattern.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export default CourseSidebaItem;
