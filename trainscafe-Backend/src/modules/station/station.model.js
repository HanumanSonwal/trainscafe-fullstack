import mongoose from "mongoose";
import { getNextSequence } from "../../utils/sequence.util.js";

const stationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    location: String,
    address: String,
    status: { type: Boolean, default: true },
    stationId: { type: Number, unique: true, index: true },
  },
  { timestamps: true }
);

stationSchema.pre("save", async function () {
  if (!this.isNew) return;

  this.stationId = await getNextSequence(
    "stationId",
    mongoose.model("Station"),
    "stationId"
  );
});

export default mongoose.model("Station", stationSchema);