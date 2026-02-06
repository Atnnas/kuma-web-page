import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable');
    process.exit(1);
}

const routineSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Principiante', 'Intermedio', 'Avanzado'], default: 'Intermedio' },
    estimated_duration: { type: Number, required: true },
    equipment: [{ type: String }],
    active: { type: Boolean, default: true },
    blocks: [
        {
            exercise_name: { type: String, required: true },
            sets: { type: Number, required: true },
            reps: { type: Number, required: true },
            rest_seconds: { type: Number, default: 60 },
            notes: { type: String },
            media_url: { type: String }
        }
    ]
}, { timestamps: true });

// Check if model exists before compiling to avoid OverwriteModelError if run multiple times in same process context (unlikely here but safe)
const Routine = mongoose.models.Routine || mongoose.model('Routine', routineSchema);

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const routineData = {
            title: "Rutina Diaria",
            description: "Mantenimiento general y movilidad para mantenerse activo fuera del dojo.",
            difficulty: "Intermedio",
            estimated_duration: 20,
            active: true,
            equipment: ["Ninguno"],
            blocks: [
                {
                    exercise_name: "Jumping Jacks",
                    sets: 3,
                    reps: 30,
                    rest_seconds: 30,
                    notes: "Calentamiento suave"
                },
                {
                    exercise_name: "Sentadillas",
                    sets: 3,
                    reps: 15,
                    rest_seconds: 45,
                    notes: "Espalda recta"
                }
            ]
        };

        // Check if it exists to avoid duplicates
        const existing = await Routine.findOne({ title: routineData.title });
        if (existing) {
            console.log('Routine "Rutina Diaria" already exists. Updating...');
            Object.assign(existing, routineData);
            await existing.save();
            console.log('Updated successfully.');
        } else {
            console.log('Creating new Routine...');
            await Routine.create(routineData);
            console.log('Created successfully.');
        }

        console.log('Done.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
