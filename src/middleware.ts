import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;

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

    return NextResponse.next();
});

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
