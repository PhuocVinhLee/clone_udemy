import { Schema, model, models } from "mongoose";
import { describe } from "node:test";

const CoursesSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  price: {
    type: Number,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
  },
});

const Courses = models?.Courses || model("Courses", CoursesSchema);

export default Courses;
