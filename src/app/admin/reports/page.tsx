import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function ReportsHubPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
                <Link href="/admin" className="p-3 hover:bg-zinc-800 rounded-xl transition-all hover:scale-105 text-zinc-400 hover:text-white group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                        Centro de <span className="text-red-600">Reportes</span>
                    </h1>
                    <p className="text-zinc-400 mt-1">Selecciona el tipo de reporte que deseas visualizar.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/admin/reports/visits"
                    className="group relative bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl hover:border-red-900/50 transition-all hover:bg-zinc-900 hover:shadow-2xl hover:shadow-black/50 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-32 h-32 text-red-600 -mr-8 -mt-8 rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <div className="h-14 w-14 rounded-full bg-red-900/20 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                            <TrendingUp className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-3 group-hover:text-red-500 transition-colors uppercase tracking-tight">Reporte de Visitas</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300">
                            Visualiza el tráfico del sitio web, páginas más visitadas y ubicación de los usuarios en tiempo real.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
