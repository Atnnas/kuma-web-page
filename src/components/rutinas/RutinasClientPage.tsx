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
                const dismissedId = sessionStorage.getItem("routine_recovery_dismissed");
                if (dismissedId !== res.log._id) {
                    setPendingLog(res.log);
                }
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

                <BackButton href="/training" />
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
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="mb-10 w-full"
                        >
                            <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_40px_-8px_rgba(6,182,212,0.25)]">
                                {/* Top accent bar */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500" />

                                {/* Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950" />
                                <div className="absolute inset-0 bg-cyan-500/5" />

                                <div className="relative z-10 p-5 sm:p-6 md:p-8">
                                    {/* Header row */}
                                    <div className="flex items-start justify-between gap-4 mb-5">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Animated dot */}
                                            <span className="flex-shrink-0 flex h-3 w-3 relative mt-0.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.25em] mb-1">Sesión Interrumpida</p>
                                                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight uppercase truncate">
                                                    {pendingLog.routineTitle}
                                                </h3>
                                            </div>
                                        </div>
                                        {/* Dismiss X — always visible */}
                                        <button
                                            onClick={async () => {
                                                sessionStorage.setItem("routine_recovery_dismissed", pendingLog._id);
                                                await abandonRoutineLog(pendingLog._id);
                                                setPendingLog(null);
                                            }}
                                            className="flex-shrink-0 w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-90"
                                            aria-label="Descartar"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Progress info */}
                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-zinc-400">
                                            <Clock size={12} className="text-cyan-400 flex-shrink-0" />
                                            <span>{Math.floor((pendingLog.lastState?.elapsedSeconds || 0) / 60)} min entrenados</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-xs font-bold text-cyan-400">
                                            <span className="text-zinc-400">Progreso:</span>
                                            <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                                    style={{
                                                        width: `${Math.max(8, Math.min(
                                                            ((pendingLog.lastState?.completedSets || 0) /
                                                                Math.max(1, pendingLog.lastState?.completedSets + 1 || 1)) * 100,
                                                            95
                                                        ))}%`
                                                    }}
                                                />
                                            </div>
                                            <span>Set {pendingLog.lastState?.completedSets || 0} completados</span>
                                        </div>
                                    </div>

                                    {/* CTA button — full width on mobile, auto on desktop */}
                                    <Link href={`/routines/${pendingLog.routine}?resume=true`} className="block w-full sm:w-auto sm:inline-block">
                                        <button className="w-full sm:w-auto h-14 px-8 bg-white text-black rounded-xl font-black uppercase tracking-wider text-sm flex items-center justify-center gap-3 hover:bg-cyan-50 active:scale-95 transition-all shadow-lg">
                                            <Play className="w-5 h-5 fill-black flex-shrink-0" />
                                            Continuar Entrenamiento
                                            <ArrowRight className="w-5 h-5 flex-shrink-0" />
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
