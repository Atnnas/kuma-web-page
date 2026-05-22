"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import Dojo from "@/models/Dojo";
import AttendanceLog from "@/models/AttendanceLog";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin, getCurrentUser } from "@/lib/auth-utils";
import { calculateStatIncrements, updateStatsObject } from "@/lib/utils/progression";

/**
 * Fetch all users that are enrolled as athletes for attendance roll call
 */
export async function getAthletesForAttendance() {
    try {
        const currentUser = await requireSuperAdmin();
        await connectDB();
        
        const isDojoAdmin = currentUser.role === "admin" && currentUser.dojo;
        const query: any = { "athleteProfile.isEnrolled": true };
        if (isDojoAdmin) {
            query["athleteProfile.dojo"] = currentUser.dojo;
        }
        
        const athletes = await User.find(query)
            .populate("athleteProfile.dojo")
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

        // Find all MVP logs in total
        const mvpLogs = await AttendanceLog.find({ isMVP: true }).lean();
        const mvpCountsMap: Record<string, number> = {};
        for (const log of mvpLogs) {
            const uid = log.user.toString();
            mvpCountsMap[uid] = (mvpCountsMap[uid] || 0) + 1;
        }
            
        return athletes.map((user: any) => ({
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
                mvpCount: mvpCountsMap[user._id.toString()] || 0,
                dojo: user.athleteProfile?.dojo ? {
                    _id: user.athleteProfile.dojo._id.toString(),
                    name: user.athleteProfile.dojo.name,
                    logo: user.athleteProfile.dojo.logo,
                } : null
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
        const currentUser = await requireSuperAdmin();
        await connectDB();
        
        const isDojoAdmin = currentUser.role === "admin" && currentUser.dojo;
        const query: any = { date };
        if (isDojoAdmin) {
            const athleteIds = await User.find({
                "athleteProfile.isEnrolled": true,
                "athleteProfile.dojo": currentUser.dojo
            }).distinct("_id");
            query.user = { $in: athleteIds };
        }
        
        const logs = await AttendanceLog.find(query).lean();
        
        return logs.map((log: any) => ({
            userId: log.user.toString(),
            status: log.status,
            sessions: log.sessions || [],
            performance: log.performance || "Standard",
            isMVP: log.isMVP || false,
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
    records: { 
        userId: string; 
        status: "Presente" | "Tarde" | "Ausente"; 
        sessions: ("Fuerza" | "Explosión" | "Técnica" | "Kata" | "Kumite")[];
        performance?: "Standard" | "Destacado" | "Elite" | "1" | "2" | "3" | "4" | "5";
        isMVP?: boolean;
    }[]
) {
    try {
        const currentUser = await requireSuperAdmin();
        await connectDB();

        const isDojoAdmin = currentUser.role === "admin" && currentUser.dojo;
        if (isDojoAdmin) {
            const athleteIds = await User.find({
                "athleteProfile.isEnrolled": true,
                "athleteProfile.dojo": currentUser.dojo
            }).distinct("_id");
            const athleteIdStrings = athleteIds.map(id => id.toString());
            
            const hasUnauthorized = records.some(r => !athleteIdStrings.includes(r.userId));
            if (hasUnauthorized) {
                throw new Error("No autorizado para guardar asistencia de atletas de otro dojo");
            }
        }

        // Check if any record in this submission is manually designated as MVP
        const manualMvpExists = records.some(r => r.isMVP === true);

        // If no MVP was manually set, auto-calculate the best candidate
        if (!manualMvpExists) {
            const eligibleRecords = records.filter(r => r.status === "Presente" || r.status === "Tarde");
            if (eligibleRecords.length > 0) {
                let bestRecordIndex = -1;
                let highestScore = -1;

                const perfMap: Record<string, number> = {
                    "Elite": 5, "5": 5,
                    "Destacado": 4, "4": 4,
                    "Standard": 3, "3": 3,
                    "2": 2, "1": 1
                };

                for (const rec of eligibleRecords) {
                    const userProfile = await User.findById(rec.userId).lean();
                    const ovr = userProfile?.athleteProfile?.stats?.ovr || 50;
                    const perfStars = perfMap[rec.performance || "Standard"] || 3;
                    const sessionCount = rec.sessions?.length || 0;
                    
                    // Algorithm: Performance (stars) * 100 + Session Count * 10 + OVR
                    const score = perfStars * 100 + sessionCount * 10 + ovr;

                    if (score > highestScore) {
                        highestScore = score;
                        bestRecordIndex = records.findIndex(r => r.userId === rec.userId);
                    }
                }

                if (bestRecordIndex !== -1) {
                    records[bestRecordIndex].isMVP = true;
                }
            }
        }

        for (const record of records) {
            const { userId, status, sessions, performance = "Standard", isMVP = false } = record;

            // Find if there's an existing attendance log for this date/user
            const existingLog = await AttendanceLog.findOne({
                user: userId,
                date,
            });

            const user = await User.findById(userId);
            if (!user || !user.athleteProfile) continue;

            // Ensure stats and statsLastMonth are initialized safely
            if (!user.athleteProfile.stats) {
                user.athleteProfile.stats = { vel: 50, pot: 50, tec: 50, res: 50, esp: 50, ovr: 50 };
            }
            if (!user.athleteProfile.statsLastMonth) {
                user.athleteProfile.statsLastMonth = { ...user.athleteProfile.stats };
            }

            // Check if month changed to update the monthly snapshot
            if (user.lastWorkoutDate) {
                const lastDateObj = new Date(user.lastWorkoutDate);
                const incomingDateObj = new Date(date);
                const lastMonthStr = `${lastDateObj.getFullYear()}-${String(lastDateObj.getMonth() + 1).padStart(2, '0')}`;
                const incomingMonthStr = `${incomingDateObj.getFullYear()}-${String(incomingDateObj.getMonth() + 1).padStart(2, '0')}`;
                
                if (lastMonthStr !== incomingMonthStr) {
                    // Month changed! Snapshot current stats to statsLastMonth
                    user.athleteProfile.statsLastMonth = { ...user.athleteProfile.stats };
                }
            }

            if (status === "Presente" || status === "Tarde") {
                if (!existingLog) {
                    // Create new attendance record
                    await AttendanceLog.create({
                        user: userId,
                        date,
                        status,
                        sessions,
                        performance,
                        isMVP: !!isMVP,
                        method: "Sensei_Manual",
                        checkInTime: new Date(date + "T12:00:00"),
                    });

                    // Calculate progression points to add
                    const increments = calculateStatIncrements(sessions as any, performance as any, !!isMVP);
                    user.athleteProfile.stats = updateStatsObject(user.athleteProfile.stats as any, increments, false);
                    
                    user.workoutCount = (user.workoutCount || 0) + 1;
                    user.lastWorkoutDate = new Date(date);
                    user.markModified("athleteProfile.stats");
                    await user.save();
                } else {
                    // Attendance update!
                    // 1. Subtract the old progression
                    const oldIncrements = calculateStatIncrements(
                        existingLog.sessions || [], 
                        (existingLog.performance as any) || "Standard",
                        !!existingLog.isMVP
                    );
                    let currentStats = updateStatsObject(user.athleteProfile.stats as any, oldIncrements, true);

                    // 2. Add the new progression
                    const newIncrements = calculateStatIncrements(sessions as any, performance as any, !!isMVP);
                    currentStats = updateStatsObject(currentStats, newIncrements, false);

                    // Update user stats
                    user.athleteProfile.stats = currentStats;
                    user.markModified("athleteProfile.stats");
                    await user.save();

                    // Update status, sessions, performance, and isMVP in existing log
                    existingLog.status = status;
                    existingLog.sessions = sessions;
                    existingLog.performance = performance as any;
                    existingLog.isMVP = !!isMVP;
                    await existingLog.save();
                }
            } else if (status === "Ausente") {
                if (existingLog) {
                    // Remove existing attendance record
                    await AttendanceLog.deleteOne({ _id: existingLog._id });

                    // Subtract the progression from that session
                    const oldIncrements = calculateStatIncrements(
                        existingLog.sessions || [], 
                        (existingLog.performance as any) || "Standard",
                        !!existingLog.isMVP
                    );
                    user.athleteProfile.stats = updateStatsObject(user.athleteProfile.stats as any, oldIncrements, true);

                    // Decrement workout count (safely, keeping >= 0)
                    user.workoutCount = Math.max(0, (user.workoutCount || 0) - 1);
                    user.markModified("athleteProfile.stats");
                    await user.save();
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

/**
 * Get the latest class's MVP (Daily MVP Entry Celebration)
 * Returns the date and athlete details of the most recent MVP(s).
 * Enforces that the current logged-in user must be an enrolled athlete.
 */
export async function getLatestMvp() {
    try {
        await connectDB();

        // Verify the currently logged-in user is enrolled
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return null; // Not logged in
        }

        const dbUser = await User.findById(currentUser.id).lean();
        if (!dbUser || !dbUser.athleteProfile?.isEnrolled) {
            return null; // Not enrolled
        }

        // Find the latest attendance log with isMVP: true
        const latestMvpLog = await AttendanceLog.findOne({ isMVP: true })
            .sort({ date: -1 })
            .lean();

        if (!latestMvpLog) {
            return null;
        }

        const targetDate = latestMvpLog.date;

        // Find all MVP logs on that specific date
        const logs = await AttendanceLog.find({ date: targetDate, isMVP: true })
            .populate({
                path: "user",
                populate: { path: "athleteProfile.dojo" }
            })
            .lean();

        if (logs.length === 0) {
            return null;
        }

        // Get total MVP counts for each of these users to display on their FUT card
        const userIds = logs.map(l => l.user._id.toString());
        const allMvpLogs = await AttendanceLog.find({ user: { $in: userIds }, isMVP: true }).lean();
        const mvpCountsMap: Record<string, number> = {};
        for (const log of allMvpLogs) {
            const uid = log.user.toString();
            mvpCountsMap[uid] = (mvpCountsMap[uid] || 0) + 1;
        }

        const athletes = logs.map((log: any) => {
            const user = log.user;
            if (!user) return null;

            return {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                image: user.image,
                athleteProfile: {
                    weight: user.athleteProfile?.weight || 0,
                    height: user.athleteProfile?.height || 0,
                    beltRank: user.athleteProfile?.beltRank || "Blanco",
                    specialization: user.athleteProfile?.specialization || "Ambos",
                    stats: user.athleteProfile?.stats || { vel: 50, pot: 50, tec: 50, res: 50, esp: 50, ovr: 50 },
                    cc: user.athleteProfile?.cc || "",
                    habilidadSecreta: user.athleteProfile?.habilidadSecreta || "",
                    statsLastMonth: user.athleteProfile?.statsLastMonth || user.athleteProfile?.stats,
                    mvpCount: mvpCountsMap[user._id.toString()] || 0,
                    dojo: user.athleteProfile?.dojo ? {
                        _id: user.athleteProfile.dojo._id.toString(),
                        name: user.athleteProfile.dojo.name,
                        logo: user.athleteProfile.dojo.logo,
                    } : null
                }
            };
        }).filter(Boolean);

        return {
            date: targetDate,
            athletes
        };
    } catch (error) {
        console.error("Error in getLatestMvp:", error);
        return null;
    }
}

/**
 * Get the Weekly MVP (Guerrero de la Semana)
 * Returns the athlete(s) with the highest check-ins in the current calendar week.
 */
export async function getWeeklyMVP() {
    try {
        await connectDB();

        // 1. Get current date in America/Costa_Rica timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Costa_Rica',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const parts = formatter.formatToParts(new Date());
        const year = parts.find(p => p.type === 'year')!.value;
        const month = parts.find(p => p.type === 'month')!.value;
        const day = parts.find(p => p.type === 'day')!.value;
        
        const today = new Date(`${year}-${month}-${day}T12:00:00`);
        const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        
        const monday = new Date(today);
        monday.setDate(today.getDate() + diffToMonday);
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        const formatDateString = (d: Date) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const dy = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${dy}`;
        };
        
        const mondayStr = formatDateString(monday);
        const sundayStr = formatDateString(sunday);

        // 2. Fetch all present/tarde logs in the date range
        const weeklyLogs = await AttendanceLog.find({
            date: { $gte: mondayStr, $lte: sundayStr },
            status: { $in: ["Presente", "Tarde"] }
        }).lean();

        if (weeklyLogs.length === 0) {
            return {
                athletes: [],
                count: 0,
                weekRange: { start: mondayStr, end: sundayStr }
            };
        }

        // 3. Count check-ins per user
        const counts: Record<string, number> = {};
        for (const log of weeklyLogs) {
            const uid = log.user.toString();
            counts[uid] = (counts[uid] || 0) + 1;
        }

        // 4. Find the maximum count
        let maxCount = 0;
        for (const uid in counts) {
            if (counts[uid] > maxCount) {
                maxCount = counts[uid];
            }
        }

        if (maxCount === 0) {
            return {
                athletes: [],
                count: 0,
                weekRange: { start: mondayStr, end: sundayStr }
            };
        }

        // 5. Get all user IDs with the maximum count
        const mvpUserIds = Object.keys(counts).filter(uid => counts[uid] === maxCount);

        // 6. Fetch user details for these MVPs
        const mvpUsers = await User.find({
            _id: { $in: mvpUserIds },
            "athleteProfile.isEnrolled": true
        }).lean();

        // Find all MVP logs in total to attach mvpCount
        const mvpLogs = await AttendanceLog.find({ isMVP: true }).lean();
        const mvpCountsMap: Record<string, number> = {};
        for (const log of mvpLogs) {
            const uid = log.user.toString();
            mvpCountsMap[uid] = (mvpCountsMap[uid] || 0) + 1;
        }

        const formattedAthletes = mvpUsers.map((user: any) => ({
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
                cc: user.athleteProfile?.cc || "",
                habilidadSecreta: user.athleteProfile?.habilidadSecreta || "",
                statsLastMonth: user.athleteProfile?.statsLastMonth || user.athleteProfile?.stats,
                mvpCount: mvpCountsMap[user._id.toString()] || 0
            }
        }));

        return {
            athletes: formattedAthletes,
            count: maxCount,
            weekRange: { start: mondayStr, end: sundayStr }
        };
    } catch (error) {
        console.error("Error in getWeeklyMVP:", error);
        return {
            athletes: [],
            count: 0,
            weekRange: { start: "", end: "" },
            error: "Error al calcular el Guerrero de la Semana"
        };
    }
}

