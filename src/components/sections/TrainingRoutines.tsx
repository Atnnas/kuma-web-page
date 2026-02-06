"use client";

import { motion } from "framer-motion";
import { Dumbbell, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TrainingRoutinesProps {
    user?: any;
}

export const TrainingRoutines = ({ user }: TrainingRoutinesProps) => {
    return (
        <section className="relative z-10 w-full px-4 md:px-8 max-w-[1920px] mx-auto py-12">

            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center gap-4"
                >
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl flex items-center gap-4">
                        Laboratorio <span className="text-kuma-gold">Kuma</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Acceso exclusivo a rutinas de fortalecimiento, explosividad y técnica complementaria.
                    </p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto relative group"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-red-900/20 blur-3xl rounded-[3rem] group-hover:bg-red-900/30 transition-colors duration-500" />

                <div className="relative bg-zinc-900 border border-white/10 rounded-[3rem] p-8 md:p-16 overflow-hidden text-center">

                    {/* Icon */}
                    <div className="w-24 h-24 bg-zinc-800 rounded-full mx-auto flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                        {user ? (
                            <Dumbbell className="w-10 h-10 text-kuma-gold" />
                        ) : (
                            <Lock className="w-10 h-10 text-zinc-500" />
                        )}
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase">
                        Zona de Rutinas
                    </h3>

                    <p className="text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
                        {user
                            ? "Bienvenido, guerrero. Tu plan de entrenamiento digital está listo. Accede a las series de Kata, Kumite y Físico."
                            : "Este contenido está reservado para miembros registrados del Dojo. Inicia sesión para desbloquear tu potencial."
                        }
                    </p>

                    <Link href="/rutinas">
                        <button className={`
                            px-10 py-4 rounded-full font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 mx-auto
                            ${user
                                ? "bg-kuma-gold text-black hover:bg-white hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                            }
                        `}>
                            {user ? (
                                <>
                                    <span>Ingresar al Dojo Digital</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    <span>Iniciar Sesión para Ver</span>
                                    <Lock className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </Link>

                </div>
            </motion.div>

        </section>
    );
};
