"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";

export default function KarategiPage() {
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
                        Historia & Tradición
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white tracking-wide mb-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
                    >
                        El Karategi
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 font-serif italic text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        "Vestirse para el vacío: La evolución del uniforme moderno."
                    </motion.p>
                </div>

                {/* Return Button */}
                <BackButton href="/recursos/didactica" />
            </header>

            {/* --- CONTENT --- */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* VISUALS (Left Column) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <Image
                                src="/images/kuma-karategui-partes.jpg"
                                alt="Partes del Karategui Kuma Dojo"
                                width={800}
                                height={800}
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        </div>
                        <p className="mt-4 text-center text-xs text-zinc-500 uppercase tracking-widest font-bold">
                            Fig 1. Estructura del Uniforme Kuma Dojo
                        </p>
                    </motion.div>

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
                                "El uniforme de karate, o karategi, no es originario de Okinawa..."
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
                                Tradicionalmente en Okinawa, la práctica se realizaba con ropa cotidiana o el torso desnudo debido al clima tropical.
                                Su estandarización ocurrió en <strong>1922</strong>, cuando el maestro <strong>Gichin Funakoshi</strong> viajó a Tokio para demostrar su arte.
                            </p>
                            <p>
                                Siguiendo el consejo de <strong>Jigoro Kano</strong> —fundador del Judo—, adoptó la vestimenta formal del <em>Keikogi</em> para legitimar el karate ante la
                                <strong> Dai Nippon Butoku Kai</strong> y alinearlo con la etiqueta del Budo japonés moderno (Cook, 2001; Funakoshi, 1975).
                            </p>
                            <p>
                                Esta adopción pragmática del uniforme de judo, aligerado para permitir la fluidez de los golpes, transformó la identidad visual del karate al
                                <strong> eliminar las distinciones de clase social</strong> entre los practicantes.
                            </p>
                            <p>
                                El uso del color blanco se estableció no solo por razones de higiene impulsadas por Kano, sino también por su simbolismo filosófico de
                                <strong> "vacío" (Kara)</strong>, representando una mente limpia de ego y preparada para el aprendizaje (Kano, 1986; Lowry, 2006).
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
                                <li>Cook, H. (2001). <em>Shotokan Karate: A Precise History.</em> Inglaterra: Harry Cook.</li>
                                <li>Funakoshi, G. (1975). <em>Karate-Do: My Way of Life.</em> Tokio, Japón: Kodansha International.</li>
                                <li>Kano, J. (1986). <em>Kodokan Judo.</em> Tokio, Japón: Kodansha International.</li>
                                <li>Lowry, D. (2006). <em>In the Dojo: A Guide to the Rituals and Etiquette...</em> Boston, MA: Weatherhill.</li>
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </section>
        </main>
    );
}
