import { Schema,Document, model, models, InferSchemaType } from "mongoose";



// export interface CourseType extends Document {
//   title: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }
export interface CourseType extends Document {
  _id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  isPublished: boolean;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  
}


const CoursesSchema = new Schema({
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
  price: {  
    type: Number,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  categoryId: { type: Schema.Types.ObjectId, ref: "Categorys" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Courses = models?.Courses || model("Courses", CoursesSchema);

export default Courses;
