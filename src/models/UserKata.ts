import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPoint {
    type: "hit" | "hold";
    start: number;
    duration?: number;
    name?: string;
    pulses?: number[];
}

export interface IUserKata extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    points: IPoint[];
    isCustom: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PointSchema = new Schema<IPoint>({
    type: { type: String, enum: ["hit", "hold"], required: true },
    start: { type: Number, required: true },
    duration: { type: Number },
    name: { type: String },
    pulses: { type: [Number], default: [] }
}, { _id: false });

const UserKataSchema = new Schema<IUserKata>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "UserId is required"],
        },
        name: {
            type: String,
            required: [true, "Kata name is required"],
        },
        points: {
            type: [PointSchema],
            default: [],
        },
        isCustom: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation
const UserKata: Model<IUserKata> = mongoose.models.UserKata || mongoose.model<IUserKata>("UserKata", UserKataSchema);

export default UserKata;
