
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
        const kumaToday = new Date(kumaNow.getUTCFullYear(), kumaNow.getUTCMonth(), kumaNow.getUTCDate());
        const yesterdayKuma = new Date(kumaToday.getTime() - (24 * 60 * 60 * 1000));

        // We need the UTC timestamp that corresponds to yesterday 00:00:00 in UTC-6.
        // If kumaToday is 2026-02-11 00:00:00 (UTC-6), it is 2026-02-11 06:00:00 (UTC).
        // yesterdayKuma is 2026-02-10 00:00:00 (UTC-6), which is 2026-02-10 06:00:00 (UTC).
        const activeThreshold = new Date(yesterdayKuma.getTime() - kumaOffset);

        const topStreaks = await User.find({
            streakDays: { $gt: 0 },
            lastWorkoutDate: { $gte: activeThreshold }
        })
            .sort({ streakDays: -1 }) // Descending order
            .limit(5)
            .select("name image streakDays"); // Only select necessary fields

        return NextResponse.json(topStreaks);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json(
            { error: "Error fetching leaderboard" },
            { status: 500 }
        );
    }
}
