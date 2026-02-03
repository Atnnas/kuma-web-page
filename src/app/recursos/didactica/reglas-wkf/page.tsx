"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";

export default function ReglasWKFPage() {
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
                        Reglamento Deportivo
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white tracking-wide mb-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
                    >
                        Reglas WKF
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 font-serif italic text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        "La estandarización global del combate deportivo."
                    </motion.p>
                </div>

                {/* Return Button */}
                <BackButton href="/recursos/didactica" />
            </header>

            {/* --- CONTENT --- */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* HISTORY SECTION */}
                    <div className="space-y-6 text-zinc-300 leading-relaxed md:text-lg text-justify">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white/5 border-l-2 border-kuma-gold p-6 rounded-r-xl"
                        >
                            <p className="font-serif italic text-xl text-kuma-gold mb-2">
                                World Karate Federation
                            </p>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            La Federación Mundial de Karate (WKF) es la máxima autoridad del karate deportivo a nivel global, reconocida por el Comité Olímpico Internacional. Fundada originalmente como WUKO en 1970, su objetivo principal ha sido unificar las diversas escuelas y estilos bajo un reglamento común que garantice la integridad física de los competidores y promueva el espíritu del Budo en el ámbito competitivo moderno. A través de sus normativas, busca el equilibrio entre la tradición marcial y el espectáculo deportivo de alto nivel.
                        </motion.p>
                    </div>

                    {/* SCORING SECTION (The requested visual) */}
                    <div className="pt-8 border-t border-white/10">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-3xl font-serif font-bold text-white mb-8 text-center"
                        >
                            ¿Cómo dan los puntos?
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full"
                        >
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(212,175,55,0.1)] group">
                                <Image
                                    src="/images/kuma-intro-puntos.jpg"
                                    alt="Sistema de Puntuación WKF - Kuma Dojo"
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                                {/* Label inside image */}
                                <div className="absolute bottom-4 left-4 right-4 text-center">
                                    <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">
                                        Sistema de Puntuación Oficial
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* SCORING CRITERIA GRID */}
                    <div className="pt-16 border-t border-white/10">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-3xl font-serif font-bold text-white mb-12 text-center"
                        >
                            Los 6 Criterios Técnicos
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "1. Buena Forma",
                                    desc: "La técnica debe ejecutarse con la mecánica corporal tradicional y pureza de movimiento.",
                                    img: "/images/kuma-buena-forma.jpg",
                                    alt: "Buena Forma - Kuma Dojo"
                                },
                                {
                                    title: "2. Actitud Deportiva",
                                    desc: "Comportamiento marcial y respeto hacia el oponente durante toda la acción.",
                                    img: "/images/kuma-actitud-deportiva.jpg",
                                    alt: "Actitud Deportiva - Kuma Dojo"
                                },
                                {
                                    title: "3. Aplicación Vigorosa",
                                    desc: "Potencia y velocidad demostrables en la ejecución de la técnica ofensiva.",
                                    img: "/images/kuma-aplicacion-vigorosa.jpg",
                                    alt: "Aplicación Vigorosa - Kuma Dojo"
                                },
                                {
                                    title: "4. Zanshin (Alerta)",
                                    desc: "Estado de alerta mental y físico continuado, manteniendo la mirada fija en el objetivo tras el ataque.",
                                    img: null,
                                    alt: "Zanshin"
                                },
                                {
                                    title: "5. Buen Timing",
                                    desc: "Ejecución de la técnica en el momento preciso de máxima efectividad.",
                                    img: null,
                                    alt: "Timing"
                                },
                                {
                                    title: "6. Distancia Correcta",
                                    desc: "Alcanzar el objetivo o 'skin touch' en el rango apropiado para la técnica.",
                                    img: null,
                                    alt: "Distancia"
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-kuma-gold/30 transition-colors group"
                                >
                                    <div className="relative w-full bg-black overflow-hidden group-hover:bg-zinc-900 transition-colors">
                                        {/* Aspect ratio handled by image dimensions or auto */}
                                        {item.img ? (
                                            <Image
                                                src={item.img}
                                                alt={item.alt}
                                                width={600}
                                                height={450}
                                                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="aspect-[4/3] w-full flex items-center justify-center bg-zinc-900 relative">
                                                <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-10" />
                                                <span className="relative text-zinc-600 font-bold uppercase tracking-widest text-xs border border-zinc-700 px-3 py-1 rounded">
                                                    Imagen Pendiente
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none opacity-80" />
                                        <div className="absolute bottom-4 left-4 right-4 z-10">
                                            <h3 className="text-lg font-bold text-white mb-1 font-serif drop-shadow-md">{item.title}</h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-zinc-400 text-sm leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
