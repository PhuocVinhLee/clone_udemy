import coursesId from "@/app/(dashbroard)/(routes)/teacher/courses/[courseId]/page";
import { Schema, model, models, Document } from "mongoose";
import { boolean, number } from "zod";

export interface TransformedChapterId {
  _id: string;
  title: string;
  videoUrl: string;
}

export interface TransformedUserId {
  _id: string;
  username: string;
  photo: string;
  role: string;
}

export interface ReviewType extends Document {
  _id: string;
  chapterId: string;
  courseId: string;
  message: string;
  userId: string;
  starRating: number;
  root: boolean;
  rootId: string;
  seen: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema({
  chapterId: { type: Schema.Types.ObjectId, ref: "Chapters" },
  courseId: { type: Schema.Types.ObjectId, ref: "Courses" },

  message: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User" },

  root: { type: Boolean },
  rootId: { type: String },
  starRating: { type: Number },

  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Reviews = models?.Reviews || model("Reviews", ReviewSchema);

export default Reviews;
