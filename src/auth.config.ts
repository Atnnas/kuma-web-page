import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        newUser: "/register",
        error: "/login", // Redirigir errores de auth al login
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.role = token.role as string; // Persistir rol en sesión
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role; // Guardar rol en token al iniciar sesión
            }
            return token;
        },
    },
    providers: [], // Providers are configured in auth.ts (Server-side)
} satisfies NextAuthConfig;
