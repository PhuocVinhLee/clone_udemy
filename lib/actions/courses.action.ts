"use server";

import { revalidatePath } from "next/cache";

import Courses from "../database/models/courses.model";
import { connectToDatabase } from "../database/mongoose";
//import { handleError } from "../utils";

// CREATE
// const course = await createCourses({
//   userId,
//   title,
// });

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

    const course = await Courses.findById(courseId);

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
