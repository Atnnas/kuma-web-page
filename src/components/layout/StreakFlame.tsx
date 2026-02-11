"use client";

import { Fire } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { StreakCelebrationOverlay } from "../gamification/StreakCelebrationOverlay";
import { StreakLossOverlay } from "../gamification/StreakLossOverlay";

interface StreakFlameProps {
    variant?: "default" | "mobile";
    overrideStreak?: number; // For demo/testing purposes
}

export function StreakFlame({ variant = "default", overrideStreak }: StreakFlameProps) {
    const [streak, setStreak] = useState<number | null>(null);
    const [serverCelebrationRequest, setServerCelebrationRequest] = useState(false); // Can we show it?
    const [serverLossRequest, setServerLossRequest] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false); // Do we show it now?
    const [showLossOverlay, setShowLossOverlay] = useState(false);
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
                    if (data.showLossCelebration) {
                        setServerLossRequest(true);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch streak", error);
            }
        };

        fetchStreak();
    }, []);

    // Effect to trigger overlays ONLY when on /rutinas (or subpages) AND server requested it
    useEffect(() => {
        if (serverCelebrationRequest && pathname?.startsWith("/rutinas")) {
            setShowOverlay(true);
        }
        if (serverLossRequest && pathname?.startsWith("/rutinas")) {
            setShowLossOverlay(true);
        }
    }, [pathname, serverCelebrationRequest, serverLossRequest]);

    const handleCloseCelebration = async () => {
        setShowOverlay(false);
        setServerCelebrationRequest(false); // Don't show again this session
        try {
            await fetch("/api/user/streak/mark-seen", {
                method: "POST",
                body: JSON.stringify({ type: "gain" })
            });
        } catch (error) {
            console.error("Failed to mark streak seen", error);
        }
    };

    const handleCloseLoss = async () => {
        setShowLossOverlay(false);
        setServerLossRequest(false);
        try {
            await fetch("/api/user/streak/mark-seen", {
                method: "POST",
                body: JSON.stringify({ type: "loss" })
            });
        } catch (error) {
            console.error("Failed to mark streak loss seen", error);
        }
    };

    // User requested to ALWAYS show the streak, even if 0.
    // User requested to ALWAYS show the streak, even if 0.
    const displayStreak = overrideStreak ?? streak ?? 0;

    // FLAME EVOLUTION LOGIC
    // Phase 1: 0-29 (Standard Orange)
    // Phase 2: 30-59 (Intense Red-Orange, larger)
    // Phase 3: 60+ (Cosmic Blue/Cyan, largest)

    let flameColor = "text-orange-500";
    let flameGlow = "drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]";
    let containerBorder = "border-orange-500/30";
    let containerBg = "bg-orange-900/40";
    let textColor = "text-orange-400";
    let flameSize = isMobile ? 22 : 14;

    if (displayStreak >= 60) {
        // Phase 3: Cosmic
        flameColor = "text-cyan-400";
        flameGlow = "drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]";
        containerBorder = "border-cyan-500/50";
        containerBg = "bg-cyan-900/40";
        textColor = "text-cyan-300";
        flameSize = isMobile ? 26 : 18;
    } else if (displayStreak >= 30) {
        // Phase 2: Intense
        flameColor = "text-red-500";
        flameGlow = "drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]";
        containerBorder = "border-red-500/40";
        containerBg = "bg-red-900/40";
        textColor = "text-red-400";
        flameSize = isMobile ? 24 : 16;
    } else if (displayStreak === 0) {
        // Inactive
        flameColor = "text-zinc-600";
        flameGlow = "";
        containerBorder = "border-zinc-700/30";
        containerBg = "bg-zinc-800/40";
        textColor = "text-zinc-500";
    }

    return (
        <>
            <StreakLossOverlay
                show={showLossOverlay}
                onClose={handleCloseLoss}
            />

            <StreakCelebrationOverlay
                show={showOverlay}
                streak={displayStreak}
                onClose={handleCloseCelebration}
            />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`flex items-center backdrop-blur-sm self-start border transition-all duration-500
                    ${isMobile
                        ? "gap-2 mt-2 px-3 py-1.5 rounded-2xl"
                        : "gap-1.5 mt-1 px-2 py-0.5 rounded-full"
                    }
                    ${containerBg} ${containerBorder}
                `}
                title={`${displayStreak} días consecutivos`}
            >
                <Fire
                    size={flameSize}
                    weight="fill"
                    className={`animate-pulse ${flameGlow} ${flameColor} transition-all duration-500`}
                />
                <span className={`font-bold tabular-nums leading-none ${isMobile ? "text-base" : "text-xs"} ${textColor} transition-colors duration-500`}>
                    {displayStreak}
                </span>
            </motion.div>
        </>
    );
}
