"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    MagnifyingGlass,
    ArrowsDownUp,
    PlayCircle,
    Barbell,
    Timer,
    ChartBar,
    CaretRight,
    Users
} from "@phosphor-icons/react/dist/ssr";

interface IRoutineSummary {
    _id: string;
    title: string;
    description: string;
    difficulty: "Principiante" | "Intermedio" | "Avanzado";
    estimated_duration: number;
    equipment_types: string[];
    blocks: any[]; // We only need count
    active: boolean;
}

interface RutinasTableProps {
    data: IRoutineSummary[];
}

export function RutinasTable({ data }: RutinasTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof IRoutineSummary | null; direction: "asc" | "desc" }>({
        key: null,
        direction: "asc",
    });
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");

    // --- FILTER & SORT LOGIC ---
    const filteredData = useMemo(() => {
        let processed = [...data];

        // 1. Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            processed = processed.filter(
                (item) =>
                    item.title.toLowerCase().includes(q) ||
                    item.description.toLowerCase().includes(q)
            );
        }

        // 2. Sort
        if (sortConfig.key) {
            processed.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];

                if (aValue === bValue) return 0;

                // Compare logic
                if (sortConfig.direction === "asc") {
                    return aValue < bValue ? -1 : 1;
                } else {
                    return aValue > bValue ? -1 : 1;
                }
            });
        }

        return processed;
    }, [data, searchQuery, sortConfig]);

    const requestSort = (key: keyof IRoutineSummary) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof IRoutineSummary) => {
        if (sortConfig.key !== key) return <ArrowsDownUp className="w-3 h-3 opacity-30" weight="duotone" />;
        return <ArrowsDownUp className={`w-3 h-3 ${sortConfig.direction === "asc" ? "text-kuma-gold" : "text-white"}`} weight="duotone" />;
    };

    // --- DIFFICULTY BADGES ---
    const getDifficultyBadge = (diff: string) => {
        const styles = {
            Principiante: "bg-green-500/10 text-green-500 border-green-500/20",
            Intermedio: "bg-kuma-gold/10 text-kuma-gold border-kuma-gold/20",
            Avanzado: "bg-red-500/10 text-red-500 border-red-500/20",
        };
        const active = styles[diff as keyof typeof styles] || styles.Intermedio;
        return (
            <span className={`px-2 py-1 rounded text-[10px] uppercase font-black tracking-wider border ${active}`}>
                {diff}
            </span>
        );
    };


    return (
        <div className="w-full space-y-8">
            {/* --- CONTROLS HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Search Bar */}
                <div className="relative w-full md:w-[28rem] group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
                    <div className="relative bg-black rounded-2xl flex items-center">
                        <MagnifyingGlass className="absolute left-4 w-5 h-5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="BUSCAR ENTRENAMIENTO..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white font-bold placeholder:text-zinc-700 focus:ring-0 uppercase tracking-wider"
                        />
                    </div>
                </div>

                {/* Right Side: Toggle + Count */}
                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}
                            title="Vista de Lista"
                        >
                            <ArrowsDownUp className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}
                            title="Vista de Galería"
                        >
                            <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px]" />
                            </div>
                        </button>
                    </div>

                    <div className="px-4 py-2 bg-zinc-900 rounded-lg border border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden md:block">
                        {filteredData.length} RUTINAS
                    </div>
                </div>
            </div>

            {/* --- VIEW CONTENT --- */}
            <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                    /* --- 3D GRID VIEW --- */
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                    >
                        {filteredData.map((routine, idx) => (
                            <motion.div
                                key={routine._id}
                                layout
                                transition={{ type: "spring", duration: 0.5, delay: idx * 0.05 }}
                                className="group relative"
                            >
                                <Link href={`/rutinas/${routine._id}`} className="block h-full">
                                    <div className="h-full relative bg-zinc-900 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]">
                                        <div className={`absolute inset-0 bg-gradient-to-br opacity-40 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-60 ${routine.difficulty === "Principiante" ? "from-green-900 to-black" : routine.difficulty === "Intermedio" ? "from-yellow-900 to-black" : "from-red-900 to-black"}`} />
                                        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10" />
                                        <div className="relative p-8 flex flex-col h-full min-h-[320px]">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                                                    <Barbell className="w-8 h-8" weight="duotone" />
                                                </div>
                                                {getDifficultyBadge(routine.difficulty)}
                                            </div>
                                            <div className="mb-auto">
                                                <h3 className="text-2xl font-black text-white leading-tight mb-2 uppercase italic tracking-tight group-hover:text-cyan-200 transition-colors">{routine.title}</h3>
                                                <p className="text-sm text-zinc-400 font-medium leading-relaxed line-clamp-2">{routine.description}</p>
                                            </div>
                                            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1"><Timer className="w-4 h-4" /> Duración</div>
                                                    <div className="text-xl font-bold text-white tabular-nums">{routine.estimated_duration} m</div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1"><ChartBar className="w-4 h-4" /> Bloques</div>
                                                    <div className="text-xl font-bold text-white tabular-nums">{routine.blocks?.length || 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* --- NEON LIST VIEW (The Returned Table) --- */
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
                                    <th className="p-6 cursor-pointer hover:text-white hover:bg-white/5 transition-colors" onClick={() => requestSort("title")}><div className="flex items-center gap-2">Rutina {getSortIcon("title")}</div></th>
                                    <th className="p-6 cursor-pointer hover:text-white hover:bg-white/5 transition-colors" onClick={() => requestSort("difficulty")}><div className="flex items-center gap-2">Nivel {getSortIcon("difficulty")}</div></th>
                                    <th className="p-6 cursor-pointer hover:text-white hover:bg-white/5 transition-colors" onClick={() => requestSort("estimated_duration")}><div className="flex items-center gap-2">Tiempo {getSortIcon("estimated_duration")}</div></th>
                                    <th className="p-6 hidden md:table-cell">Equipo</th>
                                    <th className="p-6 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredData.map((routine, idx) => (
                                    <motion.tr
                                        key={routine._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group hover:bg-white/[0.03] transition-colors relative"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                {/* Neon Indicator */}
                                                <div className={`w-1 h-12 rounded-full shadow-[0_0_10px_2px_currentColor] transition-colors duration-300
                                                    ${routine.difficulty === "Principiante" ? "text-green-500 bg-green-500" :
                                                        routine.difficulty === "Intermedio" ? "text-yellow-500 bg-yellow-500" :
                                                            "text-red-600 bg-red-600"}`}
                                                />

                                                <div>
                                                    <h3 className="text-lg font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-200 transition-all uppercase italic">
                                                        {routine.title}
                                                    </h3>
                                                    <p className="text-xs text-zinc-500 font-medium max-w-md truncate group-hover:text-zinc-400">
                                                        {routine.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {getDifficultyBadge(routine.difficulty)}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-zinc-400 font-bold tabular-nums">
                                                <Timer className="w-5 h-5 text-zinc-600 group-hover:text-cyan-500 transition-colors" weight="duotone" />
                                                {routine.estimated_duration} min
                                            </div>
                                        </td>
                                        <td className="p-6 hidden md:table-cell">
                                            <div className="flex gap-2">
                                                {(() => {
                                                    const hasEquipment = routine.equipment_types?.includes("equipo");
                                                    const hasBodyweight = routine.equipment_types?.includes("peso_corporal");

                                                    if (hasEquipment && hasBodyweight) {
                                                        return (
                                                            <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded uppercase font-bold tracking-wider">
                                                                Mixto
                                                            </span>
                                                        );
                                                    }
                                                    if (hasEquipment) {
                                                        return (
                                                            <span className="text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded uppercase font-bold tracking-wider">
                                                                Equipo
                                                            </span>
                                                        );
                                                    }
                                                    if (hasBodyweight) {
                                                        return (
                                                            <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded uppercase font-bold tracking-wider">
                                                                Peso Corporal
                                                            </span>
                                                        );
                                                    }
                                                    return <span className="text-[10px] text-zinc-600">-</span>;
                                                })()}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <Link href={`/rutinas/${routine._id}`}>
                                                <button className="bg-transparent hover:bg-white text-white hover:text-black border border-white/20 hover:border-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center gap-2 ml-auto group/btn">
                                                    <PlayCircle className="w-5 h-5 group-hover/btn:fill-black" weight="duotone" />
                                                    Iniciar
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

            {/* EMPTY STATE */}
            {filteredData.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
                        <MagnifyingGlass className="w-10 h-10 text-zinc-700" weight="duotone" />
                    </div>
                    <h3 className="text-2xl font-black text-zinc-800 uppercase tracking-tighter">Sin Resultados</h3>
                    <p className="text-zinc-600 font-medium">No encontramos rutinas para tu búsqueda.</p>
                </div>
            )}

            <div className="text-center py-12">
                <p className="text-[10px] text-zinc-800 font-mono tracking-[0.5em] uppercase">Kuma Dojo Systems v2.0</p>
            </div>
        </div>
    );
}
