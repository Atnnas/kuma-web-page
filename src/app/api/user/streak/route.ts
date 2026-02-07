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

        const user = await User.findOne({ email: session.user.email }).select("streakDays lastWorkoutDate");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate if streak is still valid (did they miss yesterday?)
        // If they missed yesterday and didn't train today, streak is effectively 0 (or will be reset on next train).
        // For display purposes, if they missed yesterday, we might want to show 0 or the broken streak.
        // Simple logic: If last workout was > 1 day ago (not today, not yesterday), streak is effectively 0.

        let displayStreak = user.streakDays || 0;

        if (user.lastWorkoutDate) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let last = new Date(user.lastWorkoutDate);
            last = new Date(last.getFullYear(), last.getMonth(), last.getDate());

            const diffTime = Math.abs(today.getTime() - last.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
                displayStreak = 0;
                // We don't save this reset here to avoid side effects on GET, 
                // but we display 0 to reflect reality.
            }
        }

        // Logic for "Dezopilante" Streak Celebration
        // Show if:
        // 1. Streak > 0 (active streak)
        // 2. Haven't shown it today yet
        let showCelebration = false;
        if (displayStreak > 0) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            let lastShown = user.lastStreakShownDate ? new Date(user.lastStreakShownDate) : null;
            if (lastShown) {
                lastShown = new Date(lastShown.getFullYear(), lastShown.getMonth(), lastShown.getDate());
            }

            // If never shown OR shown before today
            if (!lastShown || lastShown.getTime() < today.getTime()) {
                showCelebration = true;
            }
        }

        return NextResponse.json({
            streak: displayStreak,
            showCelebration: showCelebration
        });

    } catch (error: any) {
        console.error("Error fetching streak:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
