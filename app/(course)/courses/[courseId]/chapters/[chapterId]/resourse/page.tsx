import { Banner } from "@/components/banner";
import { ActionGetChapter } from "@/lib/actions/chapter.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

import Resoures from "./_components/resoures";


const ChpaterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const {
    
   
    attachments
  } = await ActionGetChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  return ( 
    <Resoures attachments={attachments}></Resoures>
  );
};

export default ChpaterIdPage;
