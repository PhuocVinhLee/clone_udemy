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

import { FileCog, FileMinus, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmModal from "@/components/model/confirm-modal";

const formSchema = z.object({
  input: z.string().min(2, {
    message: "Title required",
  }),
  output: z.string().min(2, {
    message: "Title required",
  }),
  asexample: z.boolean().default(true).optional(),
});

interface TestCaseProps {
  pathToUpdateAndGet: string;
  initialData: {
    input: string;
    output: string;
    asexample: boolean;
    position: number;
  };
  questionId: string;

  testCases: {
    input: string;
    output: string;
    asexample: boolean;
    position: number;
  }[];
}

export const TestCaseForm = ({
  pathToUpdateAndGet,
  initialData,
  questionId,
  testCases,
}: TestCaseProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const [isDelete, setIsDelete] = useState(false);
  const [isLoading, setIsLoading]= useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("valuse", values);
      const testCasesFilter = testCases.filter((testcase, index) => {
        return testcase.position != initialData.position;
      });
      await axios.patch(pathToUpdateAndGet ,{
        testCases: [
          ...testCasesFilter,
          { ...values, position: initialData.position },
        ],
      });
      toast.success(" Question updated.");
      toggleEdit();
      router.refresh(); // refresh state
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  
  const onDelete = async () => {
    try {
      setIsLoading(true);
  
      const testCasesFilter = testCases.filter((testcase, index) => {
        return testcase.position != initialData.position;
      });
      const testCasesMapPosition = testCasesFilter.map((testcase, index)=>{
        return {...testcase, position: index + 1}
      })

    const respone =  await axios.patch(pathToUpdateAndGet, {
        testCases:testCasesMapPosition
      });
      if (respone) {
        toast.success(" Test case delete.");
        router.refresh(); //chỉ hoạt động cho tuyến đường hiện tại và nó sẽ khiến tuyến đường hiện tại không sử dụng bộ đệm trong lần truy cập tiếp theo.
      }
    } catch (error) {
      toast.error("Some thing went wrong!");
    } finally {
      setIsLoading(false);
      router.refresh();
    }

  };
  useEffect(() => {
    form.reset(initialData);
  }, [initialData]);
  return (
    <>
      <div className=" broder dark:bg-slate-700 bg-slate-100 rounded-none p-4 ">
        <div className=" font-medium flex items-center justify-between">
          Case {initialData.position}
          <div>
            <Button onClick={toggleEdit} variant="ghost">
              {isEditing ? (
                <>Scanel</>
              ) : (
                <div className="flex gap-x-4">
                  <div className="flex ">
                    <FileCog className="h-4 w-4 mr-1"></FileCog>
                    Edit
                  </div>
                </div>
              )}
            </Button>

            <ConfirmModal onConfirm={onDelete}>
              <Button  disabled={isLoading} variant="ghost">
                <div className="flex ">
                  <FileMinus className="h-4 w-4 mr-1"></FileMinus>
                  Delete
                </div>
              </Button>
            </ConfirmModal>
          </div>
        </div>
        {!isEditing && initialData &&
            <div className="flex flex-col mb-3" >
            
              
              <div className="flex flex-col mb-3 gap-2">
                <span className="flex gap-x-2 items-center justify-between">
                  Input:{" "}
                  <div className="bg-white  dark:bg-customDark w-full p-2">{initialData.input}</div>
                </span>
                <span className="flex gap-x-2 items-center justify-between">
                  Output:{" "}
                  <div className="bg-white  dark:bg-customDark w-full p-2">{initialData.output}</div>
                </span>
              </div>
              
              <div className="flex  gap-x-1">
                  <Checkbox disabled={true} checked={initialData?.asexample} />
                  <div className="space-y-1 leading-none">
                    <div>Use as example.</div>
                  </div>
                </div>

              
            </div>
        
       }
        {isEditing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4  mb-4 w-full"
            >
              <div className="flex flex-col items-center justify-between w-full gap-y-2  ">
                <FormField
                  control={form.control}
                  name="input"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="input"
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

                <FormField
                  control={form.control}
                  name="output"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="output"
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
              </div>
              <FormField
                control={form.control}
                name="asexample"
                render={({ field }) => (
                  <FormItem className="flex bg-slate-200 flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Use as example.</FormLabel>
                      <FormDescription>
                        You can use this Test Case to example for students.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button  disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </form>
          </Form>
        )}
      
      <div className="border-dashed border-2 ">

</div>
      </div>
     
    </>
  );
};
