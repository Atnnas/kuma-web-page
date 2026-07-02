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

interface TricepKickbackRevisorClientProps {
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

export function TricepKickbackRevisorClient({ user, routine }: TricepKickbackRevisorClientProps) {
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
  const [torsoAngleVal, setTorsoAngleVal] = useState<number>(90);
  const [elbowDriftVal, setElbowDriftVal] = useState<number>(0);
  const [feedbackMsg, setFeedbackMsg] = useState("Ponte de perfil para iniciar");
  const [instructionMsg, setInstructionMsg] = useState("Inclina tu torso y eleva tu codo");
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

  // State machine refs for tricep kickback logic
  const repsCountRef = useRef(0);
  const hasReachedTopRef = useRef(false); // means reached peak extension (>= 155)
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

  // Play depth beep
  const playDepthBeep = () => {
    if (!audioEnabledRef.current) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 note
      
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

  // Start Workout session
  const startTraining = async () => {
    setStatus("active");
    setRepsCount(0);
    repsCountRef.current = 0;
    hasReachedTopRef.current = false;
    isReadyToStartRef.current = false;
    wasBendingRef.current = false;
    setElapsedTime(0);
    setStartTime(Date.now());

    try {
      const response = await startRoutineLog(routine._id, routine.title, routine.estimated_duration);
      if (response && response.success) {
        logIdRef.current = response.logId || null;
      }
    } catch (e) {
      console.error("Error creating routine log:", e);
    }
  };

  // Terminate camera & instances
  const stopCamera = () => {
    if (cameraInstanceRef.current) {
      try {
        cameraInstanceRef.current.stop();
      } catch {}
      cameraInstanceRef.current = null;
    }
    if (poseInstanceRef.current) {
      try {
        poseInstanceRef.current.close();
      } catch {}
      poseInstanceRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCancelWorkout = () => {
    setShowConfirmCancel(true);
  };

  // Finalize session
  const completeWorkout = async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    stopCamera();

    try {
      const durationSeconds = elapsedTime;
      const durationMinutes = Math.max(1, Math.floor(durationSeconds / 60));

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
        reps: repsCountRef.current,
        duration: durationSeconds,
        expGained: data.expGained || 50,
        streakDays: data.streakDays || 1,
      });

      setStatus("completed");
      triggerConfetti();
    } catch (e) {
      console.error("Error completing routine log:", e);
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

  const handleNextAchievement = () => {
    const nextQueue = achievementQueue.slice(1);
    setAchievementQueue(nextQueue);
    if (nextQueue.length > 0) {
      setCurrentAchievement(nextQueue[0]);
    } else {
      setShowTrophy(false);
      setStatus("completed");
    }
  };

  // Initialize MediaPipe Pose logic
  useEffect(() => {
    if (status !== "active" || !scriptsLoaded) return;

    const vision = (window as any);
    if (!vision.Pose || !vision.Camera) {
      setConnectionError("No se pudieron cargar los scripts de MediaPipe. Reintenta.");
      setStatus("intro");
      return;
    }

    const pose = new vision.Pose({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.65
    });

    pose.onResults(onPoseResults);
    poseInstanceRef.current = pose;

    let active = true;

    if (videoRef.current) {
      const camera = new vision.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && active && poseInstanceRef.current) {
            try {
              await poseInstanceRef.current.send({ image: videoRef.current });
            } catch (err) {
              console.error("Pose frame error:", err);
            }
          }
        },
        width: 640,
        height: 480
      });
      camera.start()
        .then(() => setCameraActive(true))
        .catch((err: any) => {
          console.error("Camera startup error:", err);
          setConnectionError("No se pudo acceder a la cámara. Conéctala e intenta de nuevo.");
          setStatus("intro");
        });
      cameraInstanceRef.current = camera;
    }

    return () => {
      active = false;
      stopCamera();
    };
  }, [status, scriptsLoaded]);

  // Main pose processing logic
  const onPoseResults = (results: any) => {
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

    // Clear frame and draw mirrored video feed
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
      setFeedbackMsg("Ponte de perfil frente a la cámara enfocando tu brazo y cadera");
      return;
    }

    const minVisibility = 0.55;

    // Determine profile side (Left vs Right) based on visibility of key landmarks
    const s_L = landmarks[11];
    const e_L = landmarks[13];
    const w_L = landmarks[15];
    const h_L = landmarks[23];
    
    const s_R = landmarks[12];
    const e_R = landmarks[14];
    const w_R = landmarks[16];
    const h_R = landmarks[24];

    let side: "izquierdo" | "derecho" = "izquierdo";
    if (s_R && s_L) {
      side = s_R.visibility > s_L.visibility ? "derecho" : "izquierdo";
    }

    // Set active side variables
    const shoulder = side === "derecho" ? s_R : s_L;
    const elbow = side === "derecho" ? e_R : e_L;
    const wrist = side === "derecho" ? w_R : w_L;
    const hip = side === "derecho" ? h_R : h_L;

    setActiveSide(side);

    // Ensure all critical landmarks are visible
    if (
      !shoulder || !elbow || !wrist || !hip ||
      shoulder.visibility < minVisibility ||
      elbow.visibility < minVisibility ||
      wrist.visibility < minVisibility ||
      hip.visibility < minVisibility
    ) {
      setFeedbackMsg("Ponte de perfil frente a la cámara enfocando tu brazo y cadera");
      drawSkeletonSkeleton(ctx, landmarks, width, height, "rgba(255, 255, 255, 0.2)");
      return;
    }

    // 1. Calculate Torso Inclination (Angle of shoulder-hip line relative to horizontal)
    // Bent over means smaller angle with horizontal. Parallel to floor is 0°.
    const dx = Math.abs(shoulder.x - hip.x);
    const dy = Math.abs(shoulder.y - hip.y);
    const torsoAngle = Math.round(Math.atan2(dy, dx) * (180 / Math.PI));
    setTorsoAngleVal(torsoAngle);

    // 2. Upper arm alignment (Angle between shoulder-hip torso line and shoulder-elbow upper arm)
    // In kickbacks, upper arm should stay nearly parallel to torso (angle <= 30°)
    const upperArmTorsoAngle = calculate2DAngle(hip, shoulder, elbow);
    setElbowDriftVal(upperArmTorsoAngle);

    // 3. Elbow Flexion/Extension angle (shoulder-elbow-wrist)
    const angle = calculate2DAngle(shoulder, elbow, wrist);
    setElbowAngle(angle);

    const isTorsoInclined = torsoAngle <= 50; // Bending forward enough
    const dx_hs = hip.x - shoulder.x;
    const y_back_at_elbow = Math.abs(dx_hs) > 0.001
      ? shoulder.y + (hip.y - shoulder.y) * ((elbow.x - shoulder.x) / dx_hs)
      : shoulder.y;
    const isElbowElevated = elbow.y <= y_back_at_elbow + 0.03; // Elbow is at or above the back line

    // State machine for Tricep Kickback repetitions:
    // Starting position (Flexed): Elbow bent to <= 90°
    // Target position (Extended): Elbow fully extended to >= 155°
    if (angle <= 95) {
      if (hasReachedTopRef.current) {
        // Complete repetition
        repsCountRef.current += 1;
        setRepsCount(repsCountRef.current);
        playBeep();
        
        hasReachedTopRef.current = false;
        wasBendingRef.current = false;
        setFeedbackMsg("¡Repetición correcta!");
        
        if (repsCountRef.current >= targetRepsRef.current) {
          completeWorkout();
        }
      } else if (wasBendingRef.current) {
        playWarningBeep();
        setFeedbackMsg("¡Extensión incompleta! Estira el brazo.");
        wasBendingRef.current = false;
      }
      isReadyToStartRef.current = true;
      setInstructionMsg("Extiende tu codo completamente hacia atrás");
    } else if (angle >= 155) {
      if (isReadyToStartRef.current) {
        if (!isTorsoInclined) {
          if (hasReachedTopRef.current) playWarningBeep();
          hasReachedTopRef.current = false;
          setFeedbackMsg("¡Inclina tu torso! Mantén la espalda plana");
          setInstructionMsg("Inclina tu cuerpo hacia adelante para trabajar tríceps");
        } else if (!isElbowElevated) {
          if (hasReachedTopRef.current) playWarningBeep();
          hasReachedTopRef.current = false;
          setFeedbackMsg("¡Eleva tu codo! Mantenlo arriba");
          setInstructionMsg("Mantén tu brazo pegado y paralelo a tu torso");
        } else {
          if (!hasReachedTopRef.current) {
            playDepthBeep();
          }
          hasReachedTopRef.current = true;
          wasBendingRef.current = true;
          setFeedbackMsg("¡Extensión lograda! Regresa lento.");
          setInstructionMsg("Flexiona tu codo controladamente de vuelta a 90°");
        }
      }
    } else if (angle > 110) {
      if (isReadyToStartRef.current) {
        if (!isTorsoInclined) {
          hasReachedTopRef.current = false;
          setFeedbackMsg("¡Inclina más tu torso hacia adelante!");
        } else if (!isElbowElevated) {
          hasReachedTopRef.current = false;
          setFeedbackMsg("¡Sube el codo! No lo dejes caer");
        } else {
          wasBendingRef.current = true;
          if (!hasReachedTopRef.current) {
            setFeedbackMsg("¡Empuja hacia atrás!");
            setInstructionMsg("Extiende tu brazo por completo...");
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

    const isPeak = angle >= 155 || hasReachedTopRef.current;
    const activeColor = angle >= 155 || hasReachedTopRef.current ? "rgba(34, 197, 94, 0.9)" : angle > 110 ? "rgba(250, 204, 21, 0.85)" : "rgba(239, 68, 68, 0.85)";
    const elbowColor = isElbowElevated ? "rgba(34, 197, 94, 0.9)" : "rgba(239, 68, 68, 0.85)";

    if (isPeak) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(34, 197, 94, 0.9)";
      drawBone(shoulder, elbow, isElbowElevated ? "rgba(74, 222, 128, 0.4)" : "rgba(239, 68, 68, 0.4)", 12);
      drawBone(elbow, wrist, "rgba(74, 222, 128, 0.4)", 12);

      ctx.shadowBlur = 6;
      ctx.shadowColor = "#ffffff";
      drawBone(shoulder, elbow, "#ffffff", 4);
      drawBone(elbow, wrist, "#ffffff", 4);
    } else {
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255,255,255,0.2)";
      drawBone(shoulder, elbow, elbowColor, 6);
      drawBone(elbow, wrist, activeColor, 6);
    }

    // Draw torso reference line
    const torsoColor = isTorsoInclined ? "rgba(6, 182, 212, 0.8)" : "rgba(239, 68, 68, 0.9)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = torsoColor;
    drawBone(shoulder, hip, torsoColor, 4);

    drawJoint(shoulder, "rgba(255,255,255,0.9)", 5);
    drawJoint(wrist, "rgba(255,255,255,0.9)", 5);
    drawJoint(elbow, elbowColor, 10);
    drawJoint(elbow, "#ffffff", 5);
    drawJoint(hip, torsoColor, 6);

    // Draw angle text next to elbow
    ctx.shadowBlur = 4;
    ctx.shadowColor = "black";
    ctx.font = "bold 15px monospace";
    ctx.fillStyle = "#ffffff";
    
    // Draw text with mirror correction
    const elbowDrawX = (1 - elbow.x) * width;
    ctx.fillText(`${angle}°`, elbowDrawX + (side === "izquierdo" ? 15 : -55), elbow.y * height + 5);

    // Draw torso angle near shoulder
    const shoulderDrawX = (1 - shoulder.x) * width;
    ctx.fillStyle = isTorsoInclined ? "#22c55e" : "#ef4444";
    ctx.fillText(`Inclinación: ${torsoAngle}°`, shoulderDrawX - 60, shoulder.y * height - 20);

    // Draw elbow elevation alignment text near elbow
    ctx.fillStyle = isElbowElevated ? "#22c55e" : "#ef4444";
    ctx.fillText(`Alineación: ${upperArmTorsoAngle}°`, elbowDrawX - 60, elbow.y * height + 25);

    ctx.restore();
  };

  const drawSkeletonSkeleton = (ctx: CanvasRenderingContext2D, landmarks: any[], width: number, height: number, color: string) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    // Simple drawing of other minor connector lines for visuals
    const connections = [
      [11, 12], [11, 23], [12, 24], [23, 24]
    ];

    connections.forEach(([iA, iB]) => {
      const ptA = landmarks[iA];
      const ptB = landmarks[iB];
      if (ptA && ptB && ptA.visibility > 0.4 && ptB.visibility > 0.4) {
        ctx.beginPath();
        ctx.moveTo((1 - ptA.x) * width, ptA.y * height);
        ctx.lineTo((1 - ptB.x) * width, ptB.y * height);
        ctx.stroke();
      }
    });
    ctx.restore();
  };

  const getAngleColor = (angle: number) => {
    if (angle >= 155) return "bg-emerald-500 shadow-[0_0_15px_#10b981]";
    if (angle > 110) return "bg-yellow-400 shadow-[0_0_15px_#facc15]";
    return "bg-rose-500 shadow-[0_0_15px_#f43f5e]";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Objetivo del Entrenamiento</span>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setTargetReps(prev => Math.max(1, prev - 1))}
                  className="w-16 h-16 flex items-center justify-center text-zinc-300 hover:text-white bg-zinc-950 hover:bg-zinc-800 border-2 border-white/10 active:border-cyan-500/50 hover:border-cyan-500/30 active:scale-95 transition-all rounded-2xl shadow-lg shadow-black/40 text-2xl font-bold cursor-pointer select-none"
                >
                  <Minus className="w-6 h-6 text-cyan-400" />
                </button>
                <div className="flex flex-col items-center justify-center min-w-[80px]">
                  <input
                    type="number"
                    value={targetReps}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setTargetReps(isNaN(val) ? 10 : val);
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
                  className="w-16 h-16 flex items-center justify-center text-zinc-300 hover:text-white bg-zinc-950 hover:bg-zinc-800 border-2 border-white/10 active:border-cyan-500/50 hover:border-cyan-500/30 active:scale-95 transition-all rounded-2xl shadow-lg shadow-black/40 text-2xl font-bold cursor-pointer select-none"
                >
                  <Plus className="w-6 h-6 text-cyan-400" />
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
              El evaluador medirá el ángulo de tus codos de perfil, validando la inclinación de tu espalda y asegurando que mantengas los codos elevados y estables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOADING VIEW
  if (status === "loading") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
        <div className="text-center space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-white">Preparando el Evaluador de Tríceps</p>
          <p className="text-xs text-zinc-500">Cargando módulos de visión artificial local...</p>
        </div>
      </div>
    );
  }

  // 3. COMPLETED VIEW
  if (status === "completed" && workoutSummary) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 text-center space-y-8 z-10 relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/25"
        >
          <Trophy className="w-12 h-12 text-black" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">¡Patadas Completadas!</h2>
          <p className="text-sm text-zinc-400">Tu registro ha sido guardado exitosamente en tu perfil.</p>
        </div>

        <div className="bg-zinc-900/60 border border-white/10 rounded-[2rem] p-6 grid grid-cols-2 gap-4 backdrop-blur-md">
          <div className="text-center p-3 bg-zinc-950/40 rounded-2xl border border-white/5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Repeticiones</span>
            <span className="text-3xl text-white font-black font-mono mt-1 block">
              {workoutSummary.reps}
            </span>
          </div>
          <div className="text-center p-3 bg-zinc-950/40 rounded-2xl border border-white/5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">EXP Ganados</span>
            <span className="text-3xl text-kuma-gold font-black font-mono mt-1 block">
              +{workoutSummary.expGained}
            </span>
          </div>
          {workoutSummary.streakDays && (
            <div className="col-span-2 text-center p-3 bg-zinc-950/40 rounded-2xl border border-white/5 flex items-center justify-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-300">
                ¡Racha actual: <strong className="text-white font-black">{workoutSummary.streakDays} días</strong>!
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={startTraining}
            className="w-full h-14 bg-white hover:bg-kuma-gold hover:text-black text-black rounded-2xl font-black text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Repetir Entrenamiento
          </button>

          <Link href="/routines" className="block w-full">
            <button className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-colors">
              Volver al Dojo
            </button>
          </Link>
        </div>
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

            {/* Guide Silhouette Overlay */}
            <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-500 ${repsCount > 0 ? "opacity-0" : "opacity-25"}`}>
              <svg viewBox="0 0 100 100" className="w-1/2 h-2/3 text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                {/* Head bent over */}
                <circle cx="68" cy="38" r="6" fill="currentColor" fillOpacity="0.1" />
                {/* Body */}
                <path d="
                  M 34,60
                  C 33,70 32,80 30,90
                  M 38,60
                  C 37,70 36,80 34,90
                  M 36,60
                  L 58,38
                  C 60,38 62,39 63,38
                " />
                {/* Arm holding position */}
                <path d="M 52,42 L 38,52 L 48,64" />
              </svg>
            </div>

            {/* Depth Indicator Bar */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-[70%] w-3 bg-zinc-900/60 rounded-full border border-white/5 overflow-hidden flex flex-col justify-end">
              <div 
                className={`w-full transition-all duration-150 rounded-full ${getAngleColor(elbowAngle)}`}
                style={{ 
                  height: `${Math.max(0, Math.min(100, ((elbowAngle - 40) / (180 - 40)) * 100))}%` 
                }}
              />
              <div className="absolute bottom-[80%] left-0 right-0 h-px bg-white/40 border-t border-dashed" title="Meta extensión" />
            </div>

            {/* Transparent Reps Overlay */}
            <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-md">
              <span className="text-xs font-bold text-zinc-400">Reps:</span>
              <span className="text-lg font-black text-kuma-gold font-mono">{repsCount} / {targetReps}</span>
            </div>

            {/* Side Indicator Overlay */}
            <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-md">
              <span className="text-[9px] font-black uppercase text-zinc-500">Lado:</span>
              <span className="text-[10px] font-black text-cyan-400 uppercase">{activeSide}</span>
            </div>

            {/* Live Angle HUD */}
            <div className="absolute bottom-4 left-4 bg-zinc-950/80 border border-white/10 p-3 rounded-xl backdrop-blur-sm shadow-md flex gap-4">
              <div>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Ángulo Codo</span>
                <span className="text-xl font-black font-mono text-white tabular-nums">{elbowAngle}°</span>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Inclinación Espalda</span>
                <span className="text-xl font-black font-mono text-white tabular-nums">{torsoAngleVal}°</span>
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

      {/* Trophy gamification overlays */}
      <AnimatePresence>
        {showTrophy && currentAchievement && (
          <AchievementOverlay 
            show={showTrophy}
            trophy={currentAchievement} 
            onClose={handleNextAchievement} 
          />
        )}
      </AnimatePresence>

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
                    stopCamera();
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
