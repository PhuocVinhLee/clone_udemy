import coursesId from "@/app/(dashbroard)/(routes)/teacher/courses/[courseId]/page";
import { Schema, model, models, Document } from "mongoose";
import { boolean } from "zod";

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
export interface TransformedUserIdReplay {
  _id: string;
  username: string;
  photo: string;
  role: string;
}
export interface QandAType extends Document {
  _id: string;
  chapterId: string;
  courseId: string;
  // name: string;
  message: string;
  userId: string;
  //isTeacher: boolean;
  // urlAvatar: string;
  root: boolean;
  rootId: string;
  replayId: string; // _id
  // nameUserReplay: string;
  userIdReplay: string;
  seen: boolean,
  createdAt?: Date;
  updatedAt?: Date;
}

const QandASchema = new Schema({
  chapterId: { type: Schema.Types.ObjectId, ref: "Chapters" },
  courseId: { type: Schema.Types.ObjectId, ref: "Courses" },
  // name: {
  //   type: String,
  //   required: true,
  // },
  message: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  // isTeacher: { type: Boolean },
  // urlAvatar: { type: String },
  root: { type: Boolean },
  rootId: { type: String },
  replayId: { type: String },
  //nameUserReplay: { type: String },
  userIdReplay: { type: Schema.Types.ObjectId, ref: "User" },
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const QandA = models?.QandA || model("QandA", QandASchema);

export default QandA;
