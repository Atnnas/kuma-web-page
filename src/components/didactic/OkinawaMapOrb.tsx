"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface OkinawaMapOrbProps {
    className?: string;
    showLabel?: boolean;
    levelNumber?: number;
    isCompleted?: boolean;
}

/**
 * Ultra-Premium 3D Ethereal Crystal Orb of Okinawa (沖縄本島 - Okinawa Hontō)
 * Features a golden 3D topographic relief map of Okinawa floating inside a luminous crystal sphere,
 * with realistic glass refraction, caustics, gold-engraved rim, and a pulsing Shuri/Naha beacon.
 */
export function OkinawaMapOrb({
    className = "w-full h-full",
    showLabel = true,
    levelNumber = 1,
    isCompleted = false,
}: OkinawaMapOrbProps) {
    return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
            {/* Outer Luminous Ocean Ki Aura */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-sky-400/30 via-cyan-300/30 to-amber-400/20 blur-lg pointer-events-none animate-pulse" />

            {/* 3D Tactile Arcade Frame & Photorealistic Relief */}
            <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#1CB0F6] via-[#0288D1] to-[#01579B] border-t-2 border-t-sky-100 border-x-2 border-x-sky-300 border-b-[6px] border-b-[#003B66] shadow-[0_12px_26px_rgba(0,0,0,0.65),0_0_25px_rgba(28,176,246,0.5)]">
                {/* Sweeping Ocean Light Sheen */}
                <motion.div
                    animate={{ x: ["-150%", "170%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                        repeatDelay: 1.5,
                    }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-[-25deg] pointer-events-none z-10"
                />

                <Image
                    src="/images/didactic/okinawa_orb_3d.jpg"
                    alt="Mapa 3D de Okinawa - Cuna del Karate-Do"
                    fill
                    sizes="(max-width: 768px) 96px, 120px"
                    className={`object-cover transform transition-transform duration-500 group-hover:scale-110 mix-blend-screen opacity-95 ${
                        isCompleted ? "brightness-115" : "brightness-105"
                    }`}
                    priority
                />

                {/* Animated Expanding Ocean Radar Ripples from Shuri / Naha */}
                <div
                    className="absolute pointer-events-none z-10"
                    style={{ left: "39%", top: "59%", transform: "translate(-50%, -50%)" }}
                >
                    {/* Continuous outward expanding radar shockwaves */}
                    <motion.span
                        animate={{ scale: [1, 3.5], opacity: [0.9, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
                        className="absolute -inset-2 rounded-full border border-red-400"
                    />
                    <motion.span
                        animate={{ scale: [1, 4.5], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut", delay: 0.7 }}
                        className="absolute -inset-2 rounded-full border border-amber-300"
                    />
                    {/* Shockwave ripple */}
                    <span className="absolute -inset-2.5 rounded-full bg-red-500/70 animate-ping" />
                    <span className="absolute -inset-1 rounded-full bg-rose-400/90 animate-pulse" />
                    {/* Glowing Core */}
                    <span className="relative block w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444,0_0_16px_#f87171] border border-white" />
                </div>

                {/* Upper Curved Gloss / Acrylic Specular Reflection */}
                <div className="absolute top-1.5 left-3 right-3 h-7 rounded-[50%] bg-gradient-to-b from-white/80 via-white/25 to-transparent pointer-events-none z-20" />
                <div className="absolute top-2.5 left-4 w-2.5 h-1.5 rounded-[50%] bg-white/90 blur-[0.4px] rotate-[-25deg] pointer-events-none z-20" />
            </div>

            {/* Ethereal Floating Badge: Okinawa • N.1 */}
            {showLabel && (
                <motion.div
                    initial={{ y: 2, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#003B66] border border-sky-300 shadow-[0_4px_12px_rgba(0,0,0,0.8),0_0_10px_rgba(28,176,246,0.5)] backdrop-blur-md shrink-0 whitespace-nowrap z-20"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-sky-100 font-serif leading-none drop-shadow-sm">
                        Okinawa {levelNumber ? `• N.${levelNumber}` : ""}
                    </span>
                </motion.div>
            )}
        </div>
    );
}

export default OkinawaMapOrb;
