"use client";
import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
    href: string;
    label?: string;
    className?: string;
}

export function BackButton({ href, label = "Volver", className }: BackButtonProps) {
    return (
        <Link
            href={href}
            className={cn(
                "absolute top-24 md:top-28 left-4 md:left-12 z-50 flex items-center gap-2 text-zinc-500 hover:text-kuma-gold transition-colors font-bold uppercase tracking-widest text-xs group",
                className
            )}
        >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {label}
        </Link>
    );
}
