"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KumaMascotProps {
    streak?: number;
    mood?: "warrior" | "aura" | "sad";
    className?: string;
}

export function KumaMascot({ streak = 0, mood: manualMood, className = "" }: KumaMascotProps) {
    const [currentMood, setCurrentMood] = useState<"warrior" | "aura" | "sad">("warrior");
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        if (manualMood) {
            setCurrentMood(manualMood);
        } else {
            if (streak === 0) setCurrentMood("sad");
            else if (streak >= 7) setCurrentMood("aura");
            else setCurrentMood("warrior");
        }
    }, [streak, manualMood]);

    // Random blinking effect
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
        }, Math.random() * 4000 + 2000);
        return () => clearInterval(blinkInterval);
    }, []);

    const isSad = currentMood === "sad";
    const hasAura = currentMood === "aura";

    return (
        <div className={`relative flex flex-col items-center justify-center p-4 select-none ${className}`}>

            {/* Motivational Speech Bubble */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                key={currentMood}
                className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-2xl bg-white text-black text-xs font-black shadow-xl border-2 border-zinc-200 z-30"
            >
                {isSad ? "¡Te extraño en el tatami! 🐻" : hasAura ? "¡TU ESPÍRITU KUMA QUEMA! 🔥" : "¡Listo para entrenar! 🥋"}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-zinc-200 rotate-45" />
            </motion.div>

            {/* Aura Effect */}
            <AnimatePresence>
                {hasAura && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-t from-kuma-gold/40 via-orange-500/20 to-transparent blur-3xl rounded-full z-0"
                    />
                )}
            </AnimatePresence>

            {/* Main Mascot SVG Container */}
            <motion.div
                animate={{
                    y: isSad ? [0, 4, 0] : [0, -10, 0],
                    rotate: isSad ? [1, -1, 1] : [0, 0.5, -0.5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-48 h-48 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Ears */}
                    <circle cx="55" cy="55" r="22" fill="#5D4037" />
                    <circle cx="55" cy="55" r="12" fill="#3E2723" />
                    <circle cx="145" cy="55" r="22" fill="#5D4037" />
                    <circle cx="145" cy="55" r="12" fill="#3E2723" />

                    {/* Head */}
                    <circle cx="100" cy="100" r="70" fill="#5D4037" />
                    <path d="M40 100C40 66.8629 66.8629 40 100 40C133.137 40 160 66.8629 160 100C160 133.137 133.137 160 100 160C66.8629 160 40 133.137 40 100Z" fill="#5D4037" />

                    {/* Muzzle */}
                    <ellipse cx="100" cy="130" rx="35" ry="25" fill="#8D6E63" />
                    <path d="M92 120C92 118.895 92.8954 118 94 118H106C107.105 118 108 118.895 108 120V125C108 130.523 103.523 135 98 135H94C92.8954 135 92 134.105 92 133V120Z" fill="#3E2723" opacity="0.8" />

                    {/* Eyes */}
                    <g className="eyes">
                        <path d="M60 90C60 90 70 80 85 85" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <path d="M140 90C140 90 130 80 115 85" stroke="white" strokeWidth="4" strokeLinecap="round" />

                        <motion.ellipse
                            cx="75" cy="95" rx="6" ry={isBlinking ? 1 : 10}
                            fill={isSad ? "#90CAF9" : "white"}
                            animate={{ scale: isSad ? 0.9 : 1 }}
                        />
                        <motion.ellipse
                            cx="125" cy="95" rx="6" ry={isBlinking ? 1 : 10}
                            fill={isSad ? "#90CAF9" : "white"}
                            animate={{ scale: isSad ? 0.9 : 1 }}
                        />

                        {!isBlinking && (
                            <>
                                <circle cx="75" cy="95" r="3" fill="black" />
                                <circle cx="125" cy="95" r="3" fill="black" />
                            </>
                        )}
                    </g>

                    {/* Mouth */}
                    {isSad ? (
                        <path d="M90 145C90 145 100 140 110 145" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
                    ) : (
                        <path d="M85 140C85 140 100 150 115 140" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
                    )}

                    {/* Karate Gi (Body) */}
                    <motion.g animate={{ y: isSad ? 2 : 0 }}>
                        <path d="M60 160L40 200H160L140 160H60Z" fill="white" />
                        <path d="M100 160L70 200H130L100 160Z" fill="#EEEEEE" />

                        <rect x="65" y="185" width="70" height="8" rx="2" fill="black" />
                        <rect x="95" y="185" width="10" height="15" fill="black" />
                    </motion.g>
                </svg>
            </motion.div>

            {/* Shadow */}
            <motion.div
                animate={{ scale: isSad ? [0.8, 0.85, 0.8] : [1, 0.8, 1], opacity: [0.2, 0.1, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-4 bg-black/40 blur-xl rounded-full -mt-2"
            />

            <div className="mt-4 text-center">
                <span className={`text-[10px] uppercase font-black tracking-[0.2em] ${isSad ? "text-zinc-600" : hasAura ? "text-kuma-gold animate-pulse" : "text-zinc-400"}`}>
                    Kuma Dojo Mascot
                </span>
            </div>
        </div>
    );
}
