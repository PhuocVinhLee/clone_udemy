"use server";

import { revalidatePath } from "next/cache";

import Chapters from "../database/models/chapters.model";
import Courses from "../database/models/courses.model";
import { connectToDatabase } from "../database/mongoose";
import { updateCourse } from "./courses.action";
import { deleteMuxdta } from "./muxdata.action";
//import { handleError } from "../utils";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function deleteChapter2(
  userId: string,
  chapterId: string,
  courseId: string
) {
  try {
    if (!userId) {
      return new NextResponse("Anauthorrided Error", { status: 401 });
    }
    await connectToDatabase();

    const courseToUpdate = await Courses.findById(courseId);
    if (!courseToUpdate || courseToUpdate?.userId !== userId) {
      throw new Error("Unauthorized or Course not found");
    }
    const chapterDeleted = await deleteChapter(chapterId, courseId);
    if (!chapterDeleted) {
      return null;
    }
    if (chapterDeleted && chapterDeleted.videoUrl) {
      const muxdataDeleted = await deleteMuxdta(chapterId);
      console.log("muxdataDeleted", muxdataDeleted);

      if (muxdataDeleted && muxdataDeleted.assertId) {
        await mux.video.assets.delete(muxdataDeleted.assertId);
      }
    }

    // find allchapter => check this course has any chapter to publish
    const allChapterByCourseId = await getAllChapterByCourseId(courseId);
    if (!allChapterByCourseId?.length) {
      const DataCourse = {
        isPublished: false,
      };
      const updatedCourse = await Courses.findByIdAndUpdate(
        courseId,
        DataCourse,
        {
          new: false,
        }
      );
    }
    revalidatePath(
      "/(dashbroard)/(routes)/teacher/courses/[courseId]",
      "layout"
    );
    return JSON.parse(JSON.stringify(chapterDeleted));
  } catch (error) {
    console.log("An error in Delete Chapter out", error);
    return null;
  }
}

// pass
export async function getChapterHasEndPosition(courseId: string) {
  try {
    await connectToDatabase();

    const chapter = await Chapters.findOne({ courseId: courseId })
      .sort({ position: -1 })
      .exec();
    console.log("course iD in chapter", courseId);
    //revalidatePath("/", "layout");
    //revalidatePath(`/teacher/courses/${courseId}`);
    return chapter; // return null when it not exsis
  } catch (error) {
    //handleError(error)
    console.log(" An error in action Delete Chapters", error);
    return null;
  } finally {
  }
}

export async function deleteChapter(chapterId: string, courseId: string) {
  try {
    await connectToDatabase();

    const chapterDeleted = await Chapters.findByIdAndDelete(chapterId);
    console.log("course iD in chapter", courseId);
    //revalidatePath("/", "layout");
    //revalidatePath(`/teacher/courses/${courseId}`);
    return chapterDeleted; // return null when it not exsis
  } catch (error) {
    //handleError(error)
    console.log(" An error in action Delete Chapters in", error);
    return null;
  } finally {
  }
}

export async function getAllChapterByCourseId(courseId: string) {
  try {
    await connectToDatabase();

    const chapters = await Chapters.find({ courseId }).sort({ position: 1 });

    return JSON.parse(JSON.stringify(chapters));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action getAllChapterByCourseId Chapters", error);
    return [];
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

    return JSON.parse(JSON.stringify(chapter));
  } catch (error) {
    //handleError(error)
    console.log(" An error in action find a Chapter", error);
    return null;
  }
}
//Update

type UpdateChapterParams = {
  chapter: {
    courseId: string;
    title?: string;
    position?: number;
    description?: string;
    videoUrl?: string;
    isPublished?: boolean;
    isFree?: boolean;
  };
  chapterId: string;
  userId: string;
};

//pass
export async function updateChapter({
  chapter,
  userId,
  chapterId,
}: UpdateChapterParams) {
  try {
    await connectToDatabase();

    const coursToUpdate = await Courses.findById(chapter.courseId);

    if (!coursToUpdate || coursToUpdate?.userId !== userId) {
      throw new Error("Unauthorized or Couese not found");
    }

    const updatedChapter = await Chapters.findByIdAndUpdate(
      chapterId,
      chapter,
      {
        new: false,
      }
    );

    // revalidatePath(path);
    // revalidatePath(`/teacher/courses/${chapter.courseId}`);
    return JSON.parse(JSON.stringify(updatedChapter));
  } catch (error) {
    // handleError(error)
    console.log(error);
  }
}
