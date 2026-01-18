"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface AnimatedLogoProps {
    src: string;
    alt: string;
}

export function AnimatedLogo({ src, alt }: AnimatedLogoProps) {
    return (
        <motion.div
            className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 z-20"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                y: [0, -8, 0], // Floating effect
            }}
            transition={{
                duration: 1, // Entrance
                y: {
                    duration: 3, // Floating speed
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }}
        >
            {/* Ethereal Glow Behind */}
            <motion.div
                className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* The Logo */}
            <div className="relative w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain"
                />
            </div>
        </motion.div>
    );
}
