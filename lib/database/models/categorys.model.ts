import { Schema, model, models } from "mongoose";


const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }

});

const Categorys = models?.Categorys || model("Categorys", CategorySchema);

export default Categorys;
  