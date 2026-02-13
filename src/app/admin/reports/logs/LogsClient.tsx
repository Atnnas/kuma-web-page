"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarBlank,
    User as UserIcon,
    Clock,
    CheckCircle,
    Timer,
    TrendUp,
    CaretDown,
    Funnel,
    Trash,
    CheckSquare,
    Square,
    WarningOctagon,
    X
} from "@phosphor-icons/react/dist/ssr";
import { NeonDatePicker } from "@/components/ui/NeonDatePicker";
import { useState, useEffect } from "react";
import { deleteRoutineLogs } from "@/lib/actions/routine-logs";

interface LogsClientProps {
    initialLogs: any[];
    users: any[];
}

export default function LogsClient({ initialLogs, users }: LogsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const initialFrom = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
    const initialTo = searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined;

    // Fix timezone offset for initial date state if necessary (similar to NeonDatePicker logic)
    // But better to trust the string if it's YYYY-MM-DD

    const [date, setDate] = useState<{ from: Date | undefined; to?: Date | undefined } | undefined>({
        from: initialFrom,
        to: initialTo
    });

    const [selectedUser, setSelectedUser] = useState(searchParams.get("userId") || "");
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleImageError = (logId: string) => {
        setImageErrors(prev => ({ ...prev, [logId]: true }));
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === initialLogs.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(initialLogs.map(log => log._id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDelete = () => {
        if (selectedIds.length === 0) return;
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        setShowDeleteConfirm(false);
        try {
            const result = await deleteRoutineLogs(selectedIds);
            if (result.success) {
                setSelectedIds([]);
                router.refresh();
            } else {
                alert("Error al eliminar: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Error inesperado al eliminar.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (selectedUser) {
            params.set("userId", selectedUser);
        } else {
            params.delete("userId");
        }

        if (date?.from) {
            params.set("from", format(date.from, "yyyy-MM-dd"));
        } else {
            params.delete("from");
        }

        if (date?.to) {
            params.set("to", format(date.to, "yyyy-MM-dd"));
        } else {
            params.delete("to");
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [selectedUser, date, pathname, router]); // Intentionally removed searchParams from dependency to avoid loop if we used push

    return (
        <div className="space-y-6">
            {/* Filters Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    {/* User Select */}
                    <div className="relative group w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-zinc-500 group-hover:text-cyan-500 transition-colors" weight="duotone" />
                        </div>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2.5 text-sm bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 appearance-none transition-all hover:bg-zinc-800 cursor-pointer font-medium"
                        >
                            <option value="">Todos los Usuarios</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CaretDown className="h-4 w-4 text-zinc-500" weight="bold" />
                        </div>
                    </div>

                    {/* Date Picker */}
                    <NeonDatePicker date={date} setDate={setDate} />
                </div>

                {/* Active Filters Summary (Optional visual cue) */}
                {(selectedUser || date?.from) && (
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-500/20 animate-in fade-in">
                        <Funnel className="w-4 h-4" />
                        <span>Filtros Activos</span>
                        <button
                            onClick={() => {
                                setSelectedUser("");
                                setDate(undefined);
                            }}
                            className="ml-2 hover:text-white"
                        >
                            Limpiar
                        </button>
                    </div>
                )}
            </div>

            {/* Premium Table */}
            <div className="rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-base text-zinc-200 border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-zinc-900/80 text-xs uppercase tracking-widest text-zinc-300 font-black">
                                <th className="p-6 w-10">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="p-1 hover:text-cyan-400 transition-colors"
                                    >
                                        {selectedIds.length === initialLogs.length && initialLogs.length > 0 ? (
                                            <CheckSquare weight="fill" className="w-5 h-5 text-cyan-500" />
                                        ) : (
                                            <Square weight="bold" className="w-5 h-5" />
                                        )}
                                    </button>
                                </th>
                                <th className="p-6">Usuario</th>
                                <th className="p-6">Rutina</th>
                                <th className="p-6">Fecha y Hora</th>
                                <th className="p-6 text-center">Duración Est.</th>
                                <th className="p-6 text-center">Duración Real</th>
                                <th className="p-6 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {initialLogs.map((log: any) => {
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
                                const isSelected = selectedIds.includes(log._id);

                                return (
                                    <tr key={log._id.toString()} className={`group hover:bg-zinc-900/80 transition-colors border-b border-white/5 last:border-none ${isSelected ? 'bg-cyan-500/5' : ''}`}>
                                        <td className="p-6">
                                            <button
                                                onClick={() => toggleSelect(log._id)}
                                                className="p-1 hover:text-cyan-400 transition-colors"
                                            >
                                                {isSelected ? (
                                                    <CheckSquare weight="fill" className="w-5 h-5 text-cyan-500" />
                                                ) : (
                                                    <Square weight="bold" className="w-5 h-5 text-zinc-700" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
                                                    {user.image && !imageErrors[log._id.toString()] ? (
                                                        <img
                                                            src={user.image}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                            referrerPolicy="no-referrer"
                                                            onError={() => handleImageError(log._id.toString())}
                                                        />
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
                            {initialLogs.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <TrendUp className="w-16 h-16 text-zinc-700 mb-4" weight="duotone" />
                                            <p className="text-zinc-500 font-medium text-lg">No se encontraron registros con estos filtros.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Floating Action Button (FAB) for Deletion */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3"
                    >
                        <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-2xl text-sm font-bold text-white flex items-center gap-2">
                            <span className="text-cyan-400">{selectedIds.length}</span> seleccionados
                        </div>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="group flex items-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100 font-black uppercase tracking-widest text-sm"
                        >
                            <Trash weight="bold" className="w-6 h-6" />
                            <span>{isDeleting ? "Eliminando..." : "Eliminar Registros"}</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteConfirm(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
                        >
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0 opacity-50" />

                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                                    <WarningOctagon className="w-10 h-10 text-red-500" weight="duotone" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">¿Confirmar Eliminación?</h3>
                                    <p className="text-zinc-400 font-medium">
                                        Estas a punto de eliminar <span className="text-white font-bold">{selectedIds.length}</span> {selectedIds.length === 1 ? "registro" : "registros"}. Esta acción no se puede deshacer.
                                    </p>
                                </div>

                                <div className="flex gap-4 w-full pt-4">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold tracking-widest uppercase text-xs transition-colors border border-white/5"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white font-black tracking-widest uppercase text-xs shadow-[0_6px_0_0_#991b1b] active:shadow-none active:translate-y-[6px] transition-all"
                                    >
                                        {isDeleting ? "Eliminando..." : "Eliminar"}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" weight="bold" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
