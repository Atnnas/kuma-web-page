"use client";
import React from "react";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import {
    Clock,
    Target,
    Shield,
    AlertTriangle,
    XOctagon,
    ChevronsUp,
    Zap,
    Scale,
    Sword
} from "lucide-react";

export default function ReglamentoGeneralPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-kuma-gold/30 pb-32">

            {/* --- HERO SECTION --- */}
            <header className="relative w-full h-[60vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-zinc-900/80 to-zinc-950" />
                    {/* Animated Glow */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-kuma-gold/5 blur-[100px] rounded-full"
                    />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
                    <div className="flex justify-center gap-3 mb-6">
                        <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-zinc-950 bg-kuma-gold border border-kuma-gold rounded-full">
                            WKF RULES 2026
                        </span>
                        <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-zinc-400 bg-zinc-900 border border-white/10 rounded-full">
                            MASTER COPY V9
                        </span>
                    </div>

                    <PrimalTitle className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight">
                        Reglamento <br className="hidden md:block" /> General
                    </PrimalTitle>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 font-serif text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Principios fundamentales, tiempos de combate y nuevos criterios de seguridad para el ciclo olímpico.
                    </motion.p>
                </div>

                <BackButton href="/recursos/didactica" />
            </header>


            {/* --- 1. THE BASICS (Grid) --- */}
            <section className="relative -mt-20 z-20 px-4 mb-32">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Time Card */}
                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center hover:border-kuma-gold/50 transition-colors group">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-kuma-gold/20 transition-colors">
                            <Clock className="w-8 h-8 text-zinc-400 group-hover:text-kuma-gold transition-colors" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">Duración</h3>
                        <div className="space-y-2 mt-2 w-full">
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-zinc-500">U14 & Menores</span>
                                <span className="font-bold text-white">1:30 min</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-zinc-500">Cadete / Junior</span>
                                <span className="font-bold text-white">2:00 min</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Seniors</span>
                                <span className="font-bold text-kuma-gold">3:00 min</span>
                            </div>
                        </div>
                    </div>

                    {/* Victory Card */}
                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center hover:border-kuma-gold/50 transition-colors group">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-kuma-gold/20 transition-colors">
                            <Target className="w-8 h-8 text-zinc-400 group-hover:text-kuma-gold transition-colors" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">Victoria</h3>
                        <p className="text-zinc-400 text-sm mb-6">Condiciones para ganar el encuentro antes o después del tiempo.</p>
                        <div className="grid grid-cols-2 gap-2 w-full">
                            <div className="bg-zinc-950 p-3 rounded-xl border border-white/5">
                                <span className="block text-2xl font-black text-white">MAX</span>
                                <span className="text-[10px] uppercase text-zinc-500 tracking-widest">Puntos</span>
                            </div>
                            <div className="bg-zinc-950 p-3 rounded-xl border border-white/5">
                                <span className="block text-2xl font-black text-kuma-gold">8+</span>
                                <span className="text-[10px] uppercase text-zinc-500 tracking-widest">Diferencia</span>
                            </div>
                        </div>
                    </div>

                    {/* Protection Card */}
                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center hover:border-kuma-gold/50 transition-colors group">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-kuma-gold/20 transition-colors">
                            <Shield className="w-8 h-8 text-zinc-400 group-hover:text-kuma-gold transition-colors" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">Protección</h3>
                        <ul className="text-left w-full space-y-3 mt-2 text-sm text-zinc-400">
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                Guantillas & Espinilleras (Rojo/Azul)
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                Protector Bucal & Pectoral
                            </li>
                            <li className="flex items-center gap-3 bg-kuma-gold/10 p-2 rounded-lg -mx-2">
                                <ChevronsUp className="w-4 h-4 text-kuma-gold shrink-0" />
                                <span className="text-kuma-gold font-bold">U14: Casco Obligatorio</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>


            {/* --- 2. 2026 UPDATES (Dark Section) --- */}
            <section className="relative py-20 bg-zinc-900/50 border-y border-white/5 mb-32">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-kuma-gold font-bold tracking-[0.3em] text-xs uppercase mb-2 block">Evolución del Reglamento</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-black text-white">Novedades 2026</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* UPDATE 1: SKIN TOUCH */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition-opacity" />
                            <div className="relative bg-zinc-950 p-8 rounded-2xl border border-white/10 h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-bold text-white">Skin Touch</h3>
                                    <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded border border-blue-500/20">CONTACTO</span>
                                </div>
                                <p className="text-zinc-400 mb-6 leading-relaxed">
                                    El contacto ya no es penalizado automáticamente. Se permite un "Skin Touch" controlado para favorecer la fluidez.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="w-16 font-bold text-zinc-500 text-right">MANOS</span>
                                        <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full w-1/3 bg-blue-500" />
                                        </div>
                                        <span className="text-white font-bold">5 cm</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="w-16 font-bold text-zinc-500 text-right">PIES</span>
                                        <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full w-2/3 bg-cyan-500" />
                                        </div>
                                        <span className="text-white font-bold">10 cm</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* UPDATE 2: SAFETY */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition-opacity" />
                            <div className="relative bg-zinc-950 p-8 rounded-2xl border border-white/10 h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-bold text-white">Seguridad Caídas</h3>
                                    <span className="bg-red-500/10 text-red-500 text-xs font-bold px-2 py-1 rounded border border-red-500/20">CRÍTICO</span>
                                </div>
                                <p className="text-zinc-400 mb-6 leading-relaxed">
                                    Protección absoluta al competidor caído.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex gap-4 items-start">
                                        <XOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-zinc-300">
                                            <strong className="text-white">PROHIBIDO PATEAR</strong> a un oponente en el suelo. Es Hansoku potencial.
                                        </p>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-zinc-300">
                                            Solo se permite puntuar con <strong className="text-white">Tsuki</strong> (Puño) cuando el rival ha caído.
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 3. SCORING FLOW (Vertical Timeline) --- */}
            <section className="max-w-4xl mx-auto px-4 mb-32">
                <div className="text-center mb-16">
                    <span className="text-kuma-gold font-bold tracking-[0.3em] text-xs uppercase mb-2 block">Protocolo de Puntuación</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-black text-white">El Camino del Punto</h2>
                </div>

                <div className="relative border-l-2 border-zinc-800 ml-8 md:ml-1/2 space-y-12 pb-12">
                    {/* Step 1 */}
                    <div className="relative pl-12 md:pl-0 md:flex md:items-center md:justify-between">
                        {/* Circle */}
                        <div className="absolute left-[-9px] top-0 md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-zinc-500 border-4 border-zinc-950" />

                        <div className="md:w-[45%] md:text-right pr-8">
                            <h4 className="text-xl font-bold text-white mb-2">1. La Técnica</h4>
                            <p className="text-zinc-400 text-sm">Debe ser lanzada con buena forma, actitud deportiva y vigor.</p>
                        </div>
                        <div className="hidden md:block md:w-[45%]" />
                    </div>

                    {/* Step 2 */}
                    <div className="relative pl-12 md:pl-0 md:flex md:items-center md:justify-between">
                        <div className="absolute left-[-9px] top-0 md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-blue-500 border-4 border-zinc-950 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

                        <div className="hidden md:block md:w-[45%]" />
                        <div className="md:w-[45%] md:text-left pl-8">
                            <h4 className="text-xl font-bold text-white mb-2">2. Zanshin</h4>
                            <p className="text-zinc-400 text-sm">
                                <span className="text-blue-400 font-bold block mb-1">Concentración total.</span>
                                Voltear la cara o celebrar antes del "Yame" anulará el punto.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative pl-12 md:pl-0 md:flex md:items-center md:justify-between">
                        <div className="absolute left-[-9px] top-0 md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-kuma-gold border-4 border-zinc-950 shadow-[0_0_15px_rgba(234,179,8,0.8)]" />

                        <div className="md:w-[45%] md:text-right pr-8">
                            <h4 className="text-3xl font-black text-kuma-gold mb-2">3. SCORE</h4>
                            <p className="text-white text-sm font-bold">YUKO (1) - WAZA-ARI (2) - IPPON (3)</p>
                        </div>
                        <div className="hidden md:block md:w-[45%]" />
                    </div>
                </div>
            </section>

            {/* --- 4. PENALTIES (Cards) --- */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="bg-zinc-900 rounded-[3rem] p-8 md:p-16 border border-white/5">
                    <div className="text-center mb-12">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-serif font-black text-white mb-4">Penalizaciones</h2>
                        <p className="text-zinc-400 max-w-xl mx-auto">
                            Las advertencias y castigos se dividen en dos categorías independientes.
                            5 acumulaciones en una categoría resultan en la descalificación.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Cat 1 */}
                        <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Sword className="w-5 h-5 text-red-500" />
                                Categoría 1
                            </h3>
                            <ul className="space-y-3">
                                <PenaltyItem text="Contacto Excesivo" />
                                <PenaltyItem text="Ataques a zonas prohibidas" />
                                <PenaltyItem text="Técnicas peligrosas" />
                            </ul>
                        </div>

                        {/* Cat 2 */}
                        <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Scale className="w-5 h-5 text-yellow-500" />
                                Categoría 2
                            </h3>
                            <ul className="space-y-3">
                                <PenaltyItem text="Jogai (Salirse del área)" />
                                <PenaltyItem text="Mubobi (Ponerse en peligro)" />
                                <PenaltyItem text="Evitar Combate / Clinch pasivo" />
                                <PenaltyItem text="Agarrar sin intentar técnica" />
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}

// Helper Component for list items
function PenaltyItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-zinc-400 text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            {text}
        </li>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}
