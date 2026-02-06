"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { RutinasTable } from "@/components/rutinas/RutinasTable";

interface IRoutine {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    thumbnail?: string;
    estimated_duration: number;
    equipment_types: string[];
}

export default function RutinasPage() {
    const [routines, setRoutines] = useState<IRoutine[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRoutines() {
            try {
                const res = await fetch(`/api/routines`, {
                    cache: "no-store",
                });

                if (!res.ok) {
                    console.error("Failed to fetch routines:", res.status, res.statusText);
                    throw new Error("Failed to fetch");
                }

                const data = await res.json();
                setRoutines(data);
                console.log("Routines fetched:", data.length); // DEBUG
            } catch (error) {
                console.error("Error loading routines", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRoutines();
    }, []);

    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-kuma-gold/30 pb-32 relative">
            {/* Global Background Depth */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black" />
                <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-[0.03]" />
            </div>

            {/* --- HERO SECTION --- */}
            <header className="relative w-full h-[40vh] md:h-[50vh] flex flex-col items-center justify-center overflow-hidden border-b border-kuma-gold/20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-zinc-950" />
                    {/* Animated Glow */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 blur-[120px] rounded-full"
                    />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
                    <PrimalTitle className="text-4xl md:text-6xl lg:text-7xl mb-6">
                        Rutinas
                    </PrimalTitle>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 font-serif italic text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        "Entrenamiento complementario diseñado para potenciar tu Karate fuera del tatami."
                    </motion.p>
                </div>

                <BackButton href="/entrenamiento" />
            </header>

            {/* --- CONTENT GRID --- */}
            <section className="relative -mt-20 z-20 px-4 max-w-7xl mx-auto">

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-kuma-gold animate-spin" />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <RutinasTable data={routines as any} />
                    </div>
                )}

                {/* --- COMING SOON --- */}
                <div className="mt-20 text-center">
                    <p className="text-zinc-600 italic">Más rutinas serán agregadas próximamente.</p>
                </div>
            </section>

        </main>
    );
}


