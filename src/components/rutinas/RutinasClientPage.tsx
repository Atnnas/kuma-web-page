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
            <div className="fixed inset-0 z-0">
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
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-12 relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition" />
                            <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
                                <div className="absolute top-0 right-0 p-3">
                                    <button
                                        onClick={async () => {
                                            await abandonRoutineLog(pendingLog._id);
                                            setPendingLog(null);
                                        }}
                                        className="text-zinc-500 hover:text-white transition-colors p-1"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-8 h-8 text-cyan-400" />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                        <span className="inline-block w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">Sesión por Continuar</span>
                                    </div>
                                    <h3 className="text-xl font-black text-white">{pendingLog.routineTitle}</h3>
                                    <p className="text-zinc-500 text-sm font-medium">Quedaste en el ejercicio {pendingLog.lastState?.currentBlockIndex + 1} del entrenamiento.</p>
                                </div>

                                <Link href={`/rutinas/${pendingLog.routine}`} className="w-full md:w-auto">
                                    <button className="w-full md:w-64 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-cyan-50 transition-all active:scale-95 group/btn shadow-xl shadow-white/5">
                                        Continuar Entrenamiento
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
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
