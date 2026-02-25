import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISession {
    group: string;
    time: string;
    description: string;
    icon: string; // "Users", "Trophy", "Zap", "Clock"
    color: string; // Tailwind gradient classes
}

export interface ISchedule extends Document {
    day: string; // "Lunes, Miércoles y Viernes", etc.
    order: number; // For sorting
    sessions: ISession[];
}

const SessionSchema = new Schema({
    group: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
});

const ScheduleSchema = new Schema({
    day: { type: String, required: true },
    order: { type: Number, required: true },
    sessions: [SessionSchema],
}, { timestamps: true, collection: 'Horarios' }); // Keep collection name for now

// Model name "Schedule" -> Collection "horarios"
if (process.env.NODE_ENV !== "production") delete mongoose.models.Schedule;
const Schedule: Model<ISchedule> = mongoose.models.Schedule || mongoose.model<ISchedule>("Schedule", ScheduleSchema);

export default Schedule;
