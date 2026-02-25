import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import UserKata from "@/models/UserKata";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const katas = await UserKata.find({ userId: session.user.id }).sort({ updatedAt: -1 });

        return NextResponse.json(katas);
    } catch (error) {
        console.error("Error fetching user katas:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { name, points, isCustom } = data;

        if (!name || !points) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        // Update or create
        const kata = await UserKata.findOneAndUpdate(
            { userId: session.user.id, name: name },
            {
                userId: session.user.id,
                name,
                points,
                isCustom: isCustom || false
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(kata);
    } catch (error) {
        console.error("Error saving user kata:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
