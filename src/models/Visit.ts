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
        timestamps: false, // We use our own timestamp field, no need for updatedAt
        expireAfterSeconds: 60 * 60 * 24 * 365, // Optional: Auto-delete after 1 year to save space? Let's keep it simple for now and not expire.
    }
);

// Prevent recompilation
const Visit: Model<IVisit> = mongoose.models.Visit || mongoose.model<IVisit>("Visit", VisitSchema);

export default Visit;
