"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PrimalTitleProps {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export function PrimalTitle({ title, subtitle, children, className, size = "lg" }: PrimalTitleProps) {
    if (children) {
        return (
            <motion.h1
                initial={{ opacity: 0, scale: 0.8, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                className={cn("font-serif font-black text-white tracking-wide relative z-20", className)}
            >
                {children}
            </motion.h1>
        );
    }

    return (
        <div className={cn("text-center relative z-20", className)}>
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-kuma-gold font-bold uppercase tracking-[0.2em] text-xs md:text-sm mb-2"
            >
                {subtitle}
            </motion.h2>
            <motion.h1
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    textShadow: [
                        "0 4px 10px rgba(0,0,0,0.8)",
                        "0 0 30px rgba(185, 28, 28, 0.4)",
                        "0 4px 10px rgba(0,0,0,0.8)"
                    ]
                }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className={cn(
                    "font-serif font-black text-white uppercase italic tracking-tighter leading-none",
                    size === "xl" ? "text-5xl md:text-7xl" : "text-3xl md:text-5xl"
                )}
            >
                {title}
            </motion.h1>
        </div>
    );
}
