"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  QandAType,
  TransformedUserId,
} from "@/lib/database/models/qanda.model";
import { ReviewForm } from "./review-form";
import ReviewItem from "./review-item";
import { useNotification } from "@/components/context/notificationContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { from } from "svix/dist/openapi/rxjsStub";
import { ReviewType } from "@/lib/database/models/review.model";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

interface TransformedReviewType extends Omit<ReviewType, "userId"> {
  userId: TransformedUserId;
}

interface ReviewProps {
  purchase: any;
  chapterId: string;
  userId: string;
  courseId: string;
  messages?: (TransformedReviewType & {
    replayMessages: TransformedReviewType[];
  })[];
  userIdOfCourse: string;
}

const Review = ({
  purchase,
  userIdOfCourse,
  chapterId,
  userId,
  courseId,
  messages,
}: ReviewProps) => {
  const searchParams = useSearchParams();
  const currentCommentId = searchParams.get("c");
  const { target, targetType } = useNotification();
  const { user } = useUser();
  const scrollToElementById = (id?: string | null) => {
    if (id) {
      const element = document.getElementById(`message-${id}`);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };
  useEffect(() => {
    scrollToElementById(currentCommentId);
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 border p-4">
      {!messages?.find(
        (message) => message.userId._id === user?.publicMetadata?.userId
      ) &&
        purchase &&
        user?.publicMetadata?.userId != userIdOfCourse && (
          <ReviewForm
            isEditingProp={false}
            togleReplay={(value) => {
              // SetReplay(value)
            }}
            initialData={{ message: "" }}
            userId={userId}
            courseId={courseId}
            chapterId={chapterId}
          ></ReviewForm>
        )}
      { messages?.length ? (
        messages?.map((message) => {
          return (
            <div key={message._id}>
              <ReviewItem
              userIdOfCourse={userIdOfCourse}
              userId={userId}
              chapterId={chapterId}
              courseId={courseId}
              message={message}
            ></ReviewItem>
            </div>
          );
        })
      ): "Rivew not found!"}
    </div>
  );
};

export default Review;
