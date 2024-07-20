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
import QuestionsChapter from "../database/models/questionschapter.model";
import QuestionStudents from "../database/models/questionstudents.model";

// GET ONE
export async function getQuestionStudentByQuestionId(
  userId: string,
  questionId: string
) {
  try {
    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const questionStudent = await QuestionStudents.findOne({
      userId: user._id,
      questionId,
    });
    // const questionStudent = await QuestionStudents.find({})

 
    

    return JSON.parse(JSON.stringify(questionStudent));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action find a question", error);
    return null;
  }
}
