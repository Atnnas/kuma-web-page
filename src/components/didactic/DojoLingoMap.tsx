"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DIDACTIC_UNITS } from "@/data/didacticaData";
import { PathType, Level, UserDidacticProgress, BeltRankId, MascotMood } from "@/types/didactica";
import { KumaMascot } from "./KumaMascot";
import { TheorySheetModal } from "./TheorySheetModal";
import { BeltCascadeSection } from "./BeltCascadeSection";
import { InstallAppButton } from "./InstallAppButton";
import { getBeltRank, BELT_RANKS } from "@/data/beltRanks";
import { JapaneseFlagIcon, JapaneseFlagBadge, WkfShieldIcon, WkfOfficialBadge } from "./PathIcons";
import {
    Star,
    Lock,
    Play,
    Scroll,
    CheckCircle,
    Fire,
    Lightning,
    Heart,
    Trophy,
    BookOpen,
    Compass,
    X,
    ArrowCounterClockwise,
    Sparkle,
} from "@phosphor-icons/react";
import { EtherealMartialOrb } from "./EtherealMartialOrb";

interface DojoLingoMapProps {
    activePath: PathType;
    onSelectPath: (path: PathType) => void;
    progress: UserDidacticProgress;
    onStartLevel: (level: Level) => void;
    onOpenEncyclopedia: () => void;
    onResetProgress?: () => void;
    kumaMood?: MascotMood;
    daysAbsent?: number;
    onOpenAbsenceModal?: () => void;
}

export function DojoLingoMap({
    activePath,
    onSelectPath,
    progress,
    onStartLevel,
    onOpenEncyclopedia,
    onResetProgress,
    kumaMood = "idle",
    daysAbsent = 0,
    onOpenAbsenceModal,
}: DojoLingoMapProps) {
    const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
    const [theoryLevel, setTheoryLevel] = useState<Level | null>(null);
    const [wkfColor, setWkfColor] = useState<"red" | "blue">(() => (Math.random() < 0.5 ? "red" : "blue"));
    const [activeBeltId, setActiveBeltId] = useState<BeltRankId>(progress.activeBeltId || "kyu-10");

    // Active belt metadata for Sensei Kuma companion
    const activeBelt = getBeltRank(activeBeltId);

    // Traditional units (all 20 belts in continuous downward cascade from 10° Kyu to 10° Dan)
    const tradUnits = DIDACTIC_UNITS.filter((u) => u.path === "tradicional");
    const allTradLevels = tradUnits.flatMap((u) => u.levels);

    // WKF sport units
    const wkfUnits = DIDACTIC_UNITS.filter((u) => u.path === "wkf");
    const allWkfLevels = wkfUnits.flatMap((u) => u.levels);

    // Active path level list
    const allPathLevels = activePath === "tradicional" ? allTradLevels : allWkfLevels;

    const isWkfLevelUnlocked = (levelIndex: number, levelId: string) => {
        if (levelIndex === 0) return true;
        const prevLevel = allWkfLevels[levelIndex - 1];
        return progress.completedLevelIds.includes(prevLevel.id) || progress.completedLevelIds.includes(levelId);
    };

    const isLevelCompleted = (levelId: string) => {
        return progress.completedLevelIds.includes(levelId);
    };

    const completedInPath = allPathLevels.filter((l) => progress.completedLevelIds.includes(l.id)).length;
    const pathPercent = allPathLevels.length > 0 ? Math.round((completedInPath / allPathLevels.length) * 100) : 0;

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-start relative">
            {/* THEORY SHEET MODAL */}
            {theoryLevel && (
                <TheorySheetModal
                    isOpen={true}
                    onClose={() => setTheoryLevel(null)}
                    theory={theoryLevel.theory}
                    levelTitle={theoryLevel.title}
                    onStartPractice={() => {
                        const lvl = theoryLevel;
                        setTheoryLevel(null);
                        setSelectedLevel(null);
                        onStartLevel(lvl);
                    }}
                />
            )}

            {/* LEVEL PREVIEW MODAL (RENDERED AT ROOT LEVEL WITH Z-70 BACKDROP) */}
            <AnimatePresence>
                {selectedLevel && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 pt-12 md:pt-16 pb-12 md:pb-16 bg-black/85 backdrop-blur-2xl">
                        {/* Backdrop Click Dismiss */}
                        <div
                            className="absolute inset-0"
                            onClick={() => setSelectedLevel(null)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 450, damping: 28 }}
                            className="relative w-full max-w-md p-6 md:p-8 rounded-3xl bg-slate-950 border-2 border-cyan-400/70 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(6,182,212,0.25)] z-10 text-left overflow-hidden"
                        >
                            {/* Top Cyan Neon Foil Accent Line */}
                            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

                            {/* Prominent Close Button */}
                            <button
                                onClick={() => setSelectedLevel(null)}
                                className="absolute top-5 right-5 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer group"
                                title="Cerrar ventana"
                            >
                                <X className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" weight="bold" />
                                <span>Cerrar</span>
                            </button>

                            {/* Header Tags */}
                            <div className="flex items-center gap-2 mb-3 pr-8">
                                <span className="text-[11px] font-black uppercase tracking-widest text-cyan-300 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                    Nivel {selectedLevel.number} • {selectedLevel.tag}
                                </span>
                                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                                    <Lightning className="w-3.5 h-3.5 text-amber-400" weight="fill" />
                                    +{selectedLevel.xpReward} XP
                                </span>
                            </div>

                            {/* Level Title and Subtitle */}
                            <h3 className="text-2xl md:text-3xl font-serif font-black text-white mb-2 leading-tight">
                                {selectedLevel.title}
                            </h3>
                            <p className="text-sm text-slate-300 mb-8 leading-relaxed">
                                {selectedLevel.subtitle}
                            </p>

                            {/* Big 3D Tactile Action Buttons */}
                            <div className="space-y-3.5">
                                <button
                                    onClick={() => {
                                        const lvl = selectedLevel;
                                        setSelectedLevel(null);
                                        onStartLevel(lvl);
                                    }}
                                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-2xl shadow-cyan-500/35 border-b-4 border-emerald-600 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2.5 transition-all select-none cursor-pointer"
                                >
                                    <Play className="w-5 h-5" weight="fill" />
                                    <span>
                                        {isLevelCompleted(selectedLevel.id) ? "Repasar Lección" : "¡Entrenar Nivel!"}
                                    </span>
                                </button>

                                <button
                                    onClick={() => {
                                        const lvl = selectedLevel;
                                        setSelectedLevel(null);
                                        setTheoryLevel(lvl);
                                    }}
                                    className="w-full py-3 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all select-none cursor-pointer"
                                >
                                    <Scroll className="w-4 h-4 text-amber-400" weight="duotone" />
                                    <span>Ver Pergamino Teórico Completo</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- MAIN ROAD (BELT CASCADE OR WKF ROAD) --- */}
            <div className="flex-1 w-full flex flex-col items-center">
                {/* FLOATING ARCADE NEON HUD STATS BAR */}
                <div className="w-full max-w-xl bg-slate-950/90 border border-slate-700/80 rounded-2xl p-2.5 mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-xl flex items-center justify-between">
                    {/* HEARTS (FUCSIA PUNCH) */}
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-950/60 border-2 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" weight="fill" />
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-black text-rose-400 leading-none">Vidas</span>
                            <span className="text-sm font-black text-white leading-tight font-serif">{progress.hearts}/5</span>
                        </div>
                    </div>

                    {/* STREAK (FUEGO MANDARINA) */}
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/60 border-2 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                        <Fire className="w-5 h-5 text-amber-400 fill-amber-400" weight="fill" />
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-black text-amber-300 leading-none">Racha</span>
                            <span className="text-sm font-black text-white leading-tight font-serif">{progress.streak} Días</span>
                        </div>
                    </div>

                    {/* KUMA XP (AMARILLO RAYO) */}
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-yellow-950/60 border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                        <Lightning className="w-5 h-5 text-yellow-400 fill-yellow-400" weight="fill" />
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-black text-yellow-300 leading-none">Kuma XP</span>
                            <span className="text-sm font-black text-white leading-tight font-serif">{progress.xp}</span>
                        </div>
                    </div>

                    {/* REINICIAR PROGRESO */}
                    {onResetProgress && (
                        <button
                            onClick={() => {
                                if (window.confirm("¿Deseas reiniciar tu progreso marcial a cero para comenzar de nuevo?")) {
                                    onResetProgress();
                                }
                            }}
                            title="Reiniciar progreso a cero"
                            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 text-xs font-bold transition-all cursor-pointer group"
                        >
                            <ArrowCounterClockwise className="w-4 h-4 transition-transform group-hover:-rotate-90 duration-300" />
                            <span className="hidden sm:inline text-[10px] uppercase tracking-wider">Reiniciar</span>
                        </button>
                    )}
                </div>

                {/* PATH SELECTION PILL (TRADITIONAL vs WKF) */}
                <div className="w-full max-w-lg bg-slate-950/90 border border-slate-700/80 p-1.5 rounded-2xl flex items-center justify-between mb-8 shadow-2xl backdrop-blur-xl gap-2">
                    <button
                        onClick={() => {
                            onSelectPath("tradicional");
                            setSelectedLevel(null);
                        }}
                        className={`relative flex-1 py-3 px-3.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
                            activePath === "tradicional"
                                ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/30 scale-[1.02]"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <JapaneseFlagIcon className={`w-6 h-4 shrink-0 transition-transform duration-300 ${activePath === "tradicional" ? "scale-110 drop-shadow-md" : "opacity-80"}`} />
                        <span>Marcial Tradicional</span>
                    </button>

                    <button
                        onClick={() => {
                            onSelectPath("wkf");
                            setSelectedLevel(null);
                            setWkfColor(Math.random() < 0.5 ? "red" : "blue");
                        }}
                        className={`relative flex-1 py-3 px-3.5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                            activePath === "wkf"
                                ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/30 scale-[1.02]"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <WkfShieldIcon className={`w-6 h-6 shrink-0 transition-transform duration-300 ${activePath === "wkf" ? "scale-110 drop-shadow-md" : "opacity-80"}`} />
                        <span>Deportivo WKF</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                            activePath === "wkf"
                                ? "bg-black/25 text-slate-950 border border-black/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}>
                            Próximamente
                        </span>
                    </button>
                </div>

                {/* OVERALL PATH PROGRESS HEADER */}
                <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-700/80 rounded-3xl p-6 md:p-7 mb-8 shadow-2xl relative overflow-hidden">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            {activePath === "tradicional" ? (
                                <JapaneseFlagBadge className="w-12 h-12 shrink-0 mt-0.5" />
                            ) : (
                                <WkfOfficialBadge className="w-12 h-12 shrink-0 mt-0.5" />
                            )}
                            <div>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.25em] text-cyan-300 uppercase mb-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                                    <Compass className="w-3 h-3 text-cyan-400" weight="fill" />
                                    {activePath === "tradicional"
                                        ? "20 Cinturones Tradicionales: 10 Kyu a 10 Dan"
                                        : "World Karate Federation • Módulo Próximamente"}
                                </span>
                                <h2 className="text-xl md:text-2xl font-serif font-black text-white leading-tight">
                                    {activePath === "tradicional"
                                        ? "El Sendero del Guerrero: De Blanco a 10° Dan"
                                        : "Camino Deportivo WKF — Próximamente"}
                                </h2>
                                <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                                    {activePath === "tradicional"
                                        ? "Recorre la cascada hacia abajo. Cada cinturón está encapsulado con sus grados y lecciones teóricas y prácticas a resolver."
                                        : "Módulo interactivo de arbitraje, señales del réferi y kumite deportivo WKF actualmente en fase de preparación."}
                                </p>
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            {activePath === "tradicional" ? (
                                <>
                                    <span className="text-2xl md:text-3xl font-black text-cyan-400 font-serif block drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                                        {pathPercent}%
                                    </span>
                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest block">
                                        Completado
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                                        Próximamente
                                    </span>
                                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest block mt-1">
                                        En Forja
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${activePath === "tradicional" ? pathPercent : 0}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* ================================================================= */}
                {/* CAMINO MARCIAL TRADICIONAL: CASCADA HACIA ABAJO (10 KYU A 10 DAN) */}
                {/* ================================================================= */}
                {activePath === "tradicional" && (
                    <div className="w-full flex flex-col items-center">
                        {/* CONTINUOUS DOWNWARD CASCADE OF ALL 20 BELT CONTAINERS */}
                        <div className="w-full flex flex-col items-center">
                            {tradUnits.map((unit, idx) => {
                                const beltRank = getBeltRank(unit.beltId || "");
                                if (!beltRank) return null;

                                // The belt is unlocked ONLY if it's 10° Kyu,
                                // or all classes of the prior belt were completed/won,
                                // or the user has already completed a level in this belt!
                                const isFirstBelt = idx === 0;
                                const prevUnit = idx > 0 ? tradUnits[idx - 1] : null;
                                const prevBelt = prevUnit ? getBeltRank(prevUnit.beltId || "") : null;
                                const prevBeltWon = prevUnit
                                    ? prevUnit.levels.every((l) => progress.completedLevelIds.includes(l.id))
                                    : true;
                                const currentBeltStarted = unit.levels.some((l) => progress.completedLevelIds.includes(l.id));

                                const isBeltUnlocked = isFirstBelt || prevBeltWon || currentBeltStarted;

                                const nextUnit = idx < tradUnits.length - 1 ? tradUnits[idx + 1] : null;
                                const nextBelt = nextUnit ? getBeltRank(nextUnit.beltId || "") : null;

                                return (
                                    <BeltCascadeSection
                                        key={unit.id}
                                        unit={unit}
                                        belt={beltRank}
                                        prevBelt={prevBelt}
                                        nextBelt={nextBelt}
                                        isBeltUnlocked={isBeltUnlocked}
                                        allPathLevels={allTradLevels}
                                        progress={progress}
                                        onSelectLevel={(level) => setSelectedLevel(level)}
                                        isLast={idx === tradUnits.length - 1}
                                        onFocusBelt={(bId) => setActiveBeltId(bId)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ================================================================= */}
                {/* CAMINO DEPORTIVO WKF (PRÓXIMAMENTE)                               */}
                {/* ================================================================= */}
                {activePath === "wkf" && (
                    <div className="w-full max-w-2xl bg-gradient-to-b from-zinc-900/95 via-zinc-950 to-black border-2 border-kuma-gold/40 rounded-3xl p-7 md:p-10 shadow-[0_0_50px_rgba(234,179,8,0.15)] relative overflow-hidden flex flex-col items-center text-center my-4">
                        {/* Glow ambient background with WKF Ao & Aka colors */}
                        <div className="absolute -top-20 -left-20 w-56 h-56 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-kuma-gold/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Floating WKF Badge */}
                        <div className="relative z-10 mb-4">
                            <div className="relative inline-flex p-4 rounded-3xl bg-zinc-900/90 border-2 border-kuma-gold/50 shadow-2xl shadow-kuma-gold/20">
                                <WkfOfficialBadge className="w-16 h-16 md:w-20 md:h-20" />
                                <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-blue-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    WKF Oficial
                                </div>
                            </div>
                        </div>

                        {/* Badges and Titles */}
                        <div className="relative z-10 space-y-2 max-w-lg">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300">
                                <Sparkle className="w-3.5 h-3.5 text-amber-400" weight="fill" />
                                <span>Módulo en Construcción</span>
                            </span>

                            <h3 className="text-3xl md:text-4xl font-serif font-black text-white tracking-wide">
                                Próximamente
                            </h3>
                            
                            <p className="text-xs md:text-sm font-semibold text-amber-200">
                                Camino Deportivo WKF • Tatami, Arbitraje & Kumite Olímpico
                            </p>

                            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed pt-1">
                                Estamos forjando el currículum interactivo oficial de la <strong>Federación Mundial de Karate (WKF)</strong>: criterios de puntuación (<em>Yuko, Waza-ari, Ippon</em>), señales arbitrales de tatami, gestión de banderas y sanciones oficiales.
                            </p>
                        </div>

                        {/* Feature Preview Grid */}
                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full my-6 text-left">
                            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-red-500/40 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                    <span className="text-xs font-serif font-black text-white uppercase tracking-wider">
                                        Puntuación Kumite
                                    </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed">
                                    Yuko (1 pt), Waza-ari (2 pts) e Ippon (3 pts) evaluando los 6 criterios WKF.
                                </p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-blue-500/40 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                    <span className="text-xs font-serif font-black text-white uppercase tracking-wider">
                                        Señales del Réferi
                                    </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed">
                                    Aprende la gestualidad arbitral oficial, pausas, amonestaciones y decisiones.
                                </p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-amber-500/40 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                                    <span className="text-xs font-serif font-black text-white uppercase tracking-wider">
                                        Penalizaciones WKF
                                    </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed">
                                    Salidas del tatami (Jogai), contactos excesivos, amonestaciones y Hansoku.
                                </p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-emerald-500/40 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    <span className="text-xs font-serif font-black text-white uppercase tracking-wider">
                                        Simulador Interactivo
                                    </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed">
                                    Evalúa combates en vivo con pulsadores oficiales de arbitraje Ao (Azul) y Aka (Rojo).
                                </p>
                            </div>
                        </div>

                        {/* CTA Action Buttons */}
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                            <button
                                type="button"
                                onClick={() => onSelectPath("tradicional")}
                                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-kuma-gold text-zinc-950 font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-kuma-gold/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                            >
                                <JapaneseFlagIcon className="w-4 h-3" />
                                <span>Ir a Tradicional (Kyu a Dan)</span>
                            </button>

                            <button
                                type="button"
                                onClick={onOpenEncyclopedia}
                                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <BookOpen className="w-4 h-4 text-kuma-gold" />
                                <span>Ver Teoría WKF</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- RIGHT SIDEBAR: SENSEI COMPANION & QUICK ACCESS --- */}
            <div className="w-full lg:w-84 shrink-0 space-y-6 lg:sticky lg:top-24">
                {/* SENSEI KUMA 3D AVATAR COMPANION */}
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-black border-2 border-kuma-gold/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-kuma-gold/15 rounded-full blur-3xl pointer-events-none" />

                    <div
                        onClick={onOpenAbsenceModal}
                        className="cursor-pointer group/kuma transition-transform hover:scale-105"
                        title="Haz clic para consultar a Kuma Sensei"
                    >
                        <KumaMascot
                            mood={kumaMood}
                            size="lg"
                            showBubble={true}
                            path={activePath}
                            wkfColor={wkfColor}
                            beltRank={activePath === "tradicional" ? activeBelt : undefined}
                        />
                    </div>

                    <div className="mt-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-kuma-gold block">
                            {activePath === "wkf"
                                ? `WKF Kumite • Competidor ${wkfColor === "blue" ? "Ao (Azul 🔵)" : "Aka (Rojo 🔴)"}`
                                : activeBelt
                                ? `${activeBelt.shortName} • ${activeBelt.japaneseName.includes("—") ? activeBelt.japaneseName.split("—")[1].trim() : activeBelt.theme}`
                                : "Tutor & Maestro Kuma"}
                        </span>
                        <h3 className="text-xl font-serif font-black text-white mt-0.5">
                            Kuma Sensei
                        </h3>
                        {onOpenAbsenceModal && (
                            <button
                                type="button"
                                onClick={onOpenAbsenceModal}
                                className={`mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer hover:scale-105 shadow-sm ${
                                    daysAbsent >= 14
                                        ? "border-blue-500/50 bg-blue-950/70 text-blue-300 animate-pulse"
                                        : daysAbsent >= 7
                                        ? "border-red-500/50 bg-red-950/70 text-red-300"
                                        : daysAbsent >= 4
                                        ? "border-amber-500/50 bg-amber-950/70 text-amber-300"
                                        : "border-emerald-500/40 bg-emerald-950/60 text-emerald-300"
                                }`}
                            >
                                <span>
                                    {daysAbsent >= 14
                                        ? "😭 Tatami Frío (14d+)"
                                        : daysAbsent >= 7
                                        ? `🥺 Ausente (${daysAbsent}d) • -1★`
                                        : daysAbsent >= 4
                                        ? `🟠 Ausente (${daysAbsent}d) • Titilando`
                                        : daysAbsent >= 2
                                        ? `🟡 ${daysAbsent}d sin entrar`
                                        : "🟢 Constancia Activa"}
                                </span>
                            </button>
                        )}
                        <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                            {activePath === "wkf"
                                ? '"¡El tatami oficial WKF está en preparación! Muy pronto podrás entrenar arbitraje y táctica de competición. ¡Mientras tanto, continúa forjando tu espíritu en el Camino Tradicional!"'
                                : activeBelt
                                ? `"${activeBelt.motto}"`
                                : '"El verdadero combate empieza al dominar los fundamentos. ¡Avanza paso a paso en tu camino!"'}
                        </p>
                    </div>
                </div>

                {/* MOBILE / DESKTOP INSTALL APP CTA */}
                <InstallAppButton variant="card" />

                {/* QUICK ACCESS TO ENCYCLOPEDIA */}
                <div className="p-6 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-kuma-gold/10 border border-kuma-gold/30 flex items-center justify-center text-kuma-gold">
                            <BookOpen className="w-5 h-5" weight="duotone" />
                        </div>
                        <div>
                            <h4 className="font-serif font-black text-white text-sm">Biblioteca Didáctica</h4>
                            <p className="text-[11px] text-zinc-400">Artículos completos & simuladores</p>
                        </div>
                    </div>

                    <button
                        onClick={onOpenEncyclopedia}
                        className="w-full py-3 px-4 rounded-xl border border-kuma-gold/40 hover:border-kuma-gold bg-kuma-gold/10 hover:bg-kuma-gold/20 text-kuma-gold text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                        <span>Consultar Biblioteca</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export { DojoLingoMap as KumaSenseiAcademyMap };
export type { DojoLingoMapProps as KumaSenseiAcademyMapProps };
