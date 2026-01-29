import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Schedule from "@/models/Schedule";

export async function GET() {
    try {
        await connectDB();
        const schedules = await Schedule.find({}).sort({ order: 1 });
        return NextResponse.json(schedules);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
    }
}

// Optional: POST for easy seeding/updating via internal tools or Postman
export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        // If array, insert many
        if (Array.isArray(data)) {
            // Clear existing if needed? For now, just create
            await Schedule.deleteMany({}); // Safety clear for this seed endpoint
            const schedules = await Schedule.insertMany(data);
            return NextResponse.json(schedules);
        } else {
            const schedule = await Schedule.create(data);
            return NextResponse.json(schedule);
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 });
    }
}
