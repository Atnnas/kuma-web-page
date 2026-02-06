"use client";
import React from "react";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import {
    Dumbbell,
    Flame,
    Timer,
    PlayCircle,
    Lock,
    Users
} from "lucide-react";

export default function RutinasPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-kuma-gold/30 pb-32">

            {/* --- HERO SECTION --- */}
            <header className="relative w-full h-[50vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-zinc-900/80 to-zinc-950" />
                    {/* Animated Glow */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 blur-[120px] rounded-full"
                    />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center gap-3 mb-6"
                    >
                        <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-zinc-950 bg-white border border-white rounded-full flex items-center gap-2">
                            <Lock className="w-3 h-3" /> MEMBERS ONLY
                        </span>
                    </motion.div>

                    <PrimalTitle className="text-5xl md:text-7xl lg:text-8xl mb-6">
                        Rutinas <br className="hidden md:block" /> de Dojo
                    </PrimalTitle>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 font-serif text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Entrenamiento complementario diseñado para potenciar tu Karate fuera del tatami.
                    </motion.p>
                </div>

                <BackButton href="/entrenamiento" />
            </header>

            {/* --- CONTENT GRID --- */}
            <section className="relative -mt-20 z-20 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <RoutineCard
                        title="Fuerza Explosiva"
                        subtitle="Pliometría & Potencia"
                        icon={<Dumbbell className="w-8 h-8" />}
                        color="text-red-500"
                        bg="bg-red-500/10"
                        delay={0.1}
                    />
                    <RoutineCard
                        title="HIIT Karate"
                        subtitle="Resistencia Específica"
                        icon={<Flame className="w-8 h-8" />}
                        color="text-orange-500"
                        bg="bg-orange-500/10"
                        delay={0.2}
                    />
                    <RoutineCard
                        title="Flexibilidad"
                        subtitle="Rango de Movimiento"
                        icon={<Users className="w-8 h-8" />}
                        color="text-blue-500"
                        bg="bg-blue-500/10"
                        delay={0.3}
                    />
                </div>

                {/* --- COMING SOON --- */}
                <div className="mt-20 text-center">
                    <p className="text-zinc-600 italic">Más rutinas serán agregadas semanalmente.</p>
                </div>
            </section>

        </main>
    );
}

function RoutineCard({ title, subtitle, icon, color, bg, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="group relative bg-zinc-900 border border-white/10 p-8 rounded-3xl overflow-hidden hover:border-white/20 transition-colors cursor-pointer"
        >
            <div className={`w-16 h-16 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                {icon}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-kuma-gold transition-colors">{title}</h3>
            <p className="text-zinc-500 text-sm mb-8">{subtitle}</p>

            <div className="flex items-center gap-2 text-white/50 text-sm font-bold group-hover:text-white transition-colors">
                <PlayCircle className="w-5 h-5" />
                <span>INICIAR</span>
            </div>

            {/* Hover Glow */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
        </motion.div>
    );
}
