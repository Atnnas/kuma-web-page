import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Broom,
    Books,
    CaretDown,
    Check,
    FloppyDiskBack,
    SpeakerHigh,
    SpeakerLow,
    SpeakerNone,
    Sparkle,
    Star,
    Stop,
    Play,
    Pause,
    Radioactive
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { RitmoTheme } from "./RitmoRadar";

interface RitmoConsoleProps {
    isAdmin: boolean;
    status: string;
    theme: RitmoTheme;
    volume: number;
    hasRecordedData: boolean;
    canSave: boolean;
    isThemeDropdownOpen: boolean;
    isDragging: boolean;
    onToggleRecording: () => void;
    onStopAll: () => void;
    onClearSession: () => void;
    onOpenLibrary: () => void;
    onTogglePlayback: () => void;
    onSetTheme: (theme: RitmoTheme) => void;
    onToggleThemeDropdown: () => void;
    onSetVolume: (vol: number) => void;
    onShowSaveModal: () => void;
    onPointerDownVolume: (e: React.PointerEvent) => void;
    onPointerMoveVolume: (e: React.PointerEvent) => void;
    onPointerUpVolume: (e: React.PointerEvent) => void;
    onRecordPulse?: () => void;
    onStartFluid?: () => void;
    onStopFluid?: () => void;
}

export const RitmoConsole = ({
    isAdmin,
    status,
    theme,
    volume,
    hasRecordedData,
    canSave,
    isThemeDropdownOpen,
    isDragging,
    onToggleRecording,
    onStopAll,
    onClearSession,
    onOpenLibrary,
    onTogglePlayback,
    onSetTheme,
    onToggleThemeDropdown,
    onSetVolume,
    onShowSaveModal,
    onPointerDownVolume,
    onPointerMoveVolume,
    onPointerUpVolume,
    onRecordPulse,
    onStartFluid,
    onStopFluid
}: RitmoConsoleProps) => {
    const themesList: { id: RitmoTheme; name: string; desc: string; color: string; badge: string }[] = [
        {
            id: "tactical-hud",
            name: "Kuma Cyber HUD",
            desc: "Dojo Carbon & Neón Dorado",
            color: "text-kuma-gold",
            badge: "bg-amber-500/20 text-kuma-gold border-kuma-gold/40"
        },
        {
            id: "dragon-ball",
            name: "Dragon Ball Z",
            desc: "Ki Radar Esmeralda & Orbes",
            color: "text-emerald-400",
            badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
        },
        {
            id: "shotokan-zen",
            name: "Shotokan Zen",
            desc: "Torii Carmesí & Minimalismo",
            color: "text-red-400",
            badge: "bg-red-500/20 text-red-400 border-red-500/40"
        },
        {
            id: "cyberpunk-neon",
            name: "Synthwave Neon",
            desc: "Cian Eléctrico & Púrpura",
            color: "text-cyan-400",
            badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
        }
    ];

    const currentThemeObj = themesList.find(t => t.id === theme) || themesList[0];

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* PADS TÁCTILES ERGONÓMICOS PARA MÓVIL Y TABLET (Visibles siempre o en grabación) */}
            {status === "grabando" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="p-3.5 sm:p-5 rounded-3xl bg-zinc-950/90 border-2 border-amber-500/40 shadow-2xl flex flex-col gap-2.5 backdrop-blur-xl"
                >
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-kuma-gold">
                                Pads Táctiles de Grabación
                            </span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            Toca en pantalla o usa teclado
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 h-24 sm:h-28">
                        {/* Pad Kime (Pulso) - Explosive Amber & Fire */}
                        <button
                            type="button"
                            onPointerDown={(e) => {
                                e.preventDefault();
                                onRecordPulse?.();
                            }}
                            className="group relative rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 border-2 border-yellow-300/90 text-white font-black uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_25px_rgba(249,115,22,0.45)] hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] flex flex-col items-center justify-center gap-1 cursor-pointer select-none touch-none"
                        >
                            <div className="w-3.5 h-3.5 rounded-full bg-yellow-200 shadow-[0_0_12px_#fde047] group-hover:scale-125 transition-transform" />
                            <span className="text-xs sm:text-sm md:text-base font-black font-serif text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                                Kime (Impacto)
                            </span>
                            <span className="text-[8px] sm:text-[9px] text-amber-100 font-bold uppercase tracking-wider">
                                Toque Seco [↑ Teclado]
                            </span>
                        </button>

                        {/* Pad Fluido (Continuo) - Luminous Emerald & Teal */}
                        <button
                            type="button"
                            onPointerDown={(e) => {
                                e.preventDefault();
                                onStartFluid?.();
                            }}
                            onPointerUp={(e) => {
                                e.preventDefault();
                                onStopFluid?.();
                            }}
                            onPointerLeave={() => {
                                onStopFluid?.();
                            }}
                            className="group relative rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 border-2 border-emerald-300/90 text-white font-black uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.55)] flex flex-col items-center justify-center gap-1 cursor-pointer select-none touch-none"
                        >
                            <div className="w-7 h-2 rounded-full bg-emerald-200 shadow-[0_0_12px_#a7f3d0] group-hover:scale-110 transition-transform" />
                            <span className="text-xs sm:text-sm md:text-base font-black font-serif text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                                Fluido (Estela)
                            </span>
                            <span className="text-[8px] sm:text-[9px] text-emerald-100 font-bold uppercase tracking-wider">
                                Mantener [Espacio]
                            </span>
                        </button>
                    </div>
                </motion.div>
            )}

            {/* CONSOLA DE CONTROL PRINCIPAL */}
            <div className={cn(
                "grid grid-cols-1 gap-4 sm:gap-6 p-4 sm:p-6 bg-zinc-900/60 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl backdrop-blur-2xl",
                isAdmin ? 'md:grid-cols-4' : 'md:grid-cols-3'
            )}>
                {/* Bloque Grabación */}
                {isAdmin && (
                    <div className="flex flex-col gap-3 p-4 bg-black/50 rounded-3xl border border-white/5 relative overflow-hidden">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-left">
                            Grabación Master
                        </span>
                        <div className="flex gap-2.5 sm:gap-3 justify-center flex-wrap items-center">
                            {/* Botón Grabar / Detener */}
                            <button
                                type="button"
                                onClick={onToggleRecording}
                                className={cn(
                                    "px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-1 min-w-[70px] cursor-pointer",
                                    status === "grabando"
                                        ? "bg-red-600/30 border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                        : "bg-zinc-800/80 hover:bg-zinc-700/80 border-white/10 text-zinc-300 hover:text-white"
                                )}
                            >
                                <div className={cn(
                                    "w-3.5 h-3.5 rounded-full",
                                    status === "grabando" ? "bg-red-500 animate-pulse shadow-[0_0_10px_red]" : "bg-red-600"
                                )} />
                                <span className="text-[9px] font-black uppercase tracking-wider">
                                    {status === "grabando" ? "Grabando" : "Grabar"}
                                </span>
                            </button>

                            {/* Botón Parar */}
                            <button
                                type="button"
                                onClick={onStopAll}
                                className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-zinc-300 hover:text-white transition-all active:scale-95 flex flex-col items-center justify-center gap-1 min-w-[65px] cursor-pointer"
                                title="Detener todo"
                            >
                                <Stop weight="fill" className="w-4 h-4 text-zinc-400" />
                                <span className="text-[9px] font-black uppercase tracking-wider">Parar</span>
                            </button>

                            {/* Botón Limpiar */}
                            <button
                                type="button"
                                onClick={onClearSession}
                                className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-zinc-300 hover:text-amber-400 transition-all active:scale-95 flex flex-col items-center justify-center gap-1 min-w-[65px] cursor-pointer"
                                title="Limpiar sesión actual"
                            >
                                <Broom weight="fill" className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-wider">Limpiar</span>
                            </button>

                            {/* Botón Guardar */}
                            {canSave && (
                                <button
                                    type="button"
                                    onClick={() => hasRecordedData && onShowSaveModal()}
                                    className={cn(
                                        "px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border transition-all active:scale-95 flex flex-col items-center justify-center gap-1 min-w-[70px] cursor-pointer",
                                        hasRecordedData
                                            ? "bg-amber-500/25 border-kuma-gold text-kuma-gold shadow-[0_0_20px_rgba(234,179,8,0.3)] animate-pulse"
                                            : "opacity-40 cursor-not-allowed bg-zinc-800 border-white/5 text-zinc-500"
                                    )}
                                    title="Guardar ritmo en la biblioteca"
                                >
                                    <FloppyDiskBack weight="fill" className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">Guardar</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Bloque Reproducción */}
                <div className="flex flex-col gap-3 p-4 bg-black/50 rounded-3xl border border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-left">
                        Reproducción de Katas
                    </span>
                    <div className="flex gap-3 justify-center items-center h-full">
                        {/* Biblioteca */}
                        <button
                            type="button"
                            onClick={onOpenLibrary}
                            className="flex-1 py-3 px-3.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-zinc-300 hover:text-kuma-gold transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer"
                        >
                            <Books weight="fill" className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-wider">Biblioteca</span>
                        </button>

                        {/* Play / Pausa */}
                        <button
                            type="button"
                            onClick={onTogglePlayback}
                            className={cn(
                                "flex-1 py-3 px-3.5 rounded-2xl border transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer",
                                status === "reproduciendo"
                                    ? "bg-amber-500/20 border-kuma-gold text-kuma-gold shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                                    : "bg-kuma-gold/90 hover:bg-kuma-gold border-kuma-gold text-black shadow-lg"
                            )}
                        >
                            {status === "reproduciendo" ? (
                                <>
                                    <Pause weight="fill" className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">Pausa</span>
                                </>
                            ) : (
                                <>
                                    <Play weight="fill" className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">Play</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Bloque Skins Marciales */}
                <div className="flex flex-col gap-3 p-4 bg-black/50 rounded-3xl border border-white/5 relative z-40">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Skins & Temas
                        </span>
                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border", currentThemeObj.badge)}>
                            {currentThemeObj.name}
                        </span>
                    </div>

                    <div className="relative w-full">
                        <button
                            type="button"
                            onClick={onToggleThemeDropdown}
                            className={cn(
                                "w-full flex items-center justify-between bg-zinc-800/90 border border-white/10 rounded-2xl py-3 px-4 text-white outline-none text-xs font-black uppercase tracking-wider transition-all shadow-md hover:bg-zinc-700/90 cursor-pointer",
                                isThemeDropdownOpen && 'border-kuma-gold'
                            )}
                        >
                            <div className="flex items-center gap-2.5 truncate">
                                <Sparkle weight="fill" className={cn("w-4 h-4 shrink-0", currentThemeObj.color)} />
                                <span className="truncate">{currentThemeObj.name}</span>
                            </div>
                            <CaretDown weight="bold" className={cn("w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0", isThemeDropdownOpen && 'rotate-180')} />
                        </button>

                        <AnimatePresence>
                            {isThemeDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-zinc-950/95 border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 backdrop-blur-2xl space-y-1"
                                >
                                    {themesList.map((t) => {
                                        const isSelected = theme === t.id;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => onSetTheme(t.id)}
                                                className={cn(
                                                    "w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer",
                                                    isSelected ? "bg-white/10 text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={cn("text-xs font-black uppercase tracking-wider", isSelected && t.color)}>
                                                        {t.name}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-500 font-medium">
                                                        {t.desc}
                                                    </span>
                                                </div>
                                                {isSelected && <Check weight="bold" className="w-4 h-4 text-kuma-gold shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bloque Master Tuning (Volumen & Fader) */}
                <div className="flex flex-col gap-3 p-4 bg-black/50 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Volumen de Sintetizador
                        </span>
                        <span className="font-mono text-xs font-black text-kuma-gold tabular-nums">
                            {Math.round(volume * 100)}%
                        </span>
                    </div>

                    <div className="flex items-center gap-3 h-full">
                        <button
                            type="button"
                            onClick={() => onSetVolume(volume > 0 ? 0 : 0.8)}
                            className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-zinc-300 hover:text-kuma-gold transition-all active:scale-95 cursor-pointer shrink-0"
                            title={volume === 0 ? "Activar audio" : "Silenciar audio"}
                        >
                            {volume === 0 ? <SpeakerNone size={20} weight="bold" /> :
                             volume < 0.5 ? <SpeakerLow size={20} weight="bold" /> :
                             <SpeakerHigh size={20} weight="bold" />}
                        </button>

                        <div className="flex-1 flex flex-col gap-1.5">
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.05}
                                value={volume}
                                onChange={(e) => onSetVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
