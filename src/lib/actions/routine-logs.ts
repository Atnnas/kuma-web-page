"use server";

import connectDB from "@/lib/db";
import RoutineLog from "@/models/RoutineLog";
import { auth } from "@/auth";
import User from "@/models/User"; // Ensure User model is registered
import { revalidatePath } from "next/cache";

export async function startRoutineLog(routineId: string, title: string, estimatedDuration: number) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        await connectDB();

        // Resolving User ID from email since session might not have _id populated depending on auth config
        // or just to be safe and ensure consistent typing
        const user = await User.findOne({ email: session.user.email }).select("_id isActive");
        if (!user) {
            return { success: false, error: "User not found" };
        }

        // Bloquear si el usuario no ha sido activado
        if (user.isActive === false) {
            return { success: false, error: "Account not active. Access denied." };
        }

        const newLog = await RoutineLog.create({
            user: user._id,
            routine: routineId,
            routineTitle: title,
            scheduledDuration: estimatedDuration,
            startTime: new Date(),
            completed: false,
            // We don't set expiresAt here. 
            // It will only be set if the user explicitly abandons it.
        });

        return { success: true, logId: newLog._id.toString() };

    } catch (error) {
        console.error("Error starting routine log:", error);
        return { success: false, error: "Failed to create log" };
    }
}

export async function completeRoutineLog(logId: string, durationSeconds: number) {
    try {
        if (!logId) return { success: false, error: "No log ID provided" };

        await connectDB();

        await RoutineLog.findByIdAndUpdate(logId, {
            $set: {
                endTime: new Date(),
                durationSeconds: durationSeconds,
                completed: true
            },
            $unset: { expiresAt: "" } // Stop the auto-deletion TTL
        });

        revalidatePath("/admin/reports/logs");
        return { success: true };
    } catch (error) {
        console.error("Error completing routine log:", error);
        return { success: false, error: "Failed to update log" };
    }
}

export async function deleteRoutineLogs(logIds: string[]) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "super_admin") {
            return { success: false, error: "Unauthorized" };
        }

        await connectDB();
        await RoutineLog.deleteMany({ _id: { $in: logIds } });

        revalidatePath("/admin/reports/logs");
        return { success: true };
    } catch (error) {
        console.error("Error deleting routine logs:", error);
        return { success: false, error: "Failed to delete logs" };
    }
}

export async function getUnfinishedRoutineLog(routineId: string) {
    try {
        const session = await auth();
        if (!session?.user?.email) return { success: false, error: "Unauthorized" };

        await connectDB();
        const user = await User.findOne({ email: session.user.email }).select("_id");
        if (!user) return { success: false, error: "User not found" };

        // Find the most recent incomplete log for this routine that hasn't been abandoned
        const log = await RoutineLog.findOne({
            user: user._id,
            routine: routineId,
            completed: false,
            expiresAt: { $exists: false }
        }).sort({ createdAt: -1 });

        if (!log) return { success: true, log: null };

        return { success: true, log: JSON.parse(JSON.stringify(log)) };
    } catch (error) {
        console.error("Error getting unfinished log:", error);
        return { success: false, error: "Failed to fetch log" };
    }
}

export async function updateRoutineProgress(logId: string, state: any) {
    try {
        if (!logId) return { success: false, error: "No log ID provided" };

        await connectDB();
        await RoutineLog.findByIdAndUpdate(logId, {
            $set: { lastState: state }
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating routine progress:", error);
        return { success: false, error: "Failed to update progress" };
    }
}

export async function abandonRoutineLog(logId: string) {
    try {
        if (!logId) return { success: false, error: "No log ID provided" };

        await connectDB();
        // Set expiresAt to 2 hours from now instead of deleting immediately
        await RoutineLog.findByIdAndUpdate(logId, {
            $set: { expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) }
        });

        return { success: true };
    } catch (error) {
        console.error("Error abandoning routine log:", error);
        return { success: false, error: "Failed to abandon log" };
    }
}
export async function getAnyUnfinishedLog() {
    try {
        const session = await auth();
        if (!session?.user?.email) return { success: false, error: "Unauthorized" };

        await connectDB();
        const user = await User.findOne({ email: session.user.email }).select("_id");
        if (!user) return { success: false, error: "User not found" };

        const log = await RoutineLog.findOne({
            user: user._id,
            completed: false,
            expiresAt: { $exists: false }
        }).sort({ createdAt: -1 });

        if (!log) return { success: true, log: null };

        return { success: true, log: JSON.parse(JSON.stringify(log)) };
    } catch (error) {
        console.error("Error getting any unfinished log:", error);
        return { success: false, error: "Failed to fetch log" };
    }
}
