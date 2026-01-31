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

// Add props interface
interface TrainingSchedulesProps {
    mode?: "default" | "dashboard";
}

export const TrainingSchedules = ({ mode = "default" }: TrainingSchedulesProps) => {
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

    const isDashboard = mode === "dashboard";

    return (
        <section id="horarios" className={`relative z-10 w-full ${isDashboard ? "h-full flex flex-col" : "px-4 md:px-8 max-w-[1920px] mx-auto py-12"}`}>
            {/* Header - Hidden in dashboard mode or simplified */}
            {!isDashboard && (
                <div className="relative mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >

                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
                            <span className="text-kuma-gold">Horarios</span>
                        </h2>
                    </motion.div>
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-900/20 blur-[100px] rounded-full pointer-events-none" />
                </div>
            )}

            {isDashboard && (
                <div className="mb-6 flex items-center gap-4 px-2">
                    <Calendar className="w-8 h-8 text-kuma-gold" />
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
                        Horarios
                    </h2>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-10 h-10 border-2 border-kuma-gold border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className={
                    isDashboard
                        ? "grid grid-cols-1 gap-6 overflow-y-auto pr-2 pb-20 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent custom-scrollbar"
                        : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6"
                }>
                    {horarios.map((daySchedule, idx) => (
                        <motion.div
                            key={daySchedule._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className={`bg-zinc-950/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-kuma-gold/30 hover:bg-zinc-900/60 transition-all duration-500 group flex flex-col hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${isDashboard ? "shrink-0" : ""}`}
                        >
                            {/* Card Header */}
                            <div className="p-8 border-b border-white/5 bg-white/5 relative overflow-hidden group-hover:bg-white/10 transition-colors duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-kuma-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <h3 className="text-4xl font-black uppercase text-white tracking-widest relative z-10 flex items-center gap-4">
                                    <Calendar className="w-8 h-8 text-kuma-gold" />
                                    {daySchedule.day}
                                </h3>
                            </div>

                            {/* Sessions List */}
                            <div className="p-8 flex-1 flex flex-col gap-8">
                                {daySchedule.sessions.map((session, sIdx) => {
                                    const SessionIcon = getIcon(session.icon);
                                    return (
                                        <div key={sIdx} className="flex items-start gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                            {/* Epic Time Box */}
                                            <div className="flex flex-col items-center justify-center bg-zinc-950 rounded-2xl p-4 min-w-[110px] border border-white/10 relative overflow-hidden group/time">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-kuma-gold to-transparent opacity-50" />

                                                {/* Start Time */}
                                                <span className="text-3xl font-black text-white tracking-tighter leading-none mb-1">
                                                    {session.time.includes("-") ? session.time.split("-")[0].trim() : session.time}
                                                </span>

                                                {/* Visual Flow Connector */}
                                                <div className="h-5 w-[2px] bg-gradient-to-b from-kuma-gold to-zinc-800 my-1 relative">
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-kuma-gold" />
                                                </div>

                                                {/* End Time */}
                                                <span className="text-base font-bold text-zinc-400 tracking-tight leading-none">
                                                    {session.time.includes("-") ? session.time.split("-")[1].trim() : ""}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 pt-2">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <SessionIcon className={`w-6 h-6 ${session.group.includes("Disruptivo") ? "text-fuchsia-500" : "text-zinc-400"}`} />
                                                    <span className={`text-base font-black uppercase tracking-widest px-3 py-1 rounded text-white ${session.group.includes("Disruptivo") ? "bg-fuchsia-900/40 text-fuchsia-200" : "bg-zinc-800 text-zinc-200"}`}>
                                                        {session.group}
                                                    </span>
                                                </div>
                                                <p className="text-lg text-zinc-300 leading-relaxed font-medium">
                                                    {session.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer Action */}
                            <div className="p-6 bg-zinc-950/30 text-center border-t border-white/5">
                                <span className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-kuma-gold transition-colors decoration-kuma-gold/50 group-hover:underline underline-offset-4">
                                    Ver Detalle
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
};
