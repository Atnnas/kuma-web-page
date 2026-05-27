"use client";

import { useEffect, useState } from "react";
import { RoutineEditor, IRoutineData } from "@/components/admin/RoutineEditor";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Dumbbell, Timer, Loader2 } from "lucide-react";
import { AdminFloatingButton } from "@/components/admin/AdminFloatingButton";

export default function AdminRutinasPage() {
    const [routines, setRoutines] = useState<IRoutineData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState<IRoutineData | null>(null);

    const loadRoutines = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/routines?admin=true");
            if (res.ok) {
                const data = await res.json();
                setRoutines(data);
            }
        } catch (error) {
            console.error("Failed to load routines", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRoutines();
    }, []);

    const handleCreate = () => {
        setEditingRoutine(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (routine: IRoutineData) => {
        setEditingRoutine(routine);
        setIsEditorOpen(true);
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (confirm("¿Estás seguro de que deseas eliminar esta rutina? Seriosly?")) {
            await fetch(`/api/routines/${id}`, { method: "DELETE" });
            loadRoutines();
        }
    };

    const handleSave = () => {
        setIsEditorOpen(false);
        setEditingRoutine(null);
        loadRoutines();
    };

    return (
        <div className="min-h-screen text-white space-y-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
                <div>
                    <h1 className="text-3xl font-serif font-black text-white uppercase italic">
                        Gestión de Rutinas
                    </h1>
                    <p className="text-zinc-500 text-sm">Administra el catálogo de entrenamiento.</p>
                </div>

                {/* New Rutina Button */}
                {!isEditorOpen && (
                    <AdminFloatingButton onClick={handleCreate} label="Nueva Rutina" />
                )}
            </div>

            {isEditorOpen ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <RoutineEditor
                        initialData={editingRoutine}
                        onSave={handleSave}
                        onCancel={() => setIsEditorOpen(false)}
                    />
                </div>
            ) : (
                <>
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-kuma-gold animate-spin" />
                        </div>
                    ) : routines.length === 0 ? (
                        <div className="text-center py-20 px-4 glass border border-white/5 rounded-3xl backdrop-blur-md">
                            <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Dumbbell className="w-10 h-10 text-kuma-gold opacity-50" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">No hay rutinas</h3>
                            <p className="text-zinc-400">Crea la primera rutina para tus alumnos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {routines.map((routine, idx) => (
                                <div
                                    key={`${routine._id || ''}-${idx}`}
                                    className="relative glass border border-white/5 rounded-2xl p-6 hover:border-kuma-gold/30 transition-all group backdrop-blur-md flex flex-col md:flex-row items-center gap-6"
                                >
                                    <div className="w-12 h-12 rounded-full bg-kuma-gold/10 flex items-center justify-center text-kuma-gold shrink-0">
                                        <Dumbbell className="w-6 h-6" />
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-kuma-gold transition-colors">
                                            {routine.title}
                                        </h3>
                                        <p className="text-zinc-500 text-sm mb-2">{routine.description}</p>
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-400">
                                                {routine.difficulty}
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-400 flex items-center gap-1">
                                                <Timer className="w-3 h-3" /> {routine.estimated_duration} min
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(routine)}
                                            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(routine._id)}
                                            className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
