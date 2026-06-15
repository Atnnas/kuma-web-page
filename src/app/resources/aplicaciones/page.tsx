"use client";
import React from "react";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { motion } from "framer-motion";
import { Metronome, CaretRight, Sparkle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function AplicacionesPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden pt-24 pb-20">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-kuma-gold/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                        {/* Ritmo Katas Card - Luxury Minimalist */}
                        <Link href="/resources/aplicaciones/ritmo-katas" className="contents">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative flex flex-col items-center justify-center p-12 bg-zinc-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all hover:bg-zinc-900/60 hover:border-kuma-gold/50 shadow-2xl h-64 cursor-pointer"
                            >
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-kuma-gold/5 via-transparent to-transparent" />
                                    <div className="absolute -inset-1 bg-kuma-gold/10 blur-2xl animate-pulse" />
                                </div>

                                <h3 className="text-3xl font-black uppercase tracking-[0.3em] group-hover:text-kuma-gold transition-all duration-500 font-serif drop-shadow-2xl translate-y-2 group-hover:translate-y-0 italic text-center">
                                    Ritmo Katas
                                </h3>

                                {/* Minimalist Decoration */}
                                <div className="w-12 h-0.5 bg-kuma-gold/30 mt-4 group-hover:w-24 group-hover:bg-kuma-gold transition-all duration-500 rounded-full" />

                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-kuma-gold/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
                            </motion.div>
                        </Link>

                        {/* Dojo Virtual Card - Luxury Minimalist */}
                        <Link href="/resources/aplicaciones/dojo-virtual" className="contents">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative flex flex-col items-center justify-center p-12 bg-zinc-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all hover:bg-zinc-900/60 hover:border-red-500/50 shadow-2xl h-64 cursor-pointer"
                            >
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/5 via-transparent to-transparent" />
                                    <div className="absolute -inset-1 bg-red-600/10 blur-2xl animate-pulse" />
                                </div>

                                <h3 className="text-3xl font-black uppercase tracking-[0.3em] group-hover:text-red-500 transition-all duration-500 font-serif drop-shadow-2xl translate-y-2 group-hover:translate-y-0 italic text-center">
                                    Dojo Virtual
                                </h3>

                                {/* Minimalist Decoration */}
                                <div className="w-12 h-0.5 bg-red-600/30 mt-4 group-hover:w-24 group-hover:bg-red-500 transition-all duration-500 rounded-full" />

                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
                            </motion.div>
                        </Link>

                        {/* Placeholder for more apps */}
                        <div className="border border-dashed border-white/5 rounded-[2.5rem] flex items-center justify-center p-8 bg-white/[0.01]">
                            <p className="text-zinc-700 font-bold uppercase tracking-[0.2em] text-[10px]">
                                Más herramientas próximamente
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
