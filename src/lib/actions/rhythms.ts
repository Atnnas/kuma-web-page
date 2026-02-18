"use server";

import connectDB from "@/lib/db";
import Rhythm from "@/models/Rhythm";
import { requireSuperAdmin, getCurrentUser } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function saveRhythm(data: {
    name: string;
    martialArt: string;
    style: string;
    points: any[];
}) {
    try {
        await requireSuperAdmin();
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        await connectDB();

        const newRhythm = await Rhythm.create({
            ...data,
            createdBy: user.id
        });

        revalidatePath("/admin"); // Revalida donde se use la biblioteca
        return { success: true, id: newRhythm._id.toString() };
    } catch (error: any) {
        console.error("Error saving rhythm:", error.message);
        return { success: false, error: error.message || "Failed to save rhythm" };
    }
}

export async function getRhythms() {
    try {
        await connectDB();
        // Cualquiera con sesión iniciada puede verlos para practicar
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        const rhythms = await Rhythm.find({}).sort({ createdAt: -1 }).lean();

        return rhythms.map((r: any) => ({
            ...r,
            _id: r._id.toString(),
            createdBy: r.createdBy.toString(),
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
            points: r.points.map((p: any) => ({
                id: p.id,
                tiempo: p.tiempo,
                tipo: p.tipo,
                estado: p.estado
            }))
        }));
    } catch (error: any) {
        console.error("Error fetching rhythms:", error.message);
        return [];
    }
}

export async function deleteRhythm(id: string) {
    try {
        await requireSuperAdmin();
        const user = await getCurrentUser();
        if (!user) throw new Error("Unauthorized");

        await connectDB();

        // Verificamos propiedad si no es super_admin (opcional, acorde a lógica de negocio)
        // Pero requireSuperAdmin() ya es restrictivo.

        await Rhythm.findByIdAndDelete(id);

        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting rhythm:", error.message);
        return { success: false, error: error.message || "Failed to delete rhythm" };
    }
}
