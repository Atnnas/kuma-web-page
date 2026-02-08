"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import * as PhosphorIcons from "@phosphor-icons/react";

interface AchievementOverlayProps {
    show: boolean;
    trophy: {
        slug?: string;
        name: string;
        description: string;
        icon: string;
        color: string;
        rarity: string;
    } | null;
    onClose: () => void;
}

export function AchievementOverlay({ show, trophy, onClose }: AchievementOverlayProps) {
    const { width, height } = useWindowSize();
    // Audio removed as per user request
    // const [audio] = useState(() => typeof Audio !== "undefined" ? new Audio("/sounds/achievement.mp3") : null);

    if (!trophy) return null;

    // Dynamic Icon
    const IconComponent = (PhosphorIcons as any)[trophy.icon] || PhosphorIcons.Trophy;

    // Custom Animation for "Primer Entrenamiento"
    if (trophy.slug === "primer-entrenamiento") {
        return (
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1 } }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 cursor-pointer overflow-hidden"
                    >
                        {/* GOLD/BLUE THEME BACKGROUND */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-gradient-radial from-yellow-600/20 via-blue-950 to-black animate-spin-slow opacity-60" />
                            <motion.div
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"
                            />
                        </div>

                        <Confetti width={width} height={height} numberOfPieces={300} recycle={true} gravity={0.2} colors={['#fbbf24', '#2563eb', '#ffffff']} />

                        <div className="relative text-center p-8 max-w-5xl w-full z-20">
                            <motion.div
                                initial={{ scale: 3, opacity: 0, filter: "blur(20px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative z-10"
                            >
                                <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 mb-6 uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]">
                                    ¡EL CAMINO COMIENZA!
                                </h1>

                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        filter: ["drop-shadow(0 0 30px rgba(251,191,36,0.3))", "drop-shadow(0 0 60px rgba(251,191,36,0.6))", "drop-shadow(0 0 30px rgba(251,191,36,0.3))"]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                    className="w-full h-64 md:h-80 my-8 relative flex items-center justify-center bg-black/50 rounded-2xl border border-yellow-500/30 backdrop-blur-md mx-auto aspect-square max-w-[320px] overflow-hidden shadow-2xl"
                                >
                                    {/* KUMA TROPHY IMAGE */}
                                    <img
                                        src="/images/kuma-logro-primer-entreno.jpg"
                                        alt="Primer Entrenamiento"
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                                </motion.div>

                                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-widest uppercase drop-shadow-2xl font-mono">
                                    {trophy.name}
                                </h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="text-xl md:text-2xl text-yellow-100 max-w-2xl mx-auto font-bold italics leading-relaxed"
                                >
                                    {trophy.description}
                                </motion.p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Custom Animation for "Spirit of the Bear" (Kuma Revenant)
    if (trophy.slug === "kuma-revenant") {
        return (
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1 } }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 cursor-pointer overflow-hidden"
                    >
                        {/* RED/BLACK THEME BACKGROUND */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-gradient-radial from-red-900/40 via-black to-black animate-pulse opacity-80" />
                            <motion.div
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"
                            />
                        </div>

                        {/* CLAW MARKS (Simulated) */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="absolute top-1/4 left-0 w-full h-[2px] bg-red-600 rotate-12 blur-sm origin-left"
                        />
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="absolute top-2/4 left-0 w-full h-[3px] bg-red-500 -rotate-6 blur-md origin-right"
                        />
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="absolute top-3/4 left-0 w-full h-[2px] bg-red-700 rotate-3 blur-sm origin-left"
                        />

                        <Confetti width={width} height={height} numberOfPieces={300} recycle={true} gravity={0.3} colors={['#dc2626', '#b91c1c', '#000000']} />

                        <div className="relative text-center p-8 max-w-5xl w-full z-20">
                            <motion.div
                                initial={{ scale: 3, opacity: 0, filter: "blur(20px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative z-10"
                            >
                                <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-black mb-4 uppercase italic tracking-tighter drop-shadow-[0_0_50px_rgba(220,38,38,1)] stroke-white stroke-2">
                                    ¡ESPÍRITU KUMA!
                                </h1>

                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        filter: ["drop-shadow(0 0 30px rgba(220,38,38,0.5))", "drop-shadow(0 0 80px rgba(220,38,38,1))", "drop-shadow(0 0 30px rgba(220,38,38,0.5))"]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                    className="w-full h-64 md:h-80 my-8 relative flex items-center justify-center bg-black/50 rounded-2xl border border-red-900/50 backdrop-blur-md mx-auto aspect-square max-w-[320px] overflow-hidden"
                                >
                                    {/* KUMA TROPHY IMAGE */}
                                    <img
                                        src="/images/kuma-logro-hora-entreno.jpg"
                                        alt="Espíritu Kuma"
                                        className="w-full h-full object-cover opacity-90 mix-blend-hard-light"
                                    />

                                    {/* Overlay Gradient for drama */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-transparent to-transparent" />
                                </motion.div>

                                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-widest uppercase drop-shadow-2xl font-mono">
                                    RESISTENCIA LEGENDARIA
                                </h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="text-2xl md:text-3xl text-red-100 max-w-3xl mx-auto font-bold italics"
                                >
                                    {trophy.description}
                                </motion.p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                    onClick={onClose} // Close on click/tap
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 cursor-pointer"
                >
                    {/* Radiant Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-gradient-radial from-kuma-gold/20 via-transparent to-transparent animate-spin-slow opacity-50" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-gradient-radial from-red-600/20 via-transparent to-transparent animate-reverse-spin opacity-50" />
                    </div>

                    <Confetti width={width} height={height} numberOfPieces={500} recycle={true} gravity={0.2} colors={[trophy.color, '#FFD700', '#FFFFFF']} />

                    <div className="relative text-center p-8 max-w-4xl w-full">
                        <motion.div
                            initial={{ scale: 0.2, rotate: -720, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="relative z-10"
                        >
                            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 mb-8 uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(234,179,8,0.8)] animate-pulse">
                                ¡PRIMER LOGRO!
                            </h1>

                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0],
                                    filter: ["drop-shadow(0 0 20px rgba(255,215,0,0.5))", "drop-shadow(0 0 60px rgba(255,215,0,1))", "drop-shadow(0 0 20px rgba(255,215,0,0.5))"]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-full h-48 md:h-64 my-8 relative flex items-center justify-center"
                            >
                                <IconComponent
                                    className="w-48 h-48 md:w-64 md:h-64 drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]"
                                    weight="fill"
                                    style={{ color: trophy.color }}
                                />
                            </motion.div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-widest uppercase drop-shadow-2xl">
                                {trophy.name}
                            </h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="text-2xl text-zinc-200 max-w-2xl mx-auto font-bold"
                            >
                                {trophy.description}
                            </motion.p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
