import coursesId from "@/app/(dashbroard)/(routes)/teacher/courses/[courseId]/page";
import { Schema, model, models, Document } from "mongoose";
import { title } from "process";
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

export interface NotificationType extends Document {
  _id: string;
  userId: string;
  userIdReceve: string; // ID of the user receiving the notification
  chapterId?: string;
  courseId: string;
  id_message: string;
  type: "NEW:REVIEW" | "REPLAY:REVIEW" | "NEW:QANDA" | 
  "REPLAY:QANDA" | "COURSE_PURCHASE" | "OTHER"; // Type of notification
  title: string; // Title of the notification
  message: string; // Content or summary of the notification
  isSeen?: boolean; // Whether the notification has been read
  createdAt: Date;
}

const NotificationSchema = new Schema({
  chapterId: { type: Schema.Types.ObjectId, ref: "Chapters" },
  courseId: { type: Schema.Types.ObjectId, ref: "Courses" },
  id_message: { type: String },
  message: { type: String },
  title: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  userIdReceve: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String },
  isSeen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = models?.Notification || model("Notification", NotificationSchema);

export default Notification;
