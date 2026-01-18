"use client";
import React from "react";
import { Dumbbell, Swords, Brain } from "lucide-react";

export function Training() {
    const programs = [
        { title: "Karate Tradicional", icon: <Swords className="w-8 h-8" />, desc: "Técnica pura y kata." },
        { title: "Acondicionamiento", icon: <Dumbbell className="w-8 h-8" />, desc: "Fuerza y resistencia física." },
        { title: "Mentalidad", icon: <Brain className="w-8 h-8" />, desc: "Disciplina y enfoque zen." },
    ];

    return (
        <section id="entrenamiento" className="py-24 bg-black text-white relative">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4">
                        Programas de <span className="text-red-700">Entrenamiento</span>
                    </h2>
                    <p className="text-zinc-500 max-w-2xl mx-auto">
                        Forja tu cuerpo y mente con nuestros sistemas probados.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {programs.map((prog, i) => (
                        <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl hover:border-red-900/50 transition-colors group">
                            <div className="text-red-600 mb-6 group-hover:scale-110 transition-transform duration-300 bg-red-900/10 w-fit p-4 rounded-full mx-auto">
                                {prog.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-center mb-2 uppercase text-zinc-200">{prog.title}</h3>
                            <p className="text-center text-zinc-500">{prog.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
