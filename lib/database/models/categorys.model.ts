import { Schema, model, models } from "mongoose";


const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },

});

const Categorys = models?.Categorys || model("Categorys", CategorySchema);

export default Categorys;
