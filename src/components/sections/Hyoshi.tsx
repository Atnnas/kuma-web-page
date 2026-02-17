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
                    // Start of technique
                    if (elapsed >= point.start && !point.played) {
                        playBeep();
                        point.played = true;
                    }
                    // Internal pulses
                    if (point.pulses) {
                        point.pulses.forEach((pulseTimeOffset, pIdx) => {
                            const absolutePulseTime = point.start + pulseTimeOffset;
                            if (elapsed >= absolutePulseTime && (!point.playedPulses || !point.playedPulses.includes(pIdx))) {
                                playPulseBeep();
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
        if (status === "recording") {
            const newPoint: Point = {
                type: "hit",
                start: timer,
                name: `Ték. ${pointsRef.current.length + 1}`
            };
            pointsRef.current = [...pointsRef.current, newPoint];
            setCurrentKata(prev => ({ ...prev, points: pointsRef.current }));
            playBeep();
        }
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                recordHit();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [status, timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
            {/* Main Title Area & Elegant Chronometer */}
            <div className="flex flex-col items-center justify-center text-center">
                <PrimalTitle className="text-4xl md:text-6xl uppercase tracking-[0.2em] mb-4">
                    Hyōshi<span className="text-kuma-gold">Kata</span>
                </PrimalTitle>

                {/* Elegant Chronometer */}
                <div className="relative group mb-8">
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

            {/* Top Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-500 hover:text-kuma-gold transition-colors font-bold uppercase tracking-widest text-xs"
                >
                    <ArrowLeft weight="bold" />
                    Volver a Aplicaciones
                </button>
                <div className="flex items-center gap-4">
                    {!session && (
                        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                            <Warning weight="fill" />
                            Modo Invitado (No guarda cambios)
                        </div>
                    )}
                    <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        status === "recording" ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse" :
                            status === "training" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
                                "bg-zinc-800 border-white/10 text-zinc-500"
                    )}>
                        {status === "recording" ? "Grabando" : status === "training" ? "Entrenando" : "Listo"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Action Bar */}
                    <div className={cn(
                        "grid gap-3",
                        isAdmin ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 md:grid-cols-3"
                    )}>
                        {isAdmin && (
                            <button onClick={startRecording} disabled={status === "recording"} className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-zinc-900 border border-white/10 hover:border-red-500/50 hover:bg-red-500/5 transition-all group disabled:opacity-50">
                                <Record weight="fill" className="w-8 h-8 text-red-500 group-hover:scale-110" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Grabar</span>
                            </button>
                        )}
                        <button onClick={startTraining} disabled={status === "training" || (currentKata.points.length === 0 && status !== "paused")} className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-zinc-900 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group disabled:opacity-50">
                            <Play weight="fill" className="w-8 h-8 text-emerald-500 group-hover:scale-110" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Entrenar</span>
                        </button>
                        <button onClick={pauseSystem} disabled={status === "ready" || status === "paused"} className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-zinc-900 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group disabled:opacity-50">
                            <Pause weight="fill" className="w-8 h-8 text-orange-500 group-hover:scale-110" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Pausa</span>
                        </button>
                        <button onClick={stopSystem} disabled={status === "ready"} className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-zinc-900 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all group disabled:opacity-50">
                            <Stop weight="fill" className="w-8 h-8 text-white group-hover:scale-110" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Parar</span>
                        </button>
                        <button onClick={clearCurrent} className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-zinc-900 border border-white/10 hover:border-zinc-500/50 hover:bg-white/5 transition-all group">
                            <Trash weight="bold" className="w-8 h-8 text-zinc-500 group-hover:scale-110" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Limpiar</span>
                        </button>
                    </div>

                    {/* Timeline Visualization */}
                    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 h-40 relative overflow-hidden group/timeline shadow-inner">
                        {/* Time Markers (Grid) */}
                        <div className="absolute inset-x-6 bottom-4 h-[calc(100%-2rem)] flex justify-between pointer-events-none opacity-20">
                            {[0, 5, 10, 15, 20, 25, 30].map((s) => (
                                <div key={s} className="flex flex-col items-center h-full">
                                    <div className="w-px h-full bg-zinc-700" />
                                    <span className="text-[7px] font-black text-zinc-500 mt-1">{s}s</span>
                                </div>
                            ))}
                        </div>

                        {/* Moving Playhead (Cursor) */}
                        {(status === "training" || status === "recording" || status === "paused") && (
                            <motion.div
                                className="absolute top-0 bottom-4 w-0.5 bg-kuma-gold z-30 shadow-[0_0_15px_rgba(234,179,8,0.8)]"
                                style={{
                                    left: `calc(1.5rem + ${(timer % 30) * 3.333}% * (100% - 3rem) / 100)`
                                }}
                                transition={{ type: "tween", ease: "linear", duration: 0.1 }}
                            />
                        )}

                        {/* Hits and Pulses */}
                        <div className="absolute inset-x-6 top-6 bottom-10 flex items-center relative overflow-hidden">
                            {currentKata.points.map((point, idx) => (
                                <React.Fragment key={idx}>
                                    {/* Main Hit */}
                                    <motion.div
                                        initial={{ opacity: 0, scaleY: 0 }}
                                        animate={{ opacity: 1, scaleY: 1 }}
                                        className={cn(
                                            "absolute bottom-0 w-[4px] -ml-[2px] rounded-t-full transition-all duration-300",
                                            point.played === true ? "bg-kuma-gold shadow-[0_0_10px_rgba(234,179,8,0.4)] h-full" : "bg-white/40 h-[80%]"
                                        )}
                                        style={{ left: `${(point.start % 30) * 3.333}%` }}
                                    >
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/timeline:opacity-100 transition-opacity text-[6px] font-black text-zinc-500 whitespace-nowrap uppercase tracking-tighter">
                                            {point.name || `T${idx + 1}`}
                                        </div>
                                    </motion.div>

                                    {/* Internal Pulses */}
                                    {point.pulses?.map((p, pIdx) => (
                                        <motion.div
                                            key={`p-${idx}-${pIdx}`}
                                            initial={{ opacity: 0, scaleY: 0 }}
                                            animate={{ opacity: 1, scaleY: 1 }}
                                            className={cn(
                                                "absolute bottom-0 w-[2px] -ml-[1px] rounded-t-full transition-all duration-300 h-1/2",
                                                (point.playedPulses && point.playedPulses.includes(pIdx)) ? "bg-kuma-gold/80" : "bg-white/10"
                                            )}
                                            style={{ left: `${((point.start + p) % 30) * 3.333}%` }}
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="absolute bottom-2 right-6 text-[8px] font-black uppercase tracking-widest text-zinc-700">Timeline Engine (30s Window)</div>
                    </div>

                    <button onMouseDown={recordHit} className={cn("md:hidden w-full py-16 rounded-3xl border-4 text-2xl font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-2xl", status === "recording" ? "bg-red-600 border-red-500 text-white" : "bg-zinc-800 border-white/5 text-zinc-500")}>Ritmo</button>
                </div>

                <div className="flex flex-col gap-6 h-full">
                    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl flex flex-col flex-grow overflow-hidden max-h-[700px] shadow-xl">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <FolderOpen weight="duotone" className="w-6 h-6 text-kuma-gold" />
                                <h3 className="font-serif font-black text-white uppercase tracking-wider text-sm">Biblioteca</h3>
                            </div>
                            <span className="text-[9px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md border border-white/5 uppercase tracking-widest">
                                {library.length} Katas
                            </span>
                        </div>

                        <div className="flex-grow overflow-y-auto p-3 space-y-2">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-20 text-zinc-600 animate-pulse font-bold uppercase tracking-widest text-[10px]">Cargando ritmos...</div>
                            ) : library.map((kata) => (
                                <button
                                    key={kata.id}
                                    onClick={() => {
                                        setCurrentKata(kata);
                                        pointsRef.current = kata.points;
                                    }}
                                    className={cn(
                                        "w-full p-4 flex items-center justify-between group hover:bg-white/5 rounded-2xl transition-all text-left border border-transparent",
                                        currentKata.name === kata.name ? "bg-kuma-gold/5 border-kuma-gold/20" : ""
                                    )}
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className={cn("text-sm font-bold transition-colors", currentKata.name === kata.name ? "text-kuma-gold" : "text-white group-hover:text-kuma-gold")}>{kata.name}</span>
                                            {kata.isCustom && <Tag weight="fill" className="w-2.5 h-2.5 text-zinc-500" />}
                                        </div>
                                        <span className="text-[9px] uppercase font-black tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">{kata.points.length} Técnicas</span>
                                    </div>
                                    <CaretRight weight="bold" className="w-3 h-3 text-zinc-700 group-hover:text-kuma-gold group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>

                        <div className="p-4 bg-zinc-900/80 border-t border-white/5">
                            {isAdmin ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Nombre del nuevo Kata..."
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-kuma-gold/50 transition-all mb-3 font-bold uppercase tracking-widest"
                                        value={currentKata.name}
                                        onChange={(e) => setCurrentKata({ ...currentKata, name: e.target.value })}
                                    />
                                    <button
                                        onClick={saveToDB}
                                        disabled={isSaving}
                                        className="w-full py-3 bg-kuma-gold text-black rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:grayscale"
                                    >
                                        {isSaving ? "Guardando..." : <><FloppyDisk weight="fill" className="w-4 h-4" /> Guardar en Mi Cuenta</>}
                                    </button>
                                </>
                            ) : (
                                <div className="py-2 text-center text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                    Inicia como Admin para editar
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
