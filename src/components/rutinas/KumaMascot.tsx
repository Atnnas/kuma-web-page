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
                className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-2xl bg-white text-black text-[10px] font-black shadow-xl border-2 border-zinc-200 z-30"
            >
                {isSad ? "¡Te extraño en el tatami! 🐻" : hasAura ? "¡TU ESPÍRITU KUMA QUEMA! 🔥" : "¡VAMOS A ENTRENAR! 🥋"}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-zinc-200 rotate-45" />
            </motion.div>

            {/* Aura Effect */}
            <AnimatePresence>
                {hasAura && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1.1, 1.3, 1.1], rotate: [0, 5, -5, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-t from-kuma-gold/40 via-orange-500/20 to-transparent blur-3xl rounded-full z-0"
                    />
                )}
            </AnimatePresence>

            {/* Main Mascot SVG Container - Based on kuma-logro-primer-entreno.jpg */}
            <motion.div
                animate={{
                    y: isSad ? [0, 6, 0] : [0, -12, 0],
                    rotate: isSad ? [1, -1, 1] : [0, 0.3, -0.3, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-48 h-48 drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Ears */}
                    <circle cx="50" cy="45" r="24" fill="#8C5C40" />
                    <circle cx="50" cy="45" r="14" fill="#6D412D" />
                    <circle cx="150" cy="45" r="24" fill="#8C5C40" />
                    <circle cx="150" cy="45" r="14" fill="#6D412D" />

                    {/* Head with Fur Tufts (Cheeks) */}
                    <path d="M100 35C140 35 170 65 170 100C170 115 175 125 185 130C175 135 170 145 170 160C170 165 100 175 100 175C100 175 30 165 30 160C30 145 25 135 15 130C25 125 30 115 30 100C30 65 60 35 100 35Z" fill="#8C5C40" />

                    {/* Inner Face/Muzzle Area */}
                    <ellipse cx="100" cy="140" rx="45" ry="30" fill="#D2B48C" opacity="0.4" />
                    <path d="M65 110C65 80 80 65 100 65C120 65 135 80 135 110V140H65V110Z" fill="#D2B48C" opacity="0.2" />

                    {/* Muzzle Detail */}
                    <ellipse cx="100" cy="135" rx="35" ry="22" fill="#C19A6B" />
                    <path d="M92 115C92 113.895 92.8954 113 94 113H106C107.105 113 108 113.895 108 115V118C108 123.523 103.523 128 98 128H94C92.8954 128 92 127.105 92 126V115Z" fill="#3D2B1F" />

                    {/* Fierce Anime Eyes */}
                    <g className="eyes">
                        {/* Eye Background */}
                        <path d="M60 95L85 85V105L60 110V95Z" fill="white" />
                        <path d="M140 95L115 85V105L140 110V95Z" fill="white" />

                        {/* Eye Lids/Fierce Brow */}
                        <path d="M55 85L90 75" stroke="#3D2B1F" strokeWidth="6" strokeLinecap="round" />
                        <path d="M145 85L110 75" stroke="#3D2B1F" strokeWidth="6" strokeLinecap="round" />

                        {/* Eyeballs */}
                        <motion.ellipse
                            cx="75" cy="98" rx="6" ry={isBlinking ? 1 : 8}
                            fill={isSad ? "#90CAF9" : "#1A1A1A"}
                        />
                        <motion.ellipse
                            cx="125" cy="98" rx="6" ry={isBlinking ? 1 : 8}
                            fill={isSad ? "#90CAF9" : "#1A1A1A"}
                        />

                        {/* Pupils/Highlights */}
                        {!isBlinking && (
                            <>
                                <circle cx="77" cy="96" r="2" fill="white" opacity="0.6" />
                                <circle cx="123" cy="96" r="2" fill="white" opacity="0.6" />
                            </>
                        )}
                    </g>

                    {/* Mouth - Determined Smirk */}
                    {isSad ? (
                        <path d="M85 155C85 155 100 150 115 155" stroke="#3D2B1F" strokeWidth="4" strokeLinecap="round" />
                    ) : (
                        <g>
                            <path d="M85 145C85 145 100 158 120 148" stroke="#3D2B1F" strokeWidth="5" strokeLinecap="round" />
                            <path d="M115 147L122 152" stroke="#3D2B1F" strokeWidth="2" />
                        </g>
                    )}

                    {/* Body - Black compression shirt with claws */}
                    <motion.g animate={{ y: isSad ? 3 : 0 }}>
                        <path d="M60 170L30 200H170L140 170H60Z" fill="#111111" />

                        {/* Claw Marks (White) */}
                        <path d="M90 175L80 185" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                        <path d="M100 175L90 190" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
                        <path d="M110 175L100 188" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

                        {/* Muscle Shadows */}
                        <path d="M65 170L50 190" stroke="black" strokeWidth="4" opacity="0.3" />
                        <path d="M135 170L150 190" stroke="black" strokeWidth="4" opacity="0.3" />
                    </motion.g>
                </svg>
            </motion.div>

            {/* Shadow beneath */}
            <motion.div
                animate={{ scale: isSad ? [0.8, 0.9, 0.8] : [1, 0.7, 1], opacity: [0.2, 0.1, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-4 bg-black/40 blur-xl rounded-full -mt-2"
            />

            {/* Status Footer */}
            <div className="mt-4 text-center">
                <span className={`text-[10px] uppercase font-black tracking-[0.2em] ${isSad ? "text-zinc-600" : hasAura ? "text-kuma-gold animate-pulse" : "text-zinc-400"}`}>
                    Kuma Warrior Mascot
                </span>
            </div>
        </div>
    );
}
