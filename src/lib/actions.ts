"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

// Definimos el tipo de estado para el hook useActionState
export type LoginState = {
    message?: string;
    success?: boolean;
};

export async function authenticate(
    prevState: LoginState | undefined,
    formData: FormData
): Promise<LoginState | undefined> {
    try {
        await signIn("credentials", {
            ...Object.fromEntries(formData),
            redirect: false, // Importante: Evitamos que NextAuth redirija automáticamente
        });

        // Si no lanza error, el login fue exitoso
        return { success: true, message: "¡Login exitoso! Redirigiendo..." };

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { message: "Credenciales inválidas. Verifica tu correo y contraseña.", success: false };
                default:
                    return { message: "Algo salió mal. Por favor intenta de nuevo.", success: false };
            }
        }

        // Si es otro tipo de error, lo lanzamos para que Next.js lo maneje o lo logueamos
        console.error("Login unexpected error:", error);
        throw error;
    }
}

export async function handleSignOut() {
    await signOut({ redirect: false });
}
