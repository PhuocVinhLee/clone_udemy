"use server";

import { revalidatePath } from "next/cache";

import Categorys from "../database/models/categorys.model";
import { connectToDatabase } from "../database/mongoose";
//import { handleError } from "../utils";

export async function getAllCategory() {
  try {
    await connectToDatabase();

    const allCategory = await Categorys.find({}); // { userId: 1233; title: test;}
    console.log(allCategory);

    return JSON.parse(JSON.stringify(allCategory));
  } catch (error) {
    //handleError(error);

    console.log(" An error in action get all Category ne;", error);
  }
}
export async function createCategory(category: {
  userId: string;
  title: string;
}) {
  try {
    await connectToDatabase();

    const newCategory = await Categorys.create(category); // { userId: 1233; title: test;}

    console.log("newCategory", newCategory);
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    //handleError(error);

    console.log(" An error in action create Category", error);
  }
}
// GET ONE


