"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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

import { useRef } from "react";

// Wrapper for Swipe-to-Go-Back functionality on mobile touch devices
// Uses passive edge touch detection without Framer Motion drag to never lock vertical scrolling
export function SwipeBackWrapper({ children, target = "/admin" }: { children: React.ReactNode, target?: string }) {
    const router = useRouter();
    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            // Only capture swipe back if gesture originates from the left edge (<= 40px)
            if (touch.clientX <= 40) {
                touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
            } else {
                touchStartRef.current = null;
            }
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartRef.current || e.changedTouches.length === 0) return;
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
        const deltaTime = Date.now() - touchStartRef.current.time;

        // Trigger if swiped right >= 70px, horizontally dominant, and completed within 500ms
        if (deltaX >= 70 && deltaX > deltaY * 1.5 && deltaTime <= 500) {
            router.push(target);
        }
        touchStartRef.current = null;
    };

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full"
        >
            {children}
        </div>
    );
}
