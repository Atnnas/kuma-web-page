"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lock, Play, Video, Users, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TrainingVirtualProps {
    user?: any;
    mode?: "default" | "widget";
}

export const TrainingVirtual = ({ user, mode = "default" }: TrainingVirtualProps) => {
    const isWidget = mode === "widget";

    // If user is NOT logged in, we might want to default to closed or handle click differently.
    // But per requirements: "parecera con un distintivo de candadito... a los usuarios que NO estan logueados"
    // So the bar itself should show the lock if not logged in? Or inside?
    // "cuando se abra la tarjeta... descripcion de herramienta"
    // Let's implement the standard Monolith bar, but with Lock indication if logged out.

    const content = (
        <div className={`w-full ${isWidget ? "h-full" : ""}`}>
            {!user || !user.isActive ? (
                /* LOCKED STATE */
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={`${isWidget ? "h-full p-6 bg-zinc-950 border border-white/10 rounded-[2rem]" : "max-w-5xl mx-auto p-12 md:p-24 bg-zinc-950/40 border border-white/5 rounded-[3rem] shadow-2xl"} backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden`}
                >
                    {/* Background Icon */}
                    <Lock className={`absolute opacity-[0.03] text-white rotate-12 pointer-events-none ${isWidget ? "w-[200px] h-[200px] -bottom-10 -right-10" : "w-[500px] h-[500px] -bottom-20 -right-20"}`} />

                    <div className={`${isWidget ? "w-16 h-16 mb-4" : "w-24 h-24 mb-8"} rounded-full flex items-center justify-center border border-white/10 shadow-2xl relative z-10 ${user ? "bg-amber-900/20" : "bg-zinc-900"}`}>
                        <Lock className={`${isWidget ? "w-8 h-8" : "w-10 h-10"} ${user ? "text-amber-500" : "text-zinc-500"}`} />
                    </div>

                    <h3 className={`${isWidget ? "text-xl" : "text-3xl md:text-6xl"} font-black uppercase mb-3 relative z-10 tracking-tight ${user ? "text-amber-500" : "text-zinc-300"}`}>
                        {user ? "Pendiente" : "Dojo Virtual"}
                    </h3>

                    {!isWidget && (
                        <p className="max-w-2xl text-zinc-400 text-lg md:text-xl mb-12 leading-relaxed relative z-10 font-light">
                            {user
                                ? "Tu cuenta ha sido creada correctamente pero requiere activación manual por un administrador. Por favor contacta al Sensei para activar tu acceso al Dojo Virtual."
                                : "El Dojo Virtual contiene rutinas exclusivas, videos técnicos detallados y herramientas de seguimiento personalizadas para nuestros miembros activos."
                            }
                        </p>
                    )}

                    <div className={`relative z-10 grid gap-4 w-full ${isWidget ? "" : "max-w-sm"}`}>
                        {!user ? (
                            <Link href="/login" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest text-center transition-all shadow-lg hover:shadow-blue-500/20 text-xs">
                                Iniciar Sesión
                            </Link>
                        ) : (
                            isWidget && user ? (
                                <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest text-center">
                                    En espera de aprobación
                                </div>
                            ) : (
                                <div className="w-full py-5 bg-zinc-800 text-zinc-500 rounded-2xl font-bold uppercase tracking-widest text-center border border-white/5 cursor-not-allowed">
                                    Esperando Aprobación...
                                </div>
                            )
                        )}
                        {!isWidget && (
                            <div className="text-zinc-600 text-xs font-mono uppercase tracking-widest mt-2">
                                {user ? "ID: " + user.id : "Solo miembros activos"}
                            </div>
                        )}
                    </div>
                </motion.div>
            ) : (
                /* UNLOCKED STATE */
                <div className={isWidget ? "h-full flex flex-col gap-4" : "grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto"}>
                    {/* Compact All-in-One Card for Widget */}
                    {isWidget ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative flex-1 p-6 bg-zinc-950 border border-white/10 rounded-[2rem] hover:border-blue-500/20 transition-all duration-500 flex flex-col items-start overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black uppercase text-white tracking-tight">Virtual Dojo</h3>
                            </div>
                            <p className="text-zinc-500 text-sm mb-4 leading-relaxed line-clamp-2">
                                Accede a rutinas y biblioteca técnica.
                            </p>
                            <button className="mt-auto w-full py-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                                Entrar
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            {/* Normal Cards (Rutinas & Biblioteca) */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="group relative p-10 bg-zinc-950/40 border border-white/5 rounded-[2.5rem] hover:bg-zinc-900/40 hover:border-blue-500/20 transition-all duration-500 flex flex-col items-start text-left backdrop-blur-xl overflow-hidden min-h-[350px]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-16 h-16 bg-blue-500/5 rounded-2xl flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500 relative z-10">
                                    <Activity className="w-8 h-8" />
                                </div>

                                <h3 className="text-3xl font-black uppercase text-white mb-3 relative z-10 group-hover:text-blue-400 transition-colors tracking-tight">Rutinas</h3>
                                <p className="text-zinc-500 text-base mb-8 max-w-sm relative z-10 leading-relaxed">
                                    Planes de acondicionamiento físico diseñados para el rendimiento en karate.
                                </p>

                                <button className="mt-auto px-6 py-3 rounded-full border border-white/10 group-hover:bg-blue-600/90 group-hover:border-transparent group-hover:text-white text-zinc-400 font-bold uppercase text-xs tracking-[0.2em] transition-all relative z-10">
                                    Comenzar
                                </button>

                                {/* Bg Detail */}
                                <Activity className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700 ease-out" />
                            </motion.div>

                            {/* Card 2: Videos Técnicos */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="group relative p-10 bg-zinc-950/40 border border-white/5 rounded-[2.5rem] hover:bg-zinc-900/40 hover:border-blue-500/20 transition-all duration-500 flex flex-col items-start text-left backdrop-blur-xl overflow-hidden min-h-[350px]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-16 h-16 bg-blue-500/5 rounded-2xl flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500 relative z-10">
                                    <Video className="w-8 h-8" />
                                </div>

                                <h3 className="text-3xl font-black uppercase text-white mb-3 relative z-10 group-hover:text-blue-400 transition-colors tracking-tight">Biblioteca</h3>
                                <p className="text-zinc-500 text-base mb-8 max-w-sm relative z-10 leading-relaxed">
                                    Explicaciones técnicas detalladas de Katas y Kumite, cuadro por cuadro.
                                </p>

                                <button className="mt-auto px-6 py-3 rounded-full border border-white/10 group-hover:bg-blue-600/90 group-hover:border-transparent group-hover:text-white text-zinc-400 font-bold uppercase text-xs tracking-[0.2em] transition-all relative z-10">
                                    Explorar
                                </button>

                                {/* Bg Detail */}
                                <Video className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5 rotate-[15deg] group-hover:rotate-0 transition-transform duration-700 ease-out" />
                            </motion.div>
                        </>
                    )}
                </div>
            )}
        </div>
    );

    if (isWidget) {
        return content;
    }

    return (
        <section id="dojo-virtual" className="relative z-10 w-full px-4 md:px-8 max-w-[1920px] mx-auto py-12 pb-32">
            {/* Header */}
            <div className="relative text-center mb-8 md:mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center gap-4"
                >

                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl flex items-center gap-4">
                        <span className="text-kuma-gold">Virtual</span> Dojo
                    </h2>
                </motion.div>
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-yellow-900/10 blur-[100px] rounded-full pointer-events-none" />
            </div>

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    {content}
                </motion.div>
            </AnimatePresence>
        </section>
    );
}

