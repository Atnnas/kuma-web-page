"use client";

import { useState, useEffect } from "react";
import { getNews, deleteNewsItem } from "@/lib/actions/news";
import { NewsEditor } from "@/components/admin/NewsEditor";
import { INews } from "@/models/News";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Calendar, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { SwipeBackWrapper } from "@/components/admin/AdminNavigation";
import { AdminFloatingButton } from "@/components/admin/AdminFloatingButton";

export default function AdminNewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<INews> | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchNews = async () => {
        setIsLoading(true);
        const data = await getNews();
        setNews(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleCreate = () => {
        setEditingItem(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsEditorOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de que quieres eliminar esta noticia?")) {
            await deleteNewsItem(id);
            fetchNews();
        }
    };

    const handleSave = () => {
        setIsEditorOpen(false);
        setEditingItem(null);
        fetchNews();
    };

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SwipeBackWrapper>
            <div className="">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-black uppercase tracking-widest mb-2 text-kuma-gold drop-shadow-md">
                                Gestión de <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]">Noticias</span>
                            </h1>
                            <p className="text-zinc-400 text-sm md:text-base font-medium">
                                Crea, edita y elimina noticias del Kuma Dojo.
                            </p>
                        </div>

                    </div>

                    {!isEditorOpen && (
                        <AdminFloatingButton onClick={handleCreate} label="Nueva Noticia" />
                    )}

                    <AnimatePresence mode="wait">
                        {isEditorOpen ? (
                            <div key="editor">
                                <NewsEditor
                                    initialData={editingItem}
                                    onSave={handleSave}
                                    onCancel={() => setIsEditorOpen(false)}
                                />
                            </div>
                        ) : (
                            <div key="list" className="space-y-4 md:space-y-6">
                                {/* Search Bar */}
                                <div className="relative mb-8">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar noticias..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-4 pl-12 pr-6 text-white focus:border-red-500 focus:outline-none transition-colors"
                                    />
                                </div>

                                {isLoading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {filteredNews.map((item) => (
                                            <motion.div
                                                key={item._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="glass border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center hover:border-red-500/30 transition-all group backdrop-blur-md"
                                            >
                                                {/* Mobile Header: Image + Basic Info */}
                                                <div className="flex w-full md:w-auto gap-4 md:gap-6 items-center md:items-start">
                                                    <div className="relative h-20 w-20 md:h-20 md:w-32 rounded-lg overflow-hidden shrink-0 bg-zinc-800 border border-zinc-700 md:border-transparent">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1 md:hidden">
                                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${item.category === 'news' ? 'bg-blue-900/50 text-blue-400' :
                                                            item.category === 'event' ? 'bg-red-900/50 text-red-400' :
                                                                'bg-amber-900/50 text-amber-400'
                                                            }`}>
                                                            {item.category === 'news' ? 'Noticia' : item.category === 'event' ? 'Evento' : 'Entrenamiento'}
                                                        </span>
                                                        <h3 className="text-base font-bold text-white leading-tight line-clamp-2">{item.title}</h3>
                                                    </div>
                                                </div>


                                                {/* Content Desktop & Mobile Detailed */}
                                                <div className="flex-1 min-w-0 w-full">
                                                    <div className="hidden md:flex items-center gap-2 mb-1">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.category === 'news' ? 'bg-blue-900/50 text-blue-400' :
                                                            item.category === 'event' ? 'bg-red-900/50 text-red-400' :
                                                                'bg-amber-900/50 text-amber-400'
                                                            }`}>
                                                            {item.category === 'news' ? 'Noticia' : item.category === 'event' ? 'Evento' : 'Entrenamiento'}
                                                        </span>
                                                        <span className="text-zinc-500 text-xs flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(item.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="hidden md:block text-lg font-bold text-white truncate pr-4">{item.title}</h3>
                                                    <p className="text-zinc-500 text-sm line-clamp-2 md:truncate mt-1 md:mt-0">{item.description}</p>

                                                    <div className="md:hidden mt-2 flex items-center gap-2 text-xs text-zinc-500">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800">
                                                    <Button
                                                        onClick={() => handleEdit(item)}
                                                        className="flex-1 md:flex-none bg-zinc-800 hover:bg-white hover:text-black text-white text-xs"
                                                        size="sm"
                                                    >
                                                        <Pencil className="w-3 h-3 mr-2 md:mr-0" /> <span className="md:hidden">Editar</span>
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="flex-1 md:flex-none bg-red-900/30 text-red-500 hover:bg-red-600 hover:text-white border border-red-900/50 text-xs"
                                                        size="sm"
                                                    >
                                                        <Trash2 className="w-3 h-3 mr-2 md:mr-0" /> <span className="md:hidden">Eliminar</span>
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {filteredNews.length === 0 && (
                                            <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                                                <p className="text-zinc-500">No se encontraron noticias.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </SwipeBackWrapper>
    );
}
