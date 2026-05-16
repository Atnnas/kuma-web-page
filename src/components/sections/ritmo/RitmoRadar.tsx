import React, { forwardRef, useImperativeHandle, useRef } from "react";

interface RitmoRadarProps {
    theme: "dragon-ball" | "tactical-hud";
    timerRef: React.MutableRefObject<number>;
    puntosRef: React.MutableRefObject<any[]>;
    status: string;
}

export const RitmoRadar = forwardRef(({ theme, timerRef, puntosRef, status }: RitmoRadarProps, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const renderRadar = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const pxPerSec = 100;
        const scrollX = (timerRef.current / 100) * pxPerSec;

        ctx.clearRect(0, 0, w, h);

        // Grid Técnico
        ctx.strokeStyle = theme === "dragon-ball" ? "rgba(52, 211, 153, 0.1)" : "rgba(234,179,8,0.08)";
        ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = (w / 2) - (scrollX % gridSize); x < w; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }

        // Línea central (Scanner)
        ctx.strokeStyle = theme === "dragon-ball" ? "rgba(52, 211, 153, 0.6)" : "rgba(234, 179, 8, 0.6)";
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 5]);
        ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
        ctx.setLineDash([]);

        // PUNTOS DE IMPACTO
        puntosRef.current.forEach(p => {
            if (p.tipo !== "pulso") return;
            const x = (w / 2) + ((p.tiempo / 100) * pxPerSec) - scrollX;
            if (x < -100 || x > w + 100) return;

            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(234, 179, 8, 0.8)";
            ctx.strokeStyle = "rgba(234, 179, 8, 1)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, h / 2 - 40);
            ctx.lineTo(x, h / 2 + 40);
            ctx.stroke();

            ctx.fillStyle = "rgba(234, 179, 8, 1)";
            ctx.fillRect(x - 3, h / 2 - 43, 6, 6);
            ctx.fillRect(x - 3, h / 2 + 37, 6, 6);
            ctx.shadowBlur = 0;
        });

        // ESTELA CONTINUA
        const fluidos = puntosRef.current.filter(p => p.tipo === "fluido");
        for (let i = 0; i < fluidos.length; i++) {
            const p = fluidos[i];
            if (p.estado === "inicio") {
                const next = fluidos[i + 1];
                const startX = (w / 2) + ((p.tiempo / 100) * pxPerSec) - scrollX;
                const endX = next
                    ? (w / 2) + ((next.tiempo / 100) * pxPerSec) - scrollX
                    : (status === "grabando" ? (w / 2) + ((timerRef.current / 100) * pxPerSec) - scrollX : startX);

                if (endX < startX - 1000) continue;

                ctx.shadowBlur = 15;
                ctx.shadowColor = theme === "dragon-ball" ? "rgba(52, 211, 153, 0.7)" : "rgba(234, 179, 8, 0.7)";
                ctx.strokeStyle = theme === "dragon-ball" ? "rgba(52, 211, 153, 1)" : "rgba(234, 179, 8, 1)";
                ctx.lineWidth = 4;

                ctx.beginPath();
                ctx.moveTo(startX, h / 2);
                ctx.lineTo(endX, h / 2);
                ctx.stroke();

                ctx.lineWidth = 1;
                ctx.strokeStyle = "#fff";
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    };

    useImperativeHandle(ref, () => ({
        renderRadar
    }));

    return (
        <div className="relative w-full aspect-[21/9] md:aspect-[32/9] bg-black rounded-[3rem] overflow-hidden border-4 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_100px_rgba(0,0,0,1)] group">
            {theme === "dragon-ball" ? (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.08)_0,transparent_100%)]" />
                    <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(52,211,153,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.15) 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
                </div>
            ) : (
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0,transparent_100%)]" />
                    <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(234,179,8,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
                </div>
            )}
            <canvas
                ref={canvasRef}
                width={2000}
                height={400}
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
});

RitmoRadar.displayName = "RitmoRadar";
