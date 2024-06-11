"use server";

import { revalidatePath } from "next/cache";

import Chapters from "../database/models/chapters.model";
import { connectToDatabase } from "../database/mongoose";
//import { handleError } from "../utils";

export async function getAllChapterByCourseId(courseId: string) {
    try {
      await connectToDatabase();
  
      const chapters = await Chapters.find({courseId});
  
      if (!chapters) throw new Error("Course not found");
  
      return JSON.parse(JSON.stringify(chapters));
    } catch (error) {
      //handleError(error)
      console.log(" An error in action getAllChapterByCourseId Chapters", error);
    }
  }
export async function createChapter(chapter: {
  title: string;
  description?: string;
  video?: string;
  position?: number;
  isPublished?: boolean;
  isFree?: boolean;
  courseId?: string;
}) {
  try {
    await connectToDatabase();

    const newChapter = await Chapters.create(chapter); // { userId: 1233; title: test;}

    console.log("newChapter", newChapter);
    return JSON.parse(JSON.stringify(newChapter));
  } catch (error) {
    //handleError(error);

    console.log(" An error in action create Chapter", error);
  }
}
// GET ONE
export async function getChapterById(courseId: string) {
  try {
    await connectToDatabase();

    const course = await Chapters.findById(courseId);

    if (!course) throw new Error("Course not found");

    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action find a Course", error);
  }
}
//Update

type UpdateCourseParams = {
  course : {
    courseId: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    isPublished?: boolean;
    category?: string;
    acttachments?: {name: string; url: string}[];
  };
  userId: string;
};
export async function updateCourse({ course, userId }: UpdateCourseParams) {
  try {
    await connectToDatabase();

    const coursToUpdate = await Chapters.findById(course.courseId);

    if (!coursToUpdate || coursToUpdate?.userId !== userId) {
      throw new Error("Unauthorized or image not found");
    }
console.log(course)
    const updatedCourse = await Chapters.findByIdAndUpdate(
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
