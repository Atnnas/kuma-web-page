"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Trophy, AlertTriangle, Loader2 } from "lucide-react";

function getErrorMessage(errorCode: string | null) {
    if (!errorCode) return null;
    switch (errorCode) {
        case "OAuthCallback":
        case "OAuthSignin":
            return "No se pudo conectar con Google. Por favor intenta de nuevo.";
        case "OAuthCreateAccount":
            return "No fue posible crear tu cuenta con Google. Intenta más tarde.";
        case "AccessDenied":
            return "Acceso denegado al conectar con Google.";
        case "Configuration":
            return "Problema de configuración en el proveedor de autenticación.";
        default:
            return "Ocurrió un error al registrarte. Por favor intenta de nuevo.";
    }
}

function RegisterContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const errorParam = searchParams.get("error");
    const errorMessage = getErrorMessage(errorParam);

    const [isJoining, setIsJoining] = useState(false);

    const handleGoogleJoin = async () => {
        setIsJoining(true);
        try {
            await signIn("google", { callbackUrl });
        } catch (error) {
            console.error("Error joining with Google:", error);
            setIsJoining(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full max-w-md bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85),_0_0_35px_rgba(220,38,38,0.12)] overflow-hidden z-10"
        >
            {/* Borde superior rojo/carmesí sutil (Kuma Crimson) */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />

            {/* Cabecera / Logo del Dojo */}
            <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mx-auto w-20 h-20 rounded-2xl overflow-hidden border border-red-500/30 shadow-[0_0_25px_rgba(220,38,38,0.2)] bg-black/50 p-1.5 flex items-center justify-center group mb-4">
                    <Image
                        src="/images/kuma-logo.jpg"
                        alt="Kuma Dojo Logo"
                        width={70}
                        height={70}
                        className="object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                        priority
                    />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/50 border border-red-800/50 text-red-400 text-[11px] font-semibold tracking-widest uppercase mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Kuma Dojo · Membresía Digital
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-black text-kuma-gold tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2">
                    Únete al Dojo
                </h1>

                <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                    Crea tu cuenta de practicante en un solo paso con Google y accede a entrenamientos, kumacards y seguimiento de tu avance.
                </p>
            </div>

            {/* Alerta de Error si OAuth falla */}
            {errorMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3.5 bg-red-950/60 border border-red-800/60 rounded-xl text-red-200 text-xs flex items-center gap-2.5 shadow-inner"
                >
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{errorMessage}</span>
                </motion.div>
            )}

            {/* Botón Principal Elegante: Unirse con Google */}
            <div className="space-y-4">
                <motion.button
                    type="button"
                    disabled={isJoining}
                    onClick={handleGoogleJoin}
                    whileHover={!isJoining ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isJoining ? { scale: 0.98 } : {}}
                    className="w-full relative group overflow-hidden rounded-2xl border border-zinc-700/80 hover:border-red-500/60 bg-gradient-to-b from-zinc-900 via-zinc-900 to-black p-4 text-white transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(220,38,38,0.25)] flex items-center justify-between gap-3.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {/* Brillo dinámico en hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Contenedor del ícono oficial de Google */}
                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-md flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-shadow">
                        {isJoining ? (
                            <Loader2 className="w-5 h-5 animate-spin text-zinc-700" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                        )}
                    </div>

                    {/* Texto del Botón */}
                    <div className="flex-1 text-left">
                        <p className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-white transition-colors">
                            {isJoining ? "Creando cuenta..." : "Unirse con Google"}
                        </p>
                        <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            Registro instantáneo y seguro
                        </p>
                    </div>

                    {/* Indicador de flecha */}
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 group-hover:text-red-400 group-hover:border-red-500/40 transition-colors flex-shrink-0">
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </motion.button>
            </div>

            {/* Beneficios de unirse al Dojo */}
            <div className="mt-8 pt-6 border-t border-zinc-900 grid grid-cols-3 gap-2 text-center text-[11px] text-zinc-400">
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/40">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="leading-tight">Kumacards</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/40">
                    <Zap className="w-4 h-4 text-red-400" />
                    <span className="leading-tight">Sin Formulario</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/40">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="leading-tight">100% Seguro</span>
                </div>
            </div>

            {/* Cita de Karate & Enlaces */}
            <div className="mt-6 text-center space-y-4">
                <blockquote className="text-xs text-zinc-400 italic">
                    “El verdadero karate es interior.”
                    <span className="block text-[11px] text-zinc-500 not-italic font-medium mt-0.5">
                        — Maestro Funakoshi
                    </span>
                </blockquote>

                <div className="pt-2 text-xs text-zinc-500 space-y-2">
                    <p>
                        ¿Ya eres parte del Dojo?{" "}
                        <Link href="/login" className="text-red-500 hover:text-red-400 font-medium transition-colors underline-offset-4 hover:underline">
                            Inicia sesión aquí
                        </Link>
                    </p>
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors tracking-wide text-xs"
                        >
                            ← Volver a la página principal
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Fondos radiales atmosféricos estilo Kuma */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/90 via-black to-black z-0 pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <Suspense
                fallback={
                    <div className="w-full max-w-md p-8 bg-zinc-950/50 rounded-3xl border border-zinc-800 animate-pulse text-center text-zinc-500 text-sm">
                        Cargando portal de registro...
                    </div>
                }
            >
                <RegisterContent />
            </Suspense>
        </div>
    );
}
