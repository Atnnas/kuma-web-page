import mongoose, { Schema, Document, Model } from "mongoose";
import "./User";
export interface IAttendanceLog extends Document {
    user: mongoose.Types.ObjectId;
    sessions: ("Fuerza" | "Explosión" | "Técnica" | "Kata" | "Kumite")[];
    date: string;        // ISO Format YYYY-MM-DD for simple unique index checks
    checkInTime: Date;   // Actual timestamp
    status: "Presente" | "Tarde" | "Ausente";
    performance?: "Standard" | "Destacado" | "Elite" | "1" | "2" | "3" | "4" | "5";
    isMVP?: boolean;
    method: "Sensei_Manual" | "QR_Scan";
    createdAt: Date;
    updatedAt: Date;
}

const AttendanceLogSchema = new Schema<IAttendanceLog>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sessions: {
            type: [String],
            enum: ["Fuerza", "Explosión", "Técnica", "Kata", "Kumite"],
            default: [],
        },
        date: {
            type: String,
            required: true,
        },
        checkInTime: {
            type: Date,
            required: true,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["Presente", "Tarde", "Ausente"],
            default: "Presente",
        },
        performance: {
            type: String,
            enum: ["Standard", "Destacado", "Elite", "1", "2", "3", "4", "5"],
            default: "Standard",
        },
        isMVP: {
            type: Boolean,
            default: false,
        },
        method: {
            type: String,
            enum: ["Sensei_Manual", "QR_Scan"],
            default: "Sensei_Manual",
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to guarantee one athlete gets only one log per day
AttendanceLogSchema.index({ user: 1, date: 1 }, { unique: true });
AttendanceLogSchema.index({ date: 1 });
AttendanceLogSchema.index({ isMVP: 1 });

if (process.env.NODE_ENV !== "production") {
    delete (mongoose.models as any).AttendanceLog;
}

const AttendanceLog: Model<IAttendanceLog> = 
    mongoose.models.AttendanceLog || mongoose.model<IAttendanceLog>("AttendanceLog", AttendanceLogSchema);

export default AttendanceLog;
