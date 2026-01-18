"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Helper to format date for display
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).replace('.', ''); // Remove dot from month if present
};

interface NewsFeedProps {
    newsItems: any[]; // Using any for simplicity as I know the shape from getNews (plain objects)
}

export function NewsFeed({ newsItems }: NewsFeedProps) {
    const featuredNews = newsItems[0];
    const otherNews = newsItems.slice(1);

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-20">
            {/* Header / Title Section */}
            <div className="container mx-auto px-4 mb-16 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl xs:text-5xl md:text-7xl font-serif font-black uppercase tracking-widest mb-4 text-kuma-gold drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-tight"
                >
                    Noticias <span className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] whitespace-nowrap">Kuma</span>
                </motion.h1>
                <div className="h-1 w-24 bg-red-600 mx-auto rounded-full" />
                <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-lg">
                    Mantente al día con los últimos acontecimientos, torneos y entrenamientos de nuestro Dojo.
                </p>
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Featured News Item */}
                {featuredNews && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 mb-16 group"
                    >
                        <div className="relative h-[60vh] w-full">
                            <Image
                                src={featuredNews.image}
                                alt={featuredNews.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-4">
                                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${featuredNews.category === 'news' ? 'bg-blue-600/90' :
                                    featuredNews.category === 'event' ? 'bg-red-600/90' :
                                        'bg-amber-600/90'
                                    } text-white backdrop-blur-md`}>
                                    {featuredNews.category === 'news' ? 'Noticia' :
                                        featuredNews.category === 'event' ? 'Evento' : 'Entrenamiento'}
                                </span>
                                <span className="flex items-center gap-2 text-zinc-300 text-sm font-medium backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full">
                                    <Calendar className="w-4 h-4 text-red-500" />
                                    {formatDate(featuredNews.date)}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-4 drop-shadow-2xl">
                                {featuredNews.title}
                            </h2>
                            <p className="text-zinc-200 text-lg md:text-xl max-w-3xl mb-8 line-clamp-2">
                                {featuredNews.description}
                            </p>

                            <Link href={`/noticias/${featuredNews.slug}`}>
                                <Button className="bg-red-600 hover:bg-white hover:text-red-600 text-white rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                                    Leer Más <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* Grid of Other News */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherNews.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-900/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)] flex flex-col"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />

                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.category === 'news' ? 'bg-blue-600' :
                                        item.category === 'event' ? 'bg-red-600' :
                                            'bg-amber-600'
                                        } text-white shadow-lg`}>
                                        {item.category === 'news' ? 'Noticia' :
                                            item.category === 'event' ? 'Evento' : 'Entrenamiento'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase mb-3">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(item.date)}
                                </div>

                                <h3 className="text-xl font-bold uppercase text-white mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
                                    {item.title}
                                </h3>

                                <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-1">
                                    {item.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-zinc-800 flex justify-between items-center">
                                    <Link href={`/noticias/${item.slug}`} className="flex items-center gap-2 group/link w-full justify-between">
                                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover/link:text-white transition-colors">
                                            Leer Artículo
                                        </span>
                                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover/link:bg-red-600 group-hover/link:text-white transition-all duration-300 transform group-hover/link:rotate-45">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
