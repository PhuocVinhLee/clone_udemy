"use server";

import { revalidatePath } from "next/cache";

import Courses from "../database/models/courses.model";
import { connectToDatabase } from "../database/mongoose";
//import { handleError } from "../utils";
import Mux from "@mux/mux-node";
import { deleteChapter, getAllChapterByCourseId } from "./chapter.action";
import { deleteMuxdataByChapterId } from "./muxdata.action";
import mongoose, { Schema } from "mongoose";
import { getProgress } from "./userprogress.action";
import User from "../database/models/user.model";
import { getUserById } from "./user.actions";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});


export async function getCourseWithChapters(courseId: string) {
  const course = await Courses.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
    {
      $lookup: {
        from: 'chapters',
        let: { courseId: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$courseId', '$$courseId'] }, { $eq: ['$isPublished', true] }] } } },
          { $sort: { position: 1 } }, // Sort chapters by position in ascending order
        ],
        as: 'chapters'
      }
    }
  ]);

  return JSON.parse(JSON.stringify(course[0]));
}

export const  getCourseWithChaptersAndUserProgres = async (userId: string, courseId: string) =>{
  await connectToDatabase();
    
    const user = await getUserById(userId);  
    if (!user) {
      throw new Error("User not found");
      return [];
    }

  const course = await Courses.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
    {
      $lookup: {
        from: 'chapters',
        let: { courseId: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$courseId', '$$courseId'] }, { $eq: ['$isPublished', true] }] } } },
          { $sort: { position: 1 } },
          {
            $lookup: {
              from: 'userprogress',
              let: { chapterId: '$_id' },
              pipeline: [
                { $match: { $expr: { $and: [{ $eq: ['$chapterId', '$$chapterId'] }, { $eq: ['$userId', new mongoose.Types.ObjectId(user._id)] }] } } }
              ],
              as: 'userProgress'
            }
          },
          { $unwind: { path: '$userProgress', preserveNullAndEmptyArrays: true } }
        ],
        as: 'chapters'
      }
    }
  ]);
  return JSON.parse(JSON.stringify(course[0]));

  //return course[0];
}

type ActionGetAllCoursesRefProgressRefCategoryParams = {
  _id: string;
  courseId: string;
  title: string ;
  description: string ;
  imageUrl: string ;
  price: number ;
  isPublished: boolean ;
  category: { name: string; _id: string } ;
  progress: number ;
  chapters: { _id: string }[] ;
};
type CoursesParams = {
  userId: string;
  title?: string; // serach title
  categoryId?: string;
};

export const ActionGetAllCoursesRefProgressRefCategory = async ({
  categoryId,
  title,
  userId,
}: CoursesParams): Promise<
  ActionGetAllCoursesRefProgressRefCategoryParams[]
> => {
  try {
    await connectToDatabase();
    
    console.log(categoryId, title, userId);
    const user = await getUserById(userId);  
    if (!user) {
      throw new Error("User not found");
      return [];
    }

//...(categoryId && { categoryId: new  mongoose.Types.ObjectId(categoryId) }),
    const query = {
    ...(title && { title: { $regex: title, $options: "i" } }),
      isPublished: true,
      ...(categoryId && { categoryId: new  mongoose.Types.ObjectId(categoryId) }),
      
    };

    const coursesWithDetails = await Courses.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'chapters',
          let: { courseId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$courseId', '$$courseId'] }, { $eq: ['$isPublished', true] }] } } },
            { $project: { _id: 1 } }// only _id
          ],
          as: 'chapters',
        },
      },
      {
        $lookup: {
          from: "categorys",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "purchase",
          let: { courseId: "$_id", userId: (user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$courseId", "$$courseId"] },
                    { $eq: ["$userId", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "purchase",
        },
      },
      {
        $unwind: {
          path: "$purchase",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
   console.log("coursesWithDetails",coursesWithDetails)
    const courseWithProgress: ActionGetAllCoursesRefProgressRefCategoryParams[] =
      await Promise.all(
        coursesWithDetails.map(async (course) => {
          if (!course?.purchase?.length) {
            return {
              ...course,
              progress: null,
            };
          }
         

          // const progressPercentage = await getProgress(userId, course._id);
          // return {
          //   ...course,
          //   progress: progressPercentage,
          // };
        })
      );

      console.log("courseWithProgress",courseWithProgress)

      
    //return courseWithProgress;
    return JSON.parse(JSON.stringify(courseWithProgress));
  } catch (error) {
    //handleError(error);

    console.log(" An error in ActionGetAllCoursesRefProgressRefCategory", error);
  }
  return [];
};

export async function ActionGetAllCoursesByUserId(userId: string) {
  try {
    await connectToDatabase();

    const user = await getUserById(userId); 
    if (!user) {
   throw new Error("User not found");
    }

    const courses = await Courses.find({ userId: user._id }).sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    //handleError(error)
    console.log(
      " An error in action ActionGetAllCoursesByUserId Chapters",
      error
    );
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

//transition
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
// transition

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
