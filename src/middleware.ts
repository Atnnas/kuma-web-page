import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const user = req.auth?.user;
    const userRole = user?.role;
    // @ts-ignore - isActive is added in auth.ts callback
    const isActive = user?.isActive;

    // 1. Proteger rutas de admin
    if (nextUrl.pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", nextUrl));
        }

        // RBAC: Solo super_admin puede acceder al panel de administración
        if (userRole !== "super_admin") {
            return NextResponse.redirect(new URL("/", nextUrl));
        }
    }

    // 2. Proteger Rutinas (Solo usuarios registrados y ACTIVOS)
    if (nextUrl.pathname.startsWith("/rutinas")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", nextUrl));
        }

        // Si no está activo, redirigir al home (o podrías crear una página de /pending-activation)
        // Por ahora redirigimos al home con un parámetro de error para mostrar un mensaje
        if (isActive === false) {
            return NextResponse.redirect(new URL("/?error=inactive", nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
