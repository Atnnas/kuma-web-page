import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MagnifyingGlass, Play, TrendUp, Sword, Scroll, Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface RitmoLibraryProps {
    show: boolean;
    onClose: () => void;
    rhythms: any[];
    search: string;
    onSearch: (s: string) => void;
    filterArt: string;
    onFilterArt: (a: string) => void;
    onLoad: (r: any) => void;
    onLoadAndPlay: (r: any) => void;
    onDelete: (r: any) => void;
}

export const RitmoLibrary = ({
    show,
    onClose,
    rhythms,
    search,
    onSearch,
    filterArt,
    onFilterArt,
    onLoad,
    onLoadAndPlay,
    onDelete
}: RitmoLibraryProps) => {
    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[80vh] bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header Biblioteca */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-950/50">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Biblioteca de Ritmos</h2>
                                <p className="text-zinc-500 text-sm font-medium">Selecciona un patrón para perfeccionar tu técnica.</p>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
                                <X size={24} weight="bold" />
                            </button>
                        </div>

                        {/* Filtros */}
                        <div className="p-6 bg-zinc-950/40 flex flex-col md:flex-row gap-4 border-b border-white/10">
                            <div className="relative flex-1">
                                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar Kata o Técnica..."
                                    value={search}
                                    onChange={(e) => onSearch(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:border-kuma-gold focus:ring-1 focus:ring-kuma-gold outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                {["all", "Karate", "Kobudo", "Kenjutsu"].map(art => (
                                    <button
                                        key={art}
                                        onClick={() => onFilterArt(art)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                                            filterArt === art 
                                                ? "bg-kuma-gold text-black border-kuma-gold shadow-[0_2px_10px_rgba(234,179,8,0.25)]" 
                                                : "bg-zinc-800 text-zinc-300 border-white/10 hover:bg-zinc-700 hover:text-white"
                                        )}
                                    >
                                        {art === "all" ? "Todos" : art}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Lista de Ritmos */}
                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rhythms.map((r, idx) => (
                                <div 
                                    key={`${r._id}-${idx}`} 
                                    className="group bg-zinc-900/90 border border-white/10 rounded-3xl p-6 hover:border-kuma-gold/50 hover:bg-zinc-950 transition-all duration-300 relative overflow-hidden shadow-lg flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-[9px] font-black uppercase text-zinc-350 border border-white/10">
                                                    {r.martialArt}
                                                </span>
                                                <span className="text-kuma-gold/90 text-[10px] font-black tracking-widest uppercase">{r.style}</span>
                                            </div>
                                            <h3 className="text-xl font-black text-white uppercase group-hover:text-kuma-gold transition-colors mt-1">{r.name}</h3>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono text-zinc-300 border border-white/5 font-bold">{r.points.length} PUNTOS</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6 relative z-10">
                                        <button
                                            onClick={() => onLoad(r)}
                                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <Scroll weight="bold" className="w-4 h-4 text-zinc-400" />
                                            Cargar
                                        </button>
                                        <button
                                            onClick={() => onLoadAndPlay(r)}
                                            className="flex-1 bg-kuma-gold hover:bg-amber-400 text-black py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-transparent transition-all duration-200 active:scale-95 shadow-[0_4px_15px_rgba(234,179,8,0.25)] flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <Play weight="fill" className="w-4 h-4" />
                                            Play
                                        </button>
                                        <button
                                            onClick={() => onDelete(r)}
                                            className="p-3 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white rounded-xl border border-red-500/20 hover:border-red-650 transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer"
                                            title="Eliminar del catálogo"
                                        >
                                            <Trash weight="bold" size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {rhythms.length === 0 && (
                                <div className="col-span-full py-20 text-center text-zinc-600">
                                    <MagnifyingGlass size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold uppercase tracking-widest">No se encontraron ritmos</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
