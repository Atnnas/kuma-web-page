"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth-utils";
import mongoose from "mongoose";

/**
 * Toggle a routine as favorite for the current user.
 * Returns the updated list of favoriteRoutine IDs as strings.
 */
export async function toggleFavoriteRoutine(routineId: string): Promise<{
    success: boolean;
    favorites?: string[];
    error?: string;
}> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, error: "Unauthorized" };

        await connectDB();

        const user = await User.findById(currentUser.id);
        if (!user) return { success: false, error: "User not found" };

        const objId = new mongoose.Types.ObjectId(routineId);
        const existing = (user.favoriteRoutines ?? []).some(
            (id: any) => id.toString() === routineId
        );

        if (existing) {
            // Remove
            user.favoriteRoutines = (user.favoriteRoutines ?? []).filter(
                (id: any) => id.toString() !== routineId
            );
        } else {
            // Add
            (user.favoriteRoutines as any[]) = [
                ...(user.favoriteRoutines ?? []),
                objId,
            ];
        }

        await user.save();

        return {
            success: true,
            favorites: (user.favoriteRoutines ?? []).map((id: any) => id.toString()),
        };
    } catch (error: any) {
        console.error("Error toggling favorite:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get current user's favorite routine IDs.
 */
export async function getFavoriteRoutines(): Promise<{
    success: boolean;
    favorites?: string[];
    error?: string;
}> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, error: "Unauthorized" };

        await connectDB();

        const user = await User.findById(currentUser.id).select("favoriteRoutines").lean();
        if (!user) return { success: false, error: "User not found" };

        const favorites = ((user as any).favoriteRoutines ?? []).map((id: any) =>
            id.toString()
        );

        return { success: true, favorites };
    } catch (error: any) {
        console.error("Error getting favorites:", error);
        return { success: false, error: error.message };
    }
}
