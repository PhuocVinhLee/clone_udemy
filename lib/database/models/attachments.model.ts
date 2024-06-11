import { Schema, model, models } from "mongoose";


const AttackmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }

});

const Acttachments = models?.Acttachments || model("Acttachments", AttackmentSchema);

export default Acttachments;
