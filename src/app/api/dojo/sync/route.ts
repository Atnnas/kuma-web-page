import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DojoRoom from "@/models/DojoRoom";
import PosePreset from "@/models/PosePreset";
import { auth } from "@/auth";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomCode, role } = body;

    if (!roomCode || !role) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 });
    }

    await connectDB();

    const roomCodeClean = roomCode.trim().toUpperCase();

    if (role === "student") {
      const updateData: any = { lastActive: new Date() };
      
      if (body.studentPose) {
        updateData.studentPose = {
          landmarks: body.studentPose.landmarks || [],
          angles: body.studentPose.angles || { left: 0, right: 0 },
          alignmentScore: body.studentPose.alignmentScore || 0,
          isAligned: !!body.studentPose.isAligned,
          mode: body.studentPose.mode || "superior"
        };
      }

      // Actualización atómica de datos del alumno sin interferir con controles del Sensei
      const updatedRoom = await DojoRoom.findOneAndUpdate(
        { roomCode: roomCodeClean, active: true },
        { $set: updateData },
        { new: true }
      );

      if (!updatedRoom) {
        return NextResponse.json({ error: "Sala no encontrada o inactiva" }, { status: 404 });
      }

      // Devolver control del Sensei al Alumno (incluyendo captura de sesión)
      return NextResponse.json({
        control: updatedRoom.control,
        meetLink: updatedRoom.meetLink || "",
        senseiPeerId: updatedRoom.senseiPeerId || "",
        sessionCapture: updatedRoom.sessionCapture || null,
        success: true
      });

    } else if (role === "sensei") {
      // El Sensei controla la sala (cambia de preset, tolerancia, o comando)
      const session = await auth();
      if (!session || (session.user?.role !== "admin" && session.user?.role !== "super_admin")) {
        return NextResponse.json({ error: "No autorizado. Solo instructores." }, { status: 401 });
      }

      const updateData: any = { lastActive: new Date() };

      if (body.control) {
        if (body.control.guidedMode !== undefined) updateData["control.guidedMode"] = body.control.guidedMode;
        if (body.control.tolerance !== undefined) updateData["control.tolerance"] = body.control.tolerance;
        if (body.control.presetId !== undefined) updateData["control.presetId"] = body.control.presetId;
        if (body.control.analysisMode !== undefined) updateData["control.analysisMode"] = body.control.analysisMode;
        
        if (body.control.command && body.control.command !== "none") {
          updateData["control.command"] = body.control.command;
          updateData["control.newPoseName"] = body.control.newPoseName || "";
          updateData["control.timestamp"] = Date.now();
        }
      }

      if (body.meetLink !== undefined) {
        updateData.meetLink = body.meetLink;
      }

      if (body.senseiPeerId !== undefined) {
        updateData.senseiPeerId = body.senseiPeerId;
      }

      if (body.sessionCapture !== undefined) {
        updateData.sessionCapture = body.sessionCapture;
      }

      // Actualización atómica de los controles del Sensei sin interferir con las poses del Alumno
      let updatedRoom = await DojoRoom.findOneAndUpdate(
        { roomCode: roomCodeClean, active: true },
        { $set: updateData },
        { new: true }
      );

      if (!updatedRoom) {
        return NextResponse.json({ error: "Sala no encontrada o inactiva" }, { status: 404 });
      }

      let poseSaved = false;

      // Si el comando es guardar postura, procesamos y limpiamos el comando
      if (updatedRoom.control.command === "save_pose") {
        const poseName = updatedRoom.control.newPoseName?.trim();
        const lms = updatedRoom.studentPose?.landmarks;
        const angles = updatedRoom.studentPose?.angles;
        const mode = updatedRoom.studentPose?.mode;

        if (poseName && lms && lms.length > 0 && angles) {
          try {
            const existing = await PosePreset.findOne({ name: poseName });
            if (existing) {
              existing.category = mode || "superior";
              existing.angles = angles;
              existing.landmarks = lms;
              existing.createdBy = `Sensei (${updatedRoom.senseiName})`;
              await existing.save();
            } else {
              await PosePreset.create({
                name: poseName,
                category: mode || "superior",
                angles: angles,
                landmarks: lms,
                createdBy: `Sensei (${updatedRoom.senseiName})`
              });
            }
            poseSaved = true;
          } catch (err) {
            console.error("Error saving remote preset:", err);
          }
        }

        updatedRoom = await DojoRoom.findOneAndUpdate(
          { roomCode: roomCodeClean, active: true },
          { 
            $set: { 
              "control.command": "none", 
              "control.newPoseName": "" 
            } 
          },
          { new: true }
        );
      }

      // Limpiar comando de captura de sesión
      if (updatedRoom && updatedRoom.control.command === "session_capture") {
        updatedRoom = await DojoRoom.findOneAndUpdate(
          { roomCode: roomCodeClean, active: true },
          { $set: { "control.command": "none" } },
          { new: true }
        );
      }

      // Limpiar captura de sesión de forma atómica
      if (updatedRoom && updatedRoom.control.command === "clear_session_capture") {
        updatedRoom = await DojoRoom.findOneAndUpdate(
          { roomCode: roomCodeClean, active: true },
          { 
            $set: { 
              sessionCapture: null,
              "control.command": "none" 
            } 
          },
          { new: true }
        );
      }

      // Devolver los datos actualizados al Sensei (incluyendo la captura de sesión)
      return NextResponse.json({
        studentPose: updatedRoom?.studentPose || null,
        meetLink: updatedRoom?.meetLink || "",
        sessionCapture: updatedRoom?.sessionCapture || null,
        poseSaved,
        success: true
      });

    } else {
      return NextResponse.json({ error: "Rol no reconocido" }, { status: 400 });
    }

  } catch (error) {
    console.error("Error in dojo sync API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

