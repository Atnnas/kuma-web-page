import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Routine from "@/models/Routine";
import Exercise from "@/models/Exercise";
import User from "@/models/User";
import { auth } from "@/auth";

async function ensureSquatRevisorRoutine() {
    const existing = await Routine.findOne({ slug: "squat-revisor" });
    if (!existing) {
        await Routine.create({
            title: "Revisor de Sentadilla",
            slug: "squat-revisor",
            description: "Revisa tu técnica de sentadilla de perfil usando la cámara y visión artificial de MediaPipe. Flexiona las piernas al ángulo correcto para contar tus repeticiones.",
            difficulty: "Intermedio",
            estimated_duration: 5,
            equipment_types: ["peso_corporal"],
            blocks: [
                {
                    type: "exercise",
                    exercise_name: "Sentadillas con MediaPipe",
                    sets: 1,
                    reps: 10,
                    rest_seconds: 0,
                    measure_type: "reps",
                    notes: "Ponte de perfil / medio lado frente a la cámara."
                }
            ],
            active: true,
            allowedUsers: []
        });
    }
}

async function ensurePushupRevisorRoutine() {
    const existing = await Routine.findOne({ slug: "pushup-revisor" });
    if (!existing) {
        await Routine.create({
            title: "Revisor de Push Ups",
            slug: "pushup-revisor",
            description: "Revisa tu técnica de pechadas / lagartijas de perfil usando la cámara y visión artificial de MediaPipe. Flexiona los codos al ángulo correcto para contar tus repeticiones.",
            difficulty: "Intermedio",
            estimated_duration: 5,
            equipment_types: ["peso_corporal"],
            blocks: [
                {
                    type: "exercise",
                    exercise_name: "Push Ups con MediaPipe",
                    sets: 1,
                    reps: 10,
                    rest_seconds: 0,
                    measure_type: "reps",
                    notes: "Colócate de perfil / medio lado frente a la cámara en posición de plancha."
                }
            ],
            active: true,
            allowedUsers: []
        });
    }
}

async function ensureBurpeeRevisorRoutine() {
    const existing = await Routine.findOne({ slug: "burpee-revisor" });
    if (!existing) {
        await Routine.create({
            title: "Revisor de Burpees",
            slug: "burpee-revisor",
            description: "Revisa tu técnica de burpees completos de perfil usando visión artificial. Pasa secuencialmente de pie, flexión con el pecho al suelo, plancha alta y finaliza con un salto estirando las manos.",
            difficulty: "Avanzado",
            estimated_duration: 7,
            equipment_types: ["peso_corporal"],
            blocks: [
                {
                    type: "exercise",
                    exercise_name: "Burpees con MediaPipe",
                    sets: 1,
                    reps: 10,
                    rest_seconds: 0,
                    measure_type: "reps",
                    notes: "Colócate de perfil / medio lado frente a la cámara. Realiza el ejercicio completo."
                }
            ],
            active: true,
            allowedUsers: []
        });
    }
}

async function ensureBicepCurlRevisorRoutine() {
    const existing = await Routine.findOne({ slug: "bicepcurl-revisor" });
    if (!existing) {
        await Routine.create({
            title: "Revisor de Curl de Bíceps",
            slug: "bicepcurl-revisor",
            description: "Revisa tu técnica de curl de bíceps de perfil usando visión artificial. Mantén tus codos fijos a los lados del cuerpo y tu espalda alineada sin balancearte al levantar el peso.",
            difficulty: "Principiante",
            estimated_duration: 5,
            equipment_types: ["equipo"],
            blocks: [
                {
                    type: "exercise",
                    exercise_name: "Bicep Curl con MediaPipe",
                    sets: 1,
                    reps: 10,
                    rest_seconds: 0,
                    measure_type: "reps",
                    notes: "Párate de perfil frente a la cámara con una mancuerna y realiza el curl."
                }
            ],
            active: true,
            allowedUsers: []
        });
    }
}

async function ensureShoulderPressRevisorRoutine() {
    const existing = await Routine.findOne({ slug: "shoulderpress-revisor" });
    if (!existing) {
        await Routine.create({
            title: "Revisor de Press Militar",
            slug: "shoulderpress-revisor",
            description: "Revisa tu técnica de press militar / hombros de frente usando visión artificial. Mantén tus antebrazos verticales y empuja con fuerza de forma simétrica.",
            difficulty: "Intermedio",
            estimated_duration: 5,
            equipment_types: ["equipo"],
            blocks: [
                {
                    type: "exercise",
                    exercise_name: "Press Militar con MediaPipe",
                    sets: 1,
                    reps: 10,
                    rest_seconds: 0,
                    measure_type: "reps",
                    notes: "Párate de frente hacia la cámara con tus mancuernas y realiza el press."
                }
            ],
            active: true,
            allowedUsers: []
        });
    }
}

async function ensureTricepKickbackRevisorRoutine() {
    const existing = await Routine.findOne({ slug: "tricepkickback-revisor" });
    if (!existing) {
        await Routine.create({
            title: "Revisor de Patada de Tríceps",
            slug: "tricepkickback-revisor",
            description: "Revisa tu técnica de patada de tríceps de perfil usando visión artificial. Inclina tu torso hacia adelante manteniendo la espalda recta y extiende completamente los codos sin balancear los brazos.",
            difficulty: "Intermedio",
            estimated_duration: 5,
            equipment_types: ["equipo"],
            blocks: [
                {
                    type: "exercise",
                    exercise_name: "Patada de Triceps con MediaPipe",
                    sets: 1,
                    reps: 10,
                    rest_seconds: 0,
                    measure_type: "reps",
                    notes: "Colócate de perfil frente a la cámara. Inclina tu torso hacia adelante y realiza las patadas de tríceps extendiendo por completo el brazo."
                }
            ],
            active: true,
            allowedUsers: []
        });
    }
}

// GET /api/routines
// Public (or protected if needed) list of active routines
// GET /api/routines
// Protected: Logged in users only
export async function GET(req: NextRequest) {
    await connectDB();
    try {
        await ensureSquatRevisorRoutine();
        await ensurePushupRevisorRoutine();
        await ensureBurpeeRevisorRoutine();
        await ensureBicepCurlRevisorRoutine();
        await ensureShoulderPressRevisorRoutine();
        await ensureTricepKickbackRevisorRoutine();

        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const isAdmin = searchParams.get("super_admin") === "true" || searchParams.get("admin") === "true";

        let query: any = { active: true };

        const isSuperAdmin = session.user?.role === "super_admin" || session.user?.role === "admin";

        if (isAdmin && isSuperAdmin) {
            // Admin Panel Mode: see absolute everything (active + inactive) EXCEPT squat-revisor, pushup-revisor, burpee-revisor, bicepcurl-revisor, shoulderpress-revisor, and tricepkickback-revisor
            query = { slug: { $nin: ["squat-revisor", "pushup-revisor", "burpee-revisor", "bicepcurl-revisor", "shoulderpress-revisor", "tricepkickback-revisor"] } };
        } else if (isSuperAdmin) {
            // Admin Listing Mode: see all active routines regardless of targeting
            query = { active: true };
        } else {
            // Non-admin: Filter by targeting
            const user = await User.findOne({ email: session.user.email });
            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const userId = user._id;

            query = {
                active: true,
                $or: [
                    { allowedUsers: { $exists: false } },
                    { allowedUsers: { $size: 0 } },
                    { allowedUsers: userId }
                ]
            };
        }

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

        if (session?.user?.role !== "super_admin" && session?.user?.role !== "admin") {
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

        // --- AUTO-SAVE NEW EXERCISES ---
        if (data.blocks && Array.isArray(data.blocks)) {
            const exerciseNames = new Set<string>();
            data.blocks.forEach((b: any) => {
                if (b.exercise_name && b.exercise_name.trim()) {
                    exerciseNames.add(b.exercise_name.trim());
                }
            });

            if (exerciseNames.size > 0) {
                const bulkOps = Array.from(exerciseNames).map(name => ({
                    updateOne: {
                        filter: { name: name },
                        update: {
                            $setOnInsert: {
                                name: name,
                                category: "Fuerza",
                                equipment: ["Ninguno"],
                                difficulty: "Intermedio"
                            }
                        },
                        upsert: true
                    }
                }));

                await Exercise.bulkWrite(bulkOps as any);
            }
        }

        return NextResponse.json(routine, { status: 201 });
    } catch (error) {
        console.error("Error creating routine:", error);
        return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
    }
}
