import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Exercise from "@/models/Exercise";
import { STANDARD_EXERCISES } from "@/lib/standardExercises";
import { auth } from "@/auth";

export async function POST() {
    try {
        const session = await auth();
        if (!session || (session.user?.role !== "admin" && session.user?.role !== "super_admin")) {
            return NextResponse.json({ error: "No autorizado. Se requieren permisos administrativos." }, { status: 403 });
        }

        await dbConnect();

        // Bulk write to avoid duplicates (upsert)
        const operations = STANDARD_EXERCISES.map((exercise) => ({
            updateOne: {
                filter: { name: exercise.name },
                update: { $set: exercise },
                upsert: true,
            },
        }));

        await Exercise.bulkWrite(operations as any[]);

        return NextResponse.json({
            success: true,
            message: `Seeded ${STANDARD_EXERCISES.length} exercises successfully.`
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
