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
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl md:text-5xl font-serif font-black uppercase tracking-widest mb-1 text-kuma-gold drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] break-words leading-tight">
                    Bienvenido, <span className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)] block md:inline">{session?.user?.name?.split(' ')[0]}</span>
                </h1>
                <p className="text-zinc-400 text-sm md:text-base">Panel de Control General del Kuma Dojo.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                <div className="glass p-6 flex items-center gap-4 hover:border-red-500/30 transition-colors group">
                    <div className="h-14 w-14 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all border border-zinc-800 group-hover:border-blue-500/50">
                        <Users className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">Usuarios</p>
                        <p className="text-4xl md:text-5xl font-serif font-black text-kuma-gold drop-shadow-lg">{stats.users}</p>
                    </div>
                </div>

                <div className="glass p-6 flex items-center gap-4 hover:border-red-500/30 transition-colors group">
                    <div className="h-14 w-14 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all border border-zinc-800 group-hover:border-red-500/50">
                        <Newspaper className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">Noticias</p>
                        <p className="text-4xl md:text-5xl font-serif font-black text-kuma-gold drop-shadow-lg">{stats.news}</p>
                    </div>
                </div>

                {/* VISITAS HOY */}
                {/* VISITAS HOY */}
                <div className="glass p-6 flex items-center gap-4 hover:border-red-500/30 transition-colors group">
                    <div className="h-14 w-14 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-amber-500 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all border border-zinc-800 group-hover:border-amber-500/50">
                        <TrendingUp className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">Visitas Hoy</p>
                        <p className="text-4xl md:text-5xl font-serif font-black text-kuma-gold drop-shadow-lg">{stats.analytics.visitsToday}</p>
                    </div>
                </div>

                {/* VISITAS TOTALES */}
                {/* VISITAS TOTALES */}
                <div className="glass p-6 flex items-center gap-4 hover:border-red-500/30 transition-colors group">
                    <div className="h-14 w-14 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all border border-zinc-800 group-hover:border-purple-500/50">
                        <BarChart3 className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">Total Visitas</p>
                        <p className="text-4xl md:text-5xl font-serif font-black text-kuma-gold drop-shadow-lg">{stats.analytics.totalVisits}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-8 border-t-4 border-t-red-900/50">
                    <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        ACCIONES DE MANDO
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/admin/users" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-4 rounded-lg transition-all font-bold uppercase text-xs tracking-widest">
                            <Users className="w-4 h-4" /> Usuarios
                        </Link>
                        <Link href="/admin/reports" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-4 rounded-lg transition-all font-bold uppercase text-xs tracking-widest">
                            <TrendingUp className="w-4 h-4" /> Reportes
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
