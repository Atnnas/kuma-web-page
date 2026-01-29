import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: "Equipo" | "Ropa" | "Suplementos" | "Accesorios" | "Otros"; // Categorías sugeridas
    stock: number;
    images: string[]; // Array de strings base64 o URLs
    isActive: boolean;
    features?: string[]; // Lista de características (bullets)
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, "El nombre del producto es requerido"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "La descripción es requerida"],
        },
        price: {
            type: Number,
            required: [true, "El precio es requerido"],
            min: 0,
        },
        category: {
            type: String,
            required: [true, "La categoría es requerida"],
            enum: ["Equipo", "Ropa", "Suplementos", "Accesorios", "Otros"],
            default: "Otros",
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        images: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        features: {
            type: [String],
            default: [],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
