import Link from "next/link";
import { DidacticController } from "@/components/didactic/DidacticController";
import { KoiPondCanvas } from "@/components/didactic/KoiPondCanvas";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { CaretLeft, House, SquaresFour } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: "Kuma Sensei Academy & Didáctica | Kuma Dojo",
    description: "Plataforma de aprendizaje marcial gamificada: Camino Tradicional y Deportivo WKF con Kuma Sensei.",
};

export default function DidacticaPage() {
    return (
        <main className="min-h-screen bg-[#071324] text-white relative overflow-hidden pt-28 md:pt-32 pb-24">
            {/* ESTANQUE PROCEDURAL ZEN DE PECES KOI (CINEMÁTICA INVERSA & ONDAS DE AGUA) */}
            <KoiPondCanvas opacity={0.85} fishCount={7} />

            <div className="relative z-10 px-4 md:px-6 max-w-7xl mx-auto">
                {/* GLOBAL NAVIGATION / EXIT BAR (ALWAYS VISIBLE AT TOP) */}
                <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b-2 border-[#1E293B]">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-slate-200 hover:text-white border-2 border-[#334155] text-xs font-black uppercase tracking-wider transition-all group shadow-sm"
                        title="Salir al Inicio"
                    >
                        <CaretLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#1CB0F6]" weight="bold" />
                        <House className="w-4 h-4 text-[#FFC800]" />
                        <span>Volver al Inicio</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/resources/aplicaciones"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-slate-200 hover:text-white border-2 border-[#334155] text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                            title="Ir a Aplicaciones Kuma"
                        >
                            <SquaresFour className="w-4 h-4 text-[#1CB0F6]" />
                            <span className="hidden sm:inline">Aplicaciones</span>
                        </Link>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E2A47] border-2 border-[#1CB0F6] text-[#1CB0F6] font-black uppercase tracking-[0.2em] text-[11px] md:text-xs mb-3 shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#58CC02]" />
                        <span>🥋 Academia Marcial Kuma Sensei</span>
                    </div>
                    <PrimalTitle className="text-4xl md:text-6xl lg:text-7xl uppercase tracking-widest mb-4">
                        Kuma Sensei Academy
                    </PrimalTitle>
                    <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base font-serif italic mb-6">
                        "Forja tu conocimiento en el tatami virtual. Dos caminos de maestría guiados por Kuma Sensei."
                    </p>
                    {/* Solid Tactile Duolingo Accent Divider */}
                    <div className="w-28 h-2 bg-[#58CC02] border-b-2 border-[#46A302] mx-auto rounded-full shadow-sm" />
                </div>

                {/* Didactic Master Controller */}
                <DidacticController />
            </div>
        </main>
    );
}
