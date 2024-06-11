import { Schema, model, models } from "mongoose";
import { describe } from "node:test";

const UserProgressSchema = new Schema({
  userId: {
    type: String,
  },
  chapterId: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserProgress = models?.UserProgress || model("UserProgress", UserProgressSchema);

export default UserProgress;
