"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, SignOut } from "@phosphor-icons/react/dist/ssr";
import { StreakFlame } from "./StreakFlame";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface NavItem {
    name: string;
    href: string;
    subItems?: NavItem[];
}

interface DesktopNavProps {
    navItems: NavItem[];
    user?: any;
    pathname: string;
    hoveredIndex: number | null;
    onSetHoveredIndex: (index: number | null) => void;
    onLogout: () => void;
}

export function DesktopNav({
    navItems,
    user,
    pathname,
    hoveredIndex,
    onSetHoveredIndex,
    onLogout
}: DesktopNavProps) {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex fixed top-0 inset-x-0 z-50 w-full items-center justify-center border-b border-white/5 bg-zinc-950/80 backdrop-blur-2xl"
        >
            <div className="relative px-8 py-4 w-full max-w-[1920px] flex items-center justify-between">
                {/* Golden Bottom Border */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-kuma-gold/60 to-transparent shadow-[0_1px_15px_rgba(234,179,8,0.3)]" />

                {/* Left Area: User or Logo */}
                {user ? (
                    <div className="flex items-center gap-4 relative z-10 mr-8 pl-2">
                        <div className="flex items-center gap-3 group/user">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10 shadow-sm group-hover/user:border-kuma-gold/50 transition-colors duration-300">
                                {user.image ? (
                                    <Image src={user.image} alt="User" fill className="object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm">
                                        {user.name?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-start pt-0.5">
                                <span className="text-xs font-bold text-white leading-none tracking-wide">
                                    {user.name?.split(" ")[0]}
                                </span>
                                <div suppressHydrationWarning>
                                    <StreakFlame />
                                </div>
                            </div>
                        </div>
                        <div className="h-6 w-px bg-white/10 mx-1" />
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
                                <Image src="/images/kuma-logo.jpg" alt="Kuma Logo" fill className="object-cover" />
                            </div>
                            <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-transparent rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500 animate-spin-slow" />
                        </div>
                        <span className="hidden lg:block text-2xl font-serif font-black tracking-widest text-kuma-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            KUMA DOJO
                        </span>
                    </Link>
                )}

                {/* Center Navigation */}
                <div className="flex items-center gap-2 relative z-10 flex-1 justify-center">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href || (item.subItems && pathname?.startsWith(item.href));
                        const hasSubItems = item.subItems && item.subItems.length > 0;
                        const isClickable = item.href && item.href !== "#";

                        return (
                            <div
                                key={`${item.name}-${index}`}
                                className="relative group"
                                onMouseEnter={() => onSetHoveredIndex(index)}
                                onMouseLeave={() => onSetHoveredIndex(null)}
                            >
                                {isClickable ? (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "relative px-4 py-2 text-sm md:text-base lg:text-sm font-medium transition-colors duration-300 flex items-center gap-1",
                                            isActive ? "text-white" : "text-zinc-400 hover:text-white"
                                        )}
                                    >
                                        {hoveredIndex === index && (
                                            <motion.div
                                                layoutId="navbar-hover"
                                                className="absolute inset-0 bg-white/10 rounded-full"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-active"
                                                className="absolute inset-0 rounded-full bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                                    <div className={cn(
                                        "relative px-4 py-2 text-sm md:text-base lg:text-sm font-medium transition-colors duration-300 flex items-center gap-1 cursor-default",
                                        isActive ? "text-white" : "text-zinc-400 hover:text-white"
                                    )}>
                                        {hoveredIndex === index && (
                                            <motion.div
                                                layoutId="navbar-hover"
                                                className="absolute inset-0 bg-white/10 rounded-full"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
                                                {item.subItems!.map((sub, subIdx) => (
                                                    <Link
                                                        key={`${sub.name}-${subIdx}`}
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

                {/* Right Area: Auth */}
                <div className="flex items-center gap-4 relative z-10 pl-8">
                    {!user && (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors px-2">
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
    );
}
