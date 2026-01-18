"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { MiniCalendar } from "@/components/ui/MiniCalendar";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { Calendar as CalendarIcon, MapPin, Clock, ExternalLink, Loader2 } from "lucide-react";
import { toggleParticipation } from "@/lib/actions/participation";
import clsx from "clsx";

interface EventCardProps {
    event: any;
    userId?: string;
}

export function EventCard({ event, userId }: EventCardProps) {
    const initialParticipating = userId && event.participants?.includes(userId);
    const [isParticipating, setIsParticipating] = useState(!!initialParticipating);
    const [isPending, startTransition] = useTransition();

    const handleToggle = (newState: boolean) => {
        setIsParticipating(newState);

        if (newState) {
            // Audio removed by user request
        }

        startTransition(async () => {
            const res = await toggleParticipation(event._id, newState);
            if (!res.success) {
                setIsParticipating(!newState);
                // Optional: Toast error
            }
        });
    };

    return (
        <div
            className={clsx(
                "group relative bg-zinc-900/80 border rounded-3xl transition-all duration-500 flex flex-col md:flex-row isolate",
                isParticipating
                    ? "border-amber-500/50 shadow-[0_0_60px_rgba(245,158,11,0.3)] scale-[1.01]"
                    : "border-zinc-800 hover:border-red-900/50 hover:shadow-[0_0_50px_rgba(220,38,38,0.15)]"
            )}
        >
            {/* DEZOPILANTE LOGO WATERMARK */}
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

            {/* Content Section */}
            <div className="flex flex-col md:flex-row flex-1 relative z-10">
                {/* Mobile Header */}
                <div className="md:hidden bg-gradient-to-r from-red-900/80 to-zinc-900 p-4 border-b border-white/5 flex items-center justify-between backdrop-blur-md overflow-hidden relative min-h-[80px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full pointer-events-none"></div>

                    <div className="flex items-start gap-3 relative z-10 w-full">
                        {/* Dynamic Flag */}
                        {event.location?.flag && (
                            <div className="w-8 h-6 rounded shadow-sm overflow-hidden relative shrink-0 border border-white/10 mt-1.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={event.location.flag}
                                    alt={event.location.country || "Flag"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="flex flex-col flex-1 min-w-0 mr-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg xs:text-xl font-black text-white uppercase leading-tight line-clamp-2 tracking-wide">{event.title}</h3>
                                {event.isPremium && <span className="text-[8px] bg-amber-500 text-black font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0">TOP</span>}
                            </div>
                            <span className="text-[10px] text-red-300 font-bold tracking-widest uppercase mt-1">
                                {new Date(event.startDate).getDate()} {new Date(event.startDate).toLocaleString('es-ES', { month: 'long' })}
                            </span>
                        </div>

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

                        <div className="flex flex-wrap items-center gap-y-3 gap-x-4 md:gap-x-6 text-sm text-zinc-500 font-medium pt-2">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-red-600" />
                                <span>
                                    {new Date(event.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* FLAG & COUNTRY */}
                            <div className="flex items-center gap-2">
                                {event.location?.flag && (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={event.location.flag} alt="Flag" className="w-4 h-3 object-cover rounded shadow-sm" />
                                )}
                                <span>{event.location?.country}</span>
                            </div>

                            {/* TOGGLE BUTTON (Right of Flag) - Only if logged in */}
                            {userId && (
                                <div className="flex items-center gap-2 border-l border-r border-zinc-800 px-4 mx-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/80">
                                        ¿Vas?
                                    </span>
                                    <div
                                        onClick={() => !isPending && handleToggle(!isParticipating)}
                                        className={clsx(
                                            "relative w-12 h-6 rounded-full border cursor-pointer transition-all duration-300 shadow-inner flex items-center px-0.5 select-none",
                                            isParticipating
                                                ? "bg-amber-900/40 border-amber-500"
                                                : "bg-zinc-950 border-zinc-700"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                "w-4 h-4 rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center",
                                                isParticipating
                                                    ? "translate-x-6 bg-amber-400"
                                                    : "translate-x-0 bg-zinc-600"
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

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

                    {/* Mini Calendar Column */}
                    <div className="relative flex flex-col items-center justify-center md:items-end md:justify-start shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 gap-6">

                        {/* YELLOW PIN - Left of Mini Calendar */}
                        {isParticipating && (
                            <div className="absolute -left-6 top-[-10px] z-50 animate-in zoom-in-0 slide-in-from-top-10 duration-300 ease-out fill-mode-forwards block hidden md:block">
                                <Image
                                    src="/images/yellow-pin.png"
                                    alt="Pinned"
                                    width={50}
                                    height={50}
                                    className="object-contain rotate-[-15deg] drop-shadow-[0_10px_8px_rgba(0,0,0,0.5)]"
                                />
                            </div>
                        )}
                        {/* Mobile Pin (different position) */}
                        {isParticipating && (
                            <div className="absolute top-0 right-10 md:hidden z-50 animate-in zoom-in-0 slide-in-from-top-10 duration-300 ease-out fill-mode-forwards">
                                <Image
                                    src="/images/yellow-pin.png"
                                    alt="Pinned"
                                    width={40}
                                    height={40}
                                    className="object-contain rotate-[15deg] drop-shadow-[0_10px_8px_rgba(0,0,0,0.5)]"
                                />
                            </div>
                        )}

                        <MiniCalendar
                            startDate={typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate}
                            endDate={event.endDate ? (typeof event.endDate === 'string' ? new Date(event.endDate) : event.endDate) : undefined}
                        />

                        {/* Mobile Logo Fallback */}
                        <div className="flex items-center gap-2 opacity-50">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-600">Organiza</span>
                            {event.organizer?.name && <span className="text-xs font-bold text-zinc-400">{event.organizer.name}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
