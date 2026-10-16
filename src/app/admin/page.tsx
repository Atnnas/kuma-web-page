import { auth } from "@/auth";
import { Users, Newspaper, Activity, Trophy, BarChart3, TrendingUp, Star } from "lucide-react";
import Link from "next/link";
import { getNews } from "@/lib/actions/news";
import connectDB from "@/lib/db";
import User from "@/models/User";

import { getAnalyticsStats } from "@/lib/actions/analytics";

async function getStats() {
    await connectDB();
    const userCount = await User.countDocuments();
    const news = await getNews();
    const analytics = await getAnalyticsStats();

    return {
        users: userCount,
        news: news.length,
        analytics
    };
}

export default async function AdminDashboard() {
    const session = await auth();
    const stats = await getStats();

    return (
        <div className="space-y-6 sm:space-y-8 min-w-0">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-black uppercase tracking-wider sm:tracking-widest mb-1 text-kuma-gold drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] break-words leading-tight">
                    Bienvenido, <span className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)] inline">{session?.user?.name?.split(' ')[0]}</span>
                </h1>
                <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-medium">Panel de Control General del Kuma Dojo.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <div className="glass p-4 sm:p-6 flex items-center gap-3.5 sm:gap-4 rounded-2xl hover:border-blue-500/30 transition-colors group min-w-0">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all border border-zinc-800 group-hover:border-blue-500/50 shrink-0">
                        <Users className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-0.5 sm:mb-1 truncate">Usuarios</p>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-kuma-gold drop-shadow-lg leading-none truncate">{stats.users}</p>
                    </div>
                </div>

                <div className="glass p-4 sm:p-6 flex items-center gap-3.5 sm:gap-4 rounded-2xl hover:border-red-500/30 transition-colors group min-w-0">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all border border-zinc-800 group-hover:border-red-500/50 shrink-0">
                        <Newspaper className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-0.5 sm:mb-1 truncate">Noticias</p>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-kuma-gold drop-shadow-lg leading-none truncate">{stats.news}</p>
                    </div>
                </div>

                {/* VISITAS HOY */}
                <div className="glass p-4 sm:p-6 flex items-center gap-3.5 sm:gap-4 rounded-2xl hover:border-amber-500/30 transition-colors group min-w-0">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-amber-500 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all border border-zinc-800 group-hover:border-amber-500/50 shrink-0">
                        <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-0.5 sm:mb-1 truncate">Visitas Hoy</p>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-kuma-gold drop-shadow-lg leading-none truncate">{stats.analytics.visitsToday}</p>
                    </div>
                </div>

                {/* VISITAS TOTALES */}
                <div className="glass p-4 sm:p-6 flex items-center gap-3.5 sm:gap-4 rounded-2xl hover:border-purple-500/30 transition-colors group min-w-0">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all border border-zinc-800 group-hover:border-purple-500/50 shrink-0">
                        <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-0.5 sm:mb-1 truncate">Total Visitas</p>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-kuma-gold drop-shadow-lg leading-none truncate">{stats.analytics.totalVisits}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="glass p-5 sm:p-8 rounded-2xl border-t-4 border-t-red-900/50">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        ACCIONES DE MANDO
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Link href="/admin/users" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            <Users className="w-4 h-4" /> Usuarios
                        </Link>
                        <Link href="/admin/athletes" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            <Star className="w-4 h-4 text-kuma-gold" /> Kuma Manager
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
