"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BELT_RANKS, getBeltRank } from "@/data/beltRanks";
import { DIDACTIC_UNITS } from "@/data/didacticaData";
import { BeltRankId, BeltRank, UserDidacticProgress } from "@/types/didactica";
import { BeltObiVisual, BeltCircularEmblem } from "./BeltCascadeSection";
import { Compass, CaretDown, ArrowDown, Lock } from "@phosphor-icons/react";

interface BeltSelectorProps {
    activeBeltId: BeltRankId;
    onSelectBelt: (beltId: BeltRankId) => void;
    progress: UserDidacticProgress;
}

export function BeltSelector({ activeBeltId, onSelectBelt, progress }: BeltSelectorProps) {
    const [tab, setTab] = useState<"all" | "kyu" | "dan">("kyu");

    const kyuRanks = BELT_RANKS.filter((b) => b.category === "kyu");
    const danRanks = BELT_RANKS.filter((b) => b.category === "dan");
    const displayRanks = tab === "all" ? BELT_RANKS : tab === "kyu" ? kyuRanks : danRanks;

    const activeBelt = getBeltRank(activeBeltId);

    const tradUnits = DIDACTIC_UNITS.filter((u) => u.path === "tradicional");
    const checkIsBeltUnlocked = (beltId: string) => {
        const idx = tradUnits.findIndex((u) => u.beltId === beltId);
        if (idx <= 0) return true;
        const prevUnit = tradUnits[idx - 1];
        const prevWon = prevUnit.levels.every((l) => progress.completedLevelIds.includes(l.id));
        const currStarted = tradUnits[idx]?.levels.some((l) => progress.completedLevelIds.includes(l.id));
        return prevWon || currStarted;
    };

    const handleJumpToBelt = (beltId: BeltRankId) => {
        onSelectBelt(beltId);
        const element = document.getElementById(`belt-${beltId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-10">
            {/* QUICK NAVIGATOR CARD */}
            <div className="p-4 md:p-5 rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black border border-kuma-gold/30 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-kuma-gold" weight="fill" />
                        <div>
                            <h3 className="font-serif font-black text-white text-sm md:text-base leading-tight">
                                Navegador de Cinturones en Cascada
                            </h3>
                            <p className="text-[11px] text-zinc-400">
                                Los cinturones se abren progresivamente al ganar las clases
                            </p>
                        </div>
                    </div>

                    {/* Quick Tabs: Kyu vs Dan */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10 shrink-0">
                        <button
                            onClick={() => setTab("kyu")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                tab === "kyu"
                                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 shadow-md"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            10° – 1° Kyu
                        </button>
                        <button
                            onClick={() => setTab("dan")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                tab === "dan"
                                    ? "bg-gradient-to-r from-zinc-800 to-black text-amber-400 border border-amber-500/40 shadow-md"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            1° – 10° Dan
                        </button>
                    </div>
                </div>

                {/* HORIZONTAL QUICK-JUMP CHIPS */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                    {displayRanks.map((b) => {
                        const isActive = b.id === activeBeltId;
                        const isDan = b.category === "dan";
                        const isUnlocked = checkIsBeltUnlocked(b.id);

                        return (
                            <button
                                key={b.id}
                                onClick={() => handleJumpToBelt(b.id)}
                                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 transition-all cursor-pointer select-none ${
                                    isActive
                                        ? "bg-white/15 border-kuma-gold ring-1 ring-kuma-gold text-white scale-105 shadow-lg shadow-kuma-gold/20"
                                        : isUnlocked
                                        ? "bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.08] hover:border-white/25"
                                        : "bg-black/40 border-white/5 text-zinc-500 opacity-60 hover:opacity-90"
                                }`}
                            >
                                {/* Mini Belt Dot / Bolita (Black for Dans!) */}
                                <span
                                    className="w-3.5 h-3.5 rounded-full border shrink-0 flex items-center justify-center text-[7px]"
                                    style={{
                                        backgroundColor: !isUnlocked
                                            ? "#27272A"
                                            : isDan
                                            ? "#18181B"
                                            : b.color,
                                        borderColor: !isUnlocked
                                            ? "#3F3F46"
                                            : isDan
                                            ? "#F59E0B"
                                            : b.strokeColor,
                                        boxShadow:
                                            isUnlocked && isDan
                                                ? "0 0 5px rgba(245,158,11,0.5)"
                                                : undefined,
                                    }}
                                />

                                <span className="font-serif">{b.shortName}</span>

                                {!isUnlocked ? (
                                    <Lock className="w-3 h-3 text-zinc-500" weight="fill" />
                                ) : (
                                    <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                        {b.japaneseName.includes("—") ? b.japaneseName.split("—")[1].trim() : b.shortName}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Explanatory subtitle */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                        <ArrowDown className="w-3.5 h-3.5 text-kuma-gold animate-bounce" weight="bold" />
                        Gana las clases de cada cinturón para abrir el siguiente
                    </span>
                    {activeBelt && (
                        <span className="text-kuma-gold font-bold">
                            Enfoque: {activeBelt.shortName} — {activeBelt.japaneseName.includes("—") ? activeBelt.japaneseName.split("—")[1].trim() : activeBelt.theme}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
