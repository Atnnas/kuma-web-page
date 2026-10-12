"use client";

import { useState, useEffect, useRef } from "react";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import {
  ArrowLeft, Camera, RefreshCw, AlertCircle, Play, SlidersHorizontal,
  Maximize2, CheckCircle, HelpCircle, Volume2, VolumeX, ShieldAlert,
  Compass, X, Sparkles, Target, RotateCcw, ChevronRight, SwitchCamera
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculate3DAngle,
  calculate2DAngle,
  smoothAngle,
  calculateKoshiAngle,
  checkKneeValgus,
  analyzeZenkutsuDachi,
  analyzeKokutsuDachi,
  analyzeKibaDachi,
  useWakeLock,
  type PoseLandmark
} from "@/lib/vision";

interface PosePreset {
  _id: string;
  name: string;
  category: "superior" | "inferior" | "completo";
  angles: { left: number; right: number; leftKnee?: number; rightKnee?: number };
  landmarks: PoseLandmark[];
}

export default function KumaStances() {
  // Core vision and state
  const [presets, setPresets] = useState<PosePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [currentPreset, setCurrentPreset] = useState<PosePreset | null>(null);
  const [tolerance, setTolerance] = useState<number>(15);
  const [analysisMode, setAnalysisMode] = useState<"superior" | "inferior" | "completo">("completo");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [isMobile, setIsMobile] = useState(false);
  
  // Biomecánica Shotokan y feedback marcial
  const [shotokanFeedback, setShotokanFeedback] = useState<{
    stanceName: string;
    feedback: string;
    koshi?: "shomen" | "hanmi" | "indeterminado";
    valgo?: boolean;
    metrics?: Record<string, any>;
  } | null>(null);
  const shotokanFeedbackRef = useRef(shotokanFeedback);
  useEffect(() => {
    shotokanFeedbackRef.current = shotokanFeedback;
  }, [shotokanFeedback]);

  // Local capture stance (to freeze user's own posture on screen)
  const [localCapture, setLocalCapture] = useState<{
    landmarks: PoseLandmark[];
    angles: { left: number; right: number; leftKnee?: number; rightKnee?: number };
    mode: "superior" | "inferior" | "completo";
  } | null>(null);
  const localCaptureRef = useRef<typeof localCapture>(null);
  useEffect(() => {
    localCaptureRef.current = localCapture;
  }, [localCapture]);

  // App state
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  // Screen Wake Lock automático para katas y entrenamientos
  useWakeLock(cameraActive);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [alignmentMetrics, setAlignmentMetrics] = useState({ score: 0, aligned: false });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const addLog = (msg: string) => {
    console.log(msg);
    setDebugLogs((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}: ${msg}`]);
  };

  // Load voice preference from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kuma_stances_voice");
      if (saved !== null) {
        setVoiceEnabled(saved === "true");
      }
    } catch (e) {}
  }, []);

  // Refs for video & canvas
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseInstanceRef = useRef<any>(null);
  const cameraInstanceRef = useRef<any>(null);
  const latestPoseLandmarksRef = useRef<PoseLandmark[] | null>(null);
  const latestWorldLandmarksRef = useRef<PoseLandmark[] | null>(null);
  const prevAnglesRef = useRef<{ left: number; right: number; leftKnee?: number; rightKnee?: number } | null>(null);
  const alignmentMetricsRef = useRef({ score: 0, aligned: false });
  const lastMetricsUpdateRef = useRef(0);
  const activeColorsRef = useRef<{
    leftColor: string;
    rightColor: string;
    leftKneeColor: string;
    rightKneeColor: string;
  }>({
    leftColor: "rgba(255, 0, 0, 0.8)",
    rightColor: "rgba(255, 0, 0, 0.8)",
    leftKneeColor: "rgba(255, 0, 0, 0.8)",
    rightKneeColor: "rgba(255, 0, 0, 0.8)"
  });

  // Sync refs to avoid stale closures in MediaPipe's async callback loop
  const toleranceRef = useRef(tolerance);
  const currentPresetRef = useRef<PosePreset | null>(null);
  const analysisModeRef = useRef(analysisMode);
  const hasTriggeredAlignRef = useRef(false);
  const voiceEnabledRef = useRef(voiceEnabled);
  const facingModeRef = useRef(facingMode);

  useEffect(() => { toleranceRef.current = tolerance; }, [tolerance]);
  useEffect(() => { currentPresetRef.current = currentPreset; }, [currentPreset]);
  useEffect(() => { analysisModeRef.current = analysisMode; }, [analysisMode]);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);
  useEffect(() => { facingModeRef.current = facingMode; }, [facingMode]);

  const aspectRatioRef = useRef(4 / 3);
  useEffect(() => { aspectRatioRef.current = aspectRatio; }, [aspectRatio]);

  // Resize listener to check if screen layout is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll on mobile when camera is active
  useEffect(() => {
    if (isMobile && cameraActive) {
      // Let's not lock overflow-y to allow vertical scroll of controls on active mobile split-screen
      document.body.style.overflowX = "hidden";
      document.documentElement.style.overflowX = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, [isMobile, cameraActive]);

  // Clean mobile layout handled via responsive Tailwind zero-scroll classes

  // Load presets list from database on mount
  useEffect(() => {
    fetch("/api/presets")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.presets || []);
        setPresets(list);
        if (list.length > 0) {
          // Select first preset by default
          setSelectedPresetId(list[0]._id);
          setCurrentPreset(list[0]);
          if (list[0].category) {
            setAnalysisMode(list[0].category as any);
          }
        }
        setIsConnecting(false);
      })
      .catch((err) => {
        console.error("Error loading presets:", err);
        setConnectionError("Error al cargar el catálogo de posturas.");
        setIsConnecting(false);
      });
  }, []);

  // TTS Voice Feedback (Optional)
  const speak = (text: string) => {
    if (!voiceEnabledRef.current) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-MX";
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  // Toggle Voice Feedback
  const toggleVoice = (forcedState?: boolean) => {
    const next = typeof forcedState === "boolean" ? forcedState : !voiceEnabled;
    setVoiceEnabled(next);
    try {
      localStorage.setItem("kuma_stances_voice", String(next));
    } catch (e) {}
    if (next) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance("Ayuda por voz activada");
          utterance.lang = "es-MX";
          utterance.rate = 1.1;
          window.speechSynthesis.speak(utterance);
        } catch (e) {}
      }
    } else {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    }
  };

  // Cycle Tolerance for Mobile One-Tap Chip (10 -> 15 -> 25 -> 10)
  const cycleTolerance = () => {
    setTolerance((prev) => {
      let next = 15;
      if (prev <= 10) next = 15;
      else if (prev <= 18) next = 25;
      else next = 10;
      speak(`Tolerancia ${next === 10 ? "estricta diez grados" : next === 15 ? "estándar quince grados" : "permisiva veinticinco grados"}`);
      return next;
    });
  };

  // Toggle Camera Front / Back
  const toggleFacingMode = () => {
    if (videoRef.current) {
      try {
        videoRef.current.defaultMuted = true;
        videoRef.current.muted = true;
        const p = videoRef.current.play();
        if (p !== undefined) p.catch(() => {});
        videoRef.current.pause();
      } catch (e) {}
    }
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    speak(`Cambiando a cámara ${next === "user" ? "frontal" : "trasera"}`);
  };

  // Trigger alignment beep sound
  const playBeep = () => {
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); 
      osc.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15); 
    } catch {}
  };

  // Load MediaPipe scripts dynamically
  useEffect(() => {
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

    addLog("Iniciando descarga de librerías MediaPipe...");
    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"),
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js")
    ])
      .then(() => {
        addLog("Librerías MediaPipe cargadas con éxito.");
        setScriptsLoaded(true);
      })
      .catch((err) => {
        addLog(`Error cargando librerías MediaPipe: ${err?.message || err}`);
        console.error("Error loading MediaPipe scripts:", err);
        setConnectionError("No se pudieron cargar las librerías de visión artificial.");
      });
  }, []);

  // Geometry calculations con soporte 3D métrico y filtro EMA anti-jitter
  const calculateCurrentAngles = (
    landmarks: PoseLandmark[], 
    mode: "superior" | "inferior" | "completo",
    worldLandmarks?: PoseLandmark[] | null
  ) => {
    // Si worldLandmarks está disponible, usamos coordenadas métricas 3D invariantes a perspectiva
    const lms = worldLandmarks && worldLandmarks.length >= 33 ? worldLandmarks : landmarks;
    const calcFn = worldLandmarks && worldLandmarks.length >= 33 ? calculate3DAngle : calculate2DAngle;

    let raw: { left: number; right: number; leftKnee?: number; rightKnee?: number };

    if (mode === "completo") {
      const leftElbow = calcFn(lms[11], lms[13], lms[15]);
      const rightElbow = calcFn(lms[12], lms[14], lms[16]);
      const leftKnee = calcFn(lms[23], lms[25], lms[27]);
      const rightKnee = calcFn(lms[24], lms[26], lms[28]);
      raw = { left: leftElbow, right: rightElbow, leftKnee, rightKnee };
    } else if (mode === "superior") {
      const leftElbow = calcFn(lms[11], lms[13], lms[15]);
      const rightElbow = calcFn(lms[12], lms[14], lms[16]);
      raw = { left: leftElbow, right: rightElbow };
    } else {
      const leftKnee = calcFn(lms[23], lms[25], lms[27]);
      const rightKnee = calcFn(lms[24], lms[26], lms[28]);
      raw = { left: leftKnee, right: rightKnee };
    }

    // Filtro EMA anti-jitter (alpha 0.70) para estabilizar fluctuaciones de sensor o karategi
    const prev = prevAnglesRef.current;
    const smoothed = {
      left: smoothAngle(raw.left, prev?.left ?? null, 0.7),
      right: smoothAngle(raw.right, prev?.right ?? null, 0.7),
      leftKnee: raw.leftKnee !== undefined ? smoothAngle(raw.leftKnee, prev?.leftKnee ?? null, 0.7) : undefined,
      rightKnee: raw.rightKnee !== undefined ? smoothAngle(raw.rightKnee, prev?.rightKnee ?? null, 0.7) : undefined
    };
    prevAnglesRef.current = smoothed;
    return smoothed;
  };

  const normalizeReferenceLandmarks = (current: PoseLandmark[], reference: PoseLandmark[]): PoseLandmark[] => {
    if (!current || !reference || current.length < 33 || reference.length < 33) return reference;

    const curHLeft = current[11];
    const curHRight = current[12];
    const refHLeft = reference[11];
    const refHRight = reference[12];

    if (!curHLeft || !curHRight || !refHLeft || !refHRight) return reference;

    const curCenter = { x: (curHLeft.x + curHRight.x) / 2, y: (curHLeft.y + curHRight.y) / 2 };
    const refCenter = { x: (refHLeft.x + refHRight.x) / 2, y: (refHLeft.y + refHRight.y) / 2 };

    const curWidth = Math.sqrt(Math.pow(curHLeft.x - curHRight.x, 2) + Math.pow(curHLeft.y - curHRight.y, 2));
    const refWidth = Math.sqrt(Math.pow(refHLeft.x - refHRight.x, 2) + Math.pow(refHLeft.y - refHRight.y, 2));

    const scale = curWidth / (refWidth || 1);

    return reference.map((pt) => {
      if (!pt) return pt;
      const dx = pt.x - refCenter.x;
      const dy = pt.y - refCenter.y;
      return {
        ...pt,
        x: curCenter.x + dx * scale,
        y: curCenter.y + dy * scale,
        z: pt.z ? pt.z * scale : undefined
      };
    });
  };

  // Rendering Helpers
  const getCanvasX = (x: number, w: number, isMirrored: boolean) => {
    return isMirrored ? (1 - x) * w : x * w;
  };

  const drawGhostSkeleton = (
    ctx: CanvasRenderingContext2D,
    lms: PoseLandmark[],
    w: number,
    h: number,
    color: string,
    thickness: number,
    isMirrored: boolean
  ) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(6, 182, 212, 0.8)"; 

    const drawLine = (idxA: number, idxB: number) => {
      const ptA = lms[idxA];
      const ptB = lms[idxB];
      if (ptA && ptB) {
        ctx.beginPath();
        ctx.moveTo(getCanvasX(ptA.x, w, isMirrored), ptA.y * h);
        ctx.lineTo(getCanvasX(ptB.x, w, isMirrored), ptB.y * h);
        ctx.stroke();
      }
    };

    // Body
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

    const drawGhostPoint = (idx: number) => {
      const pt = lms[idx];
      if (pt) {
        ctx.fillStyle = "rgba(6, 182, 212, 0.5)";
        ctx.beginPath();
        ctx.arc(getCanvasX(pt.x, w, isMirrored), pt.y * h, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    };
    [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].forEach(drawGhostPoint);
    ctx.restore();
  };

  const drawActiveSkeleton = (
    ctx: CanvasRenderingContext2D,
    lms: PoseLandmark[],
    w: number,
    h: number,
    leftJointColor: string,
    rightJointColor: string,
    mode: "superior" | "inferior" | "completo",
    leftKneeColor?: string,
    rightKneeColor?: string,
    isMirrored = true
  ) => {
    ctx.save();
    ctx.lineCap = "round";

    const drawJointLine = (idxA: number, idxB: number, color: string, thickness = 4) => {
      const ptA = lms[idxA];
      const ptB = lms[idxB];
      if (ptA && ptB) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.moveTo(getCanvasX(ptA.x, w, isMirrored), ptA.y * h);
        ctx.lineTo(getCanvasX(ptB.x, w, isMirrored), ptB.y * h);
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawPoint = (idx: number, color: string, radius = 6, outerRing = false) => {
      const pt = lms[idx];
      if (pt) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;

        if (outerRing) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(getCanvasX(pt.x, w, isMirrored), pt.y * h, radius + 4, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(getCanvasX(pt.x, w, isMirrored), pt.y * h, radius, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(getCanvasX(pt.x, w, isMirrored), pt.y * h, radius, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    // Hombros, cadera y torso
    drawJointLine(11, 12, "rgba(255, 255, 255, 0.85)", 3);
    drawJointLine(11, 23, "rgba(255, 255, 255, 0.8)", 3);
    drawJointLine(12, 24, "rgba(255, 255, 255, 0.8)", 3);
    drawJointLine(23, 24, "rgba(255, 255, 255, 0.85)", 3);

    if (mode === "completo") {
      drawJointLine(11, 13, leftJointColor, 4);
      drawJointLine(13, 15, leftJointColor, 4);
      drawJointLine(12, 14, rightJointColor, 4);
      drawJointLine(14, 16, rightJointColor, 4);

      const lkColor = leftKneeColor || leftJointColor;
      const rkColor = rightKneeColor || rightJointColor;
      drawJointLine(23, 25, lkColor, 4);
      drawJointLine(25, 27, lkColor, 4);
      drawJointLine(24, 26, rkColor, 4);
      drawJointLine(26, 28, rkColor, 4);

      drawPoint(13, leftJointColor, 7, true);
      drawPoint(14, rightJointColor, 7, true);
      drawPoint(25, lkColor, 7, true);
      drawPoint(26, rkColor, 7, true);
    } else if (mode === "superior") {
      drawJointLine(11, 13, leftJointColor, 4);
      drawJointLine(13, 15, leftJointColor, 4);
      drawJointLine(12, 14, rightJointColor, 4);
      drawJointLine(14, 16, rightJointColor, 4);

      drawJointLine(23, 25, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(25, 27, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(24, 26, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(26, 28, "rgba(255, 255, 255, 0.6)", 3);
      
      drawPoint(13, leftJointColor, 7, true);
      drawPoint(14, rightJointColor, 7, true);
    } else {
      drawJointLine(11, 13, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(13, 15, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(12, 14, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(14, 16, "rgba(255, 255, 255, 0.6)", 3);

      drawJointLine(23, 25, leftJointColor, 4);
      drawJointLine(25, 27, leftJointColor, 4);
      drawJointLine(24, 26, rightJointColor, 4);
      drawJointLine(26, 28, rightJointColor, 4);
      
      drawPoint(25, leftJointColor, 7, true);
      drawPoint(26, rightJointColor, 7, true);
    }

    [11, 12, 15, 16, 23, 24, 27, 28].forEach((idx) => drawPoint(idx, "rgba(255, 255, 255, 0.8)", 4));
    
    ctx.restore();
  };

  const drawCenterOfGravity = (ctx: CanvasRenderingContext2D, lms: PoseLandmark[], w: number, h: number, isMirrored: boolean) => {
    const ankleL = lms[27];
    const ankleR = lms[28];
    const shoulderL = lms[11];
    const shoulderR = lms[12];
    const hipL = lms[23];
    const hipR = lms[24];

    if (ankleL && ankleR && shoulderL && shoulderR && hipL && hipR) {
      const comX = (shoulderL.x + shoulderR.x + hipL.x + hipR.x) / 4;
      const torsoTopY = (shoulderL.y + shoulderR.y) / 2;
      const baseFloorY = (ankleL.y + ankleR.y) / 2;

      const drawComX = getCanvasX(comX, w, isMirrored);
      const drawTorsoTopY = torsoTopY * h;
      const drawFloorY = baseFloorY * h;
      const drawAnkleLX = getCanvasX(ankleL.x, w, isMirrored);
      const drawAnkleRX = getCanvasX(ankleR.x, w, isMirrored);

      const isStable = comX >= Math.min(ankleL.x, ankleR.x) && comX <= Math.max(ankleL.x, ankleR.x);
      const balanceColor = isStable ? "rgba(34, 197, 94, 0.85)" : "rgba(239, 68, 68, 0.9)";

      ctx.save();
      // Linea de gravedad
      ctx.strokeStyle = balanceColor;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]); 
      ctx.shadowBlur = 8;
      ctx.shadowColor = balanceColor;
      ctx.beginPath();
      ctx.moveTo(drawComX, drawTorsoTopY);
      ctx.lineTo(drawComX, drawFloorY);
      ctx.stroke();

      // Base
      ctx.setLineDash([]); 
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(drawAnkleLX, drawFloorY);
      ctx.lineTo(drawAnkleRX, drawFloorY);
      ctx.stroke();

      // Centro
      ctx.fillStyle = balanceColor;
      ctx.beginPath();
      ctx.arc(drawComX, drawFloorY, 5, 0, 2 * Math.PI);
      ctx.fill();

      if (!isStable) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.95)";
        ctx.font = "bold 9px monospace";
        ctx.shadowBlur = 2;
        ctx.shadowColor = "#000000";
        ctx.fillText("DESEQUILIBRADO", drawComX + 8, drawFloorY - 8);
      }
      ctx.restore();
    }
  };

  const drawAnglesOnSkeleton = (ctx: CanvasRenderingContext2D, lms: PoseLandmark[], w: number, h: number, currentAngles: any, mode: string, isMirrored: boolean) => {
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 4;
    ctx.shadowColor = "#000000";

    if (mode === "completo" || mode === "superior") {
      const elbowL = lms[13];
      const elbowR = lms[14];
      if (elbowL) ctx.fillText(`${currentAngles.left}°`, getCanvasX(elbowL.x, w, isMirrored) + 10, elbowL.y * h);
      if (elbowR) ctx.fillText(`${currentAngles.right}°`, getCanvasX(elbowR.x, w, isMirrored) - 35, elbowR.y * h);
    }
    if (mode === "completo" || mode === "inferior") {
      const kneeL = lms[25];
      const kneeR = lms[26];
      const leftVal = mode === "completo" ? currentAngles.leftKnee : currentAngles.left;
      const rightVal = mode === "completo" ? currentAngles.rightKnee : currentAngles.right;
      if (kneeL) ctx.fillText(`${leftVal}°`, getCanvasX(kneeL.x, w, isMirrored) + 10, kneeL.y * h);
      if (kneeR) ctx.fillText(`${rightVal}°`, getCanvasX(kneeR.x, w, isMirrored) - 35, kneeR.y * h);
    }
  };

  // Main evaluation logic called by MediaPipe loop
  const handlePoseResults = (results: any) => {
    const landmarks = results.poseLandmarks;
    const worldLandmarks = results.poseWorldLandmarks;
    if (!landmarks) {
      latestPoseLandmarksRef.current = null;
      latestWorldLandmarksRef.current = null;
      if (alignmentMetricsRef.current.score !== 0) {
        alignmentMetricsRef.current = { score: 0, aligned: false };
        setAlignmentMetrics({ score: 0, aligned: false });
        setShotokanFeedback(null);
      }
      return;
    }

    latestPoseLandmarksRef.current = landmarks;
    latestWorldLandmarksRef.current = worldLandmarks || null;

    const mode = analysisModeRef.current || "completo";
    const currentAngles = calculateCurrentAngles(landmarks, mode, worldLandmarks);

    let targetLeft: number | null = null;
    let targetRight: number | null = null;
    let targetLeftKnee: number | null = null;
    let targetRightKnee: number | null = null;
    let referenceLandmarks: PoseLandmark[] | null = null;

    const cap = localCaptureRef.current;
    const activePreset = currentPresetRef.current;

    if (cap) {
      targetLeft = cap.angles.left;
      targetRight = cap.angles.right;
      if (mode === "completo") {
        targetLeftKnee = cap.angles.leftKnee || cap.angles.left;
        targetRightKnee = cap.angles.rightKnee || cap.angles.right;
      }
      referenceLandmarks = cap.landmarks;
    } else if (activePreset) {
      targetLeft = activePreset.angles.left;
      targetRight = activePreset.angles.right;
      if (mode === "completo") {
        targetLeftKnee = activePreset.angles.leftKnee || activePreset.angles.left;
        targetRightKnee = activePreset.angles.rightKnee || activePreset.angles.right;
      }
      referenceLandmarks = activePreset.landmarks;
    }

    let leftColor = "rgba(255, 0, 0, 0.8)";
    let rightColor = "rgba(255, 0, 0, 0.8)";
    let leftKneeColor = "rgba(255, 0, 0, 0.8)";
    let rightKneeColor = "rgba(255, 0, 0, 0.8)";

    const tol = toleranceRef.current; 
    let score = 0;
    let aligned = false;

    // Evaluación Canónica Shotokan (JKA Kihon Anatomy)
    const presetNameLower = (activePreset?.name || "").toLowerCase();
    let canonicalResult: any = null;

    if (!cap && activePreset) {
      if (presetNameLower.includes("zenkutsu") || presetNameLower.includes("adelantada")) {
        canonicalResult = analyzeZenkutsuDachi(landmarks, worldLandmarks);
      } else if (presetNameLower.includes("kokutsu") || presetNameLower.includes("atrasada")) {
        canonicalResult = analyzeKokutsuDachi(landmarks, worldLandmarks);
      } else if (presetNameLower.includes("kiba") || presetNameLower.includes("jinete")) {
        canonicalResult = analyzeKibaDachi(landmarks, worldLandmarks);
      }
    }

    if (canonicalResult) {
      score = canonicalResult.score;
      aligned = canonicalResult.isValid;

      // Colores de articulaciones basados en análisis biomecánico
      const goodColor = "rgba(34, 197, 94, 0.85)";
      const warnColor = "rgba(239, 68, 68, 0.8)";
      if (canonicalResult.isValid) {
        leftColor = goodColor;
        rightColor = goodColor;
        leftKneeColor = goodColor;
        rightKneeColor = goodColor;
      } else {
        leftColor = score >= 70 ? goodColor : warnColor;
        rightColor = score >= 70 ? goodColor : warnColor;
        leftKneeColor = score >= 75 ? goodColor : warnColor;
        rightKneeColor = score >= 75 ? goodColor : warnColor;
      }
    } else if (referenceLandmarks && targetLeft !== null && targetRight !== null) {
      // Evaluation genérica contra preset de ángulos
      const diffL = Math.abs(currentAngles.left - targetLeft);
      const diffR = Math.abs(currentAngles.right - targetRight);

      if (diffL <= tol) leftColor = "rgba(34, 197, 94, 0.85)";
      if (diffR <= tol) rightColor = "rgba(34, 197, 94, 0.85)";

      let totalDiff = diffL + diffR;
      let count = 2;

      if (mode === "completo" && targetLeftKnee !== null && targetRightKnee !== null && (currentAngles as any).leftKnee !== undefined) {
        const diffLK = Math.abs((currentAngles as any).leftKnee - targetLeftKnee);
        const diffRK = Math.abs((currentAngles as any).rightKnee - targetRightKnee);

        if (diffLK <= tol) leftKneeColor = "rgba(34, 197, 94, 0.85)";
        if (diffRK <= tol) rightKneeColor = "rgba(34, 197, 94, 0.85)";

        totalDiff += diffLK + diffRK;
        count = 4;
        aligned = diffL <= tol && diffR <= tol && diffLK <= tol && diffRK <= tol;
      } else {
        aligned = diffL <= tol && diffR <= tol;
      }

      const averageDiff = totalDiff / count;
      const maxDiff = 50; // threshold for 0 score
      score = Math.round(Math.max(0, 100 - (averageDiff / maxDiff) * 100));
    }

    // Desacople de alta frecuencia: actualizar estado de React throttled a ~5 FPS
    // o inmediatamente si hubo transición de estado (aligned toggle para audio)
    const now = performance.now();
    const hasAlignmentTransition = aligned !== alignmentMetricsRef.current.aligned;
    const isTimeToUpdateReact = (now - lastMetricsUpdateRef.current) > 200;

    if (hasAlignmentTransition || isTimeToUpdateReact) {
      lastMetricsUpdateRef.current = now;
      alignmentMetricsRef.current = { score, aligned };
      setAlignmentMetrics({ score, aligned });

      if (canonicalResult) {
        setShotokanFeedback({
          stanceName: canonicalResult.stanceName,
          feedback: canonicalResult.feedback,
          koshi: canonicalResult.metrics?.orientacionKoshi,
          valgo: Boolean(canonicalResult.metrics?.valgoDetectado),
          metrics: canonicalResult.metrics
        });
      } else {
        const koshi = calculateKoshiAngle(landmarks);
        setShotokanFeedback({
          stanceName: activePreset?.name || "Captura Personalizada",
          feedback: aligned ? "Alineación óptima mantenida" : "Ajusta tus articulaciones a la silueta",
          koshi: koshi.mode !== "indeterminado" ? koshi.mode : undefined,
          valgo: false
        });
      }
    }

    // Audio alerts
    if (aligned && !hasTriggeredAlignRef.current) {
      hasTriggeredAlignRef.current = true;
      playBeep();
      if (canonicalResult?.feedback) {
        speak(canonicalResult.feedback);
      } else {
        speak("¡Alineación correcta!");
      }
    } else if (score < 75) {
      hasTriggeredAlignRef.current = false;
    }

    activeColorsRef.current = { leftColor, rightColor, leftKneeColor, rightKneeColor };
  };

  // MediaPipe initialization effect
  useEffect(() => {
    if (!scriptsLoaded || !cameraActive) return;
    if (!videoRef.current || !canvasRef.current) return;

    addLog(`Chequeando window.Pose (Intento ${checkAttempts + 1}/10)...`);
    const PoseClass = (window as any).Pose;
    if (!PoseClass) {
      if (checkAttempts < 10) {
        addLog("window.Pose no encontrado. Programando reintento en 500ms...");
        const timer = setTimeout(() => {
          setCheckAttempts((prev) => prev + 1);
        }, 500);
        return () => clearTimeout(timer);
      } else {
        addLog("Error: window.Pose no encontrado tras 10 intentos.");
        console.error("Pose class not found on window after 10 attempts");
        setConnectionError("No se pudo iniciar el motor de visión artificial (Pose class not found). Por favor recarga la página.");
        return;
      }
    }

    addLog("window.Pose encontrado. Inicializando instancia...");
    const pose = new PoseClass({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1, // 1 is faster for client-only, 2 is higher quality. Use 1 for maximum framerate.
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.45
    });

    pose.onResults(handlePoseResults);
    poseInstanceRef.current = pose;
    addLog("Instancia MediaPipe Pose configurada y lista.");

    let activeStream: MediaStream | null = null;
    let animationFrameId: number | null = null;
    let isProcessing = false;
    let lastFrameTime = 0;
    const frameInterval = 1000 / 22; // Throttle to 22 FPS to prevent CPU/GPU overload on high refresh rate mobile screens

    const startCamera = async () => {
      try {
        addLog(`Iniciando cámara con facingMode: ${facingMode}...`);
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        };
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          addLog("Stream obtenido con constraints ideales.");
        } catch (constraintsErr) {
          addLog(`Constraints ideales fallaron, intentando fallback...`);
          console.warn("Failed with strict camera constraints, trying fallback video: true", constraintsErr);
          // Fallback to basic video stream without ideal resolution
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          addLog("Stream obtenido con constraints fallback.");
        }
        activeStream = stream;
        
        if (videoRef.current) {
          // Fix React muted autoplay check bug explicitly:
          videoRef.current.defaultMuted = true;
          videoRef.current.muted = true;
          videoRef.current.srcObject = stream;
          addLog("Stream asignado a videoRef.");
          videoRef.current.play()
            .then(() => addLog("Video reproduciéndose inmediatamente."))
            .catch(e => addLog(`Fallo play inmediato: ${e?.message || e}`));
          videoRef.current.onloadedmetadata = () => {
            addLog("Metadata del video cargada.");
            videoRef.current?.play()
              .then(() => addLog("Video reproduciéndose en metadata."))
              .catch(e => addLog(`Fallo play metadata: ${e?.message || e}`));
          };
        }

        let firstFrameLogged = false;

        const processFrame = async () => {
          if (!videoRef.current || !canvasRef.current || !cameraActive) return;
          
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          
          try {
            if (ctx) {
              if (!firstFrameLogged) {
                addLog(`FrameLoop - readyState: ${video.readyState}, size: ${video.videoWidth}x${video.videoHeight}`);
                firstFrameLogged = true;
              }

              if (video.readyState >= 2 && video.videoWidth > 0) {
                // 1. Ensure canvas dimensions match video
                if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                  canvas.width = video.videoWidth;
                  canvas.height = video.videoHeight;
                  addLog(`Ajustando tamaño canvas a ${canvas.width}x${canvas.height}`);
                }
                
                const currentAspect = video.videoWidth / video.videoHeight;
                if (Math.abs(aspectRatioRef.current - currentAspect) > 0.01) {
                  setAspectRatio(currentAspect);
                }
                
                const width = canvas.width;
                const height = canvas.height;
                const isMirrored = facingModeRef.current === "user";
                
                // 2. Clear canvas
                ctx.clearRect(0, 0, width, height);
                
                // 3. Draw video frame
                ctx.save();
                if (isMirrored) {
                  ctx.translate(width, 0);
                  ctx.scale(-1, 1);
                }
                ctx.drawImage(video, 0, 0, width, height);
                ctx.restore();
                
                // 4. Draw reference ghost skeleton
                let referenceLandmarks: PoseLandmark[] | null = null;
                let isUsingLocalCapture = false;
                
                const cap = localCaptureRef.current;
                const activePreset = currentPresetRef.current;
                const mode = analysisModeRef.current || "completo";
                
                if (cap) {
                  referenceLandmarks = cap.landmarks;
                  isUsingLocalCapture = true;
                } else if (activePreset) {
                  referenceLandmarks = activePreset.landmarks;
                }
                
                if (referenceLandmarks && latestPoseLandmarksRef.current) {
                  const normalizedLms = normalizeReferenceLandmarks(latestPoseLandmarksRef.current, referenceLandmarks);
                  const ghostColor = isUsingLocalCapture ? "rgba(250, 204, 21, 0.5)" : "rgba(6, 182, 212, 0.45)";
                  drawGhostSkeleton(ctx, normalizedLms, width, height, ghostColor, 5, isMirrored);
                }
                
                // 5. Draw active skeleton & overlays
                const landmarks = latestPoseLandmarksRef.current;
                if (landmarks) {
                  const colors = activeColorsRef.current || {
                    leftColor: "rgba(255, 0, 0, 0.8)",
                    rightColor: "rgba(255, 0, 0, 0.8)",
                    leftKneeColor: "rgba(255, 0, 0, 0.8)",
                    rightKneeColor: "rgba(255, 0, 0, 0.8)"
                  };
                  
                  drawActiveSkeleton(
                    ctx, 
                    landmarks, 
                    width, 
                    height, 
                    colors.leftColor, 
                    colors.rightColor, 
                    mode, 
                    colors.leftKneeColor, 
                    colors.rightKneeColor, 
                    isMirrored
                  );
                  
                  drawCenterOfGravity(ctx, landmarks, width, height, isMirrored);
                  
                  const currentAngles = calculateCurrentAngles(landmarks, mode, latestWorldLandmarksRef.current);
                  drawAnglesOnSkeleton(ctx, landmarks, width, height, currentAngles, mode, isMirrored);
                }
                
                // 6. Send to MediaPipe pose detector at throttled interval
                const now = performance.now();
                const elapsed = now - lastFrameTime;
                if (elapsed >= frameInterval) {
                  if (!isProcessing) {
                    isProcessing = true;
                    try {
                      await pose.send({ image: video });
                      lastFrameTime = now;
                    } catch (err: any) {
                      addLog(`Error enviando frame a pose: ${err?.message || err}`);
                      console.error("Error sending image to pose:", err);
                    }
                    isProcessing = false;
                  }
                }
              }
            }
          } catch (loopErr: any) {
            addLog(`Error en FrameLoop: ${loopErr?.message || loopErr}`);
          } finally {
            animationFrameId = requestAnimationFrame(processFrame);
          }
        };

        animationFrameId = requestAnimationFrame(processFrame);
      } catch (err: any) {
        addLog(`Error en startCamera: ${err?.message || err}`);
        console.error("Error starting camera:", err);
        setConnectionError("No se pudo acceder a la cámara. Por favor asegúrate de dar los permisos correspondientes.");
      }
    };

    startCamera();

    return () => {
      addLog("Desmontando cámara y limpiando recursos...");
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (poseInstanceRef.current) {
        try { poseInstanceRef.current.close(); } catch {}
      }
    };
  }, [scriptsLoaded, cameraActive, facingMode, checkAttempts]);

  // Handle dropdown selection change
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    setLocalCapture(null);
    localCaptureRef.current = null;
    const found = presets.find((p) => p._id === presetId);
    if (found) {
      setCurrentPreset(found);
      if (found.category) {
        setAnalysisMode(found.category as any);
      }
      hasTriggeredAlignRef.current = false;
      speak(`Cargando postura: ${found.name}`);
    } else {
      setCurrentPreset(null);
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100dvh-5rem)] sm:h-[calc(100dvh-5rem)] flex flex-col justify-between overflow-x-hidden overflow-y-auto sm:overflow-hidden bg-zinc-950 text-white select-none">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-kuma-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute right-10 top-[15%] text-[20vw] font-black text-white/[0.02] select-none pointer-events-none leading-none z-0 font-serif hidden sm:block">
        姿勢
      </div>

      {/* Top Header Bar */}
      <header className="w-full flex items-center justify-between pl-16 sm:pl-8 pr-3 sm:pr-8 py-2.5 sm:py-3 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl z-30 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/resources/aplicaciones"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-kuma-gold transition-colors py-1.5 px-2.5 sm:px-3 rounded-xl hover:bg-white/5 active:scale-95 text-xs font-bold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold"
            aria-label="Volver a Aplicaciones"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Aplicaciones</span>
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-kuma-gold font-serif text-sm font-bold tracking-widest">姿勢</span>
            <span className="text-white font-black text-xs sm:text-sm tracking-wider uppercase font-serif">Kuma Stances</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-kuma-gold border border-amber-500/30 uppercase tracking-widest hidden md:inline">
              Visión IA 3D
            </span>
          </div>
        </div>

        {/* Quick Header Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Voice toggle */}
          <button
            type="button"
            onClick={() => toggleVoice()}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold ${
              voiceEnabled 
                ? "bg-amber-500/15 border-kuma-gold/50 text-kuma-gold shadow-[0_0_15px_rgba(234,179,8,0.2)]" 
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
            }`}
            title={voiceEnabled ? "Desactivar ayuda por voz" : "Activar ayuda por voz"}
            aria-label={voiceEnabled ? "Desactivar voz" : "Activar voz"}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-kuma-gold" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[10px] sm:text-[11px] font-bold hidden xs:inline">{voiceEnabled ? "Voz Activa" : "Silencio"}</span>
          </button>

          {/* Settings Drawer Button */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all active:scale-95 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold"
            title="Ajustes de análisis"
            aria-label="Abrir ajustes de análisis"
          >
            <SlidersHorizontal className="w-4 h-4 text-kuma-gold" />
            <span className="text-[11px] font-bold inline">Ajustes</span>
          </button>

          {/* Camera Stop button if active */}
          {cameraActive && (
            <button
              type="button"
              onClick={() => setCameraActive(false)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white transition-all active:scale-95 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Detener</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Arena Stage */}
      <main className="flex-1 w-full relative flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {isConnecting ? (
          <div className="m-auto flex flex-col items-center justify-center p-8 sm:p-12 bg-zinc-900/60 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4">
            <RefreshCw className="w-8 sm:w-10 h-8 sm:h-10 text-kuma-gold animate-spin" />
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-400">Cargando catálogo oficial de posturas...</p>
          </div>
        ) : !cameraActive ? (
          /* DOJO LOBBY: Centrado, responsivo, protegido contra cortes en móvil */
          <div className="w-full max-w-4xl mx-auto my-auto flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 py-2">
            {/* Hero Header */}
            <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto px-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-kuma-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Laboratorio de Biomecánica Shotokan
              </div>
              <PrimalTitle className="text-2xl sm:text-4xl md:text-5xl uppercase tracking-widest text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                Kuma Stances
              </PrimalTitle>
              <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Ponte a 2-3 metros frente a la cámara. Detección en tiempo real de ángulos articulares, rotación pélvica (<strong className="text-kuma-gold font-bold">Koshi</strong>) y prevención de valgo articular.
              </p>
            </div>

            {/* Stance Selector Cards */}
            <div className="w-full space-y-2 sm:space-y-3 px-1 sm:px-0">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-kuma-gold">
                  Selecciona tu Postura a Evaluar
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  {presets.length} Oficiales
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {presets.map((preset) => {
                  const isSelected = selectedPresetId === preset._id && !localCapture;
                  return (
                    <button
                      key={preset._id}
                      type="button"
                      onClick={() => handlePresetChange(preset._id)}
                      className={`group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-300 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold flex flex-col justify-between h-24 sm:h-32 ${
                        isSelected
                          ? "bg-gradient-to-b from-amber-500/20 to-zinc-900 border-kuma-gold shadow-[0_0_25px_rgba(234,179,8,0.25)] ring-1 ring-kuma-gold"
                          : "bg-zinc-900/40 hover:bg-zinc-900/80 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isSelected 
                              ? "bg-kuma-gold/20 text-kuma-gold border-kuma-gold/40" 
                              : "bg-white/5 text-zinc-400 border-white/10"
                          }`}>
                            {preset.category || "Completo"}
                          </span>
                          <h4 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-wide text-white font-serif mt-1 sm:mt-1.5 group-hover:text-kuma-gold transition-colors">
                            {preset.name}
                          </h4>
                        </div>
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected ? "bg-kuma-gold border-kuma-gold text-black" : "border-white/20 text-transparent"
                        }`}>
                          <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                      </div>

                      <div className="text-[10px] sm:text-[11px] text-zinc-400 flex items-center gap-1.5 sm:gap-2 pt-1.5 border-t border-white/5">
                        <span>L: <strong className="text-zinc-200 tabular-nums">{preset.angles?.left}°</strong></span>
                        <span>•</span>
                        <span>R: <strong className="text-zinc-200 tabular-nums">{preset.angles?.right}°</strong></span>
                        {preset.angles?.leftKnee !== undefined && (
                          <>
                            <span>•</span>
                            <span>K: <strong className="text-zinc-200 tabular-nums">{preset.angles?.leftKnee}°</strong></span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Call to Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 sm:pt-2 w-full sm:w-auto px-2">
              <button
                disabled={!scriptsLoaded}
                onClick={() => {
                  if (videoRef.current) {
                    try {
                      videoRef.current.defaultMuted = true;
                      videoRef.current.muted = true;
                      const playPromise = videoRef.current.play();
                      if (playPromise !== undefined) playPromise.catch(() => {});
                      videoRef.current.pause();
                    } catch (e) {}
                  }
                  setCameraActive(true);
                }}
                className="w-full sm:w-auto group relative px-6 sm:px-10 py-3.5 sm:py-4.5 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs sm:text-sm md:text-base uppercase tracking-widest shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform text-white shrink-0" />
                <span>{scriptsLoaded ? "ENCENDER CÁMARA Y EVALUAR" : "CARGANDO MODELO IA..."}</span>
              </button>
            </div>
          </div>
        ) : (
          /* SMART MIRROR ARENA: Cámara Activa a pantalla completa y adaptada a móvil */
          <div className="relative w-full h-full max-w-[1400px] mx-auto flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-black shadow-2xl">
            {/* The video and canvas */}
            <video
              ref={videoRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0.01,
                pointerEvents: "none",
                zIndex: 0,
                objectFit: "contain",
                transform: facingMode === "user" ? "scaleX(-1)" : "none"
              }}
              width="640"
              height="480"
              playsInline
              muted
              autoPlay
            />

            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="relative w-full h-full z-10 object-contain bg-black"
            />

            {/* Dojo Crosshair Accents */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-l-2 border-kuma-gold/50 pointer-events-none z-20" />
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-r-2 border-kuma-gold/50 pointer-events-none z-20" />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-l-2 border-kuma-gold/50 pointer-events-none z-20" />
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-r-2 border-kuma-gold/50 pointer-events-none z-20" />

            {/* UNIFIED RESPONSIVE TOP HUD BAR: Diseñado para evitar CUALQUIER colisión en pantallas móviles */}
            <div className="absolute top-2.5 inset-x-2.5 sm:top-5 sm:inset-x-5 flex flex-col gap-1.5 sm:gap-2 z-30 pointer-events-none">
              {/* Row 1: Stance Pill + Controls (Left) and Alignment Score (Right) in a flex row */}
              <div className="flex items-center justify-between gap-2 w-full">
                {/* Left: Stance badge and quick controls */}
                <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto shrink-0 flex-wrap">
                  <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/15 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-2 shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[8px] sm:text-[9px] text-zinc-400 font-bold uppercase tracking-widest hidden xs:inline">Guía</span>
                      <span className="text-xs sm:text-sm font-black text-white font-serif uppercase tracking-wide truncate max-w-[80px] sm:max-w-[180px]">
                        {localCapture ? "Local" : (currentPreset?.name || "Kihon")}
                      </span>
                    </div>
                  </div>

                  {/* Botón Modo Espejo / Cámara Móvil con Texto Descriptivo */}
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 border border-white/15 text-white active:scale-95 transition-all shadow-md flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold"
                    title={facingMode === "user" ? "Modo Espejo (Frontal) - Toca para cambiar" : "Cámara Trasera - Toca para modo espejo"}
                    aria-label="Modo Espejo"
                  >
                    <SwitchCamera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-kuma-gold shrink-0" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-200">
                      {facingMode === "user" ? "Espejo" : "Trasera"}
                    </span>
                  </button>

                  {/* Botón de Capturar o Liberar Posición: Altamente Descriptivo */}
                  {localCapture ? (
                    <button
                      type="button"
                      onClick={() => {
                        localCaptureRef.current = null;
                        setLocalCapture(null);
                        hasTriggeredAlignRef.current = false;
                        speak("Captura de referencia liberada.");
                      }}
                      className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 hover:text-white active:scale-95 transition-all shadow-md flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold"
                      title="Liberar postura congelada y volver al catálogo"
                      aria-label="Liberar posición"
                    >
                      <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                        Liberar <span className="hidden sm:inline">Posición</span>
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!latestPoseLandmarksRef.current}
                      onClick={() => {
                        if (latestPoseLandmarksRef.current && latestPoseLandmarksRef.current.length > 0) {
                          const mode = analysisMode;
                          const angles = calculateCurrentAngles(latestPoseLandmarksRef.current, mode);
                          const captured = {
                            landmarks: [...latestPoseLandmarksRef.current],
                            angles: { ...angles },
                            mode: mode
                          };
                          setSelectedPresetId("");
                          setCurrentPreset(null);
                          currentPresetRef.current = null;
                          localCaptureRef.current = captured;
                          setLocalCapture(captured);
                          hasTriggeredAlignRef.current = false;
                          speak("Posición capturada.");
                        }
                      }}
                      className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/50 text-kuma-gold hover:text-white active:scale-95 transition-all shadow-md flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold"
                      title="Capturar tu postura actual como guía"
                      aria-label="Capturar posición"
                    >
                      <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-kuma-gold shrink-0" />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                        Capturar <span className="hidden sm:inline">Posición</span>
                      </span>
                    </button>
                  )}
                </div>

                {/* Right: Score Pill (flex-aligned, will NEVER collide with the left side) */}
                <div className="bg-zinc-950/90 backdrop-blur-2xl border border-white/20 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-2xl pointer-events-auto shrink-0">
                  <div className="flex flex-col text-right">
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400">Score</span>
                    <span className={`text-xl sm:text-3xl md:text-4xl font-black font-mono tabular-nums leading-none ${
                      alignmentMetrics.aligned ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" : "text-amber-400"
                    }`}>
                      {alignmentMetrics.score}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Biomechanical feedback badges (below row 1, zero overlap) */}
              {shotokanFeedback && (
                <div className="flex items-center gap-1.5 pointer-events-auto flex-wrap">
                  {shotokanFeedback.koshi && (
                    <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-zinc-950/85 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-zinc-300 shadow-md">
                      <Compass className="w-3 h-3 text-kuma-gold" />
                      <span className="text-zinc-500 text-[9px] uppercase">Koshi:</span>
                      <span className="text-white uppercase">{shotokanFeedback.koshi}</span>
                    </div>
                  )}
                  {shotokanFeedback.valgo && (
                    <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-red-950/85 backdrop-blur-md border border-red-500/40 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-red-400 animate-pulse shadow-md">
                      <ShieldAlert className="w-3 h-3 text-red-500" />
                      <span>Valgo</span>
                    </div>
                  )}
                  {shotokanFeedback.feedback && (
                    <div className="px-2 py-0.5 rounded-lg bg-zinc-950/85 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-medium text-zinc-300 italic shadow-md max-w-[220px] sm:max-w-xs truncate">
                      {shotokanFeedback.feedback}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* HUD BOTTOM DOCK: Floating Stances Bar con soporte a la barra de gestos de Android */}
            <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-2 sm:inset-x-4 max-w-2xl mx-auto bg-zinc-950/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-1.5 sm:p-2 flex items-center justify-between gap-1.5 sm:gap-2 shadow-2xl z-30">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 w-full">
                {presets.map((preset) => {
                  const isSelected = selectedPresetId === preset._id && !localCapture;
                  return (
                    <button
                      key={preset._id}
                      type="button"
                      onClick={() => handlePresetChange(preset._id)}
                      className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 active:scale-95 flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold ${
                        isSelected
                          ? "bg-kuma-gold text-black font-black shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                          : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10"
                      }`}
                    >
                      <span>{preset.name}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider shrink-0 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold"
                title="Ajustes de Biomecánica"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-kuma-gold shrink-0" />
                <span>Ajustes</span>
              </button>

              <button
                type="button"
                onClick={() => setCameraActive(false)}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-[11px] sm:text-xs font-bold uppercase tracking-wider shrink-0 active:scale-95 transition-all flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold"
                title="Salir de la cámara"
              >
                <X className="w-3.5 h-3.5 shrink-0" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        )}

        {/* Connection Error Banner */}
        {connectionError && (
          <div className="absolute bottom-6 inset-x-4 max-w-md mx-auto bg-red-950/90 border border-red-500/40 text-red-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 z-50">
            <div className="flex items-center gap-2 text-xs font-bold">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{connectionError}</span>
            </div>
            <button
              onClick={() => setConnectionError("")}
              className="p-1 rounded-lg text-red-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Settings Modal Drawer - Responsive Bottom Sheet para móviles y centrado en pantallas grandes */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-3 sm:inset-x-4 bottom-2 sm:bottom-auto sm:top-[8%] max-w-lg mx-auto bg-zinc-950 border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl z-50 space-y-4 sm:space-y-5 max-h-[88dvh] overflow-y-auto overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-kuma-gold" />
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white font-serif">
                    Ajustes de Biomecánica
                  </h3>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold"
                  aria-label="Cerrar ajustes"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tolerance slider */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Tolerancia Articular
                  </label>
                  <span className="text-xs font-black text-kuma-gold tabular-nums px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    ±{tolerance}°
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={35}
                  step={1}
                  value={tolerance}
                  onChange={(e) => setTolerance(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setTolerance(10)}
                    className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95 ${
                      tolerance === 10
                        ? "bg-amber-500/20 border-kuma-gold text-kuma-gold font-bold shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                        : "bg-zinc-950/60 border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="block text-[11px] font-bold uppercase">10° Dan</span>
                    <span className="block text-[9px] text-zinc-500">Estricto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTolerance(15)}
                    className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95 ${
                      tolerance === 15
                        ? "bg-amber-500/20 border-kuma-gold text-kuma-gold font-bold shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                        : "bg-zinc-950/60 border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="block text-[11px] font-bold uppercase">15° Dojo</span>
                    <span className="block text-[9px] text-zinc-500">Estándar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTolerance(25)}
                    className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95 ${
                      tolerance === 25
                        ? "bg-amber-500/20 border-kuma-gold text-kuma-gold font-bold shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                        : "bg-zinc-950/60 border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="block text-[11px] font-bold uppercase">25° Inic</span>
                    <span className="block text-[9px] text-zinc-500">Permisivo</span>
                  </button>
                </div>
              </div>

              {/* Analysis Mode */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Segmentos de Detección
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: "superior" as const, label: "Superior", desc: "Brazos" },
                    { value: "inferior" as const, label: "Inferior", desc: "Piernas" },
                    { value: "completo" as const, label: "Completo", desc: "Todo" }
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAnalysisMode(opt.value)}
                      className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer active:scale-95 flex flex-col items-center justify-center min-h-[50px] ${
                        analysisMode === opt.value
                          ? "bg-amber-500/20 border-kuma-gold text-kuma-gold font-bold shadow-[0_0_15px_rgba(234,179,8,0.25)] ring-1 ring-kuma-gold/50"
                          : "bg-zinc-950/60 border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="block text-xs font-black uppercase tracking-wider">{opt.label}</span>
                      <span className={`block text-[10px] mt-0.5 ${analysisMode === opt.value ? "text-amber-300 font-semibold" : "text-zinc-500"}`}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice and Camera toggles */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleVoice()}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    voiceEnabled
                      ? "bg-amber-500/15 border-kuma-gold/50 text-white"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Guía Vocal</span>
                    {voiceEnabled ? <Volume2 className="w-4 h-4 text-kuma-gold" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-bold mt-1 text-kuma-gold">
                    {voiceEnabled ? "Voz Activa" : "Silenciado"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextMode = facingMode === "user" ? "environment" : "user";
                    setFacingMode(nextMode);
                    speak(nextMode === "user" ? "Modo espejo frontal activado" : "Cámara trasera activada");
                  }}
                  className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-left transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Modo Espejo</span>
                    <SwitchCamera className="w-4 h-4 text-kuma-gold" />
                  </div>
                  <span className="text-xs font-bold mt-1 text-white">
                    {facingMode === "user" ? "Espejo (Frontal)" : "Trasera"}
                  </span>
                </button>
              </div>

              {/* Tips Box */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex gap-2.5 items-start text-xs text-zinc-400 leading-relaxed">
                <HelpCircle className="w-4 h-4 text-kuma-gold shrink-0 mt-0.5" />
                <span>
                  Colócate a 2-3 metros para que tu silueta completa sea capturada. La IA calibra automáticamente tu estatura y calcula vectores articulares en tiempo real.
                </span>
              </div>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuma-gold"
              >
                Guardar y Volver al Dojo
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
