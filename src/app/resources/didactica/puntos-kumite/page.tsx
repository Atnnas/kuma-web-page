"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { PrimalTitle } from "@/components/ui/PrimalTitle";

export default function KumitePointsPage() {
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
                        Kumite WKF
                    </motion.span>
                    <PrimalTitle className="text-4xl md:text-6xl lg:text-7xl mb-6">
                        Sistema de Puntos
                    </PrimalTitle>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 font-serif italic text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        "Valoración técnica y criterios de puntuación oficiales."
                    </motion.p>
                </div>

                {/* Return Button */}
                <BackButton href="/resources/didactica" />
            </header>

            {/* --- CONTENT --- */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden">
                <div className="max-w-5xl mx-auto space-y-24">

                    {/* MAIN IMAGE (Intro) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full md:w-3/4 mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(212,175,55,0.1)]"
                    >
                        <Image
                            src="/images/kuma-arbitro-puntos.jpg"
                            alt="Kumite Scoring Referee"
                            width={1200}
                            height={800}
                            className="w-full h-auto object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    </motion.div>

                    {/* SCORING HIERARCHY */}
                    <div className="space-y-12">

                        {/* IPPON - REDESIGNED LAYOUT (3 Columns) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden relative group"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                                {/* LEFT: IMAGE (Standing) */}
                                <div className="relative h-64 md:h-auto min-h-[400px] bg-black/40">
                                    <Image
                                        src="/images/kuma-arbitro-puntos-ippon.jpg"
                                        alt="Ippon Referee Signal (Standing)"
                                        fill
                                        className="object-contain p-4"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/20 pointer-events-none" />
                                </div>

                                {/* CENTER: CONTENT */}
                                <div className="p-8 md:p-8 flex flex-col justify-center items-center text-center relative z-10 border-y md:border-y-0 md:border-x border-white/5">
                                    <div className="mb-6">
                                        <h3 className="text-4xl md:text-5xl font-black text-white mb-2 font-serif">IPPON</h3>
                                        <p className="text-red-600 font-bold tracking-[0.2em] text-sm uppercase border-b border-red-600 inline-block pb-1">3 Puntos</p>
                                    </div>

                                    <ul className="space-y-4 text-zinc-300 text-lg leading-relaxed text-left md:text-center">
                                        <li>
                                            <span className="text-red-600 font-bold mr-2">●</span> Patadas a la zona alta (Jodan Geri).
                                        </li>
                                        <li>
                                            <span className="text-red-600 font-bold mr-2">●</span> Cualquier técnica puntuable sobre un oponente caído.
                                        </li>
                                    </ul>
                                </div>

                                {/* RIGHT: IMAGE (Seated) */}
                                <div className="relative h-64 md:h-auto min-h-[400px] bg-black/40">
                                    <Image
                                        src="/images/kuma-arbitro-puntos-ippon-sentado.jpg"
                                        alt="Ippon Referee Signal (Seated)"
                                        fill
                                        className="object-contain p-4"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-zinc-900/20 pointer-events-none" />
                                </div>
                            </div>

                            {/* Decorative Number */}
                            <span className="absolute right-1/2 translate-x-1/2 bottom-4 text-9xl font-black text-red-600/5 select-none font-serif z-0">3</span>
                        </motion.div>

                        {/* WAZA-ARI - REDESIGNED LAYOUT (3 Columns) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden relative group"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                                {/* LEFT: IMAGE (Standing) */}
                                <div className="relative h-64 md:h-auto min-h-[400px] bg-black/40">
                                    <Image
                                        src="/images/kuma-arbitro-puntos-waza-ari.jpg"
                                        alt="Waza-ari Referee Signal (Standing)"
                                        fill
                                        className="object-contain p-4"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/20 pointer-events-none" />
                                </div>

                                {/* CENTER: CONTENT */}
                                <div className="p-8 md:p-8 flex flex-col justify-center items-center text-center relative z-10 border-y md:border-y-0 md:border-x border-white/5">
                                    <div className="mb-6">
                                        <h3 className="text-4xl md:text-5xl font-black text-white mb-2 font-serif">WAZA-ARI</h3>
                                        <p className="text-yellow-500 font-bold tracking-[0.2em] text-sm uppercase border-b border-yellow-500 inline-block pb-1">2 Puntos</p>
                                    </div>

                                    <ul className="space-y-4 text-zinc-300 text-lg leading-relaxed text-left md:text-center">
                                        <li>
                                            <span className="text-yellow-500 font-bold mr-2">●</span> Patadas a la zona media (Chudan Geri).
                                        </li>
                                    </ul>
                                </div>

                                {/* RIGHT: IMAGE (Seated) */}
                                <div className="relative h-64 md:h-auto min-h-[400px] bg-black/40">
                                    <Image
                                        src="/images/kuma-arbitro-puntos-waza-ari-sentado.jpg"
                                        alt="Waza-ari Referee Signal (Seated)"
                                        fill
                                        className="object-contain p-4"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-zinc-900/20 pointer-events-none" />
                                </div>
                            </div>

                            {/* Decorative Number */}
                            <span className="absolute right-1/2 translate-x-1/2 bottom-4 text-9xl font-black text-yellow-500/5 select-none font-serif z-0">2</span>
                        </motion.div>

                        {/* YUKO - REDESIGNED LAYOUT (3 Columns) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden relative group"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                                {/* LEFT: IMAGE (Standing) */}
                                <div className="relative h-64 md:h-auto min-h-[400px] bg-black/40">
                                    <Image
                                        src="/images/kuma-arbitro-puntos-yuko.jpg"
                                        alt="Yuko Referee Signal (Standing)"
                                        fill
                                        className="object-contain p-4"
                                        priority
                                    />
                                    {/* Subtle gradient only at the very edge to blend with text container if needed, otherwise removed to keep image clear */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/20 pointer-events-none" />
                                </div>

                                {/* CENTER: CONTENT */}
                                <div className="p-8 md:p-8 flex flex-col justify-center items-center text-center relative z-10 border-y md:border-y-0 md:border-x border-white/5">
                                    <div className="mb-6">
                                        <h3 className="text-4xl md:text-5xl font-black text-white mb-2 font-serif">YUKO</h3>
                                        <p className="text-blue-400 font-bold tracking-[0.2em] text-sm uppercase border-b border-blue-400 inline-block pb-1">1 Punto</p>
                                    </div>

                                    <ul className="space-y-4 text-zinc-300 text-lg leading-relaxed text-left md:text-center">
                                        <li>
                                            <span className="text-blue-400 font-bold mr-2">●</span> Tsuki (puño) a zona media o alta.
                                        </li>
                                        <li>
                                            <span className="text-blue-400 font-bold mr-2">●</span> Uchi (golpe circular) a zona alta.
                                        </li>
                                    </ul>
                                </div>

                                {/* RIGHT: IMAGE (Seated) */}
                                <div className="relative h-64 md:h-auto min-h-[400px] bg-black/40">
                                    <Image
                                        src="/images/kuma-arbitro-puntos-yuko-sentado.jpg"
                                        alt="Yuko Referee Signal (Seated)"
                                        fill
                                        className="object-contain p-4"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-zinc-900/20 pointer-events-none" />
                                </div>
                            </div>

                            {/* Decorative Number */}
                            <span className="absolute right-1/2 translate-x-1/2 bottom-4 text-9xl font-black text-blue-500/5 select-none font-serif z-0">1</span>
                        </motion.div>

                    </div>

                </div>
            </section>
        </main>
    );
}
