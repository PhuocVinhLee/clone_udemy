"use server";

import { revalidatePath } from "next/cache";

import Courses, { CourseType } from "../database/models/courses.model";
import { connectToDatabase } from "../database/mongoose";
//import { handleError } from "../utils";
import Mux from "@mux/mux-node";

import { deleteMuxdataByChapterId } from "./muxdata.action";
import mongoose, { Schema, Types } from "mongoose";
import { getProgress } from "./userprogress.action";

import { getUserById } from "./user.actions";
import Chapters, { ChapterType } from "../database/models/chapters.model";
import { CategoryType } from "../database/models/categorys.model";
import Purchase from "../database/models/purchase.model";
import Questions from "../database/models/questions.model";

// GET ONE
export async function getQuestionById(questionId: string) {
  try {
    await connectToDatabase();

    const question = await Questions.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }
    question.testCases.sort((a: any, b: any) => a.position - b.position);

    return JSON.parse(JSON.stringify(question));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action find a question", error);
    return null;
  }
}
