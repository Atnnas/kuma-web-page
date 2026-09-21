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
import { getDidacticCatalogStats } from "@/data/didacticaData";
import {
    Compass,
    BookOpen,
    CloudCheck,
    CloudArrowUp,
    UserCircle,
    ShieldStar,
    Sparkle,
    BellRinging,
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

    // Sistema de Detección y Aviso de Nuevas Preguntas / Módulos Actualizados
    const [catalogUpdate, setCatalogUpdate] = useState<{
        hasNewQuestions: boolean;
        newQuestionsCount: number;
        updatedUnitIds: string[];
        updatedLevelIds: string[];
    }>({
        hasNewQuestions: false,
        newQuestionsCount: 0,
        updatedUnitIds: [],
        updatedLevelIds: [],
    });

    useEffect(() => {
        if (!isLoaded) return;
        try {
            const currentStats = getDidacticCatalogStats();
            const storedRaw = localStorage.getItem("kuma_didactic_catalog_meta_v1");
            if (!storedRaw) {
                // Primera visita: guardar la foto actual del catálogo
                localStorage.setItem(
                    "kuma_didactic_catalog_meta_v1",
                    JSON.stringify({
                        totalQuestions: currentStats.totalQuestions,
                        unitCounts: currentStats.unitCounts,
                        levelCounts: currentStats.levelCounts,
                        timestamp: Date.now(),
                    })
                );
            } else {
                const stored = JSON.parse(storedRaw);
                const prevTotal = stored.totalQuestions || 0;
                if (currentStats.totalQuestions > prevTotal) {
                    const newCount = currentStats.totalQuestions - prevTotal;
                    const updatedUnitIds = Object.keys(currentStats.unitCounts).filter(
                        (uId) => currentStats.unitCounts[uId] > (stored.unitCounts?.[uId] || 0)
                    );
                    const updatedLevelIds = Object.keys(currentStats.levelCounts).filter(
                        (lvlId) => currentStats.levelCounts[lvlId] > (stored.levelCounts?.[lvlId] || 0)
                    );

                    // REGLA DEL DOJO: Si hay nuevas preguntas en un nivel, el progreso de estrellas baja
                    // para exigir re-evaluación y garantizar que el alumno forje la maestría del nuevo temario
                    let starsDecreased = false;
                    const adjustedStars = { ...(progress.levelStars || {}) };
                    updatedLevelIds.forEach((lvlId) => {
                        const currentStars = adjustedStars[lvlId] || 0;
                        if (currentStars > 0) {
                            adjustedStars[lvlId] = Math.max(0, currentStars - 1);
                            starsDecreased = true;
                        }
                    });

                    if (starsDecreased) {
                        const updatedProg: UserDidacticProgress = {
                            ...progress,
                            levelStars: adjustedStars,
                        };
                        saveProgress(updatedProg);
                    }

                    setCatalogUpdate({
                        hasNewQuestions: true,
                        newQuestionsCount: newCount,
                        updatedUnitIds,
                        updatedLevelIds,
                    });
                }
            }
        } catch (e) {
            console.error("Error checking didactic catalog stats:", e);
        }
    }, [isLoaded]);

    const handleDismissCatalogNotification = () => {
        try {
            const currentStats = getDidacticCatalogStats();
            localStorage.setItem(
                "kuma_didactic_catalog_meta_v1",
                JSON.stringify({
                    totalQuestions: currentStats.totalQuestions,
                    unitCounts: currentStats.unitCounts,
                    levelCounts: currentStats.levelCounts,
                    timestamp: Date.now(),
                })
            );
        } catch (e) {
            console.error("Error updating catalog meta in localStorage:", e);
        }
        setCatalogUpdate({
            hasNewQuestions: false,
            newQuestionsCount: 0,
            updatedUnitIds: [],
            updatedLevelIds: [],
        });
    };

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
        // Regla de gamificación: Se tendrá que pasar varias veces cada nivel para llenar las 3 estrellas obteniendo maestría
        const newStars = Math.min(3, existingStars + 1);
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
            {/* VIEW MODE DUAL SELECTOR (TOP SWITCHER - SOLID DUOLINGO CLASSIC) */}
            <div className="flex justify-center">
                <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#0F172A] border-2 border-[#334155] shadow-lg">
                    <button
                        onClick={() => setViewMode("map")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            viewMode === "map"
                                ? "bg-[#58CC02] border-b-4 border-[#46A302] text-white font-black shadow-md active:translate-y-0.5"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Compass className="w-4 h-4" weight="fill" />
                        <span>Kuma Sensei Academy</span>
                    </button>

                    <button
                        onClick={() => setViewMode("encyclopedia")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            viewMode === "encyclopedia"
                                ? "bg-[#58CC02] border-b-4 border-[#46A302] text-white font-black shadow-md active:translate-y-0.5"
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
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer border-2 ${
                        daysAbsent >= 14
                            ? "border-[#1CB0F6] bg-blue-950/80 text-blue-300 animate-pulse"
                            : daysAbsent >= 7
                            ? "border-[#FF4B4B] bg-[#2B1313] text-[#FF4B4B]"
                            : daysAbsent >= 4
                            ? "border-[#FFC800] bg-[#2B230E] text-[#FFC800]"
                            : "border-[#1CB0F6] bg-[#0E2A47] text-[#1CB0F6]"
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
                {session?.user && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-400/50 text-emerald-300 text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        {isSyncing ? (
                            <CloudArrowUp className="w-4 h-4 text-amber-300 animate-bounce" weight="fill" />
                        ) : (
                            <CloudCheck className="w-4 h-4 text-emerald-400" weight="fill" />
                        )}
                        <span className="font-medium">
                            Estudiante Oficial: <strong className="text-white">{session.user.name || session.user.email}</strong>
                        </span>
                        <span className="text-[10px] text-emerald-300/80 uppercase font-black tracking-widest pl-1 border-l border-emerald-500/30">
                            {isSyncing ? "Guardando..." : "Nube Sincronizada ☁️"}
                        </span>
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
                        {/* BANNER FLOTANTE: AVISO DE NUEVAS PREGUNTAS EN LOS MÓDULOS */}
                        <AnimatePresence>
                            {catalogUpdate.hasNewQuestions && (
                                <motion.div
                                    initial={{ opacity: 0, y: -16, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -16, scale: 0.98 }}
                                    className="w-full max-w-2xl mx-auto mb-6 p-4 rounded-3xl bg-gradient-to-r from-amber-950/95 via-zinc-950/98 to-amber-950/95 border-2 border-yellow-400/80 shadow-[0_0_30px_rgba(250,204,21,0.25)] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-30"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 border-2 border-yellow-400/60 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                                            <BellRinging className="w-6 h-6 text-yellow-400 animate-bounce" weight="duotone" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-400 text-black">
                                                    ¡Actualización del Dojo!
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-serif font-black text-white mt-1">
                                                Nuevos pergaminos y preguntas añadidas
                                            </h4>
                                            <p className="text-xs text-slate-300 mt-0.5">
                                                Se han incorporado <strong className="text-yellow-300">+{catalogUpdate.newQuestionsCount} nuevas preguntas</strong> a los módulos marciales. Debido al nuevo temario, <span className="text-amber-200 font-bold">el progreso de estrellas de los niveles actualizados ha disminuido</span> para que evalúes los nuevos conocimientos y reconquistes la maestría total (3/3).
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDismissCatalogNotification}
                                        className="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-yellow-400/50 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                    >
                                        <span>Entendido (Ossu)</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

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
                            updatedUnitIds={catalogUpdate.updatedUnitIds}
                            updatedLevelIds={catalogUpdate.updatedLevelIds}
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
                    currentStars={progress.levelStars[activeLesson.id] || 0}
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
