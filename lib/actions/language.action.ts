"use server";
import { connectToDatabase } from "../database/mongoose";
import Languages from "../database/models/language.model";
//import { handleError } from "../utils";

export async function getAllLanguage() {
  try {
    await connectToDatabase();

    const allLanguage = await Languages.find({}); // { userId: 1233; title: test;}
    console.log(allLanguage);

    return JSON.parse(JSON.stringify(allLanguage));
  } catch (error) {
    //handleError(error);

    console.log(" An error in action get all Category ne;", error);
  }
}

// GET ONE


