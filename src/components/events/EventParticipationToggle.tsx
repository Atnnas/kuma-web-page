"use client";

import { useState, useTransition } from "react";
import { toggleParticipation } from "@/lib/actions/events";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

interface Props {
    eventId: string;
    initialParticipating: boolean;
}

export function EventParticipationToggle({ eventId, initialParticipating }: Props) {
    const [isParticipating, setIsParticipating] = useState(initialParticipating);
    const [isPending, startTransition] = useTransition();

    const handleToggle = (newState: boolean) => {
        setIsParticipating(newState); // Optimistic update
        startTransition(async () => {
            const res = await toggleParticipation(eventId, newState);
            if (!res.success) {
                setIsParticipating(!newState); // Revert on fail
                alert("Error updating participation");
            }
        });
    };

    return (
        <>
            {/* The Pin - Absolute Positioned relative to the Card */}
            {isParticipating && (
                <div className="absolute top-[-15px] right-[-10px] z-50 pointer-events-none drop-shadow-2xl animate-in zoom-in-50 slide-in-from-top-10 duration-500 bounce-in">
                    <Image
                        src="/images/yellow-pin.png"
                        alt="Pinned"
                        width={60}
                        height={60}
                        className="object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                    />
                </div>
            )}

            {/* The Control - Placed where the component is mounted */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">¿Participarás?</span>

                <div
                    onClick={() => !isPending && handleToggle(!isParticipating)}
                    className={clsx(
                        "relative w-32 h-10 rounded-full border-2 cursor-pointer transition-all duration-300 shadow-inner flex items-center px-1 select-none",
                        isParticipating
                            ? "bg-gradient-to-r from-zinc-800 to-zinc-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                            : "bg-zinc-950 border-zinc-800"
                    )}
                >
                    {/* Labels Background */}
                    <div className="absolute inset-0 flex justify-between items-center px-3 text-[10px] font-black uppercase tracking-wider">
                        <span className={clsx("transition-colors duration-300", !isParticipating ? "text-red-500" : "text-zinc-700")}>NO</span>
                        <span className={clsx("transition-colors duration-300", isParticipating ? "text-amber-500" : "text-zinc-700")}>SÍ</span>
                    </div>

                    {/* The Knob */}
                    <div
                        className={clsx(
                            "absolute top-0.5 w-14 h-8 rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center border border-white/10",
                            isParticipating
                                ? "translate-x-[60px] bg-gradient-to-b from-amber-400 to-amber-600"
                                : "translate-x-0 bg-gradient-to-b from-zinc-700 to-zinc-800"
                        )}
                    >
                        {isPending ? (
                            <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
                        ) : (
                            <div className={clsx("w-1.5 h-4 rounded-full bg-black/20", isParticipating ? "bg-black/30" : "bg-black/50")} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
