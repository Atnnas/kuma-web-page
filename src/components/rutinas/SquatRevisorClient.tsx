"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, X, Volume2, VolumeX, Award, Zap, Loader2, ArrowLeft, Play, RefreshCw, Trophy, Activity, CheckCircle, AlertCircle, Flame, Plus, Minus
} from "lucide-react";
import confetti from "canvas-confetti";
import { AchievementOverlay } from "../gamification/AchievementOverlay";
import { startRoutineLog, completeRoutineLog, deleteRoutineLog } from "@/lib/actions/routine-logs";

interface SquatRevisorClientProps {
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

export function SquatRevisorClient({ user, routine }: SquatRevisorClientProps) {
  const router = useRouter();

  // Statuses: 'intro' | 'loading' | 'active' | 'completed' | 'cancelled'
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

  const [kneeAngle, setKneeAngle] = useState<number>(180);
  const [feedbackMsg, setFeedbackMsg] = useState("Ponte de perfil para iniciar");
  const [instructionMsg, setInstructionMsg] = useState("Párate derecho frente a la cámara");
  const [activeSide, setActiveSide] = useState<"izquierdo" | "derecho" | "detectando">("detectando");
  
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

  // State machine refs for squat logic
  const repsCountRef = useRef(0);
  const hasReachedDepthRef = useRef(false);
  const isReadyToStartRef = useRef(false);
  const wasBendingRef = useRef(false);

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

  // Speak voice feedback (disabled per user request)
  const speak = (text: string) => {};

  // Play a success beep
  const playBeep = () => {
    if (!audioEnabledRef.current) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      
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
      osc.frequency.setValueAtTime(220, audioCtx.currentTime); // Low A3 note
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {}
  };

  // Play a pleasant soft chime when depth is achieved
  const playDepthBeep = () => {
    if (!audioEnabledRef.current) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 note (pleasant, clear but not harsh)
      
      gainNode.gain.setValueAtTime(0.07, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {}
  };

  // Stance geometry 2D calculations
  const calculate2DAngle = (ptA: any, ptB: any, ptC: any) => {
    if (!ptA || !ptB || !ptC) return 180;
    
    // BA vector = A - B
    const vecBA = { x: ptA.x - ptB.x, y: ptA.y - ptB.y };
    // BC vector = C - B
    const vecBC = { x: ptC.x - ptB.x, y: ptC.y - ptB.y };
    
    const dot = vecBA.x * vecBC.x + vecBA.y * vecBC.y;
    const lenA = Math.sqrt(vecBA.x * vecBA.x + vecBA.y * vecBA.y);
    const lenC = Math.sqrt(vecBC.x * vecBC.x + vecBC.y * vecBC.y);
    
    if (lenA === 0 || lenC === 0) return 180;
    
    const cosTheta = Math.min(1, Math.max(-1, dot / (lenA * lenC)));
    const angle = Math.acos(cosTheta) * (180.0 / Math.PI);
    return Math.round(angle);
  };

  // Start Workout session
  const startTraining = async () => {
    setStatus("active");
    setRepsCount(0);
    repsCountRef.current = 0;
    hasReachedDepthRef.current = false;
    isReadyToStartRef.current = false;
    wasBendingRef.current = false;
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

    setTimeout(() => {
      speak("Revisor de sentadilla activo. Ponte de perfil.");
    }, 1000);
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

  // Complete Routine and save workout
  const completeWorkout = async () => {
    if (isFinishing) return;
    setIsFinishing(true);

    try {
      const durationMs = startTime ? (Date.now() - startTime) : 0;
      const durationSeconds = Math.round(durationMs / 1000);
      const durationMinutes = Math.max(1, Math.floor(durationMs / 60000));

      // Save routine log in Mongoose
      if (logIdRef.current) {
        await completeRoutineLog(logIdRef.current, durationSeconds);
      }

      // API complete
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

      if (audioEnabledRef.current) {
        speak("Excelente trabajo. Sentadillas completadas. ¡Osu!");
      }
    } catch (error) {
      console.error("Error saving squat revisor workout:", error);
      setStatus("completed");
      triggerConfetti();
    } finally {
      setIsFinishing(false);
    }
  };

  // Confetti particles
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

  // Watch achievement queue
  useEffect(() => {
    if (achievementQueue.length > 0 && !showTrophy) {
      setCurrentAchievement(achievementQueue[0]);
      setShowTrophy(true);
    }
  }, [achievementQueue, showTrophy]);

  // Handle MediaPipe results
  const handlePoseResults = (results: any) => {
    if (!canvasRef.current || !canvasRef.current.getContext) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dynamically adjust canvas dimensions to match the actual stream resolution and aspect ratio,
    // which prevents stretching/squishing (especially on mobile portrait orientation).
    const video = videoRef.current;
    if (video && video.videoWidth && video.videoHeight) {
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    }

    const width = canvas.width;
    const height = canvas.height;

    // Draw the camera image flipped (mirror style)
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

    // Determine profile side (Left vs Right)
    // Left landmarks: Hip (23), Knee (25), Ankle (27)
    // Right landmarks: Hip (24), Knee (26), Ankle (28)
    const leftVisibility = (landmarks[23]?.visibility || 0) + (landmarks[25]?.visibility || 0) + (landmarks[27]?.visibility || 0);
    const rightVisibility = (landmarks[24]?.visibility || 0) + (landmarks[26]?.visibility || 0) + (landmarks[28]?.visibility || 0);

    const isLeftProfile = leftVisibility > rightVisibility;
    setActiveSide(isLeftProfile ? "izquierdo" : "derecho");

    const hipIdx = isLeftProfile ? 23 : 24;
    const kneeIdx = isLeftProfile ? 25 : 26;
    const ankleIdx = isLeftProfile ? 27 : 28;
    const shoulderIdx = isLeftProfile ? 11 : 12;

    const hip = landmarks[hipIdx];
    const knee = landmarks[kneeIdx];
    const ankle = landmarks[ankleIdx];
    const shoulder = landmarks[shoulderIdx];

    // Check if points are visible enough
    const minVisibility = 0.45;
    const isStrict = modeRef.current === "estricto";
    if (
      (hip?.visibility || 0) < minVisibility || 
      (knee?.visibility || 0) < minVisibility || 
      (ankle?.visibility || 0) < minVisibility ||
      (isStrict && (shoulder?.visibility || 0) < minVisibility)
    ) {
      setFeedbackMsg(isStrict ? "Aléjate un poco más para ver hombros y piernas" : "Aléjate un poco más para ver tus piernas");
      drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.2)");
      return;
    }

    // Calculate Knee angle
    const angle = calculate2DAngle(hip, knee, ankle);
    setKneeAngle(angle);

    // Calculate back inclination angle relative to vertical axis (0 degrees is straight vertical)
    let backAngle = 0;
    if (shoulder && hip) {
      const vecHS = { x: shoulder.x - hip.x, y: shoulder.y - hip.y };
      const lenHS = Math.sqrt(vecHS.x * vecHS.x + vecHS.y * vecHS.y);
      if (lenHS > 0) {
        const cosTheta = -vecHS.y / lenHS;
        backAngle = Math.round(Math.acos(Math.min(1, Math.max(-1, cosTheta))) * (180 / Math.PI));
      }
    }

    // Evaluate state machine for reps
    // Standard: Standing is > 165. Depth reached is <= 95
    if (angle > 165) {
      if (hasReachedDepthRef.current) {
        // Success squat completed!
        repsCountRef.current += 1;
        setRepsCount(repsCountRef.current);
        
        playBeep();
        speak(repsCountRef.current.toString());
        
        hasReachedDepthRef.current = false;
        wasBendingRef.current = false;
        setFeedbackMsg("¡Sentadilla correcta!");
        
        if (repsCountRef.current >= targetRepsRef.current) {
          completeWorkout();
        }
      } else if (wasBendingRef.current) {
        // Stood up without reaching depth
        playWarningBeep();
        setFeedbackMsg("¡Sentadilla incompleta!");
        speak("Baja más");
        wasBendingRef.current = false;
      }
      isReadyToStartRef.current = true;
      setInstructionMsg("Flexiona tus piernas para la sentadilla");
    } else if (angle <= 95) {
      if (isReadyToStartRef.current) {
        if (isStrict && backAngle > 40) {
          // Warning: Bent back!
          if (hasReachedDepthRef.current) {
            playWarningBeep();
          }
          hasReachedDepthRef.current = false;
          setFeedbackMsg("¡Espalda inclinada! Enderézate");
          setInstructionMsg("Saca el pecho y mantén la espalda recta");
        } else {
          if (!hasReachedDepthRef.current) {
            playDepthBeep();
          }
          hasReachedDepthRef.current = true;
          wasBendingRef.current = true;
          setFeedbackMsg("¡Profundidad lograda! Ahora sube.");
          setInstructionMsg("Regresa a la posición inicial erguido");
        }
      }
    } else if (angle < 135) {
      if (isReadyToStartRef.current) {
        if (isStrict && backAngle > 40) {
          hasReachedDepthRef.current = false;
          setFeedbackMsg("¡Espalda inclinada! Enderézate");
          setInstructionMsg("Mantén el torso erguido al bajar");
        } else {
          wasBendingRef.current = true;
          if (!hasReachedDepthRef.current) {
            setFeedbackMsg("¡Baja un poco más!");
            setInstructionMsg("Flexiona un poco más profundo...");
          }
        }
      }
    }

    // Colors according to angle
    let jointColor = "rgba(239, 68, 68, 0.85)"; // Red (Standing / Not deep enough)
    if (angle <= 95 || hasReachedDepthRef.current) {
      jointColor = "rgba(34, 197, 94, 0.9)"; // Green (Depth achieved)
    } else if (angle < 135) {
      jointColor = "rgba(250, 204, 21, 0.85)"; // Yellow (Descending)
    }

    // Draw Skeleton on Canvas
    drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.15)");
    
    // Draw active leg with highlight
    ctx.save();
    ctx.lineCap = "round";

    const drawBone = (ptA: any, ptB: any) => {
      ctx.beginPath();
      ctx.moveTo((1 - ptA.x) * width, ptA.y * height);
      ctx.lineTo((1 - ptB.x) * width, ptB.y * height);
      ctx.stroke();
    };

    const isCorrectDepth = angle <= 95 || hasReachedDepthRef.current;

    if (isCorrectDepth) {
      // Radiant incandescent bloom (light-saber style glow)
      // 1. Thick outer soft glow
      ctx.shadowBlur = 30;
      ctx.shadowColor = "rgba(34, 197, 94, 0.9)";
      ctx.strokeStyle = "rgba(74, 222, 128, 0.25)";
      ctx.lineWidth = 18;
      drawBone(hip, knee);
      drawBone(knee, ankle);

      // 2. Medium core glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(34, 197, 94, 0.9)";
      ctx.strokeStyle = "rgba(34, 197, 94, 0.85)";
      ctx.lineWidth = 9;
      drawBone(hip, knee);
      drawBone(knee, ankle);

      // 3. Ultra-bright white hot filament core
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#ffffff";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      drawBone(hip, knee);
      drawBone(knee, ankle);
    } else {
      // Standard highlight for other positions
      ctx.shadowBlur = 12;
      ctx.shadowColor = jointColor;
      ctx.strokeStyle = jointColor;
      ctx.lineWidth = 6;
      drawBone(hip, knee);
      drawBone(knee, ankle);
    }

    // Draw Joint Points
    const drawJoint = (pt: any, color: string, radius = 8) => {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc((1 - pt.x) * width, pt.y * height, radius, 0, 2 * Math.PI);
      ctx.fill();
    };

    drawJoint(hip, "rgba(255,255,255,0.9)", 5);
    drawJoint(ankle, "rgba(255,255,255,0.9)", 5);
    drawJoint(knee, jointColor, 10);
    
    // Draw white center inside active knee
    drawJoint(knee, "#ffffff", 5);

    // Draw angle text next to knee
    ctx.shadowBlur = 4;
    ctx.shadowColor = "black";
    ctx.font = "bold 15px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${angle}°`, (1 - knee.x) * width + 15, knee.y * height + 5);

    // Draw back posture line if strict mode is active
    if (isStrict && shoulder && hip) {
      ctx.save();
      ctx.lineCap = "round";
      ctx.shadowBlur = 15;
      
      const isBackGood = backAngle <= 40;
      if (isBackGood) {
        ctx.strokeStyle = "rgba(6, 182, 212, 0.85)"; // Cyan glow for good posture
        ctx.shadowColor = "rgba(6, 182, 212, 0.85)";
        ctx.lineWidth = 5;
      } else {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.9)"; // Red glow for warning posture
        ctx.shadowColor = "rgba(239, 68, 68, 0.9)";
        ctx.lineWidth = 8;
      }
      
      // Draw line from hip to shoulder
      ctx.beginPath();
      ctx.moveTo((1 - hip.x) * width, hip.y * height);
      ctx.lineTo((1 - shoulder.x) * width, shoulder.y * height);
      ctx.stroke();
      
      // Draw text next to back line
      ctx.shadowBlur = 4;
      ctx.shadowColor = "black";
      ctx.font = "bold 13px monospace";
      ctx.fillStyle = isBackGood ? "#22c55e" : "#ef4444";
      ctx.fillText(`Espalda: ${backAngle}°`, (1 - (hip.x + shoulder.x) / 2) * width + 15, ((hip.y + shoulder.y) / 2) * height);
      
      ctx.restore();
    }

    ctx.restore();
  };

  // Helper to draw background skeleton
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

    // Shoulders & hips
    drawLine(11, 12);
    drawLine(11, 23);
    drawLine(12, 24);
    drawLine(23, 24);

    // Arms
    drawLine(11, 13);
    drawLine(13, 15);
    drawLine(12, 14);
    drawLine(14, 16);

    // Legs
    drawLine(23, 25);
    drawLine(25, 27);
    drawLine(24, 26);
    drawLine(26, 28);

    ctx.restore();
  };

  // Setup MediaPipe
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

  // Cancel workout
  const handleCancelWorkout = async () => {
    if (confirm("¿Estás seguro de que quieres abandonar este entrenamiento? Se descartará el progreso.")) {
      if (logIdRef.current) {
        await deleteRoutineLog(logIdRef.current);
      }
      router.push("/routines");
    }
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Get color for live angle gauge
  const getAngleColor = (angle: number) => {
    if (angle <= 95) return "bg-emerald-500 shadow-[0_0_15px_#10b981]";
    if (angle < 135) return "bg-yellow-400 shadow-[0_0_15px_#facc15]";
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

            {/* Mode Selector */}
            <div className="pt-5 border-t border-white/5">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-2 text-center lg:text-left">Modo de Revisión</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode("regular")}
                  className={`py-3 px-4 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    mode === "regular" 
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] font-black" 
                      : "bg-zinc-950/40 border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
                  }`}
                >
                  <Activity className={`w-4 h-4 ${mode === "regular" ? "animate-pulse" : ""}`} />
                  Regular (Solo Profundidad)
                </button>
                <button
                  type="button"
                  onClick={() => setMode("estricto")}
                  className={`py-3 px-4 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    mode === "estricto" 
                      ? "bg-gradient-to-r from-red-600 to-amber-500 border-amber-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] font-black" 
                      : "bg-zinc-950/40 border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
                  }`}
                >
                  <Zap className={`w-4 h-4 ${mode === "estricto" ? "fill-white animate-pulse" : ""}`} />
                  Estricto (Espalda Recta)
                </button>
              </div>
            </div>
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
            <p className="text-zinc-400 text-sm font-bold">Espejo Inteligente de Devolución</p>
            <p className="text-zinc-600 text-xs max-w-xs leading-relaxed">
              El evaluador procesará tu esqueleto localmente de medio lado para medir la flexión de tu sentadilla.
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

  // 3. COMPLETED VIEW (VICTORIA)
  if (status === "completed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-950/20 via-black to-black pointer-events-none" />
        
        {/* Achievements overlays */}
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
            Has completado las 10 sentadillas a la profundidad correcta. Tu técnica ha sido validada y registrada correctamente.
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
          
          {/* Flipped hidden video feed */}
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

            {/* Depth Indicator Bar (Cyber HUD Style) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-[70%] w-3 bg-zinc-900/60 rounded-full border border-white/5 overflow-hidden flex flex-col justify-end">
              <div 
                className={`w-full transition-all duration-150 rounded-full ${getAngleColor(kneeAngle)}`}
                style={{ 
                  height: `${Math.max(0, Math.min(100, ((180 - kneeAngle) / (180 - 80)) * 100))}%` 
                }}
              />
              {/* Depth Threshold line */}
              <div className="absolute bottom-[85%] left-0 right-0 h-px bg-white/40 border-t border-dashed" title="Meta paralela" />
            </div>
            {/* Transparent Reps Overlay */}
            <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-md">
              <span className="text-xs font-bold text-zinc-400">Reps:</span>
              <span className="text-lg font-black text-kuma-gold font-mono">{repsCount} / {targetReps}</span>
            </div>

            {/* Live Angle HUD */}
            <div className="absolute bottom-4 left-4 bg-zinc-950/80 border border-white/10 p-3 rounded-xl backdrop-blur-sm shadow-md">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Ángulo Rodilla</span>
              <span className="text-2xl font-black font-mono text-white tabular-nums flex items-baseline gap-0.5">
                {kneeAngle}°
                <span className="text-[10px] text-zinc-500 font-bold">({hasReachedDepthRef.current ? "PROFUNDO" : "ERGUIDO"})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Training Stats & HUD Controls */}
        <div className="w-full xl:w-[320px] flex flex-col justify-between gap-6">
          
          {/* Main counter card */}
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
