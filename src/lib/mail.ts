import { Resend } from "resend";
import connectDB from "./db";
import SystemLog from "@/models/SystemLog";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/verify?token=${token}`;

    // MODO DESARROLLO: Loggear el link de forma muy visible
    console.log("\n" + "=".repeat(50));
    console.log("🚀 [SISTEMA DE VERIFICACIÓN - MODO DESARROLLO]");
    console.log(`📧 DESTINATARIO: ${email}`);
    console.log(`🔗 ENLACE: ${confirmLink}`);
    console.log("=".repeat(50) + "\n");

    try {
        // Guardar en Logs el link también para poder verlo con herramientas de diagnóstico
        await connectDB();
        await SystemLog.create({
            level: "INFO",
            message: `Registro/Reenvío para ${email}. Link: ${confirmLink}`,
            context: "lib/mail.ts"
        });

        // Intentar enviar con Resend, pero no bloquear si falla
        const response = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "Kuma Dojo <onboarding@resend.dev>",
            to: email,
            subject: "Confirma tu correo electrónico - Kuma Dojo",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #DC2626;">Bienvenido al Dojo</h1>
                <p>Gracias por registrarte. Para completar tu registro, por favor confirma tu correo electrónico.</p>
                <div style="margin: 30px 0;">
                    <a href="${confirmLink}" style="background-color: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirmar Cuenta</a>
                </div>
                <p style="color: #666; font-size: 14px;">Si no solicitaste este correo, puedes ignorarlo.</p>
                <p style="color: #999; font-size: 12px; margin-top: 20px;">Este enlace expirará en 24 horas.</p>
            </div>
            `
        });

        // @ts-ignore
        if (response.error) {
            // No lanzamos error en desarrollo para no bloquear el registro
            console.warn("[MAIL WARNING] Resend no pudo entregar el correo (Probablemente restricción de dominio)");
        } else {
            console.log("[MAIL] Enviado exitosamente vía Resend");
        }

        await connectDB();
        await SystemLog.create({
            level: "INFO",
            message: `Correo de verificación enviado a ${email} (Link logged to console)`,
            context: "lib/mail.ts"
        });

    } catch (error: any) {
        console.error("[MAIL ERROR] Falló el envío vía API:", error.message);

        await connectDB();
        await SystemLog.create({
            level: "ERROR",
            message: `Error enviando correo a ${email}: ${error.message}`,
            context: "lib/mail.ts",
            stack_trace: error.stack
        });

        if (process.env.NODE_ENV === "production") {
            throw new Error(error.message || "Error enviando correo");
        }
    }
};
