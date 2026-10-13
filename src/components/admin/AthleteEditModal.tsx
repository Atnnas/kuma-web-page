"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    Save, 
    Shield, 
    Ruler, 
    Weight, 
    Calendar, 
    Phone, 
    HeartPulse, 
    Trophy, 
    Zap, 
    Target, 
    Flame, 
    Activity, 
    AlertTriangle, 
    Award, 
    Loader2, 
    Sparkles, 
    Eye, 
    EyeOff, 
    User as UserIcon,
    Dumbbell,
    Sliders
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getDojos } from "@/lib/actions/dojos";
import { evaluateWkfCategory } from "@/lib/wkf-categories";
import { compressImage } from "@/lib/image-utils";

export const getBeltColor = (beltRank: string) => {
    const rank = (beltRank || "").toLowerCase().trim();
    if (rank.includes("blanco")) return { hex: "#ffffff", border: "border-zinc-400/40 text-black" };
    if (rank.includes("amarillo")) return { hex: "#eab308", border: "border-yellow-600/40 text-yellow-600" };
    if (rank.includes("naranja")) return { hex: "#f97316", border: "border-orange-600/40 text-orange-500" };
    if (rank.includes("verde")) return { hex: "#22c55e", border: "border-green-600/40 text-green-500" };
    if (rank.includes("azul")) return { hex: "#2563eb", border: "border-blue-600/40 text-blue-500" };
    if (rank.includes("morado con línea") || rank.includes("morado con linea")) return { hex: "#a855f7", stripe: true, border: "border-purple-600/40 text-purple-500" };
    if (rank.includes("morado")) return { hex: "#a855f7", border: "border-purple-600/40 text-purple-500" };
    if (rank.includes("marrón iii") || rank.includes("marron iii")) return { hex: "#78350f", stripes: 3, border: "border-amber-800/40 text-amber-600" };
    if (rank.includes("marrón ii") || rank.includes("marron ii")) return { hex: "#78350f", stripes: 2, border: "border-amber-800/40 text-amber-600" };
    if (rank.includes("marrón i") || rank.includes("marron i")) return { hex: "#78350f", stripes: 1, border: "border-amber-800/40 text-amber-600" };
    
    // Black Belts / Dans
    if (rank.includes("yondan")) return { hex: "#18181b", stripes: 4, stripeColorClass: "bg-amber-400", border: "border-zinc-300 text-white" };
    if (rank.includes("sandan")) return { hex: "#18181b", stripes: 3, stripeColorClass: "bg-amber-400", border: "border-zinc-300 text-white" };
    if (rank.includes("nidan")) return { hex: "#18181b", stripes: 2, stripeColorClass: "bg-amber-400", border: "border-zinc-300 text-white" };
    if (rank.includes("shodan")) return { hex: "#18181b", stripes: 1, stripeColorClass: "bg-amber-400", border: "border-zinc-300 text-white" };
    if (rank.includes("negro")) return { hex: "#18181b", border: "border-zinc-300 text-white" };

    return { hex: "#a1a1aa", border: "border-zinc-600/40 text-zinc-400" };
};

export function MartialArtsBeltIcon({ className, color = "currentColor" }: { className?: string; color?: string }) {
    return (
        <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={color} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
            style={{ filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.4))" }}
        >
            <path d="M4 8h16M4 12h16" />
            <path d="M10 12v6l-2-1" />
            <path d="M14 12v6l2-1" />
            <rect x="9.5" y="7" width="5" height="6" rx="1" fill={color} stroke={color} strokeWidth="1" />
        </svg>
    );
}

export function BeltSquare({ beltRank, className }: { beltRank: string; className?: string }) {
    const colorData = getBeltColor(beltRank);
    return (
        <div 
            className={cn("w-4 h-4 rounded-sm shrink-0 border border-white/20 relative overflow-hidden inline-block align-middle shadow-lg", className)}
            style={{ backgroundColor: colorData.hex }}
            title={beltRank}
        >
            {colorData.stripe && (
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] bg-white" />
            )}
            {colorData.stripes && (
                <div className="absolute inset-y-0 right-1 flex gap-[1px] py-[1px]">
                    {Array.from({ length: colorData.stripes }).map((_, i) => (
                        <div key={i} className={cn("w-[1.5px] h-full", colorData.stripeColorClass || "bg-white/80")} />
                    ))}
                </div>
            )}
        </div>
    );
}

const CARD_CLIP_PATH = "polygon(0% 15%, 8% 13%, 12% 9%, 20% 5%, 50% 0%, 80% 5%, 88% 9%, 92% 13%, 100% 15%, 100% 85%, 50% 100%, 0% 85%)";

// Mini Live FUT Card Preview Subcomponent
function LiveFUTPreview({
    userName,
    profile,
    ovr,
    dojos
}: {
    userName: string;
    profile: any;
    ovr: number;
    dojos: any[];
}) {
    const isEnrolled = profile.isEnrolled !== false;
    const selectedDojo = dojos.find(d => d._id === profile.dojo);
    const dojoLogo = selectedDojo?.logo || "/images/kuma-logo.jpg";
    const beltRank = profile.beltRank || "Blanco";
    const spec = profile.specialization || "Kata";

    const futTheme = useMemo(() => {
        if (ovr >= 75) {
            return {
                bgCard: "from-[#fceb92] via-[#e5c060] to-[#b38930]",
                borderClass: "bg-gradient-to-b from-[#fceb92] via-[#ffd54f] to-[#b38930]",
                textClass: "text-[#8d691e]",
                textColor: "#8d691e",
                lightColor: "rgba(255, 255, 255, 0.45)",
                glowClass: "shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
            };
        }
        if (ovr >= 65) {
            return {
                bgCard: "from-[#f1f5f9] via-[#cbd5e1] to-[#64748b]",
                borderClass: "bg-gradient-to-b from-white via-zinc-300 to-slate-500",
                textClass: "text-[#475569]",
                textColor: "#475569",
                lightColor: "rgba(255, 255, 255, 0.5)",
                glowClass: "shadow-[0_10px_30px_rgba(148,163,184,0.2)]"
            };
        }
        return {
            bgCard: "from-[#e07a3f] via-[#b45309] to-[#451a03]",
            borderClass: "bg-gradient-to-b from-[#f59e0b] via-[#b45309] to-[#78350f]",
            textClass: "text-[#78350f]",
            textColor: "#78350f",
            lightColor: "rgba(251, 191, 36, 0.35)",
            glowClass: "shadow-[0_10px_30px_rgba(180,83,9,0.2)]"
        };
    }, [ovr]);

    const nameParts = (userName || "").split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    return (
        <div className="flex flex-col items-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-kuma-gold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Preview en Vivo
            </div>

            <div 
                className={cn(
                    "relative w-[210px] aspect-[1/1.48] select-none transition-all duration-300",
                    futTheme.glowClass
                )}
                style={{ clipPath: CARD_CLIP_PATH }}
            >
                {/* Border Frame */}
                <div 
                    className={cn("absolute inset-0 bg-gradient-to-b", futTheme.borderClass)}
                    style={{ clipPath: CARD_CLIP_PATH }}
                >
                    <div 
                        className="absolute inset-[2.2px] bg-[#0c0a09]"
                        style={{ clipPath: CARD_CLIP_PATH }}
                    >
                        <div 
                            className={cn(
                                "absolute inset-[2.5px] bg-gradient-to-b overflow-hidden flex flex-col pt-5 px-3",
                                futTheme.bgCard
                            )}
                            style={{
                                clipPath: CARD_CLIP_PATH,
                                backgroundImage: `radial-gradient(circle at 50% 25%, ${futTheme.lightColor}, transparent)`
                            }}
                        >
                            {/* Inner path frame */}
                            <div 
                                className="absolute inset-[5px] border border-white/20 pointer-events-none z-10"
                                style={{ clipPath: CARD_CLIP_PATH }}
                            />

                            {/* Upper Details */}
                            <div className="flex justify-between items-start h-[48%] relative z-10">
                                <div className="flex flex-col items-center pl-2 pt-1 text-center shrink-0" style={{ color: futTheme.textColor }}>
                                    <span className={cn(
                                        "text-[34px] font-serif font-black leading-none mb-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]",
                                        ovr >= 75 ? "text-[#fde047]" : ovr >= 65 ? "text-white" : "text-[#fb923c]"
                                    )}>
                                        {ovr}
                                    </span>
                                    <span className="text-[9px] font-black tracking-wider leading-none mb-1 text-inherit">
                                        {spec === "Kata" ? "KA" : spec === "Kumite" ? "KU" : "KA/KU"}
                                    </span>
                                    <BeltSquare beltRank={beltRank} className="w-4 h-4 mb-1 border border-white/20" />
                                    <Trophy className="w-3 h-3 text-inherit" />
                                </div>

                                <div className="absolute right-2 top-0 bottom-0 left-[35%] flex items-center justify-center z-10">
                                    <div className={cn(
                                        "w-[74px] h-[74px] rounded-full overflow-hidden border-2 bg-zinc-950 flex items-center justify-center shadow-lg relative",
                                        ovr >= 75 ? "border-kuma-gold" : ovr >= 65 ? "border-zinc-300" : "border-amber-700"
                                    )}>
                                        {profile.image ? (
                                            <img src={profile.image} alt={userName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xl font-black text-zinc-600 bg-zinc-900 w-full h-full flex items-center justify-center">
                                                {userName?.[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Nameplate */}
                            <div className="mt-2 py-0.5 text-center relative z-20 select-none">
                                <h3 className="relative z-10 text-[11px] font-serif font-black text-white uppercase tracking-wider truncate drop-shadow-md">
                                    {firstName} <span style={{ color: futTheme.textColor }}>{lastName}</span>
                                </h3>
                            </div>

                            {/* FUT Stats Panel */}
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[8px] font-bold text-zinc-200 max-w-[150px] mx-auto select-none pt-2 pb-5 relative z-20">
                                <div className="flex flex-col gap-0.5 pr-2 border-r border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[9px]">{profile.stats.vel}</span>
                                        <span className="text-white/50 text-[6px]">VEL</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[9px]">{profile.stats.tec}</span>
                                        <span className="text-white/50 text-[6px]">TEC</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[9px]">{profile.stats.pot}</span>
                                        <span className="text-white/50 text-[6px]">POT</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5 pl-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[9px]">{profile.stats.res}</span>
                                        <span className="text-white/50 text-[6px]">RES</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[9px]">{profile.stats.esp}</span>
                                        <span className="text-white/50 text-[6px]">ESP</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dojo Logo */}
                            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20">
                                <div className="w-6 h-6 rounded-full border border-white/30 overflow-hidden shadow-lg bg-zinc-950 flex items-center justify-center">
                                    <img src={dojoLogo} alt="Dojo" className="w-full h-full object-cover" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {profile.cc && (
                <div className="mt-3 text-[10px] font-black text-kuma-gold bg-black/60 px-3 py-1 rounded-full border border-kuma-gold/20 max-w-[210px] truncate text-center">
                    {profile.cc}
                </div>
            )}
        </div>
    );
}

interface AthleteEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onSave: (userId: string, data: any) => Promise<void>;
}

export function AthleteEditModal({ isOpen, onClose, user, onSave }: AthleteEditModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [dojos, setDojos] = useState<any[]>([]);
    const [isLoadingDojos, setIsLoadingDojos] = useState(false);
    const [activeTab, setActiveTab] = useState<"perfil" | "wkf" | "stats" | "salud">("perfil");
    const [showMobilePreview, setShowMobilePreview] = useState(false);

    useEffect(() => {
        const loadDojos = async () => {
            setIsLoadingDojos(true);
            const res = await getDojos();
            if (res.success && res.data) {
                setDojos(res.data);
            }
            setIsLoadingDojos(false);
        };
        if (isOpen) {
            loadDojos();
        }
    }, [isOpen]);

    // Keyboard navigation (Escape to close)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isSaving) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isSaving, onClose]);

    const [profile, setProfile] = useState(() => {
        const p = user?.athleteProfile || {};
        return {
            image: user?.image || "",
            birthDate: p.birthDate || "",
            weight: p.weight || 70,
            height: p.height || 170,
            beltRank: p.beltRank || "Blanco",
            phone: p.phone || "",
            emergencyContact: {
                name: p.emergencyContact?.name || "",
                phone: p.emergencyContact?.phone || ""
            },
            medicalConditions: p.medicalConditions || "",
            specialization: p.specialization || "Ambos",
            cc: p.cc || "",
            habilidadSecreta: p.habilidadSecreta || "",
            dojo: p.dojo?._id || p.dojo || "6a10ba00936f06f14847fd05",
            gender: p.gender || "Masculino",
            wkfCategory: p.wkfCategory || "",
            categoryWeight: p.categoryWeight || p.weight || 70,
            weightReviewNeeded: !!p.weightReviewNeeded,
            stats: {
                vel: p.stats?.vel ?? 50,
                pot: p.stats?.pot ?? 50,
                tec: p.stats?.tec ?? 50,
                res: p.stats?.res ?? 50,
                esp: p.stats?.esp ?? 50,
                ovr: p.stats?.ovr ?? 50
            }
        };
    });

    const calculatedOvr = useMemo(() => {
        const s = profile.stats;
        return Math.round((s.vel + s.pot + s.tec + s.res + s.esp) / 5);
    }, [profile.stats]);

    const wkfEval = useMemo(() => evaluateWkfCategory({
        birthDate: profile.birthDate,
        currentWeight: profile.weight,
        gender: profile.gender,
        assignedCategory: profile.wkfCategory,
        assignedWeight: profile.categoryWeight,
        forceWeightReview: profile.weightReviewNeeded
    }), [profile.birthDate, profile.weight, profile.gender, profile.wkfCategory, profile.categoryWeight, profile.weightReviewNeeded]);

    const [isOptimizingImage, setIsOptimizingImage] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setImageError("Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).");
            return;
        }

        try {
            setIsOptimizingImage(true);
            setImageError(null);
            const compressed = await compressImage(file);
            setProfile((prev: any) => ({
                ...prev,
                image: compressed
            }));
        } catch (err) {
            console.error("Error optimizando imagen del atleta:", err);
            setImageError("No se pudo procesar la imagen seleccionada.");
        } finally {
            setIsOptimizingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        await onSave(user._id, {
            ...profile,
            stats: { ...profile.stats, ovr: calculatedOvr }
        });
        setIsSaving(false);
    };

    const handleStatChange = (stat: string, value: number) => {
        setProfile((prev: any) => ({
            ...prev,
            stats: {
                ...prev.stats,
                [stat]: value
            }
        }));
    };

    const tabs = [
        { id: "perfil", label: "Perfil & Cinta", icon: <UserIcon className="w-3.5 h-3.5" /> },
        { id: "wkf", label: "WKF & Biometría", icon: <Award className="w-3.5 h-3.5" />, alert: wkfEval.hasWeightReviewAlert },
        { id: "stats", label: "Karate Card", icon: <Sliders className="w-3.5 h-3.5" />, badge: `OVR ${calculatedOvr}` },
        { id: "salud", label: "Salud & Contacto", icon: <HeartPulse className="w-3.5 h-3.5" /> }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/85 backdrop-blur-md"
                    />
                    
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/60">
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl overflow-hidden bg-zinc-800 border border-white/10 relative shrink-0">
                                    {profile.image ? (
                                        <img src={profile.image} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-lg font-black text-zinc-500 uppercase bg-zinc-950">
                                            {user.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight truncate">{user.name}</h2>
                                        <BeltSquare beltRank={profile.beltRank} className="w-3.5 h-3.5" />
                                    </div>
                                    <p className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                                        Calibración y Perfil de Atleta Kuma
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Mobile preview toggle button */}
                                <button
                                    type="button"
                                    onClick={() => setShowMobilePreview(!showMobilePreview)}
                                    className="lg:hidden p-2 bg-zinc-900 hover:bg-zinc-800 text-kuma-gold rounded-xl border border-white/5 text-xs font-bold flex items-center gap-1.5"
                                    title="Toggle preview de tarjeta"
                                >
                                    {showMobilePreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    <span className="text-[10px] hidden sm:inline">Card 3D</span>
                                </button>

                                <button 
                                    onClick={onClose} 
                                    className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Modern Tab Bar */}
                        <div className="flex border-b border-white/5 bg-zinc-900/40 px-4 sm:px-6 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "py-3 px-2 sm:px-3 text-xs font-black uppercase tracking-wider transition-all relative flex items-center gap-2 shrink-0",
                                        activeTab === tab.id ? "text-kuma-gold" : "text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                    {tab.alert && (
                                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                    )}
                                    {tab.badge && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-kuma-gold/15 text-kuma-gold border border-kuma-gold/30 font-mono">
                                            {tab.badge}
                                        </span>
                                    )}
                                    {activeTab === tab.id && (
                                        <motion.div 
                                            layoutId="active-modal-tab" 
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-kuma-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" 
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Modal Body: Two-column layout with Live FUT Card Preview */}
                        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                            
                            {/* Form Panel (Tab content) */}
                            <form 
                                onSubmit={handleSubmit} 
                                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar"
                            >
                                <AnimatePresence mode="wait">
                                    {activeTab === "perfil" && (
                                        <motion.div 
                                            key="tab-perfil"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            {/* Foto de la Karate Card con optimización */}
                                            <div className="p-4 sm:p-5 bg-zinc-900/40 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shrink-0 group shadow-lg">
                                                    {isOptimizingImage ? (
                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-kuma-gold p-2 text-center">
                                                            <Loader2 className="w-5 h-5 animate-spin mb-1 text-kuma-gold" />
                                                            <span className="text-[8px] font-black uppercase tracking-wider">Optimizando</span>
                                                        </div>
                                                    ) : profile.image ? (
                                                        <img src={profile.image} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700 font-bold text-xs uppercase">
                                                            Sin Foto
                                                        </div>
                                                    )}
                                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-200">
                                                        <span className="text-[9px] text-white font-black uppercase tracking-wider">Cambiar</span>
                                                        <input 
                                                            type="file" 
                                                            accept="image/*" 
                                                            onChange={handleImageChange} 
                                                            className="hidden" 
                                                            disabled={isOptimizingImage}
                                                        />
                                                    </label>
                                                </div>

                                                <div className="flex-1 space-y-2.5 w-full text-center sm:text-left">
                                                    <div>
                                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                                            <h4 className="text-white text-xs font-black uppercase tracking-widest">Fotografía de la Karate Card</h4>
                                                            {isOptimizingImage && (
                                                                <span className="text-[9px] text-kuma-gold font-bold animate-pulse">Comprimiendo a web HD...</span>
                                                            )}
                                                        </div>
                                                        <p className="text-zinc-500 text-[10px] uppercase tracking-wider mt-0.5">
                                                            Sube una foto en primer plano. Se optimizará automáticamente sin pérdida de nitidez.
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <label className={cn(
                                                            "flex items-center justify-center gap-2 bg-zinc-850 hover:bg-white hover:text-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border border-white/5 cursor-pointer transition-all duration-300 active:scale-95",
                                                            isOptimizingImage && "opacity-50 pointer-events-none"
                                                        )}>
                                                            <span>{isOptimizingImage ? "Optimizando..." : "Subir Archivo"}</span>
                                                            <input 
                                                                type="file" 
                                                                accept="image/*" 
                                                                onChange={handleImageChange} 
                                                                className="hidden" 
                                                                disabled={isOptimizingImage}
                                                            />
                                                        </label>
                                                        <div className="flex-1 relative">
                                                            <input 
                                                                type="text" 
                                                                placeholder="O pega el URL de la imagen aquí..." 
                                                                value={profile.image}
                                                                onChange={(e) => setProfile({ ...profile, image: e.target.value })}
                                                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-white focus:border-red-500 outline-none placeholder:text-zinc-700"
                                                            />
                                                        </div>
                                                    </div>
                                                    {imageError && (
                                                        <p className="text-[10px] text-red-500 font-bold">{imageError}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Cinta & Rango */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cinturón / Rango</label>
                                                        <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-0.5 rounded border border-white/5">
                                                            <BeltSquare beltRank={profile.beltRank} className="w-3 h-3" />
                                                            <span className="text-[9px] uppercase font-bold text-zinc-400">{profile.beltRank}</span>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <select
                                                            value={profile.beltRank}
                                                            onChange={(e) => setProfile({ ...profile, beltRank: e.target.value })}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 pr-10 text-white focus:border-kuma-gold outline-none appearance-none cursor-pointer text-xs font-bold"
                                                        >
                                                            <option value="Blanco">⬜ Blanco</option>
                                                            <option value="Amarillo">🟨 Amarillo</option>
                                                            <option value="Naranja">🟧 Naranja</option>
                                                            <option value="Verde">🟩 Verde</option>
                                                            <option value="Azul">🟦 Azul</option>
                                                            <option value="Morado">🟪 Morado</option>
                                                            <option value="Morado con línea">🟪➖ Morado con línea</option>
                                                            <option value="Marrón III">🟫 ☰ Marrón III</option>
                                                            <option value="Marrón II">🟫 ＝ Marrón II</option>
                                                            <option value="Marrón I">🟫 － Marrón I</option>
                                                            <option value="Negro - Shodan">⬛ － Negro - Shodan (1er Dan)</option>
                                                            <option value="Negro - Nidan">⬛ ＝ Negro - Nidan (2do Dan)</option>
                                                            <option value="Negro - Sandan">⬛ ☰ Negro - Sandan (3er Dan)</option>
                                                            <option value="Negro - Yondan">⬛ ≣ Negro - Yondan (4to Dan)</option>
                                                        </select>
                                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs">▼</div>
                                                    </div>
                                                </div>

                                                {/* Dojo Selector */}
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Dojo de Procedencia</label>
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative flex-1">
                                                            <select
                                                                value={profile.dojo}
                                                                onChange={(e) => setProfile({ ...profile, dojo: e.target.value })}
                                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 pr-10 text-white focus:border-kuma-gold outline-none appearance-none cursor-pointer text-xs font-bold"
                                                            >
                                                                {dojos.map((d, idx) => (
                                                                    <option key={`${d._id}-${idx}`} value={d._id}>
                                                                        🥋 {d.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs">▼</div>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-xl border border-white/10 bg-zinc-950 overflow-hidden shrink-0 flex items-center justify-center shadow-lg">
                                                            <img 
                                                                src={dojos.find(d => d._id === profile.dojo)?.logo || "/images/kuma-logo.jpg"} 
                                                                alt="Logo Dojo" 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Especialidad & Apodos */}
                                            <div className="space-y-4 pt-2">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Especialidad Marcial</label>
                                                    <div className="flex gap-2">
                                                        {["Kata", "Kumite", "Ambos"].map(spec => (
                                                            <button
                                                                key={spec}
                                                                type="button"
                                                                onClick={() => setProfile({ ...profile, specialization: spec })}
                                                                className={cn(
                                                                    "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all active:scale-95",
                                                                    profile.specialization === spec 
                                                                    ? "bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]" 
                                                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                                                )}
                                                            >
                                                                {spec}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Conocido Como (CC / Apodo)</label>
                                                        <input
                                                            type="text"
                                                            value={profile.cc}
                                                            onChange={(e) => setProfile({ ...profile, cc: e.target.value })}
                                                            placeholder="Ej: 🐍 CC : MAMBA NEGRA"
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:border-kuma-gold outline-none placeholder:text-zinc-700 text-xs font-bold"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Habilidad Secreta</label>
                                                        <input
                                                            type="text"
                                                            value={profile.habilidadSecreta}
                                                            onChange={(e) => setProfile({ ...profile, habilidadSecreta: e.target.value })}
                                                            placeholder="Ej: Kisame Zuki"
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:border-red-500 outline-none placeholder:text-zinc-700 text-xs font-bold"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === "wkf" && (
                                        <motion.div 
                                            key="tab-wkf"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            {/* Biométricos Básicos */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Peso (kg)</label>
                                                    <div className="relative">
                                                        <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                                        <input
                                                            type="number"
                                                            value={profile.weight}
                                                            onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-white text-xs font-bold focus:border-amber-400 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Altura (cm)</label>
                                                    <div className="relative">
                                                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                                        <input
                                                            type="number"
                                                            value={profile.height}
                                                            onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-white text-xs font-bold focus:border-amber-400 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nacimiento</label>
                                                    <input
                                                        type="date"
                                                        value={profile.birthDate?.split('T')[0] || ""}
                                                        onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3 text-white text-xs focus:border-amber-400 outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rama WKF</label>
                                                    <select
                                                        value={profile.gender || "Masculino"}
                                                        onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3 text-white text-xs font-bold focus:border-amber-400 outline-none cursor-pointer"
                                                    >
                                                        <option value="Masculino">🥋 Masculino</option>
                                                        <option value="Femenino">🥋 Femenino</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* WKF Official Card Alert */}
                                            {wkfEval.hasWeightReviewAlert && (
                                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                                                            <AlertTriangle className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                                                                ⚠️ Alerta de Pesaje Oficial WKF
                                                            </div>
                                                            <div className="text-[11px] text-zinc-300 mt-0.5">
                                                                {wkfEval.alertReason || "El peso registrado difiere de la categoría asignada."}
                                                            </div>
                                                            <div className="text-[10px] text-zinc-400 mt-1">
                                                                Sugerencia para {profile.weight} kg: <span className="text-amber-400 font-bold">{wkfEval.suggestedCategory}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setProfile({
                                                                    ...profile,
                                                                    wkfCategory: wkfEval.suggestedCategory,
                                                                    categoryWeight: profile.weight,
                                                                    weightReviewNeeded: false
                                                                });
                                                            }}
                                                            className="flex-1 md:flex-initial px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                                                        >
                                                            Adoptar {wkfEval.suggestedCategory}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setProfile({
                                                                    ...profile,
                                                                    categoryWeight: profile.weight,
                                                                    weightReviewNeeded: false
                                                                });
                                                            }}
                                                            className="flex-1 md:flex-initial px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-[10px] font-bold tracking-wider transition-all active:scale-95 cursor-pointer"
                                                        >
                                                            Mantener
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Registered Category Fields */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950/70 p-4 rounded-2xl border border-white/5">
                                                <div className="space-y-1.5 md:col-span-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                            Categoría Registrada (Tarjeta Kumakards)
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setProfile({
                                                                    ...profile,
                                                                    wkfCategory: wkfEval.suggestedCategory,
                                                                    categoryWeight: profile.weight,
                                                                    weightReviewNeeded: false
                                                                });
                                                            }}
                                                            className="text-[9px] text-amber-400 hover:text-amber-300 font-bold tracking-wider transition-colors underline cursor-pointer"
                                                        >
                                                            Usar sugerencia ({wkfEval.suggestedCategory})
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={profile.wkfCategory}
                                                        onChange={(e) => setProfile({ ...profile, wkfCategory: e.target.value })}
                                                        placeholder={`Ej: ${wkfEval.suggestedCategory}`}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-white focus:border-amber-400 outline-none text-xs font-bold"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                        Peso de Categoría (kg)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={profile.categoryWeight}
                                                        onChange={(e) => setProfile({ ...profile, categoryWeight: Number(e.target.value) })}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3 text-white focus:border-amber-400 outline-none text-xs font-mono"
                                                    />
                                                    <span className="text-[9px] text-zinc-500 block">Límite para alertas</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === "stats" && (
                                        <motion.div 
                                            key="tab-stats"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                                                <div>
                                                    <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                                        <Trophy className="w-4 h-4 text-kuma-gold" /> Calibración Atributos FIFA
                                                    </h3>
                                                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider mt-0.5">
                                                        Ajusta los 5 vectores de combate. El OVR se recalcula al instante en la Karate Card.
                                                    </p>
                                                </div>
                                                <div className="bg-kuma-gold/15 border border-kuma-gold/40 px-3.5 py-1 rounded-xl text-center">
                                                    <span className="text-[9px] text-zinc-400 uppercase font-bold block">Rating</span>
                                                    <span className="text-kuma-gold font-serif font-black text-xl leading-none">OVR {calculatedOvr}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                                {[
                                                    { key: "vel", label: "Velocidad (Shunkan)", icon: <Zap className="w-4 h-4 text-blue-400" /> },
                                                    { key: "pot", label: "Potencia (Kime)", icon: <Activity className="w-4 h-4 text-red-500" /> },
                                                    { key: "tec", label: "Técnica (Waza)", icon: <Target className="w-4 h-4 text-amber-400" /> },
                                                    { key: "res", label: "Resistencia (Stamina)", icon: <HeartPulse className="w-4 h-4 text-emerald-400" /> },
                                                    { key: "esp", label: "Espíritu (Zanshin)", icon: <Flame className="w-4 h-4 text-purple-400" /> },
                                                ].map((stat) => (
                                                    <div key={stat.key} className="space-y-2 bg-zinc-950/50 p-3.5 rounded-2xl border border-white/5">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                {stat.icon}
                                                                <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{stat.label}</label>
                                                            </div>
                                                            <span className="text-base font-black text-white italic">{profile.stats[stat.key as keyof typeof profile.stats]}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="99"
                                                            value={profile.stats[stat.key as keyof typeof profile.stats]}
                                                            onChange={(e) => handleStatChange(stat.key, Number(e.target.value))}
                                                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === "salud" && (
                                        <motion.div 
                                            key="tab-salud"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <h3 className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <Phone className="w-4 h-4" /> Teléfonos & Contacto
                                                    </h3>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Teléfono Atleta</label>
                                                        <input
                                                            type="text"
                                                            value={profile.phone}
                                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-white text-xs outline-none focus:border-blue-400"
                                                            placeholder="+506 ..."
                                                        />
                                                    </div>

                                                    <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-3">
                                                        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-60">Contacto de Emergencia</p>
                                                        <input
                                                            type="text"
                                                            placeholder="Nombre del familiar o contacto"
                                                            value={profile.emergencyContact.name}
                                                            onChange={(e) => setProfile({ ...profile, emergencyContact: { ...profile.emergencyContact, name: e.target.value } })}
                                                            className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 px-3.5 text-white text-xs outline-none"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Teléfono de emergencia"
                                                            value={profile.emergencyContact.phone}
                                                            onChange={(e) => setProfile({ ...profile, emergencyContact: { ...profile.emergencyContact, phone: e.target.value } })}
                                                            className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 px-3.5 text-white text-xs outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <h3 className="text-amber-400 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <HeartPulse className="w-4 h-4" /> Ficha Médica
                                                    </h3>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Condiciones / Alergias / Medicamentos</label>
                                                        <textarea
                                                            value={profile.medicalConditions}
                                                            onChange={(e) => setProfile({ ...profile, medicalConditions: e.target.value })}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white focus:border-amber-400 outline-none h-44 resize-none text-xs leading-relaxed"
                                                            placeholder="Describa cualquier condición médica relevante para entrenamientos o pesajes..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>

                            {/* Live Preview Panel (Desktop Sticky & Mobile Collapsible) */}
                            <div className={cn(
                                "border-t lg:border-t-0 lg:border-l border-white/5 bg-zinc-950/90 p-4 sm:p-6 shrink-0 flex items-center justify-center transition-all",
                                showMobilePreview ? "block" : "hidden lg:flex lg:w-[260px] xl:w-[280px]"
                            )}>
                                <LiveFUTPreview
                                    userName={user.name}
                                    profile={profile}
                                    ovr={calculatedOvr}
                                    dojos={dojos}
                                />
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 sm:p-6 border-t border-white/5 bg-zinc-900/60 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
                                    Atleta ID: {user._id?.slice(-6)}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="ghost" 
                                    onClick={onClose} 
                                    disabled={isSaving}
                                    className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    onClick={handleSubmit} 
                                    loading={isSaving}
                                    className="bg-red-600 hover:bg-red-700 text-white min-w-[140px] rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/20 active:scale-95"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Perfil
                                </Button>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
