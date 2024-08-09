"use client";
import { DataTable } from "./_components/data-table";

import SearchInput from "@/components/search-input";
import Categories from "../../search/_components/Categories";

import { columns } from "./_components/columns";
import { useEffect, useState } from "react";
import { QuestionType } from "@/lib/database/models/questions.model";
import axios from "axios";
import { QuestionTypeType } from "@/lib/database/models/questionTypes.model";
import { CategoryType } from "@/lib/database/models/categorys.model";

const QuestionPage = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [questionType, setQuestionType] = useState<QuestionTypeType[]>([]);
  const [category, setCategory] = useState<CategoryType[]>([]);
  const fechQuestionType = async () => {
    const questionType = await axios.get(`/api/questiontype`);
    setQuestionType(questionType.data);
  };
  const fechCategory = async () => {
    const category = await axios.get(`/api/category`);
    setCategory(category.data);
  };
  const FechAllQuestions = async () => {
    const questionType = await axios.get(`/api/questiontype`);
    const category = await axios.get(`/api/category`);

    const AllQuestion = await axios.get(`/api/questions`);

    const questionTranform = AllQuestion?.data?.map(
      (question: QuestionType) => {
        const { categoryId, questionTypeId, ...rest } = question;
        return {
          ...rest,
          category: category?.data?.find(
            (category: CategoryType) => category._id === question.categoryId
          )?.name,

          questionType: questionType?.data?.find(
            (questionType: QuestionTypeType) =>
              questionType._id === question.questionTypeId
          )?.name,
        };
      }
    );
    setQuestions(questionTranform);
  };
  useEffect(() => {
    FechAllQuestions();
  }, []);

  const [questionsFromRoot, setQuestionsFromRoot] = useState([]);

  return (
    <div className="p-6">
      <DataTable
        setQuestionsFromRoot={setQuestionsFromRoot}
        columns={columns}
        data={questions}
      />
    </div>
  );
};

export default QuestionPage;
