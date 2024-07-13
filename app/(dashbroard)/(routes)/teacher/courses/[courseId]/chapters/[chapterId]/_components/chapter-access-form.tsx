"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

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
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";

import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Editor } from "@/components/editor";
import { Review } from "@/components/review";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  isFree: z.boolean().default(false),
  
});

interface ChapterAccessFromProps {
  initialData: {
    isFree: string;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFromProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData.isFree,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await axios.patch(`/api/chapters/${courseId}/${chapterId}`, {...values})
      toast.success(" Chapter updated.");
      toggleEdit();
      router.refresh(); // refresh state
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="mt-6 broder bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between">
        Chapter access setting
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Scanel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2"></Pencil>
              Edit access
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.isFree && " text-slate-500 italic"
          )}
        >
          {initialData.isFree ? (
            <>This chapter is free for preview</>
          ) : (
            <>This chapter is not free</>
          )}
         
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    ></Checkbox>
                  </FormControl>

                  <div className=" space-y-1 leading-none">
                    <FormDescription>
                      Check this box if you want to make this chapter free for
                      review
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
