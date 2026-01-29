"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Star, Lock } from "lucide-react";
import Link from "next/link";

interface IMembership {
    _id: string;
    title: string;
    price: string;
    frequency: string;
    features: string[];
    recommended: boolean;
    restricted: boolean;
}

export const TrainingPrices = ({ user }: { user?: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [plans, setPlans] = useState<IMembership[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch('/api/memberships', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setPlans(data);
                }
            } catch (error) {
                console.error("Failed to fetch memberships", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    return (
        <section id="precios" className="relative z-10 w-full">
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
                        <div className="bg-zinc-950/80 backdrop-blur-md rounded-xl border border-white/10 hover:border-kuma-gold/50 transition-colors duration-500 shadow-2xl group relative overflow-hidden">
                            {/* Texture/Noise overlay */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                            {/* Hover Shine Effect */}
                            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-yellow-600/10 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />

                            <div className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                                {/* Left: Label */}
                                <div className="text-center md:text-left">
                                    <span className="block text-[10px] md:text-xs font-black tracking-[0.4em] text-zinc-500 uppercase group-hover:text-kuma-gold transition-colors duration-500">
                                        PLANES Y TARIFAS
                                    </span>
                                </div>

                                {/* Center: Title */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
                                        MENSUALIDADES
                                    </h2>
                                </div>

                                {/* Right: Icon */}
                                <div className="flex items-center gap-4 text-zinc-500 group-hover:text-white transition-colors">
                                    <span className="hidden md:block text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Ver Planes
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
                                className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-700/50 to-transparent w-full"
                            />

                            <span className="block text-xs md:text-sm font-bold tracking-[0.5em] text-zinc-500 uppercase mb-2 relative z-10">
                                Inversión en tu Desarrollo
                            </span>
                            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-8 relative z-10">
                                <span className="text-kuma-gold">Precios</span>
                            </h2>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-8 py-3 bg-blue-600/80 hover:bg-blue-500 text-white rounded-full font-bold tracking-wider uppercase transition-colors border border-blue-400/30 hover:border-blue-400/60 backdrop-blur-md inline-flex items-center gap-2 shadow-lg shadow-blue-900/20 relative z-10"
                            >
                                <ChevronDown className="w-5 h-5 rotate-180" />
                                Cerrar Precios
                            </button>
                        </div>

                        {/* Plans Grid */}
                        <div className="px-4 md:px-8 max-w-7xl mx-auto">


                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="w-10 h-10 border-2 border-kuma-gold border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {plans.map((plan, index) => {
                                        const isLocked = plan.restricted && (!user || user.isActive === false);

                                        return (
                                            <motion.div
                                                key={plan._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`relative group rounded-3xl p-8 border backdrop-blur-xl flex flex-col items-center text-center overflow-hidden transition-all duration-300
                                                    ${isLocked
                                                        ? "bg-zinc-950/40 border-white/5 grayscale opacity-80 cursor-not-allowed hover:bg-zinc-950/60" // Locked Style
                                                        : plan.recommended
                                                            ? "bg-zinc-900/80 border-kuma-gold/50 shadow-2xl shadow-yellow-900/10 scale-105 z-10"
                                                            : "bg-zinc-950/60 border-white/10 hover:border-white/20 hover:bg-zinc-900/80"
                                                    }
                                                `}
                                            >
                                                {/* LOCKED STATE OVERLAY */}
                                                {isLocked && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-20">
                                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border border-white/10 mb-4 shadow-xl ${user ? "bg-amber-900/20" : "bg-zinc-900"}`}>
                                                            <Lock className={`w-8 h-8 ${user ? "text-amber-500" : "text-zinc-500"}`} />
                                                        </div>
                                                        <span className={`font-bold uppercase tracking-widest text-sm mb-4 ${user ? "text-amber-500" : "text-zinc-400"}`}>
                                                            {user ? "Activación Pendiente" : "Contenido Exclusivo"}
                                                        </span>
                                                        {!user ? (
                                                            <Link href="/login" className="px-6 py-2 bg-red-600 text-white rounded-full font-bold uppercase text-xs tracking-wider hover:bg-red-500 transition-colors">
                                                                Iniciar Sesión
                                                            </Link>
                                                        ) : (
                                                            <span className="text-xs text-zinc-500 uppercase font-mono bg-black/50 px-3 py-1 rounded">
                                                                Contactar Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Highlights for Recommended */}
                                                {plan.recommended && !isLocked && (
                                                    <>
                                                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-600" />
                                                        <div className="absolute top-4 right-4 text-yellow-500">
                                                            <Star className="w-5 h-5 fill-yellow-500" />
                                                        </div>
                                                    </>
                                                )}

                                                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-2">
                                                    {plan.title}
                                                </h3>

                                                <div className="my-6">
                                                    <span className={`text-5xl md:text-6xl font-black tracking-tight block ${isLocked ? "text-zinc-500" : "text-kuma-gold"}`}>
                                                        {plan.price}
                                                    </span>
                                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                                        / {plan.frequency}
                                                    </span>
                                                </div>

                                                <ul className="space-y-4 mb-8 w-full">
                                                    {plan.features.map((feature, idx) => (
                                                        <li key={idx} className={`flex items-center gap-3 text-lg md:text-xl font-bold text-left ${isLocked ? "text-zinc-500" : "text-zinc-300"}`}>
                                                            <Check className={`w-5 h-5 shrink-0 ${isLocked ? "text-zinc-600" : "text-kuma-gold"}`} />
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Bottom Close Button */}
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-3 bg-blue-600/80 hover:bg-blue-500 text-white rounded-full font-bold tracking-wider uppercase transition-colors border border-blue-400/30 hover:border-blue-400/60 backdrop-blur-md flex items-center gap-2 shadow-lg shadow-blue-900/20"
                                >
                                    <ChevronDown className="w-5 h-5 rotate-180" />
                                    Cerrar Precios
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
