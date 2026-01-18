"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export function AdminBackButton({ label = "Volver", href = "/admin" }: { label?: string, href?: string }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push(href)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors group"
        >
            <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-red-600 group-hover:bg-red-900/20 transition-all">
                <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-bold uppercase tracking-wider text-sm">{label}</span>
        </button>
    );
}

// Wrapper for Swipe-to-Go-Back functionality on mobile
export function SwipeBackWrapper({ children, target = "/admin" }: { children: React.ReactNode, target?: string }) {
    const router = useRouter();
    const x = useMotionValue(0);
    const opacity = useTransform(x, [0, 100], [1, 0.5]);

    const handleDragEnd = (event: any, info: any) => {
        if (info.offset.x > 100) { // Swipe right threshold
            router.push(target);
        }
    };

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }} // Snap back if not triggered
            dragElastic={0.2} // Feeling of resistance
            onDragEnd={handleDragEnd}
            style={{ x, opacity }}
            className="touch-pan-y" // Allow vertical scrolling, only capture horizontal
        >
            {children}
        </motion.div>
    );
}
