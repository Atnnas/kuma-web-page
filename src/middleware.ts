import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    // Rutas protegidas
    const isAdminRoute = nextUrl.pathname.startsWith("/admin");

    if (isAdminRoute) {
        if (!isLoggedIn) {
            // Redirigir a login si no está autenticado
            return NextResponse.redirect(new URL("/login", nextUrl));
        }

        // Verificar rol de administrador
        // @ts-ignore
        const userRole = req.auth?.user?.role;

        if (userRole !== "admin" && userRole !== "super-admin") {
            // Si está logueado pero no es admin, redirigir al home o página de error
            return NextResponse.redirect(new URL("/", nextUrl));
        }
    }

    return NextResponse.next();
});

// Configuración del matcher para el middleware
export const config = {
    matcher: ["/admin/:path*"],
};
