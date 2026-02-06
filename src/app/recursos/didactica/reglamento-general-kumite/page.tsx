"use client";
import React from "react";
import { BackButton } from "@/components/ui/BackButton";
import { PrimalTitle } from "@/components/ui/PrimalTitle";

export default function ReglamentoGeneralPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-kuma-gold/30">
            {/* --- HEADER --- */}
            <header className="relative w-full h-[40vh] md:h-[50vh] flex flex-col items-center justify-center overflow-hidden border-b border-kuma-gold/20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-zinc-950" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
                    <PrimalTitle className="text-4xl md:text-6xl lg:text-7xl mb-6">
                        Reglamento General
                    </PrimalTitle>
                </div>

                <BackButton href="/recursos/didactica" />
            </header>

            {/* --- CONTENT --- */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {/* Content Cleared as requested */}
                    <div className="flex flex-col items-center justify-center text-zinc-500 italic">
                        <p>Contenido en reconstrucción.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
