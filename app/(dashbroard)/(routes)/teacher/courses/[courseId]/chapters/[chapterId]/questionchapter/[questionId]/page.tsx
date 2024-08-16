"use server";
import { IconBadge } from "@/components/icon-badge";
import { getCoursById } from "@/lib/actions/courses.action";

import { getAllCategory } from "@/lib/actions/categorys.action";
import { getAllAttachmentsByCourseId } from "@/lib/actions/acttachments.action";
import { getAllChapterByCourseId } from "@/lib/actions/chapter.action";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  LayoutDashboard,
  ListChecks,
  File,
  ArrowLeft,
} from "lucide-react";
import { redirect } from "next/navigation";

import { Banner } from "@/components/banner";

import { getQuestionById } from "@/lib/actions/question.action";

import { getAllLanguage } from "@/lib/actions/language.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllQuestionTypes } from "@/lib/actions/questiontypes.action";
import { QuestionActions } from "@/components/question/question-action";
import { TitleForm } from "@/components/question/title-form";
import { DescriptionForm } from "@/components/question/description-form";
import { ImageForm } from "@/components/question/image-form";
import { CategoryForm } from "@/components/question/category-form";
import { QuestionTypeForm } from "@/components/question/question-type-form";
import { Answer } from "@/components/question/answer";
import { TestCase } from "@/components/question/test-case";
import { QuestionTypeType } from "@/lib/database/models/questionTypes.model";
import { getQuestionChapterById } from "@/lib/actions/questionchapter.action";
import { LevelForm } from "@/components/question/level-form";

const QuestionIdPage = async ({
  params,
}: {
  params: { questionId: string; chapterId: string; courseId: string };
}) => {
  const { userId } = auth();
  if (!userId) redirect("/");

  const question = await getQuestionChapterById(params.questionId);
  const categorys = await getAllCategory();
  // const languages = await getAllLanguage();
  const questionTypes = await getAllQuestionTypes();

  if (!question) {
    redirect("/");
  }

  console.log("question nek", question);
  const requiredFlieds = [
    question.title,
    question.description,
    question.imageUrl,
    question.answer,
    question.questionTypeId,
    question.template,
    question.testCases,
  ];

  console.log(requiredFlieds);
  const totalFields = requiredFlieds.length;
  const completedFields = requiredFlieds.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFlieds.every(Boolean);

  const pathToUpdate = `/api/chapters/${params.courseId}/${params.chapterId}/questionschapter/${params.questionId}`;
  //const pathToAddAnswerTestCases = `/api/chapters/${params.courseId}/${params.chapterId}/questionschapter/${params.questionId}/code-testcases`;
  const link = `/teacher/courses/${params.courseId}/chapters/${params.chapterId}/questionchapter/${params.questionId}/code-testcases`;
const levels : {label: string; value: string}[] = [{label: "Hard", value: "hard"}, 
  {label: "Medium", value: "medium"},
  {label: "Easy", value: "easy"}]

  return (
    <>
      {!question?.isPublished && (
        <Banner label="This question is unpublish. It will not be visible to the students."></Banner>
      )}
      <div className="p-6">
        <Link
          href={`/teacher/courses/${params.courseId}/chapters/${params.chapterId}`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2"></ArrowLeft>
          Back to chapter set up
        </Link>

        <div className=" flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Question setup</h1>
            <span>Completed all fields {completionText}</span>
          </div>

          <QuestionActions
            path={pathToUpdate}
            disabled={!isComplete}
            questionId={params.questionId}
            isPublished={question.isPublished}
            userId={userId}
          ></QuestionActions>
        </div>

        <div className=" grid  grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard}></IconBadge>
              <h2 className="text-xl">Custom your question</h2>
            </div>

            <TitleForm
              path={pathToUpdate}
              initialData={question}
              questionId={question._id}
            ></TitleForm>
            <DescriptionForm
              path={pathToUpdate}
              initialData={question}
              questionId={question._id}
            ></DescriptionForm>
            <ImageForm
              path={pathToUpdate}
              initialData={question}
              questionId={question._id}
            ></ImageForm>
            <LevelForm  path={pathToUpdate} options={levels} questionId={question._id}  initialData={question}>

            </LevelForm>
            {/* <CategoryForm
              initialData={question}
              questionId={question._id}
              options={categorys?.map(
                (category: { name: string; _id: string }) => ({
                  label: category.name,
                  value: category._id,
                })
              )}
            ></CategoryForm> */}
          </div>
          <div className=" space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks}></IconBadge>
                <h2 className="text-xl">Answer and Test case</h2>
              </div>

              <QuestionTypeForm
                initialData={question}
                question={question}
                path={pathToUpdate}
                options={questionTypes?.map(
                  (question_type: QuestionTypeType) => ({
                    label: question_type.name,
                    value: question_type._id,
                    template: question_type.template,
                  })
                )}
              ></QuestionTypeForm>

              <Answer
                link={link}
                questionId={params.questionId}
                initialData={question}
              ></Answer>
              <TestCase
                link={link}
                initialData={question}
                questionId={question._id}
              ></TestCase>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionIdPage;
