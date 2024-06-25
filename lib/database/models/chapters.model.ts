import { Schema, model, models } from "mongoose";


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
