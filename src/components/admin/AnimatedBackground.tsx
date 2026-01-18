"use client";
import React from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* 
               We remove the base dark layer and the heavy gradient pulse 
               to let the "vivid" global body background shine through.
               We keep the particles and the 'drift' effect but make them subtle overlays.
            */}

            {/* Gradient Pulse - Reduced opacity to not wash out the image */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-red-900/10"
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Floating "Dust" Particles - Client Only */}
            {mounted && (
                <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-white/20 blur-[1px]" // Increased brightness slightly
                            initial={{
                                x: Math.random() * 100 + "%",
                                y: Math.random() * 100 + "%",
                                scale: Math.random() * 0.5 + 0.5,
                            }}
                            animate={{
                                y: [null, Math.random() * -100],
                                opacity: [0, 0.8, 0],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 5,
                            }}
                            style={{
                                width: Math.random() * 3 + 1 + "px",
                                height: Math.random() * 3 + 1 + "px",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* 
               The 'metal-bear' image is ALREADY on the body in globals.css.
               However, AdminLayout might be covering it.
               To ensure it's "vivid" here, we can render it explicitly again 
               OR just rely on transparency. 
               
               Let's render it explicitly with the move animation to be safe and "alive",
               but with FULL opacity minus the mix-blend mode that was darkening it.
            */}
            <motion.div
                className="absolute inset-0 z-[-1]"
                style={{
                    backgroundImage: "url('/images/metal-bear.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                animate={{
                    scale: [1, 1.05, 1], // Subtle breathing
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Vignette - Lighter to clear up the center */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80" />
        </div>
    );
}
