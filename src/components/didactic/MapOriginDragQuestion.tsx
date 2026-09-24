"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { didacticSound } from "@/lib/didacticSound";
import { Question } from "@/types/didactica";
import {
    CheckCircle,
    Sparkle,
    ArrowCounterClockwise,
    ShieldCheck,
    SpeakerHigh,
    SpeakerSlash,
    Compass,
    NavigationArrow,
    ArrowRight,
} from "@phosphor-icons/react";

interface MapOriginDragQuestionProps {
    question: Question;
    onCompleted: () => void;
    onCheckAndNext?: () => void;
    isSuperAdmin?: boolean;
}

// Coordenadas calibradas con el mapa 3D Pixar kuma_pixar_origins_map.jpg (16:9)
interface PortLocation {
    id: "china" | "okinawa" | "japan";
    stepIndex: number;
    title: string;
    subtitle: string;
    flag: string;
    icon: string;
    cargo: string;
    badge: string;
    speech: string;
    xPercent: number; // Coordenada X relativa en %
    yPercent: number; // Coordenada Y relativa en %
}

const PORTS: PortLocation[] = [
    {
        id: "china",
        stepIndex: 0,
        title: "China",
        subtitle: "Cuna del Kung-Fu",
        flag: "🇨🇳",
        icon: "🐉",
        cargo: "Rollo de Kung-Fu 📜",
        badge: "1. COSTA DE CHINA",
        speech: "¡Toca la bandera de China para recoger el secreto del Kung-Fu!",
        xPercent: 20,
        yPercent: 67,
    },
    {
        id: "okinawa",
        stepIndex: 1,
        title: "Isla Okinawa",
        subtitle: "¡AQUÍ NACIÓ EL KARATE!",
        flag: "🏝️",
        icon: "🥋",
        cargo: "¡Mano Vacía (Karate)! 🥋",
        badge: "2. ISLA DE OKINAWA",
        speech: "¡KIAI! En la isla de Okinawa unieron el Kung-Fu con su arte nativo. ¡Aquí nació el Karate-Do!",
        xPercent: 55,
        yPercent: 56,
    },
    {
        id: "japan",
        stepIndex: 2,
        title: "Japón",
        subtitle: "Expansión al Mundo",
        flag: "🇯🇵",
        icon: "🗻",
        cargo: "Karate Mundial 🌍",
        badge: "3. JAPÓN CONTINENTAL",
        speech: "¡Excelente navegación! Desde Japón, el Karate viajó a todo el mundo.",
        xPercent: 82,
        yPercent: 32,
    },
];

// Localizador inteligente de voz en Español Latino
function findLatinAmericanVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (!voices || voices.length === 0) return null;

    // 1. Prioridad: Códigos regionales de Latinoamérica
    // Costa Rica (es-CR), México (es-MX), América Latina (es-419), EE.UU. Latino (es-US), Colombia (es-CO), etc.
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
        const match = voices.find(v => v.lang.toLowerCase() === lang);
        if (match) return match;
    }

    // 2. Coincidencia por nombres de voces latinas comunes (Windows/Edge/Chrome/Android/Apple)
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

    const matchByName = voices.find(v => {
        if (!v.lang.toLowerCase().startsWith("es")) return false;
        const nameLower = v.name.toLowerCase();
        return latinKeywords.some(keyword => nameLower.includes(keyword));
    });
    if (matchByName) return matchByName;

    // 3. Cualquier voz en español que NO sea de España (es-es)
    const nonSpainSpanish = voices.find(v => {
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

    // 4. Fallback si no hay otra: primera en español disponible
    return voices.find(v => v.lang.toLowerCase().startsWith("es")) || null;
}

export function MapOriginDragQuestion({
    question,
    onCompleted,
    onCheckAndNext,
    isSuperAdmin = false,
}: MapOriginDragQuestionProps) {
    // Paso actual:
    // 0 = En China (listo para recoger Kung-Fu)
    // 1 = Recogió China, listo para navegar a Okinawa
    // 2 = En Okinawa, listo para navegar a Japón
    // 3 = Completado en Japón
    const [step, setStep] = useState<number>(0);
    const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [latinVoice, setLatinVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [lastActionMessage, setLastActionMessage] = useState<string>(
        "¡Toca el puerto 1 en China 🇨🇳 para iniciar la navegación!"
    );

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

    // Sistema de síntesis de voz en Español Latino amigable para niños
    const speakKuma = (text: string) => {
        if (!isVoiceActive || typeof window === "undefined" || !window.speechSynthesis) return;

        try {
            window.speechSynthesis.cancel();
            setIsSpeaking(true);

            const utterance = new SpeechSynthesisUtterance(text);

            // Resolver y asignar voz latinoamericana
            let voiceToUse = latinVoice;
            if (!voiceToUse) {
                const availableVoices = window.speechSynthesis.getVoices();
                voiceToUse = findLatinAmericanVoice(availableVoices);
                if (voiceToUse) setLatinVoice(voiceToUse);
            }

            if (voiceToUse) {
                utterance.voice = voiceToUse;
                utterance.lang = voiceToUse.lang;
            } else {
                // Código BCP 47 para español latinoamericano
                utterance.lang = "es-419";
            }

            utterance.rate = 0.94; // Pausado y claro para niños
            utterance.pitch = 1.05; // Tono cálido de oso maestro
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } catch {
            setIsSpeaking(false);
        }
    };

    // Al cargar el componente, Kuma invita a jugar por voz
    useEffect(() => {
        const timer = setTimeout(() => {
            speakKuma("¡Hola karateca! Vamos en el barquito a descubrir dónde nació el Karate. Toca el número 1 en China.");
        }, 600);
        return () => {
            clearTimeout(timer);
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Posición del barquito animado según el paso
    const getBoatPosition = () => {
        switch (step) {
            case 0:
                return { x: 20, y: 67 };
            case 1:
                return { x: 38, y: 64 }; // En camino hacia Okinawa
            case 2:
                return { x: 55, y: 56 }; // Anclado en Okinawa
            case 3:
                return { x: 82, y: 32 }; // Anclado en Japón
            default:
                return { x: 20, y: 67 };
        }
    };

    // Manejo de toques en los puertos
    const handlePortClick = (portIndex: number) => {
        didacticSound.playClick();

        if (portIndex === 0) {
            // Toca China
            if (step === 0) {
                setStep(1);
                setLastActionMessage("¡Pergamino de Kung-Fu a bordo! 📜 Ahora navega a la Isla de Okinawa (2) 🏝️");
                speakKuma("¡Subimos el Kung-Fu de China al barco! Ahora toca la isla del centro, ¡Okinawa!");
            } else {
                speakKuma("¡Ya recogiste el Kung-Fu en China! Sigue la ruta dorada hacia Okinawa.");
            }
        } else if (portIndex === 1) {
            // Toca Okinawa
            if (step === 0) {
                // Guiar con cariño al niño si se salta China
                speakKuma("¡Primero pasa por China a recoger el Kung-Fu! Toca el número 1 con el dragón.");
                setLastActionMessage("💡 Pasa primero por China (1) 🇨🇳 para recoger el Kung-Fu.");
            } else if (step === 1) {
                didacticSound.playWoodBreak();
                setStep(2);
                setLastActionMessage("🥋 ¡AQUÍ NACIÓ EL KARATE! En la Isla de Okinawa nació la 'Mano Vacía'. ¡Ahora viaja a Japón (3)!");
                speakKuma("¡KIAI! Llegamos a Okinawa. Aquí nació la Mano Vacía, el Karate-Do. ¡Ahora toca Japón para llevarlo al mundo!");
            } else {
                speakKuma("¡Okinawa es la cuna del Karate! Ahora toca Japón para completar el viaje.");
            }
        } else if (portIndex === 2) {
            // Toca Japón
            if (step < 2) {
                speakKuma("¡El Karate primero nació en la isla de Okinawa! Toca la isla del medio antes de ir a Japón.");
                setLastActionMessage("💡 El barco debe pasar primero por Okinawa (2) 🏝️ donde nació el Karate.");
            } else if (step === 2) {
                setStep(3);
                triggerVictory();
            }
        }
    };

    // Victoria y celebración
    const triggerVictory = () => {
        didacticSound.playStreak();
        confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.65 },
            colors: ["#FFC800", "#58CC02", "#1CB0F6", "#FF4B4B", "#FFFFFF"],
        });
        setLastActionMessage("🏆 ¡Viaje Completado! El Karate nació en Okinawa y hoy se entrena en todo el mundo.");
        speakKuma("¡Maravilloso karateca! Has completado la ruta histórica. ¡El Karate nació en Okinawa y llegó a todo el planeta!");
        onCompleted();
    };

    // Auto-solucionador Super Admin
    const handleAdminAutoFill = () => {
        didacticSound.playClick();
        setStep(3);
        triggerVictory();
    };

    // Reiniciar aventura
    const handleReset = () => {
        didacticSound.playClick();
        setStep(0);
        setLastActionMessage("¡Toca el puerto 1 en China 🇨🇳 para iniciar la navegación!");
        speakKuma("¡Ruta reiniciada! Vamos de nuevo en el barquito. Toca el número 1 en China.");
    };

    const boatPos = getBoatPosition();

    return (
        <div className="w-full space-y-3 select-none">
            {/* Super Admin Toolbar (Solo visible en pantallas medianas/grandes para no restar espacio al mapa en móvil) */}
            {isSuperAdmin && (
                <div className="hidden md:flex items-center justify-between p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                    <span className="font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" weight="fill" />
                        <span>Super Admin: Resolver barquito</span>
                    </span>
                    <button
                        type="button"
                        onClick={handleAdminAutoFill}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer"
                    >
                        Auto-Completar Ruta
                    </button>
                </div>
            )}

            {/* ========================================================= */}
            {/* EL GRAN MAPA PIXAR 3D CON ESTACIONES Y BARQUITO ANIMADO */}
            {/* ========================================================= */}
            <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-amber-400/50 shadow-[0_8px_30px_rgba(0,0,0,0.8)] bg-slate-950">
                {/* 1. Fondo: Ilustración 3D Pixar de Alta Calidad */}
                <Image
                    src="/images/didactic/kuma_pixar_origins_map_v2.jpg"
                    alt="Mapa 3D Pixar del Origen del Karate con Kuma Sensei"
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
                                step === 0
                                    ? "Toca la bandera de China número 1."
                                    : step === 1
                                    ? "Ahora toca la isla de Okinawa en el centro."
                                    : step === 2
                                    ? "Toca Japón para terminar el viaje."
                                    : "¡Completaste el origen del Karate!"
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

                {/* Botón sutil flotante para Reiniciar Barquito (pequeño y discreto) */}
                {step > 0 && step < 3 && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="absolute top-3 right-3 z-30 px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white/90 hover:text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md"
                        title="Reiniciar navegación"
                    >
                        <ArrowCounterClockwise className="w-3.5 h-3.5" />
                        <span>Reiniciar</span>
                    </button>
                )}

                {/* 2. PINES INTERACTIVOS (ESTACIONES 1, 2 Y 3) */}
                {PORTS.map((port, idx) => {
                    const isPassed = step > idx || (step === 3 && idx === 2);
                    const isCurrent = (step === 0 && idx === 0) || (step === 1 && idx === 1) || (step === 2 && idx === 2);

                    return (
                        <div
                            key={port.id}
                            style={{
                                left: `${port.xPercent}%`,
                                top: `${port.yPercent}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                            className="absolute z-20"
                        >
                            {/* Flecha saltarina sobre la estación activa para niños que no leen */}
                            {isCurrent && (
                                <motion.div
                                    animate={{ y: [-8, 0, -8] }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                                    className="absolute -top-11 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30"
                                >
                                    <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg whitespace-nowrap border border-black/40">
                                        ¡Toca aquí!
                                    </span>
                                    <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-yellow-400" />
                                </motion.div>
                            )}

                            {/* Botón táctil gigante del puerto */}
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => handlePortClick(idx)}
                                className={`relative flex items-center justify-center rounded-full transition-all cursor-pointer shadow-xl ${
                                    isCurrent
                                        ? "w-13 h-13 sm:w-16 sm:h-16 bg-gradient-to-tr from-yellow-500 to-amber-300 ring-4 ring-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.9)] animate-pulse"
                                        : isPassed
                                        ? "w-10 h-10 sm:w-13 sm:h-13 bg-emerald-600/90 ring-3 ring-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]"
                                        : "w-10 h-10 sm:w-12 sm:h-12 bg-slate-900/80 hover:bg-slate-800 ring-2 ring-white/50 opacity-80"
                                }`}
                            >
                                {/* Onda expansiva si es el turno actual */}
                                {isCurrent && (
                                    <span className="absolute inset-0 rounded-full bg-yellow-400/40 animate-ping pointer-events-none" />
                                )}

                                <div className="flex flex-col items-center justify-center leading-none">
                                    <span className="text-xl sm:text-2xl drop-shadow">{port.flag}</span>
                                    {isPassed && (
                                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                                            <CheckCircle className="w-3.5 h-3.5" weight="fill" />
                                        </span>
                                    )}
                                </div>
                            </motion.button>

                            {/* Etiqueta ultra-clara debajo del pin */}
                            <div className="mt-1 text-center pointer-events-none">
                                <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-md border ${
                                        isCurrent
                                            ? "bg-yellow-400 text-slate-950 border-black"
                                            : isPassed
                                            ? "bg-[#143818]/90 text-emerald-200 border-emerald-400/50"
                                            : "bg-black/75 text-slate-200 border-white/20"
                                    }`}
                                >
                                    {port.title}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* 3. EL BARQUITO DE KUMA EN NAVEGACIÓN */}
                <motion.div
                    animate={{
                        left: `${boatPos.x}%`,
                        top: `${boatPos.y}%`,
                        rotate: step === 0 ? 0 : step === 1 ? 8 : step === 2 ? -5 : 5,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 45,
                        damping: 14,
                        duration: 1.2,
                    }}
                    style={{ transform: "translate(-50%, -50%)" }}
                    className="absolute z-30 pointer-events-none"
                >
                    {/* Estructura del barquito con Kuma Sensei a bordo */}
                    <motion.div
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        className="relative flex flex-col items-center"
                    >
                        {/* Kuma saludando desde el barco */}
                        <div className="relative text-2xl sm:text-3xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] -mb-2 z-10">
                            {step >= 2 ? "🐻🥋" : "🐻⛵"}
                        </div>

                        {/* Barquito de madera vector */}
                        <div className="relative w-12 sm:w-16 h-7 sm:h-9 bg-gradient-to-b from-[#A16207] to-[#713F12] rounded-b-2xl border-2 border-amber-300 shadow-2xl flex items-center justify-center">
                            {/* Vela del barco */}
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-4 h-6 border-l-3 border-l-white border-b-6 border-b-white/80 border-t-transparent border-r-transparent rotate-6 drop-shadow" />

                            {/* Carga del barco (Kung-Fu o Karate) */}
                            <span className="text-xs sm:text-sm font-black text-amber-100 z-10">
                                {step >= 2 ? "🥋" : step >= 1 ? "📜" : "⚓"}
                            </span>

                            {/* Ondas de agua debajo del barco */}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 opacity-70">
                                <span className="w-3 h-1 rounded-full bg-cyan-200 animate-pulse" />
                                <span className="w-4 h-1 rounded-full bg-white animate-pulse" />
                                <span className="w-3 h-1 rounded-full bg-cyan-200 animate-pulse" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* 4. BANNER CELEBRATORIO AL LLEGAR A OKINAWA (PASO 2) */}
                <AnimatePresence>
                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-emerald-950/95 via-black/90 to-emerald-950/95 border-2 border-emerald-400 px-4 py-2 rounded-2xl shadow-[0_0_30px_rgba(52,211,153,0.5)] text-center max-w-[90%] backdrop-blur-md"
                        >
                            <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-yellow-300">
                                <Sparkle weight="fill" className="text-yellow-400" />
                                <span>¡AQUÍ NACIÓ EL KARATE! 🥋</span>
                                <Sparkle weight="fill" className="text-yellow-400" />
                            </div>
                            <p className="text-[11px] sm:text-xs text-white mt-0.5">
                                En la <strong>Isla de Okinawa</strong> se unió el Kung-Fu y nació la <em>Mano Vacía</em>.
                            </p>
                            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                                👉 Ahora toca <strong>Japón (3)</strong> para llevarlo al mundo
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 5. BANNER FINAL DE VICTORIA (PASO 3) */}
                <AnimatePresence>
                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center"
                        >
                            <div className="bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0A0F1D] border-3 border-yellow-400 rounded-3xl p-4 sm:p-6 shadow-[0_0_40px_rgba(250,204,21,0.5)] max-w-md w-full">
                                <div className="text-4xl sm:text-5xl mb-2 animate-bounce">
                                    🥋✨
                                </div>
                                <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] text-yellow-300 bg-amber-950/80 px-3 py-1 rounded-full border border-yellow-400/50 mb-1.5">
                                    ¡Origen Revelado!
                                </span>
                                <h3 className="text-lg sm:text-xl font-serif font-black text-white">
                                    🇨🇳 Kung-Fu + 🏝️ Okinawa = 🥋 Karate-Do
                                </h3>
                                <p className="text-xs sm:text-sm text-emerald-300 font-medium mt-1">
                                    ¡Excelente trabajo, karateca! El Karate nació en la pequeña isla de Okinawa y hoy une a dojos de todo el mundo.
                                </p>

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
                                        <span>Navegar de nuevo</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ========================================================= */}
            {/* RESUMEN VISUAL ULTRA-GRÁFICO (100% ICONOS - MÍNIMO TEXTO) */}
            {/* ========================================================= */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                {/* Paso 1: China */}
                <div
                    onClick={() => handlePortClick(0)}
                    className={`p-2 sm:p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        step >= 1
                            ? "bg-[#142A1D]/90 border-[#58CC02] shadow-[0_0_15px_rgba(88,204,2,0.2)]"
                            : step === 0
                            ? "bg-[#282110]/90 border-yellow-400 ring-2 ring-yellow-400/40"
                            : "bg-slate-900/60 border-slate-700/60 opacity-60"
                    }`}
                >
                    <span className="text-2xl sm:text-3xl block">🐉📜</span>
                    <p className="text-xs sm:text-sm font-black text-white mt-0.5">1. China</p>
                    <span className="text-[10px] text-amber-300 font-bold block">Kung-Fu Sureño</span>
                </div>

                {/* Paso 2: Okinawa (Destacado como la cuna) */}
                <div
                    onClick={() => handlePortClick(1)}
                    className={`p-2 sm:p-2.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        step >= 2
                            ? "bg-[#142A1D]/90 border-[#58CC02] shadow-[0_0_15px_rgba(88,204,2,0.2)]"
                            : step === 1
                            ? "bg-[#282110]/90 border-yellow-400 ring-2 ring-yellow-400/40 animate-pulse"
                            : "bg-slate-900/60 border-slate-700/60 opacity-60"
                    }`}
                >
                    <span className="text-2xl sm:text-3xl block">🏝️🥋</span>
                    <p className="text-xs sm:text-sm font-black text-white mt-0.5">2. Okinawa</p>
                    <span className="text-[10px] text-emerald-300 font-black block">¡Cuna del Karate!</span>
                </div>

                {/* Paso 3: Japón */}
                <div
                    onClick={() => handlePortClick(2)}
                    className={`p-2 sm:p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        step >= 3
                            ? "bg-[#142A1D]/90 border-[#58CC02] shadow-[0_0_15px_rgba(88,204,2,0.2)]"
                            : step === 2
                            ? "bg-[#282110]/90 border-yellow-400 ring-2 ring-yellow-400/40 animate-pulse"
                            : "bg-slate-900/60 border-slate-700/60 opacity-60"
                    }`}
                >
                    <span className="text-2xl sm:text-3xl block">🗻🌸</span>
                    <p className="text-xs sm:text-sm font-black text-white mt-0.5">3. Japón</p>
                    <span className="text-[10px] text-sky-300 font-bold block">Al Mundo Entero</span>
                </div>
            </div>
        </div>
    );
}
