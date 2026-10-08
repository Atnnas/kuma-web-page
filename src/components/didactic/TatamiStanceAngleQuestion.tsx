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
    Lightning,
    ShieldCheck,
} from "@phosphor-icons/react";

interface TatamiStanceAngleQuestionProps {
    question: Question;
    onCompleted: () => void;
    onCheckAndNext?: () => void;
    isSuperAdmin?: boolean;
}

interface StanceOption {
    id: string;
    degrees: string;
    weight: string;
    label: string;
    isCorrect: boolean;
    color: string;
}

interface StanceStep {
    id: "zenkutsu" | "kokutsu";
    name: string;
    kanji: string;
    role: string;
    roleBadge: string;
    image: string;
    altText: string;
    promptText: string;
    accentColor: string;
    borderGlow: string;
    badgeBg: string;
    options: StanceOption[];
    successQuote: string;
}

const STANCE_STEPS: StanceStep[] = [
    {
        id: "zenkutsu",
        name: "Zenkutsu-dachi",
        kanji: "前屈立ち",
        role: "Ataque y Avance",
        roleBadge: "⚔️ ATAQUE (60% ADELANTE)",
        image: "/images/didactic/kuma_zenkutsu_dachi_oficial.jpg",
        altText: "Kuma Sensei en postura Zenkutsu-dachi con 45 grados y 60% de peso al frente",
        promptText: "¿Cuál es el ángulo del pie trasero y el peso de Zenkutsu?",
        accentColor: "text-amber-300",
        borderGlow: "border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]",
        badgeBg: "bg-amber-500 text-zinc-950 border-amber-300",
        options: [
            {
                id: "opt-zen-correct",
                degrees: "45° ↗️",
                weight: "60% Adelante",
                label: "Empuje de Ataque",
                isCorrect: true,
                color: "amber",
            },
            {
                id: "opt-zen-wrong1",
                degrees: "90° ➡️",
                weight: "70% Atrás",
                label: "Escuadra en 'L'",
                isCorrect: false,
                color: "zinc",
            },
            {
                id: "opt-zen-wrong2",
                degrees: "0° ⬆️",
                weight: "50% / 50%",
                label: "Pies Paralelos",
                isCorrect: false,
                color: "zinc",
            },
        ],
        successQuote: "¡Zenkutsu Perfecto! Rodilla al frente, talón a 45° y 60% de peso de ataque.",
    },
    {
        id: "kokutsu",
        name: "Kokutsu-dachi",
        kanji: "後屈立ち",
        role: "Defensa Atrasada",
        roleBadge: "🛡️ DEFENSA (70% ATRÁS)",
        image: "/images/didactic/kuma_kokutsu_dachi_oficial.jpg",
        altText: "Kuma Sensei en auténtica postura Kokutsu-dachi sentado atrás con 90 grados y 70% de peso",
        promptText: "¿Cuál es el ángulo en escuadra y el peso de Kokutsu?",
        accentColor: "text-sky-300",
        borderGlow: "border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.4)]",
        badgeBg: "bg-sky-500 text-zinc-950 border-sky-300",
        options: [
            {
                id: "opt-kok-wrong1",
                degrees: "45° ↗️",
                weight: "60% Adelante",
                label: "Empuje de Ataque",
                isCorrect: false,
                color: "zinc",
            },
            {
                id: "opt-kok-correct",
                degrees: "90° ➡️",
                weight: "70% Atrás",
                label: "Escudo en Escuadra",
                isCorrect: true,
                color: "sky",
            },
            {
                id: "opt-kok-wrong2",
                degrees: "0° ⬆️",
                weight: "50% / 50%",
                label: "Pies Paralelos",
                isCorrect: false,
                color: "zinc",
            },
        ],
        successQuote: "¡Kokutsu Auténtico! 70% de peso cargado atrás y pie a 90° en 'L' para Shuto-uke.",
    },
];

export function TatamiStanceAngleQuestion({
    question,
    onCompleted,
    onCheckAndNext,
    isSuperAdmin = false,
}: TatamiStanceAngleQuestionProps) {
    // 0: Zenkutsu-dachi, 1: Kokutsu-dachi
    const [stepIndex, setStepIndex] = useState<0 | 1>(0);

    // Opciones seleccionadas por paso
    const [selectedOptId, setSelectedOptId] = useState<string | null>(null);

    // Error visual momentáneo
    const [isWrongSelected, setIsWrongSelected] = useState<boolean>(false);

    // Pasos resueltos
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    // Finalizado
    const [isFinished, setIsFinished] = useState<boolean>(false);

    // Audio
    const [isSoundActive, setIsSoundActive] = useState<boolean>(true);

    const currentStep = STANCE_STEPS[stepIndex];

    // Disparador háptico sutil
    const triggerHaptic = useCallback((pattern: number | number[] = 25) => {
        if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch {}
        }
    }, []);

    // Manejar selección de opción
    const handleSelectOption = (opt: StanceOption) => {
        if (isFinished) return;
        setSelectedOptId(opt.id);

        if (opt.isCorrect) {
            setIsWrongSelected(false);
            triggerHaptic([30, 45, 25]);
            if (isSoundActive) didacticSound.playCorrect();

            try {
                confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: stepIndex === 0
                        ? ["#f59e0b", "#fbbf24", "#10b981", "#ffffff"]
                        : ["#38bdf8", "#0284c7", "#10b981", "#ffffff"],
                });
            } catch {}

            setCompletedSteps((prev) => [...prev, stepIndex]);

            if (stepIndex === 0) {
                // Avanzar al paso 2 (Kokutsu)
                setTimeout(() => {
                    setStepIndex(1);
                    setSelectedOptId(null);
                    if (isSoundActive) didacticSound.playStreak();
                }, 900);
            } else {
                // Finalizar ejercicio
                setTimeout(() => {
                    setIsFinished(true);
                    if (isSoundActive) didacticSound.playComplete();
                    try {
                        confetti({
                            particleCount: 85,
                            spread: 75,
                            origin: { y: 0.5 },
                            colors: ["#f59e0b", "#10b981", "#38bdf8", "#ffffff"],
                        });
                    } catch {}
                    onCompleted();
                }, 750);
            }
        } else {
            // Error
            triggerHaptic(18);
            if (isSoundActive) didacticSound.playClick();
            setIsWrongSelected(true);
            setTimeout(() => {
                setIsWrongSelected(false);
                setSelectedOptId(null);
            }, 1000);
        }
    };

    // Reiniciar
    const handleReset = () => {
        setStepIndex(0);
        setSelectedOptId(null);
        setIsWrongSelected(false);
        setCompletedSteps([]);
        setIsFinished(false);
    };

    // SuperAdmin
    const handleSuperAdmin = () => {
        setCompletedSteps([0, 1]);
        setIsFinished(true);
        onCompleted();
    };

    const isStep0Done = completedSteps.includes(0);
    const isStep1Done = completedSteps.includes(1);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none text-white px-2 py-2 sm:py-3">
            {/* BARRA SUPERIOR HUD: PASO 1 Y 2 + CONTROLES */}
            <div className="w-full flex items-center justify-between gap-2 mb-2 sm:mb-3 bg-zinc-950/85 border border-zinc-800 p-2 sm:p-2.5 rounded-2xl shadow-xl backdrop-blur-md">
                {/* Indicador de Postura */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                        Postura:
                    </span>
                    <div className="flex gap-1.5">
                        <button
                            type="button"
                            onClick={() => {
                                if (isStep0Done || isFinished) {
                                    setStepIndex(0);
                                    setSelectedOptId(null);
                                }
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 border ${
                                stepIndex === 0
                                    ? "bg-amber-500 text-zinc-950 border-amber-300 shadow-md shadow-amber-500/30 scale-105"
                                    : isStep0Done
                                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                                    : "bg-zinc-900/60 text-zinc-500 border-zinc-800"
                            }`}
                        >
                            <span>⚔️ Zenkutsu</span>
                            {isStep0Done && <CheckCircle size={14} weight="fill" className="text-emerald-400" />}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (isStep0Done) {
                                    setStepIndex(1);
                                    setSelectedOptId(null);
                                }
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 border ${
                                stepIndex === 1
                                    ? "bg-sky-500 text-zinc-950 border-sky-300 shadow-md shadow-sky-500/30 scale-105"
                                    : isStep1Done
                                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                                    : "bg-zinc-900/60 text-zinc-500 border-zinc-800 opacity-60"
                            }`}
                        >
                            <span>🛡️ Kokutsu</span>
                            {isStep1Done && <CheckCircle size={14} weight="fill" className="text-emerald-400" />}
                        </button>
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

            {/* BANNER DINÁMICO DE MISIÓN (MÍNIMO TEXTO) */}
            <div className="w-full text-center mb-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border shadow-sm backdrop-blur-md bg-zinc-950/80 border-zinc-800">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-black border ${currentStep.badgeBg}`}>
                        {currentStep.roleBadge}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                        {currentStep.promptText}
                    </span>
                </div>
            </div>

            {/* HERO VISUAL: ILUSTRACIÓN PIXAR 3D OFICIAL DE KUMA SENSEI CON LÍNEAS PUNTEADAS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
                {/* CONTENEDOR DE LA IMAGEN (Md: 7 cols) */}
                <div className="md:col-span-7 flex flex-col items-center w-full">
                    <motion.div
                        key={currentStep.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] md:max-w-[450px] aspect-[4/3] rounded-3xl overflow-hidden border-2 shadow-2xl bg-black ${currentStep.borderGlow}`}
                    >
                        <Image
                            src={currentStep.image}
                            alt={currentStep.altText}
                            fill
                            priority
                            className="object-contain select-none pointer-events-none p-1"
                            sizes="(max-width: 768px) 380px, 450px"
                        />

                        {/* BADGE FLOTANTE DE CONFIRMACIÓN */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-[11px] font-black tracking-wider uppercase text-white shadow-lg flex items-center gap-1.5">
                            <span>{currentStep.id === "zenkutsu" ? "⚔️" : "🛡️"}</span>
                            <span>{currentStep.name}</span>
                            <span className={currentStep.accentColor}>({currentStep.kanji})</span>
                        </div>

                        {/* BADGE INFERIOR DE APOYO Y BIOMECÁNICA */}
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-black text-white shadow-lg flex items-center gap-1.5">
                            {currentStep.id === "zenkutsu" ? (
                                <span className="text-amber-300">⚡ 60% Adelante • 45°</span>
                            ) : (
                                <span className="text-sky-300">🛡️ 70% Apoyo Atrás • 90°</span>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* COLUMNA DE OPCIONES TÁCTILES RÁPIDAS (Md: 5 cols) */}
                <div className="md:col-span-5 flex flex-col gap-2.5 w-full">
                    <div className="bg-zinc-950/85 border-2 border-zinc-800 rounded-3xl p-3 sm:p-4 shadow-xl backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-800 text-xs font-black uppercase text-zinc-400">
                            <span>Elige la Geometría Exacta</span>
                            <span className={currentStep.accentColor}>{currentStep.id === "zenkutsu" ? "45°" : "90°"}</span>
                        </div>

                        {/* 3 BOTONES GRANDES Y LLAMATIVOS PARA NIÑOS */}
                        <div className="grid grid-cols-1 gap-2.5">
                            {currentStep.options.map((opt) => {
                                const isSelected = selectedOptId === opt.id;
                                const isWrong = isSelected && isWrongSelected;
                                const isSuccess = isSelected && opt.isCorrect;

                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => handleSelectOption(opt)}
                                        className={`w-full p-3 sm:p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all select-none active:scale-95 text-left ${
                                            isSuccess
                                                ? "bg-emerald-500 text-zinc-950 border-white shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-102"
                                                : isWrong
                                                ? "bg-rose-500 text-white border-white shadow-md animate-shake"
                                                : "bg-zinc-900/80 border-zinc-800 hover:border-amber-400/80 hover:bg-zinc-800/90 text-white"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base sm:text-lg border ${
                                                    isSuccess
                                                        ? "bg-white text-emerald-600 border-white"
                                                        : "bg-black/60 border-zinc-700 text-amber-300"
                                                }`}
                                            >
                                                {opt.degrees.split(" ")[0]}
                                            </div>

                                            <div>
                                                <div className="text-sm font-black tracking-wide">
                                                    {opt.degrees} • {opt.weight}
                                                </div>
                                                <div className="text-[11px] font-semibold text-zinc-400 opacity-90">
                                                    {opt.label}
                                                </div>
                                            </div>
                                        </div>

                                        {isSuccess ? (
                                            <CheckCircle size={22} weight="fill" className="text-zinc-950" />
                                        ) : (
                                            <div className="w-3 h-3 rounded-full border border-zinc-600" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* MENSAJE DE REFUERZO MARCIAL COMPACTO */}
                    <div className="p-2.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 text-[11px] sm:text-xs text-zinc-300 flex items-center gap-2">
                        <span className="text-base">{currentStep.id === "zenkutsu" ? "💥" : "🛡️"}</span>
                        <span>{currentStep.successQuote}</span>
                    </div>

                    {/* CELEBRACIÓN DE CONCLUSIÓN FINAL */}
                    {isFinished && (
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gradient-to-r from-emerald-950/90 via-teal-900/90 to-emerald-950/90 border-2 border-emerald-400 rounded-3xl p-4 text-center shadow-[0_0_35px_rgba(16,185,129,0.4)] backdrop-blur-xl"
                        >
                            <Trophy size={36} weight="fill" className="text-amber-400 mx-auto mb-1" />
                            <h4 className="text-sm sm:text-base font-black text-white mb-0.5">
                                ¡Dominaste Zenkutsu y Kokutsu!
                            </h4>
                            <p className="text-[11px] sm:text-xs text-emerald-200 mb-2.5">
                                ¡Has aprendido los ángulos y el apoyo corporal de Karate tradicional!
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
            </div>
        </div>
    );
}
