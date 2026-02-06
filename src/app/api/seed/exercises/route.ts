import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Exercise from "@/models/Exercise";
import { auth } from "@/auth";

// Source: yuhonas/free-exercise-db
// JSON URL: https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Security Check: Only Admin or Secret Key
        const session = await auth();
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get("secret");

        if (secret !== "kumasecret" && session?.user?.role !== "super_admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("Fetching exercises from external source...");
        const response = await fetch("https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json");

        if (!response.ok) {
            throw new Error(`Failed to fetch JSON: ${response.statusText}`);
        }

        const externalExercises = await response.json();
        console.log(`Fetched ${externalExercises.length} exercises.`);

        // Filter and Map
        const validExercises = externalExercises
            // Filter only those with distinct names and valid data
            .filter((ex: any) => ex.name)
            .map((ex: any) => ({
                name: formatName(ex.name),
                category: mapCategory(ex.category),
                equipment: mapEquipment(ex.equipment),
                difficulty: mapLevel(ex.level),
                muscle_group: ex.primaryMuscles || [],
                description: ex.instructions ? ex.instructions.join(" ") : ""
            }));

        console.log(`Prepared ${validExercises.length} exercises for insertion.`);

        // Batch Insert / Upsert
        let assigned = 0;
        let errors = 0;

        for (const ex of validExercises) {
            try {
                // Upsert based on name
                await Exercise.findOneAndUpdate(
                    { name: ex.name },
                    ex,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                assigned++;
            } catch (err) {
                console.error(`Error upserting ${ex.name}:`, err);
                errors++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Seeded ${assigned} exercises.`,
            total_source: externalExercises.length,
            errors
        });

    } catch (error) {
        console.error("Seed Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// Helpers
function formatName(name: string) {
    // Capitalize and clean
    return name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function mapCategory(cat: string) {
    // Map external categories to "Fuerza" | "Cardio" | "Flexibilidad" | "Técnica" | "Potencia"
    const lower = cat?.toLowerCase() || "";
    if (lower.includes("cardio")) return "Cardio";
    if (lower.includes("stretching") || lower.includes("plyometrics")) return "Flexibilidad";
    if (lower.includes("powerlifting") || lower.includes("olympic")) return "Potencia";
    return "Fuerza";
}

function mapEquipment(eq: string) {
    if (!eq || eq === "body only") return ["Ninguno"];
    return [eq];
}

function mapLevel(level: string) {
    if (level === "expert") return "Avanzado";
    if (level === "beginner") return "Principiante";
    return "Intermedio";
}
