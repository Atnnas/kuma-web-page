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

    // Refs
    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const lastPauseTimeRef = useRef<number>(0);
    const pointsRef = useRef<Point[]>([]);
    const activeHoldRef = useRef<Point | null>(null);
    const isKeyPressedRef = useRef<Set<string>>(new Set());

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchUserKatas = async () => {
            try {
                const res = await fetch("/api/user/katas");
                if (res.ok) {
                    const data = await res.json();
                    setUserKatas(data);

                    // Merge logic: user katas (from DB) + DEFAULT_KATAS
                    // We prefer user katas if they have the same name
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
        if (status === "recording" || status === "training") {
            const elapsed = (performance.now() - startTimeRef.current) / 1000;
            setTimer(elapsed);

            if (status === "training") {
                pointsRef.current.forEach((point) => {
                    // Start of technique (Hold or Hit)
                    if (elapsed >= point.start && !point.played) {
                        if (point.type === "hold") {
                            audioTrainer.startContinuousTone();
                        } else {
                            playBeep();
                        }
                        point.played = true;
                    }

                    // End of Hold
                    if (point.type === "hold" && point.duration && elapsed >= (point.start + point.duration) && point.played && !point.stopped) {
                        audioTrainer.stopContinuousTone();
                        (point as any).stopped = true;
                    }

                    // Internal pulses during hold
                    if (point.pulses) {
                        point.pulses.forEach((pulseTimeOffset, pIdx) => {
                            const absolutePulseTime = point.start + pulseTimeOffset;
                            if (elapsed >= absolutePulseTime && (!point.playedPulses || !point.playedPulses.includes(pIdx))) {
                                playBeep(1100); // Pulse beep
                                point.playedPulses = [...(point.playedPulses || []), pIdx];
                            }
                        });
                    }
                });
            }
        }
        requestRef.current = requestAnimationFrame((t) => animate(t));
    }, [status, playBeep, playPulseBeep]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame((t) => animate(t));
        return () => cancelAnimationFrame(requestRef.current!);
    }, [animate]);

    // --- ACTIONS ---
    const startRecording = () => {
        setStatus("recording");
        setTimer(0);
        startTimeRef.current = performance.now();
        pointsRef.current = [];
        setCurrentKata(prev => ({ ...prev, points: [] }));
    };

    const startTraining = () => {
        if (status === "paused") {
            startTimeRef.current = performance.now() - (lastPauseTimeRef.current * 1000);
        } else {
            setTimer(0);
            startTimeRef.current = performance.now();
            pointsRef.current = currentKata.points.map(p => ({ ...p, played: false, playedPulses: [] }));
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

    const saveToDB = async () => {
        if (!session) {
            alert("Debes iniciar sesión para guardar ritmos.");
            return;
        }
        if (!currentKata.name || currentKata.points.length === 0) {
            alert("El kata debe tener un nombre y al menos un punto grabado.");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch("/api/user/katas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: currentKata.name,
                    points: currentKata.points,
                    isCustom: true
                })
            });
            if (res.ok) {
                const saved = await res.json();
                // Update local library
                setLibrary(prev => {
                    const idx = prev.findIndex(k => k.name === saved.name);
                    const next = [...prev];
                    if (idx !== -1) next[idx] = saved;
                    else next.push(saved);
                    return next;
                });
                alert("Kata guardado exitosamente!");
            }
        } catch (err) {
            console.error(err);
            alert("Error al guardar el kata.");
        } finally {
            setIsSaving(false);
        }
    };

    const recordHit = () => {
        if (status === "recording" && !activeHoldRef.current) {
            const newPoint: Point = {
                type: "hold",
                start: timer,
                name: `Ték. ${pointsRef.current.length + 1}`,
                pulses: []
            };
            activeHoldRef.current = newPoint;
            pointsRef.current = [...pointsRef.current, newPoint];
            setCurrentKata(prev => ({ ...prev, points: pointsRef.current }));
            audioTrainer.startContinuousTone();
        }
    };

    const recordRelease = () => {
        if (status === "recording" && activeHoldRef.current) {
            const duration = timer - activeHoldRef.current.start;
            activeHoldRef.current.duration = Math.max(0.1, duration);
            activeHoldRef.current = null;
            setCurrentKata(prev => ({ ...prev, points: [...pointsRef.current] }));
            audioTrainer.stopContinuousTone();
        }
    };

    const recordPulse = () => {
        if (status === "recording" && activeHoldRef.current) {
            const pulseOffset = timer - activeHoldRef.current.start;
            if (!activeHoldRef.current.pulses) activeHoldRef.current.pulses = [];
            activeHoldRef.current.pulses.push(pulseOffset);
            setCurrentKata(prev => ({ ...prev, points: [...pointsRef.current] }));
            playBeep(1100); // Higher pitch for pulse
        }
    };

    // Keyboard support
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
    }, [status, timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto relative px-4">
            <CustomStyles />
            {/* Back Button - Top Left */}
            <button
                onClick={onBack}
                className="lg:absolute top-0 left-0 flex items-center gap-2 text-zinc-500 hover:text-kuma-gold transition-colors font-bold uppercase tracking-widest text-xs z-50 py-2"
            >
                <ArrowLeft weight="bold" />
                Volver a Aplicaciones
            </button>

            {/* Main Title Area & Elegant Chronometer */}
            <div className="flex flex-col items-center justify-center text-center">
                <PrimalTitle className="text-4xl md:text-6xl uppercase tracking-[0.2em] mb-4">
                    Hyōshi<span className="text-kuma-gold">Kata</span>
                </PrimalTitle>

                {/* Elegant Chronometer */}
                <div className="relative group mb-4">
                    {/* Glowing Border Wrapper */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-kuma-gold/50 via-kuma-gold to-kuma-gold/50 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                    <div className="relative bg-black/40 border-2 border-kuma-gold/30 backdrop-blur-2xl px-12 py-6 rounded-3xl shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col items-center">
                        <div className="text-6xl md:text-8xl font-mono font-black tracking-tighter text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            {formatTime(timer)}
                        </div>
                    </div>
                </div>

                <div className="w-24 h-1 bg-kuma-gold rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] mb-4" />
            </div>

            {/* Top Bar (Info Only) */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4 min-h-[32px]">
                <div className="flex items-center gap-4">
                    {!session && (
                        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                            <Warning weight="fill" />
                            Modo Invitado (No guarda cambios)
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-6 w-full">
                    {/* --- 3D COMMAND CONSOLE --- */}
                    <div className="relative group/console">
                        {/* Console Base/Body */}
                        <div className="absolute -inset-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] blur-sm opacity-50" />
                        <div className="relative bg-[#1a1a1c] border-x border-t border-white/10 border-b-4 border-black rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                            {/* Texture/Grip details */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10 pointer-events-none" />

                            {/* Label */}
                            <div className="flex items-center justify-between mb-8 px-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Consola de Mando Principal</span>
                                </div>
                                <div className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">
                                    Motor Rítmico V1.2
                                </div>
                            </div>

                            {/* Buttons Grid */}
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

                            {/* Decorative Screw/Detail Elements */}
                            <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10" />
                            <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10" />
                            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10" />
                            <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10" />
                        </div>
                    </div>

                    {/* --- NEXT-GEN RHYTHMIC SCREEN --- */}
                    <div className="relative group/timeline">
                        {/* Outer Frame Glow */}
                        <div className="absolute -inset-1 bg-kuma-gold/20 blur-md opacity-20 group-hover/timeline:opacity-30 transition-opacity rounded-[2.2rem]" />

                        <div className="relative bg-[#0a0a0c] border border-white/10 rounded-[2rem] h-52 overflow-hidden shadow-2xl flex flex-col">
                            {/* CRT/Scanline Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-30" />
                            <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.02] to-transparent animate-scanline" />

                            {/* Hex Background / Grid */}
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(234,179,8,0.3) 1px, transparent 0)`,
                                backgroundSize: '24px 24px'
                            }} />

                            {/* Header Info */}
                            <div className="flex items-center justify-between px-6 pt-4 z-30">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", status === "recording" ? "bg-red-500 animate-pulse" : status === "training" ? "bg-emerald-500 animate-pulse" : "bg-zinc-700")} />
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">Analizador de Señal</span>
                                </div>
                                <div className="text-[7px] font-bold text-zinc-700 uppercase tracking-widest tabular-nums">
                                    {formatTime(timer)} / 30.0s
                                </div>
                            </div>

                            {/* Main Visualization Area */}
                            <div className="flex-grow relative px-10 flex items-center">
                                {/* Time Markers */}
                                <div className="absolute inset-x-10 bottom-8 h-1 flex justify-between opacity-10">
                                    {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map(s => (
                                        <div key={s} className="w-px h-2 bg-white" />
                                    ))}
                                </div>

                                {/* Moving Playhead (Scanner) */}
                                {(status === "training" || status === "recording" || status === "paused") && (
                                    <motion.div
                                        className="absolute top-0 bottom-6 w-[2px] z-50 pointer-events-none"
                                        style={{
                                            left: `calc(2.5rem + ${(timer % 30) * 3.333}% * (100% - 5rem) / 100)`
                                        }}
                                        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
                                    >
                                        <div className="absolute inset-0 bg-kuma-gold shadow-[0_0_20px_rgba(234,179,8,1)]" />
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-kuma-gold rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-kuma-gold rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]" />

                                        {/* Scanner Beam */}
                                        <div className="absolute inset-y-0 -left-4 w-8 bg-gradient-to-r from-transparent via-kuma-gold/5 to-transparent" />
                                    </motion.div>
                                )}

                                {/* Hits, Pulses and Trails */}
                                <div className="absolute inset-x-10 top-12 bottom-12 flex items-center overflow-hidden">
                                    <div className="relative w-full h-full flex items-center">
                                        {/* Real-time active hold trail */}
                                        {status === "recording" && activeHoldRef.current && (
                                            <div
                                                className="absolute bottom-0 h-full bg-gradient-to-r from-red-500/40 to-red-400/60 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.3)] border-x border-red-500/50"
                                                style={{
                                                    left: `${(activeHoldRef.current.start % 30) * 3.333}%`,
                                                    width: `${((timer - activeHoldRef.current.start) % 30) * 3.333}%`
                                                }}
                                            />
                                        )}
                                        {currentKata.points.map((point, idx) => (
                                            <React.Fragment key={idx}>
                                                {/* Transitions (Hold bars) */}
                                                {point.type === "hold" && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scaleX: 0 }}
                                                        animate={{ opacity: 1, scaleX: 1 }}
                                                        className={cn(
                                                            "absolute bottom-0 h-full rounded-lg transition-all duration-300 origin-left border-x",
                                                            point.played
                                                                ? "bg-gradient-to-r from-kuma-gold/20 via-kuma-gold/40 to-kuma-gold/20 shadow-[0_0_30px_rgba(234,179,8,0.3)] border-kuma-gold/30"
                                                                : "bg-white/5 border-white/10"
                                                        )}
                                                        style={{
                                                            left: `${(point.start % 30) * 3.333}%`,
                                                            width: `${((point.duration || 0) % 30) * 3.333}%`
                                                        }}
                                                    />
                                                )}

                                                {/* Main Hit Spark */}
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className={cn(
                                                        "absolute w-1 rounded-full transition-all duration-300 z-10",
                                                        point.played === true ? "bg-white shadow-[0_0_15px_#fff] h-full" : "bg-zinc-600 h-[60%]"
                                                    )}
                                                    style={{ left: `${(point.start % 30) * 3.333}%` }}
                                                >
                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/timeline:opacity-100 transition-opacity text-[6px] font-black text-zinc-500 whitespace-nowrap uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded-md border border-white/5">
                                                        {point.name || `PT ${idx + 1}`}
                                                    </div>
                                                </motion.div>

                                                {/* Internal Pulses (Neon Sparks) */}
                                                {point.pulses?.map((p, pIdx) => (
                                                    <motion.div
                                                        key={`p-${idx}-${pIdx}`}
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className={cn(
                                                            "absolute w-0.5 rounded-full z-20 transition-all duration-300",
                                                            (point.playedPulses && point.playedPulses.includes(pIdx))
                                                                ? "bg-cyan-400 shadow-[0_0_10px_#22d3ee] h-[60%]"
                                                                : "bg-white/20 h-[30%]"
                                                        )}
                                                        style={{ left: `${((point.start + p) % 30) * 3.333}%` }}
                                                    />
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer Indicators */}
                                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center z-30">
                                    <div className="flex gap-2">
                                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                        <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                                        <div className="w-1.5 h-1.5 bg-white/5 rounded-full" />
                                    </div>
                                    <div className="text-[6px] font-black uppercase tracking-[0.4em] text-zinc-600">
                                        Motor Rítmico 3000 // Buffer de Escaneo
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onMouseDown={recordHit} className={cn("md:hidden w-full py-16 rounded-3xl border-4 text-2xl font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-2xl", status === "recording" ? "bg-red-600 border-red-500 text-white" : "bg-zinc-800 border-white/5 text-zinc-500")}>Ritmo</button>
                </div>
            </div>
        </div>
    );
};

// --- STYLES FOR THE NEXT-GEN SCREEN ---
const CustomStyles = () => (
    <style jsx global>{`
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .animate-scanline {
            animation: scanline 4s linear infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }
        .animate-blink {
            animation: blink 2s ease-in-out infinite;
        }
    `}</style>
);
