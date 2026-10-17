"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, Trophy, Calendar, Flame, RotateCcw, Building2, ChevronDown, Loader2, Share2 } from "lucide-react";
import Image from "next/image";
import { BeltSquare, getBeltColor } from "@/components/admin/AthleteEditModal";
import { getWeeklyMVP } from "@/lib/actions/attendance";
import { ShareCardModal } from "@/components/share/ShareCardModal";

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
        dojo?: {
            _id?: string;
            name?: string;
            logo?: string;
        } | null;
    };
}

interface DojoItem {
    _id: string;
    name: string;
    logo?: string;
}

interface WeeklyMVPSectionProps {
    data: {
        lastDailyMvp?: {
            date: string;
            athletes: Athlete[];
        } | null;
        weeklyAttendance?: {
            athletes: Athlete[];
            count: number;
            weekRange: { start: string; end: string };
        };
        // Backwards compatibility
        athletes?: Athlete[];
        count?: number;
        weekRange?: { start: string; end: string };
    };
    dojos?: DojoItem[];
    selectedDojoId?: string;
    onDojoChange?: (dojoId: string) => void;
    onClickCard: (athlete: any) => void;
}

export function WeeklyMVPSection({ 
    data, 
    dojos = [], 
    selectedDojoId: propSelectedDojoId,
    onDojoChange,
    onClickCard 
}: WeeklyMVPSectionProps) {
    // Local copy of data that can be updated via the Dojo selector
    const [mvpData, setMvpData] = useState(data);
    const [internalDojoId, setInternalDojoId] = useState<string>(propSelectedDojoId || "Todos");
    const [isLoadingDojo, setIsLoadingDojo] = useState(false);
    const [sharingAthlete, setSharingAthlete] = useState<Athlete | null>(null);

    const currentDojoId = propSelectedDojoId !== undefined ? propSelectedDojoId : internalDojoId;

    // Keep local data in sync if parent data updates
    useEffect(() => {
        setMvpData(data);
    }, [data]);

    const fetchDojoMvp = async (dojoId: string) => {
        setIsLoadingDojo(true);
        try {
            const filterParam = dojoId === "Todos" ? undefined : dojoId;
            const updated = await getWeeklyMVP(filterParam);
            if (updated) {
                setMvpData(updated);
                const hasDaily = updated.lastDailyMvp?.athletes && updated.lastDailyMvp.athletes.length > 0;
                const hasWeekly = updated.weeklyAttendance?.athletes && updated.weeklyAttendance.athletes.length > 0;
                if (activeTab === "daily" && !hasDaily && hasWeekly) {
                    setActiveTab("weekly");
                } else if (activeTab === "weekly" && !hasWeekly && hasDaily) {
                    setActiveTab("daily");
                }
            }
        } catch (err) {
            console.error("Error filtering Kumas by dojo:", err);
        } finally {
            setIsLoadingDojo(false);
        }
    };

    // When propSelectedDojoId changes from parent, sync and fetch
    useEffect(() => {
        if (propSelectedDojoId !== undefined && propSelectedDojoId !== internalDojoId) {
            setInternalDojoId(propSelectedDojoId);
            fetchDojoMvp(propSelectedDojoId);
        }
    }, [propSelectedDojoId]);

    // Extract daily MVP and weekly attendance data with fallbacks
    const dailyMvp = mvpData.lastDailyMvp && mvpData.lastDailyMvp.athletes && mvpData.lastDailyMvp.athletes.length > 0 
        ? mvpData.lastDailyMvp 
        : null;

    const weeklyMvp = mvpData.weeklyAttendance && mvpData.weeklyAttendance.athletes && mvpData.weeklyAttendance.athletes.length > 0
        ? mvpData.weeklyAttendance
        : mvpData.athletes && mvpData.athletes.length > 0
        ? { athletes: mvpData.athletes, count: mvpData.count || 0, weekRange: mvpData.weekRange || { start: "", end: "" } }
        : null;

    // Intro Animation State: Starts with the circular Dojo Logo emblem, then dissolves to reveal the Kumas
    const [isIntroActive, setIsIntroActive] = useState(true);
    const [isDissolving, setIsDissolving] = useState(false);

    // Active tab: "daily" (Último MVP del Día) vs "weekly" (Kumas con más asistencia en la semana anterior)
    const [activeTab, setActiveTab] = useState<"daily" | "weekly">(dailyMvp ? "daily" : "weekly");
    const [isPaused, setIsPaused] = useState(false);

    // Initial sequence: Emblem spins and pulses -> dissolves after 1.7s -> Kumas reveal
    useEffect(() => {
        const dissolveTimer = setTimeout(() => {
            setIsDissolving(true);
        }, 1700);

        const endIntroTimer = setTimeout(() => {
            setIsIntroActive(false);
            setIsDissolving(false);
        }, 2200);

        return () => {
            clearTimeout(dissolveTimer);
            clearTimeout(endIntroTimer);
        };
    }, []);

    // Automatic smooth cycle between Daily MVP and Weekly Attendance every 7 seconds
    useEffect(() => {
        if (!dailyMvp || !weeklyMvp || isIntroActive || isPaused || isLoadingDojo) return;

        const cycleTimer = setInterval(() => {
            setActiveTab((prev) => (prev === "daily" ? "weekly" : "daily"));
        }, 7000);

        return () => clearInterval(cycleTimer);
    }, [dailyMvp, weeklyMvp, isIntroActive, isPaused, isLoadingDojo]);

    // Replay the intro logo animation
    const handleReplayIntro = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsIntroActive(true);
        setIsDissolving(false);
        setTimeout(() => setIsDissolving(true), 1700);
        setTimeout(() => {
            setIsIntroActive(false);
            setIsDissolving(false);
        }, 2200);
    };

    // Handler when user selects a Dojo from the combo
    const handleDojoChange = (dojoId: string) => {
        setInternalDojoId(dojoId);
        onDojoChange?.(dojoId);
        fetchDojoMvp(dojoId);
    };

    // Helper to format dates (e.g. "2026-10-15" -> "15 Oct")
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        const parts = dateStr.split("-");
        if (parts.length !== 3) return dateStr;
        const [y, m, d] = parts;
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        return dateObj.toLocaleDateString("es-CR", { day: "numeric", month: "short" });
    };

    const formattedWeekRange = weeklyMvp?.weekRange
        ? `${formatDate(weeklyMvp.weekRange.start)} - ${formatDate(weeklyMvp.weekRange.end)}`
        : "";

    const activeAthletes = activeTab === "daily" 
        ? (dailyMvp?.athletes || []) 
        : (weeklyMvp?.athletes || []);

    const isTie = activeAthletes.length > 1;

    // Selected dojo info for branding
    const selectedDojoObj = dojos.find((d) => d._id === currentDojoId);
    const displayedDojoName = selectedDojoObj ? selectedDojoObj.name : "KUMA DOJO";
    const displayedDojoLogo = selectedDojoObj?.logo || "/images/kuma-logo.jpg";

    return (
        <div 
            className="w-full max-w-4xl mx-auto mb-16 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Ambient Gold & Crimson Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-red-600/15 to-yellow-500/20 rounded-3xl blur-xl opacity-75 transition duration-1000 pointer-events-none" />

            {/* Main Luxury Frame */}
            <div className="relative bg-zinc-950/80 backdrop-blur-2xl border border-white/10 hover:border-amber-500/30 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl transition-all duration-500 min-h-[380px] flex flex-col justify-center">
                
                {/* Decorative Ambient Halos */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-red-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-gradient-to-tr from-yellow-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                <AnimatePresence mode="wait">
                    {/* ========================================================================= */}
                    {/* STAGE 1: DOJO LOGO INTRO ANIMATION (Similar to the home hero reveal)       */}
                    {/* ========================================================================= */}
                    {isIntroActive ? (
                        <motion.div
                            key="intro-logo"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isDissolving ? 0 : 1 }}
                            exit={{ opacity: 0, scale: 1.15, filter: "blur(14px)" }}
                            transition={{ duration: isDissolving ? 0.5 : 0.4 }}
                            className="flex flex-col items-center justify-center py-10 z-20"
                        >
                            {/* Dojo Logo Emblem with golden halo */}
                            <motion.div
                                initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 110,
                                    damping: 15,
                                    duration: 1.2
                                }}
                                className="relative mb-6"
                            >
                                {/* Pulsing Halo */}
                                <motion.div 
                                    animate={{
                                        scale: [1, 1.08, 1],
                                        filter: [
                                            "drop-shadow(0 0 25px rgba(212,175,55,0.4))",
                                            "drop-shadow(0 0 55px rgba(220,38,38,0.7))",
                                            "drop-shadow(0 0 25px rgba(212,175,55,0.4))"
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative"
                                >
                                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-[#6F4E37] relative bg-black shadow-[0_0_40px_rgba(212,175,55,0.35)]">
                                        <Image
                                            src={displayedDojoLogo}
                                            alt={displayedDojoName}
                                            fill
                                            className="object-cover"
                                            priority
                                        />

                                        {/* Inner Light Sweep Effect */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
                                            animate={{ x: ["-100%", "200%"] }}
                                            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
                                        />
                                    </div>
                                </motion.div>

                                {/* Sparkles */}
                                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
                                <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-amber-400 animate-pulse delay-100" />
                            </motion.div>

                            {/* Presentation Banner */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-center"
                            >
                                <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-kuma-gold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-md">
                                    {displayedDojoName} · SALÓN DE HONOR
                                </span>
                                <h3 className="text-xl md:text-3xl font-serif font-black uppercase text-white tracking-widest mt-1">
                                    Kumas del Dojo
                                </h3>
                                <p className="text-xs text-zinc-400 font-medium mt-1">
                                    Fuerza, disciplina, constancia y espíritu indomable
                                </p>
                                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-kuma-gold to-transparent mx-auto mt-2 rounded-full" />
                            </motion.div>
                        </motion.div>
                    ) : (
                        /* ========================================================================= */
                        /* STAGE 2: KUMAS SHOWCASE (Kuma MVP del Día & Mayor Asistencia)             */
                        /* ========================================================================= */
                        <motion.div
                            key="showcase-content"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col items-center text-center relative z-10"
                        >
                            {/* Top Control Bar: Dojo Combobox, Replay Button & Category Switch Tabs */}
                            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-white/5">
                                
                                {/* Left: Dojo Honor Crest & Filter Combobox */}
                                <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-start">
                                    <div className="w-7 h-7 rounded-full overflow-hidden border border-kuma-gold/50 relative shadow-sm shrink-0">
                                        <Image src={displayedDojoLogo} alt={displayedDojoName} fill className="object-cover" />
                                    </div>

                                    {/* DOJO COMBOBOX SELECTOR */}
                                    <div className="relative inline-flex items-center">
                                        <div className="flex items-center bg-zinc-900/90 border border-amber-500/30 hover:border-amber-500/60 rounded-full pl-2.5 pr-2 py-1 shadow-inner gap-1.5 transition-all">
                                            <Building2 className="w-3 h-3 text-kuma-gold shrink-0" />
                                            <select
                                                value={currentDojoId}
                                                onChange={(e) => handleDojoChange(e.target.value)}
                                                disabled={isLoadingDojo}
                                                aria-label="Seleccionar Dojo para ver Kumas"
                                                className="bg-transparent text-white text-[10px] md:text-xs font-serif font-black uppercase tracking-wider focus:outline-none cursor-pointer pr-4 appearance-none"
                                            >
                                                <option value="Todos" className="bg-zinc-950 text-white">Todos los Dojos</option>
                                                {dojos.map((d) => (
                                                    <option key={d._id} value={d._id} className="bg-zinc-950 text-white">
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {isLoadingDojo ? (
                                                <Loader2 className="w-3 h-3 text-kuma-gold animate-spin -ml-3 pointer-events-none" />
                                            ) : (
                                                <ChevronDown className="w-3 h-3 text-zinc-400 -ml-3 pointer-events-none" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Category Tabs & Replay */}
                                <div className="flex items-center bg-zinc-900/90 border border-white/10 p-1 rounded-full shadow-inner gap-1">
                                    {dailyMvp && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("daily")}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 leading-none ${
                                                activeTab === "daily"
                                                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md shadow-yellow-500/30"
                                                    : "text-zinc-400 hover:text-white"
                                            }`}
                                        >
                                            <Crown className="w-3 h-3 stroke-[2.5]" />
                                            <span>Kuma MVP</span>
                                            {dailyMvp.date && (
                                                <span className={`text-[8px] px-1.5 py-0.2 rounded-full ${
                                                    activeTab === "daily" ? "bg-black/25 text-black font-bold" : "bg-zinc-800 text-zinc-400"
                                                }`}>
                                                    {formatDate(dailyMvp.date)}
                                                </span>
                                            )}
                                        </button>
                                    )}

                                    {weeklyMvp && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("weekly")}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 leading-none ${
                                                activeTab === "weekly"
                                                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md shadow-yellow-500/30"
                                                    : "text-zinc-400 hover:text-white"
                                            }`}
                                        >
                                            <Flame className="w-3 h-3 stroke-[2.5]" />
                                            <span>Constancia Kuma</span>
                                            <span className={`text-[8px] px-1.5 py-0.2 rounded-full ${
                                                activeTab === "weekly" ? "bg-black/25 text-black font-bold" : "bg-zinc-800 text-zinc-400"
                                            }`}>
                                                Semana
                                            </span>
                                        </button>
                                    )}

                                    {/* Replay Intro Button */}
                                    <button
                                        type="button"
                                        onClick={handleReplayIntro}
                                        title="Repetir animación del logo del Dojo"
                                        className="p-1 text-zinc-500 hover:text-kuma-gold hover:bg-zinc-800 rounded-full transition-colors ml-0.5"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Card Content Animated by Tab */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeTab}-${currentDojoId}`}
                                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                    className="w-full flex flex-col items-center"
                                >
                                    {/* Section Heading */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            {activeTab === "daily" ? (
                                                <Crown className="w-6 h-6 text-kuma-gold animate-bounce" />
                                            ) : (
                                                <Trophy className="w-6 h-6 text-kuma-gold animate-bounce" />
                                            )}
                                            <h2 className="text-2xl md:text-3xl font-serif font-black uppercase text-white tracking-wide">
                                                {activeTab === "daily" 
                                                    ? (isTie ? "Kumas MVP del Día" : "Kuma MVP del Día")
                                                    : (isTie ? "Kumas de la Semana" : "Kuma de la Semana")}
                                            </h2>
                                        </div>

                                        {/* Subtitle with details */}
                                        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400 font-medium">
                                            {activeTab === "daily" ? (
                                                <span className="flex items-center gap-1 bg-yellow-500/10 text-kuma-gold border border-yellow-500/20 px-3 py-0.5 rounded-full font-bold">
                                                    <Calendar className="w-3 h-3" />
                                                    Entrenamiento del {formatDate(dailyMvp?.date)} · Desempeño y Entrega en Tatami
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="flex items-center gap-1 bg-amber-500/10 text-kuma-gold border border-amber-500/20 px-3 py-0.5 rounded-full font-bold">
                                                        <Flame className="w-3 h-3 text-red-500" />
                                                        Constancia de Acero: {weeklyMvp?.count} {weeklyMvp?.count === 1 ? "Entrenamiento" : "Entrenamientos"}
                                                    </span>
                                                    {formattedWeekRange && (
                                                        <span className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-0.5 rounded-full">
                                                            <Calendar className="w-3 h-3 text-zinc-500" />
                                                            Semana: {formattedWeekRange}
                                                        </span>
                                                    )}
                                                </>
                                            )}

                                            {isTie && (
                                                <span className="bg-yellow-500/10 text-yellow-300 border border-yellow-500/25 px-2.5 py-0.5 rounded-full font-black uppercase text-[9px] tracking-wider animate-pulse">
                                                    ¡Honor Compartido!
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Empty state when selected Dojo has no records */}
                                    {activeAthletes.length === 0 ? (
                                        <div className="py-12 px-4 text-center max-w-md mx-auto">
                                            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-kuma-gold mx-auto mb-3">
                                                <Sparkles className="w-6 h-6 text-kuma-gold/80" />
                                            </div>
                                            <h4 className="text-white font-serif font-black text-sm uppercase tracking-wide">
                                                Sin registros aún en {displayedDojoName}
                                            </h4>
                                            <p className="text-zinc-400 text-xs mt-1">
                                                El camino Kuma continúa forjándose en el tatami con cada entrenamiento.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => handleDojoChange("Todos")}
                                                className="mt-4 px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-black uppercase tracking-wider text-kuma-gold transition-all cursor-pointer"
                                            >
                                                Ver Todos los Dojos
                                            </button>
                                        </div>
                                    ) : (
                                        /* Athlete Cards List */
                                        <div className="flex flex-wrap justify-center items-stretch gap-5 w-full max-w-3xl mt-2">
                                            {activeAthletes.map((athlete, index) => {
                                                const beltStyle = getBeltColor(athlete.athleteProfile.beltRank);
                                                const ovr = Math.round(athlete.athleteProfile.stats.ovr);
                                                const dojo = athlete.athleteProfile?.dojo;
                                                const dojoName = dojo?.name || "DOJO KUMA";
                                                const dojoLogo = dojo?.logo || "/images/kuma-logo.jpg";

                                                return (
                                                    <motion.div
                                                        key={`${athlete._id}-${index}`}
                                                        whileHover={{ scale: 1.025, y: -3 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => onClickCard(athlete)}
                                                        className="flex-1 min-w-[270px] max-w-[350px] bg-zinc-900/70 hover:bg-zinc-900 border border-white/5 hover:border-amber-500/40 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 shadow-xl cursor-pointer group relative overflow-hidden"
                                                    >
                                                        {/* Background light glow on hover */}
                                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                                        {/* Avatar Portrait with Golden Halo */}
                                                        <div className="relative shrink-0">
                                                            <div className="w-18 h-18 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-kuma-gold shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-zinc-950 flex items-center justify-center">
                                                                {athlete.image ? (
                                                                    <img
                                                                        src={athlete.image}
                                                                        alt={athlete.name}
                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    />
                                                                ) : (
                                                                    <span className="text-3xl font-serif font-black text-zinc-600">
                                                                        {athlete.name?.[0]}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Badge Icon (Crown for MVP, Trophy for Weekly) */}
                                                            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-full p-1.5 shadow-lg border border-yellow-200">
                                                                {activeTab === "daily" ? (
                                                                    <Crown className="w-3.5 h-3.5 stroke-[2.5]" />
                                                                ) : (
                                                                    <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Athlete Information */}
                                                        <div className="text-left flex-1 min-w-0 z-10">
                                                            <h4 className="text-white font-serif font-black uppercase text-sm md:text-base group-hover:text-kuma-gold transition-colors duration-200 truncate flex items-center justify-between gap-1.5">
                                                                <span className="truncate">{athlete.name}</span>
                                                                {athlete.athleteProfile.mvpCount && athlete.athleteProfile.mvpCount > 0 ? (
                                                                    <span 
                                                                        className="text-[9px] font-black text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/25 flex items-center gap-0.5 shrink-0" 
                                                                        title={`${athlete.athleteProfile.mvpCount} veces MVP del Dojo`}
                                                                    >
                                                                        👑 {athlete.athleteProfile.mvpCount}
                                                                    </span>
                                                                ) : null}
                                                            </h4>

                                                            {/* Known as / Alias */}
                                                            {athlete.athleteProfile.cc && (
                                                                <p className="text-amber-400/90 text-[10px] font-black uppercase tracking-wider mb-1 truncate">
                                                                    &quot;{athlete.athleteProfile.cc}&quot;
                                                                </p>
                                                            )}

                                                            {/* Dojo Badge with logo */}
                                                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                                                <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-zinc-700 relative shrink-0">
                                                                    <img src={dojoLogo} alt={dojoName} className="w-full h-full object-cover" />
                                                                </div>
                                                                <span className="truncate max-w-[120px] text-zinc-300">{dojoName}</span>
                                                            </div>

                                                            {/* Belt Rank */}
                                                            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1">
                                                                <BeltSquare beltRank={athlete.athleteProfile.beltRank} className="w-3.5 h-3.5 shrink-0" />
                                                                <span 
                                                                    className="text-[9px] font-black uppercase tracking-wider truncate" 
                                                                    style={{ color: beltStyle.hex }}
                                                                >
                                                                    {athlete.athleteProfile.beltRank}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* OVR Rating Badge */}
                                                        <div className="flex flex-col items-center justify-center bg-amber-500/10 border border-amber-500/25 rounded-xl p-2 shrink-0 w-12 self-center shadow-inner">
                                                            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-0.5">OVR</span>
                                                            <span className="text-lg font-serif font-black text-kuma-gold italic leading-none">{ovr}</span>
                                                        </div>

                                                        {/* Quick Share to Social Button */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSharingAthlete(athlete);
                                                            }}
                                                            className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/35 text-amber-300 hover:text-white transition-all cursor-pointer shrink-0 shadow-sm active:scale-95"
                                                            title="Compartir MVP en Estados de WhatsApp, Instagram, TikTok o Facebook"
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                            <span className="text-[7px] font-black uppercase tracking-wider mt-0.5">Share</span>
                                                        </button>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Subtle Auto-cycle indicator bar */}
                                    {dailyMvp && weeklyMvp && activeAthletes.length > 0 && (
                                        <div className="w-full max-w-xs h-1 bg-zinc-900 rounded-full overflow-hidden mt-6 relative">
                                            <motion.div
                                                key={`${activeTab}-${currentDojoId}`}
                                                initial={{ width: "0%" }}
                                                animate={{ width: isPaused ? "100%" : "100%" }}
                                                transition={{ duration: 7, ease: "linear" }}
                                                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Share Modal for MVP */}
            <ShareCardModal
                isOpen={!!sharingAthlete}
                onClose={() => setSharingAthlete(null)}
                athlete={sharingAthlete}
                mode={activeTab === "daily" ? "daily_mvp" : "weekly_mvp"}
            />
        </div>
    );
}
