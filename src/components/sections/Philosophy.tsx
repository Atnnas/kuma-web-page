"use client";
import React from "react";

export function Philosophy() {
    return (
        <section id="filosofia" className="py-24 bg-zinc-950 text-white relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-900 to-transparent opacity-50" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
                    Nuestra <span className="text-red-700">Filosofía</span>
                </h2>
                <p className="text-xl md:text-2xl font-serif italic text-zinc-400 leading-relaxed mb-8">
                    "No entrenamos para pelear, peleamos para entender quiénes somos."
                </p>
                <p className="text-zinc-500 leading-relaxed">
                    En Kuma Dojo, creemos que el verdadero camino del guerrero no está en la violencia, sino en el control.
                    Cada movimiento es una meditación, cada combate un espejo. Buscamos la perfección del carácter a través de la disciplina del cuerpo.
                </p>
            </div>
        </section>
    );
}
