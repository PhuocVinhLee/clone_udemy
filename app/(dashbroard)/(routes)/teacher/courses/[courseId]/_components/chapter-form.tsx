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

import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title required",
  }),
});

interface ChapterFormProps {
  initialData: {
    title: string;
    chapters: { title: string }[] 
  };
  courseId: string;
}

export const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
      await axios.post(`/api/chapters`, {...values, courseId});
      toast.success(" Chapter created.");
      toggleCrating();
      router.refresh(); // refresh state
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="mt-6 broder bg-slate-100 rounded-md p-4">
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
             {
              !initialData?.chapters?.length && "No chapters"
            }
            No chapters
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
