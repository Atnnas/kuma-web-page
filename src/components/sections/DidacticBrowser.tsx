"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function DidacticBrowser() {
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

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
            <div className="relative min-h-[400px] flex flex-col items-center justify-center">

                {/* CASE "C": SHOW HUMAN BODY CARD */}
                {selectedLetter === "C" && (
                    <div className="w-full max-w-4xl grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4">
                        <Link href="/recursos/didactica/cuerpo-humano" className="group relative bg-zinc-900 border border-white/10 rounded-3xl p-8 hover:border-kuma-gold/50 transition-all duration-300 overflow-hidden text-left block">
                            <div className="absolute inset-0 bg-gradient-to-br from-kuma-gold/5 to-transparent group-hover:from-kuma-gold/10 transition-colors" />
                            <div className="relative z-10 flex flex-col items-start">
                                <span className="inline-block px-3 py-1 bg-kuma-gold/10 text-kuma-gold text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-kuma-gold/20">Anatomía Kuma</span>
                                <h3 className="text-3xl font-serif font-black text-white mb-2">Cuerpo Humano en Japonés</h3>
                                <p className="text-zinc-400 mb-6 max-w-md">Estudia los puntos vitales (Kyusho) y partes del cuerpo sobre nuestro guardián del Dojo.</p>
                                <span className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs border-b border-kuma-gold pb-1 group-hover:text-kuma-gold transition-colors">
                                    Iniciar Estudio <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </span>
                            </div>

                            {/* Graphic Decor - Bear Paw or similar */}
                            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity transform translate-x-1/4 translate-y-1/4">
                                <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.8L18.4 19H5.6L12 5.8z" /></svg>
                            </div>
                        </Link>
                    </div>
                )}

                {/* GENERIC CONTENT DISPLAY (Show if NOT C) */}
                {selectedLetter !== "C" && (
                    <div className="w-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors p-12 group min-h-[400px]">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/50 border border-white/10 mb-4 group-hover:scale-110 transition-transform duration-500 group-hover:border-kuma-gold/50 shadow-inner">
                                <span className="text-2xl font-serif font-black text-white/20 group-hover:text-kuma-gold transition-colors duration-500">
                                    {selectedLetter || "ALL"}
                                </span>
                            </div>

                            <h3 className="text-zinc-400 font-serif text-xl tracking-wider">
                                {selectedLetter
                                    ? `Recursos Iniciados en "${selectedLetter}"`
                                    : "Explorando Todos los Recursos"
                                }
                            </h3>
                            <p className="text-zinc-600 text-sm max-w-sm mx-auto">
                                Proximamente más contenido didáctico.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
