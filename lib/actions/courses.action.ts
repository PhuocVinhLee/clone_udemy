"use server";

import { revalidatePath } from "next/cache";

import Courses from "../database/models/courses.model";
import { connectToDatabase } from "../database/mongoose";
//import { handleError } from "../utils";

// CREATE
export async function createCourses(courses: {
  userId: string;
  title: string;
}) {
  try {
    await connectToDatabase();

    const newCourses = await Courses.create(courses);

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

    if(!course) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action create Courses", error);
  }
}
