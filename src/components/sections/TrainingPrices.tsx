"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, Check, Star, LockKey } from "@phosphor-icons/react/dist/ssr";
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

// Add props interface
interface TrainingPricesProps {
    user?: any;
    mode?: "default" | "carousel";
}

export const TrainingPrices = ({ user, mode = "default" }: TrainingPricesProps) => {
    const [plans, setPlans] = useState<IMembership[]>([]);
    const [loading, setLoading] = useState(true);
    const isCarousel = mode === "carousel";

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
        <section id="precios" className={`relative z-10 w-full ${isCarousel ? "h-full flex flex-col" : "px-4 md:px-8 max-w-[1920px] mx-auto py-12"}`}>

            {/* Header - Hidden in carousel mode */}
            {!isCarousel && (
                <div className="relative text-center mb-8 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center justify-center gap-4"
                    >
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl flex items-center gap-4">
                            <span className="text-kuma-gold">Planes</span> Mensuales
                        </h2>
                    </motion.div>
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-yellow-900/10 blur-[100px] rounded-full pointer-events-none" />
                </div>
            )}

            {isCarousel && (
                <div className="mb-4 px-2">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                        Planes <span className="text-kuma-gold">Mensuales</span>
                    </h2>
                </div>
            )}

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-2 border-kuma-gold border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className={
                            isCarousel
                                ? "flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent custom-scrollbar h-full items-stretch px-2"
                                : "grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto items-stretch"
                        }>
                            {plans.map((plan, index) => {
                                const isLocked = plan.restricted && (!user || user.isActive === false);

                                return (
                                    <motion.div
                                        key={plan._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative group rounded-[2.5rem] border backdrop-blur-xl flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:-translate-y-2
                                            ${isCarousel ? "min-w-[280px] w-[280px] snap-center shrink-0 p-6" : "p-10 h-full w-full"}
                                            ${isLocked
                                                ? "bg-zinc-950/60 border-white/5 grayscale opacity-80 cursor-not-allowed hover:bg-zinc-950/70"
                                                : plan.recommended
                                                    ? "bg-zinc-900/60 border-kuma-gold/50 shadow-2xl shadow-yellow-900/10 z-10 hover:shadow-yellow-600/20"
                                                    : "bg-zinc-950/60 border-white/10 hover:border-white/20 hover:bg-zinc-900/60 hover:shadow-xl"
                                            }
                                            ${plan.recommended && !isCarousel ? "scale-105" : ""}
                                        `}
                                    >
                                        {/* LOCKED STATE OVERLAY */}
                                        {isLocked && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
                                                <div className={`rounded-full flex items-center justify-center border border-white/10 shadow-xl ${isCarousel ? "w-12 h-12 mb-3" : "w-20 h-20 mb-6"} ${user ? "bg-amber-900/20" : "bg-zinc-900"}`}>
                                                    <LockKey className={`${isCarousel ? "w-6 h-6" : "w-10 h-10"} ${user ? "text-amber-500" : "text-zinc-500"}`} weight="duotone" />
                                                </div>
                                                <span className={`font-black uppercase tracking-widest text-base mb-6 ${user ? "text-amber-500" : "text-zinc-400"} ${isCarousel ? "text-xs mb-3" : ""}`}>
                                                    {user ? "Pendiente" : "Exclusivo"}
                                                </span>
                                                {!user && !isCarousel && (
                                                    <Link href="/login" className="px-8 py-3 bg-red-600 text-white rounded-full font-black uppercase text-sm tracking-wider hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20">
                                                        Iniciar Sesión
                                                    </Link>
                                                )}
                                            </div>
                                        )}

                                        {/* Highlights for Recommended */}
                                        {plan.recommended && !isLocked && (
                                            <>
                                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-600" />
                                                <div className="absolute top-6 right-6 text-yellow-500 animate-pulse">
                                                    <Star className="w-6 h-6 fill-yellow-500" weight="fill" />
                                                </div>
                                            </>
                                        )}

                                        <div className={`w-full border-b border-white/5 ${isCarousel ? "mb-4 pb-4" : "mb-8 pb-8"}`}>
                                            <h3 className={`${isCarousel ? "text-xl" : "text-3xl"} font-black uppercase tracking-wider text-white mb-2`}>
                                                {plan.title}
                                            </h3>
                                            {plan.recommended && (
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-kuma-gold bg-kuma-gold/10 px-3 py-1 rounded-full">
                                                    Recomendado
                                                </span>
                                            )}
                                        </div>

                                        <div className={`${isCarousel ? "mb-4" : "mb-10"} relative`}>
                                            {/* Price Glow */}
                                            <div className={`absolute inset-0 bg-kuma-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isLocked ? "hidden" : ""}`} />
                                            <span className={`${isCarousel ? "text-4xl" : "text-6xl"} font-black tracking-tighter block relative z-10 ${isLocked ? "text-zinc-600" : "text-white"}`}>
                                                {plan.price}
                                            </span>
                                            <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] relative z-10 mt-3 block">
                                                {plan.frequency}
                                            </span>
                                        </div>

                                        <ul className={`space-y-4 mb-10 w-full flex-1 text-left px-2 ${isCarousel ? "text-sm" : ""}`}>
                                            {plan.features.slice(0, isCarousel ? 3 : 10).map((feature, idx) => (
                                                <li key={idx} className={`flex items-start gap-3 font-medium ${isLocked ? "text-zinc-600" : "text-zinc-300"}`}>
                                                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isLocked ? "text-zinc-700" : "text-kuma-gold"}`} weight="bold" />
                                                    <span className="leading-snug line-clamp-2">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA Button Placeholder (Optional) */}


                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </section>
    );
}
