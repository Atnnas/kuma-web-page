"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
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
    BellRinging,
} from "@phosphor-icons/react";
import { FloatingSteppingStone } from "./FloatingSteppingStone";

interface BeltCascadeSectionProps {
    unit: Unit;
    belt: BeltRank;
    prevBelt?: BeltRank | null;
    nextBelt?: BeltRank | null;
    isBeltUnlocked: boolean;
    allPathLevels: Level[];
    progress: UserDidacticProgress;
    onSelectLevel: (level: Level) => void;
    isLast: boolean;
    onFocusBelt?: (beltId: BeltRankId) => void;
    hasNewQuestions?: boolean;
    updatedLevelIds?: string[];
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

/**
 * Dynamic S-Curve Martial Qi Stream & Kumihimo Cord
 * Weaves organically between alternating level nodes within an unlocked belt.
 */
function MartialLevelBridge({
    fromLeft,
    isSourceCompleted,
    isTargetUnlocked,
    beltColor,
}: {
    fromLeft: boolean;
    isSourceCompleted: boolean;
    isTargetUnlocked: boolean;
    beltColor: string;
}) {
    // Cubic bezier parameters:
    // When fromLeft is true: starts at (45, 0) and ends at (115, 48)
    // When fromLeft is false: starts at (115, 0) and ends at (45, 48)
    const dPath = fromLeft
        ? "M 45 0 C 45 28, 115 20, 115 48"
        : "M 115 0 C 115 28, 45 20, 45 48";

    const isFlowActive = isSourceCompleted;
    const isFlowReady = isTargetUnlocked && !isSourceCompleted;

    return (
        <div className="relative w-44 md:w-56 h-12 md:h-14 -my-2 flex items-center justify-center pointer-events-none z-0">
            <svg
                viewBox="0 0 160 48"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Golden / Ki Energy Gradient */}
                    <linearGradient id={`goldFlow-${fromLeft ? "L" : "R"}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#FDE68A" stopOpacity="1" />
                        <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
                    </linearGradient>

                    {/* Active Target Anticipation Gradient */}
                    <linearGradient id={`readyFlow-${fromLeft ? "L" : "R"}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#D97706" stopOpacity="0.9" />
                    </linearGradient>

                    {/* Dark Wrought Iron / Dormant Gradient */}
                    <linearGradient id={`dormantFlow-${fromLeft ? "L" : "R"}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#52525B" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#27272A" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#3F3F46" stopOpacity="0.3" />
                    </linearGradient>

                    {/* Soft Radial Glow Filter */}
                    <filter id={`qiGlow-${fromLeft ? "L" : "R"}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Layer 1: Ambient Ethereal Glow Beam */}
                <path
                    d={dPath}
                    stroke={isFlowActive ? "#F59E0B" : isFlowReady ? "#FBBF24" : "rgba(255,255,255,0.04)"}
                    strokeWidth={isFlowActive ? "7" : isFlowReady ? "5" : "3"}
                    strokeOpacity={isFlowActive ? "0.4" : isFlowReady ? "0.3" : "0.2"}
                    strokeLinecap="round"
                    filter={isFlowActive || isFlowReady ? `url(#qiGlow-${fromLeft ? "L" : "R"})` : undefined}
                />

                {/* Layer 2: Kumihimo Braided Silk Cord */}
                <path
                    d={dPath}
                    stroke={
                        isFlowActive
                            ? `url(#goldFlow-${fromLeft ? "L" : "R"})`
                            : isFlowReady
                            ? `url(#readyFlow-${fromLeft ? "L" : "R"})`
                            : `url(#dormantFlow-${fromLeft ? "L" : "R"})`
                    }
                    strokeWidth={isFlowActive ? "3.5" : isFlowReady ? "3" : "2.6"}
                    strokeDasharray={isFlowActive ? "5 3" : isFlowReady ? "4 2" : "4 4"}
                    strokeLinecap="round"
                    className={isFlowReady ? "animate-pulse" : ""}
                />

                {/* Layer 3: Central Luminous Filament */}
                {(isFlowActive || isFlowReady) && (
                    <path
                        d={dPath}
                        stroke="#FFFBEB"
                        strokeWidth={isFlowActive ? "1.2" : "0.8"}
                        strokeOpacity={isFlowActive ? "0.9" : "0.6"}
                        strokeLinecap="round"
                    />
                )}

                {/* Midpoint Qi Seal / Talisman Bead at inflection (80, 24) */}
                <g transform="translate(80, 24)">
                    {isFlowActive ? (
                        <>
                            {/* Outer pulsing ring */}
                            <circle r="7" fill="#F59E0B" fillOpacity="0.25" className="animate-ping" />
                            {/* Diamond Golden Talisman */}
                            <polygon
                                points="0,-6 6,0 0,6 -6,0"
                                fill="#FBBF24"
                                stroke="#78350F"
                                strokeWidth="1"
                                className="drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]"
                            />
                            {/* Core white spark */}
                            <circle r="1.5" fill="#FFFFFF" />
                        </>
                    ) : isFlowReady ? (
                        <>
                            <circle r="5" fill="#F59E0B" fillOpacity="0.2" className="animate-pulse" />
                            <circle r="3" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
                            <circle r="1" fill="#FFFFFF" />
                        </>
                    ) : (
                        <>
                            {/* Inactive iron bead */}
                            <polygon
                                points="0,-5 5,0 0,5 -5,0"
                                fill="#27272A"
                                stroke="#52525B"
                                strokeWidth="1"
                            />
                        </>
                    )}
                </g>
            </svg>
        </div>
    );
}

/**
 * Ceremonial Kumihimo Cord & Grand Martial Kamon Medallion
 * Connecting consecutive modules/belts with rich Japanese aesthetics,
 * metallic bevels, authentic Kanji seals, and dynamic Qi energy bridges.
 */
function MartialInterBeltConnector({
    isBeltCompleted,
    isBeltUnlocked,
    belt,
    nextBelt,
}: {
    isBeltCompleted: boolean;
    isBeltUnlocked: boolean;
    belt: BeltRank;
    nextBelt?: BeltRank | null;
}) {
    const isCompleted = isBeltCompleted;
    const isUnlocked = isBeltUnlocked;

    return (
        <div className="relative flex flex-col items-center justify-center my-6 py-1 select-none pointer-events-none">
            {/* Top Anchor Ferrule (Kanagu - 金具) */}
            <div
                className={`w-14 h-2.5 rounded-t-md border-t border-x transition-all duration-500 shadow-md ${
                    isCompleted
                        ? "bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                        : isUnlocked
                        ? "bg-gradient-to-r from-zinc-800 via-amber-500/60 to-zinc-800 border-amber-500/40"
                        : "bg-zinc-900 border-zinc-700/60 opacity-60"
                }`}
            />

            {/* UPPER KUMIHIMO BRAIDED CORD */}
            <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden">
                <svg
                    viewBox="0 0 32 40"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="kordTopGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity={isCompleted ? "1" : isUnlocked ? "0.8" : "0.2"} />
                            <stop offset="100%" stopColor="#FBBF24" stopOpacity={isCompleted ? "0.9" : isUnlocked ? "0.7" : "0.1"} />
                        </linearGradient>
                    </defs>

                    {/* Ambient Glow */}
                    {isUnlocked && (
                        <line
                            x1="16" y1="0" x2="16" y2="40"
                            stroke="#F59E0B"
                            strokeWidth="8"
                            strokeOpacity={isCompleted ? "0.4" : "0.25"}
                            strokeLinecap="round"
                        />
                    )}

                    {/* Twin Braided Silk Strands */}
                    <path
                        d="M 12,0 Q 20,10 12,20 T 12,40"
                        stroke={isUnlocked ? "url(#kordTopGlow)" : "#3F3F46"}
                        strokeWidth="3"
                        strokeDasharray="4 2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 20,0 Q 12,10 20,20 T 20,40"
                        stroke={isUnlocked ? (isCompleted ? "#D97706" : "#B45309") : "#27272A"}
                        strokeWidth="2.6"
                        strokeDasharray="3 2"
                        strokeLinecap="round"
                    />

                    {/* Center Laser Core */}
                    {isUnlocked && (
                        <line
                            x1="16" y1="0" x2="16" y2="40"
                            stroke="#FFFBEB"
                            strokeWidth="1.2"
                            strokeOpacity="0.9"
                        />
                    )}
                </svg>
            </div>

            {/* ========================================================= */}
            {/* CENTRAL SACRED KAMON MEDALLION (OCTAGONAL MARTIAL SEAL)   */}
            {/* ========================================================= */}
            <div className="relative group flex flex-col items-center">
                {/* Ethereal background radial aura */}
                {isUnlocked && (
                    <div
                        className={`absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-700 ${
                            isCompleted
                                ? "bg-amber-400/25 scale-125"
                                : "bg-amber-500/15 scale-110"
                        }`}
                    />
                )}

                {/* Octagonal Kamon Body */}
                <div
                    className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl border-2 ${
                        isCompleted
                            ? "bg-gradient-to-b from-zinc-900 via-black to-zinc-950 border-amber-400/90 shadow-[0_0_30px_rgba(245,158,11,0.45)] ring-2 ring-amber-500/40"
                            : isUnlocked
                            ? "bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/20"
                            : "bg-zinc-950 border-zinc-800 shadow-inner"
                    }`}
                >
                    {/* 8 Cardinal Direction Studs (Happō - 八方) */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400/80" />

                    {/* Inner Circular Bevel */}
                    <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center relative overflow-hidden ${
                            isCompleted
                                ? "border-amber-400/60 bg-gradient-to-br from-amber-950/80 via-black to-zinc-950"
                                : isUnlocked
                                ? "border-amber-500/40 bg-black/90"
                                : "border-zinc-800 bg-zinc-900/60"
                        }`}
                    >
                        {/* Shimmer flare */}
                        {isUnlocked && (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(254,243,199,0.25)_0%,transparent_60%)] pointer-events-none" />
                        )}

                        {/* Central Kanji / Glyph */}
                        {isCompleted ? (
                            <div className="flex flex-col items-center">
                                <span className="font-serif font-black text-base md:text-lg text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)] leading-none">
                                    極
                                </span>
                            </div>
                        ) : isUnlocked ? (
                            <div className="flex flex-col items-center">
                                <span className="font-serif font-black text-base md:text-lg text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] leading-none">
                                    道
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-zinc-500">
                                <Lock className="w-4 h-4 text-zinc-500" weight="duotone" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Martial Calligraphy Ribbon / Plaque */}
                <div
                    className={`mt-2.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border transition-all duration-300 ${
                        isCompleted
                            ? "bg-black/90 border-amber-400/70 text-amber-300 shadow-[0_4px_15px_rgba(245,158,11,0.3)]"
                            : isUnlocked
                            ? "bg-black/85 border-amber-500/40 text-kuma-gold shadow-md"
                            : "bg-zinc-950 border-zinc-800 text-zinc-600"
                    }`}
                >
                    {isCompleted ? (
                        <>
                            <Sparkle className="w-3 h-3 text-amber-300 animate-pulse" weight="fill" />
                            <span>Ascenso Culminado • 昇段</span>
                            <Sparkle className="w-3 h-3 text-amber-300 animate-pulse" weight="fill" />
                        </>
                    ) : isUnlocked ? (
                        <>
                            <span className="text-[9px] text-amber-400/80">修行中</span>
                            <span>{nextBelt ? `Camino a ${nextBelt.name}` : "Hacia el Siguiente Grado"}</span>
                            <CaretDown className="w-3 h-3 text-kuma-gold animate-bounce" weight="bold" />
                        </>
                    ) : (
                        <>
                            <Lock className="w-2.5 h-2.5 text-zinc-600" weight="bold" />
                            <span>Grado Sellado • 未伝</span>
                        </>
                    )}
                </div>
            </div>

            {/* LOWER KUMIHIMO BRAIDED CORD */}
            <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden">
                <svg
                    viewBox="0 0 32 40"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="kordBottomGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FBBF24" stopOpacity={isCompleted ? "0.9" : isUnlocked ? "0.7" : "0.1"} />
                            <stop offset="100%" stopColor="#F59E0B" stopOpacity={isCompleted ? "1" : isUnlocked ? "0.8" : "0.2"} />
                        </linearGradient>
                    </defs>

                    {/* Ambient Glow */}
                    {isUnlocked && (
                        <line
                            x1="16" y1="0" x2="16" y2="40"
                            stroke="#F59E0B"
                            strokeWidth="8"
                            strokeOpacity={isCompleted ? "0.4" : "0.25"}
                            strokeLinecap="round"
                        />
                    )}

                    {/* Twin Braided Silk Strands */}
                    <path
                        d="M 12,0 Q 20,10 12,20 T 12,40"
                        stroke={isUnlocked ? "url(#kordBottomGlow)" : "#3F3F46"}
                        strokeWidth="3"
                        strokeDasharray="4 2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 20,0 Q 12,10 20,20 T 20,40"
                        stroke={isUnlocked ? (isCompleted ? "#D97706" : "#B45309") : "#27272A"}
                        strokeWidth="2.6"
                        strokeDasharray="3 2"
                        strokeLinecap="round"
                    />

                    {/* Center Laser Core */}
                    {isUnlocked && (
                        <line
                            x1="16" y1="0" x2="16" y2="40"
                            stroke="#FFFBEB"
                            strokeWidth="1.2"
                            strokeOpacity="0.9"
                        />
                    )}
                </svg>
            </div>

            {/* Bottom Anchor Ferrule (Kanagu - 金具) */}
            <div
                className={`w-14 h-2.5 rounded-b-md border-b border-x transition-all duration-500 shadow-md ${
                    isCompleted
                        ? "bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                        : isUnlocked
                        ? "bg-gradient-to-r from-zinc-800 via-amber-500/60 to-zinc-800 border-amber-500/40"
                        : "bg-zinc-900 border-zinc-700/60 opacity-60"
                }`}
            />
        </div>
    );
}

export function BeltCascadeSection({
    unit,
    belt,
    prevBelt,
    nextBelt,
    isBeltUnlocked,
    allPathLevels,
    progress,
    onSelectLevel,
    isLast,
    onFocusBelt,
    hasNewQuestions = false,
    updatedLevelIds = [],
}: BeltCascadeSectionProps) {
    const { data: session } = useSession();
    const isSuperAdmin = Boolean(session?.user && (session.user as any).role === "super_admin");

    const isDan = belt.category === "dan";
    const isWhiteBelt = belt.category === "kyu" && belt.levelNumber === 10;
    const beltLevels = unit.levels;
    const unitHasNewQuestions = updatedLevelIds.length > 0 
        ? beltLevels.some((lvl) => updatedLevelIds.includes(lvl.id))
        : hasNewQuestions;

    // Progression metrics for this belt
    const completedLevelsCount = beltLevels.filter((l) =>
        progress.completedLevelIds.includes(l.id)
    ).length;
    const isBeltCompleted = completedLevelsCount === beltLevels.length && beltLevels.length > 0;

    // Check unlock state for levels within this belt (only relevant if the belt itself is unlocked)
    const isLevelUnlocked = (level: Level) => {
        if (isSuperAdmin) return true; // Super admin can inspect and test all levels
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
            {/* 1. FLOATING CEREMONIAL BELT SHRINE BANNER (TORII / OBI BRIDGE) */}
            <div
                className={`relative rounded-3xl p-5 md:p-6 backdrop-blur-xl border transition-all duration-500 shadow-2xl overflow-hidden ${
                    isBeltCompleted
                        ? "bg-zinc-950/75 border-kuma-gold/50 shadow-[0_15px_40px_rgba(0,0,0,0.85)] ring-1 ring-kuma-gold/30"
                        : isWhiteBelt && isBeltUnlocked
                        ? "bg-[#181411]/80 border-amber-300/50 shadow-[0_15px_45px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/40"
                        : isBeltUnlocked
                        ? "bg-zinc-950/70 border-white/15 hover:border-white/25 shadow-[0_15px_40px_rgba(0,0,0,0.85)]"
                        : "bg-zinc-950/50 border-white/5 opacity-70 shadow-md"
                }`}
            >
                {/* Floating ambient spotlight for white belt */}
                {isWhiteBelt && isBeltUnlocked && (
                    <>
                        <motion.div
                            animate={{
                                opacity: [0.3, 0.5, 0.3],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 4.5,
                                ease: "easeInOut",
                            }}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-lg h-56 rounded-full pointer-events-none blur-3xl"
                            style={{
                                background:
                                    "radial-gradient(ellipse at center, rgba(254, 240, 138, 0.4) 0%, rgba(245, 158, 11, 0.2) 45%, transparent 75%)",
                            }}
                        />

                        {/* Enchanted Wandering Fireflies */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                            {[
                                { left: "15%", bottom: "10%", size: 3.5, dur: 7.2, delay: 0, xPath: [0, 25, -20, 30, 0] },
                                { left: "45%", bottom: "15%", size: 4, dur: 8.4, delay: 0.6, xPath: [0, 35, -25, 20, 0] },
                                { left: "75%", bottom: "8%", size: 3.8, dur: 7.0, delay: 2.2, xPath: [0, -30, 20, -15, 0] },
                            ].map((pt, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -40, -90, -130],
                                        x: pt.xPath,
                                        opacity: [0, 0.9, 0.3, 0.9, 0],
                                        scale: [0.6, 1.3, 0.8, 1.2, 0.3],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: pt.dur,
                                        delay: pt.delay,
                                        ease: "easeInOut",
                                    }}
                                    style={{
                                        left: pt.left,
                                        bottom: pt.bottom,
                                        width: `${pt.size}px`,
                                        height: `${pt.size}px`,
                                    }}
                                    className="absolute rounded-full bg-yellow-100 shadow-[0_0_8px_#fef08a,0_0_16px_#fde047]"
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Ambient glow accent matching belt color */}
                {isBeltUnlocked && (
                    <div
                        className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                        style={{
                            backgroundColor: isDan ? "rgba(245,158,11,0.15)" : `${belt.color}20`,
                        }}
                    />
                )}

                {/* REALISTIC OBI BANNER AT THE TOP */}
                <div className="mb-5">
                    <BeltObiVisual
                        belt={belt}
                        isCompleted={isBeltCompleted}
                        isLocked={!isBeltUnlocked}
                    />
                </div>

                {/* BELT HEADER IDENTITY (EMBLEM, NAME, JAPANESE, THEME) */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
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

                                {unitHasNewQuestions && (
                                    <motion.span
                                        initial={{ scale: 0.85, opacity: 0 }}
                                        animate={{ scale: [1, 1.06, 1], opacity: 1 }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-[0_0_12px_rgba(250,204,21,0.6)]"
                                    >
                                        <Sparkle className="w-3 h-3 text-black" weight="fill" />
                                        ¡Nuevas Preguntas!
                                    </motion.span>
                                )}

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

                {/* AVISO DE ACTUALIZACIÓN DEL MÓDULO CON NUEVAS PREGUNTAS */}
                {unitHasNewQuestions && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-950/80 via-zinc-950/90 to-amber-950/80 border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center gap-3 text-xs text-amber-100"
                    >
                        <BellRinging className="w-5 h-5 text-yellow-400 shrink-0 animate-bounce" weight="fill" />
                        <div>
                            <span className="font-black text-yellow-300 uppercase tracking-wider block text-[10px]">
                                ¡Módulo Actualizado con Nuevas Preguntas!
                            </span>
                            <span className="text-[11px] text-slate-300">
                                Se han incorporado nuevas pruebas a este cinturón. El progreso de estrellas se ha reajustado para que demuestres maestría en el nuevo temario.
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* LOCKED: THE BELT REMAINS CLOSED AND DOES NOT REVEAL ITS LESSONS */}
                {!isBeltUnlocked && (
                    <div className="mt-5 p-5 md:p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center text-center">
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
                            🔒 {beltLevels.length} grados de aprendizaje en el estanque
                        </div>
                    </div>
                )}
            </div>

            {/* ================================================================= */}
            {/* 2. PIEDRAS FLOTANTES EN EL ESTANQUE ZEN (TOBI-ISHI 飛び石)        */}
            {/* ¡SIN CAJA ENVOLVENTE! FLOTAN DIRECTAMENTE SOBRE EL AGUA Y PECES KOI */}
            {/* ================================================================= */}
            {isBeltUnlocked && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative my-10 py-2 flex flex-col items-center"
                >
                    <div className="relative z-10 w-full flex flex-col items-center">
                        {beltLevels.map((level, idx) => {
                            const unlocked = isLevelUnlocked(level);
                            const completed = progress.completedLevelIds.includes(level.id);
                            const stars = progress.levelStars[level.id] || 0;
                            const nextLevel = beltLevels[idx + 1];
                            const nextUnlocked = nextLevel ? isLevelUnlocked(nextLevel) : false;

                            const offsetClass =
                                beltLevels.length > 1
                                    ? idx % 2 === 0
                                        ? "-translate-x-7 md:-translate-x-14"
                                        : "translate-x-7 md:translate-x-14"
                                    : "translate-x-0";

                            return (
                                <React.Fragment key={level.id}>
                                    <div
                                        className={`flex flex-col items-center transition-all duration-300 my-4 ${offsetClass}`}
                                    >
                                        {/* PIEDRA FLOTANTE ZEN DE ESTANQUE (TOBI-ISHI) */}
                                        <FloatingSteppingStone
                                            level={level}
                                            isCompleted={completed}
                                            isUnlocked={unlocked}
                                            isDan={isDan}
                                            stars={stars}
                                            onClick={() => {
                                                if (unlocked) onSelectLevel(level);
                                            }}
                                            hasNewQuestions={updatedLevelIds.includes(level.id)}
                                        />

                                        {/* TÍTULO Y ETIQUETA EN CÁPSULA TRASLÚCIDA DE CRISTAL */}
                                        <div className="mt-2 text-center max-w-[210px] px-3.5 py-1.5 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 shadow-xl">
                                            <span
                                                className={`block text-xs md:text-sm font-serif font-black leading-tight drop-shadow transition-colors ${
                                                    unlocked ? "text-white" : "text-zinc-400"
                                                }`}
                                            >
                                                {level.title}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold uppercase tracking-widest block mt-0.5 transition-colors ${
                                                    completed
                                                        ? "text-emerald-400"
                                                        : unlocked
                                                        ? "text-amber-300"
                                                        : "text-zinc-500"
                                                }`}
                                            >
                                                {level.tag}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CORRIENTE ACUÁTICA DE AGUA ENTRE PIEDRAS (NAGARE 流) */}
                                    {idx < beltLevels.length - 1 && (
                                        <MartialLevelBridge
                                            fromLeft={idx % 2 === 0}
                                            isSourceCompleted={completed}
                                            isTargetUnlocked={nextUnlocked}
                                            beltColor={isWhiteBelt ? "#FFC800" : belt.strokeColor || belt.color}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* INTER-BELT CASCADE CONNECTOR: CEREMONIAL KUMIHIMO CORD & OCTAGONAL KAMON SEAL */}
            {!isLast && (
                <MartialInterBeltConnector
                    isBeltCompleted={isBeltCompleted}
                    isBeltUnlocked={isBeltUnlocked}
                    belt={belt}
                    nextBelt={nextBelt}
                />
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
