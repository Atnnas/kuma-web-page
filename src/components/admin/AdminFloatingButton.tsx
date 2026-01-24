"use client";

import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminFloatingButtonProps {
    onClick: () => void;
    label: string;
    className?: string;
}

export function AdminFloatingButton({ onClick, label, className }: AdminFloatingButtonProps) {
    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
            <Button
                onClick={onClick}
                className={cn(
                    "bg-red-600 hover:bg-white hover:text-red-600 text-white font-bold uppercase tracking-widest shadow-[0_4px_20px_rgba(220,38,38,0.5)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.6)] transition-all duration-300 rounded-full px-5 py-4 md:px-6 md:py-6 h-auto flex items-center gap-2 group border-2 border-transparent hover:border-red-600 text-xs md:text-sm",
                    className
                )}
            >
                <Plus className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-180 transition-transform duration-500" />
                <span className="inline">{label}</span>
            </Button>
        </div>
    );
}
