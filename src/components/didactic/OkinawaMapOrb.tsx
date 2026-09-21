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
            {/* Halo de Energía Espiritual de la Cuenta Maestra (Oyadama) */}
            <div className="absolute -inset-3.5 rounded-full bg-gradient-to-tr from-cyan-400/40 via-sky-300/45 to-blue-600/35 blur-xl pointer-events-none animate-pulse" />

            {/* Ojal Superior Dorado del Cordón (Kanagu de Oyadama) */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-2 rounded-t-md bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 border border-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.7)] z-30" />
            {/* Ojal Inferior Dorado del Cordón */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-2 rounded-b-md bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 border border-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.7)] z-30" />

            {/* Cuerpo Esférico de la Cuenta Maestra de Lapis Lazuli & Oro */}
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[radial-gradient(circle_at_32%_26%,_#E0F2FE_0%,_#38BDF8_25%,_#0284C7_55%,_#075985_80%,_#032035_100%)] border-t border-t-white/80 border-b-[5px] border-b-[#021524] shadow-[0_0_35px_rgba(14,165,233,0.85),0_0_65px_rgba(2,132,199,0.5),0_12px_26px_rgba(0,0,0,0.85)] flex items-center justify-center">
                
                {/* Cordón Sagrado Central */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-amber-300 via-yellow-100 to-amber-400 shadow-[0_0_6px_#fde047] opacity-60 pointer-events-none z-10" />

                {/* Barrido de Brillo de Laca Oceánica */}
                <motion.div
                    animate={{ x: ["-160%", "180%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                        repeatDelay: 1.5,
                    }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-28deg] pointer-events-none z-20"
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
                    className="absolute pointer-events-none z-20"
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

                {/* Reflejo Especular Superior de Laca Esférica */}
                <div className="absolute top-1 left-2.5 right-2.5 h-6 rounded-[50%] bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none z-30" />
                <div className="absolute top-2.5 left-4 w-3 h-1.5 rounded-[50%] bg-white blur-[0.2px] rotate-[-25deg] pointer-events-none z-30" />
            </div>

            {/* Placa Sagrada de la Cuenta Maestra de Okinawa */}
            {showLabel && (
                <motion.div
                    initial={{ y: 2, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#032035]/95 border border-amber-300/80 shadow-[0_4px_12px_rgba(0,0,0,0.8),0_0_10px_rgba(245,158,11,0.4)] backdrop-blur-md shrink-0 whitespace-nowrap z-30"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-200 font-serif leading-none drop-shadow-sm">
                        Okinawa {levelNumber ? `• N.${levelNumber}` : ""}
                    </span>
                </motion.div>
            )}
        </div>
    );
}

export default OkinawaMapOrb;
