import { auth } from "@/auth";
import { Users, Newspaper, Activity, Trophy, BarChart3, TrendingUp, Star, GraduationCap, ClipboardCheck, ArrowUpRight, Dumbbell } from "lucide-react";
import Link from "next/link";
import { getNews } from "@/lib/actions/news";
import connectDB from "@/lib/db";
import User from "@/models/User";
import DidacticProgress from "@/models/DidacticProgress";

import { getAnalyticsStats } from "@/lib/actions/analytics";

async function getStats() {
    await connectDB();
    const userCount = await User.countDocuments();
    const news = await getNews();
    const analytics = await getAnalyticsStats();
    let academyCount = 0;
    try {
        academyCount = await DidacticProgress.countDocuments();
    } catch {
        academyCount = 0;
    }

    return {
        users: userCount,
        news: news.length,
        analytics,
        academyCount
    };
}

export default async function AdminDashboard() {
    const session = await auth();
    const stats = await getStats();

    return (
        <div className="space-y-6 sm:space-y-8 min-w-0 pb-12">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-black uppercase tracking-wider sm:tracking-widest mb-1 text-kuma-gold drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] break-words leading-tight">
                    Bienvenido, <span className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)] inline">{session?.user?.name?.split(' ')[0]}</span>
                </h1>
                <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-medium">Panel de Control General del Kuma Dojo.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <Link href="/admin/users" className="glass p-4 sm:p-6 flex items-center gap-3.5 sm:gap-4 rounded-2xl hover:border-blue-500/50 hover:bg-white/5 transition-all group min-w-0 cursor-pointer">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all border border-zinc-800 group-hover:border-blue-500/50 shrink-0">
                        <Users className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-0.5 sm:mb-1 truncate">Usuarios</p>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-kuma-gold drop-shadow-lg leading-none truncate">{stats.users}</p>
                    </div>
                </Link>

                {/* KUMA SENSEI ACADEMY */}
                <Link href="/admin/reports/didactica" className="glass p-4 sm:p-6 flex items-center gap-3.5 sm:gap-4 rounded-2xl hover:border-amber-500/60 hover:bg-amber-950/20 transition-all group min-w-0 cursor-pointer border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.08)]">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:text-amber-300 group-hover:shadow-[0_0_18px_rgba(245,158,11,0.4)] transition-all border border-amber-500/30 group-hover:border-amber-500/60 shrink-0">
                        <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                            <p className="text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] truncate">Kuma Academy</p>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        </div>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white drop-shadow-lg leading-none truncate">{stats.academyCount}</p>
                        <span className="text-[10px] text-amber-300/80 font-bold tracking-wider mt-1 block">Ver Reporte Alumnos ➔</span>
                    </div>
                </Link>

                {/* VISITAS HOY */}
                <Link href="/admin/reports/visits" className="glass p-4 sm:p-6 flex items-center gap-3.5 sm:gap-4 rounded-2xl hover:border-emerald-500/50 hover:bg-white/5 transition-all group min-w-0 cursor-pointer">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all border border-zinc-800 group-hover:border-emerald-500/50 shrink-0">
                        <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-0.5 sm:mb-1 truncate">Visitas Hoy</p>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-kuma-gold drop-shadow-lg leading-none truncate">{stats.analytics.visitsToday}</p>
                    </div>
                </Link>

                {/* VISITAS TOTALES */}
                <Link href="/admin/reports/visits" className="glass p-4 sm:p-6 flex items-center gap-3.5 sm:gap-4 rounded-2xl hover:border-purple-500/50 hover:bg-white/5 transition-all group min-w-0 cursor-pointer">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all border border-zinc-800 group-hover:border-purple-500/50 shrink-0">
                        <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-0.5 sm:mb-1 truncate">Total Visitas</p>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-kuma-gold drop-shadow-lg leading-none truncate">{stats.analytics.totalVisits}</p>
                    </div>
                </Link>
            </div>

            {/* BANNER DESTACADO: REPORTE DE KUMA SENSEI ACADEMY */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-zinc-900/90 to-zinc-950 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/50 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500 text-black shadow-sm font-bold">
                                Reporte en Vivo
                            </span>
                            <h3 className="text-base sm:text-lg font-serif font-black text-white">
                                Auditoría de Kuma Sensei Academy
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                            Supervisa quiénes entran al tatami interactivo, días de inactividad, niveles ganados, estado de ánimo del Sensei y avance hacia el próximo cinturón.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                    <Link
                        href="/admin/reports/didactica"
                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-kuma-gold to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 cursor-pointer font-serif"
                    >
                        <span>Ver Reporte Alumnos</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/admin/reports"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all border border-zinc-700/80 cursor-pointer"
                        title="Ver todos los reportes (visitas, rutinas, alumnos)"
                    >
                        <BarChart3 className="w-4 h-4 text-zinc-400" />
                        <span className="hidden sm:inline">Centro de Reportes</span>
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="glass p-5 sm:p-8 rounded-2xl border-t-4 border-t-red-900/50">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        GESTIÓN & REPORTES
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Link href="/admin/reports/didactica" className="flex items-center justify-center gap-2 bg-amber-950/40 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-amber-300 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            <GraduationCap className="w-4 h-4" /> Kuma Academy
                        </Link>
                        <Link href="/admin/reports" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            <BarChart3 className="w-4 h-4" /> Reportes Hub
                        </Link>
                        <Link href="/admin/athletes" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            <Star className="w-4 h-4 text-kuma-gold" /> Kuma Manager
                        </Link>
                        <Link href="/admin/attendance" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            <ClipboardCheck className="w-4 h-4 text-emerald-400" /> Asistencia
                        </Link>
                        <Link href="/admin/users" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            <Users className="w-4 h-4" /> Usuarios
                        </Link>
                        <Link href="/admin/routines" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            <Dumbbell className="w-4 h-4" /> Rutinas
                        </Link>
                    </div>
                </div>

                <div className="glass p-5 sm:p-8 rounded-2xl border-t-4 border-t-kuma-gold/50">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        CONTENIDO & EVENTOS
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Link href="/admin/news" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            <Newspaper className="w-4 h-4" /> Noticias ({stats.news})
                        </Link>
                        <Link href="/admin/events" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            <Trophy className="w-4 h-4 text-amber-400" /> Torneos & Eventos
                        </Link>
                        <Link href="/admin/shop" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            Tienda Oficial
                        </Link>
                        <Link href="/admin/rewards" className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-white hover:text-black border border-zinc-800 p-3.5 sm:p-4 rounded-xl transition-all font-bold uppercase text-xs tracking-widest min-h-[48px] active:scale-98">
                            Recompensas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
