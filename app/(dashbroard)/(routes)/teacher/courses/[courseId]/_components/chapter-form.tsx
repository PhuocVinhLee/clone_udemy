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

import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { ChapterList } from "./chapter-list";
import { arrayBuffer } from "stream/consumers";


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title required",
  }),
});

interface ChapterFormProps {
  initialData: { chapters: any[] }; // initialData has type is {chapters: any[]}
  courseId: string;
}

export const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  console.log("chapters ne", initialData.chapters);

  const toggleCrating = () => setIsCreating((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await axios.post(`/api/chapters/${courseId}`, { ...values });
      form.reset();
      toast.success(" Chapter created.");
      toggleCrating();
      router.refresh(); // refresh API
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const onReOrder = async (updateData: { _id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
     
      //update Chapters
      console.log("cha-ter", updateData)
      await axios.put(`/api/chapters/${courseId}`, { arrayChapter: updateData });
      toast.success(" Chapter updates.");
      router.refresh(); 
    } catch (error) {
      toast.error("Some thing went wrong");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const onEdit = (id: string)=>{
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  }
  return (
    <div className="mt-6 relative broder  dark:bg-slate-700 bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className=" absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className=" animate-spin h-6 w-6 text-sky-700"></Loader2>
        </div>
      )}
      <div className=" font-medium flex items-center justify-between">
        Course chhapter
        <Button onClick={toggleCrating} variant="ghost">
          {isCreating ? (
            <>Scanel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2"></PlusCircle>
              Add chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="This course is about..."
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}

      <div>
        {!isCreating && (
          <div
            className={cn(
              "text-sm mt-2",
              !initialData?.chapters?.length && " text-slate-500 italic"
            )}
          >
            {!initialData?.chapters?.length && "No chapters"}
            <ChapterList
              onEdit={onEdit}
              onReOrder={onReOrder}
              items={initialData.chapters || []}
            ></ChapterList>
          </div>
        )}
        {!isCreating && (
          <p className=" text-sm text-muted-foreground mt-4">
            Drag and drop to reorder the chapters
          </p>
        )}
      </div>
    </div>
  );
};
