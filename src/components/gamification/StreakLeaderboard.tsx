
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
}

export function StreakLeaderboard() {
    const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/user/leaderboard", { cache: "no-store" });
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

    if (loading) return null; // Or a skeleton if preferred
    if (leaders.length === 0) return null;

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex items-center gap-2 mb-4 px-2">
                <Trophy className="text-kuma-gold" weight="duotone" size={20} />
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Top Kumas Mejor Racha</h3>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
                {leaders.map((user, index) => (
                    <div
                        key={user._id}
                        className={`flex items-center justify-between p-3 border-b border-white/5 last:border-0 ${index === 0 ? "bg-gradient-to-r from-orange-900/20 to-transparent" : ""}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`w-6 text-center font-bold ${index === 0 ? "text-kuma-gold text-lg" : "text-zinc-500 text-sm"}`}>
                                #{index + 1}
                            </span>

                            <div className={`relative rounded-full overflow-hidden ${index === 0 ? "w-10 h-10 ring-2 ring-kuma-gold/50" : "w-8 h-8 ring-1 ring-white/10"}`}>
                                {user.image ? (
                                    <Image src={user.image} alt={user.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <span className={`font-bold ${index === 0 ? "text-white" : "text-zinc-300"}`}>
                                {user.name.split(" ")[0]}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Fire weight="fill" className={index === 0 ? "text-orange-500 animate-pulse" : "text-zinc-600"} size={16} />
                            <span className={`font-mono font-bold ${index === 0 ? "text-orange-400" : "text-zinc-500"}`}>
                                {user.streakDays}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
