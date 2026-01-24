"use client";
import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { PhilosophicalQuote } from "@/components/ui/PhilosophicalQuote";

export function Hero() {
    const [animationStep, setAnimationStep] = useState(0); // 0: Start, 1: Spun, 2: Slashed

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative flex flex-col items-center justify-center px-4 text-center z-10"
            >
                {/* DOJO LOGO CONTAINER */}
                <motion.div
                    className="relative mb-12"
                    initial={{ scale: 0, rotate: -360, opacity: 0 }}
                    animate={{
                        scale: 1,
                        rotate: 0,
                        opacity: 1
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        duration: 1.5
                    }}
                    onAnimationComplete={() => setAnimationStep(1)}
                >
                    {/* RESONANCE ANIMATION (Wrapper that triggers after spin) */}
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            filter: [
                                "drop-shadow(0 0 20px rgba(111,78,55,0.4))",
                                "drop-shadow(0 0 50px rgba(220,38,38,0.8))",
                                "drop-shadow(0 0 20px rgba(111,78,55,0.4))"
                            ]
                        }}
                        transition={{
                            delay: 2, // Wait for slashes
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative"
                    >
                        <div className="h-40 w-40 xs:h-48 xs:w-48 sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 xl:h-[32rem] xl:w-[32rem] 2xl:h-[42rem] 2xl:w-[42rem] rounded-full overflow-hidden border-2 md:border-4 border-[#6F4E37] relative bg-black/50 backdrop-blur-sm z-20 transition-all duration-500">
                            <Image
                                src="/images/kuma-logo.jpg"
                                alt="Kuma Dojo Logo"
                                fill
                                className="object-cover"
                                sizes="(max-width: 480px) 160px, (max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />

                            {/* Inner Shine Effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* ELEGANT TEXT - THE VOID SCALE */}
                <motion.div
                    className="relative z-20 mt-8 perspective-1000"
                    initial="hidden"
                    animate={animationStep >= 1 ? "visible" : "hidden"}
                >
                    {/* TITLE - VOID IMPACT (No Wrapper to allow overflow) */}
                    <div className="relative inline-block px-4 py-2">
                        <motion.h1
                            variants={{
                                hidden: { opacity: 0, scale: 0, filter: "blur(20px)" },
                                visible: {
                                    opacity: 1,
                                    scale: [0, 1.5, 1], /* Zoom in PAST the camera then snap back */
                                    filter: "blur(0px)",
                                    transition: {
                                        duration: 0.8,
                                        times: [0, 0.6, 1],
                                        ease: "easeInOut"
                                    }
                                }
                            }}
                            className="text-4xl xs:text-5xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-black font-serif text-kuma-gold tracking-[0.15em] xs:tracking-widest uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-tight relative z-10"
                        >
                            KUMA <span className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.6)] whitespace-nowrap">DOJO</span>
                        </motion.h1>
                    </div>

                    {/* SEPARATOR LINE - EXPLOSIVE GROWTH */}
                    <motion.div
                        variants={{
                            hidden: { width: 0, opacity: 0 },
                            visible: {
                                width: "12rem",
                                opacity: 1,
                                transition: { delay: 0.6, duration: 0.4, type: "spring", stiffness: 300 }
                            }
                        }}
                        className="h-1 bg-red-600 mx-auto mb-4 md:mb-6 shadow-[0_0_20px_rgba(220,38,38,1)] mt-4"
                    />

                    {/* SUBTITLE - RISE UP */}
                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { delay: 0.7, duration: 0.5, ease: "easeOut" }
                            }
                        }}
                        className="text-zinc-200 text-sm sm:text-xl md:text-2xl font-light font-sans tracking-[0.2em] italic drop-shadow-md px-4"
                    >
                        Un camino integral
                    </motion.p>

                    {/* RANDOM PHILOSOPHICAL QUOTE */}
                    <div className="relative z-30">
                        <PhilosophicalQuote />
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
