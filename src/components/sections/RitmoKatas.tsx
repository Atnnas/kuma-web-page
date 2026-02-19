"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { saveRhythm, getRhythms, deleteRhythm } from "@/lib/actions/rhythms";
import {
    Record,
    Play,
    Pause,
    Stop,
    SpeakerHigh,
    ArrowLeft,
    Sparkle,
    FloppyDiskBack,
    Books,
    X,
    MagnifyingGlass,
    TrendUp,
    Sword,
    Scroll,
    Broom,
    Trash,
    HandTap,
    SelectionAll,
    Star,
    CaretDown,
    Check
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

// --- Tipado y Constantes ---
type Status = "listo" | "grabando" | "reproduciendo" | "pausado";
type Theme = "dragon-ball" | "tactical-hud";
type Punto = { id: number; tiempo: number; tipo: "fluido" | "pulso"; estado?: "inicio" | "final" };

export const RitmoKatas = ({ onBack }: { onBack: () => void }) => {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin";

    const [status, setStatus] = useState<Status>("listo");
    const [theme, setTheme] = useState<Theme>("tactical-hud");
    const [timer, setTimer] = useState(0);
    const [volume, setVolume] = useState(0.8);

    // Modal y Guardado
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [kataName, setKataName] = useState("");
    const [martialArt, setMartialArt] = useState("");
    const [style, setStyle] = useState("");
    const [hasRecordedData, setHasRecordedData] = useState(false);
    const [canSave, setCanSave] = useState(false); // Nueva bandera para evitar guardar lo cargado de bibiloteca

    // Biblioteca
    const [showLibrary, setShowLibrary] = useState(false);
    const [rhythms, setRhythms] = useState<any[]>([]);
    const [searchLibrary, setSearchLibrary] = useState("");
    const [filterArt, setFilterArt] = useState("all");
    const [rhythmToDelete, setRhythmToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Dropdown Custom State
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

    // Refs de Datos y Motor
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);

    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const puntosRef = useRef<Punto[]>([]);
    const timerRef = useRef(0);
    const keysPressed = useRef<Set<string>>(new Set());
    const lastTriggeredTimeRef = useRef<number>(-1);

    // --- Motor de Audio ---
    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            masterGainRef.current = audioCtxRef.current.createGain();
            masterGainRef.current.connect(audioCtxRef.current.destination);
            masterGainRef.current.gain.value = volume;
        }
    };

    const playPulse = () => {
        if (!audioCtxRef.current || !masterGainRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const g = audioCtxRef.current.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
        g.gain.setValueAtTime(0.5 * volume, audioCtxRef.current.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.1);
        osc.connect(g);
        g.connect(masterGainRef.current);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.1);
    };

    const startContinuousTone = () => {
        if (!audioCtxRef.current || !masterGainRef.current || oscillatorRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const g = audioCtxRef.current.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, audioCtxRef.current.currentTime);
        g.gain.setValueAtTime(0.3 * volume, audioCtxRef.current.currentTime);
        osc.connect(g);
        g.connect(masterGainRef.current);
        osc.start();
        oscillatorRef.current = osc;
    };

    const stopContinuousTone = () => {
        if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current = null;
        }
    };

    // --- Lógica de Grabación & Reproducción ---
    const startRecording = () => {
        initAudio();
        setStatus("grabando");
        setHasRecordedData(false);
        setCanSave(true); // Se activa la posibilidad de guardar una nueva sesión
        puntosRef.current = [];
        timerRef.current = 0;
        setTimer(0);
        startTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(recordingLoop);
    };

    const startPlayback = () => {
        if (puntosRef.current.length === 0) return;
        initAudio();
        setStatus("reproduciendo");
        lastTriggeredTimeRef.current = -1;
        startTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(playbackLoop);
    };

    const stopAll = () => {
        const deltaData = puntosRef.current.length > 0;
        cancelAnimationFrame(requestRef.current);
        setStatus("listo");
        stopContinuousTone();
        if (deltaData) setHasRecordedData(true);
    };

    const pauseAll = () => {
        cancelAnimationFrame(requestRef.current);
        setStatus("pausado");
        stopContinuousTone();
    };

    const recordingLoop = (time: number) => {
        const delta = time - startTimeRef.current;
        timerRef.current = Math.floor(delta / 10);
        setTimer(timerRef.current);
        renderRadar();
        requestRef.current = requestAnimationFrame(recordingLoop);
    };

    const playbackLoop = (time: number) => {
        const delta = time - startTimeRef.current;
        const currentT = Math.floor(delta / 10);
        const prevT = lastTriggeredTimeRef.current;

        // MOTOR DE SINCRONIZACIÓN: Cabezal de Escaneo
        puntosRef.current.forEach(p => {
            if (p.tiempo > prevT && p.tiempo <= currentT) {
                if (p.tipo === "pulso") playPulse();
                if (p.tipo === "fluido") {
                    if (p.estado === "inicio") startContinuousTone();
                    else stopContinuousTone();
                }
            }
        });

        lastTriggeredTimeRef.current = currentT;
        timerRef.current = currentT;
        setTimer(currentT);
        renderRadar();

        const maxTime = puntosRef.current.length > 0 ? puntosRef.current[puntosRef.current.length - 1].tiempo : 0;
        if (currentT > maxTime + 100) {
            pauseAll();
            timerRef.current = 0;
            setTimer(0);
            return;
        }

        requestRef.current = requestAnimationFrame(playbackLoop);
    };

    // --- Renderizado Radar (Líneas Refinadas) ---
    const renderRadar = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const pxPerSec = 100; // Antes 150, reducimos para ver más tiempo
        const scrollX = (timerRef.current / 100) * pxPerSec;

        ctx.clearRect(0, 0, w, h);

        // Grid Técnico
        ctx.strokeStyle = theme === "dragon-ball" ? "rgba(52, 211, 153, 0.1)" : "rgba(234,179,8,0.08)";
        ctx.lineWidth = 1;
        const gridSize = 50; // Ajustamos la rejilla al nuevo zoom
        for (let x = (w / 2) - (scrollX % gridSize); x < w; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }

        // Línea central de tiempo (Scanner)
        ctx.strokeStyle = theme === "dragon-ball" ? "rgba(52, 211, 153, 0.6)" : "rgba(234, 179, 8, 0.6)";
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 5]);
        ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
        ctx.setLineDash([]);

        // PUNTOS DE IMPACTO: Líneas Verticales
        puntosRef.current.forEach(p => {
            if (p.tipo !== "pulso") return;
            const x = (w / 2) + ((p.tiempo / 100) * pxPerSec) - scrollX;
            if (x < -100 || x > w + 100) return;

            // Línea de Impacto Técnica
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(234, 179, 8, 0.8)";
            ctx.strokeStyle = "rgba(234, 179, 8, 1)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, h / 2 - 40);
            ctx.lineTo(x, h / 2 + 40);
            ctx.stroke();

            // Puntos en los extremos para look militar
            ctx.fillStyle = "rgba(234, 179, 8, 1)";
            ctx.fillRect(x - 3, h / 2 - 43, 6, 6);
            ctx.fillRect(x - 3, h / 2 + 37, 6, 6);
            ctx.shadowBlur = 0;
        });

        // ESTELA CONTINUA: Línea Horizontal Persistente
        const fluidos = puntosRef.current.filter(p => p.tipo === "fluido");
        for (let i = 0; i < fluidos.length; i++) {
            const p = fluidos[i];
            if (p.estado === "inicio") {
                const next = fluidos[i + 1];
                const startX = (w / 2) + ((p.tiempo / 100) * pxPerSec) - scrollX;
                const endX = next
                    ? (w / 2) + ((next.tiempo / 100) * pxPerSec) - scrollX
                    : (status === "grabando" ? (w / 2) + ((timerRef.current / 100) * pxPerSec) - scrollX : startX);

                if (endX < startX - 1000) continue;

                ctx.shadowBlur = 15;
                ctx.shadowColor = theme === "dragon-ball" ? "rgba(52, 211, 153, 0.7)" : "rgba(234, 179, 8, 0.7)";
                ctx.strokeStyle = theme === "dragon-ball" ? "rgba(52, 211, 153, 1)" : "rgba(234, 179, 8, 1)";
                ctx.lineWidth = 4;

                ctx.beginPath();
                ctx.moveTo(startX, h / 2);
                ctx.lineTo(endX, h / 2);
                ctx.stroke();

                // Capa de brillo central
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#fff";
                ctx.stroke();

                ctx.shadowBlur = 0;
            }
        }
    };

    const formatTime = (t: number) => {
        const mins = Math.floor(t / 6000).toString().padStart(2, "0");
        const secs = Math.floor((t % 6000) / 100).toString().padStart(2, "0");
        const cents = (t % 100).toString().padStart(2, "0");
        return `${mins}:${secs}:${cents}`;
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Si estamos escribiendo en un input, no interferimos
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Impedimos que espacio active botones por defecto si hay foco en botones
            if (e.code === "Space" || e.code === "ArrowUp") {
                if (document.activeElement instanceof HTMLButtonElement) {
                    document.activeElement.blur();
                }
            }

            if (status !== "grabando") return;
            if (keysPressed.current.has(e.code)) return;

            if (e.code === "Space") {
                e.preventDefault();
                keysPressed.current.add(e.code);
                startContinuousTone();
                puntosRef.current.push({ id: Date.now(), tiempo: timerRef.current, tipo: "fluido", estado: "inicio" });
            }
            if (e.code === "ArrowUp") {
                e.preventDefault();
                keysPressed.current.add(e.code);
                playPulse();
                puntosRef.current.push({ id: Date.now(), tiempo: timerRef.current, tipo: "pulso" });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
            }

            if (status !== "grabando") return;

            if (e.code === "Space") {
                keysPressed.current.delete(e.code);
                stopContinuousTone();
                puntosRef.current.push({ id: Date.now(), tiempo: timerRef.current, tipo: "fluido", estado: "final" });
            }
            if (e.code === "ArrowUp") {
                keysPressed.current.delete(e.code);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [status]);

    useEffect(() => {
        if (masterGainRef.current) masterGainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current!.currentTime, 0.05);
    }, [volume]);

    // --- Biblioteca ---
    const openLibrary = async () => {
        setShowLibrary(true);
        const data = await getRhythms();
        setRhythms(data);
    };

    const loadRhythm = (r: any) => {
        stopAll();
        puntosRef.current = r.points;
        setTimer(0);
        timerRef.current = 0;
        setHasRecordedData(false);
        setCanSave(false); // Desactiva guardado para lo cargado de biblioteca
        setShowLibrary(false);
        setTimeout(renderRadar, 50);
    };

    const loadRhythmAndPlay = (r: any) => {
        loadRhythm(r);
        setTimeout(startPlayback, 100);
    };

    const filteredRhythms = useMemo(() => {
        return rhythms.filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(searchLibrary.toLowerCase());
            const matchesArt = filterArt === "all" || r.martialArt === filterArt;
            return matchesSearch && matchesArt;
        });
    }, [rhythms, searchLibrary, filterArt]);

    const handleSaveSession = async () => {
        if (!kataName || !martialArt || !style) return;
        setIsSaving(true);
        const res = await saveRhythm({
            name: kataName,
            martialArt,
            style,
            points: puntosRef.current
        });
        setIsSaving(false);
        if (res.success) {
            setShowSaveModal(false);
            setHasRecordedData(false);
            setCanSave(false);
            setKataName("");
            setMartialArt("");
            setStyle("");
        } else {
            alert("Error al guardar: " + res.error);
        }
    };

    const handleClearSession = () => {
        stopAll();
        puntosRef.current = [];
        setTimer(0);
        timerRef.current = 0;
        setHasRecordedData(false);
        setTimeout(renderRadar, 50);
    };

    const handleDeleteRhythm = async () => {
        if (!rhythmToDelete) return;
        setIsDeleting(true);
        const res = await deleteRhythm(rhythmToDelete._id);
        setIsDeleting(false);
        if (res.success) {
            setRhythms(prev => prev.filter(r => r._id !== rhythmToDelete._id));
            setRhythmToDelete(null);
        } else {
            alert("Error al borrar: " + res.error);
        }
    };

    return (
        <div
            className={`w-full min-h-screen relative theme-${theme}`}
            style={{
                backgroundImage: theme === "dragon-ball" ? "url('/images/kuma-ritmo-fondo-dragon-ball.jpg')" : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed"
            }}
        >
            {/* Overlay oscuro para mejorar legibilidad sobre la imagen */}
            {theme === "dragon-ball" && (
                <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
            )}

            <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto relative px-4 text-center select-none py-6 z-10">

                {/* 1. Header & Cronómetro */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <PrimalTitle className="text-4xl md:text-6xl uppercase tracking-[0.2em] italic text-white/90">
                        {theme === "dragon-ball" ? (
                            <span className="flex items-center gap-1 font-dragon-z relative">
                                <span className="text-grad-db-yellow z-10">RITM</span>
                                <div className="relative w-12 h-12 md:w-16 md:h-16 mx-1 flex-shrink-0 z-20 group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-orange-500 to-red-600 shadow-[0_0_15px_rgba(251,146,60,0.6)] border-2 border-orange-200/50" />
                                    <div className="absolute top-2 left-3 w-4 h-2 rounded-[100%] bg-white/60 blur-[1px] rotate-[-45deg]" />
                                    <Star weight="fill" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-700 w-6 h-6 md:w-8 md:h-8 drop-shadow-sm" />
                                </div>
                                <span className="text-grad-db-red z-10"> KATAS</span>
                                {/* Sombra 3D del Texto */}
                                <span className="absolute left-1 top-1 text-black/80 -z-10 select-none blur-[1px]">RITMO KATAS</span>
                            </span>
                        ) : (
                            "Ritmo Katas"
                        )}
                    </PrimalTitle>

                    <div className="relative group cursor-default">
                        <div className="absolute -inset-2 bg-kuma-gold/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-zinc-950/80 border-2 border-kuma-gold/40 px-8 py-4 rounded-3xl shadow-[inset_0_0_30px_rgba(234,179,8,0.2)]">
                            <span className="font-mono text-6xl md:text-8xl font-black tracking-widest text-kuma-gold drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">
                                {formatTime(timer)}
                            </span>
                            <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border border-white/20 shadow-lg ${status === "grabando" ? "bg-red-500 animate-pulse shadow-red-500/50" :
                                status === "reproduciendo" ? "bg-emerald-500 shadow-emerald-500/50 animate-pulse" : "bg-zinc-800"
                                }`} />
                        </div>
                    </div>
                </div>

                {/* 2. Consola Master */}
                <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6 p-6 bg-zinc-900/50 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl`}>

                    {/* Bloque Grabación - Solo visible para Admin */}
                    {isAdmin && (
                        <div className="flex flex-col gap-4 p-4 bg-black/40 rounded-[2rem] border border-white/5 relative overflow-hidden">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-left">Grabación</span>
                            <div className="flex gap-4 justify-center flex-wrap">
                                <button
                                    className={`kuma-btn-3d group ${status === "grabando" ? "active" : ""}`}
                                    onClick={() => status === "grabando" ? stopAll() : startRecording()}
                                >
                                    <div className="btn-inner bg-zinc-800 flex flex-col items-center justify-center gap-1 px-1">
                                        <div className={`w-5 h-5 rounded-full border-2 ${status === "grabando" ? "bg-red-500 animate-pulse border-white/50" : "bg-red-800 border-red-900"} group-hover:bg-red-600 transition-colors shadow-lg`} />
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${status === "grabando" ? "text-red-400" : "text-zinc-500"}`}>
                                            {status === "grabando" ? "S. Activa" : "Grabar"}
                                        </span>
                                    </div>
                                </button>
                                <button className="kuma-btn-3d group" onClick={stopAll}>
                                    <div className="btn-inner bg-zinc-800 flex flex-col items-center justify-center gap-1">
                                        <div className="w-5 h-5 bg-zinc-600 border-2 border-zinc-700 group-hover:bg-zinc-400 transition-colors rounded-sm" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Parar</span>
                                    </div>
                                </button>
                                <button className="kuma-btn-3d group" onClick={handleClearSession}>
                                    <div className="btn-inner bg-zinc-800 flex flex-col items-center justify-center gap-1">
                                        <Broom weight="fill" className="text-zinc-500 group-hover:text-amber-400 w-5 h-5 transition-colors" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Limpiar</span>
                                    </div>
                                </button>
                                {/* Botón Guardar - Solo aparece si es sesión propia (no de biblioteca) */}
                                {canSave && (
                                    <button
                                        className={`kuma-btn-3d group ${hasRecordedData ? "active" : "opacity-30 cursor-not-allowed"} !w-[70px]`}
                                        onClick={() => hasRecordedData && setShowSaveModal(true)}
                                    >
                                        <div className="btn-inner bg-kuma-gold/20 flex flex-col items-center justify-center gap-1 border-kuma-gold/50 shadow-[0_0_15px_rgba(234,179,8,0.3)] px-1">
                                            <FloppyDiskBack weight="fill" className="text-kuma-gold w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span className="text-kuma-gold">Guardar</span>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bloque Reproducción */}
                    <div className="flex flex-col gap-4 p-4 bg-black/40 rounded-[2rem] border border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-left">Reproducción</span>
                        <div className="flex gap-4 justify-center">
                            <button className="kuma-btn-3d group !w-[96px]" onClick={openLibrary}>
                                <div className="btn-inner bg-zinc-800 flex flex-col items-center justify-center gap-1">
                                    <Books weight="fill" className="w-5 h-5 text-zinc-500 group-hover:text-kuma-gold transition-colors" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Biblioteca</span>
                                </div>
                            </button>
                            <button className="kuma-btn-3d group" onClick={status === "reproduciendo" ? pauseAll : startPlayback}>
                                <div className="btn-inner bg-zinc-800 flex flex-col items-center justify-center gap-1">
                                    {status === "reproduciendo" ? (
                                        <div className="flex gap-1 group-hover:gap-1.5 transition-all">
                                            <div className="w-1.5 h-4 bg-zinc-400 rounded-full" />
                                            <div className="w-1.5 h-4 bg-zinc-400 rounded-full" />
                                        </div>
                                    ) : (
                                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-kuma-gold border-b-[10px] border-b-transparent ml-1 group-hover:scale-110 transition-transform" />
                                    )}
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{status === "reproduciendo" ? "Pausa" : "Play"}</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Bloque Temas */}
                    <div className="flex flex-col gap-4 p-4 bg-black/40 rounded-[2rem] border border-white/5 relative z-50">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-left">Temas</span>
                        <div className="relative w-full">
                            <button
                                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                                className={`w-full flex items-center justify-between bg-zinc-800 border border-white/5 rounded-2xl py-3 px-6 text-white outline-none focus:border-kuma-gold/30 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:bg-zinc-700 ${isThemeDropdownOpen ? 'border-kuma-gold/50' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkle weight="fill" className={`w-4 h-4 ${theme === "dragon-ball" ? "text-emerald-500" : "text-kuma-gold"}`} />
                                    <span>{theme === "dragon-ball" ? "Dragon Ball" : "Kuma HUD"}</span>
                                </div>
                                <CaretDown weight="bold" className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isThemeDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden z-[60]"
                                    >
                                        <div className="p-1 flex flex-col gap-1">
                                            <button
                                                onClick={() => { setTheme("dragon-ball"); setIsThemeDropdownOpen(false); }}
                                                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${theme === "dragon-ball" ? "bg-red-500/20 text-red-400" : "hover:bg-white/5 text-zinc-400 hover:text-white"}`}
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest">Dragon Ball</span>
                                                {theme === "dragon-ball" && <Check weight="bold" className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => { setTheme("tactical-hud"); setIsThemeDropdownOpen(false); }}
                                                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${theme === "tactical-hud" ? "bg-kuma-gold/20 text-kuma-gold" : "hover:bg-white/5 text-zinc-400 hover:text-white"}`}
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest">Kuma HUD</span>
                                                {theme === "tactical-hud" && <Check weight="bold" className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Bloque Ajustes */}
                    <div className="flex flex-col gap-4 p-4 bg-black/40 rounded-[2rem] border border-white/5 h-full">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-left">Ajustes & Salida</span>
                        <div className="flex items-center justify-between gap-4 h-full px-2">
                            <div className="flex items-end gap-3 h-28 group relative">
                                <div className="flex flex-col gap-1 h-full justify-center">
                                    {[...Array(10)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-1.5 rounded-sm shadow-sm transition-colors duration-200 ${(10 - i) <= volume * 10
                                                ? (i < 3 ? "bg-red-500 shadow-red-500/40" : i < 6 ? "bg-kuma-gold shadow-kuma-gold/40" : "bg-emerald-500 shadow-emerald-500/40")
                                                : "bg-zinc-800"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="relative w-8 h-full bg-zinc-950 border border-white/5 rounded-lg shadow-inner flex justify-center">
                                    <input
                                        type="range" min="0" max="1" step="0.01"
                                        value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-20"
                                        style={{ appearance: 'slider-vertical' } as any}
                                    />
                                    <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-0.5 bg-zinc-800" />
                                    <div
                                        className="absolute left-0 right-0 h-8 bg-zinc-800 border-y-2 border-zinc-700 shadow-[0_4px_10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-sm pointer-events-none transition-all duration-75"
                                        style={{ bottom: `calc(${volume * 100}% - 16px)` }}
                                    >
                                        <div className="absolute left-1 right-1 top-1/2 -translate-y-px h-0.5 bg-kuma-gold/50" />
                                    </div>
                                </div>
                                <div className="absolute -top-1 -right-4 flex flex-col items-center">
                                    <span className="font-mono text-[10px] font-black text-kuma-gold bg-black border border-kuma-gold/30 px-1 rounded shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                                        {Math.round(volume * 100)}
                                    </span>
                                </div>
                            </div>

                            <button className="kuma-btn-3d group !w-[80px] self-center" onClick={onBack}>
                                <div className="btn-inner bg-zinc-900/80 flex flex-col items-center justify-center gap-1">
                                    <ArrowLeft weight="bold" className="w-4 h-4 text-zinc-500 group-hover:text-red-500 transition-colors" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Salir</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Radar Oscilloscope */}
                <div className="relative w-full aspect-[21/9] md:aspect-[32/9] bg-black rounded-[3rem] overflow-hidden border-4 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_100px_rgba(0,0,0,1)] group">
                    {theme === "dragon-ball" ? (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.08)_0,transparent_100%)]" />
                            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(52,211,153,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.15) 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 pointer-events-none opacity-40">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0,transparent_100%)]" />
                            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(234,179,8,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
                        </div>
                    )}
                    <canvas ref={canvasRef} width={2400} height={800} className="absolute inset-0 w-full h-full mix-blend-screen" />

                    {/* Goku Flotando en el Radar (Solo Dragon Ball & Durante Acción) */}
                    <AnimatePresence>
                        {theme === "dragon-ball" && (status === "grabando" || status === "reproduciendo") && (
                            <motion.div
                                initial={{ x: "-20%", y: "-5%", opacity: 0 }}
                                animate={{
                                    x: ["-20%", "10%"],
                                    y: ["-5%", "5%"],
                                    opacity: 1
                                }}
                                exit={{ x: "120%", opacity: 0 }}
                                transition={{
                                    x: { duration: 1.2, ease: "easeOut" },
                                    y: { duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                                    opacity: { duration: 0.5 }
                                }}
                                className="absolute pointer-events-none z-20 w-32 h-32 md:w-48 md:h-48"
                            >
                                <img
                                    src="/images/kuma-goku-nube-voladora.png"
                                    alt="Goku en Nube Voladora"
                                    className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute inset-0 border-[1.5rem] border-zinc-950/80 rounded-[3rem] pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,1)]" />

                    <div className="absolute inset-0 border-[1.5rem] border-zinc-950/80 rounded-[3rem] pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,1)]" />
                </div>

                {/* MODAL DE GUARDADO PREMIUM */}
                <AnimatePresence>
                    {showSaveModal && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="relative w-full max-w-lg bg-zinc-900 border-2 border-kuma-gold/40 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-kuma-gold to-transparent" />
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-kuma-gold font-black uppercase tracking-widest text-2xl italic">Nueva Entrada</h3>
                                    </div>
                                    <button onClick={() => setShowSaveModal(false)} className="text-zinc-600 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 text-left ml-4">Nombre del Kata</label>
                                            <input
                                                type="text" value={kataName} onChange={(e) => setKataName(e.target.value)}
                                                placeholder="EJ: HEIAN SHODAN"
                                                className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono focus:border-kuma-gold/50 focus:outline-none transition-all placeholder:text-zinc-800"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 text-left ml-4">Arte Marcial</label>
                                                <input
                                                    type="text" value={martialArt} onChange={(e) => setMartialArt(e.target.value)}
                                                    placeholder="Karate"
                                                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono focus:border-kuma-gold/50 focus:outline-none transition-all placeholder:text-zinc-800"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 text-left ml-4">Estilo</label>
                                                <input
                                                    type="text" value={style} onChange={(e) => setStyle(e.target.value)}
                                                    placeholder="Shotokan"
                                                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono focus:border-kuma-gold/50 focus:outline-none transition-all placeholder:text-zinc-800"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSaveSession}
                                        disabled={isSaving || !kataName || !martialArt || !style}
                                        className={`w-full kuma-btn-3d h-16 bg-zinc-800 rounded-2xl group ${isSaving ? "opacity-50" : ""}`}
                                    >
                                        <div className="btn-inner flex items-center justify-center gap-3">
                                            <FloppyDiskBack weight="fill" className={`w-6 h-6 ${isSaving ? 'animate-spin' : 'text-kuma-gold group-hover:scale-110 transition-transform'}`} />
                                            <span className="text-xs font-black uppercase tracking-widest text-zinc-100">
                                                {isSaving ? "Sincronizando..." : "Confirmar Registro"}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* BIBLIOTECA MODAL CENTRADO */}
                <AnimatePresence>
                    {showLibrary && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                                className="relative w-full max-w-4xl max-h-[85vh] bg-zinc-900 border-2 border-kuma-gold/30 rounded-[3rem] flex flex-col shadow-[0_0_80px_rgba(0,0,0,1)] overflow-hidden"
                            >
                                {/* Header Biblioteca */}
                                <div className="p-8 border-b border-white/5 bg-black/20 flex flex-col gap-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="text-left">
                                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Biblioteca</h2>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowLibrary(false)} className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="relative flex-[2]">
                                            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                                            <input
                                                type="text" placeholder="Buscar kata..." value={searchLibrary} onChange={(e) => setSearchLibrary(e.target.value)}
                                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 pl-12 pr-6 outline-none focus:border-kuma-gold/30 text-white transition-all text-sm font-mono"
                                            />
                                        </div>
                                        <div className="relative flex-1 group">
                                            <select
                                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3 px-6 pr-10 text-white outline-none focus:border-kuma-gold/30 text-sm font-black uppercase tracking-widest appearance-none cursor-pointer transition-all"
                                                value={filterArt} onChange={(e) => setFilterArt(e.target.value)}
                                            >
                                                <option value="all">TODAS LAS ARTES</option>
                                                <option value="Karate">KARATE</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-kuma-gold transition-colors">
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lista de Ritmos con Table-HUD */}
                                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/20">
                                    <div className="w-full border-separate border-spacing-y-2">
                                        {/* Header de la Tabla */}
                                        <div className="grid grid-cols-[2fr_1.2fr_1.2fr_0.8fr_0.8fr] gap-4 px-8 py-4 mb-4 bg-zinc-800/30 rounded-2xl border border-white/5 text-[11px] font-black uppercase tracking-[0.3em] text-kuma-gold/80">
                                            <div className="flex items-center gap-2"><MagnifyingGlass weight="bold" className="w-3 h-3" /> Nombre del Kata</div>
                                            <div className="flex items-center gap-2"><Sword weight="bold" className="w-3 h-3" /> Arte Marcial</div>
                                            <div className="flex items-center gap-2"><Scroll weight="bold" className="w-3 h-3" /> Estilo</div>
                                            <div className="flex items-center gap-2 text-center justify-center"><TrendUp weight="bold" className="w-3 h-3" /> Sinc.</div>
                                            <div className="text-center">Acciones</div>
                                        </div>

                                        {/* Cuerpo de la Tabla */}
                                        <div className="space-y-3">
                                            {filteredRhythms.map((r) => (
                                                <motion.div
                                                    key={r._id}
                                                    whileHover={{ scale: 1.005, backgroundColor: "rgba(234,179,8,0.03)" }}
                                                    className="grid grid-cols-[2fr_1.2fr_1.2fr_0.8fr_0.8fr] gap-4 p-5 px-8 bg-zinc-900/40 rounded-2xl border border-white/5 hover:border-kuma-gold/30 items-center group transition-all duration-300 shadow-sm"
                                                >
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-white font-black text-base tracking-tight group-hover:text-kuma-gold transition-colors">{r.name}</span>
                                                        <span className="text-[10px] text-zinc-600 font-mono flex items-center gap-2 mt-0.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                                                            REF: {r._id.slice(-8).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="px-4 py-1.5 bg-zinc-950 rounded-xl border border-white/5 text-[10px] text-zinc-400 font-black uppercase tracking-widest shadow-inner">
                                                            {r.martialArt}
                                                        </span>
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="text-zinc-500 font-mono text-xs uppercase italic border-l-2 border-kuma-gold/20 pl-3">
                                                            {r.style}
                                                        </span>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="inline-flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                                                            <span className="text-[10px] text-white font-mono font-bold">{r.points.length}</span>
                                                            <div className="flex gap-0.5">
                                                                {[...Array(3)].map((_, i) => (
                                                                    <div key={i} className={`w-1 h-1 rounded-full ${i < 2 ? 'bg-kuma-gold' : 'bg-zinc-800'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-center items-center gap-3">
                                                        <button
                                                            onClick={() => loadRhythm(r)}
                                                            className="w-10 h-10 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-500/30 group/select"
                                                            title="Elegir y Cargar"
                                                        >
                                                            <HandTap weight="fill" className="w-5 h-5 group-hover/select:scale-110 transition-transform" />
                                                        </button>

                                                        <div className="w-px h-6 bg-white/10 mx-1" />

                                                        <button
                                                            onClick={() => loadRhythmAndPlay(r)}
                                                            className="w-10 h-10 bg-kuma-gold/5 text-kuma-gold hover:bg-kuma-gold hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 shadow-md border border-kuma-gold/20"
                                                            title="Cargar y Reproducir"
                                                        >
                                                            <Play weight="fill" className="w-5 h-5" />
                                                        </button>
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => setRhythmToDelete(r)}
                                                                className="w-10 h-10 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl flex items-center justify-center transition-all duration-300 border border-red-500/10"
                                                                title="Borrar Registro"
                                                            >
                                                                <Trash weight="bold" className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {filteredRhythms.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-24 text-zinc-700">
                                            <div className="relative mb-6">
                                                <Scroll weight="thin" className="w-20 h-20 opacity-20" />
                                                <MagnifyingGlass className="absolute -bottom-2 -right-2 w-8 h-8 opacity-40 text-kuma-gold" />
                                            </div>
                                            <p className="font-mono text-xs uppercase tracking-[0.4em]">Sin registros que coincidan</p>
                                        </div>
                                    )}
                                </div>


                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CONFIRMACIÓN DE BORRADO */}
                <AnimatePresence>
                    {rhythmToDelete && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="relative w-full max-w-md bg-zinc-900 border-2 border-red-500/30 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(255,0,0,0.1)] text-center"
                            >
                                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                    <Trash weight="fill" className="text-red-500 w-10 h-10" />
                                </div>
                                <h3 className="text-white font-black uppercase tracking-tighter text-2xl mb-2 italic">¿Eliminar Kata?</h3>
                                <p className="text-zinc-500 text-sm mb-8 font-mono leading-relaxed px-4">
                                    Esta acción es irreversible. El kata <span className="text-white font-bold tracking-normal">"{rhythmToDelete.name}"</span> será borrado permanentemente del servidor.
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setRhythmToDelete(null)}
                                        className="flex-1 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-white/5"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleDeleteRhythm}
                                        disabled={isDeleting}
                                        className="flex-1 px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-[0_10px_30px_rgba(220,38,38,0.3)] disabled:opacity-50"
                                    >
                                        {isDeleting ? "Borrando..." : "Confirmar"}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <style jsx>{`
                /* Estilos Base (Tactical HUD) */
                .kuma-btn-3d { 
                    position: relative; 
                    padding: 3px; 
                    background: #18181b; 
                    border-radius: 14px; 
                    border: 1px solid rgba(255,255,255,0.1); 
                    box-shadow: 
                        0 5px 0 #09090b, 
                        0 10px 20px rgba(0,0,0,0.6),
                        inset 0 1px 1px rgba(255,255,255,0.05); 
                    transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1); 
                    width: 64px; 
                    height: 56px; 
                    cursor: pointer; 
                    display: flex;
                    align-items: stretch;
                }
                .kuma-btn-3d:active, .kuma-btn-3d.active { 
                    transform: translateY(3px); 
                    box-shadow: 0 2px 0 #000, 0 4px 10px rgba(0,0,0,0.7); 
                }
                .btn-inner { 
                    flex: 1;
                    border-radius: 10px; 
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05); 
                    border: 1px solid rgba(0,0,0,0.6); 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 3px;
                    background: linear-gradient(180deg, #27272a 0%, #18181b 100%);
                    overflow: hidden;
                    position: relative;
                }
                .btn-inner span {
                    font-size: 9px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: #71717a;
                    transition: color 0.2s;
                    line-height: 1;
                    font-family: var(--font-mono);
                }
                .kuma-btn-3d:hover .btn-inner span {
                    color: #e4e4e7;
                }

                /* Estilos Gravity Chamber (Dragon Ball) */
                .theme-dragon-ball .kuma-btn-3d {
                    background: #e11d48;
                    border-radius: 60px;
                    border: 2px solid #9f1239;
                    box-shadow: 
                        0 7px 0 #881337, 
                        0 14px 28px rgba(0,0,0,0.7),
                        inset 0 2px 4px rgba(255,255,255,0.4);
                    width: 74px;
                    height: 58px;
                }
                .theme-dragon-ball .kuma-btn-3d:active, .theme-dragon-ball .kuma-btn-3d.active {
                    transform: translateY(4px);
                    box-shadow: 
                        0 3px 0 #881337,
                        0 6px 14px rgba(0,0,0,0.7),
                        inset 0 2px 10px rgba(0,0,0,0.4);
                }
                .theme-dragon-ball .btn-inner {
                    background: linear-gradient(180deg, #fb7185 0%, #e11d48 50%, #9f1239 100%);
                    border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.4);
                    box-shadow: 
                        inset 0 4px 12px rgba(255,255,255,0.5), 
                        inset 0 -4px 12px rgba(0,0,0,0.4);
                }
                .theme-dragon-ball .btn-inner::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        45deg, 
                        transparent 45%, 
                        rgba(255,255,255,0.1) 48%, 
                        rgba(255,255,255,0.4) 50%, 
                        rgba(255,255,255,0.1) 52%, 
                        transparent 55%
                    );
                    pointer-events: none;
                    transition: transform 0.4s ease-out;
                }
                .theme-dragon-ball .kuma-btn-3d:hover .btn-inner::after {
                    transform: translate(10%, 10%);
                }
                .theme-dragon-ball .btn-inner span {
                    color: white !important;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                    font-weight: 900;
                }
                .theme-dragon-ball .btn-inner svg {
                    color: white !important;
                    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));
                }

                /* FUENTE DRAGON BALL Z */
                .font-dragon-z {
                    font-family: 'Impact', 'Arial Black', sans-serif;
                    letter-spacing: 0.05em;
                    transform: skewX(-10deg) rotate(-2deg);
                    display: inline-flex;
                    align-items: center;
                }
                .text-grad-db-yellow {
                    color: #fbbf24; /* Amber-400 */
                    background: linear-gradient(180deg, #fef08a 0%, #facc15 50%, #eab308 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    -webkit-text-stroke: 1.5px #991b1b; /* Red-800 border like "DRAGON" */
                    filter: drop-shadow(3px 3px 0px #000);
                    position: relative;
                }
                .text-grad-db-red {
                    color: #dc2626; /* Red-600 */
                    background: linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    -webkit-text-stroke: 1.5px #facc15; /* Yellow/Gold border like "Z" */
                    filter: drop-shadow(3px 3px 0px #000);
                    position: relative;
                }

                @media (min-width: 768px) {
                    .text-grad-db-yellow {
                        -webkit-text-stroke: 2.5px #991b1b;
                        filter: drop-shadow(5px 5px 0px #000);
                    }
                    .text-grad-db-red {
                        -webkit-text-stroke: 2.5px #facc15;
                        filter: drop-shadow(5px 5px 0px #000);
                    }
                }

                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(234,179,8,0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(234,179,8,0.4); }
            `}</style>
            </div>
        </div >
    );
};
