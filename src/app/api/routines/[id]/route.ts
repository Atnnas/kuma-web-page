import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Routine from "@/models/Routine";
import User from "@/models/User";
import { auth } from "@/auth";

// Helper to validate ObjectId (if needed) or just trust mongoose

// GET /api/routines/[id]
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    await connectDB();
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const params = await props.params;
        const routine = await Routine.findById(params.id);
        if (!routine) {
            return NextResponse.json({ error: "Routine not found" }, { status: 404 });
        }

        // --- Targeted Routines Permission Check ---
        if (session.user?.role !== "super_admin" && session.user?.role !== "admin") {
            const user = await User.findOne({ email: session.user.email });
            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const isPublic = !routine.allowedUsers || routine.allowedUsers.length === 0;
            const isAssignedToUser = routine.allowedUsers?.some(id => id.toString() === user._id.toString());

            if (!isPublic && !isAssignedToUser) {
                return NextResponse.json({ error: "Forbidden: Access restricted to assigned users" }, { status: 403 });
            }
        }

        return NextResponse.json(routine);
    } catch (error) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
}

// PUT /api/routines/[id]
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    await connectDB();
    try {
        const params = await props.params;
        const session = await auth();

        if (session?.user?.role !== "super_admin" && session?.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const routine = await Routine.findByIdAndUpdate(params.id, data, { new: true });

        if (!routine) {
            return NextResponse.json({ error: "Routine not found" }, { status: 404 });
        }

        return NextResponse.json(routine);
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

// DELETE /api/routines/[id]
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    await connectDB();
    try {
        const params = await props.params;
        const session = await auth();

        if (session?.user?.role !== "super_admin" && session?.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await Routine.findByIdAndDelete(params.id);
        return NextResponse.json({ message: "Routine deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
