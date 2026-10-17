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
    Award,
    Flame,
    Zap,
    ExternalLink
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa6";
import { toBlob, toPng } from "html-to-image";
import { getBeltColor } from "@/components/admin/AthleteEditModal";
import { cn } from "@/lib/utils";

interface ShareCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    athlete: any;
    mode?: "card" | "mvp";
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
    }, [isOpen, athlete]);

    if (!isOpen || !athlete) return null;

    const ovr = Math.round(athlete?.athleteProfile?.stats?.ovr ?? 50);
    const beltRank = athlete?.athleteProfile?.beltRank ?? "Blanco";
    const beltInfo = getBeltColor(beltRank);
    const stats = athlete?.athleteProfile?.stats || { vel: 50, pot: 50, tec: 50, res: 50, esp: 50, ovr: 50 };
    const dojo = athlete?.athleteProfile?.dojo;
    const dojoName = (typeof dojo === "object" && dojo?.name) ? dojo.name : "DOJO KUMA";
    const dojoLogo = (typeof dojo === "object" && dojo?.logo) ? dojo.logo : "/images/kuma-logo.jpg";
    const athletePhoto = athlete?.image;

    // Helper to generate the image Blob
    const generateImageBlob = async (): Promise<Blob | null> => {
        if (cachedBlob) return cachedBlob;
        if (!posterRef.current) return null;

        try {
            setIsGenerating(true);
            const blob = await toBlob(posterRef.current, {
                pixelRatio: 2.5,
                cacheBust: true,
                quality: 0.95,
                backgroundColor: "#09090b"
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

    // 1. General Web Share (WhatsApp Status, Instagram, TikTok, Facebook sheet)
    const handleNativeShare = async (platformName?: string) => {
        const blob = await generateImageBlob();
        const safeName = (athlete.name || "atleta").replace(/\s+/g, "_");
        const filename = `${mode === "mvp" ? "MVP" : "KumaCard"}_${safeName}.png`;
        const shareTitle = mode === "mvp" 
            ? `¡${athlete.name} es el MVP de la Semana en ${dojoName}! 🥋👑` 
            : `Ficha Oficial de ${athlete.name} - ${dojoName} 🥋`;
        const shareText = `¡Mira mi logro en Karate-Do con ${dojoName}! Entrenando con honor y disciplina. 🔥🥋`;

        if (blob) {
            const file = new File([blob], filename, { type: "image/png" });

            // Check if Web Share API with files is supported (mobile iOS / Android)
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
                        return; // User canceled share sheet
                    }
                }
            }
        }

        // Fallback for Desktop or unsupported browsers: Download the image and show instructions
        await handleDownloadImage();
        if (platformName) {
            setStatusMessage(`¡Imagen descargada! Ya puedes abrir ${platformName} y subirla a tu Estado o Historia.`);
        }
    };

    // 2. Direct Download of High-Res PNG
    const handleDownloadImage = async () => {
        const blob = await generateImageBlob();
        if (!blob) return;

        const safeName = (athlete.name || "atleta").replace(/\s+/g, "_");
        const filename = `${mode === "mvp" ? "MVP" : "KumaCard"}_${safeName}.png`;
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

    // 3. WhatsApp Direct (Share Sheet or Web)
    const handleWhatsAppShare = async () => {
        const blob = await generateImageBlob();
        const safeName = (athlete.name || "atleta").replace(/\s+/g, "_");
        const filename = `Kuma_${safeName}.png`;
        
        // On mobile: try native share which lets user pick "Mi Estado" directly
        if (blob && typeof navigator !== "undefined" && navigator.canShare) {
            const file = new File([blob], filename, { type: "image/png" });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: `Kuma Dojo - ${athlete.name}`,
                        text: `¡Mi logro en ${dojoName}! 🥋🔥`
                    });
                    return;
                } catch (err: any) {
                    if (err.name === "AbortError") return;
                }
            }
        }

        // Fallback: Download image and open WhatsApp Web with prefilled message
        await handleDownloadImage();
        const text = encodeURIComponent(`¡Mira la tarjeta de ${athlete.name} en ${dojoName}! 🥋🔥\nVisítanos en: ${window.location.origin}/kumacards`);
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
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-xl bg-zinc-950 border border-amber-500/25 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(212,175,55,0.2)] overflow-hidden my-auto"
                >
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

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
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            {mode === "mvp" ? "Logro MVP de la Semana" : "Compartir Ficha Kuma"}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                            Publicar en <span className="text-kuma-gold">Tus Redes</span>
                        </h3>
                        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                            Comparte tu tarjeta o logro en Estados de WhatsApp, Instagram, TikTok o Facebook.
                        </p>
                    </div>

                    {/* Status Alert Message if any */}
                    {statusMessage && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs text-center font-bold"
                        >
                            {statusMessage}
                        </motion.div>
                    )}

                    {/* ACTION BUTTONS GRID */}
                    <div className="space-y-3">
                        {/* 1. PRIMARY NATIVE SHARE BUTTON (Opens Native iOS / Android Sheet with all apps) */}
                        <button
                            onClick={() => handleNativeShare()}
                            disabled={isGenerating}
                            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black uppercase text-xs sm:text-sm tracking-wider flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(212,175,55,0.35)] active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Generando Imagen HD...</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-5 h-5" />
                                    <span>Abrir en WhatsApp, Instagram o TikTok</span>
                                </>
                            )}
                        </button>

                        {/* 2. SPECIFIC SOCIAL BUTTONS (For direct access or Desktop fallbacks) */}
                        <div className="grid grid-cols-2 gap-2.5 pt-2">
                            {/* WhatsApp button */}
                            <button
                                onClick={handleWhatsAppShare}
                                disabled={isGenerating}
                                className="py-3 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                            >
                                <FaWhatsapp className="w-4 h-4 shrink-0 text-[#25D366]" />
                                <span className="truncate">Estados de WhatsApp</span>
                            </button>

                            {/* Instagram & TikTok button */}
                            <button
                                onClick={() => handleNativeShare("Instagram / TikTok")}
                                disabled={isGenerating}
                                className="py-3 px-3 rounded-xl bg-gradient-to-r from-purple-500/15 to-pink-500/15 hover:from-purple-500/25 hover:to-pink-500/25 border border-pink-500/40 text-pink-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
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
                                className="py-3 px-3 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 text-[#1877F2] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                            >
                                <FaFacebook className="w-4 h-4 shrink-0 text-[#1877F2]" />
                                <span className="truncate">Facebook</span>
                            </button>

                            {/* Download High-Res Image */}
                            <button
                                onClick={handleDownloadImage}
                                disabled={isGenerating}
                                className="py-3 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-zinc-200 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                            >
                                <Download className="w-4 h-4 shrink-0 text-kuma-gold" />
                                <span className="truncate">Guardar Imagen</span>
                            </button>
                        </div>

                        {/* Copy Link Row */}
                        <div className="pt-2 flex items-center gap-2">
                            <button
                                onClick={handleCopyLink}
                                className="flex-1 py-2 px-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-white/15 text-zinc-400 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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

            {/* OFF-SCREEN POSTER TEMPLATE (Optimized for 9:16 Stories: 1080x1920 px) */}
            <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none" aria-hidden="true">
                <div
                    ref={posterRef}
                    style={{
                        width: "540px",
                        height: "960px",
                    }}
                    className="relative flex flex-col justify-between p-8 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white font-sans overflow-hidden select-none"
                >
                    {/* Background martial texture & radial golden glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.22),transparent_70%)]" />
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

                    {/* TOP HEADER: DOJO BRANDING */}
                    <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-2 border-kuma-gold shadow-[0_0_15px_rgba(212,175,55,0.4)] overflow-hidden bg-zinc-950 flex items-center justify-center">
                                <img
                                    src={dojoLogo}
                                    alt={dojoName}
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />
                            </div>
                            <div>
                                <h4 className="font-serif font-black text-base text-white uppercase tracking-wider">
                                    {dojoName}
                                </h4>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                    Karate-Do • Shotokan
                                </p>
                            </div>
                        </div>

                        {/* Top Badge */}
                        <div className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            {mode === "mvp" ? "👑 MVP DE LA SEMANA" : "🥋 ATLETA OFICIAL"}
                        </div>
                    </div>

                    {/* CENTER: THE GLORIOUS KUMA CARD */}
                    <div className="relative z-10 my-auto flex flex-col items-center">
                        <div className="relative w-[340px] aspect-[1/1.45] rounded-3xl p-6 bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-zinc-950 border-2 border-amber-400/60 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.25)] flex flex-col justify-between overflow-hidden">
                            
                            {/* Card Ambient Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

                            {/* Top row inside card: OVR Rating & Specialization */}
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col items-center bg-amber-500/15 border border-amber-400/30 rounded-2xl px-3 py-1.5">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">OVR</span>
                                    <span className="text-2xl font-serif font-black text-kuma-gold italic leading-tight">{ovr}</span>
                                </div>

                                <div className="text-right">
                                    <span className="text-[10px] text-zinc-400 font-extrabold uppercase block tracking-wider">Especialidad</span>
                                    <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                                        {athlete?.athleteProfile?.specialization || "Ambos"}
                                    </span>
                                </div>
                            </div>

                            {/* Athlete Portrait */}
                            <div className="relative mx-auto my-3">
                                <div className="w-36 h-36 rounded-full border-4 border-kuma-gold/90 shadow-[0_0_30px_rgba(212,175,55,0.35)] overflow-hidden bg-zinc-950 flex items-center justify-center">
                                    {athletePhoto ? (
                                        <img
                                            src={athletePhoto}
                                            alt={athlete.name}
                                            className="w-full h-full object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    ) : (
                                        <span className="text-5xl font-serif font-black text-zinc-600">
                                            {athlete.name ? athlete.name.charAt(0).toUpperCase() : "K"}
                                        </span>
                                    )}
                                </div>

                                {/* Belt color ribbon under avatar */}
                                <div 
                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border border-black/50"
                                    style={{
                                        backgroundColor: beltInfo.hex || "#ffffff",
                                        color: beltRank.toLowerCase().includes("blanco") ? "#000" : "#fff"
                                    }}
                                >
                                    {beltRank}
                                </div>
                            </div>

                            {/* Athlete Name inside card */}
                            <div className="text-center mt-2">
                                <h2 className="text-xl font-serif font-black text-white uppercase tracking-tight truncate">
                                    {athlete.name}
                                </h2>
                                {athlete?.athleteProfile?.cc && (
                                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                                        &quot;{athlete.athleteProfile.cc}&quot;
                                    </p>
                                )}
                            </div>

                            {/* Stats 5 attributes */}
                            <div className="grid grid-cols-5 gap-1.5 mt-3 pt-3 border-t border-white/10 text-center">
                                <div className="bg-white/5 rounded-lg py-1">
                                    <span className="block text-[8px] font-black text-zinc-400 uppercase">VEL</span>
                                    <span className="text-xs font-black text-white">{Math.round(stats.vel)}</span>
                                </div>
                                <div className="bg-white/5 rounded-lg py-1">
                                    <span className="block text-[8px] font-black text-zinc-400 uppercase">TEC</span>
                                    <span className="text-xs font-black text-white">{Math.round(stats.tec)}</span>
                                </div>
                                <div className="bg-white/5 rounded-lg py-1">
                                    <span className="block text-[8px] font-black text-zinc-400 uppercase">POT</span>
                                    <span className="text-xs font-black text-white">{Math.round(stats.pot)}</span>
                                </div>
                                <div className="bg-white/5 rounded-lg py-1">
                                    <span className="block text-[8px] font-black text-zinc-400 uppercase">RES</span>
                                    <span className="text-xs font-black text-white">{Math.round(stats.res)}</span>
                                </div>
                                <div className="bg-white/5 rounded-lg py-1">
                                    <span className="block text-[8px] font-black text-zinc-400 uppercase">ESP</span>
                                    <span className="text-xs font-black text-white">{Math.round(stats.esp)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM FOOTER: CALL TO ACTION & BRANDING */}
                    <div className="relative z-10 text-center pt-4 border-t border-white/10">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                            <span className="h-px w-8 bg-amber-400/40" />
                            <span className="text-xs font-serif font-black tracking-widest text-amber-400 uppercase">
                                Forjando Campeones
                            </span>
                            <span className="h-px w-8 bg-amber-400/40" />
                        </div>
                        <p className="text-[11px] font-bold text-zinc-400 tracking-wider">
                            kumadojo.cr • Karate-Do Tradicional & Deportivo
                        </p>
                    </div>
                </div>
            </div>
        </AnimatePresence>
    );
}
