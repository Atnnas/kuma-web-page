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

        // RBAC: super_admin y admin pueden acceder al panel de administración
        if (userRole !== "super_admin" && userRole !== "admin") {
            return NextResponse.redirect(new URL("/", nextUrl));
        }
    }

    // 2. Proteger Rutinas (Solo usuarios registrados y ACTIVOS)
    if (nextUrl.pathname.startsWith("/routines")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", nextUrl));
        }

        // Si no está activo, redirigir al home
        if (isActive === false) {
            return NextResponse.redirect(new URL("/?error=inactive", nextUrl));
        }
    }

    // 3. Proteger Academia Kuma & Didáctica (Solo usuarios registrados y ACTIVOS)
    if (nextUrl.pathname.startsWith("/resources/didactica")) {
        if (!isLoggedIn) {
            const loginUrl = new URL("/login", nextUrl);
            loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Si no está activo, redirigir al home con aviso de activación requerida
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
