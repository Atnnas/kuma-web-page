"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MascotMood, BeltRank } from "@/types/didactica";
import { didacticSound } from "@/lib/didacticSound";
import { Fire, Sparkle, HeartBreak } from "@phosphor-icons/react";

interface KumaMascotProps {
    mood?: MascotMood;
    customMessage?: string;
    size?: "sm" | "md" | "lg" | "xl" | "responsive";
    showBubble?: boolean;
    className?: string;
    interactive?: boolean;
    strikeTrigger?: number | string;
    path?: "tradicional" | "wkf";
    wkfColor?: "red" | "blue";
    beltRank?: BeltRank;
    layout?: "vertical" | "horizontal" | "responsive";
}

const MOOD_MESSAGES: Record<MascotMood, string[]> = {
    idle: [
        "¡Ossu! ¿Listo para entrenar tu mente marcial hoy?",
        "Un verdadero karateka aprende tanto en el dojo como en el estudio.",
        "Mente limpia, espíritu indomable. ¡Elige un nivel!",
        "La paciencia y la repetición forjan el cinturón negro.",
    ],
    thinking: [
        "Hmm... analiza bien cada detalle de la técnica...",
        "Recuerda la biomecánica y los criterios de puntuación...",
        "Tómate tu tiempo. La prisa es enemiga del Zanshin.",
    ],
    correct: [
        "¡TSUKI! ¡Impacto demoledor y preciso! 👊💥",
        "¡Kiai! ¡Técnica perfecta con máxima potencia!",
        "¡Ossu! ¡Velocidad y golpe certero!",
        "¡Ippon! ¡Así golpea el espíritu Kuma!",
    ],
    wrong: [
        "¡No pasa nada! El error es el primer escalón de la maestría.",
        "Respira hondo... revisa el detalle y vuelve a intentarlo.",
        "Caer siete veces, levantarse ocho. ¡Sigue adelante!",
        "Incluso los grandes maestros tropezaron en el camino.",
    ],
    streak: [
        "¡EN LLAMAS! ¡Espíritu Kuma Desatado! 🔥",
        "¡Racha marcial imparable! ¡Kiai!",
        "¡Estás en la zona! ¡Concentración total!",
    ],
    completed: [
        "¡Enhorabuena! Has completado la lección con honor marcial.",
        "¡Tu espíritu brilla hoy en el dojo!",
        "¡Rei! Saludamos a tu dedicación y esfuerzo.",
    ],
    low_hearts: [
        "¡Cuidado con tus vidas! Concéntrate en la técnica...",
        "¡Un último esfuerzo! No bajes la guardia.",
    ],
    sad: [
        "¡Te extrañé en el dojo! Llevas días sin entrar y tus estrellas sufren... 🥺",
        "El cinturón se llena de polvo sin práctica constante. ¡Repasemos hoy!",
        "La técnica que no se pule, se oxida. ¡Ven a entrenar conmigo!",
    ],
    crying: [
        "¡Pensé que habías abandonado el tatami! 😭 ¡El dojo está frío!",
        "¡Tus estrellas están cayendo por la inactividad! ¡Por favor vuelve a entrenar!",
        "¡Un verdadero guerrero no se rinde ante la pereza! ¡Rescatemos tus niveles!",
    ],
};

export function KumaMascot({
    mood = "idle",
    customMessage,
    size = "md",
    showBubble = true,
    className = "",
    interactive = true,
    strikeTrigger,
    path = "tradicional",
    wkfColor,
    beltRank,
    layout = "vertical",
}: KumaMascotProps) {
    const isWkfMode = path === "wkf";
    // Random WKF Protections: Red (AKA / 赤) or Blue (AO / 青)
    const [gearColor, setGearColor] = useState<"red" | "blue">(() => wkfColor || (Math.random() < 0.5 ? "red" : "blue"));

    useEffect(() => {
        if (isWkfMode) {
            if (wkfColor) {
                setGearColor(wkfColor);
            } else {
                setGearColor(Math.random() < 0.5 ? "red" : "blue");
            }
        }
    }, [isWkfMode, wkfColor]);

    const activeGearColor = wkfColor || gearColor;
    const isBlueGear = isWkfMode && activeGearColor === "blue";
    const wkfStroke = isBlueGear ? "#1E3A8A" : "#991B1B";
    const wkfHighlight = isBlueGear ? "#BFDBFE" : "#FCA5A5";
    const wkfAccent = isBlueGear ? "#2563EB" : "#DC2626";
    const wkfKnot = isBlueGear ? "#1D4ED8" : "#B91C1C";
    const wkfKnotStroke = isBlueGear ? "#172554" : "#7F1D1D";
    const [messageIndex, setMessageIndex] = useState(0);
    const [isBlinking, setIsBlinking] = useState(false);
    const [isPokePumping, setIsPokePumping] = useState(false);
    const [strikeKey, setStrikeKey] = useState(0);
    const [isStriking, setIsStriking] = useState(false);
    const [hasBrokenTrunk, setHasBrokenTrunk] = useState(false);
    const [isYoiDeepBreathing, setIsYoiDeepBreathing] = useState(false);
    const pokeCleanTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    const prevMoodRef = React.useRef(mood);
    const prevTriggerRef = React.useRef(strikeTrigger);

    // Pick speech message
    useEffect(() => {
        const msgs = MOOD_MESSAGES[mood] || MOOD_MESSAGES.idle;
        const rand = Math.floor(Math.random() * msgs.length);
        setMessageIndex(rand);
    }, [mood]);

    // One-shot martial strike trigger: plays ONCE per correct answer / streak / trigger
    useEffect(() => {
        const isNowExcited = mood === "correct" || mood === "streak";
        const wasExcited = prevMoodRef.current === "correct" || prevMoodRef.current === "streak";
        const triggerChanged = strikeTrigger !== undefined && strikeTrigger !== prevTriggerRef.current;

        if ((isNowExcited && !wasExcited) || (isNowExcited && triggerChanged)) {
            setStrikeKey((k) => k + 1);
            setIsStriking(true);
            setHasBrokenTrunk(true);
            setIsYoiDeepBreathing(false);
            const soundTimer = setTimeout(() => {
                didacticSound.playWoodBreak();
            }, 270);
            const strikeTimer = setTimeout(() => {
                setIsStriking(false);
                setIsYoiDeepBreathing(true);
            }, 1050);
            const breathTimer = setTimeout(() => {
                setIsYoiDeepBreathing(false);
            }, 2850);

            prevMoodRef.current = mood;
            prevTriggerRef.current = strikeTrigger;
            return () => {
                clearTimeout(soundTimer);
                clearTimeout(strikeTimer);
                clearTimeout(breathTimer);
            };
        } else if (!isNowExcited) {
            setIsStriking(false);
            setHasBrokenTrunk(false);
            setIsYoiDeepBreathing(false);
        }

        prevMoodRef.current = mood;
        prevTriggerRef.current = strikeTrigger;
    }, [mood, strikeTrigger]);

    // Natural random blinking like Duolingo Duo (every 3 to 6 seconds)
    useEffect(() => {
        let blinkTimeout: NodeJS.Timeout;
        const triggerBlink = () => {
            setIsBlinking(true);
            setTimeout(() => {
                setIsBlinking(false);
                const nextBlink = Math.random() * 3500 + 2500;
                blinkTimeout = setTimeout(triggerBlink, nextBlink);
            }, 180);
        };

        blinkTimeout = setTimeout(triggerBlink, 3000);
        return () => clearTimeout(blinkTimeout);
    }, []);

    const activeMessage = customMessage || MOOD_MESSAGES[mood][messageIndex] || MOOD_MESSAGES[mood][0];

    // Interactive poke handler (triggers one-shot punch & log break)
    const handlePoke = () => {
        if (!interactive) return;
        didacticSound.playClick();
        if (pokeCleanTimerRef.current) clearTimeout(pokeCleanTimerRef.current);
        setIsPokePumping(true);
        setStrikeKey((k) => k + 1);
        setIsStriking(true);
        setHasBrokenTrunk(true);
        setIsYoiDeepBreathing(false);
        const soundTimer = setTimeout(() => {
            didacticSound.playWoodBreak();
        }, 270);
        setTimeout(() => {
            setIsPokePumping(false);
            setIsStriking(false);
            setIsYoiDeepBreathing(true);
        }, 1050);
        setTimeout(() => {
            setIsYoiDeepBreathing(false);
        }, 2850);
        pokeCleanTimerRef.current = setTimeout(() => {
            setHasBrokenTrunk(false);
        }, 6000);
    };

    // Responsive dimensions
    const scaleClasses = {
        sm: "w-28 h-28",
        md: "w-40 h-40 md:w-48 md:h-48",
        lg: "w-52 h-52 md:w-64 md:h-64",
        xl: "w-64 h-64 md:w-80 md:h-80",
        responsive: "w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-48 md:h-48",
    };

    const isExcited = mood === "correct" || mood === "streak" || isPokePumping || isYoiDeepBreathing;
    const isThinking = mood === "thinking";
    const isSad = mood === "wrong" || mood === "sad" || mood === "crying" || mood === "low_hearts";
    const isCrying = mood === "crying";
    const isCompleted = mood === "completed";
    const showTrunk = isStriking || hasBrokenTrunk;

    return (
        <div
            className={`relative flex select-none ${
                layout === "responsive"
                    ? "flex-row md:flex-col items-center justify-center gap-3 md:gap-0 w-full"
                    : layout === "horizontal"
                    ? "flex-row items-center justify-center gap-3 w-full"
                    : "flex-col items-center"
            } ${className}`}
        >
            {/* DUOLINGO STYLE FLOATING SPEECH BUBBLE */}
            <AnimatePresence mode="wait">
                {showBubble && activeMessage && (
                    <motion.div
                        key={activeMessage + mood}
                        initial={{ opacity: 0, y: 14, scale: 0.88 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 450, damping: 24 }}
                        className={`border-2 border-kuma-gold/60 text-white shadow-lg relative z-30 backdrop-blur-xl ${
                            layout === "responsive"
                                ? "order-2 md:order-1 flex-1 md:flex-none min-w-0 mb-0 md:mb-3 max-w-none md:max-w-sm px-3.5 py-2 md:px-4 md:py-3 rounded-2xl md:rounded-3xl bg-gradient-to-b from-zinc-900/98 via-zinc-950/98 to-black/98 text-left md:text-center"
                                : layout === "horizontal"
                                ? "order-2 flex-1 min-w-0 mb-0 max-w-none px-3.5 py-2 rounded-2xl bg-gradient-to-b from-zinc-900/98 via-zinc-950/98 to-black/98 text-left"
                                : "mb-3 max-w-xs md:max-w-sm px-4 py-3 bg-gradient-to-b from-zinc-900/98 via-zinc-950/98 to-black/98 rounded-3xl text-center"
                        }`}
                    >
                        {/* Kuma Dojo Official Logo Badge */}
                        <div className="absolute -top-2.5 -right-2 md:-top-3 md:-right-2.5 w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden border-2 border-kuma-gold shadow-[0_0_10px_rgba(245,158,11,0.6)] rotate-12 bg-black">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/kuma-logo.jpg" alt="Kuma Logo" className="w-full h-full object-cover" />
                        </div>

                        {/* Top Golden Light Rim */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-kuma-gold to-transparent" />

                        <p className="text-xs md:text-sm font-black tracking-wide leading-relaxed text-zinc-100 flex items-center justify-start md:justify-center gap-2">
                            {mood === "streak" && <Fire className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" weight="fill" />}
                            {mood === "correct" && <Sparkle className="w-4 h-4 text-kuma-gold shrink-0 animate-spin" weight="fill" />}
                            {(mood === "wrong" || mood === "sad") && <HeartBreak className="w-4 h-4 text-red-400 shrink-0" weight="fill" />}
                            {mood === "crying" && <span className="text-base shrink-0 animate-pulse">😭</span>}
                            <span>{activeMessage}</span>
                        </p>

                        {/* Speech Bubble Arrow pointing to Kuma's mouth */}
                        {layout === "responsive" ? (
                            <>
                                {/* Mobile Arrow: points LEFT towards Kuma */}
                                <div className="md:hidden absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-zinc-950 border-l-2 border-b-2 border-kuma-gold/60 rotate-45" />
                                {/* Desktop Arrow: points DOWN towards Kuma */}
                                <div className="hidden md:block absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-950 border-r-2 border-b-2 border-kuma-gold/60 rotate-45" />
                            </>
                        ) : layout === "horizontal" ? (
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-zinc-950 border-l-2 border-b-2 border-kuma-gold/60 rotate-45" />
                        ) : (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-950 border-r-2 border-b-2 border-kuma-gold/60 rotate-45" />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN CHARACTER CONTAINER */}
            <div
                onClick={handlePoke}
                className={`relative ${
                    layout === "responsive" ? "order-1 md:order-2 shrink-0" : layout === "horizontal" ? "order-1 shrink-0" : ""
                } ${scaleClasses[size]} flex items-center justify-center cursor-pointer group`}
                title={interactive ? "¡Toca a Kuma Sensei!" : undefined}
            >
                {/* --- AURA PARTICLES & FIRE BURSTS --- */}
                {mood === "streak" && (
                    <motion.div
                        animate={{
                            scale: [1, 1.25, 1.08, 1.3, 1],
                            opacity: [0.6, 1, 0.7, 0.95, 0.6],
                            rotate: [0, 5, -5, 3, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                        className="absolute -inset-6 bg-gradient-to-t from-red-600/50 via-amber-500/60 to-yellow-300/50 rounded-full blur-2xl z-0 pointer-events-none"
                    />
                )}
                {isCrying && (
                    <motion.div
                        animate={{
                            scale: [0.95, 1.08, 0.96, 1.05, 0.95],
                            opacity: [0.35, 0.65, 0.4, 0.6, 0.35],
                        }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                        className="absolute -inset-6 bg-gradient-to-t from-blue-900/50 via-cyan-700/25 to-transparent rounded-full blur-2xl z-0 pointer-events-none"
                    />
                )}
                {isStriking && (
                    <motion.div
                        key={`aura-${strikeKey}`}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: [1, 1.4, 1.1], opacity: [0.3, 0.9, 0] }}
                        transition={{ duration: 0.95, repeat: 0 }}
                        className="absolute -inset-5 bg-gradient-to-r from-amber-400/40 via-kuma-gold/60 to-yellow-300/40 rounded-full blur-xl z-0 pointer-events-none"
                    />
                )}

                {/* --- TATAMI SHADOW (DISPLACES WITH TSUKI LUNGE ONCE) --- */}
                <motion.div
                    key={`shadow-${strikeKey}`}
                    animate={
                        isStriking
                            ? {
                                  x: [0, -14, 36, 28, 8],
                                  scaleX: [1, 0.88, 1.3, 1.2, 1],
                                  scaleY: [1, 0.92, 0.8, 0.85, 1],
                                  opacity: [0.7, 0.5, 0.9, 0.85, 0.7],
                              }
                            : isExcited
                            ? { x: 8, scaleX: 1.05, scaleY: 0.95, opacity: 0.75 }
                            : { x: 0, scale: [1, 0.92, 1], opacity: [0.7, 0.5, 0.7] }
                    }
                    transition={
                        isStriking
                            ? {
                                  duration: 0.95,
                                  times: [0, 0.22, 0.36, 0.65, 1],
                                  repeat: 0,
                                  ease: "easeInOut",
                              }
                            : isExcited
                            ? { duration: 0.3 }
                            : { repeat: Infinity, duration: 3.2, ease: "easeInOut" }
                    }
                    className="absolute bottom-1 w-3/4 h-5 bg-black/85 rounded-full blur-md z-0 pointer-events-none"
                />

                {/* --- FULLY ANIMATED 2D SKELETAL VECTOR MASCOT --- */}
                <svg
                    viewBox="-20 0 310 260"
                    className="w-full h-full overflow-visible z-10 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
                >
                    <defs>
                        {/* Bear Fur Gradients */}
                        <radialGradient id="kumaFurRadial" cx="50%" cy="40%" r="65%">
                            <stop offset="0%" stopColor="#A46850" />
                            <stop offset="55%" stopColor="#76412C" />
                            <stop offset="100%" stopColor="#4A2415" />
                        </radialGradient>
                        <linearGradient id="kumaEarInner" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F5D0A9" />
                            <stop offset="100%" stopColor="#D8A070" />
                        </linearGradient>

                        {/* Snout Gradient */}
                        <radialGradient id="kumaSnout" cx="50%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#FDE3C8" />
                            <stop offset="60%" stopColor="#E6B98F" />
                            <stop offset="100%" stopColor="#C48E5E" />
                        </radialGradient>

                        {/* Karategi Cloth Shading */}
                        <linearGradient id="karategiShade" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="60%" stopColor="#F1F5F9" />
                            <stop offset="100%" stopColor="#CBD5E1" />
                        </linearGradient>

                        {/* Gold Foil Crest */}
                        <linearGradient id="goldKumaLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFF176" />
                            <stop offset="45%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#B45309" />
                        </linearGradient>

                        {/* Fire Aura Filter */}
                        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* Chest Logo Circular Clip */}
                        <clipPath id="kumaChestLogoClip">
                            <circle cx="95" cy="174" r="14" />
                        </clipPath>

                        {/* Wood Trunk Bark Gradient */}
                        <linearGradient id="woodBarkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#451A03" />
                            <stop offset="35%" stopColor="#78350F" />
                            <stop offset="70%" stopColor="#92400E" />
                            <stop offset="100%" stopColor="#5C2D1C" />
                        </linearGradient>

                        {/* Wood Rings Cut Gradient */}
                        <radialGradient id="woodRingsGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FEF3C7" />
                            <stop offset="45%" stopColor="#FDE68A" />
                            <stop offset="75%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#78350F" />
                        </radialGradient>

                        {/* Wood Rope Binding Gradient */}
                        <linearGradient id="woodRopeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#F59E0B" />
                            <stop offset="50%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#78350F" />
                        </linearGradient>

                        {/* Okinawan Makiwara Wood & Straw Gradients */}
                        <linearGradient id="makiwaraWoodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3E1A08" />
                            <stop offset="30%" stopColor="#78350F" />
                            <stop offset="70%" stopColor="#92400E" />
                            <stop offset="100%" stopColor="#451A03" />
                        </linearGradient>
                        <linearGradient id="makiwaraStrawGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FEF3C7" />
                            <stop offset="35%" stopColor="#F59E0B" />
                            <stop offset="70%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#92400E" />
                        </linearGradient>

                        {/* WKF Sport Gear & Belt Gradients (Red / AKA vs Blue / AO) */}
                        <linearGradient id="wkfRedBeltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            {isBlueGear ? (
                                <>
                                    <stop offset="0%" stopColor="#60A5FA" />
                                    <stop offset="50%" stopColor="#2563EB" />
                                    <stop offset="100%" stopColor="#1E3A8A" />
                                </>
                            ) : (
                                <>
                                    <stop offset="0%" stopColor="#EF4444" />
                                    <stop offset="50%" stopColor="#DC2626" />
                                    <stop offset="100%" stopColor="#991B1B" />
                                </>
                            )}
                        </linearGradient>
                        <linearGradient id="wkfRedGearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            {isBlueGear ? (
                                <>
                                    <stop offset="0%" stopColor="#93C5FD" />
                                    <stop offset="35%" stopColor="#3B82F6" />
                                    <stop offset="85%" stopColor="#2563EB" />
                                    <stop offset="100%" stopColor="#1D4ED8" />
                                </>
                            ) : (
                                <>
                                    <stop offset="0%" stopColor="#F87171" />
                                    <stop offset="40%" stopColor="#EF4444" />
                                    <stop offset="85%" stopColor="#DC2626" />
                                    <stop offset="100%" stopColor="#991B1B" />
                                </>
                            )}
                        </linearGradient>
                        <linearGradient id="wkfWhiteStrapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#E2E8F0" />
                        </linearGradient>
                    </defs>

                    {/* ========================================================
                        OKINAWAN MAKIWARA TRADITIONAL TRAINING POST (巻藁)
                        Only visible in Traditional Martial Path (!isWkfMode)
                    ======================================================== */}
                    {!isWkfMode && (
                        <g id="okinawan-makiwara" className="select-none">
                            {/* Floor Tatami Shadow */}
                            <ellipse cx="19" cy="233" rx="16" ry="3.5" fill="#000000" opacity="0.45" />

                            {/* Tatami Floor Mounting Stand / Cross-Timber Brackets */}
                            <rect x="5" y="226" width="28" height="8" rx="2" fill="#2E1205" stroke="#1A0A03" strokeWidth="1.2" />
                            <rect x="9" y="223" width="20" height="5" rx="1.5" fill="#451A03" stroke="#1A0A03" strokeWidth="1" />
                            {/* Base Securing Pegs */}
                            <circle cx="10" cy="229.5" r="1.3" fill="#D97706" />
                            <circle cx="28" cy="229.5" r="1.3" fill="#D97706" />

                            {/* Tapered Vertical Cedar Post (Ahusado - Thicker at base, springy at top) */}
                            <path
                                d="M12 223 L14.5 92 Q19 88 23.5 92 L26 223 Z"
                                fill="url(#makiwaraWoodGrad)"
                                stroke="#261005"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                            />
                            {/* Beveled Top End Grain */}
                            <ellipse cx="19" cy="91" rx="4.5" ry="2.2" fill="#B45309" stroke="#3E1A08" strokeWidth="1" />
                            {/* Wood Grain Lines */}
                            <path d="M17 96 L15 221" stroke="#92400E" strokeWidth="0.8" opacity="0.6" />
                            <path d="M21 96 L23 221" stroke="#451A03" strokeWidth="0.8" opacity="0.5" />

                            {/* Traditional Okinawan Kanji Calligraphy on Post (武道 - Budo / Way of Martial Arts) */}
                            <text
                                x="19"
                                y="196"
                                textAnchor="middle"
                                fontSize="7"
                                fontFamily="serif"
                                fontWeight="bold"
                                fill="#FEF3C7"
                                opacity="0.85"
                            >
                                武
                            </text>
                            <text
                                x="19"
                                y="206"
                                textAnchor="middle"
                                fontSize="7"
                                fontFamily="serif"
                                fontWeight="bold"
                                fill="#FEF3C7"
                                opacity="0.85"
                            >
                                道
                            </text>

                            {/* STRAW ROPE WRAPPING PAD (WARA / 巻藁) at Striking Height (y: 126 to 172) */}
                            <g id="makiwara-straw-pad">
                                {/* Straw Pad Backdrop Cushion */}
                                <rect x="11.5" y="126" width="15" height="46" rx="4" fill="#78350F" opacity="0.6" />

                                {/* Individual Tightly Wound Straw Rope Coils */}
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((coilIdx) => (
                                    <rect
                                        key={coilIdx}
                                        x="11"
                                        y={127 + coilIdx * 5.5}
                                        width="16"
                                        height="5.2"
                                        rx="2.6"
                                        fill="url(#makiwaraStrawGrad)"
                                        stroke="#78350F"
                                        strokeWidth="0.8"
                                    />
                                ))}

                                {/* Straw Fiber Texture Detailing */}
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((coilIdx) => (
                                    <line
                                        key={`fiber-${coilIdx}`}
                                        x1="13"
                                        y1={129.5 + coilIdx * 5.5}
                                        x2="25"
                                        y2={129.5 + coilIdx * 5.5}
                                        stroke="#FEF3C7"
                                        strokeWidth="0.6"
                                        opacity="0.75"
                                        strokeDasharray="2 1.5"
                                    />
                                ))}

                                {/* Traditional Black Hemp Lashing Cords Binding Straw to Post */}
                                {/* Top Cord Binding */}
                                <rect x="10.5" y="125" width="17" height="3" rx="1.5" fill="#18181B" stroke="#000000" strokeWidth="0.8" />
                                <circle cx="26" cy="126.5" r="1.5" fill="#27272A" />

                                {/* Center Cord Binding */}
                                <rect x="10.5" y="148" width="17" height="3" rx="1.5" fill="#18181B" stroke="#000000" strokeWidth="0.8" />
                                <circle cx="26" cy="149.5" r="1.5" fill="#27272A" />

                                {/* Bottom Cord Binding */}
                                <rect x="10.5" y="171" width="17" height="3" rx="1.5" fill="#18181B" stroke="#000000" strokeWidth="0.8" />
                                <circle cx="26" cy="172.5" r="1.5" fill="#27272A" />
                                {/* Hanging Cord Knot Tails */}
                                <path d="M26 173 Q29 178 28 184" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            </g>
                        </g>
                    )}

                    {/* ========================================================
                        KUMA SENSEI CHARACTER SKELETON (DISPLACES ON TSUKI LUNGE)
                    ======================================================== */}
                    <motion.g
                        id="kuma-character"
                        key={`kuma-char-${strikeKey}`}
                        animate={
                            isStriking
                                ? {
                                      // PODEROSO TSUKI: Pull back -> Explosive Forward Thrust & Lunge -> Recoil into Zanshin
                                      x: [0, -18, 38, 28, 8],
                                      y: [0, -5, 8, 6, 0],
                                      rotate: [0, -4, 4, 2, 0],
                                      scaleX: [1, 0.94, 1.12, 1.06, 1],
                                      scaleY: [1, 1.06, 0.92, 0.96, 1],
                                  }
                                : isYoiDeepBreathing
                                ? {
                                      x: 0,
                                      y: [0, -6, 2, 0],
                                      scaleY: [1, 1.07, 0.96, 1],
                                      scaleX: [1, 1.04, 0.98, 1],
                                      rotate: 0,
                                  }
                                : isExcited
                                ? {
                                      x: 0,
                                      y: [0, -1.8, 0],
                                      rotate: 0,
                                      scaleX: 1,
                                      scaleY: 1,
                                  }
                                : isThinking
                                ? {
                                      y: [0, -4, 0],
                                      rotate: [0, 3, -2, 2, 0],
                                  }
                                : isSad
                                ? {
                                      y: [0, 9, 3, 9, 0],
                                      rotate: [0, -4, 4, -3, 0],
                                      scaleY: [1, 0.94, 1.02, 0.94, 1],
                                  }
                                : isCompleted
                                ? {
                                      y: [0, 8, 0],
                                      scaleY: [1, 0.94, 1],
                                  }
                                : {
                                      y: [0, -6, 0],
                                      scaleY: [1, 1.02, 0.99, 1],
                                      scaleX: [1, 0.99, 1.01, 1],
                                  }
                        }
                        transition={
                            isStriking
                                ? {
                                      duration: 0.95,
                                      times: [0, 0.22, 0.36, 0.65, 1],
                                      repeat: 0,
                                      ease: "easeInOut",
                                  }
                                : isYoiDeepBreathing
                                ? {
                                      duration: 1.8,
                                      times: [0, 0.32, 0.72, 1],
                                      repeat: 0,
                                      ease: "easeInOut",
                                  }
                                : isExcited
                                ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                                : {
                                      duration: isThinking ? 2.5 : isSad ? 1.8 : 3.4,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                  }
                        }
                    >
                        {/* =========================================
                            LAYER 1: EARS (Animated Independent Twitch)
                        ========================================= */}
                        {/* Left Ear */}
                        <motion.g
                            animate={
                                isStriking
                                    ? { rotate: [0, -14, 8, -10, 0] }
                                    : isSad
                                    ? { rotate: [0, 16, 10, 16, 0] }
                                    : { rotate: [0, -4, 2, 0] }
                            }
                            transition={
                                isStriking
                                    ? { duration: 0.95, repeat: 0, ease: "easeInOut" }
                                    : { repeat: Infinity, duration: isSad ? 1.8 : 2.8, ease: "easeInOut" }
                            }
                            style={{ originX: "68px", originY: "60px" }}
                        >
                            <circle cx="68" cy="58" r="28" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="4" />
                            <circle cx="68" cy="58" r="17" fill="url(#kumaEarInner)" />
                            {/* Fluff highlight */}
                            <path d="M58 52 Q68 44 76 56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" fill="none" />
                        </motion.g>

                        {/* Right Ear */}
                        <motion.g
                            animate={
                                isStriking
                                    ? { rotate: [0, 14, -8, 10, 0] }
                                    : isSad
                                    ? { rotate: [0, -16, -10, -16, 0] }
                                    : { rotate: [0, 4, -2, 0] }
                            }
                            transition={
                                isStriking
                                    ? { duration: 0.95, repeat: 0, ease: "easeInOut", delay: 0.05 }
                                    : { repeat: Infinity, duration: isSad ? 1.8 : 3.1, ease: "easeInOut", delay: isSad ? 0.1 : 0.3 }
                            }
                            style={{ originX: "172px", originY: "60px" }}
                        >
                            <circle cx="172" cy="58" r="28" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="4" />
                            <circle cx="172" cy="58" r="17" fill="url(#kumaEarInner)" />
                            <path d="M164 52 Q174 44 182 56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" fill="none" />
                        </motion.g>

                        {/* =========================================
                            LAYER 2: BODY & KARATEGI (Torso & Legs)
                        ========================================= */}
                        <g id="kuma-body">
                            {/* White Karategi Trouser Cuffs (Bota del Pantalón Blanco) */}
                            <rect x="74" y="212" width="40" height="14" rx="7" fill="url(#karategiShade)" stroke="#1E293B" strokeWidth="3" />
                            <rect x="126" y="212" width="40" height="14" rx="7" fill="url(#karategiShade)" stroke="#1E293B" strokeWidth="3" />

                            {/* Brown Bear Paws / Feet (Pies del Osito Cafés) */}
                            {/* Left Brown Foot */}
                            <rect x="76" y="220" width="36" height="28" rx="14" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3.5" />
                            <ellipse cx="94" cy="236" rx="11" ry="6" fill="#8D4930" opacity="0.6" />
                            {/* Left Foot Claws */}
                            <ellipse cx="85" cy="243" rx="2.8" ry="4.5" fill="#1A0A03" />
                            <ellipse cx="94" cy="245" rx="3.2" ry="5" fill="#1A0A03" />
                            <ellipse cx="103" cy="243" rx="2.8" ry="4.5" fill="#1A0A03" />

                            {/* Right Brown Foot */}
                            <rect x="128" y="220" width="36" height="28" rx="14" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3.5" />
                            <ellipse cx="146" cy="236" rx="11" ry="6" fill="#8D4930" opacity="0.6" />
                            {/* Right Foot Claws */}
                            <ellipse cx="137" cy="243" rx="2.8" ry="4.5" fill="#1A0A03" />
                            <ellipse cx="146" cy="245" rx="3.2" ry="5" fill="#1A0A03" />
                            <ellipse cx="155" cy="243" rx="2.8" ry="4.5" fill="#1A0A03" />

                            {/* WKF RED/BLUE SHIN & INSTEP GUARDS (ESPINILLERAS Y PROTECTORES DE EMPEINE ROJOS O AZULES) */}
                            {isWkfMode && (
                                <g id="wkf-shin-instep-guards">
                                    {/* Left Shin Guard */}
                                    <rect x="76" y="209" width="36" height="18" rx="7" fill="url(#wkfRedGearGrad)" stroke={wkfStroke} strokeWidth="2.5" />
                                    <path d="M80 213 Q94 210 108 213" stroke={wkfHighlight} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                    <rect x="75" y="215" width="38" height="4.5" rx="2" fill="url(#wkfWhiteStrapGrad)" stroke="#CBD5E1" strokeWidth="0.8" />
                                    <rect x="91" y="215.5" width="6" height="3.5" rx="1" fill={wkfAccent} opacity="0.85" />

                                    {/* Left Instep Guard (Protector de Empeine - leaves claws and pads free) */}
                                    <path
                                        d="M77 225 Q94 220 111 225 L109 238 Q94 241 79 238 Z"
                                        fill="url(#wkfRedGearGrad)"
                                        stroke={wkfStroke}
                                        strokeWidth="2.2"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M82 227 Q94 224 106 227" stroke={wkfHighlight} strokeWidth="1.2" strokeLinecap="round" fill="none" />
                                    <rect x="78" y="231" width="32" height="3.8" rx="1.5" fill="url(#wkfWhiteStrapGrad)" stroke="#CBD5E1" strokeWidth="0.8" />

                                    {/* Right Shin Guard */}
                                    <rect x="128" y="209" width="36" height="18" rx="7" fill="url(#wkfRedGearGrad)" stroke={wkfStroke} strokeWidth="2.5" />
                                    <path d="M132 213 Q146 210 160 213" stroke={wkfHighlight} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                    <rect x="127" y="215" width="38" height="4.5" rx="2" fill="url(#wkfWhiteStrapGrad)" stroke="#CBD5E1" strokeWidth="0.8" />
                                    <rect x="143" y="215.5" width="6" height="3.5" rx="1" fill={wkfAccent} opacity="0.85" />

                                    {/* Right Instep Guard (Protector de Empeine) */}
                                    <path
                                        d="M129 225 Q146 220 163 225 L161 238 Q146 241 131 238 Z"
                                        fill="url(#wkfRedGearGrad)"
                                        stroke={wkfStroke}
                                        strokeWidth="2.2"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M134 227 Q146 224 158 227" stroke={wkfHighlight} strokeWidth="1.2" strokeLinecap="round" fill="none" />
                                    <rect x="130" y="231" width="32" height="3.8" rx="1.5" fill="url(#wkfWhiteStrapGrad)" stroke="#CBD5E1" strokeWidth="0.8" />
                                </g>
                            )}

                            {/* White Karategi Tunic */}
                            <motion.g
                                id="kuma-tunic-torso"
                                animate={
                                    isYoiDeepBreathing
                                        ? {
                                              scaleY: [1, 1.07, 0.97, 1],
                                              scaleX: [1, 1.04, 0.98, 1],
                                          }
                                        : {}
                                }
                                transition={{ duration: 1.8, times: [0, 0.32, 0.72, 1], ease: "easeInOut" }}
                                style={{ originX: "120px", originY: "214px" }}
                            >
                                <path
                                    d="M60 155 Q50 200 68 220 L172 220 Q190 200 180 155 Q120 148 60 155 Z"
                                    fill="url(#karategiShade)"
                                    stroke="#1E293B"
                                    strokeWidth="3.5"
                                />

                                {/* Crossed Lapels (Traditional Right Over Left) */}
                                <path
                                    d="M82 145 L138 200 L118 208 L66 156 Z"
                                    fill="#FFFFFF"
                                    stroke="#94A3B8"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M158 145 L102 200 L122 208 L174 156 Z"
                                    fill="#F8FAFC"
                                    stroke="#CBD5E1"
                                    strokeWidth="2"
                                />

                                {/* Official Kuma Dojo Chest Patch */}
                                <g id="kuma-chest-logo">
                                    {/* Outer gold embroidery badge border */}
                                    <circle
                                        cx="95"
                                        cy="174"
                                        r="15"
                                        fill="#18181B"
                                        stroke="#F59E0B"
                                        strokeWidth="2"
                                        filter="url(#goldGlow)"
                                    />
                                    {/* Official Kuma Dojo Logo image */}
                                    <image
                                        href="/images/kuma-logo.jpg"
                                        xlinkHref="/images/kuma-logo.jpg"
                                        x="81"
                                        y="160"
                                        width="28"
                                        height="28"
                                        preserveAspectRatio="xMidYMid slice"
                                        clipPath="url(#kumaChestLogoClip)"
                                    />
                                    {/* Inner gold stitch rim */}
                                    <circle
                                        cx="95"
                                        cy="174"
                                        r="14"
                                        fill="none"
                                        stroke="#FDE68A"
                                        strokeWidth="1"
                                        opacity="0.85"
                                    />
                                </g>
                            </motion.g>

                            {/* BELT (OBI): BLACK IN TRADITIONAL, RED (AKA) OR BLUE (AO) IN WKF SPORT */}
                            {isWkfMode ? (
                                <g id="kuma-wkf-belt">
                                    <rect x="74" y="196" width="92" height="18" rx="4" fill="url(#wkfRedBeltGrad)" stroke={wkfStroke} strokeWidth="2.5" />
                                    <rect x="76" y="198" width="88" height="3" rx="1.5" fill="#FFFFFF" opacity="0.25" />

                                    {/* Realistic Folded Karate Obi Knot (Nudo Central de Cinta WKF) */}
                                    <rect
                                        x="112"
                                        y="198"
                                        width="16"
                                        height="14"
                                        rx="3"
                                        fill="url(#wkfRedBeltGrad)"
                                        stroke={wkfStroke}
                                        strokeWidth="1.8"
                                    />
                                    <line x1="120" y1="198" x2="120" y2="212" stroke={wkfKnotStroke} strokeWidth="1.5" opacity="0.75" />
                                    <path d="M114 202 Q120 200 126 202" stroke={wkfHighlight} strokeWidth="1.2" fill="none" opacity="0.8" />

                                    {/* Hanging Belt Ribbon Tails with Animated Flutter */}
                                    <motion.g
                                        animate={
                                            isStriking
                                                ? { rotate: [0, 22, -18, 12, 0] }
                                                : { rotate: [0, 6, -4, 0] }
                                        }
                                        transition={
                                            isStriking
                                                ? { duration: 0.95, repeat: 0, ease: "easeInOut" }
                                                : { repeat: Infinity, duration: 2.6, ease: "easeInOut" }
                                        }
                                        style={{ originX: "116px", originY: "205px" }}
                                    >
                                        <path d="M115 205 L110 238 L119 238 L122 205 Z" fill="url(#wkfRedBeltGrad)" stroke={wkfStroke} strokeWidth="1.5" />
                                        <rect x="110" y="231" width="9" height="7" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />
                                        <rect x="111" y="233" width="7" height="3" fill={wkfAccent} />
                                    </motion.g>

                                    <motion.g
                                        animate={
                                            isStriking
                                                ? { rotate: [0, -18, 16, -10, 0] }
                                                : { rotate: [0, -5, 5, 0] }
                                        }
                                        transition={
                                            isStriking
                                                ? { duration: 0.95, repeat: 0, ease: "easeInOut", delay: 0.1 }
                                                : { repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.1 }
                                        }
                                        style={{ originX: "124px", originY: "205px" }}
                                    >
                                        <path d="M122 205 L126 240 L135 240 L129 205 Z" fill="url(#wkfRedBeltGrad)" stroke={wkfStroke} strokeWidth="1.5" />
                                        <rect x="126" y="233" width="9" height="7" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />
                                        <rect x="127" y="235" width="7" height="3" fill={wkfAccent} />
                                    </motion.g>
                                </g>
                            ) : (
                                <g id="kuma-traditional-belt">
                                    {/* Ambient drop shadow behind belt over the white karategi */}
                                    <rect x="73" y="196" width="94" height="20" rx="5" fill="#000000" opacity={beltRank?.color === "#F8FAFC" ? "0.15" : "0.08"} />

                                    {/* Dynamic belt colored by active beltRank */}
                                    <rect x="74" y="196" width="92" height="18" rx="4"
                                        fill={beltRank ? beltRank.color : "#18181B"}
                                        stroke={beltRank ? (beltRank.color === "#F8FAFC" ? "#94A3B8" : beltRank.strokeColor) : "#000000"}
                                        strokeWidth={beltRank?.color === "#F8FAFC" ? "2.6" : "2.5"}
                                    />
                                    {/* Belt shine */}
                                    <rect x="76" y="198" width="88" height="3" rx="1.5" fill="#FFFFFF" opacity={beltRank?.color === "#F8FAFC" ? "0.4" : "0.15"} />

                                    {/* Purple-white center stripe for kyu-4 */}
                                    {beltRank?.id === "kyu-4" && (
                                        <rect x="74" y="203" width="92" height="4" fill="#FFFFFF" opacity="0.85" />
                                    )}

                                    {/* Realistic Folded Karate Obi Knot */}
                                    <rect
                                        x="112"
                                        y="198"
                                        width="16"
                                        height="14"
                                        rx="3"
                                        fill={beltRank ? (beltRank.category === "dan" ? "#27272A" : beltRank.color) : "#27272A"}
                                        stroke={beltRank ? (beltRank.color === "#F8FAFC" ? "#94A3B8" : beltRank.strokeColor) : "#000000"}
                                        strokeWidth="1.8"
                                    />
                                    <line x1="120" y1="198" x2="120" y2="212"
                                        stroke={beltRank ? (beltRank.color === "#F8FAFC" ? "#94A3B8" : beltRank.strokeColor) : "#000000"}
                                        strokeWidth="1.5" opacity="0.8"
                                    />
                                    <path d="M114 202 Q120 200 126 202"
                                        stroke={beltRank?.textColor === "#FFFFFF" || beltRank?.color === "#F8FAFC" ? "#64748B" : "#FFFFFF"}
                                        strokeWidth="1.2" fill="none" opacity="0.6"
                                    />

                                    {/* Hanging Belt Ribbon Tails with Animated Flutter */}
                                    {/* LEFT TAIL */}
                                    <motion.g
                                        animate={
                                            isStriking
                                                ? { rotate: [0, 22, -18, 12, 0] }
                                                : { rotate: [0, 6, -4, 0] }
                                        }
                                        transition={
                                            isStriking
                                                ? { duration: 0.95, repeat: 0, ease: "easeInOut" }
                                                : { repeat: Infinity, duration: 2.6, ease: "easeInOut" }
                                        }
                                        style={{ originX: "116px", originY: "205px" }}
                                    >
                                        <path d="M115 205 L109 242 L119 242 L122 205 Z"
                                            fill={beltRank?.color || "#18181B"}
                                            stroke={beltRank?.color === "#F8FAFC" ? "#94A3B8" : (beltRank?.strokeColor || "#000000")}
                                            strokeWidth="1.5"
                                        />

                                        {/* 4° Kyu: White stripe at tip of left tail */}
                                        {beltRank?.id === "kyu-4" && (
                                            <rect x="109.5" y="237" width="9" height="2.5" rx="0.5" fill="#FFFFFF"
                                                style={{ filter: "drop-shadow(0 0 1.5px rgba(255,255,255,0.9))" }}
                                            />
                                        )}

                                        {/* Brown belt white stripes on tip of left tail */}
                                        {beltRank?.hasStripe && beltRank.stripeColor === "#FFFFFF" && beltRank.category === "kyu" && beltRank.id !== "kyu-4" && (
                                            <g id="kuma-left-tail-stripes">
                                                {Array.from({ length: beltRank.stripesCount || 0 }).map((_, i) => (
                                                    <rect
                                                        key={i}
                                                        x="109.5"
                                                        y={238 - i * 3.8}
                                                        width="9"
                                                        height="2"
                                                        rx="0.5"
                                                        fill="#FFFFFF"
                                                        stroke="#E2E8F0"
                                                        strokeWidth="0.3"
                                                        style={{ filter: "drop-shadow(0 0 1.5px rgba(255,255,255,0.9))" }}
                                                    />
                                                ))}
                                            </g>
                                        )}

                                        {/* Left tail tip hem */}
                                        <rect x="109" y="240.5" width="10" height="1.5"
                                            fill={beltRank?.category === "dan" ? "#000000" : (beltRank?.color === "#F8FAFC" ? "#94A3B8" : (beltRank?.strokeColor || "#000000"))}
                                            opacity="0.8"
                                        />
                                    </motion.g>

                                    {/* RIGHT TAIL (Main tail displaying rank stripes at the tip) */}
                                    <motion.g
                                        animate={
                                            isStriking
                                                ? { rotate: [0, -18, 16, -10, 0] }
                                                : { rotate: [0, -5, 5, 0] }
                                        }
                                        transition={
                                            isStriking
                                                ? { duration: 0.95, repeat: 0, ease: "easeInOut", delay: 0.1 }
                                                : { repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.1 }
                                        }
                                        style={{ originX: "124px", originY: "205px" }}
                                    >
                                        <path d="M122 205 L125 246 L137 246 L129 205 Z"
                                            fill={beltRank?.color || "#18181B"}
                                            stroke={beltRank?.color === "#F8FAFC" ? "#94A3B8" : (beltRank?.strokeColor || "#000000")}
                                            strokeWidth="1.5"
                                        />

                                        {/* 4° Kyu: White stripe at tip of right tail */}
                                        {beltRank?.id === "kyu-4" && (
                                            <rect x="125.5" y="240" width="11" height="3" rx="0.6" fill="#FFFFFF"
                                                stroke="#E2E8F0" strokeWidth="0.3"
                                                style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.95))" }}
                                            />
                                        )}

                                        {/* Brown belt white stripes at tip of right tail (3, 2, 1 lines) */}
                                        {beltRank?.hasStripe && beltRank.stripeColor === "#FFFFFF" && beltRank.category === "kyu" && beltRank.id !== "kyu-4" && (
                                            <g id="kuma-right-tail-stripes">
                                                {Array.from({ length: beltRank.stripesCount || 0 }).map((_, i) => (
                                                    <rect
                                                        key={i}
                                                        x="125.5"
                                                        y={241.5 - i * 4}
                                                        width="11"
                                                        height="2.2"
                                                        rx="0.5"
                                                        fill="#FFFFFF"
                                                        stroke="#E2E8F0"
                                                        strokeWidth="0.3"
                                                        style={{ filter: "drop-shadow(0 0 1.5px rgba(255,255,255,0.95))" }}
                                                    />
                                                ))}
                                            </g>
                                        )}

                                        {/* Dan rank golden stripes at tip of right tail (1 to 10 Dan) */}
                                        {beltRank?.category === "dan" && beltRank.stripesCount && (
                                            <g id="kuma-dan-tail-stripes">
                                                {Array.from({ length: beltRank.stripesCount }).map((_, i) => {
                                                    const isHighDan = beltRank.stripesCount! > 5;
                                                    const spacing = isHighDan ? 2.4 : 3.5;
                                                    const h = isHighDan ? 1.6 : 2.2;
                                                    const yPos = 242 - i * spacing;
                                                    return (
                                                        <rect
                                                            key={i}
                                                            x="125.5"
                                                            y={yPos}
                                                            width="11"
                                                            height={h}
                                                            rx="0.5"
                                                            fill="#FACC15"
                                                            stroke="#B45309"
                                                            strokeWidth="0.3"
                                                            style={{ filter: "drop-shadow(0 0 1.5px rgba(250,204,21,0.95))" }}
                                                        />
                                                    );
                                                })}
                                            </g>
                                        )}

                                        {/* Right tail tip hem */}
                                        <rect x="125" y="244.5" width="12" height="1.5"
                                            fill={beltRank?.category === "dan" ? "#000000" : (beltRank?.strokeColor || "#000000")}
                                            opacity="0.8"
                                        />
                                    </motion.g>
                                </g>
                            )}
                        </g>

                        {/* =========================================
                            LAYER 3: HEAD & CHARISMATIC BEAR FACE
                        ========================================= */}
                        <motion.g
                            id="kuma-head"
                            animate={
                                isStriking
                                    ? { y: [0, -6, 0], rotate: [0, 3, -3, 0] }
                                    : isYoiDeepBreathing
                                    ? { y: [0, -4, 1.5, 0] }
                                    : isThinking
                                    ? { y: [0, -3, 0], rotate: [0, 4, 0] }
                                    : isSad
                                    ? { y: [0, 7, 2, 7, 0], rotate: [0, -5, 5, -3, 0] }
                                    : { y: [0, -2, 0] }
                            }
                            transition={
                                isStriking
                                    ? { duration: 0.95, repeat: 0, ease: "easeInOut" }
                                    : isYoiDeepBreathing
                                    ? { duration: 1.8, times: [0, 0.32, 0.72, 1], repeat: 0, ease: "easeInOut" }
                                    : { repeat: Infinity, duration: isSad ? 1.8 : 3.2, ease: "easeInOut" }
                            }
                        >
                            {/* Main Head Base */}
                            <ellipse cx="120" cy="108" rx="66" ry="60" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="4.5" />

                            {/* Fluffy Cheeks */}
                            <path d="M56 108 Q44 116 56 126 Q42 134 62 142 Q78 138 72 120 Z" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="2.5" />
                            <path d="M184 108 Q196 116 184 126 Q198 134 178 142 Q162 138 168 120 Z" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="2.5" />

                            {/* Forehead Fur Fluff Detail */}
                            <path d="M112 56 Q120 46 128 56 Q122 50 112 56 Z" fill="#451A03" opacity="0.4" />

                            {/* Snout Area */}
                            <ellipse cx="120" cy="128" rx="34" ry="26" fill="url(#kumaSnout)" stroke="#7A4B2C" strokeWidth="2" />

                            {/* Nose */}
                            <path
                                d="M108 116 C108 111, 132 111, 132 116 C132 126, 123 131, 120 131 C117 131, 108 126, 108 116 Z"
                                fill="#18181B"
                            />
                            <ellipse cx="116" cy="117" rx="4.5" ry="2.5" fill="#FFFFFF" opacity="0.6" />

                            {/* DYNAMIC MOUTH (DESOPILANTE JAW-DROP ANIME EXTREME EXPRESSIVITY) */}
                            {isStriking ? (
                                // DESOPILANTE CARTOON JAW DROP ROAR (Mandíbula Caída Abierta de Par en Par)
                                <g id="kuma-jaw-drop-roar">
                                    {/* Cavernous Throat Cavity */}
                                    <path
                                        d="M96 128 Q120 118 144 128 L142 174 Q120 186 98 174 Z"
                                        fill="#450A0A"
                                        stroke="#26150D"
                                        strokeWidth="3.5"
                                    />
                                    {/* Throat Deep Glow */}
                                    <ellipse cx="120" cy="152" rx="15" ry="18" fill="#7F1D1D" opacity="0.65" />

                                    {/* Top Sharp Cartoon Karate Teeth */}
                                    <path
                                        d="M98 128 L104 136 L110 128 L116 136 L124 128 L130 136 L136 128 L142 136 L144 128 Z"
                                        fill="#FFFFFF"
                                        stroke="#1E293B"
                                        strokeWidth="1.2"
                                    />

                                    {/* Bottom Sharp Cartoon Teeth */}
                                    <path
                                        d="M100 173 L106 164 L112 173 L120 164 L126 173 L132 164 L138 173 L140 173 Z"
                                        fill="#FFFFFF"
                                        stroke="#1E293B"
                                        strokeWidth="1.2"
                                    />

                                    {/* Vibrating Anime Uvula (Campanilla Cómic) */}
                                    <motion.ellipse
                                        cx="120"
                                        cy="138"
                                        rx="3.5"
                                        ry="5"
                                        fill="#EF4444"
                                        animate={{ y: [0, 2, -2, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.16 }}
                                    />

                                    {/* Animated Bouncing Energetic Tongue */}
                                    <motion.ellipse
                                        cx="120"
                                        cy="165"
                                        rx="12"
                                        ry="6.5"
                                        fill="#F87171"
                                        stroke="#DC2626"
                                        strokeWidth="1"
                                        animate={{ scaleY: [1, 1.3, 0.9, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.22 }}
                                    />
                                </g>
                            ) : isYoiDeepBreathing ? (
                                // ========================================================
                                // YOI DEEP BREATH EXHALATION MOUTH (Soplo de Aire al Exhalar)
                                // Small focused breath opening releasing the martial breath
                                // ========================================================
                                <g id="kuma-yoi-breath-mouth">
                                    <ellipse cx="120" cy="137" rx="5" ry="3.8" fill="#5A1212" stroke="#26150D" strokeWidth="2.8" />
                                    <ellipse cx="120" cy="136" rx="3.5" ry="1.8" fill="#18181B" opacity="0.6" />
                                    <path d="M112 137 Q115 137 116 137" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M124 137 Q125 137 128 137" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                                </g>
                            ) : isExcited ? (
                                // ========================================================
                                // YOI POSITION MARTIAL EXPRESSION (Zanshin - Composed & Triumphant)
                                // Confident martial smile with disciplined breath in Yoi stance
                                // ========================================================
                                <g id="kuma-yoi-mouth">
                                    <path
                                        d="M104 135 Q120 147 136 135 Q120 141 104 135 Z"
                                        fill="#7F1D1D"
                                        stroke="#26150D"
                                        strokeWidth="3.2"
                                        strokeLinejoin="round"
                                    />
                                    {/* White Smile Glint */}
                                    <path d="M107 136 Q120 143 133 136" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                    {/* Determined Corner Martial Dimples */}
                                    <circle cx="103" cy="135" r="2" fill="#26150D" />
                                    <circle cx="137" cy="135" r="2" fill="#26150D" />
                                </g>
                            ) : isSad ? (
                                // Dramatic Anime Wavy Pout (Pucca / Garu style)
                                <g id="kuma-sad-mouth">
                                    <path d="M104 144 Q112 137 120 144 Q128 151 136 144" stroke="#26150D" strokeWidth="4" strokeLinecap="round" fill="none" />
                                    <ellipse cx="120" cy="147" rx="5" ry="1.5" fill="#26150D" opacity="0.25" />
                                </g>
                            ) : isThinking ? (
                                // Puzzled / Concentrated Mouth
                                <g id="kuma-thinking-mouth">
                                    <path d="M112 139 Q120 134 128 139" stroke="#26150D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                    <circle cx="110" cy="139" r="1.5" fill="#26150D" />
                                </g>
                            ) : (
                                // Confident Garu Martial Smirk
                                <g id="kuma-idle-mouth">
                                    <path d="M106 134 Q120 144 134 135" stroke="#26150D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                                    <path d="M133 133 Q136 135 135 138" stroke="#26150D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                </g>
                            )}

                            {/* DYNAMIC EYES & MARTIAL EYEBROWS (GARU & PUCCA HIGH EXPRESSIVITY) */}
                            {isBlinking ? (
                                // Blinking Eyelid Lines
                                <g id="kuma-blink-eyes">
                                    <path d="M86 102 Q98 109 110 102" stroke="#18181B" strokeWidth="5" strokeLinecap="round" fill="none" />
                                    <path d="M130 102 Q142 109 154 102" stroke="#18181B" strokeWidth="5" strokeLinecap="round" fill="none" />
                                </g>
                            ) : isExcited ? (
                                // TSUKI ATTACK EYES: Fierce Anime Focus (NO STARS, clean crisp action glints!)
                                <g id="kuma-tsuki-eyes">
                                    {/* Large Intense Eye Sclera */}
                                    <ellipse cx="98" cy="102" rx="12" ry="11" fill="#FFFFFF" stroke="#18181B" strokeWidth="3.5" />
                                    <ellipse cx="142" cy="102" rx="12" ry="11" fill="#FFFFFF" stroke="#18181B" strokeWidth="3.5" />
                                    {/* Intense Focused Pupils */}
                                    <circle cx="101" cy="102" r="7.5" fill="#18181B" />
                                    <circle cx="145" cy="102" r="7.5" fill="#18181B" />
                                    {/* Dual Crisp Glossy Catchlights (Stars completely removed per user request) */}
                                    <circle cx="98" cy="98" r="3.2" fill="#FFFFFF" />
                                    <circle cx="104" cy="104" r="1.6" fill="#FFFFFF" />
                                    <circle cx="142" cy="98" r="3.2" fill="#FFFFFF" />
                                    <circle cx="148" cy="104" r="1.6" fill="#FFFFFF" />
                                    {/* Fiercely Slanted Martial Action Eyebrows */}
                                    <path d="M80 84 L110 97" stroke="#26150D" strokeWidth="6.5" strokeLinecap="round" />
                                    <path d="M160 84 L130 97" stroke="#26150D" strokeWidth="6.5" strokeLinecap="round" />
                                    {/* Vibrating Anime Intensity Mark on Forehead */}
                                    <motion.g
                                        animate={{ scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.35 }}
                                        style={{ originX: "120px", originY: "76px" }}
                                    >
                                        <path d="M116 76 L124 76 M120 72 L120 80" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" />
                                    </motion.g>
                                </g>
                            ) : isThinking ? (
                                // Curious Inquisitive Garu Expression
                                <g id="kuma-thinking-eyes">
                                    <ellipse cx="98" cy="99" rx="9" ry="10" fill="#FFFFFF" stroke="#18181B" strokeWidth="3" />
                                    <ellipse cx="142" cy="99" rx="9" ry="10" fill="#FFFFFF" stroke="#18181B" strokeWidth="3" />
                                    <circle cx="101" cy="95" r="6" fill="#18181B" />
                                    <circle cx="145" cy="95" r="6" fill="#18181B" />
                                    <circle cx="103" cy="93" r="2.5" fill="#FFFFFF" />
                                    <circle cx="147" cy="93" r="2.5" fill="#FFFFFF" />
                                    {/* Asymmetrical Eyebrows: One raised high, one low (Curious Karateka) */}
                                    <path d="M84 81 Q98 75 110 85" stroke="#26150D" strokeWidth="5" strokeLinecap="round" fill="none" />
                                    <line x1="130" y1="94" x2="154" y2="92" stroke="#26150D" strokeWidth="4.5" strokeLinecap="round" />
                                </g>
                            ) : isSad ? (
                                // Dramatic Anime Disappointment (Pucca / Garu style)
                                <g id="kuma-sad-eyes">
                                    <ellipse cx="98" cy="103" rx="9.5" ry="10" fill="#FFFFFF" stroke="#18181B" strokeWidth="3" />
                                    <ellipse cx="142" cy="103" rx="9.5" ry="10" fill="#FFFFFF" stroke="#18181B" strokeWidth="3" />
                                    <circle cx="98" cy="105" r="6" fill="#18181B" />
                                    <circle cx="142" cy="105" r="6" fill="#18181B" />
                                    {/* Large Anime Glossy Teary Shine */}
                                    <circle cx="95" cy="101" r="3.5" fill="#93C5FD" opacity="0.9" />
                                    <circle cx="139" cy="101" r="3.5" fill="#93C5FD" opacity="0.9" />
                                    <circle cx="100" cy="107" r="2" fill="#FFFFFF" />
                                    <circle cx="144" cy="107" r="2" fill="#FFFFFF" />
                                    {/* Slanted Sad Eyebrows */}
                                    <line x1="88" y1="92" x2="110" y2="83" stroke="#26150D" strokeWidth="5" strokeLinecap="round" />
                                    <line x1="130" y1="83" x2="152" y2="92" stroke="#26150D" strokeWidth="5" strokeLinecap="round" />
                                    {/* Cascading Cartoon Tears */}
                                    <motion.path
                                        animate={{ y: [0, 14, 28], opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: isCrying ? 0.7 : 1.2, ease: "easeIn" }}
                                        d="M148 106 C148 102, 155 102, 155 106 C155 111, 152 115, 148 116 C144 115, 141 111, 148 106 Z"
                                        fill="#38BDF8"
                                    />
                                    <motion.path
                                        animate={{ y: [0, 14, 28], opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: isCrying ? 0.7 : 1.2, delay: 0.35, ease: "easeIn" }}
                                        d="M92 106 C92 102, 85 102, 85 106 C85 111, 88 115, 92 116 C96 115, 99 111, 92 106 Z"
                                        fill="#38BDF8"
                                    />
                                    {isCrying && (
                                        <>
                                            <motion.path
                                                animate={{ y: [0, 20, 36], opacity: [0, 0.9, 0], scale: [0.8, 1.3, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 0.8, delay: 0.15, ease: "easeIn" }}
                                                d="M144 112 C144 108, 152 108, 152 112 C152 118, 149 122, 144 123 C139 122, 137 118, 144 112 Z"
                                                fill="#60A5FA"
                                            />
                                            <motion.path
                                                animate={{ y: [0, 20, 36], opacity: [0, 0.9, 0], scale: [0.8, 1.3, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 0.8, delay: 0.5, ease: "easeIn" }}
                                                d="M96 112 C96 108, 88 108, 88 112 C88 118, 91 122, 96 123 C101 122, 103 118, 96 112 Z"
                                                fill="#60A5FA"
                                            />
                                            {/* River of Tears under eyes */}
                                            <motion.path
                                                d="M90 110 Q94 125 93 140"
                                                stroke="#93C5FD"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                fill="none"
                                                opacity="0.8"
                                                animate={{ opacity: [0.4, 0.9, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                            />
                                            <motion.path
                                                d="M150 110 Q146 125 147 140"
                                                stroke="#93C5FD"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                fill="none"
                                                opacity="0.8"
                                                animate={{ opacity: [0.4, 0.9, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                            />
                                        </>
                                    )}
                                    {/* Anime Blue Sweat Drop on Forehead */}
                                    <motion.path
                                        animate={{ y: [0, 6, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                        d="M168 76 C168 70, 175 70, 175 76 C175 80, 172 83, 168 84 C164 83, 161 80, 168 76 Z"
                                        fill="#38BDF8"
                                        stroke="#0284C7"
                                        strokeWidth="1"
                                    />
                                </g>
                            ) : (
                                // Charismatic Confident Garu Martial Eyes
                                <g id="kuma-idle-eyes">
                                    <ellipse cx="98" cy="101" rx="10.5" ry="11.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="3.5" />
                                    <ellipse cx="142" cy="101" rx="10.5" ry="11.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="3.5" />
                                    {/* Espresso Sharp Pupils */}
                                    <circle cx="98" cy="101" r="7" fill="#18181B" />
                                    <circle cx="142" cy="101" r="7" fill="#18181B" />
                                    {/* Dual Crisp Catchlights */}
                                    <circle cx="95" cy="98" r="3.2" fill="#FFFFFF" />
                                    <circle cx="139" cy="98" r="3.2" fill="#FFFFFF" />
                                    <circle cx="101" cy="104" r="1.6" fill="#FFFFFF" />
                                    <circle cx="145" cy="104" r="1.6" fill="#FFFFFF" />
                                    {/* Bold Confident Martial Eyebrows */}
                                    <path d="M84 87 Q98 81 110 88" stroke="#26150D" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                                    <path d="M130 88 Q142 81 156 87" stroke="#26150D" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                                </g>
                            )}

                            {/* ========================================================
                                HUMITO DE RESPIRACIÓN MARCIAL EN YOI (Breath Smoke Vapor)
                                Anime breath steam that puffs out upon deep exhalation in Yoi!
                            ======================================================== */}
                            {isYoiDeepBreathing && (
                                <motion.g
                                    id="kuma-yoi-breath-smoke"
                                    key={`smoke-${strikeKey}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ originX: "120px", originY: "137px" }}
                                >
                                    {/* Cloudlet 1: Main Billowy Vapor Cloud drifting forward-right */}
                                    <motion.g
                                        initial={{ scale: 0.1, opacity: 0, x: 0, y: 0 }}
                                        animate={{
                                            scale: [0.1, 0.4, 1.3, 1.7, 2.2],
                                            opacity: [0, 0.95, 0.85, 0.45, 0],
                                            x: [0, 3, 9, 18, 28],
                                            y: [0, 1, 3, 7, 11],
                                        }}
                                        transition={{
                                            duration: 1.3,
                                            delay: 0.35,
                                            times: [0, 0.15, 0.42, 0.72, 1],
                                            ease: "easeOut",
                                        }}
                                        style={{ originX: "120px", originY: "137px" }}
                                    >
                                        <circle cx="120" cy="137" r="6" fill="#FFFFFF" opacity="0.9" />
                                        <circle cx="126" cy="136" r="4.5" fill="#F8FAFC" opacity="0.85" />
                                        <circle cx="124" cy="141" r="5" fill="#F1F5F9" opacity="0.8" />
                                        <circle cx="118" cy="140" r="4" fill="#E2E8F0" opacity="0.75" />
                                    </motion.g>

                                    {/* Cloudlet 2: Curving Wispy Smoke Stream */}
                                    <motion.g
                                        initial={{ scale: 0.15, opacity: 0, x: 0, y: 0 }}
                                        animate={{
                                            scale: [0.15, 0.55, 1.2, 1.6, 2.0],
                                            opacity: [0, 0.9, 0.8, 0.35, 0],
                                            x: [0, 2, 6, 14, 22],
                                            y: [0, -1, -3, -5, -6],
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            delay: 0.42,
                                            times: [0, 0.18, 0.45, 0.75, 1],
                                            ease: "easeOut",
                                        }}
                                        style={{ originX: "120px", originY: "137px" }}
                                    >
                                        <circle cx="121" cy="135" r="4.5" fill="#FFFFFF" opacity="0.85" />
                                        <circle cx="127" cy="133" r="3.5" fill="#F8FAFC" opacity="0.8" />
                                        <path
                                            d="M120 137 Q128 133 134 136 T142 133"
                                            stroke="#FFFFFF"
                                            strokeWidth="2.8"
                                            strokeLinecap="round"
                                            fill="none"
                                            opacity="0.85"
                                        />
                                    </motion.g>

                                    {/* Cloudlet 3: Soft subtle drifting curl to the left */}
                                    <motion.g
                                        initial={{ scale: 0.1, opacity: 0, x: 0, y: 0 }}
                                        animate={{
                                            scale: [0.1, 0.45, 1.0, 1.4],
                                            opacity: [0, 0.85, 0.55, 0],
                                            x: [0, -2, -7, -13],
                                            y: [0, 2, 5, 9],
                                        }}
                                        transition={{
                                            duration: 1.1,
                                            delay: 0.38,
                                            times: [0, 0.18, 0.5, 1],
                                            ease: "easeOut",
                                        }}
                                        style={{ originX: "120px", originY: "137px" }}
                                    >
                                        <circle cx="118" cy="139" r="4" fill="#FFFFFF" opacity="0.85" />
                                        <circle cx="114" cy="142" r="3" fill="#F1F5F9" opacity="0.75" />
                                    </motion.g>
                                </motion.g>
                            )}
                        </motion.g>

                        {/* =========================================
                            LAYER 4: ARMS & PAWS (Dynamic Gestures)
                        ========================================= */}
                        {isStriking ? (
                            // ========================================================
                            // PODEROSO TSUKI (Karate Thrust Punch with Speedlines & Impact)
                            // Garu & Pucca Action Style with Extended Fist & Shockwave
                            // ========================================================
                            <g id="kuma-tsuki-punch-action">
                                {/* SPEEDLINES BEHIND THE TSUKI THRUST (Plays once during punch) */}
                                <motion.g
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0], x: [-10, 14, 24] }}
                                    transition={{ duration: 0.7, times: [0, 0.35, 0.7], repeat: 0 }}
                                >
                                    <line x1="110" y1="135" x2="195" y2="135" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 6" />
                                    <line x1="90" y1="152" x2="210" y2="152" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="14 6" />
                                    <line x1="120" y1="168" x2="200" y2="168" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 6" />
                                </motion.g>

                                {/* LEFT ARM: HIKITE (Fist chambered tightly at left hip in true karate stance) */}
                                <g id="hikite-arm">
                                    <path d="M64 162 Q46 178 54 200" stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" fill="none" />
                                    <path d="M64 162 Q46 178 54 200" stroke="#94A3B8" strokeWidth="2" fill="none" />
                                    {/* Clenched Chambered Fist with Knuckles Up */}
                                    {isWkfMode ? (
                                        <g id="wkf-hikite-glove">
                                            <circle cx="54" cy="202" r="16" fill="url(#wkfRedGearGrad)" stroke={wkfStroke} strokeWidth="3.2" />
                                            <path d="M44 196 Q54 190 64 196" stroke={wkfHighlight} strokeWidth="2" strokeLinecap="round" fill="none" />
                                            <rect x="44" y="208" width="20" height="6" rx="2" fill="url(#wkfWhiteStrapGrad)" stroke="#CBD5E1" strokeWidth="1" />
                                        </g>
                                    ) : (
                                        <g id="trad-hikite-fist">
                                            <circle cx="54" cy="202" r="16" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3.5" />
                                            <rect x="46" y="196" width="16" height="12" rx="4" fill="#5C2D1C" />
                                            <circle cx="54" cy="202" r="6" fill="#F5D0A9" />
                                        </g>
                                    )}
                                </g>

                                {/* RIGHT ARM: EXPLOSIVE FORWARD TSUKI PUNCH */}
                                <motion.g
                                    key={`arm-${strikeKey}`}
                                    animate={{
                                        x: [0, -12, 26, 22, 10],
                                        y: [0, -2, 2, 0, 0],
                                    }}
                                    transition={{
                                        duration: 0.95,
                                        times: [0, 0.22, 0.36, 0.65, 1],
                                        repeat: 0,
                                        ease: "easeInOut",
                                    }}
                                >
                                    {/* Extended Karategi Sleeve stretching straight forward */}
                                    <path
                                        d="M165 145 L228 136 L231 168 L165 174 Z"
                                        fill="url(#karategiShade)"
                                        stroke="#1E293B"
                                        strokeWidth="3.5"
                                    />
                                    <line x1="180" y1="152" x2="224" y2="148" stroke="#CBD5E1" strokeWidth="2.5" />

                                    {/* Massive Clenched Tsuki Knuckles */}
                                    <g id="tsuki-fist">
                                        {isWkfMode ? (
                                            <g id="wkf-tsuki-glove">
                                                <circle cx="238" cy="152" r="17.5" fill="url(#wkfRedGearGrad)" stroke={wkfStroke} strokeWidth="3.5" />
                                                <path d="M234 138 Q248 136 254 146 Q260 156 252 165" stroke={wkfStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
                                                <path d="M231 141 Q244 139 250 148" stroke={wkfHighlight} strokeWidth="2" fill="none" strokeLinecap="round" />
                                                <ellipse cx="232" cy="160" rx="7" ry="5" fill={wkfAccent} stroke={wkfStroke} strokeWidth="2" />
                                                <rect x="221" y="141" width="7" height="23" rx="2" fill="url(#wkfWhiteStrapGrad)" stroke="#CBD5E1" strokeWidth="1" />
                                                <rect x="223" y="149" width="3" height="7" rx="1" fill={wkfAccent} />
                                            </g>
                                        ) : (
                                            <g id="trad-tsuki-fist">
                                                <circle cx="238" cy="152" r="17" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3.5" />
                                                <path d="M232 139 Q244 136 252 144 Q258 153 250 162" stroke="#26150D" strokeWidth="3" fill="none" strokeLinecap="round" />
                                                <ellipse cx="233" cy="158" rx="6.5" ry="5" fill="#6B331F" stroke="#26150D" strokeWidth="2" />
                                            </g>
                                        )}
                                    </g>

                                    {/* IMPACT KI FLASH STAR (At Knuckle tip, only during strike) */}
                                    <motion.ellipse
                                        cx="238"
                                        cy="152"
                                        rx="14"
                                        ry="30"
                                        fill="none"
                                        stroke="#FDE047"
                                        strokeWidth="3"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
                                        transition={{ duration: 0.6, delay: 0.26, times: [0, 0.5, 1], repeat: 0 }}
                                    />
                                    <motion.ellipse
                                        cx="248"
                                        cy="152"
                                        rx="8"
                                        ry="20"
                                        fill="none"
                                        stroke="#FFFFFF"
                                        strokeWidth="2.5"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0, 1.3, 0.9], opacity: [0, 0.9, 0] }}
                                        transition={{ duration: 0.6, delay: 0.28, times: [0, 0.5, 1], repeat: 0 }}
                                    />
                                    <motion.polygon
                                        points="256,138 260,148 272,152 260,156 256,166 252,156 240,152 252,148"
                                        fill="#FEF08A"
                                        stroke="#F59E0B"
                                        strokeWidth="2"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0, 1.5, 0], rotate: [0, 45, 90] }}
                                        transition={{ duration: 0.5, delay: 0.26, times: [0, 0.4, 1], repeat: 0 }}
                                        style={{ originX: "256px", originY: "152px" }}
                                    />
                                </motion.g>
                            </g>
                        ) : isExcited ? (
                            // ========================================================
                            // POSICIÓN YOI DE KARATE (用意 - Formal Karate Ready Stance)
                            // Both fists settled symmetrically in front of belt knot
                            // Grounded, composed, textbook Shotokan Hachiji-dachi Yoi
                            // ========================================================
                            <motion.g
                                id="kuma-yoi-karate-stance"
                                initial={{ opacity: 0.7, scale: 0.95 }}
                                animate={
                                    isYoiDeepBreathing
                                        ? {
                                              scaleY: [0.95, 1.06, 0.98, 1],
                                              y: [2, -4, 1, 0],
                                          }
                                        : { opacity: 1, scale: 1, y: [0, -1.5, 0] }
                                }
                                transition={
                                    isYoiDeepBreathing
                                        ? { duration: 1.8, times: [0, 0.32, 0.72, 1], ease: "easeInOut" }
                                        : {
                                              scale: { type: "spring", stiffness: 360, damping: 24 },
                                              y: { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
                                          }
                                }
                                style={{ originX: "120px", originY: "204px" }}
                            >
                                {/* LEFT ARM - YOI POSITION */}
                                <g id="yoi-left-arm">
                                    {/* Karategi Left Sleeve flowing down towards belt */}
                                    <path
                                        d="M64 156 Q52 178 78 200 L98 204 L96 190 Q72 174 74 156 Z"
                                        fill="url(#karategiShade)"
                                        stroke="#1E293B"
                                        strokeWidth="3.2"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M68 162 Q60 180 84 198" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeLinecap="round" />
                                    <ellipse cx="94" cy="198" rx="8" ry="11" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />

                                    {/* Closed Karate Fist (Left Seiken at Belt level) */}
                                    {isWkfMode ? (
                                        <g id="wkf-yoi-left-glove">
                                            <circle cx="98" cy="204" r="15" fill="url(#wkfRedGearGrad)" stroke={wkfStroke} strokeWidth="3.2" />
                                            <path d="M91 198 Q98 193 105 198" stroke={wkfHighlight} strokeWidth="2" strokeLinecap="round" fill="none" />
                                            <path d="M91 204 Q98 200 105 204" stroke={wkfStroke} strokeWidth="2" strokeLinecap="round" fill="none" />
                                            <rect x="88" y="191" width="13" height="6" rx="2" fill="url(#wkfWhiteStrapGrad)" stroke="#CBD5E1" strokeWidth="1" />
                                        </g>
                                    ) : (
                                        <g id="trad-yoi-left-fist">
                                            <circle cx="98" cy="204" r="14.5" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3.2" />
                                            <path d="M92 195 Q102 193 108 200" stroke="#26150D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                            <path d="M92 201 Q102 199 108 206" stroke="#26150D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                                            <ellipse cx="94" cy="207" rx="5" ry="4" fill="#6B331F" stroke="#26150D" strokeWidth="1.8" />
                                        </g>
                                    )}
                                </g>

                                {/* RIGHT ARM - YOI POSITION */}
                                <g id="yoi-right-arm">
                                    {/* Karategi Right Sleeve flowing down towards belt */}
                                    <path
                                        d="M176 156 Q188 178 162 200 L142 204 L144 190 Q168 174 166 156 Z"
                                        fill="url(#karategiShade)"
                                        stroke="#1E293B"
                                        strokeWidth="3.2"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M172 162 Q180 180 156 198" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeLinecap="round" />
                                    <ellipse cx="146" cy="198" rx="8" ry="11" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />

                                    {/* Closed Karate Fist (Right Seiken at Belt level) */}
                                    {isWkfMode ? (
                                        <g id="wkf-yoi-right-glove">
                                            <circle cx="142" cy="204" r="15" fill="url(#wkfRedGearGrad)" stroke={wkfStroke} strokeWidth="3.2" />
                                            <path d="M135 198 Q142 193 149 198" stroke={wkfHighlight} strokeWidth="2" strokeLinecap="round" fill="none" />
                                            <path d="M135 204 Q142 200 149 204" stroke={wkfStroke} strokeWidth="2" strokeLinecap="round" fill="none" />
                                            <rect x="139" y="191" width="13" height="6" rx="2" fill="url(#wkfWhiteStrapGrad)" stroke="#CBD5E1" strokeWidth="1" />
                                        </g>
                                    ) : (
                                        <g id="trad-yoi-right-fist">
                                            <circle cx="142" cy="204" r="14.5" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3.2" />
                                            <path d="M148 195 Q138 193 132 200" stroke="#26150D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                            <path d="M148 201 Q138 199 132 206" stroke="#26150D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                                            <ellipse cx="146" cy="207" rx="5" ry="4" fill="#6B331F" stroke="#26150D" strokeWidth="1.8" />
                                        </g>
                                    )}
                                </g>
                            </motion.g>
                        ) : isThinking ? (
                            // One Paw Tapping Chin Thoughtfully
                            <g id="kuma-thinking-arms">
                                {/* Left Arm Resting at Waist */}
                                <path d="M62 165 Q48 185 70 195" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" fill="none" />
                                <circle cx="70" cy="195" r="14" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3" />

                                {/* Right Arm Reaching to Chin with Tapping Motion */}
                                <motion.g
                                    animate={{ rotate: [0, 4, -3, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                                    style={{ originX: "175px", originY: "165px" }}
                                >
                                    <path d="M178 165 Q190 145 145 138" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" fill="none" />
                                    <circle cx="145" cy="138" r="15" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3" />
                                    <ellipse cx="143" cy="137" rx="6" ry="5" fill="#F5D0A9" />
                                </motion.g>
                            </g>
                        ) : isSad ? (
                            // Sad Arms: One arm reaching to wipe tear, one arm drooping limply
                            <g id="kuma-sad-arms">
                                {/* Left Arm Drooping Limply */}
                                <motion.g
                                    animate={{ rotate: [0, 4, -2, 0] }}
                                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                    style={{ originX: "65px", originY: "160px" }}
                                >
                                    <path d="M62 165 Q44 195 64 205" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" fill="none" />
                                    <path d="M62 165 Q44 195 64 205" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                                    <circle cx="64" cy="205" r="14" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3" />
                                </motion.g>

                                {/* Right Arm Reaching to Wipe a Tear */}
                                <motion.g
                                    animate={{ rotate: [0, -8, 2, 0], y: [0, -3, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                    style={{ originX: "175px", originY: "165px" }}
                                >
                                    <path d="M176 165 Q185 135 150 115" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" fill="none" />
                                    <path d="M176 165 Q185 135 150 115" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                                    <circle cx="148" cy="113" r="14" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3" />
                                    <ellipse cx="146" cy="113" rx="6" ry="5" fill="#F5D0A9" />
                                </motion.g>
                            </g>
                        ) : isCompleted ? (
                            // Formal Martial Arts Fist-and-Palm Bow (Rei)
                            <g id="kuma-rei-arms">
                                {/* Left Palm Over Right Fist */}
                                <path d="M60 160 Q85 185 110 185" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" fill="none" />
                                <path d="M180 160 Q155 185 130 185" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" fill="none" />
                                <circle cx="114" cy="185" r="14" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3" />
                                <rect x="118" y="174" width="16" height="22" rx="7" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3" />
                            </g>
                        ) : (
                            // Default Martial Guard (Yoi / Kamae Stance) with Subtle Weight Shift
                            <g id="kuma-idle-arms">
                                {/* Left Arm at Waist */}
                                <motion.g
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
                                >
                                    <path d="M64 162 Q45 180 68 195" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" fill="none" />
                                    <path d="M64 162 Q45 180 68 195" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                                    {isWkfMode ? (
                                        <g id="wkf-idle-left-glove">
                                            <circle cx="68" cy="195" r="14.5" fill="url(#wkfRedGearGrad)" stroke={wkfStroke} strokeWidth="3" />
                                            <path d="M62 190 Q68 186 74 190" stroke={wkfHighlight} strokeWidth="1.8" strokeLinecap="round" fill="none" />
                                            <rect x="58" y="184" width="14" height="5" rx="1.5" fill="url(#wkfWhiteStrapGrad)" stroke="#CBD5E1" strokeWidth="0.8" />
                                        </g>
                                    ) : (
                                        <g id="trad-idle-left">
                                            <circle cx="68" cy="195" r="14" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3" />
                                            <ellipse cx="68" cy="195" rx="6" ry="5" fill="#F5D0A9" />
                                        </g>
                                    )}
                                </motion.g>

                                {/* Right Arm Raised in Gentle Ready Guard */}
                                <motion.g
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut", delay: 0.2 }}
                                >
                                    <path d="M176 162 Q195 180 172 195" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" fill="none" />
                                    <path d="M176 162 Q195 180 172 195" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                                    {isWkfMode ? (
                                        <g id="wkf-idle-right-glove">
                                            <circle cx="172" cy="195" r="14.5" fill="url(#wkfRedGearGrad)" stroke={wkfStroke} strokeWidth="3" />
                                            <path d="M166 190 Q172 186 178 190" stroke={wkfHighlight} strokeWidth="1.8" strokeLinecap="round" fill="none" />
                                            <rect x="168" y="184" width="14" height="5" rx="1.5" fill="url(#wkfWhiteStrapGrad)" stroke="#CBD5E1" strokeWidth="0.8" />
                                        </g>
                                    ) : (
                                        <g id="trad-idle-right">
                                            <circle cx="172" cy="195" r="14" fill="url(#kumaFurRadial)" stroke="#381B10" strokeWidth="3" />
                                            <ellipse cx="172" cy="195" rx="6" ry="5" fill="#F5D0A9" />
                                        </g>
                                    )}
                                </motion.g>
                            </g>
                        )}
                    </motion.g>

                    {/* ========================================================
                        CARTOON DASH DUST SMOKE POOF (Humareda Cómic en el Pie Trasero)
                        Puffs backwards at the tatami floor coordinate when Kuma launches forward
                    ======================================================== */}
                    {isStriking && (
                        <motion.g
                            key={`dash-dust-${strikeKey}`}
                            initial={{ opacity: 0, scale: 0.3 }}
                            animate={{
                                opacity: [0, 0, 0.95, 0.7, 0],
                                scale: [0.3, 0.3, 1.25, 1.4, 0.1],
                                x: [0, 0, -14, -28, -38],
                                y: [0, 0, -3, -8, -12],
                            }}
                            transition={{
                                duration: 0.75,
                                times: [0, 0.22, 0.35, 0.6, 1],
                                ease: "easeOut",
                                repeat: 0,
                            }}
                        >
                            <circle cx="56" cy="235" r="11" fill="#E2E8F0" opacity="0.9" />
                            <circle cx="43" cy="240" r="8" fill="#CBD5E1" opacity="0.85" />
                            <circle cx="68" cy="241" r="7" fill="#F1F5F9" opacity="0.8" />
                            <circle cx="50" cy="227" r="6" fill="#FFFFFF" opacity="0.75" />
                            <circle cx="34" cy="242" r="5" fill="#E2E8F0" opacity="0.6" />
                        </motion.g>
                    )}

                    {/* ========================================================
                        TAMESHIWARI WOODEN TRAINING TRUNK (Tronco de Entrenamiento)
                        Splits cleanly in half upon punch impact, and the broken
                        wood halves, stand, and splinters fall and REMAIN VISIBLE
                        ON THE FLOOR upon completion!
                    ======================================================== */}
                    {showTrunk && (
                        <g id="tameshiwari-training-trunk" key={`trunk-${strikeKey}`}>
                            {/* TRUNK BASE STAND (Tatami floor support cross-block - remains solid on floor) */}
                            <g id="trunk-base-stand">
                                <rect x="194" y="214" width="40" height="9" rx="3" fill="#3E1A08" stroke="#1A0A03" strokeWidth="1.5" />
                                <rect x="202" y="208" width="24" height="8" rx="2" fill="#5C2D1C" stroke="#26150D" strokeWidth="1.5" />
                                {/* Tatami shadow under the stand */}
                                <ellipse cx="214" cy="225" rx="24" ry="4" fill="#000000" opacity="0.45" />
                            </g>

                            {/* BOTTOM HALF OF TRUNK (Cae directamente a los pies de Kuma y permanece visible en el suelo) */}
                            <motion.g
                                initial={{ x: 0, y: 0, rotate: 0 }}
                                animate={{
                                    x: [0, 0, -6, -24, -38, -38],
                                    y: [0, 0, 4, 12, 18, 18],
                                    rotate: [0, 0, -18, -48, -78, -75],
                                }}
                                transition={{
                                    duration: 0.95,
                                    times: [0, 0.28, 0.45, 0.68, 0.85, 1],
                                    ease: "easeOut",
                                }}
                                style={{ originX: "214px", originY: "214px" }}
                            >
                                {/* Tatami floor contact shadow at Kuma's feet */}
                                <ellipse cx="172" cy="232" rx="26" ry="4" fill="#000000" opacity="0.38" />

                                {/* Bottom Log Bark Body (from jagged break down to y:214) */}
                                <path
                                    d="M200 152 L207 156 L214 148 L221 157 L228 150 L228 214 L200 214 Z"
                                    fill="url(#woodBarkGrad)"
                                    stroke="#2A1105"
                                    strokeWidth="2"
                                />
                                {/* Exposed Broken Wood Core Fibers (Light yellowish-orange interior) */}
                                <path
                                    d="M201 152 L207 156 L214 148 L221 157 L227 150 L223 154 L214 150 L205 157 Z"
                                    fill="#FEF3C7"
                                    opacity="0.9"
                                />

                                {/* Wood Grain Lines */}
                                <path d="M207 160 Q208 185 206 210" stroke="#3E1A08" strokeWidth="1.2" opacity="0.6" fill="none" />
                                <path d="M217 155 Q216 185 219 210" stroke="#3E1A08" strokeWidth="1.2" opacity="0.6" fill="none" />

                                {/* Traditional Bottom Martial Straw/Rope Band */}
                                <rect x="199" y="193" width="30" height="6" rx="2" fill="url(#woodRopeGrad)" stroke="#451A03" strokeWidth="1.2" />
                                <line x1="204" y1="193" x2="204" y2="199" stroke="#78350F" strokeWidth="1" />
                                <line x1="210" y1="193" x2="210" y2="199" stroke="#78350F" strokeWidth="1" />
                                <line x1="216" y1="193" x2="216" y2="199" stroke="#78350F" strokeWidth="1" />
                                <line x1="222" y1="193" x2="222" y2="199" stroke="#78350F" strokeWidth="1" />
                            </motion.g>

                            {/* TOP HALF OF TRUNK (Salta con el impacto y cae rodando directamente a los pies de Kuma) */}
                            <motion.g
                                initial={{ x: 0, y: 0, rotate: 0 }}
                                animate={{
                                    x: [0, 0, -10, -26, -42, -45, -45],
                                    y: [0, 0, -18, 28, 86, 78, 82],
                                    rotate: [0, 0, -22, -55, -88, -80, -84],
                                }}
                                transition={{
                                    duration: 0.95,
                                    times: [0, 0.28, 0.42, 0.62, 0.78, 0.88, 1],
                                    ease: "easeOut",
                                }}
                                style={{ originX: "214px", originY: "135px" }}
                            >
                                {/* Tatami floor contact shadow at Kuma's feet */}
                                <motion.ellipse
                                    cx="170"
                                    cy="234"
                                    rx="20"
                                    ry="3.5"
                                    fill="#000000"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0, 0, 0.2, 0.45, 0.4, 0.45] }}
                                    transition={{ duration: 0.95, times: [0, 0.28, 0.5, 0.68, 0.78, 0.88, 1] }}
                                />

                                {/* Top Cut Tree Annual Growth Rings */}
                                <ellipse cx="214" cy="116" rx="14" ry="6" fill="url(#woodRingsGrad)" stroke="#3E1A08" strokeWidth="2" />
                                <ellipse cx="214" cy="116" rx="8" ry="3.5" fill="none" stroke="#78350F" strokeWidth="1.2" opacity="0.7" />
                                <ellipse cx="214" cy="116" rx="3.5" ry="1.5" fill="none" stroke="#92400E" strokeWidth="1" opacity="0.7" />
                                <circle cx="214" cy="116" r="1.2" fill="#451A03" />

                                {/* Top Log Bark Body (from y:116 to jagged break at y:150-156) */}
                                <path
                                    d="M200 116 L200 152 L207 156 L214 148 L221 157 L228 150 L228 116 Z"
                                    fill="url(#woodBarkGrad)"
                                    stroke="#2A1105"
                                    strokeWidth="2"
                                />
                                {/* Exposed Broken Wood Core Fibers on Top Half */}
                                <path
                                    d="M200 152 L207 156 L214 148 L221 157 L228 150 L224 146 L214 151 L206 148 Z"
                                    fill="#FEF3C7"
                                    opacity="0.9"
                                />

                                {/* Wood Grain Lines */}
                                <path d="M207 120 Q209 135 206 150" stroke="#3E1A08" strokeWidth="1.2" opacity="0.6" fill="none" />
                                <path d="M217 120 Q215 136 218 148" stroke="#3E1A08" strokeWidth="1.2" opacity="0.6" fill="none" />
                                <path d="M222 120 Q224 135 223 150" stroke="#FDE68A" strokeWidth="1" opacity="0.3" fill="none" />

                                {/* Traditional Top Martial Straw/Rope Band */}
                                <rect x="199" y="127" width="30" height="6" rx="2" fill="url(#woodRopeGrad)" stroke="#451A03" strokeWidth="1.2" />
                                <line x1="204" y1="127" x2="204" y2="133" stroke="#78350F" strokeWidth="1" />
                                <line x1="210" y1="127" x2="210" y2="133" stroke="#78350F" strokeWidth="1" />
                                <line x1="216" y1="127" x2="216" y2="133" stroke="#78350F" strokeWidth="1" />
                                <line x1="222" y1="127" x2="222" y2="133" stroke="#78350F" strokeWidth="1" />
                            </motion.g>

                            {/* PERMANENT WOOD SPLINTERS & CHUNKS AT KUMA'S FEET (A los pies del osito) */}
                            {/* Splinter 1 (Junto a la pata izquierda de Kuma en el tatami) */}
                            <motion.g
                                initial={{ x: 0, y: 0, rotate: 0 }}
                                animate={{
                                    x: [0, 0, -35, -75, -96, -96],
                                    y: [0, 0, -14, 45, 89, 89],
                                    rotate: [0, 0, -60, -180, -280, -280],
                                }}
                                transition={{ duration: 0.95, times: [0, 0.28, 0.45, 0.72, 0.9, 1], ease: "easeOut" }}
                            >
                                <ellipse cx="211" cy="151" rx="4" ry="1.5" fill="#000000" opacity="0.3" />
                                <polygon points="211,149 207,144 212,142 214,146" fill="#FDE68A" stroke="#92400E" strokeWidth="0.8" />
                            </motion.g>

                            {/* Splinter 2 (Entre las patas de Kuma) */}
                            <motion.g
                                initial={{ x: 0, y: 0, rotate: 0 }}
                                animate={{
                                    x: [0, 0, -28, -58, -78, -78],
                                    y: [0, 0, -10, 42, 87, 87],
                                    rotate: [0, 0, 45, 140, 220, 220],
                                }}
                                transition={{ duration: 0.95, times: [0, 0.28, 0.45, 0.72, 0.9, 1], ease: "easeOut" }}
                            >
                                <ellipse cx="215" cy="153" rx="5" ry="1.8" fill="#000000" opacity="0.3" />
                                <polygon points="213,153 218,155 215,160 211,156" fill="#92400E" stroke="#451A03" strokeWidth="0.8" />
                            </motion.g>

                            {/* Splinter 3 (Directamente frente a las garras del pie derecho) */}
                            <motion.g
                                initial={{ x: 0, y: 0, rotate: 0 }}
                                animate={{
                                    x: [0, 0, -22, -48, -66, -66],
                                    y: [0, 0, -12, 42, 91, 91],
                                    rotate: [0, 0, 90, 210, 310, 310],
                                }}
                                transition={{ duration: 0.95, times: [0, 0.28, 0.45, 0.72, 0.9, 1], ease: "easeOut" }}
                            >
                                <ellipse cx="218" cy="151" rx="6" ry="2" fill="#000000" opacity="0.3" />
                                <polygon points="218,151 226,152 224,155 217,153" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.8" />
                            </motion.g>

                            {/* Splinter 4 (Frente a los troncos caídos a sus pies) */}
                            <motion.g
                                initial={{ x: 0, y: 0, rotate: 0 }}
                                animate={{
                                    x: [0, 0, -16, -34, -48, -48],
                                    y: [0, 0, -14, 45, 93, 93],
                                    rotate: [0, 0, -45, -120, -190, -190],
                                }}
                                transition={{ duration: 0.95, times: [0, 0.28, 0.45, 0.72, 0.9, 1], ease: "easeOut" }}
                            >
                                <ellipse cx="214" cy="148" rx="5" ry="2" fill="#000000" opacity="0.3" />
                                <polygon points="214,148 219,144 222,149 216,151" fill="#D97706" stroke="#78350F" strokeWidth="0.8" />
                            </motion.g>

                            {/* Splinter 5 (Junto a los troncos caídos a los pies) */}
                            <motion.g
                                initial={{ x: 0, y: 0, rotate: 0 }}
                                animate={{
                                    x: [0, 0, -8, -18, -26, -26],
                                    y: [0, 0, 6, 40, 83, 83],
                                    rotate: [0, 0, 40, 110, 175, 175],
                                }}
                                transition={{ duration: 0.95, times: [0, 0.28, 0.45, 0.72, 0.9, 1], ease: "easeOut" }}
                            >
                                <ellipse cx="209" cy="156" rx="4" ry="1.5" fill="#000000" opacity="0.3" />
                                <polygon points="209,154 204,157 207,161 211,157" fill="#5C2D1C" stroke="#26150D" strokeWidth="0.8" />
                            </motion.g>

                            {/* HIGH-VELOCITY DISPERSING PARTICLES (Efectos de estallido dinámico) */}
                            <motion.polygon
                                points="216,146 222,143 221,148 215,149"
                                fill="#F59E0B"
                                stroke="#78350F"
                                strokeWidth="0.8"
                                initial={{ x: 0, y: 0, opacity: 0 }}
                                animate={{
                                    x: [0, 0, 42, 92, 130],
                                    y: [0, 0, -32, -65, -88],
                                    rotate: [0, 0, 120, 360, 600],
                                    opacity: [0, 0, 1, 0.75, 0],
                                }}
                                transition={{ duration: 0.95, times: [0, 0.28, 0.38, 0.65, 0.95], ease: "easeOut" }}
                            />
                            <motion.polygon
                                points="212,155 218,157 216,162 210,159"
                                fill="#B45309"
                                stroke="#451A03"
                                strokeWidth="0.8"
                                initial={{ x: 0, y: 0, opacity: 0 }}
                                animate={{
                                    x: [0, 0, 30, 68, 95],
                                    y: [0, 0, 22, 45, 62],
                                    rotate: [0, 0, -100, -280, -480],
                                    opacity: [0, 0, 1, 0.7, 0],
                                }}
                                transition={{ duration: 0.95, times: [0, 0.28, 0.38, 0.65, 0.95], ease: "easeOut" }}
                            />
                            <motion.polygon
                                points="208,148 203,145 205,152 210,151"
                                fill="#78350F"
                                stroke="#26150D"
                                strokeWidth="0.8"
                                initial={{ x: 0, y: 0, opacity: 0 }}
                                animate={{
                                    x: [0, 0, -24, -52, -74],
                                    y: [0, 0, -10, -22, -30],
                                    rotate: [0, 0, -80, -200, -360],
                                    opacity: [0, 0, 1, 0.65, 0],
                                }}
                                transition={{ duration: 0.95, times: [0, 0.28, 0.38, 0.65, 0.95], ease: "easeOut" }}
                            />

                            {/* Flying Sawdust Cloud Particles billow down toward feet */}
                            <motion.circle
                                cx="214"
                                cy="152"
                                r="2.5"
                                fill="#FDE68A"
                                initial={{ opacity: 0 }}
                                animate={{
                                    cx: [214, 214, 185, 165],
                                    cy: [152, 152, 195, 230],
                                    opacity: [0, 0, 1, 0],
                                }}
                                transition={{ duration: 0.85, times: [0, 0.28, 0.55, 1], ease: "easeOut" }}
                            />
                            <motion.circle
                                cx="214"
                                cy="152"
                                r="2.2"
                                fill="#FEF08A"
                                initial={{ opacity: 0 }}
                                animate={{
                                    cx: [214, 214, 175, 150],
                                    cy: [152, 152, 205, 236],
                                    opacity: [0, 0, 1, 0],
                                }}
                                transition={{ duration: 0.85, times: [0, 0.28, 0.55, 1], ease: "easeOut" }}
                            />
                            <motion.circle
                                cx="214"
                                cy="152"
                                r="3"
                                fill="#F59E0B"
                                initial={{ opacity: 0 }}
                                animate={{
                                    cx: [214, 214, 195, 180],
                                    cy: [152, 152, 190, 228],
                                    opacity: [0, 0, 0.9, 0],
                                }}
                                transition={{ duration: 0.8, times: [0, 0.28, 0.55, 1], ease: "easeOut" }}
                            />

                            {/* TRANSIENT COMIC ACTION EFFECTS (Only active during impact) */}
                            {isStriking && (
                                <>
                                    {/* RAZOR ANIME LASER SLASH BEAM */}
                                    <motion.line
                                        x1="176"
                                        y1="132"
                                        x2="254"
                                        y2="172"
                                        stroke="#38BDF8"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{
                                            pathLength: [0, 1, 1],
                                            opacity: [0, 1, 0],
                                            strokeWidth: [6, 9, 1],
                                        }}
                                        transition={{ duration: 0.36, delay: 0.26, times: [0, 0.45, 1], repeat: 0 }}
                                    />
                                    <motion.line
                                        x1="180"
                                        y1="134"
                                        x2="250"
                                        y2="170"
                                        stroke="#FFFFFF"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{
                                            pathLength: [0, 1, 1],
                                            opacity: [0, 1, 0],
                                        }}
                                        transition={{ duration: 0.32, delay: 0.27, times: [0, 0.5, 1], repeat: 0 }}
                                    />

                                    {/* COMIC ELECTRIC KI LIGHTNING BOLTS */}
                                    <motion.path
                                        d="M214 152 L224 140 L220 142 L232 128"
                                        stroke="#FACC15"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0] }}
                                        transition={{ duration: 0.4, delay: 0.28, times: [0, 0.4, 1], repeat: 0 }}
                                        style={{ originX: "214px", originY: "152px" }}
                                    />
                                    <motion.path
                                        d="M214 152 L206 166 L210 164 L202 178"
                                        stroke="#38BDF8"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0] }}
                                        transition={{ duration: 0.4, delay: 0.29, times: [0, 0.4, 1], repeat: 0 }}
                                        style={{ originX: "214px", originY: "152px" }}
                                    />

                                    {/* IMPACT EXPLOSION KI STAR */}
                                    <motion.polygon
                                        points="214,136 218,148 230,152 218,156 214,168 210,156 198,152 210,148"
                                        fill="#FFF176"
                                        stroke="#F59E0B"
                                        strokeWidth="2"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: [0, 0, 2.2, 1.4, 0],
                                            opacity: [0, 0, 1, 0.8, 0],
                                            rotate: [0, 0, 45, 90, 135],
                                        }}
                                        transition={{ duration: 0.95, times: [0, 0.26, 0.32, 0.48, 0.7], ease: "easeOut" }}
                                        style={{ originX: "214px", originY: "152px" }}
                                    />
                                    {/* Circular Shockwave Ring */}
                                    <motion.circle
                                        cx="214"
                                        cy="152"
                                        r="16"
                                        fill="none"
                                        stroke="#FFFFFF"
                                        strokeWidth="3"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: [0, 0, 1.9, 2.8],
                                            opacity: [0, 0, 0.9, 0],
                                        }}
                                        transition={{ duration: 0.95, times: [0, 0.28, 0.36, 0.65], ease: "easeOut" }}
                                        style={{ originX: "214px", originY: "152px" }}
                                    />

                                    {/* MANGA COMIC ACTION CALLOUT: ¡KIAI! */}
                                    <motion.g
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: [0, 0, 1.4, 1.15, 1.2, 0],
                                            opacity: [0, 0, 1, 1, 0.9, 0],
                                            rotate: [-15, -15, 8, -4, 4, 0],
                                            y: [0, 0, -6, -10, -12, -18],
                                        }}
                                        transition={{
                                            duration: 0.85,
                                            times: [0, 0.28, 0.38, 0.55, 0.75, 1],
                                            ease: "easeOut",
                                            repeat: 0,
                                        }}
                                        style={{ originX: "218px", originY: "92px" }}
                                    >
                                        <polygon
                                            points="218,65 230,79 250,73 242,89 258,99 240,106 238,123 218,112 198,123 197,106 178,99 195,89 187,73 207,79"
                                            fill="#FACC15"
                                            stroke="#DC2626"
                                            strokeWidth="3.5"
                                            strokeLinejoin="round"
                                        />
                                        <polygon
                                            points="218,69 228,81 244,76 237,89 250,97 236,102 234,116 218,107 202,116 201,102 186,97 199,89 193,76 209,81"
                                            fill="#FEF08A"
                                        />
                                        <text
                                            x="218"
                                            y="99"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fill="#000000"
                                            stroke="#FFFFFF"
                                            strokeWidth="4"
                                            paintOrder="stroke fill"
                                            className="font-black italic text-base select-none"
                                            style={{ fontWeight: 900, fontFamily: "Impact, 'Arial Black', sans-serif", letterSpacing: "0.05em" }}
                                        >
                                            ¡KIAI!
                                        </text>
                                        <text
                                            x="218"
                                            y="99"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fill="#DC2626"
                                            className="font-black italic text-base select-none"
                                            style={{ fontWeight: 900, fontFamily: "Impact, 'Arial Black', sans-serif", letterSpacing: "0.05em" }}
                                        >
                                            ¡KIAI!
                                        </text>
                                    </motion.g>
                                </>
                            )}
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
}
