import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email }).select("streakDays restDays lastWorkoutDate lastStreakShownDate lastStreakLossShownDate");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // --- TIMEZONE LOGIC (Costa Rica: UTC-6) ---
        const kumaOffset = -6 * 60 * 60 * 1000;
        const getKumaDate = (date: Date) => {
            const d = new Date(date.getTime() + kumaOffset);
            return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
        };

        const now = new Date();
        const today = getKumaDate(now);

        let displayStreak = user.streakDays || 0;

        if (user.lastWorkoutDate) {
            const lastWorkout = getKumaDate(new Date(user.lastWorkoutDate));
            const diffTime = today.getTime() - lastWorkout.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
                const missedDays = diffDays - 1;
                const restDays = user.restDays || 0;

                if (restDays < missedDays) {
                    displayStreak = 0;
                }
                // If restDays >= missedDays, displayStreak remains the user.streakDays value
            }
        }

        // --- CELEBRATION LOGIC (Once a Day) ---
        let showCelebration = false;
        let showLossCelebration = false;

        // A. Conditions for Positive Celebration (Maintenance/Gain):
        if (displayStreak > 0) {
            let lastShown = user.lastStreakShownDate ? getKumaDate(new Date(user.lastStreakShownDate)) : null;

            if (!lastShown || lastShown.getTime() < today.getTime()) {
                const lastWorkout = user.lastWorkoutDate ? getKumaDate(new Date(user.lastWorkoutDate)) : null;
                if (lastWorkout && (today.getTime() - lastWorkout.getTime()) <= (1000 * 60 * 60 * 24)) {
                    showCelebration = true;
                }
            }
        }
        // B. Conditions for Loss Celebration (Sorrow):
        else if (displayStreak === 0 && user.lastWorkoutDate) {
            const lastWorkout = getKumaDate(new Date(user.lastWorkoutDate));
            let lastLossShown = user.lastStreakLossShownDate ? getKumaDate(new Date(user.lastStreakLossShownDate)) : null;

            // Only show if we haven't shown the loss since the last time they trained
            // (meaning this is a "new" loss event for the person)
            if (!lastLossShown || lastLossShown.getTime() < lastWorkout.getTime()) {
                showLossCelebration = true;
            }
        }

        return NextResponse.json({
            streak: displayStreak,
            restDays: user.restDays || 0,
            showCelebration: showCelebration,
            showLossCelebration: showLossCelebration
        });

    } catch (error: any) {
        console.error("Error fetching streak:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
