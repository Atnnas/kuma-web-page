import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPendingUser extends Document {
    name: string;
    email: string;
    passwordHash: string; // Storing the hashed password temporarily
    verificationToken: string;
    verificationTokenExpires: Date;
    createdAt: Date;
}

const PendingUserSchema = new Schema<IPendingUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        verificationToken: { type: String, required: true },
        verificationTokenExpires: { type: Date, required: true, expires: 86400 }, // TTL index: auto-delete after 24h (86400s)
    },
    { timestamps: true }
);

// Prevent recompilation
const PendingUser: Model<IPendingUser> = mongoose.models.PendingUser || mongoose.model<IPendingUser>("PendingUser", PendingUserSchema);

export default PendingUser;
