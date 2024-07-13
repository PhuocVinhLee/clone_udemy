// pages/api/hackerearth.ts

import ejs from "ejs";

import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import axios from "axios";
import { getQuestionById } from "@/lib/actions/question.action";
import { QuestionType } from "@/lib/database/models/questions.model";

export async function GET(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const question: QuestionType = await getQuestionById(params.questionId);

    const { testCases, answer, template } = question;

    let source = "";
    if(answer?.length && testCases){
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
