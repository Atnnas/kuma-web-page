"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Fire, CloudRain } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

interface StreakLossOverlayProps {
    show: boolean;
    onAccept: () => void;
}

export function StreakLossOverlay({ show, onAccept }: StreakLossOverlayProps) {
    // Only mount if shown to avoid audio loading?
    // Actually we want to pre-load potentially.
    // Let's rely on show.

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl text-center p-6"
                >
                    {/* Background Rain Effect - Conceptual */}
                    <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="relative z-10 max-w-lg w-full"
                    >
                        <div className="relative mx-auto w-40 h-40 mb-8 flex items-center justify-center">
                            {/* Dying Flame Animation */}
                            <motion.div
                                animate={{
                                    scale: [1, 0.5, 0],
                                    opacity: [1, 0.5, 0],
                                    filter: ["grayscale(0%)", "grayscale(50%)", "grayscale(100%)"]
                                }}
                                transition={{ duration: 3, times: [0, 0.5, 1] }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Fire weight="fill" className="w-40 h-40 text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.6)]" />
                            </motion.div>

                            {/* Rain taking over */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2, duration: 1 }}
                                className="absolute inset-0 flex items-center justify-center text-blue-400"
                            >
                                <CloudRain weight="duotone" className="w-32 h-32" />
                            </motion.div>
                        </div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 2.5 }}
                            className="text-4xl md:text-5xl font-black text-white mb-4 italic"
                        >
                            LA LLAMA SE HA EXTINGUIDO...
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 3 }}
                            className="text-zinc-400 text-lg mb-12"
                        >
                            Han pasado más de 2 días sin entrenamiento. Tu racha vuelve al origen. Pero un verdadero guerrero siempre se levanta.
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onAccept}
                            className="bg-white text-black font-black text-xl px-12 py-4 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all uppercase"
                        >
                            REENCENDER EL ESPÍRITU
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
