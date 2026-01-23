import { MiniCalendar } from "@/components/ui/MiniCalendar";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { getUpcomingEvents, getPastEvents } from "@/lib/actions/events";
import { Calendar as CalendarIcon, MapPin, Clock, ExternalLink } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Calendario de Eventos | Kuma Dojo",
    description: "Próximos eventos, torneos y actividades del Kuma Dojo.",
};

import { auth } from "@/auth";
import { EventCard } from "@/components/events/EventCard";

export default async function CalendarPage() {
    const session = await auth();
    // Explicitly handle nulls to satisfy strict TypeScript checks in Vercel
    const userIdInput = session?.user?.id || session?.user?.email;
    const userId: string | undefined = userIdInput ? userIdInput : undefined;

    const [upcomingEvents, pastEvents] = await Promise.all([
        getUpcomingEvents(),
        getPastEvents()
    ]);

    if (upcomingEvents.length > 0) {
        // Debug logs removed
    } return (
        <main className="min-h-screen bg-black text-white pt-24 pb-20">
            {/* Background Texture */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('/images/metal-bear.png')", backgroundSize: 'cover' }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-10 md:mb-16 space-y-4">
                    <h1 className="text-4xl xs:text-5xl md:text-7xl font-serif font-black uppercase tracking-widest text-kuma-gold drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-tight">
                        Calendario <span className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">2025</span>
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto font-serif italic px-4">
                        "La preparación constante es el camino a la maestría. Aquí encontrarás los próximos desafíos."
                    </p>
                </div>

                {upcomingEvents.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                        <CalendarIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-zinc-500">No hay eventos próximos programados</h3>
                        <p className="text-zinc-600">Mantente atento a nuevas actualizaciones.</p>
                    </div>
                )}

                <div className="space-y-8 max-w-4xl mx-auto">
                    {upcomingEvents.map((event: any) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            userId={userId}
                        />
                    ))}
                </div>

                {/* Past Events */}
                {pastEvents.length > 0 && (
                    <div className="mt-24 opacity-60">
                        <h3 className="text-2xl font-bold text-zinc-600 uppercase tracking-widest text-center mb-8 pb-4 border-b border-zinc-800">Eventos Anteriores</h3>
                        <div className="space-y-6 max-w-4xl mx-auto grayscale hover:grayscale-0 transition-all duration-500">
                            {pastEvents.map((event: any) => (
                                <div key={event._id} className="flex gap-4 md:gap-8 items-center p-4 rounded-xl hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-zinc-800">
                                    <div className="text-zinc-500 font-bold text-right min-w-[80px]">
                                        <div className="text-2xl">{new Date(event.startDate).getDate()}</div>
                                        <div className="text-xs uppercase">{new Date(event.startDate).toLocaleString('es-ES', { month: 'short' })}</div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-zinc-300">{event.title}</h4>
                                        <p className="text-sm text-zinc-600 line-clamp-1">{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
