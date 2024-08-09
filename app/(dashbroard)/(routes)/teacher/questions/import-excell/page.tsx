"use client";

import { useEffect, useState } from "react";
import ImportFromExcel from "./_components/import-from-excell";
import axios from "axios";
import { QuestionType } from "@/lib/database/models/questions.model";
import { QuestionTypeType } from "@/lib/database/models/questionTypes.model";
import { CategoryType } from "@/lib/database/models/categorys.model";



const ImportExcell = () => {
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
 useEffect(()=>{
  fechCategory();
  fechQuestionType()
 },[])


  return (
    <div className=" justify-items-center grid  items-center w-full h-full ">
      <ImportFromExcel categorys={category}  questionTypes={questionType}></ImportFromExcel>
    </div>
  );
};

export default ImportExcell;
