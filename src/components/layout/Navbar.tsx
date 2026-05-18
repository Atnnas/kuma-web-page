"use client";
import { motion, AnimatePresence } from "framer-motion";
import { handleSignOut } from "@/lib/actions";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react/dist/ssr";

// Sub-components
import { MobileMenu } from "./MobileMenu";
import { DesktopNav } from "./DesktopNav";

interface NavItem {
    name: string;
    href: string;
    subItems?: NavItem[];
}

export function Navbar({ user }: { user?: { name?: string | null; image?: string | null; role?: string | null; isActive?: boolean } }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(null);
    const pathname = usePathname();

    const navItems: NavItem[] = [
        { name: "Inicio", href: "/" },
        { name: "Filosofía", href: "/philosophy" },
        {
            name: "Recursos",
            href: "#",
            subItems: [
                { name: "Didáctica", href: "/resources/didactica" },
                { name: "Aplicaciones", href: "/resources/aplicaciones" }
            ]
        },
        { name: "Entrenamiento", href: "/training" },
        ...((user || process.env.NODE_ENV === "development") ? [{ name: "KumaCards", href: "/kumacards" }] : []),
        { name: "Calendario de Eventos", href: "/calendar" },
        { name: "Noticias", href: "/news" },
        { name: "Tienda", href: "/shop" },
        ...(user?.role === "super_admin" ? [{ name: "Herramientas", href: "/admin/news" }] : []),
    ];

    const onLogout = async () => {
        setIsLoggingOut(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        try {
            await handleSignOut();
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            window.location.href = "/";
        }
    };

    if (pathname?.startsWith("/admin")) return null;

    return (
        <>
            {/* Logout Overlay */}
            <AnimatePresence>
                {isLoggingOut && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-sm w-full mx-4 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none" />
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold text-white mb-2 font-serif">¡Hasta Pronto!</h2>
                                <p className="text-zinc-400 text-lg">El Dojo siempre estará abierto para ti.</p>
                                <div className="mt-6 flex justify-center">
                                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Toggle */}
            <motion.button
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, scale: 0, rotate: -180 },
                    visible: { opacity: 1, scale: 1, rotate: 0 }
                }}
                className="fixed top-6 left-6 z-50 md:hidden text-white p-3 rounded-full bg-zinc-950/60 border border-white/10 backdrop-blur-xl shadow-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, rotate: 90, color: "#EF4444" }}
            >
                <List className="w-8 h-8" weight="bold" />
            </motion.button>

            {/* Desktop Navigation */}
            <DesktopNav
                navItems={navItems}
                user={user}
                pathname={pathname}
                hoveredIndex={hoveredIndex}
                onSetHoveredIndex={setHoveredIndex}
                onLogout={onLogout}
            />

            {/* Mobile Sidebar */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                navItems={navItems}
                expandedIndex={mobileExpandedIndex}
                onToggleExpand={setMobileExpandedIndex}
                user={user}
                onLogout={onLogout}
            />
        </>
    );
}
