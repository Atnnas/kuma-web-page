"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Camera, X, Volume2, VolumeX, Award, Zap, Loader2, ArrowLeft, Play, RefreshCw, Trophy, Activity, CheckCircle, AlertCircle, Flame, Plus, Minus
} from "lucide-react";
import confetti from "canvas-confetti";
import { AchievementOverlay } from "../gamification/AchievementOverlay";
import { startRoutineLog, completeRoutineLog, deleteRoutineLog } from "@/lib/actions/routine-logs";

interface ShoulderPressRevisorClientProps {
  user: any;
  routine: {
    _id: string;
    title: string;
    slug: string;
    description: string;
    estimated_duration: number;
    difficulty: string;
  };
}

export function ShoulderPressRevisorClient({ user, routine }: ShoulderPressRevisorClientProps) {
  const router = useRouter();

  // Statuses: 'intro' | 'loading' | 'active' | 'completed'
  const [status, setStatus] = useState<"intro" | "loading" | "active" | "completed">("intro");
  const [mode, setMode] = useState<"estricto" | "regular">("regular");
  const modeRef = useRef<"estricto" | "regular">("regular");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Stats
  const [repsCount, setRepsCount] = useState(0);
  const [targetReps, setTargetReps] = useState(10);
  const targetRepsRef = useRef(10);

  useEffect(() => {
    targetRepsRef.current = targetReps;
  }, [targetReps]);

  const [leftElbowAngle, setLeftElbowAngle] = useState<number>(180);
  const [rightElbowAngle, setRightElbowAngle] = useState<number>(180);
  const [shoulderAsymmetry, setShoulderAsymmetry] = useState<number>(0);
  const [forearmDrift, setForearmDrift] = useState<number>(0);
  const [feedbackMsg, setFeedbackMsg] = useState("Ponte de frente para iniciar");
  const [instructionMsg, setInstructionMsg] = useState("Coloca las mancuernas a la altura de las orejas");
  
  // Audio settings
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioEnabledRef = useRef(true);

  // Time & Logging
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const logIdRef = useRef<string | null>(null);

  // Refs for MediaPipe and Canvas
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseInstanceRef = useRef<any>(null);
  const cameraInstanceRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  };

  // State machine refs for press logic
  const repsCountRef = useRef(0);
  const hasReachedTopRef = useRef(false); // reached full press (both elbow angles >= 160)
  const isReadyToStartRef = useRef(false);
  const wasPressingRef = useRef(false);

  // Achievement Overlay
  const [showTrophy, setShowTrophy] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState<any[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<any | null>(null);
  const [workoutSummary, setWorkoutSummary] = useState<any>(null);

  // Sync audio enabled state to ref
  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  // Keep track of training time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "active" && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, startTime]);

  // Load MediaPipe scripts dynamically
  const loadScripts = () => {
    if (scriptsLoaded) return;
    setStatus("loading");

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
        startTraining();
      })
      .catch((err) => {
        console.error("Error loading MediaPipe scripts:", err);
        setConnectionError("No se pudieron cargar las librerías de visión artificial.");
        setStatus("intro");
      });
  };

  // Play success beep
  const playBeep = () => {
    if (!audioEnabledRef.current) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {}
  };

  // Play warning buzzer
  const playWarningBeep = () => {
    if (!audioEnabledRef.current) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, audioCtx.currentTime); // Low A3
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {}
  };

  // Play top press chime
  const playDepthBeep = () => {
    if (!audioEnabledRef.current) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      
      gainNode.gain.setValueAtTime(0.07, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {}
  };

  const calculate2DAngle = (ptA: any, ptB: any, ptC: any) => {
    if (!ptA || !ptB || !ptC) return 180;
    const vecBA = { x: ptA.x - ptB.x, y: ptA.y - ptB.y };
    const vecBC = { x: ptC.x - ptB.x, y: ptC.y - ptB.y };
    const dot = vecBA.x * vecBC.x + vecBA.y * vecBC.y;
    const lenA = Math.sqrt(vecBA.x * vecBA.x + vecBA.y * vecBA.y);
    const lenC = Math.sqrt(vecBC.x * vecBC.x + vecBC.y * vecBC.y);
    if (lenA === 0 || lenC === 0) return 180;
    const cosTheta = Math.min(1, Math.max(-1, dot / (lenA * lenC)));
    const angle = Math.acos(cosTheta) * (180.0 / Math.PI);
    return Math.round(angle);
  };

  // Start Workout
  const startTraining = async () => {
    setStatus("active");
    setRepsCount(0);
    repsCountRef.current = 0;
    hasReachedTopRef.current = false;
    isReadyToStartRef.current = false;
    wasPressingRef.current = false;
    setStartTime(Date.now());
    setElapsedTime(0);
    setCameraActive(true);

    try {
      const res = await startRoutineLog(routine._id, routine.title, routine.estimated_duration);
      if (res.success && res.logId) {
        logIdRef.current = res.logId;
      }
    } catch (error) {
      console.error("Failed to start routine log:", error);
    }
  };

  // Exit guard
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

  // Complete and save
  const completeWorkout = async () => {
    if (isFinishing) return;
    setIsFinishing(true);

    try {
      const durationMs = startTime ? (Date.now() - startTime) : 0;
      const durationSeconds = Math.round(durationMs / 1000);
      const durationMinutes = Math.max(1, Math.floor(durationMs / 60000));

      if (logIdRef.current) {
        await completeRoutineLog(logIdRef.current, durationSeconds);
      }

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
        const achievements = data.newAchievements.map((item: any) => item.trophy);
        setAchievementQueue(achievements);
      }

      setWorkoutSummary({
        durationMinutes,
        streakDays: data.streakDays || 1,
        workoutCount: data.workoutCount || 1,
      });

      setStatus("completed");
      triggerConfetti();
    } catch (error) {
      console.error("Error saving shoulder workout:", error);
      setStatus("completed");
      triggerConfetti();
    } finally {
      setIsFinishing(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 90 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 60 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 200);
  };

  useEffect(() => {
    if (achievementQueue.length > 0 && !showTrophy) {
      setCurrentAchievement(achievementQueue[0]);
      setShowTrophy(true);
    }
  }, [achievementQueue, showTrophy]);

  // Handle MediaPipe pose results
  const handlePoseResults = (results: any) => {
    if (!canvasRef.current || !canvasRef.current.getContext) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dynamically adjust dimensions
    const video = videoRef.current;
    if (video && video.videoWidth && video.videoHeight) {
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    }

    const width = canvas.width;
    const height = canvas.height;

    // Draw video stream (mirrored)
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
      setFeedbackMsg("Alineando cuerpo de frente...");
      return;
    }

    // Shoulder press is evaluated from front view
    // Key landmarks:
    // Left: Shoulder (11), Elbow (13), Wrist (15)
    // Right: Shoulder (12), Elbow (14), Wrist (16)
    const s_L = landmarks[11];
    const e_L = landmarks[13];
    const w_L = landmarks[15];
    const s_R = landmarks[12];
    const e_R = landmarks[14];
    const w_R = landmarks[16];

    const minVisibility = 0.45;
    const isStrict = modeRef.current === "estricto";

    if (
      !s_L || !e_L || !w_L || !s_R || !e_R || !w_R ||
      s_L.visibility < minVisibility || e_L.visibility < minVisibility || w_L.visibility < minVisibility ||
      s_R.visibility < minVisibility || e_R.visibility < minVisibility || w_R.visibility < minVisibility
    ) {
      setFeedbackMsg("Aléjate un poco más para enfocar tus hombros y brazos");
      drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.2)");
      return;
    }

    // 1. Calculate Left & Right Elbow angles
    const angleL = calculate2DAngle(s_L, e_L, w_L);
    const angleR = calculate2DAngle(s_R, e_R, w_R);
    setLeftElbowAngle(angleL);
    setRightElbowAngle(angleR);

    // 2. Calculate Shoulder asymmetry (difference in shoulder height)
    const diffY = Math.abs(s_L.y - s_R.y);
    const asymmetryPercentage = Math.round(diffY * 100);
    setShoulderAsymmetry(asymmetryPercentage);

    // 3. Forearm alignment check (wrist horizontal drift relative to elbow)
    // Forearms should stay vertical during the push. If wrists flare outwards or inwards, drift increases.
    const driftL = Math.abs(w_L.x - e_L.x);
    const driftR = Math.abs(w_R.x - e_R.x);
    const maxDrift = Math.max(driftL, driftR);
    const formattedDrift = Math.round(maxDrift * 100);
    setForearmDrift(formattedDrift);

    const isSymmetrical = asymmetryPercentage <= 5;
    const isForearmVertical = maxDrift <= 0.08;

    // Fists width flaring check: wrists should not be more than 1.35x shoulder width apart
    const shoulderWidth = Math.abs(s_L.x - s_R.x);
    const wristWidth = Math.abs(w_L.x - w_R.x);
    const isFistsCorrect = wristWidth <= 1.35 * shoulderWidth;

    // State machine for shoulder press:
    // Starting position (Bottom): Both elbows bent to <= 90°
    // Target position (Top): Both elbows extended to >= 160°
    if (angleL <= 90 && angleR <= 90) {
      if (hasReachedTopRef.current) {
        // Complete repetition
        repsCountRef.current += 1;
        setRepsCount(repsCountRef.current);
        playBeep();
        
        hasReachedTopRef.current = false;
        wasPressingRef.current = false;
        setFeedbackMsg("¡Repetición correcta!");
        
        if (repsCountRef.current >= targetRepsRef.current) {
          completeWorkout();
        }
      } else if (wasPressingRef.current) {
        playWarningBeep();
        setFeedbackMsg("¡Rango incompleto! Empuja hacia arriba.");
        wasPressingRef.current = false;
      }
      isReadyToStartRef.current = true;
      setInstructionMsg("Empuja las mancuernas verticalmente sobre tu cabeza");
    } else if (angleL >= 160 && angleR >= 160) {
      if (isReadyToStartRef.current) {
        if (isStrict && !isSymmetrical) {
          if (hasReachedTopRef.current) playWarningBeep();
          hasReachedTopRef.current = false;
          setFeedbackMsg("¡Empuje asimétrico! Empuja parejo");
          setInstructionMsg("Alinea la fuerza en ambos hombros por igual");
        } else if (isStrict && !isForearmVertical) {
          if (hasReachedTopRef.current) playWarningBeep();
          hasReachedTopRef.current = false;
          setFeedbackMsg("¡Alinea tus antebrazos! Mantenlos verticales");
          setInstructionMsg("Evita abrir o cerrar los brazos hacia los lados");
        } else if (isStrict && !isFistsCorrect) {
          if (hasReachedTopRef.current) playWarningBeep();
          hasReachedTopRef.current = false;
          setFeedbackMsg("¡No abras los brazos! Puños sobre la cabeza");
          setInstructionMsg("Empuja verticalmente hacia arriba, no hacia afuera");
        } else {
          if (!hasReachedTopRef.current) {
            playDepthBeep();
          }
          hasReachedTopRef.current = true;
          wasPressingRef.current = true;
          setFeedbackMsg("¡Extensión lograda! Baja lentamente.");
          setInstructionMsg("Regresa los codos a la altura de tus orejas");
        }
      }
    } else if (angleL > 110 || angleR > 110) {
      if (isReadyToStartRef.current) {
        if (isStrict && !isSymmetrical) {
          hasReachedTopRef.current = false;
          setFeedbackMsg("¡Corrige simetría de hombros!");
        } else if (isStrict && !isForearmVertical) {
          hasReachedTopRef.current = false;
          setFeedbackMsg("¡Antebrazos inclinados! Evita balancear");
        } else if (isStrict && !isFistsCorrect) {
          hasReachedTopRef.current = false;
          setFeedbackMsg("¡Brazos muy abiertos! Puños sobre la cabeza");
        } else {
          wasPressingRef.current = true;
          if (!hasReachedTopRef.current) {
            setFeedbackMsg("¡Sigue empujando hacia arriba!");
            setInstructionMsg("Estira tus brazos por completo...");
          }
        }
      }
    }

    // Drawing HUD
    drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.15)");
    
    // Draw active limbs
    ctx.save();
    ctx.lineCap = "round";

    const drawBone = (ptA: any, ptB: any, color: string, wVal: number) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = wVal;
      ctx.moveTo((1 - ptA.x) * width, ptA.y * height);
      ctx.lineTo((1 - ptB.x) * width, ptB.y * height);
      ctx.stroke();
    };

    const drawJoint = (pt: any, color: string, rVal: number) => {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc((1 - pt.x) * width, pt.y * height, rVal, 0, 2 * Math.PI);
      ctx.fill();
    };

    const isPeak = (angleL >= 160 && angleR >= 160) || hasReachedTopRef.current;
    const activeColorL = angleL >= 160 || hasReachedTopRef.current ? "rgba(34, 197, 94, 0.9)" : angleL > 110 ? "rgba(250, 204, 21, 0.85)" : "rgba(239, 68, 68, 0.85)";
    const activeColorR = angleR >= 160 || hasReachedTopRef.current ? "rgba(34, 197, 94, 0.9)" : angleR > 110 ? "rgba(250, 204, 21, 0.85)" : "rgba(239, 68, 68, 0.85)";

    if (isPeak) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(34, 197, 94, 0.9)";
      drawBone(s_L, e_L, "rgba(74, 222, 128, 0.4)", 12);
      drawBone(e_L, w_L, "rgba(74, 222, 128, 0.4)", 12);
      drawBone(s_R, e_R, "rgba(74, 222, 128, 0.4)", 12);
      drawBone(e_R, w_R, "rgba(74, 222, 128, 0.4)", 12);

      ctx.shadowBlur = 6;
      ctx.shadowColor = "#ffffff";
      drawBone(s_L, e_L, "#ffffff", 4);
      drawBone(e_L, w_L, "#ffffff", 4);
      drawBone(s_R, e_R, "#ffffff", 4);
      drawBone(e_R, w_R, "#ffffff", 4);
    } else {
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255,255,255,0.2)";
      drawBone(s_L, e_L, activeColorL, 6);
      drawBone(e_L, w_L, activeColorL, 6);
      drawBone(s_R, e_R, activeColorR, 6);
      drawBone(e_R, w_R, activeColorR, 6);
    }

    drawJoint(s_L, "rgba(255,255,255,0.9)", 5);
    drawJoint(w_L, "rgba(255,255,255,0.9)", 5);
    drawJoint(e_L, activeColorL, 10);
    drawJoint(e_L, "#ffffff", 5);

    drawJoint(s_R, "rgba(255,255,255,0.9)", 5);
    drawJoint(w_R, "rgba(255,255,255,0.9)", 5);
    drawJoint(e_R, activeColorR, 10);
    drawJoint(e_R, "#ffffff", 5);

    // Draw angles text next to elbows
    ctx.shadowBlur = 4;
    ctx.shadowColor = "black";
    ctx.font = "bold 15px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${angleL}°`, (1 - e_L.x) * width - 50, e_L.y * height + 5);
    ctx.fillText(`${angleR}°`, (1 - e_R.x) * width + 15, e_R.y * height + 5);

    // Strict features HUD overlays
    if (isStrict) {
      // 1. Draw horizontal line connecting shoulders to check asymmetry
      ctx.shadowBlur = 10;
      if (isSymmetrical) {
        ctx.strokeStyle = "rgba(6, 182, 212, 0.8)"; // Cyan
        ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
        ctx.lineWidth = 4;
      } else {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.9)"; // Red
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

      // 2. Draw forearm drift indicators
      if (!isForearmVertical) {
        ctx.strokeStyle = "rgba(249, 115, 22, 0.8)"; // Orange
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Left vertical ref line
        ctx.moveTo((1 - e_L.x) * width, e_L.y * height);
        ctx.lineTo((1 - e_L.x) * width, w_L.y * height);
        ctx.moveTo((1 - e_R.x) * width, e_R.y * height);
        ctx.lineTo((1 - e_R.x) * width, w_R.y * height);
        ctx.stroke();
      }

      // 3. Draw horizontal line connecting wrists to check flaring width
      ctx.shadowBlur = 10;
      if (isFistsCorrect) {
        ctx.strokeStyle = "rgba(6, 182, 212, 0.25)"; // Cyan (faint)
        ctx.shadowColor = "rgba(6, 182, 212, 0.25)";
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.9)"; // Red warning
        ctx.shadowColor = "rgba(239, 68, 68, 0.9)";
        ctx.lineWidth = 6;
        
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = "#ef4444";
        ctx.fillText("¡MUY ABIERTO!", (1 - (w_L.x + w_R.x) / 2) * width - 40, ((w_L.y + w_R.y) / 2) * height - 15);
      }
      ctx.beginPath();
      ctx.moveTo((1 - w_L.x) * width, w_L.y * height);
      ctx.lineTo((1 - w_R.x) * width, w_R.y * height);
      ctx.stroke();
    }

    ctx.restore();
  };

  const drawSkeletonSkeleton = (ctx: CanvasRenderingContext2D, lms: any[], w: number, h: number, color: string) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    const drawLine = (idxA: number, idxB: number) => {
      const ptA = lms[idxA];
      const ptB = lms[idxB];
      if (ptA && ptB) {
        ctx.beginPath();
        ctx.moveTo((1 - ptA.x) * w, ptA.y * h);
        ctx.lineTo((1 - ptB.x) * w, ptB.y * h);
        ctx.stroke();
      }
    };

    drawLine(11, 12); drawLine(11, 23); drawLine(12, 24); drawLine(23, 24);
    drawLine(11, 13); drawLine(13, 15); drawLine(12, 14); drawLine(14, 16);
    drawLine(23, 25); drawLine(25, 27); drawLine(24, 26); drawLine(26, 28);
    ctx.restore();
  };

  // MediaPipe initialization
  useEffect(() => {
    if (!scriptsLoaded || status !== "active") return;
    if (!videoRef.current || !canvasRef.current) return;

    const PoseClass = (window as any).Pose;
    const CameraClass = (window as any).Camera;

    if (!PoseClass || !CameraClass) return;

    const pose = new PoseClass({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.5
    });

    pose.onResults(handlePoseResults);
    poseInstanceRef.current = pose;

    const camera = new CameraClass(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          try {
            await pose.send({ image: videoRef.current });
          } catch (e) {
            console.error("Frame processing error:", e);
          }
        }
      },
      width: 640,
      height: 480
    });

    camera.start();
    cameraInstanceRef.current = camera;

    return () => {
      if (cameraInstanceRef.current) {
        try { cameraInstanceRef.current.stop(); } catch {}
      }
      if (poseInstanceRef.current) {
        try { poseInstanceRef.current.close(); } catch {}
      }
    };
  }, [scriptsLoaded, status]);

  const handleCancelWorkout = async () => {
    if (confirm("¿Estás seguro de que quieres abandonar este entrenamiento? Se descartará el progreso.")) {
      if (logIdRef.current) {
        await deleteRoutineLog(logIdRef.current);
      }
      router.push("/routines");
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getAngleColor = (angleL: number, angleR: number) => {
    const minAngle = Math.min(angleL, angleR);
    if (minAngle >= 160) return "bg-emerald-500 shadow-[0_0_15px_#10b981]";
    if (minAngle > 110) return "bg-yellow-400 shadow-[0_0_15px_#facc15]";
    return "bg-rose-500 shadow-[0_0_15px_#f43f5e]";
  };

  // 1. INTRO VIEW
  if (status === "intro") {
    return (
      <div className="relative z-10 flex-1 flex flex-col p-6 items-center justify-center max-w-5xl mx-auto w-full lg:flex-row lg:gap-16 min-h-[75vh]">
        
        <div className="text-center lg:text-left lg:flex-1 space-y-8 max-w-lg">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 mx-auto lg:mx-0 bg-gradient-to-tr from-kuma-gold to-yellow-600 rounded-3xl flex items-center justify-center shadow-lg"
          >
            <Activity className="w-12 h-12 text-black" />
          </motion.div>

          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
              Visión Artificial
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tight mt-4">
              {routine.title}
            </h1>
            <p className="text-zinc-400 mt-4 leading-relaxed text-sm">
              {routine.description}
            </p>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <span className="text-xs text-zinc-400 uppercase font-black tracking-widest text-center">
                Objetivo de Repeticiones
              </span>
              <div className="flex items-center justify-center gap-6 w-full max-w-sm">
                <button
                  type="button"
                  onClick={() => setTargetReps(prev => Math.max(1, prev - 1))}
                  className="w-16 h-16 flex items-center justify-center text-zinc-300 hover:text-white bg-zinc-950 hover:bg-zinc-800 border-2 border-white/10 active:border-cyan-500/50 hover:border-cyan-500/30 active:scale-95 transition-all rounded-2xl shadow-lg shadow-black/40 text-2xl font-bold cursor-pointer select-none"
                >
                  <Minus className="w-6 h-6 text-cyan-400" />
                </button>
                
                <div className="flex flex-col items-center justify-center min-w-[100px]">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={targetReps || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setTargetReps(isNaN(val) ? 0 : val);
                    }}
                    onBlur={() => {
                      if (!targetReps || targetReps < 1) {
                        setTargetReps(10);
                      }
                    }}
                    className="w-full bg-transparent border-none text-center text-4xl text-white font-black focus:outline-none focus:ring-0 p-0 font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">reps</span>
                </div>

                <button
                  type="button"
                  onClick={() => setTargetReps(prev => Math.min(999, prev + 1))}
                  className="w-16 h-16 flex items-center justify-center text-zinc-300 hover:text-white bg-zinc-950 hover:bg-zinc-800 border-2 border-white/10 active:border-amber-500/50 hover:border-amber-500/30 active:scale-95 transition-all rounded-2xl shadow-lg shadow-black/40 text-2xl font-bold cursor-pointer select-none"
                >
                  <Plus className="w-6 h-6 text-amber-400" />
                </button>
              </div>
            </div>

            {/* No Mode Selector */}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={loadScripts}
              className="group w-full lg:w-64 h-14 bg-white hover:bg-kuma-gold text-black rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              <Play className="w-4 h-4 fill-black" /> Activar Cámara
            </button>

            <Link href="/routines" className="w-full lg:w-64">
              <button
                type="button"
                className="w-full h-12 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/5"
              >
                <ArrowLeft className="w-4 h-4" /> Volver a Ejercicios
              </button>
            </Link>
          </div>
        </div>

        <div className="hidden lg:block lg:flex-1 relative aspect-[4/3] rounded-[2rem] border border-white/10 overflow-hidden bg-zinc-950 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-black flex flex-col items-center justify-center p-8 text-center space-y-4">
            <Camera className="w-12 h-12 text-zinc-600 animate-pulse" />
            <p className="text-zinc-400 text-sm font-bold">Evaluador de Press Militar</p>
            <p className="text-zinc-600 text-xs max-w-xs leading-relaxed">
              Párate de frente hacia la cámara. El evaluador medirá la extensión de tus codos al empujar, verificando la simetría de tus hombros y la verticalidad de tus antebrazos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOADING VIEW
  if (status === "loading") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[70vh]">
        <div className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-10 text-center max-w-md w-full backdrop-blur-md flex flex-col items-center justify-center space-y-6 shadow-2xl">
          <Loader2 className="w-12 h-12 text-kuma-gold animate-spin" />
          <h2 className="text-xl font-bold uppercase tracking-wide text-white">Iniciando Visión Artificial</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Estamos cargando MediaPipe Pose y preparando tu webcam. Por favor, concede los permisos de cámara cuando aparezca la ventana emergente.
          </p>
        </div>
      </div>
    );
  }

  // 3. COMPLETED VIEW
  if (status === "completed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-950/20 via-black to-black pointer-events-none" />
        
        <AchievementOverlay
          show={showTrophy}
          trophy={currentAchievement}
          onClose={() => {
            setShowTrophy(false);
            setAchievementQueue((prev) => prev.slice(1));
          }}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative text-center w-full max-w-md bg-zinc-900/90 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md"
        >
          <div className="w-32 h-32 mx-auto relative mb-6">
            <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-teal-700 rounded-full flex items-center justify-center shadow-lg border-4 border-zinc-950">
              <Trophy className="w-14 h-14 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-kuma-gold rounded-full flex items-center justify-center shadow border-4 border-zinc-900">
              <CheckCircle className="w-6 h-6 text-black" />
            </div>
          </div>

          <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase">¡OSU!</h2>
          <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-widest mb-6">Revisión Favorable</h3>
          
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Has completado el press militar de hombros con la técnica correcta. Tu técnica ha sido validada y registrada correctamente.
          </p>

          {workoutSummary && (
            <div className="grid grid-cols-2 gap-4 mb-8 bg-zinc-950/60 rounded-2xl p-4 border border-white/5">
              <div className="text-center border-r border-white/5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Racha</span>
                <span className="text-2xl text-white font-black flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
                  {workoutSummary.streakDays} Días
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Tiempo</span>
                <span className="text-2xl text-white font-black">{formatTime(elapsedTime)}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={startTraining}
              className="w-full h-14 bg-white hover:bg-kuma-gold hover:text-black text-black rounded-2xl font-black text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Repetir Entrenamiento ({targetReps} reps)
            </button>

            <Link href="/routines" className="block w-full">
              <button className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-colors">
                Volver al Dojo
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 4. ACTIVE WORKOUT VIEW
  return (
    <div className="flex-1 flex flex-col relative w-full max-w-[1600px] mx-auto px-4 pt-6 z-10">
      
      {/* Header controls */}
      <div className="flex items-center justify-between mb-6 w-full border-b border-white/5 pb-4">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Evaluación MediaPipe
          </span>
          <h2 className="text-sm font-black uppercase text-white tracking-wider mt-0.5">
            {routine.title}
          </h2>
        </div>

        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
            audioEnabled ? "bg-white/5 border-kuma-gold/30 text-kuma-gold" : "bg-white/5 border-white/5 text-zinc-500"
          }`}
          title={audioEnabled ? "Silenciar audio" : "Activar audio"}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 w-full items-stretch">
        
        {/* Left Side: Camera & AI */}
        <div className="w-full h-[55vh] min-h-[450px] lg:h-[70vh] lg:min-h-[600px] relative flex flex-col items-center justify-center bg-black/95 rounded-[2rem] border border-white/5 overflow-hidden p-3 md:p-5 shadow-2xl">
          
          <video
            ref={videoRef}
            style={{ position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }}
            width="640"
            height="480"
            playsInline
            muted
            autoPlay
          />

          {/* Main Overlay & Canvas */}
          <div className="relative w-full flex-1 bg-zinc-950 rounded-2xl overflow-hidden shadow-inner border border-white/10 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="w-full h-full object-cover rounded-2xl"
            />

            {/* Depth Indicator Bar */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-[70%] w-3 bg-zinc-900/60 rounded-full border border-white/5 overflow-hidden flex flex-col justify-end">
              <div 
                className={`w-full transition-all duration-150 rounded-full ${getAngleColor(leftElbowAngle, rightElbowAngle)}`}
                style={{ 
                  height: `${Math.max(0, Math.min(100, ((Math.min(leftElbowAngle, rightElbowAngle) - 80) / (180 - 80)) * 100))}%` 
                }}
              />
              <div className="absolute bottom-[80%] left-0 right-0 h-px bg-white/40 border-t border-dashed" title="Meta extensión" />
            </div>

            {/* Transparent Reps Overlay */}
            <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-md">
              <span className="text-xs font-bold text-zinc-400">Reps:</span>
              <span className="text-lg font-black text-kuma-gold font-mono">{repsCount} / {targetReps}</span>
            </div>

            {/* Live Angle HUD */}
            <div className="absolute bottom-4 left-4 bg-zinc-950/80 border border-white/10 p-3 rounded-xl backdrop-blur-sm shadow-md flex gap-4">
              <div>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Codo Izq</span>
                <span className="text-xl font-black font-mono text-white tabular-nums">{leftElbowAngle}°</span>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Codo Der</span>
                <span className="text-xl font-black font-mono text-white tabular-nums">{rightElbowAngle}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Training Stats & HUD Controls */}
        <div className="w-full xl:w-[320px] flex flex-col justify-between gap-6">
          
          <div className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md shadow-2xl flex-1 flex flex-col justify-between space-y-6">
            
            {/* Live Feedback box */}
            <div className="bg-zinc-950/80 border border-white/5 p-4 rounded-2xl text-center space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">RETROALIMENTACIÓN</span>
              <p className="text-lg font-black text-white uppercase tracking-tight min-h-[28px] flex items-center justify-center italic">
                {feedbackMsg}
              </p>
              <p className="text-xs text-zinc-500 leading-normal min-h-[16px]">
                {instructionMsg}
              </p>
            </div>

            {/* No posture panel */}

            {/* Time Elapsed */}
            <div className="flex items-center justify-between px-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Duración:</span>
              </div>
              <span className="text-sm font-black font-mono text-white tabular-nums">
                {formatTime(elapsedTime)}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={completeWorkout}
                disabled={isFinishing}
                className="w-full h-14 bg-white hover:bg-emerald-500 hover:text-white text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-white/5 disabled:opacity-50"
              >
                {isFinishing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Finalizar y Guardar
              </button>

              <button
                onClick={handleCancelWorkout}
                className="w-full h-12 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-rose-500/20 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" /> Cancelar y Volver
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
