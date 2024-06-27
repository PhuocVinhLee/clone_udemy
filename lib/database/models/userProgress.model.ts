import { Schema, model, models ,Document} from "mongoose";

export interface UserProgressType extends Document {
  _id: string;
  userId: string;
  chapterId: string;
  isCompleted: boolean;
 
  createdAt?: Date;
  updatedAt?: Date;
  
}
const UserProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  chapterId:{ type: Schema.Types.ObjectId, ref: "Chapters" },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserProgress = models?.UserProgress || model("UserProgress", UserProgressSchema);

export default UserProgress;
