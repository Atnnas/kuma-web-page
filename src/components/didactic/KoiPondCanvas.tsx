"use client";
import React, { useEffect, useRef } from "react";

// ============================================================================
// VARIEDADES NISHIKIGOI TRADICIONALES Y ESPECTRO COMPLETO DE COLORES
// ============================================================================
export type KoiVariety =
    | "kohaku"      // Blanco perla + Rojo carmesí
    | "yamabuki"    // Oro metálico brillante
    | "sanke"       // Blanco + Rojo + Manchas Sumi (negro)
    | "showa"       // Negro azabache + Rojo fuego + Blanco
    | "hi_utsuri"   // Negro obsidiana + Rojo / naranja eléctrico
    | "ki_utsuri"   // Negro obsidiana + Amarillo canario
    | "shiro_utsuri"// Negro carbón + Blanco mármol
    | "tancho"      // Blanco níveo + Disco solar rojo en la frente
    | "asagi"       // Lomo azul índigo / acero + Vientre y aletas naranja coral
    | "midori"      // Verde jade / musgo japonés + Destellos dorados
    | "karasugoi";  // Negro cuervo místico + Puntas de aletas translúcidas

interface SpineJoint {
    x: number;
    y: number;
    angle: number; // Siempre apunta hacia ADELANTE (en dirección al morro)
}

interface FishSpot {
    jointIndex: number;
    offsetAngle: number;
    radiusX: number;
    radiusY: number;
    color: string;
}

interface KoiFish {
    x: number;
    y: number;
    angle: number;
    targetAngle: number;
    speed: number;
    baseSpeed: number;
    maxSpeed: number;
    size: number;
    depth: number;
    variety: KoiVariety;
    swimCycle: number;
    swimCycleSpeed: number;
    spineLength: number;
    segmentDistance: number;
    spine: SpineJoint[];
    bodyRadii: number[];
    spots: FishSpot[];
    turnTimer: number;
    baseColor: string;
    secondaryColor: string;
    accentColor: string;
}

interface WaterRipple {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    alpha: number;
    speed: number;
    lineWidth: number;
}

interface LilyPad {
    xRatio: number;
    yRatio: number;
    radius: number;
    angle: number;
    notchAngle: number;
    driftSpeed: number;
    driftPhase: number;
}

export function KoiPondCanvas({
    className = "",
    opacity = 0.9,
    fishCount = 9,
}: {
    className?: string;
    opacity?: number;
    fishCount?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;
        let dpr = 1;

        const mouse = {
            x: -1000,
            y: -1000,
            hasMoved: false,
            lastMoveTime: 0,
        };

        const handleResize = () => {
            if (!canvas) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
            height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // ====================================================================
        // ANATOMÍA ORGÁNICA CONTINUA (16 VÉRTEBRAS SIN CORTES NI DISCONTINUIDADES)
        // ====================================================================
        // Progresión suave de radios desde el morro redondeado hasta el pedúnculo caudal
        const baseRadii = [
            8.5, 12.5, 16.5, 19.5, 21.5, 21.5, 20.5, 19.0, 17.0, 14.5, 12.0, 9.5, 7.5, 5.5, 4.0, 2.5,
        ];
        const numJoints = baseRadii.length;
        const baseSegmentDist = 9.4;

        const allVarieties: KoiVariety[] = [
            "kohaku",
            "yamabuki",
            "sanke",
            "showa",
            "hi_utsuri",
            "asagi",
            "ki_utsuri",
            "tancho",
            "shiro_utsuri",
            "midori",
            "karasugoi",
        ];

        const createFish = (index: number): KoiFish => {
            const startX = Math.random() * (width || window.innerWidth);
            const startY = Math.random() * (height || window.innerHeight);
            const startAngle = Math.random() * Math.PI * 2;
            const size = 0.85 + Math.random() * 0.45;
            const depth = 0.75 + Math.random() * 0.25;
            const segmentDist = baseSegmentDist * size;
            const variety = allVarieties[index % allVarieties.length];

            const spine: SpineJoint[] = [];
            for (let i = 0; i < numJoints; i++) {
                spine.push({
                    x: startX - Math.cos(startAngle) * i * segmentDist,
                    y: startY - Math.sin(startAngle) * i * segmentDist,
                    angle: startAngle,
                });
            }

            let baseColor = "#FAFAF9";
            let secondaryColor = "#E11D48";
            let accentColor = "#18181B";

            const spots: FishSpot[] = [];

            switch (variety) {
                case "kohaku":
                    baseColor = "#FDFBF7";
                    secondaryColor = "#E11D48";
                    for (let s = 0; s < 3; s++) {
                        spots.push({
                            jointIndex: 2 + s * 4,
                            offsetAngle: (Math.random() - 0.5) * 0.4,
                            radiusX: (13 + Math.random() * 7) * size,
                            radiusY: (10 + Math.random() * 6) * size,
                            color: "#E11D48",
                        });
                    }
                    break;

                case "yamabuki":
                    baseColor = "#F59E0B";
                    secondaryColor = "#FDE68A";
                    accentColor = "#B45309";
                    break;

                case "sanke":
                    baseColor = "#FDFBF7";
                    secondaryColor = "#DC2626";
                    for (let s = 0; s < 3; s++) {
                        spots.push({
                            jointIndex: 2 + s * 4,
                            offsetAngle: (Math.random() - 0.5) * 0.5,
                            radiusX: (12 + Math.random() * 7) * size,
                            radiusY: (10 + Math.random() * 5) * size,
                            color: "#DC2626",
                        });
                    }
                    for (let s = 0; s < 2; s++) {
                        spots.push({
                            jointIndex: 4 + s * 5,
                            offsetAngle: (Math.random() - 0.5) * 0.7,
                            radiusX: (7 + Math.random() * 5) * size,
                            radiusY: (7 + Math.random() * 4) * size,
                            color: "#18181B",
                        });
                    }
                    break;

                case "showa":
                    baseColor = "#18181B";
                    secondaryColor = "#EF4444";
                    accentColor = "#F8FAFC";
                    for (let s = 0; s < 3; s++) {
                        spots.push({
                            jointIndex: 1 + s * 4,
                            offsetAngle: (Math.random() - 0.5) * 0.5,
                            radiusX: (12 + Math.random() * 7) * size,
                            radiusY: (10 + Math.random() * 6) * size,
                            color: "#EF4444",
                        });
                        spots.push({
                            jointIndex: 3 + s * 4,
                            offsetAngle: (Math.random() - 0.5) * 0.5,
                            radiusX: (8 + Math.random() * 5) * size,
                            radiusY: (7 + Math.random() * 5) * size,
                            color: "#F8FAFC",
                        });
                    }
                    break;

                case "hi_utsuri":
                    baseColor = "#18181B";
                    secondaryColor = "#FF3B00";
                    for (let s = 0; s < 4; s++) {
                        spots.push({
                            jointIndex: 1 + s * 3,
                            offsetAngle: (Math.random() - 0.5) * 0.6,
                            radiusX: (12 + Math.random() * 7) * size,
                            radiusY: (9 + Math.random() * 6) * size,
                            color: "#FF3B00",
                        });
                    }
                    break;

                case "ki_utsuri":
                    baseColor = "#18181B";
                    secondaryColor = "#FACC15";
                    for (let s = 0; s < 4; s++) {
                        spots.push({
                            jointIndex: 1 + s * 3,
                            offsetAngle: (Math.random() - 0.5) * 0.6,
                            radiusX: (12 + Math.random() * 7) * size,
                            radiusY: (9 + Math.random() * 6) * size,
                            color: "#FACC15",
                        });
                    }
                    break;

                case "shiro_utsuri":
                    baseColor = "#18181B";
                    secondaryColor = "#F8FAFC";
                    for (let s = 0; s < 4; s++) {
                        spots.push({
                            jointIndex: 1 + s * 3,
                            offsetAngle: (Math.random() - 0.5) * 0.6,
                            radiusX: (12 + Math.random() * 8) * size,
                            radiusY: (10 + Math.random() * 7) * size,
                            color: "#F8FAFC",
                        });
                    }
                    break;

                case "tancho":
                    baseColor = "#FAFAF9";
                    secondaryColor = "#E11D48";
                    spots.push({
                        jointIndex: 1,
                        offsetAngle: 0,
                        radiusX: 10 * size,
                        radiusY: 10 * size,
                        color: "#DC2626",
                    });
                    break;

                case "asagi":
                    baseColor = "#334155";
                    secondaryColor = "#F97316";
                    accentColor = "#64748B";
                    for (let s = 0; s < 4; s++) {
                        spots.push({
                            jointIndex: 3 + s * 3,
                            offsetAngle: 0.65,
                            radiusX: 8 * size,
                            radiusY: 6 * size,
                            color: "#FB923C",
                        });
                        spots.push({
                            jointIndex: 3 + s * 3,
                            offsetAngle: -0.65,
                            radiusX: 8 * size,
                            radiusY: 6 * size,
                            color: "#FB923C",
                        });
                    }
                    break;

                case "midori":
                    baseColor = "#14532D";
                    secondaryColor = "#FDE047";
                    for (let s = 0; s < 3; s++) {
                        spots.push({
                            jointIndex: 2 + s * 4,
                            offsetAngle: (Math.random() - 0.5) * 0.5,
                            radiusX: (11 + Math.random() * 6) * size,
                            radiusY: (9 + Math.random() * 5) * size,
                            color: "#166534",
                        });
                    }
                    break;

                case "karasugoi":
                    baseColor = "#09090B";
                    secondaryColor = "#27272A";
                    accentColor = "rgba(255, 255, 255, 0.4)";
                    break;
            }

            const baseSpeed = (0.9 + Math.random() * 0.6) * depth;

            return {
                x: startX,
                y: startY,
                angle: startAngle,
                targetAngle: startAngle,
                speed: baseSpeed,
                baseSpeed,
                maxSpeed: baseSpeed * 2.8,
                size,
                depth,
                variety,
                swimCycle: Math.random() * Math.PI * 2,
                swimCycleSpeed: 0.05 + Math.random() * 0.025,
                spineLength: numJoints,
                segmentDistance: segmentDist,
                spine,
                bodyRadii: baseRadii.map((r) => r * size * depth),
                spots,
                turnTimer: 30 + Math.floor(Math.random() * 100),
                baseColor,
                secondaryColor,
                accentColor,
            };
        };

        const fishes: KoiFish[] = Array.from({ length: fishCount }, (_, i) => createFish(i));

        // ====================================================================
        // ONDAS CONCÉNTRICAS (RIPPLES)
        // ====================================================================
        const ripples: WaterRipple[] = [];

        const addRipple = (x: number, y: number, maxRadius = 75, speed = 1.0) => {
            if (ripples.length > 30) ripples.shift();
            ripples.push({
                x,
                y,
                radius: 4,
                maxRadius,
                alpha: 0.5,
                speed,
                lineWidth: 1.5,
            });
        };

        // ====================================================================
        // NENÚFARES Y HOJAS DE LOTO FLOTANTES (JARDÍN JAPONÉS)
        // ====================================================================
        const lilyPads: LilyPad[] = [
            { xRatio: 0.1, yRatio: 0.16, radius: 52, angle: 0.4, notchAngle: 0.65, driftSpeed: 0.0006, driftPhase: 0 },
            { xRatio: 0.88, yRatio: 0.22, radius: 58, angle: 1.8, notchAngle: 0.72, driftSpeed: 0.0005, driftPhase: 2.1 },
            { xRatio: 0.16, yRatio: 0.78, radius: 64, angle: 3.2, notchAngle: 0.68, driftSpeed: 0.0007, driftPhase: 4.2 },
            { xRatio: 0.86, yRatio: 0.84, radius: 50, angle: 4.5, notchAngle: 0.75, driftSpeed: 0.0004, driftPhase: 1.2 },
            { xRatio: 0.06, yRatio: 0.48, radius: 40, angle: 2.3, notchAngle: 0.62, driftSpeed: 0.0008, driftPhase: 3.5 },
            { xRatio: 0.92, yRatio: 0.56, radius: 44, angle: 5.1, notchAngle: 0.7, driftSpeed: 0.0005, driftPhase: 5.1 },
        ];

        // ====================================================================
        // EVENTOS INTERACTIVOS (MOUSE & TOUCH)
        // ====================================================================
        const onPointerMove = (e: MouseEvent | TouchEvent) => {
            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
            const rect = canvas.getBoundingClientRect();

            mouse.x = clientX - rect.left;
            mouse.y = clientY - rect.top;
            mouse.hasMoved = true;
            mouse.lastMoveTime = Date.now();
        };

        const onPointerDown = (e: MouseEvent | TouchEvent) => {
            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
            const rect = canvas.getBoundingClientRect();
            const px = clientX - rect.left;
            const py = clientY - rect.top;

            addRipple(px, py, 110, 1.4);
            setTimeout(() => addRipple(px, py, 70, 1.1), 160);

            fishes.forEach((fish) => {
                const dx = fish.x - px;
                const dy = fish.y - py;
                const dist = Math.hypot(dx, dy);
                if (dist < 260) {
                    fish.targetAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5;
                    fish.speed = fish.maxSpeed * 1.3;
                    addRipple(fish.x, fish.y, 45, 1.2);
                }
            });
        };

        window.addEventListener("mousemove", onPointerMove, { passive: true });
        window.addEventListener("mousedown", onPointerDown, { passive: true });
        window.addEventListener("touchmove", onPointerMove, { passive: true });
        window.addEventListener("touchstart", onPointerDown, { passive: true });

        // ====================================================================
        // BUCLE PRINCIPAL DE ANIMACIÓN
        // ====================================================================
        let tick = 0;

        const render = () => {
            tick++;

            ctx.clearRect(0, 0, width, height);

            // Fondo zen de agua oscura con gradiente atmosférico
            const bgGrad = ctx.createRadialGradient(
                width * 0.5,
                height * 0.45,
                width * 0.1,
                width * 0.5,
                height * 0.5,
                Math.max(width, height) * 0.85
            );
            bgGrad.addColorStop(0, "rgba(8, 22, 44, 0.94)");
            bgGrad.addColorStop(0.55, "rgba(5, 16, 32, 0.96)");
            bgGrad.addColorStop(1, "rgba(3, 9, 20, 0.99)");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Cáusticas de agua sutiles (luz refractada en el lecho)
            const causticAlpha = 0.03 + Math.sin(tick * 0.02) * 0.015;
            ctx.fillStyle = `rgba(56, 189, 248, ${causticAlpha})`;
            for (let c = 0; c < 5; c++) {
                const cx = width * (0.15 + c * 0.2) + Math.sin(tick * 0.012 + c) * 40;
                const cy = height * (0.25 + (c % 3) * 0.28) + Math.cos(tick * 0.015 + c) * 35;
                ctx.beginPath();
                ctx.ellipse(cx, cy, 150, 75, (tick * 0.004 + c) % (Math.PI * 2), 0, Math.PI * 2);
                ctx.fill();
            }

            // Ondas espontáneas
            if (tick % 180 === 0 && Math.random() < 0.6) {
                addRipple(
                    Math.random() * width,
                    Math.random() * height,
                    50 + Math.random() * 35,
                    0.6 + Math.random() * 0.35
                );
            }

            // Actualizar ondas de agua
            for (let i = ripples.length - 1; i >= 0; i--) {
                const r = ripples[i];
                r.radius += r.speed;
                r.alpha = Math.max(0, 0.45 * (1 - r.radius / r.maxRadius));

                if (r.alpha <= 0.01 || r.radius >= r.maxRadius) {
                    ripples.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(186, 230, 253, ${r.alpha})`;
                ctx.lineWidth = r.lineWidth;
                ctx.stroke();

                if (r.radius > 16) {
                    ctx.beginPath();
                    ctx.arc(r.x, r.y, r.radius * 0.68, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(125, 211, 252, ${r.alpha * 0.6})`;
                    ctx.lineWidth = r.lineWidth * 0.75;
                    ctx.stroke();
                }
                ctx.restore();
            }

            // Ordenar peces por profundidad
            fishes.sort((a, b) => a.depth - b.depth);

            fishes.forEach((fish) => {
                fish.turnTimer--;
                if (fish.turnTimer <= 0) {
                    fish.turnTimer = 45 + Math.floor(Math.random() * 120);
                    fish.targetAngle += (Math.random() - 0.5) * 1.2;
                }

                const pad = 90;
                if (fish.x < pad) fish.targetAngle = 0 + (Math.random() - 0.5) * 0.5;
                else if (fish.x > width - pad) fish.targetAngle = Math.PI + (Math.random() - 0.5) * 0.5;
                if (fish.y < pad) fish.targetAngle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.5;
                else if (fish.y > height - pad) fish.targetAngle = -Math.PI * 0.5 + (Math.random() - 0.5) * 0.5;

                if (mouse.hasMoved && Date.now() - mouse.lastMoveTime < 2500) {
                    const mdx = fish.x - mouse.x;
                    const mdy = fish.y - mouse.y;
                    const mdist = Math.hypot(mdx, mdy);
                    if (mdist < 150) {
                        fish.targetAngle = Math.atan2(mdy, mdx) + (Math.random() - 0.5) * 0.3;
                        fish.speed = Math.min(fish.maxSpeed, fish.speed + 0.16);
                        if (Math.random() < 0.08) addRipple(fish.x, fish.y, 40, 1.1);
                    }
                }

                fish.speed += (fish.baseSpeed - fish.speed) * 0.025;

                let diffAngle = fish.targetAngle - fish.angle;
                while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
                while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
                fish.angle += diffAngle * 0.04;

                fish.x += Math.cos(fish.angle) * fish.speed;
                fish.y += Math.sin(fish.angle) * fish.speed;

                fish.swimCycle += fish.swimCycleSpeed * (fish.speed / fish.baseSpeed);
                const headWag = Math.sin(fish.swimCycle) * 0.12 * (fish.speed / fish.baseSpeed);

                // ============================================================
                // CINEMÁTICA INVERSA (IK) ESTRICTAMENTE COHERENTE HACIA ADELANTE
                // ============================================================
                // Joint 0 apunta hacia adelante en la dirección de la cabeza
                fish.spine[0].x = fish.x;
                fish.spine[0].y = fish.y;
                fish.spine[0].angle = fish.angle + headWag;

                // Todas las vértebras 1..N-1 se orientan apuntando hacia la vértebra anterior (HACIA ADELANTE)
                for (let j = 1; j < fish.spineLength; j++) {
                    const prev = fish.spine[j - 1];
                    const curr = fish.spine[j];
                    const dx = prev.x - curr.x;
                    const dy = prev.y - curr.y;
                    const dist = Math.hypot(dx, dy) || 1;

                    curr.x = prev.x - (dx / dist) * fish.segmentDistance;
                    curr.y = prev.y - (dy / dist) * fish.segmentDistance;
                    // curr.angle apunta de curr hacia prev (HACIA EL MORRO DEL PEZ)
                    curr.angle = Math.atan2(dy, dx);
                }

                drawOrganicKoi(ctx, fish, true);
                drawOrganicKoi(ctx, fish, false);
            });

            // Nenúfares en superficie
            lilyPads.forEach((pad) => {
                const px = pad.xRatio * width + Math.sin(tick * pad.driftSpeed + pad.driftPhase) * 18;
                const py = pad.yRatio * height + Math.cos(tick * pad.driftSpeed + pad.driftPhase) * 15;
                const rot = pad.angle + Math.sin(tick * 0.0008 + pad.driftPhase) * 0.08;

                drawLilyPad(ctx, px, py, pad.radius, rot, pad.notchAngle);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        // ====================================================================
        // RENDERIZADO ANATÓMICO ORGÁNICO DEL PEZ KOI (SIN CORTES NI PICOS)
        // ====================================================================
        function drawOrganicKoi(c: CanvasRenderingContext2D, fish: KoiFish, isShadow: boolean) {
            c.save();

            const shadowDist = 22 * fish.depth;
            if (isShadow) {
                c.translate(shadowDist * 0.6, shadowDist * 0.9);
                c.fillStyle = "rgba(0, 5, 12, 0.28)";
            }

            // Calcular contornos laterales: Izquierda (+PI/2) y Derecha (-PI/2) respecto al ángulo que apunta ADELANTE
            const leftPoints: { x: number; y: number }[] = [];
            const rightPoints: { x: number; y: number }[] = [];

            for (let i = 0; i < fish.spineLength; i++) {
                const joint = fish.spine[i];
                const r = fish.bodyRadii[i];
                const waveOffset = Math.sin(fish.swimCycle - i * 0.42) * (r * 0.16);
                const leftNorm = joint.angle - Math.PI * 0.5;
                const rightNorm = joint.angle + Math.PI * 0.5;

                leftPoints.push({
                    x: joint.x + Math.cos(leftNorm) * (r + waveOffset),
                    y: joint.y + Math.sin(leftNorm) * (r + waveOffset),
                });
                rightPoints.push({
                    x: joint.x + Math.cos(rightNorm) * (r - waveOffset),
                    y: joint.y + Math.sin(rightNorm) * (r - waveOffset),
                });
            }

            // ----------------------------------------------------------------
            // 1. ALETAS PECTORALES (EN VÉRTEBRA 3, APUNTANDO HACIA ATRÁS-AFUERA)
            // ----------------------------------------------------------------
            const pecJoint = fish.spine[3];
            const pecFlap = Math.sin(fish.swimCycle) * 0.32;
            const pecSize = 36 * fish.size * fish.depth;

            // Aleta izquierda: apunta hacia atrás y a la izquierda (joint.angle + PI + 0.6)
            drawPectoralFin(
                c,
                leftPoints[3].x,
                leftPoints[3].y,
                pecJoint.angle + Math.PI - 0.65 + pecFlap,
                pecSize,
                fish.variety,
                fish.baseColor,
                isShadow
            );

            // Aleta derecha: apunta hacia atrás y a la derecha (joint.angle + PI - 0.6)
            drawPectoralFin(
                c,
                rightPoints[3].x,
                rightPoints[3].y,
                pecJoint.angle + Math.PI + 0.65 - pecFlap,
                pecSize,
                fish.variety,
                fish.baseColor,
                isShadow
            );

            // ----------------------------------------------------------------
            // 2. ALETAS PÉLVICAS / VENTRALES (EN VÉRTEBRA 8)
            // ----------------------------------------------------------------
            const pelvJoint = fish.spine[8];
            const pelvSize = 22 * fish.size * fish.depth;

            drawPectoralFin(
                c,
                leftPoints[8].x,
                leftPoints[8].y,
                pelvJoint.angle + Math.PI - 0.45 + pecFlap * 0.5,
                pelvSize,
                fish.variety,
                fish.baseColor,
                isShadow
            );
            drawPectoralFin(
                c,
                rightPoints[8].x,
                rightPoints[8].y,
                pelvJoint.angle + Math.PI + 0.45 - pecFlap * 0.5,
                pelvSize,
                fish.variety,
                fish.baseColor,
                isShadow
            );

            // ----------------------------------------------------------------
            // 3. ALETA CAUDAL VELO (COLA ONDULANTE ORIENTADA ESTRICTAMENTE ATRÁS)
            // ----------------------------------------------------------------
            // La última vértebra apunta hacia adelante; la cola va a (joint.angle + PI)
            const tailJoint = fish.spine[fish.spineLength - 1];
            const tailWag = Math.sin(fish.swimCycle - 1.4) * 0.4;
            const tailAngle = tailJoint.angle + Math.PI + tailWag; // Estrictamente hacia atrás en el agua
            const tailLength = 54 * fish.size * fish.depth;

            drawCaudalVeilTail(
                c,
                tailJoint.x,
                tailJoint.y,
                tailAngle,
                tailLength,
                fish.variety,
                fish.baseColor,
                fish.secondaryColor,
                isShadow
            );

            // ----------------------------------------------------------------
            // 4. CUERPO HIDRODINÁMICO UNIFICADO (MORRO REDONDO SIN PICOS CORTADOS)
            // ----------------------------------------------------------------
            c.beginPath();

            const head = fish.spine[0];
            const snoutRadius = fish.bodyRadii[0];
            // Morro frontal redondeado
            const snoutTipX = head.x + Math.cos(head.angle) * (snoutRadius * 1.15);
            const snoutTipY = head.y + Math.sin(head.angle) * (snoutRadius * 1.15);

            c.moveTo(snoutTipX, snoutTipY);

            // Transición continua alrededor de la curvatura del morro izquierdo
            const snoutCtrlLX = head.x + Math.cos(head.angle) * snoutRadius + Math.cos(head.angle - Math.PI * 0.5) * (snoutRadius * 0.85);
            const snoutCtrlLY = head.y + Math.sin(head.angle) * snoutRadius + Math.sin(head.angle - Math.PI * 0.5) * (snoutRadius * 0.85);
            c.quadraticCurveTo(snoutCtrlLX, snoutCtrlLY, leftPoints[0].x, leftPoints[0].y);

            // Flanco izquierdo completo mediante spline suave
            for (let i = 0; i < leftPoints.length - 1; i++) {
                const xc = (leftPoints[i].x + leftPoints[i + 1].x) * 0.5;
                const yc = (leftPoints[i].y + leftPoints[i + 1].y) * 0.5;
                c.quadraticCurveTo(leftPoints[i].x, leftPoints[i].y, xc, yc);
            }
            c.lineTo(leftPoints[leftPoints.length - 1].x, leftPoints[leftPoints.length - 1].y);

            // Cierre curvo en el pedúnculo caudal (sin corte plano)
            const lastSpine = fish.spine[fish.spineLength - 1];
            const tailTipX = lastSpine.x - Math.cos(lastSpine.angle) * 3;
            const tailTipY = lastSpine.y - Math.sin(lastSpine.angle) * 3;
            c.quadraticCurveTo(tailTipX, tailTipY, rightPoints[rightPoints.length - 1].x, rightPoints[rightPoints.length - 1].y);

            // Flanco derecho de regreso hacia el morro
            for (let i = rightPoints.length - 1; i > 0; i--) {
                const xc = (rightPoints[i].x + rightPoints[i - 1].x) * 0.5;
                const yc = (rightPoints[i].y + rightPoints[i - 1].y) * 0.5;
                c.quadraticCurveTo(rightPoints[i].x, rightPoints[i].y, xc, yc);
            }
            c.lineTo(rightPoints[0].x, rightPoints[0].y);

            // Cierre suave de la curvatura del morro derecho
            const snoutCtrlRX = head.x + Math.cos(head.angle) * snoutRadius + Math.cos(head.angle + Math.PI * 0.5) * (snoutRadius * 0.85);
            const snoutCtrlRY = head.y + Math.sin(head.angle) * snoutRadius + Math.sin(head.angle + Math.PI * 0.5) * (snoutRadius * 0.85);
            c.quadraticCurveTo(snoutCtrlRX, snoutCtrlRY, snoutTipX, snoutTipY);

            c.closePath();

            if (isShadow) {
                c.fill();
                c.restore();
                return;
            }

            // ----------------------------------------------------------------
            // 5. COLORACIÓN BASE Y SOMBREADO 3D DE VOLUMEN
            // ----------------------------------------------------------------
            c.fillStyle = fish.baseColor;
            c.fill();

            // Sombreado cilíndrico suave en los flancos
            const dorsalNormX = Math.cos(head.angle - Math.PI * 0.5) * 20;
            const dorsalNormY = Math.sin(head.angle - Math.PI * 0.5) * 20;

            const volumeGrad = c.createLinearGradient(
                head.x + dorsalNormX,
                head.y + dorsalNormY,
                head.x - dorsalNormX,
                head.y - dorsalNormY
            );
            volumeGrad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
            volumeGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
            volumeGrad.addColorStop(1, "rgba(0, 0, 0, 0.28)");
            c.fillStyle = volumeGrad;
            c.fill();

            c.strokeStyle = "rgba(255, 255, 255, 0.12)";
            c.lineWidth = 1;
            c.stroke();

            // ----------------------------------------------------------------
            // 6. MANCHAS NISHIKIGOI CON BLEND INTEGRADO
            // ----------------------------------------------------------------
            c.save();
            c.clip();

            fish.spots.forEach((spot) => {
                const j = fish.spine[Math.min(spot.jointIndex, fish.spineLength - 1)];
                const spotX = j.x + Math.cos(j.angle + spot.offsetAngle) * 4;
                const spotY = j.y + Math.sin(j.angle + spot.offsetAngle) * 4;

                const spotGrad = c.createRadialGradient(
                    spotX,
                    spotY,
                    spot.radiusX * 0.2,
                    spotX,
                    spotY,
                    spot.radiusX
                );
                spotGrad.addColorStop(0, spot.color);
                spotGrad.addColorStop(0.85, spot.color);
                spotGrad.addColorStop(1, "rgba(0, 0, 0, 0.02)");

                c.beginPath();
                c.ellipse(spotX, spotY, spot.radiusX, spot.radiusY, j.angle, 0, Math.PI * 2);
                c.fillStyle = spotGrad;
                c.fill();
            });

            // Reflejo iridiscente en la cresta de la columna
            c.beginPath();
            for (let i = 2; i < fish.spineLength - 3; i++) {
                const j = fish.spine[i];
                c.arc(j.x, j.y, fish.bodyRadii[i] * 0.35, 0, Math.PI * 2);
            }
            c.fillStyle = "rgba(255, 255, 255, 0.08)";
            c.fill();

            c.restore();

            // ----------------------------------------------------------------
            // 7. ALETA DORSAL
            // ----------------------------------------------------------------
            c.beginPath();
            const dorsalStart = fish.spine[3];
            c.moveTo(dorsalStart.x, dorsalStart.y);
            for (let i = 4; i <= 10; i++) {
                const j = fish.spine[i];
                c.lineTo(j.x, j.y);
            }
            c.strokeStyle = fish.variety === "yamabuki" ? "rgba(251, 191, 36, 0.65)" : "rgba(255, 255, 255, 0.55)";
            c.lineWidth = 2.4 * fish.size;
            c.stroke();

            // ----------------------------------------------------------------
            // 8. OJOS INTEGRADOS EN EL CRÁNEO Y BIGOTES (HIGE - 髭)
            // ----------------------------------------------------------------
            const eyeJoint = fish.spine[1];
            const eyeNorm = eyeJoint.angle - Math.PI * 0.5;
            const eyeDist = fish.bodyRadii[1] * 0.72;
            const eyeR = Math.max(1.8, 2.6 * fish.size * fish.depth);

            drawEye(c, eyeJoint.x + Math.cos(eyeNorm) * eyeDist, eyeJoint.y + Math.sin(eyeNorm) * eyeDist, eyeR);
            drawEye(c, eyeJoint.x - Math.cos(eyeNorm) * eyeDist, eyeJoint.y - Math.sin(eyeNorm) * eyeDist, eyeR);

            // Bigotes táctiles del pez Koi en las comisuras del morro
            const barbelLen = 10 * fish.size;
            const bAngleL = head.angle - Math.PI * 0.55;
            const bAngleR = head.angle + Math.PI * 0.55;

            c.beginPath();
            c.moveTo(snoutTipX, snoutTipY);
            c.quadraticCurveTo(
                snoutTipX + Math.cos(bAngleL) * (barbelLen * 0.6),
                snoutTipY + Math.sin(bAngleL) * (barbelLen * 0.6),
                snoutTipX + Math.cos(bAngleL + 0.2) * barbelLen,
                snoutTipY + Math.sin(bAngleL + 0.2) * barbelLen
            );
            c.moveTo(snoutTipX, snoutTipY);
            c.quadraticCurveTo(
                snoutTipX + Math.cos(bAngleR) * (barbelLen * 0.6),
                snoutTipY + Math.sin(bAngleR) * (barbelLen * 0.6),
                snoutTipX + Math.cos(bAngleR - 0.2) * barbelLen,
                snoutTipY + Math.sin(bAngleR - 0.2) * barbelLen
            );
            c.strokeStyle = "rgba(255, 255, 255, 0.35)";
            c.lineWidth = 0.9;
            c.stroke();

            c.restore();
        }

        function drawEye(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
            c.beginPath();
            c.arc(x, y, r, 0, Math.PI * 2);
            c.fillStyle = "#09090B";
            c.fill();

            c.beginPath();
            c.arc(x - r * 0.3, y - r * 0.3, r * 0.38, 0, Math.PI * 2);
            c.fillStyle = "rgba(255, 255, 255, 0.92)";
            c.fill();
        }

        // Aleta pectoral orientada suavemente hacia atrás
        function drawPectoralFin(
            c: CanvasRenderingContext2D,
            baseX: number,
            baseY: number,
            angle: number,
            length: number,
            variety: KoiVariety,
            baseColor: string,
            isShadow: boolean
        ) {
            c.save();
            c.translate(baseX, baseY);
            c.rotate(angle);

            c.beginPath();
            c.moveTo(0, 0);
            c.bezierCurveTo(length * 0.4, length * 0.42, length * 0.85, length * 0.25, length, length * 0.05);
            c.bezierCurveTo(length * 0.72, -length * 0.2, length * 0.32, -length * 0.15, 0, 0);
            c.closePath();

            if (isShadow) {
                c.fillStyle = "rgba(0, 4, 10, 0.22)";
                c.fill();
            } else {
                const finGrad = c.createLinearGradient(0, 0, length, 0);
                if (variety === "yamabuki") {
                    finGrad.addColorStop(0, "rgba(245, 158, 11, 0.8)");
                    finGrad.addColorStop(0.55, "rgba(251, 191, 36, 0.45)");
                    finGrad.addColorStop(1, "rgba(254, 240, 138, 0.15)");
                } else if (variety === "hi_utsuri" || variety === "asagi") {
                    finGrad.addColorStop(0, "rgba(249, 115, 22, 0.85)");
                    finGrad.addColorStop(0.6, "rgba(251, 146, 60, 0.4)");
                    finGrad.addColorStop(1, "rgba(255, 255, 255, 0.15)");
                } else {
                    finGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
                    finGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.35)");
                    finGrad.addColorStop(1, "rgba(255, 255, 255, 0.12)");
                }
                c.fillStyle = finGrad;
                c.fill();

                // Radios de la aleta
                c.beginPath();
                for (let r = 1; r <= 4; r++) {
                    const frac = r / 5;
                    c.moveTo(0, 0);
                    c.quadraticCurveTo(length * 0.45, length * (0.22 - frac * 0.1), length * 0.88, length * (frac * 0.14 - 0.04));
                }
                c.strokeStyle = "rgba(255, 255, 255, 0.25)";
                c.lineWidth = 0.8;
                c.stroke();
            }

            c.restore();
        }

        // Aleta caudal velo (flotando estrictamente HACIA ATRÁS en el agua)
        function drawCaudalVeilTail(
            c: CanvasRenderingContext2D,
            baseX: number,
            baseY: number,
            angle: number, // Ya contiene rotación de 180° hacia atrás
            length: number,
            variety: KoiVariety,
            baseColor: string,
            secondaryColor: string,
            isShadow: boolean
        ) {
            c.save();
            c.translate(baseX, baseY);
            c.rotate(angle); // +X se extiende directamente hacia atrás en el agua

            const flare = length * 0.65;
            const baseW = 3.5;

            // Abanico bilobulado fluido que se ensancha hacia atrás
            c.beginPath();
            c.moveTo(0, 0);
            // Lóbulo superior abriéndose hacia atrás (+X)
            c.bezierCurveTo(length * 0.35, baseW * 1.5, length * 0.7, flare * 0.85, length, flare);
            // Muesca central del abanico
            c.quadraticCurveTo(length * 0.78, flare * 0.3, length * 0.65, 0);
            // Lóbulo inferior abriéndose hacia atrás (+X)
            c.quadraticCurveTo(length * 0.78, -flare * 0.3, length, -flare);
            // Retorno a la base
            c.bezierCurveTo(length * 0.7, -flare * 0.85, length * 0.35, -baseW * 1.5, 0, 0);
            c.closePath();

            if (isShadow) {
                c.fillStyle = "rgba(0, 4, 10, 0.22)";
                c.fill();
            } else {
                const tailGrad = c.createLinearGradient(0, 0, length, 0);
                if (variety === "yamabuki") {
                    tailGrad.addColorStop(0, "rgba(245, 158, 11, 0.85)");
                    tailGrad.addColorStop(0.5, "rgba(251, 191, 36, 0.45)");
                    tailGrad.addColorStop(1, "rgba(254, 240, 138, 0.18)");
                } else if (variety === "hi_utsuri" || variety === "asagi") {
                    tailGrad.addColorStop(0, "rgba(249, 115, 22, 0.85)");
                    tailGrad.addColorStop(0.6, "rgba(251, 146, 60, 0.35)");
                    tailGrad.addColorStop(1, "rgba(255, 255, 255, 0.12)");
                } else {
                    tailGrad.addColorStop(0, "rgba(255, 255, 255, 0.88)");
                    tailGrad.addColorStop(0.4, "rgba(254, 205, 211, 0.35)");
                    tailGrad.addColorStop(1, "rgba(255, 255, 255, 0.12)");
                }
                c.fillStyle = tailGrad;
                c.fill();

                // Radios de seda estriados de la cola
                c.beginPath();
                for (let r = -3; r <= 3; r++) {
                    const spread = (r / 3) * (flare * 0.82);
                    c.moveTo(0, 0);
                    c.quadraticCurveTo(length * 0.48, spread * 0.5, length * 0.92, spread);
                }
                c.strokeStyle = "rgba(255, 255, 255, 0.22)";
                c.lineWidth = 0.9;
                c.stroke();
            }

            c.restore();
        }

        // ====================================================================
        // DIBUJO DE NENÚFARES (LILY PADS FLOTANTES)
        // ====================================================================
        function drawLilyPad(
            c: CanvasRenderingContext2D,
            x: number,
            y: number,
            radius: number,
            rotation: number,
            notchWidth = 0.65
        ) {
            c.save();
            c.translate(x, y);

            c.beginPath();
            c.arc(12, 18, radius, 0, Math.PI * 2);
            c.fillStyle = "rgba(0, 5, 12, 0.25)";
            c.fill();

            c.rotate(rotation);

            const startAngle = notchWidth * 0.5;
            const endAngle = Math.PI * 2 - notchWidth * 0.5;

            c.beginPath();
            c.moveTo(0, 0);
            c.arc(0, 0, radius, startAngle, endAngle);
            c.closePath();

            const padGrad = c.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
            padGrad.addColorStop(0, "#15803D");
            padGrad.addColorStop(0.7, "#14532D");
            padGrad.addColorStop(1, "#052E16");
            c.fillStyle = padGrad;
            c.fill();

            c.strokeStyle = "rgba(134, 239, 172, 0.25)";
            c.lineWidth = 1.5;
            c.stroke();

            c.strokeStyle = "rgba(187, 247, 208, 0.16)";
            c.lineWidth = 1;
            const numVeins = 7;
            for (let v = 0; v < numVeins; v++) {
                const vAngle = startAngle + (endAngle - startAngle) * ((v + 0.5) / numVeins);
                c.beginPath();
                c.moveTo(0, 0);
                c.lineTo(Math.cos(vAngle) * (radius * 0.85), Math.sin(vAngle) * (radius * 0.85));
                c.stroke();
            }

            c.beginPath();
            c.arc(0, 0, 3.5, 0, Math.PI * 2);
            c.fillStyle = "rgba(254, 240, 138, 0.45)";
            c.fill();

            c.restore();
        }

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", onPointerMove);
            window.removeEventListener("mousedown", onPointerDown);
            window.removeEventListener("touchmove", onPointerMove);
            window.removeEventListener("touchstart", onPointerDown);
        };
    }, [fishCount]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`fixed inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${className}`}
            style={{
                opacity,
                zIndex: 0,
            }}
        />
    );
}
