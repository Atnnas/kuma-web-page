"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { format, subDays, parseISO } from "date-fns";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Loader2, Globe, Calendar, Clock, MapPin, Monitor } from "lucide-react";
import { es } from "date-fns/locale";

interface ReportsClientProps {
    initialData: any;
    initialStats: any;
    from?: string;
    to?: string;
}

export default function ReportsClient({ initialData, initialStats, from, to }: ReportsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from props or default to last 30 days
    const [date, setDate] = useState<DateRange | undefined>({
        from: from ? parseISO(from) : subDays(new Date(), 30),
        to: to ? parseISO(to) : new Date(),
    });

    const [isLoading, setIsLoading] = useState(false);

    // Update URL when date changes
    useEffect(() => {
        if (date?.from) {
            const params = new URLSearchParams(searchParams);
            params.set("from", format(date.from, "yyyy-MM-dd"));
            if (date.to) {
                params.set("to", format(date.to, "yyyy-MM-dd"));
            } else {
                params.delete("to");
            }

            // Debounce or just push? Pushing immediately for now as user selects
            // But checking if values actually changed to avoid loop
            const currentFrom = searchParams.get("from");
            const currentTo = searchParams.get("to");

            if (currentFrom !== params.get("from") || currentTo !== params.get("to")) {
                setIsLoading(true);
                router.push(`?${params.toString()}`);
            }
        }
    }, [date, router, searchParams]);

    // Reset loading state when data arrives (props change)
    useEffect(() => {
        setIsLoading(false);
    }, [initialData]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass border border-white/5 p-4 rounded-xl backdrop-blur-md">
                <div>
                    <h2 className="text-xl font-serif font-bold text-white mb-1">Filtros de Reporte</h2>
                    <p className="text-sm text-zinc-400">Selecciona un rango de fechas para visualizar las visitas.</p>
                </div>
                <div className="flex items-center gap-2">
                    <DateRangePicker date={date} setDate={setDate} />
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin text-red-600" />}
                </div>
            </div>

            {/* Resume Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass border border-white/5 p-6 rounded-xl flex items-center justify-between backdrop-blur-md group hover:border-red-500/30 transition-all">
                    <div>
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Total Visitas</p>
                        <p className="text-4xl font-serif font-black text-kuma-gold drop-shadow-md">{initialStats.total}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Globe className="w-6 h-6 text-kuma-gold" />
                    </div>
                </div>
                <div className="glass border border-white/5 p-6 rounded-xl flex items-center justify-between backdrop-blur-md group hover:border-red-500/30 transition-all">
                    <div>
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Visitantes Únicos (Aprox)</p>
                        <p className="text-4xl font-serif font-black text-kuma-gold drop-shadow-md">{initialStats.unique}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-zinc-400" />
                    </div>
                </div>
            </div>

            {/* Visits Table */}
            <div className="glass border border-white/5 rounded-xl overflow-hidden backdrop-blur-md">
                <div className="p-4 border-b border-white/10">
                    <h3 className="font-serif font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        Detalle de Visitas
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-zinc-400 font-medium border-b border-white/10 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Fecha y Hora</th>
                                <th className="px-4 py-3">Ruta</th>
                                <th className="px-4 py-3">Ubicación</th>
                                <th className="px-4 py-3">Dispositivo / IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {initialData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                                        No hay visitas registradas en este rango de fechas.
                                    </td>
                                </tr>
                            ) : (
                                initialData.map((visit: any) => (
                                    <tr key={visit._id} className="hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-zinc-600" />
                                                {format(new Date(visit.timestamp), "dd/MM/yyyy", { locale: es })}
                                                <Clock className="w-3 h-3 text-zinc-600 ml-1" />
                                                {format(new Date(visit.timestamp), "HH:mm")}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-white">
                                            <span className="bg-zinc-800 px-2 py-1 rounded text-xs border border-zinc-700 font-mono">
                                                {visit.path}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-400">
                                            {visit.geo?.city ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="fi fi-cr mr-1"></span> {/* Assuming flag icons might be used, otherwise text */}
                                                    {visit.geo.city}, {visit.geo.country}
                                                </div>
                                            ) : (
                                                <span className="text-zinc-600 italic">Desconocido</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-500 text-xs">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1">
                                                    <Monitor className="w-3 h-3" />
                                                    <span className="truncate max-w-[200px]" title={visit.userAgent}>
                                                        {visit.userAgent || "N/A"}
                                                    </span>
                                                </div>
                                                <span className="font-mono text-zinc-600">{visit.geo?.ip || "IP Oculta"}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
