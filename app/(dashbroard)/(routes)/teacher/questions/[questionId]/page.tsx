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
} from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { ImageForm } from "./_components/image-form";
import { DescriptionForm } from "./_components/description-form";
import { ChapterForm } from "./_components/chapter-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { Banner } from "@/components/banner";
import { QuestionActions } from "./_components/question-action";
import { getQuestionById } from "@/lib/actions/question.action";
import { LanguageForm } from "./_components/language-form";
import { getAllLanguage } from "@/lib/actions/language.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllQuestionTypes } from "@/lib/actions/questiontypes.action";
import { QuestionTypeForm } from "./_components/question-type-form";
import { QuestionTypeType } from "@/lib/database/models/questionTypes.model";
import { Answer } from "./_components/answer";
import { TestCase } from "./_components/test-case";



const QuestionIdPage = async ({
  params,
}: {
  params: { questionId: string };
}) => {
  const { userId } = auth();
  if (!userId) redirect("/");

  const question = await getQuestionById(params.questionId);
  const categorys = await getAllCategory();
  const languages = await getAllLanguage();
  const questionTypes = await getAllQuestionTypes();

  if (!question) {
    redirect("/");
  }

  console.log("question", question);
  const requiredFlieds = [
    question.title,
    question.description,
    question.imageUrl,
    question.answer,
    question.questionTypeId,
    question.template,
    question.testCases,
    question.categoryId,
  ];
  
  console.log(requiredFlieds);
  const totalFields = requiredFlieds.length;
  const completedFields = requiredFlieds.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFlieds.every(Boolean);

  return (
    <>
      {!question?.isPublished && (
        <Banner label="This question is unpublish. It will not be visible to the students."></Banner>
      )}
      <div className="p-6">
        <div className=" flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Question setup</h1>
            <span>Completed all fields {completionText}</span>
          </div>

          <QuestionActions
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
              initialData={question}
              questionId={question._id}
            ></TitleForm>
            <DescriptionForm
              initialData={question}
              questionId={question._id}
            ></DescriptionForm>
            <ImageForm
              initialData={question}
              questionId={question._id}
            ></ImageForm>
            <CategoryForm
              initialData={question}
              questionId={question._id}
              options={categorys?.map(
                (category: { name: string; _id: string }) => ({
                  label: category.name,
                  value: category._id,
                })
              )}
            ></CategoryForm>
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
                options={questionTypes?.map(
                  (question_type: QuestionTypeType) => ({
                    label: question_type.name,
                    value: question_type._id,
                    template: question_type.template,
                  })
                )}
              ></QuestionTypeForm>

              

              <Answer questionId={params.questionId} initialData={question}></Answer>
           <TestCase
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
