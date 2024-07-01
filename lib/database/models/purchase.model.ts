import { Schema, model, models, Document } from "mongoose";

export interface PurchaseType extends Document {
  _id: string;
  userId: string;
  courseId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const PurchaseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  courseId: { type: Schema.Types.ObjectId, ref: "Courses" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Purchase = models?.Purchase || model("Purchase", PurchaseSchema);

export default Purchase;
