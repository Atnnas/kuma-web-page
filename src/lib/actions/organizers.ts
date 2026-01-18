"use server";

import connectDB from "@/lib/db";
import Organizer, { IOrganizer } from "@/models/Organizer";
import Event from "@/models/Event";
import { requireSuperAdmin, getCurrentUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

// --- CRUD ---

export async function getOrganizers() {
    try {
        const user = await getCurrentUser();
        // Allow any authenticated user (admin/editor) to READ organizers for the dropdown
        if (!user) return [];

        await connectDB();
        const organizers = await Organizer.find({}).sort({ name: 1 }).lean();

        return organizers.map((org: any) => ({
            ...org,
            _id: org._id.toString(),
            id: org._id.toString(),
        }));
    } catch (error) {
        console.error("Error fetching organizers:", error);
        return [];
    }
}

export async function createOrganizer(data: { name: string; logo: string }) {
    try {
        await requireSuperAdmin();
        await connectDB();

        const exists = await Organizer.findOne({ name: data.name });
        if (exists) {
            return { success: false, error: "Ya existe un organizador con este nombre." };
        }

        await Organizer.create(data);
        revalidatePath("/admin/organizers");
        return { success: true };
    } catch (error) {
        console.error("Error creating organizer:", error);
        return { success: false, error: "Error al crear organizador." };
    }
}

export async function updateOrganizer(id: string, data: { name: string; logo: string }) {
    try {
        await requireSuperAdmin();
        await connectDB();

        await Organizer.findByIdAndUpdate(id, data);
        revalidatePath("/admin/organizers");
        return { success: true };
    } catch (error) {
        console.error("Error updating organizer:", error);
        return { success: false, error: "Error al actualizar organizador." };
    }
}

export async function deleteOrganizer(id: string) {
    try {
        await requireSuperAdmin();
        await connectDB();

        await Organizer.findByIdAndDelete(id);
        revalidatePath("/admin/organizers");
        return { success: true };
    } catch (error) {
        console.error("Error deleting organizer:", error);
        return { success: false, error: "Error al eliminar organizador." };
    }
}

// --- SPECIAL: SEED FROM EVENTS ---
export async function seedOrganizersFromEvents() {
    try {
        await requireSuperAdmin();
        await connectDB();

        // 1. Fetch all events with organizers
        const events = await Event.find({}, 'organizer').lean();

        // 2. Extract unique organizers
        const uniqueOrganizers = new Map<string, string>(); // Name -> Logo

        events.forEach((event: any) => {
            if (event.organizer && event.organizer.name && event.organizer.logo) {
                // Use name as key to ensure uniqueness
                // If duplicates exist, this will take the LAST one encountered. 
                // Currently assuming same name = same logo, or at least acceptable to take one.
                uniqueOrganizers.set(event.organizer.name.trim(), event.organizer.logo);
            }
        });

        // 3. Insert into Organizer DB
        let addedCount = 0;
        for (const [name, logo] of uniqueOrganizers.entries()) {
            // Check if already exists in DB to prevent duplicates on re-run
            const exists = await Organizer.findOne({ name: name });
            if (!exists) {
                await Organizer.create({ name, logo });
                addedCount++;
            }
        }

        revalidatePath("/admin/organizers");
        return { success: true, count: addedCount, message: `Se migraron ${addedCount} organizadores.` };

    } catch (error) {
        console.error("Error seeding organizers:", error);
        return { success: false, error: "Falló la migración de organizadores." };
    }
}
