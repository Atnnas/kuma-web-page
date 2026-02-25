"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Product, { IProduct } from "@/models/Product";
import { revalidatePath } from "next/cache";

// --- GET Actions ---

export async function getProducts(filter: "all" | "active" = "active") {
    try {
        await connectDB();
        const query = filter === "active" ? { isActive: true } : {};
        // Sort by newest first
        const products = await Product.find(query).sort({ createdAt: -1 }).lean();

        // Convert _id to string for serialization
        return products.map((product) => ({
            ...product,
            _id: product._id.toString(),
            createdAt: product.createdAt?.toISOString(),
            updatedAt: product.updatedAt?.toISOString(),
        }));
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export async function getProductById(id: string) {
    try {
        await connectDB();
        console.log(`[DEBUG] getProductById called with ID: ${id}`);
        console.log(`[DEBUG] Targeting Collection: ${Product.collection.name}`);

        // Try standard findById
        let product = await Product.findById(id).lean();

        // Backup: Try creating ObjectId explicit
        if (!product) {
            console.log("[DEBUG] First attempt failed. Trying explicit ObjectId cast.");
            if (mongoose.Types.ObjectId.isValid(id)) {
                product = await Product.findOne({ _id: new mongoose.Types.ObjectId(id) }).lean();
            }
        }

        console.log(`[DEBUG] Search Result:`, product ? "FOUND" : "NOT FOUND");

        if (!product) return null;

        return {
            ...product,
            _id: product._id.toString(),
            createdAt: product.createdAt?.toISOString(),
            updatedAt: product.updatedAt?.toISOString(),
        };
    } catch (error) {
        console.error("[DEBUG] Failed to fetch product:", error);
        return null;
    }
}

// --- ADMIN Actions ---

export async function createProduct(data: any) {
    try {
        await connectDB();

        // Generate simple slug from name
        const slug = data.name
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "") + "-" + Date.now().toString().slice(-4);

        const newProduct = new Product({
            ...data,
            slug,
        });

        await newProduct.save();
        revalidatePath("/shop");
        revalidatePath("/admin/shop");
        return { success: true, message: "Producto creado exitosamente" };
    } catch (error: any) {
        console.error("Failed to create product:", error);
        return { success: false, message: error.message };
    }
}

export async function updateProduct(id: string, data: any) {
    try {
        await connectDB();

        // If name changes, we might want to update slug, but usually better to keep slug stable or handle redirects.
        // For simplicity, we won't regenerate slug on update unless explicitly needed.

        await Product.findByIdAndUpdate(id, data, { new: true });

        revalidatePath("/shop");
        revalidatePath("/admin/shop");
        return { success: true, message: "Producto actualizado exitosamente" };
    } catch (error: any) {
        console.error("Failed to update product:", error);
        return { success: false, message: error.message };
    }
}

export async function deleteProduct(id: string) {
    try {
        await connectDB();
        await Product.findByIdAndDelete(id);

        revalidatePath("/shop");
        revalidatePath("/admin/shop");
        return { success: true, message: "Producto eliminado" };
    } catch (error: any) {
        console.error("Failed to delete product:", error);
        return { success: false, message: error.message };
    }
}

export async function toggleProductStatus(id: string, isActive: boolean) {
    try {
        await connectDB();
        await Product.findByIdAndUpdate(id, { isActive });

        revalidatePath("/shop");
        revalidatePath("/admin/shop");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to toggle status:", error);
        return { success: false, message: error.message };
    }
}
