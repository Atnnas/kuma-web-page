import { DidacticBrowser } from "@/components/sections/DidacticBrowser";
import { PrimalTitle } from "@/components/ui/PrimalTitle";

export const metadata = {
    title: "Didáctica | Kuma Dojo",
    description: "Material didáctico y metodológico para la enseñanza del Karate.",
};

export default function DidacticaPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden pt-24 pb-20">
            <div className="relative z-10 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-2">
                    <span className="text-kuma-gold font-bold uppercase tracking-[0.2em] text-sm mb-4 block drop-shadow-md">Recursos Kuma</span>
                    <PrimalTitle className="text-5xl md:text-7xl uppercase tracking-widest mb-8">
                        Didáctica
                    </PrimalTitle>
                    <div className="w-24 h-1 bg-kuma-gold mx-auto rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                </div>

                <DidacticBrowser />
            </div>
        </main>
    );
}
