"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Level } from "@/types/didactica";
import { Star, Sparkle } from "@phosphor-icons/react";
import { OkinawaMapOrb } from "./OkinawaMapOrb";

interface FloatingSteppingStoneProps {
    level: Level;
    isCompleted: boolean;
    isUnlocked: boolean;
    isDan?: boolean;
    stars?: number;
    onClick?: () => void;
    hasNewQuestions?: boolean;
}

/**
 * Piedras Flotantes de Estanque Zen (Tobi-Ishi 飛び石)
 * 
 * - Las unidades flotan directamente sobre el agua del estanque de peces Koi sin cajas envolventes.
 * - Geometría orgánica de roca de río pulida (basalto volcánico, jade imperial y pizarra con musgo).
 * - Ondas concéntricas de agua (Hamon 波紋) que se expanden en la superficie del estanque.
 * - Sombra submarina sumergida y anillo de refracción acuática.
 * - Flotabilidad biofísica suave (oscilación vertical y leve inclinación con el movimiento del agua).
 * - Grabado en bajo relieve de caracteres sagrados iluminados con Ki interior.
 */
export function FloatingSteppingStone({
    level,
    isCompleted,
    isUnlocked,
    isDan = false,
    stars = 0,
    onClick,
    hasNewQuestions = false,
}: FloatingSteppingStoneProps) {
    const isOkinawa = level.id === "level-karategi" || level.icon === "okinawa";

    // Variación orgánica de flotación según el nivel
    const floatDelay = ((level.number || 1) % 5) * 0.4;
    const floatDuration = 4.2 + ((level.number || 1) % 3) * 0.4;

    return (
        <div className="relative flex flex-col items-center select-none group my-3">
            {/* ========================================================= */}
            {/* 1. ONDAS DE AGUA CONCÉNTRICAS (HAMON 波紋) EN EL ESTANQUE  */}
            {/* ========================================================= */}
            {/* Onda 1: Expansión de agua amplia */}
            <motion.div
                animate={{
                    scale: [0.85, 1.45, 1.85],
                    opacity: isUnlocked ? [0.6, 0.25, 0] : [0.3, 0.1, 0],
                }}
                transition={{
                    duration: isUnlocked ? 3.6 : 5.0,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: floatDelay,
                }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] pointer-events-none w-36 h-28 border ${
                    isCompleted
                        ? "border-emerald-400/40"
                        : isUnlocked
                        ? "border-amber-400/50"
                        : "border-cyan-500/20"
                }`}
            />

            {/* Onda 2: Expansión media desfasada */}
            <motion.div
                animate={{
                    scale: [0.9, 1.25, 1.55],
                    opacity: isUnlocked ? [0.55, 0.2, 0] : [0.25, 0.08, 0],
                }}
                transition={{
                    duration: isUnlocked ? 3.6 : 5.0,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: floatDelay + (isUnlocked ? 1.8 : 2.5),
                }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] pointer-events-none w-32 h-24 border ${
                    isCompleted
                        ? "border-emerald-300/50"
                        : isUnlocked
                        ? "border-yellow-300/60"
                        : "border-cyan-400/25"
                }`}
            />

            {/* Anillo de contacto acuático inmediato (espuma y tensión superficial) */}
            <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-24 rounded-[48%_52%_51%_49%/53%_47%_52%_48%] pointer-events-none border blur-[0.5px] transition-all duration-500 ${
                    isCompleted
                        ? "border-emerald-300/60 shadow-[0_0_15px_rgba(52,211,153,0.35)]"
                        : isUnlocked
                        ? "border-amber-300/70 shadow-[0_0_18px_rgba(251,191,36,0.45)]"
                        : "border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                }`}
            />

            {/* Sombra submarina sumergida en el agua del estanque */}
            <motion.div
                animate={{
                    scale: isUnlocked ? [1, 0.94, 1] : [1, 0.96, 1],
                    opacity: isUnlocked ? [0.85, 0.6, 0.85] : [0.6, 0.45, 0.6],
                }}
                transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay,
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[35%] w-28 md:w-32 h-20 rounded-[50%] bg-black/80 blur-md pointer-events-none"
            />

            {/* ========================================================= */}
            {/* 2. CUERPO FLOTANTE DE LA PIEDRA ZEN (TOBI-ISHI)            */}
            {/* ========================================================= */}
            <motion.div
                animate={{
                    y: isUnlocked ? [0, -7, 0] : [0, -3, 0],
                    rotate: isUnlocked ? [-0.8, 0.8, -0.8] : [0, 0, 0],
                }}
                transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay,
                }}
                className="relative flex flex-col items-center"
            >
                {/* INSIGNIA FLOTANTE: NUEVAS PREGUNTAS EN ESTA PIEDRA */}
                {hasNewQuestions && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [1, 1.08, 1], opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[8px] font-black uppercase tracking-wider shadow-[0_0_14px_rgba(250,204,21,0.9)] whitespace-nowrap flex items-center gap-1 pointer-events-none"
                    >
                        <Sparkle className="w-2.5 h-2.5 text-black" weight="fill" />
                        <span>¡Nuevas Preguntas!</span>
                    </motion.div>
                )}

                {/* BOTÓN TÁCTIL DE LA PIEDRA */}
                <motion.button
                    whileHover={{
                        scale: 1.1,
                        y: -3,
                        transition: { type: "spring", stiffness: 450, damping: 15 },
                    }}
                    whileTap={{
                        scale: 0.93,
                        y: 3,
                        transition: { type: "spring", stiffness: 500, damping: 16 },
                    }}
                    onClick={() => {
                        if (isUnlocked && onClick) onClick();
                    }}
                    disabled={!isUnlocked}
                    className={`relative flex items-center justify-center cursor-pointer focus:outline-none transition-shadow ${
                        !isUnlocked ? "cursor-not-allowed" : "active:outline-none"
                    }`}
                    style={{ width: "104px", height: "104px" }}
                >
                    {/* ========================================================= */}
                    {/* 1. PIEDRA MAESTRA ISLA DE OKINAWA                         */}
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
                        /* 2. PIEDRA SUPERADA: JADE IMPERIAL CON ENSO DORADO     */
                        /* ===================================================== */
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Halo Acuático Esmeralda en el Agua */}
                            <div className="absolute -inset-3 rounded-full bg-emerald-500/30 blur-xl pointer-events-none animate-pulse" />

                            {/* Contorno orgánico asimétrico de roca de río */}
                            <div className="relative w-full h-full rounded-[47%_53%_52%_48%/54%_46%_53%_47%] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.85),0_0_25px_rgba(16,185,129,0.7)] border-2 border-emerald-300/50">
                                <Image
                                    src="/images/didactic/tobiishi_stone_completed.jpg"
                                    alt={`Piedra de Jade Imperial Superada - Nivel ${level.number}`}
                                    fill
                                    sizes="(max-width: 768px) 104px, 120px"
                                    className="object-cover transform transition-transform duration-500 group-hover:scale-108"
                                    priority
                                />

                                {/* Brillo Especular de Agua en Roca Mojada */}
                                <div className="absolute top-1.5 left-3 right-3 h-6 rounded-[50%] bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />
                            </div>

                            {/* Sello Tallado de Oro "Superado" */}
                            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-wider text-emerald-100 leading-tight bg-gradient-to-r from-emerald-950 via-[#022c22] to-emerald-950 px-3 py-0.5 rounded-full border border-emerald-400 shadow-[0_0_12px_#10b981] whitespace-nowrap z-20 backdrop-blur-md">
                                Superado
                            </span>
                        </div>
                    ) : isUnlocked ? (
                        /* ===================================================== */
                        /* 3. PIEDRA ACTIVA: BASALTO VOLCÁNICO CON KI DORADO     */
                        /* ===================================================== */
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Resplandor Cálido Dorado en el Agua */}
                            <div className="absolute -inset-3.5 rounded-full bg-gradient-to-r from-amber-500/40 via-yellow-400/45 to-orange-600/40 blur-xl pointer-events-none animate-pulse" />

                            {/* Contorno orgánico asimétrico de roca de río */}
                            <div className="relative w-full h-full rounded-[49%_51%_48%_52%/52%_48%_53%_47%] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.8)] border-2 border-yellow-300/60">
                                <Image
                                    src="/images/didactic/tobiishi_stone_active.jpg"
                                    alt={`Piedra Flotante Activa - Nivel ${level.number}`}
                                    fill
                                    sizes="(max-width: 768px) 104px, 120px"
                                    className="object-cover transform transition-transform duration-500 group-hover:scale-108"
                                    priority
                                />

                                {/* Brillo Especular de Agua Mojada */}
                                <div className="absolute top-1.5 left-3 right-3 h-6 rounded-[50%] bg-gradient-to-b from-white/45 via-amber-100/10 to-transparent pointer-events-none" />

                                {/* Pulso de Tensión de Agua */}
                                <span className="absolute -inset-1 rounded-[50%] border border-yellow-300/50 animate-ping pointer-events-none" />
                            </div>

                            {/* Sello de Cinabrio y Oro con Nivel */}
                            <span
                                className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-black uppercase tracking-wider leading-tight px-3 py-0.5 rounded-full shadow-[0_0_12px_#fde047] whitespace-nowrap z-20 backdrop-blur-md ${
                                    isDan
                                        ? "bg-black text-amber-200 border border-amber-300"
                                        : "bg-gradient-to-r from-[#7C1D05] via-[#991B1B] to-[#7C1D05] text-amber-100 border border-amber-300/80"
                                }`}
                            >
                                Nivel {level.number}
                            </span>
                        </div>
                    ) : (
                        /* ===================================================== */
                        /* 4. PIEDRA SELLADA: ROCA DORMIDA CON MUSGO (KOKE-ISHI) */
                        /* ===================================================== */
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Resplandor Celeste Sutil */}
                            <div className="absolute -inset-2.5 rounded-full bg-cyan-600/15 blur-lg pointer-events-none" />

                            {/* Contorno orgánico asimétrico de roca sellada */}
                            <div className="relative w-full h-full rounded-[48%_52%_53%_47%/51%_49%_52%_48%] overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.85),0_0_15px_rgba(6,182,212,0.35)] border border-cyan-400/40 opacity-90">
                                <Image
                                    src="/images/didactic/tobiishi_stone_locked.jpg"
                                    alt={`Piedra Sellada - Nivel ${level.number}`}
                                    fill
                                    sizes="(max-width: 768px) 104px, 120px"
                                    className="object-cover brightness-90"
                                    priority
                                />

                                {/* Brillo de Agua Sutil */}
                                <div className="absolute top-1.5 left-3 right-3 h-5 rounded-[50%] bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />
                            </div>

                            {/* Sello Talismánico Dormido */}
                            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-wider text-cyan-200 bg-[#0B0A1C]/90 px-2.5 py-0.5 rounded-full border border-cyan-500/50 shadow-[0_0_8px_#06b6d4] whitespace-nowrap z-20 backdrop-blur-md">
                                Nivel {level.number}
                            </span>
                        </div>
                    )}
                </motion.button>

                {/* ========================================================= */}
                {/* 3. BARRA DE 3 ESTRELLAS (PERLAS DE MAESTRÍA SOBRE EL AGUA) */}
                {/* ========================================================= */}
                <div className="mt-3.5 flex items-center justify-center">
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

// Alias para compatibilidad hacia atrás
export { FloatingSteppingStone as EtherealMartialOrb };
export default FloatingSteppingStone;
