import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        await connectDB();
        const athletes = await User.find({ "athleteProfile.isEnrolled": true })
            .sort({ "athleteProfile.beltRank": -1 })
            .lean();
            
        // Clean and serialize
        const serialized = JSON.parse(JSON.stringify(athletes)).map((user: any) => ({
            ...user,
            _id: user._id.toString(),
        }));
        
        return NextResponse.json({ success: true, data: serialized });
    } catch (error: any) {
        console.error("Error in /api/athletes GET:", error);
        return NextResponse.json(
            { success: false, error: error.message || String(error) },
            { status: 500 }
        );
    }
}
