import { Banner } from "@/components/banner";
import { ActionGetChapter } from "@/lib/actions/chapter.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { Review } from "@/components/review";

import QandA from "./_components/qanda";
import { getAllMessagByChapterId } from "@/lib/actions/qanda.action";

const ChpaterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const { course } = await ActionGetChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });
  const allMessage = await getAllMessagByChapterId(params.chapterId, userId);
  console.log(" allMessage nel", allMessage)
  return (
    <QandA
      userIdOfCourse={course?.userId}
      messages={allMessage}
      chapterId={params.chapterId}
      courseId={params.courseId}
      userId={userId}
    ></QandA>
  );
};

export default ChpaterIdPage;
