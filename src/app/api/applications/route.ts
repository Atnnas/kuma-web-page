import { NextResponse } from "next/server";
import Application from "@/models/Application";
import connectDB from "@/lib/db";

const INITIAL_APPS: any[] = [];

export async function GET() {
    try {
        await connectDB();
        const apps = await Application.find().sort({ order: 1 });
        return NextResponse.json(apps);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
