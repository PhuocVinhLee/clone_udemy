import { Schema, model, models } from "mongoose";
import { describe } from "node:test";

const PurchaseSchema = new Schema({
  userId: {
    type: String,
  },
  courseId: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Purchase = models?.Purchase || model("Purchase", PurchaseSchema);

export default Purchase;
