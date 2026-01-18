"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { feedItems } from "@/lib/mock-data";

export function Feed() {
    return (
        <section className="py-20 bg-zinc-950 relative z-10">
            <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white mb-4">
                    Últimas del <span className="text-red-600">Dojo</span>
                </h2>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                    Mantente al día con nuestras noticias, eventos y contenido exclusivo de entrenamiento.
                    <span className="text-red-500 font-semibold block mt-2">Los contenidos exclusivos requieren suscripción activa.</span>
                </p>
            </div>

            <BentoGrid className="max-w-6xl mx-auto px-4">
                {feedItems.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        header={null}
                        image={item.image}
                        link={`/post/${item.id}`} // Placeholder link
                        isPremium={item.isPremium}
                        className={item.className}
                    />
                ))}
            </BentoGrid>
        </section>
    );
}
