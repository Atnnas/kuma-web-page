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
            {/* Outer Radioactive Cherenkov Plasma Aura */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-cyan-400/50 via-sky-300/50 to-blue-600/40 blur-2xl pointer-events-none animate-pulse" />

            {/* Orbiting Cherenkov Cyan Ring */}
            <div className="absolute -inset-4 pointer-events-none flex items-center justify-center [perspective:600px] z-30">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
                    className="relative w-full h-full rounded-full border border-cyan-300/60 border-dashed [transform:rotateX(62deg)] shadow-[0_0_12px_rgba(0,245,255,0.4)]"
                >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff,0_0_20px_#00f5ff] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 animate-ping" />
                    </div>
                </motion.div>
            </div>

            {/* Translucent Crystalline Glass Shell */}
            <div className="relative w-full h-full rounded-full overflow-hidden backdrop-blur-md bg-gradient-to-b from-cyan-100/25 via-sky-500/35 to-[#002B4D]/80 border border-cyan-200/80 shadow-[inset_0_0_25px_rgba(180,240,255,0.6),inset_0_-12px_22px_rgba(0,35,70,0.85),0_0_35px_rgba(0,245,255,0.95),0_0_70px_rgba(0,136,255,0.6),0_14px_30px_rgba(0,0,0,0.85)]">
                {/* Sweeping Ocean Light Sheen */}
                <motion.div
                    animate={{ x: ["-160%", "180%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 2.8,
                        ease: "easeInOut",
                        repeatDelay: 1.2,
                    }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent skew-x-[-28deg] pointer-events-none z-10"
                />

                <Image
                    src="/images/didactic/okinawa_orb_3d.jpg"
                    alt="Mapa 3D de Okinawa - Cuna del Karate-Do"
                    fill
                    sizes="(max-width: 768px) 96px, 120px"
                    className={`object-cover transform transition-transform duration-500 group-hover:scale-110 mix-blend-screen opacity-90 ${
                        isCompleted ? "brightness-120" : "brightness-110"
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

                {/* Bottom Caustic Refraction Pool */}
                <div className="absolute bottom-1 left-3 right-3 h-5 rounded-[50%] bg-gradient-to-t from-cyan-300/50 via-sky-400/20 to-transparent pointer-events-none blur-[1px] z-10" />

                {/* Upper Translucent Specular Glass Dome */}
                <div className="absolute top-1 left-2.5 right-2.5 h-7 rounded-[50%] bg-gradient-to-b from-white/90 via-white/30 to-transparent pointer-events-none z-20" />
                <div className="absolute top-2.5 left-4 w-3 h-1.5 rounded-[50%] bg-white/95 blur-[0.2px] rotate-[-25deg] pointer-events-none z-20" />
            </div>

            {/* Ethereal Floating Badge: Okinawa • N.1 */}
            {showLabel && (
                <motion.div
                    initial={{ y: 2, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#003B66]/90 border border-sky-300 shadow-[0_4px_12px_rgba(0,0,0,0.8),0_0_10px_rgba(28,176,246,0.5)] backdrop-blur-md shrink-0 whitespace-nowrap z-20"
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
