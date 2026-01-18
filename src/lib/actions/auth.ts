"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";
import { sendVerificationEmail } from "@/lib/mail";
import crypto from "crypto";

export async function resendVerificationEmail(email: string) {
    if (!email) {
        return { success: false, message: "Correo electrónico requerido" };
    }

    try {
        await connectDB();

        // 1. Buscar en PendingUser (usuarios que se acaban de registrar)
        let token = crypto.randomUUID();
        let name = "";

        const pendingUser = await PendingUser.findOne({ email });

        if (pendingUser) {
            name = pendingUser.name;
            pendingUser.verificationToken = token;
            pendingUser.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await pendingUser.save();
        } else {
            // 2. Buscar en User (por si ya fue promovido pero aún no verificado)
            const user = await User.findOne({ email, emailVerified: null });

            if (!user) {
                return {
                    success: false,
                    message: "No se encontró una cuenta pendiente de verificación con este correo."
                };
            }

            name = user.name;
            user.verificationToken = token;
            user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await user.save();
        }

        // 3. Reenviar correo
        await sendVerificationEmail(email, token);

        return {
            success: true,
            message: "Correo de verificación reenviado exitosamente."
        };

    } catch (error: any) {
        console.error("Error resending verification email:", error);
        return {
            success: false,
            message: error.message || "Ocurrió un error al intentar reenviar el correo."
        };
    }
}
