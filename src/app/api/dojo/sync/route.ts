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

    // Buscar la sala activa
    const room = await DojoRoom.findOne({ roomCode: roomCode.trim().toUpperCase(), active: true });
    if (!room) {
      return NextResponse.json({ error: "Sala no encontrada o inactiva" }, { status: 404 });
    }

    room.lastActive = new Date();

    if (role === "student") {
      // El alumno sube sus datos de pose en vivo y descarga las directrices del Sensei
      if (body.studentPose) {
        room.studentPose = {
          landmarks: body.studentPose.landmarks || [],
          angles: body.studentPose.angles || { left: 0, right: 0 },
          alignmentScore: body.studentPose.alignmentScore || 0,
          isAligned: !!body.studentPose.isAligned,
          mode: body.studentPose.mode || "superior"
        };
        room.markModified("studentPose");
      }

      await room.save();

      // Devolver control del Sensei al Alumno (including session capture if any)
      return NextResponse.json({
        control: room.control,
        meetLink: room.meetLink || "",
        senseiPeerId: room.senseiPeerId || "",
        sessionCapture: room.sessionCapture || null,
        success: true
      });

    } else if (role === "sensei") {
      // El Sensei controla la sala (cambia de preset, tolerancia, o comando)
      // Solo admins o super admins pueden actuar como Sensei en la sala
      const session = await auth();
      if (!session || (session.user?.role !== "admin" && session.user?.role !== "super_admin")) {
        return NextResponse.json({ error: "No autorizado. Solo instructores." }, { status: 401 });
      }

      // Si el Sensei actualizó controles
      if (body.control) {
        room.control.guidedMode = body.control.guidedMode !== undefined ? body.control.guidedMode : room.control.guidedMode;
        room.control.tolerance = body.control.tolerance !== undefined ? body.control.tolerance : room.control.tolerance;
        room.control.presetId = body.control.presetId !== undefined ? body.control.presetId : room.control.presetId;
        room.control.analysisMode = body.control.analysisMode !== undefined ? body.control.analysisMode : (room.control.analysisMode || "completo");
        
        // Si hay un comando nuevo
        if (body.control.command && body.control.command !== "none") {
          room.control.command = body.control.command;
          room.control.newPoseName = body.control.newPoseName || "";
          room.control.timestamp = Date.now();
        }
        room.markModified("control");
      }

      // Si el Sensei actualizó el enlace de Meet
      if (body.meetLink !== undefined) {
        room.meetLink = body.meetLink;
      }

      // Si el Sensei actualizó su P2P Peer ID
      if (body.senseiPeerId !== undefined) {
        room.senseiPeerId = body.senseiPeerId;
      }

      // Handle session capture commands
      if (body.sessionCapture !== undefined) {
        room.sessionCapture = body.sessionCapture;
        room.markModified("sessionCapture");
      }

      await room.save();

      let poseSaved = false;

      // Si el comando es capturar postura ("save_pose"), la guardamos
      if (room.control.command === "save_pose") {
        const poseName = room.control.newPoseName?.trim();
        const lms = room.studentPose?.landmarks;
        const angles = room.studentPose?.angles;
        const mode = room.studentPose?.mode;

        if (poseName && lms && lms.length > 0 && angles) {
          try {
            // Verificar si ya existe
            const existing = await PosePreset.findOne({ name: poseName });
            if (existing) {
              // Si existe, actualizamos sus valores
              existing.category = mode || "superior";
              existing.angles = angles;
              existing.landmarks = lms;
              existing.createdBy = `Sensei (${room.senseiName})`;
              await existing.save();
            } else {
              // Si no, lo creamos
              await PosePreset.create({
                name: poseName,
                category: mode || "superior",
                angles: angles,
                landmarks: lms,
                createdBy: `Sensei (${room.senseiName})`
              });
            }

            poseSaved = true;

            // Resetear el comando para que no se ejecute de nuevo
            room.control.command = "none";
            room.control.newPoseName = "";
            room.markModified("control");
            await room.save();

          } catch (err) {
            console.error("Error saving remote preset:", err);
          }
        } else {
          // Si no hay landmarks válidos, reiniciamos el comando para evitar bucles
          room.control.command = "none";
          room.markModified("control");
          await room.save();
        }
      }

      // Handle session_capture command: store in room and reset command
      if (room.control.command === "session_capture") {
        room.control.command = "none";
        room.markModified("control");
        await room.save();
      }

      // Handle clear_session_capture command: clear session capture and reset command
      if (room.control.command === "clear_session_capture") {
        room.sessionCapture = null;
        room.control.command = "none";
        room.markModified("sessionCapture");
        room.markModified("control");
        await room.save();
      }

      // Devolver los datos del alumno al Sensei
      return NextResponse.json({
        studentPose: room.studentPose,
        meetLink: room.meetLink || "",
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
