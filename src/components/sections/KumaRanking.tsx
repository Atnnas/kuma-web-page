"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getEnrolledAthletes, updateAthletePhotoSelf } from "@/lib/actions/athletes";
import { Trophy, Star, Shield, Flame, Search, FlameKindling, Zap, Target, HeartPulse, Activity, Camera, Lock, Check, Loader2, X, Award, Sparkles, User as UserIcon, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BeltSquare, MartialArtsBeltIcon, getBeltColor } from "@/components/admin/AthleteEditModal";

interface Athlete {
    _id: string;
    name: string;
    email: string;
    image?: string;
    athleteProfile: {
        weight: number;
        height: number;
        beltRank: string;
        specialization: "Kata" | "Kumite" | "Ambos";
        stats: {
            vel: number;
            pot: number;
            tec: number;
            res: number;
            esp: number;
            ovr: number;
        };
    };
}

export function KumaRanking({ currentUser, initialAthletes }: { currentUser?: any; initialAthletes?: Athlete[] }) {
  const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes || []);
  const [isLoading, setIsLoading] = useState(!initialAthletes || initialAthletes.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpec, setSelectedSpec] = useState<"Todos" | "Kata" | "Kumite">("Todos");
  const [editingPhotoAthlete, setEditingPhotoAthlete] = useState<Athlete | null>(null);
  const [celebratingAthlete, setCelebratingAthlete] = useState<Athlete | null>(null);
  const [layoutMode, setLayoutMode] = useState<'ranking' | 'gallery'>('gallery');

  const loadAthletes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Determine correct base URL for both server‑side rendering and client‑side execution
      let url: string;
      if (typeof window !== "undefined") {
        // Browser context – use the current origin
        url = `${window.location.origin}/api/athletes`;
      } else {
        // Server context – fall back to env var or localhost
        const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        url = `${base}/api/athletes`;
      }
      const response = await fetch(url, { cache: "no-store" });
      const res = await response.json();
      if (!res || res.success === false) {
        setError(res?.error || "No se recibieron datos de la base de datos.");
        setAthletes([]);
      } else {
        setAthletes(res.data || []);
      }
    } catch (e: any) {
      console.error("Error loading athletes:", e);
      setError("Error al cargar los Kumas: " + (e.message || e));
      setAthletes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialAthletes || initialAthletes.length === 0) {
      loadAthletes();
    }
  }, [initialAthletes]);




    // Filter and Sort athletes
    const filteredAthletes = (athletes || [])
        .filter(ath => {
            if (!ath || !ath.name || !ath.athleteProfile) return false;
            const matchesSearch = ath.name.toLowerCase().includes((searchTerm || "").toLowerCase());
            const specialization = ath.athleteProfile.specialization || "Ambos";
            const matchesSpec = selectedSpec === "Todos" || specialization === selectedSpec || specialization === "Ambos";
            return matchesSearch && matchesSpec;
        })
        // Sort by OVR desc, then by name alphabetically
        .sort((a, b) => {
            const ovrA = a?.athleteProfile?.stats?.ovr ?? 0;
            const ovrB = b?.athleteProfile?.stats?.ovr ?? 0;
            if (ovrB !== ovrA) {
                return ovrB - ovrA;
            }
            return (a.name || "").localeCompare(b.name || "");
        });

    console.log("KumaRanking render state:", {
        athletesLength: athletes.length,
        filteredLength: filteredAthletes.length,
        isLoading,
        error,
        athletesList: athletes.map(a => ({ name: a.name }))
    });

    const podium = filteredAthletes.slice(0, 3);
    const listAthletes = filteredAthletes.slice(3);

    // Get belt styles to style card border / accents
    const getBeltStyles = (beltRank: string) => {
        const rank = beltRank.toLowerCase();
        if (rank.includes("negro")) return { border: "border-zinc-300", glow: "shadow-zinc-500/20", bg: "from-zinc-900 via-zinc-800 to-black", text: "text-zinc-200" };
        if (rank.includes("marrón") || rank.includes("marron")) return { border: "border-amber-850", glow: "shadow-amber-900/25", bg: "from-zinc-950 via-amber-950/60 to-zinc-950", text: "text-amber-500" };
        if (rank.includes("morado con línea") || rank.includes("morado con linea")) return { border: "border-purple-500", glow: "shadow-purple-500/20", bg: "from-zinc-950 via-purple-950/50 to-zinc-950", text: "text-purple-400" };
        if (rank.includes("morado")) return { border: "border-purple-600", glow: "shadow-purple-500/20", bg: "from-zinc-950 via-purple-950/30 to-zinc-950", text: "text-purple-500" };
        if (rank.includes("azul")) return { border: "border-blue-600", glow: "shadow-blue-500/20", bg: "from-zinc-950 via-blue-950/30 to-zinc-950", text: "text-blue-400" };
        if (rank.includes("verde")) return { border: "border-green-600", glow: "shadow-green-500/20", bg: "from-zinc-950 via-green-950/30 to-zinc-950", text: "text-green-400" };
        if (rank.includes("naranja")) return { border: "border-orange-500", glow: "shadow-orange-500/20", bg: "from-zinc-950 via-orange-950/30 to-zinc-950", text: "text-orange-400" };
        if (rank.includes("amarillo")) return { border: "border-yellow-500", glow: "shadow-yellow-500/20", bg: "from-zinc-950 via-yellow-950/30 to-zinc-950", text: "text-yellow-400" };
        return { border: "border-zinc-700", glow: "shadow-zinc-700/10", bg: "from-zinc-950 via-zinc-900 to-zinc-950", text: "text-zinc-400" };
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 relative">
            
            {/* Top decorative element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />



            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-16 relative z-10">
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar Kuma..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-full py-3.5 pl-12 pr-6 text-white text-sm focus:border-kuma-gold/50 focus:outline-none transition-all shadow-xl"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center sm:justify-end">
                    {/* Specialty filters */}
                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar justify-center sm:justify-start">
                        {["Todos", "Kata", "Kumite"].map((spec) => (
                            <button
                                key={spec}
                                onClick={() => setSelectedSpec(spec as any)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all duration-300 shrink-0",
                                    selectedSpec === spec
                                        ? "bg-kuma-gold border-kuma-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                                        : "bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-zinc-700"
                                )}
                            >
                                {spec === "Todos" ? "Todas Especialidades" : spec}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="w-12 h-12 border-4 border-t-kuma-gold border-white/10 rounded-full animate-spin mb-4" />
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Cargando Ranking...</p>
                </div>
            ) : error ? (
                <div className="text-center py-10 px-6 bg-red-950/20 rounded-3xl border border-red-500/20 backdrop-blur-sm max-w-xl mx-auto">
                    <p className="text-red-400 text-sm font-bold mb-2">⚠ Error de Conexión de Base de Datos</p>
                    <p className="text-zinc-400 text-xs">{error}</p>
                    <p className="text-zinc-500 text-[10px] mt-4 font-mono">Tip: Verifica que tu servidor local tenga conexión a Internet y que tu IP pública esté autorizada en el Panel de MongoDB Atlas.</p>
                </div>
            ) : filteredAthletes.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-white/5 backdrop-blur-sm">
                    <p className="text-zinc-500 text-sm">No se encontraron Kumas en esta categoría.</p>
                </div>
            ) : (
                 <div className="space-y-20 relative z-10">
                    
                    {layoutMode === 'ranking' ? (
                        <>
                            {/* PODIUM SECTION */}
                            {podium.length > 0 && (
                                <div className="flex flex-col md:flex-row gap-8 items-center justify-center max-w-5xl mx-auto pt-10 flex-wrap">
                                    
                                    {/* SECOND PLACE */}
                                    {podium[1] && (
                                        <div className="order-2 md:order-1 w-[275px] shrink-0 flex justify-center">
                                            <PodiumCard athlete={podium[1]} position={2} currentUser={currentUser} onEditPhoto={setEditingPhotoAthlete} onClickCard={setCelebratingAthlete} style={getBeltStyles(podium[1].athleteProfile.beltRank)} />
                                        </div>
                                    )}

                                    {/* FIRST PLACE */}
                                    {podium[0] && (
                                        <div className="order-1 md:order-2 w-[275px] shrink-0 flex justify-center">
                                            <PodiumCard athlete={podium[0]} position={1} currentUser={currentUser} onEditPhoto={setEditingPhotoAthlete} onClickCard={setCelebratingAthlete} style={getBeltStyles(podium[0].athleteProfile.beltRank)} />
                                        </div>
                                    )}

                                    {/* THIRD PLACE */}
                                    {podium[2] && (
                                        <div className="order-3 w-[275px] shrink-0 flex justify-center">
                                            <PodiumCard athlete={podium[2]} position={3} currentUser={currentUser} onEditPhoto={setEditingPhotoAthlete} onClickCard={setCelebratingAthlete} style={getBeltStyles(podium[2].athleteProfile.beltRank)} />
                                        </div>
                                    )}

                                </div>
                            )}

                            {/* GENERAL LEADERBOARD LIST */}
                            {listAthletes.length > 0 && (
                                <div className="max-w-5xl mx-auto">
                                    <h3 className="text-white font-serif font-black uppercase tracking-widest text-xl mb-6 flex items-center gap-3">
                                        <Activity className="w-5 h-5 text-red-500" /> Clasificación General
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        {listAthletes.map((ath, idx) => {
                                            const rankNum = idx + 4;
                                            const beltStyle = getBeltStyles(ath.athleteProfile.beltRank);
                                            return (
                                                <motion.div
                                                    key={ath._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="glass hover:border-zinc-700/50 transition-all duration-300 p-4 flex items-center justify-between gap-4 rounded-2xl group"
                                                >
                                                    <div 
                                                        onClick={() => setCelebratingAthlete(ath)}
                                                        className="flex items-center gap-4 cursor-pointer"
                                                    >
                                                        {/* Rank Number */}
                                                        <span className="w-8 text-center text-sm font-black italic text-zinc-600">
                                                            #{rankNum}
                                                        </span>

                                                        {/* Avatar */}
                                                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                                                            {ath.image ? (
                                                                <Image src={ath.image} alt={ath.name} fill className="object-cover" />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center text-zinc-500 font-bold bg-zinc-950">
                                                                    {ath.name?.[0]}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Name and Belt */}
                                                        <div>
                                                            <h4 className="text-sm font-black text-white uppercase group-hover:text-kuma-gold transition-colors">{ath.name}</h4>
                                                            <span className={cn("text-[9px] font-bold uppercase tracking-wider", beltStyle.text)}>
                                                                <span className="flex items-center gap-1">
                                                                    <BeltSquare beltRank={ath.athleteProfile.beltRank} className="w-3.5 h-3.5" />
                                                                    <span>{ath.athleteProfile.beltRank}</span>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Stats Summary */}
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex gap-4 items-center">
                                                            <div className="text-center">
                                                                <p className="text-[8px] font-bold text-zinc-600 uppercase">OVR</p>
                                                                <p className="text-sm font-black text-white italic">{ath.athleteProfile.stats.ovr}</p>
                                                            </div>
                                                            <div className="h-6 w-[1px] bg-white/5" />
                                                            <div className="text-center">
                                                                <p className="text-[8px] font-bold text-zinc-600 uppercase">ESP</p>
                                                                <p className="text-xs font-bold text-zinc-400">
                                                                    {(ath.athleteProfile.specialization || "Ambos") === "Kata" ? "KA" :
                                                                     (ath.athleteProfile.specialization || "Ambos") === "Kumite" ? "KU" : "KA/KU"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Edit photo button */}
                                                        {currentUser?.email && ath.email && ath.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim() && (
                                                            <div className="flex items-center gap-2">
                                                                 <Button
                                                                     onClick={() => setEditingPhotoAthlete(ath)}
                                                                     className="h-9 w-9 p-0 rounded-xl bg-zinc-900 border border-white/5 hover:border-white/20 text-zinc-400 hover:text-white transition-all duration-200 flex items-center justify-center shrink-0"
                                                                     title="Editar mi foto"
                                                                 >
                                                                     <Camera className="w-4 h-4" />
                                                                 </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center max-w-7xl mx-auto pt-6">
                            {filteredAthletes.map((ath, idx) => (
                                <div key={ath._id} className="w-full flex justify-center">
                                    <PodiumCard
                                        athlete={ath}
                                        position={idx + 1}
                                        currentUser={currentUser}
                                        onEditPhoto={setEditingPhotoAthlete}
                                        onClickCard={setCelebratingAthlete}
                                        style={getBeltStyles(ath.athleteProfile.beltRank)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* SELF PHOTO EDIT MODAL */}
            <AthletePhotoEditModal
                isOpen={!!editingPhotoAthlete}
                onClose={() => setEditingPhotoAthlete(null)}
                athlete={editingPhotoAthlete}
                onSuccess={loadAthletes}
            />

            {/* 3D CELEBRATION MODAL */}
            <KumaCelebrationModal
                isOpen={!!celebratingAthlete}
                onClose={() => setCelebratingAthlete(null)}
                athlete={celebratingAthlete}
            />
        </div>
    );
}

interface PodiumCardProps {
    athlete: Athlete;
    position: number;
    currentUser?: any;
    onEditPhoto: (athlete: Athlete) => void;
    onClickCard: (athlete: Athlete) => void;
    style: { border: string; glow: string; bg: string; text: string };
}

function PodiumCard({ athlete, position, currentUser, onEditPhoto, onClickCard }: PodiumCardProps) {
    const isFirst = position === 1;
    const ovr = athlete?.athleteProfile?.stats?.ovr ?? 50;
    const beltRank = athlete?.athleteProfile?.beltRank ?? "Blanco";

    // FUT Card theme matcher strictly based on Rating (OVR)
    const getFUTStyles = (rating: number) => {
        if (rating >= 75) {
            return {
                bgClass: "from-amber-200 via-yellow-400 to-amber-600",
                bgCard: "from-[#fceb92] via-[#e5c060] to-[#b38930]",
                borderClass: "bg-gradient-to-b from-[#fceb92] via-[#ffd54f] to-[#b38930]",
                textClass: "text-[#8d691e]",
                textColor: "#8d691e",
                glowClass: "shadow-[0_15px_40px_rgba(212,175,55,0.35)]",
                lightColor: "rgba(255, 255, 255, 0.45)",
                diagonalStripe: "linear-gradient(90deg, rgba(255, 232, 148, 0.3) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(229, 192, 96, 0.3) 100%)"
            };
        }
        if (rating >= 65) {
            return {
                bgClass: "from-slate-200 via-zinc-400 to-slate-500",
                bgCard: "from-[#f1f5f9] via-[#cbd5e1] to-[#64748b]",
                borderClass: "bg-gradient-to-b from-white via-zinc-300 to-slate-500",
                textClass: "text-[#475569]",
                textColor: "#475569",
                glowClass: "shadow-[0_15px_40px_rgba(148,163,184,0.25)]",
                lightColor: "rgba(255, 255, 255, 0.5)",
                diagonalStripe: "linear-gradient(90deg, rgba(226, 232, 240, 0.25) 0%, rgba(255, 255, 255, 0.35) 50%, rgba(203, 213, 225, 0.25) 100%)"
            };
        }
        return {
            bgClass: "from-amber-700 via-amber-800 to-yellow-900",
            bgCard: "from-[#e07a3f] via-[#b45309] to-[#451a03]",
            borderClass: "bg-gradient-to-b from-[#f59e0b] via-[#b45309] to-[#78350f]",
            textClass: "text-[#78350f]",
            textColor: "#78350f",
            glowClass: "shadow-[0_15px_40px_rgba(180,83,9,0.25)]",
            lightColor: "rgba(251, 191, 36, 0.35)",
            diagonalStripe: "linear-gradient(90deg, rgba(120, 53, 15, 0.3) 0%, rgba(251, 146, 60, 0.3) 50%, rgba(69, 26, 3, 0.3) 100%)"
        };
    };

    const fut = getFUTStyles(ovr);
    const nameParts = athlete.name.split(" ");
    const displayFirstName = nameParts[0] || "";
    const displayLastName = nameParts[1] || "";

    const cardClipPath = "polygon(0% 15%, 8% 13%, 12% 9%, 20% 5%, 50% 0%, 80% 5%, 88% 9%, 92% 13%, 100% 15%, 100% 85%, 50% 100%, 0% 85%)";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: position * 0.1 }}
            className="flex flex-col items-center gap-6 group w-full max-w-[275px]"
        >
            {/* FIFA FUT CARD CONTAINER */}
            <div 
                onClick={() => onClickCard(athlete)}
                className={cn(
                    "relative w-full max-w-[275px] aspect-[1/1.48] transition-all duration-500 group-hover:scale-[1.04] ease-out select-none cursor-pointer",
                    fut.glowClass
                )}
                style={{
                    clipPath: cardClipPath
                }}
            >

                {/* 1. Outer Border / Bezel Frame */}
                <div 
                    className={cn("absolute inset-0 bg-gradient-to-b", fut.borderClass)}
                    style={{ clipPath: cardClipPath }}
                >
                    {/* 2. Dark contrast divider space to separate frames */}
                    <div 
                        className="absolute inset-[2.5px] bg-[#0c0a09]"
                        style={{ clipPath: cardClipPath }}
                    >
                        {/* 3. Main Inner Card Body */}
                        <div 
                            className={cn(
                                "absolute inset-[3px] bg-gradient-to-b overflow-hidden flex flex-col pt-8 px-4",
                                fut.bgCard
                            )}
                            style={{
                                clipPath: cardClipPath,
                                backgroundImage: `radial-gradient(circle at 50% 25%, ${fut.lightColor}, transparent)`
                            }}
                        >
                            {/* Metallic reflective patterns */}
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.05] pointer-events-none mix-blend-overlay", fut.bgClass)} />

                            {/* Diagonal 3D Geometric Ribbon stripes */}
                            <div 
                                className="absolute w-[220%] h-36 bg-gradient-to-r rotate-[-35deg] top-1/4 left-[-60%] pointer-events-none mix-blend-overlay opacity-60"
                                style={{ backgroundImage: fut.diagonalStripe }}
                            />
                            <div className="absolute w-[220%] h-6 bg-white/[0.07] rotate-[-35deg] top-[36%] left-[-60%] pointer-events-none" />

                            {/* Floating metallic triangle particles */}
                            <div className="absolute bottom-[20%] left-[8%] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] pointer-events-none rotate-12 opacity-40" style={{ borderBottomColor: fut.textColor }} />
                            <div className="absolute bottom-[28%] right-[12%] w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] pointer-events-none -rotate-12 opacity-35" style={{ borderBottomColor: fut.textColor }} />
                            <div className="absolute bottom-[12%] right-[22%] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[7px] pointer-events-none rotate-45 opacity-30" style={{ borderBottomColor: fut.textColor }} />
                            <div className="absolute bottom-[35%] left-[25%] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] pointer-events-none -rotate-[30deg] opacity-25" style={{ borderBottomColor: fut.textColor }} />

                            {/* Inner Gold border frame following the path shape */}
                            <div 
                                className="absolute inset-[6px] border border-white/20 pointer-events-none z-10"
                                style={{ clipPath: "polygon(0% 15%, 8% 13%, 12% 9%, 20% 5%, 50% 0%, 80% 5%, 88% 9%, 92% 13%, 100% 15%, 100% 85%, 50% 100%, 0% 85%)" }}
                            />

                            {/* FUT Shield Rank Badge */}
                            <div className={cn(
                                "absolute top-5 left-5 h-6 w-6 rounded-full flex items-center justify-center font-serif font-black text-xs shadow-md z-20 border border-white/10",
                                position === 1 ? "bg-kuma-gold text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]" :
                                position === 2 ? "bg-zinc-300 text-black" :
                                position === 3 ? "bg-amber-700 text-white" : "bg-zinc-800 text-zinc-300"
                            )}>
                                {position}
                            </div>

                            {/* Upper half details: Rating / Position / Belt & Player Portrait */}
                            <div className="flex justify-between items-start h-[48%] relative z-10">
                                
                                {/* FUT Player Attributes Panel */}
                                <div className="flex flex-col items-center pl-5 pt-1 text-center select-none shrink-0" style={{ color: fut.textColor }}>
                                    {/* OVR Rating */}
                                    <div className={cn(
                                        "text-[46px] font-serif font-black tracking-normal leading-none mb-2.5 px-1 filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-105",
                                        ovr >= 75 ? "text-[#fde047]" : ovr >= 65 ? "text-white" : "text-[#fb923c]"
                                    )}>
                                        {ovr}
                                    </div>
                                    
                                    {/* Spec position abbreviation */}
                                    <div className="text-[12px] font-black tracking-wider leading-none mb-1.5 text-inherit">
                                        {(athlete?.athleteProfile?.specialization || "Ambos") === "Kata" ? "KA" : 
                                         (athlete?.athleteProfile?.specialization || "Ambos") === "Kumite" ? "KU" : "KA/KU"}
                                    </div>
                                    
                                    <div className="h-[1.5px] w-6 bg-current opacity-60 mb-1.5" />
                                    
                                    {/* Visual Belt preview */}
                                    <div className="flex flex-col items-center gap-1.5 mb-1.5 shrink-0 select-none">
                                        <MartialArtsBeltIcon className="w-4.5 h-4.5" color={getBeltColor(beltRank).hex} />
                                        <BeltSquare beltRank={beltRank} className="w-5 h-5 shadow-md border border-white/25 rounded-md" />
                                    </div>
                                    
                                    <div className="h-[1.5px] w-6 bg-current opacity-60 mb-1.5" />
                                    
                                    {/* Mini Trophy Emblem */}
                                    <Trophy className="w-3.5 h-3.5" style={{ color: 'inherit' }} />
                                </div>

                                 {/* Centered player portrait standard bezel frame */}
                                <div className="absolute right-4 top-0 bottom-0 left-[35%] flex items-center justify-center z-10">
                                    <div className={cn(
                                        "w-[94px] h-[94px] rounded-full overflow-hidden border-2 bg-zinc-950 flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-[1.05] relative",
                                        isFirst ? "border-kuma-gold shadow-kuma-gold/15" :
                                        position === 2 ? "border-zinc-300 shadow-white/5" : "border-amber-700 shadow-amber-900/10"
                                    )}>
                                        {athlete.image ? (
                                            <img 
                                                src={athlete.image} 
                                                alt={athlete.name} 
                                                className="w-full h-full object-cover object-center" 
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-3xl font-black text-zinc-700 bg-zinc-900 select-none">
                                                {athlete.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Middle Glass Nameplate Banner */}
                            <div className="mt-3 py-1.5 text-center relative z-20 select-none">
                                <div className="absolute inset-y-0 inset-x-[-20px] bg-white/[0.04] backdrop-blur-[1px] border-y border-white/10" />
                                <h3 className="relative z-10 text-[13px] font-serif font-black text-white uppercase tracking-[0.15em] truncate drop-shadow-md py-0.5 px-3">
                                    {displayFirstName} <span style={{ color: fut.textColor }}>{displayLastName}</span>
                                </h3>
                            </div>

                            {/* FIFA FUT STATS PANEL */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-[10px] font-bold text-zinc-200 max-w-[190px] mx-auto select-none pt-3.5 pb-8 relative z-20">
                                {/* Left Column */}
                                <div className="flex flex-col gap-1 pr-3.5 border-r border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[11px] drop-shadow">{athlete.athleteProfile.stats.vel}</span>
                                        <span className="text-white/60 uppercase tracking-widest text-[8px]">VEL</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[11px] drop-shadow">{athlete.athleteProfile.stats.tec}</span>
                                        <span className="text-white/60 uppercase tracking-widest text-[8px]">TEC</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[11px] drop-shadow">{athlete.athleteProfile.stats.pot}</span>
                                        <span className="text-white/60 uppercase tracking-widest text-[8px]">POT</span>
                                    </div>
                                </div>
                                {/* Right Column */}
                                <div className="flex flex-col gap-1 pl-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[11px] drop-shadow">{athlete.athleteProfile.stats.res}</span>
                                        <span className="text-white/60 uppercase tracking-widest text-[8px]">RES</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-black text-[11px] drop-shadow">{athlete.athleteProfile.stats.esp}</span>
                                        <span className="text-white/60 uppercase tracking-widest text-[8px]">ESP</span>
                                    </div>
                                    <div className="flex justify-between items-center opacity-0 pointer-events-none">
                                        <span className="text-white font-black text-[11px] drop-shadow">0</span>
                                        <span className="text-white/60 uppercase tracking-widest text-[8px]">-</span>
                                    </div>
                                </div>
                            </div>

                            {/* Small Dojo Logo at Bottom */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center select-none pointer-events-none z-20">
                                <div className="w-7 h-7 rounded-full border border-white/30 overflow-hidden shadow-lg filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                                    <img 
                                        src="/images/kuma-logo.jpg" 
                                        alt="Kuma Dojo" 
                                        className="w-full h-full object-cover scale-105" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SELF IMAGE EDIT LINK */}
            {currentUser?.email && athlete.email && athlete.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim() && (
                <button
                    onClick={() => onEditPhoto(athlete)}
                    className="mt-2 text-[9px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors duration-200 flex items-center gap-1.5 justify-center mx-auto"
                >
                    <Camera className="w-3.5 h-3.5" /> Editar mi Foto
                </button>
            )}
        </motion.div>
    );
}

interface AthletePhotoEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    athlete: any;
    onSuccess: () => void;
}

export function AthletePhotoEditModal({ isOpen, onClose, athlete, onSuccess }: AthletePhotoEditModalProps) {
    const [step, setStep] = useState<"verify" | "upload">("verify");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep("verify");
            setEmail("");
            setImage(athlete?.image || "");
            setError("");
            setSuccess(false);
        }
    }, [isOpen, athlete]);

    if (!isOpen || !athlete) return null;

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsVerifying(true);

        const athleteEmail = (athlete.email || "").toLowerCase().trim();
        const enteredEmail = email.toLowerCase().trim();

        // Delay slightly for premium realistic feel
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (athleteEmail === enteredEmail) {
            setStep("upload");
        } else {
            setError("El correo no coincide con el registrado en esta tarjeta.");
        }
        setIsVerifying(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError("La imagen es demasiado grande. Máximo 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
            setError("");
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSaving(true);

        try {
            const res = await updateAthletePhotoSelf(athlete._id, email, image);
            if (res.success) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                setError(res.error || "Ocurrió un error al actualizar la foto.");
            }
        } catch (err) {
            setError("Error de conexión al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md overflow-hidden bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-6"
                >
                    {/* Background glows */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                <Lock className="w-3 h-3" /> Autogestión de Tarjeta
                            </span>
                            <h3 className="text-xl font-bold text-white tracking-tight">
                                {step === "verify" ? "Validar Correo" : "Actualizar Foto"}
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1">
                                {athlete.name}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-all duration-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-500 mb-4 animate-bounce">
                                <Check className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-bold text-white">¡Tarjeta Actualizada!</h4>
                            <p className="text-xs text-zinc-400 mt-1">Tu nueva foto se ha guardado exitosamente.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {error && (
                                <div className="text-xs font-semibold text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg p-3">
                                    {error}
                                </div>
                            )}

                            {step === "verify" ? (
                                <form onSubmit={handleVerify} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            Correo Electrónico Registrado
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="ejemplo@kumadojo.com"
                                            className="w-full bg-zinc-900/60 border border-white/10 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-red-500 transition-colors duration-200"
                                        />
                                        <p className="text-[9px] text-zinc-500 italic mt-1">
                                            * Por seguridad, debes ingresar exactamente el correo con el que fuiste registrado en el Dojo.
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        loading={isVerifying}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 text-xs font-black uppercase tracking-wider"
                                    >
                                        Validar Correo
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="flex flex-col items-center justify-center py-4 bg-zinc-900/30 rounded-xl border border-white/5">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-zinc-950 relative flex items-center justify-center shadow-lg group">
                                            {image ? (
                                                <img 
                                                    src={image} 
                                                    alt="Vista previa" 
                                                    className="w-full h-full object-cover scale-105" 
                                                />
                                            ) : (
                                                <div className="text-zinc-600 text-xs font-bold uppercase">Sin Foto</div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById("self-file-upload")?.click()}
                                            className="mt-4 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all duration-200"
                                        >
                                            <Camera className="w-3.5 h-3.5" /> Cambiar Imagen
                                        </button>
                                        <input
                                            id="self-file-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>

                                    <div className="text-[9px] text-zinc-500 text-center leading-relaxed">
                                        ⚠️ Solo se permite actualizar tu retrato oficial. <br />
                                        Tus estadísticas, cinturón y detalles deportivos se encuentran bajo custodia de la Dirección Técnica del Dojo.
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep("verify")}
                                            className="w-1/3 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-400 rounded-xl text-xs font-black uppercase tracking-wider py-3"
                                        >
                                            Atrás
                                        </button>
                                        <Button
                                            type="submit"
                                            loading={isSaving}
                                            className="w-2/3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider py-3"
                                        >
                                            Guardar Foto
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function CelebrationCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        let canvasWidth = window.innerWidth;
        let canvasHeight = window.innerHeight;

        const resizeCanvas = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvasWidth = canvas.width;
                canvasHeight = canvas.height;
            }
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        class Particle {
            x: number;
            y: number;
            size: number;
            color: string;
            speedX: number;
            speedY: number;
            rotation: number;
            rotationSpeed: number;
            type: "confetti" | "sparkle" | "petal";
            opacity: number;

            constructor() {
                this.x = Math.random() * canvasWidth;
                this.y = Math.random() * -100 - 20;
                this.size = Math.random() * 8 + 4;
                
                const colors = [
                    "#fde047", // Kuma Gold
                    "#dc2626", // Kuma Red
                    "#ffffff", // White
                    "#fb923c", // Orange
                    "#a7f3d0", // Emerald light
                    "#f472b6"  // Pink
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                
                this.speedX = Math.random() * 4 - 2;
                this.speedY = Math.random() * 3 + 2;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 4 - 2;
                this.opacity = Math.random() * 0.5 + 0.5;

                const types: ("confetti" | "sparkle" | "petal")[] = ["confetti", "sparkle", "petal"];
                this.type = types[Math.floor(Math.random() * types.length)];
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotationSpeed;

                if (this.y > canvasHeight) {
                    this.y = Math.random() * -100 - 20;
                    this.x = Math.random() * canvasWidth;
                    this.speedY = Math.random() * 3 + 2;
                }
            }

            draw(c: CanvasRenderingContext2D) {
                c.save();
                c.translate(this.x, this.y);
                c.rotate((this.rotation * Math.PI) / 180);
                c.globalAlpha = this.opacity;
                c.fillStyle = this.color;

                if (this.type === "confetti") {
                    c.fillRect(-this.size / 2, -this.size, this.size, this.size * 2);
                } else if (this.type === "sparkle") {
                    c.beginPath();
                    c.moveTo(0, -this.size);
                    c.lineTo(this.size / 3, -this.size / 3);
                    c.lineTo(this.size, 0);
                    c.lineTo(this.size / 3, this.size / 3);
                    c.lineTo(0, this.size);
                    c.lineTo(-this.size / 3, this.size / 3);
                    c.lineTo(-this.size, 0);
                    c.lineTo(-this.size / 3, -this.size / 3);
                    c.closePath();
                    c.fill();
                } else {
                    c.beginPath();
                    c.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    c.fill();
                }
                c.restore();
            }
        }

        const particles: Particle[] = [];
        for (let i = 0; i < 110; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            particles.forEach((p) => {
                p.update();
                p.draw(ctx);
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ mixBlendMode: "screen" }}
        />
    );
}

interface KumaCelebrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    athlete: Athlete | null;
}

const getKumaHonorDetails = (ath: Athlete) => {
    const spec = ath?.athleteProfile?.specialization || "Ambos";
    const stats = ath?.athleteProfile?.stats || { vel: 50, pot: 50, tec: 50, res: 50, esp: 50, ovr: 50 };
    const belt = (ath?.athleteProfile?.beltRank || "Blanco").toLowerCase();
    const ovr = stats.ovr || 50;

    // Custom overrides for specific athletes
    if (ath.name.toLowerCase().includes("kristel")) {
        return {
            badge: "🐍 CC : MAMBA NEGRA",
            desc: "Una competidora de agilidad excepcional y precisión técnica implacable en el tatami. Su enfoque de combate y disciplina constante la convierten en un referente de superación marcial.",
            ability: "kisame Tzuki"
        };
    }

    if (ath.name.toLowerCase().includes("jimena") || ath.name.toLowerCase().includes("otoya")) {
        return {
            badge: "🦅 CC : MEME",
            desc: "Una competidora destacada por su velocidad de reacción y estrategia inteligente de combate en el tatami. Su letal patada lateral es un referente de precisión y control técnico.",
            ability: "Yoko Gueri"
        };
    }

    if (ovr >= 80) {
        return {
            badge: "🏆 KUMA SENPAI DE ÉLITE",
            desc: "Un exponente de perseverancia y maestría técnica. Su disciplina inspira a las nuevas generaciones del Dojo a superarse en cada entrenamiento bajo los valores tradicionales del Bushido.",
            ability: "Kiai Concentrado"
        };
    }
    if (belt.includes("negro")) {
        return {
            badge: "🥋 LEYENDA DEL BUDO",
            desc: "Portador de cinturón negro, reflejo del camino del Karate-Do. Destaca por su impecable etiqueta, precisión marcial y la búsqueda constante del perfeccionamiento del carácter.",
            ability: "Zanshin Absoluto"
        };
    }
    if (spec === "Kata") {
        return {
            badge: "✨ EXCELENCIA EN KATA",
            desc: "Su enfoque se centra en la belleza del movimiento, el ritmo dinámico y la alineación geométrica. Cada Kata ejecutado demuestra un alto nivel de concentración y control físico.",
            ability: "Embusen Perfecto"
        };
    }
    if (spec === "Kumite") {
        return {
            badge: "🥊 BALUARTE DE KUMITE",
            desc: "Especialista en combate, destaca por su excelente timing, distancia técnica impecable y un espíritu inquebrantable. Demuestra respeto absoluto en cada intercambio de técnicas.",
            ability: "Sen-no-sen"
        };
    }
    if (stats.vel >= 70) {
        return {
            badge: "⚡ VELOCIDAD EXPLOSIVA",
            desc: "Destaca por una explosividad y capacidad de anticipación extraordinarias. Su velocidad de ataque le permite ejecutar técnicas precisas y efectivas con gran agilidad.",
            ability: "Sun-dome Preciso"
        };
    }
    if (stats.pot >= 70) {
        return {
            badge: "💪 FUERZA Y KIME",
            desc: "Posee un dominio excepcional del Kime (fuerza de impacto concentrada). Su técnica logra canalizar la energía de todo el cuerpo con máxima firmeza y estabilidad.",
            ability: "Kime Devastador"
        };
    }
    return {
        badge: "🌱 PROMESA DEL KUMA DOJO",
        desc: "Practicante dedicado que avanza con constancia y humildad en el aprendizaje del Karate tradicional. Su gran espíritu y deseo de aprender son la base de su constante crecimiento.",
        ability: "Espíritu de Lucha"
    };
};

export function KumaCelebrationModal({ isOpen, onClose, athlete }: KumaCelebrationModalProps) {
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glossX: 50, glossY: 50, scale: 1 });

    if (!isOpen || !athlete) return null;

    const ovr = athlete?.athleteProfile?.stats?.ovr ?? 50;
    const nameParts = (athlete?.name || "").split(" ");
    const displayFirstName = nameParts[0] || "";
    const displayLastName = nameParts[1] || "";
    const beltRank = athlete?.athleteProfile?.beltRank ?? "Blanco";

    const getFUTStyles = (rating: number) => {
        if (rating >= 75) {
            return {
                bg: "bg-gradient-to-br from-amber-600 via-yellow-400 to-amber-950",
                borderClass: "from-yellow-300 via-amber-400 to-yellow-600",
                text: "text-amber-100",
                titleClass: "from-amber-200 to-yellow-300",
                textColor: "#fef08a",
                glowClass: "shadow-[0_25px_60px_rgba(212,175,55,0.45)]",
                lightColor: "rgba(251, 191, 36, 0.4)",
                diagonalStripe: "from-amber-950/40 via-yellow-500/20 to-amber-950/40"
            };
        } else if (rating >= 65) {
            return {
                bg: "bg-gradient-to-br from-zinc-700 via-slate-400 to-zinc-900",
                borderClass: "from-zinc-300 via-slate-300 to-zinc-500",
                text: "text-zinc-100",
                titleClass: "from-zinc-100 to-slate-200",
                textColor: "#e4e4e7",
                glowClass: "shadow-[0_25px_60px_rgba(255,255,255,0.15)]",
                lightColor: "rgba(255, 255, 255, 0.2)",
                diagonalStripe: "from-zinc-800/40 via-slate-400/20 to-zinc-800/40"
            };
        }
        return {
            bg: "bg-gradient-to-br from-amber-800 via-amber-700 to-amber-950",
            borderClass: "from-amber-700 via-amber-600 to-amber-900",
            text: "text-amber-200",
            titleClass: "from-amber-200 to-orange-300",
            textColor: "#fed7aa",
            glowClass: "shadow-[0_25px_60px_rgba(180,83,9,0.35)]",
            lightColor: "rgba(251, 191, 36, 0.2)",
            diagonalStripe: "from-amber-900/40 via-orange-400/20 to-amber-950/40"
        };
    };

    const getBeltStyles = (rank: string) => {
        const lowerRank = rank.toLowerCase();
        if (lowerRank.includes("negro")) return { border: "border-zinc-800", glow: "shadow-[0_0_20px_rgba(0,0,0,0.8)]", bg: "bg-zinc-950", text: "text-white" };
        if (lowerRank.includes("café") || lowerRank.includes("cafe")) return { border: "border-amber-800", glow: "shadow-[0_0_15px_rgba(146,64,14,0.4)]", bg: "bg-amber-900", text: "text-amber-100" };
        if (lowerRank.includes("azul")) return { border: "border-blue-500", glow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]", bg: "bg-blue-900", text: "text-blue-200" };
        if (lowerRank.includes("verde")) return { border: "border-emerald-500", glow: "shadow-[0_0_15px_rgba(16,185,129,0.4)]", bg: "bg-emerald-900", text: "text-emerald-200" };
        if (lowerRank.includes("naranja")) return { border: "border-orange-500", glow: "shadow-[0_0_15px_rgba(249,115,22,0.4)]", bg: "bg-orange-600", text: "text-orange-100" };
        if (lowerRank.includes("amarillo")) return { border: "border-yellow-500", glow: "shadow-[0_0_15px_rgba(234,179,8,0.4)]", bg: "bg-yellow-500", text: "text-zinc-900" };
        return { border: "border-zinc-300", glow: "shadow-[0_0_10px_rgba(255,255,255,0.2)]", bg: "bg-zinc-100", text: "text-zinc-800" };
    };

    const fut = getFUTStyles(ovr);
    const beltStyle = getBeltStyles(beltRank);
    const cardClipPath = "polygon(0% 15%, 8% 13%, 12% 9%, 20% 5%, 50% 0%, 80% 5%, 88% 9%, 92% 13%, 100% 15%, 100% 85%, 50% 100%, 0% 85%)";

    const humor = getKumaHonorDetails(athlete);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const box = card.getBoundingClientRect();
        const x = e.clientX - box.left - box.width / 2;
        const y = e.clientY - box.top - box.height / 2;
        const rotateX = -(y / (box.height / 2)) * 16;
        const rotateY = (x / (box.width / 2)) * 16;
        const glossX = ((e.clientX - box.left) / box.width) * 100;
        const glossY = ((e.clientY - box.top) / box.height) * 100;
        setTilt({ rotateX, rotateY, glossX, glossY, scale: 1.05 });
    };

    const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0, glossX: 50, glossY: 50, scale: 1 });
    };

    const floatingEmojis = ["🥋", "🏆", "🔥", "⚡", "🥋", "🥊", "🎉", "💥", "🏆", "🔥"];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden bg-black/95 backdrop-blur-2xl">
                
                <CelebrationCanvas />

                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    {floatingEmojis.map((emoji, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ 
                                y: "110vh", 
                                x: `${Math.random() * 90 + 5}vw`,
                                scale: Math.random() * 0.6 + 0.7,
                                rotate: Math.random() * 360,
                                opacity: 0 
                            }}
                            animate={{ 
                                y: "-20vh", 
                                rotate: Math.random() * 720 - 360,
                                opacity: [0, 0.8, 0.8, 0]
                            }}
                            transition={{ 
                                duration: Math.random() * 7 + 6,
                                delay: Math.random() * 3,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute text-3xl select-none"
                        >
                            {emoji}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="relative max-w-4xl w-full glass rounded-3xl border border-white/10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between z-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                    <div 
                        className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[100px] pointer-events-none opacity-40"
                        style={{ backgroundColor: fut.lightColor }}
                    />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-zinc-900 border border-white/5 hover:border-white/20 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all z-50 shadow-md"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-1/2">


                        <div
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className={cn(
                                "relative w-[280px] sm:w-[310px] aspect-[1/1.48] transition-all duration-300 ease-out select-none",
                                fut.glowClass
                            )}
                            style={{
                                transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.scale}, ${tilt.scale}, ${tilt.scale})`,
                                transformStyle: "preserve-3d",
                                clipPath: cardClipPath
                            }}
                        >
                            <div className={cn("absolute inset-0 bg-gradient-to-b", fut.borderClass)} style={{ clipPath: cardClipPath }} />

                            <div 
                                className="absolute inset-[7px] border border-white/25 pointer-events-none z-25"
                                style={{ clipPath: "polygon(0% 15%, 8% 13%, 12% 9%, 20% 5%, 50% 0%, 80% 5%, 88% 9%, 92% 13%, 100% 15%, 100% 85%, 50% 100%, 0% 85%)" }}
                            />

                            <div 
                                className="absolute inset-0 pointer-events-none z-30 mix-blend-color-dodge transition-opacity duration-300 opacity-80"
                                style={{
                                    backgroundImage: `radial-gradient(circle at ${tilt.glossX}% ${tilt.glossY}%, rgba(255, 255, 255, 0.35) 0%, transparent 55%)`,
                                    clipPath: cardClipPath
                                }}
                            />

                            <div className={cn("absolute inset-[3px] rounded-2xl overflow-hidden px-5 py-4", fut.bg)} style={{ clipPath: cardClipPath }}>
                                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
                                    <div className={cn("absolute inset-0 bg-gradient-to-br transform -skew-y-12 scale-150", fut.diagonalStripe)} />
                                </div>

                                <div className="flex justify-between items-start h-[48%] relative z-10">
                                    <div className="flex flex-col items-center pl-5 pt-2 text-center select-none shrink-0" style={{ color: fut.textColor }}>
                                        <div className={cn(
                                            "text-[52px] font-serif font-black tracking-normal leading-none mb-3 px-1 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.85)]",
                                            ovr >= 75 ? "text-[#fde047]" : ovr >= 65 ? "text-white" : "text-[#fb923c]"
                                        )}>
                                            {ovr}
                                        </div>
                                        
                                        <div className="text-[13px] font-black tracking-wider leading-none mb-2 text-inherit">
                                            {(athlete?.athleteProfile?.specialization || "Ambos") === "Kata" ? "KA" : 
                                             (athlete?.athleteProfile?.specialization || "Ambos") === "Kumite" ? "KU" : "KA/KU"}
                                        </div>
                                        
                                        <div className="h-[2px] w-8 bg-current opacity-60 mb-2" />
                                        
                                        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center border text-[9px] font-black shadow-lg", beltStyle.border, beltStyle.bg, beltStyle.text, beltStyle.glow)} title={beltRank}>
                                            <Award className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="w-[62%] h-full relative flex items-end justify-center pt-2 select-none">
                                        <div className="relative w-full h-[95%] overflow-hidden rounded-b-2xl flex items-end justify-center">
                                            {athlete.image ? (
                                                <img 
                                                    src={athlete.image} 
                                                    alt={athlete.name}
                                                    className="w-full h-full object-cover object-top filter contrast-[1.08] brightness-[1.04] drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
                                                    draggable={false}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center">
                                                    <UserIcon className="w-16 h-16 text-zinc-700/60" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-35 my-2 relative z-10" style={{ color: fut.textColor }} />

                                <div className="h-[46%] flex flex-col justify-between items-center relative z-10 pt-1">
                                    <div className="text-center w-full select-none">
                                        <p className={cn("text-[20px] font-serif font-black uppercase tracking-wide leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-gradient-to-b bg-clip-text text-transparent", fut.titleClass)}>
                                            {displayFirstName}
                                        </p>
                                        <p className={cn("text-[13px] font-sans font-extrabold uppercase tracking-[0.25em] leading-none mt-1 opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-gradient-to-b bg-clip-text text-transparent", fut.titleClass)}>
                                            {displayLastName}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-5 gap-y-1 w-full max-w-[210px] justify-center text-[11px] font-black uppercase tracking-wider select-none text-zinc-200 mt-2 px-2 filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-0.5">
                                            <span className="text-[9px] text-zinc-400 font-extrabold">VEL</span>
                                            <span className="font-black text-white">{athlete.athleteProfile.stats.vel}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-0.5">
                                            <span className="text-[9px] text-zinc-400 font-extrabold">TEC</span>
                                            <span className="font-black text-white">{athlete.athleteProfile.stats.tec}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-0.5">
                                            <span className="text-[9px] text-zinc-400 font-extrabold">POT</span>
                                            <span className="font-black text-white">{athlete.athleteProfile.stats.pot}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-0.5">
                                            <span className="text-[9px] text-zinc-400 font-extrabold">RES</span>
                                            <span className="font-black text-white">{athlete.athleteProfile.stats.res}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center mt-2 pb-2 select-none">
                                        <div className="w-8 h-8 rounded-full border border-white/85 shadow-[0_3px_8px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 bg-white">
                                            <img 
                                                src="/images/kuma-logo.jpg" 
                                                alt="Kuma Dojo" 
                                                className="w-full h-full object-cover scale-110"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left gap-6">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/35 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-3 animate-pulse">
                                <Award className="w-3.5 h-3.5" /> {humor.badge}
                            </div>

                            <h3 className="text-3xl font-serif font-black text-white leading-tight mb-2">
                                ¡Felicidades, <span className="text-kuma-gold">{athlete.name}</span>!
                            </h3>
                            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">
                                Rango Oficial de Combate del Dojo
                            </p>
                            
                            <div className="h-[2px] w-20 bg-red-600 mb-4 mx-auto md:mx-0" />
                        </div>

                        <div className="bg-zinc-950/40 border border-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-zinc-300 text-sm leading-relaxed max-w-md">
                            <p className="italic font-medium">
                                "{humor.desc}"
                            </p>
                            
                            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                                <span className="text-zinc-500 font-extrabold uppercase">Habilidad Secreta:</span>
                                <span className="text-kuma-gold font-black uppercase tracking-wider">{humor.ability}</span>
                            </div>
                        </div>



                        <div className="text-[10px] text-zinc-600 flex items-center gap-1.5 justify-center md:justify-start">
                            <Sparkles className="w-3.5 h-3.5 text-kuma-gold" />
                            <span>Presiona ESC o clic en la equis para cerrar</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
