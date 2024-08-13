"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  QandAType,
  TransformedUserId,
} from "@/lib/database/models/qanda.model";
import { QandQForm } from "./qanda-form";
import QandAItem from "./q-a-item";
import { useNotification } from "@/components/context/notificationContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

interface TransformedQandAType extends Omit<QandAType, "userId"> {
  userId: TransformedUserId;
}

interface QandAProps {
  purchase: any;
  chapterId: string;
  userId: string;
  courseId: string;
  messages: (TransformedQandAType & { length_of_relay: number })[];
  userIdOfCourse: string;
}

const QandA = ({
  purchase,
  userIdOfCourse,
  chapterId,
  userId,
  courseId,
  messages,
}: QandAProps) => {
  const pathToCreate = `/api/chapters/${courseId}/${chapterId}/qanda`;
  const { target, targetType } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCommentId = searchParams.get("c");
  const [messageLocal, setMessagesLocal] =
    useState<(TransformedQandAType & { length_of_relay: number })[]>(messages);

  useEffect(() => {
    console.log("messages reference changed:", messages);
    setMessagesLocal(() => messages);
  }, [messages]);

  const scrollToElementById = (id?: string | null) => {
    if (id) {
      const element = document.getElementById(`message-${id}`);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  useEffect(() => {
    const filterMessage = messageLocal?.find((messa) => {
      return messa._id === currentCommentId;
    });
    const filterNotMessage = messageLocal?.filter((messa) => {
      return messa._id != currentCommentId;
    });

    if (filterMessage) {
      const newMessage = [filterMessage, ...filterNotMessage];
      console.log(newMessage);
      setMessagesLocal(() => newMessage);
    }
  }, [currentCommentId]);

  useEffect(() => {
    scrollToElementById(currentCommentId);
  }, [messageLocal]);

  const [idMessageShowMore, setIdMessageShowMore] = useState<string | null>(
    null
  );
  const [rootIdMessageShowMore, setRootIdMessageShowMore] = useState<
    string | null
  >(null);

  const getNewOneMessage = async () => {
    const newMessage = await axios.get(
      `/api/chapters/${courseId}/${chapterId}/qanda/root/${target.targetId}`
    );
    setMessagesLocal((pre) => {
      return [newMessage.data, ...pre];
    });
  };
  useEffect(() => {
    if (targetType === "NEW:COMMENT:FORM" && target.targetId) {
      console.log("NEW:QANDA:FORM");
      getNewOneMessage();
    }
  }, [targetType, target]);

  return (
    <div className="flex flex-col gap-4 border p-4">
     { purchase && <QandQForm
        type="new"
        isEditingProp={false}
        togleReplay={(value) => {
          // SetReplay(value)
        }}
        path={pathToCreate}
        initialData={{ message: "" }}
        userId={userId}
        courseId={courseId}
        chapterId={chapterId}
      ></QandQForm>}

      { messageLocal?.length ? ( messageLocal?.map((message) => {
        return (
          <div key={message._id}>
            <QandAItem
              userIdOfCourse={userIdOfCourse}
              userId={userId}
              chapterId={chapterId}
              courseId={courseId}
              message={message}
            ></QandAItem>
          </div>
        );
      }))  : "Message not found!"}
    </div>
  );
};

export default QandA;
