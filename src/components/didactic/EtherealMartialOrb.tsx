"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Level } from "@/types/didactica";
import { Star, CheckCircle } from "@phosphor-icons/react";
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
 * Ethereal 3D Volumetric Martial Orbs (Desopilantes / Místicas)
 * Replaces flat or plasticky buttons with high-end, luminous crystal spheres:
 * - "Historia del Karate-Do": 3D topographic Okinawa island floating inside a glass sphere.
 * - Active Unlocked Levels: Swirling golden Ki energy crystal orb with floating icon & aura.
 * - Completed Levels: Mastered jade & gold celestial orb with victorious radiance & stars.
 * - Locked Levels: Dormant obsidian smoky quartz sphere with mystical locked seal.
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
            {/* Ground Contact Shadow */}
            <div
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 md:w-20 h-4 rounded-[50%] blur-md pointer-events-none transition-all duration-300 ${
                    isUnlocked ? "bg-black/90 group-hover:scale-90 group-hover:blur-lg" : "bg-black/60"
                }`}
            />

            {/* Interactive Motion Container */}
            <motion.button
                whileHover={{ scale: isUnlocked ? 1.08 : 1, y: isUnlocked ? -4 : 0 }}
                whileTap={{ scale: isUnlocked ? 0.94 : 1, y: isUnlocked ? 2 : 0 }}
                onClick={() => {
                    if (isUnlocked && onClick) onClick();
                }}
                disabled={!isUnlocked}
                className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    !isUnlocked ? "cursor-not-allowed opacity-80" : ""
                }`}
            >
                {/* 1. SPECIAL OKINAWA ORB */}
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
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[0.5px] rounded-full z-30">
                                <CheckCircle className="w-8 h-8 md:w-9 md:h-9 text-emerald-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" weight="fill" />
                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider text-emerald-300 leading-tight bg-black/85 px-2 py-0.5 rounded-full border border-emerald-500/60 shadow-md mt-0.5">
                                    Superado
                                </span>
                            </div>
                        )}
                    </div>
                ) : isCompleted ? (
                    /* 2. COMPLETED MASTERED JADE & GOLD CELESTIAL ORB */
                    <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_25px_rgba(16,185,129,0.5)] border-2 border-emerald-400/60">
                        {/* Mastered Jade Orb Texture */}
                        <Image
                            src="/images/didactic/martial_orb_completed.jpg"
                            alt="Nivel Superado"
                            fill
                            sizes="(max-width: 768px) 96px, 120px"
                            className="object-cover"
                        />

                        {/* Inner Checkmark Emblem */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <CheckCircle className="w-8 h-8 md:w-9 md:h-9 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" weight="fill" />
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider text-emerald-200 leading-tight bg-black/80 px-2 py-0.5 rounded-full border border-emerald-400/50 shadow-sm mt-0.5 backdrop-blur-sm">
                                Superado
                            </span>
                        </div>

                        {/* Glass Caustic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none" />
                    </div>
                ) : isUnlocked ? (
                    /* 3. ACTIVE ETHEREAL GOLDEN KI ORB */
                    <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.85),0_0_25px_rgba(245,158,11,0.5)] border-2 border-amber-300/80">
                        {/* Swirling Golden Ki Orb Texture */}
                        <Image
                            src="/images/didactic/martial_orb_gold.jpg"
                            alt={level.title}
                            fill
                            sizes="(max-width: 768px) 96px, 120px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Floating Martial Icon & Level Pill */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <span className="text-2xl md:text-3xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] select-none">
                                {level.icon}
                            </span>
                            <span
                                className={`text-[8px] md:text-[9px] font-black uppercase tracking-wider leading-tight px-2 py-0.5 rounded-full shadow-md mt-0.5 backdrop-blur-md ${
                                    isDan
                                        ? "bg-black/85 text-amber-300 border border-amber-500/50"
                                        : "bg-black/80 text-amber-200 border border-amber-400/50"
                                }`}
                            >
                                Nivel {level.number}
                            </span>
                        </div>

                        {/* Active Pulsing Ki Energy Ring */}
                        <span className="absolute -inset-1 rounded-full border-2 border-kuma-gold/70 animate-ping pointer-events-none" />

                        {/* Glass Specular Glare */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/35 pointer-events-none" />
                    </div>
                ) : (
                    /* 4. LOCKED DORMANT OBSIDIAN CRYSTAL ORB */
                    <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.7)] border border-zinc-700/50">
                        <Image
                            src="/images/didactic/martial_orb_locked.jpg"
                            alt="Nivel Bloqueado"
                            fill
                            sizes="(max-width: 768px) 96px, 120px"
                            className="object-cover grayscale-[30%]"
                        />
                        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                    </div>
                )}

                {/* Stars Badge if completed */}
                {isCompleted && stars > 0 && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-zinc-950/95 border border-kuma-gold/80 shadow-xl z-20 backdrop-blur-md">
                        {[1, 2, 3].map((s) => (
                            <Star
                                key={s}
                                className={`w-3 h-3 ${
                                    s <= stars
                                        ? "text-kuma-gold fill-kuma-gold filter drop-shadow-[0_0_4px_#eab308]"
                                        : "text-zinc-600"
                                }`}
                                weight="fill"
                            />
                        ))}
                    </div>
                )}
            </motion.button>
        </div>
    );
}

export default EtherealMartialOrb;
