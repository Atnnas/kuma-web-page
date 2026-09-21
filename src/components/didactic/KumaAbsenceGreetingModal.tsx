"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KumaMascot } from "./KumaMascot";
import { MascotMood } from "@/types/didactica";
import { didacticSound } from "@/lib/didacticSound";
import { InstallAppButton } from "./InstallAppButton";
import {
    Sparkle,
    WarningCircle,
    HeartBreak,
    Fire,
    ArrowRight,
    X,
    ClockCounterClockwise,
    ShieldStar,
} from "@phosphor-icons/react";

interface KumaAbsenceGreetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    daysAbsent: number;
    decayedLevelsCount?: number;
    isSuperAdmin?: boolean;
    onStartPractice?: () => void;
    onSimulateDays?: (days: number) => void;
}

export function KumaAbsenceGreetingModal({
    isOpen,
    onClose,
    daysAbsent: initialDaysAbsent,
    decayedLevelsCount = 0,
    isSuperAdmin = false,
    onStartPractice,
    onSimulateDays,
}: KumaAbsenceGreetingModalProps) {
    const [daysAbsent, setDaysAbsent] = useState(initialDaysAbsent);

    useEffect(() => {
        setDaysAbsent(initialDaysAbsent);
    }, [initialDaysAbsent]);

    useEffect(() => {
        if (!isOpen) return;
        // Sound cue on open
        if (daysAbsent >= 7) {
            didacticSound.playWrong();
        } else {
            didacticSound.playClick();
        }

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen, daysAbsent]);

    if (!isOpen) return null;

    // Mood & content mapping based on days absent
    let mood: MascotMood = "idle";
    let badgeLabel = "🟢 Disciplina Marcial Impecable";
    let badgeBorder = "border-emerald-500/40 bg-emerald-950/60 text-emerald-300";
    let title = "¡Bienvenido al Dojo, Guerrero!";
    let subtitle = "Tu constancia diaria mantiene tus estrellas radiantes y tu mente lista.";
    let speechMessage = "¡Ossu! Me alegra ver tu disciplina en el tatami hoy. ¡A por la lección!";
    let buttonText = "¡Continuar Mi Camino! 🥋";
    let buttonStyle = "from-amber-500 to-kuma-gold text-zinc-950 shadow-kuma-gold/30";

    if (daysAbsent >= 14) {
        mood = "crying";
        badgeLabel = "⚪ Tatami Frío & Niveles Oxidados";
        badgeBorder = "border-blue-500/40 bg-blue-950/70 text-blue-300 animate-pulse";
        title = "¡Pensé que habías abandonado el Dojo!";
        subtitle = `Llevas más de dos semanas ausente (${daysAbsent} días). El tatami está frío y tus niveles se han oxidado por inactividad.`;
        speechMessage = "¡No me dejes solo en el tatami! 😭 ¡Pero levantarse de una caída es de verdaderos maestros! ¡Rescatemos tus estrellas!";
        buttonText = "¡Rescatar Mi Dojo Inmediatamente! 🥋";
        buttonStyle = "from-blue-600 via-cyan-500 to-emerald-400 text-zinc-950 shadow-cyan-500/30";
    } else if (daysAbsent >= 7) {
        mood = "sad";
        badgeLabel = "🔴 Desgaste Marcial por Inactividad";
        badgeBorder = "border-red-500/40 bg-red-950/70 text-red-300";
        title = "¡Te Extrañé Mucho en el Dojo!";
        subtitle = `Ha pasado una semana sin verte (${daysAbsent} días). La falta de repaso ha hecho que pierdas 1 estrella en tus niveles superados.`;
        speechMessage = "¡Te extrañé en el dojo! Por pasar una semana inactivo, tus estrellas decayeron. 🥺 ¡Basta 1 práctica perfecta hoy para recuperarlas!";
        buttonText = "¡Restaurar Mis Estrellas Ahora! 🥋";
        buttonStyle = "from-red-600 to-amber-500 text-white shadow-red-500/30";
    } else if (daysAbsent >= 4) {
        mood = "sad";
        badgeLabel = "🟠 Advertencia de Enfriamiento";
        badgeBorder = "border-amber-500/40 bg-amber-950/70 text-amber-300";
        title = "¡Tus Estrellas están Titilando!";
        subtitle = `Llevas ${daysAbsent} días sin entrar. Tu tercera estrella está empezando a desgastarse. Si no repasas pronto, perderás brillo.`;
        speechMessage = "¡Por fin volviste! Llevas varios días ausente. ¡Entrenemos ahora para que no se desgasten tus estrellas!";
        buttonText = "¡Salvar Mis Estrellas! 🥋";
        buttonStyle = "from-amber-600 to-yellow-400 text-zinc-950 shadow-amber-500/30";
    } else if (daysAbsent >= 2) {
        mood = "thinking";
        badgeLabel = "🟡 Alerta de Repaso Recomendado";
        badgeBorder = "border-yellow-500/40 bg-yellow-950/60 text-yellow-300";
        title = "¡La Memoria Muscular se Enfría!";
        subtitle = `Han pasado ${daysAbsent} días desde tu última visita. Recuerda que la técnica se mantiene viva mediante la repetición constante.`;
        speechMessage = "¡Hola de nuevo! Recuerda que la mente se entrena a diario. ¡Repasemos un nivel hoy!";
        buttonText = "¡Repasar Ahora! 🥋";
        buttonStyle = "from-amber-500 to-kuma-gold text-zinc-950 shadow-kuma-gold/30";
    }

    const handleSimulation = (days: number) => {
        didacticSound.playClick();
        setDaysAbsent(days);
        if (onSimulateDays) {
            onSimulateDays(days);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 25 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 25 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-kuma-gold/40 rounded-3xl shadow-[0_0_60px_rgba(234,179,8,0.2)] my-auto flex flex-col"
                >
                    {/* Top Golden Light Rim */}
                    <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-kuma-gold to-transparent" />

                    {/* Header with Close */}
                    <div className="relative px-4 sm:px-6 pt-5 flex items-center justify-between z-20">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${badgeBorder} shadow-sm`}>
                            {daysAbsent >= 14 ? (
                                <ClockCounterClockwise className="w-3.5 h-3.5 animate-spin" />
                            ) : daysAbsent >= 7 ? (
                                <HeartBreak className="w-3.5 h-3.5 text-red-400" weight="fill" />
                            ) : daysAbsent >= 4 ? (
                                <WarningCircle className="w-3.5 h-3.5 text-amber-400" weight="fill" />
                            ) : (
                                <Sparkle className="w-3.5 h-3.5 text-emerald-400" weight="fill" />
                            )}
                            <span>{badgeLabel}</span>
                        </span>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-950/60 border border-white/20 hover:border-red-500/40 flex items-center justify-center text-zinc-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="Cerrar saludo"
                        >
                            <X className="w-4 h-4" weight="bold" />
                        </button>
                    </div>

                    {/* Mascot Area */}
                    <div className="px-3 sm:px-6 pt-3 pb-2 flex flex-col items-center justify-center">
                        <KumaMascot
                            mood={mood}
                            customMessage={speechMessage}
                            size="responsive"
                            showBubble={true}
                            interactive={true}
                        />

                        {/* Title & Description */}
                        <div className="text-center mt-3 space-y-1.5 max-w-md">
                            <h3 className="text-2xl md:text-3xl font-serif font-black text-white tracking-tight leading-snug drop-shadow-md">
                                {title}
                            </h3>
                            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                                {subtitle}
                            </p>
                        </div>

                        {/* Days absent indicator & star decay notice */}
                        <div className="mt-4 w-full grid grid-cols-2 gap-2.5 max-w-sm">
                            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-white/10 text-center">
                                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">
                                    Tiempo de Ausencia
                                </span>
                                <span className="text-lg font-serif font-black text-amber-200">
                                    {daysAbsent === 0 ? "¡Entraste hoy!" : `${daysAbsent} ${daysAbsent === 1 ? "día" : "días"}`}
                                </span>
                            </div>

                            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-white/10 text-center">
                                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">
                                    Estado de Estrellas
                                </span>
                                <span className={`text-lg font-serif font-black ${daysAbsent >= 14 ? "text-blue-400" : daysAbsent >= 7 ? "text-red-400" : daysAbsent >= 4 ? "text-amber-400" : "text-emerald-400"}`}>
                                    {daysAbsent >= 14 ? "0★ (Oxidadas)" : daysAbsent >= 7 ? "-1★ (Desgaste)" : daysAbsent >= 4 ? "3★ (Titilando)" : "3★ (Intactas)"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Primary Action Button */}
                    <div className="p-6 pt-3 pb-5 flex flex-col gap-3">
                        <button
                            onClick={() => {
                                onClose();
                                if (onStartPractice) onStartPractice();
                            }}
                            className={`w-full py-4 rounded-2xl bg-gradient-to-r ${buttonStyle} font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer`}
                        >
                            <span>{buttonText}</span>
                            <ArrowRight className="w-5 h-5" weight="bold" />
                        </button>

                        {/* Quick Mobile / Desktop Install Option */}
                        <InstallAppButton variant="compact" className="w-full justify-center py-2.5" />

                        {/* Super Admin Simulator Toolbar */}
                        {isSuperAdmin && (
                            <div className="mt-2 p-3 rounded-2xl bg-zinc-900/90 border border-amber-500/30 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                                        <ShieldStar className="w-3.5 h-3.5 text-amber-400" weight="fill" />
                                        <span>Modo Super Admin — Probar Estados Emocionales:</span>
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {[
                                        { label: "Hoy (0d)", days: 0, icon: "🥋" },
                                        { label: "3 días", days: 3, icon: "🧐" },
                                        { label: "7 días", days: 7, icon: "🥺" },
                                        { label: "14 días", days: 14, icon: "😭" },
                                    ].map((btn) => (
                                        <button
                                            key={btn.days}
                                            type="button"
                                            onClick={() => handleSimulation(btn.days)}
                                            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                                                daysAbsent === btn.days
                                                    ? "bg-amber-500/20 border-kuma-gold text-amber-200 shadow-[0_0_12px_rgba(234,179,8,0.3)] font-black"
                                                    : "bg-black/50 border-white/10 hover:border-white/25 text-zinc-300"
                                            }`}
                                        >
                                            <span className="text-xs">{btn.icon}</span>
                                            <span>{btn.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
