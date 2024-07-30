import { Banner } from "@/components/banner";
import { ActionGetChapter } from "@/lib/actions/chapter.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { Review } from "@/components/review";
import Exercise from "./_components/exercise";


const ChpaterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const {
    chapter,
    questionChapter,
  } = await ActionGetChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  return ( 
    <Exercise courseId={params.courseId}  chapterId={params.chapterId} questions={questionChapter}></Exercise>
  );
};

export default ChpaterIdPage;
