"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { SwipeBackWrapper } from "@/components/admin/AdminNavigation";
import { Button } from "@/components/ui/Button";
import { Loader2, Search, User, ClipboardCheck, Calendar, Info, Check, Clock, UserX, Sparkles, CheckCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Actions
import { getAthletesForAttendance, getAttendanceForDate, submitAttendanceForDate } from "@/lib/actions/attendance";

interface AttendanceRecord {
    userId: string;
    status: "Presente" | "Tarde" | "Ausente";
}

export default function AdminAttendancePage() {
    const { data: session } = useSession();

    interface AthleteAttendanceState {
        status: "Presente" | "Tarde" | "Ausente";
        sessions: string[];
        performance?: "Standard" | "Destacado" | "Elite" | "1" | "2" | "3" | "4" | "5";
        isMVP?: boolean;
    }

    const [athletes, setAthletes] = useState<any[]>([]);
    const [attendanceMap, setAttendanceMap] = useState<Record<string, AthleteAttendanceState>>({});
    const [globalSessions, setGlobalSessions] = useState<string[]>([]);
    const [isLoadingAthletes, setIsLoadingAthletes] = useState(true);
    const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
    const isLoading = isLoadingAthletes || isLoadingAttendance;
    const [isSaving, setIsSaving] = useState(false);
    const [alertModal, setAlertModal] = useState<{
        isOpen: boolean;
        type: "success" | "error";
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
    });
    
    // Filters
    const [selectedDate, setSelectedDate] = useState("");
    
    // Initialize to today's local date on mount to avoid hydration mismatch
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        setSelectedDate(`${year}-${month}-${day}`);
    }, []);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    // Debounce search input — avoids blocking the main thread on every keystroke
    // by delaying the expensive grid re-render (Framer Motion layout on N cards)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
        return () => clearTimeout(timer);
    }, [searchTerm]);
    const [selectedSpec, setSelectedSpec] = useState<"Todos" | "Kata" | "Kumite" | "Ambos">("Todos");
    const [selectedDojo, setSelectedDojo] = useState<string>("Todos");

    // Force select dojo if logged in user is a Dojo admin
    useEffect(() => {
        if (session?.user?.role === "admin" && session?.user?.dojo) {
            setSelectedDojo(session.user.dojo);
        }
    }, [session]);
    
    // Load initial athletes
    const loadAthletes = async () => {
        setIsLoadingAthletes(true);
        const data = await getAthletesForAttendance();
        setAthletes(data);
        setIsLoadingAthletes(false);
    };

    useEffect(() => {
        loadAthletes();
    }, []);

    // Load attendance records for the active date
    const loadDailyAttendance = useCallback(async () => {
        if (!selectedDate) return;
        
        setIsLoadingAttendance(true);
        const logs = await getAttendanceForDate(selectedDate);
        
        // Build initial map, defaulting everyone else to Ausente
        const newMap: Record<string, AthleteAttendanceState> = {};
        
        // Map fetched logs and collect existing sessions to populate global state
        const uniqueSessions = new Set<string>();
        logs.forEach((log: any) => {
            newMap[log.userId] = {
                status: log.status,
                sessions: log.sessions || [],
                performance: log.performance || "Standard",
                isMVP: log.isMVP || false,
            };
            if (log.sessions && (log.status === "Presente" || log.status === "Tarde")) {
                log.sessions.forEach((s: string) => uniqueSessions.add(s));
            }
        });
        
        setGlobalSessions(Array.from(uniqueSessions));
        setAttendanceMap(newMap);
        setIsLoadingAttendance(false);
    }, [selectedDate]);

    useEffect(() => {
        loadDailyAttendance();
    }, [selectedDate, loadDailyAttendance]);

    // Handle status change for an individual athlete
    const handleStatusChange = (userId: string, newStatus: "Presente" | "Tarde" | "Ausente") => {
        setAttendanceMap((prev) => {
            const existing = prev[userId] || { status: "Ausente", sessions: [], performance: "Standard", isMVP: false };
            return {
                ...prev,
                [userId]: {
                    status: newStatus,
                    // If changing to present/tardy and sessions are empty, inherit global sessions
                    sessions: newStatus === "Ausente" 
                        ? [] 
                        : (existing.sessions.length === 0 ? [...globalSessions] : existing.sessions),
                    performance: existing.performance || "Standard",
                    isMVP: newStatus === "Ausente" ? false : (existing.isMVP || false),
                }
            };
        });
    };

    // Refs to track touch gestures (Double Tap & Long Press)
    const lastTapRef = useRef<{ time: number; userId: string }>({ time: 0, userId: "" });
    const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const isLongPressActiveRef = useRef<boolean>(false);

    const handleTouchStart = (userId: string, currentStatus: "Presente" | "Tarde" | "Ausente", e: React.TouchEvent) => {
        // Prevent starting long press on multi-touch
        if (e.touches.length > 1) {
            cancelLongPress();
            return;
        }

        const touch = e.touches[0];
        touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
        isLongPressActiveRef.current = false;

        // --- Double Tap Detection ---
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        const lastTap = lastTapRef.current;

        if (lastTap.userId === userId && (now - lastTap.time) < DOUBLE_TAP_DELAY) {
            handleStatusChange(userId, currentStatus === "Presente" ? "Ausente" : "Presente");
            triggerHapticFeedback();
            lastTapRef.current = { time: 0, userId: "" };
            cancelLongPress();
            return;
        }

        lastTapRef.current = { time: now, userId };

        // --- Long Press Detection ---
        longPressTimeoutRef.current = setTimeout(() => {
            isLongPressActiveRef.current = true;
            handleStatusChange(userId, currentStatus === "Presente" ? "Ausente" : "Presente");
            triggerHapticFeedback();
        }, 500); // 500ms
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!longPressTimeoutRef.current) return;
        
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartPosRef.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartPosRef.current.y);

        if (deltaX > 10 || deltaY > 10) {
            cancelLongPress();
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (isLongPressActiveRef.current) {
            e.preventDefault();
        }
        cancelLongPress();
    };

    const cancelLongPress = () => {
        if (longPressTimeoutRef.current) {
            clearTimeout(longPressTimeoutRef.current);
            longPressTimeoutRef.current = null;
        }
    };

    const triggerHapticFeedback = () => {
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            try {
                window.navigator.vibrate(50);
            } catch (err) {
                // Ignore vibration errors
            }
        }
    };

    // Handle performance change for an individual athlete
    const handlePerformanceChange = (userId: string, newPerformance: AthleteAttendanceState["performance"]) => {
        setAttendanceMap((prev) => {
            const existing = prev[userId] || { status: "Presente", sessions: [], performance: "Standard", isMVP: false };
            return {
                ...prev,
                [userId]: {
                    ...existing,
                    performance: newPerformance,
                }
            };
        });
    };

    // Handle Daily MVP Toggle (max 1 MVP per day)
    const handleMVPToggle = (userId: string) => {
        setAttendanceMap((prev) => {
            const updated = { ...prev };
            const wasMVP = !!updated[userId]?.isMVP;
            
            // First, clear isMVP for everyone
            Object.keys(updated).forEach((uid) => {
                updated[uid] = {
                    ...updated[uid],
                    isMVP: false,
                };
            });
            
            // If it wasn't MVP before, set this athlete as MVP
            if (!wasMVP && updated[userId]) {
                updated[userId].isMVP = true;
            }
            
            return updated;
        });
    };

    // Toggle session selection for an individual athlete
    const handleSessionToggle = (userId: string, session: string) => {
        setAttendanceMap((prev) => {
            const existing = prev[userId] || { status: "Presente", sessions: [] };
            const hasSession = existing.sessions.includes(session);
            const newSessions = hasSession
                ? existing.sessions.filter((s) => s !== session)
                : [...existing.sessions, session];
            return {
                ...prev,
                [userId]: {
                    ...existing,
                    sessions: newSessions,
                }
            };
        });
    };

    // Toggle global sessions and propagate to all present/tarde athletes
    const handleGlobalSessionToggle = (session: string) => {
        const isAdding = !globalSessions.includes(session);
        const nextGlobal = isAdding 
            ? [...globalSessions, session] 
            : globalSessions.filter(s => s !== session);
            
        setGlobalSessions(nextGlobal);
        
        setAttendanceMap((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((userId) => {
                const state = updated[userId];
                if (state.status === "Presente" || state.status === "Tarde") {
                    const hasSession = state.sessions.includes(session);
                    if (isAdding && !hasSession) {
                        updated[userId] = {
                            ...state,
                            sessions: [...state.sessions, session],
                        };
                    } else if (!isAdding && hasSession) {
                        updated[userId] = {
                            ...state,
                            sessions: state.sessions.filter(s => s !== session),
                        };
                    }
                }
            });
            return updated;
        });
    };

    // Bulk actions
    const markAllPresent = () => {
        const updatedMap = { ...attendanceMap };
        filteredAthletes.forEach((ath) => {
            const existing = updatedMap[ath._id] || { status: "Ausente", sessions: [], performance: "Standard", isMVP: false };
            updatedMap[ath._id] = {
                status: "Presente",
                sessions: existing.sessions.length === 0 ? [...globalSessions] : existing.sessions,
                performance: existing.performance || "Standard",
                isMVP: existing.isMVP || false,
            };
        });
        setAttendanceMap(updatedMap);
    };

    const markAllAbsent = () => {
        const updatedMap = { ...attendanceMap };
        filteredAthletes.forEach((ath) => {
            updatedMap[ath._id] = {
                status: "Ausente",
                sessions: [],
                performance: "Standard",
                isMVP: false,
            };
        });
        setAttendanceMap(updatedMap);
    };

    // Save attendance to backend
    const handleSaveAttendance = async () => {
        setIsSaving(true);
        
        // Prepare records array
        const records = athletes.map((ath) => {
            const state = attendanceMap[ath._id] || { status: "Ausente", sessions: [], performance: "Standard", isMVP: false };
            return {
                userId: ath._id,
                status: state.status,
                sessions: state.sessions as any[],
                performance: state.performance || "Standard",
                isMVP: !!state.isMVP,
            };
        });

        const res = await submitAttendanceForDate(selectedDate, records);
        setIsSaving(false);

        if (res.success) {
            // High-end Confetti burst!
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ["#ffd700", "#10b981", "#ef4444", "#ffffff"],
            });
            setAlertModal({
                isOpen: true,
                type: "success",
                title: "¡Guardado Exitoso!",
                message: "La lista de asistencia del día se ha guardado con éxito. Se actualizaron los perfiles y estadísticas de Kaizen de los atletas.",
            });
            loadDailyAttendance();
        } else {
            setAlertModal({
                isOpen: true,
                type: "error",
                title: "Error de Guardado",
                message: res.error || "Ocurrió un error inesperado al intentar guardar la asistencia del día.",
            });
        }
    };

    // Filter athletes in client side
    const filteredAthletes = athletes.filter((ath) => {
        const matchesSearch = ath.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                              ath.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        
        const matchesSpec = selectedSpec === "Todos" ||
                            ath.athleteProfile.specialization === selectedSpec ||
                            ath.athleteProfile.specialization === "Ambos";

        const dojo = ath.athleteProfile?.dojo;
        const dojoId = dojo?._id || "6a10ba00936f06f14847fd05";
        const matchesDojo = selectedDojo === "Todos" || dojoId === selectedDojo;
                            
        return matchesSearch && matchesSpec && matchesDojo;
    });

    // Helper for OVR Card color themes
    const getFUTStyles = (rating: number) => {
        if (rating >= 75) {
            return {
                bgCard: "from-[#fceb92] via-[#e5c060] to-[#b38930]",
                borderClass: "border-[#e5c060]",
                glowClass: "shadow-[0_0_20px_rgba(212,175,55,0.3)]",
                textColor: "text-[#8d691e]",
                beltBadge: "bg-[#8d691e]/15 text-[#8d691e]",
            };
        }
        if (rating >= 65) {
            return {
                bgCard: "from-[#f1f5f9] via-[#cbd5e1] to-[#64748b]",
                borderClass: "border-[#cbd5e1]",
                glowClass: "shadow-[0_0_20px_rgba(148,163,184,0.2)]",
                textColor: "text-[#475569]",
                beltBadge: "bg-[#475569]/15 text-[#475569]",
            };
        }
        return {
            bgCard: "from-[#e07a3f] via-[#b45309] to-[#451a03]",
            borderClass: "border-[#b45309]",
            glowClass: "shadow-[0_0_20px_rgba(180,83,9,0.2)]",
            textColor: "text-[#ffd7a8]",
            beltBadge: "bg-[#451a03]/30 text-[#ffd7a8]",
        };
    };

    // Helper for belt names
    const getBeltBadgeColor = (belt: string) => {
        const rank = belt.toLowerCase();
        if (rank.includes("negro")) return "border-zinc-300 text-white bg-zinc-900 border";
        if (rank.includes("marrón") || rank.includes("marron")) return "border-amber-800 text-amber-500 bg-amber-950/40 border";
        if (rank.includes("morado")) return "border-purple-600 text-purple-400 bg-purple-950/40 border";
        if (rank.includes("azul")) return "border-blue-600 text-blue-400 bg-blue-950/40 border";
        if (rank.includes("verde")) return "border-green-600 text-green-400 bg-green-950/40 border";
        if (rank.includes("naranja")) return "border-orange-500 text-orange-400 bg-orange-950/40 border";
        if (rank.includes("amarillo")) return "border-yellow-500 text-yellow-400 bg-yellow-950/40 border";
        return "border-zinc-600 text-zinc-300 bg-zinc-800/40 border";
    };

    interface DojoSummaryItem {
        _id: string;
        name: string;
        logo?: string;
        present: number;
        tarde: number;
        absent: number;
    }

    // Calculate attendance summary grouped by Dojo
    const dojoSummaryMap = athletes.reduce<Record<string, DojoSummaryItem>>((acc, ath) => {
        const dojo = ath.athleteProfile?.dojo;
        const dojoId = dojo?._id || "6a10ba00936f06f14847fd05";
        const dojoName = dojo?.name || "DOJO KUMA";
        const dojoLogo = dojo?.logo || "/images/kuma-logo.jpg";
        const state = attendanceMap[ath._id] || { status: "Ausente" };
        
        if (!acc[dojoId]) {
            acc[dojoId] = {
                _id: dojoId,
                name: dojoName,
                logo: dojoLogo,
                present: 0,
                tarde: 0,
                absent: 0,
            };
        }
        
        if (state.status === "Presente") {
            acc[dojoId].present += 1;
        } else if (state.status === "Tarde") {
            acc[dojoId].tarde += 1;
        } else {
            acc[dojoId].absent += 1;
        }
        
        return acc;
    }, {});

    const dojoSummary: DojoSummaryItem[] = Object.values(dojoSummaryMap).sort((a: DojoSummaryItem, b: DojoSummaryItem) => 
        a.name.localeCompare(b.name)
    );

    return (
        <SwipeBackWrapper>
            <div className="max-w-7xl mx-auto py-8 px-4 pb-32">
                
                {/* Cabecera */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-widest mb-1 text-kuma-gold drop-shadow-lg flex items-center gap-3">
                            KUMA <span className="text-red-600">ASISTENCIA</span>
                        </h1>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <ClipboardCheck className="w-4 h-4 text-kuma-gold" /> Pase de Lista Express (Kaizen Training)
                        </p>
                    </div>
                </div>

                {/* Filtros de Sesión y Configuración */}
                <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 mb-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        {/* Selector de Fecha */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-red-500" /> Fecha del Entrenamiento
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-500 focus:outline-none transition-all shadow-inner"
                            />
                        </div>

                        {/* Sesiones del Día (Global) */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-kuma-gold" /> Sesiones del Día (Global)
                            </label>
                            <div className="flex flex-wrap gap-1 bg-zinc-900 p-1 border border-zinc-800 rounded-xl min-h-[46px] items-center">
                                {["Fuerza", "Explosión", "Técnica", "Kata", "Kumite"].map((sess) => {
                                    const isChecked = globalSessions.includes(sess);
                                    return (
                                        <button
                                            key={sess}
                                            onClick={() => handleGlobalSessionToggle(sess)}
                                            className={cn(
                                                "py-1.5 px-2 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer flex-1 min-h-[30px] flex items-center justify-center leading-none",
                                                isChecked
                                                    ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                                                    : "text-zinc-500 hover:text-zinc-350"
                                            )}
                                        >
                                            {sess}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selector de Dojo y Resumen */}
                        <div className="space-y-2 col-span-1">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <ClipboardCheck className="w-3.5 h-3.5 text-kuma-gold" /> Resumen Por Dojo
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Combo Box Selector */}
                                <div className="relative flex-1">
                                    <select
                                        value={selectedDojo}
                                        onChange={(e) => setSelectedDojo(e.target.value)}
                                        disabled={session?.user?.role === "admin" && !!session?.user?.dojo}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-500 focus:outline-none transition-all shadow-inner appearance-none pr-10 font-bold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {!(session?.user?.role === "admin" && session?.user?.dojo) && (
                                            <option value="Todos">Todos los Dojos</option>
                                        )}
                                        {dojoSummary.map((ds, index) => (
                                            <option key={`${ds._id}-${index}`} value={ds._id}>
                                                {ds.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Resumen del Dojo Seleccionado */}
                                <div className="flex items-center gap-2 bg-zinc-900/65 border border-zinc-800/80 rounded-xl px-3 py-2 text-xs font-bold min-h-[46px] sm:min-w-[170px] justify-center sm:justify-start">
                                    {selectedDojo === "Todos" ? (
                                        <div className="flex items-center gap-2 w-full">
                                            <div className="w-6 h-6 rounded-full bg-kuma-gold/10 flex items-center justify-center border border-kuma-gold/20 text-kuma-gold font-serif font-black text-[10px]">
                                                K
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-[8px] text-zinc-400 uppercase tracking-widest font-black leading-none">Global</span>
                                                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-extrabold leading-none">
                                                    <span className="text-emerald-500" title="Presentes">
                                                        {athletes.filter(a => (attendanceMap[a._id]?.status || "Ausente") === "Presente").length} OK
                                                    </span>
                                                    <span className="text-zinc-650">/</span>
                                                    <span className="text-amber-500" title="Tardes">
                                                        {athletes.filter(a => (attendanceMap[a._id]?.status || "Ausente") === "Tarde").length} T
                                                    </span>
                                                    <span className="text-zinc-650">/</span>
                                                    <span className="text-zinc-400" title="Faltas">
                                                        {athletes.filter(a => (attendanceMap[a._id]?.status || "Ausente") === "Ausente").length} F
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        (() => {
                                            const ds = dojoSummary.find(d => d._id === selectedDojo);
                                            if (!ds) return null;
                                            return (
                                                <div className="flex items-center gap-2 w-full">
                                                    <img 
                                                        src={ds.logo || "/images/kuma-logo.jpg"} 
                                                        alt={ds.name} 
                                                        className="w-6 h-6 rounded-full object-cover border border-zinc-800" 
                                                    />
                                                    <div className="flex flex-col flex-1">
                                                        <span className="text-[8px] text-zinc-400 uppercase tracking-widest font-black leading-none truncate max-w-[100px]" title={ds.name}>
                                                            {ds.name}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-extrabold leading-none">
                                                            <span className="text-emerald-500" title="Presentes">{ds.present} OK</span>
                                                            <span className="text-zinc-650">/</span>
                                                            <span className="text-amber-500" title="Tardes">{ds.tarde} T</span>
                                                            <span className="text-zinc-650">/</span>
                                                            <span className="text-zinc-400" title="Faltas">{ds.absent} F</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buscador y Filtros por Especialidad */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar atleta por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3.5 pl-12 pr-6 text-white text-sm focus:border-red-500 focus:outline-none transition-all shadow-xl"
                        />
                    </div>

                    <div className="flex gap-2 items-center w-full md:w-auto overflow-x-auto no-scrollbar py-1">
                        {["Todos", "Kata", "Kumite"].map((spec) => (
                            <button
                                key={spec}
                                onClick={() => setSelectedSpec(spec as any)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer whitespace-nowrap",
                                    selectedSpec === spec
                                        ? "bg-kuma-gold text-black border-kuma-gold shadow-lg shadow-kuma-gold/20"
                                        : "bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:text-white"
                                )}
                            >
                                {spec}
                            </button>
                        ))}
                        
                        <div className="h-6 w-px bg-zinc-800 mx-2 hidden md:block" />

                        <div className="flex gap-1.5">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={markAllPresent}
                                className="text-[9px] font-black uppercase tracking-widest border-emerald-500/20 text-emerald-500 bg-emerald-950/10 hover:bg-emerald-950/30 cursor-pointer"
                            >
                                <Check className="w-3 h-3 mr-1" /> Todos Presentes
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={markAllAbsent}
                                className="text-[9px] font-black uppercase tracking-widest border-zinc-700 text-zinc-400 bg-zinc-800/30 hover:bg-zinc-800/50 cursor-pointer"
                            >
                                <UserX className="w-3 h-3 mr-1" /> Todos Ausentes
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Listado de Atletas en Rejilla */}
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center py-32 gap-4">
                        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Cargando lista de atletas...</p>
                    </div>
                ) : filteredAthletes.length === 0 ? (
                    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-16 text-center shadow-inner">
                        <UserX className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider">No se encontraron atletas inscritos</p>
                        <p className="text-zinc-600 text-xs mt-1">Verifica la búsqueda o comprueba que estén inscritos en el Kuma Manager.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredAthletes.map((ath, idx) => {
                            const athleteState = attendanceMap[ath._id] || { status: "Ausente", sessions: [] };
                            const currentStatus = athleteState.status;
                            const currentSessions = athleteState.sessions;
                            const fut = getFUTStyles(ath.athleteProfile.stats.ovr);
                            const beltColor = getBeltBadgeColor(ath.athleteProfile.beltRank);

                            return (
                                <motion.div
                                    key={`${ath._id}-${idx}`}
                                    layout
                                    onDoubleClick={() => handleStatusChange(ath._id, currentStatus === "Presente" ? "Ausente" : "Presente")}
                                    onTouchStart={(e) => handleTouchStart(ath._id, currentStatus, e)}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    className={cn(
                                        "relative flex flex-col bg-zinc-950 rounded-2xl overflow-hidden border transition-all duration-300 select-none cursor-pointer",
                                        currentStatus === "Ausente"
                                            ? "border-zinc-800/50 opacity-45 grayscale"
                                            : currentStatus === "Presente"
                                            ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/20"
                                            : "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20"
                                    )}
                                    title="Doble clic o mantener presionado para alternar asistencia OK"
                                >
                                    {/* Status Badge overlays on top */}
                                    <div className="absolute top-3 right-3 z-10 flex gap-1">
                                        <AnimatePresence mode="wait">
                                            {athleteState.isMVP && (
                                                <motion.span
                                                    initial={{ scale: 0, rotate: -15 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: 0 }}
                                                    className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black p-1 rounded-full text-xs shadow-lg shadow-yellow-500/40 flex items-center justify-center w-5 h-5 border border-yellow-300"
                                                    title="Daily MVP"
                                                >
                                                    👑
                                                </motion.span>
                                            )}
                                            {currentStatus === "Presente" && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="bg-emerald-500 text-black p-1 rounded-full text-xs shadow-lg shadow-emerald-500/30 flex items-center justify-center w-5 h-5"
                                                    title="Presente"
                                                >
                                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                </motion.span>
                                            )}
                                            {currentStatus === "Tarde" && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="bg-amber-500 text-black p-1 rounded-full text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center w-5 h-5"
                                                    title="Llegada Tardía"
                                                >
                                                    <Clock className="w-3.5 h-3.5 stroke-[3]" />
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Card Header styling */}
                                    <div className={cn("p-5 flex-1 flex flex-col items-center justify-center text-center gap-3 bg-gradient-to-b", 
                                        currentStatus === "Ausente" 
                                            ? "from-zinc-900/50 via-zinc-950 to-zinc-950" 
                                            : "from-zinc-900 via-zinc-950 to-zinc-950"
                                    )}>
                                        {/* Avatar / Portrait */}
                                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-800 shadow-md">
                                            {ath.image ? (
                                                <img src={ath.image} alt={ath.name} className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600 font-black text-lg">
                                                    {ath.name?.[0]?.toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Name & Specialization */}
                                        <div>
                                            <h3 className="text-sm font-black text-zinc-100 uppercase tracking-wide leading-none">{ath.name?.split(" ")[0]}</h3>
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                                {ath.name?.split(" ").slice(1).join(" ") || "Atleta"}
                                            </p>
                                            {/* Badge / Stats Panel */}
                                            <div className="flex gap-1.5 items-center mt-1 flex-wrap justify-center">
                                                {(() => {
                                                    const dojo = ath.athleteProfile?.dojo;
                                                    const dojoName = dojo?.name || "DOJO KUMA";
                                                    const dojoLogo = dojo?.logo || "/images/kuma-logo.jpg";
                                                    return (
                                                        <span 
                                                            className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest bg-zinc-900/60 text-zinc-300 border border-zinc-800 flex items-center gap-1"
                                                            title={`Dojo: ${dojoName}`}
                                                        >
                                                            <img 
                                                                src={dojoLogo || "/images/kuma-logo.jpg"} 
                                                                alt={dojoName} 
                                                                className="w-3 h-3 rounded-full object-cover" 
                                                            />
                                                            {dojoName}
                                                        </span>
                                                    );
                                                })()}
                                                <span className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest border border-zinc-850", beltColor)}>
                                                    {ath.athleteProfile.beltRank}
                                                </span>
                                                <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest bg-zinc-900 text-zinc-400 border border-zinc-800">
                                                    OVR {ath.athleteProfile.stats.ovr}
                                                </span>
                                                <span 
                                                    className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest bg-red-950/20 text-red-400 border border-red-900/30 flex items-center gap-1"
                                                    title="Asistencias de este mes (Entrenamientos Físicos y Online)"
                                                >
                                                    <ClipboardCheck className="w-2.5 h-2.5" /> MES: {ath.athleteProfile.monthlyAttendanceCount || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                                        {/* Session Checkboxes - Unfolded and interactive by default */}
                                    <AnimatePresence>
                                        {(currentStatus === "Presente" || currentStatus === "Tarde") && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="px-4 pb-4 w-full flex flex-col gap-2 border-t border-zinc-900 pt-3 text-left"
                                            >
                                                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                                                    Sesiones del día:
                                                </p>
                                                <div className="flex flex-wrap gap-1 mt-0.5">
                                                    {["Fuerza", "Explosión", "Técnica", "Kata", "Kumite"].map((sess) => {
                                                        const isChecked = currentSessions.includes(sess);
                                                        return (
                                                            <button
                                                                key={sess}
                                                                onClick={() => handleSessionToggle(ath._id, sess)}
                                                                onDoubleClick={(e) => e.stopPropagation()}
                                                                onTouchStart={(e) => e.stopPropagation()}
                                                                onTouchMove={(e) => e.stopPropagation()}
                                                                onTouchEnd={(e) => e.stopPropagation()}
                                                                className={cn(
                                                                    "px-2 py-1 text-[8px] font-black uppercase tracking-wider rounded-md transition-all border cursor-pointer leading-none min-h-[22px]",
                                                                    isChecked
                                                                        ? "bg-red-600 text-white border-red-500/30 shadow-sm"
                                                                        : "bg-zinc-900/60 text-zinc-500 border-zinc-800 hover:text-zinc-350"
                                                                )}
                                                            >
                                                                {sess}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-2">
                                                    Calidad de Entrenamiento (1 a 5 Estrellas):
                                                </p>
                                                <div className="flex items-center gap-1 bg-zinc-900 py-1.5 px-3 rounded-lg border border-zinc-800 justify-between">
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((starVal) => {
                                                            const starStr = starVal.toString();
                                                            let isSelected = false;
                                                            const currentPerf = athleteState.performance || "Standard";
                                                            if (currentPerf === "Standard") {
                                                                isSelected = starVal <= 3;
                                                            } else if (currentPerf === "Destacado") {
                                                                isSelected = starVal <= 4;
                                                            } else if (currentPerf === "Elite") {
                                                                isSelected = starVal <= 5;
                                                            } else {
                                                                isSelected = starVal <= parseInt(currentPerf);
                                                            }
                                                            
                                                            const labels = [
                                                                "Bajo Rendimiento (0.4x)",
                                                                "Esfuerzo Parcial (0.7x)",
                                                                "Entrenamiento Estándar (1.0x)",
                                                                "Destacado - Buen Esfuerzo (1.5x)",
                                                                "Rendimiento Élite (2.0x)"
                                                            ];

                                                            return (
                                                                <button
                                                                    key={starVal}
                                                                    type="button"
                                                                    onClick={() => handlePerformanceChange(ath._id, starStr as any)}
                                                                    onDoubleClick={(e) => e.stopPropagation()}
                                                                    onTouchStart={(e) => e.stopPropagation()}
                                                                    onTouchMove={(e) => e.stopPropagation()}
                                                                    onTouchEnd={(e) => e.stopPropagation()}
                                                                    className="transition-transform active:scale-95 hover:scale-125 focus:outline-none cursor-pointer"
                                                                    title={labels[starVal - 1]}
                                                                >
                                                                    <span className={cn(
                                                                        "text-base transition-colors leading-none",
                                                                        isSelected 
                                                                            ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] font-bold" 
                                                                            : "text-zinc-700 hover:text-zinc-500"
                                                                    )}>
                                                                        ★
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    <span className="text-[8px] font-black text-kuma-gold uppercase tracking-wider">
                                                        {(() => {
                                                            const currentPerf = athleteState.performance || "Standard";
                                                            if (currentPerf === "Standard" || currentPerf === "3") return "Estándar (1.0x)";
                                                            if (currentPerf === "Destacado" || currentPerf === "4") return "Destacado (1.5x)";
                                                            if (currentPerf === "Elite" || currentPerf === "5") return "Elite (2.0x)";
                                                            if (currentPerf === "1") return "Bajo (0.4x)";
                                                            if (currentPerf === "2") return "Parcial (0.7x)";
                                                            return `${currentPerf}★`;
                                                        })()}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-900/60">
                                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                                                        MVP de la Clase (Bono):
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMVPToggle(ath._id)}
                                                        onDoubleClick={(e) => e.stopPropagation()}
                                                        onTouchStart={(e) => e.stopPropagation()}
                                                        onTouchMove={(e) => e.stopPropagation()}
                                                        onTouchEnd={(e) => e.stopPropagation()}
                                                        className={cn(
                                                            "px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-md transition-all border cursor-pointer flex items-center gap-1 leading-none min-h-[22px]",
                                                            athleteState.isMVP
                                                                ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.4)]"
                                                                : "bg-zinc-900/60 text-zinc-500 border-zinc-800 hover:text-zinc-350"
                                                        )}
                                                    >
                                                        <span>👑</span>
                                                        <span>{athleteState.isMVP ? "MVP Activo" : "Marcar MVP"}</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Action Buttons Footer */}
                                    <div className="grid grid-cols-3 border-t border-zinc-900 bg-zinc-900/20 p-1.5 gap-1">
                                        <button
                                            onClick={() => handleStatusChange(ath._id, "Ausente")}
                                            onDoubleClick={(e) => e.stopPropagation()}
                                            onTouchStart={(e) => e.stopPropagation()}
                                            onTouchMove={(e) => e.stopPropagation()}
                                            onTouchEnd={(e) => e.stopPropagation()}
                                            className={cn(
                                                "py-1.5 px-1 text-[8px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer",
                                                currentStatus === "Ausente"
                                                    ? "bg-zinc-850 text-zinc-300 border border-zinc-700/50 shadow-inner"
                                                    : "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/60"
                                            )}
                                        >
                                            <UserX className="w-3 h-3" /> Falta
                                        </button>
                                        
                                        <button
                                            onClick={() => handleStatusChange(ath._id, "Tarde")}
                                            onDoubleClick={(e) => e.stopPropagation()}
                                            onTouchStart={(e) => e.stopPropagation()}
                                            onTouchMove={(e) => e.stopPropagation()}
                                            onTouchEnd={(e) => e.stopPropagation()}
                                            className={cn(
                                                "py-1.5 px-1 text-[8px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer",
                                                currentStatus === "Tarde"
                                                    ? "bg-amber-600 text-black font-black shadow-md shadow-amber-950/20"
                                                    : "text-zinc-500 hover:text-amber-500 hover:bg-amber-950/10"
                                            )}
                                        >
                                            <Clock className="w-3 h-3" /> Tarde
                                        </button>

                                        <button
                                            onClick={() => handleStatusChange(ath._id, "Presente")}
                                            onDoubleClick={(e) => e.stopPropagation()}
                                            onTouchStart={(e) => e.stopPropagation()}
                                            onTouchMove={(e) => e.stopPropagation()}
                                            onTouchEnd={(e) => e.stopPropagation()}
                                            className={cn(
                                                "py-1.5 px-1 text-[8px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer",
                                                currentStatus === "Presente"
                                                    ? "bg-emerald-600 text-black font-black shadow-md shadow-emerald-950/20"
                                                    : "text-zinc-500 hover:text-emerald-500 hover:bg-emerald-950/10"
                                            )}
                                        >
                                            <Check className="w-3 h-3" /> OK
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Floating/Sticky Save Panel */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4">
                    <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4">
                        <div className="hidden sm:flex flex-col gap-1 flex-1">
                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                {selectedDojo === "Todos" ? "Resumen por Dojo" : "Resumen Dojo Seleccionado"}
                            </p>
                            <div className="flex flex-col gap-1 max-h-[50px] overflow-y-auto no-scrollbar">
                                {dojoSummary
                                    .filter((ds) => selectedDojo === "Todos" || ds._id === selectedDojo)
                                    .map((ds, index) => (
                                        <div key={`${ds._id}-${index}`} className="flex items-center gap-1.5 text-[10px] font-black whitespace-nowrap">
                                            <img 
                                                src={ds.logo || "/images/kuma-logo.jpg"} 
                                                alt={ds.name} 
                                                className="w-3.5 h-3.5 rounded-full object-cover border border-zinc-800/80" 
                                            />
                                            <span className="text-zinc-300 truncate max-w-[80px]" title={ds.name}>{ds.name}:</span>
                                            <span className="text-emerald-500">{ds.present} OK</span>
                                            <span className="text-zinc-650">/</span>
                                            <span className="text-amber-500">{ds.tarde} T</span>
                                            <span className="text-zinc-650">/</span>
                                            <span className="text-zinc-400">{ds.absent} F</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        
                        <Button
                            onClick={handleSaveAttendance}
                            disabled={isSaving || athletes.length === 0}
                            className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 font-black uppercase text-xs tracking-widest px-8 py-3.5 shadow-lg shadow-red-600/20 rounded-xl cursor-pointer"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin animate-infinite" /> Guardando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" /> Guardar Lista de Asistencia
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Modal de Alerta Custom Premium */}
                <AnimatePresence>
                    {alertModal.isOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setAlertModal((prev) => ({ ...prev, isOpen: false }))}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                            />
                            
                            {/* Content Container */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                                transition={{ type: "spring", duration: 0.4 }}
                                className={cn(
                                    "relative w-full max-w-sm overflow-hidden rounded-2xl border bg-zinc-950 p-6 text-center shadow-2xl z-10",
                                    alertModal.type === "success" 
                                        ? "border-emerald-500/30 shadow-emerald-500/10" 
                                        : "border-red-500/30 shadow-red-500/10"
                                )}
                            >
                                {/* Decorative Gradient Light */}
                                <div className={cn(
                                    "absolute -top-16 -left-16 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20",
                                    alertModal.type === "success" ? "bg-emerald-500" : "bg-red-500"
                                )} />

                                {/* Icon Indicator */}
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
                                    {alertModal.type === "success" ? (
                                        <div className="relative">
                                            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10" />
                                            <CheckCircle className="h-8 w-8 text-emerald-500" />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="absolute inset-0 animate-ping rounded-full bg-red-500/10" />
                                            <UserX className="h-8 w-8 text-red-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Text Header & Body */}
                                <h3 className={cn(
                                    "text-lg font-serif font-black uppercase tracking-wider mb-2",
                                    alertModal.type === "success" ? "text-emerald-400" : "text-red-500"
                                )}>
                                    {alertModal.title}
                                </h3>
                                <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-medium">
                                    {alertModal.message}
                                </p>

                                {/* Premium Action Button */}
                                <button
                                    onClick={() => setAlertModal((prev) => ({ ...prev, isOpen: false }))}
                                    className={cn(
                                        "w-full py-3 rounded-xl font-black uppercase text-xs tracking-widest cursor-pointer transition-all duration-300 shadow-md",
                                        alertModal.type === "success"
                                            ? "bg-gradient-to-r from-kuma-gold to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black shadow-lg shadow-kuma-gold/20"
                                            : "bg-gradient-to-r from-red-700 to-red-800 text-white hover:from-red-600 hover:to-red-700 hover:shadow-red-500/20"
                                    )}
                                >
                                    OK
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </SwipeBackWrapper>
    );
}
