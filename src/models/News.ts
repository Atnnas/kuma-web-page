import mongoose, { Schema, Document, Model } from "mongoose";

export interface INews extends Document {
    title: string;
    description: string;
    image: string;
    category: "news" | "event" | "training";
    isPremium: boolean;
    date: Date;
    slug: string;
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
        slug: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation
const News: Model<INews> = mongoose.models.News || mongoose.model<INews>("News", NewsSchema);

export default News;
