"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    Share2, 
    Download, 
    Copy, 
    Check, 
    Sparkles, 
    Loader2, 
    Crown,
    Trophy,
    Award,
    Flame,
    Shield
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa6";
import { toBlob } from "html-to-image";
import { getBeltColor } from "@/components/admin/AthleteEditModal";
import { cn } from "@/lib/utils";

export type ShareMode = "daily_mvp" | "weekly_mvp" | "card" | "mvp";

interface ShareCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    athlete: any;
    mode?: ShareMode;
    customTitle?: string;
}

export function ShareCardModal({
    isOpen,
    onClose,
    athlete,
    mode = "card",
    customTitle
}: ShareCardModalProps) {
    const posterRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [cachedBlob, setCachedBlob] = useState<Blob | null>(null);

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setCachedBlob(null);
            setStatusMessage(null);
            setCopied(false);
        }
    }, [isOpen, athlete, mode]);

    if (!isOpen || !athlete) return null;

    // Determine normalized mode
    const isDaily = mode === "daily_mvp";
    const isWeekly = mode === "weekly_mvp" || mode === "mvp";
    const isMvp = isDaily || isWeekly;

    // Format belt rank to strictly say "Cinturón [Color]"
    const rawBelt = athlete?.athleteProfile?.beltRank ?? "Blanco";
    const cleanBelt = rawBelt.replace(/^cintur[oó]n\s*/i, "").trim();
    const formattedBelt = `Cinturón ${cleanBelt.charAt(0).toUpperCase() + cleanBelt.slice(1)}`;
    const beltInfo = getBeltColor(rawBelt);

    // Dojo info
    const dojo = athlete?.athleteProfile?.dojo;
    const dojoName = (typeof dojo === "object" && dojo?.name) ? dojo.name : "DOJO KUMA";
    const dojoLogo = (typeof dojo === "object" && dojo?.logo) ? dojo.logo : "/images/kuma-logo.jpg";
    const athletePhoto = athlete?.image;
    const specialization = athlete?.athleteProfile?.specialization || "Kata & Kumite";
    const secretAbility = athlete?.athleteProfile?.habilidadSecreta;
    const alias = athlete?.athleteProfile?.cc;

    // Header badge labels
    const titleLabel = customTitle || (
        isDaily 
            ? "MVP DEL ENTRENAMIENTO DEL DÍA" 
            : isWeekly 
            ? "MVP DE LA SEMANA" 
            : "ATLETA DE HONOR"
    );

    const subtitleLabel = isDaily
        ? "Reconocimiento a la Excelencia & Entrega en Clase"
        : isWeekly
        ? "Constancia, Fuerza y Espíritu Indomable Kuma"
        : "Karate-Do Shotokan Tradicional";

    // Helper to generate the image Blob
    const generateImageBlob = async (): Promise<Blob | null> => {
        if (cachedBlob) return cachedBlob;
        if (!posterRef.current) return null;

        try {
            setIsGenerating(true);
            const blob = await toBlob(posterRef.current, {
                pixelRatio: 2.5,
                cacheBust: true,
                quality: 0.96,
                backgroundColor: "#050507"
            });
            if (blob) {
                setCachedBlob(blob);
            }
            return blob;
        } catch (err) {
            console.error("Error generating share image:", err);
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    // 1. Native Web Share
    const handleNativeShare = async (platformName?: string) => {
        const blob = await generateImageBlob();
        const safeName = (athlete.name || "atleta").replace(/\s+/g, "_");
        const filename = `${isDaily ? "MVP_Dia" : isWeekly ? "MVP_Semana" : "KumaCard"}_${safeName}.png`;
        const shareTitle = isDaily 
            ? `¡${athlete.name} es el MVP del Entrenamiento del Día en ${dojoName}! 🥋👑`
            : isWeekly
            ? `¡${athlete.name} es el MVP de la Semana en ${dojoName}! 🥋🏆`
            : `Ficha Oficial de ${athlete.name} (${formattedBelt}) - ${dojoName} 🥋`;
        const shareText = `¡Reconocimiento en Karate-Do con ${dojoName}! ${formattedBelt} 🔥🥋`;

        if (blob) {
            const file = new File([blob], filename, { type: "image/png" });

            if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: shareTitle,
                        text: shareText,
                    });
                    setStatusMessage("¡Compartido con éxito!");
                    return;
                } catch (e: any) {
                    if (e.name !== "AbortError") {
                        console.warn("Share failed, falling back to download:", e);
                    } else {
                        return;
                    }
                }
            }
        }

        await handleDownloadImage();
        if (platformName) {
            setStatusMessage(`¡Imagen guardada! Ya puedes abrir ${platformName} y subirla a tu Estado o Historia.`);
        }
    };

    // 2. Direct Download of High-Res PNG
    const handleDownloadImage = async () => {
        const blob = await generateImageBlob();
        if (!blob) return;

        const safeName = (athlete.name || "atleta").replace(/\s+/g, "_");
        const filename = `${isDaily ? "MVP_Dia" : isWeekly ? "MVP_Semana" : "KumaCard"}_${safeName}.png`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setStatusMessage("¡Imagen guardada en alta resolución!");
    };

    // 3. WhatsApp Direct
    const handleWhatsAppShare = async () => {
        const blob = await generateImageBlob();
        const safeName = (athlete.name || "atleta").replace(/\s+/g, "_");
        const filename = `Kuma_${safeName}.png`;
        
        if (blob && typeof navigator !== "undefined" && navigator.canShare) {
            const file = new File([blob], filename, { type: "image/png" });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: `${titleLabel} - ${athlete.name}`,
                        text: `¡${titleLabel}! ${athlete.name} (${formattedBelt}) en ${dojoName} 🥋🔥`
                    });
                    return;
                } catch (err: any) {
                    if (err.name === "AbortError") return;
                }
            }
        }

        await handleDownloadImage();
        const text = encodeURIComponent(`¡${titleLabel}!\n${athlete.name} · ${formattedBelt} · ${dojoName} 🥋🔥\nVisítanos en: ${window.location.origin}/kumacards`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    };

    // 4. Facebook Direct Share
    const handleFacebookShare = async () => {
        await handleDownloadImage();
        const shareUrl = encodeURIComponent(`${window.location.origin}/kumacards`);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank", "width=600,height=500");
    };

    // 5. Copy Link to Clipboard
    const handleCopyLink = () => {
        const url = `${window.location.origin}/kumacards`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <AnimatePresence>
            <div 
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl overflow-y-auto"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-xl bg-zinc-950 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_0_80px_rgba(212,175,55,0.25)] overflow-hidden my-auto"
                >
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-0 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-yellow-600/15 rounded-full blur-3xl pointer-events-none" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer z-10"
                        title="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Modal Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                            {isDaily ? <Crown className="w-3.5 h-3.5 text-yellow-300" /> : isWeekly ? <Trophy className="w-3.5 h-3.5 text-amber-300" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                            {titleLabel}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                            Publicar en <span className="text-kuma-gold">Tus Redes</span>
                        </h3>
                        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                            Póster épico 9:16 con el espíritu Kuma etéreo para Estados de WhatsApp, Instagram Stories, TikTok o Facebook.
                        </p>
                    </div>

                    {/* Status Alert Message if any */}
                    {statusMessage && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs text-center font-bold"
                        >
                            {statusMessage}
                        </motion.div>
                    )}

                    {/* ACTION BUTTONS GRID */}
                    <div className="space-y-3">
                        {/* 1. PRIMARY NATIVE SHARE BUTTON */}
                        <button
                            onClick={() => handleNativeShare()}
                            disabled={isGenerating}
                            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black uppercase text-xs sm:text-sm tracking-wider flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(212,175,55,0.4)] active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Generando Imagen Espectacular...</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-5 h-5" />
                                    <span>Compartir en WhatsApp, Instagram o TikTok</span>
                                </>
                            )}
                        </button>

                        {/* 2. SPECIFIC SOCIAL BUTTONS */}
                        <div className="grid grid-cols-2 gap-2.5 pt-2">
                            {/* WhatsApp button */}
                            <button
                                onClick={handleWhatsAppShare}
                                disabled={isGenerating}
                                className="py-3 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-sm"
                            >
                                <FaWhatsapp className="w-4 h-4 shrink-0 text-[#25D366]" />
                                <span className="truncate">Estados de WhatsApp</span>
                            </button>

                            {/* Instagram & TikTok button */}
                            <button
                                onClick={() => handleNativeShare("Instagram / TikTok")}
                                disabled={isGenerating}
                                className="py-3 px-3 rounded-xl bg-gradient-to-r from-purple-500/15 to-pink-500/15 hover:from-purple-500/25 hover:to-pink-500/25 border border-pink-500/40 text-pink-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-sm"
                            >
                                <div className="flex items-center gap-1">
                                    <FaInstagram className="w-3.5 h-3.5 text-pink-400" />
                                    <FaTiktok className="w-3 h-3 text-cyan-300" />
                                </div>
                                <span className="truncate">Instagram / TikTok</span>
                            </button>

                            {/* Facebook button */}
                            <button
                                onClick={handleFacebookShare}
                                disabled={isGenerating}
                                className="py-3 px-3 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 text-[#1877F2] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-sm"
                            >
                                <FaFacebook className="w-4 h-4 shrink-0 text-[#1877F2]" />
                                <span className="truncate">Facebook</span>
                            </button>

                            {/* Download High-Res Image */}
                            <button
                                onClick={handleDownloadImage}
                                disabled={isGenerating}
                                className="py-3 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-zinc-200 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-sm"
                            >
                                <Download className="w-4 h-4 shrink-0 text-kuma-gold" />
                                <span className="truncate">Guardar Imagen</span>
                            </button>
                        </div>

                        {/* Copy Link Row */}
                        <div className="pt-2 flex items-center gap-2">
                            <button
                                onClick={handleCopyLink}
                                className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-white/15 text-zinc-400 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-green-400" />
                                        <span className="text-green-400">¡Enlace Copiado!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copiar Enlace de KumaCards</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 text-center mt-5">
                        💡 <strong>Consejo:</strong> En celulares, al tocar el botón principal puedes elegir directamente <em>&quot;Mi estado&quot;</em> en WhatsApp o tus Historias de Instagram.
                    </p>
                </motion.div>
            </div>

            {/* OFF-SCREEN POSTER TEMPLATE (Optimized for 9:16 Stories: 540x960 px -> Scaled 2.5x to 1350x2400 px) */}
            <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none" aria-hidden="true">
                <div
                    ref={posterRef}
                    style={{
                        width: "540px",
                        height: "960px",
                    }}
                    className="relative flex flex-col justify-between p-8 bg-black text-white font-sans overflow-hidden select-none"
                >
                    {/* 1. BACKGROUND: SPECTACULAR ETHEREAL SPIRIT BEAR */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/kuma-spirit-ethereal-bear.jpg"
                            alt="Espíritu Kuma"
                            className="w-full h-full object-cover object-center scale-105"
                            crossOrigin="anonymous"
                        />
                        {/* Soft mystical vignettes to ensure crystal clear contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/75" />
                        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/90" />
                    </div>

                    {/* 2. TOP HEADER: DOJO BRANDING & LOGO */}
                    <div className="relative z-10 flex items-center justify-between border-b border-amber-400/20 pb-4 backdrop-blur-[2px]">
                        <div className="flex items-center gap-3">
                            <div className="w-13 h-13 rounded-full border-2 border-kuma-gold shadow-[0_0_20px_rgba(212,175,55,0.6)] overflow-hidden bg-zinc-950 flex items-center justify-center shrink-0">
                                <img
                                    src={dojoLogo}
                                    alt={dojoName}
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />
                            </div>
                            <div>
                                <h4 className="font-serif font-black text-base text-white uppercase tracking-wider drop-shadow-md">
                                    {dojoName}
                                </h4>
                                <p className="text-[10px] text-amber-300 font-black uppercase tracking-[0.25em] drop-shadow">
                                    Karate-Do • Shotokan
                                </p>
                            </div>
                        </div>

                        {/* Top Dojo Crest / Seal */}
                        <div className="px-3.5 py-1.5 rounded-full bg-black/60 border border-amber-400/40 text-amber-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_20px_rgba(212,175,55,0.3)] backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            <span>COSTA RICA</span>
                        </div>
                    </div>

                    {/* 3. CENTER: RADIANTE TARJETA DE RECONOCIMIENTO (SIN STATS) */}
                    <div className="relative z-10 my-auto flex flex-col items-center">
                        
                        {/* Radiant Aura Behind the Card */}
                        <div className="absolute -inset-4 bg-gradient-to-b from-amber-500/30 via-yellow-400/20 to-transparent rounded-[38px] blur-2xl pointer-events-none" />

                        {/* Main Floating Radiant Card */}
                        <div className="relative w-[370px] rounded-[32px] p-6 bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black/95 border-2 border-amber-400/70 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.35)] flex flex-col items-center text-center backdrop-blur-xl overflow-hidden">
                            
                            {/* Inner Radiant Light Beam */}
                            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-400/25 via-yellow-400/10 to-transparent pointer-events-none" />

                            {/* MVP RADIANT BADGE (BIG & GLOWING) */}
                            <div className="relative mb-4 mt-1">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-amber-500/30 border-2 border-amber-300 shadow-[0_0_25px_rgba(250,204,21,0.6)] backdrop-blur-md">
                                    {isDaily ? (
                                        <Crown className="w-5 h-5 text-yellow-300 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                                    ) : (
                                        <Trophy className="w-5 h-5 text-yellow-300 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                                    )}
                                    <span className="text-xs sm:text-sm font-serif font-black tracking-wider text-yellow-200 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                                        {titleLabel}
                                    </span>
                                </div>
                            </div>

                            {/* ATHLETE PORTRAIT WITH LUXURY GOLD HALO */}
                            <div className="relative my-2">
                                <div className="w-38 h-38 rounded-full border-4 border-amber-400 shadow-[0_0_35px_rgba(212,175,55,0.5)] overflow-hidden bg-zinc-950 flex items-center justify-center relative z-10">
                                    {athletePhoto ? (
                                        <img
                                            src={athletePhoto}
                                            alt={athlete.name}
                                            className="w-full h-full object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    ) : (
                                        <span className="text-5xl font-serif font-black text-amber-200">
                                            {athlete.name ? athlete.name.charAt(0).toUpperCase() : "K"}
                                        </span>
                                    )}
                                </div>

                                {/* Floating Belt Badge Under Avatar */}
                                <div 
                                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-[0_6px_20px_rgba(0,0,0,0.9)] border-2 border-white/90 z-20 whitespace-nowrap flex items-center gap-1.5"
                                    style={{
                                        backgroundColor: beltInfo.hex || "#ffffff",
                                        color: rawBelt.toLowerCase().includes("blanco") ? "#000000" : "#ffffff"
                                    }}
                                >
                                    <span>🥋</span>
                                    <span>{formattedBelt}</span>
                                </div>
                            </div>

                            {/* ATHLETE FULL NAME */}
                            <div className="mt-5 mb-2 w-full px-2">
                                <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] truncate">
                                    {athlete.name}
                                </h2>
                                {alias && (
                                    <p className="text-amber-400 text-xs font-black uppercase tracking-widest mt-0.5 drop-shadow">
                                        &quot;{alias}&quot;
                                    </p>
                                )}
                            </div>

                            {/* MARTIAL VALUES BANNER (NO NUMERICAL STATS) */}
                            <div className="w-full pt-3 mt-2 border-t border-amber-400/20 flex items-center justify-around text-center">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Especialidad</span>
                                    <span className="text-xs font-black text-amber-300 uppercase tracking-wide mt-0.5">
                                        {specialization}
                                    </span>
                                </div>
                                <div className="h-6 w-px bg-amber-400/20" />
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Disciplina</span>
                                    <span className="text-xs font-black text-white uppercase tracking-wide mt-0.5">
                                        {formattedBelt}
                                    </span>
                                </div>
                            </div>

                            {/* Optional Secret Ability or Honor Tag */}
                            {secretAbility && (
                                <div className="mt-3 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] font-bold text-amber-200 text-center w-full truncate">
                                    ⚡ {secretAbility}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 4. BOTTOM FOOTER: BRANDING & CALL TO ACTION */}
                    <div className="relative z-10 text-center pt-4 border-t border-amber-400/20 backdrop-blur-[2px]">
                        <div className="flex items-center justify-center gap-3 mb-1.5">
                            <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-400" />
                            <span className="text-xs font-serif font-black tracking-[0.25em] text-amber-300 uppercase drop-shadow">
                                Forjando Campeones
                            </span>
                            <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-400" />
                        </div>
                        <p className="text-[11px] font-bold text-zinc-300 tracking-wider">
                            kumadojo.cr • {subtitleLabel}
                        </p>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}
