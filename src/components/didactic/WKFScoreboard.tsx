"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PenaltyLevel = 0 | 1 | 2 | 3 | 4; // Levels 1-4 standard
type FinalPenalty = null | 'H' | 'S'; // Mutually exclusive final penalties

interface CompetitorState {
    penaltyLevel: PenaltyLevel; // Tracks C1, C2, C3, HC
    finalPenalty: FinalPenalty; // H or S
    showExplanation: string | null;
}

const PENALTY_EXPLANATIONS: Record<string, string> = {
    "CH1": "Chui 1 • Se otorga por infracciones menores que no disminuyen las posibilidades de victoria del oponente.",
    "CH2": "Chui 2 • Segunda infracción menor. No disminuye las posibilidades de victoria del oponente.",
    "CH3": "Chui 3 • Tercera infracción menor. Última advertencia de esta categoría.",
    "HC": "Hansoku-Chui • Advertencia de Descalificación. El próximo error es fatal.",
    "H": "Hansoku • Descalificación. Victoria para el oponente.",
    "S": "Shikkaku • Expulsión del torneo. Acto malicioso o falta de honor.",
};

export function WKFScoreboard() {
    // --- STATE ---
    const [hasInteracted, setHasInteracted] = useState(false);

    // Initial state
    const [ao, setAo] = useState<CompetitorState>({ penaltyLevel: 0, finalPenalty: null, showExplanation: null });
    const [aka, setAka] = useState<CompetitorState>({ penaltyLevel: 0, finalPenalty: null, showExplanation: null });

    // --- HANDLERS ---

    // updateScore handler removed previously
    // showScore handler removed as scores are visual-only for now

    const handleInteraction = () => {
        if (!hasInteracted) setHasInteracted(true);
    };

    const setPenalty = (competitor: "ao" | "aka", level: PenaltyLevel, type: string) => {
        handleInteraction();
        const explanation = PENALTY_EXPLANATIONS[type] || "";

        const updateLogic = (prev: CompetitorState): CompetitorState => {
            const newLevel = (prev.penaltyLevel === level && !prev.finalPenalty) ? 0 : level;
            return {
                ...prev,
                penaltyLevel: newLevel as PenaltyLevel,
                finalPenalty: null, // Reset final penalty when clicking standard ones
                showExplanation: newLevel === 0 ? null : explanation
            };
        };

        if (competitor === "ao") {
            setAo(updateLogic);
            // Clear other side's simple explanation (optional: keeps their penalty state, just hides text)
            setAka(prev => ({ ...prev, showExplanation: null }));
        } else {
            setAka(updateLogic);
            setAo(prev => ({ ...prev, showExplanation: null }));
        }
    };

    const setFinalPenalty = (competitor: "ao" | "aka", type: 'H' | 'S') => {
        handleInteraction();
        const explanation = PENALTY_EXPLANATIONS[type] || "";

        const updateLogic = (prev: CompetitorState): CompetitorState => {
            // Toggle off if clicking same
            if (prev.finalPenalty === type) {
                return { ...prev, finalPenalty: null, showExplanation: null };
            }

            // If activating H or S, ensure levels 1-4 are active
            return {
                ...prev,
                penaltyLevel: 4, // Force all standard penalties on
                finalPenalty: type,
                showExplanation: explanation
            };
        };

        if (competitor === "ao") {
            setAo(updateLogic);
            setAka(prev => ({ ...prev, showExplanation: null }));
        } else {
            setAka(updateLogic);
            setAo(prev => ({ ...prev, showExplanation: null }));
        }
    };

    // --- RENDER HELPERS ---
    const getRefereeImage = (state: CompetitorState) => {
        // Specific images for specific penalties
        if (state.penaltyLevel === 2) return "/images/kuma-arbitro-chui-2.jpg"; // Chui 2
        if (state.penaltyLevel === 3) return "/images/kuma-arbitro-chui-3.jpg"; // Chui 3

        // Default for others (CH1, HC, H, S) - can be expanded later
        return "/images/kuma-arbitro-chui.jpg";
    };

    const renderPenalties = (state: CompetitorState, competitor: "ao" | "aka") => {
        const standardPenalties = [
            { level: 1, label: "CH 1", type: "CH1", activeColor: "bg-yellow-500", shadow: "shadow-yellow-500/50" },
            { level: 2, label: "CH 2", type: "CH2", activeColor: "bg-yellow-500", shadow: "shadow-yellow-500/50" },
            { level: 3, label: "CH 3", type: "CH3", activeColor: "bg-yellow-500", shadow: "shadow-yellow-500/50" },
            { level: 4, label: "HC", type: "HC", activeColor: "bg-red-600", shadow: "shadow-red-600/80" }, // standard shadow, specialized animation logic in class
        ];

        return (
            <div className="flex items-center gap-6 md:gap-8">

                {/* GROUP 1: Standard Penalties */}
                <div className="flex gap-2">
                    {standardPenalties.map((p) => {
                        const isActive = state.penaltyLevel >= p.level;
                        const isHC = p.type === "HC";

                        return (
                            <motion.div
                                key={p.level}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPenalty(competitor, p.level as PenaltyLevel, p.type);
                                }}
                                whileTap={{ scale: 0.9 }}
                                animate={isActive ? {
                                    scale: [1, 1.15, 0.95, 1.05, 1],
                                    filter: ["brightness(1)", "brightness(2.5)", "brightness(0.8)", "brightness(1.5)", "brightness(1)"],
                                    transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] }
                                } : { scale: 1, filter: "brightness(1)" }}
                                className={`
                                    w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/30 
                                    flex items-center justify-center cursor-pointer relative overflow-hidden
                                    ${isActive
                                        ? `${p.activeColor} border-white shadow-[0_0_15px_rgba(255,255,255,0.6)] ${p.shadow}`
                                        : "bg-gradient-to-br from-white/10 to-black/40 hover:from-white/20 hover:to-black/30 hover:scale-105"
                                    }
                                    ${!hasInteracted ? "animate-pulse ring-2 ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.4)]" : ""}
                                `}
                            >
                                {/* Scanline effect */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
                                )}
                                <span
                                    className={`
                                        font-bold font-mono tracking-tighter leading-none z-10
                                        ${isActive ? "text-white text-[10px] md:text-xs drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" : "text-white/20 text-[8px] md:text-[10px]"}
                                    `}
                                >
                                    {p.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* VISUAL SEPARATOR */}
                <div className="h-8 w-px bg-white/20"></div>

                {/* GROUP 2: Final Penalties (H | S) */}
                <div className="flex items-center gap-3">

                    {/* HANSOKU */}
                    <motion.div
                        onClick={(e) => { e.stopPropagation(); setFinalPenalty(competitor, 'H'); }}
                        whileTap={{ scale: 0.9 }}
                        animate={state.finalPenalty === 'H' ? {
                            scale: [1, 1.15, 0.95, 1.05, 1],
                            filter: ["brightness(1)", "brightness(2.5)", "brightness(0.8)", "brightness(1.5)", "brightness(1)"],
                            transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] }
                        } : { scale: 1, filter: "brightness(1)" }}
                        className={`
                            w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/30 
                            flex items-center justify-center cursor-pointer relative overflow-hidden
                            ${state.finalPenalty === 'H'
                                ? "bg-gradient-to-br from-red-700 to-red-900 border-white shadow-[0_0_20px_rgba(220,38,38,0.8)]"
                                : "bg-gradient-to-br from-white/10 to-black/40 hover:from-white/20 hover:to-black/30 hover:scale-105"
                            }
                            ${!hasInteracted ? "animate-pulse ring-2 ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.4)]" : ""}
                        `}
                    >
                        {state.finalPenalty === 'H' && (
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
                        )}
                        <span className={`font-bold font-mono z-10 ${state.finalPenalty === 'H' ? "text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" : "text-zinc-600"} text-xs md:text-sm`}>H</span>
                    </motion.div>

                    <span className="text-white/30 font-thin text-xl">|</span>

                    {/* SHIKKAKU */}
                    <motion.div
                        onClick={(e) => { e.stopPropagation(); setFinalPenalty(competitor, 'S'); }}
                        whileTap={{ scale: 0.9 }}
                        animate={state.finalPenalty === 'S' ? {
                            scale: [1, 1.15, 0.95, 1.05, 1],
                            filter: ["brightness(1)", "brightness(2.5)", "brightness(0.8)", "brightness(1.5)", "brightness(1)"],
                            transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] }
                        } : { scale: 1, filter: "brightness(1)" }}
                        className={`
                            w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/30 
                            flex items-center justify-center cursor-pointer relative overflow-hidden
                            ${state.finalPenalty === 'S'
                                ? "bg-gradient-to-br from-zinc-100 to-zinc-300 border-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                                : "bg-gradient-to-br from-white/10 to-black/40 hover:from-white/20 hover:to-black/30 hover:scale-105"
                            }
                            ${!hasInteracted ? "animate-pulse ring-2 ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.4)]" : ""}
                        `}
                    >
                        {state.finalPenalty === 'S' && (
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
                        )}
                        <span className={`font-bold font-mono z-10 ${state.finalPenalty === 'S' ? "text-black drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]" : "text-zinc-600"} text-xs md:text-sm`}>SH</span>
                    </motion.div>

                </div>

            </div>
        );
    };

    return (
        <div className="w-full max-w-5xl mx-auto rounded-xl overflow-visible shadow-2xl border-4 border-zinc-800 bg-black relative select-none my-12">

            {/* CENTRAL REFEREE AREA */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-6 pointer-events-none">

                {/* Instructional Sign - Hides on interaction */}
                <div className={`transition-opacity duration-500 ${!hasInteracted ? "opacity-100" : "opacity-0"}`}>
                    <div className="bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8)] animate-bounce mb-2">
                        <p className="text-white font-serif text-sm md:text-base font-bold tracking-wide uppercase text-center">
                            Haz click en las esferas
                        </p>
                    </div>
                </div>

                {/* Floating Container - Always Visible, Content Swaps */}
                <motion.div
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex flex-col items-center perspective-1000 pointer-events-auto"
                >
                    <AnimatePresence mode="wait">
                        {(ao.showExplanation || aka.showExplanation) ? (
                            <motion.div
                                key="active-feedback"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center gap-6"
                            >
                                {/* Active Referee Image */}
                                <div className="w-[180px] md:w-[220px] aspect-[3/4] rounded-xl overflow-hidden border border-white/20 bg-black relative z-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.9),0_10px_20px_-5px_rgba(0,0,0,0.6)] transform preserve-3d">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60"></div>
                                    <img
                                        src={ao.showExplanation ? getRefereeImage(ao) : getRefereeImage(aka)}
                                        alt="Referee Active"
                                        className="w-full h-full object-cover opacity-90 scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-20"></div>
                                </div>

                                {/* Explanation Text */}
                                <div className="text-center bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl max-w-md">
                                    <p className="text-white text-base md:text-lg font-serif font-bold leading-normal drop-shadow-lg">
                                        {(ao.showExplanation || aka.showExplanation)?.split('•')[0]}
                                        <span className={`block text-xs md:text-sm font-sans font-normal mt-2 opacity-90 mx-auto max-w-[250px] ${ao.showExplanation ? "text-blue-200" : "text-red-200"}`}>
                                            {(ao.showExplanation || aka.showExplanation)?.split('•')[1]}
                                        </span>
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            /* Default Idle State - Kuma Arbitro */
                            <motion.div
                                key="idle-referee"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative"
                            >
                                <div className="w-[150px] md:w-[200px] aspect-[3/4] rounded-xl overflow-hidden border border-white/20 bg-black relative z-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.9),0_10px_20px_-5px_rgba(0,0,0,0.6)] transform preserve-3d">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60"></div>
                                    <img
                                        src="/images/kuma-arbitro.jpg"
                                        alt="Referee"
                                        className="w-full h-full object-cover opacity-90 scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-20"></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Generic Floating Shadow (always present) */}
                    <motion.div
                        animate={{ scale: [0.85, 1, 0.85], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-6 bg-black blur-2xl rounded-[100%]"
                    />
                </motion.div>

                {/* UNIFIED PENALTY CONTROLS BAR */}
                <div className="mt-8 flex flex-col items-center gap-4 pointer-events-auto bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-2xl">
                    {/* AO Controls */}
                    <div className="flex items-center gap-3">
                        <span className="text-white font-bold font-serif text-sm tracking-wide">FALTAS</span>
                        {renderPenalties(ao, "ao")}
                    </div>
                </div>

            </div>

            {/* Header Area - Removed 'Click to Learn' text, maybe just logo or empty? */}
            {/* The user requested to remove 'click to interact'. I will keep it empty or subtle. */}

            <div className="flex h-[550px] md:h-[700px]">
                {/* --- AO (BLUE) --- */}
                <div className="flex-1 bg-blue-700 relative flex flex-col items-center justify-end md:justify-center p-4 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.3)] overflow-hidden rounded-l-lg pb-12 md:pb-4">
                    <div className="absolute top-4 left-4 text-white/50 text-4xl md:text-6xl font-black font-serif uppercase tracking-tighter opacity-20">AO</div>
                </div>

                {/* --- AKA (RED) --- */}
                <div className="flex-1 bg-[#EE0000] relative flex flex-col items-center justify-end md:justify-center p-4 shadow-[inset_10px_0_20px_rgba(0,0,0,0.3)] overflow-hidden rounded-r-lg pb-12 md:pb-4">
                    <div className="absolute top-4 right-4 text-white/50 text-4xl md:text-6xl font-black font-serif uppercase tracking-tighter opacity-20">AKA</div>
                </div>
            </div>


        </div>
    );
}
