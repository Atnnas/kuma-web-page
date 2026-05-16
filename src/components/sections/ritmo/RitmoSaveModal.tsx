import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FloppyDiskBack } from "@phosphor-icons/react";

interface RitmoSaveModalProps {
    show: boolean;
    onClose: () => void;
    kataName: string;
    onKataNameChange: (s: string) => void;
    martialArt: string;
    onMartialArtChange: (s: string) => void;
    style: string;
    onStyleChange: (s: string) => void;
    isSaving: boolean;
    onSave: () => void;
}

export const RitmoSaveModal = ({
    show,
    onClose,
    kataName,
    onKataNameChange,
    martialArt,
    onMartialArtChange,
    style,
    onStyleChange,
    isSaving,
    onSave
}: RitmoSaveModalProps) => {
    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
                    >
                        <h2 className="text-2xl font-black uppercase text-white mb-6">Guardar Patrón</h2>
                        <div className="flex flex-col gap-4">
                            <input
                                placeholder="Nombre (ej: Heian Shodan)"
                                value={kataName}
                                onChange={(e) => onKataNameChange(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-kuma-gold/50"
                            />
                            <input
                                placeholder="Arte Marcial (ej: Karate)"
                                value={martialArt}
                                onChange={(e) => onMartialArtChange(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-kuma-gold/50"
                            />
                            <input
                                placeholder="Estilo (ej: Shotokan)"
                                value={style}
                                onChange={(e) => onStyleChange(e.target.value)}
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-kuma-gold/50"
                            />
                            <button
                                onClick={onSave}
                                disabled={isSaving}
                                className="w-full bg-kuma-gold text-black py-4 rounded-2xl font-black uppercase tracking-widest mt-4 hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            >
                                {isSaving ? "Guardando..." : <><FloppyDiskBack weight="fill" size={20} /> Guardar en Nube</>}
                            </button>
                            <button onClick={onClose} className="w-full py-4 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Cancelar</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
