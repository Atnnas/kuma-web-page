
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
        // Yesterday starts at midnight of the day before today.
        const kumaToday = new Date(Date.UTC(kumaNow.getUTCFullYear(), kumaNow.getUTCMonth(), kumaNow.getUTCDate()));
        const yesterdayKuma = new Date(kumaToday.getTime() - (24 * 60 * 60 * 1000));

        // We need the UTC timestamp that corresponds to yesterday 00:00:00 in UTC-6.
        const activeThreshold = new Date(yesterdayKuma.getTime() - kumaOffset);

        const topStreaks = await User.find({
            streakDays: { $gt: 0 },
            // A user is "active" if they trained recently OR if they have rest days
            // that could potentially be protecting their streak.
            $or: [
                { lastWorkoutDate: { $gte: activeThreshold } },
                { restDays: { $gt: 0 } }
            ]
        })
            .sort({ streakDays: -1 })
            .limit(5)
            .select("name image streakDays restDays lastWorkoutDate");

        return NextResponse.json(topStreaks);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json(
            { error: "Error fetching leaderboard" },
            { status: 500 }
        );
    }
}
