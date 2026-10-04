"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { didacticSound } from "@/lib/didacticSound";
import { Question } from "@/types/didactica";
import {
    SpeakerHigh,
    SpeakerSlash,
    ArrowCounterClockwise,
    CheckCircle,
    ArrowRight,
    Sparkle,
    Trophy,
    HandPointing,
    ShieldCheck,
} from "@phosphor-icons/react";

interface KumaAnatomyQuestionProps {
    question: Question;
    onCompleted: () => void;
    onCheckAndNext?: () => void;
    isSuperAdmin?: boolean;
}

export type AnatomyZone = "inferior" | "tronco" | "cabeza";

export interface AnatomyPart {
    id: string;
    kanji: string;
    romaji: string;
    spanish: string;
    zone: AnatomyZone;
    phase: 1 | 2 | 3;
    slotX: number; // Porcentaje X en la imagen del oso (0-100)
    slotY: number; // Porcentaje Y en la imagen del oso (0-100)
    icon: string;
    biomechanics: string; // Explicación neutra y educativa
    speechText: string;
}

export const ANATOMY_PARTS: AnatomyPart[] = [
    // --- FASE 1: TREN INFERIOR (De Pies a Cadera) ---
    {
        id: "ashi",
        kanji: "足",
        romaji: "Ashi",
        spanish: "Pies y Talón (Kakato)",
        zone: "inferior",
        phase: 1,
        slotX: 50,
        slotY: 88,
        icon: "🦶",
        biomechanics: "Base de enraizamiento en el tatami y distribución del peso en todas las posturas marciales.",
        speechText: "Ashi. Pies y talón: Base de apoyo y enraizamiento en el tatami.",
    },
    {
        id: "hiza",
        kanji: "膝",
        romaji: "Hiza",
        spanish: "Rodillas y Espinilla (Sune)",
        zone: "inferior",
        phase: 1,
        slotX: 50,
        slotY: 74,
        icon: "🦵",
        biomechanics: "Articulación resorte para flexionar en posiciones bajas y ejecutar impactos de rodilla (Hiza-geri).",
        speechText: "Hiza. Rodillas y espinilla: Articulación resorte para posturas y golpe de rodilla.",
    },
    {
        id: "koshi",
        kanji: "腰",
        romaji: "Koshi",
        spanish: "Cadera y Cintura",
        zone: "inferior",
        phase: 1,
        slotX: 50,
        slotY: 58,
        icon: "🥋",
        biomechanics: "El eje central de rotación que genera la aceleración y potencia en golpes y defensas.",
        speechText: "Koshi. Cadera: Centro de rotación que genera la fuerza de cada técnica.",
    },

    // --- FASE 2: TRONCO Y EXTREMIDADES (Abdomen, Pecho, Brazos, Manos) ---
    {
        id: "hara",
        kanji: "腹",
        romaji: "Hara / Tanden",
        spanish: "Abdomen y Vientre",
        zone: "tronco",
        phase: 2,
        slotX: 50,
        slotY: 50,
        icon: "🎯",
        biomechanics: "Centro de gravedad del cuerpo y control de la respiración diafragmática para la firmeza corporal.",
        speechText: "Hara o Tanden. Abdomen: Centro de gravedad y respiración diafragmática.",
    },
    {
        id: "mune",
        kanji: "胸",
        romaji: "Mune",
        spanish: "Pecho y Torso",
        zone: "tronco",
        phase: 2,
        slotX: 47,
        slotY: 39,
        icon: "🛡️",
        biomechanics: "Mantiene la columna vertebral erguida (Shisei) con hombros relajados para proteger el esternón.",
        speechText: "Mune. Pecho: Alineación de la columna vertebral y postura correcta.",
    },
    {
        id: "ude",
        kanji: "腕",
        romaji: "Ude / Empi",
        spanish: "Brazos y Codos",
        zone: "tronco",
        phase: 2,
        slotX: 74,
        slotY: 50,
        icon: "💪",
        biomechanics: "Estructura de palanca para los bloqueos (Uke) y técnica corta y contundente de codo (Empi).",
        speechText: "Ude y Empi. Brazos y codos: Estructura para bloqueos e impactos de corta distancia.",
    },
    {
        id: "te",
        kanji: "手",
        romaji: "Te / Yubi",
        spanish: "Manos y Dedos",
        zone: "tronco",
        phase: 2,
        slotX: 26,
        slotY: 61,
        icon: "👊",
        biomechanics: "Formación del puño cerrado frontal (Seiken), mano espada (Shuto) y agarres defensivos.",
        speechText: "Te y Yubi. Manos y dedos: Formación del puño Seiken y mano espada Shuto.",
    },

    // --- FASE 3: CABEZA Y SENTIDOS (Cabeza, Ojos, Nariz, Orejas, Boca) ---
    {
        id: "atama",
        kanji: "頭",
        romaji: "Atama / Kubi",
        spanish: "Cabeza y Cuello",
        zone: "cabeza",
        phase: 3,
        slotX: 50,
        slotY: 15,
        icon: "🐻",
        biomechanics: "Zona de guardia alta (Jodan). La alineación del cuello mantiene el balance corporal general.",
        speechText: "Atama y Kubi. Cabeza y cuello: Protección de guardia alta y equilibrio del cuerpo.",
    },
    {
        id: "me",
        kanji: "目",
        romaji: "Me",
        spanish: "Ojos y Mirada (Metsuke)",
        zone: "cabeza",
        phase: 3,
        slotX: 50,
        slotY: 22,
        icon: "👀",
        biomechanics: "Visión periférica fija en el adversario para anticipar trayectorias sin desviar la concentración.",
        speechText: "Me. Ojos y mirada Metsuke: Concentración visual para anticipar movimientos.",
    },
    {
        id: "sentidos",
        kanji: "鼻・耳・口",
        romaji: "Hana, Mimi, Kuchi",
        spanish: "Nariz, Orejas y Boca",
        zone: "cabeza",
        phase: 3,
        slotX: 59,
        slotY: 12,
        icon: "👂",
        biomechanics: "Inhalación nasal profunda, escucha atenta de las órdenes del Sensei y exhalación enérgica con Kiai.",
        speechText: "Hana, Mimi y Kuchi. Nariz, orejas y boca: Respiración diafragmática, escucha y grito Kiai.",
    },
];

export function KumaAnatomyQuestion({
    question,
    onCompleted,
    onCheckAndNext,
    isSuperAdmin = false,
}: KumaAnatomyQuestionProps) {
    // Fase actual: 1 (Inferior), 2 (Tronco y Extremidades), 3 (Cabeza y Sentidos)
    const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);

    // Partes correctamente ubicadas (set de IDs)
    const [placedPartIds, setPlacedPartIds] = useState<string[]>([]);

    // Parte seleccionada en la bandeja para colocar
    const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

    // Audio desactivado por defecto (requerimiento expreso)
    const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);

    // Última parte colocada para mostrar feedback explicativo
    const [lastPlacedPart, setLastPlacedPart] = useState<AnatomyPart | null>(null);

    // Estado completado total
    const [isFinished, setIsFinished] = useState<boolean>(false);

    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Síntesis de voz controlada
    const speakPart = useCallback(
        (part: AnatomyPart) => {
            if (!isVoiceActive || typeof window === "undefined" || !("speechSynthesis" in window)) {
                return;
            }
            try {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(part.speechText);
                utter.rate = 0.95;
                utter.pitch = 1.0;
                utter.lang = "es-ES";
                speechRef.current = utter;
                window.speechSynthesis.speak(utter);
            } catch {
                // Silencio controlado
            }
        },
        [isVoiceActive]
    );

    // Sonido sutil de colocación exitosa
    const playSnapSound = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        } catch {
            // Ignorar
        }
    }, []);

    // Partes que pertenecen a la fase actual
    const currentPhaseParts = ANATOMY_PARTS.filter((p) => p.phase === currentPhase);
    const unplacedInPhase = currentPhaseParts.filter((p) => !placedPartIds.includes(p.id));

    // Efecto al cambiar de fase o colocar
    useEffect(() => {
        // Verificar si la fase actual se completó
        const phaseCompleted = currentPhaseParts.every((p) => placedPartIds.includes(p.id));
        if (phaseCompleted) {
            if (currentPhase < 3) {
                // Pequeña pausa antes de subir de nivel
                const timer = setTimeout(() => {
                    setCurrentPhase((prev) => (prev + 1) as 1 | 2 | 3);
                    setSelectedPartId(null);
                    didacticSound.playStreak();
                }, 800);
                return () => clearTimeout(timer);
            } else if (!isFinished) {
                setIsFinished(true);
                didacticSound.playComplete();
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 },
                });
                onCompleted();
            }
        }
    }, [placedPartIds, currentPhase, currentPhaseParts, isFinished, onCompleted]);

    // Colocar una parte
    const handlePlacePart = (targetPart: AnatomyPart) => {
        // Si el usuario tiene una parte seleccionada y coincide con el slot
        if (selectedPartId === targetPart.id) {
            placeSuccess(targetPart);
            return;
        }

        // Si solo queda una parte pendiente en esta fase, colocarla directamente
        if (unplacedInPhase.length === 1 && unplacedInPhase[0].id === targetPart.id) {
            placeSuccess(targetPart);
            return;
        }

        // Si no tenía nada seleccionado, auto-seleccionar esta si está disponible
        if (!placedPartIds.includes(targetPart.id)) {
            setSelectedPartId(targetPart.id);
        }
    };

    const placeSuccess = (part: AnatomyPart) => {
        playSnapSound();
        didacticSound.playCorrect();
        setPlacedPartIds((prev) => [...prev, part.id]);
        setSelectedPartId(null);
        setLastPlacedPart(part);
        speakPart(part);
    };

    // Reiniciar
    const handleReset = () => {
        setPlacedPartIds([]);
        setSelectedPartId(null);
        setCurrentPhase(1);
        setIsFinished(false);
        setLastPlacedPart(null);
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
    };

    // Alternar audio
    const toggleVoice = () => {
        setIsVoiceActive((prev) => {
            const next = !prev;
            if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            } else if (next && unplacedInPhase.length > 0) {
                // Saludo corto al activar
                try {
                    const utter = new SpeechSynthesisUtterance("Voz activada. El cuerpo humano de pies a cabeza.");
                    utter.rate = 1.0;
                    utter.lang = "es-ES";
                    window.speechSynthesis.speak(utter);
                } catch {
                    // Ignorar
                }
            }
            return next;
        });
    };

    const phaseLabels = {
        1: { title: "1. Base e Inferior (Pies a Cadera)", desc: "Enraíza los pies y activa las rodillas y la cadera." },
        2: { title: "2. Centro y Extremidades (Tronco a Manos)", desc: "Estabiliza el abdomen, el pecho y las armas de los brazos." },
        3: { title: "3. Cabeza y Sentidos (La Guardia Alta)", desc: "Alinea la cabeza, la mirada Metsuke y la respiración." },
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none text-white px-2 py-4">
            {/* BARRA SUPERIOR: CONTROL DE VOZ + PROGRESO FASES */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl shadow-lg backdrop-blur-md">
                {/* Indicador de Fase */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Progreso:</span>
                    <div className="flex gap-1.5">
                        {[1, 2, 3].map((phaseNum) => (
                            <div
                                key={phaseNum}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                    currentPhase === phaseNum
                                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/30 scale-105"
                                        : currentPhase > phaseNum || placedPartIds.length === ANATOMY_PARTS.length
                                        ? "bg-emerald-600 text-white"
                                        : "bg-zinc-800 text-zinc-500"
                                }`}
                            >
                                Fase {phaseNum}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Switch de Voz (Desactivada por defecto) */}
                <button
                    onClick={toggleVoice}
                    type="button"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isVoiceActive
                            ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-750"
                    }`}
                    title={isVoiceActive ? "Voz activada. Clic para silenciar" : "Voz desactivada por defecto. Clic para activar"}
                >
                    {isVoiceActive ? (
                        <>
                            <SpeakerHigh size={18} className="text-amber-400" weight="bold" />
                            <span>Voz del Sensei: ON</span>
                        </>
                    ) : (
                        <>
                            <SpeakerSlash size={18} className="text-zinc-400" />
                            <span>Voz del Sensei: OFF (Clic para activar)</span>
                        </>
                    )}
                </button>

                {/* Reiniciar */}
                <button
                    onClick={handleReset}
                    type="button"
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                    title="Reiniciar ejercicio"
                >
                    <ArrowCounterClockwise size={16} />
                    <span>Reiniciar</span>
                </button>
            </div>

            {/* BANNER DE INSTRUCCIONES */}
            <div className="w-full text-center mb-4">
                <span className="inline-block px-3 py-0.5 mb-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full">
                    {phaseLabels[currentPhase].title}
                </span>
                <p className="text-sm text-zinc-300 max-w-xl mx-auto">
                    {phaseLabels[currentPhase].desc} Selecciona una etiqueta abajo y colócala en el punto correspondiente del cuerpo.
                </p>
            </div>

            {/* CONTENEDOR PRINCIPAL: OSO PIXAR INTERACTIVO + BANDEJA DE PIEZAS */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* COLUMNA OSO INTERACTIVO (Lg: 7 cols) */}
                <div className="lg:col-span-7 flex flex-col items-center">
                    <div className="relative w-full max-w-[480px] aspect-square rounded-3xl overflow-hidden border-2 border-zinc-700 shadow-2xl bg-zinc-950">
                        {/* IMAGEN DE KUMA SENSEI EN TATAMI CON LOGO OFICIAL DOJO KUMA */}
                        <Image
                            src="/images/didactic/kuma_cuerpo_humano_oficial_v2.jpg"
                            alt="El Cuerpo Humano de Pies a Cabeza - Dojo Kuma"
                            fill
                            priority
                            className="object-cover select-none pointer-events-none"
                            sizes="(max-width: 768px) 100vw, 480px"
                        />

                        {/* OVERLAY SUTIL OSCURO PARA RESALTAR PINES */}
                        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

                        {/* SLOTS Y PINES INTERACTIVOS */}
                        {ANATOMY_PARTS.map((part) => {
                            const isPlaced = placedPartIds.includes(part.id);
                            const isCurrentPhase = part.phase === currentPhase;
                            const isSelected = selectedPartId === part.id;

                            // Si no pertenece a la fase actual y no está colocada, no mostramos el hotspot para no saturar
                            if (!isPlaced && !isCurrentPhase) return null;

                            return (
                                <motion.div
                                    key={part.id}
                                    style={{
                                        position: "absolute",
                                        left: `${part.slotX}%`,
                                        top: `${part.slotY}%`,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                    className="z-20 cursor-pointer"
                                    onClick={() => handlePlacePart(part)}
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isPlaced ? (
                                        // PESTAÑA COLOCADA EXITOSA
                                        <motion.div
                                            initial={{ scale: 0, rotate: -15 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-full border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.7)] text-xs font-bold whitespace-nowrap backdrop-blur-sm"
                                        >
                                            <span className="text-sm">{part.icon}</span>
                                            <span>{part.kanji}</span>
                                            <CheckCircle size={14} weight="bold" className="text-emerald-200" />
                                        </motion.div>
                                    ) : (
                                        // PIN VACÍO ESPERANDO COLOCACIÓN
                                        <div className="relative group">
                                            {/* Aura pulsante si está seleccionada */}
                                            {isSelected && (
                                                <div className="absolute -inset-3 bg-amber-400/40 rounded-full animate-ping" />
                                            )}
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-lg border-2 ${
                                                    isSelected
                                                        ? "bg-amber-400 text-black border-white shadow-[0_0_20px_rgba(251,191,36,0.9)] scale-110"
                                                        : "bg-zinc-900/90 text-amber-300 border-amber-400/70 hover:border-amber-300 hover:scale-110 shadow-black/80"
                                                }`}
                                            >
                                                {part.icon}
                                            </div>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-black/90 text-[10px] text-zinc-300 rounded font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                {part.spanish}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* COLUMNA LATERAL: BANDEJA DE PIEZAS + FICHA DE APRENDIZAJE (Lg: 5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    {/* BANDEJA DE TARJETAS PARA ESTA FASE */}
                    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                                <HandPointing size={18} />
                                <span>Partes a Colocar</span>
                            </h3>
                            <span className="text-xs text-zinc-400">
                                {placedPartIds.filter((id) => currentPhaseParts.some((p) => p.id === id)).length} de{" "}
                                {currentPhaseParts.length}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                            {currentPhaseParts.map((part) => {
                                const isPlaced = placedPartIds.includes(part.id);
                                const isSelected = selectedPartId === part.id;

                                return (
                                    <button
                                        key={part.id}
                                        type="button"
                                        disabled={isPlaced}
                                        onClick={() => {
                                            if (!isPlaced) {
                                                setSelectedPartId(part.id);
                                                speakPart(part);
                                            }
                                        }}
                                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                                            isPlaced
                                                ? "bg-emerald-950/40 border-emerald-800/60 opacity-60 cursor-default"
                                                : isSelected
                                                ? "bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]"
                                                : "bg-zinc-800/80 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 active:scale-[0.98]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{part.icon}</span>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-white">
                                                        {part.kanji} ({part.romaji})
                                                    </span>
                                                    {isPlaced && (
                                                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">
                                                            Correcto
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-zinc-400">{part.spanish}</div>
                                            </div>
                                        </div>

                                        <div>
                                            {isPlaced ? (
                                                <CheckCircle size={20} weight="fill" className="text-emerald-400" />
                                            ) : isSelected ? (
                                                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider animate-pulse">
                                                    ¡Toca el Oso!
                                                </span>
                                            ) : (
                                                <span className="text-xs text-zinc-400">Seleccionar</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* TARJETA DE APRENDIZAJE BIOMECÁNICO (ÚLTIMA PARTE COLOCADA O SELECCIONADA) */}
                    {(lastPlacedPart || (selectedPartId && ANATOMY_PARTS.find((p) => p.id === selectedPartId))) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20 border border-amber-500/30 rounded-2xl p-4 shadow-xl"
                        >
                            {(() => {
                                const current =
                                    lastPlacedPart ||
                                    ANATOMY_PARTS.find((p) => p.id === selectedPartId)!;
                                return (
                                    <>
                                        <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                                            <ShieldCheck size={18} />
                                            <span>Función Biomecánica en Karate</span>
                                        </div>
                                        <div className="text-base font-bold text-white mb-1 flex items-center gap-2">
                                            <span>{current.icon}</span>
                                            <span>{current.kanji} - {current.spanish}</span>
                                        </div>
                                        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                                            {current.biomechanics}
                                        </p>
                                    </>
                                );
                            })()}
                        </motion.div>
                    )}

                    {/* CELEBRACIÓN FINAL DE COMPLETADO */}
                    {isFinished && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border-2 border-emerald-400 rounded-2xl p-4 text-center shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                        >
                            <Trophy size={36} weight="fill" className="text-amber-400 mx-auto mb-2" />
                            <h4 className="text-base font-extrabold text-white mb-1">
                                ¡El Cuerpo Humano Completado!
                            </h4>
                            <p className="text-xs text-emerald-200 mb-3">
                                Has dominado los puntos anatómicos fundamentales desde los pies hasta la cabeza.
                            </p>
                            {onCheckAndNext && (
                                <button
                                    onClick={onCheckAndNext}
                                    type="button"
                                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                                >
                                    <span>Continuar</span>
                                    <ArrowRight size={18} weight="bold" />
                                </button>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
