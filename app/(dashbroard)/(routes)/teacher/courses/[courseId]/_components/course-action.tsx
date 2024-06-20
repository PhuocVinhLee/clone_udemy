"use client";

import ConfirmModal from "@/components/model/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


import { revalidatePath } from "next/cache";
import { deleteChapter2 } from "@/lib/actions/chapter.action";
import { deleteCourse } from "@/lib/actions/courses.action";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseActionsProp {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
  userId: string
 
}

export const CourseActions = ({
  disabled,
  courseId,
  isPublished,
  userId
 
}: CourseActionsProp) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      if (isPublished) {
        const respon = await axios.patch(
          `/api/courses/${courseId}/publish`,
          {
            isPublished: !isPublished,
          }
        );
        if(respon){
          toast.success(" Course unpublished.");
        }
      } else {
        /// should add more API for isPublished
        const respon = await axios.patch(
          `/api/courses/${courseId}/publish`,
          {
            isPublished: !isPublished,
          }
        );
       if(respon){
        console.log(respon);
        toast.success(" Course published.");
        confetti.onOpen();

       }
      }
      router.refresh();
      // router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      toast.error("Some thing went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setIsLoading(true);
      //  await axios.delete(`/api/chapters/${courseId}/${chapterId}`);
      const CourseToDelete =  await deleteCourse(userId, courseId);
      if (CourseToDelete) {
        toast.success(" Course delete.");
        router.refresh(); //chỉ hoạt động cho tuyến đường hiện tại và nó sẽ khiến tuyến đường hiện tại không sử dụng bộ đệm trong lần truy cập tiếp theo.

        router.push(`/`); // and server revalidatePath in deleteChapter action
      }
    } catch (error) {
      toast.error("Some thing went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4"></Trash>
        </Button>
      </ConfirmModal>
    </div>
  );
};
