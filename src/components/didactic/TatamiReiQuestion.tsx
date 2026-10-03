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
    // Estado del ritual (1: Musubi-dachi, 2: Rei 30°, 3: Oss Sensei)
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);

    // Progreso de cada paso
    const [isStep1Done, setIsStep1Done] = useState(false);
    const [isStep2Done, setIsStep2Done] = useState(false);
    const [isStep3Done, setIsStep3Done] = useState(false);

    // Paso 1: alineación de talones
    const [feetAligned, setFeetAligned] = useState(false);

    // Paso 2: ángulo de inclinación (0 a 30)
    const [bowAngle, setBowAngle] = useState(0);
    const [isAutoBowing, setIsAutoBowing] = useState(false);

    // Paso 3: Kiai y sello Hanko
    const [hasStampedHanko, setHasStampedHanko] = useState(false);
    const [tatamiIlluminated, setTatamiIlluminated] = useState(false);

    // Modal de victoria final
    const [showVictory, setShowVictory] = useState(false);

    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Web Audio: Sonido de pisada firme en umbral de madera ("Tak")
    const playWoodStepSound = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;

            // Impacto sordo de madera maciza
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);

            // Resonancia de madera
            const snap = ctx.createOscillator();
            const snapGain = ctx.createGain();
            snap.type = "sine";
            snap.frequency.setValueAtTime(980, now);
            snap.frequency.exponentialRampToValueAtTime(120, now + 0.08);
            snapGain.gain.setValueAtTime(0.18, now);
            snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            snap.connect(snapGain);
            snapGain.connect(ctx.destination);
            snap.start(now);
            snap.stop(now + 0.08);
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

    // Web Audio: Kiai potente y resonante ("¡Oss!")
    const playOssKiaiSound = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;

            // Onda de choque Kime / Kiai
            const bass = ctx.createOscillator();
            const bassGain = ctx.createGain();
            bass.type = "triangle";
            bass.frequency.setValueAtTime(320, now);
            bass.frequency.exponentialRampToValueAtTime(65, now + 0.35);
            bassGain.gain.setValueAtTime(0.4, now);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            bass.connect(bassGain);
            bassGain.connect(ctx.destination);
            bass.start(now);
            bass.stop(now + 0.35);

            // Armónico agudo brillante
            const ping = ctx.createOscillator();
            const pingGain = ctx.createGain();
            ping.type = "sine";
            ping.frequency.setValueAtTime(1400, now + 0.03);
            ping.frequency.exponentialRampToValueAtTime(528, now + 0.8);
            pingGain.gain.setValueAtTime(0.18, now + 0.03);
            pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            ping.connect(pingGain);
            pingGain.connect(ctx.destination);
            ping.start(now + 0.03);
            ping.stop(now + 0.8);
        } catch {
            // Silencio seguro
        }

        // Voz en japonés diciendo "Oss Sensei"
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

    // Síntesis de voz para instrucciones en español (solo si voz está ON)
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

    // Detener voz al desmontar
    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // PASO 1: Alinear talones en Musubi-dachi
    const handleAlignFeet = () => {
        if (feetAligned) return;
        setFeetAligned(true);
        playWoodStepSound();
        setIsStep1Done(true);

        speakSpanish("Paso 1 completado. Talones unidos a 45 grados en Musubi dachi.");

        setTimeout(() => {
            playZenBell();
            setCurrentStep(2);
            speakSpanish("Paso 2. Inclina el torso a 30 grados manteniendo la espalda recta.");
        }, 1100);
    };

    // PASO 2: Reverencia a 30°
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
                speakSpanish("Reverencia impecable a 30 grados. Pasemos al saludo marcial.");

                setTimeout(() => {
                    setCurrentStep(3);
                    speakSpanish("Paso 3. Presiona el botón dorado y saluda con convicción: ¡Oss Sensei!");
                }, 1200);
            } else {
                setBowAngle(current);
            }
        }, 40);
    };

    // PASO 3: El saludo "¡OSS SENSEI!"
    const handleOssSensei = () => {
        if (isStep3Done) return;
        setIsStep3Done(true);
        setTatamiIlluminated(true);
        playOssKiaiSound();

        // Lanzar sello Hanko tras 300ms
        setTimeout(() => {
            setHasStampedHanko(true);
            didacticSound.playCorrect();

            // Explosión de confeti marcial (oro, blanco y rojo)
            confetti({
                particleCount: 75,
                spread: 70,
                origin: { y: 0.65 },
                colors: ["#F59E0B", "#EF4444", "#FFFFFF", "#10B981"],
            });

            onCompleted();

            setTimeout(() => {
                setShowVictory(true);
                didacticSound.playComplete();
            }, 1000);
        }, 350);
    };

    // Reiniciar ritual
    const handleReset = () => {
        setCurrentStep(1);
        setIsStep1Done(false);
        setIsStep2Done(false);
        setIsStep3Done(false);
        setFeetAligned(false);
        setBowAngle(0);
        setHasStampedHanko(false);
        setTatamiIlluminated(false);
        setShowVictory(false);
        didacticSound.playClick();
    };

    return (
        <div className="w-full flex flex-col items-center select-none">
            {/* BARRA SUPERIOR DE CONTROLES */}
            <div className="w-full max-w-4xl flex items-center justify-between gap-3 mb-4 px-2">
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-full border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                        <Sparkle className="w-3.5 h-3.5" weight="fill" />
                        Protocolo del Dojo • Reigi Sahō
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Botón Voz (OFF por defecto) */}
                    <button
                        type="button"
                        onClick={() => {
                            const next = !isVoiceActive;
                            setIsVoiceActive(next);
                            if (next) {
                                speakSpanish("Voz activada. Al entrar al tatami, realizamos el saludo tradicional Rei y decimos: ¡Oss Sensei!");
                            } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
                                window.speechSynthesis.cancel();
                            }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            isVoiceActive
                                ? "bg-amber-500 text-slate-950 font-black shadow-amber-500/20 shadow-md"
                                : "bg-slate-800/90 text-slate-400 hover:text-slate-200 border border-slate-700"
                        }`}
                        title="Activar o desactivar voz didáctica"
                    >
                        {isVoiceActive ? <SpeakerHigh className="w-4 h-4" weight="bold" /> : <SpeakerSlash className="w-4 h-4" weight="bold" />}
                        <span>{isVoiceActive ? "Voz: ON" : "Voz: OFF"}</span>
                    </button>

                    {/* Botón Reiniciar */}
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                        title="Reiniciar ejercicio"
                    >
                        <ArrowCounterClockwise className="w-3.5 h-3.5" weight="bold" />
                        <span className="hidden sm:inline">Reiniciar</span>
                    </button>

                    {/* Botón SuperAdmin */}
                    {isSuperAdmin && (
                        <button
                            type="button"
                            onClick={() => {
                                onCompleted();
                                if (onCheckAndNext) onCheckAndNext();
                            }}
                            className="px-2.5 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-300 text-xs font-bold rounded-xl border border-purple-600/50 shadow-sm"
                        >
                            ⚡ Omitir
                        </button>
                    )}
                </div>
            </div>

            {/* TRACK DE 3 PASOS INTERACTIVOS */}
            <div className="w-full max-w-4xl grid grid-cols-3 gap-2 sm:gap-3 mb-5 px-2">
                {/* Paso 1 */}
                <div
                    onClick={() => {
                        if (isStep1Done) setCurrentStep(1);
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        currentStep === 1
                            ? "bg-amber-500/20 border-amber-500/60 text-amber-300 ring-2 ring-amber-500/30 font-bold"
                            : isStep1Done
                            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                            : "bg-slate-900/40 border-slate-800 text-slate-500"
                    }`}
                >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black bg-black/40">
                        {isStep1Done ? <CheckCircle className="w-4 h-4 text-emerald-400" weight="fill" /> : "1"}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold truncate">Musubi-dachi</span>
                </div>

                {/* Paso 2 */}
                <div
                    onClick={() => {
                        if (isStep1Done) setCurrentStep(2);
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-2xl border text-center transition-all ${
                        isStep1Done ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                    } ${
                        currentStep === 2
                            ? "bg-amber-500/20 border-amber-500/60 text-amber-300 ring-2 ring-amber-500/30 font-bold"
                            : isStep2Done
                            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                            : "bg-slate-900/40 border-slate-800 text-slate-500"
                    }`}
                >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black bg-black/40">
                        {isStep2Done ? <CheckCircle className="w-4 h-4 text-emerald-400" weight="fill" /> : "2"}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold truncate">Rei (30°)</span>
                </div>

                {/* Paso 3 */}
                <div
                    onClick={() => {
                        if (isStep2Done) setCurrentStep(3);
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-2xl border text-center transition-all ${
                        isStep2Done ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                    } ${
                        currentStep === 3
                            ? "bg-amber-500/20 border-amber-500/60 text-amber-300 ring-2 ring-amber-500/30 font-bold"
                            : isStep3Done
                            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                            : "bg-slate-900/40 border-slate-800 text-slate-500"
                    }`}
                >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black bg-black/40">
                        {isStep3Done ? <CheckCircle className="w-4 h-4 text-emerald-400" weight="fill" /> : "3"}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold truncate">¡Oss Sensei!</span>
                </div>
            </div>

            {/* ARENA PRINCIPAL INTERACTIVA */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-5 px-2">
                {/* COLUMNA IZQUIERDA: VISUAL 3D PIXAR Y SELLO HANKO */}
                <div className="md:col-span-6 flex flex-col items-center">
                    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-slate-950 group">
                        <Image
                            src="/images/didactic/kuma_pixar_tatami_rei.jpg"
                            alt="Sensei Kuma realizando la reverencia Rei en el umbral del tatami"
                            fill
                            priority
                            className={`object-cover object-center transition-all duration-700 ${
                                tatamiIlluminated ? "brightness-105 saturate-110" : "brightness-95"
                            }`}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />

                        {/* Halo de luz cálida cuando el tatami se ilumina */}
                        <AnimatePresence>
                            {tatamiIlluminated && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-gradient-to-t from-amber-500/30 via-amber-400/10 to-transparent pointer-events-none mix-blend-screen"
                                />
                            )}
                        </AnimatePresence>

                        {/* Indicador de ángulo dinámico cuando se hace la reverencia */}
                        {currentStep === 2 && (
                            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-lg">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                                <span>Inclinación Torso: {bowAngle}° / 30°</span>
                            </div>
                        )}

                        {/* SELLO HANKO TRADICIONAL ROJO CUANDO SE COMPLETA EL RITUAL */}
                        <AnimatePresence>
                            {hasStampedHanko && (
                                <motion.div
                                    initial={{ scale: 3, opacity: 0, rotate: -25 }}
                                    animate={{ scale: 1, opacity: 1, rotate: -6 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                                    className="absolute bottom-5 right-5 pointer-events-none"
                                >
                                    <div className="relative w-28 h-28 border-4 border-red-600 bg-red-700/90 text-white rounded-2xl flex flex-col items-center justify-center p-1.5 shadow-[0_0_35px_rgba(220,38,38,0.7)] backdrop-blur-sm select-none">
                                        <div className="border border-red-400/60 w-full h-full rounded-xl flex flex-col items-center justify-center p-1">
                                            <span className="text-[10px] font-black tracking-widest text-red-200 uppercase">DOJO KUN</span>
                                            <span className="text-3xl font-black font-serif my-0.5 tracking-wider text-red-100 drop-shadow">礼</span>
                                            <span className="text-[9px] font-bold text-red-200 tracking-wider">REIGI SAHŌ</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Badge de ubicación */}
                        <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] font-medium text-slate-300">
                            Umbral del Tatami • Kuma Dojo
                        </div>
                    </div>

                    <p className="mt-2 text-center text-xs text-slate-400">
                        {currentStep === 1 && "Paso 1: Detente en el borde de madera antes de pisar."}
                        {currentStep === 2 && "Paso 2: Inclina el torso con respeto y humildad marcial."}
                        {currentStep === 3 && "Paso 3: Saluda con convicción hacia el tatami y el Maestro."}
                    </p>
                </div>

                {/* COLUMNA DERECHA: CONSOLA INTERACTIVA DEL RITUAL */}
                <div className="md:col-span-6 flex flex-col justify-between bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden min-h-[380px]">
                    {/* PASO 1: POSTURA MUSUBI-DACHI */}
                    {currentStep === 1 && (
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-amber-400 font-black text-sm">PASO 1</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Postura de Entrada</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Junta los talones en <span className="text-amber-400 font-extrabold">Musubi-dachi</span>
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                    Al llegar al umbral de madera antes de cruzar al tatami, une los talones manteniendo las puntas abiertas a 45 grados.
                                </p>
                            </div>

                            {/* SIMULADOR TÁCTIL DE PISADA DE MADERA */}
                            <div className="relative w-full py-6 bg-amber-950/20 border-2 border-dashed border-amber-500/30 rounded-2xl flex flex-col items-center justify-center gap-3 overflow-hidden">
                                <div className="flex items-center justify-center gap-6">
                                    {/* Pie izquierdo */}
                                    <motion.div
                                        animate={{
                                            rotate: feetAligned ? -22.5 : 0,
                                            x: feetAligned ? 8 : -10,
                                        }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className={`w-14 h-24 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-md transition-colors ${
                                            feetAligned
                                                ? "bg-amber-500/30 border-amber-400 text-amber-300"
                                                : "bg-slate-800/80 border-slate-600 text-slate-400"
                                        }`}
                                    >
                                        IZQ
                                    </motion.div>

                                    {/* Pie derecho */}
                                    <motion.div
                                        animate={{
                                            rotate: feetAligned ? 22.5 : 0,
                                            x: feetAligned ? -8 : 10,
                                        }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className={`w-14 h-24 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-md transition-colors ${
                                            feetAligned
                                                ? "bg-amber-500/30 border-amber-400 text-amber-300"
                                                : "bg-slate-800/80 border-slate-600 text-slate-400"
                                        }`}
                                    >
                                        DER
                                    </motion.div>
                                </div>

                                <span className="text-[11px] font-semibold text-amber-300/80">
                                    {feetAligned ? "✓ Talones unidos a 45°" : "Toca abajo para unir los talones"}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleAlignFeet}
                                disabled={feetAligned}
                                className={`w-full mt-4 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                                    feetAligned
                                        ? "bg-emerald-600 text-white cursor-default"
                                        : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25"
                                }`}
                            >
                                {feetAligned ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-white" weight="fill" />
                                        <span>¡Musubi-dachi Listo!</span>
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
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-amber-400 font-black text-sm">PASO 2</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Cortesía Formal</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Reverencia formal <span className="text-amber-400 font-extrabold">Rei a 30°</span>
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                    Con la espalda recta y las palmas a los costados, inclina el torso 30 grados sin perder la atención respetuosa hacia el frente.
                                </p>
                            </div>

                            {/* CALIBRADOR DE ÁNGULO VISUAL */}
                            <div className="w-full py-4 px-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex flex-col items-center gap-3">
                                <div className="w-full flex justify-between items-center text-xs font-bold text-slate-400">
                                    <span>Erguido (0°)</span>
                                    <span className={`text-sm font-black ${bowAngle >= 28 ? "text-emerald-400" : "text-amber-400"}`}>
                                        {bowAngle}°
                                    </span>
                                    <span>Rei (30°)</span>
                                </div>

                                {/* Barra de ángulo */}
                                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                                    <motion.div
                                        className={`h-full rounded-full transition-all ${
                                            bowAngle >= 28 ? "bg-emerald-400" : "bg-gradient-to-r from-amber-500 to-amber-400"
                                        }`}
                                        style={{ width: `${(bowAngle / 30) * 100}%` }}
                                    />
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                                    {bowAngle >= 30 ? (
                                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" weight="fill" /> ¡Ángulo de 30° alcanzado con perfecta etiqueta!
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">
                                            Mantén la espalda recta y la mirada al frente.
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handlePerformBow}
                                disabled={isAutoBowing || isStep2Done}
                                className={`w-full mt-4 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                                    isStep2Done
                                        ? "bg-emerald-600 text-white cursor-default"
                                        : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25"
                                }`}
                            >
                                {isStep2Done ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-white" weight="fill" />
                                        <span>¡Reverencia Completada!</span>
                                    </>
                                ) : (
                                    <>
                                        <HandPointing className="w-5 h-5 text-slate-950" weight="fill" />
                                        <span>{isAutoBowing ? "Inclinando..." : "Realizar Reverencia a 30°"}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* PASO 3: EL SALUDO "¡OSS SENSEI!" */}
                    {currentStep === 3 && (
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-amber-400 font-black text-sm">PASO 3</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">El Saludo Marcial</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    Pronuncia con convicción: <span className="text-amber-400 font-extrabold">¡OSS SENSEI!</span>
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                    Al cruzar el umbral, saludamos al Maestro y a los compañeros. El vocablo <i>Oss</i> sintetiza respeto incondicional, perseverancia y cortesía.
                                </p>
                            </div>

                            {/* BOTÓN DORADO VIBRANTE DE KIAI */}
                            <div className="py-2 flex flex-col items-center">
                                <motion.button
                                    type="button"
                                    onClick={handleOssSensei}
                                    disabled={isStep3Done}
                                    whileHover={{ scale: isStep3Done ? 1 : 1.03 }}
                                    whileTap={{ scale: 0.96 }}
                                    className={`w-full py-5 px-6 rounded-2xl font-black text-lg sm:text-xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-2xl ${
                                        isStep3Done
                                            ? "bg-emerald-600 text-white border-2 border-emerald-400"
                                            : "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 border-2 border-amber-300 shadow-amber-500/30 animate-pulse"
                                    }`}
                                >
                                    <span>🥋</span>
                                    <span>{isStep3Done ? "¡OSS SENSEI! (COMPLETO)" : "¡OSS SENSEI!"}</span>
                                    <span>🥋</span>
                                </motion.button>
                                <span className="text-[11px] text-amber-300/80 font-medium mt-2">
                                    Presiona para estampar el sello de cortesía del Dojo Kun
                                </span>
                            </div>

                            {isStep3Done ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (onCheckAndNext) onCheckAndNext();
                                    }}
                                    className="w-full mt-4 py-3.5 px-4 rounded-2xl font-black text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                                >
                                    <span>Entrar al Tatami • Continuar</span>
                                    <ArrowRight className="w-5 h-5" weight="bold" />
                                </button>
                            ) : (
                                <div className="h-12" />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL / TARJETA DE CELEBRACIÓN DE VICTORIA */}
            <AnimatePresence>
                {showVictory && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-4xl mt-6 p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border-2 border-emerald-500/60 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-3 shadow-lg">
                            <Trophy className="w-8 h-8" weight="fill" />
                        </div>

                        <span className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">
                            ¡RITUAL DE CORTESÍA SUPERADO CON HONOR!
                        </span>
                        <h4 className="text-xl sm:text-2xl font-black text-white mb-2">
                            Has aprendido el precepto supremo del Dojo Kun
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed mb-5">
                            Cada vez que pisas el tatami, dejas fuera las distracciones y saludas con respeto mutuo y humildad marcial. ¡El Karate empieza y termina con Rei!
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                if (onCheckAndNext) onCheckAndNext();
                            }}
                            className="py-3.5 px-8 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center gap-2 transform transition-all active:scale-95"
                        >
                            <span>¡Avanzar al Siguiente Desafío!</span>
                            <ArrowRight className="w-5 h-5" weight="bold" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
