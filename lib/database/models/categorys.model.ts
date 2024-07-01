import { Schema, model, models, Document } from "mongoose";

export interface CategoryType extends Document {
  _id: string;
  name: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Categorys = models?.Categorys || model("Categorys", CategorySchema);

export default Categorys;
