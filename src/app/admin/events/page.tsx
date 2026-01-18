"use client";

import { useEffect, useState } from "react";
import { getPublicEvents, deleteEvent } from "@/lib/actions/events";
import { IEvent } from "@/models/Event";
import { EventEditor } from "@/components/admin/EventEditor";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Calendar, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";

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
        <div className="p-4 md:p-12 md:pl-80 pt-8 min-h-screen text-white">
            <div className="flex flex-col md:flex-row justify-end items-center mb-6 gap-6">

                <Button
                    onClick={handleCreate}
                    className="w-full md:w-auto bg-red-600 hover:bg-white hover:text-red-600 text-white px-8 py-4 md:py-6 rounded-full font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2 group"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" /> Nuevo Evento
                </Button>
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
                            {events.map((event) => (
                                <div
                                    key={event._id as unknown as string}
                                    className="glass border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-6 hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all group backdrop-blur-md"
                                >
                                    {/* Date & Info Container for better mobile flow */}
                                    <div className="flex flex-row md:contents w-full items-center gap-4 md:gap-8">
                                        {/* Date Box */}
                                        <div className="bg-black/40 p-3 md:p-4 rounded-xl min-w-[80px] md:min-w-[100px] text-center border border-white/5 group-hover:border-red-500/50 transition-colors shadow-inner shrink-0">
                                            <span className="block text-2xl md:text-4xl font-serif font-black text-white group-hover:text-red-500 transition-colors">
                                                {new Date(event.startDate).getDate()}
                                            </span>
                                            <span className="block text-[10px] md:text-sm font-bold text-kuma-gold uppercase tracking-widest mt-1">
                                                {new Date(event.startDate).toLocaleString('es-ES', { month: 'short' })}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 text-left space-y-2 min-w-0">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4">
                                                <h3 className="text-xl md:text-2xl font-serif font-bold text-white group-hover:text-kuma-gold transition-colors truncate w-full sm:w-auto">
                                                    {event.title}
                                                </h3>
                                                {event.isPremium && (
                                                    <span className="text-[10px] bg-gradient-to-r from-amber-600/20 to-amber-800/20 text-amber-500 px-2 py-0.5 rounded-full uppercase font-black tracking-wider border border-amber-500/30 shrink-0">
                                                        Premium
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-zinc-400">
                                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 max-w-full overflow-hidden">
                                                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                                                    <span className="font-medium truncate">{event.location.country} - {event.location.address}</span>
                                                    {event.location.mapLink && (
                                                        <a
                                                            href={event.location.mapLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-1 text-green-500 hover:text-green-400 font-bold text-xs"
                                                            title="Ver enlace de mapa"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            [MAPA]
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="uppercase text-[10px] font-bold bg-zinc-800/80 text-zinc-300 px-3 py-1 rounded-full border border-white/5 tracking-wider">{event.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0 mt-2 md:mt-0">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all hover:scale-110"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id as unknown as string)}
                                            className="p-3 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]"
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
