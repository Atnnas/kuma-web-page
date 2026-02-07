"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface LevelUpOverlayProps {
    show: boolean;
    newBelt: string;
    onClose: () => void;
}

const BELT_COLORS: Record<string, string> = {
    "Blanco": "#ffffff",
    "Amarillo": "#fbbf24", // amber-400
    "Naranja": "#f97316", // orange-500
    "Verde": "#22c55e", // green-500
    "Azul": "#3b82f6", // blue-500
    "Morado": "#a855f7", // purple-500
    "Café 3": "#78350f", // amber-900
    "Café 2": "#78350f", // amber-900
    "Café 1": "#78350f", // amber-900
    "Negro": "#000000"
};

export function LevelUpOverlay({ show, newBelt, onClose }: LevelUpOverlayProps) {
    const { width, height } = useWindowSize();
    const [audio] = useState(typeof Audio !== "undefined" ? new Audio("/sounds/level-up.mp3") : null);

    useEffect(() => {
        if (show && audio) {
            audio.play().catch(() => { });
        }
    }, [show, audio]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
                >
                    <Confetti width={width} height={height} numberOfPieces={500} recycle={false} />

                    <div className="relative text-center p-8 max-w-2xl w-full">
                        {/* Background glow matching belt color */}
                        <div
                            className="absolute inset-0 blur-[100px] opacity-30 animate-pulse"
                            style={{ backgroundColor: BELT_COLORS[newBelt] || "#fff" }}
                        />

                        <motion.div
                            initial={{ scale: 0.5, y: 100 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="relative z-10"
                        >
                            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 mb-8 uppercase italic tracking-tighter">
                                ¡NIVEL DESBLOQUEADO!
                            </h1>

                            <motion.div
                                initial={{ rotate: -180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                                className="w-full h-32 md:h-48 my-8 relative flex items-center justify-center"
                            >
                                {/* Belt Visual Representation */}
                                <div
                                    className="w-[80%] h-12 md:h-20 shadow-[0_0_50px_rgba(255,255,255,0.5)] flex items-center justify-center relative transform -skew-x-12"
                                    style={{ backgroundColor: BELT_COLORS[newBelt] || "#fff" }}
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />
                                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-black/20" />
                                    <span className="text-black/50 font-black text-2xl md:text-4xl uppercase tracking-widest drop-shadow-sm">
                                        KUMA DOJO
                                    </span>
                                </div>
                            </motion.div>

                            <h2 className="text-4xl font-bold text-white mb-4">
                                Cinturón <span style={{ color: BELT_COLORS[newBelt] }}>{newBelt}</span>
                            </h2>

                            <p className="text-xl text-zinc-400 mb-12 max-w-lg mx-auto">
                                Has demostrado una constancia legendaria. El camino del guerrero continúa.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="bg-white text-black font-black text-xl px-12 py-4 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all uppercase"
                            >
                                ACEPTAR DESTINO
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
