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

        // 2. Fetch Routine (if provided) to get duration
        let routineDuration = 0;
        if (routineId) {
            const routine = await Routine.findById(routineId);
            if (routine) {
                routineDuration = routine.estimated_duration || 0;
            }
        }

        // --- STREAK LOGIC ---
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Midnight today

        let lastWorkoutDate = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;
        // Normalize last workout to midnight for comparison
        if (lastWorkoutDate) {
            lastWorkoutDate = new Date(lastWorkoutDate.getFullYear(), lastWorkoutDate.getMonth(), lastWorkoutDate.getDate());
        }

        // If never trained, streak = 1
        if (!lastWorkoutDate) {
            user.streakDays = 1;
        } else {
            const diffTime = Math.abs(today.getTime() - lastWorkoutDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

        // --- DAILY TRAINING TIME LOGIC ---
        // Reset if it's a new day
        let lastResetDate = user.lastTrainingResetDate ? new Date(user.lastTrainingResetDate) : null;
        if (lastResetDate) {
            lastResetDate = new Date(lastResetDate.getFullYear(), lastResetDate.getMonth(), lastResetDate.getDate());
        }

        if (!lastResetDate || lastResetDate.getTime() !== today.getTime()) {
            // New day, reset time but add current routine
            user.dailyTrainingMinutes = routineDuration;
            user.lastTrainingResetDate = today;
        } else {
            // Same day, accumulate
            user.dailyTrainingMinutes = (user.dailyTrainingMinutes || 0) + routineDuration;
        }

        // --- ACHIEVEMENTS CHECK ---
        const newAchievements = [];

        // 1. First Workout
        if ((user.workoutCount || 0) === 0) {
            newAchievements.push({
                type: "FIRST_WORKOUT",
                trophy: {
                    slug: "primer-entrenamiento",
                    name: "Primer Entrenamiento",
                    description: "El primer paso de un viaje de mil millas. ¡Has comenzado tu legado!",
                    icon: "Fire",
                    color: "#fbbf24",
                    rarity: "Legendario"
                }
            });
        }

        // 2. Spirit Kuma (Time Attack > 60 mins)
        // Check if we just crossed the threshold
        if (user.dailyTrainingMinutes >= 60) {
            // We can check if they already have it if we stored earned trophies, 
            // but for now we trigger it every time they cross 60m in a day to celebrate the effort.
            // Or better: ensure we only trigger it once per session context in frontend, 
            // but here we just report eligibility.

            // To avoid spamming, realistically we should have an 'achievements' array in User model.
            // For this MVP, we will send it. User requested "activara luego de terminar".
            newAchievements.push({
                type: "KUMA_REVENANT",
                trophy: {
                    slug: "kuma-revenant",
                    name: "Espíritu Kuma",
                    description: "Has entrenado más de 1 hora hoy. Tu resistencia es legendaria.",
                    icon: "PawPrint",
                    color: "#dc2626",
                    rarity: "Mítico"
                }
            });
        }

        // Increment total workout count
        user.workoutCount = (user.workoutCount || 0) + 1;

        await user.save();

        return NextResponse.json({
            success: true,
            workoutCount: user.workoutCount,
            streakDays: user.streakDays,
            dailyMinutes: user.dailyTrainingMinutes,
            newAchievements: newAchievements
        });

    } catch (error: any) {
        console.error("Error completing workout:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
