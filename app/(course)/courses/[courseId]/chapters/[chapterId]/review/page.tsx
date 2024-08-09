import { Banner } from "@/components/banner";
import { ActionGetChapter } from "@/lib/actions/chapter.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { Review } from "@/components/review";

import QandA from "./_components/review";
import { getAllMessagByChapterId } from "@/lib/actions/qanda.action";
import { getAllReviewByChapterId } from "@/lib/actions/review.action";

const ChpaterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const { course,purchase } = await ActionGetChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });
  const allReviews= await getAllReviewByChapterId(params.chapterId, userId)
  
  return (
    <QandA
    purchase={purchase}
      userIdOfCourse={course?.userId}
       messages={allReviews}
      chapterId={params.chapterId}
      courseId={params.courseId}
      userId={userId}
    ></QandA>
  );
};

export default ChpaterIdPage;
