"use client";
import React from "react";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { WKFScoreboard } from "@/components/didactic/WKFScoreboard";

export default function PenalizacionesPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-kuma-gold/30">
            {/* --- HEADER --- */}
            <header className="relative w-full h-[40vh] md:h-[50vh] flex flex-col items-center justify-center overflow-hidden border-b border-kuma-gold/20">
                {/* Background Pattern */}
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
                        Reglamento & Sanciones
                    </motion.span>

                    <PrimalTitle className="text-4xl md:text-6xl lg:text-7xl mb-6">
                        Penalizaciones, Kumite WKF
                    </PrimalTitle>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 font-serif italic text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        "En el tatami, la disciplina es tan letal como el golpe. Conoce el precio del error."
                    </motion.p>
                </div>

                {/* Return Button */}
                <BackButton href="/recursos/didactica" />
            </header>

            {/* --- CONTENT --- */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden min-h-screen">
                <div className="relative z-10 max-w-5xl mx-auto space-y-24 w-full">

                    {/* WKF SCOREBOARD VISUALIZATION */}
                    <WKFScoreboard />



                    {/* TEXT EXPLANATION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-zinc-400 leading-relaxed text-lg">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Sistema Unificado</h3>
                            <p>
                                Bajo el reglamento WKF moderno, las advertencias de Categoría 1 y 2 se han unificado en una <strong className="text-white">sola línea de acumulación</strong>. No importa si es por contacto excesivo (C1) o por salir del área (C2), cada falta suma al mismo contador.
                            </p>
                            <p>
                                Esto simplifica la lectura del combate pero aumenta el riesgo: <strong>3 errores te ponen al borde de la descalificación</strong>. La 4ª falta (Hansoku) otorga la victoria inmediata al oponente (8-0 en equipos).
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Punto de No Retorno</h3>
                            <ul className="space-y-4 text-base">
                                <li className="flex gap-4">
                                    <span className="font-mono font-bold text-yellow-500">C/K</span>
                                    <span>Advertencias menores. Aún estás en juego, pero la ventaja psicológica cambia.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="font-mono font-bold text-red-500">HC</span>
                                    <span>(Hansoku Chui). Alerta Máxima. El próximo error, por pequeño que sea, te elimina.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="font-mono font-bold text-zinc-500">S</span>
                                    <span>(Shikkaku). Deshonra. Si el acto es malintencionado, no hay conteo: expulsión directa.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* FAULTS LIST */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-16">
                        {/* Category 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-serif font-black text-white border-l-4 border-red-600 pl-4">
                                Categoría 1 <br />
                                <span className="text-base text-red-600 font-sans font-normal tracking-wide">Ataques Prohibidos</span>
                            </h3>
                            <ul className="space-y-4 text-zinc-400">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold">•</span>
                                    <div>
                                        <strong className="text-white block">過度の接触 (Kado no Sesshoku)</strong>
                                        Contacto excesivo. Control es poder.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold">•</span>
                                    <div>
                                        <strong className="text-white block">腕・足への攻撃 (Ude/Ashi e no Kōgeki)</strong>
                                        Ataques a extremidades o articulaciones.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold">•</span>
                                    <div>
                                        <strong className="text-white block">貫手 (Nukite)</strong>
                                        Mano abierta a la cara. Riesgo ocular.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold">•</span>
                                    <div>
                                        <strong className="text-white block">危険な投げ (Kiken na Nage)</strong>
                                        Proyecciones sin agarre seguro.
                                    </div>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Category 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-serif font-black text-white border-l-4 border-yellow-500 pl-4">
                                Categoría 2 <br />
                                <span className="text-base text-yellow-500 font-sans font-normal tracking-wide">Comportamiento</span>
                            </h3>
                            <ul className="space-y-4 text-zinc-400">
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-500 font-bold">•</span>
                                    <div>
                                        <strong className="text-white block">無防備 (Mubobi)</strong>
                                        Ponerse en peligro. Falta de autopreservación.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-500 font-bold">•</span>
                                    <div>
                                        <strong className="text-white block">場外 (Jogai)</strong>
                                        Salir del área. Evasión del conflicto.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-500 font-bold">•</span>
                                    <div>
                                        <strong className="text-white block">不活動 (Fukatsudō)</strong>
                                        Pasividad. El combate exige acción.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-500 font-bold">•</span>
                                    <div>
                                        <strong className="text-white block">偽りの負傷 (Itsuwari no Fushō)</strong>
                                        Simulación. Falta de honor.
                                    </div>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                </div>
            </section>
        </main>
    );
}
