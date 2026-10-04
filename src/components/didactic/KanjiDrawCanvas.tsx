"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KanjiCharDef, KanjiStrokeDef } from "@/types/didactica";
import { KARATE_DO_KANJIS } from "@/data/karateKanjis";
import { didacticSound } from "@/lib/didacticSound";
import {
    ArrowCounterClockwise,
    CheckCircle,
    Eye,
    EyeSlash,
    PencilSimple,
    Lightbulb,
    HandPointing,
    WarningCircle,
} from "@phosphor-icons/react";

interface KanjiDrawCanvasProps {
    onAllCompleted?: () => void;
    onKanjiCompleted?: (kanji: string, completedCount: number, totalCount: number) => void;
    customKanjiList?: KanjiCharDef[];
}

interface StrokeGeometry {
    totalLength: number;
    checkpoints: Array<{ x: number; y: number }>;
}

export function KanjiDrawCanvas({
    onAllCompleted,
    onKanjiCompleted,
    customKanjiList = KARATE_DO_KANJIS,
}: KanjiDrawCanvasProps) {
    const kanjiList = customKanjiList || KARATE_DO_KANJIS;
    const [activeKanjiIndex, setActiveKanjiIndex] = useState(0);
    const activeKanji = kanjiList[activeKanjiIndex] || kanjiList[0];

    // Completed strokes for each kanji: { [kanjiChar]: number[] }
    const [completedStrokesByKanji, setCompletedStrokesByKanji] = useState<{ [key: string]: number[] }>(() => {
        const initial: { [key: string]: number[] } = {};
        kanjiList.forEach((k) => {
            initial[k.kanji] = [];
        });
        return initial;
    });

    // Reset when customKanjiList prop changes
    useEffect(() => {
        const initial: { [key: string]: number[] } = {};
        kanjiList.forEach((k) => {
            initial[k.kanji] = [];
        });
        setCompletedStrokesByKanji(initial);
        setCompletedKanjis([]);
        setActiveKanjiIndex(0);
    }, [customKanjiList]);

    // Which kanjis are 100% completed
    const [completedKanjis, setCompletedKanjis] = useState<string[]>([]);

    // Stroke geometries (measured path length + sampled checkpoints)
    const [strokeGeometries, setStrokeGeometries] = useState<{ [strokeId: number]: StrokeGeometry }>({});

    // Drawing interaction state
    const [isDrawing, setIsDrawing] = useState(false);
    const [userPoints, setUserPoints] = useState<Array<{ x: number; y: number }>>([]);
    const [currentPointer, setCurrentPointer] = useState<{ x: number; y: number } | null>(null);
    const [strokeProgress, setStrokeProgress] = useState(0); // 0 to 1
    const [highestCheckpoint, setHighestCheckpoint] = useState(0);
    const [feedbackTip, setFeedbackTip] = useState<string | null>(null);
    const [flashStrokeId, setFlashStrokeId] = useState<number | null>(null);

    const [showGuide, setShowGuide] = useState(true);
    const [isDemonstrating, setIsDemonstrating] = useState(false);

    const svgRef = useRef<SVGSVGElement | null>(null);

    const completedStrokes = completedStrokesByKanji[activeKanji.kanji] || [];
    const currentStrokeIndex = completedStrokes.length;
    const currentTargetStroke: KanjiStrokeDef | undefined = activeKanji.strokes[currentStrokeIndex];
    const isKanjiFinished = completedStrokes.length === activeKanji.strokes.length;

    // 1. Calculate path geometry and checkpoints on mount/kanji change
    useEffect(() => {
        if (typeof window === "undefined") return;
        const geometries: { [strokeId: number]: StrokeGeometry } = {};
        const svgNamespace = "http://www.w3.org/2000/svg";

        activeKanji.strokes.forEach((stroke) => {
            const pathEl = document.createElementNS(svgNamespace, "path");
            pathEl.setAttribute("d", stroke.path);
            const totalLength = pathEl.getTotalLength();
            const samples = 40; // Dense checkpoints for exact 1-to-1 ink tethering
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
    }, [activeKanji]);

    // Convert mouse/touch event into 0-100 normalized coordinate system
    const getSvgCoords = useCallback(
        (clientX: number, clientY: number): { x: number; y: number } | null => {
            if (!svgRef.current) return null;
            const rect = svgRef.current.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return null;
            const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
            return { x, y };
        },
        []
    );

    // Distance calculation
    const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    };

    // Complete stroke with golden flourish & sound
    const completeStroke = useCallback(
        (strokeId: number) => {
            didacticSound.playClick();
            setFlashStrokeId(strokeId);
            setTimeout(() => setFlashStrokeId(null), 600);

            setCompletedStrokesByKanji((prev) => {
                const existing = prev[activeKanji.kanji] || [];
                if (existing.includes(strokeId)) return prev;
                const nextStrokes = [...existing, strokeId];

                // Check if this completes the active kanji
                if (nextStrokes.length === activeKanji.strokes.length) {
                    setCompletedKanjis((prevKanjis) => {
                        if (!prevKanjis.includes(activeKanji.kanji)) {
                            const updated = [...prevKanjis, activeKanji.kanji];
                            if (onKanjiCompleted) {
                                onKanjiCompleted(activeKanji.kanji, updated.length, kanjiList.length);
                            }

                            // ONLY when all kanjis (e.g. all 3 for Karate-Do) are done, trigger onAllCompleted
                            if (updated.length >= kanjiList.length) {
                                if (onAllCompleted) onAllCompleted();
                            } else {
                                // Automatically advance to the next uncompleted kanji after a celebratory pause
                                setTimeout(() => {
                                    const nextIdx = kanjiList.findIndex((k) => !updated.includes(k.kanji));
                                    if (nextIdx !== -1) {
                                        setActiveKanjiIndex(nextIdx);
                                        setUserPoints([]);
                                        setCurrentPointer(null);
                                        setStrokeProgress(0);
                                        setHighestCheckpoint(0);
                                        setFeedbackTip(null);
                                    }
                                }, 900);
                            }
                            return updated;
                        }
                        return prevKanjis;
                    });
                }
                return { ...prev, [activeKanji.kanji]: nextStrokes };
            });

            // Reset live drawing state
            setStrokeProgress(0);
            setHighestCheckpoint(0);
            setUserPoints([]);
            setCurrentPointer(null);
            setFeedbackTip(null);
        },
        [activeKanji, onAllCompleted, onKanjiCompleted]
    );

    // Refs to maintain real-time sync with 60Hz/120Hz touch events without stale closure lag
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
    const isKanjiFinishedRef = useRef(isKanjiFinished);
    isKanjiFinishedRef.current = isKanjiFinished;
    const isDemonstratingRef = useRef(isDemonstrating);
    isDemonstratingRef.current = isDemonstrating;

    // UNIFIED DRAWING CORE (Supports both iOS Safari Touch & Desktop Pointer)
    const startDrawing = useCallback(
        (clientX: number, clientY: number) => {
            if (isKanjiFinishedRef.current || isDemonstratingRef.current || !currentTargetStrokeRef.current) return;
            const coords = getSvgCoords(clientX, clientY);
            if (!coords) return;

            const stroke = currentTargetStrokeRef.current;
            const geom = strokeGeometriesRef.current[stroke.id];
            if (!geom || geom.checkpoints.length === 0) return;

            const startPt = geom.checkpoints[0];
            const distToStart = distance(coords, startPt);

            // Finger touch tolerance on mobile: 24 units
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
            if (!isDrawingRef.current || isKanjiFinishedRef.current || isDemonstratingRef.current || !currentTargetStrokeRef.current) return;
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

            // Lookahead segment search: scan up to 10 checkpoints forward
            // This prevents rapid swipes / curves on 60Hz and 120Hz screens from stalling!
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

            // Completion check: drawn >= 76% OR reached end point (< 28 units)
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

    // NATIVE TOUCH LISTENERS (Direct non-passive listeners solve iOS Safari gesture hijacking & pointercancel)
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

    // DESKTOP POINTER HANDLERS (Ignores touch to avoid duplicate events on hybrid devices)
    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        if (e.pointerType === "touch") return;
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // Ignore capture error
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
            // Ignore capture release error
        }
        endDrawing();
    };

    // Smooth spline interpolation for user's drawing ink (Deep Black Sumi-e on White Paper)
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
                {/* Wet paper ink bleed halo */}
                <path
                    d={d}
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-25"
                />
                {/* Core carbon black sumi ink */}
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

    // DEMONSTRATION MODE: Fluidly animate the stroke brush sweep over time
    const handleDemonstrate = async () => {
        if (isDemonstrating || isKanjiFinished) return;
        setIsDemonstrating(true);
        didacticSound.playClick();

        for (let s = completedStrokes.length; s < activeKanji.strokes.length; s++) {
            const stroke = activeKanji.strokes[s];
            const geom = strokeGeometries[stroke.id];
            if (geom) {
                // Smoothly animate strokeProgress from 0 to 1
                const steps = 15;
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

    // Reset current kanji
    const handleReset = () => {
        didacticSound.playClick();
        setCompletedStrokesByKanji((prev) => ({ ...prev, [activeKanji.kanji]: [] }));
        setCompletedKanjis((prev) => prev.filter((k) => k !== activeKanji.kanji));
        setUserPoints([]);
        setCurrentPointer(null);
        setStrokeProgress(0);
        setHighestCheckpoint(0);
        setFeedbackTip(null);
    };

    return (
        <div className="w-full flex flex-col items-center select-none">
            {/* KANJI SELECTOR TABS */}
            <div className="flex items-center justify-center gap-2.5 mb-4 w-full max-w-lg">
                {kanjiList.map((item, idx) => {
                    const isDone = completedKanjis.includes(item.kanji);
                    const isActive = activeKanjiIndex === idx;

                    return (
                        <button
                            key={item.kanji}
                            onClick={() => {
                                didacticSound.playClick();
                                setActiveKanjiIndex(idx);
                                setUserPoints([]);
                                setCurrentPointer(null);
                                setStrokeProgress(0);
                                setHighestCheckpoint(0);
                                setFeedbackTip(null);
                            }}
                            className={`flex-1 py-2.5 px-3.5 rounded-2xl border-2 transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                                isActive
                                    ? "bg-gradient-to-b from-amber-500/25 to-kuma-gold/15 border-kuma-gold text-white shadow-xl shadow-kuma-gold/25 scale-[1.03]"
                                    : "bg-zinc-900/90 hover:bg-zinc-800 border-white/15 text-zinc-400"
                            }`}
                        >
                            <span className="font-serif font-black text-3xl sm:text-4xl text-amber-200">{item.kanji}</span>
                            <div className="flex flex-col text-left">
                                <span className="text-xs sm:text-sm font-black uppercase tracking-wider leading-none text-kuma-gold">
                                    {item.romaji}
                                </span>
                                <span className="text-[11px] sm:text-xs text-zinc-200 leading-tight font-medium max-w-[110px] mt-0.5 truncate">
                                    {item.meaning}
                                </span>
                            </div>
                            {isDone && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 ml-auto" weight="fill" />}
                        </button>
                    );
                })}
            </div>

            {/* STROKE PROGRESS & FEEDBACK BANNER */}
            <div className="w-full max-w-lg bg-zinc-900/90 border-2 border-white/15 rounded-2xl px-4 py-2.5 mb-3 flex items-center justify-between text-sm sm:text-base backdrop-blur-md shadow-md">
                <div className="flex items-center gap-2.5 text-zinc-200">
                    <PencilSimple className="w-5 h-5 text-kuma-gold shrink-0" weight="bold" />
                    <span className="text-xs sm:text-sm font-medium">
                        Trazo <strong className="text-white font-extrabold text-sm sm:text-base">{completedStrokes.length}</strong> de{" "}
                        <strong className="text-white font-extrabold text-sm sm:text-base">{activeKanji.strokes.length}</strong>:{" "}
                        <span className="text-amber-300 font-black">
                            {currentTargetStroke ? currentTargetStroke.name : "¡Kanji Dominado!"}
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider bg-black/70 px-2.5 py-1 rounded-lg border border-amber-400/40 shadow-inner">
                        {Math.round((completedStrokes.length / activeKanji.strokes.length) * 100)}%
                    </span>
                </div>
            </div>

            {/* WARNING / GUIDANCE TOAST */}
            <AnimatePresence>
                {feedbackTip && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="mb-2.5 px-4 py-1.5 rounded-full bg-red-950/90 border-2 border-red-500/60 text-red-200 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg"
                    >
                        <WarningCircle className="w-4 h-4 text-red-400 shrink-0" weight="fill" />
                        <span>{feedbackTip}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CALLIGRAPHY AUTHENTIC WHITE WASHI PAPER SHEET */}
            <div className="relative w-full max-w-[300px] xs:max-w-[340px] sm:max-w-[380px] aspect-square rounded-2xl overflow-hidden border-2 border-zinc-700 shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_0_25px_rgba(215,200,175,0.15)] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB] touch-none select-none">
                {/* TRADITIONAL VERMILION PRACTICE GRID (米 Grid in Red Ink) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" viewBox="0 0 100 100">
                        {/* Outer boundary */}
                        <rect x="3" y="3" width="94" height="94" fill="none" stroke="#DC2626" strokeWidth="0.8" />
                        {/* Center horizontal */}
                        <line x1="3" y1="50" x2="97" y2="50" stroke="#DC2626" strokeWidth="0.6" strokeDasharray="2,2" />
                        {/* Center vertical */}
                        <line x1="50" y1="3" x2="50" y2="97" stroke="#DC2626" strokeWidth="0.6" strokeDasharray="2,2" />
                        {/* Diagonals */}
                        <line x1="3" y1="3" x2="97" y2="97" stroke="#DC2626" strokeWidth="0.4" strokeDasharray="1.5,2.5" />
                        <line x1="97" y1="3" x2="3" y2="97" stroke="#DC2626" strokeWidth="0.4" strokeDasharray="1.5,2.5" />
                    </svg>

                    {/* SVG INTERACTION LAYER */}
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
                        {/* 1. GHOST OUTLINE OF UNCOMPLETED STROKES (Faint Watercolor / Graphite on White Paper) */}
                        {showGuide &&
                            activeKanji.strokes.map((stroke) => {
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

                        {/* 2. COMPLETED STROKES (Deep Carbon Black Sumi-e Ink on Rice Paper) */}
                        {activeKanji.strokes.map((stroke) => {
                            const isCompleted = completedStrokes.includes(stroke.id);
                            if (!isCompleted) return null;
                            const isFlashing = flashStrokeId === stroke.id;

                            return (
                                <g key={`ink-${stroke.id}`}>
                                    {/* Paper ink bleed underlayer */}
                                    <path
                                        d={stroke.path}
                                        fill="none"
                                        stroke="#18181b"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-20"
                                    />
                                    {/* Main carbon black Sumi-e body */}
                                    <path
                                        d={stroke.path}
                                        fill="none"
                                        stroke="#09090b"
                                        strokeWidth="7.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-95"
                                    />
                                    {/* Subtle brush hair texture line */}
                                    <path
                                        d={stroke.path}
                                        fill="none"
                                        stroke="#27272a"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-35"
                                    />
                                    {/* Golden completion flash */}
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

                        {/* 3. ACTIVE TARGET STROKE: Vermilion Guide & Progressive Ink Reveal */}
                        {currentTargetStroke && !isKanjiFinished && strokeGeometries[currentTargetStroke.id] && (
                            <g>
                                {/* Animated vermilion guide dash */}
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

                                        {/* Start indicator circle with number (Red lacquer seal style) */}
                                        <circle
                                            cx={currentTargetStroke.start[0]}
                                            cy={currentTargetStroke.start[1]}
                                            r="6"
                                            fill="#DC2626"
                                            stroke="#7F1D1D"
                                            strokeWidth="1.2"
                                            className="drop-shadow-md"
                                        />
                                        <circle
                                            cx={currentTargetStroke.start[0]}
                                            cy={currentTargetStroke.start[1]}
                                            r="8.5"
                                            fill="none"
                                            stroke="#DC2626"
                                            strokeWidth="1"
                                            className="animate-ping opacity-60"
                                        />
                                        <text
                                            x={currentTargetStroke.start[0]}
                                            y={currentTargetStroke.start[1] + 2}
                                            textAnchor="middle"
                                            fill="#FFFFFF"
                                            fontSize="5.8"
                                            fontWeight="900"
                                            className="select-none pointer-events-none"
                                        >
                                            {currentTargetStroke.id}
                                        </text>

                                        {/* End target circle */}
                                        <circle
                                            cx={currentTargetStroke.end[0]}
                                            cy={currentTargetStroke.end[1]}
                                            r="4.2"
                                            fill="none"
                                            stroke="#DC2626"
                                            strokeWidth="1.4"
                                            strokeDasharray="1.5,1.5"
                                            className="opacity-90"
                                        />
                                        <circle
                                            cx={currentTargetStroke.end[0]}
                                            cy={currentTargetStroke.end[1]}
                                            r="1.2"
                                            fill="#DC2626"
                                        />
                                    </>
                                )}

                                {/* PROGRESSIVE SUMI INK FLOW (Paints black ink along the curve under user's touch) */}
                                {strokeProgress > 0 && (
                                    <g>
                                        {/* Bleed halo */}
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
                                        {/* Core carbon black ink */}
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
                                        {/* Subtle brush spine */}
                                        <path
                                            d={currentTargetStroke.path}
                                            fill="none"
                                            stroke="#27272a"
                                            strokeWidth="2"
                                            strokeLinecap="round"
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

                        {/* 4. USER'S LIVE INK BRUSH TRAIL */}
                        {renderUserInkSpline()}

                        {/* 5. AUTHENTIC BRUSH TIP CURSOR AT POINTER */}
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

                    {/* HANKO / INKAN RED SEAL STAMP ON WHITE PAPER */}
                    <AnimatePresence>
                        {isKanjiFinished && (
                            <motion.div
                                initial={{ scale: 2.2, opacity: 0, rotate: -20 }}
                                animate={{ scale: 1, opacity: 1, rotate: -6 }}
                                transition={{ type: "spring", damping: 14, stiffness: 180 }}
                                className="absolute bottom-4 right-4 pointer-events-none drop-shadow-lg"
                            >
                                <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-xl border-3 border-red-700 bg-red-600/10 p-1.5 flex flex-col items-center justify-center text-red-600 font-serif font-black shadow-inner relative overflow-hidden backdrop-blur-[0.5px]">
                                    <div className="absolute inset-1 border border-red-700/50 rounded-sm pointer-events-none" />
                                    <span className="text-[11px] sm:text-xs tracking-widest leading-none border-b-2 border-red-700/50 pb-0.5 font-black uppercase">
                                        APROBADO
                                    </span>
                                    <span className="text-sm sm:text-base tracking-wider font-extrabold text-red-700 mt-1 leading-none uppercase">
                                        {activeKanji.romaji}
                                    </span>
                                    <span className="text-[10px] text-red-600/90 tracking-wider leading-none mt-1 font-sans font-bold uppercase">
                                        KUMA DOJO
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CALLOUT OVERLAY WHEN WAITING TO START */}
                    {completedStrokes.length === 0 && !isDrawing && (
                        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none px-2">
                            <div className="bg-zinc-950/90 text-white backdrop-blur-md px-5 py-2.5 rounded-full border-2 border-amber-500/50 flex items-center gap-2.5 shadow-2xl animate-bounce">
                                <HandPointing className="w-5 h-5 text-kuma-gold shrink-0" weight="fill" />
                                <span className="text-xs sm:text-sm font-extrabold">
                                    Desliza el pincel desde el punto rojo (1)
                                </span>
                            </div>
                        </div>
                    )}
            </div>

            {/* ACTION TOOLBAR CONTROLS */}
            <div className="flex items-center justify-between w-full max-w-[340px] sm:max-w-md mt-4 gap-2.5">
                {/* CLEAR CANVAS */}
                <button
                    onClick={handleReset}
                    title="Reiniciar este Kanji"
                    className="flex-1 py-2.5 px-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border-2 border-white/15 text-zinc-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                    <ArrowCounterClockwise className="w-4 h-4" />
                    <span>Limpiar</span>
                </button>

                {/* TOGGLE GUIDE */}
                <button
                    onClick={() => {
                        didacticSound.playClick();
                        setShowGuide((prev) => !prev);
                    }}
                    title="Mostrar u ocultar guías"
                    className={`py-2.5 px-3.5 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                        showGuide
                            ? "bg-amber-500/20 border-kuma-gold text-kuma-gold shadow-md shadow-kuma-gold/15"
                            : "bg-white/10 border-white/15 text-zinc-300"
                    }`}
                >
                    {showGuide ? <Eye className="w-4 h-4" /> : <EyeSlash className="w-4 h-4" />}
                    <span>Guía</span>
                </button>

                {/* SENSEI DEMONSTRATION */}
                <button
                    disabled={isDemonstrating || isKanjiFinished}
                    onClick={handleDemonstrate}
                    title="Demostración guiada de Sensei Kuma con pincel de tinta"
                    className="flex-1 py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-amber-500/25 to-kuma-gold/25 hover:from-amber-500/35 hover:to-kuma-gold/35 border-2 border-kuma-gold/50 text-kuma-gold text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                    <Lightbulb className="w-4 h-4" weight="bold" />
                    <span>{isDemonstrating ? "Trazando..." : "Demostración"}</span>
                </button>
            </div>

            {/* REVEAL CARD FOR KANJIS WITH PEDAGOGICAL ILLUSTRATION (e.g. KIAI: KI & AI) */}
            {activeKanji.revealImage && (
                <motion.div
                    key={`reveal-${activeKanji.kanji}-${isKanjiFinished}`}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`w-full max-w-[340px] sm:max-w-md mt-4 rounded-2xl p-3.5 border-2 transition-all ${
                        isKanjiFinished
                            ? "bg-gradient-to-r from-amber-500/25 via-zinc-900/95 to-amber-600/25 border-kuma-gold shadow-xl shadow-kuma-gold/20"
                            : "bg-zinc-900/80 border-white/15 opacity-80"
                    }`}
                >
                    <div className="flex items-center gap-3.5">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400/40 shadow-lg bg-black">
                            <img
                                src={activeKanji.revealImage}
                                alt={activeKanji.revealTitle || activeKanji.kanji}
                                className={`w-full h-full object-cover transition-all duration-500 ${
                                    isKanjiFinished ? "brightness-105 scale-105" : "grayscale blur-[1px] opacity-45"
                                }`}
                            />
                            {!isKanjiFinished && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-kuma-gold text-2xl">
                                    🔒
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col text-left">
                            <div className="flex items-center gap-1.5 mb-1">
                                <span
                                    className={`text-[11px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                                        isKanjiFinished
                                            ? "bg-kuma-gold text-black shadow-sm font-black"
                                            : "bg-white/15 text-zinc-300 font-bold"
                                    }`}
                                >
                                    {isKanjiFinished ? "¡Poder Revelado! ⚡" : "Traza para revelar"}
                                </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-black text-white leading-tight">
                                {activeKanji.revealTitle || `${activeKanji.kanji} - ${activeKanji.romaji}`}
                            </h4>
                            <p className="text-xs sm:text-sm text-zinc-200 mt-1 font-medium leading-snug">
                                {activeKanji.revealSubtitle || activeKanji.description}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* OVERALL PROGRESS BADGE FOR ALL KANJIS */}
            <div className="mt-4 flex items-center gap-2.5 text-sm sm:text-base text-zinc-200">
                <span className="font-semibold">Kanjis completados:</span>
                <div className="flex items-center gap-2">
                    {kanjiList.map((k) => {
                        const done = completedKanjis.includes(k.kanji);
                        return (
                            <span
                                key={`badge-${k.kanji}`}
                                className={`px-2.5 py-1 rounded-lg font-serif text-sm sm:text-base font-black border-2 transition-all ${
                                    done
                                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-sm"
                                        : "bg-white/5 border-white/15 text-zinc-400"
                                }`}
                            >
                                {k.kanji} {done ? "✓" : ""}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
