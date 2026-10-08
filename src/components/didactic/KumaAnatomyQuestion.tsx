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
    Magnet,
    Compass,
    Crosshair,
    Lightning,
    FastForward,
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
    heightLevel: "GEDAN" | "CHUDAN" | "JODAN";
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
        slotY: 89,
        icon: "🦶",
        heightLevel: "GEDAN",
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
        heightLevel: "GEDAN",
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
        slotY: 60,
        icon: "🥋",
        heightLevel: "GEDAN",
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
        slotY: 49,
        icon: "🎯",
        heightLevel: "CHUDAN",
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
        slotY: 38,
        icon: "🛡️",
        heightLevel: "CHUDAN",
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
        heightLevel: "CHUDAN",
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
        heightLevel: "CHUDAN",
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
        slotY: 8.5,
        icon: "🐻",
        heightLevel: "JODAN",
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
        slotX: 25,
        slotY: 17,
        icon: "👀",
        heightLevel: "JODAN",
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
        slotX: 75,
        slotY: 17,
        icon: "👂",
        heightLevel: "JODAN",
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
    // Fase actual: 1 (Gedan: Tren Inferior), 2 (Chudan: Centro/Tronco), 3 (Jodan: Cabeza/Sentidos)
    const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);

    // Partes correctamente ubicadas (set de IDs)
    const [placedPartIds, setPlacedPartIds] = useState<string[]>([]);

    // Parte seleccionada en la bandeja (Tap & Snap)
    const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

    // Audio desactivado por defecto (requerimiento expreso)
    const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);

    // Última parte colocada para mostrar feedback en el Escáner Biomecánico
    const [lastPlacedPart, setLastPlacedPart] = useState<AnatomyPart | null>(null);

    // Estado completado total
    const [isFinished, setIsFinished] = useState<boolean>(false);

    // Referencia al contenedor de la imagen de Kuma Sensei
    const bearContainerRef = useRef<HTMLDivElement>(null);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Vibración háptica en dispositivos móviles
    const triggerHaptic = useCallback((pattern: number | number[] = 25) => {
        if (typeof window !== "undefined" && typeof navigator !== "undefined" && "vibrate" in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch {
                // Silencio en navegadores sin soporte
            }
        }
    }, []);

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

    // Sonido sutil de "Snap Magnético" con doble armónico y resonancia marcial
    const playSnapSound = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;

            // Transitorio percutivo (chasquido de imán / madera de tatami)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(540, now);
            osc.frequency.exponentialRampToValueAtTime(1080, now + 0.11);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.11);

            // Resonancia armónica de confirmación
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "triangle";
            osc2.frequency.setValueAtTime(820, now + 0.03);
            gain2.gain.setValueAtTime(0.18, now + 0.03);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.03);
            osc2.stop(now + 0.22);
        } catch {
            // Silencio controlado
        }
    }, []);

    // Partes que pertenecen a la fase actual
    const currentPhaseParts = ANATOMY_PARTS.filter((p) => p.phase === currentPhase);
    const unplacedInPhase = currentPhaseParts.filter((p) => !placedPartIds.includes(p.id));

    // Efecto al completar fase o completar todo el ejercicio
    useEffect(() => {
        const phaseCompleted = currentPhaseParts.every((p) => placedPartIds.includes(p.id));
        if (phaseCompleted) {
            if (currentPhase < 3) {
                const timer = setTimeout(() => {
                    setCurrentPhase((prev) => (prev + 1) as 1 | 2 | 3);
                    setSelectedPartId(null);
                    didacticSound.playStreak();
                }, 850);
                return () => clearTimeout(timer);
            } else if (!isFinished) {
                setIsFinished(true);
                didacticSound.playComplete();
                triggerHaptic([40, 60, 40, 80]);
                confetti({
                    particleCount: 85,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ["#f59e0b", "#10b981", "#ef4444", "#ffffff"],
                });
                onCompleted();
            }
        }
    }, [placedPartIds, currentPhase, currentPhaseParts, isFinished, onCompleted, triggerHaptic]);

    // Colocación exitosa con efectos, vibración háptica y voz
    const placeSuccess = useCallback(
        (part: AnatomyPart) => {
            if (placedPartIds.includes(part.id)) return;
            playSnapSound();
            didacticSound.playCorrect();
            triggerHaptic([20, 35, 20]);
            setPlacedPartIds((prev) => [...prev, part.id]);
            setSelectedPartId(null);
            setLastPlacedPart(part);
            speakPart(part);

            // Destello de chispas en la posición de Kuma
            try {
                confetti({
                    particleCount: 22,
                    spread: 45,
                    origin: { x: 0.5, y: 0.5 },
                    colors: ["#f59e0b", "#fbbf24", "#10b981", "#ffffff"],
                });
            } catch {
                // Silencio controlado
            }
        },
        [placedPartIds, playSnapSound, triggerHaptic, speakPart]
    );

    // Selección de parte desde la bandeja
    const handleSelectPart = (part: AnatomyPart) => {
        if (placedPartIds.includes(part.id)) {
            // Ya está colocada: reproducir voz e información biomecánica
            setLastPlacedPart(part);
            speakPart(part);
            return;
        }

        if (selectedPartId === part.id) {
            // Si ya está seleccionada y se vuelve a presionar: SNAP directo
            placeSuccess(part);
            return;
        }

        triggerHaptic(18);
        setSelectedPartId(part.id);
        speakPart(part);
    };

    // Tocar un punto / diana en el cuerpo de Kuma
    const handleSlotClick = (targetPart: AnatomyPart) => {
        if (placedPartIds.includes(targetPart.id)) {
            setLastPlacedPart(targetPart);
            speakPart(targetPart);
            return;
        }

        // Caso 1: El usuario ya tiene seleccionada la parte correspondiente -> SNAP instantáneo
        if (selectedPartId === targetPart.id) {
            placeSuccess(targetPart);
            return;
        }

        // Caso 2: Solo queda una parte sin colocar en la fase actual -> Auto-colocar
        if (unplacedInPhase.length === 1 && unplacedInPhase[0].id === targetPart.id) {
            placeSuccess(targetPart);
            return;
        }

        // Caso 3: Selecciona este punto y resalta la parte en la bandeja
        triggerHaptic(15);
        setSelectedPartId(targetPart.id);
        speakPart(targetPart);
    };

    // Arrastre magnético para escritorio (Drag & Drop con ratón)
    const handleDropPart = (part: AnatomyPart, dropPoint: { x: number; y: number }) => {
        if (!bearContainerRef.current) return;
        const rect = bearContainerRef.current.getBoundingClientRect();

        const targetScreenX = rect.left + (part.slotX / 100) * rect.width;
        const targetScreenY = rect.top + (part.slotY / 100) * rect.height;

        const distance = Math.hypot(dropPoint.x - targetScreenX, dropPoint.y - targetScreenY);
        const magnetRadius = Math.max(55, rect.width * 0.18);

        if (distance <= magnetRadius) {
            placeSuccess(part);
        } else {
            // Verificar si acertó en su slot objetivo
            const hitOther = currentPhaseParts.find((other) => {
                if (placedPartIds.includes(other.id)) return false;
                const otherX = rect.left + (other.slotX / 100) * rect.width;
                const otherY = rect.top + (other.slotY / 100) * rect.height;
                return Math.hypot(dropPoint.x - otherX, dropPoint.y - otherY) <= magnetRadius;
            });

            if (hitOther && hitOther.id === part.id) {
                placeSuccess(part);
            }
        }
    };

    // Reiniciar ejercicio
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

    // Alternar audio del Sensei
    const toggleVoice = () => {
        setIsVoiceActive((prev) => {
            const next = !prev;
            if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            } else if (next && unplacedInPhase.length > 0) {
                try {
                    const utter = new SpeechSynthesisUtterance("Voz activada. Toca los parches para ubicarlos en Kuma Sensei.");
                    utter.rate = 1.0;
                    utter.lang = "es-ES";
                    window.speechSynthesis.speak(utter);
                } catch {}
            }
            return next;
        });
    };

    // Atajo SuperAdmin para agilizar pruebas
    const handleSuperAdminComplete = () => {
        if (currentPhase < 3) {
            const phaseIds = currentPhaseParts.map((p) => p.id);
            setPlacedPartIds((prev) => Array.from(new Set([...prev, ...phaseIds])));
        } else {
            const allIds = ANATOMY_PARTS.map((p) => p.id);
            setPlacedPartIds(allIds);
        }
    };

    const phaseConfig = {
        1: {
            title: "Fase 1: Tren Inferior",
            badge: "GEDAN (Nivel Bajo)",
            badgeColor: "bg-sky-500/20 text-sky-300 border-sky-400/40",
            activeGlow: "border-sky-400 shadow-sky-500/20",
            summary: "Enraizamiento y balance: Ashi (Pies), Hiza (Rodillas) y Koshi (Cadera).",
        },
        2: {
            title: "Fase 2: Centro y Tronco",
            badge: "CHUDAN (Nivel Medio)",
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
            activeGlow: "border-amber-400 shadow-amber-500/20",
            summary: "Eje de poder y respiración: Hara/Tanden, Mune (Pecho), Ude (Brazos) y Te (Manos).",
        },
        3: {
            title: "Fase 3: Guardia Alta",
            badge: "JODAN (Nivel Alto)",
            badgeColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
            activeGlow: "border-rose-400 shadow-rose-500/20",
            summary: "Mirada y concentración: Atama (Cabeza), Me (Ojos) y Sentidos (Respiración/Kiai).",
        },
    };

    const activeSelectedPart = selectedPartId ? ANATOMY_PARTS.find((p) => p.id === selectedPartId) : null;
    const scannerDisplayPart = activeSelectedPart || lastPlacedPart || currentPhaseParts.find((p) => !placedPartIds.includes(p.id)) || currentPhaseParts[0];

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none text-white px-2 py-2 sm:py-4">
            {/* BARRA SUPERIOR HUD: PROGRESO DE ALTURAS (GEDAN -> CHUDAN -> JODAN) + CONTROLES */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2.5 mb-3 bg-zinc-950/85 border border-zinc-800 p-2.5 sm:p-3 rounded-2xl shadow-xl backdrop-blur-md">
                {/* Selector / Indicador de Fases Marciales */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-zinc-400 mr-0.5">
                        Altura:
                    </span>
                    <div className="flex gap-1 sm:gap-1.5">
                        {([1, 2, 3] as const).map((phaseNum) => {
                            const isCurrent = currentPhase === phaseNum;
                            const isPast = currentPhase > phaseNum || placedPartIds.length === ANATOMY_PARTS.length;
                            const label = phaseNum === 1 ? "1. Gedan" : phaseNum === 2 ? "2. Chudan" : "3. Jodan";

                            return (
                                <button
                                    key={phaseNum}
                                    type="button"
                                    onClick={() => {
                                        // Permitir navegar a fases ya alcanzadas
                                        if (isPast || isCurrent) {
                                            setCurrentPhase(phaseNum);
                                            setSelectedPartId(null);
                                        }
                                    }}
                                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 border ${
                                        isCurrent
                                            ? "bg-amber-500 text-zinc-950 border-amber-300 shadow-md shadow-amber-500/30 scale-105"
                                            : isPast
                                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/60"
                                            : "bg-zinc-900/60 text-zinc-500 border-zinc-800 opacity-60 cursor-not-allowed"
                                    }`}
                                >
                                    <span>{label}</span>
                                    {isPast && !isCurrent && <CheckCircle size={14} weight="fill" className="text-emerald-400" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Acciones del HUD (Voz, Reiniciar, SuperAdmin) */}
                <div className="flex items-center gap-2">
                    {/* Botón SuperAdmin (si aplica) */}
                    {isSuperAdmin && (
                        <button
                            onClick={handleSuperAdminComplete}
                            type="button"
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-950/60 border border-purple-500/40 text-purple-300 flex items-center gap-1 hover:bg-purple-900/50"
                            title="SuperAdmin: Auto-completar fase"
                        >
                            <FastForward size={14} weight="bold" />
                            <span className="hidden sm:inline">Admin Skip</span>
                        </button>
                    )}

                    {/* Switch de Voz (OFF por defecto) */}
                    <button
                        onClick={toggleVoice}
                        type="button"
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                            isVoiceActive
                                ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse backdrop-blur-sm"
                                : "bg-zinc-900/70 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                        }`}
                        title={isVoiceActive ? "Voz activa. Clic para silenciar" : "Voz desactivada por defecto. Clic para activar"}
                    >
                        {isVoiceActive ? (
                            <>
                                <SpeakerHigh size={16} className="text-amber-400" weight="bold" />
                                <span>Voz: ON</span>
                            </>
                        ) : (
                            <>
                                <SpeakerSlash size={16} className="text-zinc-400" />
                                <span>Voz: OFF</span>
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
                    </button>
                </div>
            </div>

            {/* BANNER DINÁMICO DE ALTURA MARCIAL */}
            <div className="w-full text-center mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 mb-1 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm backdrop-blur-md bg-zinc-950/70 border-zinc-800">
                    <span className={`px-2 py-0.5 rounded-md font-black text-[11px] border ${phaseConfig[currentPhase].badgeColor}`}>
                        {phaseConfig[currentPhase].badge}
                    </span>
                    <span className="text-amber-300 font-extrabold">{phaseConfig[currentPhase].title}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-400 max-w-xl mx-auto flex items-center justify-center gap-1">
                    <Magnet size={14} className="text-amber-400" weight="fill" />
                    <span>Toca un parche en la bandeja y presiona su punto en Kuma Sensei para hacer Snap.</span>
                </p>
            </div>

            {/* CONTENEDOR PRINCIPAL: OSO PIXAR (IZQUIERDA / ARRIBA) + BANDEJA THUMB-ZONE (DERECHA / ABAJO) */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 items-start">
                {/* COLUMNA OSO INTERACTIVO (Lg: 7 cols) */}
                <div className="lg:col-span-7 flex flex-col items-center w-full">
                    <div
                        ref={bearContainerRef}
                        className="relative w-full max-w-[290px] xs:max-w-[320px] sm:max-w-[370px] md:max-w-[410px] lg:max-w-[450px] aspect-square rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_12px_36px_rgba(0,0,0,0.9)] bg-zinc-950 transition-all"
                    >
                        {/* IMAGEN OFICIAL DE KUMA SENSEI CON DOJO Y LOGO OFICIAL */}
                        <Image
                            src="/images/didactic/kuma_cuerpo_humano_oficial_v2.jpg"
                            alt="El Cuerpo Humano de Pies a Cabeza - Dojo Kuma"
                            fill
                            priority
                            className="object-cover select-none pointer-events-none"
                            sizes="(max-width: 768px) 340px, 450px"
                        />

                        {/* OVERLAY SUTIL OSCURO PARA REALCE DE CONTRASTE */}
                        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

                        {/* DIANAS HOTSPOTS Y PARCHES BORDADOS EN EL CUERPO */}
                        {ANATOMY_PARTS.map((part) => {
                            const isPlaced = placedPartIds.includes(part.id);
                            const isCurrentPhase = part.phase === currentPhase;
                            const isSelected = selectedPartId === part.id;

                            // Mostrar si está colocada o pertenece a la fase actual
                            if (!isPlaced && !isCurrentPhase) return null;

                            return (
                                <div
                                    key={part.id}
                                    style={{
                                        position: "absolute",
                                        left: `${part.slotX}%`,
                                        top: `${part.slotY}%`,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                    className="z-20 cursor-pointer"
                                    onClick={() => handleSlotClick(part)}
                                >
                                    {isPlaced ? (
                                        // PARCHE SELLADO: CHIP COMPACTO Y ELEGANTE (SIN TAPAR EL CUERPO DEL OSO)
                                        <motion.div
                                            initial={{ scale: 0, rotate: -15 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 450, damping: 22 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-black/75 backdrop-blur-md text-white rounded-xl border border-amber-400 shadow-[0_4px_16px_rgba(0,0,0,0.7),0_0_12px_rgba(245,158,11,0.35)] whitespace-nowrap transition-all"
                                            title={`${part.romaji} - ${part.spanish} (Toca para escuchar)`}
                                        >
                                            <span className="text-xs sm:text-sm">{part.icon}</span>
                                            <span className="font-sans text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                                                {part.romaji}
                                            </span>
                                            <CheckCircle size={13} weight="fill" className="text-emerald-400 ml-0.5" />
                                        </motion.div>
                                    ) : (
                                        // DIANA DE ESCÁNER MAGNÉTICO (TAP & SNAP HOTSPOT)
                                        <div className="relative group flex items-center justify-center">
                                            {/* Aura pulsante de alta visibilidad si está seleccionada */}
                                            {isSelected && (
                                                <>
                                                    <div className="absolute -inset-2.5 bg-amber-400/40 rounded-full animate-ping pointer-events-none" />
                                                    <div className="absolute -inset-1 bg-amber-400/60 rounded-full pointer-events-none" />
                                                </>
                                            )}

                                            <motion.div
                                                animate={
                                                    isSelected
                                                        ? { scale: [1, 1.25, 1], rotate: [0, 90, 0] }
                                                        : { scale: [1, 1.08, 1] }
                                                }
                                                transition={{ repeat: Infinity, duration: isSelected ? 1.2 : 2.5 }}
                                                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center font-black transition-all shadow-xl border-2 ${
                                                    isSelected
                                                        ? "bg-amber-500 text-zinc-950 border-white shadow-[0_0_24px_rgba(245,158,11,0.95)]"
                                                        : "bg-black/55 backdrop-blur-md text-amber-300 border-amber-400/70 hover:border-amber-300 hover:bg-black/75 shadow-black"
                                                }`}
                                            >
                                                {isSelected ? (
                                                    <Crosshair size={22} weight="bold" className="text-zinc-950 animate-spin" />
                                                ) : (
                                                    <span className="text-lg sm:text-xl drop-shadow-md">{part.icon}</span>
                                                )}
                                            </motion.div>

                                            {/* Etiqueta flotante guía si está seleccionada */}
                                            {isSelected && (
                                                <div className="absolute -top-7 px-2 py-0.5 bg-amber-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider rounded-md shadow-lg pointer-events-none whitespace-nowrap animate-bounce">
                                                    ¡Toca aquí!
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* COLUMNA BANDEJA ERGONÓMICA DE PULGAR + ESCÁNER BIOMECÁNICO (Lg: 5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-3 w-full">
                    {/* BANDEJA DE PARCHES EN ROMAJI (ERGONOMÍA DE PULGAR / TAP & SNAP) */}
                    <div className="bg-zinc-950/85 border-2 border-amber-500/30 rounded-3xl p-3 sm:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl">
                        {/* Cabecera de la bandeja */}
                        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-800">
                            <div className="flex items-center gap-1.5">
                                <Magnet size={18} weight="fill" className="text-amber-400" />
                                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                                    Parches Romaji ({phaseConfig[currentPhase].badge.split(" ")[0]})
                                </h3>
                            </div>
                            <span className="text-[11px] font-extrabold px-2 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full">
                                {placedPartIds.filter((id) => currentPhaseParts.some((p) => p.id === id)).length} /{" "}
                                {currentPhaseParts.length}
                            </span>
                        </div>

                        {/* LISTA DE PARCHES: TARJETAS TÁCTILES CON ACCIÓN DE SNAP DIRECTO */}
                        <div className="grid grid-cols-1 gap-2">
                            {currentPhaseParts.map((part) => {
                                const isPlaced = placedPartIds.includes(part.id);
                                const isSelected = selectedPartId === part.id;

                                return (
                                    <motion.div
                                        key={part.id}
                                        drag={!isPlaced}
                                        dragSnapToOrigin={true}
                                        whileDrag={{
                                            scale: 1.08,
                                            zIndex: 60,
                                            boxShadow: "0 20px 35px -5px rgba(245, 158, 11, 0.5)",
                                        }}
                                        whileHover={!isPlaced ? { scale: 1.01 } : {}}
                                        whileTap={!isPlaced ? { scale: 0.98 } : {}}
                                        onDragStart={() => {
                                            setSelectedPartId(part.id);
                                            speakPart(part);
                                        }}
                                        onDragEnd={(event, info) => {
                                            handleDropPart(part, info.point);
                                        }}
                                        onClick={() => handleSelectPart(part)}
                                        className={`relative w-full p-2.5 sm:p-3 rounded-2xl border-2 transition-all select-none backdrop-blur-md ${
                                            isPlaced
                                                ? "bg-zinc-950/40 border-zinc-800/60 opacity-45 cursor-pointer"
                                                : isSelected
                                                ? "bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer"
                                                : "bg-zinc-900/70 border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900/90 cursor-pointer"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2.5">
                                            {/* Lado izquierdo: Icono prominente y Texto en Romaji de alto contraste */}
                                            <div className="flex items-center gap-2.5 sm:gap-3">
                                                <div
                                                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border transition-all ${
                                                        isSelected
                                                            ? "bg-amber-500 text-zinc-950 border-white shadow-md shadow-amber-500/40"
                                                            : "bg-black/60 border-amber-500/30 text-white"
                                                    }`}
                                                >
                                                    <span className="text-xl sm:text-2xl">{part.icon}</span>
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        {/* NOMBRE EN ROMAJI (MÁXIMA LEGIBILIDAD) */}
                                                        <span className="font-black text-sm sm:text-base text-white tracking-wide uppercase">
                                                            {part.romaji}
                                                        </span>
                                                        <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded border bg-black/50 text-amber-300 border-amber-500/30">
                                                            {part.heightLevel}
                                                        </span>
                                                    </div>
                                                    {/* NOMBRE EN ESPAÑOL */}
                                                    <div className="text-[11px] sm:text-xs text-zinc-400 font-medium leading-tight">
                                                        {part.spanish}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Lado derecho: Botón de Snap / Estado de Colocación */}
                                            <div className="flex items-center">
                                                {isPlaced ? (
                                                    <div className="flex items-center gap-1 text-emerald-300 text-[11px] font-bold bg-emerald-950/70 px-2 py-1 rounded-xl border border-emerald-500/30">
                                                        <CheckCircle size={14} weight="fill" />
                                                        <span>Colocado</span>
                                                    </div>
                                                ) : isSelected ? (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            placeSuccess(part);
                                                        }}
                                                        className="flex items-center gap-1 text-zinc-950 text-xs font-black bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl border border-white shadow-md shadow-amber-500/40 animate-pulse active:scale-95 transition-transform"
                                                    >
                                                        <Lightning size={14} weight="fill" />
                                                        <span>Snap</span>
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-800/60 px-2 py-1 rounded-xl border border-zinc-700/60">
                                                        <HandPointing size={13} />
                                                        <span>Tocar</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ESCÁNER BIOMECÁNICO (HUD EDUCATIVO COMPACTO) */}
                    <AnimatePresence mode="wait">
                        {scannerDisplayPart && (
                            <motion.div
                                key={scannerDisplayPart.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18 }}
                                className="bg-zinc-950/85 border-2 border-amber-500/30 rounded-3xl p-3 sm:p-3.5 shadow-xl backdrop-blur-xl"
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-black uppercase tracking-wider">
                                        <ShieldCheck size={16} weight="fill" />
                                        <span>Escáner Biomecánico Karate</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                        {scannerDisplayPart.heightLevel}
                                    </span>
                                </div>

                                <div className="text-xs sm:text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                                    <span>{scannerDisplayPart.icon}</span>
                                    <span className="text-amber-300 font-black uppercase">{scannerDisplayPart.romaji}</span>
                                    <span className="text-zinc-400 text-xs font-medium">— {scannerDisplayPart.spanish}</span>
                                </div>

                                <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-sans">
                                    {scannerDisplayPart.biomechanics}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CELEBRACIÓN DE CONCLUSIÓN FINAL */}
                    {isFinished && (
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gradient-to-r from-emerald-950/90 via-teal-900/90 to-emerald-950/90 border-2 border-emerald-400 rounded-3xl p-4 text-center shadow-[0_0_35px_rgba(16,185,129,0.35)] backdrop-blur-xl"
                        >
                            <Trophy size={36} weight="fill" className="text-amber-400 mx-auto mb-1.5" />
                            <h4 className="text-sm sm:text-base font-black text-white mb-0.5">
                                ¡El Cuerpo Humano de Pies a Cabeza Dominado!
                            </h4>
                            <p className="text-[11px] sm:text-xs text-emerald-200 mb-2.5">
                                Has dominado los puntos anatómicos fundamentales de Karate con Kuma Sensei.
                            </p>
                            {onCheckAndNext && (
                                <button
                                    onClick={onCheckAndNext}
                                    type="button"
                                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                                >
                                    <span>Continuar</span>
                                    <ArrowRight size={16} weight="bold" />
                                </button>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
