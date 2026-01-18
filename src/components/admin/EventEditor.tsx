"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { IEvent } from "@/models/Event";
import { Button } from "@/components/ui/Button";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { motion } from "framer-motion";
import { Calendar, MapPin, Type, Image as ImageIcon, Globe, User, Link as LinkIcon, Info, Loader2, Clock, Check } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import { format } from "date-fns";

const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), { ssr: false });

interface EventEditorProps {
    initialData?: Partial<IEvent> | null;
    onSave: () => void;
    onCancel: () => void;
}

export function EventEditor({ initialData, onSave, onCancel }: EventEditorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<IEvent>>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
        endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
        location: {
            country: initialData?.location?.country || "",
            address: initialData?.location?.address || "",
            image: initialData?.location?.image || "",
            mapLink: initialData?.location?.mapLink || "",
        },
        organizer: {
            name: initialData?.organizer?.name || "",
            logo: initialData?.organizer?.logo || "",
        },

        type: initialData?.type || "other",
        isPremium: initialData?.isPremium || false,
    });

    const isEditing = !!initialData?._id;

    // Helper for nested updates
    const handleNestedChange = (section: "location" | "organizer", field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section]!,
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditing && initialData?._id) {
                await updateEvent(initialData._id as unknown as string, formData);
            } else {
                await createEvent(formData);
            }
            onSave();
        } catch (error) {
            console.error("Failed to save event", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass border border-white/5 rounded-xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar backdrop-blur-xl"
        >
            <div className="mb-8 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-serif font-black text-kuma-gold uppercase tracking-widest mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {isEditing ? "Editar Evento" : "Crear Nuevo Evento"}
                </h2>
                <p className="text-zinc-400 text-sm">
                    Detalles completos del evento para el calendario oficial.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest border-b border-zinc-800 pb-2 mb-4">Información General</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Type className="w-3 h-3" /> Nombre del Evento
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Info className="w-3 h-3" /> Tipo de Evento
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                            >
                                <option value="tournament">Torneo</option>
                                <option value="seminar">Seminario</option>
                                <option value="exam">Examen</option>
                                <option value="camp">Campamento</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-300 focus:border-red-500 focus:outline-none transition-colors resize-none"
                            required
                        />
                    </div>
                </div>

                {/* Dates */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest border-b border-zinc-800 pb-2 mb-4">Fechas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Inicio
                            </label>
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-1">
                                    <DatePicker
                                        date={formData.startDate as Date}
                                        setDate={(date) => {
                                            if (!date) return;
                                            const newDate = new Date(formData.startDate as Date);
                                            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                                            setFormData(prev => ({ ...prev, startDate: newDate }));
                                        }}
                                        placeholder="Fecha Inicio"
                                        className="w-full"
                                    />
                                </div>
                                <div className="w-full md:w-32 relative">
                                    <input
                                        type="time"
                                        value={formData.startDate && !isNaN(new Date(formData.startDate).getTime()) ? format(new Date(formData.startDate), 'HH:mm') : "00:00"}
                                        onChange={(e) => {
                                            const [hours, minutes] = e.target.value.split(':').map(Number);
                                            const newDate = new Date(formData.startDate as Date);
                                            newDate.setHours(hours);
                                            newDate.setMinutes(minutes);
                                            setFormData(prev => ({ ...prev, startDate: newDate }));
                                        }}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors text-center"
                                    />
                                    <Clock className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Fin
                            </label>
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-1">
                                    <DatePicker
                                        date={formData.endDate as Date}
                                        setDate={(date) => {
                                            if (!date) return;
                                            const newDate = new Date(formData.endDate as Date);
                                            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                                            setFormData(prev => ({ ...prev, endDate: newDate }));
                                        }}
                                        placeholder="Fecha Fin"
                                        className="w-full"
                                    />
                                </div>
                                <div className="w-full md:w-32 relative">
                                    <input
                                        type="time"
                                        value={formData.endDate && !isNaN(new Date(formData.endDate).getTime()) ? format(new Date(formData.endDate), 'HH:mm') : "00:00"}
                                        onChange={(e) => {
                                            const [hours, minutes] = e.target.value.split(':').map(Number);
                                            const newDate = new Date(formData.endDate as Date);
                                            newDate.setHours(hours);
                                            newDate.setMinutes(minutes);
                                            setFormData(prev => ({ ...prev, endDate: newDate }));
                                        }}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors text-center"
                                    />
                                    <Clock className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest border-b border-zinc-800 pb-2 mb-4">Ubicación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Globe className="w-3 h-3" /> País
                            </label>
                            <input
                                type="text"
                                value={formData.location?.country}
                                onChange={(e) => handleNestedChange("location", "country", e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                                placeholder="Ej: Costa Rica"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> Dirección Exacta
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formData.location?.address}
                                    onChange={(e) => handleNestedChange("location", "address", e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                                    placeholder="Ej: Gimnasio Nacional, San José"
                                    required
                                />
                                <Button
                                    type="button"
                                    onClick={() => setIsMapOpen(true)}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 min-w-[50px] flex items-center justify-center transition-colors hover:text-white"
                                    title="Seleccionar en Mapa"
                                >
                                    <MapPin className="w-5 h-5 text-red-500" />
                                </Button>
                            </div>
                            {formData.location?.mapLink && (
                                <p className="text-[10px] text-green-500 flex items-center gap-1 font-bold uppercase tracking-wider mt-1 animate-pulse">
                                    <Check className="w-3 h-3" /> Ubicación Guardada
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Map Picker Modal */}
                    {isMapOpen && (
                        <MapPicker
                            searchQuery={`${formData.location?.address || ""} ${formData.location?.country || ""}`.trim()}
                            onConfirm={(link) => {
                                handleNestedChange("location", "mapLink", link);
                                setIsMapOpen(false);
                            }}
                            onCancel={() => setIsMapOpen(false)}
                        />
                    )}
                </div>

                {/* Organizer */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest border-b border-zinc-800 pb-2 mb-4">Organizador & Extras</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3" /> Nombre Organizador
                            </label>
                            <input
                                type="text"
                                value={formData.organizer?.name}
                                onChange={(e) => handleNestedChange("organizer", "name", e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" /> Logo Organizador
                            </label>
                            <div className="flex items-center gap-4">
                                {formData.organizer?.logo && (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-zinc-700 shrink-0 bg-white/5">
                                        <img src={formData.organizer.logo} alt="Logo" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleNestedChange("organizer", "logo", "")}
                                            className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-red-500 font-bold text-lg transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <label className="w-full flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 border-dashed rounded-lg p-3 text-zinc-400 cursor-pointer hover:border-red-500 hover:text-red-500 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    if (file.size > 2 * 1024 * 1024) { // 2MB limit
                                                        alert("El logo es demasiado grande. Máximo 2MB.");
                                                        return;
                                                    }
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        handleNestedChange("organizer", "logo", reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <span className="text-sm font-medium">Subir Logo (Max 2MB)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 pt-8">
                            <input
                                type="checkbox"
                                checked={formData.isPremium}
                                onChange={(e) => setFormData(prev => ({ ...prev, isPremium: e.target.checked }))}
                                className="w-5 h-5 rounded border-zinc-800 bg-zinc-950 text-red-600 focus:ring-red-500 focus:ring-offset-zinc-900"
                            />
                            <label className="text-sm font-bold text-zinc-300">
                                Marcar como Evento Premium (Destacado)
                            </label>
                        </div>
                    </div>
                </div>


                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-zinc-800">
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 px-6"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-red-600 text-white hover:bg-red-700 font-bold tracking-wider px-8"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                            </>
                        ) : (
                            isEditing ? "Guardar Cambios" : "Crear Evento"
                        )}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}
