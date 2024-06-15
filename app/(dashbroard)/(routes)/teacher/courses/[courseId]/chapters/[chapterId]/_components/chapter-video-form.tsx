"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ImageIcon, Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "Video required",
  }),
});

interface ChapterVideoFromProps {
  initialData: { title: string; description: string; videoUrl: string };
  chapterId: string;
  courseId: string;
  playbackId: string;
}

export const ChapterVideoForm = ({ initialData, courseId, chapterId, playbackId }: ChapterVideoFromProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData?.videoUrl || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    
    try {
      console.log(values)
        await axios.patch(`/api/chapters/${chapterId}`, {...values, courseId})
        toast.success(" Chapter updated.")
        toggleEdit();
        router.refresh();// refresh state
    } catch (error) {
        toast.error("Something went wrong!")
    }
  };
  return (
    <div className="mt-6 broder bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Scanel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h4 w-4 mr-2"></PlusCircle>
              Add an video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2"></Pencil>
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className=" flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500"></VideoIcon>
          </div>
        ) : (
          <div className=" relative aspect-video mt-2">
            <MuxPlayer playbackId={playbackId || ""}>

            </MuxPlayer>
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
             
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          ></FileUpload>
          <div className="text-xs  text-muted-foreground">
            Upload this chapter video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing &&(
        <div className="text-xs mt-2 text-muted-foreground">
          Videos can take a few minutes to process. Refesh the page if video does not appear.
        </div>
      )}
    </div>
  );
};
