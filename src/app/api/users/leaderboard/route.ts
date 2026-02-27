
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getMidnightInTimezone } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();

        // --- TIMEZONE-AWARE LOGIC ---
        const now = new Date();

        // Fetch all users with a potential streak to calculate their real-time "effective" status
        const candidates = await User.find({
            streakDays: { $gt: 0 }
        }).select("name image streakDays restDays lastWorkoutDate timezone");

        const leaderboard = candidates.map(user => {
            const userTimezone = user.timezone || "America/Costa_Rica";
            const todayInUserTZ = getMidnightInTimezone(now, userTimezone);

            let effectiveStreak = user.streakDays || 0;
            let effectiveRestDays = user.restDays || 0;

            if (user.lastWorkoutDate) {
                const lastWorkoutInUserTZ = getMidnightInTimezone(new Date(user.lastWorkoutDate), userTimezone);

                const diffTime = todayInUserTZ.getTime() - lastWorkoutInUserTZ.getTime();
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
