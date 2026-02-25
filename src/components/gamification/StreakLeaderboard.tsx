"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Fire, Trophy } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

interface LeaderboardUser {
    _id: string;
    name: string;
    image?: string;
    streakDays: number;
    restDays?: number;
}

export function StreakLeaderboard() {
    const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/users/leaderboard", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    setLeaders(data);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) return null;
    if (leaders.length === 0) return null;

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex items-center gap-2 mb-4 px-2">
                <Trophy className="text-kuma-gold" weight="duotone" size={20} />
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">RANKING DE RACHAS</h3>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
                {leaders.map((user, index) => (
                    <div
                        key={user._id}
                        className={`flex items-center justify-between p-3 border-b border-white/5 last:border-0 ${index === 0 ? "bg-gradient-to-r from-orange-900/10 to-transparent" : ""}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`w-6 text-center font-bold ${index === 0 ? "text-kuma-gold text-base" : "text-zinc-500 text-sm"}`}>
                                #{index + 1}
                            </span>

                            <div className={`relative rounded-full overflow-hidden flex-shrink-0 ${index === 0 ? "w-10 h-10 ring-2 ring-kuma-gold/30" : "w-8 h-8 ring-1 ring-white/10"}`}>
                                {user.image ? (
                                    <Image src={user.image} alt={user.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <span className={`font-bold truncate max-w-[120px] ${index === 0 ? "text-white text-base" : "text-zinc-300 text-sm"}`}>
                                {user.name.split(" ")[0]}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* RED FLAME (Streak) */}
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-800/30 border border-white/5">
                                <Fire
                                    weight="fill"
                                    className={index === 0 ? "text-orange-500 animate-pulse" : "text-zinc-500"}
                                    size={index === 0 ? 18 : 14}
                                />
                                <span className={`font-mono font-bold ${index === 0 ? "text-orange-400 text-base" : "text-zinc-400 text-sm"}`}>
                                    {user.streakDays || 0}
                                </span>
                            </div>

                            {/* BLUE FLAME (Rest Days) - ALWAYS VISIBLE */}
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all duration-500
                                ${(user.restDays ?? 0) > 0
                                    ? "bg-cyan-950/30 border-cyan-500/20"
                                    : "bg-zinc-800/30 border-zinc-700/20"}
                            `}>
                                <Fire
                                    weight="fill"
                                    className={`transition-all duration-500 
                                        ${(user.restDays ?? 0) > 0 ? "text-cyan-400 animate-pulse" : "text-zinc-600"}
                                    `}
                                    size={index === 0 ? 16 : 12}
                                />
                                <span className={`font-mono font-bold transition-all duration-500
                                    ${(user.restDays ?? 0) > 0 ? "text-cyan-300" : "text-zinc-500"}
                                    ${index === 0 ? "text-sm" : "text-xs"}
                                `}>
                                    {user.restDays ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
