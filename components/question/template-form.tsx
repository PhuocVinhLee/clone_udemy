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

import { Pencil, Replace } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import { cpp } from "@codemirror/lang-cpp";
import CodeMirrorCpn from "./code-testcases/code-mirror";


const formSchema = z.object({
  template: z.string().min(2, {
    message: "template required",
  }),
});

interface TemplateFromProps {
  initialData: {
    template: string;
  };
  questionId: string;
}

export const TemplateForm = ({
  initialData,
  questionId,
}: TemplateFromProps) => {
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
      await axios.patch(`/api/questions/${questionId}`, values);
      toast.success(" Question updated.");
      toggleEdit();
      router.refresh(); // refresh state
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  useEffect(() => {
    form.reset(initialData);
  }, [initialData.template]);
  return (
    <div className="broder bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between">
        Question template
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Scanel</>
          ) : (
            <>
              <Replace className="h-4 w-4 mr-1"></Replace>
              Customise
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className=" text-sm mt-2  line-clamp-3"> {initialData.template}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                 
                  <FormControl>
                    {/* <Input disabled={isSubmitting} placeholder="shadcn" {...field} /> */}

                    <CodeMirrorCpn
                      valueProp={field.value}
                      // extensions={[javascript({ jsx: true }),]}
                      extensionsProp={[cpp(), autocompletion()]}
                      //extensions={[cpp()]}
                      onChangeProp={field.onChange}
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
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
