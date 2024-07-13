"use server";

import { revalidatePath } from "next/cache";

import Categorys from "../database/models/categorys.model";
import { connectToDatabase } from "../database/mongoose";
import Chapters from "../database/models/chapters.model";
import UserProgress from "../database/models/userProgress.model";
import { getUserById } from "./user.actions";
//import { handleError } from "../utils";

export async function getProgress(courseId: string, userId: string) {
  try {
    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found nek");
      return 0;
    }

    const PublishedChapters = await Chapters.find({
      courseId,
      isPublished: true,
      // userId: user._id,
    }).select("_id");
    console.log("PublishedChapters", PublishedChapters);

    const PublishedChaptersId = PublishedChapters.map((chapterId) => {
      // arr
      return chapterId._id;
    });

    const vaildCompleteChapters = await UserProgress.countDocuments({
      userId: user._id,
      isCompleted: true,
      chapterId: { $in: PublishedChaptersId },
    });

    console.log("vaildCompleteChapters\n", vaildCompleteChapters);
    const progressPercentage =
      (vaildCompleteChapters / PublishedChaptersId.length) * 100;
    console.log("progressPercentage\n", progressPercentage);

    if (!progressPercentage) return 0;
    return progressPercentage;
  } catch (error) {
    //handleError(error);

    console.log(" An error in action getProgress ", error);
    return 0;
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
