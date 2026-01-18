"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange, DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    className?: string;
    placeholder?: string;
}

export function DateRangePicker({ date, setDate, className, placeholder = "Seleccionar rango" }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Check mobile
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 640px)").matches);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (selectedDate: DateRange | undefined) => {
        setDate(selectedDate);
    };

    // Mobile: Native Inputs for Range
    if (isMobile) {
        return (
            <div className={cn("grid grid-cols-2 gap-2", className)}>
                <div className="relative">
                    <input
                        type="date"
                        value={date?.from ? format(date.from, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            const newDate = val ? new Date(val + "T12:00:00") : undefined;
                            setDate({ from: newDate, to: date?.to });
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white text-xs focus:outline-none focus:border-red-500 appearance-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
                        style={{ colorScheme: "dark" }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500 pointer-events-none">Desde</span>
                </div>
                <div className="relative">
                    <input
                        type="date"
                        value={date?.to ? format(date.to, "yyyy-MM-dd") : ""}
                        min={date?.from ? format(date.from, "yyyy-MM-dd") : undefined}
                        onChange={(e) => {
                            const val = e.target.value;
                            const newDate = val ? new Date(val + "T12:00:00") : undefined;
                            setDate({ from: date?.from, to: newDate });
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white text-xs focus:outline-none focus:border-red-500 appearance-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
                        style={{ colorScheme: "dark" }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500 pointer-events-none">Hasta</span>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-left transition-all hover:border-zinc-700 focus:outline-none focus:border-red-500 min-w-[250px]",
                        !date?.from && "text-zinc-500",
                        date?.from && "text-white"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-red-600" />
                        {date?.from ? (
                            <span className="font-medium capitalize text-sm">
                                {format(date.from, "dd MMM", { locale: es })}
                                {date.to ? ` - ${format(date.to, "dd MMM, yyyy", { locale: es })}` : ""}
                            </span>
                        ) : (
                            <span className="text-sm">{placeholder}</span>
                        )}
                    </div>
                </button>
                {date?.from && (
                    <button
                        onClick={() => setDate(undefined)}
                        className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:text-red-500 transition-colors text-zinc-400"
                        title="Limpiar fecha"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute top-full mt-2 left-0 z-50 p-4 rounded-xl glass border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] w-auto overflow-hidden backdrop-blur-xl"
                    >
                        <DayPicker
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={handleSelect}
                            locale={es}
                            numberOfMonths={isMobile ? 1 : 2}
                            showOutsideDays
                            className="p-1"
                            classNames={{
                                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                month: "space-y-4",
                                caption: "flex justify-center pt-2 relative items-center mb-4",
                                caption_label: "text-base font-serif font-black text-kuma-gold uppercase tracking-widest drop-shadow-sm",
                                nav: "space-x-1 flex items-center bg-white/5 rounded-full p-1",
                                nav_button: "h-7 w-7 bg-transparent hover:bg-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell: "text-zinc-500 rounded-md w-9 font-bold text-[0.8rem] capitalize flex justify-center pb-2",
                                row: "flex w-full mt-2 justify-between",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-red-900/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-9 w-9 p-0 font-medium aria-selected:opacity-100 hover:bg-white/10 text-zinc-300 rounded-lg transition-all flex items-center justify-center hover:scale-110",
                                day_selected: "bg-gradient-to-br from-red-600 to-red-900 text-white hover:from-red-500 hover:to-red-800 focus:bg-red-700 !rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500/50",
                                day_today: "bg-white/5 text-kuma-gold font-bold border border-white/10",
                                day_outside: "text-zinc-600 opacity-30",
                                day_disabled: "text-zinc-600 opacity-30",
                                day_range_middle: "aria-selected:bg-red-900/10 aria-selected:text-red-200",
                                day_hidden: "invisible",
                            }}
                            components={{
                                Chevron: ({ orientation }) => {
                                    const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
                                    return <Icon className="h-4 w-4 text-white" />;
                                },
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
