"use client";
import React, { useState } from "react";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { motion, AnimatePresence } from "framer-motion";
import { Hyoshi } from "@/components/sections/Hyoshi";
import { Metronome, CaretRight, Sparkle } from "@phosphor-icons/react/dist/ssr";

export default function AplicacionesPage() {
    const [activeApp, setActiveApp] = useState<string | null>(null);

    const handleBack = () => setActiveApp(null);

    return (
        <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden pt-24 pb-20">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-kuma-gold/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 px-6 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {!activeApp ? (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Header */}
                            <div className="flex flex-col items-center justify-center gap-8 mb-16 text-center">
                                <div>
                                    <span className="text-kuma-gold font-bold uppercase tracking-[0.2em] text-sm mb-4 block drop-shadow-md">Recursos Kuma</span>
                                    <PrimalTitle className="text-5xl md:text-7xl uppercase tracking-widest">
                                        Aplicaciones
                                    </PrimalTitle>
                                    <div className="w-24 h-1 bg-kuma-gold mt-6 mx-auto rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Hyoshi Card */}
                                <motion.button
                                    onClick={() => setActiveApp("hyoshi")}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative flex flex-col items-start p-8 bg-zinc-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all hover:bg-zinc-900/60 hover:border-kuma-gold/30 shadow-2xl"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Sparkle weight="fill" className="w-4 h-4 text-kuma-gold animate-pulse" />
                                    </div>

                                    <div className="w-16 h-16 bg-kuma-gold/10 rounded-2xl flex items-center justify-center mb-8 border border-kuma-gold/20 group-hover:scale-110 group-hover:bg-kuma-gold/20 transition-all duration-500">
                                        <Metronome weight="duotone" className="w-8 h-8 text-kuma-gold" />
                                    </div>

                                    <h3 className="text-2xl font-black uppercase tracking-wider mb-2 group-hover:text-kuma-gold transition-colors font-serif">Hyoshi</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed mb-8 text-left font-medium">
                                        Entrenador de ritmo especializado para Kata. Graba tus tiempos, visualiza los intervalos y perfecciona tu tempo con señales auditivas inteligentes.
                                    </p>

                                    <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                                        Lanzar Aplicación
                                        <CaretRight weight="bold" className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-kuma-gold/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                                </motion.button>

                                {/* Placeholder for more apps */}
                                <div className="border border-dashed border-white/5 rounded-[2.5rem] flex items-center justify-center p-8 bg-white/[0.01]">
                                    <p className="text-zinc-700 font-bold uppercase tracking-[0.2em] text-[10px]">
                                        Más herramientas próximamente
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="hyoshi-app"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                        >
                            <Hyoshi onBack={handleBack} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
