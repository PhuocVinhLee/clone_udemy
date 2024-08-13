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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Loader2, Pencil, PlusCircle, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { QuestionType } from "@/lib/database/models/questions.model";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";
import { QuestionList } from "./question-list";
import Link from "next/link";
import ConfirmModal from "@/components/model/confirm-modal";

import { QuestionTable } from "./question-table";

import { DataTable } from "./data-table";
//import { ChapterList } from "./chapter-list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Loading from "@/components/clipLoader";
import BeatLoader from "react-spinners/BeatLoader";
import ImportFromExcel from "./import-from-excell";

import { handleExport } from "../../../../../../../../../components/excell/export-to-excell";
import { columns } from "./columns";
import { QuestionTypeType } from "@/lib/database/models/questionTypes.model";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title required",
  }),
});

interface QuestionFormProps {
  initialData: { questions: QuestionChapterType[] }; // initialData has type is {chapters: any[]}
  chapterId: string;
  courseId: string;
  questionByCategoryId: (QuestionType & { exist: boolean })[];
}

const exportTemplateExcell: unknown = {
  _id: "example_id",
  __v: 0,
  position: 1,

  title: "Example Title",
  description: "Example Description",
  imageUrl: "http://example.com/image.png",
  answer: "Example Answer",
  questionType: "Function c",
  template: "Example Template",
  testCases: JSON.stringify([
    {
      input: "Example Input",
      output: "Example Output",
      asexample: true,
      position: 1,
    },
  ]),
  level: "easy",
};

export const QuetionForm = ({
  initialData,
  chapterId,
  courseId,
  questionByCategoryId,
}: QuestionFormProps) => {
  console.log("questionByCategoryId", questionByCategoryId);
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
      await axios.post(
        `/api/chapters/${courseId}/${chapterId}/questionschapter`,
        { ...values }
      );
      form.reset();
      toast.success(" Question created.");
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
      console.log("updateData", updateData);
      await axios.put(
        `/api/chapters/${courseId}/${chapterId}/questionschapter`,
        { arrayQuestions: updateData }
      );
      toast.success(" Chapter updates.");
      router.refresh();
    } catch (error) {
      toast.error("Some thing went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(
      `/teacher/courses/${courseId}/chapters/${chapterId}/questionchapter/${id}`
    );
  };
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeType[]>([]);

  const fechQuestionType = async () => {
    const questionType = await axios.get(`/api/questiontype`);
    setQuestionTypes(questionType.data);
  };
  useEffect(() => {
    fechQuestionType();
  }, []);

  const [questionsFromRoot, setQuestionsFromRoot] = useState([]);
  const handelImportQuestion = async () => {
    try {
      console.log("questionsFromRoot", questionsFromRoot);
      setIsUpdating(true);
      const questions = questionsFromRoot.map((q: any) => {
        const questionTypeId = questionTypes?.find(
          (questionType) => questionType.name === q?.original?.questionTypeId
        );
        return { ...q?.original, questionTypeId: questionTypeId };
      });

      const response = await axios.post(
        `/api/chapters/${courseId}/${chapterId}/arrayquestionschapter`,
        { arrayQuestion: questions }
      );
      console.log("response", response);
      if (response?.data?.errors.length) {
        toast.success(
          "Chapter updates, but a few question duplicate key error collection"
        );
      } else {
        toast.success(" Chapter updates.");
      }

      setIsUpdating(false);
      router.refresh();
    } catch (error) {
      toast.error("Some thing went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={cn(
        "mt-6 relative broder bg-slate-100  dark:bg-slate-700 rounded-md p-4",
        isUpdating && "  bg-slate-300"
      )}
    >
      {/* <div className=" absolute  left-[50%]  top-[50%]">
        <BeatLoader
          className=" text-slate-500"
          loading={isUpdating}
          size={10}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div> */}
      {isUpdating && (
        <div className=" absolute h-full w-full   bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className=" animate-spin h-6 w-6 text-sky-700"></Loader2>
        </div>
      )}
      <div className=" font-medium flex items-center justify-between">
        {!isCreating && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <div className="flex items-center justify-between">
                <div>Chapter questions</div>
                <AccordionTrigger
                  disabled={isUpdating}
                  className="flex gap-x-0 hover:no-underline"
                >
                  Actions
                </AccordionTrigger>
              </div>
              <div className=" flex flex-wrap gap-x-2">
                <AccordionContent>
                  <Button onClick={toggleCrating} variant="outline">
                    New a question
                  </Button>
                </AccordionContent>
                <AccordionContent>
                  <ConfirmModal
                    content={
                      <DataTable
                        setQuestionsFromRoot={setQuestionsFromRoot}
                        columns={columns}
                        data={questionByCategoryId}
                      ></DataTable>
                    }
                    onConfirm={handelImportQuestion}
                  >
                    <Button className="text-sm" variant="outline">
                      Import from root question
                    </Button>
                  </ConfirmModal>
                </AccordionContent>

                <AccordionContent>
                  <ConfirmModal
                    content={
                      <DataTable
                        setQuestionsFromRoot={setQuestionsFromRoot}
                        columns={columns}
                        data={questionByCategoryId}
                      ></DataTable>
                    }
                    onConfirm={() => {
                      const questions = questionsFromRoot.map((q: any) => {
                        return q?.original;
                      });

                      return handleExport({ data: questions });
                    }}
                  >
                    <Button variant="outline">Export to excell</Button>
                  </ConfirmModal>
                </AccordionContent>
                <AccordionContent>
                  <Button
                    onClick={() => {
                      handleExport({
                        data: [exportTemplateExcell as QuestionChapterType],
                      });
                    }}
                    variant="outline"
                  >
                    Export template excell
                  </Button>
                </AccordionContent>
              </div>

              <AccordionContent>
                <ImportFromExcel
                  courseId={courseId}
                  chapterId={chapterId}
                ></ImportFromExcel>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {isCreating && (
          <div className="flex items-center justify-between w-full">
            <div>Chapter question</div>
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreating(false);
              }}
            >
              Scanel
            </Button>
          </div>
        )}
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
                      placeholder="This question title is..."
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
              !initialData?.questions?.length && " text-slate-500 italic"
            )}
          >
            {!initialData?.questions?.length && "No question"}
            <QuestionList
              onEdit={onEdit}
              onReOrder={onReOrder}
              items={initialData.questions || []}
            ></QuestionList>
          </div>
        )}
        {!isCreating && (
          <p className=" text-sm text-muted-foreground mt-4">
            Drag and drop to reorder the questions
          </p>
        )}
      </div>
    </div>
  );
};
