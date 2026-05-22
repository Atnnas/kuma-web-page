import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDojo extends Document {
    name: string;
    logo: string; // base64 image data or URL
    createdAt: Date;
    updatedAt: Date;
}

const DojoSchema = new Schema<IDojo>(
    {
        name: {
            type: String,
            required: [true, "El nombre del dojo es requerido"],
            unique: true,
            trim: true,
        },
        logo: {
            type: String,
            required: [true, "El logo del dojo es requerido"],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation in development
const Dojo: Model<IDojo> = mongoose.models.Dojo || mongoose.model<IDojo>("Dojo", DojoSchema);

export default Dojo;
