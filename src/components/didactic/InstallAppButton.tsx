"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    DeviceMobile,
    DownloadSimple,
    Export,
    CheckCircle,
    X,
    Desktop,
    Sparkle,
    ShareNetwork,
    PlusSquare,
    DotsThreeVertical,
} from "@phosphor-icons/react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallAppButtonProps {
    variant?: "pill" | "card" | "compact";
    className?: string;
}

export function InstallAppButton({ variant = "pill", className = "" }: InstallAppButtonProps) {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"ios" | "android" | "desktop">("android");

    useEffect(() => {
        // Detect if app is already running in standalone mode (PWA installed)
        if (typeof window !== "undefined") {
            const standaloneQuery = window.matchMedia("(display-mode: standalone)").matches;
            const navStandalone = (window.navigator as any).standalone === true;
            setIsStandalone(standaloneQuery || navStandalone);

            const ua = window.navigator.userAgent.toLowerCase();
            const iosCheck = /iphone|ipad|ipod/.test(ua);
            const androidCheck = /android/.test(ua);

            setIsIOS(iosCheck);
            setIsAndroid(androidCheck);
            if (iosCheck) {
                setActiveTab("ios");
            } else if (androidCheck) {
                setActiveTab("android");
            } else {
                setActiveTab("desktop");
            }

            // Capture beforeinstallprompt for Chrome / Edge / Android
            const handleBeforeInstallPrompt = (e: Event) => {
                e.preventDefault();
                setDeferredPrompt(e as BeforeInstallPromptEvent);
            };

            window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

            // Listen for appinstalled
            const handleAppInstalled = () => {
                setIsStandalone(true);
                setDeferredPrompt(null);
            };
            window.addEventListener("appinstalled", handleAppInstalled);

            return () => {
                window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
                window.removeEventListener("appinstalled", handleAppInstalled);
            };
        }
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Native install prompt (Android / Chrome / Edge / Desktop)
            try {
                await deferredPrompt.prompt();
                const choice = await deferredPrompt.userChoice;
                if (choice.outcome === "accepted") {
                    setDeferredPrompt(null);
                    setIsStandalone(true);
                }
            } catch (err) {
                console.error("Error launching install prompt:", err);
                setIsModalOpen(true);
            }
        } else {
            // iOS or browser without native trigger: open guided modal
            setIsModalOpen(true);
        }
    };

    if (isStandalone) {
        return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold ${className}`}>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" weight="fill" />
                <span>App Instalada en tu Dispositivo</span>
            </div>
        );
    }

    return (
        <>
            {variant === "card" ? (
                <button
                    type="button"
                    onClick={handleInstallClick}
                    className={`w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-kuma-gold/20 to-amber-500/10 border-2 border-kuma-gold/50 hover:border-kuma-gold text-white flex items-center justify-between gap-3 shadow-[0_4px_20px_rgba(234,179,8,0.15)] hover:shadow-[0_6px_25px_rgba(234,179,8,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group text-left ${className}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-kuma-gold flex items-center justify-center text-zinc-950 shadow-md group-hover:rotate-6 transition-transform">
                            <DeviceMobile className="w-5 h-5" weight="fill" />
                        </div>
                        <div>
                            <span className="block text-xs font-serif font-black text-amber-300 uppercase tracking-wider">
                                Instalar en tu Pantalla
                            </span>
                            <span className="text-[11px] text-zinc-300">
                                Acceso directo en Celular o PC 📲
                            </span>
                        </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-kuma-gold/20 border border-kuma-gold/40 text-[10px] font-bold text-kuma-gold uppercase tracking-wider group-hover:bg-kuma-gold group-hover:text-zinc-950 transition-colors">
                        Instalar
                    </div>
                </button>
            ) : variant === "compact" ? (
                <button
                    type="button"
                    onClick={handleInstallClick}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-kuma-gold/15 hover:bg-kuma-gold/25 border border-kuma-gold/40 text-kuma-gold hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm ${className}`}
                    title="Instalar icono en el escritorio de tu celular o PC"
                >
                    <DeviceMobile className="w-3.5 h-3.5" weight="bold" />
                    <span>Instalar App</span>
                </button>
            ) : (
                /* Default Pill */
                <button
                    type="button"
                    onClick={handleInstallClick}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 via-kuma-gold/20 to-amber-500/20 hover:from-amber-500 hover:to-kuma-gold border border-kuma-gold/50 text-amber-300 hover:text-zinc-950 shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${className}`}
                    title="Instalar icono en la pantalla de inicio de tu teléfono o PC"
                >
                    <DeviceMobile className="w-4 h-4" weight="fill" />
                    <span>📲 Instalar en Celular / PC</span>
                </button>
            )}

            {/* GUIDED INSTALLATION MODAL (FOR IOS, ANDROID & DESKTOP) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 350, damping: 28 }}
                            className="relative w-full max-w-lg bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-kuma-gold/50 rounded-3xl shadow-[0_0_60px_rgba(234,179,8,0.25)] overflow-hidden my-auto p-6 md:p-8"
                        >
                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-kuma-gold text-zinc-950 shadow-xl shadow-kuma-gold/25 mb-3 p-1 border-2 border-white/20">
                                    <Image
                                        src="/icon.jpg"
                                        alt="Kuma Sensei Icon"
                                        width={56}
                                        height={56}
                                        className="rounded-xl object-cover"
                                    />
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border border-kuma-gold/40 bg-kuma-gold/10 text-amber-300">
                                    <Sparkle className="w-3 h-3" weight="fill" />
                                    Acceso Rápido • Pantalla de Inicio
                                </span>
                                <h3 className="text-2xl font-serif font-black text-white mt-2">
                                    Instalar Kuma Dojo
                                </h3>
                                <p className="text-xs text-zinc-300 mt-1 max-w-sm mx-auto">
                                    Añade el icono de Kuma Sensei a tu pantalla para entrar directo al dojo sin abrir el navegador.
                                </p>
                            </div>

                            {/* Device Tab Switcher */}
                            <div className="flex rounded-xl bg-zinc-900 border border-white/10 p-1 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("ios")}
                                    className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        activeTab === "ios"
                                            ? "bg-amber-500 text-zinc-950 shadow-md"
                                            : "text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    iPhone / iPad 🍏
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("android")}
                                    className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        activeTab === "android"
                                            ? "bg-amber-500 text-zinc-950 shadow-md"
                                            : "text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    Android 🤖
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("desktop")}
                                    className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        activeTab === "desktop"
                                            ? "bg-amber-500 text-zinc-950 shadow-md"
                                            : "text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    PC / Mac 💻
                                </button>
                            </div>

                            {/* Tab Content */}
                            {activeTab === "ios" && (
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10">
                                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                            <ShareNetwork className="w-4 h-4" weight="bold" />
                                        </div>
                                        <div className="text-xs">
                                            <strong className="text-white block font-bold">Paso 1: Toca Compartir</strong>
                                            <span className="text-zinc-400">
                                                En Safari, presiona el botón <strong>Compartir</strong> (icono de caja con flecha arriba en la barra inferior).
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-kuma-gold flex items-center justify-center shrink-0">
                                            <PlusSquare className="w-4 h-4" weight="bold" />
                                        </div>
                                        <div className="text-xs">
                                            <strong className="text-white block font-bold">Paso 2: Agregar a pantalla de inicio</strong>
                                            <span className="text-zinc-400">
                                                Desliza hacia abajo en el menú y selecciona <strong>"Agregar a pantalla de inicio"</strong>.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-4 h-4" weight="bold" />
                                        </div>
                                        <div className="text-xs">
                                            <strong className="text-white block font-bold">Paso 3: Presiona "Agregar"</strong>
                                            <span className="text-zinc-400">
                                                Toca <strong>"Agregar"</strong> en la esquina superior derecha. ¡Listo! El icono de Kuma Sensei estará en tu pantalla.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "android" && (
                                <div className="space-y-4">
                                    {deferredPrompt && (
                                        <button
                                            type="button"
                                            onClick={handleInstallClick}
                                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-kuma-gold text-zinc-950 font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-kuma-gold/25 transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
                                        >
                                            <DownloadSimple className="w-4 h-4" weight="bold" />
                                            <span>Instalar Automáticamente con 1 Clic</span>
                                        </button>
                                    )}

                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10">
                                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                            <DotsThreeVertical className="w-4 h-4" weight="bold" />
                                        </div>
                                        <div className="text-xs">
                                            <strong className="text-white block font-bold">Paso 1: Abre el Menú ⋮</strong>
                                            <span className="text-zinc-400">
                                                En Chrome o tu navegador Android, toca los <strong>tres puntos ⋮</strong> arriba a la derecha.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10">
                                        <div className="w-8 h-8 rounded-xl bg-kuma-gold/20 text-kuma-gold flex items-center justify-center shrink-0">
                                            <DeviceMobile className="w-4 h-4" weight="bold" />
                                        </div>
                                        <div className="text-xs">
                                            <strong className="text-white block font-bold">Paso 2: Instalar aplicación</strong>
                                            <span className="text-zinc-400">
                                                Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "desktop" && (
                                <div className="space-y-4">
                                    {deferredPrompt && (
                                        <button
                                            type="button"
                                            onClick={handleInstallClick}
                                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-kuma-gold text-zinc-950 font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-kuma-gold/25 transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
                                        >
                                            <DownloadSimple className="w-4 h-4" weight="bold" />
                                            <span>Instalar en esta Computadora</span>
                                        </button>
                                    )}

                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-kuma-gold flex items-center justify-center shrink-0">
                                            <Desktop className="w-4 h-4" weight="bold" />
                                        </div>
                                        <div className="text-xs">
                                            <strong className="text-white block font-bold">Barra de Direcciones URL</strong>
                                            <span className="text-zinc-400">
                                                En Chrome o Edge, haz clic en el icono de <strong>Instalar aplicación 🖥️</strong> en el extremo derecho de la barra de direcciones URL.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Footer button */}
                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-bold text-zinc-300 uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                    Entendido, volver al Dojo 🥋
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
