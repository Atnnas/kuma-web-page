"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth-utils";

export async function getAllUsers() {
    try {
        await connectDB();
        const users = await User.find({}).populate("dojo").sort({ createdAt: -1 }).lean();
        return users.map((user) => ({
            ...user,
            _id: user._id.toString(),
            dojo: user.dojo ? {
                _id: user.dojo._id.toString(),
                name: user.dojo.name,
                logo: user.dojo.logo,
            } : null,
            favoriteRoutines: user.favoriteRoutines?.map((id: any) => id.toString()) || [],
            createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
            updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : undefined,
            athleteProfile: user.athleteProfile ? {
                ...user.athleteProfile,
                birthDate: user.athleteProfile.birthDate ? new Date(user.athleteProfile.birthDate).toISOString() : undefined,
                dojo: user.athleteProfile.dojo ? user.athleteProfile.dojo.toString() : null,
            } : undefined,
        }));
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function toggleUserRole(userId: string, currentRole: string) {
    try {
        await requireSuperAdmin();
        await connectDB();

        // Simple toggle logic for now: user <-> super_admin
        const newRole = currentRole === "super_admin" ? "user" : "super_admin";

        await User.findByIdAndUpdate(userId, { role: newRole });
        revalidatePath("/admin/users");

        return { success: true, newRole };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { success: false, error: "Failed to update role" };
    }
}

export async function updateUser(userId: string, data: { name: string; email: string; role: string; isActive?: boolean; dojo?: string | null }) {
    try {
        await requireSuperAdmin();
        await connectDB();

        const user = await User.findById(userId);
        let email = data.email?.trim().toLowerCase();
        if (!email) {
            if (user?.email?.startsWith("pendiente_")) {
                email = user.email;
            } else {
                const tempId = Math.random().toString(36).substring(2, 9);
                email = `pendiente_${tempId}@kumadojo.com`;
            }
        }

        await User.findByIdAndUpdate(userId, {
            name: data.name,
            email: email,
            role: data.role,
            isActive: data.isActive,
            dojo: data.dojo || null
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, error: "Failed to update user" };
    }
}

export async function deleteUser(userId: string) {
    try {
        await requireSuperAdmin();
        await connectDB();

        await User.findByIdAndDelete(userId);
        revalidatePath("/admin/users");

        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: "Failed to delete user" };
    }
}
