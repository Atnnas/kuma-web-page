"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { didacticSound } from "@/lib/didacticSound";
import { Question } from "@/types/didactica";
import {
    CheckCircle,
    XCircle,
    ArrowCounterClockwise,
    ShieldCheck,
    ArrowRight,
    Sparkle,
    Lightning,
    HandFist,
    Trophy,
} from "@phosphor-icons/react";

interface SundomeTimingQuestionProps {
    question: Question;
    onCompleted: () => void;
    onCheckAndNext?: () => void;
    isSuperAdmin?: boolean;
}

// Rangos de la barra (0 a 100)
// Zona Azul (Falta de Kime): 0% - 69%
// Zona Dorada (Sundome milimétrico - 2 cm): 70% - 88%
// Zona Roja (Contacto excesivo): 89% - 100%
const SUNDOME_MIN = 70;
const SUNDOME_MAX = 88;

export function SundomeTimingQuestion({
    question,
    onCompleted,
    onCheckAndNext,
    isSuperAdmin = false,
}: SundomeTimingQuestionProps) {
    // Estado del juego
    const [progress, setProgress] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [isRunning, setIsRunning] = useState(true);
    const [outcome, setOutcome] = useState<"idle" | "too_early" | "perfect" | "too_late">("idle");
    const [stoppedValue, setStoppedValue] = useState<number | null>(null);
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [attemptsCount, setAttemptsCount] = useState(0);

    const animationFrameRef = useRef<number | null>(null);
    const lastTimestampRef = useRef<number | null>(null);

    // Animación continua de la barra de energía
    const updateProgress = useCallback((timestamp: number) => {
        if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
        const delta = timestamp - lastTimestampRef.current;
        lastTimestampRef.current = timestamp;

        // Velocidad agradable: recorre 0-100 en aprox 1.1 segundos
        const speed = 0.085;

        setProgress((prev) => {
            let next = prev + direction * speed * delta;
            if (next >= 100) {
                next = 100;
                setDirection(-1);
            } else if (next <= 0) {
                next = 0;
                setDirection(1);
            }
            return next;
        });

        animationFrameRef.current = requestAnimationFrame(updateProgress);
    }, [direction]);

    useEffect(() => {
        if (isRunning) {
            lastTimestampRef.current = null;
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        } else if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isRunning, updateProgress]);

    // Detener la técnica (freno de Sundome)
    const handleStop = () => {
        if (!isRunning || outcome !== "idle") return;

        setIsRunning(false);
        const finalVal = Math.round(progress);
        setStoppedValue(finalVal);
        setAttemptsCount((prev) => prev + 1);

        if (finalVal >= SUNDOME_MIN && finalVal <= SUNDOME_MAX) {
            // ¡ACIERTO EN LA ZONA DORADA!
            setOutcome("perfect");
            didacticSound.playStreak();
            confetti({
                particleCount: 80,
                spread: 80,
                origin: { y: 0.6 },
                colors: ["#FFC800", "#58CC02", "#FFFFFF", "#F59E0B"],
            });

            setTimeout(() => {
                setShowSuccessCard(true);
                onCompleted();
            }, 800);
        } else if (finalVal < SUNDOME_MIN) {
            // Muy temprano
            setOutcome("too_early");
            didacticSound.playWrong();
        } else {
            // Muy tarde (contacto)
            setOutcome("too_late");
            didacticSound.playWrong();
        }
    };

    // Reintentar la técnica
    const handleRetry = () => {
        didacticSound.playClick();
        setOutcome("idle");
        setStoppedValue(null);
        setShowSuccessCard(false);
        setProgress(0);
        setDirection(1);
        setIsRunning(true);
    };

    // Atajo de teclado (barra espaciadora)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                if (isRunning) {
                    handleStop();
                } else if (outcome === "too_early" || outcome === "too_late") {
                    handleRetry();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isRunning, outcome]);

    return (
        <div className="w-full flex flex-col items-center select-none">
            {/* GUÍA BREVE (OCULTA EN MOBILE: en móviles solo queda el título principal sin textos largos) */}
            <div className="hidden md:block w-full max-w-3xl mb-3 text-center">
                <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Detén la técnica en la <strong className="text-amber-300 font-bold">Zona Dorada</strong> a 2 cm del blanco para demostrar autocontrol sin lesionar.
                </p>
            </div>

            {/* ESCENARIO VISUAL PRINCIPAL */}
            <div className="w-full max-w-3xl relative rounded-3xl overflow-hidden border-2 border-amber-400/40 bg-zinc-950 shadow-[0_10px_40px_rgba(0,0,0,0.85)]">
                {/* ILUSTRACIÓN 3D OFICIAL */}
                <div className="relative w-full aspect-[16/9] min-h-[220px] sm:min-h-[300px] md:min-h-[360px] overflow-hidden bg-black">
                    <Image
                        src="/images/didactic/kuma_pixar_ikken_hissatsu.jpg"
                        alt="Demostración marcial de Ikken Hissatsu y Sundome"
                        fill
                        className="object-cover object-center"
                        priority
                    />

                    {/* Velo sutil inferior para contraste */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                    {/* ANILLO DE ENERGÍA Y SHOCKWAVE EN EL BLANCO */}
                    <div className="absolute right-[16%] sm:right-[18%] md:right-[20%] top-[40%] sm:top-[38%] -translate-y-1/2 pointer-events-none">
                        <AnimatePresence>
                            {outcome === "perfect" && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: [1, 1.35, 1.2], opacity: [0.8, 1, 0.9] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    className="relative flex items-center justify-center"
                                >
                                    <div className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border-4 border-amber-300/90 shadow-[0_0_50px_rgba(250,204,21,0.8)] ring-4 ring-yellow-400/40" />
                                    <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl" />
                                    <span className="absolute px-3 py-1 rounded-full bg-black/90 border border-yellow-400 text-yellow-300 font-serif font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl whitespace-nowrap">
                                        寸止め • SUNDOME (2 CM)
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ALERTA DE CONTACTO EN ZONA ROJA */}
                    <AnimatePresence>
                        {outcome === "too_late" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-red-950/60 backdrop-blur-[2px] flex items-center justify-center p-4"
                            >
                                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/95 border-2 border-red-500 text-center max-w-sm shadow-2xl">
                                    <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400 mx-auto mb-2">
                                        <XCircle className="w-7 h-7" weight="fill" />
                                    </div>
                                    <h4 className="text-white font-serif font-black text-base uppercase tracking-wider">
                                        ¡Contacto Excesivo!
                                    </h4>
                                    <p className="text-xs text-rose-200 mt-1 leading-relaxed">
                                        Sin autocontrol el golpe habría lesionado al compañero. El verdadero cinturón negro frena a milímetros de la piel.
                                    </p>
                                    <button
                                        onClick={handleRetry}
                                        className="mt-3.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5 mx-auto"
                                    >
                                        <ArrowCounterClockwise className="w-4 h-4" weight="bold" />
                                        <span>Reintentar con Autocontrol</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ALERTA DE FRENO PREMATURO EN ZONA AZUL */}
                    <AnimatePresence>
                        {outcome === "too_early" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-blue-950/60 backdrop-blur-[2px] flex items-center justify-center p-4"
                            >
                                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/95 border-2 border-blue-500 text-center max-w-sm shadow-2xl">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400 mx-auto mb-2">
                                        <Lightning className="w-7 h-7" weight="fill" />
                                    </div>
                                    <h4 className="text-white font-serif font-black text-base uppercase tracking-wider">
                                        Freno Prematuro (Sin Kime)
                                    </h4>
                                    <p className="text-xs text-blue-200 mt-1 leading-relaxed">
                                        Frenaste a más de 5 cm de distancia. En Ikken Hissatsu se exige decisión, velocidad y extensión completa de la técnica.
                                    </p>
                                    <button
                                        onClick={handleRetry}
                                        className="mt-3.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5 mx-auto"
                                    >
                                        <ArrowCounterClockwise className="w-4 h-4" weight="bold" />
                                        <span>Reintentar Golpe</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* MODAL DE VICTORIA Y ENSEÑANZA MARCIAL */}
                    <AnimatePresence>
                        {showSuccessCard && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-30"
                            >
                                <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#1C2E18] via-zinc-950 to-black border-2 border-emerald-400 shadow-[0_0_50px_rgba(88,204,2,0.4)] text-center max-w-md w-full relative overflow-hidden">
                                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 mx-auto mb-3 shadow-[0_0_20px_rgba(88,204,2,0.3)]">
                                        <Trophy className="w-8 h-8 text-yellow-300" weight="fill" />
                                    </div>

                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 block mb-1">
                                        ¡Maestría en Sundome Alcanzada!
                                    </span>

                                    <h4 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight">
                                        El Poder de Ikken Hissatsu
                                    </h4>

                                    <p className="text-xs text-emerald-100 mt-2.5 leading-relaxed">
                                        Has demostrado la virtud más alta del Karate-Do: <strong className="text-yellow-300 font-bold">la fuerza total dominada por el autocontrol</strong>. Entregaste el 100% de tu energía pero frenaste a 2 cm de tu compañero para proteger su salud.
                                    </p>

                                    <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                                        {onCheckAndNext && (
                                            <button
                                                onClick={onCheckAndNext}
                                                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] text-white font-black text-xs uppercase tracking-widest border-b-4 border-[#46A302] active:translate-y-0.5 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <span>Avanzar al Siguiente Desafío</span>
                                                <ArrowRight className="w-4 h-4" weight="bold" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ========================================================= */}
                {/* LA BARRA DE ENERGÍA Y TIMING MARCIAL                     */}
                {/* ========================================================= */}
                <div className="p-4 sm:p-6 bg-[#0E1626] border-t-2 border-white/10">
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="text-blue-300 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                            Velocidad Inicial
                        </span>

                        <span className="text-amber-300 font-black uppercase tracking-wider flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 shadow-sm animate-pulse">
                            <Sparkle className="w-3.5 h-3.5 text-yellow-400" weight="fill" />
                            Zona Dorada de Sundome (2 cm)
                        </span>

                        <span className="text-red-400 flex items-center gap-1">
                            Contacto
                            <span className="w-2 h-2 rounded-full bg-red-400" />
                        </span>
                    </div>

                    {/* Pista de la barra */}
                    <div className="relative w-full h-8 sm:h-10 rounded-2xl bg-zinc-950 border-2 border-white/20 p-1 shadow-inner overflow-hidden">
                        {/* Franjas coloreadas de fondo */}
                        <div className="absolute inset-y-0 left-0 w-[70%] bg-blue-950/40 border-r border-blue-500/30" />
                        <div className="absolute inset-y-0 left-[70%] w-[18%] bg-gradient-to-r from-amber-500/40 via-yellow-400/50 to-amber-500/40 border-x-2 border-yellow-400/80 shadow-[0_0_15px_rgba(250,204,21,0.3)]" />
                        <div className="absolute inset-y-0 right-0 w-[12%] bg-red-950/40 border-l border-red-500/30" />

                        {/* Relleno dinámico de energía */}
                        <motion.div
                            className={`h-full rounded-xl transition-colors duration-75 ${
                                progress >= SUNDOME_MIN && progress <= SUNDOME_MAX
                                    ? "bg-gradient-to-r from-amber-500 to-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.8)]"
                                    : progress > SUNDOME_MAX
                                    ? "bg-gradient-to-r from-red-600 to-rose-400"
                                    : "bg-gradient-to-r from-blue-600 to-cyan-400"
                            }`}
                            style={{ width: `${progress}%` }}
                        />

                        {/* Aguja / Marcador de precisión */}
                        <div
                            className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_#FFFFFF] rounded-full -translate-x-1/2 pointer-events-none"
                            style={{ left: `${progress}%` }}
                        />
                    </div>

                    {/* BOTÓN 3D DE FRENO MILIMÉTRICO */}
                    <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-left text-[11px] text-slate-400 hidden sm:block">
                            <span>💡 Toca el botón cuando la aguja cruce la </span>
                            <strong className="text-amber-300">Zona Dorada</strong>
                            <span> o presiona la barra espaciadora.</span>
                        </div>

                        {/* Botón táctil grande Duolingo */}
                        <button
                            type="button"
                            disabled={!isRunning}
                            onClick={handleStop}
                            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all select-none shadow-xl flex items-center justify-center gap-2.5 cursor-pointer ${
                                isRunning
                                    ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 shadow-[0_0_25px_rgba(245,158,11,0.4)]"
                                    : "bg-zinc-800 text-zinc-500 border-b-4 border-zinc-900 cursor-not-allowed"
                            }`}
                        >
                            <HandFist className="w-5 h-5 text-zinc-950" weight="fill" />
                            <span>¡FRENAR GOLPE (SUNDOME)!</span>
                        </button>

                        {/* SuperAdmin Quick bypass */}
                        {isSuperAdmin && !showSuccessCard && (
                            <button
                                type="button"
                                onClick={() => {
                                    setProgress(78);
                                    setIsRunning(false);
                                    setOutcome("perfect");
                                    setShowSuccessCard(true);
                                    onCompleted();
                                }}
                                className="text-[10px] text-amber-400/80 hover:text-amber-300 underline cursor-pointer"
                            >
                                [Admin: Auto-Completar]
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
