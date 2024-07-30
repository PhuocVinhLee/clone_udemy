import { Banner } from "@/components/banner";
import { ActionGetChapter } from "@/lib/actions/chapter.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import VideoPlayer from "./_components/video-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CourseEnrollButton from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Review } from "@/components/review";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/course-progress-button";
import Resoures from "./resourse/_components/resoures";
import QandA from "./qanda/_components/qanda";
import Exercise from "./exercise/_components/exercise";
import { getAllMessagByChapterId } from "@/lib/actions/qanda.action";


const ChpaterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
    questionChapter,
  } = await ActionGetChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  // if(!chapter || ! course) {return redirect("/");}

  const isLocked = !chapter?.isFree && !purchase;
  const completedOnEnd = !!purchase && !userProgress?.isCompleted;

  const allMessage = await getAllMessagByChapterId(params.chapterId);
  console.log("all", course)
  return ( <div>

  </div>
    // <Review value={chapter.description!}></Review>
  );
};

export default ChpaterIdPage;
