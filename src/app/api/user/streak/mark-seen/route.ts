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

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Mark as shown today
        user.lastStreakShownDate = new Date();
        await user.save();

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error marking streak shown:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
