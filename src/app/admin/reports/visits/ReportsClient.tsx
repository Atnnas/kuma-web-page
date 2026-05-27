"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { format, subDays, parseISO } from "date-fns";
import { NeonDatePicker } from "@/components/ui/NeonDatePicker";
import { es } from "date-fns/locale";
import {
    Globe,
    CalendarBlank,
    Clock,
    MapPin,
    Monitor,
    Trash,
    WarningCircle,
    X,
    CircleNotch,
    ChartLineUp,
    Users
} from "@phosphor-icons/react/dist/ssr";

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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    const handleDeleteAll = async () => {
        setIsLoading(true);
        try {
            const { deleteAllVisits } = await import("@/lib/actions/analytics");
            const res = await deleteAllVisits();
            if (res.success) {
                window.location.reload();
            } else {
                alert("Error al eliminar datos.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión.");
        } finally {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="space-y-6 relative pb-20">
            {/* --- DELETE CONFIRMATION MODAL --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={() => setIsDeleteModalOpen(false)}
                    />
                    <div className="relative bg-zinc-900 border border-red-900/50 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-red-900/20 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" weight="bold" />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-red-900/20 flex items-center justify-center mb-2 animate-pulse">
                                <WarningCircle className="w-8 h-8 text-red-500" weight="duotone" />
                            </div>

                            <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                                ¿Eliminar Historial?
                            </h3>

                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Estás a punto de borrar <strong className="text-red-400">TODAS</strong> las visitas registradas en la base de datos.
                                <br /><br />
                                <span className="bg-red-900/30 text-red-200 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border border-red-900/50">
                                    ⚠️ Acción Irreversible
                                </span>
                            </p>

                            <div className="grid grid-cols-2 gap-3 w-full pt-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-3 rounded-xl font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors uppercase tracking-wider text-xs"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDeleteAll}
                                    disabled={isLoading}
                                    className="px-4 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
                                >
                                    {isLoading ? <CircleNotch className="w-4 h-4 animate-spin" weight="bold" /> : <Trash className="w-4 h-4" weight="bold" />}
                                    Eliminar Todo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CONTROLS BAR --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
                <div>
                    <h2 className="text-lg font-bold text-white mb-1 uppercase tracking-tight flex items-center gap-2">
                        <ChartLineUp className="w-5 h-5 text-kuma-gold" weight="duotone" />
                        Filtros de Datos
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono">Selecciona rango de fechas</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 rounded-xl transition-all active:scale-95 group"
                        title="Limpiar Datos"
                    >
                        <Trash className="w-5 h-5" weight="duotone" />
                    </button>
                    <div className="h-8 w-[1px] bg-white/10 mx-1" />
                    <NeonDatePicker date={date} setDate={setDate} />
                    {isLoading && <CircleNotch className="w-5 h-5 animate-spin text-kuma-gold ml-2" weight="bold" />}
                </div>
            </div>

            {/* --- STAT CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl flex items-center justify-between hover:bg-zinc-900/50 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Globe className="w-32 h-32 text-kuma-gold" weight="duotone" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Visitas</p>
                        <p className="text-5xl font-black text-white tracking-tighter group-hover:text-kuma-gold transition-colors">{initialStats.total}</p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-kuma-gold/10 border border-kuma-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                        <Globe className="w-7 h-7 text-kuma-gold" weight="duotone" />
                    </div>
                </div>
                <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl flex items-center justify-between hover:bg-zinc-900/50 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="w-32 h-32 text-blue-500" weight="duotone" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Visitantes Únicos</p>
                        <p className="text-5xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">{initialStats.unique}</p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                        <Users className="w-7 h-7 text-blue-500" weight="duotone" />
                    </div>
                </div>
            </div>

            {/* --- NEON PREMIUM TABLE --- */}
            <div className="rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                    <h3 className="font-bold text-white flex items-center gap-3 uppercase tracking-tight text-lg">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Tráfico en Tiempo Real
                    </h3>
                    <div className="text-xs font-mono text-zinc-400 bg-black px-3 py-1.5 rounded border border-white/10 font-bold">
                        LATEST 100
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-base text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-zinc-900 text-xs uppercase tracking-widest text-zinc-300 font-black">
                                <th className="p-6">Fecha y Hora</th>
                                <th className="p-6">Ruta</th>
                                <th className="p-6">Ubicación</th>
                                <th className="p-6">Dispositivo / IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {initialData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <Globe className="w-16 h-16 text-zinc-700 mb-4" weight="duotone" />
                                            <p className="text-zinc-500 font-medium">No hay visitas en este rango.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                initialData.map((visit: any, index: number) => (
                                    <tr key={`${visit._id}-${index}`} className="group hover:bg-zinc-900/80 transition-colors border-b border-white/5 last:border-none">
                                        <td className="p-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold flex items-center gap-2 text-lg">
                                                    <CalendarBlank className="w-5 h-5 text-zinc-500" weight="duotone" />
                                                    {format(new Date(visit.timestamp), "dd MMM yyyy", { locale: es })}
                                                </span>
                                                <span className="text-sm text-zinc-500 font-mono pl-7 flex items-center gap-1 font-bold">
                                                    <Clock className="w-4 h-4" />
                                                    {format(new Date(visit.timestamp), "HH:mm:ss")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="inline-block bg-black text-cyan-400 px-3 py-1.5 rounded-lg text-sm font-mono border border-cyan-900/30 group-hover:border-cyan-500/50 transition-colors font-bold shadow-sm">
                                                {visit.path}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-zinc-300 font-medium">
                                                <MapPin className="w-5 h-5 text-zinc-600 group-hover:text-red-500 transition-colors" weight="duotone" />
                                                {visit.geo?.city ? (
                                                    <span className="group-hover:text-white transition-colors">
                                                        {visit.geo.city}, {visit.geo.country}
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-600 italic">Desconocido</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
                                                    <Monitor className="w-4 h-4 text-zinc-600" weight="duotone" />
                                                    <span className="truncate max-w-[200px]" title={visit.userAgent}>
                                                        {visit.userAgent || "N/A"}
                                                    </span>
                                                </div>
                                                <span className="font-mono text-xs text-zinc-500 pl-6">{visit.geo?.ip || "IP Oculta"}</span>
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
