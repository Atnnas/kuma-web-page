import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DojoRoom from "@/models/DojoRoom";
import { auth } from "@/auth";

// GET: Check if a room code exists and is active
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Falta el código de la sala" }, { status: 400 });
    }

    await connectDB();
    const room = await DojoRoom.findOne({ roomCode: code.trim().toUpperCase(), active: true });

    if (!room) {
      return NextResponse.json({ error: "Sala no encontrada o inactiva" }, { status: 404 });
    }

    // Actualizar tiempo de última actividad
    room.lastActive = new Date();
    await room.save();

    return NextResponse.json({
      roomCode: room.roomCode,
      senseiName: room.senseiName,
      studentName: room.studentName,
      active: room.active,
      meetLink: room.meetLink || "",
      senseiPeerId: room.senseiPeerId || ""
    });
  } catch (error) {
    console.error("Error checking dojo room:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST: Create a new training room (Sensei / Admin / SuperAdmin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || (session.user?.role !== "admin" && session.user?.role !== "super_admin")) {
      return NextResponse.json({ error: "No autorizado. Solo instructores." }, { status: 401 });
    }

    const { studentName } = await request.json().catch(() => ({ studentName: "Alumno" }));

    await connectDB();

    // Generar un código único de 6 caracteres
    let roomCode = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await DojoRoom.findOne({ roomCode });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json({ error: "No se pudo generar un código único" }, { status: 500 });
    }

    const room = await DojoRoom.create({
      roomCode,
      senseiEmail: session.user?.email || "",
      senseiName: session.user?.name || "Sensei",
      studentName: studentName || "Alumno",
      active: true,
      lastActive: new Date(),
      studentPose: {
        landmarks: [],
        angles: { left: 0, right: 0 },
        alignmentScore: 0,
        isAligned: false,
        mode: "superior"
      },
      control: {
        presetId: "",
        guidedMode: true,
        tolerance: 15,
        command: "none",
        newPoseName: "",
        timestamp: 0
      }
    });

    return NextResponse.json({
      roomCode: room.roomCode,
      roomId: room._id,
      senseiName: room.senseiName,
      studentName: room.studentName
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating dojo room:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
