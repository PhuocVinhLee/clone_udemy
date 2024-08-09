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
import QuestionTypes from "../database/models/questionTypes.model";

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

export async function ActionAllQuestionByUserId(userId: string) {
  try {
    await connectToDatabase();

    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const questions = await Questions.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return JSON.parse(JSON.stringify(questions));
  } catch (error) {
    //handleError(error)
    console.log(
      " An error in action ActionGetAllQuestionsByUserId questions",
      error
    );
    return [];
  }
}

export async function ActionAllQuestionByCategoryId(
  userId: string,
  categoryId: string
) {
  try {
    await connectToDatabase();

    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const questions = await Questions.find({
      userId: user._id,
      categoryId: categoryId,
    })
      .populate({
        path: "questionTypeId", // Specify the path to populate
        select: "name",
        model: QuestionTypes, // Select the fields to include
      })
      .sort({
        position: 1,
      }) // Populate questionTypeId with specific fields from QuestionTypes
      .exec();
    const transformedQuestions = questions.map((question) => ({
      ...question.toObject(),
      questionTypeId: question?.questionTypeId?.name, // Replace the questionTypeId object with the name value
    }));

    console.log("transformedQuestions", transformedQuestions);
    return JSON.parse(JSON.stringify(transformedQuestions));
  } catch (error) {
    //handleError(error)
    console.log(
      " An error in action ActionAllQuestionByCategoryId questions",
      error
    );
    return [];
  }
}
