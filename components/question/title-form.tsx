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
import { Input } from "@/components/ui/input";

import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title required",
  }),
});

interface TitleFromProps {
  initialData: {
    title: string;
  };
  questionId: string;
  path: string;
}

export const TitleForm = ({ initialData, questionId, path }: TitleFromProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    
    try {
     
        await axios.patch(path, values)
        toast.success(" Question updated.")
        toggleEdit();
        router.refresh();// refresh state
    } catch (error) {
        toast.error("Something went wrong!")
    }
  };
  return (
    <div className="mt-6 broder bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between">
        Course tilte
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Scanel</>
          ) : ( <>
          <Pencil className="h-4 w-4 mr-2"></Pencil> 
           Edit title</>
            
          )}
        
        </Button>
       
      </div>
      {!isEditing && <p className=" text-sm mt-2"> {initialData.title}</p>}
      {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>

                    <FormControl>
                      <Input disabled={isSubmitting} placeholder="shadcn" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={ !isValid || isSubmitting} type="submit">Save</Button>
            </form>
          </Form>
        )}
    </div>
  );
};
