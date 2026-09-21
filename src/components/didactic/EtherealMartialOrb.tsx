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
 * 3D Living & Levitating Martial Orbs (Flotantes, Vivas y Desopilantes)
 * - Independent organic hovering levitation with dynamic ground shadow expansion.
 * - 3D Tilted Orbiting Ki Ring with revolving comet spark for active levels.
 * - Prismatic light sweeps and breathing central icons.
 * - Victorious twinkling star flares on completed levels.
 * - Elastic squish & bounce interactive physics.
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

    // Asynchronous floating parameters so every orb levitates organically out-of-phase
    const floatDelay = ((level.number || 1) % 4) * 0.45;
    const floatDuration = 3.2 + ((level.number || 1) % 3) * 0.35;

    return (
        <div className="relative flex flex-col items-center select-none group">
            {/* Ground Contact Shadow with Synchronized Levitating Squash & Stretch */}
            <motion.div
                animate={
                    isUnlocked
                        ? {
                              scale: [1, 0.76, 1],
                              opacity: [0.85, 0.4, 0.85],
                              filter: ["blur(4px)", "blur(8px)", "blur(4px)"],
                          }
                        : {
                              scale: [1, 0.88, 1],
                              opacity: [0.6, 0.45, 0.6],
                          }
                }
                transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay,
                }}
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 md:w-24 h-5 rounded-[50%] pointer-events-none ${
                    isCompleted
                        ? "bg-emerald-950/80"
                        : isUnlocked
                        ? "bg-amber-950/90"
                        : "bg-black/60"
                }`}
            />

            {/* Continuous Organic Floating Levitating Container */}
            <motion.div
                animate={
                    isUnlocked
                        ? {
                              y: [0, -10, 0],
                              rotate: [-1.2, 1.2, -1.2],
                          }
                        : {
                              y: [0, -3, 0],
                          }
                }
                transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay,
                }}
                className="relative flex flex-col items-center"
            >
                {/* 3D Orbiting Ki Energy Ring around Active Unlocked Orb (Saturn / Ki Aura Style) */}
                {isUnlocked && !isCompleted && (
                    <div className="absolute -inset-4 pointer-events-none flex items-center justify-center [perspective:600px] z-30">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className="relative w-full h-full rounded-full border-2 border-yellow-300/40 border-dashed [transform:rotateX(68deg)]"
                        >
                            {/* Orbiting Ki Comet Particle */}
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-yellow-200 shadow-[0_0_12px_#fde047,0_0_20px_#f59e0b] flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Interactive Motion Button with Juicy Elastic Spring Physics */}
                <motion.button
                    whileHover={
                        isUnlocked
                            ? {
                                  scale: 1.14,
                                  y: -5,
                                  transition: { type: "spring", stiffness: 450, damping: 14 },
                              }
                            : {}
                    }
                    whileTap={
                        isUnlocked
                            ? {
                                  scale: 0.92,
                                  y: 4,
                                  transition: { type: "spring", stiffness: 500, damping: 16 },
                              }
                            : {}
                    }
                    onClick={() => {
                        if (isUnlocked && onClick) onClick();
                    }}
                    disabled={!isUnlocked}
                    className={`relative w-22 h-22 md:w-26 md:h-26 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ${
                        !isUnlocked ? "cursor-not-allowed opacity-85" : "active:outline-none"
                    }`}
                    style={{ width: "94px", height: "94px" }}
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
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/40 backdrop-blur-[1px] rounded-full z-30 border-2 border-emerald-400 shadow-[0_0_18px_rgba(88,204,2,0.7)]">
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
                        /* 2. COMPLETED: 3D LIVING EMERALD VICTORY SPHERE        */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#58CC02] via-[#46A302] to-[#2E7A00] border-t-2 border-t-emerald-200 border-x-2 border-x-emerald-400 border-b-[6px] border-b-[#1B4E00] shadow-[0_14px_28px_rgba(0,0,0,0.55),0_0_24px_rgba(88,204,2,0.5)] flex items-center justify-center overflow-hidden">
                            {/* Sweeping Light Sheen */}
                            <motion.div
                                animate={{ x: ["-150%", "170%"] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3.2,
                                    ease: "easeInOut",
                                    repeatDelay: 2,
                                }}
                                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none"
                            />

                            {/* Upper Curved Specular Gloss Dome */}
                            <div className="absolute top-1.5 left-3 right-3 h-7 rounded-[50%] bg-gradient-to-b from-white/75 via-white/20 to-transparent pointer-events-none" />

                            {/* Radial 3D Volume Core */}
                            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-emerald-400/20 to-white/25 pointer-events-none" />

                            {/* Central Checkmark & Victorious Pill */}
                            <div className="relative z-10 flex flex-col items-center justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.08, 1] }}
                                    transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                                >
                                    <CheckCircle
                                        className="w-9 h-9 md:w-10 md:h-10 text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]"
                                        weight="fill"
                                    />
                                </motion.div>
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-white leading-tight bg-[#1B4E00]/90 px-2.5 py-0.5 rounded-full border border-emerald-300/60 shadow-md mt-0.5">
                                    Superado
                                </span>
                            </div>

                            {/* Micro Shine Dot */}
                            <div className="absolute top-3 left-4 w-2 h-1.5 rounded-[50%] bg-white/90 blur-[0.4px] rotate-[-25deg] pointer-events-none" />

                            {/* Twinkling Star Flare */}
                            <motion.div
                                animate={{
                                    scale: [0, 1.25, 0],
                                    opacity: [0, 1, 0],
                                    rotate: [0, 90, 180],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.8,
                                    ease: "easeInOut",
                                    delay: floatDelay,
                                }}
                                className="absolute top-2.5 right-2.5 pointer-events-none z-20"
                            >
                                <Sparkle className="w-4 h-4 text-emerald-100 fill-white drop-shadow-[0_0_8px_#34d399]" weight="fill" />
                            </motion.div>
                        </div>
                    ) : isUnlocked ? (
                        /* ===================================================== */
                        /* 3. ACTIVE: 3D LIVING GOLDEN SOLAR ARCADE ORB          */
                        /* ===================================================== */
                        <div
                            className={`relative w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                                isDan
                                    ? "bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-t-2 border-t-amber-300 border-x-2 border-x-amber-500 border-b-[6px] border-b-amber-800 shadow-[0_14px_28px_rgba(0,0,0,0.85),0_0_28px_rgba(245,158,11,0.6)]"
                                    : "bg-gradient-to-b from-[#FFE043] via-[#FFB800] to-[#E68200] border-t-2 border-t-yellow-100 border-x-2 border-x-amber-300 border-b-[6px] border-b-[#9E5100] shadow-[0_14px_30px_rgba(0,0,0,0.55),0_0_35px_rgba(255,200,0,0.7)]"
                            }`}
                        >
                            {/* Sweeping Light Sheen */}
                            <motion.div
                                animate={{ x: ["-150%", "170%"] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.6,
                                    ease: "easeInOut",
                                    repeatDelay: 1.2,
                                }}
                                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none"
                            />

                            {/* Upper Curved Specular Gloss Dome */}
                            <div className="absolute top-1.5 left-3 right-3 h-7 rounded-[50%] bg-gradient-to-b from-white/90 via-white/35 to-transparent pointer-events-none" />

                            {/* Radial 3D Volume Core */}
                            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-amber-300/35 to-white/35 pointer-events-none" />

                            {/* Floating & Breathing Martial Icon & Level Pill */}
                            <div className="relative z-10 flex flex-col items-center justify-center">
                                <motion.span
                                    animate={{
                                        y: [0, -3.5, 0],
                                        scale: [1, 1.06, 1],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: "easeInOut",
                                    }}
                                    className="text-3xl md:text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] select-none transform group-hover:scale-115 transition-transform duration-300"
                                >
                                    {level.icon}
                                </motion.span>
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
                        <div className="absolute -top-2 -right-2 z-30 pointer-events-none">
                            <Sparkle
                                className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-spin-slow drop-shadow-[0_0_10px_#fde047]"
                                weight="fill"
                            />
                        </div>
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
}

export default EtherealMartialOrb;
