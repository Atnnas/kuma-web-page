import Link from "next/link";
import { DidacticController } from "@/components/didactic/DidacticController";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { CaretLeft, House, SquaresFour } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: "Kuma Sensei Academy & Didáctica | Kuma Dojo",
    description: "Plataforma de aprendizaje marcial gamificada: Camino Tradicional y Deportivo WKF con Kuma Sensei.",
};

export default function DidacticaPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden pt-28 md:pt-32 pb-24 selection:bg-kuma-gold/30">
            {/* Ambient Dojo Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-kuma-gold/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-15 pointer-events-none" />

            <div className="relative z-10 px-4 md:px-6 max-w-7xl mx-auto">
                {/* GLOBAL NAVIGATION / EXIT BAR (ALWAYS VISIBLE AT TOP) */}
                <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider transition-all group"
                        title="Salir al Inicio"
                    >
                        <CaretLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" weight="bold" />
                        <House className="w-4 h-4 text-kuma-gold" />
                        <span>Volver al Inicio</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/resources/aplicaciones"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider transition-all"
                            title="Ir a Aplicaciones Kuma"
                        >
                            <SquaresFour className="w-4 h-4 text-kuma-gold" />
                            <span className="hidden sm:inline">Aplicaciones</span>
                        </Link>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <span className="text-kuma-gold font-bold uppercase tracking-[0.25em] text-xs md:text-sm mb-3 block drop-shadow-md">
                        Academia Marcial Interactiva • Kuma Dojo
                    </span>
                    <PrimalTitle className="text-4xl md:text-6xl lg:text-7xl uppercase tracking-widest mb-4">
                        Kuma Sensei Academy
                    </PrimalTitle>
                    <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base font-serif italic mb-6">
                        "Forja tu conocimiento en el tatami virtual. Dos caminos de maestría guiados por Kuma Sensei."
                    </p>
                    <div className="w-24 h-1 bg-kuma-gold mx-auto rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                </div>

                {/* Didactic Master Controller */}
                <DidacticController />
            </div>
        </main>
    );
}
