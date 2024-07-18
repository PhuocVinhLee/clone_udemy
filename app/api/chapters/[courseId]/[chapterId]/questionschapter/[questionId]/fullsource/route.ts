// pages/api/hackerearth.ts

import ejs from "ejs";

import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import axios from "axios";
import { getQuestionById } from "@/lib/actions/question.action";
import { QuestionType } from "@/lib/database/models/questions.model";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";
import { getQuestionChapterById } from "@/lib/actions/questionchapter.action";

export async function GET(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const question: QuestionChapterType = await getQuestionChapterById(params.questionId);

    const { testCases, answer, template } = question;

    let source = "";
    if(testCases?.length && answer){
      source=  ejs.render(template, {
        ANSWER: answer,
        TESTCASE: testCases,
      });
    }

    return NextResponse.json(source);
  } catch (error) {
    console.log("Eorr", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
