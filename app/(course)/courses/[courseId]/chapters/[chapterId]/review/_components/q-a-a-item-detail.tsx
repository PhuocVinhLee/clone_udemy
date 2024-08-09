"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  QandAType,
  TransformedUserId,
  TransformedUserIdReplay,
} from "@/lib/database/models/qanda.model";
import { cn } from "@/lib/utils";
import TimeAgo from "@/components/time-ago";

import { useNotification } from "@/components/context/notificationContext";
import { ReviewType } from "@/lib/database/models/review.model";
interface TransformedQandAuserIduserIdReplayType
  extends Omit<ReviewType, "userId" > {
  userId: TransformedUserId;
 
}
interface QandAItemProps {
  chapterId: string;
  userId: string;
  courseId: string;
  message: TransformedQandAuserIduserIdReplayType;
  rootId: string;
  userIdOfCourse: string;
}
function QandAItemDetail({
  chapterId,
  userId,
  courseId,
  message,
  rootId,
  userIdOfCourse,
}: QandAItemProps) {
  const { target, targetType } = useNotification();
  const messageRef = useRef<HTMLDivElement>(null); // Create a ref
  const [showMore, SetShowMore] = useState(false);
  const togleShowMore = () => {
    SetShowMore(!showMore);
  };

  const [isEditing, setIsEditing] = useState(false);
  const togleIsEditting = () => {
    setIsEditing(!isEditing);
  };
  const pathToReplay = `/api/chapters/${courseId}/${chapterId}/qanda/root/${rootId}/replay/${message._id}`;
  // const pathToReplay = `/api/chapters/${courseId}/${chapterId}/qanda/root/${message._id}/replay/${message._id}`;
  // useEffect(() => {
  //   if (
  //     messageRef.current &&
  //     targetType === "show:comment" &&
  //     target.targetId === message._id
  //   ) {
  //     console.log("hanele croll");

  //     messageRef.current.scrollIntoView({ behavior: "smooth" });
  //     messageRef.current.className = "bg-red-300";
  //   } 
  // }, [target.targetId]);
  return (
    <div
      ref={messageRef} id={`message-${message._id}`}
      className="  w-full flex flex-row items-start justify-between gap-x-4"
    >
      <div className="w-17 ">
        <Avatar className="">
          <AvatarImage src={message?.userId?.photo} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      <div className=" w-full gap-y-3 flex flex-1 flex-col items-start justify-between ">
        <div className="flex  gap-x-2">
          {" "}
          <h5
            className={cn(
              message.userId?._id === userIdOfCourse &&
                "  font-bold  bg-slate-700 px-2 rounded-md"
            )}
          >
            @{message?.userId?.username}
          </h5>{" "}
          <div className="  text-slate-300">
            {message?.createdAt && (
              <TimeAgo date={message?.createdAt}></TimeAgo>
            )}
          </div>
        </div>
        <div>
        
          {message?.message}{" "}
        </div>
       
       
      </div>
    </div>
  );
}

export default QandAItemDetail;
