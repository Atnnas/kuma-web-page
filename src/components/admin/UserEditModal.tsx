"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Shield, Mail, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onSave: (userId: string, data: { name: string; email: string; role: string; isActive: boolean }) => Promise<void>;
}

export function UserEditModal({ isOpen, onClose, user, onSave }: UserEditModalProps) {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [role, setRole] = useState(user?.role || "user");
    const [isActive, setIsActive] = useState(user?.isActive ?? true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(user._id, { name, email, role, isActive });
        setIsSaving(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl pointer-events-auto overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-zinc-900 bg-zinc-900/50">
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Editar Usuario</h3>
                                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                                        <UserIcon className="w-3 h-3" /> Nombre
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                                        <Mail className="w-3 h-3" /> Correo
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>

                                {/* Role */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                                        <Shield className="w-3 h-3" /> Rol / Permisos
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['user', 'editor', 'super_admin'].map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => setRole(option)}
                                                className={`py-3 px-2 rounded-lg text-xs font-bold uppercase transition-all border ${role === option
                                                    ? "bg-red-900/20 border-red-600 text-red-500"
                                                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                                    }`}
                                            >
                                                {option === 'super_admin' ? 'Admin' : option === 'user' ? 'Usuario' : 'Editor'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Status Toggle */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                                        <Shield className="w-3 h-3" /> Estado de Cuenta
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsActive(!isActive)}
                                        className={`w-full py-3 px-4 rounded-lg flex items-center justify-between border transition-all ${isActive
                                            ? "bg-green-900/20 border-green-600/50 text-green-400"
                                            : "bg-red-900/20 border-red-600/50 text-red-400"
                                            }`}
                                    >
                                        <span className="text-sm font-bold uppercase tracking-wider">
                                            {isActive ? "Activo (Permitir Acceso)" : "Inactivo (Bloquear Acceso)"}
                                        </span>
                                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isActive ? "bg-green-600" : "bg-red-600/50"}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isActive ? "translate-x-4" : "translate-x-0"}`} />
                                        </div>
                                    </button>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-red-600 hover:bg-white hover:text-black text-white font-bold"
                                        loading={isSaving}
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Guardar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

