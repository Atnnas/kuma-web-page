"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Fire } from "@phosphor-icons/react/dist/ssr";

interface StreakCelebrationOverlayProps {
    show: boolean;
    streak: number;
    onClose: () => void;
}

export function StreakCelebrationOverlay({ show, streak, onClose }: StreakCelebrationOverlayProps) {
    const { width, height } = useWindowSize();
    useEffect(() => {
        // Audio removed as per user request
    }, [show]);

    if (!show) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                    onClick={onClose}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 cursor-pointer"
                >
                    {/* Radiant Background Effects - Orange/Red Theme for Fire */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-gradient-radial from-orange-500/20 via-transparent to-transparent animate-spin-slow opacity-50" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-gradient-radial from-red-600/30 via-transparent to-transparent animate-reverse-spin opacity-50" />
                    </div>

                    <Confetti width={width} height={height} numberOfPieces={500} recycle={true} gravity={0.2} colors={['#fb923c', '#ea580c', '#ffffff']} />

                    <div className="relative text-center p-8 max-w-4xl w-full">
                        <motion.div
                            initial={{ scale: 0.2, rotate: -720, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="relative z-10"
                        >
                            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 mb-8 uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(234,88,12,0.8)] animate-pulse">
                                ¡RACHA IMPARABLE!
                            </h1>

                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0],
                                    filter: ["drop-shadow(0 0 20px rgba(234,88,12,0.5))", "drop-shadow(0 0 60px rgba(234,88,12,1))", "drop-shadow(0 0 20px rgba(234,88,12,0.5))"]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-full h-48 md:h-64 my-8 relative flex items-center justify-center"
                            >
                                <Fire
                                    className="w-48 h-48 md:w-64 md:h-64 drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] text-orange-500"
                                    weight="fill"
                                />
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 text-6xl md:text-8xl font-black text-white drop-shadow-md">
                                    {streak}
                                </span>
                            </motion.div>

                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-widest uppercase drop-shadow-2xl">
                                ¡{streak} DÍAS CONSECUTIVOS!
                            </h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="text-2xl text-zinc-200 max-w-2xl mx-auto font-bold"
                            >
                                Te felicito llevas {streak} días de racha. ¡Sigue así!
                            </motion.p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
