"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { Loader2, Play, X, Clock, Zap, ChevronRight } from "lucide-react";
import { RutinasTable } from "@/components/rutinas/RutinasTable";
import { StreakLeaderboard } from "@/components/gamification/StreakLeaderboard";
import { getAnyUnfinishedLog, abandonRoutineLog } from "@/lib/actions/routine-logs";
import { KumaMascot } from "@/components/rutinas/KumaMascot";
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
    user: any;
}

export function RutinasClientPage({ user }: RutinasClientPageProps) {
    const [routines, setRoutines] = useState<IRoutine[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingLog, setPendingLog] = useState<any>(null);
    const [recovering, setRecovering] = useState(false);
    const [userStreak, setUserStreak] = useState(0);

    useEffect(() => {
        const fetchUserStreak = async () => {
            try {
                // We use the leaderboard API to get the user's current streak
                const res = await fetch("/api/users/leaderboard", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    // Basic heuristic: match by name or image if id is not direct, 
                    // but usually user._id or user.id is in the session
                    const currentUser = data.find((u: any) => u._id === user?._id || u._id === user?.id || u.email === user?.email);
                    if (currentUser) {
                        setUserStreak(currentUser.streakDays || 0);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user streak", error);
            }
        };
        fetchUserStreak();
    }, [user]);

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
                const res = await fetch(`/api/routines`, { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setRoutines(data);
            } catch (error) {
                console.error("Error loading routines", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRoutines();
    }, []);

    const handleCancel = async () => {
        if (!pendingLog) return;
        setRecovering(true);
        sessionStorage.setItem("routine_recovery_dismissed", pendingLog._id);
        await abandonRoutineLog(pendingLog._id);
        setPendingLog(null);
        setRecovering(false);
    };

    const elapsedMin = Math.floor((pendingLog?.lastState?.elapsedSeconds || 0) / 60);
    const completedSets = pendingLog?.lastState?.completedSets || 0;

    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-kuma-gold/30 pb-32 relative">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <style jsx global>{`
                    @keyframes pulse-slow {
                        0%, 100% { opacity: 0.1; transform: scale(1); }
                        50% { opacity: 0.3; transform: scale(1.05); }
                    }
                    .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
                    @keyframes glow-pulse {
                        0%, 100% { box-shadow: 0 0 30px 4px rgba(6,182,212,0.25), 0 0 80px 10px rgba(6,182,212,0.1); }
                        50% { box-shadow: 0 0 55px 10px rgba(6,182,212,0.5), 0 0 130px 25px rgba(6,182,212,0.22); }
                    }
                    .animate-glow-pulse { animation: glow-pulse 2.5s ease-in-out infinite; }
                `}</style>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black" />
                <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-[0.03]" />
            </div>

            {/* Hero */}
            <header className="relative w-full h-[25vh] min-h-[200px] flex flex-col items-center justify-center overflow-hidden border-b border-kuma-gold/20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-zinc-950" />
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

            {/* Content */}
            <section className="relative z-20 px-4 max-w-7xl mx-auto pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">

                    {/* LEFT COLUMN: Stats & Tables */}
                    <div className="space-y-8 order-2 lg:order-1">
                        {/* Leaderboard */}
                        {user && (
                            <div className="mb-0">
                                <StreakLeaderboard />
                            </div>
                        )}

                        {/* ===== RECOVERY CARD ===== */}
                        <AnimatePresence>
                            {pendingLog && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97, y: -16 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                    className="mb-6"
                                >
                                    {/* Animated outer glow */}
                                    <div className="animate-glow-pulse rounded-2xl">
                                        <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/60 bg-gradient-to-br from-zinc-900 via-[#0b1e24] to-zinc-950">

                                            {/* Top chromatic bar */}
                                            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300" />

                                            {/* Inner glow bloom */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-400/10 blur-3xl rounded-full pointer-events-none" />

                                            <div className="relative z-10 p-5 sm:p-7 md:p-8">

                                                {/* Icon + title */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-cyan-500/25 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                                                        <Zap className="w-5 h-5 text-cyan-300" fill="currentColor" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[10px] sm:text-[11px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-0.5 leading-none">
                                                            Sesión sin terminar
                                                        </p>
                                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight truncate leading-tight">
                                                            {pendingLog.routineTitle}
                                                        </h2>
                                                    </div>
                                                </div>

                                                {/* Stats */}
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {elapsedMin > 0 && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-300">
                                                            <Clock size={11} className="text-cyan-400" />
                                                            {elapsedMin} min entrenados
                                                        </span>
                                                    )}
                                                    {completedSets > 0 && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs font-bold text-cyan-300">
                                                            {completedSets} sets completados
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                                                {/* Buttons */}
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <Link
                                                        href={`/routines/${pendingLog.routine}?resume=true`}
                                                        className="flex-1 sm:flex-none"
                                                    >
                                                        <button className="w-full sm:w-auto h-14 px-8 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.65)]">
                                                            <Play className="w-5 h-5 fill-black flex-shrink-0" />
                                                            Reanudar Sesión
                                                            <ChevronRight className="w-5 h-5 flex-shrink-0" />
                                                        </button>
                                                    </Link>

                                                    <button
                                                        onClick={handleCancel}
                                                        disabled={recovering}
                                                        className="w-full sm:w-auto h-14 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/8 text-zinc-400 hover:text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                                                    >
                                                        <X size={15} />
                                                        Cancelar sesión
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ===== ROUTINES TABLE — locked until recovery is resolved ===== */}
                        <div className={`relative transition-all duration-500 ${pendingLog ? "pointer-events-none select-none" : ""}`}>
                            {pendingLog && (
                                <div className="absolute inset-0 z-10 bg-zinc-950/75 backdrop-blur-[3px] rounded-2xl flex items-center justify-center min-h-[120px]">
                                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center px-4">
                                        Resuelve la sesión anterior para acceder a las rutinas
                                    </p>
                                </div>
                            )}

                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-10 h-10 text-kuma-gold animate-spin" />
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <RutinasTable data={routines as any} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Kuma Mascot */}
                    <div className="relative order-1 lg:order-2 flex justify-center lg:block">
                        <div className="sticky top-24 lg:top-32 xl:top-40 w-full flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="w-full max-w-[300px]"
                            >
                                <KumaMascot streak={userStreak} />
                            </motion.div>
                        </div>
                    </div>

                </div>

                <div className="mt-20 text-center">
                    <p className="text-zinc-600 italic">Más rutinas serán agregadas próximamente.</p>
                </div>
            </section>
        </main>
    );
}
