import { Schema, model, models } from "mongoose";


const PurchaseSchema = new Schema({
  userId: {
    type: String,
  },
  courseId:{ type: Schema.Types.ObjectId, ref: 'Courses' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Purchase = models?.Purchase || model("Purchase", PurchaseSchema);

export default Purchase;
