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

const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Noticias", href: "/admin/news", icon: Newspaper },
    { label: "Calendario", href: "/admin/events", icon: Calendar },
    { label: "Organizadores", href: "/admin/organizers", icon: Briefcase },
    { label: "Usuarios", href: "/admin/users", icon: Users },
    { label: "Configuración", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
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
            {/* Mobile Header / Toggle */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-white/10 flex items-center justify-between px-4 z-50">
                <span className="font-serif font-black text-kuma-gold tracking-widest text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {renderTitle()}
                </span>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-zinc-400 hover:text-white"
                >
                    {isMobileOpen ? <X /> : <Menu />}
                </button>
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
                "fixed top-0 z-[50] flex flex-col transition-transform duration-300 pt-16 md:pt-0 h-full w-64 bg-zinc-950",
                // Mobile: Right side, slide from right
                "right-0 border-l border-white/10",
                isMobileOpen ? "translate-x-0" : "translate-x-full",
                // Desktop: Left side, always visible
                "md:left-0 md:right-auto md:translate-x-0 md:border-r md:border-l-0"
            )}>
                {/* Desktop Brand */}
                <div className="hidden md:flex h-20 items-center px-6 border-b border-white/10">
                    <h1 className="text-3xl font-serif font-black text-kuma-gold tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                        {renderTitle()}
                    </h1>
                </div>

                {/* Mobile Brand / Logo - Smart & Cool */}
                <div className="md:hidden flex flex-col items-center justify-center py-6 border-b border-white/10 bg-zinc-900/50">
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
                <div className="p-4 border-t border-white/10 bg-zinc-900/50">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-500 uppercase">Sesión Admin</span>
                        <form action={handleSignOut}>
                            <button className="text-zinc-400 hover:text-red-500 transition-colors" title="Cerrar Sesión">
                                <LogOut className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
