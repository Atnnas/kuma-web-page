import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoutineLog extends Document {
    user: mongoose.Types.ObjectId;
    routine: mongoose.Types.ObjectId;
    routineTitle: string;
    scheduledDuration: number; // In minutes (from Routine definition)
    startTime: Date;
    endTime?: Date;
    durationSeconds?: number; // Actual time spent
    completed: boolean;
    expiresAt?: Date; // TTL field for auto-deletion
    createdAt: Date;
    updatedAt: Date;
}

const RoutineLogSchema = new Schema<IRoutineLog>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        routine: {
            type: Schema.Types.ObjectId,
            ref: "Routine",
            required: true,
        },
        routineTitle: {
            type: String,
            required: true,
        },
        scheduledDuration: {
            type: Number,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endTime: {
            type: Date,
        },
        durationSeconds: {
            type: Number,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// TTL Index: Delete documents at the time specified by expiresAt
RoutineLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Prevent recompilation
const RoutineLog: Model<IRoutineLog> = mongoose.models.RoutineLog || mongoose.model<IRoutineLog>("RoutineLog", RoutineLogSchema);

export default RoutineLog;
