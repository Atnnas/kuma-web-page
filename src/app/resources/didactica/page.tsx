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
        <main className="min-h-screen bg-[#090D1A] text-white relative overflow-hidden pt-28 md:pt-32 pb-24 selection:bg-cyan-500/30">
            {/* Ambient Arcade Dojo Glows (Emerald, Cyan & Fuchsia) */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-10 right-1/4 translate-x-1/2 w-[550px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-80 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-fuchsia-500/5 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-20 pointer-events-none" />

            <div className="relative z-10 px-4 md:px-6 max-w-7xl mx-auto">
                {/* GLOBAL NAVIGATION / EXIT BAR (ALWAYS VISIBLE AT TOP) */}
                <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-cyan-400/50 text-xs font-bold uppercase tracking-wider transition-all group shadow-sm"
                        title="Salir al Inicio"
                    >
                        <CaretLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-cyan-400" weight="bold" />
                        <House className="w-4 h-4 text-amber-400" />
                        <span>Volver al Inicio</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/resources/aplicaciones"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-cyan-400/50 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                            title="Ir a Aplicaciones Kuma"
                        >
                            <SquaresFour className="w-4 h-4 text-cyan-400" />
                            <span className="hidden sm:inline">Aplicaciones</span>
                        </Link>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-fuchsia-500/15 border border-cyan-400/40 text-cyan-300 font-black uppercase tracking-[0.25em] text-[11px] md:text-xs mb-3 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00E676]" />
                        <span>⚡ Arcade Dojo • Academia Interactiva Kuma</span>
                    </div>
                    <PrimalTitle className="text-4xl md:text-6xl lg:text-7xl uppercase tracking-widest mb-4 drop-shadow-[0_0_25px_rgba(6,182,212,0.2)]">
                        Kuma Sensei Academy
                    </PrimalTitle>
                    <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base font-serif italic mb-6">
                        "Forja tu conocimiento en el tatami virtual. Dos caminos de maestría guiados por Kuma Sensei."
                    </p>
                    {/* Multi-color Arcade Neon Energy Divider */}
                    <div className="w-32 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 mx-auto rounded-full shadow-[0_0_20px_rgba(0,240,255,0.7)]" />
                </div>

                {/* Didactic Master Controller */}
                <DidacticController />
            </div>
        </main>
    );
}
