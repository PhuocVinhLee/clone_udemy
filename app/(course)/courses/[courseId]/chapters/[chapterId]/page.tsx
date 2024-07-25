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
import Resoures from "./_components/resoures";
import QandA from "./_components/QandA";
import Exercise from "./_components/exercise";
import { at } from "lodash";

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

  return (
    <div className="md:pl-80">
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        ></Banner>
      )}

      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        ></Banner>
      )}

      <div className="p-4 ">
        <VideoPlayer
          chapterId={params.chapterId}
          title={chapter.title}
          courseId={params.courseId}
          nextChapterId={nextChapter?._id ? nextChapter?._id : null}
          playbackId={muxData?.playbackId}
          isLocked={isLocked}
          completedOnEnd={completedOnEnd}
        ></VideoPlayer>
      </div>

      <div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
          {purchase ? (
            <CourseProgressButton
              chapterId={params.chapterId}
              courseId={params.courseId}
              nextChapterId={nextChapter?._id ? nextChapter?._id : null}
              isCompleted={!!userProgress?.isCompleted}
            />
          ) : (
            <CourseEnrollButton
              courseId={params.courseId}
              price={course.price}
            />
          )}
        </div>
        <Tabs defaultValue="Overview" className="w-full">
          <TabsList className="w-full  flex items-center justify-between rounded-none">
            <TabsTrigger value="Overview"> Overview</TabsTrigger>
            <TabsTrigger value="Exercise">Exercise</TabsTrigger>
            <TabsTrigger value="Resoures">Resoures</TabsTrigger>
            <TabsTrigger value="Q&A"> Q&A</TabsTrigger>
            <TabsTrigger value="Reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent className=" min-h-[400px]" value="Overview">
            <div className=" p-4">
              <Review value={chapter.description!}></Review>
            </div>
          </TabsContent>
          <TabsContent value="Exercise" className=" min-h-[400px]">
            <Exercise courseId={params.courseId}  chapterId={params.chapterId} questions={questionChapter}></Exercise>
          </TabsContent>
          <TabsContent value="Resoures" className=" min-h-[400px]">
            <Resoures attachments={attachments}></Resoures>{" "}
          </TabsContent>
          <TabsContent className=" min-h-[400px]" value="Q&A">
            <QandA chapterId={params.chapterId} courseId={params.courseId} userId={userId}></QandA>
          </TabsContent>
          <TabsContent className=" min-h-[400px]" value="Reviews">
            Change your password here.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChpaterIdPage;
