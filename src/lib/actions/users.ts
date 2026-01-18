"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth-utils";

export async function getAllUsers() {
    try {
        await connectDB();
        const users = await User.find({}).sort({ createdAt: -1 }).lean();
        return users.map((user: any) => ({
            ...user,
            _id: user._id.toString(),
            isActive: user.isActive,
            createdAt: user.createdAt?.toISOString(),
            updatedAt: user.updatedAt?.toISOString(),
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

export async function updateUser(userId: string, data: { name: string; email: string; role: string; isActive?: boolean }) {
    try {
        await requireSuperAdmin();
        await connectDB();

        await User.findByIdAndUpdate(userId, {
            name: data.name,
            email: data.email,
            role: data.role,
            isActive: data.isActive
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, error: "Failed to update user" };
    }
}
