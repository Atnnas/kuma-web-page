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
    angle: number; // Apunta siempre hacia ADELANTE en la dirección del nado
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
    depth: number; // 0.65 (profundo, más etéreo y difuso) a 1.0 (cerca de superficie)
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
    glowColor: string;
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
    opacity = 0.92,
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
        // ANATOMÍA ANCHA TÍPICA DE CARPA KOI (CABEZA AMPLIA & TORSO CILÍNDRICO)
        // ====================================================================
        // Morro ancho abombado -> Frente amplia con ojos -> Branquias anchas -> Tórax robusto -> Pedúnculo
        const baseRadii = [
            10.5, 14.5, 18.0, 20.5, 22.0, 22.5, 21.8, 20.5, 18.5, 16.0, 13.5, 11.0, 8.5, 6.5, 4.5, 2.8,
        ];
        const numJoints = baseRadii.length;
        const baseSegmentDist = 9.2;

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
            const size = 0.9 + Math.random() * 0.45;
            const depth = 0.72 + Math.random() * 0.28; // Profundidad en el agua
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
            let glowColor = "rgba(56, 189, 248, 0.25)";

            const spots: FishSpot[] = [];

            switch (variety) {
                case "kohaku":
                    baseColor = "#FDFBF7";
                    secondaryColor = "#E11D48";
                    glowColor = "rgba(244, 63, 94, 0.25)";
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
                    glowColor = "rgba(250, 204, 21, 0.35)";
                    break;

                case "sanke":
                    baseColor = "#FDFBF7";
                    secondaryColor = "#DC2626";
                    glowColor = "rgba(239, 68, 68, 0.25)";
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
                    glowColor = "rgba(248, 113, 113, 0.25)";
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
                    glowColor = "rgba(255, 87, 34, 0.3)";
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
                    glowColor = "rgba(250, 204, 21, 0.35)";
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
                    glowColor = "rgba(255, 255, 255, 0.25)";
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
                    glowColor = "rgba(225, 29, 72, 0.3)";
                    spots.push({
                        jointIndex: 1,
                        offsetAngle: 0,
                        radiusX: 11 * size,
                        radiusY: 11 * size,
                        color: "#DC2626",
                    });
                    break;

                case "asagi":
                    baseColor = "#334155";
                    secondaryColor = "#F97316";
                    accentColor = "#64748B";
                    glowColor = "rgba(249, 115, 22, 0.3)";
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
                    glowColor = "rgba(74, 222, 128, 0.25)";
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
                    accentColor = "rgba(255, 255, 255, 0.45)";
                    glowColor = "rgba(148, 163, 184, 0.2)";
                    break;
            }

            const baseSpeed = (0.85 + Math.random() * 0.55) * depth;

            return {
                x: startX,
                y: startY,
                angle: startAngle,
                targetAngle: startAngle,
                speed: baseSpeed,
                baseSpeed,
                maxSpeed: baseSpeed * 2.6,
                size,
                depth,
                variety,
                swimCycle: Math.random() * Math.PI * 2,
                swimCycleSpeed: 0.045 + Math.random() * 0.02,
                spineLength: numJoints,
                segmentDistance: segmentDist,
                spine,
                bodyRadii: baseRadii.map((r) => r * size * depth),
                spots,
                turnTimer: 30 + Math.floor(Math.random() * 100),
                baseColor,
                secondaryColor,
                accentColor,
                glowColor,
            };
        };

        const fishes: KoiFish[] = Array.from({ length: fishCount }, (_, i) => createFish(i));

        // ====================================================================
        // ONDAS CONCÉNTRICAS (RIPPLES)
        // ====================================================================
        const ripples: WaterRipple[] = [];

        const addRipple = (x: number, y: number, maxRadius = 80, speed = 1.0) => {
            if (ripples.length > 30) ripples.shift();
            ripples.push({
                x,
                y,
                radius: 4,
                maxRadius,
                alpha: 0.45,
                speed,
                lineWidth: 1.5,
            });
        };

        // ====================================================================
        // NENÚFARES Y HOJAS DE LOTO FLOTANTES (JARDÍN JAPONÉS)
        // ====================================================================
        const lilyPads: LilyPad[] = [
            { xRatio: 0.09, yRatio: 0.16, radius: 52, angle: 0.4, notchAngle: 0.65, driftSpeed: 0.0006, driftPhase: 0 },
            { xRatio: 0.89, yRatio: 0.22, radius: 58, angle: 1.8, notchAngle: 0.72, driftSpeed: 0.0005, driftPhase: 2.1 },
            { xRatio: 0.15, yRatio: 0.78, radius: 64, angle: 3.2, notchAngle: 0.68, driftSpeed: 0.0007, driftPhase: 4.2 },
            { xRatio: 0.86, yRatio: 0.84, radius: 50, angle: 4.5, notchAngle: 0.75, driftSpeed: 0.0004, driftPhase: 1.2 },
            { xRatio: 0.05, yRatio: 0.48, radius: 40, angle: 2.3, notchAngle: 0.62, driftSpeed: 0.0008, driftPhase: 3.5 },
            { xRatio: 0.93, yRatio: 0.54, radius: 46, angle: 5.1, notchAngle: 0.7, driftSpeed: 0.0005, driftPhase: 5.1 },
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

            addRipple(px, py, 115, 1.4);
            setTimeout(() => addRipple(px, py, 75, 1.1), 160);

            fishes.forEach((fish) => {
                const dx = fish.x - px;
                const dy = fish.y - py;
                const dist = Math.hypot(dx, dy);
                if (dist < 260) {
                    fish.targetAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5;
                    fish.speed = fish.maxSpeed * 1.35;
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

            // 1. Fondo zen de agua oscura con gradiente atmosférico
            const bgGrad = ctx.createRadialGradient(
                width * 0.5,
                height * 0.45,
                width * 0.1,
                width * 0.5,
                height * 0.5,
                Math.max(width, height) * 0.85
            );
            bgGrad.addColorStop(0, "rgba(8, 24, 48, 0.94)");
            bgGrad.addColorStop(0.55, "rgba(5, 17, 36, 0.97)");
            bgGrad.addColorStop(1, "rgba(2, 9, 22, 0.99)");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // 2. Cáusticas de agua ondulantes (refracción de luz en el agua)
            const causticAlpha = 0.035 + Math.sin(tick * 0.02) * 0.015;
            ctx.fillStyle = `rgba(56, 189, 248, ${causticAlpha})`;
            for (let c = 0; c < 5; c++) {
                const cx = width * (0.15 + c * 0.2) + Math.sin(tick * 0.012 + c) * 40;
                const cy = height * (0.25 + (c % 3) * 0.28) + Math.cos(tick * 0.015 + c) * 35;
                ctx.beginPath();
                ctx.ellipse(cx, cy, 150, 75, (tick * 0.004 + c) % (Math.PI * 2), 0, Math.PI * 2);
                ctx.fill();
            }

            // 3. Ondas espontáneas
            if (tick % 180 === 0 && Math.random() < 0.6) {
                addRipple(
                    Math.random() * width,
                    Math.random() * height,
                    55 + Math.random() * 35,
                    0.6 + Math.random() * 0.35
                );
            }

            // 4. Actualizar ondas de agua
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

            // 5. Ordenar peces por profundidad para oclusión tridimensional en el agua
            fishes.sort((a, b) => a.depth - b.depth);

            fishes.forEach((fish) => {
                fish.turnTimer--;
                if (fish.turnTimer <= 0) {
                    fish.turnTimer = 50 + Math.floor(Math.random() * 120);
                    fish.targetAngle += (Math.random() - 0.5) * 1.1;
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
                const headWag = Math.sin(fish.swimCycle) * 0.11 * (fish.speed / fish.baseSpeed);

                // Cinemática Inversa coherente (apuntando hacia adelante)
                fish.spine[0].x = fish.x;
                fish.spine[0].y = fish.y;
                fish.spine[0].angle = fish.angle + headWag;

                for (let j = 1; j < fish.spineLength; j++) {
                    const prev = fish.spine[j - 1];
                    const curr = fish.spine[j];
                    const dx = prev.x - curr.x;
                    const dy = prev.y - curr.y;
                    const dist = Math.hypot(dx, dy) || 1;

                    curr.x = prev.x - (dx / dist) * fish.segmentDistance;
                    curr.y = prev.y - (dy / dist) * fish.segmentDistance;
                    curr.angle = Math.atan2(dy, dx);
                }

                // Sombra en el lecho del estanque
                drawEtherealKoi(ctx, fish, true);
                // Pez real con efecto submarino y estela de seda
                drawEtherealKoi(ctx, fish, false);
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
        // RENDERIZADO ETÉREO SUBACUÁTICO CON ESTELA DE SEDA Y ESCAMAS UROKO
        // ====================================================================
        function drawEtherealKoi(c: CanvasRenderingContext2D, fish: KoiFish, isShadow: boolean) {
            c.save();

            const shadowDist = 24 * fish.depth;
            if (isShadow) {
                c.translate(shadowDist * 0.6, shadowDist * 0.9);
                c.fillStyle = "rgba(0, 5, 14, 0.28)";
            }

            // Puntos laterales calculados con normales respecto al avance
            const leftPoints: { x: number; y: number }[] = [];
            const rightPoints: { x: number; y: number }[] = [];

            for (let i = 0; i < fish.spineLength; i++) {
                const joint = fish.spine[i];
                const r = fish.bodyRadii[i];
                const waveOffset = Math.sin(fish.swimCycle - i * 0.38) * (r * 0.15);
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
            // 1. ALETAS PECTORALES: ESTELA DE SEDA ONDULANTE (MÁS NOTORIAS)
            // ----------------------------------------------------------------
            // Se anclan en vértebra 2 (justo detrás de las branquias), con gran envergadura
            const pecJoint = fish.spine[2];
            const pecFlap = Math.sin(fish.swimCycle) * 0.28;
            const pecSize = 48 * fish.size * fish.depth; // Gran tamaño etéreo

            // Aleta izquierda
            drawSilkVeilFin(
                c,
                leftPoints[2].x,
                leftPoints[2].y,
                pecJoint.angle + Math.PI - 0.72 + pecFlap,
                pecSize,
                fish.variety,
                fish.baseColor,
                fish.secondaryColor,
                isShadow
            );

            // Aleta derecha
            drawSilkVeilFin(
                c,
                rightPoints[2].x,
                rightPoints[2].y,
                pecJoint.angle + Math.PI + 0.72 - pecFlap,
                pecSize,
                fish.variety,
                fish.baseColor,
                fish.secondaryColor,
                isShadow
            );

            // ----------------------------------------------------------------
            // 2. ALETAS PÉLVICAS (EN VÉRTEBRA 7, ESTELA SEDOSA)
            // ----------------------------------------------------------------
            const pelvJoint = fish.spine[7];
            const pelvSize = 28 * fish.size * fish.depth;

            drawSilkVeilFin(
                c,
                leftPoints[7].x,
                leftPoints[7].y,
                pelvJoint.angle + Math.PI - 0.48 + pecFlap * 0.5,
                pelvSize,
                fish.variety,
                fish.baseColor,
                fish.secondaryColor,
                isShadow
            );
            drawSilkVeilFin(
                c,
                rightPoints[7].x,
                rightPoints[7].y,
                pelvJoint.angle + Math.PI + 0.48 - pecFlap * 0.5,
                pelvSize,
                fish.variety,
                fish.baseColor,
                fish.secondaryColor,
                isShadow
            );

            // ----------------------------------------------------------------
            // 3. ALETA CAUDAL: COLA DE MARIPOSA LARGA COMO ESTELA DE AGUA
            // ----------------------------------------------------------------
            // Se extiende suavemente hacia atrás en el agua sin espinas marcadas
            const tailJoint = fish.spine[fish.spineLength - 1];
            const tailWag = Math.sin(fish.swimCycle - 1.4) * 0.42;
            const tailAngle = tailJoint.angle + Math.PI + tailWag;
            const tailLength = 72 * fish.size * fish.depth; // Gran estela flotante

            drawEtherealVeilTail(
                c,
                tailJoint.x,
                tailJoint.y,
                tailAngle,
                tailLength,
                fish.variety,
                fish.baseColor,
                fish.secondaryColor,
                fish.swimCycle,
                isShadow
            );

            // ----------------------------------------------------------------
            // 4. CUERPO: CABEZA ANCHA TÍPICA DE CARPA KOI & MORRO REDONDEADO
            // ----------------------------------------------------------------
            c.beginPath();

            const head = fish.spine[0];
            const snoutRadius = fish.bodyRadii[0];
            // Morro frontal ancho y redondeado característico del Koi
            const snoutTipX = head.x + Math.cos(head.angle) * (snoutRadius * 1.15);
            const snoutTipY = head.y + Math.sin(head.angle) * (snoutRadius * 1.15);

            c.moveTo(snoutTipX, snoutTipY);

            // Arco del morro izquierdo
            const snoutCtrlLX = head.x + Math.cos(head.angle) * snoutRadius + Math.cos(head.angle - Math.PI * 0.5) * (snoutRadius * 0.95);
            const snoutCtrlLY = head.y + Math.sin(head.angle) * snoutRadius + Math.sin(head.angle - Math.PI * 0.5) * (snoutRadius * 0.95);
            c.quadraticCurveTo(snoutCtrlLX, snoutCtrlLY, leftPoints[0].x, leftPoints[0].y);

            // Flanco izquierdo completo mediante spline suave continuo
            for (let i = 0; i < leftPoints.length - 1; i++) {
                const xc = (leftPoints[i].x + leftPoints[i + 1].x) * 0.5;
                const yc = (leftPoints[i].y + leftPoints[i + 1].y) * 0.5;
                c.quadraticCurveTo(leftPoints[i].x, leftPoints[i].y, xc, yc);
            }
            c.lineTo(leftPoints[leftPoints.length - 1].x, leftPoints[leftPoints.length - 1].y);

            // Curvatura suave de unión en el pedúnculo caudal
            const lastSpine = fish.spine[fish.spineLength - 1];
            const tailTipX = lastSpine.x - Math.cos(lastSpine.angle) * 3;
            const tailTipY = lastSpine.y - Math.sin(lastSpine.angle) * 3;
            c.quadraticCurveTo(tailTipX, tailTipY, rightPoints[rightPoints.length - 1].x, rightPoints[rightPoints.length - 1].y);

            // Flanco derecho de vuelta hacia la cabeza
            for (let i = rightPoints.length - 1; i > 0; i--) {
                const xc = (rightPoints[i].x + rightPoints[i - 1].x) * 0.5;
                const yc = (rightPoints[i].y + rightPoints[i - 1].y) * 0.5;
                c.quadraticCurveTo(rightPoints[i].x, rightPoints[i].y, xc, yc);
            }
            c.lineTo(rightPoints[0].x, rightPoints[0].y);

            // Arco del morro derecho
            const snoutCtrlRX = head.x + Math.cos(head.angle) * snoutRadius + Math.cos(head.angle + Math.PI * 0.5) * (snoutRadius * 0.95);
            const snoutCtrlRY = head.y + Math.sin(head.angle) * snoutRadius + Math.sin(head.angle + Math.PI * 0.5) * (snoutRadius * 0.95);
            c.quadraticCurveTo(snoutCtrlRX, snoutCtrlRY, snoutTipX, snoutTipY);

            c.closePath();

            if (isShadow) {
                c.fill();
                c.restore();
                return;
            }

            // ----------------------------------------------------------------
            // 5. COLORACIÓN SUBACUÁTICA & HALO LUMINOSO DE PROFUNDIDAD
            // ----------------------------------------------------------------
            // Halo de agua etéreo (Soft Underwater Bloom)
            c.shadowColor = fish.glowColor;
            c.shadowBlur = 14 * fish.depth;

            c.fillStyle = fish.baseColor;
            c.fill();

            // Sombreado de volumen cilíndrico en el agua
            const dorsalNormX = Math.cos(head.angle - Math.PI * 0.5) * 22;
            const dorsalNormY = Math.sin(head.angle - Math.PI * 0.5) * 22;

            const volumeGrad = c.createLinearGradient(
                head.x + dorsalNormX,
                head.y + dorsalNormY,
                head.x - dorsalNormX,
                head.y - dorsalNormY
            );
            volumeGrad.addColorStop(0, "rgba(255, 255, 255, 0.42)");
            volumeGrad.addColorStop(0.45, "rgba(255, 255, 255, 0.04)");
            volumeGrad.addColorStop(1, "rgba(2, 6, 23, 0.35)");
            c.fillStyle = volumeGrad;
            c.fill();

            c.shadowBlur = 0; // Desactivar sombra para las líneas de detalle

            // Borde sutil acuático
            c.strokeStyle = "rgba(255, 255, 255, 0.16)";
            c.lineWidth = 1;
            c.stroke();

            // ----------------------------------------------------------------
            // 6. MANCHAS NISHIKIGOI & LÍNEAS ETÉREAS DE ESCAMAS (UROKO - 鱗)
            // ----------------------------------------------------------------
            c.save();
            c.clip();

            // A) Manchas tradicionales
            fish.spots.forEach((spot) => {
                const j = fish.spine[Math.min(spot.jointIndex, fish.spineLength - 1)];
                const spotX = j.x + Math.cos(j.angle + spot.offsetAngle) * 4;
                const spotY = j.y + Math.sin(j.angle + spot.offsetAngle) * 4;

                const spotGrad = c.createRadialGradient(
                    spotX,
                    spotY,
                    spot.radiusX * 0.25,
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

            // B) LÍNEAS ETÉREAS DE ESCAMAS (UROKO) EN EL LOMO Y FLANCOS
            // Hermosas arquerías superpuestas que brillan como filigrana dorada y plateada
            c.lineWidth = 0.85;
            for (let i = 2; i < fish.spineLength - 3; i++) {
                const j = fish.spine[i];
                const r = fish.bodyRadii[i];
                const scaleAngle = j.angle + Math.PI * 0.5;

                // 3 a 4 arcos de escama por vértebra
                const numArcs = 3;
                for (let a = -1; a <= 1; a++) {
                    const offset = a * (r * 0.42);
                    const scaleX = j.x + Math.cos(scaleAngle) * offset;
                    const scaleY = j.y + Math.sin(scaleAngle) * offset;

                    c.beginPath();
                    // Arco apuntando hacia la cola
                    c.arc(
                        scaleX,
                        scaleY,
                        r * 0.32,
                        j.angle - Math.PI * 0.45,
                        j.angle + Math.PI * 0.45,
                        false
                    );
                    c.strokeStyle = fish.variety === "yamabuki"
                        ? "rgba(254, 240, 138, 0.35)"
                        : "rgba(255, 255, 255, 0.22)";
                    c.stroke();
                }
            }

            // Destello iridiscente sutil sobre la cresta dorsal
            c.beginPath();
            for (let i = 2; i < fish.spineLength - 2; i++) {
                const j = fish.spine[i];
                c.arc(j.x, j.y, fish.bodyRadii[i] * 0.3, 0, Math.PI * 2);
            }
            c.fillStyle = "rgba(255, 255, 255, 0.08)";
            c.fill();

            c.restore();

            // ----------------------------------------------------------------
            // 7. ARCO BRANQUIAL TÍPICO DE KOI (OPERCLUM / ERABUTA - 鰓蓋)
            // ----------------------------------------------------------------
            // La curva semicircular a ambos lados de la cabeza que define a la carpa
            const gillJoint = fish.spine[2];
            const gillNormL = gillJoint.angle - Math.PI * 0.5;
            const gillNormR = gillJoint.angle + Math.PI * 0.5;
            const gillDist = fish.bodyRadii[2] * 0.88;

            c.beginPath();
            // Branquia izquierda
            c.arc(
                gillJoint.x + Math.cos(gillNormL) * gillDist,
                gillJoint.y + Math.sin(gillNormL) * gillDist,
                fish.bodyRadii[2] * 0.45,
                gillJoint.angle - Math.PI * 0.3,
                gillJoint.angle + Math.PI * 0.5
            );
            // Branquia derecha
            c.arc(
                gillJoint.x + Math.cos(gillNormR) * gillDist,
                gillJoint.y + Math.sin(gillNormR) * gillDist,
                fish.bodyRadii[2] * 0.45,
                gillJoint.angle - Math.PI * 0.5,
                gillJoint.angle + Math.PI * 0.3
            );
            c.strokeStyle = "rgba(255, 255, 255, 0.24)";
            c.lineWidth = 1.2;
            c.stroke();

            // ----------------------------------------------------------------
            // 8. OJOS INTEGRADOS EN EL CRÁNEO Y BIGOTES (HIGE - 髭)
            // ----------------------------------------------------------------
            const eyeJoint = fish.spine[1];
            const eyeNorm = eyeJoint.angle - Math.PI * 0.5;
            const eyeDist = fish.bodyRadii[1] * 0.74;
            const eyeR = Math.max(1.8, 2.7 * fish.size * fish.depth);

            drawEye(c, eyeJoint.x + Math.cos(eyeNorm) * eyeDist, eyeJoint.y + Math.sin(eyeNorm) * eyeDist, eyeR);
            drawEye(c, eyeJoint.x - Math.cos(eyeNorm) * eyeDist, eyeJoint.y - Math.sin(eyeNorm) * eyeDist, eyeR);

            // Bigotes táctiles suaves (barbels) en las comisuras de la boca
            const barbelLen = 12 * fish.size;
            const bAngleL = head.angle - Math.PI * 0.55;
            const bAngleR = head.angle + Math.PI * 0.55;

            c.beginPath();
            c.moveTo(snoutTipX, snoutTipY);
            c.quadraticCurveTo(
                snoutTipX + Math.cos(bAngleL) * (barbelLen * 0.6),
                snoutTipY + Math.sin(bAngleL) * (barbelLen * 0.6),
                snoutTipX + Math.cos(bAngleL + 0.25) * barbelLen,
                snoutTipY + Math.sin(bAngleL + 0.25) * barbelLen
            );
            c.moveTo(snoutTipX, snoutTipY);
            c.quadraticCurveTo(
                snoutTipX + Math.cos(bAngleR) * (barbelLen * 0.6),
                snoutTipY + Math.sin(bAngleR) * (barbelLen * 0.6),
                snoutTipX + Math.cos(bAngleR - 0.25) * barbelLen,
                snoutTipY + Math.sin(bAngleR - 0.25) * barbelLen
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

            // Iris con destello dorado sutil
            c.beginPath();
            c.arc(x, y, r * 0.6, 0, Math.PI * 2);
            c.fillStyle = "rgba(254, 240, 138, 0.35)";
            c.fill();

            // Pupila brillante
            c.beginPath();
            c.arc(x - r * 0.3, y - r * 0.3, r * 0.38, 0, Math.PI * 2);
            c.fillStyle = "rgba(255, 255, 255, 0.95)";
            c.fill();
        }

        // ====================================================================
        // ALETA DE SEDA ETÉREA (ESTELA TRANSLÚCIDA SIN ESPINAS DURAS)
        // ====================================================================
        function drawSilkVeilFin(
            c: CanvasRenderingContext2D,
            baseX: number,
            baseY: number,
            angle: number,
            length: number,
            variety: KoiVariety,
            baseColor: string,
            secondaryColor: string,
            isShadow: boolean
        ) {
            c.save();
            c.translate(baseX, baseY);
            c.rotate(angle);

            // Capa 1: Velo exterior amplio que se disuelve como humo en el agua
            c.beginPath();
            c.moveTo(0, 0);
            c.bezierCurveTo(length * 0.35, length * 0.55, length * 0.85, length * 0.45, length, length * 0.1);
            c.bezierCurveTo(length * 0.8, -length * 0.18, length * 0.35, -length * 0.15, 0, 0);
            c.closePath();

            if (isShadow) {
                c.fillStyle = "rgba(0, 5, 14, 0.2)";
                c.fill();
            } else {
                // Gradiente etéreo de disolución en agua
                const finGrad = c.createLinearGradient(0, 0, length, 0);
                if (variety === "yamabuki") {
                    finGrad.addColorStop(0, "rgba(245, 158, 11, 0.85)");
                    finGrad.addColorStop(0.45, "rgba(251, 191, 36, 0.45)");
                    finGrad.addColorStop(0.85, "rgba(254, 240, 138, 0.18)");
                    finGrad.addColorStop(1, "rgba(254, 240, 138, 0)");
                } else if (variety === "hi_utsuri" || variety === "asagi") {
                    finGrad.addColorStop(0, "rgba(249, 115, 22, 0.88)");
                    finGrad.addColorStop(0.45, "rgba(251, 146, 60, 0.4)");
                    finGrad.addColorStop(0.85, "rgba(255, 255, 255, 0.16)");
                    finGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
                } else {
                    finGrad.addColorStop(0, "rgba(255, 255, 255, 0.88)");
                    finGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.4)");
                    finGrad.addColorStop(0.8, "rgba(186, 230, 253, 0.18)");
                    finGrad.addColorStop(1, "rgba(186, 230, 253, 0)");
                }
                c.fillStyle = finGrad;
                c.fill();

                // Capa 2: Velo interior secundario más luminoso
                c.beginPath();
                c.moveTo(0, 0);
                c.bezierCurveTo(length * 0.25, length * 0.35, length * 0.65, length * 0.25, length * 0.75, length * 0.05);
                c.bezierCurveTo(length * 0.6, -length * 0.1, length * 0.25, -length * 0.08, 0, 0);
                c.closePath();
                c.fillStyle = "rgba(255, 255, 255, 0.25)";
                c.fill();

                // Ondulaciones suaves en el borde (sin rayas de espina duras)
                c.strokeStyle = "rgba(255, 255, 255, 0.22)";
                c.lineWidth = 0.8;
                c.stroke();
            }

            c.restore();
        }

        // ====================================================================
        // ALETA CAUDAL VELO (ESTELA FLUÍDA DE MARIPOSA EN EL AGUA)
        // ====================================================================
        function drawEtherealVeilTail(
            c: CanvasRenderingContext2D,
            baseX: number,
            baseY: number,
            angle: number,
            length: number,
            variety: KoiVariety,
            baseColor: string,
            secondaryColor: string,
            swimCycle: number,
            isShadow: boolean
        ) {
            c.save();
            c.translate(baseX, baseY);
            c.rotate(angle); // +X se extiende directamente hacia atrás en el agua

            const flare = length * 0.68;
            const baseW = 3.5;
            // Ondulación dinámica de la estela en el agua
            const tailWave = Math.sin(swimCycle * 1.2) * 6;

            // Capa 1: Estela exterior etérea de mariposa
            c.beginPath();
            c.moveTo(0, 0);
            // Lóbulo superior que ondea en el agua
            c.bezierCurveTo(
                length * 0.35,
                baseW * 1.5 + tailWave * 0.4,
                length * 0.7,
                flare * 0.88 + tailWave,
                length,
                flare + tailWave * 0.8
            );
            // Muesca central profunda y fluida
            c.quadraticCurveTo(length * 0.75, flare * 0.25 + tailWave * 0.5, length * 0.6, tailWave * 0.3);
            // Lóbulo inferior que ondea
            c.quadraticCurveTo(
                length * 0.75,
                -flare * 0.25 + tailWave * 0.5,
                length,
                -flare + tailWave * 0.8
            );
            // Retorno a la base
            c.bezierCurveTo(
                length * 0.7,
                -flare * 0.88 + tailWave,
                length * 0.35,
                -baseW * 1.5 + tailWave * 0.4,
                0,
                0
            );
            c.closePath();

            if (isShadow) {
                c.fillStyle = "rgba(0, 5, 14, 0.22)";
                c.fill();
            } else {
                // Gradiente luminoso que se desvanece suavemente como estela de agua
                const tailGrad = c.createLinearGradient(0, 0, length, 0);
                if (variety === "yamabuki") {
                    tailGrad.addColorStop(0, "rgba(245, 158, 11, 0.88)");
                    tailGrad.addColorStop(0.35, "rgba(251, 191, 36, 0.55)");
                    tailGrad.addColorStop(0.75, "rgba(254, 240, 138, 0.2)");
                    tailGrad.addColorStop(1, "rgba(254, 240, 138, 0)");
                } else if (variety === "hi_utsuri" || variety === "asagi") {
                    tailGrad.addColorStop(0, "rgba(249, 115, 22, 0.88)");
                    tailGrad.addColorStop(0.35, "rgba(251, 146, 60, 0.45)");
                    tailGrad.addColorStop(0.75, "rgba(255, 255, 255, 0.18)");
                    tailGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
                } else {
                    tailGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
                    tailGrad.addColorStop(0.35, "rgba(254, 205, 211, 0.45)");
                    tailGrad.addColorStop(0.75, "rgba(186, 230, 253, 0.2)");
                    tailGrad.addColorStop(1, "rgba(186, 230, 253, 0)");
                }
                c.fillStyle = tailGrad;
                c.fill();

                // Capa 2: Velo interior etéreo (estela de luz central)
                c.beginPath();
                c.moveTo(0, 0);
                c.bezierCurveTo(length * 0.3, flare * 0.4, length * 0.55, flare * 0.5, length * 0.75, flare * 0.3);
                c.quadraticCurveTo(length * 0.6, 0, length * 0.75, -flare * 0.3);
                c.bezierCurveTo(length * 0.55, -flare * 0.5, length * 0.3, -flare * 0.4, 0, 0);
                c.closePath();
                c.fillStyle = "rgba(255, 255, 255, 0.2)";
                c.fill();

                // Bordes suaves de velo que brillan como estela de agua
                c.strokeStyle = "rgba(255, 255, 255, 0.25)";
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
            c.fillStyle = "rgba(0, 5, 14, 0.25)";
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
