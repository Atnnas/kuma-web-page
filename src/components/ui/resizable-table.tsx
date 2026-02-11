"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { Download, ChevronDown } from "lucide-react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { Calendar, Clock, TicketCheck, Info, Users, Activity } from "lucide-react";

export interface ScheduleItem {
    id: string;
    day: string;
    time: string;
    group: string;
    description: string;
    icon?: string;
    color?: string;
}

interface ResizableTableProps {
    title?: string;
    data?: ScheduleItem[];
    onRowSelect?: (itemId: string) => void;
    onColumnResize?: (columnKey: string, newWidth: number) => void;
    className?: string;
    enableAnimations?: boolean;
}

const defaultData: ScheduleItem[] = [];

type SortField = "day" | "time" | "group" | "description";
type SortOrder = "asc" | "desc";

export function ResizableTable({
    title = "Horario Semanal",
    data: initialData = defaultData,
    onRowSelect,
    onColumnResize,
    className = "",
    enableAnimations = true
}: ResizableTableProps = {}) {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const shouldReduceMotion = useReducedMotion();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Column width state with default values
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
        day: 150,
        time: 150,
        group: 250,
        description: 300,
        action: 100
    });

    const ITEMS_PER_PAGE = 15;

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRowSelect = (itemId: string) => {
        setSelectedRows(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
        if (onRowSelect) {
            onRowSelect(itemId);
        }
    };

    const dayOrder: Record<string, number> = {
        "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6, "Domingo": 7
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
        setShowSortMenu(false);
        setCurrentPage(1);
    };

    const sortedData = useMemo(() => {
        if (!sortField) {
            // Default sort by Day order then Time
            return [...initialData].sort((a, b) => {
                const da = dayOrder[a.day] || 99;
                const db = dayOrder[b.day] || 99;
                if (da !== db) return da - db;
                return a.time.localeCompare(b.time);
            });
        }

        return [...initialData].sort((a, b) => {
            let aVal: string | number = a[sortField];
            let bVal: string | number = b[sortField];

            if (sortField === "day") {
                aVal = dayOrder[String(aVal)] || 99;
                bVal = dayOrder[String(bVal)] || 99;
            }

            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [initialData, sortField, sortOrder]);

    const paginatedData = useMemo(() => {
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedData.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    }, [sortedData, currentPage]);

    const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

    const handleResize = (columnKey: string, { size }: { size: { width: number } }) => {
        const newWidth = Math.max(80, Math.min(600, size.width));

        setColumnWidths(prev => ({
            ...prev,
            [columnKey]: newWidth
        }));

        if (onColumnResize) {
            onColumnResize(columnKey, newWidth);
        }
    };

    const exportToCSV = () => {
        const headers = ["Día", "Hora", "Clase", "Descripción"];
        const rows = sortedData.map(item => [
            item.day,
            item.time,
            item.group,
            item.description
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `horarios-kuma-dojo.csv`;
        link.click();
    };

    const shouldAnimate = enableAnimations && !shouldReduceMotion;

    const containerVariants: Variants = {
        visible: {
            transition: {
                staggerChildren: 0.04,
                delayChildren: 0.1,
            },
        }
    };

    const rowVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 25,
            },
        }
    };


    return (
        <div className={`w-full max-w-full mx-auto ${className}`}>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{title}</h3>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm hover:bg-zinc-800 transition-colors flex items-center gap-2 rounded-md"
                        >
                            Ordenar
                            <ChevronDown size={14} className="opacity-50" />
                        </button>

                        {showSortMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowSortMenu(false)}
                                />
                                <div className="absolute right-0 mt-1 w-48 bg-zinc-900 border border-zinc-800 shadow-xl rounded-md z-20 py-1">
                                    <button onClick={() => handleSort("day")} className={`w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors ${sortField === "day" ? 'bg-zinc-800' : ''}`}>
                                        Día
                                    </button>
                                    <button onClick={() => handleSort("time")} className={`w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors ${sortField === "time" ? 'bg-zinc-800' : ''}`}>
                                        Hora
                                    </button>
                                    <button onClick={() => handleSort("group")} className={`w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors ${sortField === "group" ? 'bg-zinc-800' : ''}`}>
                                        Clase
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm hover:bg-zinc-800 transition-colors flex items-center gap-2 rounded-md"
                        >
                            <Download size={14} />
                            Exportar
                            <ChevronDown size={14} className="opacity-50" />
                        </button>

                        {showExportMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowExportMenu(false)}
                                />
                                <div className="absolute right-0 mt-1 w-32 bg-zinc-900 border border-zinc-800 shadow-xl rounded-md z-20">
                                    <button onClick={() => { exportToCSV(); setShowExportMenu(false); }} className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors flex items-center gap-2">
                                        CSV
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 overflow-hidden rounded-xl relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[800px]">
                        {/* HEADERS */}
                        <div className="flex py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 bg-zinc-950/50 border-b border-zinc-800">

                            <Resizable width={columnWidths.day} height={0} onResize={(e, data) => handleResize('day', data)} minConstraints={[80, 0]} maxConstraints={[300, 0]} handle={<div className="absolute right-0 top-0 bottom-0 w-1 hover:w-1.5 cursor-col-resize bg-transparent hover:bg-kuma-gold/40 transition-all" />}>
                                <div className="flex items-center gap-2 border-r border-zinc-800 px-4 relative" style={{ width: columnWidths.day }}>
                                    <Calendar size={14} /> <span>Día</span>
                                </div>
                            </Resizable>

                            <Resizable width={columnWidths.time} height={0} onResize={(e, data) => handleResize('time', data)} minConstraints={[80, 0]} maxConstraints={[300, 0]} handle={<div className="absolute right-0 top-0 bottom-0 w-1 hover:w-1.5 cursor-col-resize bg-transparent hover:bg-kuma-gold/40 transition-all" />}>
                                <div className="flex items-center gap-2 border-r border-zinc-800 px-4 relative" style={{ width: columnWidths.time }}>
                                    <Clock size={14} /> <span>Hora</span>
                                </div>
                            </Resizable>

                            <Resizable width={columnWidths.group} height={0} onResize={(e, data) => handleResize('group', data)} minConstraints={[100, 0]} maxConstraints={[400, 0]} handle={<div className="absolute right-0 top-0 bottom-0 w-1 hover:w-1.5 cursor-col-resize bg-transparent hover:bg-kuma-gold/40 transition-all" />}>
                                <div className="flex items-center gap-2 border-r border-zinc-800 px-4 relative" style={{ width: columnWidths.group }}>
                                    <Users size={14} /> <span>Clase</span>
                                </div>
                            </Resizable>

                            <Resizable width={columnWidths.description} height={0} onResize={(e, data) => handleResize('description', data)} minConstraints={[100, 0]} maxConstraints={[600, 0]} handle={<div className="absolute right-0 top-0 bottom-0 w-1 hover:w-1.5 cursor-col-resize bg-transparent hover:bg-kuma-gold/40 transition-all" />}>
                                <div className="flex items-center gap-2 px-4 relative" style={{ width: columnWidths.description }}>
                                    <Info size={14} /> <span>Descripción</span>
                                </div>
                            </Resizable>

                        </div>

                        {/* BODY */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`page-${currentPage}`}
                                variants={shouldAnimate ? containerVariants : undefined}
                                initial={shouldAnimate ? "hidden" : "visible"}
                                animate="visible"
                            >
                                {paginatedData.map((item, index) => (
                                    <motion.div key={`${item.id}-${index}`} variants={shouldAnimate ? rowVariants : undefined}>
                                        <div
                                            className={`py-4 group relative transition-all duration-150 border-b border-zinc-800/50 flex hover:bg-zinc-800/30`}
                                        >
                                            <div className="flex items-center border-r border-zinc-800/50 px-4" style={{ width: columnWidths.day }}>
                                                <span className="text-sm font-bold text-kuma-gold">{item.day}</span>
                                            </div>

                                            <div className="flex items-center border-r border-zinc-800/50 px-4" style={{ width: columnWidths.time }}>
                                                <span className="text-sm text-zinc-300 font-mono">{item.time}</span>
                                            </div>

                                            <div className="flex items-center border-r border-zinc-800/50 px-4" style={{ width: columnWidths.group }}>
                                                <span className="text-sm text-white font-bold">{item.group}</span>
                                            </div>

                                            <div className="flex items-center px-4" style={{ width: columnWidths.description }}>
                                                <span className="text-sm text-zinc-400 line-clamp-2" title={item.description}>{item.description}</span>
                                            </div>

                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between px-2">
                    <div className="text-xs text-zinc-500">
                        Página {currentPage} de {totalPages} • {sortedData.length} clases
                    </div>

                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
