"use client";

import { useState } from "react";
import { INews } from "@/models/News";
import { Button } from "@/components/ui/Button";
import { createNewsItem, updateNewsItem } from "@/lib/actions/news";
import { DatePicker } from "@/components/ui/DatePicker";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, Image as ImageIcon, Type, AlignLeft, Layers, Loader2 } from "lucide-react";

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

                {/* Image URL */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> URL de Imagen
                    </label>
                    <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => handleChange("image", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="https://..."
                        required
                    />
                    {formData.image && (
                        <div className="relative h-40 w-full mt-4 rounded-lg overflow-hidden border border-zinc-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="object-cover w-full h-full"
                            />
                        </div>
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
