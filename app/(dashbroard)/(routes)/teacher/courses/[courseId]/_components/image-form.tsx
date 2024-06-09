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

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  imageUrl: z.string().min(2, {
    message: "Image required",
  }),
});

interface ImageFromProps {
  initialData: { title: string; description: string; imageUrl: string };
  courseId: string;
}

export const ImageForm = ({ initialData, courseId }: ImageFromProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
  
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success(" Couruse updated.");
      toggleEdit();
      router.refresh(); // refresh state
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="mt-6 broder bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between">
        Course Image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Scanel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h4 w-4 mr-2"></PlusCircle>
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2"></Pencil>
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className=" flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500"></ImageIcon>
          </div>
        ) : (
          <div className=" relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
             
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          ></FileUpload>
          <div className="text-xs  text-muted-foreground">
            16:9 aspect radio recomended
          </div>
        </div>
      )}
    </div>
  );
};
