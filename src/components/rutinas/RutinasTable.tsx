"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    MagnifyingGlass,
    ArrowsDownUp,
    PlayCircle,
    Barbell,
    Timer,
    ChartBar,
    Heart,
    X,
    Funnel,
    Lightning,
    ArrowRight,
    CheckCircle,
    Package,
    User,
} from "@phosphor-icons/react/dist/ssr";
import { toggleFavoriteRoutine, getFavoriteRoutines } from "@/lib/actions/favorites";

interface IRoutineSummary {
    _id: string;
    title: string;
    description: string;
    difficulty: "Principiante" | "Intermedio" | "Avanzado";
    estimated_duration: number;
    equipment_types: string[];
    blocks: any[];
    active: boolean;
    thumbnail?: string;
}

interface RutinasTableProps {
    data: IRoutineSummary[];
}

type DifficultyFilter = "all" | "Principiante" | "Intermedio" | "Avanzado";
type EquipmentFilter = "all" | "equipo" | "peso_corporal";
type DurationFilter = "all" | "short" | "medium" | "long";

// --------------- Preview Modal ---------------
function RoutinePreviewModal({
    routine,
    onClose,
    isFavorite,
    onToggleFavorite,
}: {
    routine: IRoutineSummary;
    onClose: () => void;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
}) {
    const equipmentLabel = () => {
        const has = (t: string) => routine.equipment_types?.includes(t);
        if (has("equipo") && has("peso_corporal")) return "Mixto";
        if (has("equipo")) return "Con Equipo";
        if (has("peso_corporal")) return "Peso Corporal";
        return "Sin Equipo";
    };

    const diffColor = {
        Principiante: "text-green-400 border-green-500/20 bg-green-500/10",
        Intermedio: "text-kuma-gold border-kuma-gold/20 bg-kuma-gold/10",
        Avanzado: "text-red-400 border-red-500/20 bg-red-500/10",
    }[routine.difficulty] ?? "text-zinc-400 border-zinc-700 bg-zinc-800/50";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            >
                {/* Top accent line */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-kuma-gold to-transparent" />

                {/* Decorative Difficulty Glow */}
                <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${routine.difficulty === "Principiante" ? "bg-green-500" :
                    routine.difficulty === "Intermedio" ? "bg-yellow-500" : "bg-red-600"
                    }`} />

                <div className="p-8 relative">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                                <Barbell className="w-6 h-6 text-kuma-gold" weight="duotone" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${diffColor}`}>
                                {routine.difficulty}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Favorite Button */}
                            <button
                                onClick={() => onToggleFavorite(routine._id)}
                                className={`p-2.5 rounded-xl border transition-all ${isFavorite
                                    ? "bg-red-500/20 border-red-500/40 text-red-400"
                                    : "bg-white/5 border-white/10 text-zinc-500 hover:text-red-400 hover:border-red-500/30"
                                    }`}
                                title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                            >
                                <Heart className="w-5 h-5" weight={isFavorite ? "fill" : "regular"} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tight mb-3">
                        {routine.title}
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                        {routine.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                            <Timer className="w-5 h-5 text-cyan-400 mx-auto mb-2" weight="duotone" />
                            <div className="text-2xl font-black text-white tabular-nums">{routine.estimated_duration}</div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Min</div>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                            <ChartBar className="w-5 h-5 text-kuma-gold mx-auto mb-2" weight="duotone" />
                            <div className="text-2xl font-black text-white tabular-nums">{routine.blocks?.length ?? 0}</div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Bloques</div>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                            <Package className="w-5 h-5 text-purple-400 mx-auto mb-2" weight="duotone" />
                            <div className="text-sm font-black text-white mt-1">{equipmentLabel()}</div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Equipo</div>
                        </div>
                    </div>

                    {/* Blocks preview — first 5 */}
                    {routine.blocks && routine.blocks.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Ejercicios</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {routine.blocks.slice(0, 6).map((block: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5">
                                        <div className="w-5 h-5 bg-kuma-gold/20 text-kuma-gold rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <span className="text-sm text-zinc-300 font-medium flex-1 truncate">
                                            {block.exercise_name || block.type || "Ejercicio"}
                                        </span>
                                        {block.sets && (
                                            <span className="text-[10px] text-zinc-600 font-bold flex-shrink-0">
                                                {block.sets} SETS
                                            </span>
                                        )}
                                    </div>
                                ))}
                                {routine.blocks.length > 6 && (
                                    <div className="text-center text-xs text-zinc-600 py-2">
                                        +{routine.blocks.length - 6} más dentro del player
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <Link href={`/routines/${routine._id}`} className="block">
                        <button className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 hover:bg-kuma-gold transition-all shadow-[0_10px_30px_-5px_rgba(255,255,255,0.2)] group">
                            <Lightning className="w-5 h-5" weight="fill" />
                            Iniciar Entrenamiento
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --------------- Main Component ---------------
export function RutinasTable({ data }: RutinasTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof IRoutineSummary | null; direction: "asc" | "desc" }>({
        key: null,
        direction: "asc",
    });
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Responsive check to force grid on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setViewMode("grid");
            }
        };
        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Filters
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
    const [equipmentFilter, setEquipmentFilter] = useState<EquipmentFilter>("all");
    const [durationFilter, setDurationFilter] = useState<DurationFilter>("all");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    // Preview modal
    const [previewRoutine, setPreviewRoutine] = useState<IRoutineSummary | null>(null);

    // Favorites
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isPendingFav, startFavTransition] = useTransition();

    useEffect(() => {
        getFavoriteRoutines().then((res) => {
            if (res.success && res.favorites) setFavorites(res.favorites);
        });
    }, []);

    const handleToggleFavorite = (routineId: string) => {
        // Optimistic update
        setFavorites((prev) =>
            prev.includes(routineId)
                ? prev.filter((id) => id !== routineId)
                : [...prev, routineId]
        );
        startFavTransition(async () => {
            const res = await toggleFavoriteRoutine(routineId);
            if (res.success && res.favorites) setFavorites(res.favorites);
        });
    };

    const requestSort = (key: keyof IRoutineSummary) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof IRoutineSummary) => {
        if (sortConfig.key !== key) return <ArrowsDownUp className="w-3 h-3 opacity-30" weight="duotone" />;
        return <ArrowsDownUp className={`w-3 h-3 ${sortConfig.direction === "asc" ? "text-kuma-gold" : "text-white"}`} weight="duotone" />;
    };

    const getDifficultyBadge = (diff: string) => {
        const styles = {
            Principiante: "bg-green-500/10 text-green-500 border-green-500/20",
            Intermedio: "bg-kuma-gold/10 text-kuma-gold border-kuma-gold/20",
            Avanzado: "bg-red-500/10 text-red-500 border-red-500/20",
        };
        const active = styles[diff as keyof typeof styles] || styles.Intermedio;
        return (
            <span className={`px-2 py-1 rounded text-[10px] uppercase font-black tracking-wider border ${active}`}>
                {diff}
            </span>
        );
    };

    const getEquipmentBadge = (eq: string[]) => {
        const has = (t: string) => eq?.includes(t);
        if (has("equipo") && has("peso_corporal")) return <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded uppercase font-bold tracking-wider">Mixto</span>;
        if (has("equipo")) return <span className="text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded uppercase font-bold tracking-wider">Equipo</span>;
        if (has("peso_corporal")) return <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded uppercase font-bold tracking-wider">Peso Corporal</span>;
        return <span className="text-[10px] text-zinc-600">-</span>;
    };

    // ----- FILTER + SORT -----
    const filteredData = useMemo(() => {
        let processed = [...data];

        // Favorites only
        if (showFavoritesOnly) {
            processed = processed.filter((r) => favorites.includes(r._id));
        }

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            processed = processed.filter(
                (item) =>
                    item.title.toLowerCase().includes(q) ||
                    item.description.toLowerCase().includes(q)
            );
        }

        // Difficulty
        if (difficultyFilter !== "all") {
            processed = processed.filter((r) => r.difficulty === difficultyFilter);
        }

        // Equipment
        if (equipmentFilter !== "all") {
            processed = processed.filter((r) => r.equipment_types?.includes(equipmentFilter));
        }

        // Duration
        if (durationFilter === "short") processed = processed.filter((r) => r.estimated_duration < 15);
        if (durationFilter === "medium") processed = processed.filter((r) => r.estimated_duration >= 15 && r.estimated_duration <= 30);
        if (durationFilter === "long") processed = processed.filter((r) => r.estimated_duration > 30);

        // Sort
        if (sortConfig.key) {
            processed.sort((a, b) => {
                const aV = a[sortConfig.key!] ?? "";
                const bV = b[sortConfig.key!] ?? "";
                if (aV === bV) return 0;
                if (sortConfig.direction === "asc") return aV < bV ? -1 : 1;
                return aV > bV ? -1 : 1;
            });
        }

        // Favorites first
        processed.sort((a, b) => {
            const aFav = favorites.includes(a._id) ? 0 : 1;
            const bFav = favorites.includes(b._id) ? 0 : 1;
            return aFav - bFav;
        });

        return processed;
    }, [data, searchQuery, sortConfig, difficultyFilter, equipmentFilter, durationFilter, showFavoritesOnly, favorites]);

    const activeFiltersCount = [
        difficultyFilter !== "all",
        equipmentFilter !== "all",
        durationFilter !== "all",
        showFavoritesOnly,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setDifficultyFilter("all");
        setEquipmentFilter("all");
        setDurationFilter("all");
        setShowFavoritesOnly(false);
        setSearchQuery("");
    };

    // Filter chip helper
    const FilterChip = ({
        label,
        active,
        onClick,
        color = "zinc",
    }: {
        label: string;
        active: boolean;
        onClick: () => void;
        color?: "zinc" | "green" | "yellow" | "red" | "purple" | "cyan" | "rose";
    }) => {
        const colorMap: Record<string, string> = {
            zinc: "border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white",
            green: "border-green-500/30 text-green-400 bg-green-500/10",
            yellow: "border-kuma-gold/30 text-kuma-gold bg-kuma-gold/10",
            red: "border-red-500/30 text-red-400 bg-red-500/10",
            purple: "border-purple-500/30 text-purple-400 bg-purple-500/10",
            cyan: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
            rose: "border-rose-500/30 text-rose-400 bg-rose-500/10",
        };
        return (
            <button
                onClick={onClick}
                className={`px-4 py-2 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all
                    ${active ? colorMap[color] : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300 bg-transparent"}`}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="w-full space-y-8">
            {/* --- CONTROLS HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Search Bar */}
                <div className="relative w-full md:w-[28rem] group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
                    <div className="relative bg-black rounded-2xl flex items-center">
                        <MagnifyingGlass className="absolute left-4 w-5 h-5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="BUSCAR ENTRENAMIENTO..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white font-bold placeholder:text-zinc-700 focus:ring-0 uppercase tracking-wider"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-4 text-zinc-600 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Side: Toggle + Count */}
                <div className="flex items-center gap-4">
                    {/* View Toggle - Hidden on Mobile */}
                    <div className="hidden md:flex bg-zinc-950 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}
                            title="Vista de Lista"
                        >
                            <ArrowsDownUp className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}
                            title="Vista de Galería"
                        >
                            <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px]" />
                                <div className="bg-current rounded-[1px]" />
                            </div>
                        </button>
                    </div>

                    <div className="px-4 py-2 bg-zinc-900 rounded-lg border border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden md:block">
                        {filteredData.length} RUTINAS
                    </div>
                </div>
            </div>

            {/* --- FILTER BAR --- */}
            <div className="flex flex-col gap-4 p-5 bg-zinc-900/40 border border-white/5 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                        <Funnel className="w-4 h-4" weight="fill" />
                        Filtros
                        {activeFiltersCount > 0 && (
                            <span className="w-5 h-5 bg-kuma-gold text-black rounded-full flex items-center justify-center text-[10px] font-black">
                                {activeFiltersCount}
                            </span>
                        )}
                    </div>
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="text-[10px] text-zinc-600 hover:text-white transition-colors uppercase tracking-widest font-bold"
                        >
                            Limpiar todo
                        </button>
                    )}
                </div>

                {/* Filter rows */}
                <div className="flex flex-wrap gap-3">
                    {/* Favorites */}
                    <FilterChip
                        label={`❤️ Favoritos${favorites.length > 0 ? ` (${favorites.length})` : ""}`}
                        active={showFavoritesOnly}
                        onClick={() => setShowFavoritesOnly((v) => !v)}
                        color="rose"
                    />

                    <div className="w-px bg-white/10 hidden md:block" />

                    {/* Difficulty */}
                    <FilterChip label="Todos" active={difficultyFilter === "all"} onClick={() => setDifficultyFilter("all")} />
                    <FilterChip label="Principiante" active={difficultyFilter === "Principiante"} onClick={() => setDifficultyFilter("Principiante")} color="green" />
                    <FilterChip label="Intermedio" active={difficultyFilter === "Intermedio"} onClick={() => setDifficultyFilter("Intermedio")} color="yellow" />
                    <FilterChip label="Avanzado" active={difficultyFilter === "Avanzado"} onClick={() => setDifficultyFilter("Avanzado")} color="red" />

                    <div className="w-px bg-white/10 hidden md:block" />

                    {/* Equipment */}
                    <FilterChip label="Peso Corporal" active={equipmentFilter === "peso_corporal"} onClick={() => setEquipmentFilter(equipmentFilter === "peso_corporal" ? "all" : "peso_corporal")} color="green" />
                    <FilterChip label="Con Equipo" active={equipmentFilter === "equipo"} onClick={() => setEquipmentFilter(equipmentFilter === "equipo" ? "all" : "equipo")} color="purple" />

                    <div className="w-px bg-white/10 hidden md:block" />

                    {/* Duration */}
                    <FilterChip label="< 15 min" active={durationFilter === "short"} onClick={() => setDurationFilter(durationFilter === "short" ? "all" : "short")} color="cyan" />
                    <FilterChip label="15-30 min" active={durationFilter === "medium"} onClick={() => setDurationFilter(durationFilter === "medium" ? "all" : "medium")} color="cyan" />
                    <FilterChip label="> 30 min" active={durationFilter === "long"} onClick={() => setDurationFilter(durationFilter === "long" ? "all" : "long")} color="cyan" />
                </div>
            </div>

            {/* --- VIEW CONTENT --- */}
            <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                    /* --- GRID VIEW --- */
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                    >
                        {filteredData.map((routine, idx) => {
                            const isFav = favorites.includes(routine._id);
                            return (
                                <motion.div
                                    key={routine._id}
                                    layout
                                    transition={{ type: "spring", duration: 0.5, delay: idx * 0.05 }}
                                    className="group relative"
                                >
                                    <div className="h-full relative bg-zinc-900 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]">
                                        <div className={`absolute inset-0 bg-gradient-to-br opacity-40 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-60 ${routine.difficulty === "Principiante" ? "from-green-900 to-black" : routine.difficulty === "Intermedio" ? "from-yellow-900 to-black" : "from-red-900 to-black"}`} />
                                        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10" />

                                        {/* Favorite star badge */}
                                        {isFav && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/20 border border-red-500/40 text-red-400 flex items-center gap-1">
                                                    <Heart className="w-3 h-3" weight="fill" /> Favorito
                                                </span>
                                            </div>
                                        )}

                                        <div className="relative p-8 flex flex-col h-full min-h-[320px]">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                                                    <Barbell className="w-8 h-8" weight="duotone" />
                                                </div>
                                                {getDifficultyBadge(routine.difficulty)}
                                            </div>
                                            <div className="mb-auto">
                                                <h3 className="text-2xl font-black text-white leading-tight mb-2 uppercase italic tracking-tight group-hover:text-cyan-200 transition-colors">{routine.title}</h3>
                                                <p className="text-sm text-zinc-400 font-medium leading-relaxed line-clamp-2">{routine.description}</p>
                                            </div>
                                            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1"><Timer className="w-4 h-4" /> Duración</div>
                                                    <div className="text-xl font-bold text-white tabular-nums">{routine.estimated_duration} m</div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1"><ChartBar className="w-4 h-4" /> Bloques</div>
                                                    <div className="text-xl font-bold text-white tabular-nums">{routine.blocks?.length || 0}</div>
                                                </div>
                                            </div>
                                            {/* Actions */}
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => setPreviewRoutine(routine)}
                                                    className="flex-1 h-10 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                                >
                                                    Vista Previa
                                                </button>
                                                <button
                                                    onClick={() => handleToggleFavorite(routine._id)}
                                                    className={`h-10 w-10 flex-shrink-0 rounded-xl border transition-all flex items-center justify-center ${isFav ? "bg-red-500/20 border-red-500/40 text-red-400" : "bg-white/5 border-white/10 text-zinc-500 hover:text-red-400"}`}
                                                >
                                                    <Heart className="w-4 h-4" weight={isFav ? "fill" : "regular"} />
                                                </button>
                                                <Link href={`/routines/${routine._id}`} className="flex-1">
                                                    <button className="w-full h-10 bg-transparent hover:bg-white text-white hover:text-black border border-white/20 hover:border-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1">
                                                        <PlayCircle className="w-4 h-4" weight="duotone" />
                                                        Iniciar
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    /* --- LIST VIEW --- */
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl"
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black">
                                    <th className="p-6 cursor-pointer hover:text-white hover:bg-white/5 transition-colors" onClick={() => requestSort("title")}><div className="flex items-center gap-2">Rutina {getSortIcon("title")}</div></th>
                                    <th className="p-6 cursor-pointer hover:text-white hover:bg-white/5 transition-colors" onClick={() => requestSort("difficulty")}><div className="flex items-center gap-2">Nivel {getSortIcon("difficulty")}</div></th>
                                    <th className="p-6 cursor-pointer hover:text-white hover:bg-white/5 transition-colors" onClick={() => requestSort("estimated_duration")}><div className="flex items-center gap-2">Tiempo {getSortIcon("estimated_duration")}</div></th>
                                    <th className="p-6 hidden md:table-cell">Equipo</th>
                                    <th className="p-6 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredData.map((routine, idx) => {
                                    const isFav = favorites.includes(routine._id);
                                    return (
                                        <motion.tr
                                            key={routine._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                            className="group hover:bg-white/[0.03] transition-colors relative"
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    {/* Neon difficulty bar */}
                                                    <div className={`w-1 h-12 rounded-full shadow-[0_0_10px_2px_currentColor] transition-colors duration-300
                                                        ${routine.difficulty === "Principiante" ? "text-green-500 bg-green-500" :
                                                            routine.difficulty === "Intermedio" ? "text-yellow-500 bg-yellow-500" :
                                                                "text-red-600 bg-red-600"}`}
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-lg font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-200 transition-all uppercase italic">
                                                                {routine.title}
                                                            </h3>
                                                            {isFav && <Heart className="w-4 h-4 text-red-400" weight="fill" />}
                                                        </div>
                                                        <p className="text-xs text-zinc-500 font-medium max-w-md truncate group-hover:text-zinc-400">
                                                            {routine.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">{getDifficultyBadge(routine.difficulty)}</td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-zinc-400 font-bold tabular-nums">
                                                    <Timer className="w-5 h-5 text-zinc-600 group-hover:text-cyan-500 transition-colors" weight="duotone" />
                                                    {routine.estimated_duration} min
                                                </div>
                                            </td>
                                            <td className="p-6 hidden md:table-cell">
                                                {getEquipmentBadge(routine.equipment_types)}
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Favorite button */}
                                                    <button
                                                        onClick={() => handleToggleFavorite(routine._id)}
                                                        className={`p-2 rounded-lg border transition-all ${isFav
                                                            ? "bg-red-500/20 border-red-500/30 text-red-400"
                                                            : "bg-white/5 border-white/10 text-zinc-600 hover:text-red-400 hover:border-red-500/30"
                                                            }`}
                                                        title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                                                    >
                                                        <Heart className="w-4 h-4" weight={isFav ? "fill" : "regular"} />
                                                    </button>
                                                    {/* Preview button */}
                                                    <button
                                                        onClick={() => setPreviewRoutine(routine)}
                                                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 text-xs font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Vista Previa
                                                    </button>
                                                    {/* Start button */}
                                                    <Link href={`/routines/${routine._id}`}>
                                                        <button className="bg-transparent hover:bg-white text-white hover:text-black border border-white/20 hover:border-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center gap-2 group/btn">
                                                            <PlayCircle className="w-5 h-5 group-hover/btn:fill-black" weight="duotone" />
                                                            Iniciar
                                                        </button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EMPTY STATE */}
            {filteredData.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-white/5">
                        <MagnifyingGlass className="w-10 h-10 text-zinc-700" weight="duotone" />
                    </div>
                    <h3 className="text-2xl font-black text-zinc-800 uppercase tracking-tighter">Sin Resultados</h3>
                    <p className="text-zinc-600 font-medium mb-4">
                        {showFavoritesOnly ? "No tienes rutinas marcadas como favoritas aún." : "No encontramos rutinas para tu búsqueda."}
                    </p>
                    {activeFiltersCount > 0 && (
                        <button onClick={clearFilters} className="text-xs text-kuma-gold hover:text-white transition-colors font-bold uppercase tracking-widest">
                            Limpiar filtros
                        </button>
                    )}
                </div>
            )}

            <div className="text-center py-12">
                <p className="text-[10px] text-zinc-800 font-mono tracking-[0.5em] uppercase">Kuma Dojo Systems v2.0</p>
            </div>

            {/* ---- PREVIEW MODAL ---- */}
            <AnimatePresence>
                {previewRoutine && (
                    <RoutinePreviewModal
                        routine={previewRoutine}
                        onClose={() => setPreviewRoutine(null)}
                        isFavorite={favorites.includes(previewRoutine._id)}
                        onToggleFavorite={handleToggleFavorite}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
