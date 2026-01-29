import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Membership from "@/models/Membership";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();
        const memberships = await Membership.find({}).sort({ order: 1 });
        return NextResponse.json(memberships);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch memberships" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        if (Array.isArray(data)) {
            await Membership.deleteMany({}); // Clear existing for clean seed
            const memberships = await Membership.insertMany(data);
            return NextResponse.json(memberships);
        } else {
            const membership = await Membership.create(data);
            return NextResponse.json(membership);
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to create membership" }, { status: 500 });
    }
}
