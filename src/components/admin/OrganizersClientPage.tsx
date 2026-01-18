"use client";

import { useEffect, useState } from "react";
import { getOrganizers, createOrganizer, updateOrganizer, deleteOrganizer } from "@/lib/actions/organizers";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Briefcase, Loader2, Upload, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Organizer {
    _id: string;
    id: string;
    name: string;
    logo: string;
}

export default function OrganizersClientPage() {
    const [organizers, setOrganizers] = useState<Organizer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", logo: "" });
    const [isSaving, setIsSaving] = useState(false);

    const loadOrganizers = async () => {
        setIsLoading(true);
        const data = await getOrganizers();
        setOrganizers(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadOrganizers();
    }, []);

    const handlePrepareCreate = () => {
        setEditingId(null);
        setFormData({ name: "", logo: "" });
        setIsModalOpen(true);
    };

    const handlePrepareEdit = (org: Organizer) => {
        setEditingId(org.id);
        setFormData({ name: org.name, logo: org.logo });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Seguro que deseas eliminar este organizador?")) {
            await deleteOrganizer(id);
            loadOrganizers();
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingId) {
                await updateOrganizer(editingId, formData);
            } else {
                await createOrganizer(formData);
            }
            setIsModalOpen(false);
            loadOrganizers();
        } catch (error) {
            console.error("Error saving:", error);
            alert("Error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("El logo es demasiado grande (Máx 2MB)");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-4 md:p-12 md:pl-80 pt-8 min-h-screen text-white">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-serif font-black text-white uppercase tracking-widest drop-shadow-lg">
                        Organizadores
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Gestiona las entidades que realizan eventos.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={handlePrepareCreate}
                        className="bg-red-600 hover:bg-white hover:text-red-600 text-white font-bold uppercase tracking-widest shadow-lg transition-all"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Nuevo
                    </Button>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                </div>
            ) : organizers.length === 0 ? (
                <div className="text-center py-20 px-4 glass border border-white/5 rounded-3xl backdrop-blur-md">
                    <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Briefcase className="w-10 h-10 text-kuma-gold opacity-50" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">No hay organizadores</h3>
                    <p className="text-zinc-400 mb-6">Agrega uno manualmente o sincroniza desde los eventos existentes.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizers.map((org) => (
                        <div key={org.id} className="glass bg-zinc-900/40 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-red-500/30 transition-all group">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-zinc-700 shrink-0 bg-white/5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-white truncate">{org.name}</h3>
                                <p className="text-xs text-zinc-500">Organizador Registrado</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handlePrepareEdit(org)}
                                    className="p-2 text-zinc-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(org.id)}
                                    className="p-2 text-red-500/70 hover:text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Editor Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={handleSave}>
                                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                                    <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
                                        {editingId ? "Editar Organizador" : "Nuevo Organizador"}
                                    </h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nombre</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Logo</label>
                                        <div className="flex items-center gap-4">
                                            {formData.logo ? (
                                                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-zinc-700 shrink-0 bg-black">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, logo: "" }))}
                                                        className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-red-500 transition-opacity font-bold"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => document.getElementById('org-logo-upload')?.click()}
                                                    className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-700 hover:border-red-500 flex items-center justify-center cursor-pointer transition-colors bg-zinc-950"
                                                >
                                                    <Upload className="w-6 h-6 text-zinc-500" />
                                                </div>
                                            )}

                                            <div className="flex-1">
                                                <input
                                                    id="org-logo-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleLogoUpload}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => document.getElementById('org-logo-upload')?.click()}
                                                    className="w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-sm"
                                                >
                                                    {formData.logo ? "Cambiar Imagen" : "Subir Imagen"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-950/30">
                                    <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-transparent hover:bg-white/5 text-zinc-400">
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isSaving || !formData.logo || !formData.name} className="bg-red-600 hover:bg-red-700 text-white min-w-[120px]">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Guardar</>}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
