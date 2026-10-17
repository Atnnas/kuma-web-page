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
    Flame
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
    const [safePhotoUrl, setSafePhotoUrl] = useState<string | null>(null);

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setCachedBlob(null);
            setStatusMessage(null);
            setCopied(false);
        }
    }, [isOpen, athlete, mode]);

    // Handle athlete photo caching / CORS safety
    const athletePhoto = athlete?.image;
    useEffect(() => {
        if (!athletePhoto) {
            setSafePhotoUrl(null);
            return;
        }

        if (athletePhoto.startsWith("/") || athletePhoto.startsWith("data:")) {
            setSafePhotoUrl(athletePhoto);
            return;
        }

        // Try converting remote image to data URL to avoid CORS canvas taint in html-to-image
        let active = true;
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth || 300;
                canvas.height = img.naturalHeight || 300;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const dataUrl = canvas.toDataURL("image/png");
                    if (active) setSafePhotoUrl(dataUrl);
                    return;
                }
            } catch {
                if (active) setSafePhotoUrl(athletePhoto);
            }
        };
        img.onerror = () => {
            if (active) setSafePhotoUrl(athletePhoto);
        };
        img.src = athletePhoto;

        return () => {
            active = false;
        };
    }, [athletePhoto]);

    if (!isOpen || !athlete) return null;

    // Determine normalized mode
    const isDaily = mode === "daily_mvp";
    const isWeekly = mode === "weekly_mvp" || mode === "mvp";

    // Format belt rank to strictly say "Cinturón [Color]"
    const rawBelt = athlete?.athleteProfile?.beltRank ?? "Blanco";
    const cleanBelt = rawBelt.replace(/^cintur[oó]n\s*/i, "").trim();
    const formattedBelt = `Cinturón ${cleanBelt.charAt(0).toUpperCase() + cleanBelt.slice(1)}`;
    const beltInfo = getBeltColor(rawBelt);

    // Dojo info
    const dojo = athlete?.athleteProfile?.dojo;
    const dojoName = (typeof dojo === "object" && dojo?.name) ? dojo.name : "DOJO KUMA";
    const dojoLogo = (typeof dojo === "object" && dojo?.logo) ? dojo.logo : "/images/kuma-logo.jpg";
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
        setStatusMessage("¡Póster HD guardado en tu galería!");
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
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto bg-gradient-to-b from-zinc-900/95 via-zinc-950 to-black border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_0_100px_rgba(212,175,55,0.35)] my-auto"
                >
                    {/* Background ambient lighting */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-600/15 rounded-full blur-[100px] pointer-events-none" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-zinc-900/90 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-all cursor-pointer z-30 shadow-lg"
                        title="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* MAIN CONTENT: 2-COLUMN ON DESKTOP, STACKED ON MOBILE */}
                    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                        
                        {/* ======================================================== */}
                        {/* LEFT: LIVE VISIBLE POSTER PREVIEW (EL OSO ETÉREO RADIANTE) */}
                        {/* ======================================================== */}
                        <div className="w-full lg:w-auto shrink-0 flex flex-col items-center">
                            
                            <div className="text-[10px] text-amber-300 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 drop-shadow">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                <span>Póster Oficial para Historias y Estados (9:16)</span>
                            </div>

                            {/* Outer Luxury Gold Frame */}
                            <div className="relative rounded-[30px] p-1.5 bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-700 shadow-[0_0_50px_rgba(212,175,55,0.55)]">
                                
                                {/* Inner Captured Canvas */}
                                <div
                                    ref={posterRef}
                                    style={{
                                        width: "320px",
                                        height: "568px", // Native 9:16 aspect ratio
                                    }}
                                    className="relative rounded-[24px] overflow-hidden flex flex-col justify-between p-4 sm:p-5 text-white font-sans select-none bg-black"
                                >
                                    {/* 1. BACKGROUND: SPECTACULAR ETHEREAL SPIRIT BEAR */}
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src="/images/kuma-spirit-ethereal-bear.jpg"
                                            alt="Espíritu Kuma"
                                            className="w-full h-full object-cover object-top"
                                        />
                                        {/* Subtle top vignette for crystal clear header text */}
                                        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />
                                        
                                        {/* Subtle bottom vignette for athlete name and belt readability */}
                                        <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
                                    </div>

                                    {/* 2. TOP HEADER: DOJO BRANDING & COSTA RICA SEAL */}
                                    <div className="relative z-10 flex flex-col gap-2.5">
                                        <div className="flex items-center justify-between border-b border-amber-400/30 pb-2 backdrop-blur-[1px]">
                                            <div className="flex items-center gap-2">
                                                <div className="w-9 h-9 rounded-full border-2 border-amber-400 shadow-[0_0_15px_rgba(250,204,21,0.8)] overflow-hidden bg-black flex items-center justify-center shrink-0">
                                                    <img
                                                        src={dojoLogo}
                                                        alt={dojoName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="font-serif font-black text-xs text-white uppercase tracking-wider drop-shadow-md leading-tight">
                                                        {dojoName}
                                                    </h4>
                                                    <p className="text-[8px] text-amber-300 font-black uppercase tracking-[0.2em] drop-shadow">
                                                        Karate-Do • Shotokan
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Top Seal Badge */}
                                            <div className="px-2.5 py-1 rounded-full bg-black/60 border border-amber-400/60 text-amber-300 font-black text-[8px] uppercase tracking-wider flex items-center gap-1 shadow-md backdrop-blur-md">
                                                <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
                                                <span>COSTA RICA</span>
                                            </div>
                                        </div>

                                        {/* 3. RADIANT MVP CHAMPIONSHIP BADGE */}
                                        <div className="relative mx-auto w-full">
                                            <div className="relative px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/40 via-yellow-400/50 to-amber-500/40 border-2 border-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.85)] backdrop-blur-md flex items-center justify-center gap-2">
                                                {isDaily ? (
                                                    <Crown className="w-4 h-4 text-yellow-300 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,1)] shrink-0" />
                                                ) : (
                                                    <Trophy className="w-4 h-4 text-yellow-300 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,1)] shrink-0" />
                                                )}
                                                <span className="text-[11px] font-serif font-black tracking-widest text-yellow-100 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate">
                                                    {titleLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. CENTER AREA: KEPT OPEN SO THE ROARING ETHEREAL BEAR IS 100% VISIBLE */}
                                    <div className="relative z-10 flex-1 pointer-events-none" />

                                    {/* 5. LOWER SECTION: ATHLETE HERO SPOTLIGHT (NO NUMERICAL STATS) */}
                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        
                                        {/* Golden Ambient Glow behind athlete */}
                                        <div className="absolute -inset-4 bg-gradient-to-t from-amber-500/35 via-yellow-400/20 to-transparent rounded-full blur-2xl pointer-events-none" />

                                        {/* ATHLETE PORTRAIT WITH RADIANT HALO */}
                                        <div className="relative mb-2">
                                            <div className="w-24 h-24 rounded-full border-4 border-amber-400 shadow-[0_0_35px_rgba(250,204,21,0.9)] overflow-hidden bg-zinc-950 flex items-center justify-center relative z-10">
                                                {safePhotoUrl ? (
                                                    <img
                                                        src={safePhotoUrl}
                                                        alt={athlete.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-4xl font-serif font-black text-amber-200">
                                                        {athlete.name ? athlete.name.charAt(0).toUpperCase() : "K"}
                                                    </span>
                                                )}
                                            </div>

                                            {/* EXPLICIT CINTURÓN [COLOR] BADGE */}
                                            <div 
                                                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(0,0,0,0.95)] border-2 border-white z-20 whitespace-nowrap flex items-center gap-1.5"
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
                                        <div className="mt-2.5 mb-1 w-full px-1">
                                            <h2 className="text-xl font-serif font-black text-white uppercase tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,1)] truncate">
                                                {athlete.name}
                                            </h2>
                                            {alias && (
                                                <p className="text-amber-300 text-[10px] font-black uppercase tracking-widest mt-0.5 drop-shadow">
                                                    &quot;{alias}&quot;
                                                </p>
                                            )}
                                        </div>

                                        {/* MARTIAL VALUES BANNER (COMPLETELY FREE OF NUMERICAL STATS) */}
                                        <div className="mt-1 px-3 py-1 rounded-xl bg-black/60 border border-amber-400/40 backdrop-blur-md flex items-center justify-center gap-2.5 text-[9px] font-black uppercase tracking-wider text-amber-200 max-w-full truncate shadow-md">
                                            <span>⚔️ {specialization}</span>
                                            <span className="w-1 h-1 rounded-full bg-amber-400" />
                                            <span>🥋 {formattedBelt}</span>
                                        </div>

                                        {/* Secret Ability / Honor Tag if available */}
                                        {secretAbility && (
                                            <div className="mt-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/30 text-[9px] font-bold text-amber-200 text-center max-w-full truncate">
                                                ⚡ {secretAbility}
                                            </div>
                                        )}
                                    </div>

                                    {/* 6. BOTTOM FOOTER: CALL TO ACTION & BRANDING */}
                                    <div className="relative z-10 text-center pt-2.5 mt-2 border-t border-amber-400/30 backdrop-blur-[1px]">
                                        <div className="flex items-center justify-center gap-2 mb-0.5">
                                            <span className="h-px w-6 bg-gradient-to-r from-transparent to-amber-400" />
                                            <span className="text-[9px] font-serif font-black tracking-[0.25em] text-amber-300 uppercase drop-shadow">
                                                Forjando Campeones
                                            </span>
                                            <span className="h-px w-6 bg-gradient-to-l from-transparent to-amber-400" />
                                        </div>
                                        <p className="text-[8px] font-bold text-zinc-300 tracking-wider">
                                            kumadojo.cr • {subtitleLabel}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ======================================================== */}
                        {/* RIGHT: ACTION CONTROLS & SOCIAL SHARE BUTTONS           */}
                        {/* ======================================================== */}
                        <div className="flex-1 w-full flex flex-col justify-center text-center lg:text-left space-y-4">
                            
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                                    {isDaily ? <Crown className="w-3.5 h-3.5 text-yellow-300" /> : <Trophy className="w-3.5 h-3.5 text-amber-300" />}
                                    {titleLabel}
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
                                    Publicar <span className="text-kuma-gold">{athlete.name}</span>
                                </h3>
                                <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                                    Póster oficial formato 9:16 con el <strong>Espíritu del Oso Kuma</strong>, insignia radiante y <strong>{formattedBelt}</strong> listo para historias y estados.
                                </p>
                            </div>

                            {/* Status Alert Message if any */}
                            {statusMessage && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs text-center font-bold"
                                >
                                    {statusMessage}
                                </motion.div>
                            )}

                            {/* MAIN NATIVE SHARE BUTTON */}
                            <button
                                onClick={() => handleNativeShare()}
                                disabled={isGenerating}
                                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black uppercase text-xs sm:text-sm tracking-wider flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(212,175,55,0.45)] active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Generando Póster en HD...</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-5 h-5" />
                                        <span>Compartir en WhatsApp, Instagram o TikTok</span>
                                    </>
                                )}
                            </button>

                            {/* DIRECT CHANNELS GRID */}
                            <div className="grid grid-cols-2 gap-2.5 pt-1">
                                {/* WhatsApp */}
                                <button
                                    onClick={handleWhatsAppShare}
                                    disabled={isGenerating}
                                    className="py-3 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-sm"
                                >
                                    <FaWhatsapp className="w-4 h-4 shrink-0 text-[#25D366]" />
                                    <span className="truncate">Estados de WhatsApp</span>
                                </button>

                                {/* Instagram & TikTok */}
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

                                {/* Facebook */}
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
                            <div className="pt-1">
                                <button
                                    onClick={handleCopyLink}
                                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-white/15 text-zinc-400 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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

                            <p className="text-[11px] text-zinc-500 pt-1">
                                💡 <strong>Tip móvil:</strong> Al tocar el botón principal se abre el selector de tu celular donde puedes elegir <em>&quot;Mi estado&quot;</em> de WhatsApp o Historias de Instagram.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
