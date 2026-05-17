import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAttendanceLog extends Document {
    user: mongoose.Types.ObjectId;
    sessionName: "Fuerza" | "Explosión" | "Técnica" | "Kata" | "Kumite";
    date: string;        // ISO Format YYYY-MM-DD for simple unique index checks
    checkInTime: Date;   // Actual timestamp
    status: "Presente" | "Tarde" | "Ausente";
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
        sessionName: {
            type: String,
            enum: ["Fuerza", "Explosión", "Técnica", "Kata", "Kumite"],
            required: true,
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

// Compound index to guarantee one athlete gets only one log per session per day
AttendanceLogSchema.index({ user: 1, date: 1, sessionName: 1 }, { unique: true });

if (process.env.NODE_ENV !== "production") {
    delete (mongoose.models as any).AttendanceLog;
}

const AttendanceLog: Model<IAttendanceLog> = 
    mongoose.models.AttendanceLog || mongoose.model<IAttendanceLog>("AttendanceLog", AttendanceLogSchema);

export default AttendanceLog;
