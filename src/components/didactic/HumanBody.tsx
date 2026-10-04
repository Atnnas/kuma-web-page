"use client";
import React, { useState } from "react";
import Image from "next/image";
import { KumaAnatomyQuestion } from "./KumaAnatomyQuestion";
import { Question } from "@/types/didactica";
import { GameController, BookOpen, Sparkle } from "@phosphor-icons/react";

const DEMO_QUESTION: Question = {
    id: "demo-cuerpo-kuma",
    type: "kuma_anatomy",
    prompt: "El Cuerpo Humano de Pies a Cabeza",
    description: "Coloca cada punto anatómico en el cuerpo de Kuma Sensei, avanzando en orden biomecánico desde los pies hasta la cabeza.",
    image: "/images/didactic/kuma_cuerpo_humano_oficial_v2.jpg",
    explanation: "¡Excelente! Has dominado los puntos corporales fundamentales de Karate.",
};

export function HumanBody() {
    const [activeTab, setActiveTab] = useState<"interactive" | "poster">("interactive");

    return (
        <div className="w-full flex flex-col items-center justify-center p-2 md:p-6">
            {/* SELECTOR DE MODO */}
            <div className="flex items-center gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl mb-6 shadow-lg">
                <button
                    type="button"
                    onClick={() => setActiveTab("interactive")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        activeTab === "interactive"
                            ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30 scale-105"
                            : "text-zinc-400 hover:text-white"
                    }`}
                >
                    <GameController size={20} weight="bold" />
                    <span>Modo Interactivo (Pies a Cabeza)</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("poster")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        activeTab === "poster"
                            ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30 scale-105"
                            : "text-zinc-400 hover:text-white"
                    }`}
                >
                    <BookOpen size={20} weight="bold" />
                    <span>Póster Oficial de Referencia</span>
                </button>
            </div>

            {/* CONTENIDO SEGÚN TAB */}
            {activeTab === "interactive" ? (
                <div className="w-full">
                    <KumaAnatomyQuestion
                        question={DEMO_QUESTION}
                        onCompleted={() => {}}
                    />
                </div>
            ) : (
                <div className="relative w-full max-w-lg md:max-w-2xl lg:max-w-4xl shadow-2xl rounded-2xl overflow-hidden border border-zinc-800 bg-black">
                    <Image
                        src="/images/kuma-partes-cuerpo.jpg"
                        alt="Partes del Cuerpo - Kuma Dojo"
                        width={1920}
                        height={1080}
                        className="w-full h-auto object-contain"
                        priority
                    />
                </div>
            )}
        </div>
    );
}
