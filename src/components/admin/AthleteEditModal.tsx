"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Shield, Ruler, Weight, Calendar, Phone, HeartPulse, Trophy, Zap, Target, Flame, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getDojos } from "@/lib/actions/dojos";

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile((prev: any) => ({
                    ...prev,
                    image: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Calculate OVR
        const s = profile.stats;
        const ovr = Math.round((s.vel + s.pot + s.tec + s.res + s.esp) / 5);
        
        await onSave(user._id, {
            ...profile,
            stats: { ...s, ovr }
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

    const ranks = [
        "Blanco",
        "Amarillo",
        "Naranja",
        "Verde",
        "Azul",
        "Morado",
        "Morado con línea",
        "Marrón III",
        "Marrón II",
        "Marrón I",
        "Negro - Shodan",
        "Negro - Nidan",
        "Negro - Sandan",
        "Negro - Yondan"
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full overflow-hidden bg-zinc-800 border border-white/10 relative">
                                    {profile.image ? (
                                        <img src={profile.image} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-lg font-black text-zinc-600 uppercase bg-zinc-950">
                                            {user.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight">{user.name}</h2>
                                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Inscripción de Atleta</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-8 custom-scrollbar">
                            
                            {/* Fotografía de la Karate Card */}
                            <div className="p-5 bg-zinc-900/40 border border-white/5 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shrink-0 group">
                                    {profile.image ? (
                                        <img src={profile.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700 font-bold text-xs uppercase">
                                            Sin Foto
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-200">
                                        <span className="text-[10px] text-white font-black uppercase tracking-wider">Subir</span>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange} 
                                            className="hidden" 
                                        />
                                    </label>
                                </div>
                                <div className="flex-1 space-y-3 w-full">
                                    <div>
                                        <h4 className="text-white text-xs font-black uppercase tracking-widest">Fotografía de la Karate Card</h4>
                                        <p className="text-zinc-500 text-[10px] uppercase tracking-wider mt-0.5">Sube una foto en primer plano del atleta para su carta FUT (se recomienda fondo neutro).</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <label className="flex items-center justify-center gap-2 bg-zinc-850 hover:bg-white hover:text-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg border border-white/5 cursor-pointer transition-all duration-300">
                                            <span>Seleccionar Archivo</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleImageChange} 
                                                className="hidden" 
                                            />
                                        </label>
                                        <div className="flex-1 relative">
                                            <input 
                                                type="text" 
                                                placeholder="O pega el URL de la imagen aquí..." 
                                                value={profile.image}
                                                onChange={(e) => setProfile({ ...profile, image: e.target.value })}
                                                className="w-full bg-zinc-950 border border-zinc-900 rounded-lg py-2 px-3 text-xs text-white focus:border-red-500 outline-none placeholder:text-zinc-700"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 1: Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-kuma-gold text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Datos Biométricos
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Peso (kg)</label>
                                            <div className="relative">
                                                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                                <input
                                                    type="number"
                                                    value={profile.weight}
                                                    onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-red-500 outline-none"
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
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-white focus:border-red-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            value={profile.birthDate?.split('T')[0] || ""}
                                            onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-4 text-white focus:border-red-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-red-500 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Shield className="w-4 h-4" /> Perfil Técnico
                                    </h3>
                                    
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cinturón / Rango</label>
                                            <div className="flex items-center gap-2 bg-zinc-900 px-2 py-0.5 rounded border border-white/5">
                                                <MartialArtsBeltIcon className="w-3.5 h-3.5" color={getBeltColor(profile.beltRank).hex} />
                                                <span className="text-[9px] uppercase font-bold text-zinc-400">Color:</span>
                                                <BeltSquare beltRank={profile.beltRank} className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <select
                                                value={profile.beltRank}
                                                onChange={(e) => setProfile({ ...profile, beltRank: e.target.value })}
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-4 pr-10 text-white focus:border-red-500 outline-none appearance-none cursor-pointer"
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
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs">▼</div>
                                        </div>
                                    </div>

                                    {/* Dojo Selector Segment */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Dojo de Procedencia</label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex-1">
                                                <select
                                                    value={profile.dojo}
                                                    onChange={(e) => {
                                                        setProfile({ ...profile, dojo: e.target.value });
                                                    }}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 px-4 pr-10 text-white focus:border-red-500 outline-none appearance-none cursor-pointer text-xs"
                                                >
                                                    {dojos.map((d, idx) => (
                                                        <option key={`${d._id}-${idx}`} value={d._id}>
                                                            🥋 {d.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs">▼</div>
                                            </div>

                                            {/* Selected Dojo Logo Preview on the right side */}
                                            <div className="w-10 h-10 rounded-full border border-white/10 bg-zinc-950 overflow-hidden shrink-0 flex items-center justify-center shadow-lg">
                                                {(() => {
                                                    const selectedDojo = dojos.find(d => d._id === profile.dojo);
                                                    const logoSrc = selectedDojo?.logo || "/images/kuma-logo.jpg";
                                                    return (
                                                        <img 
                                                            src={logoSrc} 
                                                            alt="Logo Dojo" 
                                                            className="w-full h-full object-cover scale-105" 
                                                        />
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Especialidad</label>
                                        <div className="flex gap-2">
                                            {["Kata", "Kumite", "Ambos"].map(spec => (
                                                <button
                                                    key={spec}
                                                    type="button"
                                                    onClick={() => setProfile({ ...profile, specialization: spec })}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${
                                                        profile.specialization === spec 
                                                        ? "bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]" 
                                                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600"
                                                    }`}
                                                >
                                                    {spec}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Conocido Como (CC)</label>
                                            <input
                                                type="text"
                                                value={profile.cc}
                                                onChange={(e) => setProfile({ ...profile, cc: e.target.value })}
                                                placeholder="Ej: 🐍 CC : MAMBA NEGRA"
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none placeholder:text-zinc-600 text-xs transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Habilidad Secreta</label>
                                            <input
                                                type="text"
                                                value={profile.habilidadSecreta}
                                                onChange={(e) => setProfile({ ...profile, habilidadSecreta: e.target.value })}
                                                placeholder="Ej: Kisame Zuki"
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none placeholder:text-zinc-600 text-xs transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Contact & Medical */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                <div className="space-y-4">
                                    <h3 className="text-blue-500 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Contacto
                                    </h3>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Teléfono Atleta</label>
                                        <input
                                            type="text"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-4 text-white focus:border-red-500 outline-none"
                                            placeholder="+506 ..."
                                        />
                                    </div>
                                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 space-y-3">
                                        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-50">Emergencia</p>
                                        <input
                                            type="text"
                                            placeholder="Nombre del contacto"
                                            value={profile.emergencyContact.name}
                                            onChange={(e) => setProfile({ ...profile, emergencyContact: { ...profile.emergencyContact, name: e.target.value } })}
                                            className="w-full bg-black/40 border border-white/5 rounded-lg py-2 px-4 text-white text-sm outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Teléfono"
                                            value={profile.emergencyContact.phone}
                                            onChange={(e) => setProfile({ ...profile, emergencyContact: { ...profile.emergencyContact, phone: e.target.value } })}
                                            className="w-full bg-black/40 border border-white/5 rounded-lg py-2 px-4 text-white text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-amber-500 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                        <HeartPulse className="w-4 h-4" /> Salud
                                    </h3>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Condiciones / Alergias</label>
                                        <textarea
                                            value={profile.medicalConditions}
                                            onChange={(e) => setProfile({ ...profile, medicalConditions: e.target.value })}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-4 text-white focus:border-red-500 outline-none h-32 resize-none"
                                            placeholder="Describa cualquier condición médica relevante..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: KARATE STATS (FIFA STYLE) */}
                            <div className="pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-white text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-kuma-gold" /> Calibración Karate Card
                                    </h3>
                                    <div className="bg-kuma-gold/10 border border-kuma-gold/50 px-4 py-1 rounded-full">
                                        <span className="text-kuma-gold font-black text-xl italic">OVR {Math.round((profile.stats.vel + profile.stats.pot + profile.stats.tec + profile.stats.res + profile.stats.esp) / 5)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    {[
                                        { key: "vel", label: "Velocidad", icon: <Zap className="w-4 h-4 text-blue-400" /> },
                                        { key: "pot", label: "Potencia", icon: <Activity className="w-4 h-4 text-red-500" /> },
                                        { key: "tec", label: "Técnica", icon: <Target className="w-4 h-4 text-amber-400" /> },
                                        { key: "res", label: "Resistencia", icon: <HeartPulse className="w-4 h-4 text-green-400" /> },
                                        { key: "esp", label: "Espíritu (Zanshin)", icon: <Flame className="w-4 h-4 text-purple-400" /> },
                                    ].map((stat) => (
                                        <div key={stat.key} className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    {stat.icon}
                                                    <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{stat.label}</label>
                                                </div>
                                                <span className="text-lg font-black text-white italic">{profile.stats[stat.key as keyof typeof profile.stats]}</span>
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
                            </div>

                        </form>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex justify-end gap-4">
                            <Button variant="ghost" onClick={onClose} disabled={isSaving}>
                                Cancelar
                            </Button>
                            <Button 
                                onClick={handleSubmit} 
                                loading={isSaving}
                                className="bg-red-600 hover:bg-red-700 text-white min-w-[150px]"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Perfil
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
