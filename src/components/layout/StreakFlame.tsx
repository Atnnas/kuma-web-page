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
    const [restDays, setRestDays] = useState<number>(0);
    const [serverCelebrationRequest, setServerCelebrationRequest] = useState(false);
    const [serverLossRequest, setServerLossRequest] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showLossOverlay, setShowLossOverlay] = useState(false);
    const pathname = usePathname();
    const isMobile = variant === "mobile";

    // Animation states
    const [prevRestDays, setPrevRestDays] = useState<number>(0);
    const [isRestDayIgniting, setIsRestDayIgniting] = useState(false);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const res = await fetch("/api/user/streak", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    setStreak(data.streak);
                    setRestDays(data.restDays || 0);

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

    // Effect to detect rest day gain and trigger animation
    useEffect(() => {
        if (restDays > prevRestDays && prevRestDays !== 0) {
            setIsRestDayIgniting(true);
            setTimeout(() => setIsRestDayIgniting(false), 2000);
        }
        setPrevRestDays(restDays);
    }, [restDays, prevRestDays]);

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
        setServerCelebrationRequest(false);
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

    const displayStreak = overrideStreak ?? streak ?? 0;

    // RED FLAME STYLES
    let flameColor = "text-orange-500";
    let flameGlow = "drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]";
    let containerBorder = "border-orange-500/30";
    let containerBg = "bg-orange-900/40";
    let textColor = "text-orange-400";
    let flameSize = isMobile ? 18 : 12;

    if (displayStreak >= 60) {
        flameColor = "text-cyan-400";
        flameGlow = "drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]";
        containerBorder = "border-cyan-500/50";
        containerBg = "bg-cyan-900/40";
        textColor = "text-cyan-300";
        flameSize = isMobile ? 22 : 16;
    } else if (displayStreak >= 30) {
        flameColor = "text-red-500";
        flameGlow = "drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]";
        containerBorder = "border-red-500/40";
        containerBg = "bg-red-900/40";
        textColor = "text-red-400";
        flameSize = isMobile ? 20 : 14;
    } else if (displayStreak === 0) {
        flameColor = "text-zinc-600";
        flameGlow = "";
        containerBorder = "border-zinc-700/30";
        containerBg = "bg-zinc-800/40";
        textColor = "text-zinc-500";
    }

    return (
        <div className="flex flex-col md:flex-row items-center gap-2">
            <StreakLossOverlay show={showLossOverlay} onClose={handleCloseLoss} />
            <StreakCelebrationOverlay show={showOverlay} streak={displayStreak} onClose={handleCloseCelebration} />

            <div className="flex items-center gap-1.5">
                {/* RED STREAK FLAME */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center backdrop-blur-sm border transition-all duration-500
                        ${isMobile ? "gap-2 px-3 py-1.5 rounded-2xl" : "gap-1.5 px-2 py-0.5 rounded-full"}
                        ${containerBg} ${containerBorder}
                    `}
                    title={`${displayStreak} días consecutivos`}
                >
                    <Fire
                        size={flameSize}
                        weight="fill"
                        className={`animate-pulse ${flameGlow} ${flameColor} transition-all duration-500`}
                    />
                    <span className={`font-bold tabular-nums leading-none ${isMobile ? "text-base" : "text-[10px]"} ${textColor} transition-colors duration-500`}>
                        {displayStreak}
                    </span>
                </motion.div>

                {/* BLUE REST DAY FLAME */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: isRestDayIgniting ? [1, 1.4, 1] : 1,
                        opacity: 1
                    }}
                    transition={{ duration: 0.5 }}
                    className={`flex items-center backdrop-blur-sm border transition-all duration-500
                        ${isMobile ? "gap-2 px-3 py-1.5 rounded-2xl" : "gap-1.5 px-2 py-0.5 rounded-full"}
                        ${restDays > 0 ? "border-cyan-500/30 bg-cyan-950/40" : "border-zinc-700/30 bg-zinc-800/40"}
                    `}
                    title={`${restDays} días de descanso disponibles`}
                >
                    <Fire
                        size={isMobile ? 18 : 12}
                        weight="fill"
                        className={`transition-all duration-500
                            ${restDays > 0
                                ? "animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] text-cyan-400"
                                : "text-zinc-600"}
                        `}
                    />
                    <span className={`font-bold tabular-nums leading-none ${isMobile ? "text-base" : "text-[10px]"} transition-colors duration-500
                        ${restDays > 0 ? "text-cyan-300" : "text-zinc-500"}
                    `}>
                        {restDays}
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
