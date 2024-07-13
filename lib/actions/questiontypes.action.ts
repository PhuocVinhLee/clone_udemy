"use server";
import { connectToDatabase } from "../database/mongoose";
import QuestionTypes from "../database/models/questionTypes.model";
//import { handleError } from "../utils";

export async function getAllQuestionTypes() {
  try {
    await connectToDatabase();

    const allQuestionTypes = await QuestionTypes.find({}); // { userId: 1233; title: test;}
    console.log(allQuestionTypes);

    return JSON.parse(JSON.stringify(allQuestionTypes));
  } catch (error) {
    //handleError(error);

    console.log(" An error in action get all allQuestionTypes ne;", error);
  }
}

// GET ONE


