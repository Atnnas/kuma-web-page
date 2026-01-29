import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        Google,
        Facebook,
        Credentials({
            async authorize(credentials) {
                // 1. Validación de entrada
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    // 2. Conexión a DB
                    await connectDB();

                    // 3. Buscar usuario (incluyendo password que por defecto está oculto)
                    const user = await User.findOne({ email: credentials.email }).select("+password");

                    if (!user || !user.password) return null;

                    // 4. Verificar si el correo ha sido confirmado
                    // Si usamos PendingUser esto no "debería" pasar para nuevos, 
                    // pero para migrados o legacy es vital.
                    if (!user.emailVerified) {
                        // Opcional: Podrías lanzar un error específico si NextAuth lo soportara mejor en cliente
                        // Por ahora retornamos null para denegar acceso
                        return null;
                    }

                    // 5. Verificar si el usuario está activo (Bloqueo de Admin)
                    // if (user.isActive === false) return null; -> REMOVED: Allow login to see pending status

                    // 6. Comparar Hash (Seguridad)
                    const passwordsMatch = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );

                    if (passwordsMatch) {
                        // Retornamos el usuario (sin el password)
                        const { password, ...userWithoutPassword } = user.toObject();
                        return userWithoutPassword;
                    }
                } catch (error) {
                    console.error("Auth Error:", error);
                    return null;
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Permitir Credenciales sin lógica extra (ya se validó en authorize)
            if (account?.provider === "credentials") return true;

            // Manejo de OAuth (Google/Facebook)
            if (account?.provider === "google" || account?.provider === "facebook") {
                try {
                    await connectDB();
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        // Crear nuevo usuario si no existe
                        await User.create({
                            name: user.name || "Usuario",
                            email: user.email as string,
                            image: user.image || "",
                            role: "user",
                            isActive: false, // Por defecto inactivo
                        });
                    } else {
                        // Si existe, permitir acceso aunque esté inactivo (para mostrar estado pendiente)
                        // No bloqueamos aquí, controlamos acceso en componentes
                    }
                    return true;
                } catch (error) {
                    console.error("Error creating user from OAuth:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token }) {
            if (!token.email) return token;

            // Siempre sincronizar con DB para obtener ID real y Rol actualizado
            // Esto asegura que si el usuario cambió de rol, se refleje en la sesión
            try {
                await connectDB();
                const dbUser = await User.findOne({ email: token.email });

                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                    token.isActive = dbUser.isActive;
                }
            } catch (error) {
                console.error("Error fetching user data for JWT:", error);
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                // @ts-ignore - Extending default session type on the fly or need to update types
                session.user.isActive = token.isActive as boolean;
            }
            return session;
        },
    },
    session: { strategy: "jwt" },
});
