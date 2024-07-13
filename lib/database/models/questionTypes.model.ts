import { Schema, model, models, Document } from "mongoose";

export interface QuestionTypeType extends Document {
  _id: string;
  template: string;
  name: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const QuestionTypeSchema = new Schema({
  template: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const QuestionTypes = models?.QuestionTypes || model("QuestionTypes", QuestionTypeSchema);

export default QuestionTypes;
