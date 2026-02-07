"use client";

import { useState } from "react";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { Play, Trophy, Medal, Fire, X, Crown, Lightning } from "@phosphor-icons/react/dist/ssr";
import { AchievementOverlay } from "@/components/gamification/AchievementOverlay";

// Static Definitions for Visual Testing
const DEMO_TROPHIES = [
    {
        _id: "trophy-first-workout",
        slug: "primer-entrenamiento",
        name: "Primer Entrenamiento",
        description: "El primer paso de un viaje de mil millas. ¡Has comenzado tu legado!",
        icon: "Fire", // Using Fire icon for maximum impact
        color: "#fbbf24", // Kuma Gold
        rarity: "Legendario", // To trigger max effects if we had rarity logic
        hidden: false
    }
];

export default function RecompensasPage() {
    const [previewTrophy, setPreviewTrophy] = useState<any | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleTest = (trophy: any) => {
        setPreviewTrophy(trophy);
        setShowPreview(true);
    };

    return (
        <div className="p-8 text-white min-h-screen relative">
            <AchievementOverlay
                show={showPreview}
                trophy={previewTrophy}
                onClose={() => setShowPreview(false)}
            />

            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <PrimalTitle title="Prueba de Animaciones" subtitle="Visualizador de Recompensas (Modo Demo)" size="lg" className="md:text-left text-center" />
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-950/50 border-b border-white/5 text-xs uppercase text-zinc-500 font-bold tracking-wider">
                                <th className="p-4 text-center w-20">Icono</th>
                                <th className="p-4">Trofeo / Logro</th>
                                <th className="p-4 w-32">Rareza</th>
                                <th className="p-4 text-center w-24">Estado</th>
                                <th className="p-4 text-right w-48">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {DEMO_TROPHIES.map((trophy) => (
                                <tr key={trophy._id} className="group hover:bg-white/5 transition-colors">
                                    {/* ICON */}
                                    <td className="p-4 text-center">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto border border-white/10 shadow-sm"
                                            style={{ backgroundColor: `${trophy.color}15`, color: trophy.color }}
                                        >
                                            <Trophy weight="duotone" className="w-6 h-6" />
                                            {/* Note: In a real dynamic setup we'd map string -> component, but for demo Trophy icon is fine or we can map a few manually if strictly needed */}
                                        </div>
                                    </td>

                                    {/* NAME */}
                                    <td className="p-4">
                                        <h4 className="font-bold text-white text-sm mb-1">{trophy.name}</h4>
                                        <p className="text-xs text-zinc-500">{trophy.description}</p>
                                    </td>

                                    {/* RARITY */}
                                    <td className="p-4">
                                        <span className={`
                                            px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border
                                            ${trophy.rarity === 'Legendario' ? 'bg-yellow-900/10 text-yellow-500 border-yellow-500/20' :
                                                trophy.rarity === 'Épico' ? 'bg-purple-900/10 text-purple-500 border-purple-500/20' :
                                                    trophy.rarity === 'Raro' ? 'bg-blue-900/10 text-blue-500 border-blue-500/20' :
                                                        'bg-zinc-800/50 text-zinc-400 border-zinc-700/50'}
                                        `}>
                                            {trophy.rarity}
                                        </span>
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-4 text-center text-xs text-zinc-500 font-mono">
                                        {trophy.hidden ? "OCULTO" : "VISIBLE"}
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleTest(trophy)}
                                            className="ml-auto h-12 px-8 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_40px_rgba(234,179,8,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 group-hover/btn:animate-pulse"
                                        >
                                            <Play weight="fill" className="w-5 h-5 animate-pulse" />
                                            <span>¡PROBAR AHORA!</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
