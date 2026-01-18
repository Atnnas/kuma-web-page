"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MailCheck, RefreshCcw, CheckCircle, AlertCircle } from "lucide-react";
import { resendVerificationEmail } from "@/lib/actions/auth";

export default function VerificationSentPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [countdown, setCountdown] = useState(0);
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResend = async () => {
        if (countdown > 0 || !email) return;

        setSending(true);
        setStatus(null);

        try {
            const result = await resendVerificationEmail(email);
            if (result.success) {
                setStatus({ type: "success", message: "¡Correo reenviado con éxito!" });
                setCountdown(60); // 60 segundos de cooldown
            } else {
                setStatus({ type: "error", message: result.message });
            }
        } catch (error) {
            setStatus({ type: "error", message: "Error al conectar con el servidor." });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center glass relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />

                <div className="flex justify-center mb-6">
                    <div className="bg-red-900/20 p-4 rounded-full relative">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <MailCheck className="w-12 h-12 text-red-500" />
                        </motion.div>
                    </div>
                </div>

                <h1 className="text-3xl font-serif font-black mb-2 text-kuma-gold uppercase tracking-widest drop-shadow-md">
                    Revisa tu correo
                </h1>
                <p className="text-zinc-400 mb-6 text-sm">
                    Hemos enviado un enlace de confirmación a <br />
                    <span className="text-white font-medium block mt-1">{email}</span>
                </p>

                <AnimatePresence mode="wait">
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={`p-3 rounded-lg mb-6 text-sm flex items-center gap-2 justify-center ${status.type === "success"
                                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                                }`}
                        >
                            {status.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {status.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    <button
                        onClick={handleResend}
                        disabled={sending || countdown > 0}
                        className={`w-full py-3 rounded-md font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all border ${sending || countdown > 0
                                ? "bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed"
                                : "bg-red-600/10 border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600"
                            }`}
                    >
                        {sending ? (
                            <RefreshCcw className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCcw className="w-4 h-4" />
                        )}
                        {countdown > 0 ? `Reenviar en ${countdown}s` : "No recibí el correo"}
                    </button>

                    <Link
                        href="/login"
                        className="block w-full bg-white text-black font-bold py-3 rounded-md hover:bg-zinc-200 transition-colors uppercase tracking-widest text-xs"
                    >
                        Volver al Inicio de Sesión
                    </Link>
                </div>

                <p className="mt-8 text-xs text-zinc-600">
                    ¿Sigue sin aparecer? Revisa tu carpeta de spam o contacta a soporte.
                </p>
            </motion.div>
        </div>
    );
}
