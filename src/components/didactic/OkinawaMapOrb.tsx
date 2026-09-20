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
            {/* Outer Ethereal Ki Aura */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-amber-600/30 blur-lg pointer-events-none animate-pulse" />

            {/* 3D Photorealistic Glass Orb Asset */}
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.4)] border border-amber-300/40">
                <Image
                    src="/images/didactic/okinawa_orb_3d.jpg"
                    alt="Mapa 3D de Okinawa - Cuna del Karate-Do"
                    fill
                    sizes="(max-width: 768px) 96px, 120px"
                    className={`object-cover transform transition-transform duration-500 group-hover:scale-110 ${
                        isCompleted ? "brightness-110" : "brightness-100"
                    }`}
                    priority
                />

                {/* Animated Pulsing Ruby Beacon on Shuri / Naha (Coordinates: ~39% from left, ~59% from top) */}
                <div
                    className="absolute pointer-events-none z-10"
                    style={{ left: "39%", top: "59%", transform: "translate(-50%, -50%)" }}
                >
                    {/* Shockwave ripple */}
                    <span className="absolute -inset-2 rounded-full bg-red-500/60 animate-ping" />
                    <span className="absolute -inset-1 rounded-full bg-rose-400/80 animate-pulse" />
                    {/* Glowing Core */}
                    <span className="relative block w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444,0_0_14px_#f87171] border border-white" />
                </div>

                {/* Dynamic Specular Glass Reflection Sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/40 pointer-events-none mix-blend-overlay" />
                <div className="absolute top-1 left-3 w-7 h-3 rounded-[50%] bg-white/40 blur-[1px] -rotate-25 pointer-events-none" />
            </div>

            {/* Ethereal Floating Badge: Okinawa • N.1 */}
            {showLabel && (
                <motion.div
                    initial={{ y: 2, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/90 border border-amber-400/80 shadow-[0_4px_12px_rgba(0,0,0,0.9),0_0_10px_rgba(245,158,11,0.5)] backdrop-blur-md shrink-0 whitespace-nowrap z-20"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-300 font-serif leading-none drop-shadow-sm">
                        Okinawa {levelNumber ? `• N.${levelNumber}` : ""}
                    </span>
                </motion.div>
            )}
        </div>
    );
}

export default OkinawaMapOrb;
