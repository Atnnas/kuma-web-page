"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { didacticSound } from "@/lib/didacticSound";
import { Question } from "@/types/didactica";
import {
    CheckCircle,
    ArrowCounterClockwise,
    ShieldCheck,
    ArrowRight,
    SpeakerHigh,
    SpeakerSlash,
} from "@phosphor-icons/react";

interface TreePillarsQuestionProps {
    question: Question;
    onCompleted: () => void;
    onCheckAndNext?: () => void;
    isSuperAdmin?: boolean;
}

type PillarId = "kihon" | "kata" | "kumite";

interface GemItem {
    id: PillarId;
    title: string;
    kanji: string;
    role: string;
    nature: string;
    badge: string;
    icon: string;
    color: string;
    glowBorder: string;
    slotX: number; // Porcentaje X en el árbol
    slotY: number; // Porcentaje Y en el árbol
    correctSpeech: string;
    wrongSpeech: string;
}

const GEMS: GemItem[] = [
    {
        id: "kihon",
        title: "Kihon",
        kanji: "基本",
        role: "La Raíz",
        nature: "Básicos y postura firme bajo la tierra",
        badge: "1. RAÍCES (KIHON)",
        icon: "🪨🦶",
        color: "from-amber-600 to-yellow-500",
        glowBorder: "border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.6)]",
        slotX: 49,
        slotY: 82,
        correctSpeech: "¡Kihon en las raíces! La técnica básica sostiene con firmeza todo el árbol.",
        wrongSpeech: "¡Cuidado! Las raíces firmes del Kihon van abajo en la tierra.",
    },
    {
        id: "kata",
        title: "Kata",
        kanji: "型",
        role: "El Tronco",
        nature: "Formas y columna sólida de madera",
        badge: "2. TRONCO (KATA)",
        icon: "🪵🥋",
        color: "from-amber-800 to-amber-600",
        glowBorder: "border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)]",
        slotX: 49,
        slotY: 53,
        correctSpeech: "¡Kata en el tronco! Las formas dan la estructura, la elegancia y la fuerza.",
        wrongSpeech: "¡El tronco del Kata va en el medio! Sostiene y une las ramas con las raíces.",
    },
    {
        id: "kumite",
        title: "Kumite",
        kanji: "組手",
        role: "Las Flores",
        nature: "Combate libre y flores de cerezo",
        badge: "3. FLORES (KUMITE)",
        icon: "🌸⚡",
        color: "from-pink-600 to-rose-400",
        glowBorder: "border-pink-400 shadow-[0_0_25px_rgba(244,114,182,0.7)]",
        slotX: 49,
        slotY: 20,
        correctSpeech: "¡Kumite en la copa! ¡El combate florece en lo más alto como los cerezos!",
        wrongSpeech: "¡Las flores del Kumite florecen arriba en la copa del árbol!",
    },
];

// Localizador inteligente de voz en Español Latino
function findLatinAmericanVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (!voices || voices.length === 0) return null;

    const priorityLangs = [
        "es-cr",
        "es-mx",
        "es-419",
        "es-us",
        "es-co",
        "es-ar",
        "es-cl",
        "es-pe",
    ];

    for (const lang of priorityLangs) {
        const match = voices.find((v) => v.lang.toLowerCase() === lang);
        if (match) return match;
    }

    const latinKeywords = [
        "mexico",
        "méxico",
        "latino",
        "latin",
        "sabina",
        "dalia",
        "jorge",
        "raul",
        "raúl",
        "paulina",
        "gonzalo",
        "mia",
        "alvaro",
        "estados unidos",
    ];

    const matchByName = voices.find((v) => {
        if (!v.lang.toLowerCase().startsWith("es")) return false;
        const nameLower = v.name.toLowerCase();
        return latinKeywords.some((keyword) => nameLower.includes(keyword));
    });
    if (matchByName) return matchByName;

    const nonSpainSpanish = voices.find((v) => {
        const langLower = v.lang.toLowerCase();
        const nameLower = v.name.toLowerCase();
        return (
            langLower.startsWith("es") &&
            !langLower.includes("es-es") &&
            !nameLower.includes("spain") &&
            !nameLower.includes("españa")
        );
    });
    if (nonSpainSpanish) return nonSpainSpanish;

    return voices.find((v) => v.lang.toLowerCase().startsWith("es")) || null;
}

export function TreePillarsQuestion({
    question,
    onCompleted,
    onCheckAndNext,
    isSuperAdmin = false,
}: TreePillarsQuestionProps) {
    // Estado de gemas colocadas en los altares
    const [placedGems, setPlacedGems] = useState<{
        kihon: boolean;
        kata: boolean;
        kumite: boolean;
    }>({
        kihon: false,
        kata: false,
        kumite: false,
    });

    const [selectedGemId, setSelectedGemId] = useState<PillarId | null>(null);
    const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
    const [latinVoice, setLatinVoice] = useState<SpeechSynthesisVoice | null>(null);

    const isAllPlaced = placedGems.kihon && placedGems.kata && placedGems.kumite;

    // Cargar voces en español latino al inicializar
    useEffect(() => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;

        const updateVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const chosen = findLatinAmericanVoice(availableVoices);
            if (chosen) setLatinVoice(chosen);
        };

        updateVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }
    }, []);

    // Síntesis de voz en Español Latino
    const speakKuma = (text: string) => {
        if (!isVoiceActive || typeof window === "undefined" || !window.speechSynthesis) return;

        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);

            let voiceToUse = latinVoice;
            if (!voiceToUse) {
                const currentVoices = window.speechSynthesis.getVoices();
                voiceToUse = findLatinAmericanVoice(currentVoices);
                if (voiceToUse) setLatinVoice(voiceToUse);
            }

            if (voiceToUse) {
                utterance.voice = voiceToUse;
                utterance.lang = voiceToUse.lang;
            } else {
                utterance.lang = "es-419";
            }

            utterance.rate = 0.94;
            utterance.pitch = 1.05;
            window.speechSynthesis.speak(utterance);
        } catch {
            // Silencioso
        }
    };

    // Al inicio, Kuma invita por voz
    useEffect(() => {
        const timer = setTimeout(() => {
            speakKuma(
                "¡Hola karateca! Vamos a alimentar el Árbol del Karate. Coloca las 3 gemas en su lugar: la raíz, el tronco y las flores."
            );
        }, 600);
        return () => {
            clearTimeout(timer);
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Manejo de colocación de gema en un altar
    const handlePlaceOnSlot = (slotId: PillarId) => {
        didacticSound.playClick();

        // Si ya hay una gema seleccionada
        const gemToPlace = selectedGemId || (
            !placedGems.kihon ? "kihon" : !placedGems.kata ? "kata" : !placedGems.kumite ? "kumite" : null
        );

        if (!gemToPlace) return;

        if (gemToPlace === slotId) {
            // Acierto: la gema coincide con el altar
            didacticSound.playCorrect();
            const nextPlaced = { ...placedGems, [slotId]: true };
            setPlacedGems(nextPlaced);
            setSelectedGemId(null);

            const gemData = GEMS.find((g) => g.id === slotId);
            if (gemData) {
                speakKuma(gemData.correctSpeech);
            }

            // Si se completaron las 3 gemas
            if (nextPlaced.kihon && nextPlaced.kata && nextPlaced.kumite) {
                triggerVictory();
            }
        } else {
            // Error con efecto marcial y voz guía
            didacticSound.playWrong();
            const wrongGem = GEMS.find((g) => g.id === gemToPlace);
            if (wrongGem) {
                speakKuma(wrongGem.wrongSpeech);
            }
        }
    };

    // Selección de una gema
    const handleSelectGem = (gemId: PillarId) => {
        if (placedGems[gemId]) return;
        didacticSound.playClick();
        setSelectedGemId(gemId);
        const gem = GEMS.find((g) => g.id === gemId);
        if (gem) {
            speakKuma(`Seleccionaste ${gem.title}. ¿Dónde va en el árbol?`);
        }
    };

    // Celebración final
    const triggerVictory = () => {
        didacticSound.playStreak();
        confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 },
            colors: ["#F472B6", "#FFC800", "#58CC02", "#FFFFFF", "#FBBF24"],
        });
        speakKuma(
            "¡Extraordinario karateca! El Árbol del Karate ha florecido por completo con Kihon, Kata y Kumite."
        );
        onCompleted();
    };

    // Auto-completar Super Admin
    const handleAdminAutoFill = () => {
        didacticSound.playClick();
        setPlacedGems({ kihon: true, kata: true, kumite: true });
        triggerVictory();
    };

    // Reiniciar gemas
    const handleReset = () => {
        didacticSound.playClick();
        setPlacedGems({ kihon: false, kata: false, kumite: false });
        setSelectedGemId(null);
        speakKuma("¡Árbol reiniciado! Coloca de nuevo las tres gemas mágicas.");
    };

    return (
        <div className="w-full space-y-3 select-none">
            {/* Super Admin Toolbar (Solo visible en pantallas medianas/grandes para no restar espacio a la foto en móvil) */}
            {isSuperAdmin && (
                <div className="hidden md:flex items-center justify-between p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    <span className="font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" weight="fill" />
                        <span>Super Admin: Resolver árbol</span>
                    </span>
                    <button
                        type="button"
                        onClick={handleAdminAutoFill}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer"
                    >
                        Auto-Colocar Gemas
                    </button>
                </div>
            )}

            {/* ========================================================= */}
            {/* EL GRAN ÁRBOL PIXAR 3D CON ALTARES MÍSTICOS */}
            {/* ========================================================= */}
            <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-amber-400/50 shadow-[0_8px_30px_rgba(0,0,0,0.8)] bg-slate-950">
                {/* 1. Fondo: Ilustración 3D Pixar del Árbol de Cerezo */}
                <Image
                    src="/images/didactic/kuma_pixar_tree_pillars_v2.jpg"
                    alt="Árbol Sagrado de Karate Pixar 3D con Kuma Sensei"
                    fill
                    priority
                    className="object-cover"
                />

                {/* Sutil viñeta para contraste */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                {/* Botón sutil flotante de Voz en Español Latino (pequeño y discreto) */}
                <button
                    type="button"
                    onClick={() => {
                        if (isVoiceActive) {
                            if (typeof window !== "undefined" && window.speechSynthesis) {
                                window.speechSynthesis.cancel();
                            }
                            setIsVoiceActive(false);
                        } else {
                            setIsVoiceActive(true);
                            speakKuma(
                                isAllPlaced
                                    ? "¡El árbol ha florecido! Toca comprobar técnica."
                                    : "Toca una gema abajo y luego toca su altar en el árbol."
                            );
                        }
                    }}
                    className={`absolute top-3 left-3 z-30 px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md border shadow-md ${
                        isVoiceActive
                            ? "bg-black/75 border-[#58CC02]/80 text-[#58CC02] shadow-[0_0_10px_rgba(88,204,2,0.3)]"
                            : "bg-black/60 border-white/20 text-slate-300 hover:text-white"
                    }`}
                    title={isVoiceActive ? "Voz activa (toca para silenciar)" : "Activar voz"}
                >
                    {isVoiceActive ? (
                        <>
                            <SpeakerHigh className="w-3.5 h-3.5" weight="fill" />
                            <span>Voz: ON</span>
                        </>
                    ) : (
                        <>
                            <SpeakerSlash className="w-3.5 h-3.5" />
                            <span>Voz: OFF</span>
                        </>
                    )}
                </button>

                {/* Botón sutil flotante para Reiniciar (visible cuando hay gemas colocadas y antes de completar) */}
                {(placedGems.kihon || placedGems.kata || placedGems.kumite) && !isAllPlaced && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="absolute top-3 right-3 z-30 px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white/90 hover:text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md"
                        title="Reiniciar gemas"
                    >
                        <ArrowCounterClockwise className="w-3.5 h-3.5" />
                        <span>Reiniciar</span>
                    </button>
                )}

                {/* 2. LOS 3 ALTARES SAGRADOS EN EL ÁRBOL */}
                {GEMS.map((gem) => {
                    const isPlaced = placedGems[gem.id];
                    const isCurrentTarget = selectedGemId === gem.id;

                    return (
                        <div
                            key={gem.id}
                            style={{
                                left: `${gem.slotX}%`,
                                top: `${gem.slotY}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                            className="absolute z-20"
                        >
                            {/* Flecha saltarina guiando al altar si la gema correspondiente está seleccionada */}
                            {isCurrentTarget && (
                                <motion.div
                                    animate={{ y: [-8, 0, -8] }}
                                    transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                                    className="absolute -top-11 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30"
                                >
                                    <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg whitespace-nowrap border border-black/40">
                                        ¡Colocar {gem.title}!
                                    </span>
                                    <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-yellow-400" />
                                </motion.div>
                            )}

                            {/* Altar táctil circular */}
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => handlePlaceOnSlot(gem.id)}
                                className={`relative flex items-center justify-center rounded-full transition-all cursor-pointer shadow-xl ${
                                    isPlaced
                                        ? `w-14 h-14 sm:w-18 sm:h-18 bg-gradient-to-tr ${gem.color} ${gem.glowBorder} ring-4 ring-white/60`
                                        : isCurrentTarget
                                        ? "w-14 h-14 sm:w-18 sm:h-18 bg-yellow-400/80 ring-4 ring-yellow-300 animate-pulse shadow-[0_0_30px_rgba(250,204,21,0.9)]"
                                        : "w-12 h-12 sm:w-15 sm:h-15 bg-black/75 hover:bg-black/90 ring-2 ring-white/50 border-2 border-dashed border-yellow-300/60 backdrop-blur-sm"
                                }`}
                            >
                                {isPlaced ? (
                                    <div className="flex flex-col items-center justify-center leading-none">
                                        <span className="text-2xl sm:text-3xl drop-shadow">{gem.icon}</span>
                                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                                            <CheckCircle className="w-4 h-4" weight="fill" />
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <span className="text-base sm:text-xl opacity-70">❓</span>
                                    </div>
                                )}
                            </motion.button>

                            {/* Etiqueta ultra-clara del altar */}
                            <div className="mt-1 text-center pointer-events-none whitespace-nowrap">
                                <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-md border ${
                                        isPlaced
                                            ? "bg-[#143818]/90 text-emerald-200 border-emerald-400/50"
                                            : isCurrentTarget
                                            ? "bg-yellow-400 text-slate-950 border-black"
                                            : "bg-black/80 text-amber-200 border-white/20"
                                    }`}
                                >
                                    {isPlaced ? `${gem.title} (${gem.kanji})` : gem.role}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* 3. MODAL DE VICTORIA CON EL BOTÓN DIRECTO DE COMPROBAR TÉCNICA */}
                <AnimatePresence>
                    {isAllPlaced && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-40 bg-black/65 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center"
                        >
                            <div className="bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0A0F1D] border-3 border-yellow-400 rounded-3xl p-4 sm:p-6 shadow-[0_0_40px_rgba(250,204,21,0.5)] max-w-md w-full">
                                <div className="text-4xl sm:text-5xl mb-2 animate-bounce">
                                    🌸🥋✨
                                </div>
                                <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] text-pink-300 bg-pink-950/80 px-3 py-1 rounded-full border border-pink-400/50 mb-1.5">
                                    ¡Árbol Sagrado Florecido!
                                </span>
                                <h3 className="text-lg sm:text-xl font-serif font-black text-white">
                                    🪨 Kihon + 🪵 Kata + 🌸 Kumite
                                </h3>
                                <p className="text-xs sm:text-sm text-emerald-300 font-medium mt-1">
                                    ¡Las 3 &apos;K&apos; del Karate! Las raíces firmes (Kihon) sostienen el tronco (Kata) para hacer florecer el combate (Kumite).
                                </p>

                                {/* BOTÓN PRINCIPAL: COMPROBAR TÉCNICA Y PASAR A LA SIGUIENTE PREGUNTA */}
                                <div className="mt-4 flex flex-col items-center gap-2.5 w-full">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            didacticSound.playCorrect();
                                            if (onCheckAndNext) {
                                                onCheckAndNext();
                                            } else {
                                                onCompleted();
                                            }
                                        }}
                                        className="w-full py-3.5 px-6 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] active:translate-y-1 text-white font-black text-xs sm:text-sm uppercase tracking-wider border-b-4 border-[#46A302] shadow-[0_0_25px_rgba(88,204,2,0.5)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                                    >
                                        <span>Comprobar Técnica</span>
                                        <ArrowRight className="w-4 h-4" weight="bold" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="text-xs text-slate-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer py-1"
                                    >
                                        <ArrowCounterClockwise className="w-3.5 h-3.5" />
                                        <span>Reiniciar gemas</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ========================================================= */}
            {/* LAS 3 GEMAS ELEMENTALES PARA TOCAR Y COLOCAR */}
            {/* ========================================================= */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                {GEMS.map((gem) => {
                    const isPlaced = placedGems[gem.id];
                    const isSelected = selectedGemId === gem.id;

                    return (
                        <motion.div
                            key={gem.id}
                            whileHover={!isPlaced ? { scale: 1.03, y: -2 } : {}}
                            whileTap={!isPlaced ? { scale: 0.97 } : {}}
                            onClick={() => handleSelectGem(gem.id)}
                            className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all select-none cursor-pointer relative overflow-hidden ${
                                isPlaced
                                    ? "bg-[#142A1D]/90 border-[#58CC02] opacity-60 cursor-default shadow-[0_0_15px_rgba(88,204,2,0.2)]"
                                    : isSelected
                                    ? "bg-gradient-to-b from-[#2B230E] to-[#1E190A] border-yellow-400 ring-4 ring-yellow-400/40 shadow-xl"
                                    : "bg-gradient-to-b from-[#1E293B] to-[#0F172A] hover:bg-[#283548] border-[#334155] hover:border-amber-400 shadow-md"
                            }`}
                        >
                            <span className="text-2xl sm:text-3xl block">{gem.icon}</span>
                            <p className="text-xs sm:text-sm font-black text-white mt-1 leading-tight">
                                {gem.title}
                            </p>
                            <span className="text-[10px] text-amber-300 font-bold block mt-0.5">
                                {gem.role}
                            </span>

                            {/* Badge de estado */}
                            <div className="mt-1.5">
                                {isPlaced ? (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-[#58CC02] bg-[#143818] px-2 py-0.5 rounded-full border border-[#58CC02]/40">
                                        <CheckCircle className="w-3 h-3" weight="fill" />
                                        <span>Colocada</span>
                                    </span>
                                ) : isSelected ? (
                                    <span className="inline-block text-[9px] font-black uppercase text-yellow-300 bg-yellow-950 px-2 py-0.5 rounded-full border border-yellow-400/40 animate-pulse">
                                        ¡Toca el Altar!
                                    </span>
                                ) : (
                                    <span className="inline-block text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                                        Tocar para mover
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
