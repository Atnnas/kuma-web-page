"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { MiniCalendar } from "@/components/ui/MiniCalendar";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { Calendar as CalendarIcon, MapPin, Clock, ExternalLink, Loader2 } from "lucide-react";
import { toggleParticipation } from "@/lib/actions/events";
import clsx from "clsx";

interface EventCardProps {
    event: any;
    userId?: string;
}

export function EventCard({ event, userId }: EventCardProps) {
    const initialParticipating = userId && event.participants?.includes(userId);
    const [isParticipating, setIsParticipating] = useState(!!initialParticipating);
    const [isPending, startTransition] = useTransition();

    const [isBouncing, setIsBouncing] = useState(false);

    // Force sync if props update (crucial for hydration/server-client handoff)
    useEffect(() => {
        if (userId) {
            setIsParticipating(event.participants?.includes(userId) || false);
        }
    }, [userId, event.participants]);

    const handleToggle = (newState: boolean) => {
        setIsParticipating(newState);

        // Trigger Jump Animation
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 300);

        if (newState) {
            // Haptic feedback for mobile
            // Use longer duration and try pattern for better noticeability
            if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate([10, 50, 10]); // Short pattern: Tick-Tock
            }
        }

        startTransition(async () => {
            const res = await toggleParticipation(event._id, newState);
            if (!res.success) {
                setIsParticipating(!newState);
            }
        });
    };

    return (
        <div
            className={clsx(
                "group relative border overflow-hidden transition-all duration-500 flex flex-col md:flex-row isolate backdrop-blur-md",
                "rounded-[2.5rem]", // More rounded
                isParticipating
                    ? "bg-zinc-900/60 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.15)]"
                    : "bg-zinc-900/40 border-white/5 hover:border-red-500/30 hover:bg-zinc-900/60 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]",
                isBouncing && "scale-105 transition-transform duration-300 ease-spring"
            )}
        >
            {/* VIRTUAL GRID BACKGROUND */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

            {/* DEZOPILANTE LOGO WATERMARK - Adjusted to avoid bad cuts */}
            {event.organizer?.logo && (
                <div className="absolute -right-5 -bottom-5 w-48 h-48 md:w-64 md:h-64 opacity-5 rotate-0 pointer-events-none z-0 grayscale group-hover:grayscale-0 transition-all duration-700 mix-blend-screen bg-contain bg-no-repeat bg-center p-4">
                    <Image src={event.organizer.logo} alt="Watermark" fill className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                </div>
            )}

            {/* Date Box (Desktop Only) - Cleaner */}
            <div className="hidden md:flex bg-black/40 p-8 flex-col items-center justify-center min-w-[120px] text-center border-r border-white/5 shrink-0 z-10 relative backdrop-blur-sm">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 leading-none tracking-tighter" suppressHydrationWarning>
                    {new Date(event.startDate).getDate()}
                </div>
                <span className="text-sm font-bold text-red-500 uppercase tracking-[0.2em] mt-2" suppressHydrationWarning>
                    {new Date(event.startDate).toLocaleString('es-ES', { month: 'short' }).replace('.', '')}
                </span>
                <span className="text-[10px] text-zinc-500 mt-1 font-mono" suppressHydrationWarning>
                    {new Date(event.startDate).getFullYear()}
                </span>
            </div>

            {/* Content Section */}
            <div className="flex flex-col md:flex-row flex-1 relative z-10">
                {/* Mobile Header */}
                <div className="md:hidden bg-gradient-to-r from-red-900/20 to-transparent p-5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-start gap-3 w-full">
                        {/* Dynamic Flag */}
                        {event.location?.flag && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={event.location.flag}
                                alt={event.location.country || "Flag"}
                                className="w-8 h-6 object-cover rounded shadow-sm border border-white/10"
                            />
                        )}
                        <div className="flex flex-col">
                            <h3 className="text-lg font-black text-white uppercase leading-none">{event.title}</h3>
                            <span className="text-xs text-red-400 font-bold mt-1" suppressHydrationWarning>
                                {new Date(event.startDate).getDate()} {new Date(event.startDate).toLocaleString('es-ES', { month: 'short' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 w-full">
                    <div className="flex-1 space-y-3">
                        <div className="hidden md:flex items-center justify-between gap-4 mb-1">
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white group-hover:text-red-500 transition-colors drop-shadow-sm">
                                {event.title}
                            </h3>
                            {event.isPremium && (
                                <span className="bg-amber-500/20 text-amber-500 text-[9px] uppercase font-bold px-2 py-1 rounded border border-amber-500/30 shrink-0">
                                    Premium
                                </span>
                            )}
                        </div>

                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
                            {event.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-zinc-500 font-medium pt-4 border-t border-white/5 mt-4">
                            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/5">
                                <Clock className="w-3 h-3 text-red-500" />
                                <span suppressHydrationWarning>
                                    {new Date(event.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* FLAG & COUNTRY */}
                            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/5">
                                {event.location?.flag && (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={event.location.flag} alt="Flag" className="w-4 h-3 object-cover rounded shadow-sm" />
                                )}
                                <span className="text-zinc-300">{event.location?.country}</span>
                            </div>

                            {/* TOGGLE BUTTON */}
                            {userId && (
                                <div className="flex items-center gap-2 px-2">
                                    <span className={clsx("text-[10px] font-bold uppercase tracking-wider transition-colors", isParticipating ? "text-amber-500" : "text-zinc-600")}>
                                        {isParticipating ? "ASISTIRÉ" : "¿VAS A IR?"}
                                    </span>
                                    <div
                                        onClick={() => !isPending && handleToggle(!isParticipating)}
                                        className={clsx(
                                            "relative w-10 h-5 rounded-full border cursor-pointer transition-all duration-300 flex items-center px-0.5 select-none",
                                            isParticipating
                                                ? "bg-amber-500/20 border-amber-500"
                                                : "bg-white/5 border-zinc-700 hover:border-zinc-500"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                "w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-300",
                                                isParticipating
                                                    ? "translate-x-5 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                                                    : "translate-x-0 bg-zinc-500"
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
                                    className="ml-auto text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                                    title="Ver Mapa"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                        {event.location?.address && (
                            <div className="text-[10px] text-zinc-600 font-mono pl-2 border-l border-zinc-700">
                                {event.location.address}
                            </div>
                        )}
                    </div>

                    {/* Mini Calendar Column */}
                    <div className="relative flex flex-col items-center justify-center md:items-end md:justify-start shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 gap-4">

                        {/* PIN - Floating Effect */}
                        {isParticipating && (
                            <div className="absolute -left-8 top-0 z-50 animate-bounce-slow drop-shadow-2xl hidden md:block">
                                <Image
                                    src="/images/yellow-pin.svg"
                                    alt="Pinned"
                                    width={55}
                                    height={55}
                                    className="object-contain rotate-[-12deg]"
                                />
                            </div>
                        )}
                        {/* Mobile Pin */}
                        {isParticipating && (
                            <div className="absolute top-2 right-4 md:hidden z-50">
                                <Image
                                    src="/images/yellow-pin.svg"
                                    alt="Pinned"
                                    width={35}
                                    height={35}
                                    className="object-contain"
                                />
                            </div>
                        )}

                        <div className="scale-90 origin-top-right">
                            <MiniCalendar
                                startDate={typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate}
                                endDate={event.endDate ? (typeof event.endDate === 'string' ? new Date(event.endDate) : event.endDate) : undefined}
                            />
                        </div>

                        <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                            {event.organizer?.name && <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{event.organizer.name}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
