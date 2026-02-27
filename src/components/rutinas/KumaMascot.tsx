"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KumaMascotProps {
    streak?: number;
    workouts?: number;
    mood?: "warrior" | "aura" | "sad";
    className?: string;
}

export function KumaMascot({ streak = 0, workouts = 0, mood: manualMood, className = "" }: KumaMascotProps) {
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

    // Belt progression logic
    const getBeltColor = (count: number) => {
        if (count >= 250) return { main: "#1A1A1A", shadow: "#000000", label: "Cinta Negra" };
        if (count >= 120) return { main: "#5D4037", shadow: "#3E2723", label: "Cinta Marrón" };
        if (count >= 60) return { main: "#1976D2", shadow: "#0D47A1", label: "Cinta Azul" };
        if (count >= 30) return { main: "#388E3C", shadow: "#1B5E20", label: "Cinta Verde" };
        if (count >= 15) return { main: "#FF9800", shadow: "#E65100", label: "Cinta Naranja" };
        if (count >= 5) return { main: "#FBC02D", shadow: "#F9A825", label: "Cinta Amarilla" };
        return { main: "#FFFFFF", shadow: "#E0E0E0", label: "Cinta Blanca" };
    };

    const belt = getBeltColor(workouts);

    return (
        <div className={`relative flex flex-col items-center justify-center p-6 select-none ${className}`}>

            {/* Motivational Speech Bubble */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                key={currentMood}
                className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap px-5 py-2.5 rounded-2xl bg-white text-black text-[11px] font-black shadow-[0_15px_30px_rgba(0,0,0,0.3)] border-2 border-zinc-200 z-30"
            >
                <div className="flex flex-col items-center gap-0.5">
                    <span>{isSad ? "¡Te extraño en el tatami! 🐻" : hasAura ? "¡TU ESPÍRITU KUMA QUEMA! 🔥" : "¡VAMOS A ENTRENAR! 🥋"}</span>
                    {!isSad && <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">{belt.label}</span>}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-zinc-200 rotate-45" />
            </motion.div>

            {/* Aura Effect */}
            <AnimatePresence>
                {hasAura && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.2, 1.5, 1.2], rotate: [0, 10, -10, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-x-0 bottom-10 top-0 bg-gradient-to-t from-kuma-gold/50 via-orange-500/20 to-transparent blur-3xl rounded-full z-0"
                    />
                )}
            </AnimatePresence>

            {/* Main Mascot SVG Container - Hyper-Detailed Full Body */}
            <motion.div
                animate={{
                    y: isSad ? [0, 8, 0] : [0, -15, 0],
                    rotate: isSad ? [1, -1, 1] : [0, 0.5, -0.5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-64 h-72 drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
            >
                <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Definitions for gradients and masks */}
                    <defs>
                        <radialGradient id="furGradient" cx="100" cy="100" r="100" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#8C5C40" />
                            <stop offset="1" stopColor="#6D412D" />
                        </radialGradient>
                        <linearGradient id="giShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#E5E5E5" />
                        </linearGradient>
                    </defs>

                    {/* LEGS & FEET (Kiba-dachi influenced) */}
                    <g className="legs">
                        <path d="M50 190L30 230H65L75 200L65 190H50Z" fill="#8C5C40" /> {/* Left Leg */}
                        <path d="M150 190L170 230H135L125 200L135 190H150Z" fill="#8C5C40" /> {/* Right Leg */}

                        {/* Paws Detail */}
                        <path d="M30 230C30 225 35 220 45 220C55 220 65 225 65 230H30Z" fill="#6D412D" opacity="0.4" />
                        <path d="M135 230C135 225 145 220 155 220C165 220 170 225 170 230H135Z" fill="#6D412D" opacity="0.4" />

                        {/* Gi Pants */}
                        <path d="M45 170L35 210H75L82 170H45Z" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />
                        <path d="M155 170L165 210H125L118 170H155Z" fill="white" stroke="#E0E0E0" strokeWidth="0.5" />
                    </g>

                    {/* ARMS */}
                    <g className="arms">
                        {/* Left Arm Shadow/Muscle */}
                        <path d="M40 120C30 130 30 150 45 165L60 145" fill="#6D412D" opacity="0.3" />
                        <path d="M160 120C170 130 170 150 155 165L140 145" fill="#6D412D" opacity="0.3" />

                        {/* Gi Sleeves */}
                        <path d="M40 110C35 110 30 120 30 140L55 145C60 130 55 110 40 110Z" fill="white" />
                        <path d="M160 110C165 110 170 120 170 140L145 145C140 130 145 110 160 110Z" fill="white" />
                    </g>

                    {/* TORSO */}
                    <g className="torso">
                        {/* Body base */}
                        <path d="M60 100C60 100 45 170 100 185C155 170 140 100 140 100" fill="#8C5C40" />

                        {/* Gi Jacket Top */}
                        <path d="M60 100L45 170H155L140 100H60Z" fill="url(#giShadow)" />

                        {/* Gi Lapels (V-Neck) */}
                        <path d="M100 100L55 170H80L100 125L120 170H145L100 100Z" fill="#F9F9F9" stroke="#E0E0E0" strokeWidth="1" />

                        {/* BELT SYSTEM (Dynamic) */}
                        <g className="belt">
                            {/* Belt Main Body */}
                            <path
                                d="M55 160C55 160 65 175 100 175C135 175 145 160 145 160V175C145 175 135 190 100 190C65 190 55 175 55 175V160Z"
                                fill={belt.main}
                                stroke={belt.shadow}
                                strokeWidth="0.5"
                            />
                            {/* Belt Knot */}
                            <rect x="92" y="165" width="16" height="22" rx="2" fill={belt.main} stroke={belt.shadow} strokeWidth="1" />
                            {/* Belt Ends (Dangly) */}
                            <path d="M94 187L88 205L100 207L104 187Z" fill={belt.main} stroke={belt.shadow} strokeWidth="0.5" />
                            <path d="M106 187L112 210L100 212L96 187Z" fill={belt.main} stroke={belt.shadow} strokeWidth="0.5" />

                            {/* Belt Texture/Shine */}
                            <path d="M60 165C80 170 120 170 140 165" stroke="white" strokeWidth="0.5" opacity="0.3" fill="none" />
                        </g>

                        {/* Dojo Logo (Subtle on Gi) */}
                        <circle cx="125" cy="130" r="8" fill="#D32F2F" opacity="0.1" />
                    </g>

                    {/* HEAD (Based on Warrior Kuma) */}
                    <g className="head">
                        {/* Ears with Fur Detail */}
                        <circle cx="55" cy="45" r="26" fill="#8C5C40" />
                        <circle cx="55" cy="45" r="16" fill="#6D412D" />
                        <circle cx="145" cy="45" r="26" fill="#8C5C40" />
                        <circle cx="145" cy="45" r="16" fill="#6D412D" />

                        {/* Head Shape with Jaw Tufts */}
                        <path d="M100 30C145 30 175 60 175 105C175 125 182 135 192 140C182 145 175 160 175 165C175 165 100 175 100 175C100 175 25 165 25 165C25 160 18 145 8 140C18 135 25 125 25 105C25 60 55 30 100 30Z" fill="url(#furGradient)" />

                        {/* Face Details */}
                        <ellipse cx="100" cy="140" rx="48" ry="32" fill="#D2B48C" opacity="0.4" />

                        {/* Muzzle */}
                        <ellipse cx="100" cy="138" rx="38" ry="24" fill="#C19A6B" />
                        <path d="M92 118C92 116.895 92.8954 116 94 116H106C107.105 116 108 116.895 108 118V122C108 127.523 103.523 132 98 132H94C92.8954 132 92 131.105 92 130V118Z" fill="#2D1B0F" />

                        {/* EYES - Warrior Style */}
                        <g className="eyes">
                            {/* White Eye Areas */}
                            <path d="M60 100L85 90V110L60 115V100Z" fill="white" />
                            <path d="M140 100L115 90V110L140 115V100Z" fill="white" />

                            {/* Thick Warrior Brows */}
                            <path d="M55 90C70 85 85 85 90 90" stroke="#2D1B0F" strokeWidth="6" strokeLinecap="round" />
                            <path d="M145 90C130 85 115 85 110 90" stroke="#2D1B0F" strokeWidth="6" strokeLinecap="round" />

                            {/* Irises */}
                            <motion.ellipse
                                cx="75" cy="103" rx="6" ry={isBlinking ? 1 : 9}
                                fill={isSad ? "#90CAF9" : "#1A1A1A"}
                            />
                            <motion.ellipse
                                cx="125" cy="103" rx="6" ry={isBlinking ? 1 : 9}
                                fill={isSad ? "#90CAF9" : "#1A1A1A"}
                            />

                            {/* Eye Shine */}
                            {!isBlinking && (
                                <>
                                    <circle cx="77" cy="100" r="2.5" fill="white" opacity="0.8" />
                                    <circle cx="123" cy="100" r="2.5" fill="white" opacity="0.8" />
                                </>
                            )}
                        </g>

                        {/* Mouth Smirk/Determined */}
                        {!isSad && (
                            <path d="M85 150C85 150 100 162 120 152" stroke="#2D1B0F" strokeWidth="5" strokeLinecap="round" />
                        )}
                        {isSad && (
                            <path d="M85 160C85 160 100 155 115 160" stroke="#2D1B0F" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                        )}
                    </g>

                    {/* Fur Shading/Detailing */}
                    <path d="M40 70C35 80 35 100 45 110" stroke="#6D412D" strokeWidth="1" opacity="0.2" />
                    <path d="M160 70C165 80 165 100 155 110" stroke="#6D412D" strokeWidth="1" opacity="0.2" />
                </svg>
            </motion.div>

            {/* Shadow beneath */}
            <motion.div
                animate={{ scale: isSad ? [0.8, 1, 0.8] : [1.1, 0.9, 1.1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-48 h-6 bg-black/50 blur-2xl rounded-full -mt-4"
            />

            {/* Status Footer */}
            <div className="mt-6 flex flex-col items-center gap-1">
                <span className={`text-[10px] uppercase font-black tracking-[0.3em] ${isSad ? "text-zinc-600" : hasAura ? "text-kuma-gold" : "text-zinc-400"}`}>
                    Kuma Evolutivo
                </span>
                <div className="flex gap-1 h-1.5 w-32 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((workouts % 50) * 2, 100)}%` }}
                        className="h-full bg-gradient-to-r from-red-600 to-kuma-gold"
                    />
                </div>
            </div>
        </div>
    );
}
