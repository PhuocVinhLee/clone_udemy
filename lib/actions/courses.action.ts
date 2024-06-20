"use server";

import { revalidatePath } from "next/cache";

import Courses from "../database/models/courses.model";
import { connectToDatabase } from "../database/mongoose";
//import { handleError } from "../utils";
import Mux from "@mux/mux-node";
import { deleteChapter, getAllChapterByCourseId } from "./chapter.action";
import { deleteMuxdataByChapterId } from "./muxdata.action";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function ActionGetAllChapterByUserId(userId: string) {
  try {
    await connectToDatabase();

    const courses = await Courses.find({ userId }).sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action ActionGetAllChapterByUserId Chapters", error);
    return [];
  }
}

export async function deleteCourse(userId: string, courseId: string) {
  try {
    console.log("Start delete course\n");

    if (!userId) return null;
    const course = await Courses.findById(courseId);

    if (course) {
      const allChapters = await getAllChapterByCourseId(courseId);
      for (const chapter of allChapters) {
        if (chapter?.videoUrl) {
          const muxdataDeleted = await deleteMuxdataByChapterId(chapter._id);
          if (muxdataDeleted && muxdataDeleted.assertId) {
            await mux.video.assets.delete(muxdataDeleted.assertId);
          }
        }
        const chapterDeleted = await deleteChapter(chapter._id, courseId);
      }
      
    }
    const courseDeleted = await Courses.findByIdAndDelete(courseId);


    try {
      revalidatePath("/", "layout");
      
      console.log("Path revalidated in Course");
    } catch (err) {
      console.error("Error revalidating path:", err);

      // return res.status(500).json({ message: 'Error revalidating path' });
    }

    console.log("End delete chapter\n");

    return JSON.parse(JSON.stringify(courseDeleted));
  } catch (error) {
    console.log("An error in Delete Chapter out", error);
    return null;
  }
}

export async function createCourses(courses: {
  userId: string;
  title: string;
}) {
  try {
    await connectToDatabase();

    const newCourses = await Courses.create(courses); // { userId: 1233; title: test;}

    console.log("newCourses", newCourses);
    return JSON.parse(JSON.stringify(newCourses));
  } catch (error) {
    //handleError(error);

    console.log(" An error in action create Courses", error);
  }
}
// GET ONE
export async function getCoursById(courseId: string) {
  try {
    await connectToDatabase();
    console.log("courseId in Get one Course", courseId);
    const course = await Courses.findById(courseId);

    if (!course) throw new Error("Course not found");

    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action find a Course", error);
    return null;
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

    const coursToUpdate = await Courses.findById(course.courseId);

    if (!coursToUpdate || coursToUpdate?.userId !== userId) {
      throw new Error("Unauthorized or image not found");
    }
    console.log(course);
    const updatedCourse = await Courses.findByIdAndUpdate(
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
