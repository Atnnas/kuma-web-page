"use client";

import React, { useState, useEffect, useMemo, useDeferredValue, useRef } from "react";
import { getAllPotentialAthletes, updateAthleteProfile, createAndEnrollAthlete } from "@/lib/actions/athletes";
import { deleteUser } from "@/lib/actions/users";
import { getDojos } from "@/lib/actions/dojos";
import { SwipeBackWrapper } from "@/components/admin/AdminNavigation";
import { AthleteEditModal, BeltSquare, MartialArtsBeltIcon, getBeltColor } from "@/components/admin/AthleteEditModal";
import { AdminFloatingButton } from "@/components/admin/AdminFloatingButton";
import { EnrollmentModal } from "@/components/admin/EnrollmentModal";
import { KumaCelebrationModal, getKumaHonorDetails } from "@/components/sections/KumaRanking";
import { Button } from "@/components/ui/Button";
import { 
    Loader2, 
    Search, 
    Trophy, 
    UserPlus, 
    Star, 
    ChevronRight, 
    Activity, 
    Trash2, 
    UserMinus, 
    LayoutGrid, 
    List, 
    Filter, 
    X, 
    AlertTriangle, 
    Sparkles, 
    Shield, 
    Users, 
    CheckCircle2, 
    ArrowUpDown, 
    Download,
    FileSpreadsheet,
    Command,
    Building2,
    Share2
} from "lucide-react";
import { ShareCardModal } from "@/components/share/ShareCardModal";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Helper for rating delta
const renderDeltaArrow = (currentVal: number, lastVal?: number) => {
    if (lastVal === undefined || lastVal === null) return null;
    const curRound = Math.round(currentVal);
    const lastRound = Math.round(lastVal);
    if (curRound > lastRound) {
        return <span className="text-emerald-400 font-black text-[9px] ml-0.5 select-none" title={`Subió desde ${lastRound}`}>▲</span>;
    } else if (curRound < lastRound) {
        return <span className="text-red-500 font-black text-[9px] ml-0.5 select-none" title={`Bajó desde ${lastRound}`}>▼</span>;
    }
    return null;
};

// FUT Theme Styles Generator
const getFUTStyles = (rating: number, isEnrolled: boolean) => {
    if (!isEnrolled) {
        return {
            bgClass: "from-zinc-800 to-zinc-950",
            bgCard: "from-zinc-900 via-zinc-950 to-zinc-900",
            borderClass: "bg-zinc-800/40",
            textClass: "text-zinc-600",
            textColor: "#52525b",
            glowClass: "opacity-60",
            lightColor: "rgba(255, 255, 255, 0.02)",
            diagonalStripe: "from-zinc-800/10 via-zinc-700/10 to-zinc-900/10"
        };
    }
    if (rating >= 75) {
        return {
            bgClass: "from-amber-200 via-yellow-400 to-amber-600",
            bgCard: "from-[#fceb92] via-[#e5c060] to-[#b38930]",
            borderClass: "bg-gradient-to-b from-[#fceb92] via-[#ffd54f] to-[#b38930]",
            textClass: "text-[#8d691e]",
            textColor: "#8d691e",
            glowClass: "shadow-[0_10px_30px_rgba(212,175,55,0.25)]",
            lightColor: "rgba(255, 255, 255, 0.45)",
            diagonalStripe: "from-[#ffe894]/30 via-white/40 to-[#e5c060]/30"
        };
    }
    if (rating >= 65) {
        return {
            bgClass: "from-slate-200 via-zinc-400 to-slate-500",
            bgCard: "from-[#f1f5f9] via-[#cbd5e1] to-[#64748b]",
            borderClass: "bg-gradient-to-b from-white via-zinc-300 to-slate-500",
            textClass: "text-[#475569]",
            textColor: "#475569",
            glowClass: "shadow-[0_10px_30px_rgba(148,163,184,0.18)]",
            lightColor: "rgba(255, 255, 255, 0.5)",
            diagonalStripe: "from-slate-200/25 via-white/35 to-slate-400/25"
        };
    }
    return {
        bgClass: "from-amber-700 via-amber-800 to-yellow-900",
        bgCard: "from-[#e07a3f] via-[#b45309] to-[#451a03]",
        borderClass: "bg-gradient-to-b from-[#f59e0b] via-[#b45309] to-[#78350f]",
        textClass: "text-[#78350f]",
        textColor: "#78350f",
        glowClass: "shadow-[0_10px_30px_rgba(180,83,9,0.18)]",
        lightColor: "rgba(251, 191, 36, 0.35)",
        diagonalStripe: "from-amber-900/30 via-orange-400/30 to-amber-950/30"
    };
};

const CARD_CLIP_PATH = "polygon(0% 15%, 8% 13%, 12% 9%, 20% 5%, 50% 0%, 80% 5%, 88% 9%, 92% 13%, 100% 15%, 100% 85%, 50% 100%, 0% 85%)";

// Skeleton Loading Components for High Perceived Performance
function FutCardSkeleton() {
    return (
        <div className="flex flex-col items-center gap-4 bg-zinc-950/40 border border-white/5 rounded-3xl p-5 animate-pulse">
            <div 
                className="w-full max-w-[240px] aspect-[1/1.48] bg-zinc-900/80 rounded-2xl relative overflow-hidden"
                style={{ clipPath: CARD_CLIP_PATH }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
            </div>
            <div className="w-full h-12 bg-zinc-900/60 rounded-2xl" />
            <div className="w-full h-8 bg-zinc-900/40 rounded-xl" />
        </div>
    );
}

function ListRowSkeleton() {
    return (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/50 border border-white/5 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 shrink-0" />
                <div className="space-y-2">
                    <div className="w-36 h-3.5 bg-zinc-900 rounded" />
                    <div className="w-24 h-2.5 bg-zinc-900/60 rounded" />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-16 h-7 bg-zinc-900 rounded-xl" />
                <div className="w-20 h-8 bg-zinc-900 rounded-xl" />
            </div>
        </div>
    );
}

// Memoized FUT Card Component
const AthleteFutCard = React.memo(function AthleteFutCard({
    user,
    onEdit,
    onUnenroll,
    onDelete,
    onCelebrate,
    onShare
}: {
    user: any;
    onEdit: (user: any) => void;
    onUnenroll: (user: any) => void;
    onDelete: (user: any) => void;
    onCelebrate: (user: any) => void;
    onShare?: (user: any) => void;
}) {
    const isEnrolled = !!user.athleteProfile?.isEnrolled;
    const ovr = Math.round(user.athleteProfile?.stats?.ovr || 0);
    const beltRank = user.athleteProfile?.beltRank || "Blanco";
    const specialization = user.athleteProfile?.specialization || "Kata";

    const fut = useMemo(() => getFUTStyles(ovr, isEnrolled), [ovr, isEnrolled]);
    const honor = useMemo(() => isEnrolled ? getKumaHonorDetails(user) : null, [isEnrolled, user]);

    const nameParts = (user.name || "").split(" ");
    const displayFirstName = nameParts[0] || "";
    const displayLastName = nameParts.slice(1).join(" ") || "";

    const hasWkfAlert = isEnrolled && (user.athleteProfile?.weightReviewNeeded || user.athleteProfile?.wkfEvaluation?.hasWeightReviewAlert);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-4 bg-zinc-950/60 backdrop-blur-md border border-white/5 rounded-3xl p-5 hover:border-zinc-800 transition-all duration-300 relative group shadow-xl"
        >
            {/* WKF Alert Badge */}
            {hasWkfAlert && (
                <div className="absolute -top-2.5 right-4 z-40 bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> Revisión WKF
                </div>
            )}

            {/* FUT SHIELD CARD */}
            <div 
                onClick={() => {
                    if (isEnrolled) onCelebrate(user);
                }}
                className={cn(
                    "relative w-full max-w-[240px] aspect-[1/1.48] transition-all duration-500 group-hover:scale-[1.03] active:scale-[0.98] ease-out select-none",
                    isEnrolled ? "cursor-pointer" : "cursor-default",
                    fut.glowClass
                )}
                style={{ clipPath: CARD_CLIP_PATH }}
            >
                {/* Click / Hover interactive guide */}
                {isEnrolled && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 z-30 flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-kuma-gold flex items-center gap-1 shadow-lg transform translate-y-2 group-hover:translate-y-0">
                            🎉 Celebrar en 3D
                        </div>
                    </div>
                )}

                {/* Outer Border / Bezel Frame */}
                <div 
                    className={cn("absolute inset-0 bg-gradient-to-b", fut.borderClass)}
                    style={{ clipPath: CARD_CLIP_PATH }}
                >
                    {/* Dark contrast divider space */}
                    <div 
                        className="absolute inset-[2.2px] bg-[#0c0a09]"
                        style={{ clipPath: CARD_CLIP_PATH }}
                    >
                        {/* Main Inner Card Body */}
                        <div 
                            className={cn(
                                "absolute inset-[2.5px] bg-gradient-to-b overflow-hidden flex flex-col pt-6 px-3",
                                fut.bgCard
                            )}
                            style={{
                                clipPath: CARD_CLIP_PATH,
                                backgroundImage: `radial-gradient(circle at 50% 25%, ${fut.lightColor}, transparent)`
                            }}
                        >
                            {/* Metallic subtle texture overlay */}
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.04] pointer-events-none mix-blend-overlay", fut.bgClass)} />

                            {/* Diagonal 3D Geometric Ribbon stripes */}
                            <div 
                                className="absolute w-[220%] h-32 bg-gradient-to-r rotate-[-35deg] top-1/4 left-[-60%] pointer-events-none mix-blend-overlay opacity-50"
                                style={{ backgroundImage: `linear-gradient(90deg, ${fut.diagonalStripe.split(' ')[1] || ''}, ${fut.diagonalStripe.split(' ')[3] || ''}, ${fut.diagonalStripe.split(' ')[5] || ''})` }}
                            />
                            <div className="absolute w-[220%] h-5 bg-white/[0.05] rotate-[-35deg] top-[36%] left-[-60%] pointer-events-none" />

                            {/* Inner border frame */}
                            <div 
                                className="absolute inset-[5px] border border-white/15 pointer-events-none z-10"
                                style={{ clipPath: CARD_CLIP_PATH }}
                            />

                            {/* Non-enrolled watermark banner */}
                            {!isEnrolled && (
                                <div className="absolute top-7 left-0 right-0 py-1 bg-red-950/70 border-y border-red-500/30 text-red-400 text-[8px] font-black uppercase tracking-[0.25em] text-center z-20">
                                    Sin Inscribir
                                </div>
                            )}

                            {/* Upper half details: Rating / Position / Belt & Player Portrait */}
                            <div className="flex justify-between items-start h-[48%] relative z-10">
                                
                                {/* FUT Player Attributes Panel */}
                                <div className="flex flex-col items-center pl-4 pt-1 text-center select-none shrink-0" style={{ color: fut.textColor }}>
                                    {/* OVR Rating */}
                                    <div className="relative flex items-center justify-center">
                                        <span className={cn(
                                            "text-[40px] font-serif font-black tracking-normal leading-none mb-2 px-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105",
                                            !isEnrolled ? "text-zinc-600" :
                                            ovr >= 75 ? "text-[#fde047]" :
                                            ovr >= 65 ? "text-white" : "text-[#fb923c]"
                                        )}>
                                            {isEnrolled ? ovr : "--"}
                                        </span>
                                        {isEnrolled && user.athleteProfile?.statsLastMonth && (
                                            <span className="absolute -right-2 top-0">
                                                {renderDeltaArrow(user.athleteProfile.stats.ovr, user.athleteProfile.statsLastMonth.ovr)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Spec position abbreviation */}
                                    <div className="text-[10px] font-black tracking-wider leading-none mb-1.5 text-inherit">
                                        {isEnrolled ? (specialization === "Kata" ? "KA" : specialization === "Kumite" ? "KU" : "KA/KU") : "---"}
                                    </div>
                                    
                                    <div className="h-[1px] w-5 bg-current opacity-50 mb-1.5" />
                                    
                                    {/* Visual Belt preview */}
                                    {isEnrolled ? (
                                        <BeltSquare beltRank={beltRank} className="w-4.5 h-4.5 mb-1.5 shadow-md border border-white/20 rounded-md" />
                                    ) : (
                                        <div className="w-4.5 h-4.5 rounded-md bg-zinc-900 border border-white/5 mb-1.5 flex items-center justify-center text-[7px] text-zinc-700 font-bold">X</div>
                                    )}
                                    
                                    <div className="h-[1px] w-5 bg-current opacity-50 mb-1.5" />
                                    
                                    <Trophy className="w-3 h-3" style={{ color: 'inherit' }} />
                                </div>

                                {/* Player portrait */}
                                <div className="absolute right-3 top-0 bottom-0 left-[35%] flex items-center justify-center z-10">
                                    <div className={cn(
                                        "w-[84px] h-[84px] rounded-full overflow-hidden border-2 bg-zinc-950 flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-[1.04] relative",
                                        !isEnrolled ? "border-zinc-800 grayscale opacity-45 shadow-none" :
                                        ovr >= 75 ? "border-kuma-gold shadow-kuma-gold/15" :
                                        ovr >= 65 ? "border-zinc-300 shadow-white/5" : "border-amber-700 shadow-amber-900/10"
                                    )}>
                                        {user.image ? (
                                            <img 
                                                src={user.image} 
                                                alt={user.name} 
                                                className="w-full h-full object-cover object-center" 
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-2xl font-black text-zinc-700 bg-zinc-900 select-none">
                                                {user.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Middle Glass Nameplate Banner */}
                            <div className="mt-3.5 py-1 text-center relative z-20 select-none">
                                <div className="absolute inset-y-0 inset-x-[-20px] bg-white/[0.04] backdrop-blur-[1px] border-y border-white/10" />
                                <h3 className="relative z-10 text-[12px] font-serif font-black text-white uppercase tracking-[0.12em] truncate drop-shadow-md py-0.5 px-3">
                                    {displayFirstName} <span style={{ color: fut.textColor }}>{displayLastName}</span>
                                </h3>
                            </div>

                            {/* FIFA FUT STATS PANEL */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[9px] font-bold text-zinc-200 max-w-[170px] mx-auto select-none pt-3 pb-6 relative z-20">
                                <div className="flex flex-col gap-0.5 pr-2.5 border-r border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[10px] drop-shadow">
                                            {isEnrolled ? Math.round(user.athleteProfile.stats.vel) : "--"}
                                            {isEnrolled && renderDeltaArrow(user.athleteProfile.stats.vel, user.athleteProfile.statsLastMonth?.vel)}
                                        </span>
                                        <span className="text-white/50 uppercase tracking-widest text-[7px]">VEL</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[10px] drop-shadow">
                                            {isEnrolled ? Math.round(user.athleteProfile.stats.tec) : "--"}
                                            {isEnrolled && renderDeltaArrow(user.athleteProfile.stats.tec, user.athleteProfile.statsLastMonth?.tec)}
                                        </span>
                                        <span className="text-white/50 uppercase tracking-widest text-[7px]">TEC</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[10px] drop-shadow">
                                            {isEnrolled ? Math.round(user.athleteProfile.stats.pot) : "--"}
                                            {isEnrolled && renderDeltaArrow(user.athleteProfile.stats.pot, user.athleteProfile.statsLastMonth?.pot)}
                                        </span>
                                        <span className="text-white/50 uppercase tracking-widest text-[7px]">POT</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5 pl-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[10px] drop-shadow">
                                            {isEnrolled ? Math.round(user.athleteProfile.stats.res) : "--"}
                                            {isEnrolled && renderDeltaArrow(user.athleteProfile.stats.res, user.athleteProfile.statsLastMonth?.res)}
                                        </span>
                                        <span className="text-white/50 uppercase tracking-widest text-[7px]">RES</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[10px] drop-shadow">
                                            {isEnrolled ? Math.round(user.athleteProfile.stats.esp) : "--"}
                                            {isEnrolled && renderDeltaArrow(user.athleteProfile.stats.esp, user.athleteProfile.statsLastMonth?.esp)}
                                        </span>
                                        <span className="text-white/50 uppercase tracking-widest text-[7px]">ESP</span>
                                    </div>
                                    <div className="flex justify-between items-center opacity-0 pointer-events-none">
                                        <span className="font-black text-[10px]">0</span>
                                        <span className="text-[7px]">-</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dojo Logo at Bottom */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none z-20">
                                <div className="w-7 h-7 rounded-full border border-white/30 overflow-hidden shadow-lg filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] bg-zinc-950 flex items-center justify-center">
                                    <img 
                                        src={user.athleteProfile?.dojo?.logo || "/images/kuma-logo.jpg"} 
                                        alt={user.athleteProfile?.dojo?.name || "Kuma Dojo"} 
                                        className="w-full h-full object-cover scale-105" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CC & Secret Ability Panel */}
            {isEnrolled && honor && (
                <div className="w-full bg-black/45 border border-white/5 rounded-2xl p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest shrink-0">Conocido Como</span>
                        <span className={cn(
                            "text-[10px] font-black tracking-wide truncate max-w-[160px] text-right",
                            user.athleteProfile?.cc ? "text-kuma-gold" : "text-zinc-500"
                        )}>
                            {honor.badge}
                        </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest shrink-0">Hab. Secreta</span>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider truncate max-w-[160px] text-right",
                            user.athleteProfile?.habilidadSecreta ? "text-red-500" : "text-zinc-500"
                        )}>
                            {honor.ability}
                        </span>
                    </div>
                </div>
            )}

            {/* ADMIN ACTIONS TOOLBAR */}
            <div className="w-full flex items-center justify-between gap-2 mt-2 pt-4 border-t border-white/5">
                <div>
                    {isEnrolled ? (
                        <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/5 rounded-full px-2.5 py-1">
                            <MartialArtsBeltIcon className="w-3.5 h-3.5" color={getBeltColor(beltRank).hex} />
                            <BeltSquare beltRank={beltRank} className="w-3 h-3" />
                            <span className="text-[8px] font-black uppercase text-zinc-400 tracking-wider">
                                {beltRank}
                            </span>
                        </div>
                    ) : (
                        <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">
                            No Afiliado
                        </span>
                    )}
                </div>

                <div className="flex gap-1.5 shrink-0">
                    {isEnrolled ? (
                        <>
                            <Button
                                onClick={() => onShare?.(user)}
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-amber-400 hover:text-white hover:bg-amber-500/20 rounded-xl active:scale-95 transition-all"
                                title="Publicar en WhatsApp, Instagram, TikTok o Facebook"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                onClick={() => onUnenroll(user)}
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl active:scale-95 transition-transform"
                                title="Desvincular del Ranking"
                            >
                                <UserMinus className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                onClick={() => onDelete(user)}
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl active:scale-95 transition-transform"
                                title="Eliminar permanentemente de la base de datos"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => onDelete(user)}
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl active:scale-95 transition-transform"
                            title="Eliminar permanentemente de la base de datos"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    )}
                    <Button
                        onClick={() => onEdit(user)}
                        size="sm"
                        className={cn(
                            "h-9 px-3 rounded-xl flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95",
                            isEnrolled 
                            ? "bg-zinc-850 hover:bg-white hover:text-black text-white border border-white/5" 
                            : "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.25)]"
                        )}
                    >
                        {isEnrolled ? (
                            <>Editar Card <ChevronRight className="w-3 h-3" /></>
                        ) : (
                            <>Inscribir <UserPlus className="w-3 h-3" /></>
                        )}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
});

// Memoized Compact List Row Component (Perfect for mobile & high density overview)
const AthleteListRow = React.memo(function AthleteListRow({
    user,
    onEdit,
    onUnenroll,
    onDelete,
    onCelebrate,
    onShare
}: {
    user: any;
    onEdit: (user: any) => void;
    onUnenroll: (user: any) => void;
    onDelete: (user: any) => void;
    onCelebrate: (user: any) => void;
    onShare?: (user: any) => void;
}) {
    const isEnrolled = !!user.athleteProfile?.isEnrolled;
    const ovr = Math.round(user.athleteProfile?.stats?.ovr || 0);
    const beltRank = user.athleteProfile?.beltRank || "Blanco";
    const dojoName = user.athleteProfile?.dojo?.name || "Kuma Dojo";
    const wkfCategory = user.athleteProfile?.wkfCategory || "Sin Categoría WKF";
    const hasWkfAlert = isEnrolled && (user.athleteProfile?.weightReviewNeeded || user.athleteProfile?.wkfEvaluation?.hasWeightReviewAlert);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/70 border border-white/5 hover:border-zinc-800 transition-all duration-200 group"
        >
            <div className="flex items-center gap-3.5 min-w-0">
                {/* Avatar */}
                <div 
                    onClick={() => {
                        if (isEnrolled) onCelebrate(user);
                    }}
                    className={cn(
                        "relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border shrink-0 flex items-center justify-center transition-transform active:scale-95",
                        isEnrolled ? "cursor-pointer border-white/10 hover:border-kuma-gold" : "border-zinc-800 grayscale"
                    )}
                >
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-base font-black text-zinc-500 uppercase">{user.name?.[0]}</span>
                    )}
                    {isEnrolled && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] font-black text-kuma-gold">
                            3D
                        </div>
                    )}
                </div>

                {/* Name & Subtitles */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">{user.name}</h4>
                        {user.athleteProfile?.cc && (
                            <span className="text-[9px] font-black text-kuma-gold bg-kuma-gold/10 px-2 py-0.5 rounded-full border border-kuma-gold/20 truncate">
                                {user.athleteProfile.cc}
                            </span>
                        )}
                        {hasWkfAlert && (
                            <span className="text-[9px] font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" /> Revisión Peso
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5 text-[11px] text-zinc-400 mt-1 flex-wrap">
                        {isEnrolled ? (
                            <>
                                <span className="flex items-center gap-1 text-zinc-300">
                                    <BeltSquare beltRank={beltRank} className="w-3 h-3" />
                                    <span className="font-bold text-[10px] uppercase">{beltRank}</span>
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="text-zinc-400 text-[10px]">{dojoName}</span>
                                <span className="text-zinc-600">•</span>
                                <span className="text-[10px] text-amber-400/90 font-mono">{wkfCategory}</span>
                            </>
                        ) : (
                            <span className="text-red-400/80 text-[10px] font-bold uppercase tracking-wider">No Afiliado como Atleta</span>
                        )}
                    </div>
                </div>
            </div>

            {/* OVR + Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                {/* OVR Badge */}
                <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-black border",
                    !isEnrolled 
                        ? "bg-zinc-900 border-zinc-800 text-zinc-600"
                        : ovr >= 75
                        ? "bg-amber-500/10 border-amber-500/30 text-kuma-gold shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                        : ovr >= 65
                        ? "bg-slate-500/10 border-slate-400/30 text-white"
                        : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                )}>
                    <span>OVR {isEnrolled ? ovr : "--"}</span>
                    {isEnrolled && user.athleteProfile?.statsLastMonth && (
                        renderDeltaArrow(user.athleteProfile.stats.ovr, user.athleteProfile.statsLastMonth.ovr)
                    )}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-1.5">
                    {isEnrolled && (
                        <>
                            <Button
                                onClick={() => onShare?.(user)}
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-amber-400 hover:text-white hover:bg-amber-500/20 rounded-xl active:scale-95 transition-all"
                                title="Publicar en WhatsApp, Instagram, TikTok o Facebook"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                onClick={() => onCelebrate(user)}
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-zinc-400 hover:text-kuma-gold hover:bg-kuma-gold/10 rounded-xl active:scale-95"
                                title="Celebrar en 3D"
                            >
                                <Sparkles className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                    {isEnrolled ? (
                        <Button
                            onClick={() => onUnenroll(user)}
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl active:scale-95"
                            title="Desvincular del Ranking"
                        >
                            <UserMinus className="w-3.5 h-3.5" />
                        </Button>
                    ) : null}
                    <Button
                        onClick={() => onDelete(user)}
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl active:scale-95"
                        title="Eliminar de la base de datos"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        onClick={() => onEdit(user)}
                        size="sm"
                        className={cn(
                            "h-9 px-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1",
                            isEnrolled
                            ? "bg-zinc-850 hover:bg-white hover:text-black text-white border border-white/5"
                            : "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.25)]"
                        )}
                    >
                        {isEnrolled ? "Editar" : "Inscribir"}
                        <ChevronRight className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
});

// Confirmation Modal Component
function KumaActionModal({
    isOpen,
    onClose,
    onConfirm,
    type,
    userName,
    isProcessing
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    type: "unenroll" | "delete";
    userName: string;
    isProcessing: boolean;
}) {
    if (!isOpen) return null;

    const isDelete = type === "delete";

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/85 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 15 }}
                    className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 overflow-hidden"
                >
                    <div className="flex items-start gap-4">
                        <div className={cn(
                            "p-3 rounded-2xl shrink-0",
                            isDelete ? "bg-red-600/15 text-red-500 border border-red-500/20" : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                        )}>
                            {isDelete ? <Trash2 className="w-6 h-6" /> : <UserMinus className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-wider">
                                {isDelete ? "Eliminar Kuma Definitivamente" : "Desvincular Atleta"}
                            </h3>
                            <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                                {isDelete ? (
                                    <>
                                        ¿Estás seguro de que deseas eliminar permanentemente a <span className="text-white font-bold">{userName}</span>? Esta acción borrará todas sus Karate Cards, asistencia y datos de la base de datos de forma irreversible.
                                    </>
                                ) : (
                                    <>
                                        ¿Deseas desvincular a <span className="text-white font-bold">{userName}</span> del ranking público? Sus estadísticas biométricas y de combate se conservarán intactas para cuando regrese.
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className={cn(
                                "text-xs font-black uppercase tracking-wider px-5 rounded-xl shadow-lg active:scale-95",
                                isDelete 
                                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20" 
                                : "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20"
                            )}
                        >
                            {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            {isDelete ? "Eliminar de la DB" : "Desvincular"}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default function AdminAthletesPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [dojos, setDojos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const deferredSearch = useDeferredValue(searchTerm);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filters and view modes
    const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
    const [statusFilter, setStatusFilter] = useState<"all" | "enrolled" | "unenrolled" | "wkf-alerts">("all");
    const [selectedBelt, setSelectedBelt] = useState<string>("all");
    const [selectedDojo, setSelectedDojo] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"name-asc" | "ovr-desc" | "ovr-asc" | "recent">("name-asc");

    // Pagination
    const [visibleCount, setVisibleCount] = useState(24);

    // Modals state
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [celebratingAthlete, setCelebratingAthlete] = useState<any | null>(null);
    const [sharingAthlete, setSharingAthlete] = useState<any | null>(null);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

    // Confirmation & Toast state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: "unenroll" | "delete";
        user: any | null;
        isProcessing: boolean;
    }>({
        isOpen: false,
        type: "unenroll",
        user: null,
        isProcessing: false
    });

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3800);
    };

    const fetchData = async () => {
        setIsLoading(true);
        const [athletesData, dojosRes] = await Promise.all([
            getAllPotentialAthletes(),
            getDojos()
        ]);
        setUsers(athletesData);
        if (dojosRes.success && dojosRes.data) {
            setDojos(dojosRes.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper map of Dojos by _id for fast O(1) resolution
    const dojosMap = useMemo(() => {
        const map: Record<string, any> = {};
        dojos.forEach(d => {
            map[d._id] = d;
        });
        return map;
    }, [dojos]);

    // Robust helper to resolve an athlete's Dojo info
    const getAthleteDojo = (user: any): { _id: string; name: string; logo: string } => {
        const d = user.athleteProfile?.dojo || user.dojo;
        if (!d) {
            return {
                _id: "unassigned",
                name: "Sin Dojo Asignado",
                logo: "/images/kuma-logo.jpg"
            };
        }
        if (typeof d === "object" && d.name) {
            return {
                _id: d._id ? String(d._id) : "custom",
                name: d.name,
                logo: d.logo || "/images/kuma-logo.jpg"
            };
        }
        const dId = String(d);
        if (dojosMap[dId]) {
            return {
                _id: dId,
                name: dojosMap[dId].name,
                logo: dojosMap[dId].logo || "/images/kuma-logo.jpg"
            };
        }
        return {
            _id: "unassigned",
            name: "Sin Dojo Asignado",
            logo: "/images/kuma-logo.jpg"
        };
    };

    // Calculate real-time counts per Dojo
    const dojoCounts = useMemo(() => {
        const counts: Record<string, { total: number; enrolled: number }> = {
            all: { total: users.length, enrolled: users.filter(u => u.athleteProfile?.isEnrolled).length }
        };
        users.forEach(u => {
            const dojo = getAthleteDojo(u);
            if (!counts[dojo._id]) {
                counts[dojo._id] = { total: 0, enrolled: 0 };
            }
            counts[dojo._id].total += 1;
            if (u.athleteProfile?.isEnrolled) {
                counts[dojo._id].enrolled += 1;
            }
        });
        return counts;
    }, [users, dojosMap]);

    // Available dojos for filter pills
    const availableDojosForFilter = useMemo(() => {
        const hasUnassigned = (dojoCounts["unassigned"]?.total || 0) > 0;
        return { list: dojos, hasUnassigned };
    }, [dojos, dojoCounts]);

    // Global Keyboard Shortcut: '/' or 'Cmd/Ctrl + K' focuses search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
            
            if ((e.key === "/" && !isInput) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
                e.preventDefault();
                searchInputRef.current?.focus();
                searchInputRef.current?.select();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Scope users for KPIs (reflects selected Dojo if one is filtered)
    const scopeUsers = useMemo(() => {
        if (selectedDojo === "all") return users;
        return users.filter(u => getAthleteDojo(u)._id === selectedDojo);
    }, [users, selectedDojo, dojosMap]);

    // KPIs Calculations
    const kpis = useMemo(() => {
        const total = scopeUsers.length;
        const enrolledUsers = scopeUsers.filter(u => u.athleteProfile?.isEnrolled);
        const enrolledCount = enrolledUsers.length;
        const avgOvr = enrolledCount > 0 
            ? Math.round(enrolledUsers.reduce((acc, u) => acc + (u.athleteProfile?.stats?.ovr || 50), 0) / enrolledCount) 
            : 0;
        const wkfAlertsCount = enrolledUsers.filter(u => 
            u.athleteProfile?.weightReviewNeeded || u.athleteProfile?.wkfEvaluation?.hasWeightReviewAlert
        ).length;

        const currentDojoObj = selectedDojo !== "all" 
            ? (dojosMap[selectedDojo] || (selectedDojo === "unassigned" ? { name: "Sin Dojo Asignado" } : null)) 
            : null;

        return {
            total,
            enrolledCount,
            avgOvr,
            wkfAlertsCount,
            scopeName: currentDojoObj ? currentDojoObj.name : "Todos los Dojos",
            isFiltered: selectedDojo !== "all"
        };
    }, [scopeUsers, selectedDojo, dojosMap]);

    // Available belt filters
    const beltList = useMemo(() => [
        "all",
        "Blanco",
        "Amarillo",
        "Naranja",
        "Verde",
        "Azul",
        "Morado",
        "Marrón",
        "Negro"
    ], []);

    // Filtered & Sorted Users
    const filteredUsers = useMemo(() => {
        return users
            .filter((user) => {
                const search = deferredSearch.toLowerCase().trim();
                const matchesSearch = !search || 
                    user.name?.toLowerCase().includes(search) ||
                    user.email?.toLowerCase().includes(search) ||
                    user.athleteProfile?.cc?.toLowerCase().includes(search);

                const isEnrolled = !!user.athleteProfile?.isEnrolled;
                const hasWkfAlert = isEnrolled && (user.athleteProfile?.weightReviewNeeded || user.athleteProfile?.wkfEvaluation?.hasWeightReviewAlert);

                let matchesStatus = true;
                if (statusFilter === "enrolled") matchesStatus = isEnrolled;
                if (statusFilter === "unenrolled") matchesStatus = !isEnrolled;
                if (statusFilter === "wkf-alerts") matchesStatus = hasWkfAlert;

                let matchesBelt = true;
                if (selectedBelt !== "all") {
                    const userBelt = (user.athleteProfile?.beltRank || "").toLowerCase();
                    matchesBelt = userBelt.includes(selectedBelt.toLowerCase());
                }

                let matchesDojo = true;
                if (selectedDojo !== "all") {
                    const athleteDojo = getAthleteDojo(user);
                    matchesDojo = athleteDojo._id === selectedDojo;
                }

                return matchesSearch && matchesStatus && matchesBelt && matchesDojo;
            })
            .sort((a, b) => {
                if (sortBy === "name-asc") {
                    return (a.name || "").localeCompare(b.name || "");
                }
                if (sortBy === "ovr-desc") {
                    const ovrA = a.athleteProfile?.stats?.ovr || 0;
                    const ovrB = b.athleteProfile?.stats?.ovr || 0;
                    return ovrB - ovrA;
                }
                if (sortBy === "ovr-asc") {
                    const ovrA = a.athleteProfile?.stats?.ovr || 0;
                    const ovrB = b.athleteProfile?.stats?.ovr || 0;
                    return ovrA - ovrB;
                }
                if (sortBy === "recent") {
                    const dateA = new Date(a.createdAt || 0).getTime();
                    const dateB = new Date(b.createdAt || 0).getTime();
                    return dateB - dateA;
                }
                return 0;
            });
    }, [users, deferredSearch, statusFilter, selectedBelt, selectedDojo, sortBy, dojosMap]);



    // Paginated subset of athletes (used when not in grouped view)
    const visibleUsers = useMemo(() => {
        return filteredUsers.slice(0, visibleCount);
    }, [filteredUsers, visibleCount]);

    // Export Nomina to CSV with Excel UTF-8 BOM
    const handleExportCSV = () => {
        if (filteredUsers.length === 0) {
            showToast("No hay atletas para exportar", "error");
            return;
        }

        const headers = [
            "Nombre Completo",
            "Correo Electrónico",
            "Inscrito",
            "Cinturón",
            "Especialidad",
            "Dojo",
            "Peso (kg)",
            "Altura (cm)",
            "Categoría Oficial WKF",
            "Alerta Revisión Peso",
            "OVR (Rating)",
            "Velocidad",
            "Potencia",
            "Técnica",
            "Resistencia",
            "Espíritu",
            "Conocido Como (CC)",
            "Habilidad Secreta",
            "Teléfono Atleta",
            "Contacto Emergencia (Nombre)",
            "Contacto Emergencia (Teléfono)"
        ];

        const rows = filteredUsers.map(u => {
            const p = u.athleteProfile || {};
            const stats = p.stats || {};
            const dojoName = p.dojo?.name || "Kuma Dojo";
            const isEnrolled = p.isEnrolled ? "SÍ" : "NO";
            const alertWeight = p.weightReviewNeeded || p.wkfEvaluation?.hasWeightReviewAlert ? "SÍ (REVISAR)" : "AL DÍA";

            return [
                `"${(u.name || "").replace(/"/g, '""')}"`,
                `"${(u.email || "").replace(/"/g, '""')}"`,
                `"${isEnrolled}"`,
                `"${(p.beltRank || "Blanco").replace(/"/g, '""')}"`,
                `"${(p.specialization || "Ambos").replace(/"/g, '""')}"`,
                `"${dojoName.replace(/"/g, '""')}"`,
                p.weight || "",
                p.height || "",
                `"${(p.wkfCategory || "").replace(/"/g, '""')}"`,
                `"${alertWeight}"`,
                stats.ovr || 50,
                stats.vel || 50,
                stats.pot || 50,
                stats.tec || 50,
                stats.res || 50,
                stats.esp || 50,
                `"${(p.cc || "").replace(/"/g, '""')}"`,
                `"${(p.habilidadSecreta || "").replace(/"/g, '""')}"`,
                `"${(p.phone || "").replace(/"/g, '""')}"`,
                `"${(p.emergencyContact?.name || "").replace(/"/g, '""')}"`,
                `"${(p.emergencyContact?.phone || "").replace(/"/g, '""')}"`
            ].join(",");
        });

        const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const dateStr = new Date().toISOString().split("T")[0];
        const dojoSlug = selectedDojo !== "all" 
            ? (dojosMap[selectedDojo]?.name || (selectedDojo === "unassigned" ? "sin_dojo" : "dojo")).toLowerCase().replace(/[^a-z0-9]+/g, "_")
            : "todos_dojos";
        link.setAttribute("href", url);
        link.setAttribute("download", `nomina_kuma_${dojoSlug}_${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        const dojoNotice = selectedDojo !== "all" ? ` (${dojosMap[selectedDojo]?.name || "Dojo seleccionado"})` : "";
        showToast(`Nómina de ${filteredUsers.length} atletas exportada en .CSV${dojoNotice}`, "success");
    };

    // Actions
    const handleSaveAthlete = async (userId: string, profileData: any) => {
        const res = await updateAthleteProfile(userId, profileData);
        if (res.success) {
            setEditingUser(null);
            showToast("Perfil de atleta guardado correctamente", "success");
            fetchData();
        } else {
            showToast(res.error || "Error al actualizar perfil", "error");
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.user) return;
        setConfirmModal(prev => ({ ...prev, isProcessing: true }));

        const targetUser = confirmModal.user;

        if (confirmModal.type === "unenroll") {
            const res = await updateAthleteProfile(targetUser._id, { isEnrolled: false });
            if (res.success) {
                showToast(`${targetUser.name} ha sido desvinculado del ranking`, "success");
                fetchData();
            } else {
                showToast(res.error || "Error al desvincular atleta", "error");
            }
        } else if (confirmModal.type === "delete") {
            // Optimistic update
            setUsers(prev => prev.filter(u => u._id !== targetUser._id));
            const res = await deleteUser(targetUser._id);
            if (res.success) {
                showToast(`Kuma ${targetUser.name} eliminado de la base de datos`, "success");
            } else {
                showToast(res.error || "Error al eliminar usuario", "error");
                fetchData(); // Rollback on failure
            }
        }

        setConfirmModal({ isOpen: false, type: "unenroll", user: null, isProcessing: false });
    };

    const handleEnrollExisting = (user: any) => {
        setIsEnrollModalOpen(false);
        setEditingUser(user);
    };

    const handleCreateAndEnroll = async (userData: any) => {
        const res = await createAndEnrollAthlete(userData);
        if (res.success) {
            setIsEnrollModalOpen(false);
            showToast("¡Nuevo Kuma creado e inscrito con éxito!", "success");
            await fetchData();
        } else {
            showToast(res.error || "Error al crear el Kuma", "error");
        }
    };

    return (
        <SwipeBackWrapper>
            <div className="max-w-7xl mx-auto py-4 sm:py-8 px-0 sm:px-4 md:px-6 relative min-h-screen pb-32 min-w-0">
                
                {/* Floating Toast Notification */}
                <AnimatePresence>
                    {toast && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className={cn(
                                "fixed top-6 left-1/2 -translate-x-1/2 z-[150] px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-2.5 text-xs font-black uppercase tracking-wider",
                                toast.type === "success" 
                                    ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30 shadow-emerald-950/50" 
                                    : "bg-red-950/90 text-red-300 border-red-500/30 shadow-red-950/50"
                            )}
                        >
                            {toast.type === "success" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                            <span>{toast.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Standard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-zinc-500 text-xs font-black uppercase tracking-widest mb-1.5">
                            <Shield className="w-3.5 h-3.5 text-kuma-gold" />
                            <span>Panel Administrativo Pro</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-black uppercase tracking-wider sm:tracking-widest text-kuma-gold drop-shadow-lg">
                            KUMA <span className="text-red-600">MANAGER</span>
                        </h1>
                        <p className="text-zinc-400 text-xs sm:text-sm font-bold uppercase tracking-wider mt-1">
                            Inscripciones de Atletas, Karate Cards y Categorías Oficiales WKF
                        </p>
                    </div>

                    {/* View Switcher, Export & Action buttons */}
                    <div className="flex items-center gap-2 sm:gap-2.5 self-stretch sm:self-auto flex-wrap">
                        {/* View Switcher: Cards vs List */}
                        <div className="flex items-center bg-zinc-950 p-1 rounded-2xl border border-white/5">
                            <button
                                onClick={() => setViewMode("cards")}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                                    viewMode === "cards" 
                                        ? "bg-zinc-800 text-white shadow-md" 
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                                title="Vista Cartas FUT"
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Cartas FUT</span>
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                                    viewMode === "list" 
                                        ? "bg-zinc-800 text-white shadow-md" 
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                                title="Vista Lista Compacta"
                            >
                                <List className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Lista</span>
                            </button>
                        </div>

                        {/* Export CSV Button */}
                        <Button
                            variant="outline"
                            onClick={handleExportCSV}
                            className="bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-2xl px-3.5 py-2 flex items-center gap-2 active:scale-95 min-h-[38px]"
                            title="Descargar nómina de atletas filtrados en formato CSV para Excel"
                        >
                            <Download className="w-3.5 h-3.5 text-kuma-gold" />
                            <span className="hidden sm:inline">Exportar .CSV</span>
                        </Button>

                        {/* Enroll Button */}
                        <Button 
                            onClick={() => setIsEnrollModalOpen(true)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl px-4 py-2 flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-95 min-h-[38px]"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Inscribir</span>
                        </Button>
                    </div>
                </div>

                {/* Dashboard KPI Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-zinc-950/70 border border-white/5 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between min-w-0">
                        <div className="flex items-center justify-between text-zinc-500">
                            <span className="text-[10px] font-black uppercase tracking-widest truncate">
                                {kpis.isFiltered ? "Kumas Dojo" : "Total Kumas"}
                            </span>
                            <Users className="w-4 h-4 shrink-0" />
                        </div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1.5 sm:mt-2 truncate">
                            {kpis.total}
                        </div>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider mt-1 truncate" title={kpis.scopeName}>
                            {kpis.isFiltered ? kpis.scopeName : `${dojos.length} Dojos`}
                        </span>
                    </div>

                    <div className="bg-zinc-950/70 border border-white/5 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between min-w-0">
                        <div className="flex items-center justify-between text-zinc-500">
                            <span className="text-[10px] font-black uppercase tracking-widest truncate">Inscritos Activos</span>
                            <Trophy className="w-4 h-4 text-kuma-gold shrink-0" />
                        </div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-black text-kuma-gold mt-1.5 sm:mt-2 truncate">
                            {kpis.enrolledCount}
                        </div>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider mt-1 truncate">
                            {kpis.isFiltered ? `Activos en dojo` : "Con Karate Card activa"}
                        </span>
                    </div>

                    <div className="bg-zinc-950/70 border border-white/5 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between min-w-0">
                        <div className="flex items-center justify-between text-zinc-500">
                            <span className="text-[10px] font-black uppercase tracking-widest truncate">
                                {kpis.isFiltered ? "Promedio Dojo" : "Promedio General"}
                            </span>
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        </div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-white mt-1.5 sm:mt-2 truncate">
                            OVR {kpis.avgOvr}
                        </div>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider mt-1 truncate">
                            {kpis.isFiltered ? `Nivel dojo` : "Nivel general del tatami"}
                        </span>
                    </div>

                    <div 
                        onClick={() => {
                            if (kpis.wkfAlertsCount > 0) {
                                setStatusFilter("wkf-alerts");
                            }
                        }}
                        className={cn(
                            "rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all min-w-0",
                            kpis.wkfAlertsCount > 0 
                                ? "bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/15" 
                                : "bg-zinc-950/70 border border-white/5"
                        )}
                    >
                        <div className="flex items-center justify-between text-zinc-500">
                            <span className="text-[10px] font-black uppercase tracking-widest text-inherit truncate">Alertas WKF</span>
                            <AlertTriangle className={cn("w-4 h-4 shrink-0", kpis.wkfAlertsCount > 0 ? "text-amber-400 animate-pulse" : "text-zinc-600")} />
                        </div>
                        <div className={cn("text-xl sm:text-2xl md:text-3xl font-black mt-1.5 sm:mt-2 truncate", kpis.wkfAlertsCount > 0 ? "text-amber-400" : "text-zinc-600")}>
                            {kpis.wkfAlertsCount}
                        </div>
                        <span className="text-[9px] text-zinc-400 uppercase tracking-wider mt-1 truncate">
                            {kpis.wkfAlertsCount > 0 ? "⚠️ Clic para filtrar pesos" : "Todos al día en peso"}
                        </span>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-zinc-950/50 border border-white/5 rounded-3xl p-4 sm:p-5 mb-8 space-y-4">
                    <div className="flex flex-col lg:flex-row items-center gap-3">
                        {/* Search Input with shortcut hint */}
                        <div className="relative w-full lg:flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                            <input
                                ref={searchInputRef}
                                id="athlete-search"
                                type="text"
                                placeholder="Buscar por nombre, email o apodo (CC)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl py-3 pl-11 pr-16 text-sm text-white placeholder:text-zinc-600 focus:border-kuma-gold focus:outline-none transition-all shadow-inner"
                            />
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                {searchTerm ? (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="text-zinc-500 hover:text-white p-1 rounded-full transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                ) : (
                                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-zinc-500 bg-zinc-800 border border-zinc-700 rounded shadow-sm">
                                        /
                                    </kbd>
                                )}
                            </div>
                        </div>

                        {/* Combo Box: Filtrar por Dojo */}
                        <div className="w-full sm:w-auto lg:w-72">
                            <div className="relative w-full">
                                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kuma-gold w-4 h-4 pointer-events-none z-10" />
                                <select
                                    id="dojo-filter-combobox"
                                    value={selectedDojo}
                                    onChange={(e) => {
                                        setSelectedDojo(e.target.value);
                                        setVisibleCount(24);
                                    }}
                                    className={cn(
                                        "w-full bg-zinc-900 border rounded-2xl py-3 pl-10 pr-9 text-xs text-white focus:outline-none appearance-none cursor-pointer font-bold uppercase tracking-wider transition-all shadow-inner",
                                        selectedDojo !== "all" 
                                            ? "border-kuma-gold bg-amber-500/10 text-kuma-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                                            : "border-zinc-800 focus:border-zinc-700 text-zinc-300"
                                    )}
                                    title="Filtrar atletas por Dojo"
                                >
                                    <option value="all">
                                        ⛩️ Todos los Dojos ({users.length})
                                    </option>
                                    {dojos.map((d) => (
                                        <option key={d._id} value={d._id}>
                                            🥋 {d.name} ({dojoCounts[d._id]?.total || 0})
                                        </option>
                                    ))}
                                    {availableDojosForFilter.hasUnassigned && (
                                        <option value="unassigned">
                                            ⚠️ Sin Dojo Asignado ({dojoCounts["unassigned"]?.total || 0})
                                        </option>
                                    )}
                                </select>
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]">
                                    ▼
                                </div>
                            </div>
                        </div>

                        {/* Sorting Dropdown */}
                        <div className="w-full sm:w-auto lg:w-48">
                            <div className="relative w-full">
                                <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5 pointer-events-none" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-9 pr-8 text-xs text-zinc-300 focus:border-zinc-700 outline-none appearance-none cursor-pointer font-bold uppercase tracking-wider shadow-inner"
                                >
                                    <option value="name-asc">Nombre (A-Z)</option>
                                    <option value="ovr-desc">Mayor OVR (Rating)</option>
                                    <option value="ovr-asc">Menor OVR (Rating)</option>
                                    <option value="recent">Recientes</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]">▼</div>
                            </div>
                        </div>
                    </div>

                    {/* Status Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mr-1">Estado:</span>
                        {[
                            { id: "all", label: "Todos" },
                            { id: "enrolled", label: "Inscritos (Ranking)" },
                            { id: "unenrolled", label: "Sin Inscribir" },
                            { id: "wkf-alerts", label: "⚠️ Alertas WKF" }
                        ].map(st => (
                            <button
                                key={st.id}
                                onClick={() => setStatusFilter(st.id as any)}
                                className={cn(
                                    "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95",
                                    statusFilter === st.id
                                        ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                                        : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                                )}
                            >
                                {st.label}
                            </button>
                        ))}
                    </div>

                    {/* Belt Filter Horizontal Scroll */}
                    <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar py-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mr-1 shrink-0">Cintas:</span>
                        {beltList.map(belt => {
                            const isSelected = selectedBelt === belt;
                            const isAll = belt === "all";
                            const colorData = !isAll ? getBeltColor(belt) : null;

                            return (
                                <button
                                    key={belt}
                                    onClick={() => setSelectedBelt(belt)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all active:scale-95",
                                        isSelected
                                            ? "bg-kuma-gold text-black font-black shadow-md shadow-kuma-gold/20"
                                            : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                                    )}
                                >
                                    {!isAll && colorData && (
                                        <div 
                                            className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0" 
                                            style={{ backgroundColor: colorData.hex }} 
                                        />
                                    )}
                                    <span>{isAll ? "Todas las cintas" : belt}</span>
                                </button>
                            );
                        })}
                    </div>


                </div>

                {/* Floating Admin Button for Quick Actions */}
                <AdminFloatingButton 
                    onClick={() => setIsEnrollModalOpen(true)} 
                    label="Inscribir Kuma" 
                />

                {/* Active Dojo Filter Notification Banner */}
                {selectedDojo !== "all" && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3.5 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs shadow-lg backdrop-blur-md"
                    >
                        <div className="flex items-center gap-2.5 text-zinc-300">
                            <Building2 className="w-4 h-4 text-kuma-gold shrink-0" />
                            <span>
                                Observando atletas de: <strong className="text-white font-serif tracking-wider">{dojosMap[selectedDojo]?.name || (selectedDojo === "unassigned" ? "Sin Dojo Asignado" : "Dojo Seleccionado")}</strong> ({filteredUsers.length} encontrados)
                            </span>
                        </div>
                        <button
                            onClick={() => setSelectedDojo("all")}
                            className="text-[10px] font-black uppercase tracking-wider text-amber-400 hover:text-white underline cursor-pointer ml-3 shrink-0"
                        >
                            Mostrar Todos los Dojos
                        </button>
                    </motion.div>
                )}

                {/* Main Content Area */}
                {isLoading ? (
                    viewMode === "cards" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <FutCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ListRowSkeleton key={i} />
                            ))}
                        </div>
                    )
                ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-950/40 border border-white/5 rounded-3xl">
                        <div className="p-4 bg-zinc-900 rounded-full text-zinc-600 mb-3">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-black uppercase tracking-wider text-white">No se encontraron Kumas</h3>
                        <p className="text-zinc-500 text-xs mt-1 max-w-sm">
                            Intenta cambiar los términos de búsqueda o filtros de cinta para visualizar a los atletas.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                                setSelectedBelt("all");
                                setSelectedDojo("all");
                            }}
                            className="mt-4 text-xs font-black uppercase tracking-wider rounded-xl border-zinc-800"
                        >
                            Limpiar Filtros
                        </Button>
                    </div>
                ) : viewMode === "cards" ? (
                    /* FUT CARDS GRID */
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {visibleUsers.map((user) => (
                                <AthleteFutCard
                                    key={user._id}
                                    user={user}
                                    onEdit={(u) => setEditingUser(u)}
                                    onUnenroll={(u) => setConfirmModal({
                                        isOpen: true,
                                        type: "unenroll",
                                        user: u,
                                        isProcessing: false
                                    })}
                                    onDelete={(u) => setConfirmModal({
                                        isOpen: true,
                                        type: "delete",
                                        user: u,
                                        isProcessing: false
                                    })}
                                    onCelebrate={(u) => setCelebratingAthlete(u)}
                                    onShare={(u) => setSharingAthlete(u)}
                                />
                            ))}
                        </div>

                        {/* Pagination / Load More */}
                        {filteredUsers.length > visibleCount && (
                            <div className="flex flex-col items-center justify-center gap-3 pt-6">
                                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                                    Mostrando {visibleCount} de {filteredUsers.length} atletas
                                </span>
                                <Button
                                    onClick={() => setVisibleCount(prev => prev + 24)}
                                    className="bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95"
                                >
                                    Cargar más atletas (+24)
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* COMPACT EXECUTIVE LIST VIEW */
                    <div className="space-y-4">
                        <div className="space-y-3">
                            {visibleUsers.map((user) => (
                                <AthleteListRow
                                    key={user._id}
                                    user={user}
                                    onEdit={(u) => setEditingUser(u)}
                                    onUnenroll={(u) => setConfirmModal({
                                        isOpen: true,
                                        type: "unenroll",
                                        user: u,
                                        isProcessing: false
                                    })}
                                    onDelete={(u) => setConfirmModal({
                                        isOpen: true,
                                        type: "delete",
                                        user: u,
                                        isProcessing: false
                                    })}
                                    onCelebrate={(u) => setCelebratingAthlete(u)}
                                    onShare={(u) => setSharingAthlete(u)}
                                />
                            ))}
                        </div>

                        {/* Pagination / Load More */}
                        {filteredUsers.length > visibleCount && (
                            <div className="flex flex-col items-center justify-center gap-3 pt-6">
                                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                                    Mostrando {visibleCount} de {filteredUsers.length} atletas
                                </span>
                                <Button
                                    onClick={() => setVisibleCount(prev => prev + 36)}
                                    className="bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95"
                                >
                                    Cargar más atletas (+36)
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Enrollment Wizard Modal */}
                <EnrollmentModal
                    isOpen={isEnrollModalOpen}
                    onClose={() => setIsEnrollModalOpen(false)}
                    potentialUsers={users}
                    onEnrollExisting={handleEnrollExisting}
                    onCreateAndEnroll={handleCreateAndEnroll}
                />

                {/* Edit Modal with auto-compression, tabs, and live preview */}
                {editingUser && (
                    <AthleteEditModal
                        isOpen={!!editingUser}
                        onClose={() => setEditingUser(null)}
                        user={editingUser}
                        onSave={handleSaveAthlete}
                    />
                )}

                {/* 3D Celebration Modal */}
                <KumaCelebrationModal
                    isOpen={!!celebratingAthlete}
                    onClose={() => setCelebratingAthlete(null)}
                    athlete={celebratingAthlete}
                />

                {/* Share Card Modal for Super Admin */}
                <ShareCardModal
                    isOpen={!!sharingAthlete}
                    onClose={() => setSharingAthlete(null)}
                    athlete={sharingAthlete}
                    mode={sharingAthlete?.athleteProfile?.mvpCount ? "mvp" : "card"}
                />

                {/* Modern Confirmation Modal */}
                <KumaActionModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={handleConfirmAction}
                    type={confirmModal.type}
                    userName={confirmModal.user?.name || ""}
                    isProcessing={confirmModal.isProcessing}
                />

            </div>
        </SwipeBackWrapper>
    );
}
