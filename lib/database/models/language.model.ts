import { Schema, model, models, Document } from "mongoose";

export interface LanguageType extends Document {
  _id: string;
  name: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const LanguageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Languages = models?.Languages || model("Languages", LanguageSchema);

export default Languages;
