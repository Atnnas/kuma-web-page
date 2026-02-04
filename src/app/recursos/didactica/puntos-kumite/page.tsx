"use client";
import { BackButton } from "@/components/ui/BackButton";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { motion } from "framer-motion";

export default function KumitePointsPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Header / Nav */}
            <div className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <BackButton href="/recursos/didactica" />
                </div>
            </div>

            {/* Content Container */}
            <div className="relative w-full max-w-4xl mx-auto pt-32 px-6 pb-20">

                {/* Title */}
                <div className="mb-16 text-center">
                    <PrimalTitle>SISTEMA DE PUNTOS</PrimalTitle>
                    <p className="text-zinc-500 mt-4 font-mono text-sm tracking-widest uppercase">
                        Kumite WKF • Valoración Técnica
                    </p>
                </div>

                {/* Main Visual - Content Style */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-1/2 mx-auto rounded-2xl overflow-hidden mb-16 border border-white/10 shadow-2xl"
                >
                    <img
                        src="/images/kuma-arbitro-puntos.jpg"
                        alt="Kumite Scoring Referee"
                        className="w-full h-auto object-cover"
                    />
                </motion.div>

                {/* Scoring Hierarchy */}
                <div className="grid grid-cols-1 gap-6">

                    {/* IPPON */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-zinc-900/50 border-l-4 border-red-600 p-6 rounded-r-xl relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                            <div>
                                <h3 className="text-4xl font-black text-white mb-1">IPPON</h3>
                                <p className="text-red-500 font-bold tracking-wider text-sm">3 PUNTOS</p>
                            </div>
                            <div className="max-w-md">
                                <ul className="space-y-2 text-zinc-300 font-serif leading-relaxed">
                                    <li className="flex gap-2">
                                        <span className="text-red-500">➜</span> Patadas a la zona alta (Jodan Geri).
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-red-500">➜</span> Cualquier técnica puntuable sobre un oponente caído o desequilibrado.
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* Background Num */}
                        <span className="absolute -right-4 -bottom-8 text-9xl font-black text-white/5 select-none font-serif">3</span>
                    </motion.div>

                    {/* WAZA-ARI */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900/50 border-l-4 border-yellow-500 p-6 rounded-r-xl relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                            <div>
                                <h3 className="text-4xl font-black text-white mb-1">WAZA-ARI</h3>
                                <p className="text-yellow-500 font-bold tracking-wider text-sm">2 PUNTOS</p>
                            </div>
                            <div className="max-w-md">
                                <ul className="space-y-2 text-zinc-300 font-serif leading-relaxed">
                                    <li className="flex gap-2">
                                        <span className="text-yellow-500">➜</span> Patadas a la zona media (Chudan Geri).
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* Background Num */}
                        <span className="absolute -right-4 -bottom-8 text-9xl font-black text-white/5 select-none font-serif">2</span>
                    </motion.div>

                    {/* YUKO */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/50 border-l-4 border-blue-500 p-6 rounded-r-xl relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                            <div>
                                <h3 className="text-4xl font-black text-white mb-1">YUKO</h3>
                                <p className="text-blue-500 font-bold tracking-wider text-sm">1 PUNTO</p>
                            </div>
                            <div className="max-w-md">
                                <ul className="space-y-2 text-zinc-300 font-serif leading-relaxed">
                                    <li className="flex gap-2">
                                        <span className="text-blue-500">➜</span> Tsuki (puño) a zona media o alta.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-blue-500">➜</span> Uchi (golpe de revés/circular) a zona alta.
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* Background Num */}
                        <span className="absolute -right-4 -bottom-8 text-9xl font-black text-white/5 select-none font-serif">1</span>
                    </motion.div>

                </div>

            </div>
        </main>
    );
}
