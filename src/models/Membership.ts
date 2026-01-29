import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMembership extends Document {
    title: string;
    price: string; // Stored as string to allow text like "Free" or formatted currency
    frequency: string; // e.g. "mes", "clase", "semestre"
    features: string[];
    recommended: boolean;
    restricted: boolean;
    order: number;
}

const MembershipSchema = new Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    frequency: { type: String, required: true },
    features: { type: [String], required: true },
    recommended: { type: Boolean, default: false },
    restricted: { type: Boolean, default: false },
    order: { type: Number, required: true },
}, { timestamps: true, collection: 'Memberships' });

// Force delete model in dev to support hot reload
if (process.env.NODE_ENV !== "production") delete mongoose.models.Membership;

const Membership: Model<IMembership> = mongoose.models.Membership || mongoose.model<IMembership>("Membership", MembershipSchema);

export default Membership;
