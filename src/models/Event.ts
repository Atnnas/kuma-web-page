import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: {
        country: string;
        address: string;
        image: string; // URL of the country/place image
        mapLink?: string;
    };
    organizer: {
        name: string;
        logo: string; // URL of the organizer logo
    };

    type: "tournament" | "seminar" | "exam" | "camp" | "other";
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, "El nombre del evento es requerido"],
        },
        description: {
            type: String,
            required: [true, "La descripción es requerida"],
        },
        startDate: {
            type: Date,
            required: [true, "La fecha de inicio es requerida"],
        },
        endDate: {
            type: Date,
            required: [true, "La fecha de finalización es requerida"],
        },
        location: {
            country: { type: String, required: true },
            address: { type: String, required: true },
            image: { type: String, required: false },
            mapLink: { type: String, required: false }, // Google Maps Link
        },
        organizer: {
            name: { type: String, required: true },
            logo: { type: String, required: true },
        },

        type: {
            type: String,
            enum: ["tournament", "seminar", "exam", "camp", "other"],
            default: "other",
            required: true,
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
