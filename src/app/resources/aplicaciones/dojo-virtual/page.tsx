import { Suspense } from "react";
import DojoVirtual from "@/components/sections/DojoVirtual";

export default function DojoVirtualPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden pt-24 pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-kuma-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 px-6 max-w-7xl mx-auto">
        <Suspense fallback={
          <div className="w-full min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
          </div>
        }>
          <DojoVirtual />
        </Suspense>
      </div>
    </main>
  );
}
