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
    angle: number;
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
    depth: number; // 0.6 (profundo) a 1.0 (superficie)
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

        // Seguimiento del cursor / toque interactivo
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
        // ANATOMÍA ORGÁNICA CONTINUA: 16 VÉRTEBRAS PARA CINEMÁTICA INVERSA
        // ====================================================================
        // Radios anatómicos hidrodinámicos calibrados (Cabeza -> Branquias -> Tórax -> Vientre -> Cola)
        const baseRadii = [
            7, 12, 16.5, 19, 20.5, 20, 18.5, 16.5, 14, 11.5, 9, 7, 5, 3.5, 2.5, 1.8,
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
            const size = 0.85 + Math.random() * 0.45; // 0.85 a 1.3x
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

            // Colores base y acentos según la variedad Nishikigoi
            let baseColor = "#FAFAF9";
            let secondaryColor = "#E11D48";
            let accentColor = "#18181B";

            const spots: FishSpot[] = [];

            switch (variety) {
                case "kohaku":
                    baseColor = "#FDFBF7"; // Blanco perla
                    secondaryColor = "#E11D48"; // Rojo carmesí Hi
                    // 3-4 manchas escarlata en la espalda
                    for (let s = 0; s < 3; s++) {
                        spots.push({
                            jointIndex: 2 + s * 4,
                            offsetAngle: (Math.random() - 0.5) * 0.5,
                            radiusX: (12 + Math.random() * 8) * size,
                            radiusY: (10 + Math.random() * 6) * size,
                            color: "#E11D48",
                        });
                    }
                    break;

                case "yamabuki":
                    baseColor = "#F59E0B"; // Oro ámbar metálico
                    secondaryColor = "#FDE68A"; // Reflejo oro claro
                    accentColor = "#B45309";
                    break;

                case "sanke":
                    baseColor = "#FDFBF7";
                    secondaryColor = "#DC2626"; // Bermellón
                    // Manchas rojas
                    for (let s = 0; s < 3; s++) {
                        spots.push({
                            jointIndex: 2 + s * 4,
                            offsetAngle: (Math.random() - 0.5) * 0.6,
                            radiusX: (11 + Math.random() * 7) * size,
                            radiusY: (9 + Math.random() * 5) * size,
                            color: "#DC2626",
                        });
                    }
                    // Manchas negras Sumi
                    for (let s = 0; s < 2; s++) {
                        spots.push({
                            jointIndex: 4 + s * 5,
                            offsetAngle: (Math.random() - 0.5) * 0.8,
                            radiusX: (6 + Math.random() * 5) * size,
                            radiusY: (6 + Math.random() * 4) * size,
                            color: "#18181B",
                        });
                    }
                    break;

                case "showa":
                    baseColor = "#18181B"; // Negro carbón de base
                    secondaryColor = "#EF4444"; // Manchas fuego
                    accentColor = "#F8FAFC"; // Manchas blancas
                    for (let s = 0; s < 3; s++) {
                        spots.push({
                            jointIndex: 1 + s * 4,
                            offsetAngle: (Math.random() - 0.5) * 0.6,
                            radiusX: (11 + Math.random() * 7) * size,
                            radiusY: (9 + Math.random() * 6) * size,
                            color: "#EF4444",
                        });
                        spots.push({
                            jointIndex: 3 + s * 4,
                            offsetAngle: (Math.random() - 0.5) * 0.6,
                            radiusX: (8 + Math.random() * 5) * size,
                            radiusY: (7 + Math.random() * 5) * size,
                            color: "#F8FAFC",
                        });
                    }
                    break;

                case "hi_utsuri":
                    baseColor = "#18181B"; // Negro azabache
                    secondaryColor = "#FF3B00"; // Rojo fuego intenso
                    for (let s = 0; s < 4; s++) {
                        spots.push({
                            jointIndex: 1 + s * 3,
                            offsetAngle: (Math.random() - 0.5) * 0.7,
                            radiusX: (11 + Math.random() * 7) * size,
                            radiusY: (9 + Math.random() * 6) * size,
                            color: "#FF3B00",
                        });
                    }
                    break;

                case "ki_utsuri":
                    baseColor = "#18181B"; // Negro ébano
                    secondaryColor = "#FACC15"; // Amarillo limón canario
                    for (let s = 0; s < 4; s++) {
                        spots.push({
                            jointIndex: 1 + s * 3,
                            offsetAngle: (Math.random() - 0.5) * 0.7,
                            radiusX: (11 + Math.random() * 7) * size,
                            radiusY: (9 + Math.random() * 6) * size,
                            color: "#FACC15",
                        });
                    }
                    break;

                case "shiro_utsuri":
                    baseColor = "#18181B"; // Negro carbón
                    secondaryColor = "#F8FAFC"; // Blanco marfil
                    for (let s = 0; s < 4; s++) {
                        spots.push({
                            jointIndex: 1 + s * 3,
                            offsetAngle: (Math.random() - 0.5) * 0.7,
                            radiusX: (11 + Math.random() * 8) * size,
                            radiusY: (9 + Math.random() * 7) * size,
                            color: "#F8FAFC",
                        });
                    }
                    break;

                case "tancho":
                    baseColor = "#FAFAF9"; // Blanco níveo inmaculado
                    secondaryColor = "#E11D48";
                    // Único disco solar carmesí sagrado en la frente
                    spots.push({
                        jointIndex: 0,
                        offsetAngle: 0,
                        radiusX: 9 * size,
                        radiusY: 9 * size,
                        color: "#DC2626",
                    });
                    break;

                case "asagi":
                    baseColor = "#334155"; // Azul índigo / pizarra
                    secondaryColor = "#F97316"; // Naranja coral brillante en aletas y costados
                    accentColor = "#64748B";
                    // Manchas coral en flancos
                    for (let s = 0; s < 4; s++) {
                        spots.push({
                            jointIndex: 3 + s * 3,
                            offsetAngle: 0.7,
                            radiusX: 8 * size,
                            radiusY: 6 * size,
                            color: "#FB923C",
                        });
                        spots.push({
                            jointIndex: 3 + s * 3,
                            offsetAngle: -0.7,
                            radiusX: 8 * size,
                            radiusY: 6 * size,
                            color: "#FB923C",
                        });
                    }
                    break;

                case "midori":
                    baseColor = "#14532D"; // Verde jade musgo
                    secondaryColor = "#FDE047"; // Destellos oro
                    for (let s = 0; s < 3; s++) {
                        spots.push({
                            jointIndex: 2 + s * 4,
                            offsetAngle: (Math.random() - 0.5) * 0.5,
                            radiusX: (10 + Math.random() * 6) * size,
                            radiusY: (8 + Math.random() * 5) * size,
                            color: "#166534",
                        });
                    }
                    break;

                case "karasugoi":
                    baseColor = "#09090B"; // Negro total cuervo
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

            // Coletazo de reacción asustada al tocar el agua cerca
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

            // 1. Limpieza de cuadro
            ctx.clearRect(0, 0, width, height);

            // 2. Fondo zen de agua oscura con gradiente atmosférico
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

            // 3. Cáusticas de agua sutiles (luz refractada en el fondo del estanque)
            const causticAlpha = 0.03 + Math.sin(tick * 0.02) * 0.015;
            ctx.fillStyle = `rgba(56, 189, 248, ${causticAlpha})`;
            for (let c = 0; c < 5; c++) {
                const cx = width * (0.15 + c * 0.2) + Math.sin(tick * 0.012 + c) * 40;
                const cy = height * (0.25 + (c % 3) * 0.28) + Math.cos(tick * 0.015 + c) * 35;
                ctx.beginPath();
                ctx.ellipse(cx, cy, 150, 75, (tick * 0.004 + c) % (Math.PI * 2), 0, Math.PI * 2);
                ctx.fill();
            }

            // 4. Ondas espontáneas de gotas
            if (tick % 180 === 0 && Math.random() < 0.6) {
                addRipple(
                    Math.random() * width,
                    Math.random() * height,
                    50 + Math.random() * 35,
                    0.6 + Math.random() * 0.35
                );
            }

            // 5. Dibujar y propagar ondas de agua
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

            // 6. Actualizar y dibujar cada Pez Koi
            // Ordenar por profundidad para correcta oclusión 3D (peces más profundos van detrás)
            fishes.sort((a, b) => a.depth - b.depth);

            fishes.forEach((fish) => {
                // A) Navegación autónoma fluida
                fish.turnTimer--;
                if (fish.turnTimer <= 0) {
                    fish.turnTimer = 45 + Math.floor(Math.random() * 120);
                    fish.targetAngle += (Math.random() - 0.5) * 1.2;
                }

                // Evasión suave de límites
                const pad = 90;
                if (fish.x < pad) fish.targetAngle = 0 + (Math.random() - 0.5) * 0.5;
                else if (fish.x > width - pad) fish.targetAngle = Math.PI + (Math.random() - 0.5) * 0.5;
                if (fish.y < pad) fish.targetAngle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.5;
                else if (fish.y > height - pad) fish.targetAngle = -Math.PI * 0.5 + (Math.random() - 0.5) * 0.5;

                // Evasión del cursor / tacto
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

                // Inercia de velocidad
                fish.speed += (fish.baseSpeed - fish.speed) * 0.025;

                // Suavizado del giro angular
                let diffAngle = fish.targetAngle - fish.angle;
                while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
                while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
                fish.angle += diffAngle * 0.04;

                // Avance de la cabeza
                fish.x += Math.cos(fish.angle) * fish.speed;
                fish.y += Math.sin(fish.angle) * fish.speed;

                // Ciclo ondulatorio
                fish.swimCycle += fish.swimCycleSpeed * (fish.speed / fish.baseSpeed);
                const headWag = Math.sin(fish.swimCycle) * 0.12 * (fish.speed / fish.baseSpeed);

                // B) Cinemática Inversa (IK): La cabeza guía y las 16 vértebras siguen la estela
                fish.spine[0].x = fish.x;
                fish.spine[0].y = fish.y;
                fish.spine[0].angle = fish.angle + headWag;

                for (let j = 1; j < fish.spineLength; j++) {
                    const prev = fish.spine[j - 1];
                    const curr = fish.spine[j];
                    const dx = curr.x - prev.x;
                    const dy = curr.y - prev.y;
                    const dist = Math.hypot(dx, dy) || 1;
                    const segAngle = Math.atan2(dy, dx);

                    curr.x = prev.x + (dx / dist) * fish.segmentDistance;
                    curr.y = prev.y + (dy / dist) * fish.segmentDistance;
                    curr.angle = segAngle;
                }

                // C) RENDERIZADO DEL PEZ:
                // Sombra en el fondo (profundidad 3D en el agua)
                drawRealisticFish(ctx, fish, true);
                // Pez real con curvas Bézier hidrodinámicas
                drawRealisticFish(ctx, fish, false);
            });

            // 7. Nenúfares / Hojas de loto flotantes
            lilyPads.forEach((pad) => {
                const px = pad.xRatio * width + Math.sin(tick * pad.driftSpeed + pad.driftPhase) * 18;
                const py = pad.yRatio * height + Math.cos(tick * pad.driftSpeed + pad.driftPhase) * 15;
                const rot = pad.angle + Math.sin(tick * 0.0008 + pad.driftPhase) * 0.08;

                drawLilyPad(ctx, px, py, pad.radius, rot, pad.notchAngle);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        // ====================================================================
        // RENDERIZADO REALISTA ULTRA-FLUIDO CON CURVAS BÉZIER CONTINUAS
        // ====================================================================
        function drawRealisticFish(c: CanvasRenderingContext2D, fish: KoiFish, isShadow: boolean) {
            c.save();

            // Desplazamiento de sombra proporcional a la profundidad
            const shadowDistance = 22 * fish.depth;
            if (isShadow) {
                c.translate(shadowDistance * 0.6, shadowDistance * 0.9);
                c.fillStyle = "rgba(0, 5, 12, 0.28)";
            }

            // Puntos anatómicos laterales izquierdo y derecho
            const leftPoints: { x: number; y: number }[] = [];
            const rightPoints: { x: number; y: number }[] = [];

            for (let i = 0; i < fish.spineLength; i++) {
                const joint = fish.spine[i];
                const r = fish.bodyRadii[i];
                // Onda de propagación lateral para la curvatura sinuosa
                const waveOffset = Math.sin(fish.swimCycle - i * 0.42) * (r * 0.18);
                const normalAngle = joint.angle + Math.PI * 0.5;

                leftPoints.push({
                    x: joint.x + Math.cos(normalAngle) * (r + waveOffset),
                    y: joint.y + Math.sin(normalAngle) * (r + waveOffset),
                });
                rightPoints.push({
                    x: joint.x - Math.cos(normalAngle) * (r - waveOffset),
                    y: joint.y - Math.sin(normalAngle) * (r - waveOffset),
                });
            }

            // ----------------------------------------------------------------
            // 1. ALETAS PECTORALES ARTICULADAS CON VELO Y RADIOS TRANSLÚCIDOS
            // ----------------------------------------------------------------
            const pecJoint = fish.spine[2];
            const pecAngle = pecJoint.angle;
            const pecFlap = Math.sin(fish.swimCycle) * 0.32;
            const pecSize = 38 * fish.size * fish.depth;

            // Aleta pectoral izquierda
            drawFlowingFin(
                c,
                leftPoints[2].x,
                leftPoints[2].y,
                pecAngle + Math.PI * 0.42 + pecFlap,
                pecSize,
                fish.variety,
                fish.baseColor,
                isShadow
            );

            // Aleta pectoral derecha
            drawFlowingFin(
                c,
                rightPoints[2].y ? rightPoints[2].x : pecJoint.x,
                rightPoints[2].y ? rightPoints[2].y : pecJoint.y,
                pecAngle - Math.PI * 0.42 - pecFlap,
                pecSize,
                fish.variety,
                fish.baseColor,
                isShadow
            );

            // ----------------------------------------------------------------
            // 2. ALETAS VENTRALES / PÉLVICAS (Más pequeñas, en vértebra 8)
            // ----------------------------------------------------------------
            const pelvJoint = fish.spine[8];
            const pelvAngle = pelvJoint.angle;
            const pelvSize = 22 * fish.size * fish.depth;

            drawFlowingFin(
                c,
                leftPoints[8].x,
                leftPoints[8].y,
                pelvAngle + Math.PI * 0.35 + pecFlap * 0.5,
                pelvSize,
                fish.variety,
                fish.baseColor,
                isShadow
            );
            drawFlowingFin(
                c,
                rightPoints[8].x,
                rightPoints[8].y,
                pelvAngle - Math.PI * 0.35 - pecFlap * 0.5,
                pelvSize,
                fish.variety,
                fish.baseColor,
                isShadow
            );

            // ----------------------------------------------------------------
            // 3. ALETA CAUDAL VELO (COLA ONDULANTE EN ABANICO DE DOBLE LÓBULO)
            // ----------------------------------------------------------------
            const tailJoint = fish.spine[fish.spineLength - 1];
            const tailAngle = tailJoint.angle + Math.sin(fish.swimCycle - 1.4) * 0.38;
            const tailLength = 52 * fish.size * fish.depth;

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
            // 4. CUERPO HIDRODINÁMICO CONTINUO CON CURVAS BÉZIER SUAVES (SPLINES)
            // ----------------------------------------------------------------
            c.beginPath();

            // Cúpula frontal redondeada de la cabeza
            const head = fish.spine[0];
            const snoutDistance = fish.bodyRadii[0] * 1.5;
            const snoutX = head.x + Math.cos(head.angle) * snoutDistance;
            const snoutY = head.y + Math.sin(head.angle) * snoutDistance;

            c.moveTo(snoutX, snoutY);

            // Curva suave hacia el flanco izquierdo mediante interpolación cuadrática (sin cortes angulares)
            drawSplineCurve(c, leftPoints, snoutX, snoutY);

            // Extremo de la cola
            const lastJoint = fish.spine[fish.spineLength - 1];
            c.lineTo(lastJoint.x, lastJoint.y);

            // Retorno por el flanco derecho hacia el morro
            const reversedRight = [...rightPoints].reverse();
            drawSplineCurve(c, reversedRight, lastJoint.x, lastJoint.y);

            c.lineTo(snoutX, snoutY);
            c.closePath();

            if (isShadow) {
                c.fill();
                c.restore();
                return;
            }

            // ----------------------------------------------------------------
            // 5. COLORACIÓN, VOLUMEN 3D Y TEXTURA DE LA PIEL
            // ----------------------------------------------------------------
            c.fillStyle = fish.baseColor;
            c.fill();

            // Sombreado de volumen cilíndrico dorsal/ventral
            const dorsalNormalX = Math.cos(head.angle + Math.PI * 0.5) * 22;
            const dorsalNormalY = Math.sin(head.angle + Math.PI * 0.5) * 22;

            const volumeGrad = c.createLinearGradient(
                head.x + dorsalNormalX,
                head.y + dorsalNormalY,
                head.x - dorsalNormalX,
                head.y - dorsalNormalY
            );
            volumeGrad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
            volumeGrad.addColorStop(0.48, "rgba(255, 255, 255, 0.05)");
            volumeGrad.addColorStop(1, "rgba(0, 0, 0, 0.32)");
            c.fillStyle = volumeGrad;
            c.fill();

            // Borde translúcido suave de escamas
            c.strokeStyle = "rgba(255, 255, 255, 0.15)";
            c.lineWidth = 1;
            c.stroke();

            // ----------------------------------------------------------------
            // 6. MANCHAS NISHIKIGOI CON MÁSCARA ORGÁNICA INTERNA
            // ----------------------------------------------------------------
            c.save();
            c.clip(); // Máscara dentro del contorno Bézier suave

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
                spotGrad.addColorStop(1, "rgba(0, 0, 0, 0.05)");

                c.beginPath();
                c.ellipse(spotX, spotY, spot.radiusX, spot.radiusY, j.angle, 0, Math.PI * 2);
                c.fillStyle = spotGrad;
                c.fill();
            });

            // Reflejo iridiscente de escamas a lo largo de la columna vertebral
            c.beginPath();
            for (let i = 2; i < fish.spineLength - 3; i++) {
                const j = fish.spine[i];
                c.arc(j.x, j.y, fish.bodyRadii[i] * 0.35, 0, Math.PI * 2);
            }
            c.fillStyle = "rgba(255, 255, 255, 0.09)";
            c.fill();

            c.restore();

            // ----------------------------------------------------------------
            // 7. ALETA DORSAL (SOBRE LA COLUMNA VERTEBRAL)
            // ----------------------------------------------------------------
            c.beginPath();
            const dorsalStart = fish.spine[3];
            const dorsalEnd = fish.spine[10];
            c.moveTo(dorsalStart.x, dorsalStart.y);
            for (let i = 4; i <= 10; i++) {
                const j = fish.spine[i];
                c.lineTo(j.x, j.y);
            }
            c.strokeStyle = fish.variety === "yamabuki" ? "rgba(251, 191, 36, 0.6)" : "rgba(255, 255, 255, 0.5)";
            c.lineWidth = 2.2 * fish.size;
            c.stroke();

            // ----------------------------------------------------------------
            // 8. CABEZA, OJOS Y BIGOTES (HIGE - 髭) DEL KOI JAPONÉS
            // ----------------------------------------------------------------
            const eyeDist = fish.bodyRadii[0] * 0.85;
            const eyeAngle1 = head.angle + Math.PI * 0.45;
            const eyeAngle2 = head.angle - Math.PI * 0.45;
            const eyeR = Math.max(1.8, 2.8 * fish.size * fish.depth);

            // Ojo izquierdo y derecho
            drawEye(c, head.x + Math.cos(eyeAngle1) * eyeDist, head.y + Math.sin(eyeAngle1) * eyeDist, eyeR);
            drawEye(c, head.x + Math.cos(eyeAngle2) * eyeDist, head.y + Math.sin(eyeAngle2) * eyeDist, eyeR);

            // Bigotes táctiles del Koi (barbels) en las comisuras de la boca
            const barbelLength = 12 * fish.size;
            const barbelAngleL = head.angle + Math.PI * 0.65;
            const barbelAngleR = head.angle - Math.PI * 0.65;

            c.beginPath();
            c.moveTo(snoutX, snoutY);
            c.quadraticCurveTo(
                snoutX + Math.cos(barbelAngleL) * (barbelLength * 0.6),
                snoutY + Math.sin(barbelAngleL) * (barbelLength * 0.6),
                snoutX + Math.cos(barbelAngleL + 0.3) * barbelLength,
                snoutY + Math.sin(barbelAngleL + 0.3) * barbelLength
            );
            c.moveTo(snoutX, snoutY);
            c.quadraticCurveTo(
                snoutX + Math.cos(barbelAngleR) * (barbelLength * 0.6),
                snoutY + Math.sin(barbelAngleR) * (barbelLength * 0.6),
                snoutX + Math.cos(barbelAngleR - 0.3) * barbelLength,
                snoutY + Math.sin(barbelAngleR - 0.3) * barbelLength
            );
            c.strokeStyle = "rgba(255, 255, 255, 0.4)";
            c.lineWidth = 1;
            c.stroke();

            c.restore();
        }

        // Dibuja curva spline suave conectando puntos con puntos medios (sin esquinas duras)
        function drawSplineCurve(c: CanvasRenderingContext2D, pts: { x: number; y: number }[], startX: number, startY: number) {
            if (pts.length < 2) return;
            c.lineTo(pts[0].x, pts[0].y);

            for (let i = 0; i < pts.length - 1; i++) {
                const xc = (pts[i].x + pts[i + 1].x) * 0.5;
                const yc = (pts[i].y + pts[i + 1].y) * 0.5;
                c.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
            }
            c.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        }

        function drawEye(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
            // Esclerótica
            c.beginPath();
            c.arc(x, y, r, 0, Math.PI * 2);
            c.fillStyle = "#0F172A";
            c.fill();
            // Brillo pupilar especular
            c.beginPath();
            c.arc(x - r * 0.35, y - r * 0.35, r * 0.38, 0, Math.PI * 2);
            c.fillStyle = "rgba(255, 255, 255, 0.9)";
            c.fill();
        }

        // Aleta translúcida con velo y radios finos estriados
        function drawFlowingFin(
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
            c.bezierCurveTo(length * 0.45, length * 0.5, length * 0.85, length * 0.3, length, length * 0.05);
            c.bezierCurveTo(length * 0.75, -length * 0.25, length * 0.35, -length * 0.2, 0, 0);
            c.closePath();

            if (isShadow) {
                c.fillStyle = "rgba(0, 4, 10, 0.22)";
                c.fill();
            } else {
                const finGrad = c.createLinearGradient(0, 0, length, 0);
                if (variety === "yamabuki") {
                    finGrad.addColorStop(0, "rgba(245, 158, 11, 0.8)");
                    finGrad.addColorStop(0.5, "rgba(251, 191, 36, 0.45)");
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

                // Radios de la aleta (fin rays delicados)
                c.beginPath();
                for (let r = 1; r <= 4; r++) {
                    const frac = r / 5;
                    c.moveTo(0, 0);
                    c.quadraticCurveTo(length * 0.5, length * (0.25 - frac * 0.1), length * 0.9, length * (frac * 0.15 - 0.05));
                }
                c.strokeStyle = "rgba(255, 255, 255, 0.22)";
                c.lineWidth = 0.8;
                c.stroke();
            }

            c.restore();
        }

        // Aleta caudal velo (cola de mariposa con abanico amplio y fluido)
        function drawCaudalVeilTail(
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

            // Abanico bilobulado fluido
            c.beginPath();
            c.moveTo(0, 0);
            c.bezierCurveTo(-length * 0.35, length * 0.55, -length * 0.75, length * 0.8, -length, length * 0.5);
            c.bezierCurveTo(-length * 0.65, length * 0.15, -length * 0.65, -length * 0.15, -length, -length * 0.5);
            c.bezierCurveTo(-length * 0.75, -length * 0.8, -length * 0.35, -length * 0.55, 0, 0);
            c.closePath();

            if (isShadow) {
                c.fillStyle = "rgba(0, 4, 10, 0.22)";
                c.fill();
            } else {
                const tailGrad = c.createLinearGradient(0, 0, -length, 0);
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

                // Radios finos estriados de la cola (rayas de velo)
                c.beginPath();
                for (let r = -3; r <= 3; r++) {
                    const spread = (r / 3) * (length * 0.42);
                    c.moveTo(0, 0);
                    c.quadraticCurveTo(-length * 0.5, spread * 0.6, -length * 0.92, spread);
                }
                c.strokeStyle = "rgba(255, 255, 255, 0.2)";
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

            // Sombra en el fondo del estanque
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

            // Nervaduras radiales
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

            // Centro de la hoja
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
