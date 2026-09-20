"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Sparkle,
    Star,
    Flame,
    Clock,
    CalendarCheck,
    CheckCircle2,
    AlertTriangle,
    ShieldAlert,
    GraduationCap,
    ArrowUpRight,
    Loader2,
    UserCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BeltSquare } from "@/components/admin/AthleteEditModal";

export interface DidacticAuditAthlete {
    id: string;
    name: string;
    email: string;
    image?: string;
    beltRank: string;
    dojoName?: string;
    ovr?: number;
    didactic?: {
        hasStarted: boolean;
        completedLevelsCount: number;
        totalLevelsCount: number;
        progressPercent: number;
        xp: number;
        streak: number;
        stars: number;
        lastVisitedTimestamp: number | null;
        daysInactive: number | null;
        senseiMood: "happy" | "concerned" | "sad" | "crying" | "never";
        currentBeltId: string;
        currentBeltName: string;
        currentBeltColor: string;
        currentBeltShortName: string;
        activePath: string;
    };
}

interface AthleteDidacticAuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    athlete: DidacticAuditAthlete | null;
}

export function AthleteDidacticAuditModal({
    isOpen,
    onClose,
    athlete,
}: AthleteDidacticAuditModalProps) {
    const [details, setDetails] = useState<DidacticAuditAthlete | null>(athlete);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !athlete) return;
        setDetails(athlete);

        // If didactic data is not yet loaded on this athlete object, fetch it
        if (!athlete.didactic) {
            setIsLoading(true);
            fetch("/api/admin/reports/didactica")
                .then((res) => res.json())
                .then((json) => {
                    if (json?.success && Array.isArray(json.data)) {
                        const found = json.data.find((a: any) => a.id === athlete.id);
                        if (found) {
                            setDetails(found);
                        }
                    }
                })
                .catch((e) => console.error("Error fetching didactic audit:", e))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, athlete]);

    if (!isOpen || !athlete) return null;

    const didactic = details?.didactic;
    const mood = didactic?.senseiMood || "never";
    const daysInactive = didactic?.daysInactive ?? null;

    // Mood configuration
    const moodConfig = {
        happy: {
            title: "Disciplina Impecable • Sensei Feliz",
            badge: "🟢 Activo & Al Día",
            badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            glow: "from-emerald-500/10 via-transparent to-transparent",
            desc: "El estudiante practica con regularidad. La memoria muscular y teórica se encuentra en su punto óptimo.",
            icon: "🥋",
        },
        concerned: {
            title: "Alerta de Enfriamiento • Sensei Pensativo",
            badge: "🟠 4 a 6 días ausente",
            badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
            glow: "from-amber-500/10 via-transparent to-transparent",
            desc: "Han pasado varios días sin repasar. Si no practica pronto, las estrellas de sus niveles comenzarán a desgastarse.",
            icon: "🧐",
        },
        sad: {
            title: "Desgaste Marcial • Sensei Preocupado",
            badge: "🔴 7 a 13 días sin ingresar",
            badgeClass: "bg-red-500/20 text-red-300 border-red-500/30",
            glow: "from-red-500/10 via-transparent to-transparent",
            desc: "El estudiante está perdiendo estrellas ganadas por desuso. Requiere motivación en clase para reanudar el sendero.",
            icon: "🥺",
        },
        crying: {
            title: "Tatami Frío • Abandono Crítico",
            badge: "😭 14+ días inactivo",
            badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
            glow: "from-blue-600/15 via-transparent to-transparent",
            desc: "Kuma Sensei está llorando en el dojo vacío. Todos sus niveles se encuentran oxidados a 0 estrellas por inactividad prolongada.",
            icon: "😭",
        },
        never: {
            title: "Sin Registro Inicial en el Tatami Didáctico",
            badge: "⚪ Aún no ha iniciado",
            badgeClass: "bg-zinc-800 text-zinc-400 border-zinc-700",
            glow: "from-zinc-800/10 via-transparent to-transparent",
            desc: "Este atleta no ha completado ninguna lección teórica interactiva aún.",
            icon: "📜",
        },
    }[mood];

    const formatTimestamp = (ts?: number | null) => {
        if (!ts) return "Sin registros previos";
        const d = new Date(ts);
        return d.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-kuma-gold/50 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden"
                >
                    {/* Ambient light glow */}
                    <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none bg-gradient-to-br ${moodConfig.glow}`} />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10 z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header: Athlete identity */}
                    <div className="flex items-center gap-4 pb-5 border-b border-white/10 relative z-10">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-kuma-gold shrink-0 shadow-lg">
                            {athlete.image ? (
                                <Image src={athlete.image} alt={athlete.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl font-black text-zinc-500">
                                    {athlete.name?.[0]}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-kuma-gold/15 text-kuma-gold border border-kuma-gold/40">
                                    Auditoría Super Admin
                                </span>
                                <span className="text-xs text-zinc-400">
                                    {athlete.dojoName || "Kuma Dojo"}
                                </span>
                            </div>

                            <h3 className="text-lg md:text-xl font-serif font-black text-white truncate mt-1">
                                {athlete.name}
                            </h3>

                            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                                <BeltSquare beltRank={athlete.beltRank} className="w-3.5 h-3.5" />
                                <span className="font-bold text-zinc-300">{athlete.beltRank}</span>
                                <span>•</span>
                                <span className="text-zinc-500 truncate">{athlete.email}</span>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="py-16 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 text-kuma-gold animate-spin" />
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                                Consultando telemetría del atleta...
                            </p>
                        </div>
                    ) : (
                        <div className="mt-5 space-y-5 relative z-10">
                            {/* KUMA SENSEI STATUS CARD */}
                            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-start gap-3.5">
                                <div className="text-3xl select-none shrink-0 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                                    {moodConfig.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                                        <h4 className="text-xs md:text-sm font-serif font-black text-white">
                                            {moodConfig.title}
                                        </h4>
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${moodConfig.badgeClass}`}>
                                            {moodConfig.badge}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                                        {moodConfig.desc}
                                    </p>
                                </div>
                            </div>

                            {/* KEY METRICS GRID */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {/* Metric 1: Progreso */}
                                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                                        Avance Sendero
                                    </span>
                                    <span className="text-xl font-black text-white mt-1">
                                        {didactic?.progressPercent || 0}%
                                    </span>
                                    <span className="text-[10px] text-zinc-400 mt-0.5">
                                        {didactic?.completedLevelsCount || 0} / {didactic?.totalLevelsCount || 60} grados
                                    </span>
                                </div>

                                {/* Metric 2: XP */}
                                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                                        Poder XP
                                    </span>
                                    <span className="text-xl font-black text-kuma-gold mt-1 flex items-center gap-1">
                                        <Sparkle className="w-4 h-4 text-kuma-gold" />
                                        {didactic?.xp || 0}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 mt-0.5">
                                        Puntos marciales
                                    </span>
                                </div>

                                {/* Metric 3: Estrellas */}
                                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                                        Estrellas
                                    </span>
                                    <span className="text-xl font-black text-amber-400 mt-1 flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-amber-400" />
                                        {didactic?.stars || 0}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 mt-0.5">
                                        Evaluaciones ★
                                    </span>
                                </div>

                                {/* Metric 4: Racha */}
                                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                                        Racha Activa
                                    </span>
                                    <span className="text-xl font-black text-orange-400 mt-1 flex items-center gap-1">
                                        <Flame className="w-4 h-4 fill-orange-400" />
                                        {didactic?.streak || 0}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 mt-0.5">
                                        Días seguidos
                                    </span>
                                </div>
                            </div>

                            {/* CURRENT BELT STAGE & LAST ACTIVITY */}
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-400 flex items-center gap-1.5">
                                        <GraduationCap className="w-4 h-4 text-kuma-gold" />
                                        Cinturón Didáctico en Curso:
                                    </span>
                                    <span
                                        className="font-serif font-black px-2.5 py-0.5 rounded-full border text-[11px]"
                                        style={{
                                            backgroundColor: `${didactic?.currentBeltColor || "#fff"}15`,
                                            borderColor: `${didactic?.currentBeltColor || "#fff"}40`,
                                            color: didactic?.currentBeltColor === "#F8FAFC" ? "#E2E8F0" : didactic?.currentBeltColor,
                                        }}
                                    >
                                        {didactic?.currentBeltName || "10° Kyu — Blanco"}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-kuma-gold transition-all duration-500"
                                        style={{ width: `${didactic?.progressPercent || 0}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-white/5">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                        Última sesión registrada:
                                    </span>
                                    <span className="font-bold text-zinc-200">
                                        {formatTimestamp(didactic?.lastVisitedTimestamp)}
                                    </span>
                                </div>
                            </div>

                            {/* FOOTER ACTION BUTTONS */}
                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <Link
                                    href="/admin/reports/didactica"
                                    onClick={onClose}
                                    className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-kuma-gold to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-serif font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] cursor-pointer"
                                >
                                    <span>Ver Reporte General del Dojo</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>

                                <button
                                    onClick={onClose}
                                    className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/10 cursor-pointer"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
