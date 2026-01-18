"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Simple utility to merge classes if @/lib/utils doesn't exist
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    className?: string;
    placeholder?: string;
}

export function DatePicker({ date, setDate, className, placeholder = "Seleccionar fecha" }: DatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const [isMobile, setIsMobile] = React.useState(false);

    // Detect mobile size
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Close on click outside (only for desktop popover)
    React.useEffect(() => {
        if (isMobile) return; // Mobile uses modal backdrop click
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobile]);

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        setIsOpen(false);
    };

    // Mobile: Numeric Inputs (Day / Month / Year) - Direct Interaction
    if (isMobile) {
        // Helpers for extracting parts or defaulting to Today if undefined
        const isValidDate = date && !isNaN(date.getTime());
        const dVal = isValidDate ? date!.getDate() : "";
        const mVal = isValidDate ? date!.getMonth() + 1 : "";
        const yVal = isValidDate ? date!.getFullYear() : "";

        const updateDateParts = (field: 'day' | 'month' | 'year', value: string) => {
            const num = parseInt(value, 10);
            if (isNaN(num)) return; // Prevent NaN updates

            let baseDate = date || new Date();
            let newDay = baseDate.getDate();
            let newMonth = baseDate.getMonth();
            let newYear = baseDate.getFullYear();

            // First, update the target field
            if (field === 'day') newDay = num;
            if (field === 'month') newMonth = num - 1; // 0-indexed
            if (field === 'year') newYear = num;

            // Handle Month Overflow (12 -> 0, -1 -> 11)
            if (newMonth < 0) newMonth = 0;
            if (newMonth > 11) newMonth = 11;

            // Handle Day clamping
            const maxDays = new Date(newYear, newMonth + 1, 0).getDate();
            if (newDay > maxDays) newDay = maxDays;
            if (newDay < 1) newDay = 1;

            const newDate = new Date(newYear, newMonth, newDay);
            setDate(newDate);
        };

        return (
            <div className={classNames("grid grid-cols-3 gap-2 w-full", className)}>
                {/* Day */}
                <div className="flex flex-col">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase text-center mb-1 tracking-wider">Día</label>
                    <input
                        type="number"
                        value={dVal}
                        placeholder="DD"
                        min={1}
                        max={31}
                        onChange={(e) => updateDateParts('day', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-1 text-center text-white text-xl font-bold focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all placeholder:text-zinc-700 appearance-auto"
                    />
                </div>

                {/* Month */}
                <div className="flex flex-col">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase text-center mb-1 tracking-wider">Mes</label>
                    <input
                        type="number"
                        value={mVal}
                        placeholder="MM"
                        min={1}
                        max={12}
                        onChange={(e) => updateDateParts('month', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-1 text-center text-white text-xl font-bold focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all placeholder:text-zinc-700 appearance-auto"
                    />
                </div>

                {/* Year */}
                <div className="flex flex-col">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase text-center mb-1 tracking-wider">Año</label>
                    <input
                        type="number"
                        value={yVal}
                        placeholder="AAAA"
                        min={1900}
                        max={2100}
                        onChange={(e) => updateDateParts('year', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-1 text-center text-white text-xl font-bold focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all placeholder:text-zinc-700 appearance-auto"
                    />
                </div>
            </div>
        );
    }

    // Desktop: Custom Popover
    return (
        <div className={classNames("relative", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={classNames(
                    "w-full flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-left transition-all hover:border-zinc-700 focus:outline-none focus:border-red-500",
                    !date && "text-zinc-500",
                    date && "text-white"
                )}
            >
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-red-600" />
                    {date && !isNaN(date.getTime()) ? (
                        <span className="font-medium capitalize">
                            {format(date, "PPP", { locale: es })}
                        </span>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute top-full mt-2 left-0 z-50 p-4 rounded-xl glass border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] w-[300px] xs:w-auto overflow-hidden backdrop-blur-xl"
                    >
                        <DayPicker
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            locale={es}
                            showOutsideDays
                            className="p-3"
                            classNames={{
                                month: "space-y-4",
                                caption: "flex justify-center pt-2 relative items-center mb-4",
                                caption_label: "text-base font-serif font-black text-kuma-gold uppercase tracking-widest drop-shadow-sm",
                                nav: "space-x-1 flex items-center bg-white/5 rounded-full p-1",
                                nav_button: "h-7 w-7 bg-transparent hover:bg-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex w-full justify-between mb-2",
                                head_cell: "text-zinc-500 rounded-md w-9 font-bold text-[0.8rem] capitalize flex justify-center pb-2",
                                row: "flex w-full mt-2 justify-between",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-red-900/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-9 w-9 p-0 font-medium aria-selected:opacity-100 hover:bg-white/10 text-zinc-300 rounded-lg transition-all flex items-center justify-center hover:scale-110",
                                day_selected: "bg-gradient-to-br from-red-600 to-red-900 text-white hover:from-red-500 hover:to-red-800 focus:bg-red-700 !rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500/50",
                                day_today: "bg-white/5 text-kuma-gold font-bold border border-white/10",
                                day_outside: "text-zinc-700 opacity-50",
                                day_disabled: "text-zinc-700 opacity-50",
                                day_range_middle: "aria-selected:bg-zinc-800 aria-selected:text-zinc-100",
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
