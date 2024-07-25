import { Schema, model, models, Document } from "mongoose";
import { boolean } from "zod";

export interface QandAType extends Document {
  _id: string;
  chapterId: string;
  name: string;
  massage: string;
  userId: string;
  isTeacher: boolean;
  urlAvatar: string;
  root: boolean;
  relayId: string;
  nameRelpay: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const QandASchema = new Schema({
  chapterId: { type: String },
  name: {
    type: String,
    required: true,
  },
  massage: { type: String },
  userId: { type: String },
  isTeacher: { type: Boolean },
  urlAvatar: { type: String },
  root: { type: Boolean },
  relayId: { type: String },
  nameRelpay: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const QandA = models?.QandA || model("QandA", QandASchema);

export default QandA;
