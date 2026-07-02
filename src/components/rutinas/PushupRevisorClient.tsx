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

interface PushupRevisorClientProps {
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

export function PushupRevisorClient({ user, routine }: PushupRevisorClientProps) {
  const router = useRouter();

  // Statuses: 'intro' | 'loading' | 'active' | 'completed'
  const [status, setStatus] = useState<"intro" | "loading" | "active" | "completed">("intro");
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
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

  const [elbowAngle, setElbowAngle] = useState<number>(180);
  const [feedbackMsg, setFeedbackMsg] = useState("Colócate en posición de plancha de perfil");
  const [instructionMsg, setInstructionMsg] = useState("Estira los brazos por completo");
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

  // State machine refs
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

  // Play success beep
  const playBeep = () => {
    if (!audioEnabledRef.current) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
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

  // Play warning beep
  const playWarningBeep = () => {
    if (!audioEnabledRef.current) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
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

  // Start Training
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
      speak("Revisor de push ups activo. Ponte en posición de plancha de perfil.");
    }, 1000);
  };

  // Complete Workout
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
        speak("Excelente. Push ups completados con éxito. ¡Osu!");
      }
    } catch (error) {
      console.error("Error saving pushup revisor workout:", error);
      setStatus("completed");
      triggerConfetti();
    } finally {
      setIsFinishing(false);
    }
  };

  // Confetti
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

  // Achievement overlay queue
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

    // Draw video feed flipped
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

    // Determine active side based on arm visibility
    // Left landmarks: Shoulder (11), Elbow (13), Wrist (15)
    // Right landmarks: Shoulder (12), Elbow (14), Wrist (16)
    const leftVisibility = (landmarks[11]?.visibility || 0) + (landmarks[13]?.visibility || 0) + (landmarks[15]?.visibility || 0);
    const rightVisibility = (landmarks[12]?.visibility || 0) + (landmarks[14]?.visibility || 0) + (landmarks[16]?.visibility || 0);

    const isLeftProfile = leftVisibility > rightVisibility;
    setActiveSide(isLeftProfile ? "izquierdo" : "derecho");

    const shoulderIdx = isLeftProfile ? 11 : 12;
    const elbowIdx = isLeftProfile ? 13 : 14;
    const wristIdx = isLeftProfile ? 15 : 16;
    const hipIdx = isLeftProfile ? 23 : 24;

    const shoulder = landmarks[shoulderIdx];
    const elbow = landmarks[elbowIdx];
    const wrist = landmarks[wristIdx];
    const hip = landmarks[hipIdx];

    // Check visibility
    const minVisibility = 0.45;

    if (
      (shoulder?.visibility || 0) < minVisibility || 
      (elbow?.visibility || 0) < minVisibility || 
      (wrist?.visibility || 0) < minVisibility
    ) {
      setFeedbackMsg("Alinea tu brazo y muñeca con la cámara");
      drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.2)");
      return;
    }

    // Calculate elbow angle
    const angle = calculate2DAngle(shoulder, elbow, wrist);
    setElbowAngle(angle);

    // Push Up state machine
    const depthThreshold = 110;
    const extensionThreshold = 150;

    if (angle > extensionThreshold) {
      if (hasReachedDepthRef.current) {
        // Success push up completed!
        repsCountRef.current += 1;
        setRepsCount(repsCountRef.current);
        
        playBeep();
        speak(repsCountRef.current.toString());
        
        hasReachedDepthRef.current = false;
        wasBendingRef.current = false;
        setFeedbackMsg("¡Push up correcto!");
        
        if (repsCountRef.current >= targetRepsRef.current) {
          completeWorkout();
        }
      } else if (wasBendingRef.current) {
        // Did not go deep enough before extending
        playWarningBeep();
        setFeedbackMsg("¡Flexión incompleta!");
        speak("Baja más");
        wasBendingRef.current = false;
      }
      isReadyToStartRef.current = true;
      setInstructionMsg("Flexiona los brazos para descender");
    } else if (angle <= depthThreshold) {
      if (isReadyToStartRef.current) {
        if (!hasReachedDepthRef.current) {
          playDepthBeep();
        }
        hasReachedDepthRef.current = true;
        wasBendingRef.current = true;
        setFeedbackMsg("¡Profundidad lograda! Ahora sube.");
        setInstructionMsg("Estira tus brazos por completo");
      }
    } else if (angle < (depthThreshold + 40)) {
      if (isReadyToStartRef.current) {
        wasBendingRef.current = true;
        if (!hasReachedDepthRef.current) {
          setFeedbackMsg("¡Baja un poco más!");
          setInstructionMsg("Aproxima el pecho al suelo...");
        }
      }
    }

    // Joint feedback color
    let jointColor = "rgba(239, 68, 68, 0.85)"; // Red
    if (angle <= 95 || hasReachedDepthRef.current) {
      jointColor = "rgba(34, 197, 94, 0.9)"; // Green
    } else if (angle < 135) {
      jointColor = "rgba(250, 204, 21, 0.85)"; // Yellow
    }

    // Draw standard skeleton background
    drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.15)");
    
    // Draw active arm highlight
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
      drawBone(shoulder, elbow);
      drawBone(elbow, wrist);

      // 2. Medium core glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(34, 197, 94, 0.9)";
      ctx.strokeStyle = "rgba(34, 197, 94, 0.85)";
      ctx.lineWidth = 9;
      drawBone(shoulder, elbow);
      drawBone(elbow, wrist);

      // 3. Ultra-bright white hot filament core
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#ffffff";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      drawBone(shoulder, elbow);
      drawBone(elbow, wrist);
    } else {
      // Standard highlight for other positions
      ctx.shadowBlur = 12;
      ctx.shadowColor = jointColor;
      ctx.strokeStyle = jointColor;
      ctx.lineWidth = 6;
      drawBone(shoulder, elbow);
      drawBone(elbow, wrist);
    }

    // Joint Points
    const drawJoint = (pt: any, color: string, radius = 8) => {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc((1 - pt.x) * width, pt.y * height, radius, 0, 2 * Math.PI);
      ctx.fill();
    };

    drawJoint(shoulder, "rgba(255,255,255,0.9)", 5);
    drawJoint(wrist, "rgba(255,255,255,0.9)", 5);
    drawJoint(elbow, jointColor, 10);
    drawJoint(elbow, "#ffffff", 5);

    // Print angle
    ctx.shadowBlur = 4;
    ctx.shadowColor = "black";
    ctx.font = "bold 15px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${angle}°`, (1 - elbow.x) * width + 15, elbow.y * height + 5);

    ctx.restore();
  };

  // Helper background skeleton
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

    drawLine(11, 12);
    drawLine(11, 23);
    drawLine(12, 24);
    drawLine(23, 24);

    drawLine(11, 13);
    drawLine(13, 15);
    drawLine(12, 14);
    drawLine(14, 16);

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

    let active = true;

    const camera = new CameraClass(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current && active && poseInstanceRef.current) {
          try {
            await poseInstanceRef.current.send({ image: videoRef.current });
          } catch (e) {
            console.error("Frame process error:", e);
          }
        }
      },
      width: 640,
      height: 480
    });

    camera.start();
    cameraInstanceRef.current = camera;

    return () => {
      active = false;
      if (cameraInstanceRef.current) {
        try { cameraInstanceRef.current.stop(); } catch {}
      }
      if (poseInstanceRef.current) {
        try { poseInstanceRef.current.close(); } catch {}
      }
    };
  }, [scriptsLoaded, status]);

  // Cancel workout
  const handleCancelWorkout = () => {
    setShowConfirmCancel(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getAngleColor = (angle: number) => {
    const targetFlex = 110;
    if (angle <= targetFlex) return "bg-emerald-500 shadow-[0_0_15px_#10b981]";
    if (angle < (targetFlex + 40)) return "bg-yellow-400 shadow-[0_0_15px_#facc15]";
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
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-500/20 bg-yellow-500/10 text-yellow-500">
              Visión Artificial
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tight mt-4">
              {routine.title}
            </h1>
            <p className="text-zinc-400 mt-4 leading-relaxed text-sm">
              {routine.description}
            </p>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 space-y-4">
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
              El evaluador medirá el ángulo de flexión de tus codos de medio lado en posición de plancha.
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
            Cargando MediaPipe Pose y preparando tu webcam. Concede los permisos de cámara cuando se soliciten.
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
          <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-widest mb-6">Pechadas Completadas</h3>
          
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Has completado las 10 repeticiones de push ups a la profundidad correcta. Tu técnica ha sido validada y registrada correctamente.
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

  // 4. ACTIVE VIEW
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

          <div className="relative w-full flex-1 bg-zinc-950 rounded-2xl overflow-hidden shadow-inner border border-white/10 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="w-full h-full object-cover rounded-2xl"
            />

            {/* Guide Silhouette Overlay */}
            <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-500 ${repsCount > 0 ? "opacity-0" : "opacity-25"}`}>
              <svg viewBox="0 0 100 100" className="w-5/6 h-1/2 text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                {/* Head at right */}
                <circle cx="80" cy="38" r="6" fill="currentColor" fillOpacity="0.1" />
                {/* Horizontal torso and legs */}
                <path d="
                  M 74,40 
                  L 20,54 
                  L 20,58
                  L 74,44
                  Z
                " fill="currentColor" fillOpacity="0.05" />
                {/* Arms down to ground */}
                <path d="
                  M 68,43 L 68,70
                  M 72,42 L 72,70
                " />
                {/* Ground line */}
                <path d="M 10,70 L 90,70" strokeDasharray="3,3" />
              </svg>
            </div>

            {/* Depth Indicator Bar */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-[70%] w-3 bg-zinc-900/60 rounded-full border border-white/5 overflow-hidden flex flex-col justify-end">
              <div 
                className={`w-full transition-all duration-150 rounded-full ${getAngleColor(elbowAngle)}`}
                style={{ 
                  height: `${Math.max(0, Math.min(100, ((180 - elbowAngle) / (180 - 80)) * 100))}%` 
                }}
              />
              <div 
                className="absolute left-0 right-0 h-px bg-white/40 border-t border-dashed" 
                style={{ bottom: `${((180 - 110) / (180 - 80)) * 100}%` }}
                title="Meta regular" 
              />
            </div>
            {/* Transparent Reps Overlay */}
            <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-md">
              <span className="text-xs font-bold text-zinc-400">Reps:</span>
              <span className="text-lg font-black text-kuma-gold font-mono">{repsCount} / {targetReps}</span>
            </div>

            {/* Live Angle HUD */}
            <div className="absolute bottom-4 left-4 bg-zinc-950/80 border border-white/10 p-3 rounded-xl backdrop-blur-sm shadow-md">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Ángulo Codo</span>
              <span className="text-2xl font-black font-mono text-white tabular-nums flex items-baseline gap-0.5">
                {elbowAngle}°
                <span className="text-[10px] text-zinc-500 font-bold">({hasReachedDepthRef.current ? "ABAJO" : "ARRIBA"})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats and guide panel */}
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

            {/* Action buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="button"
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
                type="button"
                onClick={handleCancelWorkout}
                className="w-full h-12 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-rose-500/20 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" /> Cancelar y Volver
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2rem] p-6 text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tight">¿Abandonar entrenamiento?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  ¿Estás seguro de que quieres abandonar este entrenamiento? Se descartará todo el progreso actual.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmCancel(false)}
                  className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-zinc-300 font-bold rounded-xl text-xs uppercase tracking-wider border border-white/5 transition-colors cursor-pointer"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setShowConfirmCancel(false);
                    if (logIdRef.current) {
                      await deleteRoutineLog(logIdRef.current);
                    }
                    router.push("/routines");
                  }}
                  className="flex-1 h-12 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Abandonar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
