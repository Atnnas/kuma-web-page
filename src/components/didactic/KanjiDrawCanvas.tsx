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
    const kanjiList = customKanjiList;
    const [activeKanjiIndex, setActiveKanjiIndex] = useState(0);
    const activeKanji = kanjiList[activeKanjiIndex] || kanjiList[0];

    // Completed strokes for each kanji: { [kanjiChar]: number[] }
    const [completedStrokesByKanji, setCompletedStrokesByKanji] = useState<{ [key: string]: number[] }>({
        "空": [],
        "手": [],
        "道": [],
    });

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

    // POINTER DOWN: Verify user starts at checkpoint 0
    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        if (isKanjiFinished || isDemonstrating || !currentTargetStroke) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        const coords = getSvgCoords(e.clientX, e.clientY);
        if (!coords) return;

        const geom = strokeGeometries[currentTargetStroke.id];
        if (!geom || geom.checkpoints.length === 0) return;

        const startPt = geom.checkpoints[0];
        const distToStart = distance(coords, startPt);

        // Start radius: must touch close to the start dot (16 units)
        if (distToStart < 16) {
            setIsDrawing(true);
            setUserPoints([coords]);
            setCurrentPointer(coords);
            setHighestCheckpoint(0);
            setStrokeProgress(0.01);
            setFeedbackTip(null);
        } else {
            setFeedbackTip(`Inicia exactamente en el punto rojo (${currentTargetStroke.id})`);
            setTimeout(() => setFeedbackTip(null), 2500);
        }
    };

    // POINTER MOVE: Strictly tether ink progression to user's exact projected position along curve
    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawing || isKanjiFinished || isDemonstrating || !currentTargetStroke) return;
        const coords = getSvgCoords(e.clientX, e.clientY);
        if (!coords) return;

        setUserPoints((prev) => [...prev, coords]);
        setCurrentPointer(coords);

        const geom = strokeGeometries[currentTargetStroke.id];
        if (!geom) return;

        const checkpoints = geom.checkpoints;
        const total = checkpoints.length;
        let currentK = highestCheckpoint;

        // Strictly advance segment by segment based on actual user projection
        while (currentK < total - 1) {
            const p1 = checkpoints[currentK];
            const p2 = checkpoints[currentK + 1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const lenSq = dx * dx + dy * dy;

            if (lenSq < 0.0001) {
                currentK++;
                continue;
            }

            // Project user touch onto segment [p1, p2]
            const t = ((coords.x - p1.x) * dx + (coords.y - p1.y) * dy) / lenSq;
            const clampedT = Math.max(0, Math.min(1, t));
            const projX = p1.x + clampedT * dx;
            const projY = p1.y + clampedT * dy;
            const distToSeg = Math.hypot(coords.x - projX, coords.y - projY);

            // User must be following along the curve (max tolerance: 16 units)
            if (distToSeg > 16) {
                // Outside path tolerance: do not advance ink ahead
                break;
            }

            if (t >= 1) {
                // User has passed this segment, advance to next segment
                currentK++;
            } else if (t > 0) {
                // User is currently inside this segment!
                // Ink progress is strictly locked to cursor's exact fractional position:
                const exactFraction = (currentK + clampedT) / (total - 1);
                setHighestCheckpoint(currentK);
                setStrokeProgress(exactFraction);
                return;
            } else {
                // User is behind or at start of segment
                break;
            }
        }

        setHighestCheckpoint(currentK);
        setStrokeProgress(currentK / (total - 1));
    };

    // POINTER UP: Check if user completed the entire stroke (>= 85% of curve and near end)
    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawing || !currentTargetStroke) return;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // Ignore capture release error
        }

        const geom = strokeGeometries[currentTargetStroke.id];
        if (geom) {
            const totalCheckpoints = geom.checkpoints.length;
            const required = Math.floor(totalCheckpoints * 0.85);
            const endPt = geom.checkpoints[totalCheckpoints - 1];
            const lastUserPt = userPoints[userPoints.length - 1] || currentPointer;
            const distToEnd = lastUserPt ? distance(lastUserPt, endPt) : 999;

            if ((highestCheckpoint >= required || strokeProgress >= 0.85) && distToEnd < 22) {
                // Complete stroke!
                completeStroke(currentTargetStroke.id);
            } else {
                // Incomplete: notify user to draw all the way to the end
                setFeedbackTip("¡Traza todo el recorrido de la línea hasta el final!");
                setTimeout(() => setFeedbackTip(null), 2500);
            }
        }

        setIsDrawing(false);
        setStrokeProgress(0);
        setHighestCheckpoint(0);
        setUserPoints([]);
        setCurrentPointer(null);
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
            <div className="flex items-center justify-center gap-2 mb-3.5 w-full max-w-md">
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
                            className={`flex-1 py-2 px-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                isActive
                                    ? "bg-gradient-to-b from-amber-500/25 to-kuma-gold/10 border-kuma-gold text-white shadow-lg shadow-kuma-gold/20 scale-[1.02]"
                                    : "bg-zinc-900/80 hover:bg-zinc-850 border-white/10 text-zinc-400"
                            }`}
                        >
                            <span className="font-serif font-black text-2xl">{item.kanji}</span>
                            <div className="flex flex-col text-left">
                                <span className="text-[11px] font-black uppercase tracking-wider leading-none text-kuma-gold">
                                    {item.romaji}
                                </span>
                                <span className="text-[9px] text-zinc-400 leading-none truncate max-w-[65px]">
                                    {item.meaning}
                                </span>
                            </div>
                            {isDone && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-auto" weight="fill" />}
                        </button>
                    );
                })}
            </div>

            {/* STROKE PROGRESS & FEEDBACK BANNER */}
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 mb-2.5 flex items-center justify-between text-xs backdrop-blur-md">
                <div className="flex items-center gap-2 text-zinc-300">
                    <PencilSimple className="w-4 h-4 text-kuma-gold" weight="bold" />
                    <span>
                        Trazo <strong>{completedStrokes.length}</strong> de{" "}
                        <strong>{activeKanji.strokes.length}</strong>:{" "}
                        <span className="text-kuma-gold font-bold">
                            {currentTargetStroke ? currentTargetStroke.name : "¡Kanji Dominado!"}
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-kuma-gold uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded-md border border-kuma-gold/30">
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
                        className="mb-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                        <WarningCircle className="w-3.5 h-3.5" weight="fill" />
                        <span>{feedbackTip}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CALLIGRAPHY AUTHENTIC WHITE WASHI PAPER SHEET */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square rounded-2xl overflow-hidden border-2 border-zinc-700 shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_0_25px_rgba(215,200,175,0.15)] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFEB] touch-none">
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
                        onPointerLeave={handlePointerUp}
                        style={{ touchAction: "none" }}
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

                                        {/* End target circle */}
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
                                className="absolute bottom-4 right-4 pointer-events-none drop-shadow-md"
                            >
                                <div className="w-18 h-18 rounded-lg border-3 border-red-700 bg-red-600/10 p-1 flex flex-col items-center justify-center text-red-600 font-serif font-black shadow-inner relative overflow-hidden backdrop-blur-[0.5px]">
                                    <div className="absolute inset-1 border border-red-700/50 rounded-sm pointer-events-none" />
                                    <span className="text-[9px] tracking-widest leading-none border-b border-red-700/50 pb-0.5 font-black uppercase">
                                        APROBADO
                                    </span>
                                    <span className="text-xs tracking-wider font-extrabold text-red-700 mt-1 leading-none uppercase">
                                        {activeKanji.romaji}
                                    </span>
                                    <span className="text-[8px] text-red-600/90 tracking-wider leading-none mt-0.5 font-sans font-bold uppercase">
                                        KUMA DOJO
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CALLOUT OVERLAY WHEN WAITING TO START */}
                    {completedStrokes.length === 0 && !isDrawing && (
                        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
                            <div className="bg-zinc-950/85 text-white backdrop-blur-md px-4 py-2 rounded-full border border-amber-500/40 flex items-center gap-2 shadow-xl animate-bounce">
                                <HandPointing className="w-4 h-4 text-kuma-gold" weight="fill" />
                                <span className="text-xs font-bold">
                                    Desliza el pincel de tinta desde el punto (1)
                                </span>
                            </div>
                        </div>
                    )}
            </div>

            {/* ACTION TOOLBAR CONTROLS */}
            <div className="flex items-center justify-between w-full max-w-[340px] sm:max-w-[380px] mt-3.5 gap-2">
                {/* CLEAR CANVAS */}
                <button
                    onClick={handleReset}
                    title="Reiniciar este Kanji"
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <ArrowCounterClockwise className="w-3.5 h-3.5" />
                    <span>Limpiar</span>
                </button>

                {/* TOGGLE GUIDE */}
                <button
                    onClick={() => {
                        didacticSound.playClick();
                        setShowGuide((prev) => !prev);
                    }}
                    title="Mostrar u ocultar guías"
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        showGuide
                            ? "bg-amber-500/15 border-kuma-gold/50 text-kuma-gold"
                            : "bg-white/5 border-white/10 text-zinc-400"
                    }`}
                >
                    {showGuide ? <Eye className="w-3.5 h-3.5" /> : <EyeSlash className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">Guía</span>
                </button>

                {/* SENSEI DEMONSTRATION */}
                <button
                    disabled={isDemonstrating || isKanjiFinished}
                    onClick={handleDemonstrate}
                    title="Demostración guiada de Sensei Kuma con pincel de tinta"
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-kuma-gold/20 hover:from-amber-500/30 hover:to-kuma-gold/30 border border-kuma-gold/40 text-kuma-gold text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                    <Lightbulb className="w-3.5 h-3.5" weight="bold" />
                    <span>{isDemonstrating ? "Trazando..." : "Demostración"}</span>
                </button>
            </div>

            {/* OVERALL PROGRESS BADGE FOR ALL 3 KANJIS */}
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                <span>Kanjis completados:</span>
                <div className="flex items-center gap-1.5">
                    {kanjiList.map((k) => {
                        const done = completedKanjis.includes(k.kanji);
                        return (
                            <span
                                key={`badge-${k.kanji}`}
                                className={`px-2 py-0.5 rounded-md font-serif text-xs font-black border transition-all ${
                                    done
                                        ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-300"
                                        : "bg-white/5 border-white/10 text-zinc-500"
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
