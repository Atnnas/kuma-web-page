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
    Sparkle,
    MapPin,
} from "@phosphor-icons/react";

interface OkinawaBranchesQuestionProps {
    question: Question;
    onCompleted: () => void;
    onCheckAndNext?: () => void;
    isSuperAdmin?: boolean;
}

type BranchId = "shuri" | "tomari" | "naha";

interface BranchItem {
    id: BranchId;
    title: string;
    kanji: string;
    city: string;
    role: string;
    essence: string;
    icon: string;
    color: string;
    glowBorder: string;
    slotX: number; // Porcentaje X en el mapa de Okinawa
    slotY: number; // Porcentaje Y en el mapa de Okinawa
    speech: string;
    wrongSpeech: string;
    description: string;
}

const BRANCHES: BranchItem[] = [
    {
        id: "shuri",
        title: "Shuri-Te",
        kanji: "首里手",
        city: "Shuri",
        role: "Castillo & Nobleza",
        essence: "Agilidad y Rapidez",
        icon: "🏯",
        color: "from-red-600 via-rose-600 to-amber-600",
        glowBorder: "border-red-400",
        slotX: 54, // Castillo de Shuri en la colina central
        slotY: 42,
        speech: "¡Shuri-Te en el Castillo Real! Aquí entrenaban la nobleza y los reyes con técnicas rápidas, ágiles y lineales.",
        wrongSpeech: "¡Esa ciudad es otra! Shuri-Te se originó en el Castillo de Shuri, arriba en la colina roja.",
        description: "Nobleza del Palacio • Técnicas rápidas, directas y elegantes",
    },
    {
        id: "tomari",
        title: "Tomari-Te",
        kanji: "泊手",
        city: "Tomari",
        role: "Puerto Pesquero",
        essence: "Fluidez y Evasión",
        icon: "⚓",
        color: "from-cyan-600 via-teal-600 to-emerald-600",
        glowBorder: "border-cyan-400",
        slotX: 38, // Bahía pesquera y muelles a la izquierda
        slotY: 58,
        speech: "¡Tomari-Te en la bahía pesquera! Los pescadores crearon técnicas fluidas, fintas evasivas y saltos sorpresivos.",
        wrongSpeech: "¡Ese no es el puerto de Tomari! Tomari-Te nació en los muelles de pescadores a orillas de la bahía.",
        description: "Pescadores de la bahía • Movimientos fluidos, evasión y saltos",
    },
    {
        id: "naha",
        title: "Naha-Te",
        kanji: "那覇手",
        city: "Naha",
        role: "Puerto Comercial",
        essence: "Potencia e Ibuki",
        icon: "🚢",
        color: "from-amber-500 via-orange-600 to-amber-700",
        glowBorder: "border-amber-400",
        slotX: 62, // Gran puerto mercantil al sur
        slotY: 68,
        speech: "¡Naha-Te en el gran puerto comercial! Los marineros entrenaban fuerza física sólida, agarres y respiración profunda Ibuki.",
        wrongSpeech: "¡Ese no es el puerto de Naha! Naha-Te nació en el gran puerto comercial mercantil del sur.",
        description: "Marineros y comercio • Posiciones firmes, fuerza y respiración Ibuki",
    },
];

// Helper para encontrar voz en español latinoamericano
function findLatinAmericanVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    const latinVoice = voices.find((v) => {
        const lang = v.lang.toLowerCase();
        const name = v.name.toLowerCase();
        const isLatinLang =
            lang === "es-419" ||
            lang === "es-mx" ||
            lang === "es-cr" ||
            lang === "es-co" ||
            lang === "es-ar" ||
            lang === "es-cl" ||
            lang === "es-pe" ||
            lang === "es-us";
        const hasLatinKeyword =
            name.includes("latin") ||
            name.includes("mexico") ||
            name.includes("méxico") ||
            name.includes("paulino") ||
            name.includes("sabina") ||
            name.includes("raul") ||
            name.includes("raúl") ||
            name.includes("lupe");
        return isLatinLang || hasLatinKeyword;
    });

    if (latinVoice) return latinVoice;
    return voices.find((v) => v.lang.toLowerCase().startsWith("es")) || null;
}

export function OkinawaBranchesQuestion({
    question,
    onCompleted,
    onCheckAndNext,
    isSuperAdmin = false,
}: OkinawaBranchesQuestionProps) {
    const [discovered, setDiscovered] = useState<Record<BranchId, boolean>>({
        shuri: false,
        tomari: false,
        naha: false,
    });

    const [selectedBranchId, setSelectedBranchId] = useState<BranchId | null>("shuri");
    const [lastCompletedCity, setLastCompletedCity] = useState<BranchId>("naha");
    const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
    const [latinVoice, setLatinVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [isExplainingTriangle, setIsExplainingTriangle] = useState<boolean>(false);
    const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
    const triangleTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    const isAllDiscovered = discovered.shuri && discovered.tomari && discovered.naha;

    // Limpiar temporizador si se desmonta
    useEffect(() => {
        return () => {
            if (triangleTimerRef.current) clearTimeout(triangleTimerRef.current);
        };
    }, []);

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

    // Síntesis de voz amigable en Español Latino
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

    // Al inicio, Sensei Kuma invita a explorar el mapa
    useEffect(() => {
        const timer = setTimeout(() => {
            speakKuma(
                "¡Hola karateca! En la isla de Okinawa nacieron tres ramas matrices. Toca Shuri, Tomari y Naha en el mapa para revelar sus secretos."
            );
        }, 600);
        return () => {
            clearTimeout(timer);
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Manejo de toque en una ciudad del mapa
    const handleCityClick = (cityId: BranchId) => {
        didacticSound.playClick();

        // Determinar qué rama queremos colocar: la seleccionada, o si no hay ninguna, la que corresponda a esta ciudad
        const branchToPlace = selectedBranchId || (
            !discovered.shuri ? "shuri" : !discovered.tomari ? "tomari" : !discovered.naha ? "naha" : null
        );

        if (!branchToPlace) return;

        if (branchToPlace === cityId) {
            // Acierto
            didacticSound.playWoodBreak();
            const nextDiscovered = { ...discovered, [cityId]: true };
            setDiscovered(nextDiscovered);

            // Seleccionar automáticamente la siguiente rama sin descubrir
            if (!nextDiscovered.shuri) setSelectedBranchId("shuri");
            else if (!nextDiscovered.tomari) setSelectedBranchId("tomari");
            else if (!nextDiscovered.naha) setSelectedBranchId("naha");
            else setSelectedBranchId(null);

            const branchData = BRANCHES.find((b) => b.id === cityId);

            // Si se descubrieron las 3 ramas matrices
            if (nextDiscovered.shuri && nextDiscovered.tomari && nextDiscovered.naha) {
                setLastCompletedCity(cityId);
                setIsExplainingTriangle(true);
                setShowVictoryModal(false);
                didacticSound.playStreak();
                confetti({
                    particleCount: 75,
                    spread: 85,
                    origin: { y: 0.6 },
                    colors: ["#EF4444", "#06B6D4", "#F59E0B", "#FFFFFF"],
                });

                if (cityId === "naha") {
                    speakKuma(
                        "¡Naha-Te en el gran puerto comercial! Los marineros y comerciantes forjaron un estilo de fuerza física sólida, agarres y respiración profunda Ibuki. ¡Con esto el Triángulo Sagrado de Okinawa queda completo junto a Shuri y Tomari!"
                    );
                } else if (cityId === "tomari") {
                    speakKuma(
                        "¡Tomari-Te en la bahía pesquera! Los pescadores crearon técnicas fluidas, fintas evasivas y saltos sorpresivos. ¡Con esto el Triángulo Sagrado de Okinawa queda completo junto a Shuri y Naha!"
                    );
                } else {
                    speakKuma(
                        "¡Shuri-Te en el Castillo Real! La nobleza entrenaba técnicas rápidas, ágiles y lineales. ¡Con esto el Triángulo Sagrado de Okinawa queda completo junto a Tomari y Naha!"
                    );
                }

                if (triangleTimerRef.current) clearTimeout(triangleTimerRef.current);
                triangleTimerRef.current = setTimeout(() => {
                    setIsExplainingTriangle(false);
                    setShowVictoryModal(true);
                    triggerVictory();
                }, 8000);
            } else if (branchData) {
                speakKuma(branchData.speech);
            }
        } else {
            // Error amigable
            didacticSound.playWrong();
            const wrongBranch = BRANCHES.find((b) => b.id === branchToPlace);
            if (wrongBranch) {
                speakKuma(wrongBranch.wrongSpeech);
            }
        }
    };

    // Selección manual de una rama en la barra inferior
    const handleSelectBranch = (branchId: BranchId) => {
        didacticSound.playClick();
        setSelectedBranchId(branchId);
        const branchData = BRANCHES.find((b) => b.id === branchId);
        if (branchData) {
            if (discovered[branchId]) {
                speakKuma(`¡${branchData.title}! ${branchData.description}.`);
            } else {
                if (branchId === "naha") {
                    speakKuma("Seleccionaste Naha-Te, del gran puerto comercial. ¡Toca el puerto al sur del mapa!");
                } else if (branchId === "tomari") {
                    speakKuma("Seleccionaste Tomari-Te, de la bahía pesquera. ¡Toca los muelles a la izquierda!");
                } else {
                    speakKuma("Seleccionaste Shuri-Te, del Palacio Real. ¡Toca el castillo rojo en la colina!");
                }
            }
        }
    };

    // Celebración final
    const triggerVictory = () => {
        didacticSound.playStreak();
        confetti({
            particleCount: 85,
            spread: 95,
            origin: { y: 0.6 },
            colors: ["#EF4444", "#06B6D4", "#F59E0B", "#FFFFFF", "#58CC02"],
        });
        setShowVictoryModal(true);
        onCompleted();
    };

    // Auto-completar Super Admin
    const handleAdminAutoFill = () => {
        didacticSound.playClick();
        if (triangleTimerRef.current) clearTimeout(triangleTimerRef.current);
        setLastCompletedCity("naha");
        setIsExplainingTriangle(false);
        setShowVictoryModal(true);
        setDiscovered({ shuri: true, tomari: true, naha: true });
        triggerVictory();
    };

    // Reiniciar exploración
    const handleReset = () => {
        didacticSound.playClick();
        if (triangleTimerRef.current) clearTimeout(triangleTimerRef.current);
        setLastCompletedCity("naha");
        setIsExplainingTriangle(false);
        setShowVictoryModal(false);
        setDiscovered({ shuri: false, tomari: false, naha: false });
        setSelectedBranchId("shuri");
        speakKuma("¡Mapa reiniciado! Explora nuevamente las 3 ciudades de Okinawa.");
    };

    return (
        <div className="w-full space-y-3 select-none">
            {/* Super Admin Toolbar (Solo visible en pantallas medianas/grandes) */}
            {isSuperAdmin && (
                <div className="hidden md:flex items-center justify-between p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    <span className="font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" weight="fill" />
                        <span>Super Admin: Resolver 3 ramas de Okinawa</span>
                    </span>
                    <button
                        type="button"
                        onClick={handleAdminAutoFill}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer"
                    >
                        Auto-Completar Ramas
                    </button>
                </div>
            )}

            {/* ========================================================= */}
            {/* LIENZO PRINCIPAL DEL LIBRO ILUSTRADO DE OKINAWA */}
            {/* ========================================================= */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[68vh] rounded-3xl overflow-hidden border-2 border-amber-500/40 bg-slate-950 shadow-2xl">
                {/* 1. IMAGEN DE FONDO: LIBRO ILUSTRADO PIXAR DE OKINAWA */}
                <Image
                    src="/images/didactic/kuma_pixar_okinawa_branches.jpg"
                    alt="Libro de estampas ilustrado de la Isla de Okinawa y sus 3 ramas matrices de Karate"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 850px"
                    className="object-cover object-center"
                />

                {/* Sutil viñeta para contraste */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                {/* Botón flotante de Voz en Español Latino */}
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
                                isAllDiscovered
                                    ? "¡Las tres ciudades han sido reveladas! Toca comprobar técnica."
                                    : "Toca una rama abajo y luego toca su ciudad en el mapa."
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

                {/* Botón flotante para Reiniciar */}
                {(discovered.shuri || discovered.tomari || discovered.naha) && !showVictoryModal && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="absolute top-3 right-3 z-30 px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white/90 hover:text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md"
                        title="Reiniciar mapa"
                    >
                        <ArrowCounterClockwise className="w-3.5 h-3.5" />
                        <span>Reiniciar</span>
                    </button>
                )}

                {/* 2. SVG CON LÍNEAS DEL TRIÁNGULO SAGRADO DE OKINAWA */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
                    {/* Línea Shuri <-> Tomari */}
                    {discovered.shuri && discovered.tomari && (
                        <motion.line
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.9 }}
                            transition={{ duration: 0.8 }}
                            x1="54%"
                            y1="42%"
                            x2="38%"
                            y2="58%"
                            stroke="#FBBF24"
                            strokeWidth="3.5"
                            strokeDasharray="6 4"
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                        />
                    )}
                    {/* Línea Tomari <-> Naha */}
                    {discovered.tomari && discovered.naha && (
                        <motion.line
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.9 }}
                            transition={{ duration: 0.8 }}
                            x1="38%"
                            y1="58%"
                            x2="62%"
                            y2="68%"
                            stroke="#FBBF24"
                            strokeWidth="3.5"
                            strokeDasharray="6 4"
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                        />
                    )}
                    {/* Línea Naha <-> Shuri */}
                    {discovered.naha && discovered.shuri && (
                        <motion.line
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.9 }}
                            transition={{ duration: 0.8 }}
                            x1="62%"
                            y1="68%"
                            x2="54%"
                            y2="42%"
                            stroke="#FBBF24"
                            strokeWidth="3.5"
                            strokeDasharray="6 4"
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                        />
                    )}
                </svg>

                {/* 3. PINES / ALTARES TÁCTILES EN EL MAPA */}
                {BRANCHES.map((branch) => {
                    const isFound = discovered[branch.id];
                    const isCurrentTarget = selectedBranchId === branch.id;

                    return (
                        <div
                            key={branch.id}
                            style={{
                                left: `${branch.slotX}%`,
                                top: `${branch.slotY}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                            className="absolute z-20"
                        >
                            {/* Flecha saltarina guiando a la ciudad correspondiente */}
                            {isCurrentTarget && (
                                <motion.div
                                    animate={{ y: [-4, 0, -4] }}
                                    transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                                    className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30"
                                >
                                    <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-md whitespace-nowrap border border-black/40">
                                        ¡Toca {branch.city}!
                                    </span>
                                    <div className="w-0 h-0 border-x-3 border-x-transparent border-t-4 border-t-yellow-400" />
                                </motion.div>
                            )}

                            {/* Pin circular interactivo */}
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => handleCityClick(branch.id)}
                                className={`relative flex items-center justify-center rounded-full transition-all cursor-pointer shadow-xl ${
                                    isFound
                                        ? `w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr ${branch.color} ring-3 sm:ring-4 ring-white/80 shadow-[0_0_25px_rgba(251,191,36,0.8)]`
                                        : isCurrentTarget
                                        ? "w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400/85 ring-3 sm:ring-4 ring-yellow-300 animate-pulse shadow-[0_0_25px_rgba(250,204,21,0.9)]"
                                        : "w-11 h-11 sm:w-14 sm:h-14 bg-black/75 hover:bg-black/90 ring-2 ring-white/50 border-2 border-dashed border-amber-300/70 backdrop-blur-sm"
                                }`}
                            >
                                {isFound ? (
                                    <div className="flex flex-col items-center justify-center leading-none">
                                        <span className="text-xl sm:text-2xl drop-shadow">{branch.icon}</span>
                                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                                            <CheckCircle className="w-3.5 h-3.5" weight="fill" />
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" weight="fill" />
                                        <span className="text-[9px] font-black text-white/90 leading-none mt-0.5">
                                            {branch.city}
                                        </span>
                                    </div>
                                )}
                            </motion.button>

                            {/* Etiqueta ultra-clara de la rama */}
                            <div className="mt-1 text-center pointer-events-none whitespace-nowrap">
                                <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md border ${
                                        isFound
                                            ? "bg-[#143818]/90 text-emerald-200 border-emerald-400/60"
                                            : isCurrentTarget
                                            ? "bg-yellow-400 text-slate-950 border-black"
                                            : "bg-black/80 text-amber-200 border-white/20"
                                    }`}
                                >
                                    {isFound ? `${branch.title} (${branch.kanji})` : branch.role}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* 4. BANNER PEDAGÓGICO DE LA RAMA Y EL TRIÁNGULO DE OKINAWA (ANTES DEL MODAL FINAL) */}
                <AnimatePresence>
                    {isAllDiscovered && isExplainingTriangle && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-red-950/95 via-black/95 to-amber-950/95 border-2 border-amber-400 px-4 py-2.5 rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.7)] text-center max-w-[94%] backdrop-blur-md"
                        >
                            <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-amber-300">
                                <Sparkle weight="fill" className="text-yellow-400" />
                                <span>
                                    {lastCompletedCity === "naha"
                                        ? "🚢 ¡NAHA-TE: FUERZA Y RESPIRACIÓN IBUKI!"
                                        : lastCompletedCity === "tomari"
                                        ? "⚓ ¡TOMARI-TE: FLUIDEZ Y EVASIÓN!"
                                        : "🏯 ¡SHURI-TE: AGILIDAD Y NOBLEZA REAL!"}
                                </span>
                                <Sparkle weight="fill" className="text-yellow-400" />
                            </div>
                            <p className="text-[11px] sm:text-xs text-white mt-0.5 leading-snug">
                                {lastCompletedCity === "naha"
                                    ? "En el puerto de Naha nació la potencia muscular y respiración Ibuki. ¡Junto a Shuri (agilidad) y Tomari (fluidez), el Triángulo Sagrado de Okinawa queda completo!"
                                    : lastCompletedCity === "tomari"
                                    ? "En Tomari nació la fluidez y fintas sorpresivas. ¡Junto a Shuri (agilidad) y Naha (potencia), el Triángulo Sagrado de Okinawa queda completo!"
                                    : "En Shuri nació la velocidad y técnicas lineales de palacio. ¡Junto a Tomari (fluidez) y Naha (potencia), el Triángulo Sagrado de Okinawa queda completo!"}
                            </p>
                            <div className="mt-1.5 flex items-center justify-center gap-2">
                                <span className="text-[10px] font-bold text-amber-200 bg-black/60 px-2 py-0.5 rounded-full border border-white/20 animate-pulse">
                                    🎧 Escuchando explicación de {lastCompletedCity === "naha" ? "Naha-Te" : lastCompletedCity === "tomari" ? "Tomari-Te" : "Shuri-Te"}...
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (triangleTimerRef.current) clearTimeout(triangleTimerRef.current);
                                        setIsExplainingTriangle(false);
                                        setShowVictoryModal(true);
                                        triggerVictory();
                                    }}
                                    className="px-2.5 py-0.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] uppercase cursor-pointer transition-all shadow"
                                >
                                    Continuar ▶
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 5. MODAL DE VICTORIA CON EL BOTÓN DIRECTO DE COMPROBAR TÉCNICA */}
                <AnimatePresence>
                    {isAllDiscovered && showVictoryModal && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-40 bg-black/65 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center"
                        >
                            <div className="bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0A0F1D] border-3 border-yellow-400 rounded-3xl p-4 sm:p-6 shadow-[0_0_40px_rgba(250,204,21,0.5)] max-w-md w-full">
                                <div className="text-4xl sm:text-5xl mb-2 animate-bounce">
                                    🏯⚓🚢✨
                                </div>
                                <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] text-yellow-300 bg-amber-950/80 px-3 py-1 rounded-full border border-yellow-400/50 mb-1.5">
                                    ¡Las 3 Ramas Reveladas!
                                </span>
                                <h3 className="text-lg sm:text-xl font-serif font-black text-white">
                                    🏯 Shuri-Te + ⚓ Tomari-Te + 🚢 Naha-Te
                                </h3>
                                <p className="text-xs sm:text-sm text-emerald-300 font-medium mt-1">
                                    ¡Las 3 ciudades históricas de Okinawa! La nobleza de Shuri, los pescadores de Tomari y el comercio de Naha forjaron el Karate-Do.
                                </p>

                                {/* BOTÓN PRINCIPAL: COMPROBAR TÉCNICA */}
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
                                        <span>Reiniciar mapa</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ========================================================= */}
            {/* LAS 3 ESTAMPAS DE RAMAS MATRICES PARA TOCAR Y EXPLORAR */}
            {/* ========================================================= */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                {BRANCHES.map((branch) => {
                    const isFound = discovered[branch.id];
                    const isSelected = selectedBranchId === branch.id;

                    return (
                        <motion.div
                            key={branch.id}
                            whileHover={!isFound ? { scale: 1.03, y: -2 } : {}}
                            whileTap={!isFound ? { scale: 0.97 } : {}}
                            onClick={() => handleSelectBranch(branch.id)}
                            className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all select-none cursor-pointer relative overflow-hidden ${
                                isFound
                                    ? "bg-[#142A1D]/90 border-[#58CC02] opacity-70 cursor-default shadow-[0_0_15px_rgba(88,204,2,0.2)]"
                                    : isSelected
                                    ? "bg-gradient-to-b from-[#2B230E] to-[#1E190A] border-yellow-400 ring-4 ring-yellow-400/40 shadow-xl"
                                    : "bg-gradient-to-b from-[#1E293B] to-[#0F172A] hover:bg-[#283548] border-[#334155] hover:border-amber-400 shadow-md"
                            }`}
                        >
                            <span className="text-2xl sm:text-3xl block">{branch.icon}</span>
                            <p className="text-xs sm:text-sm font-black text-white mt-1 leading-tight">
                                {branch.title}
                            </p>
                            <span className="text-[10px] text-amber-300 font-bold block mt-0.5">
                                {branch.role}
                            </span>

                            {/* Badge de estado */}
                            <div className="mt-1.5">
                                {isFound ? (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-[#58CC02] bg-[#143818] px-2 py-0.5 rounded-full border border-[#58CC02]/40">
                                        <CheckCircle className="w-3 h-3" weight="fill" />
                                        <span>Revelada</span>
                                    </span>
                                ) : isSelected ? (
                                    <span className="inline-block text-[9px] font-black uppercase text-yellow-300 bg-yellow-950 px-2 py-0.5 rounded-full border border-yellow-400/40 animate-pulse">
                                        ¡Toca el Mapa!
                                    </span>
                                ) : (
                                    <span className="inline-block text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                                        Tocar para ubicar
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
