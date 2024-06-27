import { Schema, model,Document, models } from "mongoose";

export interface ChapterType extends Document {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ChaptersSchema = new Schema({

  title: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  position: {
    type: Number,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  courseId:{ type: Schema.Types.ObjectId, ref: 'Courses' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Chapters = models?.Chapters || model("Chapters", ChaptersSchema);

export default Chapters;
