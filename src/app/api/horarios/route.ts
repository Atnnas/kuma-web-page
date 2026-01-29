import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Horario from "@/models/Horario";

export async function GET() {
    try {
        await connectDB();
        const horarios = await Horario.find({}).sort({ order: 1 });
        return NextResponse.json(horarios);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch horarios" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        if (Array.isArray(data)) {
            await Horario.deleteMany({}); // Clear existing
            const horarios = await Horario.insertMany(data);
            return NextResponse.json(horarios);
        } else {
            const horario = await Horario.create(data);
            return NextResponse.json(horario);
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to create horario" }, { status: 500 });
    }
}
