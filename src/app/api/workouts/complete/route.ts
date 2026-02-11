import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Routine from "@/models/Routine";

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

        // --- TIMEZONE LOGIC (Costa Rica: UTC-6) ---
        const getKumaToday = () => {
            const now = new Date();
            // Offset to Costa Rica (UTC-6)
            const kumaDate = new Date(now.getTime() + (-6 * 60 * 60 * 1000));
            return new Date(kumaDate.getUTCFullYear(), kumaDate.getUTCMonth(), kumaDate.getUTCDate());
        };

        const today = getKumaToday();
        const now = new Date();

        // 2. Fetch Duration (Strictly use body.duration)
        const routineDuration = (body.duration && typeof body.duration === 'number') ? body.duration : 0;

        // --- STREAK LOGIC ---
        let lastWorkoutDate = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;
        let lastWorkoutKuma = null;

        if (lastWorkoutDate) {
            const lDate = new Date(lastWorkoutDate.getTime() + (-6 * 60 * 60 * 1000));
            lastWorkoutKuma = new Date(lDate.getUTCFullYear(), lDate.getUTCMonth(), lDate.getUTCDate());
        }

        // If never trained, streak = 1
        if (!lastWorkoutKuma) {
            user.streakDays = 1;
        } else {
            const diffTime = today.getTime() - lastWorkoutKuma.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Trained yesterday, increment streak
                user.streakDays = (user.streakDays || 0) + 1;
            } else if (diffDays > 1) {
                // Missed a day, reset streak
                user.streakDays = 1;
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
            const rDate = new Date(lastResetDate.getTime() + (-6 * 60 * 60 * 1000));
            lastResetKuma = new Date(rDate.getUTCFullYear(), rDate.getUTCMonth(), rDate.getUTCDate());
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
        const earnedAchievements: any[] = [];
        const existingSlugs = new Set((user.achievements || []).map(a => a.slug));

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

        // 2. Spirit Kuma (Time Attack > 60 mins in a day)
        if ((user.dailyTrainingMinutes || 0) >= 60) {
            awardTrophy(
                "kuma-revenant",
                "Espíritu Kuma",
                "Has entrenado más de 1 hora acumulada hoy. Tu resistencia es legendaria.",
                "PawPrint",
                "#dc2626",
                "Mítico"
            );
        }

        // Increment total workout count
        user.workoutCount = (user.workoutCount || 0) + 1;

        await user.save();

        return NextResponse.json({
            success: true,
            workoutCount: user.workoutCount,
            streakDays: user.streakDays,
            dailyMinutes: user.dailyTrainingMinutes,
            totalMinutes: user.totalTrainingMinutes,
            newAchievements: earnedAchievements
        });

    } catch (error: any) {
        console.error("Error completing workout:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
