import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Routine from "@/models/Routine";
import { auth } from "@/auth";

// GET /api/routines
// Public (or protected if needed) list of active routines
// GET /api/routines
// Protected: Logged in users only
export async function GET(req: NextRequest) {
    await connectDB();
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const isAdmin = searchParams.get("admin") === "true";

        // Admin Security Check
        if (isAdmin && session.user?.role !== "super_admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const query = isAdmin ? {} : { active: true };

        const routines = await Routine.find(query).sort({ createdAt: -1 });
        return NextResponse.json(routines);
    } catch (error) {
        console.error("Error fetching routines:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/routines
// Admin only - Create new routine
export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const session = await auth();

        if (session?.user?.role !== "super_admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // Simple slug generation
        const slug = data.title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        const routine = await Routine.create({
            ...data,
            slug: data.slug || slug
        });

        return NextResponse.json(routine, { status: 201 });
    } catch (error) {
        console.error("Error creating routine:", error);
        return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
    }
}
