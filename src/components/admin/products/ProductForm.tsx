"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, deleteProduct } from "@/lib/actions/products"; // Adjust imports
import { compressImage } from "@/lib/image-utils";
import { Upload, X, Save, Loader2, ArrowLeft, Trash2, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductFormProps {
    initialData?: any; // Product type
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
            price: Number(formData.get("price")),
            category: formData.get("category"),
            stock: Number(formData.get("stock")),
            images: images,
            isActive: isEdit ? initialData.isActive : true,
        };

        try {
            if (isEdit) {
                await updateProduct(initialData._id, data);
            } else {
                await createProduct(data);
            }
            router.push("/admin/shop");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error al guardar producto");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar este producto PERMANENTEMENTE? Esta acción no se puede deshacer.")) return;

        setLoading(true);
        try {
            await deleteProduct(initialData._id);
            router.push("/admin/shop");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error al eliminar producto");
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setLoading(true); // Block submit while processing
        const newImages: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const base64 = await compressImage(files[i]);
                newImages.push(base64);
            }
            setImages([...images, ...newImages]);
        } catch (error) {
            console.error("Image upload failed", error);
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <form id="product-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-32">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/shop"
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                        {isEdit ? "Editar Producto" : "Nuevo Producto"}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl space-y-4">
                        <h2 className="font-bold text-white uppercase text-sm tracking-wider mb-4 border-b border-white/5 pb-2">Información General</h2>

                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nombre del Producto</label>
                            <input
                                name="name"
                                defaultValue={initialData?.name}
                                required
                                className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:border-kuma-gold outline-none transition-colors"
                                placeholder="Ej: Karate Gi Heavyweight"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Precio (₡)</label>
                                <input
                                    name="price"
                                    type="number"
                                    min="0"
                                    defaultValue={initialData?.price}
                                    required
                                    className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:border-kuma-gold outline-none transition-colors"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Stock</label>
                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    defaultValue={initialData?.stock}
                                    required
                                    className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:border-kuma-gold outline-none transition-colors"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Categoría</label>
                            <select
                                name="category"
                                defaultValue={initialData?.category}
                                required
                                className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:border-kuma-gold outline-none transition-colors appearance-none"
                            >
                                <option value="" disabled>Seleccionar Categoría</option>
                                <option value="Equipo">Equipo</option>
                                <option value="Ropa">Ropa</option>
                                <option value="Suplementos">Suplementos</option>
                                <option value="Accesorios">Accesorios</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl">
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Descripción</label>
                        <textarea
                            name="description"
                            defaultValue={initialData?.description}
                            required
                            rows={6}
                            className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:border-kuma-gold outline-none transition-colors resize-none"
                            placeholder="Detalles del producto, tallas disponibles, materiales..."
                        />
                    </div>
                </div>

                {/* Right Column: Images */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl">
                        <h2 className="font-bold text-white uppercase text-sm tracking-wider mb-4 border-b border-white/5 pb-2">Galería</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square bg-zinc-800 rounded-lg overflow-hidden border border-white/10 group">
                                    <Image src={img} alt="Product" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform z-10 border-2 border-zinc-900"
                                        title="Eliminar imagen"
                                    >
                                        <Minus className="w-4 h-4 font-bold" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-zinc-500 hover:border-kuma-gold hover:text-kuma-gold hover:bg-white/5 transition-all cursor-pointer"
                        >
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-xs font-bold uppercase tracking-wider">Subir Fotos</span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                        <p className="text-[10px] text-zinc-600 mt-2 text-center text-balance">
                            Recomendado: Imágenes cuadradas, máx 2MB por foto.
                        </p>
                    </div>
                </div>
            </div>
            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
                {isEdit && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-800 text-red-500 border border-red-500/50 shadow-lg hover:bg-red-950 hover:border-red-500 flex items-center justify-center transition-all hover:scale-105"
                        title="Eliminar Producto"
                    >
                        <Trash2 className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                )}

                <button
                    type="submit"
                    form="product-form"
                    disabled={loading}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:bg-red-500 hover:scale-110 transition-all flex items-center justify-center"
                    title="Guardar Cambios"
                >
                    {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Save className="w-8 h-8" />}
                </button>
            </div>
        </form>
    );
}
