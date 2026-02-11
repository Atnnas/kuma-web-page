"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Fire, Warning, HeartBreak, Skull } from "@phosphor-icons/react/dist/ssr";

interface StreakLossOverlayProps {
    show: boolean;
    onClose: () => void;
}

export function StreakLossOverlay({ show, onClose }: StreakLossOverlayProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!show || !mounted) return null;

    return createPortal(
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1.5 } }}
                    className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-zinc-950/98 cursor-pointer overflow-hidden pt-20 pb-10 px-6 md:pt-32 md:pb-16 md:px-12"
                    onClick={onClose}
                >
                    {/* ASH / SMOKE BACKGROUND EFFECTS */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-gradient-radial from-zinc-800/20 via-black to-black opacity-80" />

                        {/* FALLING ASH (Particles) */}
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: -100, x: Math.random() * 100 + "%", opacity: 0 }}
                                animate={{
                                    y: "110vh",
                                    x: (Math.random() * 100 - 10) + "%",
                                    opacity: [0, 0.3, 0],
                                    rotate: 360
                                }}
                                transition={{
                                    duration: Math.random() * 5 + 5,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: Math.random() * 5
                                }}
                                className="absolute w-1 h-1 bg-zinc-500 rounded-full blur-[1px]"
                            />
                        ))}
                    </div>

                    <div className="relative text-center max-w-5xl w-full flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative z-10 flex flex-col items-center justify-center w-full"
                        >
                            <h1 className="text-6xl md:text-9xl font-black text-zinc-600 mb-6 md:mb-10 uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(0,0,0,1)] pr-2 md:pr-4">
                                RACHA PERDIDA
                            </h1>

                            <motion.div
                                animate={{
                                    y: [0, 5, 0],
                                    rotate: [0, -1, 1, 0],
                                    filter: ["grayscale(1)", "grayscale(1) brightness(0.8)", "grayscale(1)"]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-full h-64 md:h-80 mb-12 relative flex items-center justify-center"
                            >
                                {/* EXTINGUISHED FLAME */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Fire
                                        className="w-64 h-64 md:w-80 md:h-80 text-zinc-900 scale-110 blur-xl opacity-50"
                                        weight="fill"
                                    />
                                </div>

                                <Fire
                                    className="w-48 h-48 md:w-64 md:h-64 text-zinc-700 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                                    weight="fill"
                                />

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <HeartBreak className="w-24 h-24 text-zinc-500 translate-y-4" weight="duotone" />
                                </motion.div>

                                {/* SMOKE WHISPS */}
                                <motion.div
                                    animate={{ y: -100, opacity: 0, x: [0, 20, -20, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                                    className="absolute top-1/2 w-16 h-16 bg-zinc-500/20 rounded-full blur-2xl"
                                />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-3xl md:text-6xl font-black text-zinc-400 tracking-widest uppercase"
                            >
                                EL FUEGO SE HA EXTINGUIDO
                            </motion.h2>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
