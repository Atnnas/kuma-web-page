"use client";

import { useState, useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verificar si ya aceptó las cookies
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            // Mostrar después de un breve retraso para no ser intrusivo inmediatamente
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie_consent", "true");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[100]"
                >
                    <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-800 p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="bg-zinc-800/50 p-2 h-fit rounded-lg text-kuma-gold">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-serif font-bold text-white text-lg">Privacidad y Cookies</h4>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Usamos cookies esenciales para seguridad (autenticación) y funcionamiento. Al continuar navegando, aceptas nuestra política.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-2">
                            <Link
                                href="/privacy"
                                className="text-xs text-zinc-500 hover:text-white underline decoration-zinc-700 underline-offset-4 transition-colors"
                            >
                                Leer Política
                            </Link>
                            <button
                                onClick={acceptCookies}
                                className="bg-red-700 hover:bg-red-600 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors shadow-lg shadow-red-900/20"
                            >
                                Entendido
                            </button>
                        </div>

                        <button
                            onClick={acceptCookies}
                            className="absolute top-2 right-2 text-zinc-600 hover:text-white transition-colors p-2"
                            aria-label="Cerrar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
