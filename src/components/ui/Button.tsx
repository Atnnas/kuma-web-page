"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for clean class merging
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    loading?: boolean;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

/**
 * Premium Interactive Button - "Kuma Primal Edition"
 * - Uses Framer Motion for tactile feedback
 * - Enhanced glow effects and aggressive hovers
 * - Integrated Loading State
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, loading, variant = "primary", size = "md", children, disabled, ...props }, ref) => {

        const variants = {
            primary: "bg-gradient-to-br from-red-700 to-red-900 text-white hover:from-red-600 hover:to-red-800 shadow-lg shadow-red-900/50 border border-red-800/50",
            secondary: "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 shadow-lg shadow-black/50",
            outline: "bg-transparent border border-red-900/50 text-red-500 hover:bg-red-950/30 hover:text-red-400 hover:border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.1)] hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]",
            ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 border-transparent",
        };

        const sizes = {
            sm: "h-9 px-4 text-xs tracking-wider",
            md: "h-12 px-8 text-sm tracking-widest uppercase font-bold",
            lg: "h-16 px-10 text-base tracking-[0.2em] uppercase font-black",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{
                    scale: disabled || loading ? 1 : 1.05,
                    filter: "brightness(1.2)"
                }}
                whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
                disabled={disabled || loading}
                className={cn(
                    "inline-flex items-center justify-center rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {/* Internal shine effect for primary buttons */}
                {variant === 'primary' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:animate-[shine_1s_infinite] pointer-events-none" />
                )}

                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";
