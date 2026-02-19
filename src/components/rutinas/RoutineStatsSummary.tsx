"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShareNetwork,
    DownloadSimple,
    Trophy,
    Fire,
    Clock,
    TrendUp,
    CheckCircle,
    ArrowLeft
} from "@phosphor-icons/react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface RoutineStatsSummaryProps {
    routineTitle: string;
    totalTime: number; // in seconds
    streakDays: number;
    workoutCount: number;
    dailyMinutes: number;
    totalMinutes: number;
    achievements?: any[];
    onBack: () => void;
}

export function RoutineStatsSummary({
    routineTitle,
    totalTime,
    streakDays,
    workoutCount,
    dailyMinutes,
    totalMinutes,
    achievements = [],
    onBack
}: RoutineStatsSummaryProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
    };

    // --- CANVAS RENDERER FOR SHARING ---
    const generateShareImage = async (): Promise<Blob | null> => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        // Set dimensions (Square optimized for Social Media)
        canvas.width = 1080;
        canvas.height = 1080;

        // 1. Background
        const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
        grad.addColorStop(0, "#09090b");
        grad.addColorStop(1, "#18181b");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // 2. Subtle Grid / Pattern
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 1080; i += 60) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 1080);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(1080, i);
            ctx.stroke();
        }

        // 3. Branding
        ctx.fillStyle = "#fbbf24"; // Kuma Gold
        ctx.font = "900 40px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("KUMA DOJO", 540, 100);

        // 4. Main Title
        ctx.fillStyle = "white";
        ctx.font = "900 120px Montserrat, sans-serif";
        ctx.fillText("¡VICTORIA!", 540, 250);

        // 5. Streak Section
        // Draw Flame-like shape
        ctx.fillStyle = "#f97316"; // Orange
        ctx.beginPath();
        ctx.moveTo(540, 350);
        ctx.quadraticCurveTo(460, 450, 540, 550);
        ctx.quadraticCurveTo(620, 450, 540, 350);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "900 100px Montserrat, sans-serif";
        ctx.fillText(`${streakDays}`, 540, 520);
        ctx.font = "700 30px Montserrat, sans-serif";
        ctx.fillText("DÍAS DE RACHA", 540, 580);

        // 6. Routine Stats
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "700 28px Montserrat, sans-serif";
        ctx.fillText(routineTitle.toUpperCase(), 540, 720);

        ctx.fillStyle = "white";
        ctx.font = "900 80px Montserrat, sans-serif";
        ctx.fillText(`${formatTime(totalTime)}`, 540, 810);
        ctx.font = "700 24px Montserrat, sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillText("TIEMPO TOTAL", 540, 850);

        // 7. Footer / Link
        ctx.fillStyle = "#fbbf24";
        ctx.font = "900 36px Montserrat, sans-serif";
        ctx.fillText("KUMADOJOCR.COM", 540, 980);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), "image/png");
        });
    };

    const handleShare = async () => {
        setIsGenerating(true);
        try {
            const blob = await generateShareImage();
            if (!blob) return;

            const file = new File([blob], "kuma-victoria.png", { type: "image/png" });

            if (navigator.share) {
                await navigator.share({
                    title: "¡Mi entrenamiento en Kuma Dojo!",
                    text: `Acabo de completar ${routineTitle} en Kuma Dojo. ¡Llevo ${streakDays} días de racha! Entrena conmigo en kumadojocr.com`,
                    files: [file]
                });
            } else {
                // Fallback: Download
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "kuma-victoria.png";
                a.click();
            }
        } catch (err) {
            console.error("Share failed:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black" />

            {/* Hidden Canvas for rendering the share image */}
            <canvas ref={canvasRef} className="hidden" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-2xl bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl"
            >
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                        className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                    >
                        <Trophy size={48} weight="fill" className="text-black" />
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white">¡VICTORIA!</h1>
                    <p className="text-zinc-400 text-lg uppercase tracking-widest font-bold">Rutina Completada</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                    {/* Time Stat */}
                    <div className="bg-white/5 rounded-3xl p-6 flex flex-col items-center text-center">
                        <Clock size={32} className="text-emerald-400 mb-2" weight="duotone" />
                        <span className="text-3xl font-black text-white">{formatTime(totalTime)}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Entrenamiento</span>
                    </div>

                    {/* Streak Stat */}
                    <div className="bg-white/5 rounded-3xl p-6 flex flex-col items-center text-center">
                        <Fire size={32} className="text-orange-500 mb-2" weight="fill" />
                        <span className="text-3xl font-black text-white">{streakDays}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Días de Racha</span>
                    </div>

                    {/* Daily Progress */}
                    <div className="bg-white/5 rounded-3xl p-6 flex flex-col items-center text-center col-span-2 md:col-span-1">
                        <TrendUp size={32} className="text-cyan-400 mb-2" weight="duotone" />
                        <span className="text-3xl font-black text-white">{dailyMinutes}m</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Hoy en el Dojo</span>
                    </div>

                    {/* Total Lifetime */}
                    <div className="bg-white/5 rounded-3xl p-6 flex flex-col items-center text-center col-span-2 md:col-span-1">
                        <CheckCircle size={32} className="text-kuma-gold mb-2" weight="duotone" />
                        <span className="text-3xl font-black text-white">{workoutCount}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Total Rutinas</span>
                    </div>
                </div>

                {/* Achievements Preview (if any) */}
                {achievements.length > 0 && (
                    <div className="mb-12">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] block text-center mb-6">Logros Obtenidos</span>
                        <div className="flex flex-wrap justify-center gap-6">
                            {achievements.map((ach, idx) => (
                                <div key={idx} className="flex flex-col items-center group">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Trophy size={32} style={{ color: ach.color || "#fbbf24" }} weight="fill" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white max-w-[100px] text-center">{ach.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={handleShare}
                        disabled={isGenerating}
                        className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-50 transition-colors active:scale-95 shadow-xl shadow-white/5"
                    >
                        {isGenerating ? (
                            <div className="w-6 h-6 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <ShareNetwork size={24} weight="bold" />
                                Compartir Victoria
                            </>
                        )}
                    </button>

                    <button
                        onClick={onBack}
                        className="w-full h-16 bg-zinc-800 text-zinc-400 rounded-2xl font-bold uppercase tracking-widest hover:text-white hover:bg-zinc-750 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <ArrowLeft size={20} weight="bold" />
                        Volver al Dojo
                    </button>
                </div>

                {/* Footer Link */}
                <p className="text-center mt-8 text-[11px] font-black text-zinc-600 uppercase tracking-widest">
                    Entrena más fácil en <span className="text-white">kumadojocr.com</span>
                </p>
            </motion.div>
        </div>
    );
}
