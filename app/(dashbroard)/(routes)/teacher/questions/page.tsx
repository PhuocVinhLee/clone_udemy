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
interface TransformedQuestionType
  extends Omit<QuestionType, "questionTypeId" | "categoryId"> {
  questionTypeId: {
    _id: string;
    name: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
}
const QuestionPage = () => {
  const [questions, setQuestions] = useState<any[]>([]);

  const FechAllQuestions = async () => {
    // const questionType = await axios.get(`/api/questiontype`);
    // const category = await axios.get(`/api/category`);

    const AllQuestion = await axios.get(`/api/questions`);
    setQuestions(AllQuestion.data);
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
