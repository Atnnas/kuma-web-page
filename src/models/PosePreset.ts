import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPosePreset extends Document {
  name: string;
  category: "superior" | "inferior";
  angles: {
    left: number;
    right: number;
  };
  landmarks: Array<{
    x: number;
    y: number;
    z?: number;
    visibility?: number;
  }>;
  createdBy: string;
  createdAt: Date;
}

const PosePresetSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: { type: String, enum: ["superior", "inferior"], required: true },
  angles: {
    left: { type: Number, required: true },
    right: { type: Number, required: true },
  },
  landmarks: { type: Array, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PosePreset: Model<IPosePreset> =
  mongoose.models.PosePreset || mongoose.model<IPosePreset>("PosePreset", PosePresetSchema);

export default PosePreset;
