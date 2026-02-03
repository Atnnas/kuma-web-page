"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PrimalTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function PrimalTitle({ children, className }: PrimalTitleProps) {
    return (
        <motion.h1
            initial={{ opacity: 0, scale: 0.8, y: 20, filter: "blur(8px)" }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                filter: "blur(0px)",
                textShadow: [
                    "0 4px 10px rgba(0,0,0,0.8)",
                    "0 0 30px rgba(185, 28, 28, 0.5)", // Primal Red Glow
                    "0 4px 10px rgba(0,0,0,0.8)"
                ]
            }}
            transition={{
                duration: 0.8,
                ease: "circOut",
                textShadow: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "mirror"
                }
            }}
            className={cn(
                "font-serif font-black text-white tracking-wide relative z-20",
                className
            )}
        >
            {children}
        </motion.h1>
    );
}
