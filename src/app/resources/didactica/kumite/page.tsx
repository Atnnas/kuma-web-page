"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";

import { PrimalTitle } from "@/components/ui/PrimalTitle";

export default function KumitePage() {
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
                        Combate & Estrategia
                    </motion.span>
                    <PrimalTitle className="text-4xl md:text-6xl lg:text-7xl mb-6">
                        El Kumite
                    </PrimalTitle>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 font-serif italic text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        "Entrelazar manos: Del combate vital al deporte."
                    </motion.p>
                </div>

                {/* Return Button */}
                <BackButton href="/recursos/didactica" />
            </header>

            {/* --- CONTENT --- */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* VISUALS (Left Column) */}
                    <div className="flex flex-col gap-12">
                        {/* FIGURA 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <Image
                                    src="/images/kuma-reglamento-kumite.jpg"
                                    alt="Kumite - Kuma Dojo"
                                    width={800}
                                    height={800}
                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                            </div>
                            <p className="mt-4 text-center text-xs text-zinc-500 uppercase tracking-widest font-bold">
                                Fig 1. Encuentro Dinámico
                            </p>
                        </motion.div>
                    </div>

                    {/* TEXT (Right Column) */}
                    <div className="space-y-8 text-zinc-300 leading-relaxed md:text-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white/5 border-l-2 border-kuma-gold p-6 rounded-r-xl"
                        >
                            <p className="font-serif italic text-xl text-kuma-gold mb-2">
                                "El término Kumite (組手) se traduce literalmente al español como 'entrelazar manos'..."
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-6 text-justify"
                        >
                            <p>
                                Hace referencia a su origen arcaico vinculado al <em>Tegumi</em> (lucha sumatoria de Okinawa) más que al combate de percusión a distancia.
                                En la visión más tradicional y antigua del karate okinawense, el combate libre (<em>Jiyu Kumite</em>) apenas existía; la práctica se centraba casi exclusivamente en los Katas (formas) y el endurecimiento físico.
                            </p>
                            <p>
                                Los maestros clásicos consideraban que las técnicas eran demasiado letales para probarse libremente sin reglas, por lo que el entrenamiento en parejas se limitaba al
                                <strong> Yakusoku Kumite</strong> (combate preestablecido), diseñado para analizar la aplicación práctica (Bunkai) de los movimientos del kata bajo la filosofía del
                                <em> Ikken Hissatsu</em> o "un golpe, una muerte", donde la eficiencia primaba sobre el intercambio deportivo (Cook, 2001; Nagamine, 1976).
                            </p>
                            <p>
                                La transformación hacia el combate que vemos hoy, con dos oponentes midiéndose dinámicamente, surgió tras la introducción del karate en Japón continental en la década de 1920.
                                Fue impulsada principalmente por los clubes universitarios de Tokio y por figuras innovadoras como <strong>Yoshitaka Funakoshi</strong>, quien desarrolló el combate libre para satisfacer el deseo de los jóvenes estudiantes de probar su habilidad de manera competitiva, influenciados por el Kendo y el Judo modernos.
                            </p>
                            <p>
                                Esta evolución cambió el enfoque: el kumite pasó de ser una herramienta de supervivencia civil a un método de educación física y espiritual (Budo), donde el control, la distancia (Maai) y el tiempo (Timing) se volvieron los criterios esenciales para validar una técnica, sentando las bases para la reglamentación deportiva actual de la WKF (Funakoshi, 1973; Johnson, 2012).
                            </p>
                        </motion.div>

                        {/* REFERENCES */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="pt-12 mt-12 border-t border-white/10"
                        >
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Bibliografía & Referencias</h3>
                            <ul className="space-y-2 text-xs md:text-sm text-zinc-600 font-mono">
                                <li>Cook, H. (2001). <em>Shotokan Karate: A Precise History.</em> Harry Cook.</li>
                                <li>Funakoshi, G. (1973). <em>Karate-Do Kyohan: The Master Text.</em> Kodansha International.</li>
                                <li>Johnson, N. (2012). <em>The History of Karate: Okinawan and Japanese Styles.</em> Tuttle Publishing.</li>
                                <li>Nagamine, S. (1976). <em>The Essence of Okinawan Karate-Do.</em> Tuttle Publishing.</li>
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </section>
        </main>
    );
}
