import { Schema, Document, model, models, InferSchemaType } from "mongoose";
import { number, object, string } from "zod";

// export interface CourseType extends Document {
//   title: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }
export interface QuestionStudentType extends Document {
  _id: string;
  userId: string;
  questionId: string;
  answer: string;
  subAnswer: string;
  gotAnwsers: {
    _id: string;
    input: string;
    output: string;
    got: string;
  }[];
  isCorrect: boolean;
  flag: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
const gotAnwsersSchema = new Schema({
  input: { type: String },
  output: { type: String },
  got: { type: String },
});

const QuestionsStudentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  questionId: { type: Schema.Types.ObjectId, ref: "QuestionChapters" },
  answer: {
    type: String,
  },
  subAnswer: {
    type: String,
  },

  isCorrect: {
    type: Boolean,
    default: false,
  },
  flag: {
    type: Boolean
  },

  gotAnwsers: {
    type: [gotAnwsersSchema],
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const QuestionStudents =
  models?.QuestionStudents || model("QuestionStudents", QuestionsStudentSchema);

export default QuestionStudents;
