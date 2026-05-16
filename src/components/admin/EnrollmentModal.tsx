"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Search, User as UserIcon, Mail, Save, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface EnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    potentialUsers: any[];
    onEnrollExisting: (user: any) => void;
    onCreateAndEnroll: (userData: any) => Promise<void>;
}

export function EnrollmentModal({ isOpen, onClose, potentialUsers, onEnrollExisting, onCreateAndEnroll }: EnrollmentModalProps) {
    const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    
    // New User State
    const [newData, setNewData] = useState({
        name: "",
        email: "",
        role: "user"
    });

    const filteredUsers = potentialUsers
        .filter(u => !u.athleteProfile?.isEnrolled)
        .filter(u => 
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onCreateAndEnroll(newData);
        setIsSaving(false);
        setNewData({ name: "", email: "", role: "user" });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />
                    
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Header with Tabs */}
                        <div className="bg-zinc-900/50 border-b border-white/5">
                            <div className="p-6 flex items-center justify-between">
                                <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                                    <UserPlus className="w-6 h-6 text-kuma-gold" /> Inscripción Kuma
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="flex px-6 gap-8">
                                <button 
                                    onClick={() => setActiveTab("existing")}
                                    className={cn(
                                        "pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
                                        activeTab === "existing" ? "text-kuma-gold" : "text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    Importar desde Usuario
                                    {activeTab === "existing" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-kuma-gold" />}
                                </button>
                                <button 
                                    onClick={() => setActiveTab("new")}
                                    className={cn(
                                        "pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
                                        activeTab === "new" ? "text-red-500" : "text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    Crear desde Cero
                                    {activeTab === "new" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {activeTab === "existing" ? (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                                        <input 
                                            type="text"
                                            placeholder="Buscar usuario existente..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-kuma-gold/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map(user => (
                                                <button
                                                    key={user._id}
                                                    onClick={() => onEnrollExisting(user)}
                                                    className="w-full group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-kuma-gold/30 hover:bg-kuma-gold/5 transition-all"
                                                >
                                                    <div className="flex items-center gap-4 text-left">
                                                        <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-zinc-500">
                                                            {user.image ? <img src={user.image} className="w-full h-full object-cover rounded-full" /> : user.name?.[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white group-hover:text-kuma-gold transition-colors">{user.name}</p>
                                                            <p className="text-[10px] text-zinc-500 uppercase font-black">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-kuma-gold group-hover:translate-x-1 transition-all" />
                                                </button>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 opacity-50">
                                                <p className="text-sm">No se encontraron usuarios disponibles.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleCreateSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <UserIcon className="w-3 h-3" /> Nombre Completo
                                        </label>
                                        <input 
                                            type="text"
                                            required
                                            value={newData.name}
                                            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-white outline-none focus:border-red-500/50"
                                            placeholder="Ej: David Alfaro"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Mail className="w-3 h-3" /> Correo Electrónico
                                        </label>
                                        <input 
                                            type="email"
                                            required
                                            value={newData.email}
                                            onChange={(e) => setNewData({ ...newData, email: e.target.value })}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-white outline-none focus:border-red-500/50"
                                            placeholder="kuma@ejemplo.com"
                                        />
                                    </div>

                                    <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-2xl">
                                        <p className="text-[10px] text-red-400 font-bold leading-relaxed">
                                            * Al crear un Kuma desde cero, se le asignará una contraseña temporal y podrá completar su perfil al iniciar sesión.
                                        </p>
                                    </div>

                                    <Button 
                                        type="submit"
                                        loading={isSaving}
                                        className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-[0.2em]"
                                    >
                                        <Save className="w-5 h-5 mr-2" /> Crear e Inscribir
                                    </Button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
