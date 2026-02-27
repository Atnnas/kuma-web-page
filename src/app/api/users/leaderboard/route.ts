
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();

        // --- TIMEZONE LOGIC (Costa Rica: UTC-6) ---
        const kumaOffset = -6 * 60 * 60 * 1000;
        const now = new Date();
        const kumaNow = new Date(now.getTime() + kumaOffset);

        // A streak is active if they trained today or yesterday in Kuma time.
        const kumaToday = new Date(Date.UTC(kumaNow.getUTCFullYear(), kumaNow.getUTCMonth(), kumaNow.getUTCDate()));

        // Fetch all users with a potential streak to calculate their real-time "effective" status
        const candidates = await User.find({
            streakDays: { $gt: 0 }
        }).select("name image streakDays restDays lastWorkoutDate");

        const leaderboard = candidates.map(user => {
            let effectiveStreak = user.streakDays || 0;
            let effectiveRestDays = user.restDays || 0;

            if (user.lastWorkoutDate) {
                const lDate = new Date(user.lastWorkoutDate.getTime() + kumaOffset);
                const lastWorkoutKuma = new Date(Date.UTC(lDate.getUTCFullYear(), lDate.getUTCMonth(), lDate.getUTCDate()));

                const diffTime = kumaToday.getTime() - lastWorkoutKuma.getTime();
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 1) {
                    const missedDays = diffDays - 1;
                    if (effectiveRestDays >= missedDays) {
                        effectiveRestDays -= missedDays;
                    } else {
                        effectiveStreak = 0;
                        effectiveRestDays = 0;
                    }
                }
            }

            return {
                _id: user._id,
                name: user.name,
                image: user.image,
                streakDays: effectiveStreak,
                restDays: effectiveRestDays
            };
        })
            .filter(u => u.streakDays > 0)
            .sort((a, b) => b.streakDays - a.streakDays)
            .slice(0, 5);

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json(
            { error: "Error fetching leaderboard" },
            { status: 500 }
        );
    }
}
