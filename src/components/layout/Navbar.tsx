"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { handleSignOut } from "@/lib/actions";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Navbar({ user }: { user?: { name?: string | null; image?: string | null; role?: string | null } }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false); // Nuevo estado para feedback de salida
    const pathname = usePathname();

    // Hide Navbar on Admin pages (dedicated layout)
    if (pathname?.startsWith("/admin")) return null;

    const navItems = [
        { name: "Inicio", href: "/" },
        { name: "Filosofía", href: "/#filosofia" },
        { name: "Entrenamiento", href: "/#entrenamiento" },
        { name: "Calendario de Eventos", href: "/calendario" },
        { name: "Noticias", href: "/noticias" },
        { name: "Tienda", href: "/#tienda" },
        ...(user?.role === "super_admin" ? [{ name: "Herramientas", href: "/admin/news" }] : []),
    ];

    const onLogout = async () => {
        setIsLoggingOut(true);
        // Esperamos un momento para que el usuario vea el mensaje
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            await handleSignOut();
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            // Forzar redirección limpia al home
            window.location.href = "/";
        }
    };

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
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="overflow-visible"
                >
                    <motion.line
                        x1="4" x2="20" y1="12" y2="12"
                        variants={{
                            hidden: { pathLength: 0, opacity: 0, x: -10 },
                            visible: { pathLength: 1, opacity: 1, x: 0, transition: { duration: 0.4, ease: "circOut" } }
                        }}
                    />
                    <motion.line
                        x1="4" x2="20" y1="6" y2="6"
                        variants={{
                            hidden: { pathLength: 0, opacity: 0, x: 10 },
                            visible: { pathLength: 1, opacity: 1, x: 0, transition: { duration: 0.4, ease: "circOut" } }
                        }}
                    />
                    <motion.line
                        x1="4" x2="20" y1="18" y2="18"
                        variants={{
                            hidden: { pathLength: 0, opacity: 0, x: -10 },
                            visible: { pathLength: 1, opacity: 1, x: 0, transition: { duration: 0.4, ease: "circOut" } }
                        }}
                    />
                </motion.svg>
            </motion.button>

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl items-center justify-center"
            >
                <div className="relative px-6 py-3 rounded-full border border-white/10 bg-zinc-950/60 backdrop-blur-xl shadow-2xl flex items-center justify-between overflow-hidden w-full">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/5 pointer-events-none" />

                    {/* Logo Primal */}
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

                    {/* Navigation Items - Desktop */}
                    <div className="flex items-center gap-2 relative z-10 flex-1 justify-center">
                        {navItems.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300"
                            >
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
                                <span className="relative z-10 uppercase tracking-wide text-xs">{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Action / User Area */}
                    <div className="flex items-center gap-4 relative z-10 pl-8">
                        {user ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-serif">Sensei</p>
                                    <p className="text-sm font-bold text-white leading-none">{user.name?.split(" ")[0]}</p>
                                </div>
                                <div className="relative h-10 w-10 rounded-full border-2 border-red-500/50 overflow-hidden shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                                    {user.image ? (
                                        <Image src={user.image} alt="Avatar" fill className="object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                                            {user.name?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={onLogout}
                                    className="ml-2 h-10 w-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
                                    title="Cerrar Sesión"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                </button>
                            </div>
                        ) : (
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
            </motion.nav>

            {/* Mobile Sidebar - Slide from Left */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    />
                )}
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-drawer"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-zinc-950 border-r border-[#6F4E37]/30 shadow-2xl z-[70] p-6 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-serif font-black text-kuma-gold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">KUMA <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">MENU</span></h2>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-base font-medium text-zinc-300 hover:text-red-500 transition-colors uppercase tracking-[0.15em] py-3 border-b border-white/5"
                                >
                                    {item.name}
                                </Link>
                            ))}
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
                                            <p className="text-xs text-zinc-500">Sensei</p>
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
                )}
            </AnimatePresence>
        </>
    );
}
