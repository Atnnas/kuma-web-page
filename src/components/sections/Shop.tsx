"use client";
import React from "react";
import { ShoppingBag } from "lucide-react";

export function Shop() {
    return (
        <section id="tienda" className="py-24 bg-zinc-950 text-white border-t border-zinc-900">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-8">
                    Kuma <span className="text-red-700">Store</span>
                </h2>

                <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-zinc-700 mb-6" />
                    <h3 className="text-2xl font-bold text-zinc-500 mb-2">Próximamente</h3>
                    <p className="text-zinc-600 max-w-md mx-auto">
                        Estamos preparando una colección exclusiva de equipamiento y ropa oficial del Kuma Dojo.
                    </p>
                    <button disabled className="mt-8 px-8 py-3 bg-zinc-800 text-zinc-500 font-bold rounded-full cursor-not-allowed uppercase tracking-widest text-xs">
                        Catálogo en Construcción
                    </button>
                </div>
            </div>
        </section>
    );
}
