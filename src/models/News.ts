import mongoose, { Schema, Document, Model } from "mongoose";

export interface INews extends Document {
    title: string;
    description: string;
    image: string;
    images?: string[];
    category: "news" | "event" | "training";
    isPremium: boolean;
    date: Date;
    slug: string;
    newsNumber?: number; // Optional on interface for now
    createdAt: Date;
    updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
    {
        title: {
            type: String,
            required: [true, "El título es requerido"],
        },
        description: {
            type: String,
            required: [true, "La descripción es requerida"],
        },
        image: {
            type: String,
            required: [true, "La imagen es requerida"],
        },
        category: {
            type: String,
            enum: ["news", "event", "training"],
            required: true,
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        // For sequential URLs
        newsNumber: {
            type: Number,
            unique: false, // Unique false for now to avoid issues with existing data, can handle logic manually
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        images: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation
const News: Model<INews> = mongoose.models.News || mongoose.model<INews>("News", NewsSchema);

export default News;
