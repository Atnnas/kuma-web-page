"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { StreakFlame } from "./StreakFlame";
import { cn } from "@/lib/utils";

interface NavItem {
    name: string;
    href: string;
    subItems?: NavItem[];
}

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navItems: NavItem[];
    expandedIndex: number | null;
    onToggleExpand: (index: number | null) => void;
    user?: any;
    onLogout: () => void;
}

export function MobileMenu({
    isOpen,
    onClose,
    navItems,
    expandedIndex,
    onToggleExpand,
    user,
    onLogout
}: MobileMenuProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="mobile-menu-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                />
            )}
            {isOpen && (
                <motion.div
                    key="mobile-menu-content"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-zinc-950 border-r border-[#6F4E37]/30 shadow-2xl z-[70] p-6 flex flex-col overflow-y-auto"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-serif font-black text-kuma-gold uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            KUMA <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">MENU</span>
                        </h2>
                        <button onClick={onClose} className="text-zinc-400 hover:text-white">
                            <X className="w-8 h-8" weight="bold" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {navItems.map((item, index) => {
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isExpanded = expandedIndex === index;

                            return (
                                <div key={`${item.name}-${index}`} className="border-b border-white/5 last:border-0">
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={item.href}
                                            onClick={() => !hasSubItems && onClose()}
                                            className="flex-1 text-base font-bold text-zinc-300 hover:text-red-500 transition-colors uppercase tracking-[0.1em] py-3"
                                        >
                                            {item.name}
                                        </Link>
                                        {hasSubItems && (
                                            <button
                                                onClick={() => onToggleExpand(isExpanded ? null : index)}
                                                className="p-3 text-zinc-500 hover:text-white"
                                            >
                                                <CaretDown className={cn("w-4 h-4 transition-transform duration-300", isExpanded ? "rotate-180" : "")} weight="bold" />
                                            </button>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {hasSubItems && isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden bg-white/5 rounded-lg mb-2"
                                            >
                                                {item.subItems!.map((sub, subIdx) => (
                                                    <Link
                                                        key={`${sub.name}-${subIdx}`}
                                                        href={sub.href}
                                                        onClick={onClose}
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
                                    onClick={onClose}
                                    className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-[0.15em] py-3 mt-4 flex items-center gap-2"
                                >
                                    <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={onClose}
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
            )}
        </AnimatePresence>
    );
}
