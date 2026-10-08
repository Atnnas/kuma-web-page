"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { didacticSound } from "@/lib/didacticSound";
import { Question } from "@/types/didactica";
import {
    Sparkle,
    Trophy,
    CheckCircle,
    ArrowCounterClockwise,
    ArrowRight,
    SpeakerHigh,
    SpeakerSlash,
    FastForward,
    Compass,
    Lightning,
    ShieldCheck,
    Sword,
} from "@phosphor-icons/react";

interface TatamiStanceAngleQuestionProps {
    question: Question;
    onCompleted: () => void;
    onCheckAndNext?: () => void;
    isSuperAdmin?: boolean;
}

type StanceType = "zenkutsu" | "kokutsu";

interface StanceConfig {
    id: StanceType;
    name: string;
    kanji: string;
    role: string;
    roleIcon: string;
    correctAngle: number;
    frontWeight: number;
    backWeight: number;
    themeColor: string;
    accentBg: string;
    instructionShort: string;
    hintBadge: string;
    powerEmoji: string;
    successMessage: string;
}

const STANCES: StanceConfig[] = [
    {
        id: "zenkutsu",
        name: "Zenkutsu-dachi",
        kanji: "前屈立ち",
        role: "Ataque y Avance",
        roleIcon: "⚔️",
        correctAngle: 45,
        frontWeight: 60,
        backWeight: 40,
        themeColor: "from-amber-500 to-orange-500",
        accentBg: "bg-amber-500/20 border-amber-400 text-amber-300",
        instructionShort: "Gira el pie trasero a 45°",
        hintBadge: "60% Peso Adelante ⚡",
        powerEmoji: "💥",
        successMessage: "¡Zenkutsu Perfecto! 45° de empuje y 60% de peso al frente.",
    },
    {
        id: "kokutsu",
        name: "Kokutsu-dachi",
        kanji: "後屈立ち",
        role: "Defensa en Escuadra",
        roleIcon: "🛡️",
        correctAngle: 90,
        frontWeight: 30,
        backWeight: 70,
        themeColor: "from-sky-500 to-indigo-500",
        accentBg: "bg-sky-500/20 border-sky-400 text-sky-300",
        instructionShort: "Forma una 'L' a 90°",
        hintBadge: "70% Peso Atrás 🛡️",
        powerEmoji: "🥋",
        successMessage: "¡Kokutsu Magistral! Escuadra a 90° con 70% de peso en el ancla.",
    },
];

export function TatamiStanceAngleQuestion({
    question,
    onCompleted,
    onCheckAndNext,
    isSuperAdmin = false,
}: TatamiStanceAngleQuestionProps) {
    // Etapa activa: 0 (Zenkutsu-dachi) ó 1 (Kokutsu-dachi)
    const [stanceIndex, setStanceIndex] = useState<number>(0);

    // Ángulo seleccionado para el pie trasero (null, 0, 45, 90)
    const [selectedAngle, setSelectedAngle] = useState<number | null>(null);

    // Estado de confirmación de la postura actual
    const [isStepSuccess, setIsStepSuccess] = useState<boolean>(false);

    // Estado completado total
    const [isFinished, setIsFinished] = useState<boolean>(false);

    // Sonido activo por defecto
    const [isSoundActive, setIsSoundActive] = useState<boolean>(true);

    const currentStance = STANCES[stanceIndex];

    // Disparador háptico sutil para teléfonos móviles
    const triggerHaptic = useCallback((pattern: number | number[] = 25) => {
        if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch {}
        }
    }, []);

    // Sintetizador Web Audio de impacto / confirmación
    const playStanceTone = useCallback(
        (freq: number = 660, type: OscillatorType = "sine") => {
            if (!isSoundActive || typeof window === "undefined") return;
            try {
                const AudioCtx =
                    window.AudioContext ||
                    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                if (!AudioCtx) return;
                const ctx = new AudioCtx();
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, now);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.15);
            } catch {}
        },
        [isSoundActive]
    );

    // Manejar selección de ángulo (0°, 45°, 90°)
    const handleSelectAngle = (angle: number) => {
        setSelectedAngle(angle);
        triggerHaptic(18);

        if (angle === currentStance.correctAngle) {
            playStanceTone(880, "triangle");
        } else {
            playStanceTone(340, "sine");
        }
    };

    // Confirmar postura actual
    const handleConfirmStep = () => {
        if (selectedAngle !== currentStance.correctAngle) return;

        setIsStepSuccess(true);
        triggerHaptic([30, 45, 30]);
        didacticSound.playCorrect();

        try {
            confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.6 },
                colors: ["#f59e0b", "#10b981", "#38bdf8", "#ffffff"],
            });
        } catch {}

        // Si es el primer paso (Zenkutsu), pasar al segundo (Kokutsu) tras breve pausa
        if (stanceIndex === 0) {
            setTimeout(() => {
                setStanceIndex(1);
                setSelectedAngle(null);
                setIsStepSuccess(false);
                didacticSound.playStreak();
            }, 1200);
        } else {
            // Completado de las 2 posturas
            setTimeout(() => {
                setIsFinished(true);
                didacticSound.playComplete();
                try {
                    confetti({
                        particleCount: 90,
                        spread: 80,
                        origin: { y: 0.5 },
                        colors: ["#f59e0b", "#10b981", "#ef4444", "#38bdf8"],
                    });
                } catch {}
                onCompleted();
            }, 800);
        }
    };

    // Reiniciar ejercicio
    const handleReset = () => {
        setStanceIndex(0);
        setSelectedAngle(null);
        setIsStepSuccess(false);
        setIsFinished(false);
    };

    // SuperAdmin Skip
    const handleSuperAdmin = () => {
        if (stanceIndex === 0) {
            setStanceIndex(1);
            setSelectedAngle(null);
            setIsStepSuccess(false);
        } else {
            setIsFinished(true);
            onCompleted();
        }
    };

    const isAngleCorrect = selectedAngle === currentStance.correctAngle;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none text-white px-2 py-2 sm:py-3">
            {/* BARRA SUPERIOR HUD: PASOS 1 Y 2 + CONTROLES */}
            <div className="w-full flex items-center justify-between gap-2 mb-3 bg-zinc-950/85 border border-zinc-800 p-2.5 sm:p-3 rounded-2xl shadow-xl backdrop-blur-md">
                {/* Selector de Posturas */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                        Postura:
                    </span>
                    <div className="flex gap-1.5">
                        {STANCES.map((s, idx) => {
                            const isCurrent = stanceIndex === idx;
                            const isDone = stanceIndex > idx || isFinished;
                            return (
                                <div
                                    key={s.id}
                                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                                        isCurrent
                                            ? "bg-amber-500 text-zinc-950 border-amber-300 shadow-md shadow-amber-500/30 scale-105"
                                            : isDone
                                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                                            : "bg-zinc-900/60 text-zinc-500 border-zinc-800"
                                    }`}
                                >
                                    <span>{s.roleIcon}</span>
                                    <span>{s.name.split("-")[0]}</span>
                                    {isDone && <CheckCircle size={14} weight="fill" className="text-emerald-400" />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Acciones (Audio, Reiniciar, SuperAdmin) */}
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

            {/* BANNER DINÁMICO DE LA POSTURA ACTIVA */}
            <div className="w-full text-center mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm backdrop-blur-md bg-zinc-950/80 border-zinc-800">
                    <span className="text-base sm:text-lg">{currentStance.roleIcon}</span>
                    <span className="text-sm sm:text-base font-black text-amber-300 uppercase tracking-wide">
                        {currentStance.name}
                    </span>
                    <span className="text-xs text-zinc-400 font-semibold">({currentStance.role})</span>
                </div>
            </div>

            {/* CONTENEDOR CENTRAL: TATAMI RADAR + SELECTOR TÁCTIL DE ÁNGULOS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
                {/* TATAMI BLUEPRINT CANVAS (Md: 7 cols) */}
                <div className="md:col-span-7 flex flex-col items-center w-full">
                    <div className="relative w-full max-w-[320px] xs:max-w-[350px] sm:max-w-[390px] aspect-square rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_12px_36px_rgba(0,0,0,0.9)] bg-gradient-to-b from-[#1c1813] via-[#14120e] to-[#0c0a08] p-4 flex flex-col justify-between">
                        {/* PATRÓN TEXTURA TATAMI JAPONÉS */}
                        <div
                            className="absolute inset-0 opacity-15 pointer-events-none"
                            style={{
                                backgroundImage: `radial-gradient(circle at 2px 2px, #f59e0b 1px, transparent 0)`,
                                backgroundSize: "24px 24px",
                            }}
                        />

                        {/* LÍNEA GUÍA CENTRAL DE TATAMI */}
                        <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-amber-500/25 pointer-events-none" />

                        {/* LÍNEA DE DISTANCIA DE HOMBROS */}
                        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-0.5 border-t border-dashed border-zinc-700/50 pointer-events-none" />

                        {/* 1. HUELLA DELANTERA (SIEMPRE 0° AL FRENTE) */}
                        <div className="relative z-10 flex flex-col items-center mt-2">
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/75 border border-amber-400/60 text-[10px] sm:text-xs font-black text-amber-300 shadow-md mb-1.5">
                                <span>⬆️ 0° Frente</span>
                                <span>•</span>
                                <span className="text-white">{currentStance.frontWeight}% Peso</span>
                            </div>

                            {/* Icono de huella delantera */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 2.2 }}
                                className="w-14 h-20 sm:w-16 sm:h-24 rounded-2xl bg-gradient-to-b from-amber-500/30 to-amber-500/10 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center text-amber-300"
                            >
                                <span className="text-2xl sm:text-3xl">🦶</span>
                                <span className="text-[9px] font-black uppercase text-amber-200 mt-1">Delantero</span>
                            </motion.div>
                        </div>

                        {/* FLECHA VECTORIAL DE DISTANCIA ENTRE PIES */}
                        <div className="flex items-center justify-center my-1 pointer-events-none">
                            <span className="text-xs font-black px-2 py-0.5 rounded bg-black/60 border border-zinc-800 text-zinc-400">
                                2 Anchos de Hombros ↔️
                            </span>
                        </div>

                        {/* 2. HUELLA TRASERA CON ROTACIÓN DINÁMICA DE ÁNGULO */}
                        <div className="relative z-10 flex flex-col items-center mb-2">
                            {/* Icono de huella trasera orientada según selectedAngle */}
                            <motion.div
                                animate={{
                                    rotate: selectedAngle !== null ? selectedAngle : 0,
                                    scale: isAngleCorrect ? [1, 1.1, 1] : 1,
                                }}
                                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                className={`w-14 h-20 sm:w-16 sm:h-24 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                                    selectedAngle === null
                                        ? "bg-zinc-900/60 border-zinc-700 text-zinc-500"
                                        : isAngleCorrect
                                        ? "bg-gradient-to-b from-emerald-500/40 to-teal-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_28px_rgba(16,185,129,0.7)]"
                                        : "bg-rose-950/40 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                                }`}
                            >
                                <span className="text-2xl sm:text-3xl">🦶</span>
                                <span className="text-[9px] font-black uppercase mt-1">
                                    {selectedAngle !== null ? `${selectedAngle}°` : "Girar"}
                                </span>
                            </motion.div>

                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/75 border border-zinc-700 text-[10px] sm:text-xs font-black mt-1.5 shadow-md">
                                <span className={isAngleCorrect ? "text-emerald-300" : "text-zinc-400"}>
                                    {selectedAngle !== null ? `Pie Trasero: ${selectedAngle}°` : "Selecciona ángulo abajo"}
                                </span>
                                <span>•</span>
                                <span className="text-white">{currentStance.backWeight}% Peso</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA INTERACTIVA: DIAL DE ÁNGULOS + BALANZA DE PESO (Md: 5 cols) */}
                <div className="md:col-span-5 flex flex-col gap-3 w-full">
                    {/* TARJETA DEL SELECTOR DE ÁNGULOS */}
                    <div className="bg-zinc-950/85 border-2 border-amber-500/30 rounded-3xl p-3.5 sm:p-4 shadow-xl backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-800">
                            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase">
                                <Compass size={18} weight="fill" />
                                <span>Ángulo del Pie Trasero</span>
                            </div>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                {currentStance.instructionShort}
                            </span>
                        </div>

                        {/* BOTONES GIGANTES DE ÁNGULOS: 0°, 45°, 90° */}
                        <div className="grid grid-cols-3 gap-2 my-2">
                            {[0, 45, 90].map((deg) => {
                                const isSelected = selectedAngle === deg;
                                const isMatch = deg === currentStance.correctAngle;

                                return (
                                    <button
                                        key={deg}
                                        type="button"
                                        onClick={() => handleSelectAngle(deg)}
                                        className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center font-black transition-all border-2 active:scale-95 ${
                                            isSelected
                                                ? isMatch
                                                    ? "bg-emerald-500 text-zinc-950 border-white shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-105"
                                                    : "bg-rose-500 text-white border-white shadow-md scale-105"
                                                : "bg-zinc-900/80 border-zinc-700/80 text-white hover:border-amber-400 hover:bg-zinc-800"
                                        }`}
                                    >
                                        <span className="text-xl sm:text-2xl font-black">{deg}°</span>
                                        <span className="text-[10px] uppercase font-bold mt-0.5 opacity-80">
                                            {deg === 0 ? "Recto ⬆️" : deg === 45 ? "Diagonal ↗️" : "Escuadra ➡️"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* BALANZA VISUAL DE ENERGÍA DE PESO (BARRA DE BATERÍA) */}
                    <div className="bg-zinc-950/85 border-2 border-amber-500/30 rounded-3xl p-3.5 sm:p-4 shadow-xl backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-2 text-xs font-black uppercase text-zinc-300">
                            <span className="flex items-center gap-1 text-amber-300">
                                <Lightning size={16} weight="fill" />
                                Reparto de Peso
                            </span>
                            <span className="text-[11px] font-black text-amber-400">
                                {currentStance.frontWeight}% / {currentStance.backWeight}%
                            </span>
                        </div>

                        {/* Barra dual con animación */}
                        <div className="h-6 w-full bg-zinc-900 rounded-xl overflow-hidden flex border border-zinc-700 shadow-inner">
                            <motion.div
                                animate={{ width: `${currentStance.frontWeight}%` }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full flex items-center justify-center text-[10px] font-black text-zinc-950 shadow-sm"
                            >
                                Adelante {currentStance.frontWeight}%
                            </motion.div>
                            <motion.div
                                animate={{ width: `${currentStance.backWeight}%` }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full flex items-center justify-center text-[10px] font-black text-white shadow-sm"
                            >
                                Atrás {currentStance.backWeight}%
                            </motion.div>
                        </div>
                    </div>

                    {/* BOTÓN DE ACCIÓN / CONFIRMAR POSTURA */}
                    {selectedAngle !== null && (
                        <AnimatePresence>
                            {isAngleCorrect ? (
                                <motion.button
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    onClick={handleConfirmStep}
                                    type="button"
                                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-2xl text-sm sm:text-base shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 transition-transform active:scale-95 animate-pulse"
                                >
                                    <span>¡CONFIRMAR POSTURA! 🥋</span>
                                    <ArrowRight size={18} weight="bold" />
                                </motion.button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-2.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-center text-xs text-rose-200 font-bold"
                                >
                                    <span>Ángulo incorrecto. Prueba con {currentStance.correctAngle}° para {currentStance.name.split("-")[0]}.</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}

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
                                ¡Conoces los ángulos exactos y el equilibrio perfecto en el tatami!
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
