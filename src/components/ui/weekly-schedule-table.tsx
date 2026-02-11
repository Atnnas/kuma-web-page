"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

// --- Types ---
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

interface WeeklyScheduleTableProps {
    data?: IHorario[];
}

const TIME_SLOTS = ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "8:30 PM"];
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const DEFAULT_SCHEDULE: IHorario[] = [
    {
        _id: "1", day: "Lunes",
        sessions: [
            { group: "KUMA KIDS", time: "6:00 PM - 7:00 PM", description: "Entrenamiento para niños hasta los 12 años", icon: "Zap", color: "gold" },
            { group: "KUMA SENIORS", time: "7:00 PM - 8:30 PM", description: "Entrenamiento para adultos y mayores", icon: "Activity", color: "blue" }
        ]
    },
    {
        _id: "2", day: "Martes",
        sessions: [
            { group: "ALTO RENDIMIENTO", time: "5:00 PM - 7:00 PM", description: "Entrenamiento especializado de alto rendimiento", icon: "Trophy", color: "amber" }
        ]
    },
    {
        _id: "3", day: "Miércoles",
        sessions: [
            { group: "KUMA KIDS", time: "6:00 PM - 7:00 PM", description: "Entrenamiento para niños hasta los 12 años", icon: "Zap", color: "gold" },
            { group: "KUMA SENIORS", time: "7:00 PM - 8:30 PM", description: "Entrenamiento para adultos y mayores", icon: "Activity", color: "blue" }
        ]
    },
    {
        _id: "4", day: "Jueves",
        sessions: [
            { group: "ALTO RENDIMIENTO", time: "5:00 PM - 7:00 PM", description: "Entrenamiento especializado de alto rendimiento", icon: "Trophy", color: "amber" }
        ]
    },
    {
        _id: "5", day: "Viernes",
        sessions: [
            { group: "KUMA KIDS", time: "6:00 PM - 7:00 PM", description: "Entrenamiento para niños hasta los 12 años", icon: "Zap", color: "gold" },
            { group: "KUMA SENIORS", time: "7:00 PM - 8:30 PM", description: "Entrenamiento para adultos y mayores", icon: "Activity", color: "blue" }
        ]
    }
];

export function WeeklyScheduleTable({ data = [] }: WeeklyScheduleTableProps) {
    const scheduleData = data.length > 0 ? data : DEFAULT_SCHEDULE;

    // --- Helper Functions ---

    const normalize = (str: string) =>
        str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";

    const parseTime = (timeStr: string) => {
        const startPart = timeStr.split("-")[0].trim();
        const [time, period] = startPart.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        return { hours, minutes: minutes || 0 };
    };

    const getCellSessions = (targetDay: string, targetTimeSlot: string) => {
        const normalizedTargetDay = normalize(targetDay);
        // Find day that matches or includes the target day (for grouped days like "Lunes, Miércoles y Viernes")
        const dayData = scheduleData.find(d => {
            const normalizedDay = normalize(d.day);
            return normalizedDay === normalizedTargetDay || normalizedDay.includes(normalizedTargetDay);
        });

        if (!dayData) return [];

        return dayData.sessions.filter(session => {
            const { hours, minutes } = parseTime(session.time);
            const groupToUpper = session.group.toUpperCase();
            const isAltoRendimiento = groupToUpper.includes("ALTO RENDIMIENTO");
            const isKumaSeniors = groupToUpper.includes("KUMA SENIORS");

            // Alto Rendimiento: 5:00 PM - 7:00 PM (Spans 5pm and 6pm slots)
            if (isAltoRendimiento && hours === 17) {
                return targetTimeSlot === "5:00 PM" || targetTimeSlot === "6:00 PM";
            }

            // Kuma Seniors: 7:00 PM - 8:30 PM (Spans 7pm, 8pm, and 8:30pm slots)
            if (isKumaSeniors && hours === 19) {
                return targetTimeSlot === "7:00 PM" || targetTimeSlot === "8:00 PM" || targetTimeSlot === "8:30 PM";
            }

            if (targetTimeSlot === "5:00 PM") return hours === 17;
            if (targetTimeSlot === "6:00 PM") return hours === 18;
            if (targetTimeSlot === "7:00 PM") return hours === 19;
            if (targetTimeSlot === "8:00 PM") return hours === 20 && minutes < 30;
            if (targetTimeSlot === "8:30 PM") return hours === 20 && minutes >= 30;

            return false;
        });
    };

    return (
        <div className="w-full flex justify-center">
            <div className="w-full overflow-hidden rounded-[2rem] border border-white/20 bg-zinc-950/40 backdrop-blur-md shadow-2xl relative">
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src="/images/fondoEntrenamiento.jpg"
                        alt="Dojo Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <table className="w-full text-left border-collapse table-fixed relative z-10">
                    <thead>
                        <tr>
                            <th className="w-[150px] p-6 border-b border-white/20 bg-black/80 backdrop-blur-md sticky left-0 z-20">
                                <div className="flex flex-col gap-1">
                                    <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono">Horario</span>
                                    <span className="text-kuma-gold font-black uppercase text-xs">PM / Noche</span>
                                </div>
                            </th>
                            {DAYS.map((day) => (
                                <th key={day} className="p-4 border-b border-l border-white/20 bg-black/40 text-center first:border-l-0">
                                    <span className="block text-lg md:text-2xl font-black uppercase text-white tracking-tighter mb-1">
                                        {day}
                                    </span>
                                    <div className="w-10 h-1 bg-kuma-gold mx-auto rounded-full" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TIME_SLOTS.map((timeSlot) => (
                            <tr key={timeSlot} className="group/row bg-transparent hover:bg-white/5 transition-colors duration-300">
                                <td className="p-6 border-r border-b border-white/20 bg-black/60 backdrop-blur-sm font-mono text-zinc-400 font-bold sticky left-0 z-10 group-hover/row:bg-zinc-900/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-kuma-gold" />
                                        <span className="text-xl tracking-tight font-black text-white">{timeSlot.replace(" PM", "")}<span className="text-[10px] ml-1 align-top text-zinc-500">PM</span></span>
                                    </div>
                                </td>
                                {DAYS.map((day) => {
                                    const sessions = getCellSessions(day, timeSlot);

                                    return (
                                        <td key={`${day}-${timeSlot}`} className="p-2 border-r border-b border-white/20 align-top h-[160px] relative">
                                            {sessions.length > 0 ? (
                                                <div className="flex flex-col gap-3 h-full justify-center px-1">
                                                    {sessions.map((session: ISession, idx: number) => {
                                                        const groupUpper = session.group.toUpperCase();
                                                        const isKumaKids = groupUpper.includes("KUMA KIDS");
                                                        const isAltoRendimiento = groupUpper.includes("ALTO RENDIMIENTO");
                                                        const isKumaSeniors = groupUpper.includes("KUMA SENIORS");

                                                        return (
                                                            <motion.div
                                                                key={`${day}-${timeSlot}-${idx}`}
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                whileInView={{ opacity: 1, scale: 1 }}
                                                                viewport={{ once: true }}

                                                                className={`
                                                                    relative w-full rounded-xl p-4 border-2 flex flex-col justify-center overflow-hidden transition-all duration-300
                                                                    ${isKumaKids
                                                                        ? "bg-black/60 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                                                                        : isAltoRendimiento
                                                                            ? "bg-black/60 border-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                                                            : isKumaSeniors
                                                                                ? "bg-black/60 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                                                : "bg-zinc-950/60 border-white/10"}
                                                                `}
                                                            >
                                                                <div className="relative z-10 text-center flex flex-col items-center">
                                                                    <h4 className={`text-xs md:text-sm lg:text-[15px] font-black uppercase mb-1 tracking-wider
                                                                        ${isKumaKids ? "text-amber-400"
                                                                            : isAltoRendimiento ? "text-white"
                                                                                : isKumaSeniors ? "text-emerald-400"
                                                                                    : "text-white"}
                                                                    `}>
                                                                        {session.group}
                                                                    </h4>
                                                                    <p className="text-[9px] leading-tight text-zinc-400 font-medium">
                                                                        {session.description}
                                                                    </p>
                                                                </div>

                                                                <div className={`mt-3 h-1 w-10 rounded-full mx-auto
                                                                    ${isKumaKids ? "bg-amber-500"
                                                                        : isAltoRendimiento ? "bg-orange-700"
                                                                            : isKumaSeniors ? "bg-emerald-500"
                                                                                : "bg-kuma-gold/50"}
                                                                `} />
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-20 hover:opacity-100 transition-opacity duration-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
