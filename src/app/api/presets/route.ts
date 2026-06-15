import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PosePreset from "@/models/PosePreset";
import { auth } from "@/auth";

// GET: Obtener todos los presets de posturas (público)
export async function GET() {
  try {
    await connectDB();
    const presets = await PosePreset.find({}).sort({ name: 1 });
    return NextResponse.json(presets);
  } catch (error: any) {
    console.error("Error fetching pose presets:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Crear un nuevo preset de postura (solo Admin/SuperAdmin)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || (session.user?.role !== "admin" && session.user?.role !== "super_admin")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { name, category, angles, landmarks } = await req.json();

    if (!name || !category || !angles || !landmarks) {
      return NextResponse.json(
        { error: "Todos los campos (nombre, categoría, ángulos y puntos corporales) son requeridos" },
        { status: 400 }
      );
    }

    await connectDB();

    // Comprobar si ya existe una postura con ese nombre
    const existingPreset = await PosePreset.findOne({ name: name.trim() });
    if (existingPreset) {
      return NextResponse.json(
        { error: "Ya existe una postura en el catálogo con este nombre" },
        { status: 400 }
      );
    }

    const newPreset = await PosePreset.create({
      name: name.trim(),
      category,
      angles,
      landmarks,
      createdBy: session.user.email || "Administrador",
    });

    return NextResponse.json({
      message: "Postura oficial guardada correctamente en el catálogo",
      preset: newPreset,
    });
  } catch (error: any) {
    console.error("Error creating pose preset:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Eliminar un preset de postura (solo Admin/SuperAdmin)
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || (session.user?.role !== "admin" && session.user?.role !== "super_admin")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let presetId = searchParams.get("presetId");

    // Intentar leer del body si no está en la query string
    if (!presetId) {
      try {
        const body = await req.json();
        presetId = body.presetId;
      } catch (e) {
        // Body vacío
      }
    }

    if (!presetId) {
      return NextResponse.json({ error: "El ID de la postura es requerido" }, { status: 400 });
    }

    await connectDB();

    const deletedPreset = await PosePreset.findByIdAndDelete(presetId);

    if (!deletedPreset) {
      return NextResponse.json({ error: "Postura no encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Postura eliminada correctamente del catálogo oficial",
    });
  } catch (error: any) {
    console.error("Error deleting pose preset:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Actualizar el nombre de una postura (solo Admin/SuperAdmin)
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || (session.user?.role !== "admin" && session.user?.role !== "super_admin")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { presetId, name } = await req.json();

    if (!presetId || !name || !name.trim()) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 });
    }

    await connectDB();

    // Verificar si ya existe otro preset con ese nombre
    const conflict = await PosePreset.findOne({ name: name.trim(), _id: { $ne: presetId } });
    if (conflict) {
      return NextResponse.json({ error: "Ya existe otra postura con ese nombre" }, { status: 400 });
    }

    const updated = await PosePreset.findByIdAndUpdate(
      presetId,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Postura no encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Postura actualizada correctamente",
      preset: updated
    });
  } catch (error: any) {
    console.error("Error updating pose preset:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
