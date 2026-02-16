import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
    title: string;
    description: string;
    href: string;
    icon: string; // Icon name from Phosphor Icons
    tag: string;
    color: string; // Tailwind gradient classes
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
    {
        title: {
            type: String,
            required: [true, "El título es requerido"],
        },
        description: {
            type: String,
            required: [true, "La descripción es requerida"],
        },
        href: {
            type: String,
            required: [true, "El enlace (href) es requerido"],
        },
        icon: {
            type: String,
            default: "Cube",
        },
        tag: {
            type: String,
            default: "Herramienta",
        },
        color: {
            type: String,
            default: "from-zinc-500/20 to-transparent",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation
const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
