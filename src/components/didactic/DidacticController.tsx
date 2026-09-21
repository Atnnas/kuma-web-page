"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PathType, Level, UserDidacticProgress, MascotMood } from "@/types/didactica";
import { DojoLingoMap } from "./DojoLingoMap";
import { DidacticEncyclopedia } from "./DidacticEncyclopedia";
import { LessonSessionModal } from "./LessonSessionModal";
import { KumaAbsenceGreetingModal } from "./KumaAbsenceGreetingModal";
import { InstallAppButton } from "./InstallAppButton";
import {
    Compass,
    BookOpen,
    CloudCheck,
    CloudArrowUp,
    UserCircle,
    ShieldStar,
    Sparkle,
} from "@phosphor-icons/react";

const INITIAL_PROGRESS: UserDidacticProgress = {
    completedLevelIds: [],
    levelStars: {},
    xp: 0,
    streak: 1,
    lastActiveDate: new Date().toISOString().split("T")[0],
    hearts: 5,
    lastHeartRefill: Date.now(),
    activePath: "tradicional",
    lastVisitedTimestamp: Date.now(),
    levelLastPracticed: {},
};

export function DidacticController() {
    const { data: session, status: authStatus } = useSession();
    const isSuperAdmin = (session?.user as any)?.role === "super_admin";

    const [progress, setProgress] = useState<UserDidacticProgress>(INITIAL_PROGRESS);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isCloudSynced, setIsCloudSynced] = useState(false);
    const [viewMode, setViewMode] = useState<"map" | "encyclopedia">("map");
    const [activeLesson, setActiveLesson] = useState<Level | null>(null);

    // Kuma Sensei Absence Greeting & Simulation States
    const [isGreetingOpen, setIsGreetingOpen] = useState(false);
    const [simulatedDays, setSimulatedDays] = useState<number | null>(null);

    // Load progress from DB (if authenticated) or localStorage (guest fallback)
    useEffect(() => {
        async function loadProgress() {
            let currentLocal: UserDidacticProgress = INITIAL_PROGRESS;
            try {
                // If old v1 progress exists, wipe it clean
                if (localStorage.getItem("kuma_didactic_progress_v1")) {
                    localStorage.removeItem("kuma_didactic_progress_v1");
                    localStorage.setItem("kuma_didactic_progress_v2", JSON.stringify(INITIAL_PROGRESS));
                }

                const saved = localStorage.getItem("kuma_didactic_progress_v2");
                if (saved) {
                    currentLocal = JSON.parse(saved);
                } else {
                    localStorage.setItem("kuma_didactic_progress_v2", JSON.stringify(INITIAL_PROGRESS));
                }
            } catch (e) {
                console.error("Local storage read error:", e);
            }

            let loadedProgress = currentLocal;

            if (session?.user) {
                try {
                    const res = await fetch("/api/didactica/progress");
                    if (res.ok) {
                        const data = await res.json();
                        if (data.authenticated && data.progress) {
                            const db = data.progress;
                            // If local was just wiped to 0, sync clean state
                            if (currentLocal.completedLevelIds.length === 0 && (db.completedLevelIds?.length || 0) > 0) {
                                await fetch("/api/didactica/progress", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(INITIAL_PROGRESS),
                                });
                                loadedProgress = INITIAL_PROGRESS;
                                setProgress(INITIAL_PROGRESS);
                                localStorage.setItem("kuma_didactic_progress_v2", JSON.stringify(INITIAL_PROGRESS));
                                setIsCloudSynced(true);
                                setIsLoaded(true);
                                triggerSessionGreeting(INITIAL_PROGRESS);
                                return;
                            }

                            // Merge local & DB
                            const mergedCompleted = Array.from(
                                new Set([...(db.completedLevelIds || []), ...(currentLocal.completedLevelIds || [])])
                            );

                            const mergedStars: Record<string, number> = {
                                ...(currentLocal.levelStars || {}),
                                ...(db.levelStars || {}),
                            };
                            Object.keys(currentLocal.levelStars || {}).forEach((lvlId) => {
                                mergedStars[lvlId] = Math.max(mergedStars[lvlId] || 0, currentLocal.levelStars[lvlId] || 0);
                            });

                            const mergedXp = Math.max(db.xp || 0, currentLocal.xp || 0);
                            const mergedStreak = Math.max(db.streak || 1, currentLocal.streak || 1);

                            const merged: UserDidacticProgress = {
                                completedLevelIds: mergedCompleted,
                                levelStars: mergedStars,
                                xp: mergedXp,
                                streak: mergedStreak,
                                lastActiveDate: db.lastActiveDate || new Date().toISOString().split("T")[0],
                                hearts: Math.max(db.hearts ?? 5, 1),
                                lastHeartRefill: db.lastHeartRefill || Date.now(),
                                activePath: db.activePath || currentLocal.activePath || "tradicional",
                                lastVisitedTimestamp: db.lastVisitedTimestamp || currentLocal.lastVisitedTimestamp || Date.now(),
                                levelLastPracticed: {
                                    ...(currentLocal.levelLastPracticed || {}),
                                    ...(db.levelLastPracticed || {}),
                                },
                            };

                            loadedProgress = merged;
                            setProgress(merged);
                            localStorage.setItem("kuma_didactic_progress_v2", JSON.stringify(merged));
                            setIsCloudSynced(true);
                            setIsLoaded(true);
                            triggerSessionGreeting(merged);
                            return;
                        }
                    }
                } catch (err) {
                    console.warn("Could not load progress from MongoDB, using local backup:", err);
                }
            }

            // Fallback for guest or offline
            setProgress(currentLocal);
            setIsLoaded(true);
            triggerSessionGreeting(currentLocal);
        }

        function triggerSessionGreeting(userProg: UserDidacticProgress) {
            try {
                const welcomed = sessionStorage.getItem("kuma_absence_welcomed_session");
                if (!welcomed) {
                    sessionStorage.setItem("kuma_absence_welcomed_session", "true");
                    setIsGreetingOpen(true);
                }
            } catch (e) {
                console.error("Session storage check error:", e);
            }
        }

        if (authStatus !== "loading") {
            loadProgress();
        }
    }, [session, authStatus]);

    // Dynamic Star Decay & Absence Calculations
    const { effectiveProgress, decayedCount, daysAbsent } = useMemo(() => {
        const now = Date.now();
        const lastVisited = progress.lastVisitedTimestamp || now;
        const realDiff = Math.max(0, now - lastVisited);
        const realDays = Math.floor(realDiff / (1000 * 60 * 60 * 24));
        const days = simulatedDays !== null ? simulatedDays : realDays;

        let decayed = 0;
        const effectiveStars: Record<string, number> = {};

        Object.entries(progress.levelStars || {}).forEach(([lvlId, originalStars]) => {
            let starLoss = 0;
            if (days >= 14) {
                starLoss = 2; // severe loss after 2 weeks
            } else if (days >= 7) {
                starLoss = 1; // -1 star loss after 1 week
            }

            const effective = Math.max(0, originalStars - starLoss);
            if (effective < originalStars) {
                decayed++;
            }
            effectiveStars[lvlId] = effective;
        });

        return {
            effectiveProgress: {
                ...progress,
                levelStars: effectiveStars,
            },
            decayedCount: decayed,
            daysAbsent: days,
        };
    }, [progress, simulatedDays]);

    // Mascot Mood derived from days absent
    const kumaMood: MascotMood = useMemo(() => {
        if (daysAbsent >= 14) return "crying";
        if (daysAbsent >= 4) return "sad";
        if (daysAbsent >= 2) return "thinking";
        return "idle";
    }, [daysAbsent]);

    // Reset progress completely (clean slate)
    const handleResetProgress = async () => {
        setProgress(INITIAL_PROGRESS);
        try {
            localStorage.removeItem("kuma_didactic_progress_v1");
            localStorage.setItem("kuma_didactic_progress_v2", JSON.stringify(INITIAL_PROGRESS));
            if (session?.user) {
                setIsSyncing(true);
                await fetch("/api/didactica/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(INITIAL_PROGRESS),
                });
                setIsSyncing(false);
            }
        } catch (e) {
            console.error("Error resetting progress:", e);
        }
    };

    // Save progress helper (updates local state + localStorage + MongoDB if authenticated)
    const saveProgress = (updated: UserDidacticProgress) => {
        setProgress(updated);
        try {
            localStorage.setItem("kuma_didactic_progress_v2", JSON.stringify(updated));
        } catch (e) {
            console.error("Could not save to localStorage:", e);
        }

        if (session?.user) {
            setIsSyncing(true);
            fetch("/api/didactica/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setIsCloudSynced(true);
                    }
                })
                .catch((err) => {
                    console.error("Error syncing progress to MongoDB:", err);
                })
                .finally(() => {
                    setIsSyncing(false);
                });
        }
    };

    // Path selection handler
    const handleSelectPath = (path: PathType) => {
        const updated: UserDidacticProgress = {
            ...progress,
            activePath: path,
        };
        saveProgress(updated);
    };

    // Level completion handler (restores stars, registers practice timestamp, resets absence)
    const handleLevelComplete = (levelId: string, stars: number, earnedXp: number) => {
        const newCompleted = progress.completedLevelIds.includes(levelId)
            ? progress.completedLevelIds
            : [...progress.completedLevelIds, levelId];

        const existingStars = progress.levelStars[levelId] || 0;
        const newStars = Math.max(existingStars, stars);
        const now = Date.now();

        const updated: UserDidacticProgress = {
            ...progress,
            completedLevelIds: newCompleted,
            levelStars: {
                ...progress.levelStars,
                [levelId]: newStars,
            },
            levelLastPracticed: {
                ...(progress.levelLastPracticed || {}),
                [levelId]: now,
            },
            lastVisitedTimestamp: now,
            xp: progress.xp + earnedXp,
            hearts: Math.min(5, progress.hearts + 1), // Award a heart on complete
        };

        saveProgress(updated);
    };

    const handleHeartLost = () => {
        const newHearts = Math.max(0, progress.hearts - 1);
        const updated = {
            ...progress,
            hearts: newHearts,
        };
        saveProgress(updated);
    };

    const handleCloseGreeting = () => {
        setIsGreetingOpen(false);
        if (simulatedDays === null && isLoaded) {
            // Update lastVisitedTimestamp to now
            const updated: UserDidacticProgress = {
                ...progress,
                lastVisitedTimestamp: Date.now(),
            };
            saveProgress(updated);
        }
    };

    if (!isLoaded) {
        return (
            <div className="w-full min-h-[400px] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-kuma-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            {/* VIEW MODE DUAL SELECTOR (TOP SWITCHER - ARCADE NEON) */}
            <div className="flex justify-center">
                <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-950/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
                    <button
                        onClick={() => setViewMode("map")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            viewMode === "map"
                                ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/30 scale-[1.02]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Compass className="w-4 h-4" weight="fill" />
                        <span>Kuma Sensei Academy</span>
                    </button>

                    <button
                        onClick={() => setViewMode("encyclopedia")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            viewMode === "encyclopedia"
                                ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/30 scale-[1.02]"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <BookOpen className="w-4 h-4" weight="fill" />
                        <span>Biblioteca & Enciclopedia</span>
                    </button>
                </div>
            </div>

            {/* SENSEI KUMA MOOD & ABSENCE QUICK BAR */}
            <div className="flex flex-wrap items-center justify-center gap-3 -mt-3">
                <button
                    onClick={() => setIsGreetingOpen(true)}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 cursor-pointer border ${
                        daysAbsent >= 14
                            ? "border-blue-500/60 bg-blue-950/70 text-blue-300 hover:bg-blue-900/80 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse"
                            : daysAbsent >= 7
                            ? "border-rose-500/60 bg-rose-950/70 text-rose-300 hover:bg-rose-900/80 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                            : daysAbsent >= 4
                            ? "border-amber-500/60 bg-amber-950/70 text-amber-300 hover:bg-amber-900/80"
                            : "border-cyan-400/50 bg-slate-900/90 text-cyan-300 hover:bg-slate-850 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    }`}
                    title="Consultar estado de ánimo de Kuma Sensei"
                >
                    <span className="text-sm">
                        {daysAbsent >= 14 ? "😭" : daysAbsent >= 4 ? "🥺" : daysAbsent >= 2 ? "🧐" : "🐻"}
                    </span>
                    <span>
                        {daysAbsent === 0
                            ? "Kuma Sensei: ¡En Forma!"
                            : `Kuma Sensei: ${daysAbsent}d de ausencia`}
                    </span>
                    {decayedCount > 0 && (
                        <span className="bg-rose-500/30 text-rose-300 px-2 py-0.5 rounded-full text-[10px] font-mono border border-rose-500/40">
                            {decayedCount} {decayedCount === 1 ? "nivel decaído" : "niveles decaídos"}
                        </span>
                    )}
                    {isSuperAdmin && (
                        <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono border border-amber-500/40 flex items-center gap-1">
                            <ShieldStar className="w-3 h-3 text-amber-400" weight="fill" />
                            {simulatedDays !== null ? `Sim: ${simulatedDays}d` : "Simulador 👑"}
                        </span>
                    )}
                </button>

                {/* Mobile & Desktop App Installer Button */}
                <InstallAppButton variant="pill" />

                {/* Direct super admin reset simulation pill */}
                {isSuperAdmin && simulatedDays !== null && (
                    <button
                        onClick={() => setSimulatedDays(null)}
                        className="text-[11px] font-bold text-slate-400 hover:text-white underline cursor-pointer"
                    >
                        Restablecer tiempo real
                    </button>
                )}
            </div>

            {/* STUDENT CLOUD SYNC STATUS BAR */}
            <div className="flex items-center justify-center -mt-3">
                {session?.user ? (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-400/50 text-emerald-300 text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        {isSyncing ? (
                            <CloudArrowUp className="w-4 h-4 text-amber-300 animate-bounce" weight="fill" />
                        ) : (
                            <CloudCheck className="w-4 h-4 text-emerald-400" weight="fill" />
                        )}
                        <span className="font-medium">
                            Estudiante: <strong className="text-white">{session.user.name || session.user.email}</strong>
                        </span>
                        <span className="text-[10px] text-emerald-300/80 uppercase font-black tracking-widest pl-1 border-l border-emerald-500/30">
                            {isSyncing ? "Guardando..." : "Nube Sincronizada ☁️"}
                        </span>
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 text-slate-300 text-xs">
                        <UserCircle className="w-4 h-4 text-cyan-400" weight="fill" />
                        <span>Modo Invitado (Progreso local) •</span>
                        <Link href="/login" className="text-cyan-400 hover:underline font-bold transition-colors">
                            Inicia sesión para guardar en tu cuenta de estudiante
                        </Link>
                    </div>
                )}
            </div>

            {/* ACTIVE CONTENT VIEW */}
            <AnimatePresence mode="wait">
                {viewMode === "map" ? (
                    <motion.div
                        key="map"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                    >
                        <DojoLingoMap
                            activePath={effectiveProgress.activePath || "tradicional"}
                            onSelectPath={handleSelectPath}
                            progress={effectiveProgress}
                            onStartLevel={(level) => setActiveLesson(level)}
                            onOpenEncyclopedia={() => setViewMode("encyclopedia")}
                            onResetProgress={handleResetProgress}
                            kumaMood={kumaMood}
                            daysAbsent={daysAbsent}
                            onOpenAbsenceModal={() => setIsGreetingOpen(true)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="encyclopedia"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                    >
                        <DidacticEncyclopedia onBackToMap={() => setViewMode("map")} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ACTIVE LESSON MODAL */}
            {activeLesson && (
                <LessonSessionModal
                    level={activeLesson}
                    isOpen={true}
                    onClose={() => {
                        setActiveLesson(null);
                        if (progress.hearts <= 0) {
                            saveProgress({ ...progress, hearts: 5 });
                        }
                    }}
                    onComplete={(levelId, stars, earnedXp) => {
                        handleLevelComplete(levelId, stars, earnedXp);
                    }}
                    initialHearts={progress.hearts}
                    onHeartLost={handleHeartLost}
                />
            )}

            {/* KUMA SENSEI ABSENCE GREETING MODAL */}
            <KumaAbsenceGreetingModal
                isOpen={isGreetingOpen}
                onClose={handleCloseGreeting}
                daysAbsent={daysAbsent}
                decayedLevelsCount={decayedCount}
                isSuperAdmin={isSuperAdmin}
                onStartPractice={() => {
                    setIsGreetingOpen(false);
                }}
                onSimulateDays={(days) => {
                    setSimulatedDays(days);
                }}
            />
        </div>
    );
}
