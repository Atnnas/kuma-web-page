"use client";
import React, { useEffect, useRef } from "react";

// ============================================================================
// TIPOS Y DEFINICIONES DE PECES KOI (NISHIKIGOI)
// ============================================================================
type KoiVariety = "kohaku" | "yamabuki" | "sanke" | "tancho";

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
    variety: KoiVariety;
    swimCycle: number;
    swimCycleSpeed: number;
    spineLength: number;
    segmentDistance: number;
    spine: SpineJoint[];
    bodyRadii: number[];
    spots: FishSpot[];
    turnTimer: number;
    avoidCooldown: number;
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
    opacity = 0.85,
    fishCount = 6,
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

        // Mouse tracking
        const mouse = {
            x: -1000,
            y: -1000,
            hasMoved: false,
            lastMoveTime: 0,
        };

        // Resize handler with high DPI scaling
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
        // CREACIÓN Y MODELADO PROCEDURAL DE PECES KOI
        // ====================================================================
        const bodyThickness = [
            11, 15, 18, 19, 18, 16, 13, 10, 7, 5, 3, 2, // Perfil anatómico ahusado (cabeza a cola)
        ];
        const numJoints = bodyThickness.length;
        const baseSegmentDist = 11;

        const varieties: KoiVariety[] = ["kohaku", "yamabuki", "sanke", "tancho"];

        const createFish = (index: number): KoiFish => {
            const startX = Math.random() * (width || window.innerWidth);
            const startY = Math.random() * (height || window.innerHeight);
            const startAngle = Math.random() * Math.PI * 2;
            const size = 0.75 + Math.random() * 0.45; // 0.75 a 1.2x
            const segmentDist = baseSegmentDist * size;
            const variety = varieties[index % varieties.length];

            const spine: SpineJoint[] = [];
            for (let i = 0; i < numJoints; i++) {
                spine.push({
                    x: startX - Math.cos(startAngle) * i * segmentDist,
                    y: startY - Math.sin(startAngle) * i * segmentDist,
                    angle: startAngle,
                });
            }

            // Manchas decorativas aleatorias Nishikigoi
            const spots: FishSpot[] = [];
            if (variety === "kohaku" || variety === "sanke") {
                const numSpots = 2 + Math.floor(Math.random() * 3);
                for (let s = 0; s < numSpots; s++) {
                    spots.push({
                        jointIndex: 1 + Math.floor(Math.random() * 6),
                        offsetAngle: (Math.random() - 0.5) * 0.8,
                        radiusX: (10 + Math.random() * 12) * size,
                        radiusY: (8 + Math.random() * 10) * size,
                        color: "#DC2626", // Rojo escarlata Hi
                    });
                }
            }
            if (variety === "sanke") {
                // Añadir manchas de tinta Sumi (negro carbón)
                const numSumi = 1 + Math.floor(Math.random() * 2);
                for (let s = 0; s < numSumi; s++) {
                    spots.push({
                        jointIndex: 2 + Math.floor(Math.random() * 5),
                        offsetAngle: (Math.random() - 0.5) * 0.9,
                        radiusX: (5 + Math.random() * 8) * size,
                        radiusY: (5 + Math.random() * 7) * size,
                        color: "#18181B", // Negro Sumi
                    });
                }
            } else if (variety === "tancho") {
                // Corona carmesí circular pura en la frente
                spots.push({
                    jointIndex: 0,
                    offsetAngle: 0,
                    radiusX: 8 * size,
                    radiusY: 8 * size,
                    color: "#E11D48",
                });
            }

            const baseSpeed = 1.0 + Math.random() * 0.6;

            return {
                x: startX,
                y: startY,
                angle: startAngle,
                targetAngle: startAngle,
                speed: baseSpeed,
                baseSpeed,
                maxSpeed: baseSpeed * 2.6,
                size,
                variety,
                swimCycle: Math.random() * Math.PI * 2,
                swimCycleSpeed: 0.07 + Math.random() * 0.03,
                spineLength: numJoints,
                segmentDistance: segmentDist,
                spine,
                bodyRadii: bodyThickness.map((r) => r * size),
                spots,
                turnTimer: 30 + Math.floor(Math.random() * 90),
                avoidCooldown: 0,
            };
        };

        const fishes: KoiFish[] = Array.from({ length: fishCount }, (_, i) => createFish(i));

        // ====================================================================
        // ONDAS DE AGUA (WATER RIPPLES)
        // ====================================================================
        const ripples: WaterRipple[] = [];

        const addRipple = (x: number, y: number, maxRadius = 60, speed = 0.9) => {
            if (ripples.length > 25) ripples.shift();
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
        // HOJAS DE LOTO / NENÚFARES (LILY PADS)
        // ====================================================================
        const lilyPads: LilyPad[] = [
            { xRatio: 0.12, yRatio: 0.18, radius: 46, angle: 0.4, notchAngle: 0.65, driftSpeed: 0.0006, driftPhase: 0 },
            { xRatio: 0.88, yRatio: 0.28, radius: 54, angle: 1.8, notchAngle: 0.72, driftSpeed: 0.0005, driftPhase: 2.1 },
            { xRatio: 0.18, yRatio: 0.76, radius: 58, angle: 3.2, notchAngle: 0.68, driftSpeed: 0.0007, driftPhase: 4.2 },
            { xRatio: 0.84, yRatio: 0.82, radius: 48, angle: 4.5, notchAngle: 0.75, driftSpeed: 0.0004, driftPhase: 1.2 },
            { xRatio: 0.08, yRatio: 0.48, radius: 36, angle: 2.3, notchAngle: 0.62, driftSpeed: 0.0008, driftPhase: 3.5 },
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

            addRipple(px, py, 95, 1.4);
            setTimeout(() => addRipple(px, py, 60, 1.1), 180);

            // Al hacer clic, los peces cercanos huyen con un coletazo rápido
            fishes.forEach((fish) => {
                const dx = fish.x - px;
                const dy = fish.y - py;
                const dist = Math.hypot(dx, dy);
                if (dist < 220) {
                    fish.targetAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.4;
                    fish.speed = fish.maxSpeed * 1.2;
                    fish.avoidCooldown = 45;
                    addRipple(fish.x, fish.y, 40, 1.2);
                }
            });
        };

        window.addEventListener("mousemove", onPointerMove, { passive: true });
        window.addEventListener("mousedown", onPointerDown, { passive: true });
        window.addEventListener("touchmove", onPointerMove, { passive: true });
        window.addEventListener("touchstart", onPointerDown, { passive: true });

        // ====================================================================
        // BUCLE PRINCIPAL DE ANIMACIÓN PROCEDURAL
        // ====================================================================
        let tick = 0;
        let lastTime = performance.now();

        const render = (currentTime: number) => {
            const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
            lastTime = currentTime;
            tick++;

            // 1. Limpiar lienzo
            ctx.clearRect(0, 0, width, height);

            // 2. Fondo ambiental de agua profunda del estanque (Zen Indigo-Teal)
            const bgGrad = ctx.createRadialGradient(
                width * 0.5,
                height * 0.4,
                width * 0.1,
                width * 0.5,
                height * 0.5,
                Math.max(width, height) * 0.8
            );
            bgGrad.addColorStop(0, "rgba(8, 25, 48, 0.88)");
            bgGrad.addColorStop(0.5, "rgba(5, 18, 35, 0.94)");
            bgGrad.addColorStop(1, "rgba(3, 10, 22, 0.98)");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // 3. Cáusticas de luz de agua sutiles (Reflejos ondulantes en el fondo)
            const causticAlpha = 0.035 + Math.sin(tick * 0.02) * 0.015;
            ctx.fillStyle = `rgba(56, 189, 248, ${causticAlpha})`;
            for (let c = 0; c < 4; c++) {
                const cx = width * (0.2 + c * 0.22) + Math.sin(tick * 0.015 + c) * 35;
                const cy = height * (0.3 + (c % 3) * 0.25) + Math.cos(tick * 0.018 + c) * 30;
                ctx.beginPath();
                ctx.ellipse(cx, cy, 140, 70, (tick * 0.005 + c) % (Math.PI * 2), 0, Math.PI * 2);
                ctx.fill();
            }

            // 4. Gotas y ondas ocasionales en el estanque
            if (tick % 160 === 0 && Math.random() < 0.6) {
                addRipple(
                    Math.random() * width,
                    Math.random() * height,
                    45 + Math.random() * 35,
                    0.6 + Math.random() * 0.4
                );
            }

            // 5. Dibujar y actualizar Ondas de Agua (Ripples)
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

                // Onda concéntrica secundaria más fina
                if (r.radius > 15) {
                    ctx.beginPath();
                    ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(125, 211, 252, ${r.alpha * 0.55})`;
                    ctx.lineWidth = r.lineWidth * 0.7;
                    ctx.stroke();
                }
                ctx.restore();
            }

            // 6. Actualizar y dibujar cada Pez Koi
            fishes.forEach((fish) => {
                // A) Lógica de navegación autónoma y evasión de bordes
                fish.turnTimer--;
                if (fish.turnTimer <= 0) {
                    fish.turnTimer = 40 + Math.floor(Math.random() * 110);
                    fish.targetAngle += (Math.random() - 0.5) * 1.4;
                }

                // Evasión de los bordes del lienzo
                const pad = 100;
                if (fish.x < pad) fish.targetAngle = 0 + (Math.random() - 0.5) * 0.6;
                else if (fish.x > width - pad) fish.targetAngle = Math.PI + (Math.random() - 0.5) * 0.6;
                if (fish.y < pad) fish.targetAngle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.6;
                else if (fish.y > height - pad) fish.targetAngle = -Math.PI * 0.5 + (Math.random() - 0.5) * 0.6;

                // Evasión del cursor / dedo
                if (mouse.hasMoved && Date.now() - mouse.lastMoveTime < 2500) {
                    const mdx = fish.x - mouse.x;
                    const mdy = fish.y - mouse.y;
                    const mdist = Math.hypot(mdx, mdy);
                    if (mdist < 140) {
                        fish.targetAngle = Math.atan2(mdy, mdx) + (Math.random() - 0.5) * 0.3;
                        fish.speed = Math.min(fish.maxSpeed, fish.speed + 0.15);
                        if (Math.random() < 0.08) addRipple(fish.x, fish.y, 35, 1.0);
                    }
                }

                // Retorno suave a la velocidad base
                fish.speed += (fish.baseSpeed - fish.speed) * 0.03;

                // Suavizado del ángulo de nado
                let diffAngle = fish.targetAngle - fish.angle;
                while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
                while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
                fish.angle += diffAngle * 0.045;

                // Avance de la cabeza
                fish.x += Math.cos(fish.angle) * fish.speed;
                fish.y += Math.sin(fish.angle) * fish.speed;

                // Ciclo ondulatorio de nado (la velocidad del aleteo depende de la velocidad)
                fish.swimCycle += fish.swimCycleSpeed * (fish.speed / fish.baseSpeed);
                const wag = Math.sin(fish.swimCycle) * 0.16 * (fish.speed / fish.baseSpeed);

                // B) Cinemática Inversa (IK): La cabeza guía y las vértebras siguen la estela
                fish.spine[0].x = fish.x;
                fish.spine[0].y = fish.y;
                fish.spine[0].angle = fish.angle + wag;

                for (let j = 1; j < fish.spineLength; j++) {
                    const prev = fish.spine[j - 1];
                    const curr = fish.spine[j];
                    const dx = curr.x - prev.x;
                    const dy = curr.y - prev.y;
                    const dist = Math.hypot(dx, dy) || 1;
                    const angle = Math.atan2(dy, dx);

                    curr.x = prev.x + (dx / dist) * fish.segmentDistance;
                    curr.y = prev.y + (dy / dist) * fish.segmentDistance;
                    curr.angle = angle;
                }

                // C) RENDERIZADO DEL PEZ:
                // Sombra en el fondo (profundidad 3D en el agua)
                drawFishBody(ctx, fish, true);
                // Cuerpo real en el agua
                drawFishBody(ctx, fish, false);
            });

            // 7. Dibujar Hojas de Loto / Nenúfares (Capas de superficie)
            lilyPads.forEach((pad) => {
                const px = pad.xRatio * width + Math.sin(tick * pad.driftSpeed + pad.driftPhase) * 16;
                const py = pad.yRatio * height + Math.cos(tick * pad.driftSpeed + pad.driftPhase) * 14;
                const rot = pad.angle + Math.sin(tick * 0.0008 + pad.driftPhase) * 0.08;

                drawLilyPad(ctx, px, py, pad.radius, rot, pad.notchAngle);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        // ====================================================================
        // DIBUJO DETALLADO DEL CUERPO Y ALETAS DEL PEZ KOI
        // ====================================================================
        function drawFishBody(c: CanvasRenderingContext2D, fish: KoiFish, isShadow: boolean) {
            c.save();

            // Si es sombra: proyectar desplazamiento en el fondo del estanque
            const shadowOffsetX = 18;
            const shadowOffsetY = 24;

            if (isShadow) {
                c.translate(shadowOffsetX, shadowOffsetY);
                c.fillStyle = "rgba(0, 4, 10, 0.28)";
            }

            // Calcular contornos izquierdo y derecho con normales perpendiculares
            const leftPoints: { x: number; y: number }[] = [];
            const rightPoints: { x: number; y: number }[] = [];

            for (let i = 0; i < fish.spineLength; i++) {
                const joint = fish.spine[i];
                const r = fish.bodyRadii[i];
                const normalAngle = joint.angle + Math.PI * 0.5;

                leftPoints.push({
                    x: joint.x + Math.cos(normalAngle) * r,
                    y: joint.y + Math.sin(normalAngle) * r,
                });
                rightPoints.push({
                    x: joint.x - Math.cos(normalAngle) * r,
                    y: joint.y - Math.sin(normalAngle) * r,
                });
            }

            // 1. Aletas Pectorales (articuladas cerca de la cabeza en vértebra 2)
            const pecJoint = fish.spine[1];
            const pecAngle = pecJoint.angle;
            const pecFlap = Math.sin(fish.swimCycle) * 0.35;
            const pecSize = 34 * fish.size;

            // Aleta izquierda
            drawFin(
                c,
                pecJoint.x + Math.cos(pecAngle + Math.PI * 0.5) * fish.bodyRadii[1],
                pecJoint.y + Math.sin(pecAngle + Math.PI * 0.5) * fish.bodyRadii[1],
                pecAngle + Math.PI * 0.45 + pecFlap,
                pecSize,
                fish.variety,
                isShadow
            );

            // Aleta derecha
            drawFin(
                c,
                pecJoint.x - Math.cos(pecAngle + Math.PI * 0.5) * fish.bodyRadii[1],
                pecJoint.y - Math.sin(pecAngle + Math.PI * 0.5) * fish.bodyRadii[1],
                pecAngle - Math.PI * 0.45 - pecFlap,
                pecSize,
                fish.variety,
                isShadow
            );

            // 2. Aleta Caudal (Cola en abanico flexible en la última vértebra)
            const tailJoint = fish.spine[fish.spineLength - 1];
            const tailAngle = tailJoint.angle + Math.sin(fish.swimCycle - 1.2) * 0.25;
            const tailSize = 44 * fish.size;

            drawTailFin(c, tailJoint.x, tailJoint.y, tailAngle, tailSize, fish.variety, isShadow);

            // 3. Trazado curvo continuo del cuerpo del pez
            c.beginPath();
            // Punta de la cabeza
            const headJoint = fish.spine[0];
            const headTipX = headJoint.x + Math.cos(headJoint.angle) * (fish.bodyRadii[0] * 1.3);
            const headTipY = headJoint.y + Math.sin(headJoint.angle) * (fish.bodyRadii[0] * 1.3);

            c.moveTo(headTipX, headTipY);

            // Lado izquierdo del cuerpo con curvas Bézier suaves
            for (let i = 0; i < leftPoints.length; i++) {
                c.lineTo(leftPoints[i].x, leftPoints[i].y);
            }

            // Punta trasera de la cola
            const tailTip = fish.spine[fish.spineLength - 1];
            c.lineTo(tailTip.x, tailTip.y);

            // Lado derecho de vuelta hacia la cabeza
            for (let i = rightPoints.length - 1; i >= 0; i--) {
                c.lineTo(rightPoints[i].x, rightPoints[i].y);
            }

            c.closePath();

            if (isShadow) {
                c.fill();
                c.restore();
                return;
            }

            // Color base del pez
            let baseColor = "#FAFAF9"; // Blanco perla puro para Kohaku / Sanke
            if (fish.variety === "yamabuki") {
                baseColor = "#F59E0B"; // Oro puro Yamabuki Ogon
            }

            c.fillStyle = baseColor;
            c.fill();

            // Sombreado de volumen lateral 3D
            const bodyGrad = c.createLinearGradient(
                headJoint.x + Math.cos(headJoint.angle + Math.PI * 0.5) * 20,
                headJoint.y + Math.sin(headJoint.angle + Math.PI * 0.5) * 20,
                headJoint.x - Math.cos(headJoint.angle + Math.PI * 0.5) * 20,
                headJoint.y - Math.sin(headJoint.angle + Math.PI * 0.5) * 20
            );
            bodyGrad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
            bodyGrad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
            bodyGrad.addColorStop(1, "rgba(0, 0, 0, 0.18)");
            c.fillStyle = bodyGrad;
            c.fill();

            // Borde suave
            c.strokeStyle = "rgba(0, 0, 0, 0.08)";
            c.lineWidth = 1;
            c.stroke();

            // 4. Manchas Nishikigoi (con máscara de recorte dentro del cuerpo)
            c.save();
            c.clip();

            fish.spots.forEach((spot) => {
                const j = fish.spine[Math.min(spot.jointIndex, fish.spineLength - 1)];
                const spotX = j.x + Math.cos(j.angle + spot.offsetAngle) * 5;
                const spotY = j.y + Math.sin(j.angle + spot.offsetAngle) * 5;

                c.beginPath();
                c.ellipse(spotX, spotY, spot.radiusX, spot.radiusY, j.angle, 0, Math.PI * 2);
                c.fillStyle = spot.color;
                c.fill();
            });

            c.restore();

            // 5. Ojos del pez Koi
            const eyeDist = fish.bodyRadii[0] * 0.75;
            const eyeAngle1 = headJoint.angle + Math.PI * 0.42;
            const eyeAngle2 = headJoint.angle - Math.PI * 0.42;
            const eyeRadius = Math.max(1.8, 2.5 * fish.size);

            c.fillStyle = "#0F172A";
            c.beginPath();
            c.arc(
                headJoint.x + Math.cos(eyeAngle1) * eyeDist,
                headJoint.y + Math.sin(eyeAngle1) * eyeDist,
                eyeRadius,
                0,
                Math.PI * 2
            );
            c.arc(
                headJoint.x + Math.cos(eyeAngle2) * eyeDist,
                headJoint.y + Math.sin(eyeAngle2) * eyeDist,
                eyeRadius,
                0,
                Math.PI * 2
            );
            c.fill();

            c.restore();
        }

        function drawFin(
            c: CanvasRenderingContext2D,
            baseX: number,
            baseY: number,
            angle: number,
            length: number,
            variety: KoiVariety,
            isShadow: boolean
        ) {
            c.save();
            c.translate(baseX, baseY);
            c.rotate(angle);

            c.beginPath();
            c.moveTo(0, 0);
            c.bezierCurveTo(length * 0.5, length * 0.4, length * 0.9, length * 0.2, length, 0);
            c.bezierCurveTo(length * 0.7, -length * 0.25, length * 0.3, -length * 0.2, 0, 0);
            c.closePath();

            if (isShadow) {
                c.fillStyle = "rgba(0, 4, 10, 0.2)";
                c.fill();
            } else {
                const finGrad = c.createLinearGradient(0, 0, length, 0);
                if (variety === "yamabuki") {
                    finGrad.addColorStop(0, "rgba(245, 158, 11, 0.7)");
                    finGrad.addColorStop(1, "rgba(251, 191, 36, 0.2)");
                } else {
                    finGrad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
                    finGrad.addColorStop(1, "rgba(255, 255, 255, 0.18)");
                }
                c.fillStyle = finGrad;
                c.fill();
            }

            c.restore();
        }

        function drawTailFin(
            c: CanvasRenderingContext2D,
            baseX: number,
            baseY: number,
            angle: number,
            length: number,
            variety: KoiVariety,
            isShadow: boolean
        ) {
            c.save();
            c.translate(baseX, baseY);
            c.rotate(angle);

            c.beginPath();
            c.moveTo(0, 0);
            c.bezierCurveTo(-length * 0.4, length * 0.5, -length * 0.8, length * 0.7, -length, length * 0.45);
            c.bezierCurveTo(-length * 0.65, 0, -length * 0.65, 0, -length, -length * 0.45);
            c.bezierCurveTo(-length * 0.8, -length * 0.7, -length * 0.4, -length * 0.5, 0, 0);
            c.closePath();

            if (isShadow) {
                c.fillStyle = "rgba(0, 4, 10, 0.2)";
                c.fill();
            } else {
                const tailGrad = c.createLinearGradient(0, 0, -length, 0);
                if (variety === "yamabuki") {
                    tailGrad.addColorStop(0, "rgba(245, 158, 11, 0.85)");
                    tailGrad.addColorStop(1, "rgba(251, 191, 36, 0.25)");
                } else {
                    tailGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
                    tailGrad.addColorStop(0.5, "rgba(254, 205, 211, 0.4)");
                    tailGrad.addColorStop(1, "rgba(255, 255, 255, 0.2)");
                }
                c.fillStyle = tailGrad;
                c.fill();
            }

            c.restore();
        }

        // ====================================================================
        // DIBUJO DE NENÚFARES (LILY PADS / HOJAS DE LOTO FLOTANTES)
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
            c.arc(10, 16, radius, 0, Math.PI * 2);
            c.fillStyle = "rgba(0, 5, 12, 0.25)";
            c.fill();

            c.rotate(rotation);

            // Hendidura en V clásica de la hoja de loto
            const startAngle = notchWidth * 0.5;
            const endAngle = Math.PI * 2 - notchWidth * 0.5;

            c.beginPath();
            c.moveTo(0, 0);
            c.arc(0, 0, radius, startAngle, endAngle);
            c.closePath();

            // Gradiente verde esmeralda y musgo profundo
            const padGrad = c.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
            padGrad.addColorStop(0, "#166534");
            padGrad.addColorStop(0.7, "#14532D");
            padGrad.addColorStop(1, "#052E16");
            c.fillStyle = padGrad;
            c.fill();

            // Borde ligeramente más claro
            c.strokeStyle = "rgba(134, 239, 172, 0.25)";
            c.lineWidth = 1.5;
            c.stroke();

            // Nervaduras de la hoja
            c.strokeStyle = "rgba(187, 247, 208, 0.15)";
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
            c.arc(0, 0, 3, 0, Math.PI * 2);
            c.fillStyle = "rgba(254, 240, 138, 0.4)";
            c.fill();

            c.restore();
        }

        // Iniciar renderizado
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
