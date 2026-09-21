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
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/40 backdrop-blur-[2px] rounded-full z-30 border-2 border-emerald-300 shadow-[0_0_25px_#00FF88]">
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
                        /* 2. COMPLETED: ETHEREAL TRANSLUCENT GAMMA RAY CRYSTAL  */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full flex items-center justify-center">
                            {/* Deep Radioactive Emerald Bleed Aura */}
                            <div className="absolute -inset-4 rounded-full bg-emerald-400/45 blur-2xl pointer-events-none animate-pulse" />

                            {/* Crystalline Translucent Glass Shell */}
                            <div className="relative w-full h-full rounded-full backdrop-blur-md bg-gradient-to-b from-emerald-200/25 via-emerald-600/30 to-emerald-950/70 border border-emerald-200/70 shadow-[inset_0_0_25px_rgba(110,255,180,0.5),inset_0_-12px_22px_rgba(0,60,20,0.8),0_0_35px_rgba(0,255,102,0.8),0_0_70px_rgba(0,200,80,0.45),0_12px_28px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
                                
                                {/* Inner Trapped Radioactive Plasma Core */}
                                <motion.div
                                    animate={{
                                        scale: [0.92, 1.08, 0.92],
                                        opacity: [0.85, 1, 0.85],
                                    }}
                                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                    className="absolute w-14 h-14 rounded-full bg-[radial-gradient(circle,_#FFFFFF_0%,_#66FF99_30%,_#00FF66_60%,_#004411_100%)] shadow-[0_0_25px_#00FF88,0_0_45px_#66FF99] blur-[0.8px]"
                                />

                                {/* Swirling Conic Gamma Vortex */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                                    className="absolute -inset-2 bg-[conic-gradient(from_0deg,_transparent,_rgba(255,255,255,0.6),_transparent,_rgba(0,255,102,0.7),_transparent)] rounded-full pointer-events-none mix-blend-screen"
                                />

                                {/* High-Speed Laser Sheen across Glass Curve */}
                                <motion.div
                                    animate={{ x: ["-160%", "180%"] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2.6,
                                        ease: "easeInOut",
                                        repeatDelay: 1.2,
                                    }}
                                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/75 to-transparent skew-x-[-28deg] pointer-events-none"
                                />

                                {/* Bottom Caustic Glass Refraction Pool */}
                                <div className="absolute bottom-1 left-3 right-3 h-5 rounded-[50%] bg-gradient-to-t from-emerald-300/60 via-emerald-400/20 to-transparent pointer-events-none blur-[1px]" />

                                {/* Upper Translucent Glass Specular Dome */}
                                <div className="absolute top-1 left-2.5 right-2.5 h-7 rounded-[50%] bg-gradient-to-b from-white/95 via-white/35 to-transparent pointer-events-none" />

                                {/* Sharp Glass Hotspot Reflection */}
                                <div className="absolute top-2.5 left-4 w-3 h-1.5 rounded-[50%] bg-white blur-[0.2px] rotate-[-25deg] pointer-events-none" />

                                {/* Central Checkmark & Victorious Pill */}
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.12, 1] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    >
                                        <CheckCircle
                                            className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.95),0_0_25px_#00FF88]"
                                            weight="fill"
                                        />
                                    </motion.div>
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-white leading-tight bg-[#004411]/95 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-[0_0_12px_#00FF66] mt-0.5 backdrop-blur-sm">
                                        Superado
                                    </span>
                                </div>

                                {/* Expanding Radioactive Resonance Ping */}
                                <span className="absolute -inset-1 rounded-full border-2 border-emerald-300/80 animate-ping pointer-events-none" />
                            </div>
                        </div>
                    ) : isUnlocked ? (
                        /* ===================================================== */
                        /* 3. ACTIVE: ETHEREAL TRANSLUCENT NUCLEAR PLASMA ORB    */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full flex items-center justify-center">
                            {/* Blazing Atmospheric Solar Radiation Bleed */}
                            <div className="absolute -inset-5 rounded-full bg-gradient-to-r from-amber-400/50 via-yellow-300/60 to-orange-500/50 blur-2xl pointer-events-none animate-pulse" />

                            {/* Secondary Outer Radioactive Gyro Ring (Counter-rotating) */}
                            <div className="absolute -inset-4 pointer-events-none flex items-center justify-center [perspective:600px] z-20">
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                                    className="relative w-full h-full rounded-full border border-orange-300/50 border-dotted [transform:rotateX(55deg)_rotateY(-25deg)] shadow-[0_0_12px_rgba(255,140,0,0.4)]"
                                >
                                    <div className="absolute top-1 right-2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff,0_0_20px_#ffea00]" />
                                </motion.div>
                            </div>

                            {/* Crystalline Translucent Glass Shell */}
                            <div
                                className={`relative w-full h-full rounded-full backdrop-blur-md border border-white/80 shadow-[inset_0_0_25px_rgba(255,250,200,0.6),inset_0_-14px_24px_rgba(180,50,0,0.7),0_0_40px_rgba(255,220,0,0.95),0_0_80px_rgba(255,120,0,0.7),0_14px_30px_rgba(0,0,0,0.85)] flex items-center justify-center overflow-hidden transition-all duration-300 ${
                                    isDan
                                        ? "bg-gradient-to-b from-amber-100/25 via-amber-500/35 to-black/85 border-amber-300/80"
                                        : "bg-gradient-to-b from-yellow-100/30 via-amber-500/35 to-orange-950/75 border-yellow-200/90"
                                }`}
                            >
                                {/* Inner Trapped White-Hot Nuclear Plasma Star */}
                                <motion.div
                                    animate={{
                                        scale: [0.88, 1.12, 0.88],
                                        opacity: [0.9, 1, 0.9],
                                    }}
                                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                    className={`absolute w-15 h-15 rounded-full blur-[0.8px] ${
                                        isDan
                                            ? "bg-[radial-gradient(circle,_#FFFFFF_0%,_#FDE68A_30%,_#F59E0B_60%,_#78350F_100%)] shadow-[0_0_30px_#F59E0B,0_0_50px_#FDE68A]"
                                            : "bg-[radial-gradient(circle,_#FFFFFF_0%,_#FFF95B_25%,_#FFB800_55%,_#FF4500_100%)] shadow-[0_0_35px_#FFB800,0_0_55px_#FFF95B]"
                                    }`}
                                />

                                {/* Swirling Conic Nuclear Plasma Vortex */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 5.5, ease: "linear" }}
                                    className="absolute -inset-3 bg-[conic-gradient(from_0deg,_transparent,_rgba(255,255,255,0.7),_transparent,_rgba(255,200,0,0.7),_transparent)] rounded-full pointer-events-none mix-blend-screen"
                                />

                                {/* High-Speed Solar Laser Sheen */}
                                <motion.div
                                    animate={{ x: ["-160%", "180%"] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2.2,
                                        ease: "easeInOut",
                                        repeatDelay: 0.8,
                                    }}
                                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-28deg] pointer-events-none"
                                />

                                {/* Bottom Caustic Glass Refraction Pool */}
                                <div className="absolute bottom-1 left-3 right-3 h-5 rounded-[50%] bg-gradient-to-t from-yellow-300/60 via-amber-400/20 to-transparent pointer-events-none blur-[1px]" />

                                {/* Upper Translucent Specular Glass Dome */}
                                <div className="absolute top-1 left-2.5 right-2.5 h-7 rounded-[50%] bg-gradient-to-b from-white via-white/40 to-transparent pointer-events-none" />

                                {/* Sharp Glass Reflection Point */}
                                <div className="absolute top-2.5 left-4 w-3.5 h-2 rounded-[50%] bg-white blur-[0.2px] rotate-[-25deg] pointer-events-none" />

                                {/* Floating Martial Icon & Radioactive Level Pill */}
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <motion.span
                                        animate={{
                                            y: [0, -4, 0],
                                            scale: [1, 1.12, 1],
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.8,
                                            ease: "easeInOut",
                                        }}
                                        className="text-3xl md:text-4xl filter drop-shadow-[0_0_14px_rgba(255,255,255,0.95),0_0_24px_#FFB800] select-none transform group-hover:scale-125 transition-transform duration-300"
                                    >
                                        {level.icon}
                                    </motion.span>
                                    <span
                                        className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider leading-tight px-2.5 py-0.5 rounded-full shadow-[0_0_12px_#fde047] mt-0.5 backdrop-blur-sm ${
                                            isDan
                                                ? "bg-black/95 text-amber-200 border border-amber-300"
                                                : "bg-[#731300]/95 text-yellow-100 border border-yellow-200"
                                        }`}
                                    >
                                        Nivel {level.number}
                                    </span>
                                </div>

                                {/* Concentric Shockwave Pulse Rings */}
                                <span className="absolute -inset-2 rounded-full border-2 border-yellow-200/90 animate-ping pointer-events-none" />
                                <span className="absolute -inset-3.5 rounded-full border border-amber-400/60 animate-pulse pointer-events-none" />
                            </div>
                        </div>
                    ) : (
                        /* ===================================================== */
                        /* 4. LOCKED: ETHEREAL TRANSLUCENT QUANTUM KYBER CRYSTAL */
                        /* (¡NUNCA GRIS! CRISTAL ETÉREO TRASLÚCIDO CON SELLO)    */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full flex items-center justify-center">
                            {/* Deep Ethereal Mystic Indigo Halo */}
                            <div className="absolute -inset-3 rounded-full bg-indigo-500/35 blur-xl pointer-events-none animate-pulse" />

                            {/* Crystalline Translucent Glass Shell */}
                            <div className="relative w-full h-full rounded-full backdrop-blur-md bg-gradient-to-b from-indigo-200/20 via-indigo-600/25 to-indigo-950/60 border border-indigo-300/60 shadow-[inset_0_0_22px_rgba(165,180,252,0.45),inset_0_-10px_18px_rgba(15,10,45,0.8),0_0_28px_rgba(99,102,241,0.7),0_0_55px_rgba(129,140,248,0.4),0_10px_24px_rgba(0,0,0,0.85)] flex items-center justify-center overflow-hidden">
                                
                                {/* Inner Dormant Quantum Energy Core */}
                                <motion.div
                                    animate={{
                                        scale: [0.85, 1.05, 0.85],
                                        opacity: [0.4, 0.75, 0.4],
                                    }}
                                    transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                                    className="absolute w-12 h-12 rounded-full bg-[radial-gradient(circle,_#A5B4FC_0%,_#6366F1_40%,_#1E1B4B_100%)] shadow-[0_0_20px_#6366F1] blur-[1px]"
                                />

                                {/* Inner Glowing Cyan Runic Resonance Wave */}
                                <motion.span
                                    animate={{
                                        opacity: [0.4, 0.85, 0.4],
                                        scale: [0.92, 1.08, 0.92],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2.6,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-2 rounded-full border border-cyan-300/60 pointer-events-none"
                                />

                                {/* Translucent Glass Specular Reflection Dome */}
                                <div className="absolute top-1 left-2.5 right-2.5 h-6 rounded-[50%] bg-gradient-to-b from-white/70 via-indigo-200/25 to-transparent pointer-events-none" />
                                <div className="absolute top-2.5 left-4 w-2.5 h-1.5 rounded-[50%] bg-white/85 blur-[0.2px] rotate-[-25deg] pointer-events-none" />

                                {/* Bottom Caustic Reflection Pool */}
                                <div className="absolute bottom-1 left-3 right-3 h-4 rounded-[50%] bg-gradient-to-t from-cyan-400/30 via-indigo-400/10 to-transparent pointer-events-none blur-[1px]" />

                                {/* Holographic Cyan Cyber-Seal Lock Emblem */}
                                <div className="relative z-10 flex flex-col items-center justify-center text-cyan-200">
                                    <motion.div
                                        animate={{ y: [0, -2, 0] }}
                                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                    >
                                        <Lock
                                            className="w-7 h-7 text-cyan-200 drop-shadow-[0_0_12px_#22d3ee,0_0_22px_#06b6d4]"
                                            weight="fill"
                                        />
                                    </motion.div>
                                    <span className="text-[8px] font-black uppercase tracking-wider text-cyan-100 bg-[#0F0D2E]/90 px-2 py-0.5 rounded-full border border-cyan-400/60 shadow-[0_0_10px_#06b6d4] mt-0.5 backdrop-blur-sm">
                                        Nivel {level.number}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stars Badge if completed */}
                    {isCompleted && stars > 0 && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-950/95 border-2 border-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.9)] z-20 backdrop-blur-sm">
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
