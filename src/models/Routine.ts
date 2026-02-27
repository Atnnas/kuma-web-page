import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlock {
    type: "exercise" | "loop_start" | "loop_end";
    exercise_name: string;
    sets: number;
    reps: number;
    rest_seconds: number;
    measure_type: "reps" | "time";
    notes?: string;
    loop_count?: number; // Para loop_start
}

export interface IRoutine extends Document {
    title: string;
    slug: string;
    description: string;
    difficulty: "Principiante" | "Intermedio" | "Avanzado";
    estimated_duration: number; // in minutes
    equipment_types: string[];
    blocks: IBlock[];
    active: boolean;
    allowedUsers: mongoose.Types.ObjectId[];
    thumbnail?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlockSchema = new Schema<IBlock>({
    type: {
        type: String,
        enum: ["exercise", "loop_start", "loop_end"],
        default: "exercise"
    },
    exercise_name: { type: String, required: false }, // Opcional para loop_start/end
    sets: { type: Number, required: false },
    reps: { type: Number, required: false },
    rest_seconds: { type: Number, required: false },
    measure_type: {
        type: String,
        enum: ["reps", "time"],
        default: "reps"
    },
    notes: { type: String, required: false },
    loop_count: { type: Number, required: false }
});

const RoutineSchema = new Schema<IRoutine>(
    {
        title: {
            type: String,
            required: [true, "El título es requerido"],
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        description: {
            type: String,
            required: [true, "La descripción es requerida"]
        },
        difficulty: {
            type: String,
            enum: ["Principiante", "Intermedio", "Avanzado"],
            default: "Intermedio"
        },
        estimated_duration: {
            type: Number,
            required: true,
            min: 0
        },
        equipment_types: {
            type: [String],
            enum: ["equipo", "peso_corporal"],
            default: ["peso_corporal"]
        },
        blocks: [BlockSchema],
        active: {
            type: Boolean,
            default: true
        },
        allowedUsers: {
            type: [{ type: Schema.Types.ObjectId, ref: "User" }],
            default: []
        },
        thumbnail: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation
const Routine: Model<IRoutine> = mongoose.models.Routine || mongoose.model<IRoutine>("Routine", RoutineSchema);

export default Routine;
