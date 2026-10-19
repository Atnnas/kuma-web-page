"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Newspaper,
    Users,
    Settings,
    Menu,
    X,
    LogOut,
    Calendar,
    Briefcase,
    ShoppingBag,
    Dumbbell,
    Trophy,
    Star,
    ClipboardCheck,
    BarChart3,
    GraduationCap
} from "lucide-react";
import { handleSignOut } from "@/lib/actions";
import Image from "next/image"; // Added for Avatar

// Import User type from next-auth if available or define basic shape
type User = {
    name?: string | null;
    image?: string | null;
    role?: string | null;
};

const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Kuma Academy", href: "/admin/reports/didactica", icon: GraduationCap },
    { label: "Reportes", href: "/admin/reports", icon: BarChart3 },
    { label: "Kuma Manager", href: "/admin/athletes", icon: Star },
    { label: "Asistencia", href: "/admin/attendance", icon: ClipboardCheck },
    { label: "Usuarios", href: "/admin/users", icon: Users },
    { label: "Noticias", href: "/admin/news", icon: Newspaper },
    { label: "Calendario", href: "/admin/events", icon: Calendar },
    { label: "Rutinas", href: "/admin/routines", icon: Dumbbell },
    { label: "Organizadores", href: "/admin/organizers", icon: Briefcase },
    { label: "Tienda", href: "/admin/shop", icon: ShoppingBag },
    { label: "Recompensas", href: "/admin/rewards", icon: Trophy },
    { label: "Configuración", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ user }: { user?: User }) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Dynamic Title Logic
    let displayTitle = "KUMA MENU";

    if (pathname === "/admin") {
        displayTitle = "KUMA MENU";
    } else {
        const activeItem = menuItems.find(item => item.href === pathname);
        if (activeItem) {
            displayTitle = `GESTIÓN ${activeItem.label.toUpperCase()}`;
        } else {
            // Try finding partial match (e.g. subpages)
            const partial = menuItems.find(item => item.href !== "/admin" && pathname.startsWith(item.href));
            if (partial) {
                displayTitle = `GESTIÓN ${partial.label.toUpperCase()}`;
            }
        }
    }

    const renderTitle = () => {
        const baseClass = "font-serif font-black uppercase tracking-widest";
        const goldClass = "text-kuma-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]";
        const redClass = "text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]";

        const words = displayTitle.split(" ");

        if (words.length === 1) {
            return <span className={`${baseClass} ${goldClass}`}>{displayTitle}</span>;
        }

        return (
            <span className={baseClass}>
                <span className={goldClass}>{words[0]}</span>{" "}
                <span className={redClass}>{words.slice(1).join(" ")}</span>
            </span>
        );
    };

    return (
        <>
            {/* --- MOBILE HEADER (PHONES < 768px) --- */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-kuma-gold/40 shadow-sm shrink-0">
                        <img
                            src="/images/kuma-logo.jpg"
                            alt="Kuma Logo"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <span className="font-serif font-black text-kuma-gold tracking-widest text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        KUMA ADMIN
                    </span>
                </div>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 rounded-xl border border-zinc-800 active:scale-95 transition-all"
                    aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
                >
                    {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* --- TABLET HEADER (768px - 1024px) --- */}
            <div className="hidden md:flex lg:hidden fixed top-0 left-0 right-0 h-20 bg-zinc-950/95 backdrop-blur-md border-b border-white/10 items-center justify-between px-6 z-40">
                {/* LEFT: Menu Trigger & Logo */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="p-2.5 text-zinc-300 hover:text-white bg-zinc-900/60 rounded-xl border border-zinc-800 active:scale-95 transition-all"
                        aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <span className="font-serif font-black text-kuma-gold tracking-widest text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        KUMA ADMIN
                    </span>
                </div>

                {/* RIGHT: User & Back Button */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-900/20 border border-red-500/20 hover:bg-red-900/40 hover:border-red-500/50 transition-all">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest group-hover:text-red-400">
                            Volver
                        </span>
                        <LogOut className="w-3.5 h-3.5 text-red-500 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Kuma Admin</p>
                            <p className="text-sm font-bold text-white leading-none">{user?.name?.split(" ")[0]}</p>
                        </div>
                        <div className="relative h-10 w-10 rounded-full border-2 border-[#6F4E37] overflow-hidden shadow-[0_0_10px_rgba(111,78,55,0.4)]">
                            {user?.image ? (
                                <Image src={user.image} alt="Avatar" fill className="object-cover" />
                            ) : (
                                <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Container - Desktop (Static) & Mobile (Fixed/Drawer) */}
            <AnimatePresence>
                {/* Overlay for Mobile & Tablet */}
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[45] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <div className={cn(
                "fixed top-0 bottom-0 z-[50] flex flex-col transition-transform duration-300 h-full h-dvh w-72 max-w-[85vw] bg-zinc-950 border-r border-white/10 left-0 shadow-2xl",
                isMobileOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none lg:pointer-events-auto",
                "lg:translate-x-0 lg:w-64"
            )}>
                {/* Desktop Brand / User Profile Header */}
                <div className="hidden lg:flex h-auto py-6 flex-col items-center justify-center px-4 border-b border-white/10 gap-4 bg-zinc-900/30">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative h-16 w-16 rounded-full border-2 border-[#6F4E37] overflow-hidden shadow-[0_0_15px_rgba(111,78,55,0.5)] group hover:scale-105 transition-transform duration-300">
                            {user?.image ? (
                                <Image src={user.image} alt="Avatar" fill className="object-cover" />
                            ) : (
                                <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-2xl">
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Kuma Admin</p>
                            <p className="text-lg font-black text-white leading-none tracking-wide">{user?.name?.split(" ")[0]}</p>
                        </div>
                    </div>

                    <Link href="/" className="w-full group flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-900/10 border border-red-500/10 hover:bg-red-900/30 hover:border-red-500/40 transition-all">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest group-hover:text-red-400">
                            Volver al Inicio
                        </span>
                        <LogOut className="w-3.5 h-3.5 text-red-500 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Mobile & Tablet Drawer Top Header with Close Button */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/60">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-kuma-gold/50 shadow-md">
                            <img
                                src="/images/kuma-logo.jpg"
                                alt="Kuma Logo"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div>
                            <p className="font-serif font-black text-kuma-gold text-sm tracking-widest leading-none">KUMA DOJO</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                                {user?.name ? `Admin: ${user.name.split(" ")[0]}` : "Panel de Mando"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 active:scale-95 transition-all"
                        title="Cerrar Menú"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-1.5 overflow-y-auto overscroll-contain">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-gradient-to-r from-red-900/40 to-transparent text-white border-l-2 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)] font-bold"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}>
                                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-red-500" : "text-zinc-500")} />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile "Volver al Inicio" Link */}
                <div className="lg:hidden px-4 py-2 border-t border-white/5 bg-zinc-900/30">
                    <Link
                        href="/"
                        onClick={() => setIsMobileOpen(false)}
                        className="w-full group flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-900/10 border border-red-500/10 hover:bg-red-900/30 hover:border-red-500/40 transition-all"
                    >
                        <LogOut className="w-3.5 h-3.5 text-red-500 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest group-hover:text-red-400">
                            Volver al Sitio Web
                        </span>
                    </Link>
                </div>

                {/* Footer / User Info with Safe Area Margin */}
                <div className="p-4 border-t border-white/10 bg-zinc-900/50 flex justify-between items-center pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sesión Activa</span>
                        <span className="text-xs font-bold text-zinc-300 truncate max-w-[150px]">{user?.name || "Kuma"}</span>
                    </div>
                    <form action={handleSignOut}>
                        <button className="p-2.5 text-zinc-400 hover:text-red-500 transition-colors bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl" title="Cerrar Sesión">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
