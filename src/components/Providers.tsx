"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children, session }: { children: React.ReactNode; session?: any }) {
    return (
        <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={5 * 60}>
            {children}
        </SessionProvider>
    );
}
