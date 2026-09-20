import mongoose, { Schema, Document, Model } from "mongoose";
import { PathType } from "@/types/didactica";

export interface IDidacticProgress extends Document {
    userId: mongoose.Types.ObjectId;
    completedLevelIds: string[];
    levelStars: Record<string, number>;
    xp: number;
    streak: number;
    lastActiveDate: string; // YYYY-MM-DD
    hearts: number;
    lastHeartRefill: number;
    activePath: PathType;
    lastVisitedTimestamp?: number;
    levelLastPracticed?: Record<string, number>;
    createdAt: Date;
    updatedAt: Date;
}

const DidacticProgressSchema = new Schema<IDidacticProgress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "UserId is required"],
            unique: true,
            index: true,
        },
        completedLevelIds: {
            type: [String],
            default: [],
        },
        levelStars: {
            type: Map,
            of: Number,
            default: {},
        },
        xp: {
            type: Number,
            default: 0,
        },
        streak: {
            type: Number,
            default: 0,
        },
        lastActiveDate: {
            type: String,
            default: () => new Date().toISOString().split("T")[0],
        },
        hearts: {
            type: Number,
            default: 5,
        },
        lastHeartRefill: {
            type: Number,
            default: () => Date.now(),
        },
        activePath: {
            type: String,
            enum: ["tradicional", "wkf"],
            default: "tradicional",
        },
        lastVisitedTimestamp: {
            type: Number,
            default: () => Date.now(),
        },
        levelLastPracticed: {
            type: Map,
            of: Number,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

const DidacticProgress: Model<IDidacticProgress> =
    mongoose.models.DidacticProgress ||
    mongoose.model<IDidacticProgress>("DidacticProgress", DidacticProgressSchema);

export default DidacticProgress;
