"use client";
import React from "react";
import { RitmoKatas } from "@/components/sections/RitmoKatas";
import { useRouter } from "next/navigation";

export default function RitmoKatasPage() {
    const router = useRouter();

    const handleBack = () => {
        router.push("/resources/aplicaciones");
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden pt-24 pb-20">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-kuma-gold/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 px-6 max-w-7xl mx-auto">
                <RitmoKatas onBack={handleBack} />
            </div>
        </main>
    );
}
