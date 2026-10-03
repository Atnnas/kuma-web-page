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
    // 3 pasos del ritual: 1. Musubi-dachi (45°), 2. Rei (30°), 3. ¡Oss Sensei!
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);

    // Progreso
    const [isStep1Done, setIsStep1Done] = useState(false);
    const [isStep2Done, setIsStep2Done] = useState(false);
    const [isStep3Done, setIsStep3Done] = useState(false);

    // Paso 1
    const [feetAligned, setFeetAligned] = useState(false);

    // Paso 2
    const [bowAngle, setBowAngle] = useState(0);
    const [isAutoBowing, setIsAutoBowing] = useState(false);

    // Paso 3
    const [hasStampedHanko, setHasStampedHanko] = useState(false);
    const [showVictory, setShowVictory] = useState(false);

    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Web Audio: Sonido sordo y firme de pisada en tatami
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

    // Web Audio: Impacto Kiai + pronunciación "Oss Sensei" en japonés
    const playOssKiaiSound = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;

            // Onda de choque marcial
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

            // Resonancia de campana marcial
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

    // Voz didáctica en español (solo activa si el usuario activa el botón Voz)
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

    // Paso 1: Juntar talones en Musubi-dachi
    const handleAlignFeet = () => {
        if (feetAligned) return;
        setFeetAligned(true);
        playWoodStepSound();
        setIsStep1Done(true);

        speakSpanish("Paso 1 completado. Talones unidos a 45 grados en Musubi dachi.");

        setTimeout(() => {
            playZenBell();
            setCurrentStep(2);
            speakSpanish("Paso 2. Inclina el torso a 30 grados con la espalda recta.");
        }, 1000);
    };

    // Paso 2: Reverencia a 30°
    const handlePerformBow = () => {
        if (isAutoBowing || isStep2Done) return;
        setIsAutoBowing(true);
        playWoodStepSound();

        let current = 0;
        const interval = setInterval(() => {
            current += 2;
            if (current >= 30) {
                current = 30;
                setBowAngle(30);
                clearInterval(interval);
                setIsAutoBowing(false);
                setIsStep2Done(true);
                playZenBell();
                speakSpanish("Reverencia impecable a 30 grados. Ahora saluda con convicción.");

                setTimeout(() => {
                    setCurrentStep(3);
                    speakSpanish("Paso 3. Presiona el botón dorado y exclama: ¡Oss Sensei!");
                }, 1000);
            } else {
                setBowAngle(current);
            }
        }, 35);
    };

    // Paso 3: Kiai de cortesía "¡OSS SENSEI!"
    const handleOssSensei = () => {
        if (isStep3Done) return;
        setIsStep3Done(true);
        playOssKiaiSound();

        setTimeout(() => {
            setHasStampedHanko(true);
            didacticSound.playCorrect();

            // Confeti marcial WKF (azul, rojo, dorado y blanco)
            confetti({
                particleCount: 85,
                spread: 75,
                origin: { y: 0.6 },
                colors: ["#2563EB", "#DC2626", "#F59E0B", "#FFFFFF"],
            });

            onCompleted();

            setTimeout(() => {
                setShowVictory(true);
                didacticSound.playComplete();
            }, 900);
        }, 350);
    };

    // Reiniciar
    const handleReset = () => {
        setCurrentStep(1);
        setIsStep1Done(false);
        setIsStep2Done(false);
        setIsStep3Done(false);
        setFeetAligned(false);
        setBowAngle(0);
        setHasStampedHanko(false);
        setShowVictory(false);
        didacticSound.playClick();
    };

    return (
        <div className="w-full flex flex-col items-center select-none">
            {/* ESCENARIO COMPLETO VISUAL WKF */}
            <div className="w-full max-w-3xl rounded-3xl overflow-hidden border-2 border-blue-500/50 bg-slate-950 shadow-[0_12px_45px_rgba(0,0,0,0.85)] flex flex-col">
                {/* 1. HERO VIEWPORT: SENSEI KUMA EN TATAMI WKF (AZUL Y ROJO) */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] min-h-[260px] sm:min-h-[340px] md:min-h-[400px] overflow-hidden bg-slate-950">
                    <Image
                        src="/images/didactic/kuma_wkf_tatami_rei.jpg"
                        alt="Sensei Kuma en el Tatami WKF realizando la reverencia Rei de cortesía"
                        fill
                        priority
                        unoptimized
                        className="object-cover object-top"
                    />

                    {/* Velo sutil superior e inferior para legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/40 pointer-events-none" />

                    {/* BADGES FLOTANTES SUPERIORES */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-blue-400/50 text-xs font-bold text-blue-300 flex items-center gap-1.5 shadow-lg">
                            <Sparkle className="w-4 h-4 text-blue-400" weight="fill" />
                            <span>Tatami WKF • Reigi Sahō</span>
                        </div>
                    </div>

                    {/* CONTROLES SUPERIORES FLOTANTES (VOZ, REINICIAR, SUPERADMIN) */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
                        {/* Botón Voz (OFF por defecto) */}
                        <button
                            type="button"
                            onClick={() => {
                                const next = !isVoiceActive;
                                setIsVoiceActive(next);
                                if (next) {
                                    speakSpanish("Voz activada. Al pisar el tatami de competición saludamos con respeto: ¡Oss Sensei!");
                                } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
                                    window.speechSynthesis.cancel();
                                }
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md backdrop-blur-md ${
                                isVoiceActive
                                    ? "bg-amber-500 text-slate-950 font-black shadow-amber-500/25"
                                    : "bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700"
                            }`}
                            title="Voz didáctica"
                        >
                            {isVoiceActive ? <SpeakerHigh className="w-4 h-4" weight="bold" /> : <SpeakerSlash className="w-4 h-4" weight="bold" />}
                            <span>{isVoiceActive ? "Voz: ON" : "Voz: OFF"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="p-2 rounded-xl bg-slate-950/80 text-slate-400 hover:text-white border border-slate-700 backdrop-blur-md transition-all"
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
                                className="px-2.5 py-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-300 text-xs font-bold rounded-xl border border-purple-500/50 backdrop-blur-md shadow-sm"
                            >
                                ⚡ Omitir
                            </button>
                        )}
                    </div>

                    {/* INDICADOR DE ÁNGULO EN PASO 2 */}
                    {currentStep === 2 && (
                        <div className="absolute top-16 left-3 sm:top-16 sm:left-4 z-10 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/60 text-xs font-black text-amber-300 flex items-center gap-2 shadow-xl animate-pulse">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <span>Inclinación Torso: {bowAngle}° / 30°</span>
                        </div>
                    )}

                    {/* SELLO HANKO TRADICIONAL ESTAMPADO EN EL TATAMI */}
                    <AnimatePresence>
                        {hasStampedHanko && (
                            <motion.div
                                initial={{ scale: 3, opacity: 0, rotate: -25 }}
                                animate={{ scale: 1, opacity: 1, rotate: -6 }}
                                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                                className="absolute bottom-6 right-6 z-20 pointer-events-none"
                            >
                                <div className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-red-600 bg-red-700/95 text-white rounded-2xl flex flex-col items-center justify-center p-2 shadow-[0_0_40px_rgba(220,38,38,0.85)] backdrop-blur-sm select-none">
                                    <div className="border border-red-300/60 w-full h-full rounded-xl flex flex-col items-center justify-center p-1">
                                        <span className="text-[10px] font-black tracking-widest text-red-200 uppercase">WKF REIGI</span>
                                        <span className="text-3xl sm:text-4xl font-black font-serif my-0.5 tracking-wider text-red-100 drop-shadow">礼</span>
                                        <span className="text-[9px] font-bold text-red-200 tracking-wider">DOJO KUN</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* BADGE INFORMATIVO INFERIOR */}
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] font-semibold text-slate-300">
                        Área de Competición WKF • Tatami Azul & Borde Rojo
                    </div>
                </div>

                {/* 2. BARRA DE LOS 3 PASOS DEL RITUAL */}
                <div className="w-full bg-slate-900 border-t border-b border-slate-800 grid grid-cols-3 p-2 gap-2 text-center">
                    <div
                        onClick={() => {
                            if (isStep1Done) setCurrentStep(1);
                        }}
                        className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            currentStep === 1
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 ring-1 ring-amber-500/30 font-black"
                                : isStep1Done
                                ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/30"
                                : "text-slate-500"
                        }`}
                    >
                        <span>{isStep1Done ? "✓" : "1."}</span>
                        <span className="truncate">Musubi-dachi</span>
                    </div>

                    <div
                        onClick={() => {
                            if (isStep1Done) setCurrentStep(2);
                        }}
                        className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isStep1Done ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                        } ${
                            currentStep === 2
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 ring-1 ring-amber-500/30 font-black"
                                : isStep2Done
                                ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/30"
                                : "text-slate-500"
                        }`}
                    >
                        <span>{isStep2Done ? "✓" : "2."}</span>
                        <span className="truncate">Rei (30°)</span>
                    </div>

                    <div
                        onClick={() => {
                            if (isStep2Done) setCurrentStep(3);
                        }}
                        className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isStep2Done ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                        } ${
                            currentStep === 3
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 ring-1 ring-amber-500/30 font-black"
                                : isStep3Done
                                ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/30"
                                : "text-slate-500"
                        }`}
                    >
                        <span>{isStep3Done ? "✓" : "3."}</span>
                        <span className="truncate">¡Oss Sensei!</span>
                    </div>
                </div>

                {/* 3. CONSOLA INTERACTIVA INFERIOR (PULCRA, TÁCTIL Y RÁPIDA) */}
                <div className="w-full p-4 sm:p-6 bg-slate-950 flex flex-col justify-center min-h-[160px]">
                    {/* PASO 1: MUSUBI-DACHI */}
                    {currentStep === 1 && (
                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                                Paso 1: Junta los talones en <span className="text-amber-400 font-black">Musubi-dachi (45°)</span>
                            </h3>
                            <p className="text-xs text-slate-300 max-w-lg mb-4">
                                Antes de cruzar la línea roja del tatami WKF, unimos los talones manteniendo las puntas abiertas a 45 grados.
                            </p>

                            <button
                                type="button"
                                onClick={handleAlignFeet}
                                disabled={feetAligned}
                                className={`w-full max-w-md py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
                                    feetAligned
                                        ? "bg-emerald-600 text-white cursor-default"
                                        : "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25"
                                }`}
                            >
                                {feetAligned ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-white" weight="fill" />
                                        <span>¡Talones alineados a 45°!</span>
                                    </>
                                ) : (
                                    <>
                                        <HandPointing className="w-5 h-5 text-slate-950" weight="fill" />
                                        <span>Alinear Talones a 45°</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* PASO 2: REVERENCIA REI A 30° */}
                    {currentStep === 2 && (
                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                                Paso 2: Reverencia formal <span className="text-amber-400 font-black">Rei a 30°</span>
                            </h3>
                            <p className="text-xs text-slate-300 max-w-lg mb-3">
                                Espalda recta, manos al costado del cuerpo y mirada serena y respetuosa hacia el frente.
                            </p>

                            <div className="w-full max-w-md mb-3 flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400">0°</span>
                                <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            bowAngle >= 28 ? "bg-emerald-400" : "bg-amber-400"
                                        }`}
                                        style={{ width: `${(bowAngle / 30) * 100}%` }}
                                    />
                                </div>
                                <span className={`text-xs font-black ${bowAngle >= 28 ? "text-emerald-400" : "text-amber-400"}`}>
                                    {bowAngle}° / 30°
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handlePerformBow}
                                disabled={isAutoBowing || isStep2Done}
                                className={`w-full max-w-md py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
                                    isStep2Done
                                        ? "bg-emerald-600 text-white cursor-default"
                                        : "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25"
                                }`}
                            >
                                {isStep2Done ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-white" weight="fill" />
                                        <span>¡Reverencia a 30° Completa!</span>
                                    </>
                                ) : (
                                    <>
                                        <HandPointing className="w-5 h-5 text-slate-950" weight="fill" />
                                        <span>{isAutoBowing ? "Inclinando torso..." : "Inclinar Torso a 30° (Rei)"}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* PASO 3: EL SALUDO "¡OSS SENSEI!" */}
                    {currentStep === 3 && (
                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                                Paso 3: Saluda con convicción marcial
                            </h3>
                            <p className="text-xs text-slate-300 max-w-lg mb-4">
                                Al entrar al tatami de competición, exclamamos con respeto mutuo y energía: <strong className="text-amber-400">¡Oss Sensei!</strong>
                            </p>

                            <motion.button
                                type="button"
                                onClick={handleOssSensei}
                                disabled={isStep3Done}
                                whileHover={{ scale: isStep3Done ? 1 : 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className={`w-full max-w-md py-4 px-6 rounded-2xl font-black text-lg sm:text-xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-2xl ${
                                    isStep3Done
                                        ? "bg-emerald-600 text-white border-2 border-emerald-400 cursor-default"
                                        : "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 border-2 border-amber-300 shadow-amber-500/30 animate-pulse"
                                }`}
                            >
                                <span>🥋</span>
                                <span>{isStep3Done ? "¡OSS SENSEI! (COMPLETADO)" : "¡OSS SENSEI!"}</span>
                                <span>🥋</span>
                            </motion.button>

                            {isStep3Done && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (onCheckAndNext) onCheckAndNext();
                                    }}
                                    className="w-full max-w-md mt-3 py-3 px-6 rounded-2xl font-black text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                                >
                                    <span>Ingresar al Tatami • Siguiente Pregunta</span>
                                    <ArrowRight className="w-5 h-5" weight="bold" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DE VICTORIA CON EL SELLO DEL DOJO KUN */}
            <AnimatePresence>
                {showVictory && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        className="w-full max-w-3xl mt-4 p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border-2 border-blue-500/60 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 mb-3 shadow-lg">
                            <Trophy className="w-8 h-8 text-yellow-400" weight="fill" />
                        </div>

                        <span className="text-xs font-black uppercase tracking-widest text-blue-400 mb-1">
                            ¡RITUAL DEL TATAMI WKF SUPERADO!
                        </span>
                        <h4 className="text-xl font-black text-white mb-2">
                            El Karate empieza y termina con respeto (Rei)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed mb-4">
                            Has sellado el precepto del Dojo Kun con Musubi-dachi a 45°, reverencia formal a 30° y el saludo marcial ¡Oss Sensei!.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                if (onCheckAndNext) onCheckAndNext();
                            }}
                            className="py-3.5 px-8 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center gap-2 transform transition-all active:scale-95"
                        >
                            <span>¡Avanzar al Tatami!</span>
                            <ArrowRight className="w-5 h-5" weight="bold" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
