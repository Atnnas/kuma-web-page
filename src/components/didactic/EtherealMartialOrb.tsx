"use client";
import React from "react";
import { motion } from "framer-motion";
import { Level } from "@/types/didactica";
import { Star, CheckCircle, Lock } from "@phosphor-icons/react";
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
 * Radioactive Phenomenon Martial Orbs (Esferas Radioactivas de Energía Pura)
 * - Intense radioactive neon glows with multi-layered light bleeding.
 * - Swirling nuclear plasma energy vortex inside every sphere.
 * - Active: Nuclear Sun Plasma (#FFFFFF -> #FFF700 -> #FF8800) with radioactive shockwave aura.
 * - Completed: Radioactive Gamma Ray (#FFFFFF -> #00FF88 -> #00AA33) with intense emerald aura.
 * - Locked: Dormant Radioactive Crystal (Electric Neon Indigo #818CF8 with glowing cyan lock seal, NO GREY!).
 * - Okinawa: Radioactive Cherenkov Ocean Reactor (#00F5FF / #0088FF).
 * - Full floating levitation physics with dynamic squash shadow.
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
                animate={{
                    scale: isUnlocked ? [1, 0.74, 1] : [1, 0.86, 1],
                    opacity: isUnlocked ? [0.9, 0.4, 0.9] : [0.65, 0.45, 0.65],
                    filter: ["blur(4px)", "blur(8px)", "blur(4px)"],
                }}
                transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay,
                }}
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-22 md:w-26 h-5 rounded-[50%] pointer-events-none ${
                    isCompleted
                        ? "bg-emerald-500/30"
                        : isUnlocked
                        ? "bg-amber-500/35"
                        : "bg-indigo-500/20"
                }`}
            />

            {/* Continuous Organic Floating Levitating Container */}
            <motion.div
                animate={{
                    y: isUnlocked ? [0, -11, 0] : [0, -4, 0],
                    rotate: isUnlocked ? [-1.5, 1.5, -1.5] : [-0.8, 0.8, -0.8],
                }}
                transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay,
                }}
                className="relative flex flex-col items-center"
            >
                {/* 3D Orbiting Radioactive Plasma Ring around Active Unlocked Orb */}
                {isUnlocked && !isCompleted && (
                    <div className="absolute -inset-5 pointer-events-none flex items-center justify-center [perspective:600px] z-30">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                            className="relative w-full h-full rounded-full border-2 border-yellow-200/60 border-dashed [transform:rotateX(66deg)] shadow-[0_0_15px_rgba(255,230,0,0.5)]"
                        >
                            {/* Orbiting Radioactive Plasma Comet */}
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#ffffff,0_0_25px_#fde047,0_0_40px_#f59e0b] flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-yellow-200 animate-ping" />
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Interactive Motion Button with Juicy Elastic Spring Physics */}
                <motion.button
                    whileHover={{
                        scale: 1.15,
                        y: -6,
                        transition: { type: "spring", stiffness: 450, damping: 14 },
                    }}
                    whileTap={{
                        scale: 0.92,
                        y: 4,
                        transition: { type: "spring", stiffness: 500, damping: 16 },
                    }}
                    onClick={() => {
                        if (isUnlocked && onClick) onClick();
                    }}
                    disabled={!isUnlocked}
                    className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ${
                        !isUnlocked ? "cursor-not-allowed" : "active:outline-none"
                    }`}
                    style={{ width: "98px", height: "98px" }}
                >
                    {/* ========================================================= */}
                    {/* 1. SPECIAL OKINAWA ORB (CHERENKOV REACTOR BLUE)          */}
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
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/50 backdrop-blur-[1px] rounded-full z-30 border-2 border-emerald-300 shadow-[0_0_25px_#00FF88]">
                                    <CheckCircle
                                        className="w-10 h-10 text-white drop-shadow-[0_0_12px_#00FF88]"
                                        weight="fill"
                                    />
                                    <span className="text-[9px] font-black uppercase tracking-wider text-white leading-tight bg-emerald-700/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-[0_0_10px_#00FF88] mt-0.5">
                                        Superado
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : isCompleted ? (
                        /* ===================================================== */
                        /* 2. COMPLETED: RADIOACTIVE GAMMA RAY EMERALD SPHERE    */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_35%_30%,_#FFFFFF_0%,_#66FF99_25%,_#00FF66_55%,_#00AA33_85%,_#004411_100%)] border-t-2 border-t-white border-x-2 border-x-emerald-300 border-b-[6px] border-b-[#003B0F] shadow-[0_0_35px_rgba(0,255,102,0.85),0_0_70px_rgba(0,200,80,0.5),0_12px_24px_rgba(0,0,0,0.7)] flex items-center justify-center overflow-hidden">
                            {/* Swirling Radioactive Energy Vortex */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="absolute -inset-3 bg-[conic-gradient(from_0deg,_transparent,_rgba(255,255,255,0.45),_transparent,_rgba(0,255,102,0.55),_transparent)] rounded-full pointer-events-none mix-blend-overlay"
                            />

                            {/* Sweeping High-Intensity Laser Sheen */}
                            <motion.div
                                animate={{ x: ["-150%", "170%"] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.8,
                                    ease: "easeInOut",
                                    repeatDelay: 1.5,
                                }}
                                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-25deg] pointer-events-none"
                            />

                            {/* Upper Curved Specular Gloss Dome */}
                            <div className="absolute top-1.5 left-3 right-3 h-7 rounded-[50%] bg-gradient-to-b from-white/90 via-white/30 to-transparent pointer-events-none" />

                            {/* Central Checkmark & Victorious Pill */}
                            <div className="relative z-10 flex flex-col items-center justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                >
                                    <CheckCircle
                                        className="w-10 h-10 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                                        weight="fill"
                                    />
                                </motion.div>
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-white leading-tight bg-[#004411]/90 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-[0_0_10px_#00FF66] mt-0.5">
                                    Superado
                                </span>
                            </div>

                            {/* Micro White-Hot Reflection */}
                            <div className="absolute top-3 left-4 w-2.5 h-1.5 rounded-[50%] bg-white blur-[0.3px] rotate-[-25deg] pointer-events-none" />

                            {/* Pulsing Gamma Glow Aura */}
                            <span className="absolute -inset-1 rounded-full border-2 border-emerald-300/80 animate-ping pointer-events-none" />
                        </div>
                    ) : isUnlocked ? (
                        /* ===================================================== */
                        /* 3. ACTIVE: RADIOACTIVE NUCLEAR SUN PLASMA ORB         */
                        /* ===================================================== */
                        <div
                            className={`relative w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                                isDan
                                    ? "bg-[radial-gradient(circle_at_35%_30%,_#FFFBEB_0%,_#FDE68A_25%,_#F59E0B_55%,_#92400E_85%,_#000000_100%)] border-t-2 border-t-yellow-200 border-x-2 border-x-amber-400 border-b-[6px] border-b-black shadow-[0_0_35px_rgba(245,158,11,0.9),0_0_70px_rgba(251,191,36,0.6),0_12px_24px_rgba(0,0,0,0.85)]"
                                    : "bg-[radial-gradient(circle_at_35%_30%,_#FFFFFF_0%,_#FFF95B_25%,_#FFB800_55%,_#FF6600_85%,_#B32400_100%)] border-t-2 border-t-white border-x-2 border-x-yellow-200 border-b-[6px] border-b-[#801800] shadow-[0_0_40px_rgba(255,230,0,0.95),0_0_80px_rgba(255,140,0,0.7),0_12px_26px_rgba(0,0,0,0.75)]"
                            }`}
                        >
                            {/* Swirling Nuclear Plasma Vortex */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
                                className="absolute -inset-3 bg-[conic-gradient(from_0deg,_transparent,_rgba(255,255,255,0.5),_transparent,_rgba(255,200,0,0.6),_transparent)] rounded-full pointer-events-none mix-blend-overlay"
                            />

                            {/* Sweeping Nuclear Plasma Light Sheen */}
                            <motion.div
                                animate={{ x: ["-150%", "170%"] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.4,
                                    ease: "easeInOut",
                                    repeatDelay: 1,
                                }}
                                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-25deg] pointer-events-none"
                            />

                            {/* Upper Curved Specular Gloss Dome */}
                            <div className="absolute top-1.5 left-3 right-3 h-7 rounded-[50%] bg-gradient-to-b from-white via-white/40 to-transparent pointer-events-none" />

                            {/* Floating & Breathing Martial Icon & Radioactive Level Pill */}
                            <div className="relative z-10 flex flex-col items-center justify-center">
                                <motion.span
                                    animate={{
                                        y: [0, -4, 0],
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.8,
                                        ease: "easeInOut",
                                    }}
                                    className="text-3xl md:text-4xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] select-none transform group-hover:scale-120 transition-transform duration-300"
                                >
                                    {level.icon}
                                </motion.span>
                                <span
                                    className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider leading-tight px-2.5 py-0.5 rounded-full shadow-[0_0_10px_#fde047] mt-0.5 ${
                                        isDan
                                            ? "bg-black text-amber-200 border border-amber-300"
                                            : "bg-[#731300] text-yellow-100 border border-yellow-200"
                                    }`}
                                >
                                    Nivel {level.number}
                                </span>
                            </div>

                            {/* Micro White-Hot Reflection */}
                            <div className="absolute top-3 left-4 w-3 h-2 rounded-[50%] bg-white blur-[0.2px] rotate-[-25deg] pointer-events-none" />

                            {/* Concentric Radioactive Pulse Shockwaves */}
                            <span className="absolute -inset-2 rounded-full border-2 border-yellow-200/90 animate-ping pointer-events-none" />
                            <span className="absolute -inset-3.5 rounded-full border border-amber-400/60 animate-pulse pointer-events-none" />
                        </div>
                    ) : (
                        /* ===================================================== */
                        /* 4. LOCKED: DORMANT RADIOACTIVE NEON INDIGO CRYSTAL    */
                        /* (¡NUNCA GRIS! CRISTAL DE ENERGÍA DORMIDA PULSANTE)    */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_35%_30%,_#A5B4FC_0%,_#6366F1_30%,_#3730A3_65%,_#1E1B4B_100%)] border-t-2 border-t-indigo-200 border-x-2 border-x-indigo-400 border-b-[6px] border-b-[#0F0D2E] shadow-[0_0_24px_rgba(99,102,241,0.65),0_0_45px_rgba(129,140,248,0.35),0_10px_20px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden opacity-95">
                            {/* Inner Glowing Radioactive Resonance Waves */}
                            <motion.span
                                animate={{
                                    opacity: [0.35, 0.75, 0.35],
                                    scale: [0.94, 1.06, 0.94],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.6,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-1.5 rounded-full border border-cyan-300/50 pointer-events-none"
                            />

                            {/* Upper Specular Gloss */}
                            <div className="absolute top-1.5 left-3 right-3 h-6 rounded-[50%] bg-gradient-to-b from-white/60 via-indigo-200/20 to-transparent pointer-events-none" />

                            {/* Luminous Cyber-Seal Lock Emblem */}
                            <div className="relative z-10 flex flex-col items-center justify-center text-cyan-200">
                                <Lock
                                    className="w-7 h-7 text-cyan-200 drop-shadow-[0_0_10px_#22d3ee]"
                                    weight="fill"
                                />
                                <span className="text-[8px] font-black uppercase tracking-wider text-cyan-100 bg-[#0F0D2E]/80 px-2 py-0.5 rounded-full border border-cyan-400/50 shadow-[0_0_8px_#06b6d4] mt-0.5">
                                    Nivel {level.number}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Stars Badge if completed */}
                    {isCompleted && stars > 0 && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-950 border-2 border-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.8)] z-20">
                            {[1, 2, 3].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${
                                        s <= stars
                                            ? "text-yellow-300 fill-yellow-300 filter drop-shadow-[0_0_6px_#fde047]"
                                            : "text-zinc-600"
                                    }`}
                                    weight="fill"
                                />
                            ))}
                        </div>
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
}

export default EtherealMartialOrb;
