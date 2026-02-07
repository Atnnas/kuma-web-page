"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { handleSignOut } from "@/lib/actions";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CaretDown, CaretRight, List, X, SignOut, Fire } from "@phosphor-icons/react/dist/ssr";
import { StreakFlame } from "./StreakFlame";

interface NavItem {
    name: string;
    href: string;
    subItems?: NavItem[];
}

export function Navbar({ user }: { user?: { name?: string | null; image?: string | null; role?: string | null; isActive?: boolean } }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(null); // State for mobile accordion
    const pathname = usePathname();

    // Hide Navbar on Admin pages check moved to bottom


    const navItems: NavItem[] = [
        { name: "Inicio", href: "/" },
        { name: "Filosofía", href: "/filosofia" },
        {
            name: "Recursos",
            href: "#",
            subItems: [
                { name: "Didáctica", href: "/recursos/didactica" }
            ]
        },
        { name: "Entrenamiento", href: "/entrenamiento" },
        { name: "Calendario de Eventos", href: "/calendario" },
        { name: "Noticias", href: "/noticias" },
        { name: "Tienda", href: "/tienda" },
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

    // Hide Navbar on Admin pages (dedicated layout)
    // MOVED: Must be after all hooks to avoid React Error #300
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
                                <p className="text-zinc-400 text-lg">
                                    El Dojo siempre estará abierto para ti.
                                </p>
                                <div className="mt-6 flex justify-center">
                                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Toggle - Standalone Button (Top Left) */}
            <motion.button
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, scale: 0, rotate: -180 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        transition: {
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            when: "beforeChildren", // Button lands first
                            staggerChildren: 0.2 // Then lines slash in one by one
                        }
                    }
                }}
                className="fixed top-6 left-6 z-50 md:hidden text-white p-3 rounded-full bg-zinc-950/60 border border-white/10 backdrop-blur-xl shadow-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1, borderColor: "rgba(255,255,255,0.3)" }}
                whileTap={{
                    scale: 0.9,
                    rotate: 90,
                    borderColor: "rgba(220, 38, 38, 0.8)",
                    boxShadow: "0 0 20px rgba(220, 38, 38, 0.6)",
                    color: "#EF4444"
                }}
            >
                <List className="w-8 h-8" weight="bold" />
            </motion.button>

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:flex fixed top-0 inset-x-0 z-50 w-full items-center justify-center border-b border-white/5 bg-zinc-950/80 backdrop-blur-2xl"
            >
                <div className="relative px-8 py-4 w-full max-w-[1920px] flex items-center justify-between">
                    {/* Obsidian Blade Edge (Golden Bottom Border) */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-kuma-gold/60 to-transparent shadow-[0_1px_15px_rgba(234,179,8,0.3)]" />


                    {/* Logo Primal OR User Area (Left) */}
                    {user ? (
                        <div className="flex items-center gap-4 relative z-10 mr-8 pl-2">
                            {/* User Info Group */}
                            <div className="flex items-center gap-3 group/user">
                                {/* Avatar */}
                                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10 shadow-sm group-hover/user:border-kuma-gold/50 transition-colors duration-300">
                                    {user.image ? (
                                        <Image src={user.image} alt="User" fill className="object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm">
                                            {user.name?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-col items-start pt-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white leading-none tracking-wide">
                                            {user.name?.split(" ")[0]}
                                        </span>
                                    </div>
                                    <div suppressHydrationWarning>
                                        <StreakFlame />
                                    </div>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="h-6 w-px bg-white/10 mx-1" />

                            {/* Logout Action (Subtle) */}
                            <button
                                onClick={onLogout}
                                className="text-zinc-500 hover:text-red-500 transition-colors p-1.5 hover:bg-white/5 rounded-full"
                                title="Cerrar Sesión"
                            >
                                <SignOut className="w-5 h-5" weight="bold" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/" className="group flex items-center gap-4 relative z-10 mr-8">
                            <div className="relative">
                                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[#6F4E37] shadow-[0_0_15px_rgba(111,78,55,0.6)] group-hover:shadow-[0_0_25px_rgba(111,78,55,0.8)] transition-all duration-500 transform group-hover:scale-110 relative z-10 bg-black">
                                    <Image
                                        src="/images/kuma-logo.jpg"
                                        alt="Kuma Logo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {/* Spinning Glow Effect behind logo */}
                                <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-transparent rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500 animate-spin-slow" />
                            </div>
                            <span className="hidden lg:block text-2xl font-serif font-black tracking-widest text-kuma-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                KUMA DOJO
                            </span>
                        </Link>
                    )}

                    {/* Navigation Items - Desktop */}
                    <div className="flex items-center gap-2 relative z-10 flex-1 justify-center">
                        {navItems.map((item, index) => {
                            const isActive = pathname === item.href || (item.subItems && pathname?.startsWith(item.href));
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isClickable = item.href && item.href !== "#";

                            return (
                                <div
                                    key={item.name}
                                    className="relative group"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {isClickable ? (
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "relative px-4 py-2 text-sm md:text-base lg:text-sm font-medium transition-colors duration-300 flex items-center gap-1",
                                                isActive ? "text-white" : "text-zinc-400 hover:text-white"
                                            )}
                                        >
                                            {/* Hover Effect */}
                                            {hoveredIndex === index && (
                                                <motion.div
                                                    layoutId="navbar-hover"
                                                    className="absolute inset-0 bg-white/10 rounded-full"
                                                    initial={false}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}

                                            {/* Active State */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-active"
                                                    className="absolute inset-0 rounded-full bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                                    initial={false}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}

                                            <span className={cn(
                                                "relative z-10 uppercase tracking-wide text-xs md:text-sm lg:text-xs font-bold",
                                                isActive ? "text-white shadow-black drop-shadow-md" : ""
                                            )}>
                                                {item.name}
                                            </span>
                                            {hasSubItems && (
                                                <CaretDown className={cn("w-3 h-3 relative z-10 transition-transform duration-300", hoveredIndex === index ? "rotate-180" : "")} weight="bold" />
                                            )}
                                        </Link>
                                    ) : (
                                        <div
                                            className={cn(
                                                "relative px-4 py-2 text-sm md:text-base lg:text-sm font-medium transition-colors duration-300 flex items-center gap-1 cursor-default",
                                                isActive ? "text-white" : "text-zinc-400 hover:text-white"
                                            )}
                                        >
                                            {/* Hover Effect (Still show hover for consistent feel) */}
                                            {hoveredIndex === index && (
                                                <motion.div
                                                    layoutId="navbar-hover"
                                                    className="absolute inset-0 bg-white/10 rounded-full"
                                                    initial={false}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}

                                            <span className={cn(
                                                "relative z-10 uppercase tracking-wide text-xs md:text-sm lg:text-xs font-bold",
                                                isActive ? "text-white shadow-black drop-shadow-md" : ""
                                            )}>
                                                {item.name}
                                            </span>
                                            {hasSubItems && (
                                                <CaretDown className={cn("w-3 h-3 relative z-10 transition-transform duration-300", hoveredIndex === index ? "rotate-180" : "")} weight="bold" />
                                            )}
                                        </div>
                                    )}

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {hasSubItems && hoveredIndex === index && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-48 z-50"
                                            >
                                                <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-3xl">
                                                    {item.subItems!.map((sub) => (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className="block px-6 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-[0.1em] relative group/sub"
                                                        >
                                                            <span className="relative z-10">{sub.name}</span>
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-kuma-gold opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action / User Area (Right - Only Login/Register now) */}
                    <div className="flex items-center gap-4 relative z-10 pl-8">
                        {!user && (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors px-2"
                                >
                                    Login
                                </Link>
                                <Link href="/register">
                                    <Button className="rounded-full bg-red-600 hover:bg-white hover:text-black text-white text-xs px-6 py-5 font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300 border border-transparent hover:border-white/50">
                                        Unirse
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </motion.nav >

            {/* Mobile Sidebar - Slide from Left */}
            <AnimatePresence>
                {
                    isMobileMenuOpen && (
                        <motion.div
                            key="mobile-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                        />
                    )
                }
                {
                    isMobileMenuOpen && (
                        <motion.div
                            key="mobile-drawer"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-zinc-950 border-r border-[#6F4E37]/30 shadow-2xl z-[70] p-6 flex flex-col overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-serif font-black text-kuma-gold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">KUMA <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">MENU</span></h2>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400 hover:text-white">
                                    <X className="w-8 h-8" weight="bold" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                {navItems.map((item, index) => {
                                    const hasSubItems = item.subItems && item.subItems.length > 0;
                                    const isExpanded = mobileExpandedIndex === index;

                                    return (
                                        <div key={item.name} className="border-b border-white/5 last:border-0">
                                            {/* Main Item Link or Toggle */}
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={item.href}
                                                    onClick={(e) => {
                                                        if (hasSubItems) {
                                                            // Prevent navigation if it has subitems, toggle instead?
                                                            // Usually better to allow clicking parent if it's a page.
                                                            // Let's allow nav, but maybe add a separate toggle button on right?
                                                            setIsMobileMenuOpen(false);
                                                        } else {
                                                            setIsMobileMenuOpen(false);
                                                        }
                                                    }}
                                                    className="flex-1 text-base font-bold text-zinc-300 hover:text-red-500 transition-colors uppercase tracking-[0.1em] py-3"
                                                >
                                                    {item.name}
                                                </Link>
                                                {hasSubItems && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setMobileExpandedIndex(isExpanded ? null : index);
                                                        }}
                                                        className="p-3 text-zinc-500 hover:text-white"
                                                    >
                                                        <CaretDown className={cn("w-4 h-4 transition-transform duration-300", isExpanded ? "rotate-180" : "")} weight="bold" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Sub Items Accordion */}
                                            <AnimatePresence>
                                                {hasSubItems && isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden bg-white/5 rounded-lg mb-2"
                                                    >
                                                        {item.subItems!.map((sub) => (
                                                            <Link
                                                                key={sub.name}
                                                                href={sub.href}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="flex items-center gap-2 pl-6 pr-4 py-3 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-[0.1em] border-t border-white/5 first:border-0"
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-kuma-gold" />
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}

                                {!user && (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-[0.15em] py-3 mt-4 flex items-center gap-2"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-sm font-black text-red-500 hover:text-red-400 transition-colors uppercase tracking-[0.2em] py-3 flex items-center gap-2"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                            Unirse al Dojo
                                        </Link>
                                    </>
                                )}
                                {user && (
                                    <div className="mt-auto pt-8 border-t border-white/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                                {user.image ? <Image src={user.image} alt="Avatar" fill className="object-cover" /> : <div className="h-full w-full bg-zinc-800" />}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{user.name}</p>
                                                <div className="mt-1" suppressHydrationWarning>
                                                    <StreakFlame variant="mobile" />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onLogout}
                                            className="w-full py-3 bg-red-900/20 text-red-500 border border-red-900/50 rounded-lg uppercase tracking-widest text-xs font-bold hover:bg-red-900/40 transition-colors"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </>
    );
}
