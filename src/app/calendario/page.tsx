import { MiniCalendar } from "@/components/ui/MiniCalendar";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { getUpcomingEvents, getPastEvents } from "@/lib/actions/events";
import { Calendar as CalendarIcon, MapPin, Clock, ExternalLink } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Calendario de Eventos | Kuma Dojo",
    description: "Próximos eventos, torneos y actividades del Kuma Dojo.",
};

export default async function CalendarPage() {
    const [upcomingEvents, pastEvents] = await Promise.all([
        getUpcomingEvents(),
        getPastEvents()
    ]);

    return (
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
                        <div
                            key={event._id}
                            className="group relative bg-zinc-900/80 border border-zinc-800 rounded-3xl overflow-hidden hover:border-red-900/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col md:flex-row isolate"
                        >
                            {/* DEZOPILANTE LOGO WATERMARK - Mobile & Desktop */}
                            {event.organizer?.logo && (
                                <div className="absolute -right-10 -bottom-10 w-64 h-64 md:w-80 md:h-80 opacity-10 md:opacity-5 rotate-[-15deg] pointer-events-none z-0 grayscale group-hover:grayscale-0 transition-all duration-700 mix-blend-screen">
                                    <Image src={event.organizer.logo} alt="Watermark" fill className="object-contain" />
                                </div>
                            )}

                            {/* Date Box (Desktop Only) */}
                            <div className="hidden md:flex bg-gradient-to-br from-red-900 via-red-800 to-black p-6 flex-col items-center justify-center min-w-[140px] text-center border-r border-white/10 shrink-0 z-10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
                                <span className="text-4xl font-black text-white leading-none relative z-10">
                                    {new Date(event.startDate).getDate()}
                                </span>
                                <span className="text-xl font-bold text-red-200 uppercase tracking-widest mt-1 relative z-10">
                                    {new Date(event.startDate).toLocaleString('es-ES', { month: 'short' }).replace('.', '')}
                                </span>
                                <span className="text-xs text-red-300/80 mt-2 font-medium relative z-10">
                                    {new Date(event.startDate).getFullYear()}
                                </span>
                            </div>

                            {/* Mobile Date Strip & Title Section */}
                            <div className="flex flex-col md:flex-row flex-1 relative z-10">
                                {/* Mobile Header */}
                                <div className="md:hidden bg-gradient-to-r from-red-900/80 to-zinc-900 p-4 border-b border-white/5 flex items-center justify-between backdrop-blur-md overflow-hidden relative min-h-[80px]">
                                    {/* Ambient Glow */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full pointer-events-none"></div>

                                    <div className="flex items-start gap-3 relative z-10 w-full">
                                        {/* Dynamic Flag */}
                                        {event.location?.flag && event.location.flag.startsWith('http') ? (
                                            <div className="w-6 h-4 xs:w-8 xs:h-6 rounded shadow-sm overflow-hidden relative shrink-0 border border-white/10 mt-1.5">
                                                <Image
                                                    src={event.location.flag}
                                                    alt={event.location.country || "Flag"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : event.location?.flag ? (
                                            <div className="text-xl shrink-0 mt-1">{event.location.flag}</div>
                                        ) : null}

                                        {/* Title & Date */}
                                        <div className="flex flex-col flex-1 min-w-0 mr-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg xs:text-xl font-black text-white uppercase leading-tight line-clamp-2 tracking-wide">{event.title}</h3>
                                                {event.isPremium && <span className="text-[8px] bg-amber-500 text-black font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0">TOP</span>}
                                            </div>
                                            <span className="text-[10px] text-red-300 font-bold tracking-widest uppercase mt-1">
                                                {new Date(event.startDate).getDate()} {new Date(event.startDate).toLocaleString('es-ES', { month: 'long' })}
                                            </span>
                                        </div>

                                        {/* PRIMAL ANIMATED LOGO */}
                                        {event.organizer?.logo && (
                                            <div className="shrink-0 -mr-1 self-center">
                                                <div className="w-12 h-12 xs:w-16 xs:h-16 relative">
                                                    <AnimatedLogo src={event.organizer.logo} alt="Logo" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 w-full">
                                    <div className="flex-1 space-y-4">
                                        <div className="hidden md:flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight group-hover:text-red-500 transition-colors">
                                                {event.title}
                                            </h3>
                                            {event.isPremium && (
                                                <span className="bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-amber-500/20 shrink-0 self-start">
                                                    Evento Destacado
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-zinc-400 leading-relaxed text-sm md:text-base whitespace-pre-line relative z-10">
                                            {event.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-zinc-500 font-medium pt-2">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-red-600" />
                                                <span>
                                                    {new Date(event.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {event.location?.flag && event.location.flag.startsWith('http') ? (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img src={event.location.flag} alt="Flag" className="w-4 h-3 object-cover rounded shadow-sm mr-1.5" />
                                                ) : (
                                                    <span className="mr-1.5">{event.location?.flag}</span>
                                                )}
                                                <span>{event.location?.country}</span>
                                            </div>
                                            {event.location?.mapLink && (
                                                <a
                                                    href={event.location.mapLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-red-500 hover:text-red-400 hover:underline flex items-center gap-1 text-xs uppercase font-bold tracking-wider bg-red-500/10 px-3 py-1.5 rounded-full transition-colors border border-red-500/20 shadow-[0_0_10px_rgba(220,38,38,0.2)] z-20"
                                                >
                                                    Ver Mapa <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                        {event.location?.address && (
                                            <div className="text-xs text-zinc-600 font-mono border-l-2 border-red-900/50 pl-2">
                                                {event.location.address}
                                            </div>
                                        )}
                                    </div>

                                    {/* Mini Calendar Column (Visible on both now for aesthetics, but stacked on mobile) */}
                                    <div className="flex flex-col items-center justify-center md:items-end md:justify-start shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                        <MiniCalendar
                                            startDate={typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate}
                                            endDate={event.endDate ? (typeof event.endDate === 'string' ? new Date(event.endDate) : event.endDate) : undefined}
                                        />
                                        {/* Mobile Logo Fallback if not watermarked enough */}
                                        <div className="mt-4 flex items-center gap-2 opacity-50">
                                            <span className="text-[10px] uppercase tracking-widest text-zinc-600">Organiza</span>
                                            {event.organizer?.name && <span className="text-xs font-bold text-zinc-400">{event.organizer.name}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Past Events (Collapsed or visual separation) */}
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
