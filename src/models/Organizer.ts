import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrganizer extends Document {
    name: string;
    logo: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrganizerSchema = new Schema<IOrganizer>(
    {
        name: {
            type: String,
            required: [true, "El nombre del organizador es requerido"],
            unique: true,
            trim: true,
        },
        logo: {
            type: String, // Base64 or URL
            required: [true, "El logo es requerido"],
        },
    },
    {
        timestamps: true,
    }
);

const Organizer: Model<IOrganizer> = mongoose.models.Organizer || mongoose.model<IOrganizer>("Organizer", OrganizerSchema);

export default Organizer;
