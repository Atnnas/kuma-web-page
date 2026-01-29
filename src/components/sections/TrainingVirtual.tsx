"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lock, Play, Video, Users, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TrainingVirtualProps {
    user?: any;
}

export const TrainingVirtual = ({ user }: TrainingVirtualProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // If user is NOT logged in, we might want to default to closed or handle click differently.
    // But per requirements: "parecera con un distintivo de candadito... a los usuarios que NO estan logueados"
    // So the bar itself should show the lock if not logged in? Or inside?
    // "cuando se abra la tarjeta... descripcion de herramienta"
    // Let's implement the standard Monolith bar, but with Lock indication if logged out.

    return (
        <section id="dojo-virtual" className="relative z-10 w-full">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    /* COLLAPSED BAR - PRIMAL MONOLITH STYLE */
                    <motion.div
                        key="bar"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsOpen(true)}
                        className="cursor-pointer max-w-5xl mx-auto px-4"
                    >
                        <div className={`
                            backdrop-blur-md rounded-xl border transition-colors duration-500 shadow-2xl group relative overflow-hidden
                            ${!user || !user.isActive
                                ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                                : "bg-zinc-950/80 border-white/10 hover:border-kuma-gold/50"
                            }
                        `}>
                            {/* Texture/Noise overlay */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                            {/* Hover Shine Effect (Only if logged in or generally nice?) */}
                            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-blue-600/10 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />

                            <div className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                                {/* Left: Label */}
                                <div className="text-center md:text-left">
                                    <span className="block text-[10px] md:text-xs font-black tracking-[0.4em] text-zinc-500 uppercase group-hover:text-blue-500 transition-colors duration-500">
                                        ENTRENAMIENTO REMOTO
                                    </span>
                                </div>

                                {/* Center: Title */}
                                <div className="flex-1 text-center md:text-left flex items-center justify-center md:justify-start gap-4">
                                    <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-2xl transition-colors
                                        ${!user || !user.isActive ? "text-zinc-600" : "text-white"}
                                    `}>
                                        DOJO VIRTUAL
                                    </h2>
                                    {(!user || !user.isActive) && <Lock className={`w-8 h-8 md:w-12 md:h-12 ${user ? "text-amber-500" : "text-zinc-600"}`} />}
                                </div>

                                {/* Right: Icon */}
                                <div className="flex items-center gap-4 text-zinc-500 group-hover:text-white transition-colors">
                                    <span className="hidden md:block text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Explorar
                                    </span>
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 group-hover:bg-white/5 transition-all">
                                        <ChevronDown className="w-6 h-6 transition-transform duration-300 group-hover:translate-y-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* EXPANDED CONTENT */
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Header + Top Close Button */}
                        <div className="relative mb-12 pt-4 text-center">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-transparent via-blue-700/50 to-transparent w-full"
                            />

                            <span className="block text-xs md:text-sm font-bold tracking-[0.5em] text-zinc-500 uppercase mb-2 relative z-10">
                                Tu Dojo en Cualquier Lugar
                            </span>
                            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-8 relative z-10">
                                <span className="text-blue-500">Virtual</span>
                            </h2>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-bold tracking-wider uppercase transition-colors border border-white/10 backdrop-blur-md inline-flex items-center gap-2 shadow-lg relative z-10"
                            >
                                <ChevronDown className="w-5 h-5 rotate-180" />
                                Cerrar Dojo Virtual
                            </button>
                        </div>

                        {/* Content Container */}
                        <div className="px-4 md:px-8 max-w-7xl mx-auto">
                            {!user || !user.isActive ? (
                                /* LOCKED STATE */
                                <div className="p-12 md:p-24 bg-zinc-950/60 border border-white/5 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                                    {/* Background Icon */}
                                    <Lock className="absolute opacity-5 w-96 h-96 text-white rotate-12 -bottom-20 -right-20 pointer-events-none" />

                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center border border-white/10 mb-8 shadow-2xl relative z-10 ${user ? "bg-amber-900/20" : "bg-zinc-900"}`}>
                                        <Lock className={`w-10 h-10 ${user ? "text-amber-500" : "text-zinc-500"}`} />
                                    </div>

                                    <h3 className={`text-3xl md:text-5xl font-black uppercase mb-6 relative z-10 ${user ? "text-amber-500" : "text-zinc-300"}`}>
                                        {user ? "Activación Pendiente" : "Acceso Restringido"}
                                    </h3>
                                    <p className="max-w-xl text-zinc-400 text-lg mb-10 leading-relaxed relative z-10">
                                        {user
                                            ? "Tu cuenta ha sido creada correctamente pero requiere activación manual por un administrador. Por favor contacta al Sensei para activar tu acceso al Dojo Virtual."
                                            : "El Dojo Virtual contiene rutinas exclusivas, videos técnicos detallados y herramientas de seguimiento personalizadas para nuestros miembros activos."
                                        }
                                    </p>

                                    <div className="relative z-10 grid gap-4 w-full max-w-xs">
                                        {!user ? (
                                            <Link href="/login" className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold uppercase tracking-widest text-center transition-all shadow-lg hover:shadow-red-900/40">
                                                Iniciar Sesión
                                            </Link>
                                        ) : (
                                            <div className="w-full py-4 bg-zinc-800 text-zinc-500 rounded-xl font-bold uppercase tracking-widest text-center border border-white/5 cursor-not-allowed">
                                                Esperando Aprobación...
                                            </div>
                                        )}
                                        <div className="text-zinc-600 text-xs font-mono uppercase tracking-widest">
                                            {user ? "ID: " + user.id : "Solo miembros activos"}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* UNLOCKED STATE */
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                    {/* Card 1: Rutinas */}
                                    <div className="group p-8 bg-zinc-950/60 border border-white/10 rounded-3xl hover:bg-zinc-900/60 hover:border-blue-500/50 transition-all duration-300 flex flex-col items-center text-center backdrop-blur-xl">
                                        <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                            <Activity className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-black uppercase text-white mb-2">Rutinas en Casa</h3>
                                        <p className="text-zinc-400 text-sm mb-6">Mantén tu forma física con planes de acondicionamiento diseñados para karatekas.</p>
                                        <button className="mt-auto text-blue-400 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">
                                            Ver Rutinas &rarr;
                                        </button>
                                    </div>

                                    {/* Card 2: Videos Técnicos */}
                                    <div className="group p-8 bg-zinc-950/60 border border-white/10 rounded-3xl hover:bg-zinc-900/60 hover:border-blue-500/50 transition-all duration-300 flex flex-col items-center text-center backdrop-blur-xl">
                                        <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                            <Video className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-black uppercase text-white mb-2">Biblioteca Técnica</h3>
                                        <p className="text-zinc-400 text-sm mb-6">Analiza Katas, Kihon y Kumite con explicaciones detalladas cuadro por cuadro.</p>
                                        <button className="mt-auto text-blue-400 font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">
                                            Explorar Videos &rarr;
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Bottom Close Button */}
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-bold tracking-wider uppercase transition-colors border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-lg"
                                >
                                    <ChevronDown className="w-5 h-5 rotate-180" />
                                    Cerrar Dojo Virtual
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
