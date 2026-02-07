"use client";

import { motion } from "framer-motion";
import { Fire } from "@phosphor-icons/react";

export function KumaFlame({ days }: { days: number }) {
    if (days < 1) return null;

    // Intensity based on streak
    // 1-5: Small Orange
    // 5-15: Medium Red
    // 15+: Blue Fire (Azula style)
    let color = "text-orange-500";
    let shadow = "drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]";

    if (days > 15) {
        color = "text-blue-500";
        shadow = "drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]";
    } else if (days > 5) {
        color = "text-red-500";
        shadow = "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]";
    }

    return (
        <div className="flex items-center gap-1 group relative cursor-help">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1, 1.1, 1],
                    y: [0, -1, 0, -0.5, 0],
                    opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <Fire weight="fill" className={`w-5 h-5 ${color} ${shadow}`} />
            </motion.div>
            <span className={`text-xs font-bold ${color}`}>{days}</span>

            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 w-32 bg-black/90 p-2 rounded-lg border border-white/10 text-[10px] text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-normal z-50">
                ¡Racha de {days} días! Mantén la llama viva.
            </div>
        </div>
    );
}
