import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICountry extends Document {
    name: string;
    flag: string; // URL of the flag image
    code: string; // ISO code for reference
    createdAt: Date;
    updatedAt: Date;
}

const CountrySchema = new Schema<ICountry>(
    {
        name: {
            type: String,
            required: [true, "El nombre del país es requerido"],
            unique: true,
            trim: true,
        },
        flag: {
            type: String,
            required: [true, "La bandera es requerida"],
        },
        code: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation
const Country: Model<ICountry> = mongoose.models.Country || mongoose.model<ICountry>("Country", CountrySchema);

export default Country;
