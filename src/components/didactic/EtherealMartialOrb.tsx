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
 * Cuentas Sagradas del Rosario Budista de Budo (Juzu / Nenju - 数珠)
 * - Simulación hiper-realista de cuentas de rosario budista de monje guerrero.
 * - Sin aros desfasados o círculos duplicados a la derecha.
 * - Madera de Sándalo Sagrado & Ámbar (Activo): aura de Ki interior, laca dorada y pulido esférico 3D.
 * - Jade Imperial Iluminado (Superado): gema de jade pulida con círculo Zen Enso (円相) y brillo esmeralda.
 * - Ébano Sagrado & Obsidiana Mística (Bloqueado): madera de ébano con brillo índigo y sello rúnico cian (cero gris).
 * - Cuenta Maestra Oyadama (Okinawa N.1): la gran cuenta principal con herrajes dorados y cordón ceremonial.
 * - Ojales polares dorados (Kanagu - 金具) por donde cruza el cordón de seda sagrada.
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

    // Levitación sutil y armónica de las cuentas de oración
    const floatDelay = ((level.number || 1) % 4) * 0.45;
    const floatDuration = 3.6 + ((level.number || 1) % 3) * 0.35;

    return (
        <div className="relative flex flex-col items-center select-none group">
            {/* Sombra de Contacto del Rosario Budista sobre el Tatami */}
            <motion.div
                animate={{
                    scale: isUnlocked ? [1, 0.78, 1] : [1, 0.88, 1],
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
                    style={{ width: "96px", height: "96px" }}
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

                            {/* Sello de Superado en la Cuenta Maestra */}
                            {isCompleted && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/60 backdrop-blur-[2px] rounded-full z-30 border-2 border-emerald-300 shadow-[0_0_25px_#00FF88]">
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
                        /* 2. COMPLETED: CUENTA DE JADE IMPERIAL SAGRADO (翡翠)  */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full flex items-center justify-center">
                            {/* Halo Espiritual de Jade */}
                            <div className="absolute -inset-3 rounded-full bg-emerald-500/40 blur-xl pointer-events-none animate-pulse" />

                            {/* Ojal Superior Dorado del Cordón (Kanagu - 金具) */}
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-2 rounded-t-md bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 border border-amber-200/80 shadow-[0_0_6px_rgba(245,158,11,0.6)] z-20" />
                            {/* Ojal Inferior Dorado del Cordón */}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-2 rounded-b-md bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 border border-amber-200/80 shadow-[0_0_6px_rgba(245,158,11,0.6)] z-20" />

                            {/* Cuerpo Esférico de Jade Imperial Pulido */}
                            <div className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_32%_26%,_#ECFDF5_0%,_#A7F3D0_18%,_#10B981_48%,_#047857_76%,_#022C22_100%)] border-t border-t-white/80 border-b-[5px] border-b-[#011F17] shadow-[0_0_30px_rgba(16,185,129,0.85),0_0_60px_rgba(5,150,105,0.45),0_12px_24px_rgba(0,0,0,0.85)] flex items-center justify-center overflow-hidden">
                                
                                {/* Cordón de Seda Interno Atravesando la Cuenta */}
                                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-amber-400/70 via-amber-200/90 to-amber-500/70 opacity-50 pointer-events-none" />

                                {/* Círculo Zen Enso Dorado (円相) de Iluminación */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                                    className="absolute inset-2.5 rounded-full border border-amber-300/40 border-dashed pointer-events-none"
                                />

                                {/* Brillo de Laca Esférica (Urushi Gloss) */}
                                <div className="absolute top-1 left-2.5 right-2.5 h-6 rounded-[50%] bg-gradient-to-b from-white/85 via-white/20 to-transparent pointer-events-none" />
                                <div className="absolute top-2.5 left-4 w-3 h-1.5 rounded-[50%] bg-white blur-[0.2px] rotate-[-25deg] pointer-events-none" />

                                {/* Haz de Luz Espiritual Reflejado */}
                                <motion.div
                                    animate={{ x: ["-160%", "180%"] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        ease: "easeInOut",
                                        repeatDelay: 1.5,
                                    }}
                                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-28deg] pointer-events-none"
                                />

                                {/* Emblema Central de Superado & Enso */}
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.08, 1] }}
                                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                    >
                                        <CheckCircle
                                            className="w-9 h-9 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9),0_0_20px_#10B981]"
                                            weight="fill"
                                        />
                                    </motion.div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-white leading-tight bg-[#022C22]/90 px-2.5 py-0.5 rounded-full border border-emerald-300/80 shadow-[0_0_10px_#10B981] mt-0.5">
                                        Superado
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : isUnlocked ? (
                        /* ===================================================== */
                        /* 3. ACTIVE: CUENTA DE SÁNDALO SAGRADO & ÁMBAR ZEN      */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full flex items-center justify-center">
                            {/* Halo Espiritual del Fuego Zen (Ki) */}
                            <div className="absolute -inset-3.5 rounded-full bg-gradient-to-r from-amber-500/50 via-yellow-400/60 to-orange-600/50 blur-xl pointer-events-none animate-pulse" />

                            {/* Ojal Superior Dorado del Cordón (Kanagu - 金具) */}
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-2 rounded-t-md bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-700 border border-yellow-200/90 shadow-[0_0_8px_rgba(245,158,11,0.8)] z-20" />
                            {/* Ojal Inferior Dorado del Cordón */}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-2 rounded-b-md bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-700 border border-yellow-200/90 shadow-[0_0_8px_rgba(245,158,11,0.8)] z-20" />

                            {/* Cuerpo Esférico de Sándalo Sagrado & Ámbar Pulido */}
                            <div
                                className={`relative w-full h-full rounded-full border-t border-t-yellow-100 border-b-[5px] flex items-center justify-center overflow-hidden transition-all duration-300 ${
                                    isDan
                                        ? "bg-[radial-gradient(circle_at_32%_26%,_#FFFBEB_0%,_#FDE68A_20%,_#D97706_50%,_#78350F_78%,_#1C0B02_100%)] border-b-[#1C0B02] shadow-[0_0_35px_rgba(245,158,11,0.9),0_0_70px_rgba(217,119,6,0.5),0_12px_26px_rgba(0,0,0,0.85)]"
                                        : "bg-[radial-gradient(circle_at_32%_26%,_#FFF7ED_0%,_#FED7AA_20%,_#F59E0B_50%,_#B45309_78%,_#451A03_100%)] border-b-[#321302] shadow-[0_0_35px_rgba(245,158,11,0.9),0_0_70px_rgba(234,88,12,0.55),0_12px_26px_rgba(0,0,0,0.85)]"
                                }`}
                            >
                                {/* Cordón de Seda de Oro Sagrado Interno */}
                                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2.5px] bg-gradient-to-b from-yellow-200 via-amber-300 to-yellow-100 shadow-[0_0_6px_#fde047] opacity-70 pointer-events-none" />

                                {/* Vórtice Espiritual de Ki en la Madera Sagrada */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                    className="absolute -inset-2 bg-[conic-gradient(from_0deg,_transparent,_rgba(255,240,180,0.4),_transparent,_rgba(245,158,11,0.5),_transparent)] rounded-full pointer-events-none mix-blend-screen"
                                />

                                {/* Anillo Zen Enso Interior Sagrado */}
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                                    className="absolute inset-2.5 rounded-full border border-yellow-200/50 border-dotted pointer-events-none"
                                />

                                {/* Reflejo Especular Superior de Laca Urushi */}
                                <div className="absolute top-1 left-2.5 right-2.5 h-6 rounded-[50%] bg-gradient-to-b from-white/90 via-amber-100/30 to-transparent pointer-events-none" />
                                <div className="absolute top-2.5 left-4 w-3.5 h-2 rounded-[50%] bg-white blur-[0.2px] rotate-[-25deg] pointer-events-none" />

                                {/* Barrido de Brillo de Laca */}
                                <motion.div
                                    animate={{ x: ["-160%", "180%"] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2.6,
                                        ease: "easeInOut",
                                        repeatDelay: 1,
                                    }}
                                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-28deg] pointer-events-none"
                                />

                                {/* Icono Marcial Sagrado & Placa Cinabrio de Nivel */}
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <motion.span
                                        animate={{
                                            y: [0, -3, 0],
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.8,
                                            ease: "easeInOut",
                                        }}
                                        className="text-3xl md:text-4xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.9),0_0_20px_#F59E0B] select-none transform group-hover:scale-120 transition-transform duration-300"
                                    >
                                        {level.icon}
                                    </motion.span>
                                    <span
                                        className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider leading-tight px-2.5 py-0.5 rounded-full shadow-[0_0_10px_#fde047] mt-0.5 ${
                                            isDan
                                                ? "bg-black text-amber-200 border border-amber-300"
                                                : "bg-[#7C1D05] text-amber-100 border border-amber-300/80"
                                        }`}
                                    >
                                        Nivel {level.number}
                                    </span>
                                </div>

                                {/* Ondas de Resonancia de la Oración */}
                                <span className="absolute -inset-1.5 rounded-full border border-yellow-300/80 animate-ping pointer-events-none" />
                            </div>
                        </div>
                    ) : (
                        /* ===================================================== */
                        /* 4. LOCKED: CUENTA DE ÉBANO & OBSIDIANA CON SELLO      */
                        /* (CUENTA SAGRADA EN REPOSO, CON SELLO RÚNICO CIAN)     */
                        /* ===================================================== */
                        <div className="relative w-full h-full rounded-full flex items-center justify-center">
                            {/* Halo Místico Violeta/Índigo */}
                            <div className="absolute -inset-2.5 rounded-full bg-indigo-600/30 blur-lg pointer-events-none" />

                            {/* Ojal Superior de Hierro Forjado (Kanagu) */}
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4.5 h-2 rounded-t-md bg-gradient-to-r from-zinc-700 via-indigo-400 to-zinc-800 border border-indigo-300/40 z-20" />
                            {/* Ojal Inferior de Hierro Forjado */}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4.5 h-2 rounded-b-md bg-gradient-to-r from-zinc-700 via-indigo-400 to-zinc-800 border border-indigo-300/40 z-20" />

                            {/* Cuerpo Esférico de Ébano Monástico Pulido */}
                            <div className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_32%_26%,_#C7D2FE_0%,_#818CF8_20%,_#4338CA_48%,_#1E1B4B_76%,_#0B0A1C_100%)] border-t border-t-indigo-200/60 border-b-[5px] border-b-[#0B0A1C] shadow-[0_0_24px_rgba(99,102,241,0.6),0_0_45px_rgba(129,140,248,0.3),0_10px_20px_rgba(0,0,0,0.85)] flex items-center justify-center overflow-hidden">
                                
                                {/* Cordón Interno de Seda Violeta Oscura */}
                                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-indigo-300/30 pointer-events-none" />

                                {/* Círculo Rúnico Interior Que Pulsa */}
                                <motion.div
                                    animate={{
                                        opacity: [0.35, 0.75, 0.35],
                                        scale: [0.92, 1.05, 0.92],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2.6,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-2.5 rounded-full border border-cyan-300/50 pointer-events-none"
                                />

                                {/* Reflejo Especular Superior */}
                                <div className="absolute top-1 left-2.5 right-2.5 h-6 rounded-[50%] bg-gradient-to-b from-white/70 via-indigo-200/20 to-transparent pointer-events-none" />
                                <div className="absolute top-2.5 left-4 w-2.5 h-1.5 rounded-[50%] bg-white/80 blur-[0.2px] rotate-[-25deg] pointer-events-none" />

                                {/* Sello Talismán Holográfico de Disciplina */}
                                <div className="relative z-10 flex flex-col items-center justify-center text-cyan-200">
                                    <Lock
                                        className="w-7 h-7 text-cyan-200 drop-shadow-[0_0_10px_#22d3ee,0_0_18px_#06b6d4]"
                                        weight="fill"
                                    />
                                    <span className="text-[8px] font-black uppercase tracking-wider text-cyan-100 bg-[#0B0A1C]/90 px-2 py-0.5 rounded-full border border-cyan-400/50 shadow-[0_0_8px_#06b6d4] mt-0.5">
                                        Nivel {level.number}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Medalla de Estrellas Si Está Superado */}
                    {isCompleted && stars > 0 && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-950/95 border-2 border-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.9)] z-20 backdrop-blur-sm">
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
