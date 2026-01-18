"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // We'll create utils next
import { motion } from "framer-motion";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

/**
 * Premium Input Field
 * - Glassmorphism style
 * - Focus animations
 * - Error validation state
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, label, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300">
                        {label}
                    </label>
                )}
                <motion.div
                    initial={false}
                    animate={error ? { x: [-2, 2, -2, 2, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <input
                        type={type}
                        className={cn(
                            "flex h-11 w-full rounded-md border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-white ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                            error && "border-red-500 focus-visible:ring-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </motion.div>
                {error && (
                    <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1 fade-in">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";
