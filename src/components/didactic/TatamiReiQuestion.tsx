"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types/didactica";
import { didacticSound } from "@/lib/didacticSound";
import confetti from "canvas-confetti";
import {
    SpeakerHigh,
    SpeakerSlash,
    ArrowCounterClockwise,
    CheckCircle,
    Trophy,
    ArrowRight,
    Sparkle,
    HandPointing,
} from "@phosphor-icons/react";

interface TatamiReiQuestionProps {
    question: Question;
    onCompleted: () => void;
    onCheckAndNext?: () => void;
    isSuperAdmin?: boolean;
}

export function TatamiReiQuestion({
    question,
    onCompleted,
    onCheckAndNext,
    isSuperAdmin = false,
}: TatamiReiQuestionProps) {
    // 3 pasos exactos:
    // 1. Pararse al borde del tatami con la mano levantada
    // 2. Decir "¡Oss Sensei!"
    // 3. Hacer Rei (reverencia) y recibir aprobación del Sensei/Senpai para entrar
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
    const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);

    // Estados de avance
    const [isStep1Done, setIsStep1Done] = useState(false);
    const [isStep2Done, setIsStep2Done] = useState(false);
    const [isStep3Done, setIsStep3Done] = useState(false);

    // Reverencia en paso 3
    const [bowAngle, setBowAngle] = useState(0);
    const [isAutoBowing, setIsAutoBowing] = useState(false);

    // Sello Hanko y Victoria
    const [hasStampedHanko, setHasStampedHanko] = useState(false);

    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Web Audio: Pisada firme en borde del tatami ("Tak")
    const playWoodStepSound = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(240, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);

            const snap = ctx.createOscillator();
            const snapGain = ctx.createGain();
            snap.type = "sine";
            snap.frequency.setValueAtTime(800, now);
            snap.frequency.exponentialRampToValueAtTime(140, now + 0.07);
            snapGain.gain.setValueAtTime(0.15, now);
            snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            snap.connect(snapGain);
            snapGain.connect(ctx.destination);
            snap.start(now);
            snap.stop(now + 0.07);
        } catch {
            // Silencio seguro
        }
    }, []);

    // Web Audio: Campana Zen (528Hz, 1056Hz, 1584Hz)
    const playZenBell = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;
            [528, 1056, 1584].forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(idx === 0 ? 0.22 : 0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 1.8);
            });
        } catch {
            // Silencio seguro
        }
    }, []);

    // Web Audio: Kiai y pronunciación oficial en japonés "Oss Sensei"
    const playOssKiaiSound = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;

            const bass = ctx.createOscillator();
            const bassGain = ctx.createGain();
            bass.type = "triangle";
            bass.frequency.setValueAtTime(340, now);
            bass.frequency.exponentialRampToValueAtTime(60, now + 0.35);
            bassGain.gain.setValueAtTime(0.45, now);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            bass.connect(bassGain);
            bassGain.connect(ctx.destination);
            bass.start(now);
            bass.stop(now + 0.35);

            const ping = ctx.createOscillator();
            const pingGain = ctx.createGain();
            ping.type = "sine";
            ping.frequency.setValueAtTime(1400, now + 0.02);
            ping.frequency.exponentialRampToValueAtTime(528, now + 0.8);
            pingGain.gain.setValueAtTime(0.2, now + 0.02);
            pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            ping.connect(pingGain);
            pingGain.connect(ctx.destination);
            ping.start(now + 0.02);
            ping.stop(now + 0.8);
        } catch {
            // Silencio seguro
        }

        // Voz nativa en japonés: "Oss Sensei" (押忍 先生)
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            try {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance("押忍 先生");
                utter.lang = "ja-JP";
                utter.rate = 0.95;
                utter.pitch = 1.05;
                window.speechSynthesis.speak(utter);
            } catch {
                // Speech fallback
            }
        }
    }, []);

    // Voz didáctica en español (solo activa si el usuario pulsa el botón Voz)
    const speakSpanish = useCallback((text: string) => {
        if (!isVoiceActive || typeof window === "undefined" || !("speechSynthesis" in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = "es-ES";
            utter.rate = 0.92;
            utter.pitch = 1.0;
            speechRef.current = utter;
            window.speechSynthesis.speak(utter);
        } catch {
            // Speech fallback
        }
    }, [isVoiceActive]);

    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // PASO 1: Pararse al borde del tatami con la mano levantada
    const handleStep1 = () => {
        if (isStep1Done) return;
        setIsStep1Done(true);
        playWoodStepSound();
        speakSpanish("Paso 1 completado. Te paras al borde del tatami con la mano levantada pidiendo permiso.");

        setTimeout(() => {
            playZenBell();
            setCurrentStep(2);
            speakSpanish("Paso 2. Saluda con energía diciendo: ¡Oss Sensei!");
        }, 900);
    };

    // PASO 2: Decir "¡Oss Sensei!"
    const handleStep2 = () => {
        if (isStep2Done) return;
        setIsStep2Done(true);
        playOssKiaiSound();
        speakSpanish("¡Oss Sensei!");

        setTimeout(() => {
            playZenBell();
            setCurrentStep(3);
            speakSpanish("Paso 3. Realiza la reverencia formal Rei inclinando el torso a 30 grados.");
        }, 1100);
    };

    // PASO 3: Hacer Rei (reverencia formal a 30°)
    const handleStep3 = () => {
        if (isAutoBowing || isStep3Done) return;
        setIsAutoBowing(true);
        playWoodStepSound();

        let current = 0;
        const interval = setInterval(() => {
            current += 3;
            if (current >= 30) {
                current = 30;
                setBowAngle(30);
                clearInterval(interval);
                setIsAutoBowing(false);
                setIsStep3Done(true);
                playZenBell();

                setTimeout(() => {
                    // PASO 4: Aprobación del Sensei/Senpai para ingresar al tatami
                    setCurrentStep(4);
                    setHasStampedHanko(true);
                    didacticSound.playCorrect();

                    confetti({
                        particleCount: 90,
                        spread: 80,
                        origin: { y: 0.6 },
                        colors: ["#2563EB", "#DC2626", "#F59E0B", "#FFFFFF"],
                    });

                    onCompleted();
                    speakSpanish("¡Aprobado por el Sensei! Puedes ingresar con honor y disciplina al tatami.");
                }, 800);
            } else {
                setBowAngle(current);
            }
        }, 30);
    };

    // Reiniciar
    const handleReset = () => {
        setCurrentStep(1);
        setIsStep1Done(false);
        setIsStep2Done(false);
        setIsStep3Done(false);
        setBowAngle(0);
        setHasStampedHanko(false);
        didacticSound.playClick();
    };

    return (
        <div className="w-full flex flex-col items-center select-none pb-4">
            {/* ESCENARIO COMPLETO: IMAGEN DE 3 PANELES SECUENCIALES */}
            <div className="w-full max-w-4xl rounded-3xl overflow-hidden border-2 border-blue-500/50 bg-slate-950 shadow-[0_12px_45px_rgba(0,0,0,0.85)] flex flex-col">
                {/* 1. VISOR TRIPTYCH (DIVIDIDO EN 3 PANELES) */}
                <div className="relative w-full aspect-[16/9] min-h-[240px] sm:min-h-[340px] md:min-h-[420px] overflow-hidden bg-slate-950">
                    <Image
                        src="/images/didactic/kuma_tatami_3_steps.jpg"
                        alt="1. Mano levantada al borde, 2. Decir Oss Sensei, 3. Reverencia Rei y aprobación para entrar al tatami WKF"
                        fill
                        priority
                        unoptimized
                        className="object-cover object-center"
                    />

                    {/* Velo sutil superior e inferior para máxima legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/50 pointer-events-none" />

                    {/* RESALTADO VISUAL ACTIVO SOBRE CADA UNO DE LOS 3 PANELES */}
                    <div className="absolute inset-0 grid grid-cols-3 pointer-events-none z-10">
                        {/* Panel 1 Overlay */}
                        <div
                            className={`h-full border-r border-white/20 transition-all duration-300 ${
                                currentStep === 1
                                    ? "bg-amber-400/15 ring-4 ring-inset ring-amber-400"
                                    : "opacity-40 bg-black/30"
                            }`}
                        />
                        {/* Panel 2 Overlay */}
                        <div
                            className={`h-full border-r border-white/20 transition-all duration-300 ${
                                currentStep === 2
                                    ? "bg-amber-400/15 ring-4 ring-inset ring-amber-400"
                                    : "opacity-40 bg-black/30"
                            }`}
                        />
                        {/* Panel 3 Overlay */}
                        <div
                            className={`h-full transition-all duration-300 ${
                                currentStep === 3 || currentStep === 4
                                    ? "bg-emerald-400/15 ring-4 ring-inset ring-emerald-400"
                                    : "opacity-40 bg-black/30"
                            }`}
                        />
                    </div>

                    {/* BADGE SUPERIOR IZQUIERDO */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
                        <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-blue-400/60 text-xs sm:text-sm font-black text-blue-300 flex items-center gap-2 shadow-lg">
                            <Sparkle className="w-4 h-4 text-blue-400" weight="fill" />
                            <span>Protocolo WKF • Entrada al Tatami</span>
                        </div>
                    </div>

                    {/* CONTROLES SUPERIORES DERECHOS (VOZ, REINICIAR, SUPERADMIN) */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
                        {/* Botón Voz (OFF por defecto) */}
                        <button
                            type="button"
                            onClick={() => {
                                const next = !isVoiceActive;
                                setIsVoiceActive(next);
                                if (next) {
                                    speakSpanish("Voz activada. Paso 1: Párate al borde del tatami con la mano levantada.");
                                } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
                                    window.speechSynthesis.cancel();
                                }
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md backdrop-blur-md ${
                                isVoiceActive
                                    ? "bg-amber-500 text-slate-950 font-black shadow-amber-500/25"
                                    : "bg-slate-950/85 text-slate-200 hover:text-white border border-slate-700"
                            }`}
                            title="Voz didáctica"
                        >
                            {isVoiceActive ? <SpeakerHigh className="w-4 h-4" weight="bold" /> : <SpeakerSlash className="w-4 h-4" weight="bold" />}
                            <span>{isVoiceActive ? "Voz: ON" : "Voz: OFF"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="p-2 rounded-xl bg-slate-950/85 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition-all"
                            title="Reiniciar ritual"
                        >
                            <ArrowCounterClockwise className="w-4 h-4" weight="bold" />
                        </button>

                        {isSuperAdmin && (
                            <button
                                type="button"
                                onClick={() => {
                                    onCompleted();
                                    if (onCheckAndNext) onCheckAndNext();
                                }}
                                className="px-3 py-1.5 bg-purple-900/90 hover:bg-purple-800 text-purple-200 text-xs sm:text-sm font-bold rounded-xl border border-purple-500/50 backdrop-blur-md shadow-sm"
                            >
                                ⚡ Omitir
                            </button>
                        )}
                    </div>

                    {/* SELLO HANKO DE APROBACIÓN CUANDO SE COMPLETA */}
                    <AnimatePresence>
                        {hasStampedHanko && (
                            <motion.div
                                initial={{ scale: 3, opacity: 0, rotate: -25 }}
                                animate={{ scale: 1, opacity: 1, rotate: -6 }}
                                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                                className="absolute bottom-5 right-5 z-30 pointer-events-none"
                            >
                                <div className="w-28 h-28 sm:w-36 sm:h-36 border-4 border-red-600 bg-red-700/95 text-white rounded-2xl flex flex-col items-center justify-center p-2 shadow-[0_0_40px_rgba(220,38,38,0.9)] backdrop-blur-sm select-none">
                                    <div className="border border-red-300/60 w-full h-full rounded-xl flex flex-col items-center justify-center p-1">
                                        <span className="text-[11px] font-black tracking-widest text-red-200 uppercase">APROBADO</span>
                                        <span className="text-3xl sm:text-4xl font-black font-serif my-0.5 tracking-wider text-red-100 drop-shadow">礼</span>
                                        <span className="text-[10px] font-bold text-red-200 tracking-wider">DOJO KUN</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* BADGE INFORMATIVO INFERIOR */}
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs sm:text-sm font-bold text-slate-200">
                        Tatami Oficial WKF • Borde Rojo & Centro Azul
                    </div>
                </div>

                {/* 2. BARRA DE ESTADO DE LOS 3 PASOS (TEXTO GRANDE Y LEGIBLE) */}
                <div className="w-full bg-slate-900 border-t border-b border-slate-800 grid grid-cols-3 p-2.5 gap-2 text-center">
                    {/* Paso 1 */}
                    <div
                        onClick={() => {
                            if (isStep1Done) setCurrentStep(1);
                        }}
                        className={`p-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            currentStep === 1
                                ? "bg-amber-500/25 text-amber-300 border-2 border-amber-500 shadow-md ring-2 ring-amber-500/30"
                                : isStep1Done
                                ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/40"
                                : "text-slate-500 bg-slate-950/40 border border-slate-800"
                        }`}
                    >
                        <span className="w-6 h-6 rounded-full flex items-center justify-center bg-black/50 text-xs font-black">
                            {isStep1Done ? "✓" : "1"}
                        </span>
                        <span className="truncate">1. Mano Levantada</span>
                    </div>

                    {/* Paso 2 */}
                    <div
                        onClick={() => {
                            if (isStep1Done) setCurrentStep(2);
                        }}
                        className={`p-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
                            isStep1Done ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                        } ${
                            currentStep === 2
                                ? "bg-amber-500/25 text-amber-300 border-2 border-amber-500 shadow-md ring-2 ring-amber-500/30"
                                : isStep2Done
                                ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/40"
                                : "text-slate-500 bg-slate-950/40 border border-slate-800"
                        }`}
                    >
                        <span className="w-6 h-6 rounded-full flex items-center justify-center bg-black/50 text-xs font-black">
                            {isStep2Done ? "✓" : "2"}
                        </span>
                        <span className="truncate">2. Decir Oss Sensei</span>
                    </div>

                    {/* Paso 3 */}
                    <div
                        onClick={() => {
                            if (isStep2Done) setCurrentStep(3);
                        }}
                        className={`p-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
                            isStep2Done ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                        } ${
                            currentStep === 3 || currentStep === 4
                                ? "bg-emerald-500/25 text-emerald-300 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/30"
                                : "text-slate-500 bg-slate-950/40 border border-slate-800"
                        }`}
                    >
                        <span className="w-6 h-6 rounded-full flex items-center justify-center bg-black/50 text-xs font-black">
                            {isStep3Done ? "✓" : "3"}
                        </span>
                        <span className="truncate">3. Hacer Rei</span>
                    </div>
                </div>

                {/* 3. CONSOLA INTERACTIVA INFERIOR (LETRAS GRANDES, CLARAS Y BOTONES PROMINENTES) */}
                <div className="w-full p-5 sm:p-7 bg-slate-950 flex flex-col justify-center min-h-[190px]">
                    {/* PASO 1 */}
                    {currentStep === 1 && (
                        <div className="flex flex-col items-center text-center">
                            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs uppercase tracking-wider mb-2 border border-amber-500/40">
                                Paso 1 de 3
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                                1. Pararse al borde del tatami con la mano levantada
                            </h3>
                            <p className="text-sm sm:text-base text-slate-200 max-w-xl mb-5 leading-relaxed font-medium">
                                Te detienes exactamente en la línea roja del tatami WKF y levantas la mano derecha abierta en señal de saludo y solicitando permiso para ingresar.
                            </p>

                            <button
                                type="button"
                                onClick={handleStep1}
                                disabled={isStep1Done}
                                className={`w-full max-w-lg py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 cursor-pointer ${
                                    isStep1Done
                                        ? "bg-emerald-600 text-white cursor-default"
                                        : "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25"
                                }`}
                            >
                                {isStep1Done ? (
                                    <>
                                        <CheckCircle className="w-6 h-6 text-white" weight="fill" />
                                        <span>¡Mano levantada en el borde!</span>
                                    </>
                                ) : (
                                    <>
                                        <HandPointing className="w-6 h-6 text-slate-950" weight="fill" />
                                        <span>✋ 1. Pararse al Borde con Mano Levantada</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* PASO 2 */}
                    {currentStep === 2 && (
                        <div className="flex flex-col items-center text-center">
                            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs uppercase tracking-wider mb-2 border border-amber-500/40">
                                Paso 2 de 3
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                                2. Saludar con energía: <span className="text-amber-400">¡Oss Sensei!</span>
                            </h3>
                            <p className="text-sm sm:text-base text-slate-200 max-w-xl mb-5 leading-relaxed font-medium">
                                Con la mano alzada y mirando hacia el maestro y el tatami, exclamas con convicción y respeto marcial el saludo tradicional.
                            </p>

                            <motion.button
                                type="button"
                                onClick={handleStep2}
                                disabled={isStep2Done}
                                whileHover={{ scale: isStep2Done ? 1 : 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className={`w-full max-w-lg py-4 px-6 rounded-2xl font-black text-lg sm:text-xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-2xl cursor-pointer ${
                                    isStep2Done
                                        ? "bg-emerald-600 text-white border-2 border-emerald-400 cursor-default"
                                        : "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 border-2 border-amber-300 shadow-amber-500/30 animate-pulse"
                                }`}
                            >
                                <span>🥋</span>
                                <span>{isStep2Done ? "¡OSS SENSEI! (DICHO)" : "🥋 2. Decir: ¡OSS SENSEI!"}</span>
                                <span>🥋</span>
                            </motion.button>
                        </div>
                    )}

                    {/* PASO 3 */}
                    {currentStep === 3 && (
                        <div className="flex flex-col items-center text-center">
                            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs uppercase tracking-wider mb-2 border border-amber-500/40">
                                Paso 3 de 3
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                                3. Hacer <span className="text-amber-400">Rei (Reverencia de Respeto)</span>
                            </h3>
                            <p className="text-sm sm:text-base text-slate-200 max-w-xl mb-4 leading-relaxed font-medium">
                                Inclinamos el torso con la espalda recta a 30° en reverencia formal. Esperamos la aprobación del Sensei o Senpai para ingresar al tatami.
                            </p>

                            {/* Medidor de ángulo visual */}
                            <div className="w-full max-w-md mb-4 flex items-center gap-3">
                                <span className="text-xs sm:text-sm font-bold text-slate-400">0°</span>
                                <div className="flex-1 h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            bowAngle >= 28 ? "bg-emerald-400" : "bg-amber-400"
                                        }`}
                                        style={{ width: `${(bowAngle / 30) * 100}%` }}
                                    />
                                </div>
                                <span className={`text-xs sm:text-sm font-black ${bowAngle >= 28 ? "text-emerald-400" : "text-amber-400"}`}>
                                    {bowAngle}° / 30°
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleStep3}
                                disabled={isAutoBowing || isStep3Done}
                                className={`w-full max-w-lg py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 cursor-pointer ${
                                    isStep3Done
                                        ? "bg-emerald-600 text-white cursor-default"
                                        : "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25"
                                }`}
                            >
                                {isStep3Done ? (
                                    <>
                                        <CheckCircle className="w-6 h-6 text-white" weight="fill" />
                                        <span>¡Reverencia Rei Completada!</span>
                                    </>
                                ) : (
                                    <>
                                        <HandPointing className="w-6 h-6 text-slate-950" weight="fill" />
                                        <span>{isAutoBowing ? "Inclinando torso..." : "🙇 3. Hacer Reverencia Rei (30°)"}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* PASO 4: APROBACIÓN DEL SENSEI Y ENTRADA AL TATAMI */}
                    {currentStep === 4 && (
                        <div className="flex flex-col items-center text-center">
                            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs uppercase tracking-wider mb-2 border border-emerald-500/40">
                                ¡Aprobación Concedida!
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                                ¡El Sensei y Senpai han aprobado tu entrada!
                            </h3>
                            <p className="text-sm sm:text-base text-slate-200 max-w-xl mb-5 leading-relaxed font-medium">
                                Has cumplido el protocolo con honor: mano levantada al borde, el saludo <strong className="text-amber-400">¡Oss Sensei!</strong> y la reverencia <strong className="text-emerald-400">Rei</strong>. ¡Puedes entrar al tatami!
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    if (onCheckAndNext) onCheckAndNext();
                                }}
                                className="w-full max-w-lg py-4 px-6 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/25 cursor-pointer active:scale-95"
                            >
                                <span>🥋 Entrar al Tatami • Continuar</span>
                                <ArrowRight className="w-6 h-6" weight="bold" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
