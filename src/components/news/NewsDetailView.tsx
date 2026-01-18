"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, ImageIcon, Play, Pause, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface NewsItem {
    id: string;
    title: string;
    description: string;
    image: string;
    images?: string[];
    category: string;
    date: string;
}

interface NewsDetailViewProps {
    newsItem: NewsItem;
}

export function NewsDetailView({ newsItem }: NewsDetailViewProps) {
    // Combine main image and gallery images for the carousel
    const allImages = [newsItem.image, ...(newsItem.images || [])].filter(Boolean);

    // Carousel State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [galleryIndex, setGalleryIndex] = useState(0); // For the gallery carousel
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Auto-play effect
    useEffect(() => {
        if (!isAutoPlaying || allImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, allImages.length]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const openLightbox = (img: string) => {
        setSelectedImage(img);
        setLightboxOpen(true);
        // Disable body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setSelectedImage(null);
        // Re-enable body scroll
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-20">
            {/* Hero Section (Carousel) */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={allImages[currentImageIndex]}
                            alt={newsItem.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end container mx-auto px-4 pb-12">
                    <Link href="/noticias" className="inline-flex items-center text-zinc-300 hover:text-white transition-colors mb-6 group w-fit relative z-10">
                        <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Volver a Noticias
                    </Link>

                    <div className="space-y-4 max-w-4xl relative z-10">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${newsItem.category === 'news' ? 'bg-blue-600' :
                                newsItem.category === 'event' ? 'bg-red-600' :
                                    'bg-amber-600'
                                } text-white shadow-lg`}>
                                {newsItem.category === 'news' ? 'Noticia' :
                                    newsItem.category === 'event' ? 'Evento' : 'Entrenamiento'}
                            </span>
                            <span className="flex items-center gap-2 text-zinc-300 font-medium bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                                <Calendar className="w-4 h-4 text-kuma-gold" />
                                <span className="capitalize">{formatDate(newsItem.date)}</span>
                            </span>

                            {/* Carousel Controls Indicator */}
                            {allImages.length > 1 && (
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 ml-auto md:ml-0">
                                    <div className="flex gap-1.5">
                                        {allImages.map((_, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === currentImageIndex ? 'w-6 bg-kuma-gold' : 'w-1.5 bg-white/30 hover:bg-white/60'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black font-serif uppercase leading-tight text-white drop-shadow-2xl">
                            {newsItem.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-10">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
                    {/* Main Text */}
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-zinc-300 prose-p:leading-relaxed prose-strong:text-white prose-a:text-red-500 hover:prose-a:text-red-400">
                        {newsItem.description.split('\n').map((paragraph: string, i: number) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>
                </div>

                {/* Gallery Section */}
                {allImages.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-1 w-12 bg-red-600 rounded-full" />
                            <h2 className="text-2xl font-serif font-black uppercase tracking-widest text-kuma-gold flex items-center gap-3">
                                <ImageIcon className="w-6 h-6" /> Galería de Fotos
                            </h2>
                        </div>

                        {/* Gallery Carousel */}
                        <div className="relative group/gallery">
                            {/* Navigation Buttons */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setGalleryIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-red-600/80 text-white p-3 rounded-full backdrop-blur-sm transition-all -ml-4 md:-ml-12 opacity-0 group-hover/gallery:opacity-100"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => setGalleryIndex((prev) => (prev + 1) % allImages.length)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-red-600/80 text-white p-3 rounded-full backdrop-blur-sm transition-all -mr-4 md:-mr-12 opacity-0 group-hover/gallery:opacity-100"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}

                            {/* Carousel Container */}
                            <div className="overflow-hidden rounded-xl border border-zinc-800 shadow-2xl relative aspect-video">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={galleryIndex}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.2}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipe = offset.x; // negative is left
                                            if (swipe < -50 || velocity.x < -100) {
                                                setGalleryIndex((prev) => (prev + 1) % allImages.length);
                                            } else if (swipe > 50 || velocity.x > 100) {
                                                setGalleryIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                                            }
                                        }}
                                        onClick={() => openLightbox(allImages[galleryIndex])}
                                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                                    >
                                        <Image
                                            src={allImages[galleryIndex]}
                                            alt={`Galería ${galleryIndex + 1}`}
                                            fill
                                            className="object-cover"
                                            draggable={false}
                                        />
                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 pointer-events-none">
                                            <ZoomIn className="w-12 h-12 text-white drop-shadow-lg" />
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Counter Widget */}
                                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 z-10 pointer-events-none">
                                    {galleryIndex + 1} / {allImages.length}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnails (Optional, simplified to dots for now or omitted to keep clean single view as requested) */}
                        {allImages.length > 1 && (
                            <div className="flex justify-center mt-6 gap-2">
                                {allImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setGalleryIndex(idx)}
                                        className={`h-1.5 rounded-full transition-all ${idx === galleryIndex ? 'w-8 bg-red-600' : 'w-2 bg-zinc-700 hover:bg-zinc-500'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeLightbox}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-10"
                    >
                        <Button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 h-auto mr-4 mt-2 z-50"
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        {/* Scrollable Container for Tall Images */}
                        <div
                            className="w-full h-full overflow-y-auto flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()} // Allow clicking inside to not close, but we want click anywhere to close? User requested scroll.
                        >
                            {/* Wrapper to allow scroll if image is taller than screen */}
                            <div className="relative w-full max-w-5xl my-auto">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedImage}
                                    alt="Full screen"
                                    className="w-full h-auto object-contain rounded-lg shadow-2xl"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
