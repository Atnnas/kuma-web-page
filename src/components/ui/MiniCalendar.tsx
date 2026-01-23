"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface MiniCalendarProps {
    startDate: Date;
    endDate?: Date;
    className?: string;
}

export function MiniCalendar({ startDate, endDate, className }: MiniCalendarProps) {
    const days = useMemo(() => {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date(startDate);
        const monthStart = new Date(start.getFullYear(), start.getMonth(), 1);
        const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
        const startDayOffset = monthStart.getDay(); // 0 is Sunday

        // Generate array of days to render
        const daysArray = [];
        // Fill empty slots
        for (let i = 0; i < startDayOffset; i++) {
            daysArray.push(null);
        }
        // Fill days
        for (let i = 1; i <= daysInMonth; i++) {
            daysArray.push(i);
        }

        return { daysArray, start, end };
    }, [startDate, endDate]);

    return (
        <div className={cn("bg-zinc-950 border border-zinc-800 p-2 rounded-lg inline-block", className)}>
            <div className="text-[10px] font-bold text-center text-zinc-400 uppercase mb-1 tracking-wider border-b border-zinc-800 pb-1" suppressHydrationWarning>
                {days.start.toLocaleString('es-ES', { month: 'short' })}
            </div>
            <div className="grid grid-cols-7 gap-1 w-full text-center">
                {["D", "L", "K", "M", "J", "V", "S"].map(d => (
                    <span key={d} className="text-[8px] text-zinc-600 font-bold">{d}</span>
                ))}
                {days.daysArray.map((day, i) => {
                    if (!day) return <span key={i} />;

                    const currentDate = new Date(days.start.getFullYear(), days.start.getMonth(), day);
                    // Check intersection
                    // Normalize dates to remove time for comparison
                    const nDate = currentDate.setHours(0, 0, 0, 0);
                    const nStart = new Date(days.start).setHours(0, 0, 0, 0);
                    const nEnd = new Date(days.end).setHours(0, 0, 0, 0);

                    const isSelected = nDate >= nStart && nDate <= nEnd;
                    const isStart = nDate === nStart;
                    const isEnd = nDate === nEnd;

                    return (
                        <span
                            key={i}
                            className={cn(
                                "text-[9px] w-4 h-4 flex items-center justify-center rounded-sm transition-all",
                                isSelected ? "bg-red-900/30 text-red-200 font-bold" : "text-zinc-500",
                                (isStart || isEnd) && "bg-red-600 text-white shadow-sm scale-110 z-10"
                            )}
                        >
                            {day}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
