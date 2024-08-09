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

import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useNotification } from "@/components/context/notificationContext";
import { StarRating } from "./star-rating";

const formSchema = z.object({
  message: z.string().min(2, {
    message: "Message required",
  }),
  starRating: z.number().min(1).max(5, {
    message: "Rating must be between 1 and 5",
  }),
});

interface ReviewFormProps {
  initialData: {
    message: string;
  };
  chapterId: string;
  userId: string;
  courseId: string;
 
  
  togleReplay: (value: boolean) => void;
  isEditingProp: boolean;

}

export const ReviewForm = ({
  initialData,
  chapterId,
  userId,
  courseId,
 
  togleReplay,
  isEditingProp,

}: ReviewFormProps) => {
  const { setTarget, setTargetType } = useNotification();
  const [isEditing, setIsEditing] = useState(isEditingProp);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values)
      const pathToCreate = `/api/chapters/${courseId}/${chapterId}/review`;
      const respone = await axios.post(`${pathToCreate}`, values);
      if (respone) {
        // if (type === "new") {
        //   setTargetType("new:comment");
        // }
        // if (type === "replay") {
        //   setTargetType("replay:comment");
        // }
        // console.log("data", respone);
        // setTarget({
        //   rootId: respone?.data.rootId,
        //   targetId: respone?.data._id,
        // });
      }
      toast.success("  Updated.");
      toggleEdit();
      form.reset();
       router.refresh(); // refresh state
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className=" broder  rounded-md w-full">
      {
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
          <FormField
            control={form.control}
            name="starRating"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>YourRating</FormLabel> */}
                <FormControl>
                  <StarRating
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      onClick={() => {
                        setIsEditing(true);
                      }}
                      disabled={isSubmitting}
                      placeholder="Write your message..."
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
            

            {isEditing && (
              <div className="flex gap-x-2">
                <Button
                  variant="ghost"
                  type="reset"
                  onClick={() => {
                    setIsEditing(false);
                    togleReplay(false);
                    form.reset();
                  }}
                >
                  Scanel
                </Button>
                <Button
                  variant="ghost"
                  disabled={!isValid || isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            )}
          </form>
        </Form>
      }
    </div>
  );
};
