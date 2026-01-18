import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";
import SystemLog from "@/models/SystemLog";
import { sendVerificationEmail } from "@/lib/mail";
import crypto from "crypto";

/**
 * @api {POST} /api/auth/signup
 * @description Crea un nuevo usuario en la plataforma.
 * 
 * SENIOR ENGINEERING NOTE:
 * Usamos una "API Route" estándar de Next.js.
 * Patrones aplicados aquí:
 * 1. **Defensive Programming**: Validamos todo antes de intentar procesar.
 * 2. **Graceful Error Handling**: Capturamos fallos y los logueamos sin romper la app.
 * 3. **Security First**: Contraseñas nunca se guardan en texto plano (bcrypt).
 */
export async function POST(req: Request) {
    try {
        // 1. Conexión "Lazy" a la Base de Datos
        // No mantenemos conexiones abiertas eternamente. Conectamos bajo demanda.
        await connectDB();

        // 2. Extracción segura de datos
        const { name, email, password, captchaToken } = await req.json();

        // Validación temprana (Fail Fast Strategy)
        if (!name || !email || !password || !captchaToken) {
            return NextResponse.json(
                { success: false, message: "Faltan datos requeridos o captcha inválido" },
                { status: 400 }
            );
        }

        // 2.5 Verificar Captcha (Cloudflare Turnstile)
        const captchaVerifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
        const secretKey = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA"; // Test Secret

        const captchaRes = await fetch(captchaVerifyUrl, {
            method: "POST",
            body: new URLSearchParams({
                secret: secretKey,
                response: captchaToken,
            }),
        });

        const captchaOutcome = await captchaRes.json();

        if (!captchaOutcome.success) {
            return NextResponse.json(
                { success: false, message: "Error de seguridad: Captcha inválido." },
                { status: 400 }
            );
        }

        // 3. Verificar duplicados (Usuarios ya reales)
        const userFound = await User.findOne({ email });

        if (userFound) {
            // Si el usuario existe pero NO está verificado, lo borramos de Users y dejamos que el flujo continúe hacia PendingUser
            // Esto corrige el problema de usuarios atrapados en el limbo.
            if (!userFound.emailVerified) {
                console.log(`[DEBUG] Usuario ${email} existe pero no verificado. Migrando a PendingUser...`);
                await User.deleteOne({ _id: userFound._id });
            } else {
                return NextResponse.json(
                    { success: false, message: "El correo electrónico ya está registrado" },
                    { status: 409 }
                );
            }
        }

        // 4. Hashing y Token de Verificación
        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = crypto.randomUUID();
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

        // 5. Creación/Actualización en PendingUser (No en User real)
        // Si ya existía un intento previo sin verificar, lo sobrescribimos.
        await PendingUser.findOneAndUpdate(
            { email },
            {
                name,
                email,
                passwordHash: hashedPassword,
                verificationToken,
                verificationTokenExpires,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // 6. Enviar Correo de Verificación
        try {
            console.log(`[DEBUG] Intentando enviar correo a ${email} con Resend...`);
            await sendVerificationEmail(email, verificationToken);
            console.log(`[DEBUG] Correo enviado exitosamente.`);
        } catch (mailError) {
            console.error("CRITICAL: Error enviando correo (Resend):", JSON.stringify(mailError, null, 2));
        }

        // 7. Auditoría
        await SystemLog.create({
            level: "INFO",
            message: `Intento de registro (pendiente verificación): ${email}`,
            context: "API: /api/auth/signup",
        });

        return NextResponse.json(
            { success: true, message: "Correo enviado. Por favor verifica tu cuenta para finalizar el registro." },
            { status: 201 }
        );

    } catch (error: unknown) {
        // MANEJO EXQUISITO DE ERRORES
        // 1. Guardamos el error técnico completo en nuestra "Caja Negra" (DB)
        console.error("Signup Error:", error); // Backup en consola

        const errorMessage = error instanceof Error ? error.message : "Error desconocido en registro";
        const errorStack = error instanceof Error ? error.stack : undefined;

        await SystemLog.create({
            level: "ERROR",
            message: errorMessage,
            stack_trace: errorStack,
            context: "API: /api/auth/signup",
        });

        // 2. Respondemos al usuario con un mensaje genérico (Security by Obscurity)
        // No le decimos "Falló la conexión a Mongo en el puerto 27017" porque eso da pistas a hackers.
        return NextResponse.json(
            { success: false, message: "Error interno del servidor al crear usuario" },
            { status: 500 }
        );
    }
}
