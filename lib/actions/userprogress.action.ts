"use server";

import { revalidatePath } from "next/cache";

import Categorys from "../database/models/categorys.model";
import { connectToDatabase } from "../database/mongoose";
import Chapters from "../database/models/chapters.model";
import UserProgress from "../database/models/userProgress.model";
//import { handleError } from "../utils";

export async function getProgress(courseId: string, userId: string) {
  try {
    await connectToDatabase();

    const PublishedChapters = await Chapters.find({
      courseId,
      isPublished: true,
      userId,
    }).select("_id");
    console.log("PublishedChapters", PublishedChapters);

    const PublishedChaptersId = PublishedChapters.map((chapterId) => {
      // arr
      return chapterId._id;
    });

    const vaildCompleteChapters = await UserProgress.countDocuments({
      userId: userId,
      isCompleted: true,
      chapterId: { $in: PublishedChaptersId },
    });

    const progressPercentage =
      (vaildCompleteChapters / PublishedChaptersId.length) * 100;

    return progressPercentage;
  } catch (error) {
    //handleError(error);

    console.log(" An error in action get all Category", error);
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
export async function getCoursById(courseId: string) {
  try {
    await connectToDatabase();

    const course = await Categorys.findById(courseId);

    if (!course) throw new Error("Course not found");

    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action find a Course", error);
  }
}
//Update

type UpdateCourseParams = {
  course: {
    courseId: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    isPublished?: boolean;
    category?: string;
  };
  userId: string;
};
export async function updateCourse({ course, userId }: UpdateCourseParams) {
  try {
    await connectToDatabase();

    const coursToUpdate = await Categorys.findById(course.courseId);

    if (!coursToUpdate || coursToUpdate?.userId !== userId) {
      throw new Error("Unauthorized or image not found");
    }

    const updatedCourse = await Categorys.findByIdAndUpdate(
      course.courseId,
      course,
      {
        new: false,
      }
    );

    // revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedCourse));
  } catch (error) {
    // handleError(error)
    console.log(error);
  }
}
