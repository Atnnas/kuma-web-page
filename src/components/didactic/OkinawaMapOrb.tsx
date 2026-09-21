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
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_35px_rgba(14,165,233,0.85),0_12px_26px_rgba(0,0,0,0.85)] border border-amber-300/60 flex items-center justify-center">
                <Image
                    src="/images/didactic/juzu_bead_master.jpg"
                    alt="Cuenta Maestra Oyadama de Okinawa - Cuna del Karate-Do"
                    fill
                    sizes="(max-width: 768px) 96px, 120px"
                    className={`object-cover transform transition-transform duration-500 group-hover:scale-108 ${
                        isCompleted ? "brightness-110" : "brightness-100"
                    }`}
                    priority
                />

                {/* Brillo Sutil Especular de Laca Esférica */}
                <div className="absolute top-1 left-2.5 right-2.5 h-6 rounded-[50%] bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none z-20" />
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
