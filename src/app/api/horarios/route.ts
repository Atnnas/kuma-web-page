import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Horario from "@/models/Horario";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        let horarios = await Horario.find({}).sort({ order: 1 }).lean();

        // INJECTION: Add KUMA KIDS for L, M, V at 6 PM
        const targetDays = ["Lunes", "Miércoles", "Miercoles", "Viernes"];
        const kidsSession = {
            group: "KUMA KIDS",
            time: "6:00 PM - 7:00 PM",
            description: "Entrenamiento para niños hasta los 12 años",
            icon: "Zap",
            color: "gold"
        };

        horarios = horarios.map((day: any) => {
            const isTargetDay = targetDays.some(td => day.day.includes(td));
            if (isTargetDay) {
                const hasKids = day.sessions.some((s: any) => s.group.toUpperCase().includes("KIDS"));
                if (!hasKids) {
                    day.sessions.push(kidsSession);
                    day.sessions.sort((a: any, b: any) => {
                        const timeArrA = a.time.split(" ");
                        const timeArrB = b.time.split(" ");
                        const timeA = parseInt(timeArrA[0].replace(":", ""));
                        const timeB = parseInt(timeArrB[0].replace(":", ""));
                        return timeA - timeB;
                    });
                }
            }
            return day;
        });

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
