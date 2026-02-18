import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRhythm extends Document {
    name: string;
    martialArt: string;
    style: string;
    points: {
        id: number;
        tiempo: number;
        tipo: "fluido" | "pulso";
        estado?: "inicio" | "final";
    }[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const RhythmSchema = new Schema<IRhythm>(
    {
        name: { type: String, required: true },
        martialArt: { type: String, required: true },
        style: { type: String, required: true },
        points: [
            new Schema(
                {
                    id: { type: Number, required: true },
                    tiempo: { type: Number, required: true },
                    tipo: { type: String, enum: ["fluido", "pulso"], required: true },
                    estado: { type: String, enum: ["inicio", "final"] },
                },
                { _id: false }
            ),
        ],
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

const Rhythm: Model<IRhythm> = mongoose.models.Rhythm || mongoose.model<IRhythm>("Rhythm", RhythmSchema);

export default Rhythm;
