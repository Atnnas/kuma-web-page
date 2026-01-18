"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Newspaper,
    Users,
    Settings,
    Calendar,
    X
} from "lucide-react";


const menuItems = [
    { type: "section", label: "GENERAL" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Usuarios", href: "/admin/users" },
    { icon: Settings, label: "Configuración", href: "/admin/settings" },

    { type: "section", label: "HERRAMIENTAS" },
    { icon: Newspaper, label: "Noticias", href: "/admin/news" },
    { icon: Calendar, label: "Eventos", href: "/admin/events" },
];

export function GlobalAdminSidebar({ role }: { role?: string }) {
    const [isOpen, setIsOpen] = useState(false); // Default to CLOSED
    const pathname = usePathname();

    const activeItem = menuItems.find(item => item.href === pathname);
    const title = activeItem ? activeItem.label : "Kuma Admin";

    // Only render for super_admin
    if (role !== "super_admin") return null;

    return (
        <>
            {/* Toggle Button (Visible when closed) */}
            {!isOpen && (
                <motion.button
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    className="fixed bottom-6 left-6 z-[60] h-12 w-12 bg-zinc-950 border border-red-900/50 rounded-full flex items-center justify-center text-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-110 hover:bg-red-950 transition-all cursor-pointer"
                    onClick={() => setIsOpen(true)}
                    title="Abrir Kuma Admin"
                >
                    <LayoutDashboard className="h-6 w-6" />
                </motion.button>
            )}            {/* Sidebar Drawer */}
            <motion.div
                initial={false}
                animate={{ x: isOpen ? 0 : "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-72 bg-zinc-950/95 backdrop-blur-md border-r border-red-900/30 z-[70] flex flex-col shadow-2xl"
            >
                {/* Header & Close Button */}
                <div className="p-6 flex items-center justify-between border-b border-zinc-900">
                    <h2 className="text-xl font-black text-white tracking-tighter uppercase">
                        {title === "Kuma Admin" ? (
                            <>KUMA <span className="text-red-600">ADMIN</span></>
                        ) : (
                            <span className="text-red-500">{title}</span>
                        )}
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 p-2 rounded-lg hover:bg-zinc-800"
                        title="Ocultar Panel"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
                    {menuItems.map((item, index) => {
                        if (item.type === "section") {
                            return (
                                <div key={index} className="px-4 pt-4 pb-2">
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{item.label}</p>
                                </div>
                            );
                        }

                        const isActive = pathname === item.href;
                        // It's a link item
                        const Icon = item.icon as React.ElementType;

                        return (
                            <Link
                                key={item.href}
                                href={item.href!}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-red-600/10 text-red-500 border border-red-600/20 shadow-[0_0_10px_rgba(220,38,38,0.1)]"
                                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white hover:pl-6"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-900">
                    <div className="bg-zinc-900/50 rounded-xl p-4 mb-4 border border-zinc-800">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Status</p>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#6F4E37] animate-pulse" />
                            <span className="text-sm font-bold text-white">System Active</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
