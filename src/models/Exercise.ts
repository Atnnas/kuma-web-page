import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExercise extends Document {
    name: string;
    category: "Fuerza" | "Cardio" | "Flexibilidad" | "Técnica" | "Potencia";
    equipment: string[]; // ["Mancuernas", "Banda", "Ninguno"]
    difficulty: "Principiante" | "Intermedio" | "Avanzado";
    muscle_group?: string[];
    description?: string;
}

const ExerciseSchema = new Schema<IExercise>(
    {
        name: { type: String, required: true, unique: true, index: true },
        category: {
            type: String,
            enum: ["Fuerza", "Cardio", "Flexibilidad", "Técnica", "Potencia"],
            default: "Fuerza"
        },
        equipment: { type: [String], default: ["Ninguno"] },
        difficulty: {
            type: String,
            enum: ["Principiante", "Intermedio", "Avanzado"],
            default: "Intermedio"
        },
        muscle_group: { type: [String], default: [] },
        description: { type: String },
    },
    { timestamps: true }
);

// Prevent recompilation error in Next.js
const Exercise: Model<IExercise> = mongoose.models.Exercise || mongoose.model<IExercise>("Exercise", ExerciseSchema);

export default Exercise;
