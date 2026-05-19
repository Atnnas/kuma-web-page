import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Routine from "@/models/Routine";
import RoutineLog from "@/models/RoutineLog";
import { getMidnightInTimezone } from "@/lib/date-utils";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse body to get routineId and timezone
        const body = await req.json();
        const { routineId, timezone: clientTimezone } = body;

        await dbConnect();

        // 1. Fetch User
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // --- Targeted Routines Permission Check ---
        const targetRoutine = await Routine.findById(routineId);
        if (!targetRoutine) {
            return NextResponse.json({ error: "Routine not found" }, { status: 404 });
        }

        if (user.role !== "super_admin") {
            const isPublic = !targetRoutine.allowedUsers || targetRoutine.allowedUsers.length === 0;
            const isAssignedToUser = targetRoutine.allowedUsers?.some((uid: any) => uid.toString() === user._id.toString());

            if (!isPublic && !isAssignedToUser) {
                return NextResponse.json({ error: "Unauthorized: Access to this routine is restricted" }, { status: 403 });
            }
        }

        // Save timezone if provided by client (updates profile if they moved/changed)
        if (clientTimezone) {
            user.timezone = clientTimezone;
        }

        const userTimezone = user.timezone || "America/Costa_Rica";

        const earnedAchievements: any[] = [];
        const existingSlugs = new Set((user.achievements || []).map(a => a.slug));

        // --- TIMEZONE-AWARE LOGIC ---
        const now = new Date();
        const today = getMidnightInTimezone(now, userTimezone);

        // 2. Fetch Duration (Strictly use body.duration)
        const routineDuration = (body.duration && typeof body.duration === 'number') ? body.duration : 0;

        // --- STREAK LOGIC ---
        let lastWorkoutKuma = user.lastWorkoutDate ? getMidnightInTimezone(new Date(user.lastWorkoutDate), userTimezone) : null;

        // If never trained, streak = 1
        if (!lastWorkoutKuma) {
            user.streakDays = 1;
        } else {
            const diffTime = today.getTime() - lastWorkoutKuma.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Trained yesterday, increment streak
                const oldStreak = user.streakDays || 0;
                user.streakDays = oldStreak + 1;

                // --- REST DAYS GAIN LOGIC ---
                // Award 1 rest day every 5 days of streak
                if (user.streakDays % 5 === 0) {
                    user.restDays = (user.restDays || 0) + 1;

                    const restDayAchievementSlug = "kuma-logro-primer-dia-descanso";
                    const restDayMetadata = {
                        name: "Logro: Día de Descanso",
                        description: "¡Excelente! Has ganado un día de descanso por 5 días de trabajo.",
                        icon: "Fire",
                        color: "#22d3ee", // Cyan/Blue
                        rarity: "Raro"
                    };

                    // Award permanent Badge if it's the first rest day (streak 5)
                    if (user.streakDays === 5 && !existingSlugs.has(restDayAchievementSlug)) {
                        const achievement = {
                            slug: restDayAchievementSlug,
                            earnedAt: new Date(),
                            metadata: restDayMetadata
                        };
                        // @ts-ignore
                        user.achievements.push(achievement);
                    }

                    // ALWAYS push to earnedAchievements to show the visual reward/overlay
                    earnedAchievements.push({ trophy: restDayMetadata });
                }
            } else if (diffDays > 1) {
                // Missed day(s)
                const missedDays = diffDays - 1;
                const availableRestDays = user.restDays || 0;

                if (availableRestDays >= missedDays) {
                    // Protected by rest days!
                    user.restDays = availableRestDays - missedDays;
                    // Streak stays the same as last time
                } else {
                    // Not enough rest days, reset streak
                    user.streakDays = 1;
                    user.restDays = 0;
                }
            }
            // If diffDays === 0 (trained today), count stays same
        }

        user.lastWorkoutDate = now;

        // --- TRAINING TIME LOGIC (Strictly Real-Time) ---
        // 1. Total lifetime accumulation
        user.totalTrainingMinutes = (user.totalTrainingMinutes || 0) + routineDuration;

        // 2. Daily accumulation (Reset if it's a new day)
        let lastResetKuma = user.lastTrainingResetDate ? getMidnightInTimezone(new Date(user.lastTrainingResetDate), userTimezone) : null;

        if (!lastResetKuma || lastResetKuma.getTime() !== today.getTime()) {
            // New day, reset daily time
            user.dailyTrainingMinutes = routineDuration;
            user.lastTrainingResetDate = now; // Store the actual timestamp
        } else {
            // Same day, accumulate
            user.dailyTrainingMinutes = (user.dailyTrainingMinutes || 0) + routineDuration;
        }

        // --- ACHIEVEMENTS CHECK & PERSISTENCE ---

        // Helper to award a trophy
        const awardTrophy = (slug: string, name: string, description: string, icon: string, color: string, rarity: string) => {
            if (!existingSlugs.has(slug)) {
                const achievement = {
                    slug,
                    earnedAt: new Date(),
                    metadata: { name, description, icon, color, rarity }
                };
                // @ts-ignore - Achievements array exists but Mongoose might complain about push if not typed perfectly here
                user.achievements.push(achievement);
                earnedAchievements.push({ trophy: achievement.metadata });
            }
        };

        // 1. First Workout
        if ((user.workoutCount || 0) === 0) {
            awardTrophy(
                "primer-entrenamiento",
                "Primer Entrenamiento",
                "El primer paso de un viaje de mil millas. ¡Has comenzado tu legado!",
                "Fire",
                "#fbbf24",
                "Legendario"
            );
        }

        // 2. Spirit Kuma (Time Attack > 60 mins in SINGLE SESSION)
        if (routineDuration >= 60) {
            const rewardMetadata = {
                name: "Espíritu Kuma",
                description: "Has entrenado más de 1 hora acumulada hoy. Tu resistencia es legendaria.",
                icon: "PawPrint",
                color: "#dc2626",
                rarity: "Mítico"
            };

            // Award trophy if not already owned (back-end persistence)
            if (!existingSlugs.has("kuma-revenant")) {
                const achievement = {
                    slug: "kuma-revenant",
                    earnedAt: new Date(),
                    metadata: rewardMetadata
                };
                // @ts-ignore
                user.achievements.push(achievement);
            }

            // ALWAYS add to earnedAchievements for the frontend response to "motivate them"
            // specifically when they finish a routine and have met the 1-hour goal.
            earnedAchievements.push({ trophy: rewardMetadata });
        }

        // Increment total workout count
        user.workoutCount = (user.workoutCount || 0) + 1;

        // --- AUTOMATIC MONTHLY ATTENDANCE LOG INTEGRATION ---
        // Online routine completion automatically feeds the attendance log month-by-month
        try {
            const todayStr = today.toISOString().split("T")[0];
            
            // Map routine keywords to the corrected session categories
            let sessionName: "Fuerza" | "Explosión" | "Técnica" | "Kata" | "Kumite" = "Técnica";
            const lowerTitle = targetRoutine.title.toLowerCase();
            const lowerDesc = targetRoutine.description.toLowerCase();
            
            if (lowerTitle.includes("fuerza") || lowerDesc.includes("fuerza") || lowerTitle.includes("potencia") || lowerDesc.includes("potencia")) {
                sessionName = "Fuerza";
            } else if (lowerTitle.includes("explosion") || lowerTitle.includes("explosión") || lowerTitle.includes("velocidad") || lowerDesc.includes("explosion") || lowerDesc.includes("explosión") || lowerDesc.includes("velocidad")) {
                sessionName = "Explosión";
            } else if (lowerTitle.includes("kata") || lowerDesc.includes("kata") || lowerTitle.includes("forma") || lowerDesc.includes("forma")) {
                sessionName = "Kata";
            } else if (lowerTitle.includes("kumite") || lowerDesc.includes("kumite") || lowerTitle.includes("combate") || lowerDesc.includes("combate") || lowerTitle.includes("sparring") || lowerDesc.includes("sparring")) {
                sessionName = "Kumite";
            } else if (lowerTitle.includes("tecnica") || lowerTitle.includes("técnica") || lowerDesc.includes("tecnica") || lowerDesc.includes("técnica")) {
                sessionName = "Técnica";
            }

            const AttendanceLog = (await import("@/models/AttendanceLog")).default;
            const existingAttendance = await AttendanceLog.findOne({
                user: user._id,
                date: todayStr
            });

            if (!existingAttendance) {
                await AttendanceLog.create({
                    user: user._id,
                    date: todayStr,
                    sessions: [sessionName],
                    status: "Presente",
                    method: "QR_Scan" // Scanned/completed self-service on device
                });
            } else {
                if (!existingAttendance.sessions.includes(sessionName)) {
                    existingAttendance.sessions.push(sessionName);
                    await existingAttendance.save();
                }
            }
        } catch (attendanceErr) {
            // Non-blocking error to ensure routine completion still succeeds
            console.error("Error logging workout completion to attendance:", attendanceErr);
        }

        await user.save();

        // Ensure leaderboard and routine pages are fresh
        revalidatePath("/routines");
        revalidatePath("/rutinas");
        revalidatePath("/admin/reports/logs");

        return NextResponse.json({
            success: true,
            workoutCount: user.workoutCount,
            streakDays: user.streakDays,
            restDays: user.restDays,
            dailyMinutes: user.dailyTrainingMinutes,
            totalMinutes: user.totalTrainingMinutes,
            newAchievements: earnedAchievements
        });

    } catch (error: any) {
        console.error("Error completing workout:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
