"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId: string | null;
  isLocked: boolean;
  completedOnEnd: boolean;
  title: string;
}
const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completedOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();
  const onEnd = async () => {
    try {
      if (completedOnEnd) {
        const response = await axios.put(
          `/api/chapters/${courseId}/${chapterId}/progress`,
          { isCompleted: true }
        );
        if(!nextChapterId){
          confetti.onOpen();
        }
        if(nextChapterId){
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
        toast.success("Progress Updated");// if refresh befor push => it not true
        router.refresh();// reset state % Complete

        

      }
    } catch (error) {
      toast.error("Some thing went wrong");
    } finally {
    }
  };

  return (
    <div className=" relative  w-full aspect-video border border-red-700">
      {!isLocked && (
        <div className=" absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary"></Loader2>
        </div>
      )}

      {isLocked && (
        <div
          className=" absolute inset-0 flex items-center justify-center bg-slate-800 
         flex-col gap-y-2 text-secondary "
        >
          <Lock className=" h-8 w-8"></Lock>
          <p className=" text-sm"> This is locked</p>
        </div>
      )}

      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden" , "w-full")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          // autoPlay
          playbackId={playbackId}
        ></MuxPlayer>
      )}
    </div>
  );
};

export default VideoPlayer;
