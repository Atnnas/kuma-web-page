"use client";

import { useState } from "react";
import { ProductCardCarousel } from "./ProductCardCarousel";
import { ShoppingBag } from "lucide-react";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
    isActive: boolean;
    slug: string;
}

interface StoreClientViewProps {
    initialProducts: Product[];
}

const CATEGORIES = ["Todos", "Equipo", "Ropa", "Suplementos", "Accesorios", "Otros"];

export function StoreClientView({ initialProducts }: StoreClientViewProps) {
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const filteredProducts = selectedCategory === "Todos"
        ? initialProducts
        : initialProducts.filter(p => p.category === selectedCategory);

    return (
        <div className="space-y-8">
            {/* Category Filter - Epic Horizontal Scroll */}
            <div className="flex overflow-x-auto py-8 gap-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center [&::-webkit-scrollbar]:hidden touch-pan-x snap-x">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`relative px-8 py-3 rounded-full text-xs md:text-sm font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-500 border snap-center ${selectedCategory === cat
                                ? "bg-gradient-to-r from-kuma-gold to-yellow-500 text-black border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.6)] scale-110 z-10 transform"
                                : "bg-zinc-900/40 backdrop-blur-md text-zinc-500 border-white/5 hover:border-kuma-gold/50 hover:text-kuma-gold hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:-translate-y-1"
                            }`}
                    >
                        {cat}
                        {/* Active Indicator Line */}
                        {selectedCategory === cat && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-black/40 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Products Grid/Reel */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/40 border border-white/5 rounded-3xl backdrop-blur animate-in fade-in zoom-in duration-500">
                    <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h2 className="text-2xl font-black uppercase text-zinc-500">Sin Resultados</h2>
                    <p className="text-zinc-600 mt-2">No hay productos en esta categoría.</p>
                </div>
            ) : (
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8 md:pb-0 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="group relative bg-zinc-900/40 border border-white/5 hover:border-white/10 rounded-3xl overflow-hidden hover:bg-zinc-800/60 transition-all duration-500 flex flex-col min-w-[85vw] md:min-w-0 shrink-0 snap-center animate-in fade-in slide-in-from-bottom-4 duration-700"
                        >
                            {/* Image Area */}
                            <div className="aspect-[4/5] relative overflow-hidden bg-zinc-800">
                                {product.images && product.images.length > 0 ? (
                                    <ProductCardCarousel images={product.images} name={product.name} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                        <span className="text-zinc-700 font-black uppercase text-4xl opacity-20">KUMA</span>
                                    </div>
                                )}

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 pointer-events-none">
                                    <span className="px-3 py-1 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                                        {product.category}
                                    </span>
                                </div>

                                {/* Stock Badge if low */}
                                {product.stock <= 5 && product.stock > 0 && (
                                    <div className="absolute top-4 right-4 animate-pulse pointer-events-none">
                                        <span className="px-3 py-1 bg-red-900/80 backdrop-blur text-red-200 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-500/30">
                                            ¡Pocas Unidades!
                                        </span>
                                    </div>
                                )}

                                {/* Out of Stock Overlay */}
                                {product.stock === 0 && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 backdrop-blur-[2px] pointer-events-none">
                                        <span className="px-4 py-2 border-2 border-white text-white font-black uppercase tracking-widest -rotate-12">
                                            Agotado
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white uppercase leading-tight mb-2 group-hover:text-kuma-gold transition-colors">
                                    {product.name}
                                </h3>

                                <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Precio</p>
                                        <p className="text-2xl font-black text-white">
                                            ₡{product.price.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Action (Static for now) */}
                                    <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors">
                                        <ShoppingBag className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
