"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import AttendanceLog from "@/models/AttendanceLog";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth-utils";

/**
 * Fetch all users that are enrolled as athletes for attendance roll call
 */
export async function getAthletesForAttendance() {
    try {
        await requireSuperAdmin();
        await connectDB();
        
        const athletes = await User.find({ "athleteProfile.isEnrolled": true })
            .sort({ name: 1 })
            .lean();
            
        // Get the current calendar month in YYYY-MM format in America/Costa_Rica timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Costa_Rica',
            year: 'numeric',
            month: '2-digit'
        });
        const parts = formatter.formatToParts(new Date());
        const year = parts.find(p => p.type === 'year')!.value;
        const month = parts.find(p => p.type === 'month')!.value;
        const monthStr = `${year}-${month}`; // e.g. "2026-05"
        
        // Find all present/tarde logs for the current month
        const monthlyLogs = await AttendanceLog.find({
            date: { $regex: `^${monthStr}` },
            status: { $in: ["Presente", "Tarde"] }
        }).lean();

        // Create a map of userId -> attendance count
        const attendanceCountsMap: Record<string, number> = {};
        for (const log of monthlyLogs) {
            const uid = log.user.toString();
            attendanceCountsMap[uid] = (attendanceCountsMap[uid] || 0) + 1;
        }
            
        return JSON.parse(JSON.stringify(athletes)).map((user: any) => ({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            athleteProfile: {
                weight: user.athleteProfile?.weight || 0,
                height: user.athleteProfile?.height || 0,
                beltRank: user.athleteProfile?.beltRank || "Blanco",
                specialization: user.athleteProfile?.specialization || "Ambos",
                stats: user.athleteProfile?.stats || { vel: 10, pot: 10, tec: 10, res: 10, esp: 10, ovr: 10 },
                workoutCount: user.workoutCount || 0,
                monthlyAttendanceCount: attendanceCountsMap[user._id.toString()] || 0,
            }
        }));
    } catch (error) {
        console.error("Error fetching athletes for attendance:", error);
        return [];
    }
}

/**
 * Fetch attendance logs for a specific date
 */
export async function getAttendanceForDate(date: string) {
    try {
        await requireSuperAdmin();
        await connectDB();
        
        const logs = await AttendanceLog.find({ date }).lean();
        
        return JSON.parse(JSON.stringify(logs)).map((log: any) => ({
            userId: log.user.toString(),
            status: log.status,
            sessions: log.sessions || [],
        }));
    } catch (error) {
        console.error("Error fetching attendance logs:", error);
        return [];
    }
}

/**
 * Submit or update attendance records for a specific date.
 * Automatically increments/decrements workout statistics for present/tarde athletes.
 */
export async function submitAttendanceForDate(
    date: string,
    records: { userId: string; status: "Presente" | "Tarde" | "Ausente"; sessions: ("Fuerza" | "Explosión" | "Técnica" | "Kata" | "Kumite")[] }[]
) {
    try {
        await requireSuperAdmin();
        await connectDB();

        for (const record of records) {
            const { userId, status, sessions } = record;

            // Find if there's an existing attendance log for this date/user
            const existingLog = await AttendanceLog.findOne({
                user: userId,
                date,
            });

            if (status === "Presente" || status === "Tarde") {
                if (!existingLog) {
                    // Create new attendance record
                    await AttendanceLog.create({
                        user: userId,
                        date,
                        status,
                        sessions,
                        method: "Sensei_Manual",
                        checkInTime: new Date(date + "T12:00:00"),
                    });

                    // Increment workout stats on user profile
                    await User.findByIdAndUpdate(userId, {
                        $inc: { workoutCount: 1 },
                        $set: { lastWorkoutDate: new Date(date) },
                    });
                } else {
                    // Update status and sessions if already exists
                    existingLog.status = status;
                    existingLog.sessions = sessions;
                    await existingLog.save();
                }
            } else if (status === "Ausente") {
                if (existingLog) {
                    // Remove existing attendance record
                    await AttendanceLog.deleteOne({ _id: existingLog._id });

                    // Decrement workout count (safely, keeping >= 0)
                    const user = await User.findById(userId);
                    if (user) {
                        const newCount = Math.max(0, (user.workoutCount || 0) - 1);
                        await User.findByIdAndUpdate(userId, {
                            $set: { workoutCount: newCount },
                        });
                    }
                }
            }
        }

        revalidatePath("/admin/attendance");
        revalidatePath("/admin/athletes");
        revalidatePath("/training");

        return { success: true };
    } catch (error) {
        console.error("Error submitting attendance:", error);
        return { success: false, error: "Error al guardar la asistencia." };
    }
}
