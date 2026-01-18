"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TouchDatePicker } from "./TouchDatePicker";

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
        return (
            <div className={className}>
                <TouchDatePicker date={date} setDate={setDate} />
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
