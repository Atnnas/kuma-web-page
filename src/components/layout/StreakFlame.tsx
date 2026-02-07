"use client";

import { Fire } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { StreakCelebrationOverlay } from "../gamification/StreakCelebrationOverlay";

interface StreakFlameProps {
    variant?: "default" | "mobile";
}

export function StreakFlame({ variant = "default" }: StreakFlameProps) {
    const [streak, setStreak] = useState<number | null>(null);
    const [serverCelebrationRequest, setServerCelebrationRequest] = useState(false); // Can we show it?
    const [showOverlay, setShowOverlay] = useState(false); // Do we show it now?
    const pathname = usePathname();
    const isMobile = variant === "mobile";

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const res = await fetch("/api/user/streak", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    console.log("Streak data:", data);
                    setStreak(data.streak);
                    if (data.showCelebration) {
                        setServerCelebrationRequest(true);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch streak", error);
            }
        };

        fetchStreak();
    }, []);

    // Effect to trigger overlay ONLY when on /rutinas (or subpages) AND server requested it
    useEffect(() => {
        if (serverCelebrationRequest && pathname?.startsWith("/rutinas")) {
            setShowOverlay(true);
        }
    }, [pathname, serverCelebrationRequest]);

    const handleCloseCelebration = async () => {
        setShowOverlay(false);
        setServerCelebrationRequest(false); // Don't show again this session
        try {
            await fetch("/api/user/streak/mark-seen", { method: "POST" });
        } catch (error) {
            console.error("Failed to mark streak seen", error);
        }
    };

    // User requested to ALWAYS show the streak, even if 0.
    const displayStreak = streak ?? 0;

    return (
        <>
            <StreakCelebrationOverlay
                show={showOverlay}
                streak={displayStreak}
                onClose={handleCloseCelebration}
            />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`flex items-center backdrop-blur-sm self-start border transition-colors duration-300
                    ${isMobile
                        ? "gap-2 mt-2 px-3 py-1.5 rounded-2xl" // Mobile: Squarer, larger padding
                        : "gap-1.5 mt-1 px-2 py-0.5 rounded-full" // Default: Capsule, smaller
                    }
                    ${displayStreak > 0
                        ? "bg-orange-900/40 border-orange-500/30"
                        : "bg-zinc-800/40 border-zinc-700/30"
                    }
                `}
                title={`${displayStreak} días consecutivos`}
            >
                <Fire
                    size={isMobile ? 22 : 14}
                    weight="fill"
                    className={`animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] ${displayStreak > 0 ? "text-orange-500" : "text-zinc-600"}`}
                />
                <span className={`font-bold tabular-nums leading-none ${isMobile ? "text-base" : "text-xs"} ${displayStreak > 0 ? "text-orange-400" : "text-zinc-500"}`}>
                    {displayStreak}
                </span>
            </motion.div>
        </>
    );
}
