"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardCarouselProps {
    images: string[];
    name: string;
}

export function ProductCardCarousel({ images, name }: ProductCardCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // If no images, show placeholder handled by parent or here?
    // Parent handles logic "if images.length > 0".
    // So here images is guaranteed to have at least 1.

    const nextStep = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevStep = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Auto-play logic: runs every 3 seconds if not hovered
    useEffect(() => {
        if (images.length <= 1 || isHovered) return;

        const timer = setInterval(() => {
            nextStep();
        }, 3000);

        return () => clearInterval(timer);
    }, [images.length, isHovered, nextStep]);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if wrapped
        e.stopPropagation();
        nextStep();
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        prevStep();
    };

    if (images.length === 0) return null;

    return (
        <div
            className="relative w-full h-full group/carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Image
                src={images[currentIndex]}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                draggable={false}
            />

            {/* Navigation Arrows - Only if > 1 image */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover/carousel:opacity-100 transition-opacity z-20"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover/carousel:opacity-100 transition-opacity z-20"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${idx === currentIndex
                                    ? "bg-white w-4"
                                    : "bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
