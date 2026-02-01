"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, Calendar, Trophy, Zap, ChevronDown, LucideIcon } from "lucide-react";
import { WeeklyScheduleTable } from "@/components/ui/weekly-schedule-table";

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
    const [horarios, setHorarios] = useState<IHorario[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // Mobile/Tablet breakpoint
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        <section id="horarios" className={`relative z-10 w-full ${isDashboard ? "h-full flex flex-col" : "px-4 md:px-8 max-w-[1920px] mx-auto py-8"}`}>
            {/* Header - Hidden in dashboard mode or simplified */}
            {!isDashboard && (
                <div className="relative text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 flex flex-col items-center justify-center gap-4"
                    >
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl flex items-center gap-4">
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

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-10 h-10 border-2 border-kuma-gold border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="pb-12 px-2 md:px-0">
                            {isMobile && !isDashboard ? ( // Mobile View: Cards
                                <div className="grid grid-cols-1 gap-6">
                                    {horarios.map((daySchedule, idx) => (
                                        <motion.div
                                            key={daySchedule._id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                            className="bg-zinc-950/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-kuma-gold/30 hover:bg-zinc-900/60 transition-all duration-500 group flex flex-col hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                                        >
                                            {/* Card Header */}
                                            <div className="p-6 border-b border-white/5 bg-white/5 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-kuma-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                <h3 className="text-3xl font-black uppercase text-white tracking-widest relative z-10 flex items-center gap-3">
                                                    <Calendar className="w-6 h-6 text-kuma-gold" />
                                                    {daySchedule.day}
                                                </h3>
                                            </div>

                                            {/* Sessions List */}
                                            <div className="p-6 flex-1 flex flex-col gap-6">
                                                {daySchedule.sessions.map((session, sIdx) => {
                                                    const SessionIcon = getIcon(session.icon);
                                                    return (
                                                        <div key={sIdx} className="flex flex-col gap-3 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                                            {/* Time & Group */}
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex items-center gap-2 text-kuma-gold font-bold">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span className="text-lg font-mono tracking-tighter">{session.time}</span>
                                                                </div>
                                                                <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded text-white ${session.group.includes("Disruptivo") ? "bg-fuchsia-900/40 text-fuchsia-200" : "bg-zinc-800 text-zinc-200"}`}>
                                                                    {session.group}
                                                                </span>
                                                            </div>

                                                            {/* Description */}
                                                            <div className="flex gap-3">
                                                                <SessionIcon className={`w-5 h-5 mt-0.5 ${session.group.includes("Disruptivo") ? "text-fuchsia-500" : "text-zinc-400"}`} />
                                                                <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                                                                    {session.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : ( // Desktop: New Weekly Grid
                                <WeeklyScheduleTable data={horarios} />
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </section>
    );
};
