"use client";

import { useState } from "react";
import { INews } from "@/models/News";
import { Button } from "@/components/ui/Button";
import { createNewsItem, updateNewsItem } from "@/lib/actions/news";
import { DatePicker } from "@/components/ui/DatePicker";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, Image as ImageIcon, Type, AlignLeft, Layers, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { compressImage } from "@/lib/image-utils";

interface NewsEditorProps {
    initialData?: Partial<INews> | null;
    onSave: () => void;
    onCancel: () => void;
}

export function NewsEditor({ initialData, onSave, onCancel }: NewsEditorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<INews>>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        image: initialData?.image || "",
        category: initialData?.category || "news",
        date: initialData?.date ? new Date(initialData.date) : new Date(),
        isPremium: initialData?.isPremium || false,
        images: initialData?.images || [],
    });

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

                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Imagen Principal
                    </label>
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            const base64 = await compressImage(file);
                                            handleChange("image", base64);
                                        } catch (err) {
                                            console.error("Error converting image", err);
                                        }
                                    }
                                }}
                                className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                            />
                            <p className="text-[10px] text-zinc-500 mt-2">* Se comprimirá automáticamente para la web.</p>
                        </div>
                        {formData.image && (
                            <div className="relative h-24 w-40 rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Extra Images (Gallery) */}
                <div className="space-y-4 border-t border-zinc-800 pt-6">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                        </label>
                        <div>
                            <input
                                id="gallery-input"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={async (e) => {
                                    if (e.target.files) {
                                        const newImages = [...(formData.images || [])];
                                        for (let i = 0; i < e.target.files.length; i++) {
                                            const file = e.target.files[i];
                                            try {
                                                const base64 = await compressImage(file);
                                                newImages.push(base64);
                                            } catch (err) {
                                                console.error("Error compressing gallery image", err);
                                            }
                                        }
                                        setFormData(prev => ({ ...prev, images: newImages }));
                                    }
                                    // Reset input so same files can be selected again if added then deleted
                                    e.target.value = '';
                                }}
                            />
                            <Button
                                type="button"
                                onClick={() => document.getElementById('gallery-input')?.click()}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 h-10 w-10 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all duration-300 hover:scale-105"
                                title="Agregar imágenes desde archivo"
                            >
                                <Plus className="w-6 h-6 stroke-[3]" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images?.map((url, index) => (
                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`Gallery ${index}`} className="object-cover w-full h-full" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const newImages = [...(formData.images || [])];
                                            newImages.splice(index, 1);
                                            setFormData(prev => ({ ...prev, images: newImages }));
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full h-auto w-auto"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {(!formData.images || formData.images.length === 0) && (
                        <p className="text-zinc-600 text-xs italic">No hay imágenes en la galería.</p>
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
