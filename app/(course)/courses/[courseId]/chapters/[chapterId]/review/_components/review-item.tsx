"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChevronDown, ChevronUp, Loader2, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  QandAType,
  TransformedUserId,
  TransformedUserIdReplay,
} from "@/lib/database/models/qanda.model";
import { Button } from "@/components/ui/button";

import { getShowMoreMessage } from "@/lib/actions/qanda.action";
import axios from "axios";
import { cn } from "@/lib/utils";
import TimeAgo from "@/components/time-ago";

import QandAItemDetail from "./q-a-a-item-detail";
import toast from "react-hot-toast";
import { useNotification } from "@/components/context/notificationContext";
import { ReviewType } from "@/lib/database/models/review.model";
import { ReplayForm } from "./replay-form";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

interface TransformedReviewType extends Omit<ReviewType, "userId"> {
  userId: TransformedUserId;
}
interface QandAItemProps {
  chapterId: string;
  userId: string;
  courseId: string;
  message: TransformedReviewType & { replayMessages: TransformedReviewType[] };
  userIdOfCourse: string;
}
interface TransformedQandAuserIduserIdReplayType
  extends Omit<QandAType, "userId"> {
  userId: TransformedUserId;
}
function ReviewItem({
  userIdOfCourse,
  chapterId,
  userId,
  courseId,
  message,
}: QandAItemProps) {
  const searchParams = useSearchParams();
  const currentCommentId = searchParams.get("c");
  const { user } = useUser();
  const [showMore, SetShowMore] = useState(false);
  const [isLoading, SetIsLoading] = useState(false);
  const { target, targetType } = useNotification();
  const [showMoreDataMessage, setShowMoreDataMessage] = useState<
    TransformedQandAuserIduserIdReplayType[]
  >([]);

  const getDataShowMore = async () => {
    try {
      SetIsLoading(true);
      const showMoreMessage = await axios.get(
        `/api/chapters/${courseId}/${chapterId}/review/root/${message._id}/showmore`
      );
      setShowMoreDataMessage(showMoreMessage?.data);
      // if(target.targetId){scrollToElementById(`message-${target.targetId}`)}
      SetIsLoading(false);
    } catch (error) {
      SetIsLoading(false);
      toast.error("Some thing went wrong !");
    }
  };

 
  const scrollToElementById = (id?: string | null) => {
    console.log("id", id);
    if (id) {
      const element = document.getElementById(`message-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  // useEffect(() => {
  //   if (targetType == "NEW:REVIEW:NOTIFICATION") {
  //     scrollToElementById(target.targetId);
  //     if(target.targetId === message._id){
  //       SetReplay(true)
  //     }else{
  //       SetReplay(false)
  //     }
  //   }
  // }, [targetType, target.targetId]);

  const [replay, SetReplay] = useState(false);
  const togleReplay = () => {
    SetReplay(!replay);
  };

  useEffect(() => {
    if (targetType == "replay:comment" && target.rootId === message._id) {
      getDataShowMore();
      SetShowMore(true);
    }
  }, [targetType, target]);

  const pathToReplay = `/api/chapters/${courseId}/${chapterId}/qanda/root/${message._id}/replay/${message._id}`;
  return (
    <div id={`message-${message._id}`}>
      <div className="flex flex-row items-start justify-between gap-x-4">
        <div className="w-17 ">
          <Avatar className="">
            <AvatarImage src={message?.userId?.photo} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-1 gap-y-2 flex-col items-start justify-between ">
          <div className="flex  gap-x-2">
            {" "}
            <h5
              className={cn(
                message?.userId?._id === userIdOfCourse &&
                  "  font-bold  bg-slate-700 px-2 rounded-md"
              )}
            >
              @{message?.userId?.username}
            </h5>{" "}
            <div className="  text-slate-300">
              {" "}
              {message?.createdAt && (
                <TimeAgo date={message?.createdAt}></TimeAgo>
              )}{" "}
            </div>
          </div>
          <div>{message?.message}</div>
          <div className="flex gap-x-4     items-center justify-between">
            <div className="flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    key={index}
                    type="button"
                    className="focus:outline-none"
                  >
                    <Star
                      className="w-6 h-6"
                      fill={
                        ratingValue <= message?.starRating ? "#ffd700" : "#ccc"
                      }
                    />
                  </button>
                );
              })}
            </div>
            {userIdOfCourse === user?.publicMetadata?.userId && (
              <Button onClick={togleReplay} variant="ghost" className=" ">
                Replay
              </Button>
            )}
          </div>
          <div>
            {isLoading && (
              <Loader2 className="h-8 w-8 animate-spin text-secondary dark:text-white"></Loader2>
            )}
          </div>
          <div className="w-full">
            {replay && (
              <div className="w-full">
                <ReplayForm
                  rootId={message._id}
                  isEditingProp={false}
                  togleReplay={(value) => {
                    // SetReplay(value)
                  }}
                  initialData={{ message: "" }}
                  userId={userId}
                  courseId={courseId}
                  chapterId={chapterId}
                ></ReplayForm>
              </div>
            )}
          </div>
          <div className="mt-2 w-full flex flex-col gap-y-8">
            {message?.replayMessages?.map((messageMore) => (
              <div  key={messageMore._id} className="">
                <QandAItemDetail
                  userIdOfCourse={userIdOfCourse}
                  rootId={message._id}
                  userId={userId}
                  chapterId={chapterId}
                  courseId={courseId}
                  message={messageMore}
                ></QandAItemDetail>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewItem;
