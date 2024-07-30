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
import SidebarRoutes from "./_components/navbar-routes";
import NavBarRoutes from "./_components/navbar-routes";

const ChpaterIdPage = async ({
  children,
  params,
}: {
  children: React.ReactNode;
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


  console.log("all", course);
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
        <div>
          <div className=" px-4">
            <NavBarRoutes chapterId={ params.chapterId} courseId={params.courseId}></NavBarRoutes>
          </div>
          <div className="p-4 min-h-[400px]">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ChpaterIdPage;
