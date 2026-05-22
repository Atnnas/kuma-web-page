"use server";

import connectDB from "@/lib/db";
import Dojo from "@/models/Dojo";
import { requireSuperAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

/**
 * Fetch all Dojos in the repository
 */
export async function getDojos() {
    try {
        await connectDB();
        const dojos = await Dojo.find({}).sort({ name: 1 }).lean();
        
        // Serialize mongoose documents to plain objects
        const serializedDojos = dojos.map((dojo) => ({
            _id: dojo._id.toString(),
            name: dojo.name,
            logo: dojo.logo,
            createdAt: dojo.createdAt ? new Date(dojo.createdAt).toISOString() : undefined,
            updatedAt: dojo.updatedAt ? new Date(dojo.updatedAt).toISOString() : undefined,
        }));
        
        return {
            success: true,
            data: serializedDojos
        };
    } catch (error: any) {
        console.error("Error fetching dojos:", error);
        return { success: false, error: error?.message || String(error) };
    }
}

/**
 * Create a new Dojo in the repository
 */
export async function createDojo(data: { name: string; logo: string }) {
    try {
        await requireSuperAdmin();
        await connectDB();

        const { name, logo } = data;
        if (!name?.trim()) {
            return { success: false, error: "El nombre del dojo es requerido" };
        }
        if (!logo) {
            return { success: false, error: "El logo del dojo es requerido" };
        }

        // Check if dojo already exists
        const exists = await Dojo.findOne({ name: name.trim() });
        if (exists) {
            return { success: false, error: "Ya existe un dojo con este nombre" };
        }

        const newDojo = await Dojo.create({
            name: name.trim(),
            logo
        });

        revalidatePath("/admin/athletes");
        return { 
            success: true, 
            data: {
                _id: newDojo._id.toString(),
                name: newDojo.name,
                logo: newDojo.logo,
                createdAt: newDojo.createdAt ? new Date(newDojo.createdAt).toISOString() : undefined,
                updatedAt: newDojo.updatedAt ? new Date(newDojo.updatedAt).toISOString() : undefined,
            }
        };
    } catch (error: any) {
        console.error("Error creating dojo:", error);
        return { success: false, error: error?.message || String(error) };
    }
}
