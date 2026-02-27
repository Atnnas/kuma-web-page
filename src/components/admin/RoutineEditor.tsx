"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Spinner, Plus, Trash, FloppyDisk, X, Barbell, Clock, TextAlignLeft, ChartBar, DotsSixVertical, WarningCircle, ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { getAllUsers } from "@/lib/actions/users";
import { StrictCombobox } from "@/components/ui/StrictCombobox";
import { cn } from "@/lib/utils";

// Local interfaces to avoid importing server-side Mongoose types
export interface IBlock {
    type?: "exercise" | "loop_start" | "loop_end";
    exercise_name: string;
    sets: number;
    reps: number;
    rest_seconds: number;
    measure_type: "reps" | "time";
    notes?: string;
    loop_count?: number;
}

export interface IRoutineData {
    _id?: string;
    title: string;
    description: string;
    difficulty: "Principiante" | "Intermedio" | "Avanzado";
    estimated_duration: number;
    equipment_types: string[];
    blocks: IBlock[];
    active: boolean;
    allowedUsers: string[];
}

interface RoutineEditorProps {
    initialData?: IRoutineData | null;
    onSave: () => void;
    onCancel: () => void;
}

export function RoutineEditor({ initialData, onSave, onCancel }: RoutineEditorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<IRoutineData>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        difficulty: initialData?.difficulty || "Intermedio",
        estimated_duration: initialData?.estimated_duration || 20,
        equipment_types: initialData?.equipment_types || ["peso_corporal"],
        blocks: initialData?.blocks || [],
        active: initialData?.active ?? true,
        allowedUsers: initialData?.allowedUsers || [],
    });

    const [allUsers, setAllUsers] = useState<{ _id: string, name: string, email: string }[]>([]);
    const [userSearch, setUserSearch] = useState("");

    // Fetch users for the assignment picker
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const dataCount = await getAllUsers();
                setAllUsers(dataCount);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
    }, []);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDATION
        if (!formData.title || !formData.description) {
            alert("Por favor completa el título y la descripción.");
            return;
        }

        // Validate blocks
        for (let i = 0; i < formData.blocks.length; i++) {
            const block = formData.blocks[i];
            if ((block.type === "exercise" || !block.type) && !block.exercise_name.trim()) {
                alert(`El ejercicio #${i + 1} no tiene nombre. Selecciónalo o elimínalo.`);
                return;
            }
            if (block.type === "loop_start" && (!block.loop_count || block.loop_count < 2)) {
                alert(`El inicio de loop #${i + 1} debe tener al menos 2 repeticiones.`);
                return;
            }
        }

        // Validate loop nesting (simple check)
        let loopDepth = 0;
        for (const block of formData.blocks) {
            if (block.type === "loop_start") loopDepth++;
            if (block.type === "loop_end") loopDepth--;
            if (loopDepth < 0) {
                alert("Hay un cierre de loop sin su inicio correspondiente.");
                return;
            }
        }
        if (loopDepth !== 0) {
            alert("Hay un inicio de loop sin su cierre correspondiente.");
            return;
        }

        setIsLoading(true);

        try {
            // Final data preparation
            const finalData = {
                ...formData
            };

            const url = initialData?._id
                ? `/api/routines/${initialData._id}`
                : "/api/routines";

            const method = initialData?._id ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error("Server Error Details:", errData);
                throw new Error(errData.error || "Error saving routine");
            }

            onSave();
        } catch (error: any) {
            console.error("Full Error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const addBlock = () => {
        setFormData(prev => ({
            ...prev,
            blocks: [...prev.blocks, { type: "exercise", exercise_name: "", sets: 3, reps: 10, rest_seconds: 60, measure_type: "reps" }]
        }));
    };

    const addLoopStart = () => {
        setFormData(prev => ({
            ...prev,
            blocks: [...prev.blocks, { type: "loop_start", exercise_name: "INICIO LOOP", loop_count: 2, sets: 0, reps: 0, rest_seconds: 0, measure_type: "reps" }]
        }));
    };

    const addLoopEnd = () => {
        setFormData(prev => ({
            ...prev,
            blocks: [...prev.blocks, { type: "loop_end", exercise_name: "FIN LOOP", sets: 0, reps: 0, rest_seconds: 0, measure_type: "reps" }]
        }));
    };

    const removeBlock = (index: number) => {
        setFormData(prev => ({
            ...prev,
            blocks: prev.blocks.filter((_, i) => i !== index)
        }));
    };

    const updateBlock = (index: number, field: keyof IBlock, value: any) => {
        const newBlocks = [...formData.blocks];
        newBlocks[index] = { ...newBlocks[index], [field]: value };
        setFormData(prev => ({ ...prev, blocks: newBlocks }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass border border-white/5 rounded-xl shadow-2xl backdrop-blur-xl bg-zinc-900/80 relative flex flex-col min-h-screen md:min-h-0"
        >
            <div className="p-6 md:p-8 pb-32"> {/* Added padding bottom for sticky footer */}
                <div className="mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-3xl font-serif font-black text-kuma-gold uppercase tracking-widest mb-2">
                        {initialData?._id ? "Editar Rutina" : "Nueva Rutina"}
                    </h2>
                    <p className="text-zinc-400 text-sm">Diseña el entrenamiento paso a paso.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* --- BASIC INFO --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Título</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData(d => ({ ...d, title: e.target.value }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-kuma-gold focus:outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Dificultad</label>
                            <select
                                value={formData.difficulty}
                                onChange={e => setFormData(d => ({ ...d, difficulty: e.target.value as any }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-kuma-gold focus:outline-none"
                            >
                                <option value="Principiante">Principiante</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
                                className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-300 focus:border-kuma-gold focus:outline-none resize-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Duración (min)</label>
                            <input
                                type="number"
                                value={formData.estimated_duration}
                                onChange={e => setFormData(d => ({ ...d, estimated_duration: Number(e.target.value) }))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-kuma-gold focus:outline-none"
                                min={1}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Requerimientos de Equipo</label>

                            <div className="flex gap-4">
                                {/* Checkbox Peso Corporal */}
                                <label className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex-1 cursor-pointer hover:border-zinc-700 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.equipment_types.includes("peso_corporal")}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setFormData(prev => ({
                                                ...prev,
                                                equipment_types: isChecked
                                                    ? [...prev.equipment_types, "peso_corporal"]
                                                    : prev.equipment_types.filter(t => t !== "peso_corporal")
                                            }));
                                        }}
                                        className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-kuma-gold focus:ring-kuma-gold"
                                    />
                                    <span className="text-sm text-zinc-300 font-bold">Peso Corporal</span>
                                </label>

                                {/* Checkbox Equipo */}
                                <label className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex-1 cursor-pointer hover:border-zinc-700 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.equipment_types.includes("equipo")}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setFormData(prev => ({
                                                ...prev,
                                                equipment_types: isChecked
                                                    ? [...prev.equipment_types, "equipo"]
                                                    : prev.equipment_types.filter(t => t !== "equipo")
                                            }));
                                        }}
                                        className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-kuma-gold focus:ring-kuma-gold"
                                    />
                                    <span className="text-sm text-zinc-300 font-bold">Equipo</span>
                                </label>
                            </div>

                            {/* Status Display */}
                            <div className="text-center">
                                <span className={`text-xs font-black tracking-widest px-4 py-1 rounded-full border ${formData.equipment_types.includes("equipo") && formData.equipment_types.includes("peso_corporal")
                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                    : formData.equipment_types.includes("equipo")
                                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                        : "bg-green-500/10 text-green-400 border-green-500/20"
                                    }`}>
                                    {formData.equipment_types.includes("equipo") && formData.equipment_types.includes("peso_corporal")
                                        ? "MIXTO (Equipo + Peso Corporal)"
                                        : formData.equipment_types.includes("equipo")
                                            ? "REQUIERE EQUIPO"
                                            : "SOLO PESO CORPORAL"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* --- VISIBILITY & TARGETING --- */}
                    <div className="space-y-6 pt-6 border-t border-white/5">
                        <h3 className="text-sm font-bold text-kuma-gold uppercase tracking-widest">Asignación Directa</h3>

                        <div className="space-y-4">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Asignar a Alumnos Específicos</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.allowedUsers.map(userId => {
                                    const user = allUsers.find(u => u._id === userId);
                                    return (
                                        <span key={userId} className="flex items-center gap-1 bg-kuma-gold/20 text-kuma-gold border border-kuma-gold/30 px-2 py-1 rounded-md text-[10px] font-bold">
                                            {user?.name || userId}
                                            <button
                                                type="button"
                                                onClick={() => setFormData(d => ({ ...d, allowedUsers: d.allowedUsers.filter(id => id !== userId) }))}
                                                className="hover:text-white"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar alumno por nombre o correo..."
                                    value={userSearch}
                                    onChange={e => setUserSearch(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-kuma-gold focus:outline-none pr-10"
                                />
                                {userSearch && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-[100] max-h-48 overflow-y-auto">
                                        {allUsers
                                            .filter(u =>
                                                (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                                                    u.email.toLowerCase().includes(userSearch.toLowerCase())) &&
                                                !formData.allowedUsers.includes(u._id)
                                            )
                                            .map(user => (
                                                <button
                                                    key={user._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(d => ({ ...d, allowedUsers: [...d.allowedUsers, user._id] }));
                                                        setUserSearch("");
                                                    }}
                                                    className="w-full p-3 text-left hover:bg-zinc-800 flex flex-col border-b border-white/5 last:border-0"
                                                >
                                                    <span className="text-sm font-bold text-white">{user.name}</span>
                                                    <span className="text-[10px] text-zinc-500">{user.email}</span>
                                                </button>
                                            ))
                                        }
                                        {allUsers.filter(u =>
                                            (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                                                u.email.toLowerCase().includes(userSearch.toLowerCase())) &&
                                            !formData.allowedUsers.includes(u._id)
                                        ).length === 0 && (
                                                <div className="p-4 text-center text-zinc-500 text-xs italic">
                                                    No se encontraron alumnos disponibles.
                                                </div>
                                            )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- BLOCKS BUILDER --- */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center sticky top-0 bg-zinc-900/95 backdrop-blur z-10 py-4 border-b border-white/5">
                            <h3 className="text-sm font-bold text-kuma-gold uppercase tracking-widest">Bloques de Ejercicio</h3>
                            <div className="flex gap-2">
                                <Button type="button" onClick={addLoopStart} className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-500 text-[10px] h-8 border border-amber-600/30">
                                    <Plus className="w-3 h-3 mr-1" weight="bold" /> Iniciar Loop
                                </Button>
                                <Button type="button" onClick={addLoopEnd} className="bg-amber-900/20 hover:bg-amber-900/40 text-amber-700 text-[10px] h-8 border border-amber-900/30">
                                    <Plus className="w-3 h-3 mr-1" weight="bold" /> Fin Loop
                                </Button>
                                <Button type="button" onClick={addBlock} className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] h-8">
                                    <Plus className="w-3 h-3 mr-1" weight="bold" /> Agregar Ejercicio
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {formData.blocks.length === 0 && (
                                <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg bg-zinc-900/50">
                                    <Barbell className="w-8 h-8 text-zinc-700 mx-auto mb-2" weight="duotone" />
                                    <p className="text-zinc-500 text-sm">No hay ejercicios. Agrega uno para comenzar.</p>
                                </div>
                            )}

                            {formData.blocks.map((block, idx) => (
                                <div key={idx} className={cn(
                                    "p-4 rounded-lg flex flex-col gap-4 relative group transition-colors hover:z-[60] focus-within:z-[60] border",
                                    block.type === "loop_start"
                                        ? "bg-amber-500/5 border-amber-500/30"
                                        : block.type === "loop_end"
                                            ? "bg-amber-950/20 border-amber-900/40"
                                            : "bg-black/40 border-white/5 hover:border-white/10"
                                )}>
                                    <div className="absolute right-2 top-2">
                                        <button
                                            type="button"
                                            onClick={() => removeBlock(idx)}
                                            className="p-1 text-zinc-600 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" weight="bold" />
                                        </button>
                                    </div>

                                    {block.type === "loop_start" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end pr-8">
                                            <div className="md:col-span-2">
                                                <div className="flex items-center gap-2 text-amber-500 mb-2">
                                                    <ArrowCounterClockwise className="w-4 h-4" weight="bold" />
                                                    <span className="text-xs font-black uppercase tracking-widest">Inicio de Loop</span>
                                                </div>
                                                <p className="text-[10px] text-zinc-500">Los ejercicios después de este bloque se repetirán.</p>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-amber-500/70 uppercase block mb-1 font-bold">REPETICIONES (Series del Loop)</label>
                                                <input
                                                    type="number"
                                                    value={block.loop_count}
                                                    onChange={e => updateBlock(idx, "loop_count", Number(e.target.value))}
                                                    className="w-full bg-zinc-900 border border-amber-500/30 rounded p-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                                                    min={2}
                                                />
                                            </div>
                                        </div>
                                    ) : block.type === "loop_end" ? (
                                        <div className="flex items-center gap-2 text-amber-700">
                                            <ArrowCounterClockwise className="w-4 h-4" weight="bold" />
                                            <span className="text-xs font-black uppercase tracking-widest">Fin de Loop</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8">
                                                <div className="md:col-span-2">
                                                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">Nombre Ejercicio</label>
                                                    <StrictCombobox
                                                        value={block.exercise_name}
                                                        onChange={(val) => updateBlock(idx, "exercise_name", val)}
                                                        placeholder="Buscar en BD..."
                                                        className="z-50"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">Series (Sets)</label>
                                                    <input
                                                        type="number"
                                                        value={block.sets}
                                                        onChange={e => updateBlock(idx, "sets", Number(e.target.value))}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-white focus:border-kuma-gold/50 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">
                                                        {block.measure_type === "time" ? "Duración (seg)" : "Repeticiones"}
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="number"
                                                            value={block.reps}
                                                            onChange={e => updateBlock(idx, "reps", Number(e.target.value))}
                                                            className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-white focus:border-kuma-gold/50 focus:outline-none"
                                                        />
                                                        <select
                                                            value={block.measure_type || "reps"}
                                                            onChange={e => updateBlock(idx, "measure_type", e.target.value as any)}
                                                            className="w-24 bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white uppercase focus:border-kuma-gold/50 focus:outline-none"
                                                        >
                                                            <option value="reps">Reps</option>
                                                            <option value="time">Tiempo</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">Descanso (seg)</label>
                                                    <input
                                                        type="number"
                                                        value={block.rest_seconds}
                                                        onChange={e => updateBlock(idx, "rest_seconds", Number(e.target.value))}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-white focus:border-kuma-gold/50 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </div >

            {/* --- FLOATING ACTIONS FOOTER --- */}
            < div className="fixed md:sticky bottom-0 inset-x-0 p-4 bg-zinc-900/90 backdrop-blur-xl border-t border-white/10 flex flex-wrap justify-between items-center gap-4 z-50 rounded-b-xl" >
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        onClick={addLoopStart}
                        className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-500 text-[10px] h-10 border border-amber-600/30"
                    >
                        <Plus className="w-3 h-3 mr-1" weight="bold" /> Iniciar Loop
                    </Button>
                    <Button
                        type="button"
                        onClick={addLoopEnd}
                        className="bg-amber-900/20 hover:bg-amber-900/40 text-amber-700 text-[10px] h-10 border border-amber-900/30"
                    >
                        <Plus className="w-3 h-3 mr-1" weight="bold" /> Fin Loop
                    </Button>
                    <Button
                        type="button"
                        onClick={addBlock}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] h-10 px-4 shadow-lg border border-white/5"
                    >
                        <Plus className="w-4 h-4 mr-2" weight="bold" /> Agregar Ejercicio
                    </Button>
                </div>

                <div className="flex gap-4 ml-auto">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 rounded-xl bg-gradient-to-b from-zinc-700 to-zinc-800 text-white font-bold border-b-4 border-zinc-950 hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={(e: React.MouseEvent) => handleSubmit(e as any)}
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl bg-gradient-to-b from-kuma-gold to-amber-500 text-black font-black uppercase tracking-wider border-b-4 border-amber-700 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 text-sm"
                    >
                        {isLoading ? <Spinner className="mr-2 h-5 w-5 animate-spin" weight="bold" /> : <FloppyDisk className="mr-2 h-5 w-5" weight="duotone" />}
                        {initialData?._id ? "Guardar Cambios" : "Crear Rutina"}
                    </button>
                </div>
            </div >
        </motion.div >
    );
}
