"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { Check, AlertTriangle, Clock, Target, Shield, AlertCircle } from "lucide-react";

export default function ReglamentoGeneralPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-kuma-gold/30">
            {/* --- HEADER --- */}
            <header className="relative w-full h-[40vh] md:h-[50vh] flex flex-col items-center justify-center overflow-hidden border-b border-kuma-gold/20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-zinc-950" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-[0.2em] text-kuma-gold uppercase bg-kuma-gold/10 border border-kuma-gold/20 rounded-full"
                    >
                        WKF Competition Rules 2026
                    </motion.span>
                    <PrimalTitle className="text-4xl md:text-6xl lg:text-7xl mb-6">
                        Reglamento General
                    </PrimalTitle>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 font-serif italic text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        "Master Copy V9: Guía de estudio simplificada para el atleta moderno."
                    </motion.p>
                </div>

                <BackButton href="/recursos/didactica" />
            </header>

            {/* --- CONTENT --- */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden min-h-screen">
                <div className="max-w-6xl mx-auto space-y-20">

                    {/* INTRO GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-kuma-gold/30 transition-colors"
                        >
                            <div className="p-4 bg-kuma-gold/10 rounded-full text-kuma-gold mb-4 group-hover:scale-110 transition-transform">
                                <Clock size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Duración</h3>
                            <p className="text-zinc-400 text-sm">
                                <span className="text-white font-bold">1:30 min</span> (U14 & menor)<br />
                                <span className="text-white font-bold">2:00 min</span> (Cadete/Junior/U21)<br />
                                <span className="text-white font-bold">3:00 min</span> (Senior Masc/Fem)
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-kuma-gold/30 transition-colors"
                        >
                            <div className="p-4 bg-red-900/20 rounded-full text-red-500 mb-4 group-hover:scale-110 transition-transform">
                                <Target size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Victoria</h3>
                            <p className="text-zinc-400 text-sm">
                                Mayor puntuación al final del tiempo.<br />
                                Diferencia de <span className="text-white font-bold">8 puntos</span> (Senshu no aplica). <br />
                                Descalificación o abandono (Kiken/Hansoku).
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-kuma-gold/30 transition-colors"
                        >
                            <div className="p-4 bg-blue-900/20 rounded-full text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Protección</h3>
                            <p className="text-zinc-400 text-sm">
                                Guantillas, espinilleras, protector bucal y pectoral (fem) obligatorios.<br />
                                <span className="text-kuma-gold font-bold">NUEVO 2026:</span> Casco obligatorio U14.
                            </p>
                        </motion.div>
                    </div>

                    {/* KEY UPDATES 2026 - VISUAL DIAGRAM */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px bg-white/10 flex-1" />
                            <h2 className="text-2xl md:text-3xl font-serif font-black text-kuma-gold uppercase tracking-wider text-center">
                                Actualizaciones Clave 2026
                            </h2>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Card 1: Skin Touch */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Target size={100} />
                                </div>
                                <div className="p-8 relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <Check className="text-green-500" /> Skin Touch (Contacto)
                                    </h3>
                                    <ul className="space-y-3 text-zinc-400 text-sm">
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                                            <p>Ya NO es penalización automática tocar.</p>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-kuma-gold mt-2 shrink-0" />
                                            <p><strong>Manos (Jodan):</strong> Se permite tocar piel (hasta 5cm de penetración controlada).</p>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-kuma-gold mt-2 shrink-0" />
                                            <p><strong>Pies (Jodan):</strong> Se permite contacto ligero (hasta 10cm).</p>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Card 2: Fighter Down */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <AlertTriangle size={100} />
                                </div>
                                <div className="p-8 relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <AlertTriangle className="text-yellow-500" /> Seguridad (Caídas)
                                    </h3>
                                    <ul className="space-y-3 text-zinc-400 text-sm">
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                            <p className="text-white font-bold">PROHIBIDO PATEAR AL CAÍDO.</p>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                                            <p>Si el oponente está en el suelo, solo se permiten técnicas de mano (Tsuki) para puntuar.</p>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                                            <p>Cualquier intento de patada a un oponente caído será penalizado severamente.</p>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Card 3: Zanshin */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Shield size={100} />
                                </div>
                                <div className="p-8 relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <Shield className="text-blue-500" /> Zanshin (Estado de Alerta)
                                    </h3>
                                    <ul className="space-y-3 text-zinc-400 text-sm">
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                                            <p>Mantener la concentración después de golpear es <strong>obligatorio</strong>.</p>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                            <p>Dar la espalda o celebrar antes del Yame anula el punto inmediatamente.</p>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Card 4: Jogai & Video */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <AlertCircle size={100} />
                                </div>
                                <div className="p-8 relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <Check className="text-purple-500" /> Jogai & Video Review
                                    </h3>
                                    <ul className="space-y-3 text-zinc-400 text-sm">
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                                            <p><strong>Jogai Simplificado:</strong> Si anotas punto antes de salir, no hay penalización por salir.</p>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                                            <p><strong>VR Cards:</strong> Coaches ahora tienen botones específicos para pedir 1, 2 o 3 puntos.</p>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* DIAGRAMA DE FLUJO (CSS) */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px bg-white/10 flex-1" />
                            <h2 className="text-2xl md:text-3xl font-serif font-black text-white uppercase tracking-wider text-center">
                                Flujo de Puntuación
                            </h2>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 max-w-4xl mx-auto">
                            {/* Step 1 */}
                            <div className="relative group w-full md:w-1/4">
                                <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-xl text-center relative z-10">
                                    <p className="text-white font-bold uppercase text-sm">Técnica</p>
                                    <p className="text-xs text-zinc-400 mt-1">Limpia y Potente</p>
                                </div>
                                {/* Arrow Mobile */}
                                <div className="md:hidden h-8 w-px bg-zinc-700 mx-auto my-2" />
                            </div>

                            {/* Arrow Desktop */}
                            <div className="hidden md:block w-12 h-0.5 bg-zinc-700" />

                            {/* Step 2 */}
                            <div className="relative group w-full md:w-1/4">
                                <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-xl text-center relative z-10">
                                    <p className="text-white font-bold uppercase text-sm">Criterios</p>
                                    <p className="text-xs text-zinc-400 mt-1">6 Principios ok</p>
                                </div>
                                <div className="md:hidden h-8 w-px bg-zinc-700 mx-auto my-2" />
                            </div>

                            {/* Arrow Desktop */}
                            <div className="hidden md:block w-12 h-0.5 bg-zinc-700" />

                            {/* Step 3 */}
                            <div className="relative group w-full md:w-1/4">
                                <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-xl text-center relative z-10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                    <p className="text-white font-bold uppercase text-sm">Zanshin</p>
                                    <p className="text-xs text-zinc-400 mt-1">Alerta Constante</p>
                                </div>
                                <div className="md:hidden h-8 w-px bg-zinc-700 mx-auto my-2" />
                            </div>

                            {/* Arrow Desktop */}
                            <div className="hidden md:block w-12 h-0.5 bg-zinc-700" />

                            {/* Step 4 */}
                            <div className="relative group w-full md:w-1/4">
                                <div className="bg-kuma-gold text-black p-6 rounded-xl text-center relative z-10 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                                    <p className="font-black uppercase text-sm">PUNTO</p>
                                    <p className="text-xs text-black/70 mt-1 font-bold">Yuko / Waza / Ippon</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
