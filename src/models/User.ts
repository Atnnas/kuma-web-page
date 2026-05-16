import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: "super_admin" | "admin" | "editor" | "user";
    isActive?: boolean;
    workoutCount?: number;
    streakDays?: number;
    lastWorkoutDate?: Date | null;
    lastStreakShownDate?: Date | null;
    lastStreakLossShownDate?: Date | null;
    dailyTrainingMinutes?: number;
    totalTrainingMinutes?: number;
    restDays?: number;
    favoriteRoutines?: string[];
    lastTrainingResetDate?: Date | null;
    emailVerified?: Date | null;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    timezone?: string;
    
    // Kuma Karate Card & Profile
    athleteProfile?: {
        birthDate: Date;
        weight: number;
        height: number;
        beltRank: string;
        phone: string;
        emergencyContact: {
            name: string;
            phone: string;
        };
        medicalConditions: string;
        specialization: "Kata" | "Kumite" | "Ambos";
        stats: {
            vel: number;
            pot: number;
            tec: number;
            res: number;
            esp: number;
            ovr: number;
        };
        kiaiReceived: number;
        isEnrolled: boolean;
    };

    achievements?: {
        slug: string;
        earnedAt: Date;
        metadata: {
            name: string;
            description: string;
            icon: string;
            color: string;
            rarity?: string;
        };
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Por favor proporciona un nombre"],
        },
        email: {
            type: String,
            required: [true, "Por favor proporciona un correo electrónico"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            select: false, // Security: Never return password by default
        },
        image: {
            type: String,
        },
        role: {
            type: String,
            enum: ["super_admin", "admin", "editor", "user"],
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        emailVerified: {
            type: Date,
            default: null,
        },
        workoutCount: {
            type: Number,
            default: 0,
        },
        streakDays: {
            type: Number,
            default: 0,
        },
        lastWorkoutDate: {
            type: Date,
            default: null,
        },
        lastStreakShownDate: {
            type: Date,
            default: null,
        },
        lastStreakLossShownDate: {
            type: Date,
            default: null,
        },
        dailyTrainingMinutes: {
            type: Number,
            default: 0,
        },
        totalTrainingMinutes: {
            type: Number,
            default: 0,
        },
        restDays: {
            type: Number,
            default: 0,
        },
        favoriteRoutines: {
            type: [{ type: Schema.Types.ObjectId, ref: "Routine" }],
            default: [],
        },
        lastTrainingResetDate: {
            type: Date,
            default: null,
        },
        verificationToken: {
            type: String,
            select: false,
        },
        verificationTokenExpires: {
            type: Date,
            select: false,
        },
        timezone: {
            type: String,
            default: "America/Costa_Rica",
        },
        achievements: {
            type: [
                {
                    slug: String,
                    earnedAt: { type: Date, default: Date.now },
                    metadata: {
                        name: String,
                        description: String,
                        icon: String,
                        color: String,
                        rarity: String,
                    },
                },
            ],
            default: [],
        },
        athleteProfile: {
            birthDate: Date,
            weight: Number,
            height: Number,
            beltRank: { type: String, default: "Blanco" },
            phone: String,
            emergencyContact: {
                name: String,
                phone: String
            },
            medicalConditions: String,
            specialization: { type: String, enum: ["Kata", "Kumite", "Ambos"], default: "Ambos" },
            stats: {
                vel: { type: Number, default: 10 },
                pot: { type: Number, default: 10 },
                tec: { type: Number, default: 10 },
                res: { type: Number, default: 10 },
                esp: { type: Number, default: 10 },
                ovr: { type: Number, default: 10 }
            },
            kiaiReceived: { type: Number, default: 0 },
            isEnrolled: { type: Boolean, default: false }
        },
    },
    {
        timestamps: true,
    }
);

// Force recreation of the model in development to apply schema updates
if (mongoose.models && mongoose.models.User) {
    delete (mongoose.models as any).User;
}
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
