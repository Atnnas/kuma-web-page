"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
    value: string;
    label: string;
    description?: string;
    category?: string;
}

interface StrictComboboxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function StrictCombobox({ value, onChange, placeholder = "Seleccionar ejercicio...", className }: StrictComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [options, setOptions] = React.useState<Option[]>([]);
    const [loading, setLoading] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Initial load + search debounce
    React.useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/exercises?query=${encodeURIComponent(search)}`);
                if (res.ok) {
                    const data = await res.json();
                    setOptions(data.map((ex: any) => ({
                        value: ex.name,
                        label: ex.name,
                        description: ex.difficulty,
                        category: ex.category
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch exercises", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            if (open) fetchOptions();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, open]);

    // Close on click outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus input when opening
    React.useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    // Handle selection
    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setOpen(false);
        setSearch("");
    };

    return (
        <div className={cn("relative z-50", className)} ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-left hover:border-kuma-gold/50 transition-colors focus:outline-none focus:ring-2 focus:ring-kuma-gold/20"
            >
                <span className={value ? "text-white font-medium" : "text-zinc-500"}>
                    {value || placeholder}
                </span>
                <ChevronsUpDown className="w-4 h-4 text-zinc-500 shrink-0" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute mt-2 w-full bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-80 flex flex-col"
                    >
                        {/* Search Input */}
                        <div className="flex items-center px-3 border-b border-white/5 bg-zinc-900 sticky top-0">
                            <Search className="w-4 h-4 text-zinc-500 mr-2" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                                placeholder="Buscar en la base de datos..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {loading && <Loader2 className="w-4 h-4 text-kuma-gold animate-spin ml-2" />}
                        </div>

                        {/* Options List */}
                        <div className="overflow-y-auto p-1 flex-1">
                            {options.length === 0 && !loading ? (
                                <div className="p-4 text-center text-zinc-500 text-sm italic">
                                    No se encontraron ejercicios.
                                    <br />
                                    <span className="text-[10px]">Intenta con "Sentadilla" o "Flexiones"</span>
                                </div>
                            ) : (
                                options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left mb-0.5",
                                            value === option.value
                                                ? "bg-kuma-gold text-black font-bold"
                                                : "text-zinc-300 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex flex-col">
                                            <span>{option.label}</span>
                                            {option.category && (
                                                <span className={cn(
                                                    "text-[10px] uppercase tracking-wider",
                                                    value === option.value ? "text-black/60" : "text-zinc-600"
                                                )}>
                                                    {option.category} • {option.description}
                                                </span>
                                            )}
                                        </div>
                                        {value === option.value && <Check className="w-4 h-4" />}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
