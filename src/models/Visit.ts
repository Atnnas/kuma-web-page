import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisit extends Document {
    path: string;
    visitorId?: string; // Optional: simple hash for unique visitor counting per day
    timestamp: Date;
    userAgent?: string;
    geo?: {
        country?: string;
        region?: string;
        city?: string;
        ip?: string;
    };
}

const VisitSchema = new Schema<IVisit>(
    {
        path: {
            type: String,
            required: true,
        },
        visitorId: {
            type: String,
        },
        userAgent: {
            type: String,
        },
        geo: {
            country: String,
            region: String,
            city: String,
            ip: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
    }
);

// Define schema indexes
VisitSchema.index({ timestamp: -1 });
// TTL Index: Auto-delete analytics visits older than 180 days (6 months) to prevent unbounded DB growth
VisitSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });

// Prevent recompilation
const Visit: Model<IVisit> = mongoose.models.Visit || mongoose.model<IVisit>("Visit", VisitSchema);

export default Visit;
