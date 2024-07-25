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

export async function getQuestionsWithStudentStatus(
  chapterId: string,
  userId: string
) {
  await connectToDatabase();
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const results = await QuestionsChapter.aggregate([
    {
      $match: {
        chapterId: new mongoose.Types.ObjectId(chapterId),
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "questionstudents",
        let: {
          questionId: "$_id",
          userId: new mongoose.Types.ObjectId(user._id),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$questionId", "$$questionId"] },
                  { $eq: ["$userId", "$$userId"] },
                ],
              },
            },
          },
          { $project: { isCorrect: 1 , flag: 1} },
        ],
        as: "studentStatus",
      },
    },
    {
      $addFields: {
        isCorrect: { $arrayElemAt: ["$studentStatus.isCorrect", 0] },
        id_questionstudents: { $arrayElemAt: ["$studentStatus._id", 0] },
        flag: { $arrayElemAt: ["$studentStatus.flag", 0] }
      },
    },
    {
      $project: {
        studentStatus: 0,
      },
    },
  ]);
  return JSON.parse(JSON.stringify(results));
 
}
// GET ONE
export async function getQuestionChapterById(questionId: string) {
  try {
    await connectToDatabase();

    const question = await QuestionsChapter.findById(questionId);
    // const questionStudent = await QuestionStudents.find({})

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

export async function ActionAllQuestionByChapterId(
  userId: string,
  chapterId: string
) {
  try {
    await connectToDatabase();

    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const questions = await QuestionsChapter.find({
      userId: user._id,
      chapterId: chapterId,
    }).sort({
      position: 1,
    });

    return JSON.parse(JSON.stringify(questions));
  } catch (error) {
    //handleError(error)
    console.log(
      " An error in action ActionAllQuestionByChapterId questions",
      error
    );
    return [];
  }
}
