"use client";

import { motion } from "framer-motion";
import { Crown, Sparkles, Trophy, Calendar } from "lucide-react";
import { BeltSquare, getBeltColor } from "@/components/admin/AthleteEditModal";

interface Athlete {
    _id: string;
    name: string;
    email: string;
    image?: string;
    athleteProfile: {
        weight: number;
        height: number;
        beltRank: string;
        specialization: "Kata" | "Kumite" | "Ambos";
        stats: {
            vel: number;
            pot: number;
            tec: number;
            res: number;
            esp: number;
            ovr: number;
        };
        cc?: string;
        habilidadSecreta?: string;
        statsLastMonth?: {
            vel: number;
            pot: number;
            tec: number;
            res: number;
            esp: number;
            ovr: number;
        };
        mvpCount?: number;
    };
}

interface WeeklyMVPSectionProps {
    data: {
        athletes: Athlete[];
        count: number;
        weekRange: { start: string; end: string };
    };
    onClickCard: (athlete: Athlete) => void;
}

export function WeeklyMVPSection({ data, onClickCard }: WeeklyMVPSectionProps) {
    const { athletes, count, weekRange } = data;
    const isTie = athletes.length > 1;

    // Helper to format dates, e.g. "22 May"
    const formatDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split("-");
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        return dateObj.toLocaleDateString("es-CR", { day: "numeric", month: "short" });
    };

    const formattedRange = `${formatDate(weekRange.start)} - ${formatDate(weekRange.end)}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto mb-16 relative"
        >
            {/* Background ambient gold glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-3xl blur opacity-20 transition duration-1000" />
            
            {/* Main glassmorphic card */}
            <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl">
                {/* Decorative golden rays */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col items-center text-center relative z-10">
                    {/* Crown badge */}
                    <div className="relative mb-3 flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: [0, -5, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        >
                            <Crown className="w-12 h-12 text-kuma-gold filter drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
                        </motion.div>
                        <Sparkles className="absolute -top-1 -right-3 w-4 h-4 text-yellow-300 animate-pulse" />
                        <Sparkles className="absolute -bottom-1 -left-3 w-3 h-3 text-amber-400 animate-pulse delay-75" />
                    </div>

                    {/* Section Header */}
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase text-kuma-gold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm mb-1">
                        Dojo Honor Roll
                    </span>
                    <h2 className="text-2xl md:text-4xl font-serif font-black uppercase text-white tracking-tight mb-2">
                        {isTie ? "Guerreros de la Semana" : "Guerrero de la Semana"}
                    </h2>
                    
                    {/* Info subtitle with count and range */}
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-zinc-400 font-medium mb-6">
                        <span className="flex items-center gap-1 bg-amber-500/10 text-kuma-gold border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            {count} {count === 1 ? "Entrenamiento" : "Entrenamientos"}
                        </span>
                        <span className="flex items-center gap-1 bg-zinc-800/80 text-zinc-300 px-2.5 py-0.5 rounded-full">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            Semana: {formattedRange}
                        </span>
                        {isTie && (
                            <span className="bg-yellow-500/10 text-yellow-300 border border-yellow-500/25 px-2.5 py-0.5 rounded-full font-black uppercase text-[10px] tracking-wider animate-pulse">
                                ¡Empate de Honor!
                            </span>
                        )}
                    </div>

                    {/* MVP List */}
                    <div className="flex flex-wrap justify-center items-stretch gap-6 w-full max-w-3xl">
                        {athletes.map((athlete) => {
                            const beltStyle = getBeltColor(athlete.athleteProfile.beltRank);
                            const ovr = Math.round(athlete.athleteProfile.stats.ovr);
                            
                            return (
                                <motion.div
                                    key={athlete._id}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    onClick={() => onClickCard(athlete)}
                                    className="flex-1 min-w-[260px] max-w-[340px] bg-zinc-950/70 border border-white/5 hover:border-amber-500/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 shadow-lg cursor-pointer group"
                                >
                                    {/* Avatar with gold border */}
                                    <div className="relative shrink-0">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-kuma-gold shadow-[0_0_15px_rgba(212,175,55,0.25)] bg-zinc-900 flex items-center justify-center">
                                            {athlete.image ? (
                                                <img
                                                    src={athlete.image}
                                                    alt={athlete.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl font-black text-zinc-600 bg-zinc-900">
                                                    {athlete.name?.[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-kuma-gold text-black rounded-full p-1 shadow-md">
                                            <Trophy className="w-3.5 h-3.5" />
                                        </div>
                                    </div>

                                    {/* Info text */}
                                    <div className="text-left flex-1 min-w-0">
                                        <h4 className="text-white font-serif font-black uppercase text-sm group-hover:text-kuma-gold transition-colors duration-200 truncate flex items-center justify-between gap-1.5">
                                            <span>{athlete.name}</span>
                                            {athlete.athleteProfile.mvpCount && athlete.athleteProfile.mvpCount > 0 ? (
                                                <span className="text-[9px] font-black text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/25 flex items-center gap-0.5 shrink-0" title={`${athlete.athleteProfile.mvpCount} veces MVP del Día`}>
                                                    👑 {athlete.athleteProfile.mvpCount}
                                                </span>
                                            ) : null}
                                        </h4>
                                        
                                        {/* CC (Conocido Como / Alias) */}
                                        {athlete.athleteProfile.cc && (
                                            <p className="text-amber-500/80 text-[10px] font-black uppercase tracking-wider mb-0.5">
                                                &quot;{athlete.athleteProfile.cc}&quot;
                                            </p>
                                        )}

                                        {/* Belt rank details */}
                                        <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1">
                                            <BeltSquare beltRank={athlete.athleteProfile.beltRank} className="w-4 h-4 shrink-0" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider truncate" style={{ color: beltStyle.hex }}>
                                                {athlete.athleteProfile.beltRank}
                                            </span>
                                        </div>

                                        {/* Secret Skill / Habilidad Secreta */}
                                        {athlete.athleteProfile.habilidadSecreta && (
                                            <p className="text-zinc-500 text-[9px] font-medium italic mt-1.5 truncate">
                                                Skill: {athlete.athleteProfile.habilidadSecreta}
                                            </p>
                                        )}
                                    </div>

                                    {/* OVR Badge */}
                                    <div className="flex flex-col items-center justify-center bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 shrink-0 w-12 self-center">
                                        <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-0.5">OVR</span>
                                        <span className="text-lg font-serif font-black text-kuma-gold italic leading-none">{ovr}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
