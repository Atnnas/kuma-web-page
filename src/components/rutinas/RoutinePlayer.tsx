"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import {
    PlayCircle,
    Check,
    SkipForward,
    X,
    Barbell,
    Timer,
    ArrowCounterClockwise,
    Heartbeat,
    Trophy,
    WarningCircle
} from "@phosphor-icons/react/dist/ssr";
import confetti from "canvas-confetti";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { audioTrainer } from "@/lib/audio-trainer";
import { getExerciseGif } from "@/lib/exercise-assets";
import { AchievementOverlay } from "../gamification/AchievementOverlay";
import {
    getUnfinishedRoutineLog,
    updateRoutineProgress,
    startRoutineLog,
    completeRoutineLog
} from "@/lib/actions/routine-logs";

// --- INTERFACES ---
interface IBlock {
    type?: "exercise" | "loop_start" | "loop_end";
    exercise_name: string;
    sets: number;
    reps: number;
    rest_seconds: number;
    measure_type?: "reps" | "time";
    notes?: string;
    media_url?: string;
    loop_count?: number;
    isAiEnabled?: boolean;
}

interface IRoutineData {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    estimated_duration: number;
    equipment_types: string[];
    blocks: IBlock[];
    isAiRoutine?: boolean;
}

// --- UTILS ---
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getTotalSetsRecursive = (blocks: IBlock[]): number => {
    let total = 0;
    let i = 0;
    while (i < blocks.length) {
        const block = blocks[i];
        if (block.type === "loop_start") {
            let depth = 1;
            let j = i + 1;
            while (j < blocks.length && depth > 0) {
                if (blocks[j].type === "loop_start") depth++;
                if (blocks[j].type === "loop_end") depth--;
                j++;
            }
            const loopBlocks = blocks.slice(i + 1, j - 1);
            const loopCount = block.loop_count || 1;
            total += loopCount * getTotalSetsRecursive(loopBlocks);
            i = j;
        } else if (block.type === "loop_end") {
            i++;
        } else {
            total += block.sets;
            i++;
        }
    }
    return total;
};

export function RoutinePlayer({ routine }: { routine: IRoutineData }) {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"intro" | "active" | "completed">("intro");
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [impact, setImpact] = useState(false); // FOR SHAKE EFFECT

    const [startTime, setStartTime] = useState<number | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [exerciseTimeLeft, setExerciseTimeLeft] = useState(0);

    // Accurate Progress State
    const [totalSets, setTotalSets] = useState(0);
    const [completedSets, setCompletedSets] = useState(0);

    // Loop State
    const [loopRepetitions, setLoopRepetitions] = useState<{ [blockIndex: number]: number }>({});
    const [cheatDetected, setCheatDetected] = useState(false);
    const [fastSetCount, setFastSetCount] = useState(0);
    const setStartTimeRef = useRef<number | null>(null);

    // Gamification State
    const [showTrophy, setShowTrophy] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [currentLogId, setCurrentLogId] = useState<string | null>(null);
    const wakeLockRef = useRef<any>(null);

    // Camera / AI routine states
    const [useCamera, setUseCamera] = useState(false);
    const [showCameraPrompt, setShowCameraPrompt] = useState(false);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [repsCount, setRepsCount] = useState(0);

    // AI Tracking feedback states
    const [feedbackMsg, setFeedbackMsg] = useState("Alineando cuerpo...");
    const [instructionMsg, setInstructionMsg] = useState("Ponte de perfil para iniciar");
    const [activeSide, setActiveSide] = useState<"izquierdo" | "derecho" | "detectando">("detectando");
    const [kneeAngle, setKneeAngle] = useState(180);
    const [elbowAngle, setElbowAngle] = useState(180);
    const [torsoAngle, setTorsoAngle] = useState(0);
    const [hasReachedBottom, setHasReachedBottom] = useState(false);

    // Refs for AI detection
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const repsCountRef = useRef(0);
    const hasReachedDepthRef = useRef(false);
    const isReadyToStartRef = useRef(false);
    const wasBendingRef = useRef(false);
    const hasReachedBottomRef = useRef(false);

    // Haptic Helper
    const vibrate = (pattern: number | number[] = 100) => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    // Wake Lock API (Recommendation #7)
    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
                }
            } catch (err) {
                console.error("Wake Lock failed:", err);
            }
        };

        if (status === "active") {
            requestWakeLock();
        }

        return () => {
            if (wakeLockRef.current) {
                wakeLockRef.current.release().then(() => {
                    wakeLockRef.current = null;
                });
            }
        };
    }, [status]);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const activeBlock = routine.blocks[currentBlockIndex];
    const totalBlocks = routine.blocks.length;

    const getIsAiExercise = (block: IBlock | undefined) => {
        if (!block) return false;
        const nameLower = (block.exercise_name || "").toLowerCase();
        return !!(
            block.isAiEnabled ||
            ["Sentadillas con MediaPipe", "Push Ups con MediaPipe", "Burpees con MediaPipe", "Bicep Curl con MediaPipe", "Press Militar con MediaPipe"].includes(block.exercise_name) ||
            (routine.isAiRoutine && (
                nameLower.includes("sentadilla") || nameLower.includes("squat") ||
                nameLower.includes("push") || nameLower.includes("pechada") || nameLower.includes("lagartija") ||
                nameLower.includes("burpee") ||
                nameLower.includes("bicep") || nameLower.includes("biceps") || nameLower.includes("curl") ||
                nameLower.includes("militar") || nameLower.includes("press") || nameLower.includes("hombro")
            ))
        );
    };
    const isAiExerciseActive = getIsAiExercise(activeBlock);
    const activeBlockNameLower = (activeBlock?.exercise_name || "").toLowerCase();
    const isSquatActive = activeBlock?.exercise_name === "Sentadillas con MediaPipe" || activeBlockNameLower.includes("sentadilla") || activeBlockNameLower.includes("squat");
    const isPushupActive = activeBlock?.exercise_name === "Push Ups con MediaPipe" || activeBlockNameLower.includes("push") || activeBlockNameLower.includes("pechada") || activeBlockNameLower.includes("lagartija");
    const isBurpeeActive = activeBlock?.exercise_name === "Burpees con MediaPipe" || activeBlockNameLower.includes("burpee");
    const isBicepCurlActive = activeBlock?.exercise_name === "Bicep Curl con MediaPipe" || activeBlockNameLower.includes("bicep") || activeBlockNameLower.includes("biceps") || activeBlockNameLower.includes("curl");
    const isShoulderPressActive = activeBlock?.exercise_name === "Press Militar con MediaPipe" || activeBlockNameLower.includes("militar") || activeBlockNameLower.includes("press") || activeBlockNameLower.includes("hombro");

    // --- TIMER LOGIC ---
    useEffect(() => {
        if (isResting) {
            if (timeLeft > 0) {
                if (timeLeft <= 3) audioTrainer.playCountdown();
                timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
            } else if (timeLeft === 0) {
                vibrate([200, 100, 200]); // Recommendation #4
                audioTrainer.playStart();
                finishRest();
            }
        }
        return () => clearTimeout(timerRef.current!);
    }, [isResting, timeLeft]);

    // --- EXERCISE TIMER LOGIC ---
    useEffect(() => {
        // Reset timer when block or set changes
        if (activeBlock && activeBlock.measure_type === "time") {
            setExerciseTimeLeft(activeBlock.reps);
            setIsTimerRunning(false);
        }

        // Reset AI reps and state machines
        repsCountRef.current = 0;
        setRepsCount(0);
        hasReachedDepthRef.current = false;
        isReadyToStartRef.current = false;
        wasBendingRef.current = false;
        hasReachedBottomRef.current = false;
        setFeedbackMsg("Alineando cuerpo de perfil...");
        setInstructionMsg("Ponte de perfil para iniciar");

        // Auto-skip loop markers
        if (activeBlock && (activeBlock.type === "loop_start" || activeBlock.type === "loop_end")) {
            nextStep();
        }
    }, [currentBlockIndex, currentSet]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning && exerciseTimeLeft > 0 && !isResting && status === "active") {
            interval = setInterval(() => {
                setExerciseTimeLeft((prev) => {
                    const next = prev - 1;
                    if (next <= 5 && next > 0) {
                        audioTrainer.playCountdown();
                    }
                    if (next === 0) {
                        vibrate(300); // Recommendation #4
                        audioTrainer.playStart();
                        setIsTimerRunning(false);
                    }
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, exerciseTimeLeft, isResting, status]);
    useEffect(() => {
        if (status === "active" && currentBlockIndex === 0 && currentSet === 1 && !isResting) {
            audioTrainer.speak(`Iniciando ${routine.title}. Vamos con ${routine.blocks[0].exercise_name}`);
        }
    }, [status]);

    // Auto-resume when coming from the recovery banner (?resume=true)
    useEffect(() => {
        if (searchParams.get("resume") !== "true") return;
        const autoResume = async () => {
            try {
                const res = await getUnfinishedRoutineLog(routine._id);
                if (!res.success || !res.log?.lastState) return;
                const { lastState } = res.log;

                isAutoResuming.current = true; // prevent reactive save from firing on restore

                // RESTORE EXACT STATE
                setCurrentBlockIndex(lastState.currentBlockIndex || 0);
                setCurrentSet(lastState.currentSet || 1);
                setCompletedSets(lastState.completedSets || 0);
                setLoopRepetitions(lastState.loopRepetitions || {});

                // Restore timer for timed exercises
                if (lastState.exerciseTimeLeft !== undefined) {
                    setExerciseTimeLeft(lastState.exerciseTimeLeft);
                }

                const elapsedSeconds = lastState.elapsedSeconds || 0;
                setStartTime(Date.now() - elapsedSeconds * 1000);
                setStartTimeRef.current = Date.now();
                setCurrentLogId(res.log._id);

                const total = getTotalSetsRecursive(routine.blocks);
                setTotalSets(total);

                // IMPORTANT: GO DIRECTLY TO ACTIVE
                setStatus("active");

                // (Silent resume - removed voice speak here)
            } catch (err) {
                console.error("Auto-resume failed:", err);
            }
        };
        autoResume();
    }, []);

    // Periodic Progress Sync (Every 5 seconds)
    useEffect(() => {
        if (status !== "active" || !currentLogId) return;

        const interval = setInterval(() => {
            const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
            updateRoutineProgress(currentLogId, {
                currentBlockIndex,
                currentSet,
                completedSets,
                loopRepetitions,
                elapsedSeconds: elapsed,
                exerciseTimeLeft // Save exact seconds left in current exercise
            }).catch(console.error);
        }, 5000);

        return () => clearInterval(interval);
    }, [status, currentLogId, currentBlockIndex, currentSet, completedSets, exerciseTimeLeft]);

    // Reactive progress save — fires AFTER React applies state changes from nextStep()
    // This ensures we always save where the user needs to GO NEXT, not where they just were
    const isAutoResuming = useRef(false);
    useEffect(() => {
        // Skip first save when auto-resuming (that would overwrite the restored state)
        if (status !== "active" || !currentLogId) return;
        if (isAutoResuming.current) {
            isAutoResuming.current = false;
            return;
        }
        const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
        updateRoutineProgress(currentLogId, {
            currentBlockIndex,
            currentSet,
            completedSets,
            loopRepetitions,
            elapsedSeconds: elapsed,
            exerciseTimeLeft: activeBlock?.measure_type === "time" ? activeBlock.reps : undefined
        }).catch(console.error);
    }, [currentBlockIndex, currentSet, completedSets]);

    // Exit Guard (beforeunload)
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (status === "active") {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [status]);

    const speak = (text: string) => {};

    const calculate2DAngle = (ptA: any, ptB: any, ptC: any) => {
        if (!ptA || !ptB || !ptC) return 180;
        const vecBA = { x: ptA.x - ptB.x, y: ptA.y - ptB.y };
        const vecBC = { x: ptC.x - ptB.x, y: ptC.y - ptB.y };
        const dot = vecBA.x * vecBC.x + vecBA.y * vecBC.y;
        const lenA = Math.sqrt(vecBA.x * vecBA.x + vecBA.y * vecBA.y);
        const lenC = Math.sqrt(vecBC.x * vecBC.x + vecBC.y * vecBC.y);
        if (lenA === 0 || lenC === 0) return 180;
        const cosTheta = Math.min(1, Math.max(-1, dot / (lenA * lenC)));
        return Math.round(Math.acos(cosTheta) * (180.0 / Math.PI));
    };

    // Load scripts
    const loadScripts = () => {
        if (scriptsLoaded) return;
        const loadScript = (src: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }
                const script = document.createElement("script");
                script.src = src;
                script.onload = () => resolve();
                script.onerror = () => reject();
                document.body.appendChild(script);
            });
        };

        Promise.all([
            loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"),
            loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js")
        ])
        .then(() => {
            setScriptsLoaded(true);
        })
        .catch((err) => {
            console.error("Error loading MediaPipe scripts:", err);
            setCameraError("No se pudieron cargar las librerías de visión artificial.");
        });
    };

    // Audio beeps
    const playBeep = () => {
        try {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            const audioCtx = new AudioContextClass();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        } catch {}
    };

    const playDepthBeep = () => {
        try {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            const audioCtx = new AudioContextClass();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.07, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
        } catch {}
    };

    const playWarningBeep = () => {
        try {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            const audioCtx = new AudioContextClass();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(220, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } catch {}
    };

    // Auto-prompt on mount if IA routine or any block has AI enabled
    useEffect(() => {
        const hasAiBlock = routine.blocks?.some(b => b.isAiEnabled);
        if (routine.isAiRoutine || hasAiBlock) {
            setShowCameraPrompt(true);
        }
    }, [routine.isAiRoutine, routine.blocks]);

    // Setup MediaPipe camera and pose on active AI set
    useEffect(() => {
        if (!useCamera || !scriptsLoaded || status !== "active" || isResting) return;
        if (!activeBlock) return;

        const isAiExercise = isAiExerciseActive;
        if (!isAiExercise) return;

        let active = true;
        let cameraInstance: any = null;
        let poseInstance: any = null;

        const initCamera = async () => {
            if (!videoRef.current || !canvasRef.current) return;

            const PoseClass = (window as any).Pose;
            const CameraClass = (window as any).Camera;
            if (!PoseClass || !CameraClass) return;

            poseInstance = new PoseClass({
                locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
            });

            poseInstance.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: 0.65,
                minTrackingConfidence: 0.5
            });

            poseInstance.onResults((results: any) => {
                if (active) {
                    handlePoseResults(results);
                }
            });

            cameraInstance = new CameraClass(videoRef.current, {
                onFrame: async () => {
                    if (videoRef.current && poseInstance && active) {
                        try {
                            await poseInstance.send({ image: videoRef.current });
                        } catch (e) {
                            console.error("Frame processing error:", e);
                        }
                    }
                },
                width: 640,
                height: 480
            });

            try {
                await cameraInstance.start();
                setCameraError(null);
            } catch (err) {
                console.error("Failed to start camera:", err);
                setCameraError("No se pudo iniciar la cámara. Verifica los permisos en tu navegador.");
            }
        };

        // Small timeout to let elements mount properly
        const t = setTimeout(() => {
            initCamera();
        }, 300);

        return () => {
            active = false;
            clearTimeout(t);
            if (cameraInstance) {
                try { cameraInstance.stop(); } catch {}
            }
            if (poseInstance) {
                try { poseInstance.close(); } catch {}
            }
        };
    }, [useCamera, scriptsLoaded, status, isResting, currentBlockIndex, currentSet]);

    const handlePoseResults = (results: any) => {
        if (!canvasRef.current || !canvasRef.current.getContext) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.save();
        ctx.clearRect(0, 0, width, height);

        if (results.image) {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(results.image, 0, 0, width, height);
            ctx.restore();
        }

        const landmarks = results.poseLandmarks;
        if (!landmarks || landmarks.length < 33) {
            setFeedbackMsg("Alineando cuerpo de perfil...");
            return;
        }

        let isLeftProfile = true;
        const nameLower = (activeBlock?.exercise_name || "").toLowerCase();
        const isSquat = activeBlock?.exercise_name === "Sentadillas con MediaPipe" || nameLower.includes("sentadilla") || nameLower.includes("squat");
        const isPushup = activeBlock?.exercise_name === "Push Ups con MediaPipe" || nameLower.includes("push") || nameLower.includes("pechada") || nameLower.includes("lagartija");
        const isBurpee = activeBlock?.exercise_name === "Burpees con MediaPipe" || nameLower.includes("burpee");
        const isBicepCurl = activeBlock?.exercise_name === "Bicep Curl con MediaPipe" || nameLower.includes("bicep") || nameLower.includes("biceps") || nameLower.includes("curl");
        const isShoulderPress = activeBlock?.exercise_name === "Press Militar con MediaPipe" || nameLower.includes("militar") || nameLower.includes("press") || nameLower.includes("hombro");

        if (isSquat) {
            const leftVisibility = (landmarks[23]?.visibility || 0) + (landmarks[25]?.visibility || 0) + (landmarks[27]?.visibility || 0);
            const rightVisibility = (landmarks[24]?.visibility || 0) + (landmarks[26]?.visibility || 0) + (landmarks[28]?.visibility || 0);
            isLeftProfile = leftVisibility > rightVisibility;
        } else if (isShoulderPress) {
            // Frontal view
            isLeftProfile = true;
        } else {
            const leftVisibility = (landmarks[11]?.visibility || 0) + (landmarks[13]?.visibility || 0) + (landmarks[15]?.visibility || 0);
            const rightVisibility = (landmarks[12]?.visibility || 0) + (landmarks[14]?.visibility || 0) + (landmarks[16]?.visibility || 0);
            isLeftProfile = leftVisibility > rightVisibility;
        }
        
        if (isShoulderPress) {
            setActiveSide("detectando");
        } else {
            setActiveSide(isLeftProfile ? "izquierdo" : "derecho");
        }

        const shoulderIdx = isLeftProfile ? 11 : 12;
        const elbowIdx = isLeftProfile ? 13 : 14;
        const wristIdx = isLeftProfile ? 15 : 16;
        const hipIdx = isLeftProfile ? 23 : 24;
        const kneeIdx = isLeftProfile ? 25 : 26;
        const ankleIdx = isLeftProfile ? 27 : 28;

        const shoulder = landmarks[shoulderIdx];
        const elbow = landmarks[elbowIdx];
        const wrist = landmarks[wristIdx];
        const hip = landmarks[hipIdx];
        const knee = landmarks[kneeIdx];
        const ankle = landmarks[ankleIdx];

        const minVisibility = 0.45;

        const drawSkeletonSkeleton = (c: CanvasRenderingContext2D, lms: any[], w: number, h: number, color: string) => {
            c.save();
            c.strokeStyle = color;
            c.lineWidth = 2;
            c.lineCap = "round";
            const drawLine = (idxA: number, idxB: number) => {
                const ptA = lms[idxA];
                const ptB = lms[idxB];
                if (ptA && ptB) {
                    c.beginPath();
                    c.moveTo((1 - ptA.x) * w, ptA.y * h);
                    c.lineTo((1 - ptB.x) * w, ptB.y * h);
                    c.stroke();
                }
            };
            drawLine(11, 12); drawLine(11, 23); drawLine(12, 24); drawLine(23, 24);
            drawLine(11, 13); drawLine(13, 15); drawLine(12, 14); drawLine(14, 16);
            drawLine(23, 25); drawLine(25, 27); drawLine(24, 26); drawLine(26, 28);
            c.restore();
        };

        const drawBone = (ptA: any, ptB: any, color: string, widthVal: number, blurVal = 0, shadowCol = "") => {
            ctx.save();
            ctx.lineCap = "round";
            if (blurVal > 0) {
                ctx.shadowBlur = blurVal;
                ctx.shadowColor = shadowCol;
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = widthVal;
            ctx.beginPath();
            ctx.moveTo((1 - ptA.x) * width, ptA.y * height);
            ctx.lineTo((1 - ptB.x) * width, ptB.y * height);
            ctx.stroke();
            ctx.restore();
        };

        const drawJoint = (pt: any, color: string, radius = 8) => {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc((1 - pt.x) * width, pt.y * height, radius, 0, 2 * Math.PI);
            ctx.fill();
        };

        if (isSquat) {
            if (!hip || !knee || !ankle || hip.visibility < minVisibility || knee.visibility < minVisibility || ankle.visibility < minVisibility) {
                setFeedbackMsg("Aléjate un poco más para ver tus piernas");
                drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.2)");
                return;
            }

            const angle = calculate2DAngle(hip, knee, ankle);
            setKneeAngle(angle);

            if (angle > 165) {
                if (hasReachedDepthRef.current) {
                    repsCountRef.current += 1;
                    setRepsCount(repsCountRef.current);
                    playBeep();
                    hasReachedDepthRef.current = false;
                    wasBendingRef.current = false;
                    setFeedbackMsg("¡Sentadilla correcta!");
                    
                    if (repsCountRef.current >= (activeBlock?.reps || 10)) {
                        finishSet();
                        return;
                    }
                } else if (wasBendingRef.current) {
                    playWarningBeep();
                    setFeedbackMsg("¡Sentadilla incompleta!");
                    wasBendingRef.current = false;
                }
                isReadyToStartRef.current = true;
                setInstructionMsg("Flexiona tus piernas para la sentadilla");
            } else if (angle <= 95) {
                if (isReadyToStartRef.current) {
                    if (!hasReachedDepthRef.current) {
                        playDepthBeep();
                    }
                    hasReachedDepthRef.current = true;
                    wasBendingRef.current = true;
                    setFeedbackMsg("¡Profundidad lograda! Ahora sube.");
                    setInstructionMsg("Regresa a la posición inicial erguido");
                }
            } else if (angle < 135) {
                if (isReadyToStartRef.current) {
                    wasBendingRef.current = true;
                    if (!hasReachedDepthRef.current) {
                        setFeedbackMsg("¡Baja un poco más!");
                        setInstructionMsg("Flexiona un poco más profundo...");
                    }
                }
            }

            let jointColor = "rgba(239, 68, 68, 0.85)";
            if (angle <= 95 || hasReachedDepthRef.current) {
                jointColor = "rgba(34, 197, 94, 0.9)";
            } else if (angle < 135) {
                jointColor = "rgba(250, 204, 21, 0.85)";
            }

            drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.15)");
            
            const isCorrectDepth = angle <= 95 || hasReachedDepthRef.current;
            if (isCorrectDepth) {
                drawBone(hip, knee, "rgba(74, 222, 128, 0.25)", 18, 30, "rgba(34, 197, 94, 0.9)");
                drawBone(knee, ankle, "rgba(74, 222, 128, 0.25)", 18, 30, "rgba(34, 197, 94, 0.9)");
                drawBone(hip, knee, "rgba(34, 197, 94, 0.85)", 9, 15, "rgba(34, 197, 94, 0.9)");
                drawBone(knee, ankle, "rgba(34, 197, 94, 0.85)", 9, 15, "rgba(34, 197, 94, 0.9)");
                drawBone(hip, knee, "#ffffff", 3, 6, "#ffffff");
                drawBone(knee, ankle, "#ffffff", 3, 6, "#ffffff");
            } else {
                drawBone(hip, knee, jointColor, 6, 12, jointColor);
                drawBone(knee, ankle, jointColor, 6, 12, jointColor);
            }

            drawJoint(hip, "rgba(255,255,255,0.9)", 5);
            drawJoint(ankle, "rgba(255,255,255,0.9)", 5);
            drawJoint(knee, jointColor, 10);
            drawJoint(knee, "#ffffff", 5);

            ctx.shadowBlur = 4;
            ctx.shadowColor = "black";
            ctx.font = "bold 15px monospace";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(`${angle}°`, (1 - knee.x) * width + 15, knee.y * height + 5);

        } else if (isBicepCurl) {
            if (!shoulder || !elbow || !wrist || !hip || shoulder.visibility < minVisibility || elbow.visibility < minVisibility || wrist.visibility < minVisibility || hip.visibility < minVisibility) {
                setFeedbackMsg("Aléjate un poco más para ver tu torso y brazo");
                drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.2)");
                return;
            }

            const angle = calculate2DAngle(shoulder, elbow, wrist);
            setElbowAngle(angle);

            // Calculate back angle and elbow drift
            let backAngle = 0;
            const vecHS = { x: shoulder.x - hip.x, y: shoulder.y - hip.y };
            const lenHS = Math.sqrt(vecHS.x * vecHS.x + vecHS.y * vecHS.y);
            if (lenHS > 0) {
                const cosTheta = -vecHS.y / lenHS;
                backAngle = Math.round(Math.acos(Math.min(1, Math.max(-1, cosTheta))) * (180 / Math.PI));
            }

            let upperArmAngle = 0;
            const vecSE = { x: elbow.x - shoulder.x, y: elbow.y - shoulder.y };
            const lenSE = Math.sqrt(vecSE.x * vecSE.x + vecSE.y * vecSE.y);
            if (lenSE > 0) {
                const cosTheta = vecSE.y / lenSE;
                upperArmAngle = Math.round(Math.acos(Math.min(1, Math.max(-1, cosTheta))) * (180 / Math.PI));
            }

            const isBackGood = backAngle <= 15;
            const isElbowGood = upperArmAngle <= 25;

            if (angle > 155) {
                if (hasReachedDepthRef.current) {
                    repsCountRef.current += 1;
                    setRepsCount(repsCountRef.current);
                    playBeep();
                    hasReachedDepthRef.current = false;
                    wasBendingRef.current = false;
                    setFeedbackMsg("¡Repetición correcta!");
                    
                    if (repsCountRef.current >= (activeBlock?.reps || 10)) {
                        finishSet();
                        return;
                    }
                } else if (wasBendingRef.current) {
                    playWarningBeep();
                    setFeedbackMsg("¡Curl incompleto! Flexiona más.");
                    wasBendingRef.current = false;
                }
                isReadyToStartRef.current = true;
                setInstructionMsg("Flexiona el brazo para realizar el curl");
            } else if (angle <= 55) {
                if (isReadyToStartRef.current) {
                    if (!isBackGood) {
                        if (hasReachedDepthRef.current) playWarningBeep();
                        hasReachedDepthRef.current = false;
                        setFeedbackMsg("¡No te balancees! Espalda recta");
                        setInstructionMsg("Evita balancear el torso");
                    } else if (!isElbowGood) {
                        if (hasReachedDepthRef.current) playWarningBeep();
                        hasReachedDepthRef.current = false;
                        setFeedbackMsg("¡Codo suelto! Pégalo al cuerpo");
                        setInstructionMsg("Mantén el codo fijo");
                    } else {
                        if (!hasReachedDepthRef.current) {
                            playDepthBeep();
                        }
                        hasReachedDepthRef.current = true;
                        wasBendingRef.current = true;
                        setFeedbackMsg("¡Contracción máxima! Baja lento.");
                        setInstructionMsg("Estira el brazo de forma controlada");
                    }
                }
            } else if (angle < 135) {
                if (isReadyToStartRef.current) {
                    if (!isBackGood) {
                        hasReachedDepthRef.current = false;
                        setFeedbackMsg("¡No te balancees! Espalda recta");
                    } else if (!isElbowGood) {
                        hasReachedDepthRef.current = false;
                        setFeedbackMsg("¡Codo suelto! Mantén el codo fijo");
                    } else {
                        wasBendingRef.current = true;
                        if (!hasReachedDepthRef.current) {
                            setFeedbackMsg("¡Sube un poco más!");
                            setInstructionMsg("Flexiona hacia el hombro...");
                        }
                    }
                }
            }

            let armColor = "rgba(239, 68, 68, 0.85)";
            if (angle <= 55 || hasReachedDepthRef.current) {
                armColor = "rgba(34, 197, 94, 0.9)";
            } else if (angle < 135) {
                armColor = "rgba(250, 204, 21, 0.85)";
            }

            drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.15)");
            
            const isPeak = angle <= 55 || hasReachedDepthRef.current;
            if (isPeak) {
                drawBone(shoulder, elbow, "rgba(74, 222, 128, 0.4)", 12, 20, "rgba(34, 197, 94, 0.9)");
                drawBone(elbow, wrist, "rgba(74, 222, 128, 0.4)", 12, 20, "rgba(34, 197, 94, 0.9)");
                drawBone(shoulder, elbow, "#ffffff", 4, 6, "#ffffff");
                drawBone(elbow, wrist, "#ffffff", 4, 6, "#ffffff");
            } else {
                drawBone(shoulder, elbow, armColor, 6, 10, armColor);
                drawBone(elbow, wrist, armColor, 6, 10, armColor);
            }

            drawJoint(shoulder, "rgba(255,255,255,0.9)", 5);
            drawJoint(wrist, "rgba(255,255,255,0.9)", 5);
            drawJoint(elbow, armColor, 10);
            drawJoint(elbow, "#ffffff", 5);

            ctx.shadowBlur = 4;
            ctx.shadowColor = "black";
            ctx.font = "bold 15px monospace";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(`${angle}°`, (1 - elbow.x) * width + 15, elbow.y * height + 5);

            // Draw back posture line
            ctx.save();
            ctx.lineCap = "round";
            ctx.shadowBlur = 15;
            if (isBackGood) {
                ctx.strokeStyle = "rgba(6, 182, 212, 0.8)";
                ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
                ctx.lineWidth = 5;
            } else {
                ctx.strokeStyle = "rgba(239, 68, 68, 0.9)";
                ctx.shadowColor = "rgba(239, 68, 68, 0.9)";
                ctx.lineWidth = 8;
            }
            ctx.beginPath();
            ctx.moveTo((1 - hip.x) * width, hip.y * height);
            ctx.lineTo((1 - shoulder.x) * width, shoulder.y * height);
            ctx.stroke();
            ctx.font = "bold 12px monospace";
            ctx.fillStyle = isBackGood ? "#22c55e" : "#ef4444";
            ctx.fillText(`Espalda: ${backAngle}°`, (1 - (hip.x + shoulder.x) / 2) * width + 15, ((hip.y + shoulder.y) / 2) * height - 10);

            if (!isElbowGood) {
                ctx.strokeStyle = "rgba(249, 115, 22, 0.9)";
                ctx.shadowColor = "rgba(249, 115, 22, 0.9)";
                ctx.lineWidth = 7;
                ctx.beginPath();
                ctx.moveTo((1 - shoulder.x) * width, shoulder.y * height);
                ctx.lineTo((1 - elbow.x) * width, elbow.y * height);
                ctx.stroke();
                ctx.fillStyle = "#f97316";
                ctx.fillText(`Desv. Codo: ${upperArmAngle}°`, (1 - (shoulder.x + elbow.x) / 2) * width - 120, ((shoulder.y + elbow.y) / 2) * height + 15);
            }
            ctx.restore();

        } else if (isShoulderPress) {
            const s_L = landmarks[11];
            const e_L = landmarks[13];
            const w_L = landmarks[15];
            const s_R = landmarks[12];
            const e_R = landmarks[14];
            const w_R = landmarks[16];

            if (
                !s_L || !e_L || !w_L || !s_R || !e_R || !w_R ||
                s_L.visibility < minVisibility || e_L.visibility < minVisibility || w_L.visibility < minVisibility ||
                s_R.visibility < minVisibility || e_R.visibility < minVisibility || w_R.visibility < minVisibility
            ) {
                setFeedbackMsg("Aléjate un poco más para enfocar tus hombros y brazos");
                drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.2)");
                return;
            }

            const angleL = calculate2DAngle(s_L, e_L, w_L);
            const angleR = calculate2DAngle(s_R, e_R, w_R);
            setElbowAngle(Math.min(angleL, angleR));

            const diffY = Math.abs(s_L.y - s_R.y);
            const asymmetryPercentage = Math.round(diffY * 100);
            
            const driftL = Math.abs(w_L.x - e_L.x);
            const driftR = Math.abs(w_R.x - e_R.x);
            const maxDrift = Math.max(driftL, driftR);

            const isSymmetrical = asymmetryPercentage <= 5;
            const isForearmVertical = maxDrift <= 0.08;

            if (angleL <= 90 && angleR <= 90) {
                if (hasReachedDepthRef.current) {
                    repsCountRef.current += 1;
                    setRepsCount(repsCountRef.current);
                    playBeep();
                    hasReachedDepthRef.current = false;
                    wasBendingRef.current = false;
                    setFeedbackMsg("¡Repetición correcta!");
                    
                    if (repsCountRef.current >= (activeBlock?.reps || 10)) {
                        finishSet();
                        return;
                    }
                } else if (wasBendingRef.current) {
                    playWarningBeep();
                    setFeedbackMsg("¡Rango incompleto! Empuja hacia arriba.");
                    wasBendingRef.current = false;
                }
                isReadyToStartRef.current = true;
                setInstructionMsg("Empuja las mancuernas sobre tu cabeza");
            } else if (angleL >= 160 && angleR >= 160) {
                if (isReadyToStartRef.current) {
                    if (!isSymmetrical) {
                        if (hasReachedDepthRef.current) playWarningBeep();
                        hasReachedDepthRef.current = false;
                        setFeedbackMsg("¡Empuje asimétrico! Empuja parejo");
                        setInstructionMsg("Alinea la fuerza en ambos hombros");
                    } else if (!isForearmVertical) {
                        if (hasReachedDepthRef.current) playWarningBeep();
                        hasReachedDepthRef.current = false;
                        setFeedbackMsg("¡Alinea tus antebrazos! Mantenlos verticales");
                        setInstructionMsg("Evita abrir o cerrar los brazos");
                    } else {
                        if (!hasReachedDepthRef.current) {
                            playDepthBeep();
                        }
                        hasReachedDepthRef.current = true;
                        wasBendingRef.current = true;
                        setFeedbackMsg("¡Extensión máxima! Baja lento.");
                        setInstructionMsg("Regresa los codos a la altura de tus orejas");
                    }
                }
            } else if (angleL > 110 || angleR > 110) {
                if (isReadyToStartRef.current) {
                    if (!isSymmetrical) {
                        hasReachedDepthRef.current = false;
                        setFeedbackMsg("¡Corrige simetría de hombros!");
                    } else if (!isForearmVertical) {
                        hasReachedDepthRef.current = false;
                        setFeedbackMsg("¡Antebrazos inclinados! Mantenlos verticales");
                    } else {
                        wasBendingRef.current = true;
                        if (!hasReachedDepthRef.current) {
                            setFeedbackMsg("¡Sigue empujando hacia arriba!");
                            setInstructionMsg("Estira tus brazos por completo...");
                        }
                    }
                }
            }

            drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.15)");
            
            const isPeak = (angleL >= 160 && angleR >= 160) || hasReachedDepthRef.current;
            const activeColorL = angleL >= 160 || hasReachedDepthRef.current ? "rgba(34, 197, 94, 0.9)" : angleL > 110 ? "rgba(250, 204, 21, 0.85)" : "rgba(239, 68, 68, 0.85)";
            const activeColorR = angleR >= 160 || hasReachedDepthRef.current ? "rgba(34, 197, 94, 0.9)" : angleR > 110 ? "rgba(250, 204, 21, 0.85)" : "rgba(239, 68, 68, 0.85)";

            if (isPeak) {
                drawBone(s_L, e_L, "rgba(74, 222, 128, 0.4)", 12, 20, "rgba(34, 197, 94, 0.9)");
                drawBone(e_L, w_L, "rgba(74, 222, 128, 0.4)", 12, 20, "rgba(34, 197, 94, 0.9)");
                drawBone(s_R, e_R, "rgba(74, 222, 128, 0.4)", 12, 20, "rgba(34, 197, 94, 0.9)");
                drawBone(e_R, w_R, "rgba(74, 222, 128, 0.4)", 12, 20, "rgba(34, 197, 94, 0.9)");
                
                drawBone(s_L, e_L, "#ffffff", 4, 6, "#ffffff");
                drawBone(e_L, w_L, "#ffffff", 4, 6, "#ffffff");
                drawBone(s_R, e_R, "#ffffff", 4, 6, "#ffffff");
                drawBone(e_R, w_R, "#ffffff", 4, 6, "#ffffff");
            } else {
                drawBone(s_L, e_L, activeColorL, 6, 10, activeColorL);
                drawBone(e_L, w_L, activeColorL, 6, 10, activeColorL);
                drawBone(s_R, e_R, activeColorR, 6, 10, activeColorR);
                drawBone(e_R, w_R, activeColorR, 6, 10, activeColorR);
            }

            drawJoint(s_L, "rgba(255,255,255,0.9)", 5);
            drawJoint(w_L, "rgba(255,255,255,0.9)", 5);
            drawJoint(e_L, activeColorL, 10);
            drawJoint(e_L, "#ffffff", 5);

            drawJoint(s_R, "rgba(255,255,255,0.9)", 5);
            drawJoint(w_R, "rgba(255,255,255,0.9)", 5);
            drawJoint(e_R, activeColorR, 10);
            drawJoint(e_R, "#ffffff", 5);

            ctx.shadowBlur = 4;
            ctx.shadowColor = "black";
            ctx.font = "bold 15px monospace";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(`${angleL}°`, (1 - e_L.x) * width - 50, e_L.y * height + 5);
            ctx.fillText(`${angleR}°`, (1 - e_R.x) * width + 15, e_R.y * height + 5);

            ctx.save();
            ctx.lineCap = "round";
            ctx.shadowBlur = 10;
            if (isSymmetrical) {
                ctx.strokeStyle = "rgba(6, 182, 212, 0.8)";
                ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
                ctx.lineWidth = 4;
            } else {
                ctx.strokeStyle = "rgba(239, 68, 68, 0.9)";
                ctx.shadowColor = "rgba(239, 68, 68, 0.9)";
                ctx.lineWidth = 7;
            }
            ctx.beginPath();
            ctx.moveTo((1 - s_L.x) * width, s_L.y * height);
            ctx.lineTo((1 - s_R.x) * width, s_R.y * height);
            ctx.stroke();
            ctx.font = "bold 11px monospace";
            ctx.fillStyle = isSymmetrical ? "#22c55e" : "#ef4444";
            ctx.fillText(`Desv. Hombros: ${asymmetryPercentage}%`, (1 - (s_L.x + s_R.x) / 2) * width - 60, s_L.y * height - 15);

            if (!isForearmVertical) {
                ctx.strokeStyle = "rgba(249, 115, 22, 0.8)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo((1 - e_L.x) * width, e_L.y * height);
                ctx.lineTo((1 - e_L.x) * width, w_L.y * height);
                ctx.moveTo((1 - e_R.x) * width, e_R.y * height);
                ctx.lineTo((1 - e_R.x) * width, w_R.y * height);
                ctx.stroke();
            }
            ctx.restore();

        } else if (isPushup) {
            if (!shoulder || !elbow || !wrist || !hip || shoulder.visibility < minVisibility || elbow.visibility < minVisibility || wrist.visibility < minVisibility || hip.visibility < minVisibility) {
                setFeedbackMsg("Aléjate un poco más para captar tus brazos y cadera");
                drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.2)");
                return;
            }

            const angle = calculate2DAngle(shoulder, elbow, wrist);
            setElbowAngle(angle);

            let isCorrectPosture = true;
            let postureFeedback = "";
            const dx = Math.abs(shoulder.x - hip.x);
            const dy = Math.abs(shoulder.y - hip.y);
            if (dx + dy > 0.02) {
                const torsoInclination = Math.atan2(dy, dx) * (180 / Math.PI);
                if (torsoInclination > 40) {
                    isCorrectPosture = false;
                    postureFeedback = "Alinea tu espalda paralela al suelo.";
                }
            }
            if (wrist.y < shoulder.y) {
                isCorrectPosture = false;
                postureFeedback = "Posición incorrecta. Manos sobre los hombros.";
            }

            if (!isCorrectPosture) {
                setFeedbackMsg(postureFeedback || "Colócate en posición de plancha.");
                setInstructionMsg("Tu espalda debe estar paralela al suelo");
                hasReachedDepthRef.current = false;
                wasBendingRef.current = false;
                isReadyToStartRef.current = false;
            } else {
                if (angle > 160) {
                    if (hasReachedDepthRef.current) {
                        repsCountRef.current += 1;
                        setRepsCount(repsCountRef.current);
                        playBeep();
                        hasReachedDepthRef.current = false;
                        wasBendingRef.current = false;
                        setFeedbackMsg("¡Push up correcto!");

                        if (repsCountRef.current >= (activeBlock?.reps || 10)) {
                            finishSet();
                            return;
                        }
                    } else if (wasBendingRef.current) {
                        playWarningBeep();
                        setFeedbackMsg("¡Flexión incompleta!");
                        wasBendingRef.current = false;
                    }
                    isReadyToStartRef.current = true;
                    setInstructionMsg("Flexiona los brazos para descender");
                } else if (angle <= 95) {
                    if (isReadyToStartRef.current) {
                        if (!hasReachedDepthRef.current) {
                            playDepthBeep();
                        }
                        hasReachedDepthRef.current = true;
                        wasBendingRef.current = true;
                        setFeedbackMsg("¡Profundidad lograda! Ahora sube.");
                        setInstructionMsg("Estira tus brazos por completo");
                    }
                } else if (angle < 135) {
                    if (isReadyToStartRef.current) {
                        wasBendingRef.current = true;
                        if (!hasReachedDepthRef.current) {
                            setFeedbackMsg("¡Baja un poco más!");
                            setInstructionMsg("Aproxima el pecho al suelo...");
                        }
                    }
                }
            }

            let jointColor = "rgba(239, 68, 68, 0.85)";
            if (angle <= 95 || hasReachedDepthRef.current) {
                jointColor = "rgba(34, 197, 94, 0.9)";
            } else if (angle < 135) {
                jointColor = "rgba(250, 204, 21, 0.85)";
            }

            drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.15)");
            
            const isCorrectDepth = angle <= 95 || hasReachedDepthRef.current;
            if (isCorrectDepth && isCorrectPosture) {
                drawBone(shoulder, elbow, "rgba(74, 222, 128, 0.25)", 18, 30, "rgba(34, 197, 94, 0.9)");
                drawBone(elbow, wrist, "rgba(74, 222, 128, 0.25)", 18, 30, "rgba(34, 197, 94, 0.9)");
                drawBone(shoulder, elbow, "rgba(34, 197, 94, 0.85)", 9, 15, "rgba(34, 197, 94, 0.9)");
                drawBone(elbow, wrist, "rgba(34, 197, 94, 0.85)", 9, 15, "rgba(34, 197, 94, 0.9)");
                drawBone(shoulder, elbow, "#ffffff", 3, 6, "#ffffff");
                drawBone(elbow, wrist, "#ffffff", 3, 6, "#ffffff");
            } else {
                drawBone(shoulder, elbow, jointColor, 6, 12, jointColor);
                drawBone(elbow, wrist, jointColor, 6, 12, jointColor);
            }

            drawJoint(shoulder, "rgba(255,255,255,0.9)", 5);
            drawJoint(wrist, "rgba(255,255,255,0.9)", 5);
            drawJoint(elbow, jointColor, 10);
            drawJoint(elbow, "#ffffff", 5);

            ctx.shadowBlur = 4;
            ctx.shadowColor = "black";
            ctx.font = "bold 15px monospace";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(`${angle}°`, (1 - elbow.x) * width + 15, elbow.y * height + 5);

        } else if (isBurpee) {
            if (!shoulder || !elbow || !wrist || !hip || !knee || !ankle || 
                shoulder.visibility < minVisibility || elbow.visibility < minVisibility || wrist.visibility < minVisibility || 
                hip.visibility < minVisibility || knee.visibility < minVisibility || ankle.visibility < minVisibility) {
                setFeedbackMsg("Aléjate más para captar tu cuerpo completo");
                drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.2)");
                return;
            }

            const currentElbowAngle = calculate2DAngle(shoulder, elbow, wrist);
            setElbowAngle(currentElbowAngle);

            const dx = Math.abs(shoulder.x - hip.x);
            const dy = Math.abs(shoulder.y - hip.y);
            const currentTorsoAngle = Math.round(Math.atan2(dy, dx) * (180 / Math.PI));
            setTorsoAngle(currentTorsoAngle);

            if (!hasReachedBottomRef.current) {
                const isPlank = currentTorsoAngle < 40;
                const isElbowBent = currentElbowAngle <= 105;
                if (isPlank && isElbowBent) {
                    hasReachedBottomRef.current = true;
                    setHasReachedBottom(true);
                    playDepthBeep();
                    setFeedbackMsg("¡Pecho abajo! Levántate y salta.");
                    setInstructionMsg("Regresa de pie y salta estirando los brazos");
                } else {
                    setFeedbackMsg("Baja al suelo en posición de flexión");
                    setInstructionMsg("Pecho al suelo...");
                }
            } else {
                const isUpright = currentTorsoAngle > 60;
                const isHandsRaised = wrist.y < shoulder.y;
                if (isUpright && isHandsRaised) {
                    repsCountRef.current += 1;
                    setRepsCount(repsCountRef.current);
                    playBeep();
                    hasReachedBottomRef.current = false;
                    setHasReachedBottom(false);
                    setFeedbackMsg("¡Burpee correcto!");
                    setInstructionMsg("Baja al suelo para el siguiente burpee");

                    if (repsCountRef.current >= (activeBlock?.reps || 10)) {
                        finishSet();
                        return;
                    }
                }
            }

            let jointColor = "rgba(239, 68, 68, 0.85)";
            if (hasReachedBottomRef.current) {
                jointColor = "rgba(34, 197, 94, 0.9)";
            } else if (currentTorsoAngle < 45) {
                jointColor = "rgba(250, 204, 21, 0.85)";
            }

            drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.15)");

            if (hasReachedBottomRef.current) {
                drawBone(shoulder, elbow, "rgba(74, 222, 128, 0.25)", 18, 30, "rgba(34, 197, 94, 0.9)");
                drawBone(elbow, wrist, "rgba(74, 222, 128, 0.25)", 18, 30, "rgba(34, 197, 94, 0.9)");
                drawBone(shoulder, hip, "rgba(74, 222, 128, 0.25)", 18, 30, "rgba(34, 197, 94, 0.9)");
                drawBone(hip, knee, "rgba(74, 222, 128, 0.25)", 18, 30, "rgba(34, 197, 94, 0.9)");
                drawBone(knee, ankle, "rgba(74, 222, 128, 0.25)", 18, 30, "rgba(34, 197, 94, 0.9)");

                drawBone(shoulder, elbow, "rgba(34, 197, 94, 0.85)", 9, 15, "rgba(34, 197, 94, 0.9)");
                drawBone(elbow, wrist, "rgba(34, 197, 94, 0.85)", 9, 15, "rgba(34, 197, 94, 0.9)");
                drawBone(shoulder, hip, "rgba(34, 197, 94, 0.85)", 9, 15, "rgba(34, 197, 94, 0.9)");
                drawBone(hip, knee, "rgba(34, 197, 94, 0.85)", 9, 15, "rgba(34, 197, 94, 0.9)");
                drawBone(knee, ankle, "rgba(34, 197, 94, 0.85)", 9, 15, "rgba(34, 197, 94, 0.9)");

                drawBone(shoulder, elbow, "#ffffff", 3, 6, "#ffffff");
                drawBone(elbow, wrist, "#ffffff", 3, 6, "#ffffff");
                drawBone(shoulder, hip, "#ffffff", 3, 6, "#ffffff");
                drawBone(hip, knee, "#ffffff", 3, 6, "#ffffff");
                drawBone(knee, ankle, "#ffffff", 3, 6, "#ffffff");
            } else {
                drawBone(shoulder, elbow, jointColor, 6, 12, jointColor);
                drawBone(elbow, wrist, jointColor, 6, 12, jointColor);
                drawBone(shoulder, hip, jointColor, 6, 12, jointColor);
                drawBone(hip, knee, jointColor, 6, 12, jointColor);
                drawBone(knee, ankle, jointColor, 6, 12, jointColor);
            }

            drawJoint(shoulder, "rgba(255,255,255,0.9)", 5);
            drawJoint(wrist, "rgba(255,255,255,0.9)", 5);
            drawJoint(hip, "rgba(255,255,255,0.9)", 5);
            drawJoint(ankle, "rgba(255,255,255,0.9)", 5);
            drawJoint(elbow, jointColor, 8);
            drawJoint(knee, jointColor, 8);
        }
    };

    // --- ACTIONS ---

    // --- ACTIONS ---
    const startRoutine = async () => {
        setStatus("active");
        setCurrentBlockIndex(0);
        setCurrentSet(1);
        setIsResting(false);
        setStartTime(Date.now());
        setStartTimeRef.current = Date.now();
        setFastSetCount(0);
        setCheatDetected(false);
        setLoopRepetitions({});

        // Calculate total sets including all loop cycles
        const total = getTotalSetsRecursive(routine.blocks);
        setTotalSets(total);
        setCompletedSets(0);

        // START LOGGING
        try {
            const res = await startRoutineLog(routine._id, routine.title, routine.estimated_duration);
            if (res.success && res.logId) {
                setCurrentLogId(res.logId);
            }
        } catch (error) {
            console.error("Failed to start routine log", error);
        }
    };

    const triggerImpact = () => {
        setImpact(true);
        setTimeout(() => setImpact(false), 300); // 300ms shake
    };

    const [hasShownOneHourReward, setHasShownOneHourReward] = useState(false);

    const finishSet = async () => {
        setIsTimerRunning(false); // Stop exercise timer if running
        vibrate(80); // Recommendation #4
        audioTrainer.playBeep();
        triggerImpact(); // TRIGGER VISUAL IMPACT

        // Fast Interaction Detection (Cheating protection)
        if (setStartTimeRef.current) {
            const setDuration = Date.now() - setStartTimeRef.current;
            if (setDuration < 4000) { // Less than 4 seconds is usually a skip
                setFastSetCount(prev => prev + 1);
            }
        }
        setStartTimeRef.current = Date.now();

        // Sync Progress to DB — handled reactively by the useEffect on [currentBlockIndex, currentSet, completedSets]
        // This ensures we always capture state AFTER nextStep() advances the position

        // Real-time Reward Check (> 1 hour in session)
        if (!hasShownOneHourReward && startTime) {
            const elapsedMs = Date.now() - startTime;
            if (elapsedMs >= 3600000) { // 60 minutes
                setHasShownOneHourReward(true);
                setAchievementQueue(prev => [...prev, {
                    name: "Espíritu Kuma",
                    description: "Has entrenado más de 1 hora en esta sesión. ¡Tu resistencia es legendaria!",
                    icon: "PawPrint",
                    color: "#dc2626",
                    rarity: "Mítico"
                }]);
            }
        }

        if (activeBlock.rest_seconds > 0 && currentSet < activeBlock.sets) {
            audioTrainer.speak("Descansa.");
            startRest();
        } else if (activeBlock.rest_seconds > 0 && currentSet === activeBlock.sets && currentBlockIndex < totalBlocks - 1) {
            const nextBlock = routine.blocks[currentBlockIndex + 1];
            if (nextBlock.type === "loop_end") {
                const loopCtx = getLoopContext();
                if (loopCtx && loopCtx.currentCycle < loopCtx.maxCycles) {
                    audioTrainer.speak(`Descansa. Prepárate para el ciclo ${loopCtx.currentCycle + 1}.`);
                } else {
                    audioTrainer.speak("Descansa. Siguiente ejercicio pronto.");
                }
            } else {
                audioTrainer.speak("Descansa. Siguiente ejercicio pronto.");
            }
            startRest();
        } else {
            nextStep();
        }
    };

    const startRest = () => {
        setTimeLeft(activeBlock.rest_seconds);
        setIsResting(true);
    };

    const finishRest = () => {
        setIsResting(false);
        nextStep();
    };

    const nextStep = () => {
        if (!activeBlock) return;

        // Reset set timer
        setStartTimeRef.current = Date.now();

        if (currentSet < activeBlock.sets) {
            setCurrentSet((prev) => prev + 1);
            setCompletedSets((prev) => prev + 1);
            audioTrainer.speak(`Set ${currentSet + 1}. Vamos.`);
        } else {
            // FINISHED ALL SETS OF CURRENT BLOCK
            setCompletedSets((prev) => prev + 1);
            const nextIdx = currentBlockIndex + 1;

            if (nextIdx < totalBlocks) {
                const nextBlock = routine.blocks[nextIdx];

                if (nextBlock.type === "loop_end") {
                    // Logic for loop_end: find corresponding loop_start
                    let depth = 1;
                    let startIdx = -1;
                    for (let i = nextIdx - 1; i >= 0; i--) {
                        if (routine.blocks[i].type === "loop_end") depth++;
                        if (routine.blocks[i].type === "loop_start") depth--;
                        if (depth === 0) {
                            startIdx = i;
                            break;
                        }
                    }

                    if (startIdx !== -1) {
                        const maxReps = routine.blocks[startIdx].loop_count || 1;
                        const currentReps = loopRepetitions[startIdx] || 1;

                        if (currentReps < maxReps) {
                            // Repeat loop
                            setLoopRepetitions(prev => ({ ...prev, [startIdx]: currentReps + 1 }));
                            setCurrentBlockIndex(startIdx + 1); // Jump to first exercise in loop
                            setCurrentSet(1);

                            const cycleMsg = `Iniciando ciclo ${currentReps + 1} de ${maxReps}.`;
                            audioTrainer.speak(cycleMsg);
                            return;
                        } else {
                            // Loop finished, continue to whatever is after loop_end
                            // But first we must move currentBlockIndex to nextIdx (the loop_end)
                            // then call nextStep recursively or just proceed
                            setCurrentBlockIndex(nextIdx);
                            setCurrentSet(1);
                            // To skip the loop_end marker immediately:
                            // The useEffect on currentBlockIndex will handle skipping loop_end
                            return;
                        }
                    }
                }

                setCurrentBlockIndex(nextIdx);
                setCurrentSet(1);
                if (nextBlock.type === "exercise" || !nextBlock.type) {
                    audioTrainer.speak(`Siguiente ejercicio: ${nextBlock.exercise_name}. ${nextBlock.sets} sets de ${nextBlock.reps} ${nextBlock.measure_type === 'time' ? 'segundos' : 'repeticiones'}. Prepárate.`);
                }
            } else {
                completeRoutine();
            }
        }
    };



    // ...

    const [achievementQueue, setAchievementQueue] = useState<any[]>([]);
    const [currentAchievement, setCurrentAchievement] = useState<any | null>(null);

    // Watch queue to show achievements one by one
    useEffect(() => {
        if (achievementQueue.length > 0 && !showTrophy) {
            setCurrentAchievement(achievementQueue[0]);
            setShowTrophy(true);
            audioTrainer.playWin();
        }
    }, [achievementQueue, showTrophy]);

    const completeRoutine = async () => {
        setIsFinishing(true);
        try {
            const endTime = Date.now();
            const durationMs = startTime ? (endTime - startTime) : 0;
            const durationMinutes = Math.max(1, Math.floor(durationMs / 60000));
            const durationSeconds = Math.round(durationMs / 1000);

            // 1. Anti-cheat validation (Granular & Global)
            // Stricter condition: Less than 30% of estimated duration OR too many fast sets (cheated sets)
            const isCheated = (durationMinutes < routine.estimated_duration * 0.3) || (fastSetCount > (totalSets * 0.5));

            if (isCheated) {
                console.log(`[CheatDetection] Routine: ${routine.title}, Duration: ${durationMinutes}m, FastSets: ${fastSetCount}/${totalSets}`);
                // If cheated, we don't complete the log, we DELETE it (removes trace)
                if (currentLogId) {
                    const { deleteRoutineLog } = await import("@/lib/actions/routine-logs");
                    await deleteRoutineLog(currentLogId);
                }

                setCheatDetected(true);
                audioTrainer.speak("Oso oso mentiroso. Detectamos que saltaste la rutina.");
                return;
            }

            // 2. COMPLETE LOG IF VALID
            if (currentLogId) {
                const { completeRoutineLog } = await import("@/lib/actions/routine-logs");
                await completeRoutineLog(currentLogId, durationSeconds);
            }

            // 3. Call Progress API (XP/Achievements)
            const res = await fetch("/api/workouts/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    routineId: routine._id,
                    duration: durationMinutes,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                })
            });

            const data = await res.json();

            if (data.newAchievements && data.newAchievements.length > 0) {
                const achievements = data.newAchievements
                    .map((item: any) => item.trophy)
                    .filter((t: any) => !(t.name === "Espíritu Kuma" && hasShownOneHourReward));

                if (achievements.length > 0) {
                    setAchievementQueue(prev => [...prev, ...achievements]);
                } else {
                    setStatus("completed");
                }
            } else {
                setStatus("completed");
                vibrate([100, 50, 100, 50, 300]); // Success pattern
                audioTrainer.playWin();
                setTimeout(() => audioTrainer.speak("¡Osu! Gran trabajo."), 1000); // Recommendation #10
                audioTrainer.speak("¡Rutina completada! Excelente trabajo.");
                triggerConfetti();
            }
        } catch (error) {
            console.error("Error saving progress:", error);
            setStatus("completed");
            triggerConfetti();
        }
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    // --- RENDERERS ---

    // 1. INTRO
    if (status === "intro") {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black z-0" />
                <div className="absolute top-0 left-0 w-full h-1/2 bg-kuma-gold/5 blur-[120px] rounded-full z-0 pointer-events-none" />



                <div className="relative z-10 flex-1 flex flex-col p-6 items-center justify-center max-w-md mx-auto w-full lg:max-w-4xl lg:flex-row lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full flex justify-between items-center mb-12 lg:absolute lg:top-8 lg:left-8 lg:w-auto lg:mb-0"
                    >
                        <Link href="/routines">
                            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md">
                                <X className="w-5 h-5" weight="bold" />
                            </button>
                        </Link>
                    </motion.div>

                    <div className="text-center space-y-8 w-full lg:text-left lg:flex-1">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: [0, -15, 0] // Intro float
                            }}
                            transition={{
                                type: "spring", bounce: 0.5,
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="w-32 h-32 mx-auto lg:mx-0 bg-gradient-to-tr from-kuma-gold to-yellow-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(234,179,8,0.3)] mb-8"
                        >
                            <Barbell className="w-14 h-14 text-black" weight="duotone" />
                        </motion.div>

                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl lg:text-6xl font-black text-white mb-3 tracking-tight"
                            >
                                {routine.title}
                            </motion.h1>
                            <p className="text-zinc-400 font-medium leading-relaxed lg:text-lg lg:max-w-xl">
                                {routine.description}
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:w-fit"
                        >
                            <div className="text-left">
                                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Duración</span>
                                <div className="text-xl text-white font-bold">{routine.estimated_duration} min</div>
                            </div>
                            <div className="text-left">
                                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Ejercicios</span>
                                <div className="text-xl text-white font-bold">{routine.blocks.length}</div>
                            </div>
                            <div className="text-left col-span-2 lg:col-span-1">
                                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Nivel</span>
                                <div className="text-xl text-kuma-gold font-bold">{routine.difficulty}</div>
                            </div>
                        </motion.div>

                        <div className="hidden lg:block pt-8">
                            <button
                                onClick={startRoutine}
                                className="group relative w-64 h-16 bg-white text-black rounded-[2rem] font-black text-lg tracking-wider uppercase overflow-hidden transition-transform active:scale-95 shadow-xl shadow-white/5"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <PlayCircle className="w-6 h-6 fill-black" weight="duotone" /> Iniciar Sesión
                                </span>
                                <div className="absolute inset-0 bg-kuma-gold opacity-0 group-hover:opacity-10 transition-opacity" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 lg:hidden" />

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="w-full pt-8 pb-4 lg:hidden"
                    >
                        <button
                            onClick={startRoutine}
                            className="group relative w-full h-16 bg-white text-black rounded-[2rem] font-black text-lg tracking-wider uppercase overflow-hidden transition-transform active:scale-95 shadow-xl shadow-white/5"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <PlayCircle className="w-6 h-6 fill-black" weight="duotone" /> Iniciar Sesión
                            </span>
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // 2. COMPLETED
    if (status === "completed") {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black" />
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 text-center w-full max-w-md"
                >
                    <div className="w-40 h-40 mx-auto relative mb-8">
                        <motion.img
                            src="/images/kuma-logro-primer-entreno.jpg"
                            className="w-full h-full object-cover rounded-full border-4 border-kuma-gold shadow-[0_0_50px_rgba(234,179,8,0.5)]"
                            initial={{ rotate: -10, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                        />
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-kuma-gold rounded-full flex items-center justify-center shadow-lg border-4 border-black">
                            <Trophy className="w-8 h-8 text-black" weight="duotone" />
                        </div>
                    </div>
                    <h2 className="text-5xl font-black text-white italic tracking-tighter mb-4">¡VICTORIA!</h2>
                    <p className="text-zinc-400 text-lg mb-2">Rutina completada con éxito.</p>
                    {startTime && (
                        <div className="text-kuma-gold font-mono font-bold text-xl mb-12">
                            Tiempo Total: {Math.max(1, Math.round((Date.now() - startTime) / 60000))} min
                        </div>
                    )}
                    <Link href="/routines" className="block w-full">
                        <button className="w-full h-16 bg-zinc-800 text-white rounded-[2rem] font-bold text-lg tracking-wider hover:bg-zinc-700 transition-colors">Volver al Dojo</button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    // 3. CHEAT DETECTED
    if (cheatDetected) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black opacity-80" />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 text-center w-full max-w-lg bg-zinc-950 border border-red-500/20 p-8 rounded-[2rem] shadow-2xl"
                >
                    <div className="w-full aspect-square max-w-[320px] mx-auto mb-8 relative">
                        <img
                            src="/images/kuma-logro-primer-trampa.jpg"
                            alt="Logro Trampa"
                            className="w-full h-full object-cover rounded-2xl border-4 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)]"
                        />
                        <div className="absolute -top-6 -right-6 bg-red-600 text-white p-4 rounded-full shadow-lg border-4 border-zinc-950">
                            <WarningCircle size={40} weight="fill" />
                        </div>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-red-500 uppercase tracking-tighter mb-4 italic leading-none drop-shadow-lg">¡TE CACHAMOS!</h2>
                    <p className="text-zinc-200 text-xl md:text-2xl font-bold mb-8 leading-tight">
                        "Tu saltaste esta rutina, tienes la oportunidad de entrenar realmente durante el día. Si a las 12 media noche no has hecho entreno, perderás la racha. Oso oso mentiroso"
                    </p>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={startRoutine}
                            className="w-full h-16 bg-white text-black rounded-[2rem] font-bold text-lg tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowCounterClockwise className="w-6 h-6" weight="bold" />
                            Reintentar Honestamente
                        </button>
                        <Link href="/routines" className="block w-full">
                            <button className="w-full h-14 bg-zinc-900 text-zinc-500 rounded-[2rem] font-bold text-sm tracking-widest hover:text-white transition-colors">
                                Volver al Menú
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // 4. ACTIVE ROUTINE
    const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

    // Helper to find if a block is inside a loop
    const getLoopContext = () => {
        let depth = 0;
        let startIdx = -1;
        for (let i = currentBlockIndex; i >= 0; i--) {
            if (routine.blocks[i].type === "loop_end" && i !== currentBlockIndex) depth++;
            if (routine.blocks[i].type === "loop_start") {
                if (depth === 0) {
                    startIdx = i;
                    break;
                }
                depth--;
            }
        }
        if (startIdx !== -1) {
            return {
                startIdx,
                currentCycle: loopRepetitions[startIdx] || 1,
                maxCycles: routine.blocks[startIdx].loop_count || 1,
                loopName: routine.blocks[startIdx].exercise_name
            };
        }
        return null;
    };

    const loopContext = getLoopContext();

    return (
        <div className={cn(
            "min-h-screen flex flex-col relative transition-all duration-1000 ease-in-out font-sans overflow-hidden",
            isResting ? "bg-[#02080a]" : "bg-black"
        )}>
            {/* Full Screen Impact Flash (Epicness) */}
            <AnimatePresence>
                {impact && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white z-[100] pointer-events-none mix-blend-overlay"
                    />
                )}
            </AnimatePresence>
            <div className={cn("absolute inset-0 transition-opacity duration-1000", isResting ? "opacity-100" : "opacity-0")}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-950/40 via-black to-black" />
            </div>
            <div className={cn("absolute inset-0 transition-opacity duration-1000", !isResting && status === "active" ? "opacity-100" : "opacity-0")}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-kuma-gold/5 via-black to-black" />
            </div>

            {/* --- OVERLAYS --- */}
            <AchievementOverlay
                show={showTrophy}
                trophy={currentAchievement}
                onClose={() => {
                    setShowTrophy(false);
                    // Remove current from queue
                    setAchievementQueue(prev => prev.slice(1));

                    // If no more achievements AND we were finishing, go to completed screen
                    if (achievementQueue.length <= 1 && isFinishing) {
                        setStatus("completed");
                        triggerConfetti();
                    }
                }}
            />

            {/* --- HEADER --- */}
            <div className="relative z-20 px-6 pt-6 pb-2 flex items-center justify-between lg:px-12 lg:pt-8 w-full max-w-[1600px] mx-auto">
                <Link href="/rutinas">
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" weight="bold" />
                    </button>
                </Link>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500">
                        {isResting ? "RECUPERACIÓN" : "ENFOQUE"}
                    </span>
                </div>
                <div className="w-10 h-10 lg:hidden" />
                <div className="hidden lg:flex items-center gap-2 text-zinc-500 text-xs font-mono">
                    <Timer className="w-4 h-4" weight="duotone" />
                    <span>{formatTime(activeBlock.rest_seconds)} REST</span>
                </div>
            </div>

            {/* --- HYPER PROGRESS BAR --- */}
            <div className="px-6 mt-4 mb-2 lg:px-12 w-full max-w-[1600px] mx-auto z-30 relative">
                <div className="relative h-4 w-full bg-zinc-900/80 rounded-full border border-white/5 overflow-hidden backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)_inset]">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                    <motion.div
                        className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-600 via-cyan-400 to-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, progress)}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    >
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
                        />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-12 bg-white blur-md" />
                    </motion.div>
                    {/* Roadmap Markers (Recommendation #9) */}
                    <div className="absolute inset-0 flex justify-between px-1">
                        {routine.blocks.map((block, idx) => (
                            <div
                                key={`roadmap-${idx}`}
                                className={cn(
                                    "h-full w-[1px] bg-white/10 z-10 transition-colors",
                                    idx === currentBlockIndex && "bg-cyan-400 w-px shadow-[0_0_10px_#22d3ee]"
                                )}
                            />
                        ))}
                    </div>
                    {/* Roadmap Markers (Recommendation #9) */}
                    <div className="absolute inset-0 flex px-1">
                        {(() => {
                            let accumulatedSets = 0;
                            return routine.blocks.map((block, idx) => {
                                if (block.type === 'loop_start' || block.type === 'loop_end') return null;
                                const width = (block.sets / totalSets) * 100;
                                const left = (accumulatedSets / totalSets) * 100;
                                accumulatedSets += block.sets;
                                return (
                                    <div
                                        key={`roadmap-${idx}`}
                                        className={cn(
                                            "absolute top-0 bottom-0 border-r border-white/20 z-10 transition-colors",
                                            idx === currentBlockIndex && "border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                        )}
                                        style={{ left: `${left}%`, width: `${width}%` }}
                                    />
                                );
                            });
                        })()}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-cyan-500 tracking-[0.2em] animate-pulse">
                            {Math.round(progress)}% COMPLETADO
                        </span>
                        {loopContext && (
                            <span className="text-[9px] font-black text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                                <ArrowCounterClockwise size={12} weight="bold" className="text-cyan-400 animate-spin-slow" />
                                {loopContext.loopName}: Ciclo {loopContext.currentCycle} de {loopContext.maxCycles}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-600 tracking-[0.2em]">
                        {completedSets} / {totalSets} SETS TOTALES
                    </span>
                </div>
            </div>

            {/* --- MAIN CONTENT (SPLIT VIEW) --- */}
            <div className="flex-1 lg:grid lg:grid-cols-12 lg:gap-8 lg:p-12 relative z-10 w-full lg:max-w-[1600px] lg:mx-auto">

                {/* ZONA A: THE STAGE (Desktop Left / Mobile Main) */}
                <div className="flex-1 flex flex-col p-6 lg:p-0 lg:col-span-8 lg:h-full justify-center">
                    <AnimatePresence mode="wait">
                        {!isResting ? (
                            useCamera && activeBlock && isAiExerciseActive ? (
                                <motion.div
                                    key="active-stage-camera"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="flex-1 flex flex-col relative perspective-[2000px]"
                                >
                                    <div className="flex-1 bg-zinc-900/60 backdrop-blur-xl rounded-[3rem] border border-white/10 p-6 flex flex-col items-center justify-between relative overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] lg:h-[70vh] lg:min-h-[600px] z-10">
                                        <video
                                            ref={videoRef}
                                            style={{ position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }}
                                            width="640"
                                            height="480"
                                            playsInline
                                            muted
                                            autoPlay
                                        />
                                        
                                        <div className="w-full flex-1 flex items-center justify-center relative min-h-[280px]">
                                            <canvas ref={canvasRef} width={640} height={480} className="w-full h-full lg:max-h-[520px] max-h-[420px] object-cover rounded-3xl border border-white/10 bg-black shadow-2xl" />
                                            
                                            {cameraError ? (
                                                <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-red-500/20 z-50">
                                                    <WarningCircle className="w-12 h-12 text-red-500 mb-3" weight="bold" />
                                                    <span className="text-sm font-bold text-white uppercase tracking-wider">Error de Cámara</span>
                                                    <p className="text-zinc-500 text-xs mt-1 max-w-xs">{cameraError}</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCameraError(null);
                                                            loadScripts();
                                                        }}
                                                        className="mt-4 px-4 py-2 bg-zinc-900 border border-white/10 text-white rounded-xl text-xs font-bold hover:bg-zinc-800"
                                                    >
                                                        Reintentar
                                                    </button>
                                                </div>
                                            ) : null}

                                            {/* Live Reps / Gauge Overlay */}
                                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
                                                <span className="text-xs font-bold text-zinc-400">Reps:</span>
                                                <span className="text-lg font-black text-kuma-gold font-mono">{repsCount} / {activeBlock.reps}</span>
                                            </div>
                                            
                                            {/* Active side/phase indicator */}
                                            {isBurpeeActive && (
                                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/5 text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                                                    Fase:{" "}
                                                    <span className="text-cyan-400 font-bold">
                                                        {hasReachedBottom ? "SALTO Y PALMADA" : "PECHO AL SUELO"}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Depth Indicator Bar (Cyber HUD Style) */}
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-[65%] w-3 bg-zinc-900/60 rounded-full border border-white/5 overflow-hidden flex flex-col justify-end">
                                                <div 
                                                    className={cn(
                                                        "w-full transition-all duration-150 rounded-full",
                                                        isSquatActive
                                                            ? (kneeAngle <= 95 ? "bg-emerald-500 shadow-[0_0_15px_#10b981]" : kneeAngle < 135 ? "bg-yellow-400 shadow-[0_0_15px_#facc15]" : "bg-rose-500 shadow-[0_0_15px_#f43f5e]")
                                                            : isPushupActive
                                                            ? (elbowAngle <= 95 ? "bg-emerald-500 shadow-[0_0_15px_#10b981]" : elbowAngle < 135 ? "bg-yellow-400 shadow-[0_0_15px_#facc15]" : "bg-rose-500 shadow-[0_0_15px_#f43f5e]")
                                                            : (hasReachedBottom ? "bg-emerald-500 shadow-[0_0_15px_#10b981]" : "bg-rose-500 shadow-[0_0_15px_#f43f5e]")
                                                    )}
                                                    style={{ 
                                                        height: `${Math.max(0, Math.min(100, 
                                                            isSquatActive
                                                                ? ((180 - kneeAngle) / (180 - 80)) * 100
                                                                : isPushupActive
                                                                ? ((180 - elbowAngle) / (180 - 80)) * 100
                                                                : (hasReachedBottom ? 100 : 35)
                                                        ))}%` 
                                                    }}
                                                />
                                                {/* Depth Threshold line (only for squats and pushups) */}
                                                {(isSquatActive || isPushupActive) && (
                                                    <div className="absolute bottom-[85%] left-0 right-0 h-px bg-white/40 border-t border-dashed" title="Meta paralela" />
                                                )}
                                            </div>

                                            {/* Live Angle / Phase HUD */}
                                            <div className="absolute bottom-4 left-4 bg-zinc-950/80 border border-white/10 p-3 rounded-xl backdrop-blur-sm shadow-md text-left z-20">
                                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">
                                                    {isSquatActive ? "Ángulo Rodilla" : isPushupActive ? "Ángulo Codo" : "Fase Burpee"}
                                                </span>
                                                <span className="text-xl font-black font-mono text-white tabular-nums flex items-baseline gap-1">
                                                    {isSquatActive ? `${kneeAngle}°` : isPushupActive ? `${elbowAngle}°` : (hasReachedBottom ? "SALTO" : "SUELO")}
                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase">
                                                        {isSquatActive 
                                                            ? (kneeAngle <= 95 ? "(PROFUNDO)" : "(ERGUIDO)") 
                                                            : isPushupActive 
                                                            ? (elbowAngle <= 95 ? "(PROFUNDO)" : "(EXTENDIDO)")
                                                            : (hasReachedBottom ? "(JUMP)" : "(PECHO)")}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Live Messages & Instructions */}
                                        <div className="w-full text-center space-y-2 mt-4 z-10">
                                            <div className="bg-black/30 backdrop-blur px-4 py-1.5 rounded-full border border-white/5 inline-block text-xs font-bold tracking-wider text-kuma-gold uppercase animate-pulse">
                                                {feedbackMsg}
                                            </div>
                                            <p className="text-zinc-400 text-sm font-bold">
                                                {instructionMsg}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="active-stage"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    // Tap Anywhere logic (Recommendation #3)
                                    onClick={() => {
                                        if (activeBlock.measure_type !== "time" || exerciseTimeLeft === 0) {
                                            finishSet();
                                        }
                                    }}
                                    className="flex-1 flex flex-col relative perspective-[2000px] cursor-pointer"
                                >
                                {/* 3D WRAPPER FOR FLOATING EFFECT */}
                                <motion.div
                                    animate={impact ? {
                                        x: [-5, 5, -5, 5, -3, 3, 0],
                                        y: [0, -5, 5, -5, 0],
                                        rotateZ: [0, -2, 2, -1, 0]
                                    } : {
                                        y: [0, -20, 0],
                                        rotateX: [0, 2, 0], // Subtle tilt
                                        rotateY: [0, -1, 0]
                                    }}
                                    transition={impact ? { duration: 0.4, ease: "easeInOut" } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="flex-1 bg-zinc-900/60 backdrop-blur-xl rounded-[3rem] border border-white/10 p-8 flex flex-col items-center justify-between relative overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] lg:h-[70vh] lg:min-h-[600px] transform-style-3d group"
                                >
                                    {/* Decorative Character (Epicness) */}
                                    <div className="absolute -right-20 -bottom-20 w-80 h-80 opacity-10 grayscale hover:grayscale-0 transition-all duration-1000 pointer-events-none z-0">
                                        <img src="/images/kuma-zanshing-v2.jpg" className="w-full h-full object-contain mix-blend-screen" />
                                    </div>
                                    {/* IMPACT FLASH */}
                                    <div className={cn(
                                        "absolute inset-0 bg-red-500 mix-blend-overlay z-50 pointer-events-none transition-opacity duration-100",
                                        impact ? "opacity-40" : "opacity-0"
                                    )} />

                                    {/* DEEP 3D SHADOW (Pseudo-element simulation) */}
                                    <div className="absolute -bottom-20 left-10 right-10 h-10 bg-black/80 blur-2xl rounded-[100%] transition-all duration-[6s] ease-in-out"
                                        style={{ transform: impact ? "scale(0.8)" : "scale(1)" }} />

                                    {/* --- DYNAMIC GIF BACKGROUND --- */}
                                    {/* --- DYNAMIC GIF BACKGROUND --- */}
                                    {/* Removed as per user request */}

                                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-kuma-gold/10 to-transparent opacity-50 pointer-events-none" />
                                    <div className="hidden lg:block absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] z-0 pointer-events-none" />

                                    <div className="flex flex-col items-center text-center space-y-2 relative z-10 w-full lg:items-start lg:text-left">
                                        <div className="bg-black/30 backdrop-blur px-4 py-1.5 rounded-full border border-white/5 mb-4 inline-flex shadow-lg flex-col gap-1">
                                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                                Ejercicio {currentBlockIndex + 1} de {totalBlocks}
                                            </span>
                                            {loopContext && (
                                                <div className="flex items-center gap-2 text-cyan-400">
                                                    <ArrowCounterClockwise size={12} weight="bold" className="animate-spin-slow" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        Ciclo {loopContext.currentCycle} de {loopContext.maxCycles}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-white leading-tight max-w-4xl drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                                            {activeBlock.exercise_name}
                                        </h2>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center py-8 lg:w-full">
                                        <div
                                            className={cn(
                                                "relative group transition-all duration-300",
                                                activeBlock.measure_type === "time" ? "cursor-pointer active:scale-95" : "cursor-default"
                                            )}
                                            onClick={() => {
                                                if (activeBlock.measure_type === "time") {
                                                    setIsTimerRunning(!isTimerRunning);
                                                }
                                            }}
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: exerciseTimeLeft <= 5 && isTimerRunning ? [1, 1.3, 1] : [1, 1.15, 1],
                                                    opacity: exerciseTimeLeft <= 5 && isTimerRunning ? [0.2, 0.5, 0.2] : [0.1, 0.3, 0.1]
                                                }}
                                                transition={{ duration: exerciseTimeLeft <= 5 && isTimerRunning ? 0.5 : 3, repeat: Infinity, ease: "easeInOut" }}
                                                className={cn(
                                                    "absolute inset-0 rounded-full blur-2xl lg:blur-3xl",
                                                    exerciseTimeLeft <= 5 && isTimerRunning ? "bg-red-600" : "bg-kuma-gold"
                                                )}
                                            />
                                            <div className="text-center relative z-10 lg:scale-150 transition-all duration-700">
                                                <div className="relative">
                                                    <span className={cn(
                                                        "text-[6rem] lg:text-[12rem] font-black leading-none tracking-tighter tabular-nums drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-300",
                                                        exerciseTimeLeft <= 5 && isTimerRunning ? "text-red-500 scale-110" : "text-white"
                                                    )}>
                                                        {activeBlock.measure_type === "time" ? formatTime(exerciseTimeLeft) : activeBlock.reps}
                                                    </span>

                                                    {/* Giant Countdown Overlay (Recommendation #2) */}
                                                    <AnimatePresence>
                                                        {exerciseTimeLeft <= 5 && isTimerRunning && (
                                                            <motion.div
                                                                key={`giant-count-${exerciseTimeLeft}`}
                                                                initial={{ scale: 2, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 0.3 }}
                                                                exit={{ scale: 0.5, opacity: 0 }}
                                                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                                            >
                                                                <span className="text-[15rem] lg:text-[25rem] font-black text-red-500 blur-sm">{exerciseTimeLeft}</span>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <span className="block text-2xl font-black text-zinc-500 uppercase tracking-[0.4em] mt-2 lg:mt-6">
                                                    {activeBlock.measure_type === "time" ? "Faltan" : "Repeticiones"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full flex justify-between items-center px-4 lg:px-6">
                                        <div className="flex items-center gap-4">
                                            <span className="text-zinc-400 font-bold lg:text-3xl shrink-0 uppercase tracking-tighter italic">Set {currentSet} / {activeBlock.sets}</span>

                                            {activeBlock.measure_type === "time" && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsTimerRunning(!isTimerRunning);
                                                    }}
                                                    className={cn(
                                                        "group relative px-6 py-3 rounded-2xl font-black uppercase tracking-tighter transition-all duration-75 text-sm lg:text-xl",
                                                        "bg-red-600 text-white shadow-[0_6px_0_0_#991b1b] active:shadow-none active:translate-y-[6px]",
                                                        isTimerRunning ? "bg-zinc-800 text-zinc-400 shadow-[0_6px_0_0_#18181b] border border-white/5" : "animate-bounce shadow-[0_6px_0_0_#991b1b]"
                                                    )}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        {isTimerRunning ? <Timer className="w-6 h-6 lg:w-8 lg:h-8" weight="fill" /> : <PlayCircle className="w-6 h-6 lg:w-8 lg:h-8" weight="fill" />}
                                                        {isTimerRunning ? "Pausar" : "Iniciar"}
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                        {activeBlock.notes && <span className="text-kuma-gold font-bold lg:bg-kuma-gold/10 lg:px-4 lg:py-2 lg:rounded-xl cursor-help text-sm">ℹ️ Ver Notas</span>}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) ) : (
                            <motion.div
                                key="rest-stage"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-center relative lg:h-full lg:justify-center"
                            >
                                <div className="relative w-72 h-72 lg:w-[30rem] lg:h-[30rem] flex items-center justify-center mb-12 lg:mb-0">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                                        <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                                        <motion.circle
                                            cx="50%" cy="50%" r="45%" stroke="#14b8a6" strokeWidth="8" fill="none" strokeLinecap="round"
                                            initial={{ pathLength: 1 }}
                                            animate={{ pathLength: 0 }}
                                            transition={{ duration: activeBlock.rest_seconds, ease: "linear" }}
                                        />
                                    </svg>
                                    <div className="flex flex-col items-center">
                                        <motion.span
                                            className="text-9xl lg:text-[12rem] font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                                            key={timeLeft}
                                            initial={{ scale: 1.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            {timeLeft}
                                        </motion.span>

                                        {/* Giant Visual Countdown - Rest (Recommendation #2) */}
                                        <AnimatePresence>
                                            {timeLeft <= 5 && (
                                                <motion.div
                                                    key={`giant-rest-${timeLeft}`}
                                                    initial={{ scale: 3, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 0.2 }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]"
                                                >
                                                    <span className="text-[20rem] lg:text-[30rem] font-black text-teal-500">{timeLeft}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <span className="text-sm font-bold text-teal-400 uppercase tracking-[0.3em] mt-2 lg:text-lg animate-pulse">
                                            {loopContext && currentSet === activeBlock.sets ? `Preparando Ciclo ${loopContext.currentCycle + 1}` : "Prepárate"}
                                        </span>
                                    </div>
                                </div>

                                {/* Next Exercise Preview (Recommendation #1) */}
                                {currentBlockIndex < totalBlocks - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-sm w-full"
                                    >
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Siguiente Ejercicio</span>
                                        <h4 className="text-xl font-black text-white">{routine.blocks[currentBlockIndex + 1].exercise_name}</h4>
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-xs text-kuma-gold font-bold">{routine.blocks[currentBlockIndex + 1].sets} Sets</span>
                                            <span className="text-xs text-zinc-400 font-bold">{routine.blocks[currentBlockIndex + 1].reps} {routine.blocks[currentBlockIndex + 1].measure_type === 'time' ? 'seg' : 'reps'}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ZONA B: CONTROL DECK */}
                <div className="lg:col-span-4 lg:flex lg:flex-col lg:justify-center lg:gap-8 p-6 lg:p-0">
                    <AnimatePresence mode="wait">
                        {!isResting ? (
                            <motion.div
                                key="controls-active"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6 lg:space-y-8"
                            >
                                <div className="hidden lg:block bg-zinc-900/50 backdrop-blur rounded-[2rem] p-8 border border-white/5 shadow-2xl">
                                    {currentSet < activeBlock.sets ? (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <ArrowCounterClockwise className="w-6 h-6 text-zinc-400" weight="bold" />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-xl">Mismo Ejercicio</div>
                                                <div className="text-zinc-500">Set {currentSet + 1} de {activeBlock.sets}</div>
                                            </div>
                                        </div>
                                    ) : currentBlockIndex < totalBlocks - 1 ? (
                                        (() => {
                                            const nextBlock = routine.blocks[currentBlockIndex + 1];
                                            if (nextBlock.type === "loop_end") {
                                                // Find loop_start and check repetitions
                                                let depth = 1;
                                                let startIdx = -1;
                                                for (let i = currentBlockIndex; i >= 0; i--) {
                                                    if (routine.blocks[i].type === "loop_end") depth++;
                                                    if (routine.blocks[i].type === "loop_start") depth--;
                                                    if (depth === 0) {
                                                        startIdx = i;
                                                        break;
                                                    }
                                                }
                                                const maxReps = routine.blocks[startIdx]?.loop_count || 1;
                                                const currentReps = loopRepetitions[startIdx] || 1;
                                                if (currentReps < maxReps) {
                                                    return (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                                                                <ArrowCounterClockwise className="w-6 h-6 text-cyan-400" weight="bold" />
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-bold text-xl">Repetir Loop</div>
                                                                <div className="text-cyan-500 font-bold uppercase text-[10px]">Ciclo {currentReps + 1} de {maxReps}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                // If loop finishes, show what's after loop_end
                                                const afterLoop = routine.blocks[currentBlockIndex + 2];
                                                if (afterLoop) {
                                                    return (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                                <SkipForward className="w-6 h-6 text-zinc-400" weight="bold" />
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-bold text-xl">{afterLoop.exercise_name}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            }
                                            return (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                        <SkipForward className="w-6 h-6 text-zinc-400" weight="bold" />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-bold text-xl">{nextBlock.exercise_name}</div>
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-kuma-gold/20 flex items-center justify-center">
                                                <Trophy className="w-6 h-6 text-kuma-gold" weight="duotone" />
                                            </div>
                                            <div className="text-kuma-gold font-bold text-xl">¡Finalizar Rutina!</div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent "Tap Anywhere" double trigger
                                        finishSet();
                                    }}
                                    className="w-full h-20 lg:h-32 bg-white hover:bg-zinc-200 text-black rounded-[2.5rem] font-black text-xl lg:text-2xl uppercase tracking-widest flex items-center justify-center gap-3 active:scale-90 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transform hover:-translate-y-1 relative overflow-hidden"
                                >
                                    <motion.div
                                        animate={{ x: ["-100%", "200%"] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent skew-x-[-20deg]"
                                    />
                                    <Check className="w-8 h-8 lg:w-10 lg:h-10" weight="bold" />
                                    Hecho
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="controls-rest"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6 lg:space-y-4 flex flex-col items-center lg:items-stretch"
                            >
                                <button
                                    onClick={finishRest}
                                    className="px-8 py-4 lg:w-full lg:h-20 bg-zinc-800/50 hover:bg-zinc-800 text-white rounded-full font-bold uppercase text-xs lg:text-sm tracking-widest transition-colors backdrop-blur border border-white/10 shadow-lg"
                                >
                                    Saltar Descanso
                                </button>
                                <p className="text-zinc-600 text-xs uppercase tracking-widest animate-pulse">Auto-avance activado</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Modal de confirmación para uso de cámara */}
            <AnimatePresence>
                {showCameraPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-zinc-950 border border-kuma-gold/30 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-[0_0_50px_rgba(234,179,8,0.25)]"
                        >
                            <div className="w-16 h-16 mx-auto bg-kuma-gold/10 border border-kuma-gold/30 rounded-2xl flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#eab308" viewBox="0 0 256 256">
                                    <path d="M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Zm80-24H208a8,8,0,0,0,0,16h24a8,8,0,0,1,8,8V200a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V128a8,8,0,0,1,8-8h24a8,8,0,0,0,0-16H32a24,24,0,0,0-24,24V200a24,24,0,0,0,24,24H224a24,24,0,0,0,24-24V128A24,24,0,0,0,232,104Zm-104,88a64,64,0,1,0-64-64A64.07,64.07,0,0,0,128,192Zm0-112a48,48,0,1,1-48,48A48.05,48.05,0,0,1,128,80ZM72,64A8,8,0,0,1,80,56h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,64Z"></path>
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif font-black text-white uppercase tracking-wider">¿Activar Cámara IA?</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Esta rutina tiene soporte para visión artificial. Si activas la cámara, la IA evaluará tu técnica y contará tus repeticiones automáticamente en tiempo real.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUseCamera(true);
                                        setShowCameraPrompt(false);
                                        loadScripts();
                                    }}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-b from-kuma-gold to-amber-500 text-black font-black uppercase tracking-wider border-b-4 border-amber-700 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all text-sm font-bold animate-pulse"
                                >
                                    Sí, activar cámara
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUseCamera(false);
                                        setShowCameraPrompt(false);
                                    }}
                                    className="w-full py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-xs border border-white/5 transition-all"
                                >
                                    No, entrenar manual
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
