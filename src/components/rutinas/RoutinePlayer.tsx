"use client";

import { useState, useEffect, useRef } from "react";
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
    Trophy
} from "@phosphor-icons/react/dist/ssr";
import confetti from "canvas-confetti";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { audioTrainer } from "@/lib/audio-trainer";
import { getExerciseGif } from "@/lib/exercise-assets";
import { AchievementOverlay } from "../gamification/AchievementOverlay";

// --- INTERFACES ---
interface IBlock {
    exercise_name: string;
    sets: number;
    reps: number;
    rest_seconds: number;
    measure_type?: "reps" | "time";
    notes?: string;
    media_url?: string;
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

export function RoutinePlayer({ routine }: { routine: IRoutineData }) {
    const [status, setStatus] = useState<"intro" | "active" | "completed">("intro");
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [impact, setImpact] = useState(false); // FOR SHAKE EFFECT

    // Gamification State
    const [showTrophy, setShowTrophy] = useState(false);
    // const [earnedBelt, setEarnedBelt] = useState<string>(""); // REVERTED

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

    // Initial Coach Voice
    useEffect(() => {
        if (status === "active" && currentBlockIndex === 0 && currentSet === 1 && !isResting) {
            audioTrainer.speak(`Iniciando ${routine.title}. Vamos con ${routine.blocks[0].exercise_name}`);
        }
    }, [status]);

    // --- ACTIONS ---
    const startRoutine = () => {
        setStatus("active");
        setCurrentBlockIndex(0);
        setCurrentSet(1);
        setIsResting(false);
    };

    const triggerImpact = () => {
        setImpact(true);
        setTimeout(() => setImpact(false), 300); // 300ms shake
    };

    const finishSet = () => {
        audioTrainer.playBeep();
        triggerImpact(); // TRIGGER VISUAL IMPACT

        if (activeBlock.rest_seconds > 0 && currentSet < activeBlock.sets) {
            audioTrainer.speak("Descansa.");
            startRest();
        } else if (activeBlock.rest_seconds > 0 && currentSet === activeBlock.sets && currentBlockIndex < totalBlocks - 1) {
            audioTrainer.speak("Descansa. Siguiente ejercicio pronto.");
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
        if (currentSet < activeBlock.sets) {
            setCurrentSet((prev) => prev + 1);
            audioTrainer.speak(`Set ${currentSet + 1}. Vamos.`);
        } else {
            if (currentBlockIndex < totalBlocks - 1) {
                setCurrentBlockIndex((prev) => prev + 1);
                setCurrentSet(1);
                const nextBlock = routine.blocks[currentBlockIndex + 1];
                audioTrainer.speak(`Siguiente ejercicio: ${nextBlock.exercise_name}.`);
            } else {
                completeRoutine();
            }
        }
    };



    // ...

    const completeRoutine = async () => {
        try {
            // 1. Call Progress API (New Logic: Simple First Workout Check)
            const res = await fetch("/api/workouts/complete", {
                method: "POST",
            });

            const data = await res.json();

            if (data.firstWorkout) {
                // 2. Trigger First Workout Trophy Event
                setShowTrophy(true);
                audioTrainer.playWin(); // Play sound immediately
            } else {
                // 3. Standard Completion
                setStatus("completed");
                audioTrainer.playWin();
                audioTrainer.speak("¡Rutina completada! Excelente trabajo.");
                triggerConfetti();
            }
        } catch (error) {
            console.error("Error saving progress:", error);
            // Fallback to standard completion
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
                        <Link href="/rutinas">
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
                    <p className="text-zinc-400 text-lg mb-12">Rutina completada con éxito.</p>
                    <Link href="/rutinas" className="block w-full">
                        <button className="w-full h-16 bg-zinc-800 text-white rounded-[2rem] font-bold text-lg tracking-wider hover:bg-zinc-700 transition-colors">Volver al Dojo</button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    // 3. ACTIVE ROUTINE
    const progress = ((currentBlockIndex) / totalBlocks) * 100;

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
                trophy={{
                    name: "Primer Entrenamiento",
                    description: "El primer paso de un viaje de mil millas. ¡Has comenzado tu legado!",
                    icon: "Fire",
                    color: "#fbbf24",
                    rarity: "Legendario"
                }}
                onClose={() => {
                    setShowTrophy(false);
                    setStatus("completed");
                    triggerConfetti(); // Celebration continues on completion screen
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
                        animate={{ width: `${progress}%` }}
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
                        {routine.blocks.map((_, idx) => (
                            <div key={idx} className={cn("h-full w-[2px] transform skew-x-[-10deg]", idx < currentBlockIndex ? "bg-cyan-900/30" : "bg-black/40")} />
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-[10px] font-bold text-cyan-500 tracking-[0.2em] animate-pulse">
                        {Math.round(progress)}% COMPLETADO
                    </span>
                    <span className="text-[10px] font-bold text-zinc-600 tracking-[0.2em]">
                        {currentBlockIndex} / {totalBlocks} BLOCKS
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
                                        <div className="bg-black/30 backdrop-blur px-4 py-1.5 rounded-full border border-white/5 mb-4 inline-flex shadow-lg">
                                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                                Ejercico {currentBlockIndex + 1} de {totalBlocks}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-white leading-tight max-w-4xl drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                                            {activeBlock.exercise_name}
                                        </h2>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center py-8 lg:w-full">
                                        <div className="relative group cursor-default">
                                            <motion.div
                                                animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute inset-0 bg-kuma-gold rounded-full blur-2xl lg:blur-3xl"
                                            />
                                            <div className="text-center relative z-10 lg:scale-150 transition-transform duration-700">
                                                <span className="text-[6rem] lg:text-[10rem] font-bold text-white leading-none tracking-tighter tabular-nums drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                                                    {activeBlock.measure_type === "time" ? formatTime(activeBlock.reps) : activeBlock.reps}
                                                </span>
                                                <span className="block text-2xl font-medium text-zinc-500 uppercase tracking-widest mt-2 lg:mt-6">
                                                    {activeBlock.measure_type === "time" ? "Tiempo" : "Reps"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full flex justify-between items-center text-sm font-bold text-zinc-400 px-4 lg:px-6">
                                        <span className="lg:text-xl">Set {currentSet} / {activeBlock.sets}</span>
                                        {activeBlock.notes && <span className="text-kuma-gold lg:bg-kuma-gold/10 lg:px-4 lg:py-2 lg:rounded-xl cursor-help">ℹ️ Ver Notas</span>}
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
                                        <span className="text-sm font-bold text-teal-400 uppercase tracking-[0.3em] mt-2 lg:text-lg animate-pulse">Respira</span>
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
                                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest block mb-4">Siguiente paso</span>
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
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <SkipForward className="w-6 h-6 text-zinc-400" weight="bold" />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-xl">{routine.blocks[currentBlockIndex + 1].exercise_name}</div>
                                            </div>
                                        </div>
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
        </div>
    );
}
