"use client";
import React from "react";
import { motion } from "framer-motion";
import { BeltRank } from "@/types/didactica";

interface ExaminersTableCartoonProps {
    belt: BeltRank;
    nextBelt?: BeltRank | null;
    isBeltCompleted: boolean;
    isBeltUnlocked: boolean;
    onTakeExam: () => void;
    hasPassedExam?: boolean;
}

/**
 * PANEL DE EXAMINADORES DE ALTA DEFINICIÓN (3D ANIMATED RENDER)
 * - Renderizado en 3D limpio, elegante y de menor tamaño (max-w-[300px]).
 * - 3 Examinadores vestidos con saco azul marino entallado, camisa blanca y corbata roja vino.
 * - Sin logos WKF ni textos en laptops (acabado puro y prolijo).
 * - Placa exclusiva en bajorrelieve dorado en la mesa: "Exámen de Grado".
 * - Micro-animación de respiración orgánica y reflejo de luz áurea con Framer Motion.
 */
export function ExaminersTableCartoon({
    belt,
    nextBelt,
    isBeltCompleted,
    isBeltUnlocked,
    onTakeExam,
    hasPassedExam = false,
}: ExaminersTableCartoonProps) {
    return (
        <div className="relative my-4 flex flex-col items-center select-none w-full max-w-[280px] sm:max-w-[320px] mx-auto px-2">
            {/* AURA AMBIENTAL DORADA EN EL ESTANQUE */}
            <div className="absolute inset-0 -top-3 bg-gradient-to-b from-amber-500/15 via-blue-600/10 to-transparent rounded-full blur-xl pointer-events-none" />

            {/* CONTENEDOR TÁCTIL PRINCIPAL */}
            <motion.div
                initial={{ y: 4, opacity: 0 }}
                animate={{ y: [0, -3, 0], opacity: 1 }}
                transition={{
                    y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.4 },
                }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={onTakeExam}
                className="relative w-full cursor-pointer group flex flex-col items-center"
                title="Haz clic para rendir el Exámen de Grado"
            >
                {/* MARCO ESCULPIDO CON SOMBRA */}
                <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-400/40 group-hover:border-amber-300 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(245,158,11,0.2)] bg-[#050B14]">
                    {/* ILUSTRACIÓN 3D LIMPIA (SIN LOGOS WKF) */}
                    <img
                        src="/images/didactic/wkf_referees_table.jpg"
                        alt="Exámen de Grado"
                        className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="eager"
                    />

                    {/* DEGRADADO SUTIL INFERIOR */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                    {/* PLACA EXCLUSIVA EN LA MESA: "Exámen de Grado" */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-[62%] max-w-[190px]">
                        <div className="relative p-[1.5px] rounded-xl bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-[0_4px_16px_rgba(0,0,0,0.9),0_0_15px_rgba(245,158,11,0.5)] group-hover:shadow-[0_0_22px_rgba(250,204,21,0.8)] transition-all">
                            <div className="px-3 py-1 rounded-[10px] bg-gradient-to-b from-[#181510] via-[#0E0C08] to-black flex items-center justify-center relative overflow-hidden border border-amber-500/30">
                                {/* TEXTO EXCLUSIVO: Exámen de Grado */}
                                <span className="font-serif font-black text-xs sm:text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                                    Exámen de Grado
                                </span>

                                {/* DESTELLO LUMINOSO QUE CRUZA LA PLACA */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                                    animate={{ x: ["-120%", "220%"] }}
                                    transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
