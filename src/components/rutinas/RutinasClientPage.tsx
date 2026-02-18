"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { Loader2, Play, X, Clock, ArrowRight } from "lucide-react";
import { RutinasTable } from "@/components/rutinas/RutinasTable";
import { StreakLeaderboard } from "@/components/gamification/StreakLeaderboard";
import { getAnyUnfinishedLog, abandonRoutineLog } from "@/lib/actions/routine-logs";
import Link from "next/link";

interface IRoutine {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    thumbnail?: string;
    estimated_duration: number;
    equipment_types: string[];
}

interface RutinasClientPageProps {
    user: any; // Session user
}

export function RutinasClientPage({ user }: RutinasClientPageProps) {
    const [routines, setRoutines] = useState<IRoutine[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingLog, setPendingLog] = useState<any>(null);

    useEffect(() => {
        async function checkRecovery() {
            const res = await getAnyUnfinishedLog();
            if (res.success && res.log) {
                setPendingLog(res.log);
            }
        }
        checkRecovery();
    }, []);

    useEffect(() => {
        async function fetchRoutines() {
            try {
                const res = await fetch(`/api/routines`, {
                    cache: "no-store",
                });

                if (!res.ok) {
                    console.error("Failed to fetch routines:", res.status, res.statusText);
                    throw new Error("Failed to fetch");
                }

                const data = await res.json();
                setRoutines(data);
                console.log("Routines fetched:", data.length); // DEBUG
            } catch (error) {
                console.error("Error loading routines", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRoutines();
    }, []);

    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-kuma-gold/30 pb-32 relative">
            {/* Global Background Depth */}
            <div className="fixed inset-0 z-0 text-white">
                <style jsx global>{`
                    @keyframes pulse-slow {
                        0%, 100% { opacity: 0.1; transform: scale(1); }
                        50% { opacity: 0.3; transform: scale(1.05); }
                    }
                    .animate-pulse-slow {
                        animation: pulse-slow 8s infinite ease-in-out;
                    }
                `}</style>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black" />
                <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-[0.03]" />
            </div>

            {/* --- HERO SECTION --- */}
            <header className="relative w-full h-[25vh] min-h-[200px] flex flex-col items-center justify-center overflow-hidden border-b border-kuma-gold/20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-zinc-950" />
                    {/* Animated Glow */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 blur-[120px] rounded-full"
                    />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-10">
                    <PrimalTitle className="text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-red-700 via-white to-kuma-gold bg-clip-text text-transparent drop-shadow-sm">
                        Rutinas
                    </PrimalTitle>
                </div>

                <BackButton href="/entrenamiento" />
            </header>

            {/* --- CONTENT GRID --- */}
            <section className="relative z-20 px-4 max-w-7xl mx-auto pt-12">

                {/* --- LEADERBOARD --- */}
                {user && (
                    <div className="mb-8">
                        <StreakLeaderboard />
                    </div>
                )}

                {/* --- GLOBAL RECOVERY BANNER --- */}
                <AnimatePresence>
                    {pendingLog && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            className="mb-14 relative"
                        >
                            {/* Outer Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-[2.5rem] blur-xl opacity-20 animate-pulse-slow" />

                            <div className="relative bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 overflow-hidden shadow-2xl">

                                {/* Inner Decorative Gradient Ring */}
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

                                <div className="relative flex flex-col items-center lg:items-start lg:flex-row gap-6 flex-1">
                                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center shadow-inner flex-shrink-0">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Clock className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                        </motion.div>
                                    </div>

                                    <div className="text-center lg:text-left">
                                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                                            <span className="flex h-2 w-2 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                            </span>
                                            <span className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.3em]">Sesión Interrumpida</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2 uppercase italic">
                                            {pendingLog.routineTitle}
                                        </h3>
                                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5 flex items-center gap-2 text-xs font-bold text-zinc-400">
                                                <Clock size={12} className="text-cyan-500" />
                                                Próximo: {pendingLog.lastState?.currentBlockIndex + 1}
                                            </div>
                                            <div className="px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20 flex items-center gap-2 text-xs font-bold text-cyan-400">
                                                <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] transition-all duration-1000"
                                                        style={{
                                                            width: `${(() => {
                                                                const r: any = routines.find(rout => rout._id === pendingLog.routine);
                                                                if (!r) return 5;
                                                                // Use currentBlockIndex vs total blocks as a safe fallback for progress
                                                                const progress = (pendingLog.lastState?.currentBlockIndex / (r.blocks?.length || 10)) * 100 || 0;
                                                                return Math.max(5, Math.min(progress, 100));
                                                            })()}%`
                                                        }}
                                                    />
                                                </div>
                                                Progreso
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 relative z-10">
                                    <button
                                        onClick={async () => {
                                            await abandonRoutineLog(pendingLog._id);
                                            setPendingLog(null);
                                        }}
                                        className="h-14 px-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-[1.5rem] font-bold uppercase tracking-widest text-xs border border-white/5 transition-all active:scale-95 flex items-center justify-center gap-2 order-2 sm:order-1"
                                    >
                                        <X size={16} />
                                        No continuar
                                    </button>

                                    <Link href={`/rutinas/${pendingLog.routine}`} className="order-1 sm:order-2">
                                        <button className="h-14 px-10 w-full sm:w-auto bg-white text-black rounded-[1.5rem] font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 hover:bg-cyan-50 transition-all active:scale-95 shadow-[0_10px_25px_-5px_rgba(255,255,255,0.2)] group/btn">
                                            <Play className="w-5 h-5 fill-black group-hover/btn:scale-110 transition-transform" />
                                            Continuar Entrenamiento
                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-kuma-gold animate-spin" />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <RutinasTable data={routines as any} />
                    </div>
                )}

                {/* --- COMING SOON --- */}
                <div className="mt-20 text-center">
                    <p className="text-zinc-600 italic">Más rutinas serán agregadas próximamente.</p>
                </div>
            </section>

        </main>
    );
}
