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
import { useEffect, useState } from "react";
import axios from "axios";
import { from } from "svix/dist/openapi/rxjsStub";

interface TransformedQandAType extends Omit<QandAType, "userId"> {
  userId: TransformedUserId;
}

interface QandAProps {
  chapterId: string;
  userId: string;
  courseId: string;
  messages: (TransformedQandAType & { length_of_relay: number })[];
  userIdOfCourse: string;
}

const QandA = ({
  userIdOfCourse,
  chapterId,
  userId,
  courseId,
  messages,
}: QandAProps) => {
  const pathToCreate = `/api/chapters/${courseId}/${chapterId}/qanda`;
  const { target, targetType } = useNotification();

  const [idMessageShowMore, setIdMessageShowMore] = useState<string | null>(
    null
  );
  const [rootIdMessageShowMore, setRootIdMessageShowMore] = useState<
    string | null
  >(null);

  
  const [messageLocal, setMessagesLocal] =
    useState<(TransformedQandAType & { length_of_relay: number })[]>(messages);

  useEffect(() => {
    setMessagesLocal(messages);
    // setIdMessageShowMore(target.targetId)
    // setRootIdMessageShowMore(target.rootId);
  }, [messages]);

  const getNewOneMessage = async () => {
    const newMessage = await axios.get(
      `/api/chapters/${courseId}/${chapterId}/qanda/root/${target.targetId}`
    );
    setMessagesLocal((pre) => {
      return [newMessage.data, ...pre];
    });
  };
  useEffect(() => {
    if (targetType === "new:comment" && target.targetId) {
      getNewOneMessage();
    }
  }, [targetType, target]);
  useEffect(() => {
    if (targetType === "show:comment" && target.targetId) {
      console.log("do you chane")
      const filterMessage = messageLocal?.filter((messa) => {
              return messa._id === target.rootId;
            });
            const filterNotMessage = messageLocal?.filter((messa) => {
              return messa._id != target.rootId;
            });
      
            setMessagesLocal([...filterMessage, ...filterNotMessage]);
            // setIdMessageShowMore(target.targetId);
            // setRootIdMessageShowMore(target.rootId);
    }
  }, [targetType, target.rootId]);


  return (
    <div className="flex flex-col gap-4 border p-4">
      <QandQForm
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
      ></QandQForm>

      {messageLocal?.map((message) => {
        return (
          <QandAItem
            rootIdMessageShowMore={rootIdMessageShowMore}
            idMessageShowMore={idMessageShowMore}
            userIdOfCourse={userIdOfCourse}
            key={message._id}
            userId={userId}
            chapterId={chapterId}
            courseId={courseId}
            message={message}
          ></QandAItem>
        );
      })}
    </div>
  );
};

export default QandA;
