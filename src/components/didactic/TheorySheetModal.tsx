"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { TheorySection } from "@/types/didactica";
import { KumaMascot } from "./KumaMascot";
import { X, BookOpen, Scroll, CheckCircle, Lightbulb } from "@phosphor-icons/react";

interface TheorySheetModalProps {
    isOpen: boolean;
    onClose: () => void;
    theory: TheorySection;
    levelTitle: string;
    onStartPractice?: () => void;
}

export function TheorySheetModal({
    isOpen,
    onClose,
    theory,
    levelTitle,
    onStartPractice,
}: TheorySheetModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 md:p-8 pt-12 md:pt-16 pb-12 md:pb-16 bg-black/90 backdrop-blur-2xl overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="relative w-full max-w-4xl bg-zinc-900 border border-kuma-gold/30 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.15)] overflow-hidden my-auto max-h-[90vh] flex flex-col"
                >
                    {/* MODAL HEADER */}
                    <div className="relative z-10 px-6 py-5 border-b border-white/10 flex items-center justify-between bg-zinc-950/80 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-kuma-gold/10 border border-kuma-gold/30 flex items-center justify-center text-kuma-gold">
                                <Scroll className="w-5 h-5" weight="duotone" />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-kuma-gold">
                                    Pergamino de Conocimiento Kuma
                                </span>
                                <h3 className="text-lg md:text-xl font-serif font-black text-white leading-tight">
                                    {theory.title || levelTitle}
                                </h3>
                                {theory.subtitle && (
                                    <p className="text-xs text-amber-200/80 font-medium mt-0.5">
                                        {theory.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Prominent Close Button */}
                        <button
                            onClick={onClose}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-red-950/60 border border-white/20 hover:border-red-500/50 text-zinc-300 hover:text-red-400 text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer group"
                            aria-label="Cerrar pergamino"
                        >
                            <X className="w-5 h-5 text-zinc-400 group-hover:text-red-400 transition-colors" weight="bold" />
                            <span>Cerrar</span>
                        </button>
                    </div>

                    {/* MODAL BODY (SCROLLABLE) */}
                    <div className="p-6 md:p-8 overflow-y-auto space-y-8 text-zinc-300 leading-relaxed text-sm md:text-base">
                        {/* QUOTE BLOCK */}
                        {theory.quote && (
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-kuma-gold/10 to-transparent border-l-4 border-kuma-gold shadow-sm">
                                <p className="font-serif italic text-base md:text-lg text-amber-100">
                                    &ldquo;{theory.quote}&rdquo;
                                </p>
                            </div>
                        )}

                        {/* IMAGES (IF ANY) */}
                        {theory.images && theory.images.length > 0 && (
                            <div className={`grid ${theory.images.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-5`}>
                                {theory.images.map((img, idx) => (
                                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-black/80 shadow-xl group flex flex-col">
                                        <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-950">
                                            <Image
                                                src={img.src}
                                                alt={img.alt}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                priority
                                            />
                                        </div>
                                        {img.caption && (
                                            <div className="p-3 bg-zinc-950/95 border-t border-white/5 text-center text-xs text-zinc-300 font-medium">
                                                {img.caption}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CONTENT PARAGRAPHS */}
                        <div className="space-y-4 text-justify">
                            {theory.content.map((p, idx) => (
                                <p key={idx} className="text-zinc-300">
                                    {p}
                                </p>
                            ))}
                        </div>

                        {/* BULLET POINTS / CARDS (IF ANY, e.g. 6 Criterios o Penalizaciones) */}
                        {theory.bulletPoints && theory.bulletPoints.length > 0 && (
                            <div className="pt-4 border-t border-white/10">
                                <h4 className="text-xs uppercase tracking-widest font-bold text-kuma-gold mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" weight="fill" />
                                    Puntos Clave del Estudio
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {theory.bulletPoints.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-kuma-gold/30 transition-colors flex gap-4 items-start"
                                        >
                                            {item.image && (
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <h5 className="font-bold text-white text-sm font-serif">
                                                        {item.title}
                                                    </h5>
                                                    {item.badge && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-kuma-gold/15 text-kuma-gold border border-kuma-gold/30">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-zinc-400 leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* REFERENCES */}
                        {theory.references && theory.references.length > 0 && (
                            <div className="pt-6 border-t border-white/10 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                                        <BookOpen className="w-4 h-4" weight="fill" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs uppercase tracking-widest font-black text-amber-300">
                                            Bibliografía & Fuentes Históricas en Español
                                        </h4>
                                        <p className="text-[11px] text-zinc-400">
                                            Obras maestras, investigaciones antropológicas y documentos canónicos de consulta:
                                        </p>
                                    </div>
                                </div>

                                {/* MOBILE ONLY: SENSEI SCHOLAR COMPANION CON POSTE Y ANIMACIÓN COMPLETA */}
                                <div className="md:hidden w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-amber-950/70 via-[#1E293B] to-[#0F172A] border border-[#FFC800]/50 shadow-md overflow-visible">
                                    <div className="w-56 h-44 flex items-center justify-center overflow-visible relative">
                                        <KumaMascot size="md" mood="thinking" showBubble={false} interactive={true} />
                                    </div>
                                    <div className="text-center mt-2">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-[#FFC800] block mb-1">
                                            📜 Kuma Sensei Académico (¡Tócalo para partir el poste!)
                                        </span>
                                        <p className="text-[11px] text-amber-100/90 leading-tight font-serif italic max-w-sm mx-auto">
                                            &ldquo;Cada tratado antiguo contiene los secretos de los pioneros de Okinawa. ¡Léelos con respeto!&rdquo;
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                    {theory.references.map((ref, idx) => {
                                        if (typeof ref === "string") {
                                            return (
                                                <div
                                                    key={idx}
                                                    className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-amber-500/30 transition-all text-xs text-zinc-300 flex items-start gap-2.5"
                                                >
                                                    <span className="text-amber-400 font-bold shrink-0 mt-0.5">📖</span>
                                                    <span className="leading-relaxed font-sans">{ref}</span>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={idx}
                                                className="p-3.5 rounded-xl bg-black/50 border border-amber-500/20 hover:border-amber-500/50 transition-all space-y-1.5 shadow-sm"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <h5 className="font-serif font-bold text-amber-100 text-xs md:text-sm leading-snug">
                                                        &ldquo;{ref.title}&rdquo;
                                                    </h5>
                                                    {ref.year && (
                                                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                                                            {ref.year}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-[11px] text-zinc-300 font-medium flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-amber-300/90 font-semibold">{ref.author}</span>
                                                    {ref.editorial && (
                                                        <>
                                                            <span className="text-zinc-600">•</span>
                                                            <span className="text-zinc-400">{ref.editorial}</span>
                                                        </>
                                                    )}
                                                </div>

                                                {ref.chapter && (
                                                    <p className="text-[11px] text-zinc-400">
                                                        <strong className="text-zinc-300 font-medium">{ref.chapter}</strong>
                                                    </p>
                                                )}

                                                {ref.note && (
                                                    <p className="text-[11px] text-zinc-300/90 italic bg-white/[0.03] p-2 rounded-lg border border-white/5 mt-1 leading-relaxed">
                                                        📌 {ref.note}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MODAL FOOTER */}
                    <div className="p-4 md:px-8 border-t border-white/10 bg-zinc-950/80 flex items-center justify-between gap-4">
                        <span className="text-xs text-zinc-500 hidden sm:inline-flex items-center gap-1.5">
                            <Lightbulb className="w-4 h-4 text-kuma-gold" />
                            Puedes volver a consultar este pergamino en cualquier momento.
                        </span>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl border border-white/15 text-xs uppercase font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Cerrar
                            </button>
                            {onStartPractice && (
                                <button
                                    onClick={() => {
                                        onClose();
                                        onStartPractice();
                                    }}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-kuma-gold text-zinc-950 text-xs uppercase font-black tracking-wider hover:brightness-110 shadow-lg shadow-kuma-gold/20 transition-all"
                                >
                                    ¡Comenzar Reto! 🥋
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
