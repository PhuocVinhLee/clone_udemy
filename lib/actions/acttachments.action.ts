"use server";

import { revalidatePath } from "next/cache";

import Attachments from "../database/models/attachments.model";
import { connectToDatabase } from "../database/mongoose";
//import { handleError } from "../utils";

export async function deleteAttachments(attachmentId: string) {
  try {
    await connectToDatabase();

    const respon = await Attachments.findByIdAndDelete(attachmentId);
    console.log("respon",respon)
    return JSON.parse(JSON.stringify(respon));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action delete Attachments", error);
  }
}


export async function createAttachments(attachments: {
  name: string;
  url: string;
  courseId: string
}) {
  try {
    await connectToDatabase();

    const newAttachments = await Attachments.create(attachments); 

    console.log("newAttachments", newAttachments);
    return JSON.parse(JSON.stringify(newAttachments));
  } catch (error) {
    //handleError(error);

    console.log(" An error in action create Attachments", error);
  }
}
// GET ONE
export async function getAllAttachmentsByCourseId(courseId: string) {
  try {
    await connectToDatabase();

    const attachments = await Attachments.find({courseId});

    if (!attachments) throw new Error("Course not found");

    return JSON.parse(JSON.stringify(attachments));
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

    const coursToUpdate = await Attachments.findById(course.courseId);

    if (!coursToUpdate || coursToUpdate?.userId !== userId) {
      throw new Error("Unauthorized or image not found");
    }
console.log(course)
    const updatedCourse = await Attachments.findByIdAndUpdate(
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
