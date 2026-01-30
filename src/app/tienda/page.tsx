import { getProducts } from "@/lib/actions/products";
import Image from "next/image";
import Link from "next/link";
import { Lock, ShoppingBag, Info, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar"; // Assuming layout handles this globally, but sometimes page specific layout is used. usually layout.tsx handles navbar.
// Actually standard layout handles navbar. I just need page content.

export const dynamic = "force-dynamic";

export default async function StorePage() {
    const products = await getProducts("active");

    // Grouping for filters could be client-side, but for now simple grid.
    // Let's make a beautiful header and grid.

    return (
        <main className="min-h-screen bg-zinc-950 text-white pb-32">
            {/* HERO SECTION */}
            <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                {/* Background Video/Image Placeholder - defaulting to abstract gradient or noise */}
                <div className="absolute inset-0 bg-zinc-900">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-900/10 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10 text-center px-4">
                    <span className="block text-xs md:text-sm font-bold tracking-[0.5em] text-kuma-gold uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Equipamiento Oficial
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-[#6F4E37] drop-shadow-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                        Kuma Store
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#6F4E37] to-transparent mx-auto" />
                </div>
            </div>

            {/* CATALOG SECTION */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/40 border border-white/5 rounded-3xl backdrop-blur">
                        <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <h2 className="text-2xl font-black uppercase text-zinc-500">Próximamente</h2>
                        <p className="text-zinc-600 mt-2">Estamos preparando nuestro inventario.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {products.map((product: any, idx: number) => (
                            <div
                                key={product._id}
                                className="group relative bg-zinc-900/40 border border-white/5 hover:border-white/10 rounded-3xl overflow-hidden hover:bg-zinc-800/60 transition-all duration-500 flex flex-col"
                            >
                                {/* Image Area */}
                                <div className="aspect-[4/5] relative overflow-hidden bg-zinc-800">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                            <span className="text-zinc-700 font-black uppercase text-4xl opacity-20">KUMA</span>
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Stock Badge if low */}
                                    {product.stock <= 5 && product.stock > 0 && (
                                        <div className="absolute top-4 right-4 animate-pulse">
                                            <span className="px-3 py-1 bg-red-900/80 backdrop-blur text-red-200 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-500/30">
                                                ¡Pocas Unidades!
                                            </span>
                                        </div>
                                    )}

                                    {/* Out of Stock Overlay */}
                                    {product.stock === 0 && (
                                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 backdrop-blur-[2px]">
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
        </main>
    );
}
