"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    TrendUp,
    Clock,
    MagnifyingGlass,
    ArrowsDownUp,
    CaretRight
} from "@phosphor-icons/react/dist/ssr";

interface ReportLink {
    id: string;
    href: string;
    title: string;
    description: string;
    icon: any;
    colorClass: string; // e.g., "text-red-500", "text-kuma-gold"
    bgClass: string; // e.g., "bg-red-900/20"
    borderHoverClass: string;
    rotateClass?: string;
}

const REPORTS: ReportLink[] = [
    {
        id: "visits",
        href: "/admin/reports/visits",
        title: "Reporte de Visitas",
        description: "Visualiza el tráfico del sitio web, páginas más visitadas y ubicación de los usuarios en tiempo real.",
        icon: TrendUp,
        colorClass: "text-red-500",
        bgClass: "bg-red-900/20",
        borderHoverClass: "hover:border-red-900/50",
        rotateClass: "rotate-12"
    },
    {
        id: "logs",
        href: "/admin/reports/logs",
        title: "Ejecución de Rutinas",
        description: "Auditoría detallada de tiempos y ejecución de rutinas por usuario.",
        icon: Clock,
        colorClass: "text-kuma-gold",
        bgClass: "bg-kuma-gold/20",
        borderHoverClass: "hover:border-kuma-gold/50",
        rotateClass: "rotate-12"
    }
];

export function ReportsClientPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredReports = REPORTS.filter(report =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-3 hover:bg-zinc-800 rounded-xl transition-all hover:scale-105 text-zinc-400 hover:text-white group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                            Centro de <span className="text-zinc-500">Reportes</span>
                        </h1>
                        <p className="text-zinc-400 mt-1">Selecciona el tipo de reporte que deseas visualizar.</p>
                    </div>
                </div>

                {/* --- CONTROLS --- */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative group flex-1 md:w-64">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
                        <div className="relative bg-black rounded-xl flex items-center">
                            <MagnifyingGlass className="absolute left-3 w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                            <input
                                type="text"
                                placeholder="BUSCAR..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none py-2.5 pl-10 pr-4 text-sm text-white font-bold placeholder:text-zinc-700 focus:ring-0 uppercase tracking-wider"
                            />
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/10 shrink-0">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}
                            title="Vista de Lista"
                        >
                            <ArrowsDownUp className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}
                            title="Vista de Galería"
                        >
                            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px]" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- CONTENT --- */}
            <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                    /* --- GRID VIEW --- */
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {filteredReports.map((report, idx) => (
                            <Link
                                key={report.id}
                                href={report.href}
                                className={`group relative bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl ${report.borderHoverClass} transition-all hover:bg-zinc-900 hover:shadow-2xl hover:shadow-black/50 overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <div className={`${report.colorClass} ${report.rotateClass} -mr-8 -mt-8`}>
                                        <report.icon className="w-32 h-32" weight="duotone" />
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <div className={`h-14 w-14 rounded-full ${report.bgClass} flex items-center justify-center ${report.colorClass} mb-6 group-hover:scale-110 group-hover:bg-current group-hover:text-black transition-all duration-300`}>
                                        <report.icon className="h-7 w-7" weight="duotone" />
                                    </div>
                                    <h3 className={`text-xl font-black text-white mb-3 hover:${report.colorClass} transition-colors uppercase tracking-tight`}>{report.title}</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300">
                                        {report.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                ) : (
                    /* --- LIST VIEW --- */
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl"
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">
                                    <th className="p-6">Reporte</th>
                                    <th className="p-6 hidden md:table-cell">Descripción</th>
                                    <th className="p-6 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredReports.map((report, idx) => (
                                    <motion.tr
                                        key={report.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group hover:bg-white/[0.03] transition-colors"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg ${report.bgClass} flex items-center justify-center ${report.colorClass}`}>
                                                    <report.icon className="w-5 h-5" weight="duotone" />
                                                </div>
                                                <span className="font-bold text-white uppercase tracking-tight">{report.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 hidden md:table-cell text-sm text-zinc-500">
                                            {report.description}
                                        </td>
                                        <td className="p-6 text-right">
                                            <Link href={report.href}>
                                                <button className="bg-zinc-800 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ml-auto">
                                                    Ver
                                                    <CaretRight className="w-4 h-4" weight="bold" />
                                                </button>
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>

            {filteredReports.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center mb-4 border border-white/5">
                        <MagnifyingGlass className="w-8 h-8 text-zinc-700" weight="duotone" />
                    </div>
                    <p className="text-zinc-500 font-medium">No se encontraron reportes.</p>
                </div>
            )}
        </div>
    );
}
