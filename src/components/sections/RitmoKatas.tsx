"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { saveRhythm, getRhythms, deleteRhythm } from "@/lib/actions/rhythms";
import { ArrowLeft, Star, Sparkle, Fire, Timer, Shield } from "@phosphor-icons/react";

// Sub-components
import { RitmoRadar, type RitmoTheme } from "./ritmo/RitmoRadar";
import { RitmoConsole } from "./ritmo/RitmoConsole";
import { RitmoLibrary } from "./ritmo/RitmoLibrary";
import { RitmoSaveModal } from "./ritmo/RitmoSaveModal";

// Hooks
import { useRitmoAudio } from "@/hooks/useRitmoAudio";
import { useRitmoLogic } from "@/hooks/useRitmoLogic";

export const RitmoKatas = ({ onBack }: { onBack: () => void }) => {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin";

    // Refs
    const radarRef = useRef<any>(null);
    const dragStartYRef = useRef(0);
    const dragStartXRef = useRef(0);
    const startVolumeRef = useRef(0.8);
    const keysPressed = useRef<Set<string>>(new Set());

    // State
    const [theme, setTheme] = useState<RitmoTheme>("tactical-hud");
    const [volume, setVolume] = useState(0.8);
    const [isDragging, setIsDragging] = useState(false);
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

    // Modals & Library State
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [kataName, setKataName] = useState("");
    const [martialArt, setMartialArt] = useState("");
    const [style, setStyle] = useState("");
    const [showLibrary, setShowLibrary] = useState(false);
    const [rhythms, setRhythms] = useState<any[]>([]);
    const [searchLibrary, setSearchLibrary] = useState("");
    const [filterArt, setFilterArt] = useState("all");

    // Audio & Logic Hooks
    const { initAudio, playPulse, startContinuousTone, stopContinuousTone } = useRitmoAudio(volume);
    const {
        status,
        timer,
        hasRecordedData,
        canSave,
        puntosRef,
        timerRef,
        startRecording,
        startPlayback,
        stopAll,
        pauseAll,
        clearSession,
        recordPulseAction,
        startFluidAction,
        stopFluidAction,
        seekTo,
        setHasRecordedData,
        setCanSave,
        setTimer,
        setStatus
    } = useRitmoLogic(
        initAudio,
        playPulse,
        startContinuousTone,
        stopContinuousTone,
        () => radarRef.current?.renderRadar()
    );

    // Mobile reactive flash
    const [kimeFlash, setKimeFlash] = useState(false);
    const handleMobileKime = () => {
        recordPulseAction();
        setKimeFlash(true);
        setTimeout(() => setKimeFlash(false), 140);
    };

    // Timeline metrics (for mobile progress bar & heatmap scrubber)
    const totalSessionTime = useMemo(() => {
        if (puntosRef.current.length === 0) return Math.max(timer, 100);
        const maxP = puntosRef.current[puntosRef.current.length - 1].tiempo;
        return Math.max(timer, maxP, 100);
    }, [timer, status]);

    const progressPercent = useMemo(() => {
        if (!totalSessionTime || totalSessionTime <= 0) return 0;
        return Math.min(100, Math.max(0, (timer / totalSessionTime) * 100));
    }, [timer, totalSessionTime]);

    const handleTimelineSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        const targetTime = Math.round(ratio * totalSessionTime);
        seekTo(targetTime);
    };

    // Keyboard Handlers (Synchronized with mobile touch handlers)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.code === "Space" || e.code === "ArrowUp") {
                if (document.activeElement instanceof HTMLButtonElement) document.activeElement.blur();
            }
            if (status !== "grabando") return;
            if (keysPressed.current.has(e.code)) return;

            if (e.code === "Space") {
                e.preventDefault();
                keysPressed.current.add(e.code);
                startFluidAction();
            }
            if (e.code === "ArrowUp") {
                e.preventDefault();
                keysPressed.current.add(e.code);
                recordPulseAction();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.code === "Space" || e.code === "ArrowUp") e.preventDefault();
            if (status !== "grabando") return;

            if (e.code === "Space") {
                keysPressed.current.delete(e.code);
                stopFluidAction();
            }
            if (e.code === "ArrowUp") keysPressed.current.delete(e.code);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [status, startFluidAction, recordPulseAction, stopFluidAction]);

    // Volume Drag Logic
    const handlePointerDownVolume = (e: React.PointerEvent) => {
        setIsDragging(true);
        dragStartYRef.current = e.clientY;
        dragStartXRef.current = e.clientX;
        startVolumeRef.current = volume;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMoveVolume = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const deltaY = dragStartYRef.current - e.clientY;
        const deltaX = Math.abs(dragStartXRef.current - e.clientX);
        const totalHeight = rect.height;
        const sensitivity = 1 / (1 + deltaX / 100);
        let nextVol = startVolumeRef.current + (deltaY / totalHeight) * sensitivity;
        setVolume(Math.max(0, Math.min(1, nextVol)));
    };

    const handlePointerUpVolume = (e: React.PointerEvent) => {
        setIsDragging(false);
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    };

    // Library Actions
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
        setCanSave(false);
        setShowLibrary(false);
        setTimeout(() => radarRef.current?.renderRadar(), 50);
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
        const res = await saveRhythm({ name: kataName, martialArt, style, points: puntosRef.current });
        setIsSaving(false);
        if (res.success) {
            setShowSaveModal(false);
            setHasRecordedData(false);
            setCanSave(false);
            setKataName("");
            setMartialArt("");
            setStyle("");
        }
    };

    const formatTime = (t: number) => {
        const mins = Math.floor(t / 6000).toString().padStart(2, "0");
        const secs = Math.floor((t % 6000) / 100).toString().padStart(2, "0");
        const cents = (t % 100).toString().padStart(2, "0");
        return `${mins}:${secs}:${cents}`;
    };

    // Count metrics
    const impactCount = useMemo(() => {
        return puntosRef.current.filter(p => p.tipo === "pulso").length;
    }, [timer, status]);

    const fluidCount = useMemo(() => {
        return puntosRef.current.filter(p => p.tipo === "fluido" && p.estado === "inicio").length;
    }, [timer, status]);

    return (
        <div
            className={`w-full min-h-screen relative transition-colors duration-500 ${
                theme === "dragon-ball"
                    ? "bg-black"
                    : theme === "shotokan-zen"
                    ? "bg-[#09090b]"
                    : theme === "cyberpunk-neon"
                    ? "bg-[#090514]"
                    : "bg-zinc-950"
            }`}
            style={{
                backgroundImage: theme === "dragon-ball" ? "url('/images/kuma-ritmo-fondo-dragon-ball.jpg')" : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed"
            }}
        >
            {/* Destello Reactivo de Borde AMOLED (Solo en mobile) */}
            {kimeFlash && (
                <div className="md:hidden fixed inset-0 pointer-events-none z-50 ring-4 ring-amber-400/80 shadow-[inset_0_0_60px_rgba(251,191,36,0.35)] transition-opacity duration-150" />
            )}

            {/* Background Atmosphere Overlays */}
            {theme === "dragon-ball" && <div className="absolute inset-0 bg-black/65 pointer-events-none z-0" />}
            {theme === "shotokan-zen" && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-red-600/10 blur-[130px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full" />
                </div>
            )}
            {theme === "cyberpunk-neon" && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 blur-[140px] rounded-full" />
                    <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full" />
                </div>
            )}
            {theme === "tactical-hud" && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 blur-[130px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-700/10 blur-[120px] rounded-full" />
                </div>
            )}

            <div className="flex flex-col gap-5 sm:gap-6 w-full max-w-7xl mx-auto relative px-3 sm:px-6 text-center select-none py-4 sm:py-6 z-10">
                {/* Header Superior con Botón Volver y Badge de Estado */}
                <div className="flex items-center justify-between w-full">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-zinc-400 hover:text-kuma-gold transition-all duration-300 group px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 cursor-pointer"
                    >
                        <ArrowLeft weight="bold" className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-kuma-gold" />
                        <span className="font-black uppercase tracking-wider text-[11px] text-white">Volver al Dojo</span>
                    </button>

                    <div className="flex items-center gap-2">
                        {status === "grabando" && (
                            <div className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/60 text-red-400 text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                <span>Grabando Sesión</span>
                            </div>
                        )}
                        {status === "reproduciendo" && (
                            <div className="px-3 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/60 text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span>Reproduciendo</span>
                            </div>
                        )}
                        {status === "pausado" && (
                            <div className="px-3 py-1 rounded-full bg-amber-600/20 border border-amber-500/60 text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                                <span>Pausado</span>
                            </div>
                        )}
                        {status === "listo" && (
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest hidden xs:flex items-center gap-1.5">
                                <span>En Espera</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hero Title & Cronómetro Central Deportivo */}
                <div className="flex flex-col items-center gap-2.5 sm:gap-3 relative z-10">
                    <PrimalTitle className="text-3xl sm:text-5xl md:text-6xl uppercase tracking-[0.15em] italic text-white/95 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                        {theme === "dragon-ball" ? (
                            <span className="flex items-center gap-1 font-dragon-z relative justify-center">
                                <span className="text-grad-db-yellow z-10">RITM</span>
                                <div className="relative w-10 h-10 sm:w-14 sm:h-14 mx-1 flex-shrink-0 z-20">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-orange-500 to-red-600 shadow-[0_0_15px_rgba(251,146,60,0.6)] border-2 border-orange-200/50" />
                                    <Star weight="fill" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-700 w-5 h-5 sm:w-7 sm:h-7" />
                                </div>
                                <span className="text-grad-db-red z-10"> KATAS</span>
                                <span className="absolute left-1 top-1 text-black/80 -z-10 select-none blur-[1px]">RITMO KATAS</span>
                            </span>
                        ) : theme === "shotokan-zen" ? (
                            <span className="text-white">
                                拍子 • <span className="text-red-500">RITMO</span> KATAS
                            </span>
                        ) : theme === "cyberpunk-neon" ? (
                            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
                                CYBER RHYTHM // KATAS
                            </span>
                        ) : (
                            <span className="text-white">
                                RITMO <span className="text-kuma-gold">KATAS</span>
                            </span>
                        )}
                    </PrimalTitle>

                    {/* Display Cronómetro */}
                    <div className="relative group cursor-default w-full max-w-lg mx-auto">
                        <div className={`absolute -inset-2 blur-2xl opacity-40 transition-opacity ${
                            theme === "dragon-ball"
                                ? "bg-emerald-500/25"
                                : theme === "shotokan-zen"
                                ? "bg-red-600/25"
                                : theme === "cyberpunk-neon"
                                ? "bg-cyan-500/25"
                                : "bg-kuma-gold/25"
                        }`} />

                        <div className="relative bg-zinc-950/85 backdrop-blur-2xl border-2 border-white/15 px-6 sm:px-10 py-3.5 sm:py-5 rounded-3xl sm:rounded-[2.5rem] shadow-2xl flex flex-col items-center">
                            <span className={`font-mono text-5xl sm:text-7xl md:text-8xl font-black tracking-widest tabular-nums leading-none ${
                                theme === "dragon-ball"
                                    ? "text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                                    : theme === "shotokan-zen"
                                    ? "text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                                    : theme === "cyberpunk-neon"
                                    ? "text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                                    : "text-kuma-gold drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                            }`}>
                                {formatTime(timer)}
                            </span>

                            {/* Stats Chips */}
                            <div className="flex items-center gap-3 sm:gap-4 mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-white/10 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                    <Fire weight="fill" className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Impactos Kime: <strong className="text-white tabular-nums">{impactCount}</strong></span>
                                </div>
                                <span className="text-zinc-600">•</span>
                                <div className="flex items-center gap-1.5">
                                    <Timer weight="bold" className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Fluidos: <strong className="text-white tabular-nums">{fluidCount}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BARRA DE PROGRESO GLOBAL & MINIMAPA DE KIMES (SOLO EN MOBILE - Para no alterar desktop ni tablets) */}
                    <div className="block md:hidden w-full max-w-lg mx-auto px-1 space-y-2 select-none">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                            <span className="text-kuma-gold tabular-nums">{formatTime(timer)}</span>
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-200">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                <span>{puntosRef.current.length} Golpes Registrados</span>
                            </div>
                            <span className="text-zinc-400 tabular-nums">{formatTime(totalSessionTime)}</span>
                        </div>

                        {/* Scrubber Track con Minimapa */}
                        <div
                            onClick={handleTimelineSeek}
                            onTouchStart={handleTimelineSeek}
                            className="relative w-full h-5 bg-zinc-950/90 border border-white/20 rounded-full p-0.5 cursor-pointer shadow-inner touch-none overflow-hidden"
                        >
                            {/* Heatmap Pins (Kime y Fluidos en miniatura distribuidos a lo largo del kata) */}
                            {totalSessionTime > 0 && puntosRef.current.map((p, i) => {
                                const leftPercent = Math.min(100, Math.max(0, (p.tiempo / totalSessionTime) * 100));
                                if (p.tipo === "pulso") {
                                    return (
                                        <div
                                            key={`pin-${p.id || i}`}
                                            style={{ left: `${leftPercent}%` }}
                                            className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_8px_#f59e0b] z-10 pointer-events-none -translate-x-1/2"
                                        />
                                    );
                                }
                                return null;
                            })}

                            {/* Barra de Relleno Luminosa */}
                            <div
                                style={{ width: `${progressPercent}%` }}
                                className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 rounded-full transition-all duration-75 relative shadow-[0_0_15px_rgba(245,158,11,0.7)]"
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border border-amber-500 shadow-[0_0_10px_white] -mr-1" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Consola Modular de Controles */}
                <RitmoConsole
                    isAdmin={isAdmin}
                    status={status}
                    theme={theme}
                    volume={volume}
                    hasRecordedData={hasRecordedData}
                    canSave={canSave}
                    isThemeDropdownOpen={isThemeDropdownOpen}
                    isDragging={isDragging}
                    onToggleRecording={() => status === "grabando" ? stopAll() : startRecording()}
                    onStopAll={stopAll}
                    onClearSession={clearSession}
                    onOpenLibrary={openLibrary}
                    onTogglePlayback={() => status === "reproduciendo" ? pauseAll() : startPlayback()}
                    onSetTheme={(t) => { setTheme(t); setIsThemeDropdownOpen(false); }}
                    onToggleThemeDropdown={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                    onSetVolume={setVolume}
                    onShowSaveModal={() => setShowSaveModal(true)}
                    onPointerDownVolume={handlePointerDownVolume}
                    onPointerMoveVolume={handlePointerMoveVolume}
                    onPointerUpVolume={handlePointerUpVolume}
                    onRecordPulse={handleMobileKime}
                    onStartFluid={startFluidAction}
                    onStopFluid={stopFluidAction}
                />

                {/* Radar Visualizador de Audio HiDPI */}
                <RitmoRadar
                    ref={radarRef}
                    theme={theme}
                    timerRef={timerRef}
                    puntosRef={puntosRef}
                    status={status}
                />
            </div>

            {/* Modal Biblioteca de Ritmos */}
            <RitmoLibrary
                show={showLibrary}
                onClose={() => setShowLibrary(false)}
                rhythms={filteredRhythms}
                search={searchLibrary}
                onSearch={setSearchLibrary}
                filterArt={filterArt}
                onFilterArt={setFilterArt}
                onLoad={loadRhythm}
                onLoadAndPlay={(r) => { loadRhythm(r); setTimeout(startPlayback, 100); }}
                onDelete={async (r) => {
                    const res = await deleteRhythm(r._id);
                    if (res.success) setRhythms(prev => prev.filter(item => item._id !== r._id));
                }}
                isAdmin={isAdmin}
            />

            {/* Modal Guardar Patrón en Nube */}
            <RitmoSaveModal
                show={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                kataName={kataName}
                onKataNameChange={setKataName}
                martialArt={martialArt}
                onMartialArtChange={setMartialArt}
                style={style}
                onStyleChange={setStyle}
                isSaving={isSaving}
                onSave={handleSaveSession}
            />
        </div>
    );
};
