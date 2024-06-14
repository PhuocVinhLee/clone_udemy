"use server";

import { revalidatePath } from "next/cache";

import Chapters from "../database/models/chapters.model";
import Courses from "../database/models/courses.model";
import { connectToDatabase } from "../database/mongoose";
//import { handleError } from "../utils";

export async function getAllChapterByCourseId(courseId: string) {
  try {
    await connectToDatabase();

    const chapters = await Chapters.find({ courseId }).sort({ position: 1 });

    if (!chapters) throw new Error("Course not found");

    return JSON.parse(JSON.stringify(chapters));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action getAllChapterByCourseId Chapters", error);
  }
}
export async function updateArrayChapter({
  userId,
  courseId,
  arrayChapter,
}: {
  courseId: string;
  userId: string;
  arrayChapter: { position: number; _id: string }[];
}) {
  try {
    await connectToDatabase();

    const coursToUpdate = await Courses.findById(courseId);

    if (!coursToUpdate || coursToUpdate?.userId !== userId) {
      throw new Error("Unauthorized or Course not found");
    }
    for (const chapter of arrayChapter) {
      const updatedChapter = await Chapters.findByIdAndUpdate(
        chapter._id,
        { position: chapter.position },
        {
          new: false,
        }
      );
    }

    // revalidatePath(path);

    return JSON.parse(JSON.stringify(true));
  } catch (error) {
    // handleError(error)
    console.log(error);
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
export async function getChapterById(_id: string) {
  try {
    await connectToDatabase();

    const chapter = await Chapters.findById(_id);

    if (!chapter) throw new Error("Chapter not found");

    return JSON.parse(JSON.stringify(chapter));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action find a Chapter", error);
  }
}
//Update

type UpdateChapterParams = {
  chapter: {
    courseId: string;
    title?: string;
    position?: number;
    isPublished?: boolean;
    isFree?: boolean;
  };
  chapterId: string;
  userId: string;
};
export async function updateChapter({ chapter, userId, chapterId }: UpdateChapterParams) {
  try {
    await connectToDatabase();

    const coursToUpdate = await Courses.findById(chapter.courseId);

    if (!coursToUpdate || coursToUpdate?.userId !== userId) {
      throw new Error("Unauthorized or Couese not found");
    }

    const updatedChapter= await Chapters.findByIdAndUpdate(
      chapterId,
      chapter,
      {
        new: false,
      }
    );

    // revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedChapter));
  } catch (error) {
    // handleError(error)
    console.log(error);
  }
}
