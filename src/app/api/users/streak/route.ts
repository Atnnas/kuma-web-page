import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getMidnightInTimezone } from "@/lib/date-utils";

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

        const userTimezone = user.timezone || "America/Costa_Rica";

        // --- TIMEZONE-AWARE LOGIC ---
        const now = new Date();
        const today = getMidnightInTimezone(now, userTimezone);

        let displayStreak = user.streakDays || 0;
        let displayRestDays = user.restDays || 0;

        if (user.lastWorkoutDate) {
            const lastWorkout = getMidnightInTimezone(new Date(user.lastWorkoutDate), userTimezone);
            const diffTime = today.getTime() - lastWorkout.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
                const missedDays = diffDays - 1;

                if (displayRestDays >= missedDays) {
                    displayRestDays -= missedDays;
                } else {
                    displayStreak = 0;
                    displayRestDays = 0;
                }
            }
        }

        // --- CELEBRATION LOGIC (Once a Day) ---
        let showCelebration = false;
        let showLossCelebration = false;

        // A. Conditions for Positive Celebration (Maintenance/Gain):
        if (displayStreak > 0) {
            let lastShown = user.lastStreakShownDate ? getMidnightInTimezone(new Date(user.lastStreakShownDate), userTimezone) : null;
            if (!lastShown || lastShown.getTime() < today.getTime()) {
                const lastWorkout = user.lastWorkoutDate ? getMidnightInTimezone(new Date(user.lastWorkoutDate), userTimezone) : null;
                if (lastWorkout && (today.getTime() - lastWorkout.getTime()) <= (1000 * 60 * 60 * 24)) {
                    showCelebration = true;
                }
            }
        }
        // B. Conditions for Loss Celebration (Sorrow):
        else if (displayStreak === 0 && user.lastWorkoutDate) {
            const lastWorkout = getMidnightInTimezone(new Date(user.lastWorkoutDate), userTimezone);
            let lastLossShown = user.lastStreakLossShownDate ? getMidnightInTimezone(new Date(user.lastStreakLossShownDate), userTimezone) : null;

            // Only show if we haven't shown the loss since the last time they trained
            // (meaning this is a "new" loss event for the person)
            if (!lastLossShown || lastLossShown.getTime() < lastWorkout.getTime()) {
                showLossCelebration = true;
            }
        }

        return NextResponse.json({
            streak: displayStreak,
            restDays: displayRestDays,
            showCelebration: showCelebration,
            showLossCelebration: showLossCelebration
        });

    } catch (error: any) {
        console.error("Error fetching streak:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
