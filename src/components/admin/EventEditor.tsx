"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { IEvent } from "@/models/Event";
import { Button } from "@/components/ui/Button";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { getRecentImages } from "@/lib/actions/news"; // Reuse this action
import { getOrganizers } from "@/lib/actions/organizers";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Type, Image as ImageIcon, Globe, User, Link as LinkIcon, Info, Loader2, Clock, Check, Upload, Minus } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import { format } from "date-fns";
import { createPortal } from "react-dom";

const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), { ssr: false });

interface EventEditorProps {
    initialData?: Partial<IEvent> | null;
    onSave: () => void;
    onCancel: () => void;
}

export function EventEditor({ initialData, onSave, onCancel }: EventEditorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false); // Controls the modal visibility
    const [selectingFor, setSelectingFor] = useState<"organizer" | "location">("organizer"); // Track what we are selecting for

    const [countries, setCountries] = useState<any[]>([]);
    const [isOpenCountry, setIsOpenCountry] = useState(false);

    useEffect(() => {
        const loadCountries = async () => {
            const { getCountries } = await import("@/lib/actions/countries");
            const data = await getCountries();
            setCountries(data);
        };
        loadCountries();
    }, []);
    const [recentImages, setRecentImages] = useState<string[]>([]);
    const [allOrganizers, setAllOrganizers] = useState<{ id: string, name: string, logo: string }[]>([]);
    const [formData, setFormData] = useState<Partial<IEvent>>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(new Date().setHours(9, 0, 0, 0)),
        endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(new Date().setHours(21, 0, 0, 0)),
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

    // Load organizers on mount
    useEffect(() => {
        getOrganizers().then(setAllOrganizers);
    }, []);

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
                        <div className="space-y-2 relative">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                PAÍS
                            </label>
                            {/* Country Selector - Searchable Combobox */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.location?.country}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            location: {
                                                ...prev.location!,
                                                country: val,
                                                // If user clears input, clear flag. If typing, keep flag until new selection or custom search found?
                                                // Actually, let's keep it simple: just text update. The dropdown handles the flag.
                                            }
                                        }));
                                        setIsOpenCountry(true);
                                    }}
                                    onFocus={() => setIsOpenCountry(true)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 pl-10 text-white focus:border-red-500 focus:outline-none transition-colors"
                                    placeholder="Buscar país..."
                                    required
                                />
                                <div className="absolute left-3 top-3.5 text-zinc-500">
                                    <Globe className="w-4 h-4" />
                                </div>

                                {formData.location?.flag && (
                                    <div className="absolute right-3 top-2.5 pointer-events-none">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={formData.location.flag} alt="Flag" className="h-6 w-auto rounded border border-zinc-700" />
                                    </div>
                                )}

                                {/* Dropdown List */}
                                {isOpenCountry && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsOpenCountry(false)}
                                        />
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar">
                                            {countries
                                                .filter(c => c.name.toLowerCase().includes((formData.location?.country || '').toLowerCase()))
                                                .map((country: any) => (
                                                    <div
                                                        key={country.name}
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                location: {
                                                                    ...prev.location!,
                                                                    country: country.name,
                                                                    flag: country.flag
                                                                }
                                                            }));
                                                            setIsOpenCountry(false);
                                                        }}
                                                        className="flex items-center gap-3 p-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800 last:border-0"
                                                    >
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={country.flag} alt={country.name} className="w-8 h-auto rounded shadow-sm" />
                                                        <span className="text-zinc-300">{country.name}</span>
                                                    </div>
                                                ))}
                                            {countries.length === 0 && (
                                                <div className="p-4 text-center text-zinc-500 text-sm">Cargando países...</div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
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

                            {/* Organizer Selector - Custom Dropdown with Images */}
                            {allOrganizers.length > 0 && (
                                <div className="mb-4 relative">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">Cargar de Base de Datos:</label>

                                    {/* Trigger Button */}
                                    <div
                                        onClick={() => {
                                            // Close if already open, or open
                                            const dropdown = document.getElementById('organizer-dropdown');
                                            if (dropdown) dropdown.classList.toggle('hidden');
                                        }}
                                        className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-sm rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            {allOrganizers.find(o => o.name === formData.organizer?.name) ? (
                                                <>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={allOrganizers.find(o => o.name === formData.organizer?.name)?.logo}
                                                        alt="Logo"
                                                        className="w-5 h-5 rounded-full object-cover border border-zinc-700"
                                                    />
                                                    {formData.organizer?.name}
                                                </>
                                            ) : (
                                                "Seleccionar de la lista..."
                                            )}
                                        </span>
                                        <Minus className="w-4 h-4 rotate-90 text-zinc-500" />
                                    </div>

                                    {/* Dropdown List */}
                                    <div
                                        id="organizer-dropdown"
                                        className="hidden absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar"
                                    >
                                        {allOrganizers.map(org => (
                                            <div
                                                key={org.id}
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        organizer: {
                                                            name: org.name,
                                                            logo: org.logo
                                                        }
                                                    }));
                                                    document.getElementById('organizer-dropdown')?.classList.add('hidden');
                                                }}
                                                className="flex items-center gap-3 p-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800 last:border-0 transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 group-hover:border-red-500 transition-colors shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-sm font-medium text-zinc-300 group-hover:text-white truncate">
                                                    {org.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Click Outside Listener (Simple version) */}
                                    <div
                                        className="fixed inset-0 z-10 hidden"
                                        id="dropdown-overlay"
                                        onClick={(e) => {
                                            const dropdown = document.getElementById('organizer-dropdown');
                                            if (dropdown && !dropdown.classList.contains('hidden')) {
                                                dropdown.classList.add('hidden');
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            <input
                                type="text"
                                value={formData.organizer?.name}
                                onChange={(e) => handleNestedChange("organizer", "name", e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                                required
                                placeholder="Nombre manual..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" /> Logo Organizador
                            </label>

                            {/* Logo Display & Selection Area */}
                            <div className="space-y-3">
                                {formData.organizer?.logo && (
                                    <div className="flex items-center gap-4 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-zinc-700 shrink-0 bg-white/5">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={formData.organizer.logo} alt="Logo" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-zinc-400 mb-2">Logo Actual</p>
                                            <Button
                                                type="button"
                                                onClick={() => handleNestedChange("organizer", "logo", "")}
                                                className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white h-8 text-xs w-full"
                                            >
                                                Eliminar Logo
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {!formData.organizer?.logo && (
                                    <div
                                        onClick={() => {
                                            setRecentImages([]); // Clear previous to show loading
                                            setShowMediaLibrary(true); // Open immediately
                                            getRecentImages().then(setRecentImages); // Fetch in background
                                        }}
                                        className="w-full h-24 border-2 border-dashed border-zinc-800 hover:border-red-600/50 bg-zinc-900/30 hover:bg-zinc-900 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all gap-2 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                                            <Upload className="w-4 h-4 text-zinc-400 group-hover:text-red-500" />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-wide">
                                            Subir o Elegir Logo
                                        </span>
                                    </div>
                                )}

                                {/* Hidden Input for New Uploads */}
                                <input
                                    id="event-logo-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 2 * 1024 * 1024) {
                                                alert("El logo es demasiado grande. Máximo 2MB.");
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                handleNestedChange("organizer", "logo", reader.result as string);
                                                setShowMediaLibrary(false);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>

                            {/* Media Library Modal - Portal to avoid Z-index/Transform traps */}
                            {showMediaLibrary && typeof document !== 'undefined' && createPortal(
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                                        onClick={() => setShowMediaLibrary(false)}
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9, y: 20 }}
                                            animate={{ scale: 1, y: 0 }}
                                            exit={{ scale: 0.9, y: 20 }}
                                            className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[70vh] overflow-hidden flex flex-col shadow-2xl relative"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4 text-kuma-gold" /> Elegir Logo del Historial
                                                </h3>
                                                <Button
                                                    onClick={() => setShowMediaLibrary(false)}
                                                    className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full p-1 h-8 w-8"
                                                >
                                                    <Minus className="w-4 h-4 rotate-45" />
                                                </Button>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                                    {/* Upload Option inside Portal */}
                                                    <div
                                                        onClick={() => {
                                                            setShowMediaLibrary(false);
                                                            // Small timeout to allow modal validation to clear before triggering file input
                                                            setTimeout(() => document.getElementById('event-logo-input')?.click(), 100);
                                                        }}
                                                        className="aspect-square rounded-lg border-2 border-dashed border-zinc-700 hover:border-red-600 bg-zinc-800/30 hover:bg-zinc-800 flex flex-col items-center justify-center cursor-pointer group transition-all"
                                                    >
                                                        <Upload className="w-6 h-6 text-zinc-500 group-hover:text-red-500 mb-1" />
                                                        <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase text-center leading-tight px-1">
                                                            Subir<br />Nuevo
                                                        </span>
                                                    </div>

                                                    {/* History Items */}
                                                    {recentImages.map((img, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => {
                                                                handleNestedChange("organizer", "logo", img);
                                                                setShowMediaLibrary(false);
                                                            }}
                                                            className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group cursor-pointer hover:border-kuma-gold transition-all bg-zinc-950"
                                                        >
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={img} alt="History" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                <Check className="w-6 h-6 text-kuma-gold" />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {recentImages.length === 0 && (
                                                        <div className="col-span-full py-8 flex flex-col items-center justify-center text-zinc-500 gap-2">
                                                            <Loader2 className="w-6 h-6 animate-spin text-zinc-700" />
                                                            <span className="text-xs italic">Cargando historial...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>,
                                document.body
                            )}
                            {/* End Portal */}
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
