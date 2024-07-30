"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
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
import { QandQForm } from "./qanda-form";
import QandAItemDetail from "./q-a-a-item-detail";
import toast from "react-hot-toast";
import { useNotification } from "@/components/context/notificationContext";

interface TransformedQandAType extends Omit<QandAType, "userId"> {
  userId: TransformedUserId;
}
interface QandAItemProps {
  chapterId: string;
  userId: string;
  courseId: string;
  message: TransformedQandAType & { length_of_relay: number };
  userIdOfCourse: string;
  idMessageShowMore: string | null;
  rootIdMessageShowMore: string | null;
}
interface TransformedQandAuserIduserIdReplayType
  extends Omit<QandAType, "userId" | "userIdReplay"> {
  userId: TransformedUserId;
  userIdReplay: TransformedUserIdReplay;
}
function QandAItem({
  userIdOfCourse,
  chapterId,
  userId,
  courseId,
  message,
  idMessageShowMore,
  rootIdMessageShowMore,
}: QandAItemProps) {
  const [showMore, SetShowMore] = useState(false);
  const [isLoading, SetIsLoading] = useState(false);
  const { target, targetType } = useNotification();
  const [showMoreDataMessage, setShowMoreDataMessage] = useState<
    TransformedQandAuserIduserIdReplayType[]
  >([]);
  const commentRefs = useRef({});
  const getDataShowMore = async () => {
    try {
      SetIsLoading(true);
      const showMoreMessage = await axios.get(
        `/api/chapters/${courseId}/${chapterId}/qanda/root/${message._id}/showmore`
      );
      setShowMoreDataMessage(showMoreMessage?.data);
      // if(target.targetId){scrollToElementById(`message-${target.targetId}`)}
      SetIsLoading(false);
    } catch (error) {
      SetIsLoading(false);
      toast.error("Some thing went wrong !");
    }
  };

  useEffect(() => {
    if (target.targetId) {
      scrollToElementById(`message-${target.targetId}`);
    }
  }, [target]);
  const togleShowMore = async () => {
    try {
      if (!showMore) {
        getDataShowMore();
      }
      SetShowMore(!showMore);
    } catch (error) {
      SetIsLoading(false);
    }
  };
  // useEffect(() => {
  //   console.log("handle set shoe morew 1",message.length_of_relay);
  //   if (message.length_of_relay > 0) {
  //     console.log("handle set shoe morew 1",message.length_of_relay);
  //     SetShowMore(true);
  //     getDataShowMore();
  //   }
  // }, [message.length_of_relay]);
  // useEffect(() => {
  //   if (rootIdMessageShowMore === message._id) {
  //     console.log("handle set shoe morew 2");
  //     SetShowMore(true);
  //     getDataShowMore();
  //   }
  // }, [idMessageShowMore]);
  const scrollToElementById = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    if (targetType == "show:comment" && target.rootId === message._id) {
      getDataShowMore();

      SetShowMore(true);
    }
  }, [targetType, target.rootId]);

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
    <div>
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
            {message.length_of_relay > 0 && (
              <div onClick={togleShowMore} className="flex text-blue-300">
                <div>More relpay {message?.length_of_relay}</div>
                <span>
                  {" "}
                  {showMore ? (
                    <ChevronDown></ChevronDown>
                  ) : (
                    <ChevronUp></ChevronUp>
                  )}{" "}
                </span>{" "}
              </div>
            )}
            <Button onClick={togleReplay} variant="ghost" className=" ">
              Replay
            </Button>
          </div>
          <div>
            {isLoading && (
              <Loader2 className="h-8 w-8 animate-spin text-secondary dark:text-white"></Loader2>
            )}
          </div>
          <div className="w-full">
            {replay && (
              <div className="w-full">
                <QandQForm
                  type="replay"
                  isEditingProp={true}
                  togleReplay={(value) => {
                    SetReplay(value);
                  }}
                  initialData={{ message: "" }}
                  userId={userId}
                  courseId={courseId}
                  chapterId={chapterId}
                  path={pathToReplay}
                ></QandQForm>
              </div>
            )}
          </div>
          <div className="mt-2 w-full flex flex-col gap-y-8">
            {showMore &&
              showMoreDataMessage?.map((messageMore) => (
                <div key={messageMore._id} className="">
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

export default QandAItem;
