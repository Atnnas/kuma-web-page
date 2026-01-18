import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISystemLog extends Document {
    level: "ERROR" | "INFO" | "WARNING";
    message: string;
    stack_trace?: string;
    user_id?: string;
    context?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}

const SystemLogSchema = new Schema<ISystemLog>(
    {
        level: {
            type: String,
            enum: ["ERROR", "INFO", "WARNING"],
            required: true,
            default: "ERROR",
        },
        message: {
            type: String,
            required: true,
        },
        stack_trace: {
            type: String,
        },
        user_id: {
            type: String,
            index: true,
        },
        context: {
            type: String, // e.g., URL path or Function name
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true, // Auto-creates createdAt
        collection: "system_logs", // Explicit collection name
    }
);

const SystemLog: Model<ISystemLog> =
    mongoose.models.SystemLog || mongoose.model<ISystemLog>("SystemLog", SystemLogSchema);

export default SystemLog;
