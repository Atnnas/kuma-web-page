"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LockKey, X } from "@phosphor-icons/react/dist/ssr";

export function AuthStatusHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showInactiveModal, setShowInactiveModal] = useState(false);

    useEffect(() => {
        const error = searchParams.get("error");
        if (error === "inactive") {
            setShowInactiveModal(true);

            // Limpiar la URL sin recargar
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("error");
            const newPath = window.location.pathname + (newParams.toString() ? `?${newParams.toString()}` : "");
            window.history.replaceState(null, "", newPath);
        }
    }, [searchParams]);

    return (
        <AnimatePresence>
            {showInactiveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowInactiveModal(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="relative bg-zinc-900 border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />

                        <button
                            onClick={() => setShowInactiveModal(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={24} weight="bold" />
                        </button>

                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-6 border border-red-600/30">
                                <LockKey size={32} className="text-red-500" weight="fill" />
                            </div>

                            <h2 className="text-2xl font-serif font-bold text-white mb-4 uppercase tracking-widest">
                                Cuenta Pendiente de Activación
                            </h2>

                            <p className="text-zinc-400 mb-8 leading-relaxed">
                                Tu suscripción está siendo procesada. Un administrador activará tu cuenta en breve para que puedas acceder a las rutinas y entrenamientos exclusivos.
                            </p>

                            <button
                                onClick={() => setShowInactiveModal(false)}
                                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                            >
                                Entendido
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
