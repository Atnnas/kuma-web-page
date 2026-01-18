"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import clsx from "clsx";

interface TouchDatePickerProps {
    date: Date | undefined;
    setDate: (date: Date) => void;
    className?: string;
}

export function TouchDatePicker({ date, setDate, className }: TouchDatePickerProps) {
    // Default to today if null
    const safeDate = date && !isNaN(date.getTime()) ? date : new Date();

    const [day, setDay] = useState(safeDate.getDate());
    const [month, setMonth] = useState(safeDate.getMonth()); // 0-indexed
    const [year, setYear] = useState(safeDate.getFullYear());

    // Sync internal state if prop changes externally
    useEffect(() => {
        if (date && !isNaN(date.getTime())) {
            setDay(date.getDate());
            setMonth(date.getMonth());
            setYear(date.getFullYear());
        }
    }, [date]);

    // Update parent when parts change
    const updateDate = (d: number, m: number, y: number) => {
        // Validation logic
        // Clamp month 0-11
        let newM = m;
        let newY = y;

        if (newM > 11) { newM = 0; newY++; }
        if (newM < 0) { newM = 11; newY--; }

        // Clamp Day for the given month
        const maxDays = new Date(newY, newM + 1, 0).getDate();
        let newD = d;
        if (newD > maxDays) newD = 1; // Loop or clamp? User said "arrastre", looping feels better on wheels
        if (newD < 1) newD = maxDays;

        setDay(newD);
        setMonth(newM);
        setYear(newY);

        setDate(new Date(newY, newM, newD));
    };

    return (
        <div className={clsx("flex gap-2 w-full select-none", className)}>
            <NumberDragger
                label="DÍA"
                value={day}
                min={1}
                max={31} // We let the update logic handle real max
                onChange={(val) => updateDate(val, month, year)}
                className="flex-1"
            />
            <NumberDragger
                label="MES"
                value={month + 1} // Display 1-12
                min={1}
                max={12}
                onChange={(val) => updateDate(day, val - 1, year)}
                className="flex-1"
                formatter={(val) => {
                    const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
                    return monthNames[val - 1] || val.toString();
                }}
            />
            <NumberDragger
                label="AÑO"
                value={year}
                min={1900}
                max={2100}
                onChange={(val) => updateDate(day, month, val)}
                className="flex-[1.2]"
            />
        </div>
    );
}

interface NumberDraggerProps {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
    className?: string;
    formatter?: (val: number) => string;
}

function NumberDragger({ label, value, min, max, onChange, className, formatter }: NumberDraggerProps) {
    const y = useMotionValue(0);
    const dragBuffer = useRef(0);
    const THRESHOLD = 30; // Pixel drag to trigger change

    const handleDrag = (_: any, info: any) => {
        dragBuffer.current += info.delta.y;

        // Dragging DOWN (+Y) -> DECREASE
        // Dragging UP (-Y) -> INCREASE

        if (dragBuffer.current > THRESHOLD) {
            // Dragged Down enough
            const next = value - 1;
            onChange(next < min ? max : next); // Loop
            dragBuffer.current = 0;
            triggerHaptic();
        } else if (dragBuffer.current < -THRESHOLD) {
            // Dragged Up enough
            const next = value + 1;
            onChange(next > max ? min : next); // Loop
            dragBuffer.current = 0;
            triggerHaptic();
        }
    };

    const triggerHaptic = () => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10); // Light tick
        }
    };

    return (
        <div className={clsx("flex flex-col items-center", className)}>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</span>

            <div className="relative w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden flex flex-col items-center justify-center group shadow-inner">
                {/* Visual Indicators */}
                <div className="absolute top-2 w-full flex justify-center opacity-0 group-hover:opacity-50 transition-opacity">
                    <ChevronUp className="w-4 h-4 text-red-500" />
                </div>
                <div className="absolute bottom-2 w-full flex justify-center opacity-0 group-hover:opacity-50 transition-opacity">
                    <ChevronDown className="w-4 h-4 text-red-500" />
                </div>

                {/* Highlight/Center Bar */}
                <div className="absolute w-full h-12 bg-white/5 border-y border-white/5 pointer-events-none" />

                {/* Draggable Zone */}
                <motion.div
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.1} // Feel elastic but snap back
                    onDrag={handleDrag}
                    style={{ y, touchAction: "none" }}
                    className="cursor-grab active:cursor-grabbing w-full h-full flex items-center justify-center z-10"
                >
                    <motion.div
                        key={value} // Re-animate on change
                        initial={{ scale: 0.8, opacity: 0.5, y: -20 }} // Slide in effect
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0.5, y: 20 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] font-serif"
                    >
                        {formatter ? formatter(value) : value}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
