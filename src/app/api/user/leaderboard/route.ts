
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();

        // Calculate the date 48 hours ago to filter active streaks
        // Actually, let's keep it simple for now: valid streak is if lastWorkoutDate is recent enough.
        // But the user requested "active streak".
        // A streak is active if lastWorkoutDate is today or yesterday (or maybe 48 hours).
        // Let's use a 2-day window.

        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        twoDaysAgo.setHours(0, 0, 0, 0); // Start of the day 2 days ago

        const topStreaks = await User.find({
            streakDays: { $gt: 0 },
            lastWorkoutDate: { $gte: twoDaysAgo }
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
