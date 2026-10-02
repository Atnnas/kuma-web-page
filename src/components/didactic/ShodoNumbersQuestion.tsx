"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types/didactica";
import { NUMBERS_1_TO_10_KANJIS, NumberKanjiDef } from "@/data/numbersKanjis";
import { didacticSound } from "@/lib/didacticSound";
import confetti from "canvas-confetti";
import {
    SpeakerHigh,
    ArrowCounterClockwise,
    MagicWand,
    CheckCircle,
    CaretLeft,
    CaretRight,
    Trophy,
    ArrowRight,
    Sparkle,
    HandPointing,
} from "@phosphor-icons/react";

interface ShodoNumbersQuestionProps {
    question: Question;
    onCompleted: () => void;
    onCheckAndNext?: () => void;
    isSuperAdmin?: boolean;
}

interface StrokeGeometry {
    totalLength: number;
    checkpoints: Array<{ x: number; y: number }>;
}

export function ShodoNumbersQuestion({
    question,
    onCompleted,
    onCheckAndNext,
    isSuperAdmin = false,
}: ShodoNumbersQuestionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeItem: NumberKanjiDef = NUMBERS_1_TO_10_KANJIS[activeIndex] || NUMBERS_1_TO_10_KANJIS[0];

    // Trazos completados por cada kanji: { [kanjiChar]: number[] }
    const [completedStrokesByKanji, setCompletedStrokesByKanji] = useState<{ [kanji: string]: number[] }>({});
    // Kanjis 100% completados
    const [masteredKanjis, setMasteredKanjis] = useState<string[]>([]);
    const [showFinalVictory, setShowFinalVictory] = useState(false);

    // Geometría del trazo
    const [strokeGeometries, setStrokeGeometries] = useState<{ [strokeId: number]: StrokeGeometry }>({});
    const [isDrawing, setIsDrawing] = useState(false);
    const [userPoints, setUserPoints] = useState<Array<{ x: number; y: number }>>([]);
    const [strokeProgress, setStrokeProgress] = useState(0);
    const [highestCheckpoint, setHighestCheckpoint] = useState(0);
    const [flashStrokeId, setFlashStrokeId] = useState<number | null>(null);
    const [isDemonstrating, setIsDemonstrating] = useState(false);
    const [feedbackTip, setFeedbackTip] = useState<string | null>(null);

    const svgRef = useRef<SVGSVGElement | null>(null);

    const completedStrokes = completedStrokesByKanji[activeItem.kanji] || [];
    const currentStrokeIndex = completedStrokes.length;
    const currentTargetStroke = activeItem.strokes[currentStrokeIndex];
    const isCurrentKanjiFinished = completedStrokes.length === activeItem.strokes.length;

    // Sonido Zen Bell con Web Audio API
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
            // Audio fallback silencioso
        }
    }, []);

    // Pronunciación oficial en japonés nativo
    const playPronunciation = useCallback((hiragana: string, romaji: string) => {
        playZenBell();
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            try {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(hiragana || romaji);
                utter.lang = "ja-JP";
                utter.rate = 0.85; // Ritmo pausado y didáctico para niños
                utter.pitch = 1.05;
                window.speechSynthesis.speak(utter);
            } catch {
                // Speech fallback
            }
        }
    }, [playZenBell]);

    // Calcular checkpoints para detección precisa del trazo
    useEffect(() => {
        if (typeof window === "undefined") return;
        const geometries: { [strokeId: number]: StrokeGeometry } = {};
        const svgNamespace = "http://www.w3.org/2000/svg";

        activeItem.strokes.forEach((stroke) => {
            const pathEl = document.createElementNS(svgNamespace, "path");
            pathEl.setAttribute("d", stroke.path);
            const totalLength = pathEl.getTotalLength();
            const samples = 35;
            const checkpoints: Array<{ x: number; y: number }> = [];

            for (let i = 0; i < samples; i++) {
                const dist = (i / (samples - 1)) * totalLength;
                const pt = pathEl.getPointAtLength(dist);
                checkpoints.push({ x: pt.x, y: pt.y });
            }

            geometries[stroke.id] = { totalLength, checkpoints };
        });

        setStrokeGeometries(geometries);
        setStrokeProgress(0);
        setHighestCheckpoint(0);
        setUserPoints([]);
        setFeedbackTip(null);
    }, [activeItem]);

    // Conversión de coordenadas de puntero a sistema 0-100 normalizado
    const getSvgCoords = useCallback((clientX: number, clientY: number): { x: number; y: number } | null => {
        if (!svgRef.current) return null;
        const rect = svgRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;
        const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
        return { x, y };
    }, []);

    const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    };

    // Completar un trazo con destello dorado y sonido
    const completeStroke = useCallback((strokeId: number) => {
        didacticSound.playClick();
        setFlashStrokeId(strokeId);
        setTimeout(() => setFlashStrokeId(null), 500);

        setCompletedStrokesByKanji((prev) => {
            const existing = prev[activeItem.kanji] || [];
            if (existing.includes(strokeId)) return prev;
            const updated = [...existing, strokeId];

            // Si se completaron todos los trazos del número actual
            if (updated.length === activeItem.strokes.length) {
                playPronunciation(activeItem.hiragana, activeItem.romaji);
                setMasteredKanjis((prevMastered) => {
                    if (!prevMastered.includes(activeItem.kanji)) {
                        const newMastered = [...prevMastered, activeItem.kanji];
                        // Si completó los 10 números
                        if (newMastered.length >= NUMBERS_1_TO_10_KANJIS.length) {
                            didacticSound.playStreak();
                            confetti({
                                particleCount: 100,
                                spread: 80,
                                origin: { y: 0.6 },
                                colors: ["#FFC800", "#58CC02", "#FFFFFF", "#F59E0B"],
                            });
                            setTimeout(() => {
                                setShowFinalVictory(true);
                                onCompleted();
                            }, 700);
                        } else {
                            // Breve confeti sutil de aliento para el niño
                            confetti({
                                particleCount: 30,
                                spread: 50,
                                origin: { y: 0.7 },
                                colors: ["#FFD700", "#FFFFFF"],
                            });
                        }
                        return newMastered;
                    }
                    return prevMastered;
                });
            }
            return { ...prev, [activeItem.kanji]: updated };
        });

        setStrokeProgress(0);
        setHighestCheckpoint(0);
        setUserPoints([]);
        setFeedbackTip(null);
    }, [activeItem, onCompleted, playPronunciation]);

    // Refs sincronizados para touch a 60fps
    const isDrawingRef = useRef(false);
    const currentTargetStrokeRef = useRef(currentTargetStroke);
    currentTargetStrokeRef.current = currentTargetStroke;
    const strokeGeometriesRef = useRef(strokeGeometries);
    strokeGeometriesRef.current = strokeGeometries;
    const highestCheckpointRef = useRef(highestCheckpoint);
    highestCheckpointRef.current = highestCheckpoint;
    const isDemonstratingRef = useRef(isDemonstrating);
    isDemonstratingRef.current = isDemonstrating;
    const isKanjiFinishedRef = useRef(isCurrentKanjiFinished);
    isKanjiFinishedRef.current = isCurrentKanjiFinished;

    const startDrawing = useCallback((clientX: number, clientY: number) => {
        if (isKanjiFinishedRef.current || isDemonstratingRef.current || !currentTargetStrokeRef.current) return;
        const coords = getSvgCoords(clientX, clientY);
        if (!coords) return;

        const stroke = currentTargetStrokeRef.current;
        const geom = strokeGeometriesRef.current[stroke.id];
        if (!geom || geom.checkpoints.length === 0) return;

        const startPt = geom.checkpoints[0];
        const distToStart = distance(coords, startPt);

        // Tolerancia generosa para dedos infantiles en pantallas táctiles: 26 unidades
        if (distToStart < 26) {
            isDrawingRef.current = true;
            setIsDrawing(true);
            setUserPoints([coords]);
            highestCheckpointRef.current = 0;
            setHighestCheckpoint(0);
            setStrokeProgress(0.05);
            setFeedbackTip(null);
        } else {
            setFeedbackTip(`Toca en el círculo rojo (${stroke.id}) para iniciar`);
            setTimeout(() => setFeedbackTip(null), 1800);
        }
    }, [getSvgCoords]);

    const moveDrawing = useCallback((clientX: number, clientY: number) => {
        if (!isDrawingRef.current || isDemonstratingRef.current || !currentTargetStrokeRef.current) return;
        const coords = getSvgCoords(clientX, clientY);
        if (!coords) return;

        const stroke = currentTargetStrokeRef.current;
        const geom = strokeGeometriesRef.current[stroke.id];
        if (!geom || geom.checkpoints.length === 0) return;

        setUserPoints((prev) => [...prev.slice(-16), coords]);

        // Verificar avance a lo largo de los checkpoints
        const checkpoints = geom.checkpoints;
        let highest = highestCheckpointRef.current;

        for (let i = highest; i < Math.min(checkpoints.length, highest + 9); i++) {
            const cp = checkpoints[i];
            const d = distance(coords, cp);
            if (d < 26) {
                if (i > highest) {
                    highest = i;
                    highestCheckpointRef.current = i;
                    setHighestCheckpoint(i);
                }
            }
        }

        const prog = highest / (checkpoints.length - 1);
        setStrokeProgress(prog);

        // Si llega al 82% del trazo, ¡se da por completado con éxito!
        if (prog >= 0.82) {
            isDrawingRef.current = false;
            setIsDrawing(false);
            completeStroke(stroke.id);
        }
    }, [completeStroke, getSvgCoords]);

    const stopDrawing = useCallback(() => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        setIsDrawing(false);

        // Si soltó el dedo cerca del final (prog >= 0.75), auto-completar
        if (strokeProgress >= 0.75 && currentTargetStrokeRef.current) {
            completeStroke(currentTargetStrokeRef.current.id);
        } else {
            // Reintento suave sin frustración
            setUserPoints([]);
            setStrokeProgress(0);
            setHighestCheckpoint(0);
        }
    }, [completeStroke, strokeProgress]);

    // Demostración automática con Sensei (Pincel Mágico)
    const handleDemonstrate = () => {
        if (isDemonstrating || !currentTargetStroke) return;
        setIsDemonstrating(true);
        const stroke = currentTargetStroke;
        const geom = strokeGeometries[stroke.id];
        if (!geom) {
            setIsDemonstrating(false);
            return;
        }

        const cps = geom.checkpoints;
        let step = 0;
        const interval = setInterval(() => {
            if (step >= cps.length) {
                clearInterval(interval);
                setIsDemonstrating(false);
                completeStroke(stroke.id);
            } else {
                setUserPoints((prev) => [...prev.slice(-14), cps[step]]);
                setStrokeProgress(step / (cps.length - 1));
                step += 2;
            }
        }, 22);
    };

    // Limpiar trazos del kanji actual para volver a practicar
    const handleResetCurrent = () => {
        didacticSound.playClick();
        setCompletedStrokesByKanji((prev) => ({ ...prev, [activeItem.kanji]: [] }));
        setMasteredKanjis((prev) => prev.filter((k) => k !== activeItem.kanji));
        setUserPoints([]);
        setStrokeProgress(0);
        setHighestCheckpoint(0);
        setFeedbackTip(null);
    };

    // Navegar entre números
    const goToNext = () => {
        didacticSound.playClick();
        if (activeIndex < NUMBERS_1_TO_10_KANJIS.length - 1) {
            setActiveIndex((prev) => prev + 1);
        }
    };

    const goToPrev = () => {
        didacticSound.playClick();
        if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
        }
    };

    return (
        <div className="w-full flex flex-col items-center select-none">
            {/* ESCENARIO DEL PERGAMINO SHODO */}
            <div className="w-full max-w-3xl rounded-3xl overflow-hidden border-2 border-amber-400/40 bg-zinc-950 shadow-[0_12px_45px_rgba(0,0,0,0.85)] flex flex-col">
                {/* CABECERA VISUAL CON KUMA SENSEI */}
                <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] min-h-[140px] sm:min-h-[180px] overflow-hidden bg-black">
                    <Image
                        src="/images/didactic/kuma_pixar_shodo_numbers.jpg"
                        alt="Kuma Sensei Shodo Caligrafía Marcial de Números Japoneses"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/40 to-transparent" />

                    {/* BADGE MARCIAL FLOTANTE */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-400/40 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-lg">
                            <Sparkle className="w-4 h-4 text-yellow-400" weight="fill" />
                            <span>Pincel Shodo: Números del 1 al 10</span>
                        </div>
                    </div>

                    {/* CONTADOR DE PROGRESO 1 AL 10 */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                        <div className="px-3.5 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-lg">
                            <span className="text-emerald-400 font-black">{masteredKanjis.length}</span>
                            <span className="text-zinc-500">/</span>
                            <span>10 Dominados</span>
                        </div>
                    </div>
                </div>

                {/* TIRA DE NAVEGACIÓN RÁPIDA DE LOS 10 NÚMEROS */}
                <div className="w-full bg-[#121824] px-2 py-2.5 border-y border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none justify-start sm:justify-center">
                    {NUMBERS_1_TO_10_KANJIS.map((item, idx) => {
                        const isCurrent = idx === activeIndex;
                        const isMastered = masteredKanjis.includes(item.kanji);
                        return (
                            <button
                                key={item.number}
                                onClick={() => {
                                    didacticSound.playClick();
                                    setActiveIndex(idx);
                                }}
                                className={`flex-shrink-0 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center min-w-[50px] sm:min-w-[58px] ${
                                    isCurrent
                                        ? "bg-amber-400 text-zinc-950 border-yellow-300 font-black shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-105"
                                        : isMastered
                                        ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-300 font-bold"
                                        : "bg-zinc-900/90 border-white/10 text-slate-300 hover:bg-zinc-800"
                                }`}
                            >
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-black">{item.number}</span>
                                    {isMastered && <CheckCircle className="w-3 h-3 text-emerald-400" weight="fill" />}
                                </div>
                                <span className="text-base sm:text-lg font-serif font-black leading-none mt-0.5">
                                    {item.kanji}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ÁREA PRINCIPAL DEL LIENZO DE CALIGRAFÍA */}
                <div className="p-4 sm:p-6 bg-gradient-to-b from-[#181E29] to-[#0E141F] flex flex-col items-center">
                    {/* TARJETA DEL NÚMERO ACTUAL */}
                    <div className="w-full flex items-center justify-between mb-3 px-2 sm:px-4">
                        <div className="flex items-center gap-2.5">
                            <span className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/60 text-amber-300 font-black text-xl flex items-center justify-center font-mono shadow-inner">
                                {activeItem.number}
                            </span>
                            <div>
                                <h3 className="text-white font-serif font-black text-xl sm:text-2xl tracking-wide flex items-center gap-2">
                                    <span>{activeItem.romaji}</span>
                                    <span className="text-xs font-normal text-amber-400/90 font-sans">
                                        ({activeItem.pronunciationGuide})
                                    </span>
                                </h3>
                                <p className="text-[11px] text-slate-400">
                                    {activeItem.meaning} • {activeItem.strokes.length} {activeItem.strokes.length === 1 ? "trazo" : "trazos"}
                                </p>
                            </div>
                        </div>

                        {/* BOTÓN DE AUDIO PRONUNCIACIÓN */}
                        <button
                            type="button"
                            onClick={() => playPronunciation(activeItem.hiragana, activeItem.romaji)}
                            className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-[0_0_15px_rgba(245,158,11,0.35)] cursor-pointer flex items-center gap-1.5 active:scale-95"
                            title="Escuchar pronunciación"
                        >
                            <SpeakerHigh className="w-5 h-5" weight="fill" />
                            <span className="text-xs font-black uppercase hidden sm:inline">Escuchar</span>
                        </button>
                    </div>

                    {/* EL PERGAMINO DE ARROZ (LIENZO SUMI-E) */}
                    <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-square rounded-3xl bg-[#FAF6EE] border-4 border-[#C8B289] shadow-[0_10px_30px_rgba(0,0,0,0.6)] overflow-hidden flex items-center justify-center">
                        {/* Textura sutil y líneas guía marciales tradicionales */}
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Cuadrícula tradicional de caligrafía japonesa */}
                            <div className="w-full h-full relative">
                                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-red-900/10 border-t border-dashed border-red-900/20" />
                                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-red-900/10 border-l border-dashed border-red-900/20" />
                                <div className="absolute inset-4 rounded-2xl border border-red-900/10" />
                            </div>
                        </div>

                        {/* SELLO INKAN ROJO DE MAESTRÍA (Hanko Stamp) */}
                        <AnimatePresence>
                            {isCurrentKanjiFinished && (
                                <motion.div
                                    initial={{ scale: 2.5, opacity: 0, rotate: -15 }}
                                    animate={{ scale: 1, opacity: 0.9, rotate: -5 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute bottom-4 right-4 z-20 pointer-events-none border-2 border-red-700 bg-red-600/10 rounded-lg p-1.5 shadow-md"
                                >
                                    <div className="border border-red-600 px-2 py-0.5 text-center">
                                        <span className="text-[10px] font-serif font-black text-red-700 tracking-widest block uppercase">
                                            合格 • APTO
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* SVG INTERACTIVO DE TRAZO DE CALIGRAFÍA */}
                        <svg
                            ref={svgRef}
                            viewBox="0 0 100 100"
                            className="w-full h-full cursor-crosshair touch-none select-none relative z-10"
                            onMouseDown={(e) => startDrawing(e.clientX, e.clientY)}
                            onMouseMove={(e) => moveDrawing(e.clientX, e.clientY)}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={(e) => {
                                if (e.touches.length > 0) {
                                    startDrawing(e.touches[0].clientX, e.touches[0].clientY);
                                }
                            }}
                            onTouchMove={(e) => {
                                if (e.touches.length > 0) {
                                    moveDrawing(e.touches[0].clientX, e.touches[0].clientY);
                                }
                            }}
                            onTouchEnd={stopDrawing}
                        >
                            <defs>
                                <linearGradient id="brushGold" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#F59E0B" />
                                    <stop offset="100%" stopColor="#FDE047" />
                                </linearGradient>
                                <filter id="sumiGlow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#18181B" floodOpacity="0.4" />
                                </filter>
                            </defs>

                            {/* 1. GUÍA GRIS CLARA DEL KANJI COMPLETO */}
                            {activeItem.strokes.map((stroke) => (
                                <path
                                    key={`ghost-${stroke.id}`}
                                    d={stroke.path}
                                    fill="none"
                                    stroke="#D1C7B7"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    opacity="0.45"
                                />
                            ))}

                            {/* 2. TRAZOS COMPLETADOS EN TINTA NEGRA SUMI-E */}
                            {completedStrokes.map((strokeId) => {
                                const stroke = activeItem.strokes.find((s) => s.id === strokeId);
                                if (!stroke) return null;
                                const isFlashing = flashStrokeId === strokeId;
                                return (
                                    <path
                                        key={`done-${strokeId}`}
                                        d={stroke.path}
                                        fill="none"
                                        stroke={isFlashing ? "#F59E0B" : "#1A1512"}
                                        strokeWidth={isFlashing ? "10" : "8.5"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        filter="url(#sumiGlow)"
                                        className="transition-all duration-300"
                                    />
                                );
                            })}

                            {/* 3. GUÍA INTERACTIVA DEL TRAZO ACTUAL */}
                            {currentTargetStroke && !isCurrentKanjiFinished && (
                                <>
                                    {/* Trazo objetivo con flecha punteada */}
                                    <path
                                        d={currentTargetStroke.path}
                                        fill="none"
                                        stroke="#F59E0B"
                                        strokeWidth="5"
                                        strokeDasharray="4 4"
                                        strokeLinecap="round"
                                        opacity="0.75"
                                        className="animate-pulse"
                                    />

                                    {/* CÍRCULO ROJO INICIAL DE PARTIDA */}
                                    <g>
                                        <circle
                                            cx={currentTargetStroke.start[0]}
                                            cy={currentTargetStroke.start[1]}
                                            r="5"
                                            fill="#DC2626"
                                            stroke="#FFFFFF"
                                            strokeWidth="1.5"
                                            className="animate-ping opacity-75"
                                        />
                                        <circle
                                            cx={currentTargetStroke.start[0]}
                                            cy={currentTargetStroke.start[1]}
                                            r="4.5"
                                            fill="#DC2626"
                                            stroke="#FFFFFF"
                                            strokeWidth="1.5"
                                        />
                                        <text
                                            x={currentTargetStroke.start[0]}
                                            y={currentTargetStroke.start[1] + 1.5}
                                            textAnchor="middle"
                                            fontSize="4.5"
                                            fontWeight="900"
                                            fill="#FFFFFF"
                                        >
                                            {currentTargetStroke.id}
                                        </text>
                                    </g>
                                </>
                            )}

                            {/* 4. TRAZO ACTIVO EN TIEMPO REAL DEL USUARIO */}
                            {userPoints.length > 1 && (
                                <path
                                    d={`M ${userPoints.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                                    fill="none"
                                    stroke="url(#brushGold)"
                                    strokeWidth="9"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}
                        </svg>

                        {/* MENSAJE DE AYUDA RÁPIDO */}
                        <AnimatePresence>
                            {feedbackTip && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute bottom-3 left-3 right-3 bg-zinc-900/90 border border-amber-400 text-amber-300 text-[11px] font-bold py-1.5 px-3 rounded-xl text-center shadow-lg pointer-events-none"
                                >
                                    {feedbackTip}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* BOTONES DE HERRAMIENTAS Y CONTROL */}
                    <div className="mt-4 w-full max-w-[360px] flex items-center justify-between gap-2">
                        {/* Demo con Sensei */}
                        <button
                            type="button"
                            disabled={isDemonstrating || isCurrentKanjiFinished}
                            onClick={handleDemonstrate}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                isDemonstrating || isCurrentKanjiFinished
                                    ? "bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed"
                                    : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50"
                            }`}
                        >
                            <MagicWand className="w-4 h-4" weight="fill" />
                            <span>Pincel Mágico</span>
                        </button>

                        {/* Limpiar trazo */}
                        <button
                            type="button"
                            onClick={handleResetCurrent}
                            className="py-2.5 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-slate-300 border border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            title="Limpiar para volver a trazar"
                        >
                            <ArrowCounterClockwise className="w-4 h-4" weight="bold" />
                            <span>Limpiar</span>
                        </button>
                    </div>

                    {/* NAVEGACIÓN ANTERIOR / SIGUIENTE */}
                    <div className="mt-4 w-full max-w-md flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                        <button
                            type="button"
                            onClick={goToPrev}
                            disabled={activeIndex === 0}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                                activeIndex === 0
                                    ? "text-zinc-600 cursor-not-allowed"
                                    : "text-slate-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700"
                            }`}
                        >
                            <CaretLeft className="w-4 h-4" weight="bold" />
                            <span>Anterior</span>
                        </button>

                        <div className="text-center">
                            <span className="text-xs font-bold text-amber-300 font-mono">
                                {activeIndex + 1} / 10
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={goToNext}
                            disabled={activeIndex === NUMBERS_1_TO_10_KANJIS.length - 1}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                                activeIndex === NUMBERS_1_TO_10_KANJIS.length - 1
                                    ? "text-zinc-600 cursor-not-allowed"
                                    : "text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30"
                            }`}
                        >
                            <span>Siguiente</span>
                            <CaretRight className="w-4 h-4" weight="bold" />
                        </button>
                    </div>

                    {/* SUPERADMIN BYPASS */}
                    {isSuperAdmin && (
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setMasteredKanjis(NUMBERS_1_TO_10_KANJIS.map((k) => k.kanji));
                                    setShowFinalVictory(true);
                                    onCompleted();
                                }}
                                className="text-[10px] text-amber-400/70 hover:text-amber-300 underline cursor-pointer"
                            >
                                [Admin: Dominar los 10 Números]
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL CELEBRATORIO DE MAESTRÍA EN CONTEO MARCIAL */}
            <AnimatePresence>
                {showFinalVictory && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50"
                    >
                        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#1E293B] via-zinc-950 to-black border-2 border-amber-400 shadow-[0_0_50px_rgba(250,204,21,0.35)] text-center max-w-md w-full relative overflow-hidden">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-yellow-300 mx-auto mb-3 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                                <Trophy className="w-8 h-8 text-yellow-300" weight="fill" />
                            </div>

                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 block mb-1">
                                ¡Conteo Marcial Completado!
                            </span>

                            <h4 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight">
                                Dominaste del 1 al 10
                            </h4>

                            <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                                Has forjado los 10 Kanjis marciales con el pincel Shodo y aprendido su conteo tradicional en el Dojo:
                            </p>

                            {/* Cuadrícula de los 10 números aprendidos */}
                            <div className="my-3.5 grid grid-cols-5 gap-1.5 p-2 rounded-2xl bg-black/50 border border-white/10">
                                {NUMBERS_1_TO_10_KANJIS.map((n) => (
                                    <div key={n.number} className="text-center py-1 bg-zinc-900/80 rounded-lg border border-white/5">
                                        <span className="text-sm font-serif font-black text-amber-300">{n.kanji}</span>
                                        <span className="text-[9px] font-bold text-slate-400 block">{n.romaji}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                                {onCheckAndNext && (
                                    <button
                                        type="button"
                                        onClick={onCheckAndNext}
                                        className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] text-white font-black text-xs uppercase tracking-widest border-b-4 border-[#46A302] active:translate-y-0.5 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <span>Continuar al Siguiente Desafío</span>
                                        <ArrowRight className="w-4 h-4" weight="bold" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
