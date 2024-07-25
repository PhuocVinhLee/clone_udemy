"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

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

import { ImageIcon, Pencil, PlusCircle, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  url: z.string().min(1, {
    message: "Image required",
  }),
});

interface AttachmentFromProps {
  initialData: {
    title: string;
    description: string;
    imageUrl: string;
    attachments: { _id: string; name: string; url: string }[];
  };
  courseId: string;
}
[];

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFromProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] =  useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     imageUrl: initialData?.imageUrl || "",
  //   },
  // });
  // const { isSubmitting, isValid } = form.formState;
  console.log(initialData);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await axios.post(`/api/attachments`, {...values, courseId});
      toast.success(" Attachments updated.");
      toggleEdit();
      router.refresh(); // refresh state
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  const onDelete = async (attachmentId: string) => {
    try {
      console.log(attachmentId);
      setDeletingId(attachmentId)
      await axios.delete(`/api/attachments/${attachmentId}`);
      toast.success(" Attachments deteleted.");
      
      setDeletingId(null)
      router.refresh(); // refresh state
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="mt-6 broder  dark:bg-slate-700 bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between">
        Course attachment
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Scanel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h4 w-4 mr-2"></PlusCircle>
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData?.attachments?.length === 0 && (
            <p className=" text-sm mt-2 text-slate-500 italic">
              No attachments yet.
            </p>
          )}

          {initialData?.attachments?.length != 0 && (
            <div className=" space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment._id}
                  className="flex items-center p-3 w-full bg-sky-100 btoder-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h4 w-4 mr-2 flex-shrink-0">
                    
                  </File>
                  <p className=" line-clamp-1 me-1">{attachment.name}</p>
                  {deletingId === attachment._id  &&(
                    <div><Loader2 className="h-4 w-4 animate-spin"/></div>
                  )}
                   {deletingId !== attachment._id  &&(
                    <button onClick={()=>onDelete(attachment._id)} className="ml-auto hover:opacity-75 transition"><X className="h-4 w-4 "/></button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttchement"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          ></FileUpload>
          <div className="text-xs  text-muted-foreground">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};
