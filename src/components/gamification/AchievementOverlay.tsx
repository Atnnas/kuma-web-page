"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import * as PhosphorIcons from "@phosphor-icons/react";
import Image from "next/image";

interface AchievementOverlayProps {
    show: boolean;
    trophy: {
        slug?: string;
        name: string;
        description: string;
        icon: string;
        color: string;
        rarity: string;
    } | null;
    onClose: () => void;
}

const TROPHY_IMAGES: Record<string, string> = {
    "primer-entrenamiento": "/images/kuma-logro-primer-entreno.jpg",
    "kuma-revenant": "/images/kuma-logro-hora-entreno.jpg",
    "oso-oso-mentiroso": "/images/kuma-logro-primer-trampa.jpg"
};

export function AchievementOverlay({ show, trophy, onClose }: AchievementOverlayProps) {
    const { width, height } = useWindowSize();
    const [activeTrophy, setActiveTrophy] = useState<AchievementOverlayProps["trophy"]>(null);

    // Sync trophy with local state to avoid flash of previous content when closing
    useEffect(() => {
        if (show && trophy) {
            setActiveTrophy(trophy);
        }
    }, [show, trophy]);

    if (!activeTrophy && !trophy) return null;

    // Use either the incoming trophy or the cached active one during exit animation
    const currentTrophy = show ? trophy : activeTrophy;
    if (!currentTrophy) return null;

    // Dynamic Icon
    const IconComponent = (PhosphorIcons as any)[currentTrophy.icon] || PhosphorIcons.Trophy;

    // Custom Animation for "Primer Entrenamiento"
    if (currentTrophy.slug === "primer-entrenamiento") {
        return (
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 cursor-pointer overflow-hidden"
                    >
                        {/* GOLD/BLUE THEME BACKGROUND */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-gradient-radial from-yellow-600/20 via-blue-950 to-black animate-spin-slow opacity-60" />
                            <motion.div
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"
                            />
                        </div>

                        <Confetti width={width} height={height} numberOfPieces={300} recycle={true} gravity={0.2} colors={['#fbbf24', '#2563eb', '#ffffff']} />

                        <div className="relative text-center p-8 max-w-5xl w-full z-20">
                            <motion.div
                                initial={{ scale: 3, opacity: 0, filter: "blur(20px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative z-10"
                            >
                                <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 mb-6 uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]">
                                    ¡EL CAMINO COMIENZA!
                                </h1>

                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        filter: ["drop-shadow(0 0 30px rgba(251,191,36,0.3))", "drop-shadow(0 0 60px rgba(251,191,36,0.6))", "drop-shadow(0 0 30px rgba(251,191,36,0.3))"]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                    className="w-full h-64 md:h-80 my-8 relative flex items-center justify-center bg-black/50 rounded-2xl border border-yellow-500/30 backdrop-blur-md mx-auto aspect-square max-w-[320px] overflow-hidden shadow-2xl"
                                >
                                    {/* KUMA TROPHY IMAGE */}
                                    <Image
                                        src="/images/kuma-logro-primer-entreno.jpg"
                                        alt="Primer Entrenamiento"
                                        fill
                                        priority
                                        className="object-cover opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                                </motion.div>

                                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-widest uppercase drop-shadow-2xl font-mono">
                                    {currentTrophy.name}
                                </h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="text-xl md:text-2xl text-yellow-100 max-w-2xl mx-auto font-bold italics leading-relaxed"
                                >
                                    {currentTrophy.description}
                                </motion.p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Custom Animation for "Spirit of the Bear" (Kuma Revenant)
    if (currentTrophy.slug === "kuma-revenant") {
        return (
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 cursor-pointer overflow-hidden"
                    >
                        {/* RED/BLACK THEME BACKGROUND */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-gradient-radial from-red-900/40 via-black to-black animate-pulse opacity-80" />
                            <motion.div
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"
                            />
                        </div>

                        {/* CLAW MARKS (Simulated) */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="absolute top-1/4 left-0 w-full h-[2px] bg-red-600 rotate-12 blur-sm origin-left"
                        />
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="absolute top-2/4 left-0 w-full h-[3px] bg-red-500 -rotate-6 blur-md origin-right"
                        />
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="absolute top-3/4 left-0 w-full h-[2px] bg-red-700 rotate-3 blur-sm origin-left"
                        />

                        <Confetti width={width} height={height} numberOfPieces={300} recycle={true} gravity={0.3} colors={['#dc2626', '#b91c1c', '#000000']} />

                        <div className="relative text-center p-8 max-w-5xl w-full z-20">
                            <motion.div
                                initial={{ scale: 3, opacity: 0, filter: "blur(20px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative z-10"
                            >
                                <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-black mb-4 uppercase italic tracking-tighter drop-shadow-[0_0_50px_rgba(220,38,38,1)] stroke-white stroke-2">
                                    ¡ESPÍRITU KUMA!
                                </h1>

                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        filter: ["drop-shadow(0 0 30px rgba(220,38,38,0.5))", "drop-shadow(0 0 80px rgba(220,38,38,1))", "drop-shadow(0 0 30px rgba(220,38,38,0.5))"]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                    className="w-full h-64 md:h-80 my-8 relative flex items-center justify-center bg-black/50 rounded-2xl border border-red-900/50 backdrop-blur-md mx-auto aspect-square max-w-[320px] overflow-hidden"
                                >
                                    {/* KUMA TROPHY IMAGE */}
                                    <Image
                                        src="/images/kuma-logro-hora-entreno.jpg"
                                        alt="Espíritu Kuma"
                                        fill
                                        priority
                                        className="object-cover opacity-90 mix-blend-hard-light"
                                    />

                                    {/* Overlay Gradient for drama */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-transparent to-transparent" />
                                </motion.div>

                                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-widest uppercase drop-shadow-2xl font-mono">
                                    RESISTENCIA LEGENDARIA
                                </h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="text-2xl md:text-3xl text-red-100 max-w-3xl mx-auto font-bold italics"
                                >
                                    {currentTrophy.description}
                                </motion.p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Custom Animation for "Oso Oso Mentiroso" (Cheat Achievement)
    if (currentTrophy.slug === "oso-oso-mentiroso") {
        const WarningIcon = (PhosphorIcons as any)["WarningCircle"] || PhosphorIcons.Trophy;
        const ResetIcon = (PhosphorIcons as any)["ArrowCounterClockwise"] || PhosphorIcons.Trophy;

        return (
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 cursor-pointer overflow-hidden"
                    >
                        {/* RED/BLACK THEME BACKGROUND */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.2),transparent,transparent)] opacity-80" />
                            <motion.div
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"
                            />
                        </div>

                        <div className="relative text-center p-8 max-w-lg w-full z-20">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative z-10 bg-zinc-950 border border-red-500/20 p-8 rounded-[2rem] shadow-2xl"
                            >
                                <div className="w-full aspect-square max-w-[320px] mx-auto mb-8 relative">
                                    <Image
                                        src="/images/kuma-logro-primer-trampa.jpg"
                                        alt="Logro Trampa"
                                        fill
                                        priority
                                        className="object-cover rounded-2xl border-4 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)]"
                                    />
                                    <div className="absolute -top-6 -right-6 bg-red-600 text-white p-4 rounded-full shadow-lg border-4 border-zinc-950">
                                        <WarningIcon size={40} weight="fill" />
                                    </div>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black text-red-500 uppercase tracking-tighter mb-4 italic leading-none drop-shadow-lg">¡TE CACHAMOS!</h2>
                                <p className="text-zinc-200 text-xl md:text-2xl font-bold mb-8 leading-tight">
                                    "Tu saltaste esta rutina, tienes la oportunidad de entrenar realmente durante el día. Si a las 12 media noche no has hecho entreno, perderás la racha. Oso oso mentiroso"
                                </p>

                                <button
                                    className="w-full h-16 bg-white text-black rounded-[2rem] font-bold text-lg tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ResetIcon size={24} weight="bold" />
                                    Reintentar Honestamente
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    onClick={onClose} // Close on click/tap
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 cursor-pointer"
                >
                    {/* Radiant Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-gradient-radial from-kuma-gold/20 via-transparent to-transparent animate-spin-slow opacity-50" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-gradient-radial from-red-600/20 via-transparent to-transparent animate-reverse-spin opacity-50" />
                    </div>

                    <Confetti width={width} height={height} numberOfPieces={500} recycle={true} gravity={0.2} colors={[currentTrophy.color, '#FFD700', '#FFFFFF']} />

                    <div className="relative text-center p-8 max-w-4xl w-full">
                        <motion.div
                            initial={{ scale: 0.2, rotate: -720, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="relative z-10"
                        >
                            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 mb-8 uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(234,179,8,0.8)] animate-pulse">
                                ¡NUEVO LOGRO!
                            </h1>

                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0],
                                    filter: ["drop-shadow(0 0 20px rgba(255,215,0,0.5))", "drop-shadow(0 0 60px rgba(255,215,0,1))", "drop-shadow(0 0 20px rgba(255,215,0,0.5))"]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-full h-48 md:h-64 my-8 relative flex items-center justify-center overflow-hidden rounded-2xl"
                            >
                                {currentTrophy.slug && TROPHY_IMAGES[currentTrophy.slug] ? (
                                    <div className="relative w-48 h-48 md:w-64 md:h-64 border-2 border-kuma-gold/50 rounded-2xl overflow-hidden shadow-2xl">
                                        <Image
                                            src={TROPHY_IMAGES[currentTrophy.slug]}
                                            alt={currentTrophy.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <IconComponent
                                        className="w-48 h-48 md:w-64 md:h-64 drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]"
                                        weight="fill"
                                        style={{ color: currentTrophy.color }}
                                    />
                                )}
                            </motion.div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-widest uppercase drop-shadow-2xl">
                                {currentTrophy.name}
                            </h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="text-2xl text-zinc-200 max-w-2xl mx-auto font-bold"
                            >
                                {currentTrophy.description}
                            </motion.p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
