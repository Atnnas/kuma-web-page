"use client";

import { useEffect, useState } from "react";
import { getPublicEvents, deleteEvent } from "@/lib/actions/events";
import { IEvent } from "@/models/Event";
import { EventEditor } from "@/components/admin/EventEditor";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Calendar, MapPin, Loader2, Sparkles, Clock } from "lucide-react";
import Image from "next/image";
import { AdminFloatingButton } from "@/components/admin/AdminFloatingButton";
import { differenceInDays } from "date-fns";

// Helper to check if event is "New" (modified/created < 5 days ago)
const isNew = (dateString?: string | Date) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return differenceInDays(new Date(), date) <= 5;
};

export default function AdminEventsPage() {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);

    const loadEvents = async () => {
        setIsLoading(true);
        const data = await getPublicEvents();
        // Cast dates back to Date objects if needed, but the editor expects Date or strings that can be parsed
        // The action returns strings for dates, Editor handles parsing in state init.
        setEvents(data as unknown as IEvent[]);
        setIsLoading(false);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleCreate = () => {
        setEditingEvent(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (event: IEvent) => {
        setEditingEvent(event);
        setIsEditorOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar este evento?")) {
            await deleteEvent(id);
            loadEvents();
        }
    };

    const handleSave = () => {
        setIsEditorOpen(false);
        setEditingEvent(null);
        loadEvents();
    };

    return (
        <div className="min-h-screen text-white space-y-8">
            <div className="flex flex-col md:flex-row justify-end items-center mb-6 gap-6">
                {/* New Event Button - Full Width on Mobile */}
                {!isEditorOpen && (
                    <AdminFloatingButton onClick={handleCreate} label="Nuevo Evento" />
                )}
            </div>

            {isEditorOpen ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <EventEditor
                        initialData={editingEvent}
                        onSave={handleSave}
                        onCancel={() => setIsEditorOpen(false)}
                    />
                </div>
            ) : (
                <>
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-20 px-4 glass border border-white/5 rounded-3xl backdrop-blur-md">
                            <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Calendar className="w-10 h-10 text-kuma-gold opacity-50" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">No hay eventos creados</h3>
                            <p className="text-zinc-400">Comienza creando el primer evento para el calendario.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {events.map((event) => {
                                const isNewEvent = isNew(event.createdAt || event.updatedAt); // Assuming createdAt exists on IEvent, fallback to a heuristic if needed

                                return (
                                    <div
                                        key={event._id as unknown as string}
                                        className="relative glass border border-white/5 rounded-2xl p-0 overflow-hidden hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)] transition-all group backdrop-blur-md flex flex-col md:flex-row"
                                    >
                                        {/* STATUS STRIP */}
                                        <div className={`h-2 md:h-auto md:w-2 ${event.isPremium ? "bg-amber-500" : "bg-red-900"} group-hover:scale-y-110 transition-transform`} />

                                        {/* MAIN CONTENT */}
                                        <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6">

                                            {/* Date Circle */}
                                            <div className="flex flex-col items-center justify-center h-20 w-20 rounded-full border-2 border-white/10 bg-black/40 shadow-inner shrink-0 group-hover:border-red-500/50 transition-colors">
                                                <span className="text-2xl font-black text-white leading-none">{new Date(event.startDate).getDate()}</span>
                                                <span className="text-[10px] font-bold text-red-500 uppercase">{new Date(event.startDate).toLocaleString('es-ES', { month: 'short' }).replace('.', '')}</span>
                                            </div>

                                            {/* Text Info */}
                                            <div className="flex-1 space-y-2 min-w-0 w-full mb-12 md:mb-0">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    {/* NEW BADGE */}
                                                    {isNewEvent && (
                                                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-blue-500 text-white animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)] flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3" /> Nuevo
                                                        </span>
                                                    )}

                                                    {event.isPremium && (
                                                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-500 border border-amber-500/30">
                                                            Premium
                                                        </span>
                                                    )}

                                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-red-500 transition-colors truncate max-w-full">
                                                        {event.title}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-400">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                                        {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                                                        <span className="truncate max-w-[200px]">{event.location.country}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions - Repositioned to be cleaner */}
                                            <div className="absolute top-4 right-4 md:static md:flex md:items-center md:gap-2">
                                                <div className="flex items-center gap-1 bg-black/40 rounded-full p-1 border border-white/5 backdrop-blur-sm">
                                                    <button
                                                        onClick={() => handleEdit(event)}
                                                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <div className="w-px h-4 bg-white/10" />
                                                    <button
                                                        onClick={() => handleDelete(event._id as unknown as string)}
                                                        className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
