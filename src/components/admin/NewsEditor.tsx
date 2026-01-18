"use client";

import { useState } from "react";
import { INews } from "@/models/News";
import { Button } from "@/components/ui/Button";
import { createNewsItem, updateNewsItem, getRecentImages } from "@/lib/actions/news";
import { DatePicker } from "@/components/ui/DatePicker";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Calendar, Image as ImageIcon, Type, AlignLeft, Layers, Loader2, Plus, Trash2, Upload, Minus } from "lucide-react";
import { compressImage } from "@/lib/image-utils";

interface NewsEditorProps {
    initialData?: Partial<INews> | null;
    onSave: () => void;
    onCancel: () => void;
}

export function NewsEditor({ initialData, onSave, onCancel }: NewsEditorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [recentImages, setRecentImages] = useState<string[]>([]);
    const [formData, setFormData] = useState<Partial<INews>>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        image: initialData?.image || "",
        category: initialData?.category || "news",
        date: initialData?.date ? new Date(initialData.date) : new Date(),
        isPremium: initialData?.isPremium || false,
        images: initialData?.images || [],
    });

    // Load recent images when picker opens
    const handleOpenPicker = async () => {
        const images = await getRecentImages();
        setRecentImages(images);
        setShowImagePicker(true);
    };

    const isEditing = !!initialData?._id;

    const handleChange = (field: keyof INews, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditing && initialData?._id) {
                await updateNewsItem(initialData._id as unknown as string, formData);
            } else {
                await createNewsItem(formData);
            }
            onSave();
        } catch (error) {
            console.error("Failed to save news", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border border-white/5 rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-xl"
        >
            <div className="mb-8 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-serif font-black text-kuma-gold uppercase tracking-widest mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {isEditing ? "Editar Noticia" : "Crear Nueva Noticia"}
                </h2>
                <p className="text-zinc-400 text-sm">
                    Complete los campos para publicar en el feed de noticias.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Type className="w-4 h-4" /> Título
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="Título de la noticia..."
                        required
                    />
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Categoría
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleChange("category", e.target.value as any)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors appearance-none"
                        >
                            <option value="news">Noticia</option>
                            <option value="event">Evento</option>
                            <option value="training">Entrenamiento</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Fecha
                        </label>
                        <DatePicker
                            date={formData.date instanceof Date ? formData.date : new Date(formData.date as any)}
                            setDate={(date) => handleChange("date", date)}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Unified Image Upload Area */}
                <div className="space-y-4">
                    <input
                        id="unified-image-input"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        multiple
                        className="hidden"
                        onChange={async (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                const newImages: string[] = [];

                                for (let i = 0; i < e.target.files.length; i++) {
                                    const file = e.target.files[i];
                                    try {
                                        const base64 = await compressImage(file);
                                        newImages.push(base64);
                                    } catch (err) {
                                        console.error("Error compressing image", err);
                                    }
                                }

                                let startIndex = 0;
                                if (!formData.image && newImages.length > 0) {
                                    handleChange("image", newImages[0]);
                                    startIndex = 1;
                                }

                                if (startIndex < newImages.length) {
                                    const additionalImages = newImages.slice(startIndex);
                                    setFormData(prev => ({
                                        ...prev,
                                        images: [...(prev.images || []), ...additionalImages]
                                    }));
                                }
                            }
                            e.target.value = '';
                        }}
                    />

                    {/* Modern Upload Trigger */}
                    <div
                        onClick={handleOpenPicker}
                        className="group w-full h-32 border-2 border-dashed border-zinc-800 hover:border-red-600/50 bg-zinc-900/50 hover:bg-zinc-900 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] gap-3"
                    >
                        <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300 shadow-xl">
                            <Upload className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                                Subir o Elegir del Historial
                            </p>
                            <p className="text-[10px] text-zinc-600 mt-1">
                                Click para ver opciones
                            </p>
                        </div>
                    </div>

                    {/* Image Picker Modal */}
                    <AnimatePresence>
                        {showImagePicker && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                                onClick={() => setShowImagePicker(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                                        <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5 text-kuma-gold" /> Biblioteca de Medios
                                        </h3>
                                        <Button
                                            onClick={() => setShowImagePicker(false)}
                                            className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full p-2 h-auto w-auto"
                                        >
                                            <Minus className="w-4 h-4 rotate-45" /> {/* Close Icon */}
                                        </Button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {/* Option 1: Upload New */}
                                            <div
                                                onClick={() => {
                                                    document.getElementById('unified-image-input')?.click();
                                                    setShowImagePicker(false);
                                                }}
                                                className="aspect-[4/3] rounded-xl border-2 border-dashed border-zinc-700 hover:border-red-600 bg-zinc-800/50 hover:bg-zinc-800 flex flex-col items-center justify-center cursor-pointer group transition-all"
                                            >
                                                <Upload className="w-8 h-8 text-zinc-500 group-hover:text-red-500 mb-2 transition-colors" />
                                                <span className="text-xs font-bold text-zinc-400 group-hover:text-white uppercase tracking-wider text-center">
                                                    Subir Nueva
                                                </span>
                                            </div>

                                            {/* History Options */}
                                            {recentImages.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        // Add to form logic
                                                        if (!formData.image) {
                                                            handleChange("image", img);
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                images: [...(prev.images || []), img]
                                                            }));
                                                        }
                                                        setShowImagePicker(false);
                                                    }}
                                                    className="relative aspect-[4/3] rounded-xl overflow-hidden border border-zinc-800 group cursor-pointer hover:border-kuma-gold transition-all"
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={img} alt="History" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <Plus className="w-8 h-8 text-kuma-gold" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {recentImages.length === 0 && (
                                            <div className="col-span-full py-8 text-center text-zinc-500 italic text-sm">
                                                No hay historial reciente. Sube imágenes para poblar esta lista.
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 text-center">
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                                            Mostrando las últimas 20 imágenes utilizadas
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Display Grid (Main Image + Gallery) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Main Image Card (Always visible with placeholder) */}
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-kuma-gold shadow-[0_0_10px_rgba(234,179,8,0.2)] group">
                            <div className="absolute top-2 left-2 z-10 bg-kuma-gold text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                PORTADA
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={formData.image || "/images/kuma-logo.jpg"}
                                alt="Main"
                                className={`object-cover w-full h-full ${!formData.image ? 'opacity-50 grayscale' : ''}`}
                            />

                            {/* Delete Button (Always Visible) */}
                            {formData.image && (
                                <button
                                    type="button"
                                    onClick={() => handleChange("image", "")}
                                    className="absolute top-2 right-2 z-20 bg-red-600 hover:bg-red-700 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md transition-transform hover:scale-110"
                                    title="Eliminar Portada"
                                >
                                    <Minus className="w-4 h-4 font-bold" />
                                </button>
                            )}

                            {!formData.image && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Sin Imagen</span>
                                </div>
                            )}
                        </div>

                        {/* Gallery Images */}
                        {formData.images?.map((url, index) => (
                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 group shadow-sm hover:shadow-md transition-shadow">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`Gallery ${index}`} className="object-cover w-full h-full" />

                                {/* Delete Button (Always Visible) */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newImages = [...(formData.images || [])];
                                        newImages.splice(index, 1);
                                        setFormData(prev => ({ ...prev, images: newImages }));
                                    }}
                                    className="absolute top-2 right-2 z-20 bg-red-600 hover:bg-red-700 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md transition-transform hover:scale-110"
                                    title="Eliminar Imagen"
                                >
                                    <Minus className="w-4 h-4 font-bold" />
                                </button>
                            </div>
                        ))}

                        {/* EPIC Add More Card (Always visible at the end) */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleOpenPicker}
                            className="relative aspect-video rounded-lg border-2 border-dashed border-zinc-700 hover:border-kuma-gold bg-zinc-900/30 hover:bg-zinc-900/80 flex flex-col items-center justify-center cursor-pointer group transition-colors shadow-lg hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                        >
                            <div className="bg-zinc-800 group-hover:bg-kuma-gold/20 text-zinc-500 group-hover:text-kuma-gold p-3 rounded-full transition-colors mb-2">
                                <Plus className="w-8 h-8" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 group-hover:text-kuma-gold uppercase tracking-widest transition-colors">
                                Agregar Más
                            </span>
                        </motion.div>
                    </div>
                    {(!formData.image && (!formData.images || formData.images.length === 0)) && (
                        <p className="text-zinc-600 text-xs italic text-center py-8">
                            Empieza subiendo tu foto de portada arriba ☝️
                        </p>
                    )}
                </div>


                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <AlignLeft className="w-4 h-4" /> Contenido
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="w-full h-64 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-300 focus:border-red-500 focus:outline-none transition-colors resize-none leading-relaxed"
                        placeholder="Escribe el contenido aquí..."
                        required
                    />
                </div>

                {/* Is Premium Toggle - Optional, can be added if needed, but keeping simple for now based on request */}

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-red-600 text-white hover:bg-red-700 font-bold tracking-wider"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                            </>
                        ) : (
                            isEditing ? "Actualizar Noticia" : "Publicar Noticia"
                        )}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}
