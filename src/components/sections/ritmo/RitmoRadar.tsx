import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type RitmoTheme = "tactical-hud" | "dragon-ball" | "shotokan-zen" | "cyberpunk-neon";

interface RitmoRadarProps {
    theme: RitmoTheme;
    timerRef: React.MutableRefObject<number>;
    puntosRef: React.MutableRefObject<any[]>;
    status: string;
}

export const RitmoRadar = forwardRef(({ theme, timerRef, puntosRef, status }: RitmoRadarProps, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Setup high-DPI canvas
    useEffect(() => {
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = container.getBoundingClientRect();
            
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    const renderRadar = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const pxPerSec = 100 * dpr;
        const scrollX = (timerRef.current / 100) * pxPerSec;

        ctx.clearRect(0, 0, w, h);

        // Theme palette configuration
        const palette = {
            "tactical-hud": {
                grid: "rgba(234, 179, 8, 0.08)",
                subGrid: "rgba(234, 179, 8, 0.03)",
                scanner: "rgba(234, 179, 8, 0.9)",
                scannerGlow: "rgba(234, 179, 8, 0.6)",
                kimeStroke: "#f59e0b",
                kimeGlow: "rgba(245, 158, 11, 0.8)",
                kimeCap: "#fbbf24",
                fluidStroke: "#eab308",
                fluidGlow: "rgba(234, 179, 8, 0.7)",
                rulerText: "rgba(234, 179, 8, 0.4)",
                rulerTick: "rgba(234, 179, 8, 0.2)"
            },
            "dragon-ball": {
                grid: "rgba(52, 211, 153, 0.12)",
                subGrid: "rgba(52, 211, 153, 0.04)",
                scanner: "rgba(52, 211, 153, 0.95)",
                scannerGlow: "rgba(52, 211, 153, 0.7)",
                kimeStroke: "#f97316",
                kimeGlow: "rgba(249, 115, 22, 0.9)",
                kimeCap: "#fdba74",
                fluidStroke: "#10b981",
                fluidGlow: "rgba(16, 185, 129, 0.8)",
                rulerText: "rgba(52, 211, 153, 0.5)",
                rulerTick: "rgba(52, 211, 153, 0.25)"
            },
            "shotokan-zen": {
                grid: "rgba(229, 43, 52, 0.09)",
                subGrid: "rgba(255, 255, 255, 0.03)",
                scanner: "rgba(229, 43, 52, 0.95)",
                scannerGlow: "rgba(229, 43, 52, 0.6)",
                kimeStroke: "#ef4444",
                kimeGlow: "rgba(239, 68, 68, 0.85)",
                kimeCap: "#fca5a5",
                fluidStroke: "#f59e0b",
                fluidGlow: "rgba(245, 158, 11, 0.6)",
                rulerText: "rgba(229, 43, 52, 0.5)",
                rulerTick: "rgba(229, 43, 52, 0.2)"
            },
            "cyberpunk-neon": {
                grid: "rgba(168, 85, 247, 0.12)",
                subGrid: "rgba(6, 182, 212, 0.05)",
                scanner: "rgba(6, 182, 212, 0.95)",
                scannerGlow: "rgba(6, 182, 212, 0.8)",
                kimeStroke: "#ec4899",
                kimeGlow: "rgba(236, 72, 153, 0.9)",
                kimeCap: "#f472b6",
                fluidStroke: "#06b6d4",
                fluidGlow: "rgba(6, 182, 212, 0.8)",
                rulerText: "rgba(168, 85, 247, 0.5)",
                rulerTick: "rgba(6, 182, 212, 0.25)"
            }
        }[theme] || {
            grid: "rgba(234, 179, 8, 0.08)",
            subGrid: "rgba(234, 179, 8, 0.03)",
            scanner: "rgba(234, 179, 8, 0.9)",
            scannerGlow: "rgba(234, 179, 8, 0.6)",
            kimeStroke: "#f59e0b",
            kimeGlow: "rgba(245, 158, 11, 0.8)",
            kimeCap: "#fbbf24",
            fluidStroke: "#eab308",
            fluidGlow: "rgba(234, 179, 8, 0.7)",
            rulerText: "rgba(234, 179, 8, 0.4)",
            rulerTick: "rgba(234, 179, 8, 0.2)"
        };

        // 1. Grid de Fondo Móvil
        const gridSize = 50 * dpr;
        ctx.lineWidth = 1;
        ctx.strokeStyle = palette.grid;
        for (let x = (w / 2) - (scrollX % gridSize); x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h - (24 * dpr));
            ctx.stroke();
        }

        // Sub-grid horizontal
        const subGridY = 40 * dpr;
        ctx.strokeStyle = palette.subGrid;
        for (let y = subGridY; y < h - (24 * dpr); y += subGridY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // 2. Regla Temporal Inferior (Segundos y Milisegundos)
        const rulerY = h - (16 * dpr);
        ctx.strokeStyle = palette.rulerTick;
        ctx.fillStyle = palette.rulerText;
        ctx.font = `${Math.round(10 * dpr)}px monospace`;
        ctx.textAlign = "center";

        const tickInterval = 50 * dpr; // Cada 0.5s
        const firstTickTime = Math.floor((scrollX - (w / 2)) / pxPerSec);
        const lastTickTime = Math.ceil((scrollX + (w / 2)) / pxPerSec);

        for (let sec = Math.max(0, firstTickTime); sec <= lastTickTime + 1; sec += 0.5) {
            const x = (w / 2) + (sec * pxPerSec) - scrollX;
            if (x < 0 || x > w) continue;

            const isWhole = Math.abs(sec % 1) < 0.01;
            const tickH = (isWhole ? 12 : 6) * dpr;

            ctx.beginPath();
            ctx.moveTo(x, rulerY - tickH);
            ctx.lineTo(x, rulerY);
            ctx.stroke();

            if (isWhole) {
                ctx.fillText(`${sec}s`, x, rulerY + (10 * dpr));
            }
        }

        // 3. Estela Continua (Movimientos Fluidos)
        const fluidos = puntosRef.current.filter(p => p.tipo === "fluido");
        for (let i = 0; i < fluidos.length; i++) {
            const p = fluidos[i];
            if (p.estado === "inicio") {
                const next = fluidos[i + 1];
                const startX = (w / 2) + ((p.tiempo / 100) * pxPerSec) - scrollX;
                const endX = next
                    ? (w / 2) + ((next.tiempo / 100) * pxPerSec) - scrollX
                    : (status === "grabando" ? (w / 2) + ((timerRef.current / 100) * pxPerSec) - scrollX : startX);

                if (endX < startX - 2000) continue;

                const centerY = h / 2 - (10 * dpr);

                // Glow exterior
                ctx.shadowBlur = 18 * dpr;
                ctx.shadowColor = palette.fluidGlow;
                ctx.strokeStyle = palette.fluidStroke;
                ctx.lineWidth = 6 * dpr;
                ctx.lineCap = "round";

                ctx.beginPath();
                ctx.moveTo(startX, centerY);
                ctx.lineTo(endX, centerY);
                ctx.stroke();

                // Núcleo blanco de energía
                ctx.shadowBlur = 0;
                ctx.lineWidth = 2 * dpr;
                ctx.strokeStyle = "#ffffff";
                ctx.beginPath();
                ctx.moveTo(startX, centerY);
                ctx.lineTo(endX, centerY);
                ctx.stroke();
            }
        }

        // 4. Puntos de Impacto Kime (Pulsos)
        puntosRef.current.forEach((p, idx) => {
            if (p.tipo !== "pulso") return;
            const x = (w / 2) + ((p.tiempo / 100) * pxPerSec) - scrollX;
            if (x < -100 || x > w + 100) return;

            const centerY = h / 2 - (10 * dpr);
            const beamHalfH = 38 * dpr;

            // Haz de impacto vertical con resplandor
            ctx.shadowBlur = 16 * dpr;
            ctx.shadowColor = palette.kimeGlow;
            ctx.strokeStyle = palette.kimeStroke;
            ctx.lineWidth = 3.5 * dpr;

            ctx.beginPath();
            ctx.moveTo(x, centerY - beamHalfH);
            ctx.lineTo(x, centerY + beamHalfH);
            ctx.stroke();

            // Cabezales tipo diamante/marcador
            ctx.fillStyle = palette.kimeCap;
            const capSize = 4 * dpr;
            ctx.fillRect(x - capSize, centerY - beamHalfH - capSize, capSize * 2, capSize * 2);
            ctx.fillRect(x - capSize, centerY + beamHalfH - capSize, capSize * 2, capSize * 2);

            // Micro-etiqueta "#N KIME"
            const kimeIndex = puntosRef.current.filter(item => item.tipo === "pulso").indexOf(p) + 1;
            ctx.shadowBlur = 0;
            ctx.fillStyle = palette.kimeCap;
            ctx.font = `bold ${Math.round(8 * dpr)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText(`#${kimeIndex} KIME`, x, centerY - beamHalfH - (6 * dpr));
        });

        // 5. Escáner Central (Línea Láser del Cabezal Reproductor)
        const scanX = w / 2;
        ctx.shadowBlur = 15 * dpr;
        ctx.shadowColor = palette.scannerGlow;
        ctx.strokeStyle = palette.scanner;
        ctx.lineWidth = 2.5 * dpr;
        ctx.setLineDash([12 * dpr, 4 * dpr]);

        ctx.beginPath();
        ctx.moveTo(scanX, 0);
        ctx.lineTo(scanX, h - (16 * dpr));
        ctx.stroke();
        ctx.setLineDash([]);

        // Cursor del cabezal superior e inferior
        ctx.fillStyle = palette.scanner;
        ctx.beginPath();
        ctx.moveTo(scanX - (6 * dpr), 0);
        ctx.lineTo(scanX + (6 * dpr), 0);
        ctx.lineTo(scanX, 10 * dpr);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(scanX - (6 * dpr), h - (16 * dpr));
        ctx.lineTo(scanX + (6 * dpr), h - (16 * dpr));
        ctx.lineTo(scanX, h - (26 * dpr));
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
    };

    useImperativeHandle(ref, () => ({
        renderRadar
    }));

    return (
        <div 
            ref={containerRef}
            className="relative w-full aspect-[21/9] md:aspect-[32/9] bg-black/95 rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9),inset_0_0_80px_rgba(0,0,0,0.8)] group select-none"
        >
            {/* Background Decor por Tema */}
            {theme === "dragon-ball" && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.12)_0,transparent_100%)]" />
                    <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(52,211,153,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.15) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
                </div>
            )}

            {theme === "tactical-hud" && (
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.08)_0,transparent_100%)]" />
                    <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(234,179,8,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
                </div>
            )}

            {theme === "shotokan-zen" && (
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,43,52,0.1)_0,transparent_100%)]" />
                    <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(229,43,52,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(229,43,52,0.1) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
                </div>
            )}

            {theme === "cyberpunk-neon" && (
                <div className="absolute inset-0 pointer-events-none opacity-50">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12)_0,transparent_100%)]" />
                    <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.15) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
                </div>
            )}

            {/* Canvas de Radar HiDPI */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />

            {/* Goku Nube Voladora Animado (Tema Dragon Ball) */}
            <AnimatePresence>
                {theme === "dragon-ball" && (status === "reproduciendo" || status === "grabando") && (
                    <motion.div
                        initial={{ x: "10%", y: "-5%", opacity: 0 }}
                        animate={{
                            y: ["-5%", "5%"],
                            x: ["10%", "13%"],
                            opacity: 1
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            y: { duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                            x: { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                            opacity: { duration: 0.5 }
                        }}
                        className="absolute pointer-events-none z-20 w-28 h-28 md:w-44 md:h-44 top-3"
                    >
                        <img
                            src="/images/kuma-goku-nube-voladora.png"
                            alt="Goku en Nube Voladora"
                            className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

RitmoRadar.displayName = "RitmoRadar";
