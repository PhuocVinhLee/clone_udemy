import { Schema, Document, model, models, InferSchemaType } from "mongoose";
import { number, object, string } from "zod";

// export interface CourseType extends Document {
//   title: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }
export interface QuestionType extends Document {
  _id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  answer: string;
  questionTypeId: string;
  template: string;
  testCases: {
    _id: string;
    input: string;
    output: string;
    asexample: boolean;
    position: number;
  }[];
  isPublished: boolean;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const testCaseSchema = new Schema({
  input: { type: String },
  output: { type: String },
  asexample: { type: Boolean, default: false },
  position: { type: Number },
});
export interface TestCaseType extends Document {
  _id: string;
  input: string;
  output: string;
  position: number;
  asexample: boolean;
}

const QuestionsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  answer: {
    type: String,
  },
  
  questionTypeId: { type: Schema.Types.ObjectId, ref: "QuestionTypes" },
  template: {
    type: String,
  },
  testCases: {
    type: [testCaseSchema], // This specifies that testCases is an array of objects defined by testCaseSchema
  },
  isPublished: {
    type: Boolean,
    default: false,
  },

  categoryId: { type: Schema.Types.ObjectId, ref: "Categorys" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Questions = models?.Questions || model("Questions", QuestionsSchema);

export default Questions;
