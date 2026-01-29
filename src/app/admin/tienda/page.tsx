import { getProducts, toggleProductStatus, deleteProduct } from "@/lib/actions/products";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Eye, EyeOff, Package } from "lucide-react";
import { StoreFloatingButton } from "@/components/admin/products/StoreFloatingButton";

export const dynamic = "force-dynamic";

export default async function AdminStorePage() {
    const products = await getProducts("all");

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-xl">
                        Gestión de <span className="text-kuma-gold">Tienda</span>
                    </h1>
                    <p className="text-zinc-300 mt-2 text-base md:text-lg font-medium max-w-xl drop-shadow-md">
                        Administra el catálogo de productos, inventario y visibilidad de forma visual.
                    </p>
                </div>
            </div>

            <StoreFloatingButton />

            {/* Products Grid - Replaces Table for Mobile UX */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full py-24 bg-zinc-900/40 border border-white/10 rounded-3xl backdrop-blur flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
                            <Package className="w-12 h-12 text-zinc-400" />
                        </div>
                        <h2 className="text-3xl font-black uppercase text-zinc-300 mb-2">Sin Productos</h2>
                        <p className="text-zinc-400 font-medium text-lg max-w-sm">Tu inventario está vacío. Comienza agregando equipamiento o ropa.</p>
                    </div>
                ) : (products.map((product: any, index: number) => (
                    <div
                        key={product._id}
                        className={`group relative bg-zinc-900/80 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/50 hover:bg-zinc-800 hover:-translate-y-2
                        ${!product.isActive ? "border-red-900/30 grayscale-[0.8] hover:grayscale-0 opacity-90 hover:opacity-100" : "border-white/10 hover:border-white/30"}
                        `}
                    >
                        {/* Image Header */}
                        <div className="relative aspect-square w-full bg-zinc-950/50 overflow-hidden border-b border-white/10">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${!product.isActive ? "" : ""}`}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Package className="w-16 h-16 text-zinc-700" />
                                </div>
                            )}

                            {/* Floating Category Badge (Top Left) */}
                            <div className="absolute top-4 left-4 z-10">
                                <span className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest bg-black/80 backdrop-blur-md text-white border border-white/20 shadow-xl">
                                    {product.category}
                                </span>
                            </div>

                            {/* Status Toggle (Top Right) */}
                            <div className="absolute top-4 right-4 z-10">
                                <form action={async () => {
                                    "use server";
                                    await toggleProductStatus(product._id, !product.isActive);
                                }}>
                                    <button
                                        className={`backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-xl transition-all hover:scale-110 hover:rotate-12
                                        ${product.isActive
                                                ? "bg-green-600 text-white border-green-400 shadow-green-900/40"
                                                : "bg-red-600 text-white border-red-400 shadow-red-900/40"
                                            }`}
                                        title={product.isActive ? "Ocultar" : "Mostrar"}
                                    >
                                        {product.isActive ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 flex flex-col gap-6">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase leading-tight line-clamp-2 min-h-[4rem] flex items-center group-hover:text-blue-400 transition-colors drop-shadow-md">
                                    {product.name}
                                </h3>
                                <div className="flex items-end gap-3 mt-4 border-b border-white/10 pb-4">
                                    <p className="text-4xl font-mono text-kuma-gold tracking-tighter leading-none drop-shadow-sm">
                                        <span className="text-xl text-zinc-400 align-top mr-1 font-bold">₡</span>
                                        {product.price.toLocaleString()}
                                    </p>

                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-zinc-300 uppercase font-bold tracking-wider">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full shadow-lg ${product.stock > 5 ? "bg-green-500 shadow-green-500/50" : (product.stock > 0 ? "bg-yellow-500 shadow-yellow-500/50" : "bg-red-500 shadow-red-500/50 animate-pulse")}`} />
                                    <span>Stock: <span className="text-white text-base">{product.stock}</span></span>
                                </div>
                                {product.stock <= 5 && product.stock > 0 && (
                                    <span className="text-red-400 font-black animate-pulse bg-red-900/30 px-2 py-1 rounded">¡Bajo!</span>
                                )}
                                {product.stock === 0 && (
                                    <span className="text-red-500 font-black bg-red-900/20 px-2 py-1 rounded">Agotado</span>
                                )}
                            </div>

                            {/* Actions Footer - Big Buttons for Touch */}
                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <Link
                                    href={`/admin/tienda/${product._id}`}
                                    className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white hover:text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all border border-white/10 group-hover:border-white/30 active:scale-95 shadow-lg"
                                >
                                    <Pencil className="w-5 h-5" /> Editar
                                </Link>

                                <form action={async () => {
                                    "use server";
                                    await deleteProduct(product._id);
                                }} className="contents">
                                    <button
                                        className="flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 text-red-500 hover:text-red-400 border border-red-900/30 group-hover:border-red-500/50 py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all active:scale-95 shadow-lg"
                                    >
                                        <Trash2 className="w-5 h-5" /> Borrar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )))}
            </div>
        </div>
    );
}
