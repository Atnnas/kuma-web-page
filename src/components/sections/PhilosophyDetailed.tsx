"use client";
import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function PhilosophyDetailed() {
    // Parallax Effect
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]); // Background moves slower
    const y2 = useTransform(scrollY, [0, 500], [0, -150]); // Text moves faster/up

    return (
        <section className="min-h-screen bg-black text-white selection:bg-red-900/50 overflow-hidden relative">
            {/* --- FIXED BACKGROUND --- */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/images/grizzly_bear_hero.png"
                    alt="Espíritu del Oso"
                    fill
                    className="object-cover opacity-80 md:opacity-70" // Increased opacity
                    priority
                />
                <div className="absolute inset-0 bg-black/50" /> {/* Lighter overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden z-10">
                {/* Hero Text */}
                <motion.div style={{ y: y2 }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-9xl font-serif font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 drop-shadow-[0_10px_30px_rgba(0,0,0,1)]"
                    >
                        Espíritu <span className="text-red-700 drop-shadow-[0_0_30px_rgba(220,38,38,0.6)]">Kuma</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-6 text-xl md:text-2xl text-zinc-300 font-light italic max-w-3xl mx-auto leading-relaxed"
                    >
                        "No entrenamos para pelear, peleamos para entender quiénes somos."
                    </motion.p>
                </motion.div>
            </div>

            {/* --- CONTENT GRID --- */}
            <div className="max-w-7xl mx-auto px-6 py-24 relative z-10"> {/* Removed solid background to let fixed bg show through */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* COL 1: IDENTITY (Kanji & Name) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* KUMA CARD */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:border-red-900/50 transition-colors group"
                        >
                            <h3 className="text-sm font-bold text-red-600 uppercase tracking-[0.2em] mb-4">El Nombre</h3>
                            <h2 className="text-4xl font-serif font-black text-white mb-4">KUMA</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                En japonés, <span className="text-white font-bold">Kuma (熊)</span> significa "Oso".
                                No es solo un animal, es un símbolo de fuerza con control, introspección y conexión con la naturaleza.
                            </p>
                        </motion.div>

                        {/* KANJI CARD */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:border-red-900/50 transition-colors relative overflow-hidden group"
                        >
                            <div className="absolute -right-4 -top-4 text-9xl text-white/5 font-black z-0 pointer-events-none group-hover:text-red-900/10 transition-colors">熊</div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold text-red-600 uppercase tracking-[0.2em] mb-4">El Símbolo</h3>
                                <div className="text-6xl text-white mb-4 font-serif">熊</div>
                                <p className="text-zinc-400 leading-relaxed">
                                    El Kanji representa la dualidad: la <span className="text-white">hibernación</span> (paciencia, estrategia) y el <span className="text-white">despertar</span> (acción explosiva, defensa feroz).
                                    Es la calma antes de la tormenta.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* COL 2: THE BEAR CONCEPT (Main Text) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-8"
                    >
                        <div className="bg-black/60 border border-white/10 rounded-3xl p-8 md:p-12 h-full relative overflow-hidden backdrop-blur-md">
                            <div className="absolute top-0 right-0 w-full h-full bg-[url('/images/noise.svg')] opacity-20 pointer-events-none" />

                            <h3 className="text-sm font-bold text-kuma-gold uppercase tracking-[0.2em] mb-6 drop-shadow-md">La Mentalidad del Oso</h3>

                            <div className="space-y-8 relative z-10">
                                <p className="text-lg md:text-xl text-zinc-300 leading-loose">
                                    El oso no es un depredador que caza por deporte; es un guardián de su territorio.
                                    Su filosofía es la de la <span className="text-white font-bold decoration-red-900 underline underline-offset-4 decoration-2">persistencia absoluta</span>.
                                    No existe obstáculo que lo detenga cuando tiene una meta.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                                    {/* Feature 1 */}
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                        <div className="text-red-600 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20" /><path d="M12 2v20" /><path d="m4.93 4.93 14.14 14.14" /><path d="m14.93 4.93-14.14 14.14" /></svg>
                                        </div>
                                        <h4 className="font-bold text-white mb-2">Terreno</h4>
                                        <p className="text-sm text-zinc-400">Si el objetivo corre cuesta arriba, el oso lo persigue con mayor ventaja.</p>
                                    </div>
                                    {/* Feature 2 */}
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                        <div className="text-red-600 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                                        </div>
                                        <h4 className="font-bold text-white mb-2">Adaptabilidad</h4>
                                        <p className="text-sm text-zinc-400">Si el objetivo entra al agua, el oso nada. Si sube un árbol, el oso escala.</p>
                                    </div>
                                    {/* Feature 3 */}
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                        <div className="text-red-600 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                                        </div>
                                        <h4 className="font-bold text-white mb-2">Potencia</h4>
                                        <p className="text-sm text-zinc-400">Puede alcanzar velocidades de <span className="text-white font-bold">56 km/h</span>. No se puede huir.</p>
                                    </div>
                                </div>

                                <blockquote className="pl-6 border-l-4 border-red-700 italic text-xl text-zinc-400 py-2 my-8 bg-gradient-to-r from-red-900/10 to-transparent">
                                    "Si el objetivo se mete al agua, el oso nada. Si escala un árbol, el oso lo persigue. Un espíritu de lucha que no se rinde ante los desafíos."
                                </blockquote>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* --- LOGO CONCEPTUAL MAP --- */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 mb-24 relative"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-black text-white uppercase tracking-widest">
                            Simbología del <span className="text-kuma-gold">Emblema</span>
                        </h2>
                        <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">
                            Nuestro logo no es solo una imagen, es un mapa de nuestros principios. Cada trazo tiene un propósito.
                        </p>
                    </div>

                    <div className="relative max-w-6xl mx-auto h-[700px] md:h-[600px] flex items-center justify-center"> {/* Increased Height and Width */}
                        {/* Center Logo */}
                        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl border-4 border-[#6F4E37] shadow-[0_0_50px_rgba(111,78,55,0.3)] z-20 bg-black overflow-hidden group">
                            <Image
                                src="/images/kuma-logo.jpg"
                                alt="Kuma Logo Map"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Inner Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Connection Lines (Desktop) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-10" viewBox="0 0 1000 600">
                            {/* 1. KANJI (Right) */}
                            <path d="M600 250 L850 150" stroke="#D4AF37" strokeWidth="2" fill="none" strokeDasharray="5,5" className="opacity-50" />
                            <circle cx="850" cy="150" r="4" fill="#D4AF37" />

                            {/* 2. BEAR (Left) */}
                            <path d="M400 250 L150 150" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeDasharray="5,5" className="opacity-50" />
                            <circle cx="150" cy="150" r="4" fill="#FFFFFF" />

                            {/* 3. NAME (Bottom) */}
                            <path d="M500 400 L500 520" stroke="#EF4444" strokeWidth="2" fill="none" className="opacity-30" />
                            <circle cx="500" cy="520" r="4" fill="#EF4444" />
                        </svg>

                        {/* Annotations */}

                        {/* 1. THE KANJI (Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-0 right-0 md:top-20 md:right-0 lg:right-0 max-w-[280px] text-left md:text-right" // Pushed right
                        >
                            <h4 className="text-kuma-gold font-bold uppercase tracking-widest text-sm mb-2">El Kanji (熊)</h4>
                            <p className="text-zinc-400 text-sm">
                                El ideograma del Oso. Simboliza la dualidad entre la calma de la hibernación y la ferocidad de la defensa.
                            </p>
                        </motion.div>

                        {/* 2. THE BEAR (Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-0 left-0 md:top-20 md:left-0 lg:left-0 max-w-[280px] text-left" // Pushed left
                        >
                            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">El Oso</h4>
                            <p className="text-zinc-400 text-sm">
                                Representa la <span className="text-white">fuerza con control</span>.
                                Determinación absoluta y protección del territorio.
                            </p>
                        </motion.div>

                        {/* 3. THE NAME (Bottom) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-0 w-full text-center flex justify-center pb-8" // Added padding bottom
                        >
                            <div className="max-w-[300px]">
                                <h4 className="text-red-500 font-bold uppercase tracking-widest text-sm mb-2">El Nombre</h4>
                                <p className="text-zinc-400 text-sm">
                                    <span className="text-white font-bold">KUMA DOJO</span>.
                                    Nuestra identidad. Un refugio para quienes buscan fortalecer cuerpo y espíritu.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* --- BOTTOM SECTION: VALUES --- */}
                <div className="mt-24 text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl font-serif font-black text-white uppercase tracking-widest mb-12">Nuestros <span className="text-zinc-600">Pilares</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {/* VALUES ANIMATIONS */}
                        {[
                            { title: "Honor", color: "text-red-600", desc: "Respeto por uno mismo, por el oponente y por el arte. El combate comienza y termina con cortesía." },
                            { title: "Disciplina", color: "text-kuma-gold", desc: "La repetición constante. Hacer lo difícil cuando nadie mira. La forja del carácter a través del esfuerzo." },
                            { title: "Comunidad", color: "text-white", desc: "Nadie se hace fuerte solo. Somos una manada. El crecimiento de uno es la fortaleza de todos." }
                        ].map((val, i) => (
                            <motion.div
                                key={val.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="space-y-4"
                            >
                                <h3 className={`text-xl font-bold ${val.color}`}>{val.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
