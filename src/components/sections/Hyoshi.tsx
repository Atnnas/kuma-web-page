"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Play,
    Stop,
    Pause,
    Record,
    Trash,
    FloppyDisk,
    FolderOpen,
    SpeakerHigh,
    CaretRight,
    Tag,
    Clock,
    Metronome,
    ArrowLeft,
    Warning
} from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { audioTrainer } from "@/lib/audio-trainer";
import { useSession } from "next-auth/react";

const PX_PER_SEC = 20; // Panoramic scale (approx 90s visible)
const VIEWPORT_OFFSET = 800; // Keep playhead at the right (800px) to see past

import { DEFAULT_KATAS, type Point, type Kata } from "@/data/default-katas";

export const Hyoshi = ({ onBack }: { onBack: () => void }) => {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "super_admin" || session?.user?.role === "editor";
    const [status, setStatus] = useState<"ready" | "recording" | "training" | "paused">("ready");
    const [timer, setTimer] = useState(0);
    const [currentKata, setCurrentKata] = useState<Kata>({ id: Date.now(), name: "", points: [] });
    const [library, setLibrary] = useState<Kata[]>(DEFAULT_KATAS);
    const [userKatas, setUserKatas] = useState<Kata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Refs
    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const lastPauseTimeRef = useRef<number>(0);
    const lastPerformanceTimeRef = useRef<number>(0);
    const pointsRef = useRef<Point[]>([]);
    const activeHoldRef = useRef<Point | null>(null);
    const isKeyPressedRef = useRef<Set<string>>(new Set());
    const statusRef = useRef(status);
    const timerRef = useRef(0);

    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    useEffect(() => {
        timerRef.current = timer;
    }, [timer]);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchUserKatas = async () => {
            try {
                const res = await fetch("/api/user/katas");
                if (res.ok) {
                    const data = await res.json();
                    setUserKatas(data);

                    // Merge logic: user katas (from DB) + DEFAULT_KATAS
                    setLibrary(prev => {
                        const merged = [...DEFAULT_KATAS];
                        data.forEach((uk: any) => {
                            const idx = merged.findIndex(k => k.name === uk.name);
                            if (idx !== -1) merged[idx] = uk;
                            else merged.push(uk);
                        });
                        return merged;
                    });
                }
            } catch (err) {
                console.error("Failed to fetch user katas", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserKatas();
    }, [session]);

    // --- AUDIO LOGIC ---
    const playBeep = useCallback((freq = 880) => audioTrainer.playTone(freq, 0.1, "sine"), []);
    const playPulseBeep = useCallback(() => audioTrainer.playTone(440, 0.05, "sine"), []);
    const playStartSfx = useCallback(() => audioTrainer.playStart(), []);

    // --- TIMER LOGIC ---
    const animate = useCallback((time: number) => {
        const currentStatus = statusRef.current;
        const now = performance.now();

        let currentTimer = timerRef.current;

        if (currentStatus === "recording" || currentStatus === "training") {
            const deltaTime = (now - lastPerformanceTimeRef.current) / 1000;
            const scaledDelta = deltaTime * playbackRate;

            // Advance the local accumulator
            currentTimer += currentStatus === "recording" ? deltaTime : scaledDelta;

            // Sync both Ref and State immediately for maximum precision
            timerRef.current = currentTimer;
            setTimer(currentTimer);
        }
        lastPerformanceTimeRef.current = now;

        // --- AUDIO RECONCILIATION ENGINE (DOUBLE-GATE) ---
        // Sound activates IF AND ONLY IF (Space is held) AND (Playhead is over an active bar)
        // AND (Status is Recording or Training)
        const isSpaceDown = isKeyPressedRef.current.has("Space");
        const isOverRecordedBar = currentKata.points.some(p =>
            currentTimer >= p.start && currentTimer <= (p.start + (p.duration || 0.1))
        );
        const isOverActiveHold = activeHoldRef.current !== null;

        let shouldSound = false;
        if (currentStatus === "training") {
            // During playback: sound plays automatically when passing over a bar
            shouldSound = isOverRecordedBar;
        } else if (currentStatus === "recording") {
            // During recording: sound only when space is actually held
            shouldSound = isSpaceDown;
        }

        if (shouldSound) {
            audioTrainer.startContinuousTone();
        } else {
            audioTrainer.stopContinuousTone();
        }

        // --- TRAINING LOGIC TRIGGER ---
        if (currentStatus === "training") {
            pointsRef.current.forEach((point) => {
                if (currentTimer >= point.start && !point.played) {
                    if (point.type !== "hold") {
                        playBeep();
                    }
                    point.played = true;
                }

                if (point.pulses) {
                    point.pulses.forEach((pulseTimeOffset, pIdx) => {
                        const absolutePulseTime = point.start + pulseTimeOffset;
                        if (currentTimer >= absolutePulseTime && (!point.playedPulses || !point.playedPulses.includes(pIdx))) {
                            playBeep(1100);
                            point.playedPulses = [...(point.playedPulses || []), pIdx];
                        }
                    });
                }
            });
        }

        requestRef.current = requestAnimationFrame((t) => animate(t));
    }, [playBeep, currentKata.points, playbackRate]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame((t) => animate(t));
        return () => cancelAnimationFrame(requestRef.current!);
    }, [animate]);

    // --- ACTIONS ---
    const startRecording = () => {
        setStatus("recording");
        setTimer(0);
        lastPerformanceTimeRef.current = performance.now();
        pointsRef.current = [];
        setCurrentKata(prev => ({ ...prev, points: [] }));
    };

    const startTraining = () => {
        if (status === "paused") {
            lastPerformanceTimeRef.current = performance.now();
        } else {
            setTimer(0);
            lastPerformanceTimeRef.current = performance.now();
            pointsRef.current = currentKata.points.map(p => ({ ...p, played: false, playedPulses: [], stopped: false }));
        }
        setStatus("training");
        playStartSfx();
    };

    const stopSystem = () => {
        setStatus("ready");
        if (status === "recording") {
            setCurrentKata(prev => ({ ...prev, points: pointsRef.current }));
        }
    };

    const pauseSystem = () => {
        if (status === "training" || status === "recording") {
            lastPauseTimeRef.current = timer;
            setStatus("paused");
        }
    };

    const clearCurrent = () => {
        setTimer(0);
        setCurrentKata({ id: Date.now(), name: "", points: [] });
        pointsRef.current = [];
        setStatus("ready");
    };

    const recordHit = () => {
        const currentStatus = statusRef.current;
        const currentTimer = timerRef.current;
        if (currentStatus === "recording" && !activeHoldRef.current) {
            const newPoint: Point & { id: string } = {
                id: Math.random().toString(36).substr(2, 9),
                type: "hold",
                start: currentTimer,
                name: "",
                pulses: []
            };
            activeHoldRef.current = newPoint;
            pointsRef.current = [...pointsRef.current, newPoint];
            setCurrentKata(prev => ({ ...prev, points: [...pointsRef.current] }));
        }
    };

    const recordRelease = () => {
        const currentStatus = statusRef.current;
        const currentTimer = timerRef.current;
        if (currentStatus === "recording" && activeHoldRef.current) {
            const duration = currentTimer - activeHoldRef.current.start;
            activeHoldRef.current.duration = Math.max(0.1, duration);

            // CRITICAL: Sync currentKata BEFORE clearing activeHoldRef to prevent rendering gap
            const finalPoints = [...pointsRef.current];
            setCurrentKata(prev => ({ ...prev, points: finalPoints }));

            activeHoldRef.current = null;
        }
    };

    const recordPulse = () => {
        const currentStatus = statusRef.current;
        const currentTimer = timerRef.current;
        if (currentStatus === "recording" && activeHoldRef.current) {
            const pulseOffset = currentTimer - activeHoldRef.current.start;
            if (!activeHoldRef.current.pulses) activeHoldRef.current.pulses = [];
            activeHoldRef.current.pulses.push(pulseOffset);
            setCurrentKata(prev => ({ ...prev, points: [...pointsRef.current] }));
            playBeep(1100);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isKeyPressedRef.current.has(e.code)) return;
            isKeyPressedRef.current.add(e.code);

            if (e.code === "Space") {
                e.preventDefault();
                recordHit();
            } else if (e.code === "ArrowUp") {
                e.preventDefault();
                recordPulse();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            isKeyPressedRef.current.delete(e.code);
            if (e.code === "Space") {
                e.preventDefault();
                recordRelease();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            audioTrainer.stopContinuousTone();
        };
    }, []); // Run once on mount

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
    };

    // Auto-scroll logic for infinite timeline
    React.useLayoutEffect(() => {
        if (status === "recording" || status === "training") {
            const viewport = document.getElementById('hyoshi-timeline-viewport');
            if (viewport) {
                // Simplified: Absolute position - Fixed Screen Offset
                viewport.scrollLeft = Math.max(0, timer * PX_PER_SEC - VIEWPORT_OFFSET);
            }
        }
    }, [timer, status]);

    return (
        <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto relative px-4">
            <CustomStyles />
            <button
                onClick={onBack}
                className="lg:absolute top-0 left-0 flex items-center gap-2 text-zinc-500 hover:text-kuma-gold transition-colors font-bold uppercase tracking-widest text-xs z-50 py-2"
            >
                <ArrowLeft weight="bold" />
                Volver a Aplicaciones
            </button>

            <div className="flex flex-col items-center justify-center text-center">
                <PrimalTitle className="text-4xl md:text-6xl uppercase tracking-[0.2em] mb-4">
                    Hyōshi<span className="text-kuma-gold">Kata</span>
                </PrimalTitle>

                <div className="relative group mb-4">
                    <div className="absolute -inset-4 bg-gradient-to-r from-kuma-gold/50 via-kuma-gold to-kuma-gold/50 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                    <div className="relative bg-black/40 border-2 border-kuma-gold/30 backdrop-blur-2xl px-12 py-6 rounded-3xl shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col items-center">
                        <div className="text-6xl md:text-8xl font-mono font-black tracking-tighter text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            {formatTime(timer)}
                        </div>
                    </div>
                </div>

                <div className="w-24 h-1 bg-kuma-gold rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] mb-4" />
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 min-h-[32px]">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl overflow-hidden backdrop-blur-md">
                    <Clock className="w-3 h-3 text-kuma-gold" weight="bold" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mr-2">Tempo:</span>
                    <div className="flex gap-1">
                        {[0.5, 0.75, 1, 1.25].map(rate => (
                            <button
                                key={rate}
                                onClick={() => setPlaybackRate(rate)}
                                className={cn(
                                    "px-2 py-0.5 rounded-md text-[9px] font-black transition-all",
                                    playbackRate === rate
                                        ? "bg-kuma-gold text-black shadow-[0_0_10px_rgba(234,179,8,0.4)]"
                                        : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {rate}x
                            </button>
                        ))}
                    </div>
                </div>

                {!session && (
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                        <Warning weight="fill" />
                        Modo Invitado
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6 w-full">
                <div className="relative group/console">
                    <div className="absolute -inset-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] blur-sm opacity-50" />
                    <div className="relative bg-[#1a1a1c] border-x border-t border-white/10 border-b-4 border-black rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10 pointer-events-none" />

                        <div className="mb-4" />

                        <div className={cn(
                            "grid gap-6 md:gap-8",
                            isAdmin ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 md:grid-cols-4"
                        )}>
                            {isAdmin && (
                                <button
                                    onClick={status === "recording" ? stopSystem : startRecording}
                                    className={cn(
                                        "relative h-32 md:h-40 group transition-all duration-300 rounded-3xl active:translate-y-2",
                                        status === "recording"
                                            ? "shadow-[0_4px_0_#991b1b,0_15px_20px_rgba(153,27,27,0.3)] hover:shadow-[0_2px_0_#991b1b,0_8px_10px_rgba(153,27,27,0.2)]"
                                            : "shadow-[0_8px_0_#7f1d1d,0_25px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_0_#7f1d1d,0_20px_30px_rgba(127,29,29,0.2)]"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute inset-0 rounded-3xl border-t border-white/20 transition-all",
                                        status === "recording" ? "bg-red-600 animate-pulse" : "bg-red-800"
                                    )} />
                                    <div className="relative h-full flex flex-col items-center justify-center gap-3">
                                        {status === "recording" ? <Stop weight="fill" className="w-10 h-10 text-white drop-shadow-md" /> : <Record weight="fill" className="w-10 h-10 text-white drop-shadow-md animate-pulse" />}
                                        <span className="text-[11px] font-black uppercase tracking-widest text-white drop-shadow-sm">{status === "recording" ? "Parar" : "Grabar"}</span>
                                    </div>
                                </button>
                            )}

                            <button
                                onClick={startTraining}
                                disabled={status === "training" || (currentKata.points.length === 0 && status !== "paused")}
                                className="relative h-32 md:h-40 group transition-all duration-300 rounded-3xl active:translate-y-2 disabled:opacity-30 disabled:grayscale shadow-[0_8px_0_#064e3b,0_25px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_0_#064e3b,0_20px_30px_rgba(6,78,59,0.2)]"
                            >
                                <div className="absolute inset-0 bg-emerald-700 rounded-3xl border-t border-white/20" />
                                <div className="relative h-full flex flex-col items-center justify-center gap-3">
                                    <Play weight="fill" className="w-10 h-10 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-white drop-shadow-sm">
                                        {status === "paused" ? "Reanudar" : "Entrenar"}
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={pauseSystem}
                                disabled={status === "ready" || status === "paused"}
                                className="relative h-32 md:h-40 group transition-all duration-300 rounded-3xl active:translate-y-2 disabled:opacity-30 disabled:grayscale shadow-[0_8px_0_#9a3412,0_25px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_0_#9a3412,0_20px_30px_rgba(154,52,18,0.2)]"
                            >
                                <div className="absolute inset-0 bg-orange-700 rounded-3xl border-t border-white/20" />
                                <div className="relative h-full flex flex-col items-center justify-center gap-3">
                                    <Pause weight="fill" className="w-10 h-10 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-white drop-shadow-sm">Pausa</span>
                                </div>
                            </button>

                            <button
                                onClick={stopSystem}
                                disabled={status === "ready" || status === "recording"}
                                className="relative h-32 md:h-40 group transition-all duration-300 rounded-3xl active:translate-y-2 disabled:opacity-30 disabled:grayscale shadow-[0_8px_0_#18181b,0_25px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_0_#18181b,0_20px_30px_rgba(0,0,0,0.3)]"
                            >
                                <div className="absolute inset-0 bg-zinc-800 rounded-3xl border-t border-white/10" />
                                <div className="relative h-full flex flex-col items-center justify-center gap-3">
                                    <Stop weight="fill" className="w-10 h-10 text-white/80 drop-shadow-md group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-white/80 drop-shadow-sm">Parar</span>
                                </div>
                            </button>

                            <button
                                onClick={clearCurrent}
                                className="relative h-32 md:h-40 group transition-all duration-300 rounded-3xl active:translate-y-2 shadow-[0_8px_0_#334155,0_25px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_0_#334155,0_20px_30px_rgba(51,65,85,0.2)]"
                            >
                                <div className="absolute inset-0 bg-slate-700 rounded-3xl border-t border-white/20" />
                                <div className="relative h-full flex flex-col items-center justify-center gap-3">
                                    <Trash weight="bold" className="w-10 h-10 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-white/90 drop-shadow-sm">Limpiar</span>
                                </div>
                            </button>
                        </div>

                        <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10" />
                        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10" />
                        <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10" />
                        <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10" />
                    </div>
                </div>

                {/* --- NEXT-GEN RHYTHMIC SCREEN --- */}
                <div className="relative group/timeline">
                    <div className="absolute -inset-1 bg-kuma-gold/20 blur-md opacity-20 group-hover/timeline:opacity-30 transition-opacity rounded-[2.2rem]" />

                    <div className="relative bg-[#0a0a0c] border border-white/10 rounded-[2rem] h-52 overflow-hidden shadow-2xl flex flex-col crt-screen">
                        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                            <div className={cn(
                                "absolute inset-0 transition-opacity duration-1000",
                                (status === "training" || status === "recording") ? "opacity-20" : "opacity-5"
                            )}>
                                <div className={cn(
                                    "absolute inset-[-100%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-kuma-gold/20 via-transparent to-transparent animate-slow-spin",
                                    activeHoldRef.current || (status === "training" && currentKata.points.some(p => timer >= p.start && timer <= (p.start + (p.duration || 0))))
                                        ? "scale-150 duration-500 opacity-60"
                                        : "scale-100 duration-1000 opacity-20"
                                )} />
                            </div>
                        </div>
                        <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-30" />
                        <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.02] to-transparent animate-scanline" />

                        {/* Enhanced Graticule (Calibrated Grid) */}
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: `
                                    linear-gradient(to right, rgba(234,179,8,0.2) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(234,179,8,0.2) 1px, transparent 1px)
                                `,
                            backgroundSize: '40px 40px'
                        }} />
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `
                                    linear-gradient(to right, rgba(234,179,8,0.1) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(234,179,8,0.1) 1px, transparent 1px)
                                `,
                            backgroundSize: '8px 8px'
                        }} />

                        <div className="absolute inset-x-0 top-[33%] h-px bg-white/5 z-0" />
                        <div className="absolute inset-x-0 top-[66%] h-px bg-white/5 z-0" />

                        <Oscilloscope active={activeHoldRef.current !== null || (status === "training" && currentKata.points.some(p => timer >= p.start && timer <= (p.start + (p.duration || 0))))} />

                        {/* Tactical HUD Overlays */}
                        <div className="absolute top-4 left-6 z-50 flex flex-col gap-1 pointer-events-none">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", status === "recording" ? "bg-red-500 animate-pulse" : status === "training" ? "bg-emerald-500 animate-pulse" : "bg-zinc-600")} />
                                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-tighter">
                                    {status === "recording" ? "MODO: GRABACIÓN" : status === "training" ? "MODO: ENTRENAMIENTO" : "MODO: STANDBY"}
                                </span>
                            </div>
                            <div className="text-[8px] font-mono text-zinc-500 flex gap-3">
                                <span>FREQ: {(1 / (timer || 1)).toFixed(2)}Hz</span>
                                <span>GAIN: +12dB</span>
                            </div>
                        </div>

                        <div className="absolute top-4 right-6 z-50 text-right pointer-events-none">
                            <div className="text-[9px] font-mono font-bold text-kuma-gold/80 uppercase tracking-widest">
                                SCAN: {status !== "ready" ? "ACTIVE" : "IDLE"}
                            </div>
                            <div className="text-[8px] font-mono text-zinc-500">
                                SYNC: {status === "ready" ? "---" : "LOCKED"}
                            </div>
                        </div>


                        <div
                            id="hyoshi-timeline-viewport"
                            className="flex-grow relative flex items-center overflow-x-auto overflow-y-hidden no-scrollbar"
                        >
                            <div
                                className="relative flex items-center h-[90%] transition-none"
                                style={{
                                    width: `${Math.max(30, timer + 15) * PX_PER_SEC}px`
                                }}
                            >
                                {/* --- TECHNICAL PANORAMIC RULER --- */}
                                <div className="absolute inset-x-0 bottom-1 h-12 flex items-end opacity-20 z-0 pointer-events-none">
                                    {Array.from({ length: Math.ceil(timer + 60) }).map((_, s) => {
                                        // Show secondary ticks every 5s, primary labels every 10s or 1m
                                        const isMain = s % 10 === 0;
                                        const isFive = s % 5 === 0;

                                        if (!isFive && s !== 0) return null; // Only show every 5s to avoid clutter at zoom level

                                        const mins = Math.floor(s / 60);
                                        const secs = s % 60;
                                        const label = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

                                        return (
                                            <React.Fragment key={`ruler-sec-${s}`}>
                                                {/* Tick Marker */}
                                                <div
                                                    className="absolute flex flex-col items-center"
                                                    style={{ left: `${s * PX_PER_SEC}px` }}
                                                >
                                                    <div className={cn(
                                                        "bg-white/80",
                                                        isMain ? "w-[2px] h-4" : "w-px h-2.5"
                                                    )} />
                                                    {(isMain || s === 0) && (
                                                        <span className="text-[9px] font-mono mt-1 text-white/80 font-bold whitespace-nowrap">
                                                            {s === 0 ? "0s (START)" : label}
                                                        </span>
                                                    )}
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                                {/* Real-time active hold trail (Recording) */}
                                {status === "recording" && activeHoldRef.current && (
                                    <div
                                        className="absolute top-[38%] h-[24%] rounded-xl glass-hold shimmer-effect transition-none z-30"
                                        style={{
                                            left: `${activeHoldRef.current.start * PX_PER_SEC}px`,
                                            width: `${(timer - activeHoldRef.current.start) * PX_PER_SEC}px`,
                                        }}
                                    />
                                )}

                                {/* GHOST LAYER (Current Kata Map - visible in ready/training) */}
                                {(status === "ready" || status === "training" || status === "paused") && currentKata.points.map((point, idx) => (
                                    point.type === "hold" && (
                                        <div
                                            key={`ghost-h-${idx}`}
                                            className="absolute top-[38%] h-[24%] rounded-xl glass-hold transition-none z-10 opacity-10"
                                            style={{
                                                left: `${point.start * PX_PER_SEC}px`,
                                                width: `${(point.duration || 0) * PX_PER_SEC}px`
                                            }}
                                        />
                                    )
                                ))}

                                {/* LIVE REVEAL LAYER (Active Playback/Training/Recording History) */}
                                {currentKata.points.map((point, idx) => {
                                    // Strictly prevent duplicate rendering of the active recording bar using ID
                                    if (status === "recording" && activeHoldRef.current && (point as any).id === (activeHoldRef.current as any).id) return null;

                                    const isPastStart = timer >= point.start;
                                    if (!isPastStart) return null;

                                    const duration = point.duration || 0.1;

                                    // During recording, show history as solid bars. During training/paused, show fill animation.
                                    const isRecordingHistory = status === "recording";
                                    const segmentElapsed = isRecordingHistory ? duration : Math.max(0, Math.min(duration, timer - point.start));
                                    const segmentProgress = segmentElapsed / duration;

                                    return (
                                        <React.Fragment key={`live-${idx}`}>
                                            {point.type === "hold" && (
                                                <div
                                                    className="absolute top-[38%] h-[24%] rounded-xl glass-hold shimmer-effect transition-none z-20"
                                                    style={{
                                                        left: `${point.start * PX_PER_SEC}px`,
                                                        width: `${duration * PX_PER_SEC}px`,
                                                        clipPath: isRecordingHistory ? 'none' : `inset(0 ${100 - (segmentProgress * 100)}% 0 0)`,
                                                        opacity: isRecordingHistory ? 0.9 : 1
                                                    }}
                                                />
                                            )}

                                            {point.pulses?.map((p, pIdx) => {
                                                const absolutePulseTime = point.start + p;
                                                const isPulseReached = timer >= absolutePulseTime;
                                                const isRecording = status === "recording";
                                                return (
                                                    <div
                                                        key={`live-p-${idx}-${pIdx}`}
                                                        className={cn(
                                                            "absolute w-2 top-[8%] h-[20%] glass-pulse rounded-full z-30 transition-none",
                                                            (isPulseReached || isRecording) ? "opacity-100" : "opacity-10"
                                                        )}
                                                        style={{ left: `${absolutePulseTime * PX_PER_SEC}px` }}
                                                    />
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}

                                {/* --- PLAYHEAD INDICATOR --- */}
                                {(status === "recording" || status === "training") && (
                                    <div
                                        className="absolute top-0 bottom-0 w-[2px] bg-white/40 z-50 shadow-[0_0_10px_rgba(255,255,255,0.5)] pointer-events-none transition-none"
                                        style={{ left: `${timer * PX_PER_SEC}px` }}
                                    >
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-4 left-6 flex gap-2 z-30">
                                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                                <div className="w-1.5 h-1.5 bg-white/5 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                <button onMouseDown={recordHit} className={cn("md:hidden w-full py-16 rounded-3xl border-4 text-2xl font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-2xl", status === "recording" ? "bg-red-600 border-red-500 text-white" : "bg-zinc-800 border-white/5 text-zinc-500")}>Ritmo</button>
            </div>
        </div>
    );
};

// --- CRT OSCILLOSCOPE COMPONENT ---
const Oscilloscope = ({ active }: { active: boolean }) => {
    return (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-8 opacity-40 pointer-events-none z-50">
            <svg viewBox="0 0 200 40" className="w-full h-full">
                <motion.path
                    d="M 0 20 Q 25 20, 50 20 T 100 20 T 150 20 T 200 20"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="1"
                    animate={{
                        d: active
                            ? [
                                "M 0 20 Q 10 5, 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 T 140 20 T 160 20 T 180 20 T 200 20",
                                "M 0 20 Q 10 35, 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 T 140 20 T 160 20 T 180 20 T 200 20",
                                "M 0 20 Q 10 5, 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 T 140 20 T 160 20 T 180 20 T 200 20"
                            ]
                            : [
                                "M 0 20 Q 50 18, 100 20 T 200 20",
                                "M 0 20 Q 50 22, 100 20 T 200 20",
                                "M 0 20 Q 50 18, 100 20 T 200 20"
                            ]
                    }}
                    transition={{
                        duration: active ? 0.2 : 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </svg>
        </div>
    );
};

// --- STYLES FOR THE NEXT-GEN SCREEN ---
const CustomStyles = () => (
    <style jsx global>{`
        @keyframes scanline {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes slow-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes flicker {
            0% { opacity: 0.97; }
            5% { opacity: 0.95; }
            10% { opacity: 0.9; }
            15% { opacity: 0.95; }
            30% { opacity: 1; }
            50% { opacity: 0.98; }
            80% { opacity: 0.95; }
            100% { opacity: 0.99; }
        }
        .animate-scanline {
            animation: scanline 8s linear infinite;
        }
        .animate-slow-spin {
            animation: slow-spin 20s linear infinite;
        }
        .crt-phosphor {
            filter: drop-shadow(0 0 12px rgba(234, 179, 8, 0.6)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.4));
            transition: filter 0.3s ease, opacity 0.3s ease;
        }
        .crt-screen {
            animation: flicker 0.15s infinite;
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
        }
        .shimmer-effect {
            position: relative;
            overflow: hidden;
        }
        .shimmer-effect::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.4),
                transparent
            );
            animation: shimmer 1.5s infinite linear;
        }
        .glass-hold {
            background: rgba(255, 149, 0, 0.2);
            backdrop-filter: blur(8px);
            box-shadow: 
                0 0 25px rgba(255, 149, 0, 0.3),
                inset 0 0 15px rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            position: relative;
        }
        .glass-hold::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, #ffb100, #ff9500);
            opacity: 0.85;
            z-index: -1;
        }
        .glass-pulse {
            background: rgba(0, 242, 255, 0.3);
            backdrop-filter: blur(4px);
            box-shadow: 
                0 0 20px rgba(0, 242, 255, 0.5),
                inset 0 0 10px rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .transition-none {
            transition: none !important;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `}</style>
);
