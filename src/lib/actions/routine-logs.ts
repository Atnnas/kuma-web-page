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
            // Automatic cleanup if session is lost (2 hour window)
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
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

        // Find the most recent incomplete log for this routine that:
        // - Has saved progress (lastState was set by updateRoutineProgress)
        // - Is still within the active 2-hour recovery window (expiresAt in the future)
        const log = await RoutineLog.findOne({
            user: user._id,
            routine: routineId,
            completed: false,
            lastState: { $exists: true },
            expiresAt: { $gt: new Date() }
        }).sort({ updatedAt: -1 });

        return { success: true, log: serializeRoutineLog(log) };
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
            $set: {
                lastState: state,
                // Refresh rolling expiration window (2 hours from last activity)
                expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
            }
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
        // Expire permanently (unix epoch) so it's never found again by any recovery query
        await RoutineLog.findByIdAndUpdate(logId, {
            $set: {
                expiresAt: new Date(0),
                completed: false // Explicitly keep as incomplete but expired
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Error abandoning routine log:", error);
        return { success: false, error: "Failed to abandon log" };
    }
}

/**
 * Deletes a routine log immediately.
 * Validates that the log belongs to the requesting user OR provides super_admin override.
 */
export async function deleteRoutineLog(logId: string) {
    try {
        if (!logId) return { success: false, error: "No log ID provided" };

        const session = await auth();
        if (!session?.user?.email) return { success: false, error: "Unauthorized" };

        await connectDB();
        const user = await User.findOne({ email: session.user.email }).select("_id role");
        if (!user) return { success: false, error: "User not found" };

        const log = await RoutineLog.findById(logId);
        if (!log) return { success: true }; // Already deleted or doesn't exist

        // Security check: Only owner or super_admin can delete
        if (log.user.toString() !== user._id.toString() && user.role !== "super_admin") {
            return { success: false, error: "Unauthorized to delete this log" };
        }

        await RoutineLog.findByIdAndDelete(logId);

        revalidatePath("/admin/reports/logs");
        return { success: true };
    } catch (error) {
        console.error("Error deleting routine log:", error);
        return { success: false, error: "Failed to delete log" };
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
            lastState: { $exists: true },
            expiresAt: { $gt: new Date() }
        }).sort({ updatedAt: -1 });

        return { success: true, log: serializeRoutineLog(log) };
    } catch (error) {
        console.error("Error getting any unfinished log:", error);
        return { success: false, error: "Failed to fetch log" };
    }
}

function serializeRoutineLog(log: any) {
    if (!log) return null;
    const rawLog = typeof log.toObject === "function" ? log.toObject() : log;
    return {
        ...rawLog,
        _id: rawLog._id.toString(),
        user: rawLog.user ? rawLog.user.toString() : null,
        startTime: rawLog.startTime ? new Date(rawLog.startTime).toISOString() : undefined,
        endTime: rawLog.endTime ? new Date(rawLog.endTime).toISOString() : undefined,
        expiresAt: rawLog.expiresAt ? new Date(rawLog.expiresAt).toISOString() : undefined,
        createdAt: rawLog.createdAt ? new Date(rawLog.createdAt).toISOString() : undefined,
        updatedAt: rawLog.updatedAt ? new Date(rawLog.updatedAt).toISOString() : undefined,
    };
}
