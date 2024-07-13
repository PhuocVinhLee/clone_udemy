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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Cog, FileCog, Pencil, ReplaceAll } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

import { Combobox } from "@/components/ui/combobox";
import { QuestionTypeType } from "@/lib/database/models/questionTypes.model";
import { QuestionType } from "@/lib/database/models/questions.model";


const formSchema = z.object({
  questionTypeId: z.string().min(1, {
    message: "category required",
  }),
});

interface QuestionTypeFormProps {
  initialData: {
    questionTypeId: string;
  };
  question: QuestionType;
  options: { label: string; value: string; template: string }[];
}

export const QuestionTypeForm = ({
  initialData,
  question,
  options,
}: QuestionTypeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });
  const { isSubmitting, isValid  } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("value", values);
      const seclectedAfterOption = options.find(
        (option) => option.value === values?.questionTypeId
      );
      await axios.patch(`/api/questions/${question._id}`, {...values, template: seclectedAfterOption?.template});
      toast.success(" Couruse updated.");
      toggleEdit();
      router.refresh(); // refresh state
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  const seclectedOption = options.find(
    (option) => option.value === initialData?.questionTypeId
  );
  console.log(initialData);
  return (
    <div className="mt-6 broder bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between">
        Question types 
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Scanel</>
          ) : (
            <>
            <div className=" gap-x-4  flex">

            <div className="flex">
             <FileCog className="h-4 w-4 mr-1"></FileCog>
             Edit 
             </div>
             
            </div>

            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.questionTypeId && " text-slate-500 italic"
          )}
        >
          {" "}
          {seclectedOption?.label || "No question type"}
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
              name="questionTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  {/* <FormCategory>
                      This is your public display name.
                    </FormCategory> */}
                  <FormMessage />
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
