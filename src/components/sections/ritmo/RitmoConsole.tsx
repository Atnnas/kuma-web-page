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
    Star
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface RitmoConsoleProps {
    isAdmin: boolean;
    status: string;
    theme: string;
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
    onSetTheme: (theme: "dragon-ball" | "tactical-hud") => void;
    onToggleThemeDropdown: () => void;
    onSetVolume: (vol: number) => void;
    onShowSaveModal: () => void;
    onPointerDownVolume: (e: React.PointerEvent) => void;
    onPointerMoveVolume: (e: React.PointerEvent) => void;
    onPointerUpVolume: (e: React.PointerEvent) => void;
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
    onPointerUpVolume
}: RitmoConsoleProps) => {
    return (
        <div className={cn(
            "grid grid-cols-1 gap-6 p-6 bg-zinc-900/50 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl",
            isAdmin ? 'md:grid-cols-4' : 'md:grid-cols-3'
        )}>
            {/* Bloque Grabación */}
            {isAdmin && (
                <div className="flex flex-col gap-4 p-4 bg-black/40 rounded-[2rem] border border-white/5 relative overflow-hidden">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-left">Grabación</span>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <button
                            className={cn("kuma-btn-3d group", status === "grabando" && "active")}
                            onClick={onToggleRecording}
                        >
                            <div className="btn-inner bg-zinc-800 flex flex-col items-center justify-center gap-1 px-1">
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2",
                                    status === "grabando" ? "bg-red-500 animate-pulse border-white/50" : "bg-red-800 border-red-900"
                                )} />
                                <span className={cn("text-[8px] font-black uppercase tracking-widest", status === "grabando" ? "text-red-400" : "text-zinc-500")}>
                                    {status === "grabando" ? "S. Activa" : "Grabar"}
                                </span>
                            </div>
                        </button>
                        <button className="kuma-btn-3d group" onClick={onStopAll}>
                            <div className="btn-inner bg-zinc-800 flex flex-col items-center justify-center gap-1">
                                <div className="w-5 h-5 bg-zinc-600 border-2 border-zinc-700 group-hover:bg-zinc-400 transition-colors rounded-sm" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Parar</span>
                            </div>
                        </button>
                        <button className="kuma-btn-3d group" onClick={onClearSession}>
                            <div className="btn-inner bg-zinc-800 flex flex-col items-center justify-center gap-1">
                                <Broom weight="fill" className="text-zinc-500 group-hover:text-amber-400 w-5 h-5 transition-colors" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Limpiar</span>
                            </div>
                        </button>
                        {canSave && (
                            <button
                                className={cn("kuma-btn-3d group !w-[70px]", hasRecordedData ? "active" : "opacity-30 cursor-not-allowed")}
                                onClick={() => hasRecordedData && onShowSaveModal()}
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
                    <button className="kuma-btn-3d group !w-[96px]" onClick={onOpenLibrary}>
                        <div className="btn-inner bg-zinc-800 flex flex-col items-center justify-center gap-1">
                            <Books weight="fill" className="w-5 h-5 text-zinc-500 group-hover:text-kuma-gold transition-colors" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Biblioteca</span>
                        </div>
                    </button>
                    <button className="kuma-btn-3d group" onClick={onTogglePlayback}>
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
                        onClick={onToggleThemeDropdown}
                        className={cn(
                            "w-full flex items-center justify-between bg-zinc-800 border border-white/5 rounded-2xl py-3 px-6 text-white outline-none focus:border-kuma-gold/30 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:bg-zinc-700",
                            isThemeDropdownOpen && 'border-kuma-gold/50'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Sparkle weight="fill" className={cn("w-4 h-4", theme === "dragon-ball" ? "text-emerald-500" : "text-kuma-gold")} />
                            <span>{theme === "dragon-ball" ? "Dragon Ball" : "Kuma HUD"}</span>
                        </div>
                        <CaretDown weight="bold" className={cn("w-4 h-4 text-zinc-500 transition-transform duration-300", isThemeDropdownOpen && 'rotate-180')} />
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
                                        onClick={() => onSetTheme("dragon-ball")}
                                        className={cn("w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors", theme === "dragon-ball" ? "bg-red-500/20 text-red-400" : "hover:bg-white/5 text-zinc-400 hover:text-white")}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest">Dragon Ball</span>
                                        {theme === "dragon-ball" && <Check weight="bold" className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => onSetTheme("tactical-hud")}
                                        className={cn("w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors", theme === "tactical-hud" ? "bg-kuma-gold/20 text-kuma-gold" : "hover:bg-white/5 text-zinc-400 hover:text-white")}
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

            {/* Bloque Ajustes & Volumen */}
            <div className="flex flex-col gap-4 p-4 bg-black/40 rounded-[2rem] border border-white/5 h-full relative overflow-hidden group/settings transition-all duration-500 hover:border-kuma-gold/20">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-kuma-gold/5 blur-3xl rounded-full pointer-events-none group-hover/settings:bg-kuma-gold/10 transition-colors" />

                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Master Tuning</span>
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={cn("w-1 h-1 rounded-full", volume > (i * 0.3) ? "bg-kuma-gold/50" : "bg-zinc-800")} />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between h-full gap-4 px-2 py-2">
                    <div className="relative flex items-center gap-6 h-48 w-full group/eq">
                        <div className="flex flex-col items-center gap-2 min-w-[50px]">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center shadow-inner transition-colors duration-500",
                                volume > 0.7 ? "border-red-500/30" : volume > 0.3 ? "border-kuma-gold/30" : "border-emerald-500/30"
                            )}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={volume === 0 ? 'none' : volume < 0.5 ? 'low' : 'high'}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        className={cn(
                                            volume > 0.7 ? "text-red-500" : volume > 0.3 ? "text-kuma-gold" : "text-emerald-500"
                                        )}
                                    >
                                        {volume === 0 ? <SpeakerNone weight="bold" size={24} /> :
                                            volume < 0.5 ? <SpeakerLow weight="bold" size={24} /> :
                                                <SpeakerHigh weight="bold" size={24} />}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <div className="bg-black/50 border border-white/5 px-2 py-1 rounded-lg">
                                <span className="font-mono text-[10px] font-black text-white/80 tracking-tighter">
                                    {Math.round(volume * 100)}%
                                </span>
                            </div>
                        </div>

                        <div
                            onPointerDown={onPointerDownVolume}
                            onPointerMove={onPointerMoveVolume}
                            onPointerUp={onPointerUpVolume}
                            className="relative flex-1 h-full bg-zinc-950/50 border border-white/5 rounded-2xl p-3 flex flex-col-reverse gap-1.5 cursor-ns-resize group/bar overflow-visible shadow-inner select-none touch-none"
                        >
                            <motion.div
                                animate={{
                                    bottom: `${volume * 100}%`,
                                    scale: isDragging ? 1.4 : 1,
                                    boxShadow: isDragging
                                        ? (theme === "dragon-ball"
                                            ? "0 0 30px rgba(251,146,60,0.8)"
                                            : `0 0 30px ${volume > 0.7 ? "rgba(239,68,68,0.8)" : volume > 0.3 ? "rgba(234,179,8,0.8)" : "rgba(16,185,129,0.8)"}`)
                                        : "0 4px 15px rgba(0,0,0,0.7)"
                                }}
                                transition={{
                                    bottom: { type: "tween", duration: 0.05, ease: "linear" },
                                    scale: { type: "spring", stiffness: 300, damping: 20 },
                                    boxShadow: { duration: 0.2 }
                                }}
                                className={cn(
                                    "absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full z-30 flex items-center justify-center transition-all duration-300 pointer-events-none shadow-2xl overflow-hidden",
                                    theme === "dragon-ball"
                                        ? "bg-gradient-to-br from-amber-300 via-orange-500 to-red-600 border-2 border-orange-200/50"
                                        : cn("border-2 border-white/30", volume > 0.7 ? "bg-red-500" : volume > 0.3 ? "bg-kuma-gold" : "bg-emerald-500")
                                )}
                                style={{ marginBottom: '-20px' }}
                            >
                                {theme === "dragon-ball" ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <Star weight="fill" className="text-red-700 w-4 h-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                                        </div>
                                        <div className="absolute top-1 left-2 w-3 h-2 rounded-[100%] bg-white/40 blur-[1px] rotate-[-45deg]" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_white]" />
                                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.15),transparent)] group-hover/bar:animate-spin-slow opacity-50" />
                                    </>
                                )}
                            </motion.div>

                            {[...Array(14)].map((_, i) => {
                                const threshold = i / 13;
                                const isActive = volume > threshold;
                                const isLow = i < 5;
                                const isMid = i >= 5 && i < 10;
                                const isHigh = i >= 10;

                                return (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            opacity: isActive ? 1 : 0.1,
                                            scaleX: isActive ? 1 : 0.9,
                                            backgroundColor: isActive
                                                ? (isHigh ? "#ef4444" : isMid ? "#eab308" : "#10b981")
                                                : "rgba(255,255,255,0.1)"
                                        }}
                                        className={cn("h-2 w-full rounded-sm transition-all duration-200", isActive && "shadow-[0_0_10px_currentColor]")}
                                        style={{ color: isHigh ? "#ef4444" : isMid ? "#eab308" : "#10b981" }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
