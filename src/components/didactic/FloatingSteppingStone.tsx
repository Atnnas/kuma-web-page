"use client";
import React from "react";
import { motion } from "framer-motion";
import { Level } from "@/types/didactica";
import { Star, Sparkle } from "@phosphor-icons/react";

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
 * - DIBUJADAS PROCEDURALMENTE CON CÓDIGO VECTORIAL (SVG) en el mismo estilo que los peces Koi.
 * - CERO imágenes rasterizadas (sin JPGs generados por IA).
 * - Curvas Bézier orgánicas de canto rodado pulido por el agua.
 * - Gradientes de roca mineral: Jade Imperial, Basalto Volcánico y Pizarra con Musgo.
 * - Kanji sagrados tallados con resplandor interior de Ki.
 * - Ondas de agua vivas (Hamon 波紋) y sombra submarina en el lecho del estanque.
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

    // Kanji sagrado grabado en la piedra según el estado
    const stoneKanji = isOkinawa
        ? "空" // Kara (Vacío / Karate)
        : isCompleted
        ? "圓" // En (Perfección / Círculo Zen)
        : isUnlocked
        ? "氣" // Ki (Espíritu / Energía vital)
        : "忍"; // Shinobi (Perseverancia / Paciencia)

    return (
        <div className="relative flex flex-col items-center select-none group my-4">
            {/* ========================================================= */}
            {/* 1. ONDAS PROCEDURALES DE AGUA (HAMON 波紋) EN EL ESTANQUE  */}
            {/* ========================================================= */}
            {/* Onda 1: Expansión de agua suave */}
            <motion.div
                animate={{
                    scale: [0.8, 1.45, 1.85],
                    opacity: isUnlocked ? [0.65, 0.25, 0] : [0.35, 0.1, 0],
                }}
                transition={{
                    duration: isUnlocked ? 3.5 : 4.8,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: floatDelay,
                }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] pointer-events-none w-36 h-28 border ${
                    isCompleted
                        ? "border-emerald-400/40"
                        : isUnlocked
                        ? "border-amber-400/50"
                        : "border-cyan-400/25"
                }`}
            />

            {/* Onda 2: Expansión media desfasada */}
            <motion.div
                animate={{
                    scale: [0.85, 1.25, 1.6],
                    opacity: isUnlocked ? [0.6, 0.2, 0] : [0.3, 0.08, 0],
                }}
                transition={{
                    duration: isUnlocked ? 3.5 : 4.8,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: floatDelay + (isUnlocked ? 1.75 : 2.4),
                }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] pointer-events-none w-32 h-24 border ${
                    isCompleted
                        ? "border-emerald-300/45"
                        : isUnlocked
                        ? "border-yellow-300/55"
                        : "border-cyan-300/20"
                }`}
            />

            {/* Anillo de contacto y espuma superficial del agua */}
            <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-24 rounded-[48%_52%_51%_49%/53%_47%_52%_48%] pointer-events-none border blur-[0.5px] transition-all duration-500 ${
                    isCompleted
                        ? "border-emerald-300/50 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                        : isUnlocked
                        ? "border-amber-300/60 shadow-[0_0_18px_rgba(251,191,36,0.35)]"
                        : "border-cyan-400/25 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
                }`}
            />

            {/* Sombra submarina sumergida en el fondo del estanque */}
            <motion.div
                animate={{
                    scale: isUnlocked ? [1, 0.94, 1] : [1, 0.96, 1],
                    opacity: isUnlocked ? [0.85, 0.6, 0.85] : [0.65, 0.5, 0.65],
                }}
                transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay,
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[35%] w-32 md:w-36 h-22 rounded-[50%] bg-[#020617]/85 blur-md pointer-events-none"
            />

            {/* ========================================================= */}
            {/* 2. PIEDRA ZEN PROCEDURAL VECTORIAL (TOBI-ISHI VECTORIAL)   */}
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
                    className={`relative flex items-center justify-center cursor-pointer focus:outline-none ${
                        !isUnlocked ? "cursor-not-allowed" : "active:outline-none"
                    }`}
                    style={{ width: "108px", height: "108px" }}
                >
                    {/* SVG VECTORIAL DE ALTA DEFINICIÓN PROCEDURAL */}
                    <svg
                        viewBox="0 0 120 120"
                        className="w-full h-full overflow-visible drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* GRADIENTES MINERALES DE ROCA NATURAL */}
                            {/* 1. Basalto Volcánico (Activo) */}
                            <radialGradient id={`stoneBasalt-${level.id}`} cx="42%" cy="38%" r="62%">
                                <stop offset="0%" stopColor="#44403c" />
                                <stop offset="45%" stopColor="#292524" />
                                <stop offset="85%" stopColor="#1c1917" />
                                <stop offset="100%" stopColor="#0c0a09" />
                            </radialGradient>

                            {/* 2. Jade Imperial (Superado) */}
                            <radialGradient id={`stoneJade-${level.id}`} cx="40%" cy="36%" r="65%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="35%" stopColor="#059669" />
                                <stop offset="70%" stopColor="#064e3b" />
                                <stop offset="100%" stopColor="#022c22" />
                            </radialGradient>

                            {/* 3. Pizarra con Musgo (Bloqueado) */}
                            <radialGradient id={`stoneSlate-${level.id}`} cx="45%" cy="40%" r="60%">
                                <stop offset="0%" stopColor="#3f3f46" />
                                <stop offset="50%" stopColor="#27272a" />
                                <stop offset="85%" stopColor="#18181b" />
                                <stop offset="100%" stopColor="#09090b" />
                            </radialGradient>

                            {/* 4. Lapislázuli de Okinawa (Nivel 1) */}
                            <radialGradient id={`stoneOkinawa-${level.id}`} cx="40%" cy="38%" r="65%">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="30%" stopColor="#0284c7" />
                                <stop offset="70%" stopColor="#1e3a8a" />
                                <stop offset="100%" stopColor="#0f172a" />
                            </radialGradient>

                            {/* Oro líquido grabado */}
                            <linearGradient id={`goldCarved-${level.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FEF08A" />
                                <stop offset="50%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#B45309" />
                            </linearGradient>

                            {/* Resplandor celeste para bloqueado */}
                            <linearGradient id={`cyanCarved-${level.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#A5F3FC" />
                                <stop offset="50%" stopColor="#22D3EE" />
                                <stop offset="100%" stopColor="#0891B2" />
                            </linearGradient>

                            {/* Filtro de resplandor para el grabado interior de Ki */}
                            <filter id={`kiGlow-${level.id}`} x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* CUERPO ASIMÉTRICO DE LA ROCA DE RÍO (CURVAS BÉZIER PURAS) */}
                        <path
                            d="M 28,18 C 50,8 84,12 100,26 C 114,40 118,72 104,94 C 90,112 50,114 26,98 C 6,82 8,36 28,18 Z"
                            fill={
                                isOkinawa
                                    ? `url(#stoneOkinawa-${level.id})`
                                    : isCompleted
                                    ? `url(#stoneJade-${level.id})`
                                    : isUnlocked
                                    ? `url(#stoneBasalt-${level.id})`
                                    : `url(#stoneSlate-${level.id})`
                            }
                            stroke={
                                isCompleted
                                    ? "rgba(110,231,183,0.5)"
                                    : isUnlocked
                                    ? "rgba(252,211,77,0.6)"
                                    : "rgba(148,163,184,0.3)"
                            }
                            strokeWidth="2"
                        />

                        {/* TEXTURA ORGÁNICA: PARCHES DE MUSGO JAPONÉS (KOKE 苔) */}
                        {!isCompleted && !isUnlocked && (
                            <>
                                <path
                                    d="M 22,78 C 30,86 42,92 56,92 C 48,98 32,96 22,90 Z"
                                    fill="#3f6212"
                                    opacity="0.75"
                                />
                                <path
                                    d="M 76,92 C 86,90 96,82 100,74 C 98,84 88,94 76,92 Z"
                                    fill="#4d7c0f"
                                    opacity="0.65"
                                />
                            </>
                        )}

                        {/* BISEL ESPECULAR DE AGUA MOJADA EN LA SUPERFICIE */}
                        <path
                            d="M 32,22 C 54,12 80,16 94,28 C 90,32 68,26 42,28 C 34,28 30,26 32,22 Z"
                            fill="white"
                            opacity={isUnlocked ? "0.35" : "0.18"}
                        />

                        {/* ===================================================== */}
                        {/* GRABADO SAGRADO CENTRAL SEGÚN ESTADO DE LA PIEDRA     */}
                        {/* ===================================================== */}
                        {isCompleted ? (
                            /* CÍRCULO ZEN ENSO (円相) TALLADO EN PAN DE ORO */
                            <g transform="translate(60, 60)">
                                {/* Resplandor aureo detrás del Enso */}
                                <circle r="22" fill="#10b981" opacity="0.2" filter={`url(#kiGlow-${level.id})`} />
                                {/* Trazo de pincelada Zen circular Enso */}
                                <path
                                    d="M 0,-20 A 20,20 0 1,1 -16,12"
                                    stroke={`url(#goldCarved-${level.id})`}
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    fill="none"
                                    filter={`url(#kiGlow-${level.id})`}
                                />
                                <circle cx="0" cy="0" r="4" fill="#FDE68A" />
                            </g>
                        ) : isUnlocked ? (
                            /* KANJI DE KI (氣) / BUDO TALLADO EN BAJORRELIEVE Y EN LLAMAS DE ORO */
                            <g>
                                {/* Resplandor central de energía interior */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="24"
                                    fill="#F59E0B"
                                    opacity="0.22"
                                    filter={`url(#kiGlow-${level.id})`}
                                />
                                {/* Kanji grabado con tipografía ancestral caligráfica */}
                                <text
                                    x="60"
                                    y="71"
                                    textAnchor="middle"
                                    fontSize="38"
                                    fontWeight="900"
                                    fontFamily="'Noto Serif JP', 'Yu Mincho', serif"
                                    fill={`url(#goldCarved-${level.id})`}
                                    filter={`url(#kiGlow-${level.id})`}
                                    className="select-none pointer-events-none"
                                >
                                    {stoneKanji}
                                </text>
                            </g>
                        ) : (
                            /* KANJI DE RESISTENCIA Y CALMA (忍) EN LETARGO CELESTE */
                            <g>
                                <text
                                    x="60"
                                    y="70"
                                    textAnchor="middle"
                                    fontSize="35"
                                    fontWeight="800"
                                    fontFamily="'Noto Serif JP', 'Yu Mincho', serif"
                                    fill={`url(#cyanCarved-${level.id})`}
                                    opacity="0.75"
                                    className="select-none pointer-events-none"
                                >
                                    {stoneKanji}
                                </text>
                            </g>
                        )}

                        {/* REFRACCIÓN DE BORDE INFERIOR SUMERGIDO */}
                        <path
                            d="M 28,98 C 50,112 88,110 102,94 C 94,102 54,106 32,96 Z"
                            fill="black"
                            opacity="0.4"
                        />
                    </svg>

                    {/* SELLO DE CINABRIO / ESMERALDA / OBSIDIANA INFERIOR */}
                    <span
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-black uppercase tracking-wider leading-tight px-3 py-0.5 rounded-full shadow-lg whitespace-nowrap z-20 backdrop-blur-md border ${
                            isCompleted
                                ? "bg-emerald-950/90 text-emerald-200 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                                : isDan
                                ? "bg-black text-amber-200 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                                : isUnlocked
                                ? "bg-[#7C1D05]/95 text-amber-100 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                                : "bg-zinc-950/90 text-cyan-200 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                        }`}
                    >
                        {level.id === "level-karategi" || isOkinawa
                            ? "Historia"
                            : level.id === "level-anatomia" || level.number === 2
                            ? "Cuerpo Humano"
                            : level.id === "level-kumite-tradicional" || level.number === 3
                            ? "Kihon"
                            : level.id === "level-kata-blanco" || level.title?.toLowerCase() === "kata"
                            ? "Kata"
                            : level.title || (isCompleted ? "Superado" : `Nivel ${level.number}`)}
                    </span>
                </motion.button>

                {/* ========================================================= */}
                {/* 3. BARRA DE 3 ESTRELLAS (PERLAS DE MAESTRÍA SOBRE EL AGUA) */}
                {/* ========================================================= */}
                <div className="mt-3.5 flex items-center justify-center">
                    <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
                            stars === 3
                                ? "bg-zinc-950/90 border-2 border-yellow-400 shadow-[0_0_14px_rgba(250,204,21,0.6)]"
                                : stars > 0
                                ? "bg-zinc-950/85 border border-amber-400/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]"
                                : isUnlocked
                                ? "bg-zinc-950/75 border border-white/10"
                                : "bg-zinc-950/60 border border-white/5 opacity-60"
                        }`}
                        title={
                            stars === 3
                                ? "¡Maestría Total (3/3 estrellas)!"
                                : `Progreso de Maestría: ${stars}/3 estrellas.`
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
