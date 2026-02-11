"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

    // Use Portal to escape parent styling 
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!show || !mounted) return null;

    // Celebration Configuration
    let title = "¡RACHA IMPARABLE!";
    let subtitle = `¡${streak} DÍAS CONSECUTIVOS!`;
    let message = `Te felicito llevas ${streak} días de racha. ¡Sigue así!`;
    let confettiColors = ['#fb923c', '#ea580c', '#ffffff'];
    let gradientText = "from-orange-400 via-red-500 to-yellow-400";
    let glowColor = "rgba(234,88,12,0.8)";
    let fireColor = "text-orange-500";

    if (streak === 22) {
        title = "¡HÁBITO DE ACERO!";
        subtitle = "¡BARRERA ROTA!";
        message = "Has superado los 21 días. Tu disciplina es ahora inquebrantable.";
        gradientText = "from-yellow-300 via-orange-500 to-red-600";
    } else if (streak === 60) {
        title = "¡MAESTRÍA SUPREMA!";
        subtitle = "¡60 DÍAS DE PODER!";
        message = "Eres una leyenda del Dojo. Tu llama arde con fuego cósmico.";
        confettiColors = ['#22d3ee', '#3b82f6', '#ffffff']; // Cyan/Blue
        gradientText = "from-cyan-400 via-blue-500 to-purple-600";
        glowColor = "rgba(34,211,238,0.8)";
        fireColor = "text-cyan-400";
    } else if (streak > 0 && streak % 30 === 0) {
        title = "¡FUEGO ETERNO!";
        subtitle = "¡TU LLAMA CRECE!";
        message = "30 días más de gloria. Tu constancia es imparable.";
    }

    return createPortal(
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                    onClick={onClose} // Close on click/tap
                    className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-zinc-950/98 cursor-pointer overflow-hidden p-6 md:p-12"
                >
                    {/* Radiant Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-gradient-radial ${streak === 60 ? "from-cyan-500/20" : "from-orange-500/20"} via-transparent to-transparent animate-spin-slow opacity-50`} />
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-gradient-radial ${streak === 60 ? "from-blue-600/30" : "from-red-600/30"} via-transparent to-transparent animate-reverse-spin opacity-50`} />
                    </div>

                    <Confetti width={width} height={height} numberOfPieces={500} recycle={true} gravity={0.2} colors={confettiColors} />

                    <div className="relative text-center max-w-5xl w-full flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ scale: 0.2, rotate: -720, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="relative z-10 flex flex-col items-center justify-center w-full"
                        >
                            <h1 className={`text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradientText} mb-6 md:mb-10 uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(255,165,0,0.3)] animate-pulse pr-2 md:pr-4`} style={{ textShadow: `0 0 30px ${glowColor}` }}>
                                {title}
                            </h1>

                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0],
                                    filter: [`drop-shadow(0 0 20px ${glowColor})`, `drop-shadow(0 0 60px ${glowColor})`, `drop-shadow(0 0 20px ${glowColor})`]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-full h-64 md:h-80 mb-12 relative flex items-center justify-center"
                            >
                                <Fire
                                    className={`w-48 h-48 md:w-64 md:h-64 drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] ${fireColor}`}
                                    weight="fill"
                                />
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 text-7xl md:text-9xl font-black text-white drop-shadow-2xl">
                                    {streak}
                                </span>
                            </motion.div>

                            <h2 className="text-3xl md:text-6xl font-black text-white mb-10 md:mb-14 tracking-widest uppercase drop-shadow-2xl">
                                {subtitle}
                            </h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="text-xl md:text-3xl text-zinc-200 max-w-3xl mx-auto font-bold italics leading-relaxed border-t border-white/10 pt-10 px-4"
                            >
                                {message}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2 }}
                                className="mt-16"
                            >
                                <button
                                    onClick={onClose}
                                    className="px-16 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                >
                                    ¡CONTINUAR!
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
