"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { didacticSound } from "@/lib/didacticSound";
import { Question } from "@/types/didactica";
import {
    Trophy,
    CheckCircle,
    ArrowCounterClockwise,
    ArrowRight,
    SpeakerHigh,
    SpeakerSlash,
    FastForward,
    Sparkle,
} from "@phosphor-icons/react";

interface TatamiStanceAngleQuestionProps {
    question: Question;
    onCompleted: () => void;
    onCheckAndNext?: () => void;
    isSuperAdmin?: boolean;
}

type StanceTarget = "zenkutsu" | "kokutsu";

interface StanceMission {
    target: StanceTarget;
    title: string;
    actionPrompt: string;
    badge: string;
    badgeColor: string;
    degrees: string;
    weight: string;
    role: string;
    emoji: string;
}

const MISSIONS: StanceMission[] = [
    {
        target: "zenkutsu",
        title: "Paso 1: Zenkutsu-dachi",
        actionPrompt: "Toca la postura de ATAQUE (45° y 60% peso adelante)",
        badge: "45° ATAQUE",
        badgeColor: "bg-amber-500 text-zinc-950 border-amber-300",
        degrees: "45° ↗️",
        weight: "60% Adelante / 40% Atrás",
        role: "Ataque y Avance ⚔️",
        emoji: "⚔️",
    },
    {
        target: "kokutsu",
        title: "Paso 2: Kokutsu-dachi",
        actionPrompt: "Toca la postura de DEFENSA (90° en 'L' y 70% peso atrás)",
        badge: "90° DEFENSA",
        badgeColor: "bg-sky-500 text-zinc-950 border-sky-300",
        degrees: "90° ➡️",
        weight: "70% Atrás / 30% Adelante",
        role: "Defensa y Escudo 🛡️",
        emoji: "🛡️",
    },
];

export function TatamiStanceAngleQuestion({
    question,
    onCompleted,
    onCheckAndNext,
    isSuperAdmin = false,
}: TatamiStanceAngleQuestionProps) {
    // 0: Zenkutsu-dachi, 1: Kokutsu-dachi
    const [currentStep, setCurrentStep] = useState<0 | 1>(0);

    // Posturas completadas exitosamente
    const [completedTargets, setCompletedTargets] = useState<StanceTarget[]>([]);

    // Feedback de error momentáneo
    const [errorSide, setErrorSide] = useState<StanceTarget | null>(null);

    // Estado completado total
    const [isFinished, setIsFinished] = useState<boolean>(false);

    // Control de audio
    const [isSoundActive, setIsSoundActive] = useState<boolean>(true);

    const activeMission = MISSIONS[currentStep];

    // Haptics para móviles
    const triggerHaptic = useCallback((pattern: number | number[] = 25) => {
        if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch {}
        }
    }, []);

    // Manejar toque en una mitad de la imagen o tarjeta
    const handleSelectStance = (selected: StanceTarget) => {
        if (isFinished) return;

        if (selected === activeMission.target) {
            // ¡Correcto!
            triggerHaptic([30, 40, 25]);
            if (isSoundActive) didacticSound.playCorrect();

            const isLeft = selected === "zenkutsu";
            try {
                confetti({
                    particleCount: 35,
                    spread: 55,
                    origin: { x: isLeft ? 0.35 : 0.65, y: 0.55 },
                    colors: isLeft
                        ? ["#f59e0b", "#fbbf24", "#10b981", "#ffffff"]
                        : ["#38bdf8", "#0284c7", "#10b981", "#ffffff"],
                });
            } catch {}

            setCompletedTargets((prev) => [...prev, selected]);
            setErrorSide(null);

            if (currentStep === 0) {
                // Avanzar al paso 2
                setTimeout(() => {
                    setCurrentStep(1);
                    if (isSoundActive) didacticSound.playStreak();
                }, 850);
            } else {
                // Finalizado con éxito
                setTimeout(() => {
                    setIsFinished(true);
                    if (isSoundActive) didacticSound.playComplete();
                    try {
                        confetti({
                            particleCount: 80,
                            spread: 75,
                            origin: { y: 0.5 },
                            colors: ["#f59e0b", "#10b981", "#38bdf8", "#ffffff"],
                        });
                    } catch {}
                    onCompleted();
                }, 600);
            }
        } else {
            // Incorrecto: toque en la otra postura
            triggerHaptic(15);
            if (isSoundActive) didacticSound.playClick();
            setErrorSide(selected);
            setTimeout(() => setErrorSide(null), 1200);
        }
    };

    // Reiniciar ejercicio
    const handleReset = () => {
        setCurrentStep(0);
        setCompletedTargets([]);
        setErrorSide(null);
        setIsFinished(false);
    };

    // SuperAdmin Skip
    const handleSuperAdmin = () => {
        setCompletedTargets(["zenkutsu", "kokutsu"]);
        setIsFinished(true);
        onCompleted();
    };

    const isZenkutsuActive = activeMission.target === "zenkutsu";
    const isKokutsuActive = activeMission.target === "kokutsu";
    const isZenkutsuDone = completedTargets.includes("zenkutsu");
    const isKokutsuDone = completedTargets.includes("kokutsu");

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none text-white px-2 py-2 sm:py-3">
            {/* BARRA SUPERIOR HUD: PASO 1 Y 2 + CONTROLES */}
            <div className="w-full flex items-center justify-between gap-2 mb-2 sm:mb-3 bg-zinc-950/85 border border-zinc-800 p-2 sm:p-2.5 rounded-2xl shadow-xl backdrop-blur-md">
                {/* Selector de pasos */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                        Postura:
                    </span>
                    <div className="flex gap-1.5">
                        <div
                            className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 border ${
                                currentStep === 0 && !isFinished
                                    ? "bg-amber-500 text-zinc-950 border-amber-300 shadow-md shadow-amber-500/30 scale-105"
                                    : isZenkutsuDone
                                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                                    : "bg-zinc-900/60 text-zinc-500 border-zinc-800"
                            }`}
                        >
                            <span>⚔️ Zenkutsu (45°)</span>
                            {isZenkutsuDone && <CheckCircle size={14} weight="fill" className="text-emerald-400" />}
                        </div>

                        <div
                            className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 border ${
                                currentStep === 1 && !isFinished
                                    ? "bg-sky-500 text-zinc-950 border-sky-300 shadow-md shadow-sky-500/30 scale-105"
                                    : isKokutsuDone
                                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                                    : "bg-zinc-900/60 text-zinc-500 border-zinc-800"
                            }`}
                        >
                            <span>🛡️ Kokutsu (90°)</span>
                            {isKokutsuDone && <CheckCircle size={14} weight="fill" className="text-emerald-400" />}
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                    {isSuperAdmin && (
                        <button
                            onClick={handleSuperAdmin}
                            type="button"
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-950/60 border border-purple-500/40 text-purple-300 flex items-center gap-1"
                            title="SuperAdmin Skip"
                        >
                            <FastForward size={14} weight="bold" />
                            <span className="hidden sm:inline">Skip</span>
                        </button>
                    )}

                    <button
                        onClick={() => setIsSoundActive(!isSoundActive)}
                        type="button"
                        className="p-1.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white"
                        title={isSoundActive ? "Sonido ON" : "Sonido OFF"}
                    >
                        {isSoundActive ? <SpeakerHigh size={16} /> : <SpeakerSlash size={16} />}
                    </button>

                    <button
                        onClick={handleReset}
                        type="button"
                        className="p-1.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white"
                        title="Reiniciar"
                    >
                        <ArrowCounterClockwise size={16} />
                    </button>
                </div>
            </div>

            {/* BANNER DINÁMICO DE MISIÓN (MÍNIMO TEXTO, MÁXIMA ACCIÓN) */}
            <div className="w-full text-center mb-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border shadow-sm backdrop-blur-md bg-zinc-950/80 border-zinc-800">
                    <span className="text-sm sm:text-base">{activeMission.emoji}</span>
                    <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wide uppercase">
                        {activeMission.actionPrompt}
                    </span>
                </div>
            </div>

            {/* DIAGRAMA PRINCIPAL PIXAR 3D CON LÍNEAS PUNTEADAS INTERACTIVAS */}
            <div className="w-full relative max-w-3xl aspect-[16/9] rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.9)] bg-black mb-3">
                {/* IMAGEN DE KUMA SENSEI CON LÍNEAS PUNTEADAS DE 45° Y 90° EN EL TATAMI */}
                <Image
                    src="/images/didactic/kuma_posiciones_zenkutsu_kokutsu.jpg"
                    alt="Zenkutsu-dachi vs Kokutsu-dachi - Kuma Dojo"
                    fill
                    priority
                    className="object-cover select-none pointer-events-none"
                    sizes="(max-width: 768px) 100vw, 800px"
                />

                {/* OVERLAY SUTIL OSCURO */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                {/* ZONA INTERACTIVA IZQUIERDA: ZENKUTSU-DACHI (45°) */}
                <div
                    onClick={() => handleSelectStance("zenkutsu")}
                    className={`absolute left-0 top-0 bottom-0 w-1/2 cursor-pointer transition-all duration-200 flex flex-col justify-between p-2.5 sm:p-4 group ${
                        isZenkutsuActive && !isFinished
                            ? "hover:bg-amber-500/15"
                            : "opacity-85 hover:opacity-100"
                    }`}
                >
                    {/* Borde / Radar luminoso activo en la postura buscada */}
                    {isZenkutsuActive && !isFinished && (
                        <div className="absolute inset-1.5 sm:inset-2.5 rounded-2xl border-2 border-dashed border-amber-400 animate-pulse pointer-events-none shadow-[inset_0_0_20px_rgba(245,158,11,0.35)]" />
                    )}

                    {/* Badge superior Zenkutsu */}
                    <div className="flex items-center justify-start z-10">
                        <span className="px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-amber-400/80 text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 shadow-lg flex items-center gap-1.5">
                            <span>⚔️ Zenkutsu</span>
                            <span className="text-white bg-amber-500/30 px-1 rounded">45°</span>
                            {isZenkutsuDone && <CheckCircle size={14} weight="fill" className="text-emerald-400" />}
                        </span>
                    </div>

                    {/* Etiqueta flotante guía en Zenkutsu */}
                    <div className="flex items-center justify-center z-10">
                        {isZenkutsuActive && !isFinished && (
                            <motion.div
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="px-3 py-1 rounded-xl bg-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-xl flex items-center gap-1"
                            >
                                <Sparkle size={15} weight="fill" />
                                <span>¡Toca Ataque!</span>
                            </motion.div>
                        )}
                        {isZenkutsuDone && (
                            <div className="px-3 py-1 rounded-xl bg-emerald-500/90 text-white font-black text-xs uppercase shadow-xl flex items-center gap-1 backdrop-blur-sm">
                                <CheckCircle size={15} weight="fill" />
                                <span>Dominado (45°)</span>
                            </div>
                        )}
                    </div>

                    {/* Espaciador inferior */}
                    <div />
                </div>

                {/* ZONA INTERACTIVA DERECHA: KOKUTSU-DACHI (90°) */}
                <div
                    onClick={() => handleSelectStance("kokutsu")}
                    className={`absolute right-0 top-0 bottom-0 w-1/2 cursor-pointer transition-all duration-200 flex flex-col justify-between p-2.5 sm:p-4 group ${
                        isKokutsuActive && !isFinished
                            ? "hover:bg-sky-500/15"
                            : "opacity-85 hover:opacity-100"
                    }`}
                >
                    {/* Borde / Radar luminoso activo en la postura buscada */}
                    {isKokutsuActive && !isFinished && (
                        <div className="absolute inset-1.5 sm:inset-2.5 rounded-2xl border-2 border-dashed border-sky-400 animate-pulse pointer-events-none shadow-[inset_0_0_20px_rgba(56,189,248,0.35)]" />
                    )}

                    {/* Badge superior Kokutsu */}
                    <div className="flex items-center justify-end z-10">
                        <span className="px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-sky-400/80 text-[10px] sm:text-xs font-black uppercase tracking-wider text-sky-300 shadow-lg flex items-center gap-1.5">
                            <span>🛡️ Kokutsu</span>
                            <span className="text-white bg-sky-500/30 px-1 rounded">90°</span>
                            {isKokutsuDone && <CheckCircle size={14} weight="fill" className="text-emerald-400" />}
                        </span>
                    </div>

                    {/* Etiqueta flotante guía en Kokutsu */}
                    <div className="flex items-center justify-center z-10">
                        {isKokutsuActive && !isFinished && (
                            <motion.div
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="px-3 py-1 rounded-xl bg-sky-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-xl flex items-center gap-1"
                            >
                                <Sparkle size={15} weight="fill" />
                                <span>¡Toca Defensa!</span>
                            </motion.div>
                        )}
                        {isKokutsuDone && (
                            <div className="px-3 py-1 rounded-xl bg-emerald-500/90 text-white font-black text-xs uppercase shadow-xl flex items-center gap-1 backdrop-blur-sm">
                                <CheckCircle size={15} weight="fill" />
                                <span>Dominado (90°)</span>
                            </div>
                        )}
                    </div>

                    {/* Espaciador inferior */}
                    <div />
                </div>

                {/* LÍNEA DIVISORIA CENTRAL DEL TATAMI */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-amber-400/60 to-transparent pointer-events-none" />
            </div>

            {/* BOTONES TÁCTILES RÁPIDOS INFERIORES: TARJETAS VISUALES DE ACCIÓN DIRECTA */}
            <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3 max-w-3xl">
                {/* TARJETA ZENKUTSU */}
                <button
                    type="button"
                    onClick={() => handleSelectStance("zenkutsu")}
                    className={`p-2.5 sm:p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all select-none active:scale-95 ${
                        isZenkutsuActive && !isFinished
                            ? "bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/50"
                            : isZenkutsuDone
                            ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                            : "bg-zinc-950/80 border-zinc-800 opacity-60 hover:opacity-100"
                    }`}
                >
                    <div className="flex items-center gap-2.5 text-left">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-black/60 border border-amber-500/40 flex items-center justify-center text-lg sm:text-xl">
                            ⚔️
                        </div>
                        <div>
                            <div className="text-xs sm:text-sm font-black uppercase text-amber-200">
                                Zenkutsu-dachi
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-zinc-300 font-bold">
                                45° ↗️ • 60% Adelante
                            </div>
                        </div>
                    </div>
                    {isZenkutsuDone ? (
                        <CheckCircle size={20} weight="fill" className="text-emerald-400" />
                    ) : (
                        <span className="text-[10px] font-black uppercase bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-md">
                            Ataque
                        </span>
                    )}
                </button>

                {/* TARJETA KOKUTSU */}
                <button
                    type="button"
                    onClick={() => handleSelectStance("kokutsu")}
                    className={`p-2.5 sm:p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all select-none active:scale-95 ${
                        isKokutsuActive && !isFinished
                            ? "bg-sky-950/60 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)] ring-2 ring-sky-400/50"
                            : isKokutsuDone
                            ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                            : "bg-zinc-950/80 border-zinc-800 opacity-60 hover:opacity-100"
                    }`}
                >
                    <div className="flex items-center gap-2.5 text-left">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-black/60 border border-sky-500/40 flex items-center justify-center text-lg sm:text-xl">
                            🛡️
                        </div>
                        <div>
                            <div className="text-xs sm:text-sm font-black uppercase text-sky-200">
                                Kokutsu-dachi
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-zinc-300 font-bold">
                                90° ➡️ • 70% Atrás
                            </div>
                        </div>
                    </div>
                    {isKokutsuDone ? (
                        <CheckCircle size={20} weight="fill" className="text-emerald-400" />
                    ) : (
                        <span className="text-[10px] font-black uppercase bg-sky-500 text-zinc-950 px-2 py-0.5 rounded-md">
                            Defensa
                        </span>
                    )}
                </button>
            </div>

            {/* MENSAJE DE ERROR AMISTOSO (SI TOCA LA POSTURA CONTRARIA) */}
            <AnimatePresence>
                {errorSide && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-2 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-bold text-center shadow-lg"
                    >
                        {errorSide === "kokutsu"
                            ? "🛡️ Esa es Kokutsu (Defensa a 90°). Para la misión actual busca Zenkutsu (Ataque a 45°) ⚔️"
                            : "⚔️ Esa es Zenkutsu (Ataque a 45°). Para la misión actual busca Kokutsu (Defensa a 90° en 'L') 🛡️"}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CELEBRACIÓN DE CONCLUSIÓN FINAL */}
            {isFinished && (
                <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-3xl mt-3 bg-gradient-to-r from-emerald-950/90 via-teal-900/90 to-emerald-950/90 border-2 border-emerald-400 rounded-3xl p-4 text-center shadow-[0_0_35px_rgba(16,185,129,0.4)] backdrop-blur-xl"
                >
                    <Trophy size={36} weight="fill" className="text-amber-400 mx-auto mb-1" />
                    <h4 className="text-sm sm:text-base font-black text-white mb-0.5">
                        ¡Dominaste las Posturas en el Tatami!
                    </h4>
                    <p className="text-[11px] sm:text-xs text-emerald-200 mb-2.5">
                        ¡Zenkutsu-dachi (45° y 60/40%) y Kokutsu-dachi (90° y 70/30%) superados con precisión marcial!
                    </p>
                    {onCheckAndNext && (
                        <button
                            onClick={onCheckAndNext}
                            type="button"
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                        >
                            <span>Continuar</span>
                            <ArrowRight size={16} weight="bold" />
                        </button>
                    )}
                </motion.div>
            )}
        </div>
    );
}
