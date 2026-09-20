"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Unit, Level, BeltRank, UserDidacticProgress, BeltRankId } from "@/types/didactica";
import {
    Star,
    Lock,
    CheckCircle,
    Compass,
    CaretDown,
    CaretUp,
    Sparkle,
    Trophy,
    ShieldWarning,
} from "@phosphor-icons/react";
import { EtherealMartialOrb } from "./EtherealMartialOrb";

interface BeltCascadeSectionProps {
    unit: Unit;
    belt: BeltRank;
    prevBelt?: BeltRank | null;
    isBeltUnlocked: boolean;
    allPathLevels: Level[];
    progress: UserDidacticProgress;
    onSelectLevel: (level: Level) => void;
    isLast: boolean;
    onFocusBelt?: (beltId: BeltRankId) => void;
}

/**
 * Visual Karate Obi (Belt) representation with realistic stitching,
 * knots, and authentic stripes (e.g., Purple with White for 4° Kyu,
 * 3/2/1 tip stripes for Brown belts, and Black belt with gold stripes for Dans).
 */
export function BeltObiVisual({
    belt,
    isCompleted,
    isLocked = false,
    compact = false,
}: {
    belt: BeltRank;
    isCompleted: boolean;
    isLocked?: boolean;
    compact?: boolean;
}) {
    const isDan = belt.category === "dan";
    const isBrown = belt.id.startsWith("kyu-") && [1, 2, 3].includes(belt.levelNumber);
    const isPurpleWhite = belt.id === "kyu-4";

    return (
        <div
            className={`relative w-full ${compact ? "h-6" : "h-8 md:h-9"} rounded-lg overflow-hidden border transition-all ${
                isLocked ? "opacity-40 grayscale" : "shadow-inner"
            }`}
            style={{
                backgroundColor: belt.color,
                borderColor: isLocked ? "#27272A" : belt.strokeColor,
                boxShadow: isLocked
                    ? "none"
                    : isDan
                    ? "0 2px 10px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.15)"
                    : `0 2px 8px ${belt.color}40, inset 0 1px 1px rgba(255,255,255,0.25)`,
            }}
        >
            {/* Fabric texture stitching effect */}
            <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 5px)",
                }}
            />

            {/* Central knot shadow */}
            <div
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 md:w-12 rounded-sm pointer-events-none"
                style={{
                    backgroundColor: belt.strokeColor,
                    opacity: 0.35,
                }}
            />

            {/* 4° Kyu: Morado con Blanco (White central lengthwise stripe) */}
            {isPurpleWhite && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[5px] md:h-[6px] bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
            )}

            {/* Brown belt (3°, 2°, 1° Kyu): White stripes at both tips */}
            {isBrown && belt.hasStripe && belt.stripesCount && (
                <>
                    {Array.from({ length: belt.stripesCount }).map((_, i) => (
                        <React.Fragment key={i}>
                            {/* Left tip stripes */}
                            <div
                                className="absolute bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                                style={{
                                    left: `${6 + i * 6}px`,
                                    top: "2px",
                                    bottom: "2px",
                                    width: "3px",
                                    borderRadius: "1px",
                                }}
                            />
                            {/* Right tip stripes */}
                            <div
                                className="absolute bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                                style={{
                                    right: `${6 + i * 6}px`,
                                    top: "2px",
                                    bottom: "2px",
                                    width: "3px",
                                    borderRadius: "1px",
                                }}
                            />
                        </React.Fragment>
                    ))}
                </>
            )}

            {/* Dan grades (1° to 10° Dan): Golden embroidery stripes at right tip */}
            {isDan && belt.hasStripe && belt.stripesCount && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-[3px]">
                    {Array.from({ length: belt.stripesCount }).map((_, i) => (
                        <div
                            key={i}
                            className="w-[3px] h-5 md:h-6 rounded-full bg-gradient-to-b from-amber-300 via-kuma-gold to-amber-600 shadow-[0_0_5px_rgba(245,158,11,0.8)]"
                        />
                    ))}
                </div>
            )}

            {/* Completed golden check badge */}
            {isCompleted && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/60 shadow-lg">
                    <span className="text-emerald-400 text-[10px] font-black">✓ Superado</span>
                </div>
            )}
        </div>
    );
}

/**
 * Circular Rank Emblem ("Bolita del cinturón").
 * CRITICAL USER RULE:
 * For all Dan ranks, the bolita is ALWAYS PURE BLACK (never red and white!),
 * accented with golden kanji & gold border.
 * For 4° Kyu, it is Purple with White accent.
 */
export function BeltCircularEmblem({
    belt,
    isLocked = false,
}: {
    belt: BeltRank;
    isLocked?: boolean;
}) {
    const isDan = belt.category === "dan";
    const isPurpleWhite = belt.id === "kyu-4";

    if (isLocked) {
        return (
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 shadow-inner">
                <Lock className="w-5 h-5 text-zinc-500" weight="fill" />
            </div>
        );
    }

    if (isDan) {
        return (
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-black border-2 border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center shrink-0">
                <div className="absolute inset-0.5 rounded-full border border-amber-400/30" />
                <span className="text-xs md:text-sm font-black text-amber-400 font-serif leading-none">
                    {belt.levelNumber}°
                </span>
                <span className="text-[8px] font-black text-white/90 uppercase tracking-widest leading-none mt-0.5">
                    Dan
                </span>
                {belt.stripesCount && (
                    <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: Math.min(belt.stripesCount, 5) }).map((_, i) => (
                            <span key={i} className="w-1 h-1 rounded-full bg-amber-400" />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (isPurpleWhite) {
        return (
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-purple-700 border-2 border-white shadow-[0_0_12px_rgba(168,85,247,0.5)] flex flex-col items-center justify-center shrink-0 overflow-hidden">
                <div className="absolute inset-0 w-full h-[6px] top-1/2 -translate-y-1/2 bg-white rotate-45" />
                <span className="relative z-10 text-xs md:text-sm font-black text-white font-serif leading-none drop-shadow">
                    4°
                </span>
                <span className="relative z-10 text-[8px] font-black text-white uppercase tracking-widest leading-none mt-0.5 drop-shadow">
                    Kyu
                </span>
            </div>
        );
    }

    return (
        <div
            className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 shadow-lg flex flex-col items-center justify-center shrink-0"
            style={{
                backgroundColor: belt.color,
                borderColor: belt.strokeColor,
                boxShadow: `0 0 12px ${belt.color}50`,
            }}
        >
            <span
                className="text-xs md:text-sm font-black font-serif leading-none"
                style={{ color: belt.textColor }}
            >
                {belt.levelNumber}°
            </span>
            <span
                className="text-[8px] font-black uppercase tracking-widest leading-none mt-0.5"
                style={{ color: belt.textColor, opacity: 0.85 }}
            >
                Kyu
            </span>
        </div>
    );
}

export function BeltCascadeSection({
    unit,
    belt,
    prevBelt,
    isBeltUnlocked,
    allPathLevels,
    progress,
    onSelectLevel,
    isLast,
    onFocusBelt,
}: BeltCascadeSectionProps) {
    const isDan = belt.category === "dan";
    const beltLevels = unit.levels;

    // Progression metrics for this belt
    const completedLevelsCount = beltLevels.filter((l) =>
        progress.completedLevelIds.includes(l.id)
    ).length;
    const isBeltCompleted = completedLevelsCount === beltLevels.length && beltLevels.length > 0;

    // Check unlock state for levels within this belt (only relevant if the belt itself is unlocked)
    const isLevelUnlocked = (level: Level) => {
        if (!isBeltUnlocked) return false;
        const globalIdx = allPathLevels.findIndex((l) => l.id === level.id);
        if (globalIdx <= 0) return true; // Very first level of 10° Kyu is always unlocked
        const prevLevel = allPathLevels[globalIdx - 1];
        return (
            progress.completedLevelIds.includes(prevLevel.id) ||
            progress.completedLevelIds.includes(level.id)
        );
    };

    return (
        <div
            id={`belt-${belt.id}`}
            className="relative w-full max-w-2xl mx-auto my-8 scroll-mt-24"
            onMouseEnter={() => {
                if (isBeltUnlocked) onFocusBelt?.(belt.id);
            }}
        >
            {/* ENCAPSULATED BELT CARD */}
            <div
                className={`relative rounded-3xl p-6 md:p-8 backdrop-blur-xl border transition-all duration-500 overflow-hidden ${
                    isBeltCompleted
                        ? "bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-black border-kuma-gold/50 shadow-[0_20px_50px_rgba(0,0,0,0.7)] ring-1 ring-kuma-gold/30"
                        : isBeltUnlocked
                        ? "bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border-white/15 hover:border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
                        : "bg-zinc-950/40 border-white/5 opacity-60 shadow-md"
                }`}
            >
                {/* Ambient glow accent matching belt color (only if unlocked) */}
                {isBeltUnlocked && (
                    <div
                        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                        style={{
                            backgroundColor: isDan ? "rgba(245,158,11,0.15)" : `${belt.color}20`,
                        }}
                    />
                )}

                {/* REALISTIC OBI BANNER AT THE TOP */}
                <div className="mb-6">
                    <BeltObiVisual
                        belt={belt}
                        isCompleted={isBeltCompleted}
                        isLocked={!isBeltUnlocked}
                    />
                </div>

                {/* BELT HEADER IDENTITY (EMBLEM, NAME, JAPANESE, THEME) */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3.5">
                        {/* Circular Emblem */}
                        <BeltCircularEmblem belt={belt} isLocked={!isBeltUnlocked} />

                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span
                                    className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                                    style={{
                                        backgroundColor: !isBeltUnlocked
                                            ? "rgba(255,255,255,0.03)"
                                            : isDan
                                            ? "rgba(245,158,11,0.1)"
                                            : `${belt.color}15`,
                                        borderColor: !isBeltUnlocked
                                            ? "rgba(255,255,255,0.1)"
                                            : isDan
                                            ? "rgba(245,158,11,0.4)"
                                            : `${belt.strokeColor}40`,
                                        color: !isBeltUnlocked
                                            ? "#71717A"
                                            : isDan
                                            ? "#F59E0B"
                                            : belt.category === "kyu" && belt.levelNumber === 10
                                            ? "#CBD5E1"
                                            : belt.strokeColor,
                                    }}
                                >
                                    {!isBeltUnlocked
                                        ? "Cinturón Bloqueado"
                                        : isDan
                                        ? "Grado Dan • Maestría"
                                        : `Grado Kyu • ${belt.shortName}`}
                                </span>

                                <span className="text-[11px] text-zinc-400 font-bold tracking-wider">
                                    {belt.japaneseName.includes("—") ? belt.japaneseName.split("—")[1].trim() : belt.japaneseName}
                                </span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-serif font-black text-white leading-tight">
                                {belt.name}
                            </h3>

                            <p className="text-xs text-kuma-gold/90 font-medium mt-0.5">
                                {belt.theme}
                            </p>
                        </div>
                    </div>

                    {/* Progress / Lock Status Badge */}
                    <div className="flex items-center md:flex-col md:items-end justify-between shrink-0">
                        {isBeltCompleted ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-black shadow-md">
                                <CheckCircle className="w-4 h-4 text-emerald-400" weight="fill" />
                                <span>Cinturón Superado</span>
                            </div>
                        ) : isBeltUnlocked ? (
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-black">
                                    <Sparkle className="w-3.5 h-3.5 text-amber-400" weight="fill" />
                                    <span>
                                        {completedLevelsCount} / {beltLevels.length} Grados
                                    </span>
                                </div>
                                <div className="w-24 h-1.5 bg-black/60 rounded-full mt-2 overflow-hidden border border-white/10">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-kuma-gold transition-all duration-500"
                                        style={{
                                            width: `${(completedLevelsCount / beltLevels.length) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-700/60 text-zinc-400 text-xs font-bold shadow-sm">
                                <Lock className="w-3.5 h-3.5 text-zinc-400" weight="fill" />
                                <span>Sellado</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Philosophical Motto */}
                <div className="mt-3 text-[11px] text-zinc-400 italic bg-white/[0.02] px-3.5 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
                    <span className="text-kuma-gold font-serif font-black select-none">&ldquo;</span>
                    <span className="leading-snug">{belt.motto}</span>
                    <span className="text-kuma-gold font-serif font-black select-none">&rdquo;</span>
                </div>

                {/* ================================================================= */}
                {/* CONDITIONAL DISPLAY: UNLOCKED vs LOCKED STATE                     */}
                {/* User rule: "que los cinturones no se abran y no se muestren hasta */}
                {/* que se avancen al cinturón al ganar las clases"                   */}
                {/* ================================================================= */}
                {isBeltUnlocked ? (
                    /* UNLOCKED: THE BELT OPENS AND REVEALS ITS GRADES TO SOLVE */
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.5 }}
                        className="relative mt-8 pt-2 pb-4 flex flex-col items-center"
                    >
                        {/* Visual Connecting Line between nodes in this belt */}
                        {beltLevels.length > 1 && (
                            <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-1 border-l-2 border-dashed border-white/15 pointer-events-none z-0" />
                        )}

                        <div className="relative z-10 w-full flex flex-col items-center gap-8">
                            {beltLevels.map((level, idx) => {
                                const unlocked = isLevelUnlocked(level);
                                const completed = progress.completedLevelIds.includes(level.id);
                                const stars = progress.levelStars[level.id] || 0;

                                const offsetClass =
                                    beltLevels.length > 1
                                        ? idx % 2 === 0
                                            ? "-translate-x-6 md:-translate-x-10"
                                            : "translate-x-6 md:translate-x-10"
                                        : "translate-x-0";

                                return (
                                    <div
                                        key={level.id}
                                        className={`flex flex-col items-center transition-all duration-300 ${offsetClass}`}
                                    >
                                        {/* ETHEREAL 3D VOLUMETRIC MARTIAL ORB (DESOPILANTE Y PREMIUM) */}
                                        <EtherealMartialOrb
                                            level={level}
                                            isCompleted={completed}
                                            isUnlocked={unlocked}
                                            isDan={isDan}
                                            stars={stars}
                                            onClick={() => {
                                                if (unlocked) onSelectLevel(level);
                                            }}
                                        />

                                        {/* Level Title and Tag */}
                                        <div className="mt-3 text-center max-w-[190px]">
                                            <span className="block text-xs md:text-sm font-serif font-black text-white leading-tight drop-shadow">
                                                {level.title}
                                            </span>
                                            <span className="text-[10px] text-kuma-gold/90 font-bold uppercase tracking-widest block mt-0.5">
                                                {level.tag}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    /* LOCKED: THE BELT REMAINS CLOSED AND DOES NOT REVEAL ITS LESSONS */
                    <div className="mt-6 p-6 md:p-8 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-zinc-900/90 border border-zinc-700/80 flex items-center justify-center text-zinc-500 mb-3 shadow-inner">
                            <Lock className="w-6 h-6 text-zinc-400" weight="duotone" />
                        </div>

                        <h4 className="text-sm md:text-base font-serif font-black text-zinc-200 uppercase tracking-wider">
                            Cinturón Cerrado & Sellado
                        </h4>

                        <p className="text-xs text-zinc-400 mt-2 max-w-md leading-relaxed">
                            {prevBelt ? (
                                <>
                                    Para abrir este cinturón y revelar sus grados de aprendizaje,
                                    debes superar todas las clases y lecciones de{" "}
                                    <span className="text-kuma-gold font-bold">{prevBelt.name}</span>.
                                </>
                            ) : (
                                <>Supera los grados anteriores para abrir este cinturón.</>
                            )}
                        </p>

                        <div className="mt-4 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            🔒 {beltLevels.length} grados de aprendizaje encapsulados
                        </div>
                    </div>
                )}
            </div>

            {/* INTER-BELT CASCADE CONNECTOR */}
            {!isLast && (
                <div className="flex flex-col items-center justify-center my-4 py-2 pointer-events-none">
                    <div
                        className={`w-[2px] h-8 transition-all ${
                            isBeltUnlocked
                                ? "bg-gradient-to-b from-kuma-gold/60 via-amber-400/40 to-white/20"
                                : "bg-zinc-800"
                        }`}
                    />

                    <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            isBeltUnlocked
                                ? "bg-black/80 border border-kuma-gold/30 text-kuma-gold shadow-lg"
                                : "bg-zinc-950 border border-zinc-800 text-zinc-600"
                        }`}
                    >
                        <span>
                            {isBeltCompleted
                                ? "Ascenso completado"
                                : isBeltUnlocked
                                ? "En curso hacia el siguiente grado"
                                : "Camino sellado"}
                        </span>
                        <CaretDown
                            className={`w-3 h-3 ${
                                isBeltUnlocked ? "text-kuma-gold animate-bounce" : "text-zinc-600"
                            }`}
                            weight="bold"
                        />
                    </div>

                    <div
                        className={`w-[2px] h-8 transition-all ${
                            isBeltUnlocked
                                ? "bg-gradient-to-b from-white/20 via-amber-400/40 to-kuma-gold/60"
                                : "bg-zinc-800"
                        }`}
                    />
                </div>
            )}

            {/* LAST BELT SPECIAL CLOSING: 10° DAN JUDAN */}
            {isLast && isBeltUnlocked && (
                <div className="mt-12 p-8 rounded-3xl bg-gradient-to-b from-zinc-900/95 via-black to-zinc-950 border-2 border-kuma-gold/60 text-center max-w-md mx-auto shadow-[0_25px_60px_rgba(245,158,11,0.3)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,transparent_70%)] pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-black border-2 border-kuma-gold flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.6)] mb-3">
                            <Trophy className="w-8 h-8 text-kuma-gold" weight="duotone" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-kuma-gold">
                            Consagración Suprema
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif font-black text-white mt-1">
                            10° Dan — Judan
                        </h4>
                        <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                            Shin-Gi-Tai: Has alcanzado el umbral donde mente, técnica y espíritu son
                            uno solo. El círculo eterno del Karate-Do se ha completado.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
