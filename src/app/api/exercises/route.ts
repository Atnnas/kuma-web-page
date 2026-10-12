import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Exercise from "@/models/Exercise";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query");

        let filter = {};
        if (query && query.trim()) {
            // Case-insensitive escaped regex search to prevent ReDoS
            const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter = { name: { $regex: escapedQuery, $options: "i" } };
        }

        // Limit to 20 suggestions for autocomplete performance
        const exercises = await Exercise.find(filter)
            .select("name category equipment difficulty")
            .limit(20)
            .sort({ name: 1 });

        return NextResponse.json(exercises);

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
