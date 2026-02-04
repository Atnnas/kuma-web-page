"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Define the Resource interface
interface Resource {
    id: string;
    letter: string; // The categorization letter
    title: string;
    tag: string;
    description: string;
    link: string;
    image?: string; // Optional thumbnail
}

// Data Source
const RESOURCES: Resource[] = [
    {
        id: "human-body",
        letter: "C",
        title: "Cuerpo Humano en Japonés",
        tag: "Anatomía Kuma",
        description: "Estudio del cuerpo humano en japonés. Puntos vitales (Kyusho) y terminología esencial.",
        link: "/recursos/didactica/cuerpo-humano",
        image: "/images/kuma-partes-cuerpo.jpg"
    },
    {
        id: "karategi",
        letter: "K",
        title: "Historia del Karategi",
        tag: "Historia & Tradición",
        description: "Origen, evolución y significado del uniforme blanco en el Camino del Guerrero.",
        link: "/recursos/didactica/karategi",
        image: "/images/kuma-karategui-partes.jpg"
    },
    {
        id: "kumite",
        letter: "K",
        title: "Kumite (WKF & Tradicional)",
        tag: "Combate & Estrategia",
        description: "Evolución histórica del combate: del Tegumi al Jiyu Kumite deportivo.",
        link: "/recursos/didactica/kumite",
        image: "/images/kuma-reglamento-kumite.jpg"
    },
    {
        id: "reglas-wkf",
        letter: "K",
        title: "Reglas del Kumite WKF",
        tag: "Reglamento Deportivo",
        description: "Historia de la WKF y sistema de puntuación oficial.",
        link: "/recursos/didactica/reglas-wkf",
        image: "/images/kuma-intro-puntos.jpg"
    },
    {
        id: "penalizaciones",
        letter: "K",
        title: "Penalizaciones, Kumite WKF",
        tag: "Reglamento & Sanciones",
        description: "Riesgos y consecuencias. El precio de infringir las reglas.",
        link: "/recursos/didactica/penalizaciones",
        image: "/images/kuma-arbitro.jpg"
    },
    {
        id: "puntos-kumite",
        letter: "K",
        title: "Sistema de Puntos",
        tag: "Reglamento & Puntuación",
        description: "Valoración técnica. Yuko, Waza-ari e Ippon.",
        link: "/recursos/didactica/puntos-kumite",
        image: "/images/kuma-arbitro-puntos.jpg"
    },
    // Future resources can be added here
];

export function DidacticBrowser() {
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

    // Filtering & Sorting Logic
    const filteredResources = RESOURCES
        .filter(resource => selectedLetter === null || resource.letter === selectedLetter)
        .sort((a, b) => a.title.localeCompare(b.title));

    return (
        <div className="w-full animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
            {/* --- ALPHABET FILTER --- */}
            <div className="mb-16">
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 md:gap-x-4 max-w-5xl mx-auto px-4">
                    {/* 'ALL' OPTION */}
                    <button
                        onClick={() => setSelectedLetter(null)}
                        className={cn(
                            "relative px-2 py-1 font-serif text-lg md:text-xl font-bold transition-all duration-300 outline-none select-none",
                            selectedLetter === null
                                ? "text-kuma-gold scale-110 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                                : "text-zinc-600 hover:text-white hover:scale-105"
                        )}
                    >
                        TODOS
                        {selectedLetter === null && (
                            <motion.div
                                layoutId="activeLetterIndicator"
                                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-kuma-gold shadow-[0_0_10px_rgba(234,179,8,1)] rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>

                    {/* LETTERS */}
                    {ALPHABET.map((letter) => (
                        <button
                            key={letter}
                            onClick={() => setSelectedLetter(letter)}
                            className={cn(
                                "relative px-2 py-1 font-serif text-lg md:text-xl font-bold transition-all duration-300 outline-none select-none",
                                selectedLetter === letter
                                    ? "text-kuma-gold scale-110 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                                    : "text-zinc-600 hover:text-white hover:scale-105"
                            )}
                        >
                            {letter}
                            {selectedLetter === letter && (
                                <motion.div
                                    layoutId="activeLetterIndicator"
                                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-kuma-gold shadow-[0_0_10px_rgba(234,179,8,1)] rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="relative min-h-[400px] flex flex-col items-center">

                {filteredResources.length > 0 ? (
                    <div className="w-full max-w-4xl grid grid-cols-1 gap-6">
                        {filteredResources.map((resource) => (
                            <Link
                                key={resource.id}
                                href={resource.link}
                                className="group relative bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-8 hover:border-kuma-gold/50 transition-all duration-300 overflow-hidden text-left block animate-in fade-in slide-in-from-bottom-4"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-kuma-gold/5 to-transparent group-hover:from-kuma-gold/10 transition-colors" />

                                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    {/* THUMBNAIL (Optional) */}
                                    {resource.image && (
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                            {/* We use standard img for simplicity inside map, or could use Next Image if imported */}
                                            <img
                                                src={resource.image}
                                                alt={resource.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-kuma-gold/10 text-kuma-gold text-xs font-bold uppercase tracking-widest rounded-full mb-3 border border-kuma-gold/20">
                                            {resource.tag}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-serif font-black text-white mb-2">
                                            {resource.title}
                                        </h3>
                                        <p className="text-zinc-400 mb-4 text-sm md:text-base leading-relaxed">
                                            {resource.description}
                                        </p>
                                        <span className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs border-b border-kuma-gold pb-1 group-hover:text-kuma-gold transition-colors">
                                            Iniciar Estudio
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                        </span>
                                    </div>
                                </div>

                                {/* Graphic Decor */}
                                <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity transform translate-x-1/4 translate-y-1/4 pointer-events-none">
                                    <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.8L18.4 19H5.6L12 5.8z" /></svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    // GENERIC EMPTY STATE (If no resources for selected letter)
                    <div className="w-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 min-h-[400px]">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/50 border border-white/10 mb-4 shadow-inner">
                                <span className="text-2xl font-serif font-black text-zinc-700">
                                    {selectedLetter}
                                </span>
                            </div>

                            <h3 className="text-zinc-500 font-serif text-xl tracking-wider">
                                Sin Recursos Disponibles
                            </h3>
                            <p className="text-zinc-600 text-sm max-w-sm mx-auto">
                                No hay contenido didáctico bajo la letra "{selectedLetter}" todavía.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
