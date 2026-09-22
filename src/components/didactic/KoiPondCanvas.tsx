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

interface SplashDroplet {
    x: number;
    y: number;
    vx: number;
    vy: number;
    vz: number;
    z: number;
    radius: number;
    alpha: number;
    gravity: number;
}

interface FireflyTrailPoint {
    x: number;
    y: number;
    alpha: number;
}

interface Firefly {
    id: number;
    state: "dormant" | "awakening" | "flying" | "fading";
    x: number;
    y: number;
    z: number; // 0.25 a 1.2 (altitud sobre agua)
    speed: number;
    angle: number;
    turnSpeed: number;
    size: number;
    pulsePhase: number;
    pulseSpeed: number;
    hue: number; // 58 (oro cálido ámbar) a 84 (verde lima bioluminiscente)
    alpha: number;
    maxAlpha: number;
    timer: number;
    maxTimer: number;
    seed: number;
    trail: FireflyTrailPoint[];
}

interface LilyPad {
    xRatio: number;
    yRatio: number;
    radius: number;
    angle: number;
    notchAngle: number;
    driftSpeed: number;
    driftPhase: number;
    // Dinámica reactiva de estela de peces y corriente
    offsetX: number;
    offsetY: number;
    velX: number;
    velY: number;
    dewDroplets: { relX: number; relY: number; r: number }[];
}

interface PondFrog {
    state: "perched" | "crouching" | "jumping" | "diving" | "hidden";
    currentPadIndex: number;
    targetPadIndex: number;
    x: number;
    y: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    jumpProgress: number; // 0 a 1
    jumpDuration: number;
    jumpAltitude: number; // elevación parabólica z
    angle: number;
    breathPhase: number;
    blinkTimer: number;
    isBlinking: boolean;
    idleTimer: number;
    crouchTimer: number;
    diveTimer: number;
    size: number;
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
            {
                xRatio: 0.09,
                yRatio: 0.16,
                radius: 54,
                angle: 0.4,
                notchAngle: 0.65,
                driftSpeed: 0.0006,
                driftPhase: 0,
                offsetX: 0,
                offsetY: 0,
                velX: 0,
                velY: 0,
                dewDroplets: [
                    { relX: -14, relY: -10, r: 2.8 },
                    { relX: 16, relY: 12, r: 3.4 },
                    { relX: -8, relY: 18, r: 2.0 },
                    { relX: 18, relY: -14, r: 2.2 },
                ],
            },
            {
                xRatio: 0.89,
                yRatio: 0.22,
                radius: 58,
                angle: 1.8,
                notchAngle: 0.72,
                driftSpeed: 0.0005,
                driftPhase: 2.1,
                offsetX: 0,
                offsetY: 0,
                velX: 0,
                velY: 0,
                dewDroplets: [
                    { relX: -18, relY: 8, r: 3.5 },
                    { relX: 12, relY: -16, r: 2.4 },
                    { relX: 15, relY: 15, r: 2.8 },
                ],
            },
            {
                xRatio: 0.15,
                yRatio: 0.78,
                radius: 64,
                angle: 3.2,
                notchAngle: 0.68,
                driftSpeed: 0.0007,
                driftPhase: 4.2,
                offsetX: 0,
                offsetY: 0,
                velX: 0,
                velY: 0,
                dewDroplets: [
                    { relX: -12, relY: -20, r: 4.0 },
                    { relX: 20, relY: -8, r: 2.6 },
                    { relX: -22, relY: 14, r: 3.1 },
                    { relX: 10, relY: 22, r: 2.2 },
                ],
            },
            {
                xRatio: 0.86,
                yRatio: 0.84,
                radius: 52,
                angle: 4.5,
                notchAngle: 0.75,
                driftSpeed: 0.0004,
                driftPhase: 1.2,
                offsetX: 0,
                offsetY: 0,
                velX: 0,
                velY: 0,
                dewDroplets: [
                    { relX: -15, relY: -12, r: 3.2 },
                    { relX: 14, relY: 14, r: 2.5 },
                ],
            },
            {
                xRatio: 0.05,
                yRatio: 0.48,
                radius: 42,
                angle: 2.3,
                notchAngle: 0.62,
                driftSpeed: 0.0008,
                driftPhase: 3.5,
                offsetX: 0,
                offsetY: 0,
                velX: 0,
                velY: 0,
                dewDroplets: [
                    { relX: -10, relY: 10, r: 2.5 },
                    { relX: 12, relY: -8, r: 2.8 },
                ],
            },
            {
                xRatio: 0.93,
                yRatio: 0.54,
                radius: 48,
                angle: 5.1,
                notchAngle: 0.7,
                driftSpeed: 0.0005,
                driftPhase: 5.1,
                offsetX: 0,
                offsetY: 0,
                velX: 0,
                velY: 0,
                dewDroplets: [
                    { relX: -12, relY: -14, r: 3.0 },
                    { relX: 15, relY: 10, r: 2.6 },
                ],
            },
        ];

        // ====================================================================
        // LUCIÉRNAGAS ZEN (HOTARU 蛍) - LUCES BIOLUMINISCENTES ETÉREAS
        // ====================================================================
        const fireflyCount = 9;
        const fireflies: Firefly[] = [];

        const wakeFirefly = (f: Firefly, initialFlying = false) => {
            f.seed = Math.random() * 1000;
            f.size = 2.4 + Math.random() * 1.5;
            f.hue = 58 + Math.random() * 26; // Oro ámbar cálido (58-68) a verde lima místico (72-84)
            f.pulsePhase = Math.random() * Math.PI * 2;
            f.pulseSpeed = 0.028 + Math.random() * 0.022;
            f.speed = 0.35 + Math.random() * 0.35;
            f.turnSpeed = 0.008 + Math.random() * 0.012;
            f.z = 0.3 + Math.random() * 0.55;
            f.maxAlpha = 0.85 + Math.random() * 0.15;
            f.maxTimer = 480 + Math.floor(Math.random() * 550); // 16 a 30 segundos de vuelo
            f.trail = [];

            if (initialFlying) {
                // Al inicio, 3 ya sobrevuelan el estanque
                f.state = "flying";
                f.x = Math.random() * (width || window.innerWidth);
                f.y = Math.random() * (height || window.innerHeight);
                f.angle = Math.random() * Math.PI * 2;
                f.alpha = f.maxAlpha;
                f.timer = Math.floor(Math.random() * f.maxTimer);
            } else {
                // Nacimiento natural: emergen suavemente cerca de un nenúfar o en el margen
                f.state = "awakening";
                f.alpha = 0;
                f.timer = 70; // 70 fotogramas de encendido gradual
                if (Math.random() < 0.6 && lilyPads.length > 0) {
                    const pad = lilyPads[Math.floor(Math.random() * lilyPads.length)];
                    f.x = pad.xRatio * (width || window.innerWidth) + (Math.random() - 0.5) * 35;
                    f.y = pad.yRatio * (height || window.innerHeight) + (Math.random() - 0.5) * 35;
                } else {
                    f.x = Math.random() < 0.5 ? -20 : (width || window.innerWidth) + 20;
                    f.y = Math.random() * (height || window.innerHeight);
                }
                const targetX = (width || window.innerWidth) * (0.25 + Math.random() * 0.5);
                const targetY = (height || window.innerHeight) * (0.25 + Math.random() * 0.5);
                f.angle = Math.atan2(targetY - f.y, targetX - f.x) + (Math.random() - 0.5) * 0.5;
            }
        };

        for (let i = 0; i < fireflyCount; i++) {
            const f: Firefly = {
                id: i,
                state: "dormant",
                x: 0,
                y: 0,
                z: 0.5,
                speed: 0.4,
                angle: 0,
                turnSpeed: 0.01,
                size: 3,
                pulsePhase: 0,
                pulseSpeed: 0.04,
                hue: 70,
                alpha: 0,
                maxAlpha: 0.9,
                timer: i < 3 ? 0 : 160 + Math.floor(Math.random() * 450),
                maxTimer: 500,
                seed: i * 42,
                trail: [],
            };
            if (i < 3) {
                wakeFirefly(f, true);
            } else {
                f.timer = 180 + Math.floor(Math.random() * 500); // Entran de vez en vez
            }
            fireflies.push(f);
        }

        // ====================================================================
        // GOTAS DE SALPICADURA DE AGUA (WATER SPLASH PARTICLES)
        // ====================================================================
        const splashDroplets: SplashDroplet[] = [];

        const spawnSplash = (x: number, y: number, count = 12) => {
            for (let i = 0; i < count; i++) {
                const ang = Math.random() * Math.PI * 2;
                const spd = 1.2 + Math.random() * 2.8;
                splashDroplets.push({
                    x,
                    y,
                    vx: Math.cos(ang) * spd,
                    vy: Math.sin(ang) * spd * 0.75,
                    vz: 3.5 + Math.random() * 4.2,
                    z: 0,
                    radius: 1.2 + Math.random() * 1.8,
                    alpha: 0.9,
                    gravity: 0.22,
                });
            }
        };

        // ====================================================================
        // RANA JAPONESA DE ÁRBOL PROCEDURAL (NIHON AMAGAERU 蛙)
        // ====================================================================
        const frog: PondFrog = {
            state: "perched",
            currentPadIndex: 1,
            targetPadIndex: 1,
            x: 0,
            y: 0,
            startX: 0,
            startY: 0,
            targetX: 0,
            targetY: 0,
            jumpProgress: 0,
            jumpDuration: 46,
            jumpAltitude: 95,
            angle: -0.4,
            breathPhase: 0,
            blinkTimer: 160 + Math.floor(Math.random() * 160),
            isBlinking: false,
            idleTimer: 240 + Math.floor(Math.random() * 200), // Salta cada 15 a 30s
            crouchTimer: 0,
            diveTimer: 0,
            size: 0.95,
        };

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

            // Interacción táctil: asustar a la rana posada para que salte
            if (frog.state === "perched") {
                const distToFrog = Math.hypot(px - frog.x, py - frog.y);
                if (distToFrog < 75) {
                    frog.idleTimer = 0;
                    frog.crouchTimer = 12;
                    frog.state = "crouching";
                }
            }

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

            // ================================================================
            // 6. NENÚFARES EN SUPERFICIE CON DINÁMICA DE ESTELA Y ROCÍO
            // ================================================================
            const padPositions: { x: number; y: number; pad: LilyPad }[] = [];

            lilyPads.forEach((pad) => {
                // Oleaje orgánico multi-frecuencia
                const currentX =
                    Math.sin(tick * pad.driftSpeed + pad.driftPhase) * 18 +
                    Math.sin(tick * pad.driftSpeed * 2.7 + pad.driftPhase) * 5;
                const currentY =
                    Math.cos(tick * pad.driftSpeed + pad.driftPhase) * 15 +
                    Math.cos(tick * pad.driftSpeed * 2.1 + pad.driftPhase) * 4;

                const basePosX = pad.xRatio * width + currentX;
                const basePosY = pad.yRatio * height + currentY;

                // Interacción reactiva: estela de los peces koi empuja suavemente las hojas flotantes
                fishes.forEach((fish) => {
                    const fdx = basePosX - fish.x;
                    const fdy = basePosY - fish.y;
                    const fdist = Math.hypot(fdx, fdy);
                    if (fdist < pad.radius + 38 && fdist > 1) {
                        const pushStrength = (1 - fdist / (pad.radius + 38)) * (fish.speed / fish.baseSpeed) * 0.16;
                        pad.velX += (fdx / fdist) * pushStrength;
                        pad.velY += (fdy / fdist) * pushStrength;
                    }
                });

                // Fricción y resorte amortiguado
                pad.velX *= 0.94;
                pad.velY *= 0.94;
                pad.offsetX = (pad.offsetX + pad.velX) * 0.95;
                pad.offsetY = (pad.offsetY + pad.velY) * 0.95;

                const finalX = basePosX + pad.offsetX;
                const finalY = basePosY + pad.offsetY;
                const rot = pad.angle + Math.sin(tick * 0.0008 + pad.driftPhase) * 0.12;

                drawLilyPad(ctx, finalX, finalY, pad.radius, rot, pad.notchAngle, pad.dewDroplets, tick);

                padPositions.push({ x: finalX, y: finalY, pad });
            });

            // ================================================================
            // 7. RANA JAPONESA DE ÁRBOL PROCEDURAL (NIHON AMAGAERU 蛙)
            // ================================================================
            const currentPadPos = padPositions[frog.currentPadIndex] || padPositions[0];

            if (currentPadPos) {
                if (frog.state === "perched") {
                    // Se mantiene anclada con gracia al nenúfar que flota
                    frog.x = currentPadPos.x + 6;
                    frog.y = currentPadPos.y + 4;
                    frog.breathPhase += 0.075;

                    // Parpadeo espontáneo
                    frog.blinkTimer--;
                    if (frog.blinkTimer <= 0) {
                        frog.isBlinking = true;
                        if (frog.blinkTimer < -10) {
                            frog.isBlinking = false;
                            frog.blinkTimer = 180 + Math.floor(Math.random() * 200);
                        }
                    }

                    // Temporizador para el salto Zen espontáneo (Bashō: kawazu tobikomu mizu no oto)
                    frog.idleTimer--;
                    if (frog.idleTimer <= 0) {
                        frog.state = "crouching";
                        frog.crouchTimer = 22; // Preparación muscular
                    }
                } else if (frog.state === "crouching") {
                    frog.x = currentPadPos.x + 6;
                    frog.y = currentPadPos.y + 4;
                    frog.crouchTimer--;

                    // Al agazaparse, determina el destino del salto
                    if (frog.crouchTimer <= 0) {
                        const diveIntoPond = Math.random() < 0.35; // 35% de bucear al estanque
                        if (diveIntoPond || padPositions.length < 2) {
                            // Salta hacia un área despejada de agua zen
                            const angleSpread = (Math.random() - 0.5) * Math.PI * 0.8;
                            const jumpDist = 90 + Math.random() * 80;
                            frog.targetX = Math.max(60, Math.min(width - 60, frog.x + Math.cos(frog.angle + angleSpread) * jumpDist));
                            frog.targetY = Math.max(60, Math.min(height - 60, frog.y + Math.sin(frog.angle + angleSpread) * jumpDist));
                            frog.targetPadIndex = -1; // Marcador de agua abierta
                        } else {
                            // Salta hacia otro nenúfar
                            let nextPadIdx = (frog.currentPadIndex + 1 + Math.floor(Math.random() * (padPositions.length - 1))) % padPositions.length;
                            if (nextPadIdx === frog.currentPadIndex) nextPadIdx = (nextPadIdx + 1) % padPositions.length;
                            frog.targetPadIndex = nextPadIdx;
                            frog.targetX = padPositions[nextPadIdx].x + 4;
                            frog.targetY = padPositions[nextPadIdx].y + 4;
                        }

                        frog.startX = frog.x;
                        frog.startY = frog.y;
                        frog.jumpProgress = 0;
                        frog.angle = Math.atan2(frog.targetY - frog.startY, frog.targetX - frog.startX);
                        frog.state = "jumping";

                        // Impulso de despegue y ondas
                        addRipple(frog.x, frog.y, 45, 1.2);
                        currentPadPos.pad.velX -= Math.cos(frog.angle) * 1.6;
                        currentPadPos.pad.velY -= Math.sin(frog.angle) * 1.6;
                    }
                } else if (frog.state === "jumping") {
                    frog.jumpProgress += 0.024; // ~42 fotogramas de vuelo parabólico
                    if (frog.jumpProgress >= 1) {
                        frog.jumpProgress = 1;
                        frog.x = frog.targetX;
                        frog.y = frog.targetY;

                        if (frog.targetPadIndex >= 0 && padPositions[frog.targetPadIndex]) {
                            // Aterrizaje suave sobre otro nenúfar
                            frog.currentPadIndex = frog.targetPadIndex;
                            frog.state = "perched";
                            frog.idleTimer = 400 + Math.floor(Math.random() * 450); // 15 a 30s de calma
                            addRipple(frog.x, frog.y, 42, 1.0);
                            padPositions[frog.targetPadIndex].pad.velY += 1.8;
                        } else {
                            // ¡Zambullida en el estanque! (Bashō)
                            frog.state = "diving";
                            frog.diveTimer = 280 + Math.floor(Math.random() * 320); // 10 a 20s bajo el agua
                            addRipple(frog.x, frog.y, 95, 1.5);
                            setTimeout(() => addRipple(frog.x, frog.y, 65, 1.1), 140);
                            spawnSplash(frog.x, frog.y, 14);
                        }
                    } else {
                        frog.x = frog.startX + (frog.targetX - frog.startX) * frog.jumpProgress;
                        frog.y = frog.startY + (frog.targetY - frog.startY) * frog.jumpProgress;
                    }
                } else if (frog.state === "diving") {
                    frog.diveTimer--;
                    if (frog.diveTimer <= 0) {
                        // Emerge pacíficamente sobre un nenúfar aleatorio
                        const newPadIdx = Math.floor(Math.random() * padPositions.length);
                        frog.currentPadIndex = newPadIdx;
                        frog.x = padPositions[newPadIdx].x + 6;
                        frog.y = padPositions[newPadIdx].y + 4;
                        frog.angle = (Math.random() - 0.5) * Math.PI;
                        frog.state = "perched";
                        frog.idleTimer = 350 + Math.floor(Math.random() * 350);
                        addRipple(frog.x, frog.y, 50, 1.1);
                    }
                }

                // Dibujar la rana si no está sumergida
                if (frog.state !== "diving") {
                    const altitude =
                        frog.state === "jumping"
                            ? Math.sin(frog.jumpProgress * Math.PI) * frog.jumpAltitude
                            : 0;
                    drawProceduralFrog(
                        ctx,
                        frog.x,
                        frog.y,
                        altitude,
                        frog.angle,
                        frog.state,
                        frog.jumpProgress,
                        frog.breathPhase,
                        frog.isBlinking,
                        frog.size
                    );
                }
            }

            // ================================================================
            // 8. GOTAS DE SALPICADURA DE AGUA (WATER SPLASH PARTICLES)
            // ================================================================
            for (let s = splashDroplets.length - 1; s >= 0; s--) {
                const d = splashDroplets[s];
                d.x += d.vx;
                d.y += d.vy;
                d.z += d.vz;
                d.vz -= d.gravity;
                d.alpha -= 0.024;

                if (d.alpha <= 0.01 || (d.z <= 0 && d.vz < 0)) {
                    if (d.z <= 0) addRipple(d.x, d.y, 15, 0.8);
                    splashDroplets.splice(s, 1);
                    continue;
                }

                drawSplashDroplet(ctx, d);
            }

            // ================================================================
            // 9. LUCIÉRNAGAS ZEN (HOTARU 蛍) - LUCES BIOLUMINISCENTES ETÉREAS
            // ================================================================
            fireflies.forEach((f) => {
                f.pulsePhase += f.pulseSpeed;

                if (f.state === "dormant") {
                    f.timer--;
                    if (f.timer <= 0) {
                        wakeFirefly(f, false);
                    }
                    return;
                }

                if (f.state === "awakening") {
                    f.timer--;
                    f.alpha = Math.min(f.maxAlpha, f.alpha + f.maxAlpha / 70);
                    // Suave ascenso desde la superficie hacia el aire
                    f.z = Math.min(0.75, f.z + 0.006);
                    if (f.timer <= 0) {
                        f.state = "flying";
                        f.timer = f.maxTimer;
                    }
                } else if (f.state === "flying") {
                    f.timer--;
                    // Deriva harmónica suave y cinematográfica (sin saltos bruscos)
                    f.angle += Math.sin(tick * f.turnSpeed + f.seed) * 0.016;
                    f.x += Math.cos(f.angle) * f.speed;
                    f.y += Math.sin(f.angle) * f.speed;
                    // Flotación tridimensional sutil en z
                    f.z = Math.max(0.25, Math.min(1.15, f.z + Math.sin(tick * 0.02 + f.seed) * 0.005));

                    // Estela de condensación de luz (stardust trail)
                    if (tick % 3 === 0) {
                        f.trail.unshift({
                            x: f.x,
                            y: f.y - f.z * 22,
                            alpha: f.alpha * 0.45,
                        });
                        if (f.trail.length > 7) f.trail.pop();
                    }

                    // Transición a desvanecimiento al expirar tiempo o alejarse del estanque
                    if (
                        f.timer <= 0 ||
                        f.x < -80 ||
                        f.x > width + 80 ||
                        f.y < -80 ||
                        f.y > height + 80
                    ) {
                        f.state = "fading";
                        f.timer = 80;
                    }
                } else if (f.state === "fading") {
                    f.timer--;
                    f.alpha = Math.max(0, f.alpha - f.maxAlpha / 80);
                    f.x += Math.cos(f.angle) * (f.speed * 0.7);
                    f.y += Math.sin(f.angle) * (f.speed * 0.7);

                    if (f.timer <= 0 || f.alpha <= 0.01) {
                        f.state = "dormant";
                        f.alpha = 0;
                        f.trail = [];
                        // Reposo zen antes de volver a despertar ("de vez en vez")
                        f.timer = 200 + Math.floor(Math.random() * 500);
                        return;
                    }
                }

                // Atenuación suave de los puntos de la estela
                f.trail.forEach((tp) => {
                    tp.alpha *= 0.92;
                });

                drawFirefly(ctx, f, tick);
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
        // DIBUJO DE NENÚFARES (LILY PADS FLOTANTES CON ROCÍO ASATSUYU)
        // ====================================================================
        function drawLilyPad(
            c: CanvasRenderingContext2D,
            x: number,
            y: number,
            radius: number,
            rotation: number,
            notchWidth = 0.65,
            dewDroplets: { relX: number; relY: number; r: number }[] = [],
            tick = 0
        ) {
            c.save();
            c.translate(x, y);

            // Sombra suave en el lecho del estanque
            c.beginPath();
            c.arc(12, 18, radius, 0, Math.PI * 2);
            c.fillStyle = "rgba(0, 5, 14, 0.28)";
            c.fill();

            // Halo acuático sutil de contacto superficial
            c.beginPath();
            c.arc(0, 0, radius + 2, 0, Math.PI * 2);
            c.strokeStyle = "rgba(56, 189, 248, 0.12)";
            c.lineWidth = 3;
            c.stroke();

            c.rotate(rotation);

            const startAngle = notchWidth * 0.5;
            const endAngle = Math.PI * 2 - notchWidth * 0.5;

            // Borde orgánico con leves ondulaciones
            c.beginPath();
            c.moveTo(0, 0);
            const steps = 36;
            for (let i = 0; i <= steps; i++) {
                const a = startAngle + (endAngle - startAngle) * (i / steps);
                const lobe = radius + Math.sin(a * 7) * 1.4;
                const px = Math.cos(a) * lobe;
                const py = Math.sin(a) * lobe;
                c.lineTo(px, py);
            }
            c.closePath();

            const padGrad = c.createRadialGradient(0, 0, radius * 0.15, 0, 0, radius);
            padGrad.addColorStop(0, "#16A34A"); // Verde esmeralda vivo
            padGrad.addColorStop(0.55, "#15803D");
            padGrad.addColorStop(0.85, "#14532D");
            padGrad.addColorStop(1, "#052E16"); // Verde bosque zen profundo
            c.fillStyle = padGrad;
            c.fill();

            // Ribete exterior verde lima
            c.strokeStyle = "rgba(134, 239, 172, 0.32)";
            c.lineWidth = 1.5;
            c.stroke();

            // Nervaduras radiales orgánicas
            c.strokeStyle = "rgba(187, 247, 208, 0.2)";
            c.lineWidth = 1;
            const numVeins = 8;
            for (let v = 0; v < numVeins; v++) {
                const vAngle = startAngle + (endAngle - startAngle) * ((v + 0.5) / numVeins);
                const vx = Math.cos(vAngle) * (radius * 0.86);
                const vy = Math.sin(vAngle) * (radius * 0.86);
                c.beginPath();
                c.moveTo(0, 0);
                c.quadraticCurveTo(
                    Math.cos(vAngle + 0.04) * (radius * 0.48),
                    Math.sin(vAngle + 0.04) * (radius * 0.48),
                    vx,
                    vy
                );
                c.stroke();
            }

            // Tallo central / punto de inserción
            c.beginPath();
            c.arc(0, 0, 4, 0, Math.PI * 2);
            c.fillStyle = "rgba(254, 240, 138, 0.5)";
            c.fill();

            // Gotitas de rocío sobre la hoja cerosa (Asatsuyu 朝露)
            dewDroplets.forEach((drop) => {
                const wobbleX = Math.sin(tick * 0.05 + drop.relX) * 0.35;
                const wobbleY = Math.cos(tick * 0.05 + drop.relY) * 0.35;
                const dx = drop.relX + wobbleX;
                const dy = drop.relY + wobbleY;

                // Sombra de la gota
                c.beginPath();
                c.ellipse(dx + 0.8, dy + 1.2, drop.r, drop.r * 0.75, 0.4, 0, Math.PI * 2);
                c.fillStyle = "rgba(0, 5, 14, 0.35)";
                c.fill();

                // Esfera acuática cristalina
                const dropGrad = c.createRadialGradient(
                    dx - drop.r * 0.3,
                    dy - drop.r * 0.3,
                    0.2,
                    dx,
                    dy,
                    drop.r
                );
                dropGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
                dropGrad.addColorStop(0.35, "rgba(224, 242, 254, 0.6)");
                dropGrad.addColorStop(0.8, "rgba(56, 189, 248, 0.28)");
                dropGrad.addColorStop(1, "rgba(14, 165, 233, 0.12)");
                c.beginPath();
                c.arc(dx, dy, drop.r, 0, Math.PI * 2);
                c.fillStyle = dropGrad;
                c.fill();

                // Destello especular de luz cenital
                c.beginPath();
                c.arc(dx - drop.r * 0.35, dy - drop.r * 0.35, drop.r * 0.32, 0, Math.PI * 2);
                c.fillStyle = "rgba(255, 255, 255, 0.95)";
                c.fill();
            });

            c.restore();
        }

        // ====================================================================
        // ANATOMÍA PROCEDURAL VECTORIAL: RANA JAPONESA DE ÁRBOL (NIHON AMAGAERU 蛙)
        // ====================================================================
        function drawFrogEye(c: CanvasRenderingContext2D, ex: number, ey: number, isBlinking: boolean) {
            c.save();
            c.translate(ex, ey);

            // Bulto orbital craneal
            c.beginPath();
            c.arc(0, 0, 4.2, 0, Math.PI * 2);
            c.fillStyle = "#15803D";
            c.fill();
            c.strokeStyle = "rgba(15, 23, 42, 0.45)";
            c.lineWidth = 0.8;
            c.stroke();

            if (isBlinking) {
                // Párpado cerrado
                c.beginPath();
                c.arc(0, 0, 3.8, 0, Math.PI);
                c.fillStyle = "#16A34A";
                c.fill();
                c.beginPath();
                c.moveTo(-3.5, 0);
                c.lineTo(3.5, 0);
                c.strokeStyle = "#0F172A";
                c.lineWidth = 1.2;
                c.stroke();
            } else {
                // Iris dorado / ámbar resplandeciente
                const eyeGrad = c.createRadialGradient(-0.8, -0.8, 0.5, 0, 0, 3.6);
                eyeGrad.addColorStop(0, "#FDE047");
                eyeGrad.addColorStop(0.5, "#F59E0B");
                eyeGrad.addColorStop(1, "#B45309");
                c.beginPath();
                c.arc(0, 0, 3.5, 0, Math.PI * 2);
                c.fillStyle = eyeGrad;
                c.fill();

                // Pupila horizontal característica de anfibio
                c.fillStyle = "#09090B";
                c.beginPath();
                c.ellipse(0, 0, 2.6, 1.0, 0, 0, Math.PI * 2);
                c.fill();

                // Reflejo especular blanco
                c.fillStyle = "#FFFFFF";
                c.beginPath();
                c.arc(-1.1, -1.1, 0.8, 0, Math.PI * 2);
                c.fill();
            }

            c.restore();
        }

        function drawPerchedHindLeg(c: CanvasRenderingContext2D, side: number, compress: number) {
            c.save();
            // Muslo plegado en Z junto al flanco
            c.beginPath();
            c.ellipse(-7, side * 11 * compress, 8, 4.5, side * 0.35, 0, Math.PI * 2);
            c.fillStyle = "#15803D";
            c.fill();
            c.strokeStyle = "rgba(22, 101, 52, 0.4)";
            c.lineWidth = 0.8;
            c.stroke();

            // Pantorrilla plegada
            c.beginPath();
            c.ellipse(-2, side * 13 * compress, 7, 3.2, -side * 0.4, 0, Math.PI * 2);
            c.fillStyle = "#16A34A";
            c.fill();

            // Pie largo descansando hacia adelante
            c.beginPath();
            c.moveTo(-2, side * 14 * compress);
            c.lineTo(7, side * 12 * compress);
            c.strokeStyle = "#22C55E";
            c.lineWidth = 1.8;
            c.lineCap = "round";
            c.stroke();

            // Dedos y ventosas
            for (let d = -1; d <= 1; d++) {
                c.beginPath();
                c.arc(7 + d * 1.5, side * 12 * compress + d * 1.2, 1.0, 0, Math.PI * 2);
                c.fillStyle = "#86EFAC";
                c.fill();
            }
            c.restore();
        }

        function drawJumpingHindLeg(c: CanvasRenderingContext2D, side: number) {
            c.save();
            // Muslo potente estirado hacia atrás
            c.beginPath();
            c.moveTo(-10, side * 5);
            c.quadraticCurveTo(-18, side * 11, -26, side * 8);
            c.strokeStyle = "#15803D";
            c.lineWidth = 4.8;
            c.lineCap = "round";
            c.stroke();

            // Pantorrilla estilizada
            c.beginPath();
            c.moveTo(-26, side * 8);
            c.quadraticCurveTo(-35, side * 9, -42, side * 6);
            c.strokeStyle = "#16A34A";
            c.lineWidth = 3.6;
            c.lineCap = "round";
            c.stroke();

            // Membrana interdigital de natación translúcida
            c.beginPath();
            c.moveTo(-42, side * 6);
            c.lineTo(-51, side * 11);
            c.quadraticCurveTo(-53, side * 6, -52, side * 2);
            c.closePath();
            c.fillStyle = "rgba(134, 239, 172, 0.45)";
            c.fill();

            // Dedos largos y estilizados extendidos hacia atrás
            for (let t = 0; t < 4; t++) {
                const toeSpread = (t - 1.5) * 3.2;
                c.beginPath();
                c.moveTo(-42, side * 6);
                c.lineTo(-50 - (3 - Math.abs(t - 1.5)) * 2, side * 6 + toeSpread);
                c.strokeStyle = "#22C55E";
                c.lineWidth = 1.3;
                c.lineCap = "round";
                c.stroke();

                c.beginPath();
                c.arc(-50 - (3 - Math.abs(t - 1.5)) * 2, side * 6 + toeSpread, 1.1, 0, Math.PI * 2);
                c.fillStyle = "#86EFAC";
                c.fill();
            }
            c.restore();
        }

        function drawPerchedForeleg(c: CanvasRenderingContext2D, side: number, compress: number) {
            c.save();
            c.beginPath();
            c.moveTo(5, side * 7);
            c.quadraticCurveTo(8, side * 11 * compress, 10, side * 9 * compress);
            c.strokeStyle = "#16A34A";
            c.lineWidth = 2.4;
            c.lineCap = "round";
            c.stroke();

            // 4 dedos delicados con ventosas redondeadas apoyados en la hoja
            for (let d = -1.5; d <= 1.5; d += 1) {
                const dx = 10 + Math.cos(side * 0.4 + d * 0.35) * 3.5;
                const dy = side * 9 * compress + Math.sin(side * 0.4 + d * 0.35) * 3.5;
                c.beginPath();
                c.moveTo(10, side * 9 * compress);
                c.lineTo(dx, dy);
                c.strokeStyle = "#22C55E";
                c.lineWidth = 1.1;
                c.stroke();

                c.beginPath();
                c.arc(dx, dy, 1.1, 0, Math.PI * 2);
                c.fillStyle = "#86EFAC";
                c.fill();
            }
            c.restore();
        }

        function drawJumpingForeleg(c: CanvasRenderingContext2D, side: number) {
            c.save();
            c.beginPath();
            c.moveTo(6, side * 7);
            c.quadraticCurveTo(15, side * 12, 20, side * 8);
            c.strokeStyle = "#16A34A";
            c.lineWidth = 2.2;
            c.lineCap = "round";
            c.stroke();

            for (let d = -1; d <= 1; d++) {
                const dx = 20 + Math.cos(d * 0.4) * 4;
                const dy = side * 8 + Math.sin(d * 0.4) * 3.5;
                c.beginPath();
                c.moveTo(20, side * 8);
                c.lineTo(dx, dy);
                c.strokeStyle = "#4ADE80";
                c.lineWidth = 1.1;
                c.stroke();
                c.beginPath();
                c.arc(dx, dy, 1.0, 0, Math.PI * 2);
                c.fillStyle = "#86EFAC";
                c.fill();
            }
            c.restore();
        }

        function drawProceduralFrog(
            c: CanvasRenderingContext2D,
            x: number,
            y: number,
            altitude: number,
            angle: number,
            state: "perched" | "crouching" | "jumping" | "diving" | "hidden",
            jumpProgress: number,
            breathPhase: number,
            isBlinking: boolean,
            size: number
        ) {
            if (state === "hidden") return;

            c.save();

            // 1. Sombra sobre la superficie (desacoplada en altitud)
            const shadowScale = Math.max(0.4, 1 - altitude * 0.005);
            const shadowAlpha = Math.max(0.12, 0.35 - altitude * 0.0025);
            c.save();
            c.translate(x + altitude * 0.25, y + altitude * 0.45);
            c.rotate(angle);
            c.scale(shadowScale * size, shadowScale * size);
            c.beginPath();
            c.ellipse(0, 0, 16, 11, 0, 0, Math.PI * 2);
            c.fillStyle = `rgba(0, 5, 14, ${shadowAlpha})`;
            c.fill();
            c.restore();

            // 2. Posición 3D de la rana (elevada por altitude)
            const frogY = y - altitude;
            c.translate(x, frogY);
            c.rotate(angle);
            c.scale(size, size);

            const isJumping = state === "jumping";
            const isCrouching = state === "crouching";
            const compress = isCrouching ? 0.8 : 1.0;

            // PATAS TRASERAS
            if (isJumping) {
                drawJumpingHindLeg(c, -1);
                drawJumpingHindLeg(c, 1);
            } else {
                drawPerchedHindLeg(c, -1, compress);
                drawPerchedHindLeg(c, 1, compress);
            }

            // CUERPO (Torso piriforme de rana)
            c.save();
            c.scale(compress, 1);

            // Gradiente dorsal verde jade
            const bodyGrad = c.createRadialGradient(2, 0, 2, 0, 0, 16);
            bodyGrad.addColorStop(0, "#4ADE80"); // Verde brillante dorsal
            bodyGrad.addColorStop(0.45, "#16A34A"); // Verde jade fresco
            bodyGrad.addColorStop(0.85, "#15803D"); // Verde musgo
            bodyGrad.addColorStop(1, "#14532D"); // Verde bosque oscuro

            c.beginPath();
            c.moveTo(14, 0); // Hocico anterior
            c.bezierCurveTo(13, 8, 5, 13, -5, 12); // Flanco derecho
            c.bezierCurveTo(-12, 11, -15, 6, -14, 0); // Pelvis posterior
            c.bezierCurveTo(-15, -6, -12, -11, -5, -12); // Flanco izquierdo
            c.bezierCurveTo(5, -13, 13, -8, 14, 0); // Retorno
            c.closePath();
            c.fillStyle = bodyGrad;
            c.fill();

            // Vientre crema claro
            c.beginPath();
            c.ellipse(-1, 0, 9, 6.5, 0, 0, Math.PI * 2);
            c.fillStyle = "rgba(254, 240, 138, 0.28)";
            c.fill();

            // Máscara lateral oscura típica de rana japonesa (Nihon Amagaeru)
            c.strokeStyle = "rgba(15, 23, 42, 0.7)";
            c.lineWidth = 1.3;
            c.beginPath();
            c.moveTo(13, -2);
            c.quadraticCurveTo(10, -7, 2, -11);
            c.stroke();
            c.beginPath();
            c.moveTo(13, 2);
            c.quadraticCurveTo(10, 7, 2, 11);
            c.stroke();

            // Saco bucal / garganta palpitante
            if (!isJumping) {
                const sacExpansion = Math.max(0, Math.sin(breathPhase)) * 2.2;
                if (sacExpansion > 0.2) {
                    c.beginPath();
                    c.arc(11, 0, 3.5 + sacExpansion, -Math.PI * 0.5, Math.PI * 0.5);
                    c.fillStyle = "rgba(254, 240, 138, 0.45)";
                    c.fill();
                }
            }

            // Línea dorsal vertebral de luz
            c.strokeStyle = "rgba(255, 255, 255, 0.3)";
            c.lineWidth = 0.9;
            c.beginPath();
            c.moveTo(10, 0);
            c.lineTo(-10, 0);
            c.stroke();

            c.restore(); // fin escala compresión

            // PATAS DELANTERAS
            if (isJumping) {
                drawJumpingForeleg(c, -1);
                drawJumpingForeleg(c, 1);
            } else {
                drawPerchedForeleg(c, -1, compress);
                drawPerchedForeleg(c, 1, compress);
            }

            // OJOS DORADOS CON PUPILA HORIZONTAL
            drawFrogEye(c, 8, -7.5, isBlinking);
            drawFrogEye(c, 8, 7.5, isBlinking);

            // Orificios nasales diminutos
            c.fillStyle = "rgba(15, 23, 42, 0.8)";
            c.beginPath();
            c.arc(13.2, -1.4, 0.6, 0, Math.PI * 2);
            c.arc(13.2, 1.4, 0.6, 0, Math.PI * 2);
            c.fill();

            c.restore();
        }

        // ====================================================================
        // DIBUJO DE PARTÍCULAS: GOTAS DE AGUA (SPLASH DROPLETS)
        // ====================================================================
        function drawSplashDroplet(c: CanvasRenderingContext2D, d: SplashDroplet) {
            if (d.alpha <= 0.01) return;
            const dropY = d.y - d.z;
            c.save();
            c.beginPath();
            c.arc(d.x, dropY, d.radius, 0, Math.PI * 2);
            c.fillStyle = `rgba(224, 242, 254, ${d.alpha * 0.9})`;
            c.fill();

            // Reflejo especular
            c.beginPath();
            c.arc(d.x - d.radius * 0.3, dropY - d.radius * 0.3, d.radius * 0.35, 0, Math.PI * 2);
            c.fillStyle = `rgba(255, 255, 255, ${d.alpha})`;
            c.fill();
            c.restore();
        }

        // ====================================================================
        // DIBUJO DE LUCIÉRNAGAS ZEN (HOTARU 蛍) - BIOLUMINISCENCIA ETÉREA PURA
        // ====================================================================
        function drawFirefly(c: CanvasRenderingContext2D, f: Firefly, tick: number) {
            if (f.alpha <= 0.01) return;

            // Respiración orgánica no-lineal (curva suave de bioluminiscencia)
            const sinPulse = Math.sin(f.pulsePhase);
            const pulse = 0.35 + 0.65 * Math.pow(Math.max(0, sinPulse), 2.2);
            const breathAlpha = f.alpha * pulse;

            c.save();
            // Modo óptico aditivo: crea auténtico resplandor y bloom lumínico sobre el estanque oscuro
            c.globalCompositeOperation = "screen";

            // 1. Reflejo líquido sutil sobre el estanque (ondas distorsionadas por la superficie)
            const reflY = f.y + f.z * 18;
            const waterRippleOffset = Math.sin(tick * 0.035 + f.y * 0.05) * 2.5;
            const reflRadX = f.size * (6 + pulse * 8);
            const reflRadY = f.size * (2.2 + pulse * 2.8);

            const reflGrad = c.createRadialGradient(
                f.x + waterRippleOffset,
                reflY,
                0,
                f.x + waterRippleOffset,
                reflY,
                reflRadX
            );
            reflGrad.addColorStop(0, `hsla(${f.hue}, 95%, 72%, ${breathAlpha * 0.32})`);
            reflGrad.addColorStop(0.45, `hsla(${f.hue}, 90%, 60%, ${breathAlpha * 0.12})`);
            reflGrad.addColorStop(1, `hsla(${f.hue}, 85%, 50%, 0)`);

            c.beginPath();
            c.ellipse(f.x + waterRippleOffset, reflY, reflRadX, reflRadY, 0, 0, Math.PI * 2);
            c.fillStyle = reflGrad;
            c.fill();

            // 2. Estela efímera de polvo de estrellas (Stardust Trail)
            f.trail.forEach((tp) => {
                if (tp.alpha > 0.02) {
                    const trailRad = f.size * 3.8;
                    const tGrad = c.createRadialGradient(tp.x, tp.y, 0, tp.x, tp.y, trailRad);
                    tGrad.addColorStop(0, `hsla(${f.hue}, 95%, 75%, ${tp.alpha * 0.45})`);
                    tGrad.addColorStop(0.5, `hsla(${f.hue}, 90%, 65%, ${tp.alpha * 0.18})`);
                    tGrad.addColorStop(1, `hsla(${f.hue}, 85%, 55%, 0)`);

                    c.beginPath();
                    c.arc(tp.x, tp.y, trailRad, 0, Math.PI * 2);
                    c.fillStyle = tGrad;
                    c.fill();
                }
            });

            // 3. Luciérnaga en el aire (altitud z)
            const flyY = f.y - f.z * 22;

            // Capa A: Vaho atmosférico amplio y difuso (Atmospheric Vapor Bloom)
            const vaporRad = f.size * (14 + pulse * 22);
            const vaporGrad = c.createRadialGradient(f.x, flyY, 0, f.x, flyY, vaporRad);
            vaporGrad.addColorStop(0, `hsla(${f.hue}, 95%, 70%, ${breathAlpha * 0.28})`);
            vaporGrad.addColorStop(0.35, `hsla(${f.hue}, 90%, 60%, ${breathAlpha * 0.12})`);
            vaporGrad.addColorStop(0.7, `hsla(${f.hue}, 85%, 55%, ${breathAlpha * 0.04})`);
            vaporGrad.addColorStop(1, `hsla(${f.hue}, 85%, 50%, 0)`);

            c.beginPath();
            c.arc(f.x, flyY, vaporRad, 0, Math.PI * 2);
            c.fillStyle = vaporGrad;
            c.fill();

            // Capa B: Corona radiante bioluminiscente cálida (Corona Halo)
            const coronaRad = f.size * (5 + pulse * 9);
            const coronaGrad = c.createRadialGradient(f.x, flyY, 0, f.x, flyY, coronaRad);
            coronaGrad.addColorStop(0, `hsla(${f.hue}, 100%, 84%, ${breathAlpha * 0.85})`);
            coronaGrad.addColorStop(0.4, `hsla(${f.hue}, 95%, 70%, ${breathAlpha * 0.45})`);
            coronaGrad.addColorStop(0.8, `hsla(${f.hue}, 90%, 60%, ${breathAlpha * 0.15})`);
            coronaGrad.addColorStop(1, `hsla(${f.hue}, 85%, 55%, 0)`);

            c.beginPath();
            c.arc(f.x, flyY, coronaRad, 0, Math.PI * 2);
            c.fillStyle = coronaGrad;
            c.fill();

            // Capa C: Núcleo de plasma blanco-oro incandescente (sin borde cortado)
            const coreRad = f.size * (1.6 + pulse * 1.6);
            const coreGrad = c.createRadialGradient(f.x, flyY, 0, f.x, flyY, coreRad);
            coreGrad.addColorStop(0, `rgba(255, 255, 245, ${breathAlpha * 0.95})`);
            coreGrad.addColorStop(0.4, `hsla(${f.hue}, 100%, 90%, ${breathAlpha * 0.85})`);
            coreGrad.addColorStop(0.75, `hsla(${f.hue}, 100%, 78%, ${breathAlpha * 0.4})`);
            coreGrad.addColorStop(1, `hsla(${f.hue}, 100%, 70%, 0)`);

            c.beginPath();
            c.arc(f.x, flyY, coreRad, 0, Math.PI * 2);
            c.fillStyle = coreGrad;
            c.fill();

            // Capa D: Destello de estrella sutil en el clímax de la pulsación (Diffraction Sparkle)
            if (pulse > 0.78 && f.alpha > 0.4) {
                const sparkleIntensity = (pulse - 0.78) * 4.5 * f.alpha;
                const flareLen = f.size * (3.5 + pulse * 3.5);

                c.strokeStyle = `rgba(255, 255, 250, ${sparkleIntensity * 0.65})`;
                c.lineWidth = 0.85;

                // Destello horizontal
                c.beginPath();
                c.moveTo(f.x - flareLen, flyY);
                c.lineTo(f.x + flareLen, flyY);
                c.stroke();

                // Destello vertical
                c.beginPath();
                c.moveTo(f.x, flyY - flareLen * 0.75);
                c.lineTo(f.x, flyY + flareLen * 0.75);
                c.stroke();
            }

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
