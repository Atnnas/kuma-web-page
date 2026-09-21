"use client";
import React from "react";
import { motion } from "framer-motion";
import { Level } from "@/types/didactica";
import { Star, CheckCircle, Lock, Sparkle } from "@phosphor-icons/react";
import { OkinawaMapOrb } from "./OkinawaMapOrb";

interface EtherealMartialOrbProps {
    level: Level;
    isCompleted: boolean;
    isUnlocked: boolean;
    isDan?: boolean;
    stars?: number;
    onClick?: () => void;
}

/**
 * 3D Tactile Arcade Martial Orbs (Lúdicos, Desopilantes y Vivos)
 * Inspired by premium tactile gamified experiences (Duolingo Deluxe / Mario Wonder):
 * - Physical 3D extrusion with thick bottom bevel and interactive press effect.
 * - Curved top gloss reflection dome (acrílico/cristal pulido).
 * - Vibrant cheerful colors:
 *    * Active: Solar Golden Amber (#FFD000 / #FF8C00) with elastic Ki pulse.
 *    * Completed: Radiant Emerald Green (#58CC02 / #2E7A00) with 3D checkmark.
 *    * Okinawa: Luminous Sky Blue / Cyan with 3D topographic island.
 *    * Dan: Authentic Master Black Lacquer & Imperial Gold.
 *    * Locked: Polished Slate with metallic seal.
 */
export function EtherealMartialOrb({
    level,
    isCompleted,
    isUnlocked,
    isDan = false,
    stars = 0,
    onClick,
}: EtherealMartialOrbProps) {
    const isOkinawa = level.id === "level-karategi" || level.icon === "okinawa";

    return (
        <div className="relative flex flex-col items-center select-none group">
            {/* Ground Contact Shadow with dynamic squash */}
            <div
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 md:w-24 h-5 rounded-[50%] blur-md pointer-events-none transition-all duration-300 ${
                    isCompleted
                        ? "bg-emerald-950/80 group-hover:scale-110 group-hover:blur-lg"
                        : isUnlocked
                        ? "bg-amber-950/80 group-hover:scale-110 group-hover:blur-lg"
                        : "bg-black/60"
                }`}
            />

            {/* Interactive Motion Container with Juicy Elastic Spring Physics */}
            <motion.button
                whileHover={
                    isUnlocked
                        ? {
                              scale: 1.1,
                              y: -6,
                              transition: { type: "spring", stiffness: 450, damping: 15 },
                          }
                        : {}
                }
                whileTap={
                    isUnlocked
                        ? {
                              scale: 0.93,
                              y: 4,
                              transition: { type: "spring", stiffness: 500, damping: 18 },
                          }
                        : {}
                }
                onClick={() => {
                    if (isUnlocked && onClick) onClick();
                }}
                disabled={!isUnlocked}
                className={`relative w-22 h-22 md:w-26 md:h-26 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none ${
                    !isUnlocked ? "cursor-not-allowed opacity-85" : "active:outline-none"
                }`}
                style={{ width: "92px", height: "92px" }}
            >
                {/* ========================================================= */}
                {/* 1. SPECIAL OKINAWA ORB                                    */}
                {/* ========================================================= */}
                {isOkinawa ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <OkinawaMapOrb
                            className="w-full h-full"
                            showLabel={true}
                            levelNumber={level.number}
                            isCompleted={isCompleted}
                        />

                        {/* Completed Checkmark Overlay */}
                        {isCompleted && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/40 backdrop-blur-[1px] rounded-full z-30 border-2 border-emerald-400 shadow-[0_0_15px_rgba(88,204,2,0.6)]">
                                <CheckCircle
                                    className="w-9 h-9 md:w-10 md:h-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                                    weight="fill"
                                />
                                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-200 leading-tight bg-emerald-900/90 px-2.5 py-0.5 rounded-full border border-emerald-400 shadow-md mt-0.5">
                                    Superado
                                </span>
                            </div>
                        )}
                    </div>
                ) : isCompleted ? (
                    /* ===================================================== */
                    /* 2. COMPLETED: 3D VIBRANT EMERALD VICTORY SPHERE       */
                    /* ===================================================== */
                    <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#58CC02] via-[#46A302] to-[#2E7A00] border-t-2 border-t-emerald-200 border-x-2 border-x-emerald-400 border-b-[6px] border-b-[#1B4E00] shadow-[0_12px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(88,204,2,0.45)] flex items-center justify-center overflow-hidden">
                        {/* Upper Curved Gloss / Acrylic Specular Reflection */}
                        <div className="absolute top-1.5 left-3 right-3 h-7 rounded-[50%] bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none" />

                        {/* Radial 3D Volume Core */}
                        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-emerald-400/20 to-white/20 pointer-events-none" />

                        {/* Central Checkmark & Victorious Pill */}
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <CheckCircle
                                className="w-9 h-9 md:w-10 md:h-10 text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]"
                                weight="fill"
                            />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-white leading-tight bg-[#1B4E00]/90 px-2.5 py-0.5 rounded-full border border-emerald-300/60 shadow-md mt-0.5">
                                Superado
                            </span>
                        </div>

                        {/* Micro Shine Dot */}
                        <div className="absolute top-3 left-4 w-2 h-1.5 rounded-[50%] bg-white/90 blur-[0.4px] rotate-[-25deg] pointer-events-none" />
                    </div>
                ) : isUnlocked ? (
                    /* ===================================================== */
                    /* 3. ACTIVE: 3D GOLDEN SOLAR ARCADE ORB (DESOPILANTE)   */
                    /* ===================================================== */
                    <div
                        className={`relative w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                            isDan
                                ? "bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-t-2 border-t-amber-300 border-x-2 border-x-amber-500 border-b-[6px] border-b-amber-800 shadow-[0_12px_24px_rgba(0,0,0,0.8),0_0_25px_rgba(245,158,11,0.5)]"
                                : "bg-gradient-to-b from-[#FFE043] via-[#FFB800] to-[#E68200] border-t-2 border-t-yellow-100 border-x-2 border-x-amber-300 border-b-[6px] border-b-[#9E5100] shadow-[0_12px_28px_rgba(0,0,0,0.55),0_0_30px_rgba(255,200,0,0.65)]"
                        }`}
                    >
                        {/* Upper Curved Gloss / Acrylic Specular Reflection */}
                        <div className="absolute top-1.5 left-3 right-3 h-7 rounded-[50%] bg-gradient-to-b from-white/85 via-white/30 to-transparent pointer-events-none" />

                        {/* Radial 3D Volume Core */}
                        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-amber-300/30 to-white/30 pointer-events-none" />

                        {/* Interactive Floating Martial Icon & Level Pill */}
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <span className="text-3xl md:text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] select-none transform group-hover:scale-115 transition-transform duration-300">
                                {level.icon}
                            </span>
                            <span
                                className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider leading-tight px-2.5 py-0.5 rounded-full shadow-md mt-0.5 ${
                                    isDan
                                        ? "bg-black text-amber-300 border border-amber-400"
                                        : "bg-[#7A3E00] text-yellow-100 border border-amber-300/80"
                                }`}
                            >
                                Nivel {level.number}
                            </span>
                        </div>

                        {/* Micro Shine Dot */}
                        <div className="absolute top-3 left-4 w-2.5 h-1.5 rounded-[50%] bg-white/95 blur-[0.3px] rotate-[-25deg] pointer-events-none" />

                        {/* Active Energetic Pulsing Ki Ring */}
                        <span className="absolute -inset-1.5 rounded-full border-2 border-yellow-300/80 animate-ping pointer-events-none" />
                        <span className="absolute -inset-2.5 rounded-full border border-amber-400/40 animate-pulse pointer-events-none" />
                    </div>
                ) : (
                    /* ===================================================== */
                    /* 4. LOCKED: 3D POLISHED SLATE SPHERE                   */
                    /* ===================================================== */
                    <div className="relative w-full h-full rounded-full bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-800 border-t border-t-zinc-400/50 border-x border-x-zinc-600 border-b-[5px] border-b-zinc-950 shadow-[0_8px_18px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
                        {/* Upper subtle gloss */}
                        <div className="absolute top-1 left-3 right-3 h-5 rounded-[50%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center justify-center text-zinc-400">
                            <Lock className="w-7 h-7 text-zinc-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" weight="fill" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-zinc-400 mt-0.5">
                                Nivel {level.number}
                            </span>
                        </div>
                    </div>
                )}

                {/* Stars Badge if completed */}
                {isCompleted && stars > 0 && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-950 border-2 border-amber-400 shadow-[0_4px_12px_rgba(0,0,0,0.8),0_0_10px_rgba(251,191,36,0.4)] z-20">
                        {[1, 2, 3].map((s) => (
                            <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                    s <= stars
                                        ? "text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_6px_#facc15]"
                                        : "text-zinc-600"
                                }`}
                                weight="fill"
                            />
                        ))}
                    </div>
                )}

                {/* Floating Cheer Sparkle on Active Unlocked Nodes */}
                {isUnlocked && !isCompleted && (
                    <div className="absolute -top-1.5 -right-1.5 z-20 pointer-events-none">
                        <Sparkle
                            className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-spin-slow drop-shadow-[0_0_8px_#fde047]"
                            weight="fill"
                        />
                    </div>
                )}
            </motion.button>
        </div>
    );
}

export default EtherealMartialOrb;
