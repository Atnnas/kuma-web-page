"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export const FloatingNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    // Show button only if not on home page
    useEffect(() => {
        setIsVisible(pathname !== "/");
    }, [pathname]);

    const handleBack = () => {
        router.back();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBack}
                    className="hidden md:block fixed bottom-8 right-8 z-[100] p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-white hover:bg-white/20 transition-colors group"
                    aria-label="Volver Atrás"
                >
                    <ArrowLeft className="w-8 h-8 md:w-6 md:h-6 text-kuma-gold group-hover:text-white transition-colors" />

                    {/* Ripple effect hint */}
                    <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};
