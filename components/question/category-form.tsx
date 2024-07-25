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

import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

import { Combobox } from "@/components/ui/combobox";

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: "category required",
  }),
});

interface CategoryFormProps {
  initialData: {
    categoryId: string;
  };
  questionId: string;
  options: { label: string; value: string }[];
}

export const CategoryForm = ({
  initialData,
  questionId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("value", values);
      await axios.patch(`/api/questions/${questionId}`, values);
      toast.success(" Couruse updated.");
      toggleEdit();
      router.refresh(); // refresh state
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  const seclectedOption = options.find(
    (option) => option.value === initialData?.categoryId
  );
  console.log(initialData);
  return (
    <div className="mt-6 broder  dark:bg-slate-700 bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between">
        Course category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Scanel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2"></Pencil>
              Edit category1
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.categoryId && " text-slate-500 italic"
          )}
        >
          {" "}
          {seclectedOption?.label || "No category"}
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
              name="categoryId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="w-full">
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
