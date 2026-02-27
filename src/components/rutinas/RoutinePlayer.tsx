"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import {
    PlayCircle,
    Check,
    SkipForward,
    X,
    Barbell,
    Timer,
    ArrowCounterClockwise,
    Heartbeat,
    Trophy,
    WarningCircle
} from "@phosphor-icons/react/dist/ssr";
import confetti from "canvas-confetti";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { audioTrainer } from "@/lib/audio-trainer";
import { getExerciseGif } from "@/lib/exercise-assets";
import { AchievementOverlay } from "../gamification/AchievementOverlay";
import {
    getUnfinishedRoutineLog,
    updateRoutineProgress,
    startRoutineLog,
    completeRoutineLog
} from "@/lib/actions/routine-logs";

// --- INTERFACES ---
interface IBlock {
    type?: "exercise" | "loop_start" | "loop_end";
    exercise_name: string;
    sets: number;
    reps: number;
    rest_seconds: number;
    measure_type?: "reps" | "time";
    notes?: string;
    media_url?: string;
    loop_count?: number;
}

interface IRoutineData {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    estimated_duration: number;
    equipment_types: string[];
    blocks: IBlock[];
}

// --- UTILS ---
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getTotalSetsRecursive = (blocks: IBlock[]): number => {
    let total = 0;
    let i = 0;
    while (i < blocks.length) {
        const block = blocks[i];
        if (block.type === "loop_start") {
            let depth = 1;
            let j = i + 1;
            while (j < blocks.length && depth > 0) {
                if (blocks[j].type === "loop_start") depth++;
                if (blocks[j].type === "loop_end") depth--;
                j++;
            }
            const loopBlocks = blocks.slice(i + 1, j - 1);
            const loopCount = block.loop_count || 1;
            total += loopCount * getTotalSetsRecursive(loopBlocks);
            i = j;
        } else if (block.type === "loop_end") {
            i++;
        } else {
            total += block.sets;
            i++;
        }
    }
    return total;
};

export function RoutinePlayer({ routine }: { routine: IRoutineData }) {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"intro" | "active" | "completed">("intro");
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [impact, setImpact] = useState(false); // FOR SHAKE EFFECT

    const [startTime, setStartTime] = useState<number | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [exerciseTimeLeft, setExerciseTimeLeft] = useState(0);

    // Accurate Progress State
    const [totalSets, setTotalSets] = useState(0);
    const [completedSets, setCompletedSets] = useState(0);

    // Loop State
    const [loopRepetitions, setLoopRepetitions] = useState<{ [blockIndex: number]: number }>({});
    const [cheatDetected, setCheatDetected] = useState(false);
    const [fastSetCount, setFastSetCount] = useState(0);
    const setStartTimeRef = useRef<number | null>(null);

    // Gamification State
    const [showTrophy, setShowTrophy] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [currentLogId, setCurrentLogId] = useState<string | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const activeBlock = routine.blocks[currentBlockIndex];
    const totalBlocks = routine.blocks.length;

    // --- TIMER LOGIC ---
    useEffect(() => {
        if (isResting) {
            if (timeLeft > 0) {
                if (timeLeft <= 3) audioTrainer.playCountdown();
                timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
            } else if (timeLeft === 0) {
                audioTrainer.playStart();
                finishRest();
            }
        }
        return () => clearTimeout(timerRef.current!);
    }, [isResting, timeLeft]);

    // --- EXERCISE TIMER LOGIC ---
    useEffect(() => {
        // Reset timer when block or set changes
        if (activeBlock && activeBlock.measure_type === "time") {
            setExerciseTimeLeft(activeBlock.reps);
            setIsTimerRunning(false);
        }

        // Auto-skip loop markers
        if (activeBlock && (activeBlock.type === "loop_start" || activeBlock.type === "loop_end")) {
            nextStep();
        }
    }, [currentBlockIndex, currentSet]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning && exerciseTimeLeft > 0 && !isResting && status === "active") {
            interval = setInterval(() => {
                setExerciseTimeLeft((prev) => {
                    const next = prev - 1;
                    if (next <= 5 && next > 0) {
                        audioTrainer.playCountdown();
                    }
                    if (next === 0) {
                        audioTrainer.playStart();
                        setIsTimerRunning(false);
                    }
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, exerciseTimeLeft, isResting, status]);
    useEffect(() => {
        if (status === "active" && currentBlockIndex === 0 && currentSet === 1 && !isResting) {
            audioTrainer.speak(`Iniciando ${routine.title}. Vamos con ${routine.blocks[0].exercise_name}`);
        }
    }, [status]);

    // Auto-resume when coming from the recovery banner (?resume=true)
    useEffect(() => {
        if (searchParams.get("resume") !== "true") return;
        const autoResume = async () => {
            try {
                const res = await getUnfinishedRoutineLog(routine._id);
                if (!res.success || !res.log?.lastState) return;
                const { lastState } = res.log;

                isAutoResuming.current = true; // prevent reactive save from firing on restore

                // RESTORE EXACT STATE
                setCurrentBlockIndex(lastState.currentBlockIndex || 0);
                setCurrentSet(lastState.currentSet || 1);
                setCompletedSets(lastState.completedSets || 0);
                setLoopRepetitions(lastState.loopRepetitions || {});

                // Restore timer for timed exercises
                if (lastState.exerciseTimeLeft !== undefined) {
                    setExerciseTimeLeft(lastState.exerciseTimeLeft);
                }

                const elapsedSeconds = lastState.elapsedSeconds || 0;
                setStartTime(Date.now() - elapsedSeconds * 1000);
                setStartTimeRef.current = Date.now();
                setCurrentLogId(res.log._id);

                const total = getTotalSetsRecursive(routine.blocks);
                setTotalSets(total);

                // IMPORTANT: GO DIRECTLY TO ACTIVE
                setStatus("active");

                // (Silent resume - removed voice speak here)
            } catch (err) {
                console.error("Auto-resume failed:", err);
            }
        };
        autoResume();
    }, []);

    // Periodic Progress Sync (Every 5 seconds)
    useEffect(() => {
        if (status !== "active" || !currentLogId) return;

        const interval = setInterval(() => {
            const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
            updateRoutineProgress(currentLogId, {
                currentBlockIndex,
                currentSet,
                completedSets,
                loopRepetitions,
                elapsedSeconds: elapsed,
                exerciseTimeLeft // Save exact seconds left in current exercise
            }).catch(console.error);
        }, 5000);

        return () => clearInterval(interval);
    }, [status, currentLogId, currentBlockIndex, currentSet, completedSets, exerciseTimeLeft]);

    // Reactive progress save — fires AFTER React applies state changes from nextStep()
    // This ensures we always save where the user needs to GO NEXT, not where they just were
    const isAutoResuming = useRef(false);
    useEffect(() => {
        // Skip first save when auto-resuming (that would overwrite the restored state)
        if (status !== "active" || !currentLogId) return;
        if (isAutoResuming.current) {
            isAutoResuming.current = false;
            return;
        }
        const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
        updateRoutineProgress(currentLogId, {
            currentBlockIndex,
            currentSet,
            completedSets,
            loopRepetitions,
            elapsedSeconds: elapsed,
            exerciseTimeLeft: activeBlock?.measure_type === "time" ? activeBlock.reps : undefined
        }).catch(console.error);
    }, [currentBlockIndex, currentSet, completedSets]);

    // Exit Guard (beforeunload)
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (status === "active") {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [status]);

    // --- ACTIONS ---

    // --- ACTIONS ---
    const startRoutine = async () => {
        setStatus("active");
        setCurrentBlockIndex(0);
        setCurrentSet(1);
        setIsResting(false);
        setStartTime(Date.now());
        setStartTimeRef.current = Date.now();
        setFastSetCount(0);
        setCheatDetected(false);
        setLoopRepetitions({});

        // Calculate total sets including all loop cycles
        const total = getTotalSetsRecursive(routine.blocks);
        setTotalSets(total);
        setCompletedSets(0);

        // START LOGGING
        try {
            const res = await startRoutineLog(routine._id, routine.title, routine.estimated_duration);
            if (res.success && res.logId) {
                setCurrentLogId(res.logId);
            }
        } catch (error) {
            console.error("Failed to start routine log", error);
        }
    };

    const triggerImpact = () => {
        setImpact(true);
        setTimeout(() => setImpact(false), 300); // 300ms shake
    };

    const [hasShownOneHourReward, setHasShownOneHourReward] = useState(false);

    const finishSet = async () => {
        setIsTimerRunning(false); // Stop exercise timer if running
        audioTrainer.playBeep();
        triggerImpact(); // TRIGGER VISUAL IMPACT

        // Fast Interaction Detection (Cheating protection)
        if (setStartTimeRef.current) {
            const setDuration = Date.now() - setStartTimeRef.current;
            if (setDuration < 4000) { // Less than 4 seconds is usually a skip
                setFastSetCount(prev => prev + 1);
            }
        }
        setStartTimeRef.current = Date.now();

        // Sync Progress to DB — handled reactively by the useEffect on [currentBlockIndex, currentSet, completedSets]
        // This ensures we always capture state AFTER nextStep() advances the position

        // Real-time Reward Check (> 1 hour in session)
        if (!hasShownOneHourReward && startTime) {
            const elapsedMs = Date.now() - startTime;
            if (elapsedMs >= 3600000) { // 60 minutes
                setHasShownOneHourReward(true);
                setAchievementQueue(prev => [...prev, {
                    name: "Espíritu Kuma",
                    description: "Has entrenado más de 1 hora en esta sesión. ¡Tu resistencia es legendaria!",
                    icon: "PawPrint",
                    color: "#dc2626",
                    rarity: "Mítico"
                }]);
            }
        }

        if (activeBlock.rest_seconds > 0 && currentSet < activeBlock.sets) {
            audioTrainer.speak("Descansa.");
            startRest();
        } else if (activeBlock.rest_seconds > 0 && currentSet === activeBlock.sets && currentBlockIndex < totalBlocks - 1) {
            const nextBlock = routine.blocks[currentBlockIndex + 1];
            if (nextBlock.type === "loop_end") {
                const loopCtx = getLoopContext();
                if (loopCtx && loopCtx.currentCycle < loopCtx.maxCycles) {
                    audioTrainer.speak(`Descansa. Prepárate para el ciclo ${loopCtx.currentCycle + 1}.`);
                } else {
                    audioTrainer.speak("Descansa. Siguiente ejercicio pronto.");
                }
            } else {
                audioTrainer.speak("Descansa. Siguiente ejercicio pronto.");
            }
            startRest();
        } else {
            nextStep();
        }
    };

    const startRest = () => {
        setTimeLeft(activeBlock.rest_seconds);
        setIsResting(true);
    };

    const finishRest = () => {
        setIsResting(false);
        nextStep();
    };

    const nextStep = () => {
        if (!activeBlock) return;

        // Reset set timer
        setStartTimeRef.current = Date.now();

        if (currentSet < activeBlock.sets) {
            setCurrentSet((prev) => prev + 1);
            setCompletedSets((prev) => prev + 1);
            audioTrainer.speak(`Set ${currentSet + 1}. Vamos.`);
        } else {
            // FINISHED ALL SETS OF CURRENT BLOCK
            setCompletedSets((prev) => prev + 1);
            const nextIdx = currentBlockIndex + 1;

            if (nextIdx < totalBlocks) {
                const nextBlock = routine.blocks[nextIdx];

                if (nextBlock.type === "loop_end") {
                    // Logic for loop_end: find corresponding loop_start
                    let depth = 1;
                    let startIdx = -1;
                    for (let i = nextIdx - 1; i >= 0; i--) {
                        if (routine.blocks[i].type === "loop_end") depth++;
                        if (routine.blocks[i].type === "loop_start") depth--;
                        if (depth === 0) {
                            startIdx = i;
                            break;
                        }
                    }

                    if (startIdx !== -1) {
                        const maxReps = routine.blocks[startIdx].loop_count || 1;
                        const currentReps = loopRepetitions[startIdx] || 1;

                        if (currentReps < maxReps) {
                            // Repeat loop
                            setLoopRepetitions(prev => ({ ...prev, [startIdx]: currentReps + 1 }));
                            setCurrentBlockIndex(startIdx + 1); // Jump to first exercise in loop
                            setCurrentSet(1);

                            const cycleMsg = `Iniciando ciclo ${currentReps + 1} de ${maxReps}.`;
                            audioTrainer.speak(cycleMsg);
                            return;
                        } else {
                            // Loop finished, continue to whatever is after loop_end
                            // But first we must move currentBlockIndex to nextIdx (the loop_end)
                            // then call nextStep recursively or just proceed
                            setCurrentBlockIndex(nextIdx);
                            setCurrentSet(1);
                            // To skip the loop_end marker immediately:
                            // The useEffect on currentBlockIndex will handle skipping loop_end
                            return;
                        }
                    }
                }

                setCurrentBlockIndex(nextIdx);
                setCurrentSet(1);
                if (nextBlock.type === "exercise" || !nextBlock.type) {
                    audioTrainer.speak(`Siguiente ejercicio: ${nextBlock.exercise_name}.`);
                }
            } else {
                completeRoutine();
            }
        }
    };



    // ...

    const [achievementQueue, setAchievementQueue] = useState<any[]>([]);
    const [currentAchievement, setCurrentAchievement] = useState<any | null>(null);

    // Watch queue to show achievements one by one
    useEffect(() => {
        if (achievementQueue.length > 0 && !showTrophy) {
            setCurrentAchievement(achievementQueue[0]);
            setShowTrophy(true);
            audioTrainer.playWin();
        }
    }, [achievementQueue, showTrophy]);

    const completeRoutine = async () => {
        setIsFinishing(true);
        try {
            const endTime = Date.now();
            const durationMs = startTime ? (endTime - startTime) : 0;
            const durationMinutes = Math.max(1, Math.floor(durationMs / 60000));
            const durationSeconds = Math.round(durationMs / 1000);

            // 1. Anti-cheat validation (Granular & Global)
            // Stricter condition: Less than 30% of estimated duration OR too many fast sets (cheated sets)
            const isCheated = (durationMinutes < routine.estimated_duration * 0.3) || (fastSetCount > (totalSets * 0.5));

            if (isCheated) {
                console.log(`[CheatDetection] Routine: ${routine.title}, Duration: ${durationMinutes}m, FastSets: ${fastSetCount}/${totalSets}`);
                // If cheated, we don't complete the log, we DELETE it (removes trace)
                if (currentLogId) {
                    const { deleteRoutineLog } = await import("@/lib/actions/routine-logs");
                    await deleteRoutineLog(currentLogId);
                }

                setCheatDetected(true);
                audioTrainer.speak("Oso oso mentiroso. Detectamos que saltaste la rutina.");
                return;
            }

            // 2. COMPLETE LOG IF VALID
            if (currentLogId) {
                const { completeRoutineLog } = await import("@/lib/actions/routine-logs");
                await completeRoutineLog(currentLogId, durationSeconds);
            }

            // 3. Call Progress API (XP/Achievements)
            const res = await fetch("/api/workouts/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    routineId: routine._id,
                    duration: durationMinutes
                })
            });

            const data = await res.json();

            if (data.newAchievements && data.newAchievements.length > 0) {
                const achievements = data.newAchievements
                    .map((item: any) => item.trophy)
                    .filter((t: any) => !(t.name === "Espíritu Kuma" && hasShownOneHourReward));

                if (achievements.length > 0) {
                    setAchievementQueue(prev => [...prev, ...achievements]);
                } else {
                    setStatus("completed");
                }
            } else {
                setStatus("completed");
                audioTrainer.playWin();
                audioTrainer.speak("¡Rutina completada! Excelente trabajo.");
                triggerConfetti();
            }
        } catch (error) {
            console.error("Error saving progress:", error);
            setStatus("completed");
            triggerConfetti();
        }
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    // --- RENDERERS ---

    // 1. INTRO
    if (status === "intro") {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black z-0" />
                <div className="absolute top-0 left-0 w-full h-1/2 bg-kuma-gold/5 blur-[120px] rounded-full z-0 pointer-events-none" />



                <div className="relative z-10 flex-1 flex flex-col p-6 items-center justify-center max-w-md mx-auto w-full lg:max-w-4xl lg:flex-row lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full flex justify-between items-center mb-12 lg:absolute lg:top-8 lg:left-8 lg:w-auto lg:mb-0"
                    >
                        <Link href="/routines">
                            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md">
                                <X className="w-5 h-5" weight="bold" />
                            </button>
                        </Link>
                    </motion.div>

                    <div className="text-center space-y-8 w-full lg:text-left lg:flex-1">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: [0, -15, 0] // Intro float
                            }}
                            transition={{
                                type: "spring", bounce: 0.5,
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="w-32 h-32 mx-auto lg:mx-0 bg-gradient-to-tr from-kuma-gold to-yellow-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(234,179,8,0.3)] mb-8"
                        >
                            <Barbell className="w-14 h-14 text-black" weight="duotone" />
                        </motion.div>

                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl lg:text-6xl font-black text-white mb-3 tracking-tight"
                            >
                                {routine.title}
                            </motion.h1>
                            <p className="text-zinc-400 font-medium leading-relaxed lg:text-lg lg:max-w-xl">
                                {routine.description}
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:w-fit"
                        >
                            <div className="text-left">
                                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Duración</span>
                                <div className="text-xl text-white font-bold">{routine.estimated_duration} min</div>
                            </div>
                            <div className="text-left">
                                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Ejercicios</span>
                                <div className="text-xl text-white font-bold">{routine.blocks.length}</div>
                            </div>
                            <div className="text-left col-span-2 lg:col-span-1">
                                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Nivel</span>
                                <div className="text-xl text-kuma-gold font-bold">{routine.difficulty}</div>
                            </div>
                        </motion.div>

                        <div className="hidden lg:block pt-8">
                            <button
                                onClick={startRoutine}
                                className="group relative w-64 h-16 bg-white text-black rounded-[2rem] font-black text-lg tracking-wider uppercase overflow-hidden transition-transform active:scale-95 shadow-xl shadow-white/5"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <PlayCircle className="w-6 h-6 fill-black" weight="duotone" /> Iniciar Sesión
                                </span>
                                <div className="absolute inset-0 bg-kuma-gold opacity-0 group-hover:opacity-10 transition-opacity" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 lg:hidden" />

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="w-full pt-8 pb-4 lg:hidden"
                    >
                        <button
                            onClick={startRoutine}
                            className="group relative w-full h-16 bg-white text-black rounded-[2rem] font-black text-lg tracking-wider uppercase overflow-hidden transition-transform active:scale-95 shadow-xl shadow-white/5"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <PlayCircle className="w-6 h-6 fill-black" weight="duotone" /> Iniciar Sesión
                            </span>
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // 2. COMPLETED
    if (status === "completed") {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black" />
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 text-center w-full max-w-md"
                >
                    <div className="w-32 h-32 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(34,197,94,0.3)]">
                        <Trophy className="w-16 h-16 text-black fill-black" weight="duotone" />
                    </div>
                    <h2 className="text-5xl font-black text-white italic tracking-tighter mb-4">¡VICTORIA!</h2>
                    <p className="text-zinc-400 text-lg mb-2">Rutina completada con éxito.</p>
                    {startTime && (
                        <div className="text-kuma-gold font-mono font-bold text-xl mb-12">
                            Tiempo Total: {Math.max(1, Math.round((Date.now() - startTime) / 60000))} min
                        </div>
                    )}
                    <Link href="/routines" className="block w-full">
                        <button className="w-full h-16 bg-zinc-800 text-white rounded-[2rem] font-bold text-lg tracking-wider hover:bg-zinc-700 transition-colors">Volver al Dojo</button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    // 3. CHEAT DETECTED
    if (cheatDetected) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black opacity-80" />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 text-center w-full max-w-lg bg-zinc-950 border border-red-500/20 p-8 rounded-[2rem] shadow-2xl"
                >
                    <div className="w-full aspect-square max-w-[320px] mx-auto mb-8 relative">
                        <img
                            src="/images/kuma-logro-primer-trampa.jpg"
                            alt="Logro Trampa"
                            className="w-full h-full object-cover rounded-2xl border-4 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)]"
                        />
                        <div className="absolute -top-6 -right-6 bg-red-600 text-white p-4 rounded-full shadow-lg border-4 border-zinc-950">
                            <WarningCircle size={40} weight="fill" />
                        </div>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-red-500 uppercase tracking-tighter mb-4 italic leading-none drop-shadow-lg">¡TE CACHAMOS!</h2>
                    <p className="text-zinc-200 text-xl md:text-2xl font-bold mb-8 leading-tight">
                        "Tu saltaste esta rutina, tienes la oportunidad de entrenar realmente durante el día. Si a las 12 media noche no has hecho entreno, perderás la racha. Oso oso mentiroso"
                    </p>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={startRoutine}
                            className="w-full h-16 bg-white text-black rounded-[2rem] font-bold text-lg tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowCounterClockwise className="w-6 h-6" weight="bold" />
                            Reintentar Honestamente
                        </button>
                        <Link href="/routines" className="block w-full">
                            <button className="w-full h-14 bg-zinc-900 text-zinc-500 rounded-[2rem] font-bold text-sm tracking-widest hover:text-white transition-colors">
                                Volver al Menú
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // 4. ACTIVE ROUTINE
    const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

    // Helper to find if a block is inside a loop
    const getLoopContext = () => {
        let depth = 0;
        let startIdx = -1;
        for (let i = currentBlockIndex; i >= 0; i--) {
            if (routine.blocks[i].type === "loop_end" && i !== currentBlockIndex) depth++;
            if (routine.blocks[i].type === "loop_start") {
                if (depth === 0) {
                    startIdx = i;
                    break;
                }
                depth--;
            }
        }
        if (startIdx !== -1) {
            return {
                startIdx,
                currentCycle: loopRepetitions[startIdx] || 1,
                maxCycles: routine.blocks[startIdx].loop_count || 1,
                loopName: routine.blocks[startIdx].exercise_name
            };
        }
        return null;
    };

    const loopContext = getLoopContext();

    return (
        <div className={cn(
            "min-h-screen flex flex-col relative transition-colors duration-700 ease-in-out font-sans overflow-hidden",
            isResting ? "bg-[#0b1215]" : "bg-black"
        )}>
            {/* Background Ambience */}
            <div className={cn("absolute inset-0 transition-opacity duration-1000", isResting ? "opacity-100" : "opacity-0")}>
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent" />
            </div>

            {/* --- OVERLAYS --- */}
            <AchievementOverlay
                show={showTrophy}
                trophy={currentAchievement}
                onClose={() => {
                    setShowTrophy(false);
                    // Remove current from queue
                    setAchievementQueue(prev => prev.slice(1));

                    // If no more achievements AND we were finishing, go to completed screen
                    if (achievementQueue.length <= 1 && isFinishing) {
                        setStatus("completed");
                        triggerConfetti();
                    }
                }}
            />

            {/* --- HEADER --- */}
            <div className="relative z-20 px-6 pt-6 pb-2 flex items-center justify-between lg:px-12 lg:pt-8 w-full max-w-[1600px] mx-auto">
                <Link href="/rutinas">
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" weight="bold" />
                    </button>
                </Link>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500">
                        {isResting ? "RECUPERACIÓN" : "ENFOQUE"}
                    </span>
                </div>
                <div className="w-10 h-10 lg:hidden" />
                <div className="hidden lg:flex items-center gap-2 text-zinc-500 text-xs font-mono">
                    <Timer className="w-4 h-4" weight="duotone" />
                    <span>{formatTime(activeBlock.rest_seconds)} REST</span>
                </div>
            </div>

            {/* --- HYPER PROGRESS BAR --- */}
            <div className="px-6 mt-4 mb-2 lg:px-12 w-full max-w-[1600px] mx-auto z-30 relative">
                <div className="relative h-4 w-full bg-zinc-900/80 rounded-full border border-white/5 overflow-hidden backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)_inset]">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                    <motion.div
                        className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-600 via-cyan-400 to-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, progress)}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    >
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                        />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-12 bg-white blur-md" />
                    </motion.div>
                    <div className="absolute inset-0 flex justify-between px-1">
                        {routine.blocks.map((block, idx) => {
                            const isInsideLoop = () => {
                                let d = 0;
                                for (let i = idx; i >= 0; i--) {
                                    if (routine.blocks[i].type === "loop_end" && i !== idx) d++;
                                    if (routine.blocks[i].type === "loop_start") {
                                        if (d === 0) return true;
                                        d--;
                                    }
                                }
                                return false;
                            };
                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        "h-full w-[2px] transform skew-x-[-10deg] transition-colors",
                                        idx < currentBlockIndex ? "bg-cyan-900/30" : "bg-black/40",
                                        isInsideLoop() && "bg-cyan-400/20 w-[4px]"
                                    )}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-cyan-500 tracking-[0.2em] animate-pulse">
                            {Math.round(progress)}% COMPLETADO
                        </span>
                        {loopContext && (
                            <span className="text-[9px] font-black text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                                <ArrowCounterClockwise size={12} weight="bold" className="text-cyan-400 animate-spin-slow" />
                                {loopContext.loopName}: Ciclo {loopContext.currentCycle} de {loopContext.maxCycles}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-600 tracking-[0.2em]">
                        {completedSets} / {totalSets} SETS TOTALES
                    </span>
                </div>
            </div>

            {/* --- MAIN CONTENT (SPLIT VIEW) --- */}
            <div className="flex-1 lg:grid lg:grid-cols-12 lg:gap-8 lg:p-12 relative z-10 w-full lg:max-w-[1600px] lg:mx-auto">

                {/* ZONA A: THE STAGE (Desktop Left / Mobile Main) */}
                <div className="flex-1 flex flex-col p-6 lg:p-0 lg:col-span-8 lg:h-full justify-center">
                    <AnimatePresence mode="wait">
                        {!isResting ? (
                            <motion.div
                                key="active-stage"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="flex-1 flex flex-col relative perspective-[2000px]" // ADDED PERSPECTIVE
                            >
                                {/* 3D WRAPPER FOR FLOATING EFFECT */}
                                <motion.div
                                    animate={impact ? {
                                        x: [-5, 5, -5, 5, -3, 3, 0],
                                        y: [0, -5, 5, -5, 0],
                                        rotateZ: [0, -2, 2, -1, 0]
                                    } : {
                                        y: [0, -20, 0],
                                        rotateX: [0, 2, 0], // Subtle tilt
                                        rotateY: [0, -1, 0]
                                    }}
                                    transition={impact ? { duration: 0.4, ease: "easeInOut" } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="flex-1 bg-zinc-900 rounded-[3rem] border border-white/10 p-8 flex flex-col items-center justify-between relative overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] lg:h-[70vh] lg:min-h-[600px] transform-style-3d group"
                                >
                                    {/* IMPACT FLASH */}
                                    <div className={cn(
                                        "absolute inset-0 bg-red-500 mix-blend-overlay z-50 pointer-events-none transition-opacity duration-100",
                                        impact ? "opacity-40" : "opacity-0"
                                    )} />

                                    {/* DEEP 3D SHADOW (Pseudo-element simulation) */}
                                    <div className="absolute -bottom-20 left-10 right-10 h-10 bg-black/80 blur-2xl rounded-[100%] transition-all duration-[6s] ease-in-out"
                                        style={{ transform: impact ? "scale(0.8)" : "scale(1)" }} />

                                    {/* --- DYNAMIC GIF BACKGROUND --- */}
                                    {/* --- DYNAMIC GIF BACKGROUND --- */}
                                    {/* Removed as per user request */}

                                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-kuma-gold/10 to-transparent opacity-50 pointer-events-none" />
                                    <div className="hidden lg:block absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] z-0 pointer-events-none" />

                                    <div className="flex flex-col items-center text-center space-y-2 relative z-10 w-full lg:items-start lg:text-left">
                                        <div className="bg-black/30 backdrop-blur px-4 py-1.5 rounded-full border border-white/5 mb-4 inline-flex shadow-lg flex-col gap-1">
                                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                                Ejercicio {currentBlockIndex + 1} de {totalBlocks}
                                            </span>
                                            {loopContext && (
                                                <div className="flex items-center gap-2 text-cyan-400">
                                                    <ArrowCounterClockwise size={12} weight="bold" className="animate-spin-slow" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        Ciclo {loopContext.currentCycle} de {loopContext.maxCycles}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-white leading-tight max-w-4xl drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                                            {activeBlock.exercise_name}
                                        </h2>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center py-8 lg:w-full">
                                        <div
                                            className={cn(
                                                "relative group transition-all duration-300",
                                                activeBlock.measure_type === "time" ? "cursor-pointer active:scale-95" : "cursor-default"
                                            )}
                                            onClick={() => {
                                                if (activeBlock.measure_type === "time") {
                                                    setIsTimerRunning(!isTimerRunning);
                                                }
                                            }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: exerciseTimeLeft <= 5 && isTimerRunning ? [1, 1.3, 1] : [1, 1.15, 1],
                                                    opacity: exerciseTimeLeft <= 5 && isTimerRunning ? [0.2, 0.5, 0.2] : [0.1, 0.3, 0.1]
                                                }}
                                                transition={{ duration: exerciseTimeLeft <= 5 && isTimerRunning ? 0.5 : 3, repeat: Infinity, ease: "easeInOut" }}
                                                className={cn(
                                                    "absolute inset-0 rounded-full blur-2xl lg:blur-3xl",
                                                    exerciseTimeLeft <= 5 && isTimerRunning ? "bg-red-600" : "bg-kuma-gold"
                                                )}
                                            />
                                            <div className="text-center relative z-10 lg:scale-150 transition-all duration-700">
                                                <div className="relative">
                                                    <span className={cn(
                                                        "text-[6rem] lg:text-[10rem] font-bold leading-none tracking-tighter tabular-nums drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-colors duration-300",
                                                        exerciseTimeLeft <= 5 && isTimerRunning ? "text-red-500 animate-pulse" : "text-white"
                                                    )}>
                                                        {activeBlock.measure_type === "time" ? formatTime(exerciseTimeLeft) : activeBlock.reps}
                                                    </span>
                                                </div>
                                                <span className="block text-2xl font-medium text-zinc-500 uppercase tracking-widest mt-2 lg:mt-6">
                                                    {activeBlock.measure_type === "time" ? "Tiempo" : "Reps"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full flex justify-between items-center px-4 lg:px-6">
                                        <div className="flex items-center gap-4">
                                            <span className="text-zinc-400 font-bold lg:text-3xl shrink-0 uppercase tracking-tighter italic">Set {currentSet} / {activeBlock.sets}</span>

                                            {activeBlock.measure_type === "time" && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsTimerRunning(!isTimerRunning);
                                                    }}
                                                    className={cn(
                                                        "group relative px-6 py-3 rounded-2xl font-black uppercase tracking-tighter transition-all duration-75 text-sm lg:text-xl",
                                                        "bg-red-600 text-white shadow-[0_6px_0_0_#991b1b] active:shadow-none active:translate-y-[6px]",
                                                        isTimerRunning ? "bg-zinc-800 text-zinc-400 shadow-[0_6px_0_0_#18181b] border border-white/5" : "animate-bounce shadow-[0_6px_0_0_#991b1b]"
                                                    )}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        {isTimerRunning ? <Timer className="w-6 h-6 lg:w-8 lg:h-8" weight="fill" /> : <PlayCircle className="w-6 h-6 lg:w-8 lg:h-8" weight="fill" />}
                                                        {isTimerRunning ? "Pausar" : "Iniciar"}
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                        {activeBlock.notes && <span className="text-kuma-gold font-bold lg:bg-kuma-gold/10 lg:px-4 lg:py-2 lg:rounded-xl cursor-help text-sm">ℹ️ Ver Notas</span>}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="rest-stage"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-center relative lg:h-full lg:justify-center"
                            >
                                <div className="relative w-72 h-72 lg:w-[30rem] lg:h-[30rem] flex items-center justify-center mb-12 lg:mb-0">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                                        <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                                        <motion.circle
                                            cx="50%" cy="50%" r="45%" stroke="#14b8a6" strokeWidth="8" fill="none" strokeLinecap="round"
                                            initial={{ pathLength: 1 }}
                                            animate={{ pathLength: 0 }}
                                            transition={{ duration: activeBlock.rest_seconds, ease: "linear" }}
                                        />
                                    </svg>
                                    <div className="flex flex-col items-center">
                                        <motion.span
                                            className="text-8xl lg:text-[10rem] font-black text-white tabular-nums tracking-tighter drop-shadow-2xl"
                                            key={timeLeft}
                                            initial={{ scale: 1.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            {timeLeft}
                                        </motion.span>
                                        <span className="text-sm font-bold text-teal-400 uppercase tracking-[0.3em] mt-2 lg:text-lg animate-pulse">
                                            {loopContext && currentSet === activeBlock.sets ? `Preparando Ciclo ${loopContext.currentCycle + 1}` : "Respira"}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ZONA B: CONTROL DECK */}
                <div className="lg:col-span-4 lg:flex lg:flex-col lg:justify-center lg:gap-8 p-6 lg:p-0">
                    <AnimatePresence mode="wait">
                        {!isResting ? (
                            <motion.div
                                key="controls-active"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6 lg:space-y-8"
                            >
                                <div className="hidden lg:block bg-zinc-900/50 backdrop-blur rounded-[2rem] p-8 border border-white/5 shadow-2xl">
                                    {currentSet < activeBlock.sets ? (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <ArrowCounterClockwise className="w-6 h-6 text-zinc-400" weight="bold" />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-xl">Mismo Ejercicio</div>
                                                <div className="text-zinc-500">Set {currentSet + 1} de {activeBlock.sets}</div>
                                            </div>
                                        </div>
                                    ) : currentBlockIndex < totalBlocks - 1 ? (
                                        (() => {
                                            const nextBlock = routine.blocks[currentBlockIndex + 1];
                                            if (nextBlock.type === "loop_end") {
                                                // Find loop_start and check repetitions
                                                let depth = 1;
                                                let startIdx = -1;
                                                for (let i = currentBlockIndex; i >= 0; i--) {
                                                    if (routine.blocks[i].type === "loop_end") depth++;
                                                    if (routine.blocks[i].type === "loop_start") depth--;
                                                    if (depth === 0) {
                                                        startIdx = i;
                                                        break;
                                                    }
                                                }
                                                const maxReps = routine.blocks[startIdx]?.loop_count || 1;
                                                const currentReps = loopRepetitions[startIdx] || 1;
                                                if (currentReps < maxReps) {
                                                    return (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                                                                <ArrowCounterClockwise className="w-6 h-6 text-cyan-400" weight="bold" />
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-bold text-xl">Repetir Loop</div>
                                                                <div className="text-cyan-500 font-bold uppercase text-[10px]">Ciclo {currentReps + 1} de {maxReps}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                // If loop finishes, show what's after loop_end
                                                const afterLoop = routine.blocks[currentBlockIndex + 2];
                                                if (afterLoop) {
                                                    return (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                                <SkipForward className="w-6 h-6 text-zinc-400" weight="bold" />
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-bold text-xl">{afterLoop.exercise_name}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            }
                                            return (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                        <SkipForward className="w-6 h-6 text-zinc-400" weight="bold" />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-bold text-xl">{nextBlock.exercise_name}</div>
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-kuma-gold/20 flex items-center justify-center">
                                                <Trophy className="w-6 h-6 text-kuma-gold" weight="duotone" />
                                            </div>
                                            <div className="text-kuma-gold font-bold text-xl">¡Finalizar Rutina!</div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={finishSet}
                                    className="w-full h-20 lg:h-32 bg-white hover:bg-zinc-200 text-black rounded-[2.5rem] font-black text-xl lg:text-2xl uppercase tracking-widest flex items-center justify-center gap-3 active:scale-90 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transform hover:-translate-y-1"
                                >
                                    <Check className="w-8 h-8 lg:w-10 lg:h-10" weight="bold" />
                                    Hecho
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="controls-rest"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6 lg:space-y-4 flex flex-col items-center lg:items-stretch"
                            >
                                <button
                                    onClick={finishRest}
                                    className="px-8 py-4 lg:w-full lg:h-20 bg-zinc-800/50 hover:bg-zinc-800 text-white rounded-full font-bold uppercase text-xs lg:text-sm tracking-widest transition-colors backdrop-blur border border-white/10 shadow-lg"
                                >
                                    Saltar Descanso
                                </button>
                                <p className="text-zinc-600 text-xs uppercase tracking-widest animate-pulse">Auto-avance activado</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
}
