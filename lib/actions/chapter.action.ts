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
  course: {
    courseId: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    isPublished?: boolean;
    category?: string;
    acttachments?: { name: string; url: string }[];
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
    console.log(course);
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
