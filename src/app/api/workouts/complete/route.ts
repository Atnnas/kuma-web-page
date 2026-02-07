import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Find user by email (more reliable than ID from session sometimes, but ID is better if available)
        // Session user id is usually safe.
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Streak Logic
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Midnight today

        let lastWorkoutDate = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;
        // Normalize last workout to midnight for comparison
        if (lastWorkoutDate) {
            lastWorkoutDate = new Date(lastWorkoutDate.getFullYear(), lastWorkoutDate.getMonth(), lastWorkoutDate.getDate());
        }

        // 1. If never trained, streak = 1
        if (!lastWorkoutDate) {
            user.streakDays = 1;
        } else {
            const diffTime = Math.abs(today.getTime() - lastWorkoutDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // 2. Trained yesterday (or acceptable window), increment streak
                user.streakDays = (user.streakDays || 0) + 1;
            } else if (diffDays > 1) {
                // 3. Missed a day (or more), reset streak
                user.streakDays = 1;
            }
            // 4. If diffDays === 0 (trained today), do not increment streak, but count workout
        }

        user.lastWorkoutDate = now;

        // Increment total workout count
        const currentCount = user.workoutCount || 0;
        user.workoutCount = currentCount + 1;

        await user.save();

        // Check if this was the first workout
        const isFirstWorkout = user.workoutCount === 1;

        return NextResponse.json({
            success: true,
            workoutCount: user.workoutCount,
            streakDays: user.streakDays,
            firstWorkout: isFirstWorkout
        });

    } catch (error: any) {
        console.error("Error completing workout:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
