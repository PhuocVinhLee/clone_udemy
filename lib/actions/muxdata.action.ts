"use server";

import { revalidatePath } from "next/cache";

import Muxdata from "../database/models/muxdata.model";
import { connectToDatabase } from "../database/mongoose";
//import { handleError } from "../utils";

// CREATE
// const course = await createMuxdata({
//   userId,
//   title,
// });

export async function createMuxdata(muxdata: {
  assertId: string;
  playbackId ?: string;
  chapterId: string;
}) {
  try {
    await connectToDatabase();

    const newMuxdata = await Muxdata.create(muxdata); // { userId: 1233; title: test;}

    console.log("newMuxdata", newMuxdata);
    return JSON.parse(JSON.stringify(newMuxdata));
  } catch (error) {
    //handleError(error);

    console.log(" An error in action create Muxdata", error);
  }
}
//Delete
export async function deleteMuxdataByChapterId(chapterId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const muxdataToDelete = await Muxdata.findOne({ chapterId });

    if (!muxdataToDelete) {
      return null;
    }

    // Delete user
    const deletedUser = await Muxdata.findByIdAndDelete(muxdataToDelete._id);

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    //handleError(error);
    console.log(" An error in action Delete a Muxda", error);
  }
}
// GET ONE
export async function getMuxdataByChapterId(chapterId: string) {
  try {
    await connectToDatabase();

    const muxdata = await Muxdata.findOne({chapterId});

    if (!muxdata) throw new Error("Mux not found");

    return JSON.parse(JSON.stringify(muxdata));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action find a Mux", error);
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

    const coursToUpdate = await Muxdata.findById(course.courseId);

    if (!coursToUpdate || coursToUpdate?.userId !== userId) {
      throw new Error("Unauthorized or image not found");
    }
    console.log(course);
    const updatedCourse = await Muxdata.findByIdAndUpdate(
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
