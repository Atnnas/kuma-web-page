"use client";

import { useState, useEffect } from "react";
import { getAllPotentialAthletes, updateAthleteProfile } from "@/lib/actions/athletes";
import { SwipeBackWrapper } from "@/components/admin/AdminNavigation";
import { AthleteEditModal, BeltSquare, MartialArtsBeltIcon, getBeltColor } from "@/components/admin/AthleteEditModal";
import { Button } from "@/components/ui/Button";
import { Loader2, Search, Trophy, UserPlus, Star, ChevronRight, Activity } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { AdminFloatingButton } from "@/components/admin/AdminFloatingButton";
import { EnrollmentModal } from "@/components/admin/EnrollmentModal";
import { Trash2, Plus } from "lucide-react";
import { createAndEnrollAthlete } from "@/lib/actions/athletes";
import { KumaCelebrationModal } from "@/components/sections/KumaRanking";

export default function AdminAthletesPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [celebratingAthlete, setCelebratingAthlete] = useState<any | null>(null);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [showOnlyEnrolled, setShowOnlyEnrolled] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        const data = await getAllPotentialAthletes();
        setUsers(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveAthlete = async (userId: string, profileData: any) => {
        const res = await updateAthleteProfile(userId, profileData);
        if (res.success) {
            setEditingUser(null);
            fetchData();
        } else {
            alert(res.error);
        }
    };

    const handleUnenroll = async (userId: string) => {
        if (confirm("¿Estás seguro de que quieres desvincular este atleta? Sus estadísticas se mantendrán pero no aparecerá en el ranking.")) {
            const res = await updateAthleteProfile(userId, { isEnrolled: false });
            if (res.success) fetchData();
        }
    };

    const handleEnrollExisting = (user: any) => {
        setIsEnrollModalOpen(false);
        setEditingUser(user);
    };

    const handleCreateAndEnroll = async (userData: any) => {
        const res = await createAndEnrollAthlete(userData);
        if (res.success) {
            setIsEnrollModalOpen(false);
            // Fetch updated list and open edit modal for the new user
            await fetchData();
            const newUser = users.find(u => u.email === userData.email.toLowerCase());
            // Note: users state might not be updated yet, so we'll just refresh and let the user click edit if they want, 
            // or find it in the freshly fetched data if possible.
            // For now, just closing and refreshing is safe.
        } else {
            alert(res.error);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = showOnlyEnrolled ? user.athleteProfile?.isEnrolled : true;
        return matchesSearch && matchesFilter;
    });

    return (
        <SwipeBackWrapper>
            <div className="max-w-7xl mx-auto py-8 px-4">
                
                {/* Standard Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-widest mb-1 text-kuma-gold drop-shadow-lg">
                            KUMA <span className="text-red-600">MANAGER</span>
                        </h1>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Inscripciones y Gestión de Karate Cards</p>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setShowOnlyEnrolled(!showOnlyEnrolled)}
                            className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                showOnlyEnrolled ? "bg-red-600 text-white border-red-500" : "bg-zinc-900 text-zinc-400 border-zinc-800"
                            )}
                        >
                            {showOnlyEnrolled ? "Ver Todos" : "Solo Inscritos"}
                        </Button>
                    </div>
                </div>

                <AdminFloatingButton 
                    onClick={() => setIsEnrollModalOpen(true)} 
                    label="Inscribir Kuma" 
                />

                {/* Search & Filter */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    <input
                        id="athlete-search"
                        type="text"
                        placeholder="Buscar Kuma por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-4 pl-12 pr-6 text-white focus:border-red-500 focus:outline-none transition-all shadow-xl"
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => {
                            const isEnrolled = user.athleteProfile?.isEnrolled;
                            const ovr = user.athleteProfile?.stats?.ovr || 0;
                            const beltRank = user.athleteProfile?.beltRank || "Blanco";
                            const specialization = user.athleteProfile?.specialization || "Kata";

                             // FUT Card theme matcher strictly based on Rating (OVR)
                             const getFUTStyles = (rating: number) => {
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
 
                             const fut = getFUTStyles(ovr);
                             const cardClipPath = "polygon(0% 15%, 8% 13%, 12% 9%, 20% 5%, 50% 0%, 80% 5%, 88% 9%, 92% 13%, 100% 15%, 100% 85%, 50% 100%, 0% 85%)";
                             const nameParts = user.name?.split(" ") || [""];
                             const displayFirstName = nameParts[0] || "";
                             const displayLastName = nameParts[1] || "";

                            return (
                                <motion.div 
                                    key={user._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center gap-4 bg-zinc-900/30 border border-white/5 rounded-3xl p-5 hover:border-zinc-800 transition-all duration-300 relative group"
                                >
                                    {/* FUT SHIELD CARD */}
                                    <div 
                                        onClick={() => {
                                            if (isEnrolled) {
                                                setCelebratingAthlete(user);
                                            }
                                        }}
                                        className={cn(
                                            "relative w-full max-w-[240px] aspect-[1/1.48] transition-all duration-500 group-hover:scale-[1.03] ease-out select-none",
                                            isEnrolled ? "cursor-pointer" : "cursor-default",
                                            fut.glowClass
                                        )}
                                        style={{
                                            clipPath: cardClipPath
                                        }}
                                    >
                                        {/* Click / Hover interactive guide */}
                                        {isEnrolled && (
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 z-30 flex items-center justify-center pointer-events-none">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/75 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-kuma-gold flex items-center gap-1 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                    🎉 Celebrar en 3D
                                                </div>
                                            </div>
                                        )}
                                        {/* 1. Outer Border / Bezel Frame */}
                                        <div 
                                            className={cn("absolute inset-0 bg-gradient-to-b", fut.borderClass)}
                                            style={{ clipPath: cardClipPath }}
                                        >
                                            {/* 2. Dark contrast divider space to separate frames */}
                                            <div 
                                                className="absolute inset-[2.2px] bg-[#0c0a09]"
                                                style={{ clipPath: cardClipPath }}
                                            >
                                                {/* 3. Main Inner Card Body */}
                                                <div 
                                                    className={cn(
                                                        "absolute inset-[2.5px] bg-gradient-to-b overflow-hidden flex flex-col pt-6 px-3",
                                                        fut.bgCard
                                                    )}
                                                    style={{
                                                        clipPath: cardClipPath,
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

                                                    {/* Floating metallic triangle particles (Only if enrolled) */}
                                                    {isEnrolled && (
                                                        <>
                                                            <div className="absolute bottom-[20%] left-[8%] w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[5px] pointer-events-none rotate-12 opacity-35" style={{ borderBottomColor: fut.textColor }} />
                                                            <div className="absolute bottom-[28%] right-[12%] w-0 h-0 border-l-[2.5px] border-l-transparent border-r-[2.5px] border-r-transparent border-b-[4px] pointer-events-none -rotate-12 opacity-30" style={{ borderBottomColor: fut.textColor }} />
                                                            <div className="absolute bottom-[12%] right-[22%] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] pointer-events-none rotate-45 opacity-25" style={{ borderBottomColor: fut.textColor }} />
                                                        </>
                                                    )}

                                                    {/* Inner border frame following the path shape */}
                                                    <div 
                                                        className="absolute inset-[5px] border border-white/15 pointer-events-none z-10"
                                                        style={{ clipPath: "polygon(0% 15%, 8% 13%, 12% 9%, 20% 5%, 50% 0%, 80% 5%, 88% 9%, 92% 13%, 100% 15%, 100% 85%, 50% 100%, 0% 85%)" }}
                                                    />

                                                    {/* Non-enrolled watermark banner */}
                                                    {!isEnrolled && (
                                                        <div className="absolute top-7 left-0 right-0 py-1 bg-red-950/60 border-y border-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-[0.25em] text-center z-20">
                                                            Sin Inscribir
                                                        </div>
                                                    )}

                                                    {/* Upper half details: Rating / Position / Belt & Player Portrait */}
                                                    <div className="flex justify-between items-start h-[48%] relative z-10">
                                                        
                                                        {/* FUT Player Attributes Panel */}
                                                        <div className="flex flex-col items-center pl-4 pt-1 text-center select-none shrink-0" style={{ color: fut.textColor }}>
                                                            {/* OVR Rating */}
                                                            <div className={cn(
                                                                "text-[38px] font-serif font-black tracking-normal leading-none mb-2 px-1 filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-105",
                                                                !isEnrolled ? "text-zinc-600" :
                                                                ovr >= 75 ? "text-[#fde047]" : ovr >= 65 ? "text-white" : "text-[#fb923c]"
                                                            )}>
                                                                {isEnrolled ? ovr : "--"}
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
                                                            
                                                            {/* Mini Trophy Emblem */}
                                                            <Trophy className="w-3 h-3" style={{ color: 'inherit' }} />
                                                        </div>

                                                         {/* Centered player portrait standard bezel frame */}
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
                                                        {/* Left Column */}
                                                        <div className="flex flex-col gap-0.5 pr-2.5 border-r border-white/10">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-white font-black text-[10px] drop-shadow">{isEnrolled ? user.athleteProfile.stats.vel : "--"}</span>
                                                                <span className="text-white/50 uppercase tracking-widest text-[7px]">VEL</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-white font-black text-[10px] drop-shadow">{isEnrolled ? user.athleteProfile.stats.tec : "--"}</span>
                                                                <span className="text-white/50 uppercase tracking-widest text-[7px]">TEC</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-white font-black text-[10px] drop-shadow">{isEnrolled ? user.athleteProfile.stats.pot : "--"}</span>
                                                                <span className="text-white/50 uppercase tracking-widest text-[7px]">POT</span>
                                                            </div>
                                                        </div>
                                                        {/* Right Column */}
                                                        <div className="flex flex-col gap-0.5 pl-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-white font-black text-[10px] drop-shadow">{isEnrolled ? user.athleteProfile.stats.res : "--"}</span>
                                                                <span className="text-white/50 uppercase tracking-widest text-[7px]">RES</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-white font-black text-[10px] drop-shadow">{isEnrolled ? user.athleteProfile.stats.esp : "--"}</span>
                                                                <span className="text-white/50 uppercase tracking-widest text-[7px]">ESP</span>
                                                            </div>
                                                            <div className="flex justify-between items-center opacity-0 pointer-events-none">
                                                                <span className="font-black text-[10px] drop-shadow">0</span>
                                                                <span className="text-white/50 uppercase tracking-widest text-[7px]">-</span>
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
                                            {isEnrolled && (
                                                <Button
                                                    onClick={() => handleUnenroll(user._id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 w-9 p-0 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                                                    title="Desvincular del Ranking"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => setEditingUser(user)}
                                                size="sm"
                                                className={cn(
                                                    "h-9 px-3 rounded-xl flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-all",
                                                    isEnrolled 
                                                    ? "bg-zinc-800 hover:bg-white hover:text-black text-white" 
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
                        })}
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

                {/* Edit Modal */}
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

            </div>
        </SwipeBackWrapper>
    );
}

