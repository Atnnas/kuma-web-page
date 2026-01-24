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
    Briefcase
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
    { label: "Noticias", href: "/admin/news", icon: Newspaper },
    { label: "Calendario", href: "/admin/events", icon: Calendar },
    { label: "Organizadores", href: "/admin/organizers", icon: Briefcase },
    { label: "Usuarios", href: "/admin/users", icon: Users },
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
            {/* Simple Layout: Title Left, Menu Right, No User Card */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-white/10 flex items-center justify-between px-4 z-50">
                <span className="font-serif font-black text-kuma-gold tracking-widest text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    KUMA ADMIN
                </span>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-zinc-400 hover:text-white"
                >
                    {isMobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* --- TABLET HEADER (768px - 1024px) --- */}
            {/* Elegant Layout: Menu Left, User Card Right */}
            <div className="hidden md:flex lg:hidden fixed top-0 left-0 right-0 h-20 bg-zinc-950 border-b border-white/10 items-center justify-between px-6 z-50">
                {/* LEFT: Menu Trigger */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-zinc-400 hover:text-white bg-zinc-900/50 rounded-lg border border-zinc-800"
                >
                    {isMobileOpen ? <X /> : <Menu />}
                </button>

                {/* RIGHT: User & Back Button */}
                <div className="flex items-center gap-4">
                    {/* Back to Home 'Portal' */}
                    <Link href="/" className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-900/20 border border-red-500/20 hover:bg-red-900/40 hover:border-red-500/50 transition-all">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest group-hover:text-red-400">
                            Volver
                        </span>
                        <LogOut className="w-3.5 h-3.5 text-red-500 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </Link>

                    {/* Elegant User Profile */}
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
                {/* Overlay for Mobile */}
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[45] md:hidden"
                    />
                )}
            </AnimatePresence>

            <div className={cn(
                "fixed top-0 z-[50] flex flex-col transition-transform duration-300 pt-20 lg:pt-0 h-full w-64 bg-zinc-950",
                // Mobile/Tablet: Right side, slide from right
                "right-0 border-l border-white/10",
                isMobileOpen ? "translate-x-0" : "translate-x-full",
                // Desktop (LG+): Left side, always visible
                "lg:left-0 lg:right-auto lg:translate-x-0 lg:border-r lg:border-l-0"
            )}>
                {/* Desktop Brand */}
                {/* Desktop Brand / User Profile Header */}
                <div className="hidden lg:flex h-auto py-6 flex-col items-center justify-center px-4 border-b border-white/10 gap-4 bg-zinc-900/30">
                    {/* User & Avatar */}
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

                    {/* Back Button */}
                    <Link href="/" className="w-full group flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-900/10 border border-red-500/10 hover:bg-red-900/30 hover:border-red-500/40 transition-all">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest group-hover:text-red-400">
                            Volver al Inicio
                        </span>
                        <LogOut className="w-3.5 h-3.5 text-red-500 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Mobile Brand / Logo - Smart & Cool */}
                <div className="lg:hidden flex flex-col items-center justify-center py-6 border-b border-white/10 bg-zinc-900/50">
                    <Link href="/" className="group flex flex-col items-center gap-3">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-red-600 transition-colors shadow-lg shadow-black/50">
                            {/* Assuming you want to use the logo found or a placeholder if consistent */}
                            <img
                                src="/images/kuma-logo.jpg"
                                alt="Kuma Logo"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <span className="text-xs font-bold text-zinc-500 group-hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
                            <LogOut className="w-3 h-3 rotate-180" /> Ir al Inicio
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-gradient-to-r from-red-900/40 to-transparent text-white border-l-2 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}>
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User Info */}
                <div className="p-4 border-t border-white/10 bg-zinc-900/50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Sesión Activa</span>
                    <form action={handleSignOut}>
                        <button className="p-2 text-zinc-500 hover:text-red-500 transition-colors hover:bg-zinc-800 rounded-lg" title="Cerrar Sesión">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
