"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Search,
    Download,
    RefreshCw,
    Sparkle,
    Star,
    Flame,
    Clock,
    UserCheck,
    AlertTriangle,
    ShieldAlert,
    GraduationCap,
    CheckCircle2,
    Calendar,
    Filter,
    ArrowUpDown,
    ExternalLink,
    ChevronDown,
} from "lucide-react";
import { BeltSquare } from "@/components/admin/AthleteEditModal";
import { AthleteDidacticAuditModal, DidacticAuditAthlete } from "@/components/didactic/AthleteDidacticAuditModal";

interface ReportItem {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
    beltRank: string;
    specialization: string;
    dojoName: string;
    ovr: number;
    registeredAt: string;
    didactic: {
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

interface SummaryData {
    totalEnrolled: number;
    activeUsersCount: number;
    warningUsersCount: number;
    coldUsersCount: number;
    neverStartedCount: number;
    totalXpEarned: number;
    totalLessonsCompleted: number;
    maxStreak: number;
    totalCurriculumLevels: number;
}

export function DidacticReportClientPage() {
    const [data, setData] = useState<ReportItem[]>([]);
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter and Sort states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [beltFilter, setBeltFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"recent" | "inactive" | "xp" | "progress">("recent");

    // Modal state for drilling into individual athlete
    const [selectedAthlete, setSelectedAthlete] = useState<DidacticAuditAthlete | null>(null);

    const loadReport = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch("/api/admin/reports/didactica");
            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.error || "No se pudo cargar el reporte didáctico.");
            }
            setData(json.data || []);
            setSummary(json.summary || null);
        } catch (e: any) {
            console.error("Error loading didactic report:", e);
            setError(e.message || "Error al conectar con la base de datos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, []);

    // Unique belt list from data
    const availableBelts = useMemo(() => {
        const set = new Set<string>();
        data.forEach((item) => {
            if (item.beltRank) set.add(item.beltRank);
        });
        return Array.from(set);
    }, [data]);

    // Filtered and Sorted list
    const filteredData = useMemo(() => {
        return data
            .filter((item) => {
                // Search term
                const matchesSearch =
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.email.toLowerCase().includes(searchTerm.toLowerCase());

                // Status filter
                const matchesStatus =
                    statusFilter === "all" ||
                    (statusFilter === "active" && item.didactic.senseiMood === "happy") ||
                    (statusFilter === "warning" && (item.didactic.senseiMood === "concerned" || item.didactic.senseiMood === "sad")) ||
                    (statusFilter === "cold" && item.didactic.senseiMood === "crying") ||
                    (statusFilter === "never" && item.didactic.senseiMood === "never");

                // Belt filter
                const matchesBelt = beltFilter === "all" || item.beltRank === beltFilter;

                return matchesSearch && matchesStatus && matchesBelt;
            })
            .sort((a, b) => {
                if (sortBy === "recent") {
                    const timeA = a.didactic.lastVisitedTimestamp || 0;
                    const timeB = b.didactic.lastVisitedTimestamp || 0;
                    return timeB - timeA;
                }
                if (sortBy === "inactive") {
                    const daysA = a.didactic.daysInactive ?? 999;
                    const daysB = b.didactic.daysInactive ?? 999;
                    return daysB - daysA;
                }
                if (sortBy === "xp") {
                    return b.didactic.xp - a.didactic.xp;
                }
                if (sortBy === "progress") {
                    return b.didactic.progressPercent - a.didactic.progressPercent;
                }
                return 0;
            });
    }, [data, searchTerm, statusFilter, beltFilter, sortBy]);

    // Export to CSV
    const exportToCSV = () => {
        if (!filteredData.length) return;

        const headers = [
            "ID Atleta",
            "Nombre",
            "Correo",
            "Cinturón Dojo",
            "Dojo",
            "Última Visita (Fecha)",
            "Días Inactivo",
            "Estado Kuma Sensei",
            "Cinturón Didáctico",
            "Grados Superados",
            "Total Grados",
            "% Avance",
            "XP Acumulado",
            "Estrellas Ganadas",
            "Racha (Días)",
        ];

        const rows = filteredData.map((item) => {
            const lastDate = item.didactic.lastVisitedTimestamp
                ? new Date(item.didactic.lastVisitedTimestamp).toISOString().replace("T", " ").substring(0, 19)
                : "Nunca";
            const moodLabel = {
                happy: "Activo / En forma (0-3d)",
                concerned: "Enfriándose (4-6d)",
                sad: "Desgaste marcial (7-13d)",
                crying: "Tatami Frío / Abandono (14d+)",
                never: "Sin Iniciar",
            }[item.didactic.senseiMood];

            return [
                `"${item.id}"`,
                `"${item.name.replace(/"/g, '""')}"`,
                `"${item.email}"`,
                `"${item.beltRank}"`,
                `"${item.dojoName}"`,
                `"${lastDate}"`,
                item.didactic.daysInactive !== null ? item.didactic.daysInactive : "N/A",
                `"${moodLabel}"`,
                `"${item.didactic.currentBeltName}"`,
                item.didactic.completedLevelsCount,
                item.didactic.totalLevelsCount,
                `${item.didactic.progressPercent}%`,
                item.didactic.xp,
                item.didactic.stars,
                item.didactic.streak,
            ].join(",");
        });

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Reporte_Didactica_KumaDojo_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatTimeAgo = (item: ReportItem) => {
        if (!item.didactic.lastVisitedTimestamp) {
            return <span className="text-zinc-500 italic">Nunca ha ingresado</span>;
        }
        const days = item.didactic.daysInactive;
        if (days === 0) {
            return <span className="text-emerald-400 font-bold">🟢 Hoy</span>;
        }
        if (days === 1) {
            return <span className="text-emerald-400 font-bold">🟢 Ayer</span>;
        }
        if (days && days <= 3) {
            return <span className="text-emerald-300">Hace {days} días</span>;
        }
        if (days && days <= 6) {
            return <span className="text-amber-400 font-bold">Hace {days} días</span>;
        }
        if (days && days <= 13) {
            return <span className="text-red-400 font-bold">Hace {days} días ⚠</span>;
        }
        return <span className="text-blue-400 font-bold">Hace {days} días ❄</span>;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* --- HEADER --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/reports"
                        className="p-3 hover:bg-zinc-800 rounded-2xl transition-all hover:scale-105 text-zinc-400 hover:text-white group border border-white/5"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-kuma-gold border border-amber-500/30">
                                Módulo de Auditoría Marcial
                            </span>
                            <span className="text-xs text-zinc-500 font-bold">• Kuma Dojo Telemetría</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight text-white mt-1">
                            Auditoría de <span className="text-kuma-gold">Progreso Didáctico</span>
                        </h1>
                        <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-2xl">
                            Supervisión en vivo de alumnos en el tatami interactivo: frecuencia de entrada, días de inactividad y avance hacia el siguiente cinturón.
                        </p>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button
                        onClick={loadReport}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all border border-white/10 cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-kuma-gold" : ""}`} />
                        <span>Actualizar</span>
                    </button>

                    <button
                        onClick={exportToCSV}
                        disabled={!filteredData.length}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-kuma-gold to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-serif font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        <span>Exportar Excel (CSV)</span>
                    </button>
                </div>
            </div>

            {/* --- DOJO OVERALL KPI CARDS --- */}
            {summary && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {/* KPI 1: Total Enrolled */}
                    <div className="p-4 rounded-3xl bg-zinc-900/60 border border-white/5 backdrop-blur-sm">
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">
                            Atletas Totales
                        </span>
                        <span className="text-2xl md:text-3xl font-serif font-black text-white mt-1 block">
                            {summary.totalEnrolled}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-1 block">
                            Inscritos en Kuma Dojo
                        </span>
                    </div>

                    {/* KPI 2: Activos (0-3d) */}
                    <div className="p-4 rounded-3xl bg-emerald-950/20 border border-emerald-500/20 backdrop-blur-sm">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                            🟢 Activos al Día
                        </span>
                        <span className="text-2xl md:text-3xl font-serif font-black text-emerald-300 mt-1 block">
                            {summary.activeUsersCount}
                        </span>
                        <span className="text-[10px] text-emerald-400/80 mt-1 block">
                            Últimos 0 a 3 días
                        </span>
                    </div>

                    {/* KPI 3: En Riesgo (4-13d) */}
                    <div className="p-4 rounded-3xl bg-amber-950/20 border border-amber-500/20 backdrop-blur-sm">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                            🟠 Enfriándose
                        </span>
                        <span className="text-2xl md:text-3xl font-serif font-black text-amber-300 mt-1 block">
                            {summary.warningUsersCount}
                        </span>
                        <span className="text-[10px] text-amber-400/80 mt-1 block">
                            4 a 13 días ausentes
                        </span>
                    </div>

                    {/* KPI 4: Tatami Frío (14d+) */}
                    <div className="p-4 rounded-3xl bg-blue-950/20 border border-blue-500/20 backdrop-blur-sm">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 block">
                            😭 Tatami Frío
                        </span>
                        <span className="text-2xl md:text-3xl font-serif font-black text-blue-300 mt-1 block">
                            {summary.coldUsersCount}
                        </span>
                        <span className="text-[10px] text-blue-400/80 mt-1 block">
                            14+ días de abandono
                        </span>
                    </div>

                    {/* KPI 5: Total XP */}
                    <div className="p-4 rounded-3xl bg-zinc-900/60 border border-kuma-gold/20 backdrop-blur-sm">
                        <span className="text-[10px] font-black uppercase tracking-wider text-kuma-gold block flex items-center gap-1">
                            <Sparkle className="w-3 h-3" /> Poder XP Dojo
                        </span>
                        <span className="text-2xl md:text-3xl font-serif font-black text-white mt-1 block">
                            {summary.totalXpEarned.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-1 block">
                            {summary.totalLessonsCompleted} lecciones ganadas
                        </span>
                    </div>

                    {/* KPI 6: Racha Máxima */}
                    <div className="p-4 rounded-3xl bg-zinc-900/60 border border-white/5 backdrop-blur-sm">
                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 block flex items-center gap-1">
                            <Flame className="w-3 h-3 fill-orange-400" /> Racha Récord
                        </span>
                        <span className="text-2xl md:text-3xl font-serif font-black text-orange-400 mt-1 block">
                            {summary.maxStreak} d
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-1 block">
                            Días seguidos récord
                        </span>
                    </div>
                </div>
            )}

            {/* --- SEARCH & FILTERS BAR --- */}
            <div className="p-5 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-kuma-gold/50 transition-all shadow-inner"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-end">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Estado:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-kuma-gold/50 cursor-pointer"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">🟢 Activos al día (0-3d)</option>
                            <option value="warning">🟠 Enfriándose (4-13d)</option>
                            <option value="cold">😭 Tatami Frío (14d+)</option>
                            <option value="never">⚪ Sin iniciar</option>
                        </select>
                    </div>

                    {/* Belt Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Cinturón:</span>
                        <select
                            value={beltFilter}
                            onChange={(e) => setBeltFilter(e.target.value)}
                            className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-kuma-gold/50 cursor-pointer"
                        >
                            <option value="all">Todos los cinturones</option>
                            {availableBelts.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Ordenar:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-kuma-gold/50 cursor-pointer"
                        >
                            <option value="recent">Más recientes (Última visita)</option>
                            <option value="inactive">Más días inactivos (Rezagados)</option>
                            <option value="xp">Mayor XP (Puntos)</option>
                            <option value="progress">Mayor % de Avance</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- MAIN DATA TABLE --- */}
            {isLoading ? (
                <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 border-4 border-t-kuma-gold border-white/10 rounded-full animate-spin" />
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
                        Cargando telemetría del dojo...
                    </p>
                </div>
            ) : error ? (
                <div className="p-8 rounded-3xl bg-red-950/30 border border-red-500/30 text-center max-w-lg mx-auto">
                    <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-red-300">Error al cargar datos</h3>
                    <p className="text-xs text-zinc-400 mt-1">{error}</p>
                    <button
                        onClick={loadReport}
                        className="mt-4 px-4 py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-white text-xs font-bold transition-all"
                    >
                        Reintentar
                    </button>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="py-20 text-center bg-zinc-900/20 rounded-3xl border border-dashed border-white/10">
                    <p className="text-zinc-400 text-sm font-bold">No se encontraron atletas con los filtros seleccionados.</p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setBeltFilter("all");
                        }}
                        className="mt-3 text-xs text-kuma-gold font-bold hover:underline"
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <div className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    <th className="py-4 px-5">Atleta</th>
                                    <th className="py-4 px-4">Cinturón Dojo</th>
                                    <th className="py-4 px-4">Última Práctica</th>
                                    <th className="py-4 px-4">Estado Sensei</th>
                                    <th className="py-4 px-4">Cinturón & Avance</th>
                                    <th className="py-4 px-4 text-center">XP / Estrellas</th>
                                    <th className="py-4 px-4 text-center">Racha</th>
                                    <th className="py-4 px-5 text-right">Auditoría</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {filteredData.map((item) => {
                                    const mood = item.didactic.senseiMood;
                                    const moodBadge = {
                                        happy: { label: "🟢 Activo", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
                                        concerned: { label: "🟠 Enfriándose", class: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
                                        sad: { label: "🔴 Alerta", class: "bg-red-500/15 text-red-300 border-red-500/30" },
                                        crying: { label: "😭 Tatami Frío", class: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
                                        never: { label: "⚪ Sin Iniciar", class: "bg-zinc-800 text-zinc-500 border-zinc-700" },
                                    }[mood];

                                    return (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-white/[0.03] transition-colors group"
                                        >
                                            {/* Atleta Info */}
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                                                        {item.image ? (
                                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center font-black text-zinc-600">
                                                                {item.name?.[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="block font-bold text-white group-hover:text-kuma-gold transition-colors truncate">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-[11px] text-zinc-500 block truncate">
                                                            {item.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cinturón Dojo */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <BeltSquare beltRank={item.beltRank} className="w-3.5 h-3.5" />
                                                    <span className="font-bold text-zinc-300">{item.beltRank}</span>
                                                </div>
                                            </td>

                                            {/* Última Práctica */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                {formatTimeAgo(item)}
                                            </td>

                                            {/* Estado Sensei */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${moodBadge.class}`}>
                                                    {moodBadge.label}
                                                </span>
                                            </td>

                                            {/* Cinturón Didáctico & Avance */}
                                            <td className="py-3.5 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-[11px] mb-1">
                                                        <span className="font-bold text-zinc-300 truncate">
                                                            {item.didactic.currentBeltShortName}
                                                        </span>
                                                        <span className="text-kuma-gold font-mono font-bold text-[10px]">
                                                            {item.didactic.progressPercent}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-amber-500 to-kuma-gold transition-all"
                                                            style={{ width: `${item.didactic.progressPercent}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[9px] text-zinc-500 block mt-0.5">
                                                        {item.didactic.completedLevelsCount} / {item.didactic.totalLevelsCount} grados
                                                    </span>
                                                </div>
                                            </td>

                                            {/* XP / Estrellas */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-mono font-black text-kuma-gold text-xs flex items-center gap-0.5">
                                                        <Sparkle className="w-3 h-3" />
                                                        {item.didactic.xp}
                                                    </span>
                                                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 mt-0.5">
                                                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                                                        {item.didactic.stars} ★
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Racha */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                {item.didactic.streak > 0 ? (
                                                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono font-bold text-xs">
                                                        <Flame className="w-3 h-3 fill-orange-400" />
                                                        {item.didactic.streak} d
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-600 text-[11px] font-mono">0 d</span>
                                                )}
                                            </td>

                                            {/* Action Button */}
                                            <td className="py-3.5 px-5 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => setSelectedAthlete(item)}
                                                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-kuma-gold hover:text-black border border-white/10 hover:border-kuma-gold text-[11px] font-black uppercase tracking-wider text-zinc-300 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                                                >
                                                    <span>Auditar</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL AUDITORIA DE ATLETA INDIVIDUAL */}
            <AthleteDidacticAuditModal
                isOpen={!!selectedAthlete}
                onClose={() => setSelectedAthlete(null)}
                athlete={selectedAthlete}
            />
        </div>
    );
}
