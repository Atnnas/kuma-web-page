"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackVisit } from "@/lib/actions/analytics";

export function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname && !pathname.startsWith("/admin")) {
            // Track visit when pathname changes
            // Exclude admin pages to avoid polluting public stats
            trackVisit(pathname, window.navigator.userAgent);
        }
    }, [pathname]);

    return null; // Invisible component
}
