import { Schema, model, models } from "mongoose";


const MuxdataSchema = new Schema({
  assertId: {
    type: String,
  },
  playbackId: {
    type: String,
  },
  chapterId: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Muxdata = models?.Muxdata || model("Muxdata", MuxdataSchema);

export default Muxdata;
