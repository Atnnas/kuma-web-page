import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: "super_admin" | "editor" | "user";
    isActive?: boolean;
    emailVerified?: Date | null;
    verificationToken?: string;
    verificationTokenExpires?: Date;
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
            enum: ["super_admin", "editor", "user"],
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        emailVerified: {
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
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation of model in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
