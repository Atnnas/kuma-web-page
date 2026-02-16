"use client";

import { useState } from "react";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { Play, Trophy, Medal, Fire, X, Crown, Lightning, PawPrint, Skull } from "@phosphor-icons/react/dist/ssr";
import { AchievementOverlay } from "@/components/gamification/AchievementOverlay";
import { StreakFlame } from "@/components/layout/StreakFlame";
import { StreakCelebrationOverlay } from "@/components/gamification/StreakCelebrationOverlay";
import { StreakLossOverlay } from "@/components/gamification/StreakLossOverlay";

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
    },
    {
        _id: "trophy-kuma-revenant",
        slug: "kuma-revenant",
        name: "Espíritu Kuma",
        description: "Has entrenado más de 1 hora en una sola sesión. Tu resistencia es legendaria.",
        icon: "PawPrint",
        color: "#dc2626", // Red 600
        rarity: "Mítico",
        hidden: false
    },
    {
        _id: "trophy-cheat",
        slug: "oso-oso-mentiroso",
        name: "Oso Oso Mentiroso",
        description: "Tu saltaste esta rutina, tienes la oportunidad de entrenar realmente durante el día. Si a las 12 media noche no has hecho entreno, perderás la racha. Oso oso mentiroso.",
        icon: "Skull",
        color: "#ef4444", // Red 500
        rarity: "Raro",
        hidden: false
    }
];

export default function RecompensasPage() {
    const [previewTrophy, setPreviewTrophy] = useState<any | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    // Streak Testing State
    const [previewStreak, setPreviewStreak] = useState(0);
    const [showStreakPreview, setShowStreakPreview] = useState(false);
    const [showLossPreview, setShowLossPreview] = useState(false);

    const handleTest = (trophy: any) => {
        setPreviewTrophy(trophy);
        setShowPreview(true);
    };

    const handleTestStreak = (days: number) => {
        setPreviewStreak(days);
        setShowStreakPreview(true);
    };

    return (
        <div className="p-8 text-white min-h-screen relative">
            <AchievementOverlay
                show={showPreview}
                trophy={previewTrophy}
                onClose={() => setShowPreview(false)}
            />

            <StreakCelebrationOverlay
                show={showStreakPreview}
                streak={previewStreak}
                onClose={() => setShowStreakPreview(false)}
            />

            <StreakLossOverlay
                show={showLossPreview}
                onClose={() => setShowLossPreview(false)}
            />

            {/* STREAK TESTING SECTION */}
            <div className="mb-12">
                <PrimalTitle title="Sistema de Rachas" subtitle="Evolución de la Llama y Celebraciones (Previews)" size="lg" className="md:text-left text-center mb-6" />

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[
                        { days: 0, label: "Inactivo (0 Días)" },
                        { days: 10, label: "Fase 1 (10 Días)" },
                        { days: 22, label: "Hito (22 Días)" },
                        { days: 30, label: "Fase 2 (30 Días)" },
                        { days: 60, label: "Fase 3 (60 Días)" },
                    ].map((item) => (
                        <div key={item.days} className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 flex flex-col items-center gap-4 hover:bg-white/5 transition-colors group">
                            <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{item.label}</span>

                            {/* Visual Preview */}
                            <div className="scale-150 transform p-4">
                                <StreakFlame overrideStreak={item.days} />
                            </div>

                            <button
                                onClick={() => handleTestStreak(item.days)}
                                className="mt-2 text-xs font-bold text-orange-500 uppercase tracking-wider hover:text-orange-400 flex items-center gap-2"
                            >
                                <Play weight="fill" /> Probar
                            </button>
                        </div>
                    ))}

                    {/* STREAK LOSS TEST CASE - Standardized to match above */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 flex flex-col items-center gap-4 hover:bg-white/5 transition-colors group">
                        <span className="text-xs uppercase tracking-widest text-red-500 font-bold">CASO DE DOLOR</span>

                        {/* Visual Preview for Loss (Grey flame) */}
                        <div className="scale-150 transform p-4 grayscale">
                            <StreakFlame overrideStreak={0} />
                        </div>

                        <button
                            onClick={() => setShowLossPreview(true)}
                            className="mt-2 text-xs font-bold text-red-500 uppercase tracking-wider hover:text-red-400 flex items-center gap-2"
                        >
                            <Play weight="fill" /> Probar
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <PrimalTitle title="Prueba de Logros" subtitle="Visualizador de Recompensas (Modo Demo)" size="lg" className="md:text-left text-center" />
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
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
                                    <td className="p-4 text-center">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto border border-white/10 shadow-sm overflow-hidden"
                                            style={{ backgroundColor: `${trophy.color}15`, color: trophy.color }}
                                        >
                                            {trophy.slug === 'oso-oso-mentiroso' ? (
                                                <img src="/images/kuma-logro-primer-trampa.jpg" className="w-full h-full object-cover" />
                                            ) : (
                                                <Trophy weight="duotone" className="w-6 h-6" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <h4 className="font-bold text-white text-sm mb-1">{trophy.name}</h4>
                                        <p className="text-xs text-zinc-500">{trophy.description}</p>
                                    </td>
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
                                    <td className="p-4 text-center text-xs text-zinc-500 font-mono">
                                        {trophy.hidden ? "OCULTO" : "VISIBLE"}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleTest(trophy)}
                                            className="ml-auto h-10 px-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/10 hover:border-white/30"
                                        >
                                            Probar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden flex flex-col divide-y divide-white/5">
                    {DEMO_TROPHIES.map((trophy) => (
                        <div key={trophy._id} className="p-5 flex flex-col gap-4 relative overflow-hidden">
                            {/* Background Glow */}
                            <div
                                className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 pointer-events-none"
                                style={{ backgroundColor: trophy.color }}
                            />

                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg overflow-hidden"
                                        style={{ backgroundColor: `${trophy.color}15`, color: trophy.color }}
                                    >
                                        {trophy.slug === 'oso-oso-mentiroso' ? (
                                            <img src="/images/kuma-logro-primer-trampa.jpg" className="w-full h-full object-cover" />
                                        ) : (
                                            <Trophy weight="duotone" className="w-8 h-8" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg leading-tight">{trophy.name}</h4>
                                        <span className={`
                                            inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border
                                            ${trophy.rarity === 'Legendario' ? 'bg-yellow-900/10 text-yellow-500 border-yellow-500/20' :
                                                trophy.rarity === 'Épico' ? 'bg-purple-900/10 text-purple-500 border-purple-500/20' :
                                                    trophy.rarity === 'Raro' ? 'bg-blue-900/10 text-blue-500 border-blue-500/20' :
                                                        'bg-zinc-800/50 text-zinc-400 border-zinc-700/50'}
                                        `}>
                                            {trophy.rarity}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {trophy.description}
                            </p>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-zinc-600 font-mono font-bold uppercase">
                                    {trophy.hidden ? "Estado: Oculto" : "Estado: Visible"}
                                </span>
                                <button
                                    onClick={() => handleTest(trophy)}
                                    className="h-10 px-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-transform flex items-center gap-2"
                                >
                                    <Play weight="fill" className="w-3 h-3" />
                                    Probar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
