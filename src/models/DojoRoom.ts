import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDojoRoom extends Document {
  roomCode: string; // e.g. "ABCXYZ"
  senseiEmail: string;
  senseiName: string;
  studentName?: string;
  active: boolean;
  lastActive: Date;
  meetLink?: string; // Link to Google Meet / Jitsi
  senseiPeerId?: string; // Dynamic PeerJS WebRTC ID of the Sensei
  studentPose?: {
    landmarks: Array<{
      x: number;
      y: number;
      z?: number;
      visibility?: number;
    }>;
    angles: {
      left: number;
      right: number;
    };
    alignmentScore: number;
    isAligned: boolean;
    mode: "superior" | "inferior";
  };
  sessionCapture?: {
    landmarks: Array<{
      x: number;
      y: number;
      z?: number;
      visibility?: number;
    }>;
    angles: {
      left: number;
      right: number;
    };
    mode: "superior" | "inferior";
  } | null;
  control: {
    presetId?: string; // ID of the reference preset
    guidedMode: boolean;
    tolerance: number;
    analysisMode: "superior" | "inferior" | "completo"; // Body region to analyze
    command: "save_pose" | "reset_pose" | "session_capture" | "clear_session_capture" | "none";
    newPoseName?: string; // name to save the captured pose as
    timestamp: number; // to avoid repeating command
  };
}

const DojoRoomSchema: Schema = new Schema({
  roomCode: { type: String, required: true, unique: true, index: true, uppercase: true, trim: true },
  senseiEmail: { type: String, required: true },
  senseiName: { type: String, required: true },
  studentName: { type: String },
  active: { type: Boolean, default: true },
  lastActive: { type: Date, default: Date.now },
  meetLink: { type: String, default: "" },
  senseiPeerId: { type: String, default: "" },
  studentPose: {
    landmarks: { type: Array, default: [] },
    angles: {
      left: { type: Number, default: 0 },
      right: { type: Number, default: 0 },
    },
    alignmentScore: { type: Number, default: 0 },
    isAligned: { type: Boolean, default: false },
    mode: { type: String, enum: ["superior", "inferior"], default: "superior" }
  },
  sessionCapture: {
    type: Schema.Types.Mixed,
    default: null
  },
  control: {
    presetId: { type: String, default: "" },
    guidedMode: { type: Boolean, default: true },
    tolerance: { type: Number, default: 15 },
    analysisMode: { type: String, enum: ["superior", "inferior", "completo"], default: "completo" },
    command: { type: String, enum: ["save_pose", "reset_pose", "session_capture", "clear_session_capture", "none"], default: "none" },
    newPoseName: { type: String, default: "" },
    timestamp: { type: Number, default: 0 }
  }
});

const DojoRoom: Model<IDojoRoom> =
  mongoose.models.DojoRoom || mongoose.model<IDojoRoom>("DojoRoom", DojoRoomSchema);

export default DojoRoom;
