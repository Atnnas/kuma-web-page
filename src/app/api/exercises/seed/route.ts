import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Exercise from "@/models/Exercise";
import { STANDARD_EXERCISES } from "@/lib/standardExercises";

export async function POST() {
    try {
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
