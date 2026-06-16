"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { saveRhythm, getRhythms, deleteRhythm } from "@/lib/actions/rhythms";
import { ArrowLeft, Star } from "@phosphor-icons/react";

// Sub-components
import { RitmoRadar } from "./ritmo/RitmoRadar";
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
    const [theme, setTheme] = useState<"dragon-ball" | "tactical-hud">("tactical-hud");
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

    // Keyboard Handlers
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
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.code === "Space" || e.code === "ArrowUp") e.preventDefault();
            if (status !== "grabando") return;

            if (e.code === "Space") {
                keysPressed.current.delete(e.code);
                stopContinuousTone();
                puntosRef.current.push({ id: Date.now(), tiempo: timerRef.current, tipo: "fluido", estado: "final" });
            }
            if (e.code === "ArrowUp") keysPressed.current.delete(e.code);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [status, startContinuousTone, playPulse, stopContinuousTone, puntosRef, timerRef]);

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

    return (
        <div
            className={`w-full min-h-screen relative theme-${theme}`}
            style={{
                backgroundImage: theme === "dragon-ball" ? "url('/images/kuma-ritmo-fondo-dragon-ball.jpg')" : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed"
            }}
        >
            {theme === "dragon-ball" && <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />}

            <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto relative px-4 text-center select-none py-6 z-10">
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 z-50 flex items-center gap-2 text-zinc-500 hover:text-kuma-gold transition-all duration-300 group px-3 py-2 rounded-xl hover:bg-white/5 active:scale-95"
                >
                    <ArrowLeft weight="bold" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Salir del Dojo</span>
                </button>

                <div className="flex flex-col items-center gap-2 relative z-10">
                    <PrimalTitle className="text-4xl md:text-6xl uppercase tracking-[0.2em] italic text-white/90">
                        {theme === "dragon-ball" ? (
                            <span className="flex items-center gap-1 font-dragon-z relative">
                                <span className="text-grad-db-yellow z-10">RITM</span>
                                <div className="relative w-12 h-12 md:w-16 md:h-16 mx-1 flex-shrink-0 z-20">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-orange-500 to-red-600 shadow-[0_0_15px_rgba(251,146,60,0.6)] border-2 border-orange-200/50" />
                                    <Star weight="fill" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-700 w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <span className="text-grad-db-red z-10"> KATAS</span>
                                <span className="absolute left-1 top-1 text-black/80 -z-10 select-none blur-[1px]">RITMO KATAS</span>
                            </span>
                        ) : "Ritmo Katas"}
                    </PrimalTitle>

                    <div className="relative group cursor-default">
                        <div className="absolute -inset-2 bg-kuma-gold/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-zinc-950/80 border-2 border-kuma-gold/40 px-8 py-4 rounded-3xl shadow-[inset_0_0_30px_rgba(234,179,8,0.2)]">
                            <span className="font-mono text-6xl md:text-8xl font-black tracking-widest text-kuma-gold drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">
                                {formatTime(timer)}
                            </span>
                        </div>
                    </div>
                </div>

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
                />

                <RitmoRadar
                    ref={radarRef}
                    theme={theme}
                    timerRef={timerRef}
                    puntosRef={puntosRef}
                    status={status}
                />
            </div>

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
