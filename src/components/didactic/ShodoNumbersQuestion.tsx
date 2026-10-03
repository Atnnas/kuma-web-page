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
    SpeakerSlash,
    ArrowCounterClockwise,
    Eye,
    EyeSlash,
    Lightbulb,
    CheckCircle,
    CaretLeft,
    CaretRight,
    Trophy,
    ArrowRight,
    Sparkle,
    HandPointing,
    WarningCircle,
    PencilSimple,
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
    const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);

    // Trazos completados por cada kanji: { [kanjiChar]: number[] }
    const [completedStrokesByKanji, setCompletedStrokesByKanji] = useState<{ [kanji: string]: number[] }>({});
    // Kanjis 100% completados
    const [masteredKanjis, setMasteredKanjis] = useState<string[]>([]);
    const [showFinalVictory, setShowFinalVictory] = useState(false);

    // Geometría del trazo
    const [strokeGeometries, setStrokeGeometries] = useState<{ [strokeId: number]: StrokeGeometry }>({});
    const [isDrawing, setIsDrawing] = useState(false);
    const [userPoints, setUserPoints] = useState<Array<{ x: number; y: number }>>([]);
    const [currentPointer, setCurrentPointer] = useState<{ x: number; y: number } | null>(null);
    const [strokeProgress, setStrokeProgress] = useState(0);
    const [highestCheckpoint, setHighestCheckpoint] = useState(0);
    const [flashStrokeId, setFlashStrokeId] = useState<number | null>(null);
    const [showGuide, setShowGuide] = useState(true);
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

    // 1. Calcular checkpoints de alta densidad (40 muestras) para tethering 1-a-1 exacto idéntico a Karate-Do
    useEffect(() => {
        if (typeof window === "undefined") return;
        const geometries: { [strokeId: number]: StrokeGeometry } = {};
        const svgNamespace = "http://www.w3.org/2000/svg";

        activeItem.strokes.forEach((stroke) => {
            const pathEl = document.createElementNS(svgNamespace, "path");
            pathEl.setAttribute("d", stroke.path);
            const totalLength = pathEl.getTotalLength();
            const samples = 40; // 40 muestras densas para exactitud máxima
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
        setCurrentPointer(null);
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
        setTimeout(() => setFlashStrokeId(null), 600);

        setCompletedStrokesByKanji((prev) => {
            const existing = prev[activeItem.kanji] || [];
            if (existing.includes(strokeId)) return prev;
            const updated = [...existing, strokeId];

            // Si se completaron todos los trazos del número actual
            if (updated.length === activeItem.strokes.length) {
                if (isVoiceActive) {
                    playPronunciation(activeItem.hiragana, activeItem.romaji);
                } else {
                    playZenBell();
                }
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
                            // Avance automático suave al siguiente número no dominado
                            setTimeout(() => {
                                const nextUncompletedIdx = NUMBERS_1_TO_10_KANJIS.findIndex(
                                    (item) => !newMastered.includes(item.kanji)
                                );
                                if (nextUncompletedIdx !== -1) {
                                    setActiveIndex(nextUncompletedIdx);
                                    setUserPoints([]);
                                    setCurrentPointer(null);
                                    setStrokeProgress(0);
                                    setHighestCheckpoint(0);
                                    setFeedbackTip(null);
                                }
                            }, 1200);
                        }
                        return newMastered;
                    }
                    return prevMastered;
                });
            }

            return { ...prev, [activeItem.kanji]: updated };
        });

        // Reset live drawing state
        setStrokeProgress(0);
        setHighestCheckpoint(0);
        setUserPoints([]);
        setCurrentPointer(null);
        setFeedbackTip(null);
    }, [activeItem, onCompleted, playPronunciation]);

    // Refs sincronizados a 60Hz/120Hz sin retraso por closure de React
    const isDrawingRef = useRef(false);
    const currentTargetStrokeRef = useRef(currentTargetStroke);
    currentTargetStrokeRef.current = currentTargetStroke;
    const strokeGeometriesRef = useRef(strokeGeometries);
    strokeGeometriesRef.current = strokeGeometries;
    const highestCheckpointRef = useRef(highestCheckpoint);
    highestCheckpointRef.current = highestCheckpoint;
    const userPointsRef = useRef(userPoints);
    userPointsRef.current = userPoints;
    const strokeProgressRef = useRef(strokeProgress);
    strokeProgressRef.current = strokeProgress;
    const isCurrentKanjiFinishedRef = useRef(isCurrentKanjiFinished);
    isCurrentKanjiFinishedRef.current = isCurrentKanjiFinished;
    const isDemonstratingRef = useRef(isDemonstrating);
    isDemonstratingRef.current = isDemonstrating;

    // MOTOR UNIFICADO DE TRAZO (Idéntico a KanjiDrawCanvas de Karate-Do)
    const startDrawing = useCallback(
        (clientX: number, clientY: number) => {
            if (isCurrentKanjiFinishedRef.current || isDemonstratingRef.current || !currentTargetStrokeRef.current) return;
            const coords = getSvgCoords(clientX, clientY);
            if (!coords) return;

            const stroke = currentTargetStrokeRef.current;
            const geom = strokeGeometriesRef.current[stroke.id];
            if (!geom || geom.checkpoints.length === 0) return;

            const startPt = geom.checkpoints[0];
            const distToStart = distance(coords, startPt);

            // Tolerancia de inicio ergonómica para dedos en móviles (24 unidades)
            if (distToStart < 24) {
                isDrawingRef.current = true;
                setIsDrawing(true);
                setUserPoints([coords]);
                userPointsRef.current = [coords];
                setCurrentPointer(coords);
                highestCheckpointRef.current = 0;
                setHighestCheckpoint(0);
                strokeProgressRef.current = 0.02;
                setStrokeProgress(0.02);
                setFeedbackTip(null);
            } else {
                setFeedbackTip(`Toca en el círculo rojo (${stroke.id}) para iniciar`);
                setTimeout(() => setFeedbackTip(null), 2000);
            }
        },
        [getSvgCoords]
    );

    const moveDrawing = useCallback(
        (clientX: number, clientY: number) => {
            if (!isDrawingRef.current || isCurrentKanjiFinishedRef.current || isDemonstratingRef.current || !currentTargetStrokeRef.current) return;
            const coords = getSvgCoords(clientX, clientY);
            if (!coords) return;

            setUserPoints((prev) => {
                const next = [...prev, coords];
                userPointsRef.current = next;
                return next;
            });
            setCurrentPointer(coords);

            const stroke = currentTargetStrokeRef.current;
            const geom = strokeGeometriesRef.current[stroke.id];
            if (!geom) return;

            const checkpoints = geom.checkpoints;
            const total = checkpoints.length;
            const currentK = highestCheckpointRef.current;

            // Proyección matemática sobre segmentos adelantados (Lookahead)
            // Evita que swiping rápido o curvas en 60Hz/120Hz se traben
            const maxLookahead = Math.min(total - 1, currentK + 10);
            let bestK = currentK;
            let bestDist = 999;
            let bestT = 0;

            for (let k = currentK; k < maxLookahead; k++) {
                const p1 = checkpoints[k];
                const p2 = checkpoints[k + 1];
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const lenSq = dx * dx + dy * dy;
                if (lenSq < 0.0001) continue;

                const t = ((coords.x - p1.x) * dx + (coords.y - p1.y) * dy) / lenSq;
                const clampedT = Math.max(0, Math.min(1, t));
                const projX = p1.x + clampedT * dx;
                const projY = p1.y + clampedT * dy;
                const dist = Math.hypot(coords.x - projX, coords.y - projY);

                if (dist < 24 && dist < bestDist) {
                    bestDist = dist;
                    bestK = k;
                    bestT = clampedT;
                }
            }

            if (bestDist < 24 && bestK >= currentK) {
                highestCheckpointRef.current = bestK;
                setHighestCheckpoint(bestK);
                const fraction = (bestK + bestT) / (total - 1);
                strokeProgressRef.current = fraction;
                setStrokeProgress((prev) => Math.max(prev, fraction));
            }
        },
        [getSvgCoords]
    );

    const endDrawing = useCallback(() => {
        if (!isDrawingRef.current || !currentTargetStrokeRef.current) return;

        const stroke = currentTargetStrokeRef.current;
        const geom = strokeGeometriesRef.current[stroke.id];
        if (geom) {
            const totalCheckpoints = geom.checkpoints.length;
            const endPt = geom.checkpoints[totalCheckpoints - 1];
            const pts = userPointsRef.current;
            const lastPt = pts.length > 0 ? pts[pts.length - 1] : null;
            const distToEnd = lastPt ? distance(lastPt, endPt) : 999;

            // Condición de finalización idéntica a Karate-Do:
            // Trazó >= 76% O alcanzó el punto final (< 28 unidades) habiendo avanzado >= 45%
            const hasPassedMajority = highestCheckpointRef.current >= Math.floor(totalCheckpoints * 0.76) || strokeProgressRef.current >= 0.76;
            const isNearEnd = distToEnd < 28 && highestCheckpointRef.current >= Math.floor(totalCheckpoints * 0.45);

            if (hasPassedMajority || isNearEnd) {
                completeStroke(stroke.id);
            } else {
                setFeedbackTip("¡Traza todo el recorrido de la línea hasta el final!");
                setTimeout(() => setFeedbackTip(null), 2000);
            }
        }

        isDrawingRef.current = false;
        setIsDrawing(false);
        setStrokeProgress(0);
        strokeProgressRef.current = 0;
        setHighestCheckpoint(0);
        highestCheckpointRef.current = 0;
        setUserPoints([]);
        userPointsRef.current = [];
        setCurrentPointer(null);
    }, [completeStroke]);

    // LISTENERS TÁCTILES NATIVOS NO PASIVOS (Evitan que el scroll o gestos del navegador interfieran)
    useEffect(() => {
        const el = svgRef.current;
        if (!el) return;

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 1) return;
            e.preventDefault();
            const touch = e.touches[0];
            startDrawing(touch.clientX, touch.clientY);
        };

        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 1) return;
            e.preventDefault();
            const touch = e.touches[0];
            moveDrawing(touch.clientX, touch.clientY);
        };

        const onTouchEnd = (e: TouchEvent) => {
            e.preventDefault();
            endDrawing();
        };

        const onTouchCancel = (e: TouchEvent) => {
            e.preventDefault();
            endDrawing();
        };

        el.addEventListener("touchstart", onTouchStart, { passive: false });
        el.addEventListener("touchmove", onTouchMove, { passive: false });
        el.addEventListener("touchend", onTouchEnd, { passive: false });
        el.addEventListener("touchcancel", onTouchCancel, { passive: false });

        return () => {
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchmove", onTouchMove);
            el.removeEventListener("touchend", onTouchEnd);
            el.removeEventListener("touchcancel", onTouchCancel);
        };
    }, [startDrawing, moveDrawing, endDrawing]);

    // HANDLERS PARA POINTER / MOUSE EN ESCRITORIO
    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        if (e.pointerType === "touch") return; // Touch ya es atendido por los native listeners
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // Ignorar error de captura
        }
        startDrawing(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (e.pointerType === "touch") return;
        moveDrawing(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        if (e.pointerType === "touch") return;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // Ignorar error de liberación
        }
        endDrawing();
    };

    // Spline suave de tinta negra Sumi-e para el trazo en vivo del usuario
    const renderUserInkSpline = () => {
        if (userPoints.length < 2) return null;
        let d = `M ${userPoints[0].x},${userPoints[0].y}`;
        for (let i = 1; i < userPoints.length - 1; i++) {
            const xc = (userPoints[i].x + userPoints[i + 1].x) / 2;
            const yc = (userPoints[i].y + userPoints[i + 1].y) / 2;
            d += ` Q ${userPoints[i].x},${userPoints[i].y} ${xc},${yc}`;
        }
        d += ` L ${userPoints[userPoints.length - 1].x},${userPoints[userPoints.length - 1].y}`;

        return (
            <g>
                {/* Halo de absorción del papel húmedo */}
                <path
                    d={d}
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-25"
                />
                {/* Tinta negra pura de carbón Sumi-e */}
                <path
                    d={d}
                    fill="none"
                    stroke="#09090b"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-95"
                />
            </g>
        );
    };

    // MODO DEMOSTRACIÓN GUIADA (Pincel Mágico fluido paso a paso)
    const handleDemonstrate = async () => {
        if (isDemonstrating || isCurrentKanjiFinished) return;
        setIsDemonstrating(true);
        didacticSound.playClick();

        for (let s = completedStrokes.length; s < activeItem.strokes.length; s++) {
            const stroke = activeItem.strokes[s];
            const geom = strokeGeometries[stroke.id];
            if (geom) {
                const steps = 16;
                for (let i = 1; i <= steps; i++) {
                    setStrokeProgress(i / steps);
                    await new Promise((res) => setTimeout(res, 22));
                }
            }
            await new Promise((res) => setTimeout(res, 80));
            completeStroke(stroke.id);
            await new Promise((res) => setTimeout(res, 180));
        }

        setIsDemonstrating(false);
    };

    // Limpiar trazos del kanji actual para volver a practicar
    const handleResetCurrent = () => {
        didacticSound.playClick();
        setCompletedStrokesByKanji((prev) => ({ ...prev, [activeItem.kanji]: [] }));
        setMasteredKanjis((prev) => prev.filter((k) => k !== activeItem.kanji));
        setUserPoints([]);
        setCurrentPointer(null);
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

                    {/* BADGE MARCIAL FLOTANTE Y CONTROL DE VOZ */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-400/40 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-lg">
                            <Sparkle className="w-4 h-4 text-yellow-400" weight="fill" />
                            <span>Pincel Shodo: Números del 1 al 10</span>
                        </div>

                        {/* Botón sutil flotante de Voz (apagada por defecto) */}
                        <button
                            type="button"
                            onClick={() => {
                                if (isVoiceActive) {
                                    if (typeof window !== "undefined" && window.speechSynthesis) {
                                        window.speechSynthesis.cancel();
                                    }
                                    setIsVoiceActive(false);
                                } else {
                                    setIsVoiceActive(true);
                                    playPronunciation(activeItem.hiragana, activeItem.romaji);
                                }
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md border shadow-md ${
                                isVoiceActive
                                    ? "bg-black/85 border-[#58CC02]/80 text-[#58CC02] shadow-[0_0_10px_rgba(88,204,2,0.3)]"
                                    : "bg-black/70 border-white/20 text-slate-300 hover:text-white"
                            }`}
                            title={isVoiceActive ? "Voz activa (toca para silenciar)" : "Activar voz"}
                        >
                            {isVoiceActive ? (
                                <>
                                    <SpeakerHigh className="w-3.5 h-3.5" weight="fill" />
                                    <span>Voz: ON</span>
                                </>
                            ) : (
                                <>
                                    <SpeakerSlash className="w-3.5 h-3.5" />
                                    <span>Voz: OFF</span>
                                </>
                            )}
                        </button>
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
                            title="Escuchar pronunciación oficial en japonés"
                        >
                            <SpeakerHigh className="w-5 h-5" weight="fill" />
                            <span className="text-xs font-black uppercase hidden sm:inline">Pronunciación</span>
                        </button>
                    </div>

                    {/* BANNER DE PROGRESO DEL TRAZO ACTUAL */}
                    <div className="w-full max-w-[300px] xs:max-w-[340px] sm:max-w-[380px] bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 mb-2 flex items-center justify-between text-xs backdrop-blur-md">
                        <div className="flex items-center gap-2 text-zinc-300">
                            <PencilSimple className="w-4 h-4 text-amber-400" weight="bold" />
                            <span>
                                Trazo <strong>{completedStrokes.length}</strong> de{" "}
                                <strong>{activeItem.strokes.length}</strong>:{" "}
                                <span className="text-amber-400 font-bold">
                                    {currentTargetStroke ? currentTargetStroke.name : "¡Número Dominado!"}
                                </span>
                            </span>
                        </div>
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded-md border border-amber-400/30">
                            {Math.round((completedStrokes.length / activeItem.strokes.length) * 100)}%
                        </span>
                    </div>

                    {/* TOAST DE FEEDBACK Y GUÍA */}
                    <AnimatePresence>
                        {feedbackTip && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="mb-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-bold flex items-center gap-1.5 shadow-md"
                            >
                                <WarningCircle className="w-3.5 h-3.5" weight="fill" />
                                <span>{feedbackTip}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* EL AUTÉNTICO LIENZO DE PAPEL WASHI BLANCO CON CUADRÍCULA DE ARROZ (米 GRID EN TINTA BERMELLÓN) */}
                    <div className="relative w-full max-w-[300px] xs:max-w-[340px] sm:max-w-[380px] aspect-square rounded-2xl overflow-hidden border-2 border-zinc-700 shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_0_25px_rgba(215,200,175,0.15)] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB] touch-none select-none">
                        {/* CUADRÍCULA DE PRÁCTICA TRADICIONAL JAPONESA (米 GRID BERMELLÓN) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" viewBox="0 0 100 100">
                            {/* Borde exterior */}
                            <rect x="3" y="3" width="94" height="94" fill="none" stroke="#DC2626" strokeWidth="0.8" />
                            {/* Línea horizontal central */}
                            <line x1="3" y1="50" x2="97" y2="50" stroke="#DC2626" strokeWidth="0.6" strokeDasharray="2,2" />
                            {/* Línea vertical central */}
                            <line x1="50" y1="3" x2="50" y2="97" stroke="#DC2626" strokeWidth="0.6" strokeDasharray="2,2" />
                            {/* Diagonales */}
                            <line x1="3" y1="3" x2="97" y2="97" stroke="#DC2626" strokeWidth="0.4" strokeDasharray="1.5,2.5" />
                            <line x1="97" y1="3" x2="3" y2="97" stroke="#DC2626" strokeWidth="0.4" strokeDasharray="1.5,2.5" />
                        </svg>

                        {/* CAPA SVG INTERACTIVA (Idéntica a Karate-Do) */}
                        <svg
                            ref={svgRef}
                            className="absolute inset-0 w-full h-full cursor-crosshair touch-none select-none"
                            viewBox="0 0 100 100"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                            style={{
                                touchAction: "none",
                                WebkitTouchCallout: "none",
                                WebkitUserSelect: "none",
                                userSelect: "none",
                            }}
                        >
                            {/* 1. GUÍA FANTASMA DE TRAZOS NO COMPLETADOS (Grafito suave sobre papel Washi) */}
                            {showGuide &&
                                activeItem.strokes.map((stroke) => {
                                    const isCompleted = completedStrokes.includes(stroke.id);
                                    if (isCompleted) return null;

                                    return (
                                        <path
                                            key={`ghost-${stroke.id}`}
                                            d={stroke.path}
                                            fill="none"
                                            stroke="rgba(113, 113, 122, 0.22)"
                                            strokeWidth="7.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    );
                                })}

                            {/* 2. TRAZOS COMPLETADOS EN AUTÉNTICA TINTA NEGRA SUMI-E (3 Capas) */}
                            {activeItem.strokes.map((stroke) => {
                                const isCompleted = completedStrokes.includes(stroke.id);
                                if (!isCompleted) return null;
                                const isFlashing = flashStrokeId === stroke.id;

                                return (
                                    <g key={`ink-${stroke.id}`}>
                                        {/* Capa 1: Difuminado de absorción en el papel */}
                                        <path
                                            d={stroke.path}
                                            fill="none"
                                            stroke="#18181b"
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-20"
                                        />
                                        {/* Capa 2: Cuerpo principal de carbón negro puro */}
                                        <path
                                            d={stroke.path}
                                            fill="none"
                                            stroke="#09090b"
                                            strokeWidth="7.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-95"
                                        />
                                        {/* Capa 3: Textura sutil del pelo del pincel */}
                                        <path
                                            d={stroke.path}
                                            fill="none"
                                            stroke="#27272a"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-35"
                                        />
                                        {/* Destello dorado al sellar */}
                                        {isFlashing && (
                                            <path
                                                d={stroke.path}
                                                fill="none"
                                                stroke="#F59E0B"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-60 animate-ping"
                                            />
                                        )}
                                    </g>
                                );
                            })}

                            {/* 3. TRAZO OBJETIVO ACTIVO: Guía bermellón y flujo progresivo de tinta negra */}
                            {currentTargetStroke && !isCurrentKanjiFinished && strokeGeometries[currentTargetStroke.id] && (
                                <g>
                                    {/* Guía punteada bermellón */}
                                    {showGuide && (
                                        <>
                                            <path
                                                d={currentTargetStroke.path}
                                                fill="none"
                                                stroke="#EF4444"
                                                strokeWidth="5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeDasharray="2,3"
                                                className="opacity-55 animate-pulse"
                                            />

                                            {/* Círculo de inicio numerado (Estilo sello de laca roja) */}
                                            <circle
                                                cx={currentTargetStroke.start[0]}
                                                cy={currentTargetStroke.start[1]}
                                                r="4.8"
                                                fill="#DC2626"
                                                stroke="#991B1B"
                                                strokeWidth="1"
                                                className="drop-shadow-sm"
                                            />
                                            <circle
                                                cx={currentTargetStroke.start[0]}
                                                cy={currentTargetStroke.start[1]}
                                                r="7"
                                                fill="none"
                                                stroke="#DC2626"
                                                strokeWidth="0.8"
                                                className="animate-ping opacity-50"
                                            />
                                            <text
                                                x={currentTargetStroke.start[0]}
                                                y={currentTargetStroke.start[1] + 1.6}
                                                textAnchor="middle"
                                                fill="#FFFFFF"
                                                fontSize="4.5"
                                                fontWeight="900"
                                                className="select-none pointer-events-none"
                                            >
                                                {currentTargetStroke.id}
                                            </text>

                                            {/* Círculo objetivo de llegada */}
                                            <circle
                                                cx={currentTargetStroke.end[0]}
                                                cy={currentTargetStroke.end[1]}
                                                r="3.5"
                                                fill="none"
                                                stroke="#DC2626"
                                                strokeWidth="1.2"
                                                strokeDasharray="1.5,1.5"
                                                className="opacity-80"
                                            />
                                            <circle
                                                cx={currentTargetStroke.end[0]}
                                                cy={currentTargetStroke.end[1]}
                                                r="1.2"
                                                fill="#DC2626"
                                            />
                                        </>
                                    )}

                                    {/* REVELACIÓN PROGRESIVA DE TINTA SUMI-E (Pinta la curva exacta bajo el dedo del karateka) */}
                                    {strokeProgress > 0 && (
                                        <g>
                                            {/* Halo de absorción */}
                                            <path
                                                d={currentTargetStroke.path}
                                                fill="none"
                                                stroke="#18181b"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeDasharray={strokeGeometries[currentTargetStroke.id].totalLength}
                                                strokeDashoffset={
                                                    strokeGeometries[currentTargetStroke.id].totalLength *
                                                    (1 - strokeProgress)
                                                }
                                                className="opacity-25"
                                            />
                                            {/* Tinta negra pura */}
                                            <path
                                                d={currentTargetStroke.path}
                                                fill="none"
                                                stroke="#09090b"
                                                strokeWidth="7.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeDasharray={strokeGeometries[currentTargetStroke.id].totalLength}
                                                strokeDashoffset={
                                                    strokeGeometries[currentTargetStroke.id].totalLength *
                                                    (1 - strokeProgress)
                                                }
                                                className="opacity-95"
                                            />
                                            {/* Espina del pincel */}
                                            <path
                                                d={currentTargetStroke.path}
                                                fill="none"
                                                stroke="#27272a"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeDasharray={strokeGeometries[currentTargetStroke.id].totalLength}
                                                strokeDashoffset={
                                                    strokeGeometries[currentTargetStroke.id].totalLength *
                                                    (1 - strokeProgress)
                                                }
                                                className="opacity-40"
                                            />
                                        </g>
                                    )}
                                </g>
                            )}

                            {/* 4. TRAZO SUAVE EN VIVO (SPLINE DE TINTA) */}
                            {renderUserInkSpline()}

                            {/* 5. PUNTERO DEL PINCEL SHODO (Orbe y punta que sigue el dedo) */}
                            {isDrawing && currentPointer && (
                                <g>
                                    <circle
                                        cx={currentPointer.x}
                                        cy={currentPointer.y}
                                        r="5.5"
                                        fill="#09090b"
                                        opacity="0.2"
                                        className="animate-pulse"
                                    />
                                    <circle
                                        cx={currentPointer.x}
                                        cy={currentPointer.y}
                                        r="3.5"
                                        fill="#09090b"
                                        stroke="#27272a"
                                        strokeWidth="1"
                                    />
                                    <circle
                                        cx={currentPointer.x - 1}
                                        cy={currentPointer.y - 1}
                                        r="1"
                                        fill="#FFFFFF"
                                        opacity="0.6"
                                    />
                                </g>
                            )}
                        </svg>

                        {/* SELLO INKAN ROJO DE MAESTRÍA (Hanko Stamp sobre el papel) */}
                        <AnimatePresence>
                            {isCurrentKanjiFinished && (
                                <motion.div
                                    initial={{ scale: 2.2, opacity: 0, rotate: -20 }}
                                    animate={{ scale: 1, opacity: 1, rotate: -6 }}
                                    transition={{ type: "spring", damping: 14, stiffness: 180 }}
                                    className="absolute bottom-4 right-4 pointer-events-none drop-shadow-md z-20"
                                >
                                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg border-3 border-red-700 bg-red-600/10 p-1 flex flex-col items-center justify-center text-red-600 font-serif font-black shadow-inner relative overflow-hidden backdrop-blur-[0.5px]">
                                        <div className="absolute inset-1 border border-red-700/50 rounded-sm pointer-events-none" />
                                        <span className="text-[9px] tracking-widest leading-none border-b border-red-700/50 pb-0.5 font-black uppercase">
                                            APROBADO
                                        </span>
                                        <span className="text-xs tracking-wider font-extrabold text-red-700 mt-1 leading-none uppercase">
                                            {activeItem.romaji}
                                        </span>
                                        <span className="text-[8px] text-red-600/90 tracking-wider leading-none mt-0.5 font-sans font-bold uppercase">
                                            KUMA DOJO
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* BANNER INICIAL INDICATIVO */}
                        {completedStrokes.length === 0 && !isDrawing && (
                            <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none z-20">
                                <div className="bg-zinc-950/85 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/40 flex items-center gap-1.5 shadow-xl animate-bounce">
                                    <HandPointing className="w-4 h-4 text-amber-400" weight="fill" />
                                    <span className="text-[11px] font-bold">
                                        Desliza el pincel de tinta desde el punto (1)
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* BARRA DE HERRAMIENTAS Y CONTROL (Idéntica a Karate-Do) */}
                    <div className="flex items-center justify-between w-full max-w-[300px] xs:max-w-[340px] sm:max-w-[380px] mt-3 gap-2">
                        {/* BOTÓN LIMPIAR */}
                        <button
                            type="button"
                            onClick={handleResetCurrent}
                            title="Limpiar este número para volver a trazar"
                            className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <ArrowCounterClockwise className="w-3.5 h-3.5" />
                            <span>Limpiar</span>
                        </button>

                        {/* BOTÓN CONMUTAR GUÍA */}
                        <button
                            type="button"
                            onClick={() => {
                                didacticSound.playClick();
                                setShowGuide((prev) => !prev);
                            }}
                            title="Mostrar u ocultar guías"
                            className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                showGuide
                                    ? "bg-amber-500/15 border-amber-400/50 text-amber-400"
                                    : "bg-white/5 border-white/10 text-zinc-400"
                            }`}
                        >
                            {showGuide ? <Eye className="w-3.5 h-3.5" /> : <EyeSlash className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">Guía</span>
                        </button>

                        {/* BOTÓN DEMOSTRACIÓN / PINCEL MÁGICO */}
                        <button
                            type="button"
                            disabled={isDemonstrating || isCurrentKanjiFinished}
                            onClick={handleDemonstrate}
                            title="Demostración guiada con pincel de tinta Sumi-e"
                            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                            <Lightbulb className="w-3.5 h-3.5" weight="bold" />
                            <span>{isDemonstrating ? "Trazando..." : "Demostración"}</span>
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
