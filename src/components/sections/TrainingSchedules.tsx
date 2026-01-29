"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, Calendar, Trophy, Zap, ChevronDown, LucideIcon } from "lucide-react";

// Define the interface for the data we expect from the API
interface ISession {
    group: string;
    time: string;
    description: string;
    icon: string;
    color: string;
}

interface IHorario {
    _id: string;
    day: string;
    sessions: ISession[];
}

// Map string names to actual Lucide components
const IconMap: { [key: string]: LucideIcon } = {
    "Users": Users,
    "Trophy": Trophy,
    "Zap": Zap,
    "Clock": Clock,
    "Calendar": Calendar
};

export const TrainingSchedules = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [horarios, setHorarios] = useState<IHorario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const res = await fetch('/api/horarios');
                if (res.ok) {
                    const data = await res.json();
                    setHorarios(data);
                }
            } catch (error) {
                console.error("Failed to fetch horarios", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHorarios();
    }, []);

    // Helper to get icon component
    const getIcon = (iconName: string) => {
        const Icon = IconMap[iconName] || Users; // Default to Users if not found
        return Icon;
    };

    return (
        <section id="horarios" className="relative z-10 w-full">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    /* collapsed CARD View - PRIMAL MONOLITH BAR */
                    <motion.div
                        key="bar"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsOpen(true)}
                        className="cursor-pointer max-w-5xl mx-auto px-4"
                    >
                        <div className="bg-zinc-950/80 backdrop-blur-md rounded-xl border border-white/10 hover:border-kuma-gold/50 transition-colors duration-500 shadow-2xl group relative overflow-hidden">
                            {/* Texture/Noise overlay */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                            {/* Hover Shine Effect - Primal Gold */}
                            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-yellow-600/10 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />

                            <div className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                                {/* Left: Minimal Label */}
                                <div className="text-center md:text-left">
                                    <span className="block text-[10px] md:text-xs font-black tracking-[0.4em] text-zinc-500 uppercase group-hover:text-kuma-gold transition-colors duration-500">
                                        AGENDA SEMANAL
                                    </span>
                                </div>

                                {/* Center: Massive Title */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
                                        HORARIOS
                                    </h2>
                                </div>

                                {/* Right: Action Prompt */}
                                <div className="flex items-center gap-4 text-zinc-500 group-hover:text-white transition-colors">
                                    <span className="hidden md:block text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Ver Detalles
                                    </span>
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 group-hover:bg-white/5 transition-all">
                                        <ChevronDown className="w-6 h-6 transition-transform duration-300 group-hover:translate-y-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* EXPANDED CONTENT VIEW - UNIFIED TABLE */
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Static Header */}
                        <div className="relative mb-8 pt-4">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-700/50 to-transparent w-full"
                            />

                            <div className="relative text-center">
                                <span className="block text-xs md:text-sm font-bold tracking-[0.5em] text-zinc-500 uppercase mb-2">
                                    Planificación Semanal
                                </span>
                                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-2xl mb-6">
                                    <span className="text-kuma-gold">Horarios</span>
                                </h2>

                                {/* Top Close Button */}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-3 bg-blue-600/80 hover:bg-blue-500 text-white rounded-full font-bold tracking-wider uppercase transition-colors border border-blue-400/30 hover:border-blue-400/60 backdrop-blur-md inline-flex items-center gap-2 shadow-lg shadow-blue-900/20"
                                >
                                    <ChevronDown className="w-5 h-5 rotate-180" />
                                    Cerrar Horarios
                                </button>
                            </div>
                        </div>

                        <div className="px-4 md:px-8 max-w-7xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-zinc-950/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative min-h-[300px]"
                            >
                                {/* Texture/Noise overlay */}
                                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                                {/* Table Background FX */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-600/10 blur-[80px] rounded-full pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/10 blur-[80px] rounded-full pointer-events-none" />

                                {loading ? (
                                    <div className="flex items-center justify-center h-64 relative z-10">
                                        <div className="w-8 h-8 border-2 border-kuma-gold border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto relative z-10">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-white/5">
                                                    <th className="p-4 md:p-6 text-kuma-gold font-black uppercase tracking-wider text-xs md:text-sm min-w-[100px] md:min-w-[120px]">Día</th>
                                                    <th className="p-4 md:p-6 text-white font-bold uppercase tracking-wider text-xs md:text-sm w-full md:w-auto">Grupo</th>
                                                    <th className="p-4 md:p-6 text-white font-bold uppercase tracking-wider text-xs md:text-sm whitespace-nowrap hidden md:table-cell">Horario</th>
                                                    <th className="p-4 md:p-6 text-zinc-400 font-bold uppercase tracking-wider text-xs md:text-sm hidden lg:table-cell">Detalles</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {horarios.flatMap((daySchedule, dayIndex) =>
                                                    daySchedule.sessions.map((session, sessionIndex) => {
                                                        const SessionIcon = getIcon(session.icon);
                                                        return (
                                                            <tr
                                                                key={`${dayIndex}-${sessionIndex}`}
                                                                className="group hover:bg-white/5 transition-colors"
                                                            >
                                                                {/* Day Column */}
                                                                <td className="p-4 md:p-6 align-top">
                                                                    {sessionIndex === 0 && (
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="w-4 h-4 text-yellow-500 shrink-0" />
                                                                            <span className="font-bold text-white uppercase text-[10px] md:text-sm leading-tight">
                                                                                {daySchedule.day.replace("Lunes, Miércoles y Viernes", "L-M-V").replace("Martes y Jueves", "Ma - Ju")}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </td>

                                                                {/* Group Column (+ Time on Mobile) */}
                                                                <td className="p-4 md:p-6 align-top">
                                                                    <div className="flex flex-col gap-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <SessionIcon className={`w-4 h-4 shrink-0 ${session.group.includes("Disruptivo") ? "text-fuchsia-500" : "text-zinc-500"}`} />
                                                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest bg-gradient-to-r ${session.color} text-white shadow-sm`}>
                                                                                {session.group}
                                                                            </span>
                                                                        </div>

                                                                        {/* Mobile: Time Display */}
                                                                        <div className="md:hidden flex items-center gap-2 text-zinc-400 mt-1">
                                                                            <Clock className="w-3 h-3 text-zinc-600" />
                                                                            <span className="text-[11px] font-bold uppercase">{session.time}</span>
                                                                        </div>

                                                                        {/* Mobile: Description */}
                                                                        <p className="lg:hidden text-[10px] md:text-xs text-zinc-500 mt-1 line-clamp-2">{session.description}</p>
                                                                    </div>
                                                                </td>

                                                                {/* Time Column (Desktop Only) */}
                                                                <td className="p-4 md:p-6 align-top hidden md:table-cell">
                                                                    <div className="flex items-center gap-2 font-black text-white whitespace-nowrap text-sm md:text-base">
                                                                        <Clock className="w-4 h-4 text-zinc-600" />
                                                                        {session.time}
                                                                    </div>
                                                                </td>

                                                                {/* Description Column (Large Desktop Only) */}
                                                                <td className="p-4 md:p-6 align-top hidden lg:table-cell">
                                                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                                                        {session.description}
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>

                            {/* EXPLICIT CLOSE BUTTON */}
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-3 bg-blue-600/80 hover:bg-blue-500 text-white rounded-full font-bold tracking-wider uppercase transition-colors border border-blue-400/30 hover:border-blue-400/60 backdrop-blur-md flex items-center gap-2 shadow-lg shadow-blue-900/20"
                                >
                                    <ChevronDown className="w-5 h-5 rotate-180" />
                                    Cerrar Horarios
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
