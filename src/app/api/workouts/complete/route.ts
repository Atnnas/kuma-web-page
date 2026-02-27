import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Routine from "@/models/Routine";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse body to get routineId
        const body = await req.json();
        const { routineId } = body;

        await dbConnect();

        // 1. Fetch User
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const earnedAchievements: any[] = [];
        const existingSlugs = new Set((user.achievements || []).map(a => a.slug));

        // --- TIMEZONE LOGIC (Costa Rica: UTC-6) ---
        const getKumaToday = () => {
            const now = new Date();
            // Offset to Costa Rica (UTC-6)
            const msInHour = 60 * 60 * 1000;
            const kumaNow = new Date(now.getTime() + (-6 * msInHour));
            return new Date(Date.UTC(kumaNow.getUTCFullYear(), kumaNow.getUTCMonth(), kumaNow.getUTCDate()));
        };

        const today = getKumaToday();
        const now = new Date();

        // 2. Fetch Duration (Strictly use body.duration)
        const routineDuration = (body.duration && typeof body.duration === 'number') ? body.duration : 0;

        // --- STREAK LOGIC ---
        let lastWorkoutDate = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;
        let lastWorkoutKuma = null;

        if (lastWorkoutDate) {
            const msInHour = 60 * 60 * 1000;
            const lDate = new Date(lastWorkoutDate.getTime() + (-6 * msInHour));
            lastWorkoutKuma = new Date(Date.UTC(lDate.getUTCFullYear(), lDate.getUTCMonth(), lDate.getUTCDate()));
        }

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
        let lastResetDate = user.lastTrainingResetDate ? new Date(user.lastTrainingResetDate) : null;
        let lastResetKuma = null;
        if (lastResetDate) {
            const msInHour = 60 * 60 * 1000;
            const rDate = new Date(lastResetDate.getTime() + (-6 * msInHour));
            lastResetKuma = new Date(Date.UTC(rDate.getUTCFullYear(), rDate.getUTCMonth(), rDate.getUTCDate()));
        }

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
