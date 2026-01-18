"use client";
import React from "react";
import { NewsEditor } from "@/components/admin/NewsEditor";
import { Button } from "@/components/ui/Button";
import { Save } from "lucide-react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewPostPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/news" className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                        <ChevronLeft className="h-5 w-5 text-zinc-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Nueva Noticia</h1>
                        <p className="text-zinc-400 mt-1">Comparte tus conocimientos con el dojo.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="text-zinc-400">Descartar</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                        <Save className="h-4 w-4" />
                        Publicar
                    </Button>
                </div>
            </div>

            {/* Metadata Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <input
                        type="text"
                        placeholder="Título de la publicación"
                        className="w-full bg-transparent text-4xl font-bold text-white placeholder-zinc-600 outline-none border-b border-zinc-800 py-4 focus:border-red-600 transition-colors"
                        autoFocus
                    />
                    <NewsEditor />
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Categoría</label>
                        <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white outline-none focus:border-red-600">
                            <option>Noticias</option>
                            <option>Eventos</option>
                            <option>Entrenamiento</option>
                        </select>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Imagen de Portada</label>
                        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-red-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer">
                            <span className="text-zinc-500 text-sm">Click para subir imagen</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
