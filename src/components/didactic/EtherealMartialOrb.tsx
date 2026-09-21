"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Level } from "@/types/didactica";
import { Star } from "@phosphor-icons/react";
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
 * Cuentas Sagradas del Rosario Budista de Budo (Juzu / Nenju - 数珠)
 * - Fotorrealismo 3D cinematográfico con texturas de madera de sándalo sagrado, jade imperial y ébano.
 * - Cordón de seda trenzada de monje guerrero (Kumihimo) y herrajes dorados de templo (Kanagu).
 * - Cero aros desfasados o círculos duplicados a la derecha.
 * - Activo: Cuenta de Sándalo Sagrado con kanji dorado tallado e iluminado con Ki interior.
 * - Superado: Cuenta de Jade Imperial (Hisui) con círculo Zen Enso dorado tallado.
 * - Bloqueado: Cuenta de Ébano Monástico con sello talismánico en neón cian.
 * - Okinawa: La Gran Cuenta Maestra (Oyadama 親玉) en lapislázuli con relieve dorado.
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

    // Levitación orgánica y serena de las cuentas de rosario
    const floatDelay = ((level.number || 1) % 4) * 0.45;
    const floatDuration = 3.6 + ((level.number || 1) % 3) * 0.35;

    return (
        <div className="relative flex flex-col items-center select-none group">
            {/* Sombra de Contacto Esférica de la Cuenta sobre el Tatami */}
            <motion.div
                animate={{
                    scale: isUnlocked ? [1, 0.8, 1] : [1, 0.88, 1],
                    opacity: isUnlocked ? [0.85, 0.45, 0.85] : [0.6, 0.4, 0.6],
                    filter: ["blur(4px)", "blur(7px)", "blur(4px)"],
                }}
                transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay,
                }}
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 md:w-24 h-4 rounded-[50%] pointer-events-none ${
                    isCompleted
                        ? "bg-emerald-600/35"
                        : isUnlocked
                        ? "bg-amber-600/40"
                        : "bg-indigo-950/45"
                }`}
            />

            {/* Contenedor Levitante de la Cuenta de Rosario */}
            <motion.div
                animate={{
                    y: isUnlocked ? [0, -8, 0] : [0, -3, 0],
                }}
                transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay,
                }}
                className="relative flex flex-col items-center"
            >
                {/* Botón Táctil de la Cuenta Sagrada */}
                <motion.button
                    whileHover={{
                        scale: 1.12,
                        y: -4,
                        transition: { type: "spring", stiffness: 450, damping: 15 },
                    }}
                    whileTap={{
                        scale: 0.94,
                        y: 3,
                        transition: { type: "spring", stiffness: 500, damping: 16 },
                    }}
                    onClick={() => {
                        if (isUnlocked && onClick) onClick();
                    }}
                    disabled={!isUnlocked}
                    className={`relative rounded-full flex items-center justify-center cursor-pointer focus:outline-none ${
                        !isUnlocked ? "cursor-not-allowed" : "active:outline-none"
                    }`}
                    style={{ width: "98px", height: "98px" }}
                >
                    {/* ========================================================= */}
                    {/* 1. CUENTA MAESTRA OYADAMA (OKINAWA N.1)                   */}
                    {/* ========================================================= */}
                    {isOkinawa ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <OkinawaMapOrb
                                className="w-full h-full"
                                showLabel={true}
                                levelNumber={level.number}
                                isCompleted={isCompleted}
                            />
                        </div>
                    ) : isCompleted ? (
                        /* ===================================================== */
                        /* 2. COMPLETED: CUENTA DE JADE IMPERIAL SAGRADO (翡翠)  */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full flex items-center justify-center">
                            {/* Halo Espiritual de Jade */}
                            <div className="absolute -inset-3 rounded-full bg-emerald-500/35 blur-xl pointer-events-none animate-pulse" />

                            {/* Cuenta 3D Fotorrealista de Jade con Enso y Cordón de Monje */}
                            <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.8),0_12px_24px_rgba(0,0,0,0.85)] border border-emerald-300/40">
                                <Image
                                    src="/images/didactic/juzu_bead_completed.jpg"
                                    alt="Cuenta de Rosario Budista de Jade - Superado"
                                    fill
                                    sizes="(max-width: 768px) 96px, 110px"
                                    className="object-cover transform transition-transform duration-500 group-hover:scale-108"
                                    priority
                                />

                                {/* Brillo Sutil Especular de Laca */}
                                <div className="absolute top-1 left-2.5 right-2.5 h-6 rounded-[50%] bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />
                            </div>

                            {/* Placa Sagrada de Superado */}
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-wider text-white leading-tight bg-[#022C22]/95 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-[0_0_10px_#10B981] whitespace-nowrap z-20 backdrop-blur-sm">
                                Superado
                            </span>
                        </div>
                    ) : isUnlocked ? (
                        /* ===================================================== */
                        /* 3. ACTIVE: CUENTA DE SÁNDALO SAGRADO & ÁMBAR (SATORI) */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full flex items-center justify-center">
                            {/* Halo Espiritual de Ki Cálido */}
                            <div className="absolute -inset-3.5 rounded-full bg-gradient-to-r from-amber-500/45 via-yellow-400/50 to-orange-600/45 blur-xl pointer-events-none animate-pulse" />

                            {/* Cuenta 3D Fotorrealista de Sándalo Sagrado con Cordón Dorado */}
                            <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.85),0_12px_26px_rgba(0,0,0,0.85)] border border-yellow-200/50">
                                <Image
                                    src="/images/didactic/juzu_bead_active.jpg"
                                    alt={`Cuenta de Rosario Budista de Sándalo - Nivel ${level.number}`}
                                    fill
                                    sizes="(max-width: 768px) 96px, 110px"
                                    className="object-cover transform transition-transform duration-500 group-hover:scale-108"
                                    priority
                                />

                                {/* Brillo Sutil Especular de Laca Urushi */}
                                <div className="absolute top-1 left-2.5 right-2.5 h-6 rounded-[50%] bg-gradient-to-b from-white/45 via-amber-100/10 to-transparent pointer-events-none" />

                                {/* Ondas Suaves de Ki */}
                                <span className="absolute -inset-1 rounded-full border border-yellow-300/60 animate-ping pointer-events-none" />
                            </div>

                            {/* Placa Sagrada Cinabrio con Nivel */}
                            <span
                                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-black uppercase tracking-wider leading-tight px-2.5 py-0.5 rounded-full shadow-[0_0_10px_#fde047] whitespace-nowrap z-20 backdrop-blur-sm ${
                                    isDan
                                        ? "bg-black text-amber-200 border border-amber-300"
                                        : "bg-[#7C1D05]/95 text-amber-100 border border-amber-300/80"
                                }`}
                            >
                                Nivel {level.number}
                            </span>
                        </div>
                    ) : (
                        /* ===================================================== */
                        /* 4. LOCKED: CUENTA DE ÉBANO & SELLO TALISMÁNICO CIAN   */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full flex items-center justify-center">
                            {/* Halo Místico Violeta/Cian */}
                            <div className="absolute -inset-2.5 rounded-full bg-indigo-600/25 blur-lg pointer-events-none" />

                            {/* Cuenta 3D Fotorrealista de Ébano y Sello Rúnico */}
                            <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.5),0_10px_20px_rgba(0,0,0,0.85)] border border-indigo-400/30 opacity-95">
                                <Image
                                    src="/images/didactic/juzu_bead_locked.jpg"
                                    alt={`Cuenta de Rosario Budista Sellada - Nivel ${level.number}`}
                                    fill
                                    sizes="(max-width: 768px) 96px, 110px"
                                    className="object-cover brightness-95"
                                    priority
                                />

                                {/* Brillo Especular */}
                                <div className="absolute top-1 left-2.5 right-2.5 h-6 rounded-[50%] bg-gradient-to-b from-white/30 via-transparent to-transparent pointer-events-none" />
                            </div>

                            {/* Sello Talismánico con Nivel */}
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-wider text-cyan-100 bg-[#0B0A1C]/95 px-2 py-0.5 rounded-full border border-cyan-400/50 shadow-[0_0_8px_#06b6d4] whitespace-nowrap z-20 backdrop-blur-sm">
                                Nivel {level.number}
                            </span>
                        </div>
                    )}
                </motion.button>

                {/* BARRA DE MAESTRÍA DE 3 ESTRELLAS (DEBAJO DE CADA NIVEL) */}
                <div className="mt-2.5 flex items-center justify-center">
                    <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
                            stars === 3
                                ? "bg-gradient-to-r from-amber-950/90 via-zinc-950/95 to-amber-950/90 border-2 border-yellow-400 shadow-[0_0_14px_rgba(250,204,21,0.6)]"
                                : stars > 0
                                ? "bg-zinc-950/90 border border-amber-400/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]"
                                : isUnlocked
                                ? "bg-zinc-950/80 border border-white/10"
                                : "bg-zinc-950/60 border border-white/5 opacity-60"
                        }`}
                        title={
                            stars === 3
                                ? "¡Maestría Total (3/3 estrellas)!"
                                : `Progreso de Maestría: ${stars}/3 estrellas. Pasa este nivel ${3 - stars} ${
                                      3 - stars === 1 ? "vez más" : "veces más"
                                  } para alcanzar la maestría.`
                        }
                    >
                        {[1, 2, 3].map((starIdx) => {
                            const isEarned = starIdx <= stars;
                            return (
                                <Star
                                    key={starIdx}
                                    className={`w-3.5 h-3.5 transition-all duration-300 ${
                                        isEarned
                                            ? "text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_6px_#fde047]"
                                            : "text-zinc-600 fill-zinc-800"
                                    }`}
                                    weight={isEarned ? "fill" : "bold"}
                                />
                            );
                        })}
                        <span
                            className={`text-[9px] font-black tracking-wider ml-0.5 ${
                                stars === 3
                                    ? "text-yellow-300 drop-shadow-[0_0_4px_#fde047]"
                                    : stars > 0
                                    ? "text-amber-200/90"
                                    : "text-zinc-500"
                            }`}
                        >
                            {stars}/3
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default EtherealMartialOrb;
