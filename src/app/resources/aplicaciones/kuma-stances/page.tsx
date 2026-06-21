import { Suspense } from "react";
import KumaStances from "@/components/sections/KumaStances";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kuma Stances - Espejo de Práctica de Karate | Kuma Dojo",
  description: "Practica y perfecciona tus posiciones y posturas de karate con retroalimentación y visión artificial en tiempo real.",
};

export default function KumaStancesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white relative overflow-x-hidden pt-24 pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-kuma-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 px-2 sm:px-4 w-full max-w-[96vw] mx-auto">
        <Suspense fallback={
          <div className="w-full min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
          </div>
        }>
          <KumaStances />
        </Suspense>
      </div>
    </main>
  );
}
