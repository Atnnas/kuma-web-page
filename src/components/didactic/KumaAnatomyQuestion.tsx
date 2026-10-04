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
        slotY: 88,
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
        slotY: 58,
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
        slotY: 50,
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
        slotY: 39,
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
        slotY: 7.5,
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
        slotY: 16,
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
        slotY: 16,
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

    // Referencia al contenedor de la imagen de Kuma Sensei para calcular soltado magnético
    const bearContainerRef = useRef<HTMLDivElement>(null);
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

    // Sonido sutil de "Snap Magnético" con doble armónico
    const playSnapSound = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            const AudioCtx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;

            // Transitorio percutivo (chasquido de imán / madera)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);

            // Resonancia suave
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "triangle";
            osc2.frequency.setValueAtTime(780, now + 0.04);
            gain2.gain.setValueAtTime(0.15, now + 0.04);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.04);
            osc2.stop(now + 0.2);
        } catch {
            // Silencio controlado
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
                }, 900);
                return () => clearTimeout(timer);
            } else if (!isFinished) {
                setIsFinished(true);
                didacticSound.playComplete();
                confetti({
                    particleCount: 90,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ["#f59e0b", "#10b981", "#ef4444", "#ffffff"],
                });
                onCompleted();
            }
        }
    }, [placedPartIds, currentPhase, currentPhaseParts, isFinished, onCompleted]);

    // Colocación exitosa con efectos y voz
    const placeSuccess = (part: AnatomyPart) => {
        if (placedPartIds.includes(part.id)) return;
        playSnapSound();
        didacticSound.playCorrect();
        setPlacedPartIds((prev) => [...prev, part.id]);
        setSelectedPartId(null);
        setLastPlacedPart(part);
        speakPart(part);

        // Pequeño estallido de chispas en el punto
        try {
            confetti({
                particleCount: 20,
                spread: 45,
                origin: { y: 0.5 },
                colors: ["#f59e0b", "#fbbf24", "#ffffff"],
            });
        } catch {}
    };

    // Colocar por Tap directo en el slot del oso
    const handlePlacePart = (targetPart: AnatomyPart) => {
        // Si el usuario ya tiene seleccionada la parte que coincide
        if (selectedPartId === targetPart.id) {
            placeSuccess(targetPart);
            return;
        }

        // Si solo queda una parte pendiente en esta fase y toca el slot correcto
        if (unplacedInPhase.length === 1 && unplacedInPhase[0].id === targetPart.id) {
            placeSuccess(targetPart);
            return;
        }

        // Si no tenía nada seleccionado y toca el slot, pre-selecciona el parche
        if (!placedPartIds.includes(targetPart.id)) {
            setSelectedPartId(targetPart.id);
            speakPart(targetPart);
        }
    };

    // Lógica magnética de soltado (Drag & Drop)
    const handleDropPart = (part: AnatomyPart, dropPoint: { x: number; y: number }) => {
        if (!bearContainerRef.current) return;
        const rect = bearContainerRef.current.getBoundingClientRect();

        // Calcular posición en pantalla del slot correspondiente a esta parte
        const targetScreenX = rect.left + (part.slotX / 100) * rect.width;
        const targetScreenY = rect.top + (part.slotY / 100) * rect.height;

        const distance = Math.hypot(dropPoint.x - targetScreenX, dropPoint.y - targetScreenY);

        // Radio de atracción magnética generoso (~80px desktop, ~55px mobile)
        const magnetRadius = Math.max(55, rect.width * 0.17);

        if (distance <= magnetRadius) {
            placeSuccess(part);
        } else {
            // Verificar si se soltó sobre cualquier otro slot válido de la misma fase
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

    // Alternar audio
    const toggleVoice = () => {
        setIsVoiceActive((prev) => {
            const next = !prev;
            if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            } else if (next && unplacedInPhase.length > 0) {
                try {
                    const utter = new SpeechSynthesisUtterance("Voz activada. Arrastra los parches bordados al cuerpo de Kuma Sensei.");
                    utter.rate = 1.0;
                    utter.lang = "es-ES";
                    window.speechSynthesis.speak(utter);
                } catch {}
            }
            return next;
        });
    };

    const phaseLabels = {
        1: {
            title: "Fase 1: Tren Inferior (Pies a Cadera)",
            desc: "Enraíza la postura marcial desde los pies (Ashi), subiendo por las rodillas (Hiza) hasta la cadera (Koshi).",
            badge: "GEDAN (Nivel Bajo)",
            color: "border-sky-500/50 text-sky-300 bg-sky-950/60 backdrop-blur-sm",
        },
        2: {
            title: "Fase 2: Centro y Tronco (Vientre a Manos)",
            desc: "Fija el abdomen (Hara/Tanden), mantén el pecho erguido (Mune) y activa los brazos (Ude/Empi) y puños (Te).",
            badge: "CHUDAN (Nivel Medio)",
            color: "border-amber-500/50 text-amber-300 bg-amber-950/60 backdrop-blur-sm",
        },
        3: {
            title: "Fase 3: Guardia Alta (Cabeza y Sentidos)",
            desc: "Alinea la cabeza y cuello (Atama/Kubi), enfoca la mirada (Me) y respira con concentración.",
            badge: "JODAN (Nivel Alto)",
            color: "border-rose-500/50 text-rose-300 bg-rose-950/60 backdrop-blur-sm",
        },
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none text-white px-2 py-4">
            {/* BARRA SUPERIOR: CONTROL DE VOZ + PROGRESO DE FASES */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 bg-zinc-950/75 border border-zinc-800 p-3 rounded-2xl shadow-xl backdrop-blur-md">
                {/* Indicador de Fases Marciales */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Progreso:</span>
                    <div className="flex gap-1.5">
                        {[1, 2, 3].map((phaseNum) => (
                            <div
                                key={phaseNum}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                                    currentPhase === phaseNum
                                        ? "bg-amber-500 text-zinc-950 border-amber-300 shadow-md shadow-amber-500/30 scale-105"
                                        : currentPhase > phaseNum || placedPartIds.length === ANATOMY_PARTS.length
                                        ? "bg-emerald-600/90 text-white border-emerald-400 backdrop-blur-sm"
                                        : "bg-zinc-900/60 text-zinc-400 border-zinc-800"
                                }`}
                            >
                                <span>Fase {phaseNum}</span>
                                {currentPhase > phaseNum && <CheckCircle size={15} weight="bold" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Switch de Voz (Desactivada por defecto) */}
                <button
                    onClick={toggleVoice}
                    type="button"
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isVoiceActive
                            ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse backdrop-blur-sm"
                            : "bg-zinc-900/70 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
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
                            <span>Voz del Sensei: OFF</span>
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
                <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-2 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm backdrop-blur-md bg-zinc-950/60">
                    <span className={`px-2.5 py-0.5 rounded-md font-black text-xs ${phaseLabels[currentPhase].color}`}>
                        {phaseLabels[currentPhase].badge}
                    </span>
                    <span className="text-amber-300 font-extrabold">{phaseLabels[currentPhase].title}</span>
                </div>
                <p className="text-xs md:text-sm text-zinc-300 max-w-2xl mx-auto flex items-center justify-center gap-1.5">
                    <Magnet size={17} className="text-amber-400 animate-bounce" weight="fill" />
                    <span>Arrastra el parche o tócalo para colocarlo en Kuma Sensei.</span>
                </p>
            </div>

            {/* CONTENEDOR PRINCIPAL: OSO PIXAR INTERACTIVO + BANDEJA DE PARCHES BORDADOS */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* COLUMNA OSO INTERACTIVO (Lg: 7 cols) */}
                <div className="lg:col-span-7 flex flex-col items-center">
                    <div
                        ref={bearContainerRef}
                        className="relative w-full max-w-[480px] aspect-square rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_12px_36px_rgba(0,0,0,0.9)] bg-zinc-950"
                    >
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

                        {/* SLOTS Y PARCHES BORDADOS EN EL CUERPO */}
                        {ANATOMY_PARTS.map((part) => {
                            const isPlaced = placedPartIds.includes(part.id);
                            const isCurrentPhase = part.phase === currentPhase;
                            const isSelected = selectedPartId === part.id;

                            // No mostrar puntos de fases futuras para no saturar visualmente
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
                                    onClick={() => handlePlacePart(part)}
                                >
                                    {isPlaced ? (
                                        // PARCHE EN ROMAJI SELLADO SOBRE EL CUERPO (MÁS GRANDE Y SEMI-TRANSPARENTE CRISTALINO)
                                        <motion.div
                                            initial={{ scale: 0, rotate: -15 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 450, damping: 22 }}
                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.75)" }}
                                            whileTap={{ scale: 0.96 }}
                                            className="flex items-center gap-2 px-3.5 py-1.5 md:px-4 md:py-2 bg-black/60 backdrop-blur-md text-white rounded-2xl border-2 border-amber-400 shadow-[0_8px_25px_rgba(0,0,0,0.65),0_0_15px_rgba(245,158,11,0.4)] whitespace-nowrap group transition-all"
                                            title={`${part.romaji} - ${part.spanish} (Clic para escuchar)`}
                                        >
                                            <span className="text-base md:text-lg">{part.icon}</span>
                                            <span className="font-sans text-xs md:text-sm lg:text-base font-black uppercase tracking-wider text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                                                {part.romaji}
                                            </span>
                                            <CheckCircle size={17} weight="fill" className="text-emerald-400 ml-0.5" />
                                        </motion.div>
                                    ) : (
                                        // DIANA MAGNÉTICA ESPERANDO EL PARCHE (SEMI-TRANSPARENTE PARA VER AL OSO DEBAJO)
                                        <div className="relative group">
                                            {/* Aura pulsante magnética */}
                                            {isSelected && (
                                                <div className="absolute -inset-3 bg-amber-400/40 rounded-full animate-ping pointer-events-none" />
                                            )}

                                            <motion.div
                                                animate={
                                                    isSelected
                                                        ? { scale: [1, 1.25, 1], rotate: [0, 90, 0] }
                                                        : { scale: [1, 1.08, 1] }
                                                }
                                                transition={{ repeat: Infinity, duration: isSelected ? 1.4 : 2.5 }}
                                                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-black text-base md:text-lg transition-all shadow-xl border-2 ${
                                                    isSelected
                                                        ? "bg-amber-500/90 backdrop-blur-md text-zinc-950 border-white shadow-[0_0_28px_rgba(245,158,11,0.95)]"
                                                        : "bg-black/50 backdrop-blur-md text-amber-300 border-amber-400/75 hover:border-amber-300 hover:bg-black/65 hover:scale-110 shadow-black"
                                                }`}
                                            >
                                                {isSelected ? (
                                                    <Magnet size={24} weight="fill" className="text-zinc-950 animate-bounce" />
                                                ) : (
                                                    <span className="text-xl md:text-2xl">{part.icon}</span>
                                                )}
                                            </motion.div>

                                            {/* Tooltip con nombre en Romaji + Español en hover */}
                                            <div
                                                className={`absolute left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-md border border-amber-500/40 text-xs text-amber-300 rounded-xl font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-30 ${
                                                    part.slotY > 75 ? "bottom-full mb-2" : "top-full mt-2"
                                                }`}
                                            >
                                                {part.romaji} • {part.spanish}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* COLUMNA LATERAL: BANDEJA DE PARCHES BORDADOS + BIOMECÁNICA (Lg: 5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    {/* BANDEJA TATAMI: PARCHES EN ROMAJI (SEMI-TRANSPARENTE Y MÁS GRANDE) */}
                    <div className="bg-zinc-950/80 border-2 border-amber-500/30 rounded-3xl p-4 md:p-5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl">
                        {/* Cabecera de la bandeja */}
                        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-zinc-800">
                            <div className="flex items-center gap-2">
                                <Magnet size={20} weight="fill" className="text-amber-400" />
                                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                                    Parches en Japonés (Romaji)
                                </h3>
                            </div>
                            <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full backdrop-blur-sm">
                                {placedPartIds.filter((id) => currentPhaseParts.some((p) => p.id === id)).length} /{" "}
                                {currentPhaseParts.length}
                            </span>
                        </div>

                        {/* LISTA / GRID DE PARCHES MAGNÉTICOS EN ROMAJI */}
                        <div className="grid grid-cols-1 gap-3">
                            {currentPhaseParts.map((part) => {
                                const isPlaced = placedPartIds.includes(part.id);
                                const isSelected = selectedPartId === part.id;

                                return (
                                    <motion.div
                                        key={part.id}
                                        drag={!isPlaced}
                                        dragSnapToOrigin={true}
                                        whileDrag={{
                                            scale: 1.12,
                                            zIndex: 60,
                                            cursor: "grabbing",
                                            boxShadow: "0 20px 35px -5px rgba(245, 158, 11, 0.5)",
                                        }}
                                        whileHover={!isPlaced ? { scale: 1.03, y: -2 } : {}}
                                        whileTap={!isPlaced ? { scale: 0.97 } : {}}
                                        onDragStart={() => {
                                            setSelectedPartId(part.id);
                                            speakPart(part);
                                        }}
                                        onDragEnd={(event, info) => {
                                            handleDropPart(part, info.point);
                                        }}
                                        onClick={() => {
                                            if (!isPlaced) {
                                                if (selectedPartId === part.id) {
                                                    placeSuccess(part);
                                                } else {
                                                    setSelectedPartId(part.id);
                                                    speakPart(part);
                                                }
                                            }
                                        }}
                                        className={`relative w-full p-4 rounded-2xl border-2 transition-all select-none backdrop-blur-md ${
                                            isPlaced
                                                ? "bg-zinc-950/40 border-zinc-800/60 opacity-40 cursor-default"
                                                : isSelected
                                                ? "bg-amber-950/50 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.45)] cursor-grab active:cursor-grabbing"
                                                : "bg-zinc-900/65 border-amber-500/40 hover:border-amber-400 hover:bg-zinc-900/80 hover:shadow-[0_4px_20px_rgba(245,158,11,0.25)] cursor-grab active:cursor-grabbing"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            {/* Lado izquierdo: Icono grande y Texto en Romaji */}
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-black/60 backdrop-blur-sm border border-amber-400/50 flex items-center justify-center shadow-inner flex-shrink-0">
                                                    <span className="text-2xl md:text-3xl">
                                                        {part.icon}
                                                    </span>
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {/* NOMBRE EN ROMAJI (MÁS GRANDE Y CLARO) */}
                                                        <span className="font-black text-lg md:text-xl text-white tracking-wide uppercase">
                                                            {part.romaji}
                                                        </span>
                                                        <span className="text-[11px] uppercase font-black px-2.5 py-0.5 rounded-md border bg-black/60 text-amber-300 border-amber-500/40">
                                                            {part.heightLevel}
                                                        </span>
                                                    </div>
                                                    {/* NOMBRE EN ESPAÑOL */}
                                                    <div className="text-xs md:text-sm text-zinc-300 font-medium mt-0.5">
                                                        {part.spanish}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Lado derecho: Estado o Indicador Magnético */}
                                            <div className="flex items-center gap-2">
                                                {isPlaced ? (
                                                    <div className="flex items-center gap-1 text-emerald-300 text-xs font-bold bg-emerald-950/70 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border border-emerald-500/40">
                                                        <CheckCircle size={16} weight="fill" />
                                                        <span>Colocado</span>
                                                    </div>
                                                ) : isSelected ? (
                                                    <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black bg-amber-500/25 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-amber-400 animate-pulse">
                                                        <Magnet size={16} weight="fill" />
                                                        <span>¡Al Oso!</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-xs text-zinc-300 hover:text-amber-300 bg-zinc-800/70 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border border-zinc-700">
                                                        <HandPointing size={15} />
                                                        <span>Arrastrar</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* TARJETA DE APRENDIZAJE BIOMECÁNICO (SEMI-TRANSPARENTE) */}
                    {(lastPlacedPart || (selectedPartId && ANATOMY_PARTS.find((p) => p.id === selectedPartId))) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-950/80 border-2 border-amber-500/30 rounded-3xl p-4 md:p-5 shadow-2xl backdrop-blur-xl"
                        >
                            {(() => {
                                const current =
                                    lastPlacedPart ||
                                    ANATOMY_PARTS.find((p) => p.id === selectedPartId)!;
                                return (
                                    <>
                                        <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                                            <ShieldCheck size={18} weight="fill" />
                                            <span>Función Biomecánica en Karate</span>
                                        </div>
                                        <div className="text-base md:text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                                            <span className="text-2xl">{current.icon}</span>
                                            <span className="text-lg md:text-xl text-amber-300 font-black uppercase">{current.romaji}</span>
                                            <span className="text-zinc-300 text-sm md:text-base font-semibold">— {current.spanish}</span>
                                        </div>
                                        <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
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
                            className="bg-gradient-to-r from-emerald-950/90 via-teal-900/90 to-emerald-950/90 border-2 border-emerald-400 rounded-3xl p-5 text-center shadow-[0_0_35px_rgba(16,185,129,0.4)] backdrop-blur-xl"
                        >
                            <Trophy size={40} weight="fill" className="text-amber-400 mx-auto mb-2" />
                            <h4 className="text-base md:text-lg font-black text-white mb-1">
                                ¡El Cuerpo Humano de Pies a Cabeza Completado!
                            </h4>
                            <p className="text-xs md:text-sm text-emerald-200 mb-3">
                                Has dominado los puntos anatómicos fundamentales de Karate con Kuma Sensei.
                            </p>
                            {onCheckAndNext && (
                                <button
                                    onClick={onCheckAndNext}
                                    type="button"
                                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-xl text-sm md:text-base shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
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
