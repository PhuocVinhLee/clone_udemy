import { Banner } from "@/components/banner";
import { ActionGetChapter } from "@/lib/actions/chapter.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import VideoPlayer from "./_components/video-player";

import CourseEnrollButton from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Review } from "@/components/review";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/course-progress-button";

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
  } = await ActionGetChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  // if(!chapter || ! course) {return redirect("/");}

  console.log("chapter", chapter);

  console.log("purchase", purchase);
  const isLocked = !chapter?.isFree && !purchase;
  const completedOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
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

      <div className="p-4">
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
            <CourseProgressButton chapterId = {params.chapterId} courseId={params.courseId} nextChapterId={nextChapter?._id} 
            isCompleted={!!userProgress?.isCompleted}/>
          ) : (
            <CourseEnrollButton
              courseId={params.courseId}
              price={course.price}
            />
          )}
        </div>

        <Separator />
        <div>
          <Review value={chapter.description!}></Review>
        </div>

        {!!attachments?.length && (
          <>
            <Separator></Separator>
            <div className="p-4">
              {attachments.map((attachment)=>(
                <a href={attachment.url} target="_blank" key={attachment._id} className="flex items-center p-3 w-full
                 bg-sky-200 text-sky-700 border rounded-md hover:underline" >
                  
                 <File></File>
                  <p className=" line-clamp-1">{attachment.name}</p>
                </a>

              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChpaterIdPage;
