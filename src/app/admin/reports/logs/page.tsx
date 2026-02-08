import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import RoutineLog from "@/models/RoutineLog";
import User from "@/models/User"; // Ensure User model is registered
import Routine from "@/models/Routine"; // Ensure Routine model is registered
import { redirect } from "next/navigation";
import Link from "next/link";
// import { ArrowLeft, Calendar, User as UserIcon, Clock, CheckCircle, XCircle, Timer } from "lucide-react"; // REPLACED
import {
    ArrowLeft,
    CalendarBlank,
    User as UserIcon,
    Clock,
    CheckCircle,
    Timer,
    TrendUp,
    CaretLeft
} from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

export default async function RoutineLogsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== "super_admin") {
        redirect("/admin");
    }

    await dbConnect();

    // Fetch logs, populated with user name
    const logs = await RoutineLog.find({})
        .populate("user", "name email image")
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/reports" className="group p-3 bg-zinc-900 border border-white/5 rounded-xl hover:bg-white hover:text-black transition-all hover:scale-105 text-zinc-400">
                        <CaretLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" weight="bold" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-kuma-gold/10 rounded-lg text-kuma-gold">
                                <Clock className="w-6 h-6" weight="duotone" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
                                Registro de <span className="text-kuma-gold">Ejecuciones</span>
                            </h1>
                        </div>
                        <p className="text-zinc-500 font-medium pl-14">
                            Auditoría de rendimiento y tiempos reales.
                        </p>
                    </div>
                </div>

                <div className="px-4 py-2 bg-zinc-900 rounded-lg border border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    {logs.length} Registros
                </div>
            </div>

            {/* Premium Table */}
            <div className="rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-base text-zinc-200 border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-zinc-900/80 text-xs uppercase tracking-widest text-zinc-300 font-black">
                                <th className="p-6">Usuario</th>
                                <th className="p-6">Rutina</th>
                                <th className="p-6">Fecha y Hora</th>
                                <th className="p-6 text-center">Duración Est.</th>
                                <th className="p-6 text-center">Duración Real</th>
                                <th className="p-6 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map((log: any) => {
                                const user = log.user || { name: "Usuario Eliminado", email: "N/A" };
                                const startTime = new Date(log.startTime);
                                const endTime = log.endTime ? new Date(log.endTime) : null;

                                // Calculate real duration or show --
                                const durationDisplay = log.durationSeconds
                                    ? `${Math.floor(log.durationSeconds / 60)}m ${log.durationSeconds % 60}s`
                                    : "--";

                                // Scheduled duration
                                const scheduledDisplay = `${log.scheduledDuration}m`;

                                // Color logic based on completion
                                const isCompleted = log.completed;

                                return (
                                    <tr key={log._id.toString()} className="group hover:bg-zinc-900/80 transition-colors border-b border-white/5 last:border-none">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
                                                    {user.image ? (
                                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon className="w-6 h-6" weight="duotone" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold group-hover:text-blue-400 transition-colors text-lg">{user.name}</div>
                                                    <div className="text-xs text-zinc-500 font-mono">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="text-white font-bold uppercase tracking-tight text-sm bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">{log.routineTitle}</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-white font-bold">
                                                    <CalendarBlank className="w-5 h-5 text-zinc-500" weight="duotone" />
                                                    {format(startTime, "dd MMM yyyy", { locale: es })}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-zinc-500 font-mono pl-7 font-bold">
                                                    <span>{format(startTime, "HH:mm")}</span>
                                                    {endTime ? (
                                                        <>
                                                            <span className="text-zinc-700">-</span>
                                                            <span>{format(endTime, "HH:mm")}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-kuma-gold animate-pulse">...</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="inline-block px-3 py-1 rounded bg-zinc-900 border border-white/5 text-zinc-400 font-mono text-sm font-bold">
                                                {scheduledDisplay}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className={`inline-block px-3 py-1 rounded ${isCompleted ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-600'} font-mono text-base font-bold border border-white/5`}>
                                                {durationDisplay}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            {isCompleted ? (
                                                <span className="inline-flex items-center gap-1.5 text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-500/20 shadow-[0_0_10px_-2px_rgba(74,222,128,0.2)]">
                                                    <CheckCircle className="w-4 h-4" weight="fill" /> Completado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-yellow-500/20 shadow-[0_0_10px_-2px_rgba(234,179,8,0.2)]">
                                                    <Timer className="w-4 h-4" weight="duotone" /> En Progreso
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <TrendUp className="w-16 h-16 text-zinc-700 mb-4" weight="duotone" />
                                            <p className="text-zinc-500 font-medium text-lg">No hay registros de rutinas aún.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
