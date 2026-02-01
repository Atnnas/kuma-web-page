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

// --- Constants ---
const TIME_SLOTS = ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "8:30 PM"];
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// --- STATIC DATA (EDIT HERE DIRECTLY) ---
// --- STATIC DATA (EDIT HERE DIRECTLY) ---
const STATIC_SCHEDULE: IHorario[] = [
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
    },
    {
        _id: "6", day: "Sábado",
        sessions: []
    }
];

export function WeeklyScheduleTable() {

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
        const dayData = STATIC_SCHEDULE.find(d => normalize(d.day) === normalizedTargetDay);

        if (!dayData) return [];

        return dayData.sessions.filter(session => {
            const { hours, minutes } = parseTime(session.time);
            const isAltoRendimiento = session.group.includes("ALTO RENDIMIENTO");
            const isKumaSeniors = session.group.includes("KUMA SENIORS");

            // Custom logic to repeat Alto Rendimiento in 5pm, 6pm, and 7pm slots
            if (isAltoRendimiento) {
                if (targetTimeSlot === "5:00 PM" && hours === 17) return true;
                if (targetTimeSlot === "6:00 PM" && hours === 17) return true; // Show in 6pm slot too
                if (targetTimeSlot === "7:00 PM" && hours === 17) return true; // Show in 7pm slot too
            }

            // Custom logic to repeat Kuma Seniors in 7pm, 8pm, and 8:30pm slots
            if (isKumaSeniors) {
                if (targetTimeSlot === "7:00 PM" && hours === 19) return true;
                if (targetTimeSlot === "8:00 PM" && hours === 19) return true; // Show in 8pm slot too
                if (targetTimeSlot === "8:30 PM" && hours === 19) return true; // Show in 8:30pm slot too
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
            <div className="w-full overflow-hidden rounded-[2rem] border border-white/20 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr>
                            <th className="w-[150px] p-6 border-b border-white/20 bg-zinc-900/80 backdrop-blur-md sticky left-0 z-20">
                                <div className="flex flex-col gap-1">
                                    <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono">Horario</span>
                                    <span className="text-kuma-gold font-black uppercase text-xs">PM / Noche</span>
                                </div>
                            </th>
                            {DAYS.map((day) => (
                                <th key={day} className="p-4 border-b border-l border-white/20 bg-black/20 text-center first:border-l-0">
                                    <span className="block text-sm md:text-xl font-black uppercase text-white tracking-tighter mb-2">
                                        {day}
                                    </span>
                                    <div className="w-8 h-1 bg-kuma-gold/50 mx-auto rounded-full" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TIME_SLOTS.map((timeSlot) => (
                            <tr key={timeSlot} className="group/row bg-transparent hover:bg-white/5 transition-colors duration-300">
                                <td className="p-6 border-r border-b border-white/20 bg-zinc-900/50 backdrop-blur-sm font-mono text-zinc-400 font-bold sticky left-0 z-10 group-hover/row:bg-zinc-800/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-kuma-gold" />
                                        <span className="text-xl tracking-tight">{timeSlot.replace(" PM", "")}<span className="text-xs ml-1 align-top">PM</span></span>
                                    </div>
                                </td>
                                {DAYS.map((day) => {
                                    const sessions = getCellSessions(day, timeSlot);

                                    return (
                                        <td key={`${day}-${timeSlot}`} className="p-2 border-r border-b border-white/20 align-top h-[160px] relative">
                                            {sessions.length > 0 ? (
                                                <div className="flex flex-col gap-3 h-full justify-center">
                                                    {sessions.map((session, idx) => {
                                                        const isKumaKids = session.group.includes("KUMA KIDS");
                                                        const isDisruptivo = session.group.includes("Disruptivo");
                                                        const isAltoRendimiento = session.group.includes("ALTO RENDIMIENTO");
                                                        const isKumaSeniors = session.group.includes("KUMA SENIORS");

                                                        return (
                                                            <motion.div
                                                                key={`${day}-${timeSlot}-${idx}`}
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                whileInView={{ opacity: 1, scale: 1 }}
                                                                viewport={{ once: true }}

                                                                className={`
                                                                    relative w-full rounded-xl p-4 border flex flex-col justify-center overflow-hidden transition-all duration-300
                                                                    ${isDisruptivo
                                                                        ? "bg-fuchsia-950/40 border-fuchsia-500/40 hover:bg-fuchsia-900/60 hover:shadow-fuchsia-500/20"
                                                                        : isKumaKids
                                                                            ? "bg-gradient-to-br from-amber-950/80 via-black to-orange-950/80 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                                                            : isAltoRendimiento
                                                                                ? "bg-gradient-to-br from-zinc-900 via-stone-950 to-black border-stone-200 shadow-[0_0_15px_rgba(231,229,228,0.25)] hover:shadow-[0_0_25px_rgba(231,229,228,0.4)]"
                                                                                : isKumaSeniors
                                                                                    ? "bg-gradient-to-br from-emerald-950/80 via-teal-950 to-green-950/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                                                                                    : "bg-zinc-800/40 border-white/5 hover:bg-zinc-800/60 hover:border-kuma-gold/30"}
                                                                `}
                                                            >
                                                                <div className="relative z-10 text-center flex flex-col items-center">

                                                                    {/* TITLE - GOLDEN GLOW */}
                                                                    <h4 className={`text-sm lg:text-base font-black uppercase mb-1 tracking-wide
                                                                        ${isDisruptivo ? "text-fuchsia-300"
                                                                            : isKumaKids ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                                                                                : isAltoRendimiento ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]"
                                                                                    : isKumaSeniors ? "text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                                                                                        : "text-white"}
                                                                    `}>
                                                                        {session.group}
                                                                    </h4>

                                                                    {/* DESCRIPTION */}
                                                                    <p className={`text-[10px] leading-snug line-clamp-2
                                                                        ${isKumaKids ? "text-amber-100/80"
                                                                            : isAltoRendimiento ? "text-stone-300"
                                                                                : isKumaSeniors ? "text-emerald-100/80"
                                                                                    : "text-zinc-500 group-hover/row:text-zinc-400"}
                                                                    `}>
                                                                        {session.description}
                                                                    </p>
                                                                </div>

                                                                {/* ACCENT LINE */}
                                                                <div className={`mt-3 h-1 w-12 rounded-full mx-auto
                                                                    ${isDisruptivo ? "bg-fuchsia-500"
                                                                        : isKumaKids ? "bg-amber-500 shadow-[0_0_10px_orange]"
                                                                            : isAltoRendimiento ? "bg-amber-800 shadow-[0_0_5px_rgba(146,64,14,0.5)]"
                                                                                : isKumaSeniors ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                                                                                    : "bg-kuma-gold/50"}
                                                                `} />
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover/row:bg-white/20" />
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
