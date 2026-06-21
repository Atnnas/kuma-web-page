"use client";

import { useState, useEffect, useRef } from "react";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { ArrowLeft, Camera, RefreshCw, AlertCircle, Play, SlidersHorizontal, Maximize2, CheckCircle, HelpCircle, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

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
  const wakeLockRef = useRef<any>(null);
  
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
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [alignmentMetrics, setAlignmentMetrics] = useState({ score: 0, aligned: false });

  // Refs for video & canvas
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseInstanceRef = useRef<any>(null);
  const cameraInstanceRef = useRef<any>(null);
  const latestPoseLandmarksRef = useRef<PoseLandmark[] | null>(null);

  // Sync refs to avoid stale closures in MediaPipe's async callback loop
  const toleranceRef = useRef(tolerance);
  const currentPresetRef = useRef<PosePreset | null>(null);
  const analysisModeRef = useRef(analysisMode);
  const hasTriggeredAlignRef = useRef(false);
  const audioEnabledRef = useRef(audioEnabled);
  const facingModeRef = useRef(facingMode);

  useEffect(() => { toleranceRef.current = tolerance; }, [tolerance]);
  useEffect(() => { currentPresetRef.current = currentPreset; }, [currentPreset]);
  useEffect(() => { analysisModeRef.current = analysisMode; }, [analysisMode]);
  useEffect(() => { audioEnabledRef.current = audioEnabled; }, [audioEnabled]);
  useEffect(() => { facingModeRef.current = facingMode; }, [facingMode]);

  const aspectRatioRef = useRef(4 / 3);
  useEffect(() => { aspectRatioRef.current = aspectRatio; }, [aspectRatio]);

  // Screen Wake Lock API to prevent screen sleep/dimming on mobile
  useEffect(() => {
    let active = cameraActive;
    const requestWakeLock = async () => {
      if (!active || typeof window === "undefined" || !("wakeLock" in navigator)) return;
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        console.log("Screen Wake Lock acquired");
      } catch (err) {
        console.error("Screen Wake Lock request failed:", err);
      }
    };

    const releaseWakeLock = () => {
      if (wakeLockRef.current) {
        try {
          wakeLockRef.current.release().then(() => {
            wakeLockRef.current = null;
            console.log("Screen Wake Lock released");
          });
        } catch (err) {
          console.error("Screen Wake Lock release failed:", err);
        }
      }
    };

    if (active) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && cameraActive) {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      releaseWakeLock();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cameraActive]);

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

  // TTS Voice Feedback
  const speak = (text: string) => {
    if (!audioEnabledRef.current) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-MX";
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  // Trigger alignment beep sound
  const playBeep = () => {
    if (!audioEnabledRef.current) return;
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

    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"),
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js")
    ])
      .then(() => {
        setScriptsLoaded(true);
      })
      .catch((err) => {
        console.error("Error loading MediaPipe scripts:", err);
        setConnectionError("No se pudieron cargar las librerías de visión artificial.");
      });
  }, []);

  // Geometry calculations
  const calculateAngle = (ptA: PoseLandmark, ptB: PoseLandmark, ptC: PoseLandmark) => {
    if (!ptA || !ptB || !ptC) return 0;
    const vecAB = { x: ptA.x - ptB.x, y: ptA.y - ptB.y, z: (ptA.z || 0) - (ptB.z || 0) };
    const vecCB = { x: ptC.x - ptB.x, y: ptC.y - ptB.y, z: (ptC.z || 0) - (ptB.z || 0) };

    const dot = vecAB.x * vecCB.x + vecAB.y * vecCB.y + vecAB.z * vecCB.z;
    const lenA = Math.sqrt(vecAB.x * vecAB.x + vecAB.y * vecAB.y + vecAB.z * vecAB.z);
    const lenC = Math.sqrt(vecCB.x * vecCB.x + vecCB.y * vecCB.y + vecCB.z * vecCB.z);

    if (lenA === 0 || lenC === 0) return 0;

    const cosTheta = Math.min(1, Math.max(-1, dot / (lenA * lenC)));
    const angle = Math.acos(cosTheta) * (180.0 / Math.PI);
    return Math.round(angle);
  };

  const calculateCurrentAngles = (landmarks: PoseLandmark[], mode: "superior" | "inferior" | "completo") => {
    if (mode === "completo") {
      const leftElbow = calculateAngle(landmarks[11], landmarks[13], landmarks[15]);
      const rightElbow = calculateAngle(landmarks[12], landmarks[14], landmarks[16]);
      const leftKnee = calculateAngle(landmarks[23], landmarks[25], landmarks[27]);
      const rightKnee = calculateAngle(landmarks[24], landmarks[26], landmarks[28]);
      return { left: leftElbow, right: rightElbow, leftKnee, rightKnee };
    } else if (mode === "superior") {
      const leftElbow = calculateAngle(landmarks[11], landmarks[13], landmarks[15]);
      const rightElbow = calculateAngle(landmarks[12], landmarks[14], landmarks[16]);
      return { left: leftElbow, right: rightElbow };
    } else {
      const leftKnee = calculateAngle(landmarks[23], landmarks[25], landmarks[27]);
      const rightKnee = calculateAngle(landmarks[24], landmarks[26], landmarks[28]);
      return { left: leftKnee, right: rightKnee };
    }
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
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const video = videoRef.current;
    if (video && video.videoWidth && video.videoHeight) {
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      const currentAspect = video.videoWidth / video.videoHeight;
      if (Math.abs(aspectRatioRef.current - currentAspect) > 0.01) {
        setAspectRatio(currentAspect);
      }
    }

    const width = canvas.width;
    const height = canvas.height;
    const isMirrored = facingModeRef.current === "user";

    // Draw video frame
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    if (results.image) {
      if (isMirrored) {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(results.image, 0, 0, width, height);
      ctx.restore();
    }

    const landmarks = results.poseLandmarks;
    if (!landmarks) {
      latestPoseLandmarksRef.current = null;
      setAlignmentMetrics({ score: 0, aligned: false });
      return;
    }

    latestPoseLandmarksRef.current = landmarks;

    const mode = analysisModeRef.current || "completo";
    const currentAngles = calculateCurrentAngles(landmarks, mode);

    let targetLeft: number | null = null;
    let targetRight: number | null = null;
    let targetLeftKnee: number | null = null;
    let targetRightKnee: number | null = null;
    let referenceLandmarks: PoseLandmark[] | null = null;
    let isUsingLocalCapture = false;

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
      isUsingLocalCapture = true;
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

    if (referenceLandmarks && targetLeft !== null && targetRight !== null) {
      // Evaluation
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

      setAlignmentMetrics({ score, aligned });

      // Audio alerts
      if (aligned && !hasTriggeredAlignRef.current) {
        hasTriggeredAlignRef.current = true;
        playBeep();
        speak("¡Alineación correcta!");
      } else if (score < 75) {
        hasTriggeredAlignRef.current = false;
      }
    } else {
      setAlignmentMetrics({ score: 0, aligned: false });
    }

    // 1. Draw reference ghost (either local capture in yellow/gold or official preset in cyan)
    if (referenceLandmarks) {
      const normalizedLms = normalizeReferenceLandmarks(landmarks, referenceLandmarks);
      const ghostColor = isUsingLocalCapture ? "rgba(250, 204, 21, 0.5)" : "rgba(6, 182, 212, 0.45)";
      drawGhostSkeleton(ctx, normalizedLms, width, height, ghostColor, 5, isMirrored);
    }

    // 2. Draw user skeleton
    drawActiveSkeleton(ctx, landmarks, width, height, leftColor, rightColor, mode, leftKneeColor, rightKneeColor, isMirrored);

    // 3. Draw Center of Gravity
    drawCenterOfGravity(ctx, landmarks, width, height, isMirrored);

    // 4. Draw angles
    drawAnglesOnSkeleton(ctx, landmarks, width, height, currentAngles, mode, isMirrored);
  };

  // MediaPipe initialization effect
  useEffect(() => {
    if (!scriptsLoaded || !cameraActive) return;
    if (!videoRef.current || !canvasRef.current) return;

    const PoseClass = (window as any).Pose;
    if (!PoseClass) return;

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

    let activeStream: MediaStream | null = null;
    let animationFrameId: number | null = null;
    let isProcessing = false;

    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.error("Error playing video:", e));
          };
        }

        const processFrame = async () => {
          if (!videoRef.current || !poseInstanceRef.current || !cameraActive) return;
          if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            if (!isProcessing) {
              isProcessing = true;
              try {
                await pose.send({ image: videoRef.current });
              } catch (err) {
                console.error("Error sending image to pose:", err);
              }
              isProcessing = false;
            }
          }
          animationFrameId = requestAnimationFrame(processFrame);
        };

        animationFrameId = requestAnimationFrame(processFrame);
      } catch (err: any) {
        console.error("Error starting camera:", err);
        setConnectionError("No se pudo acceder a la cámara. Por favor asegúrate de dar los permisos correspondientes.");
      }
    };

    startCamera();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (poseInstanceRef.current) {
        try { poseInstanceRef.current.close(); } catch {}
      }
    };
  }, [scriptsLoaded, cameraActive, facingMode]);

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
    <section className={`relative w-full flex flex-col justify-start items-center overflow-x-hidden bg-zinc-950 text-white transition-all duration-300 ${
      cameraActive ? "max-xl:pt-0 max-xl:pb-0 max-xl:min-h-screen" : "min-h-[calc(100vh-80px)] pt-6 sm:pt-12 pb-12 sm:pb-20"
    }`}>
      
      {/* Decorative Watermark */}
      <div className="absolute right-10 top-[12%] text-[24vw] md:text-[14vw] font-black text-white/[0.03] select-none pointer-events-none leading-none z-0 font-serif hidden sm:block">
        姿勢
      </div>

      <div className={`relative z-20 w-full mx-auto flex flex-col justify-start items-center pt-0 transition-all duration-300 ${
        cameraActive ? "max-xl:max-w-none max-xl:px-0" : "max-w-[99vw] px-1.5 sm:px-4 md:px-6 lg:px-8"
      }`}>
        
        {/* Navigation / Header */}
        <div className={`w-full flex justify-between items-center mb-4 sm:mb-8 border-b border-white/5 pb-4 ${
          cameraActive ? "max-xl:hidden" : ""
        }`}>
          <Link
            href="/resources/aplicaciones"
            className="flex items-center gap-2 text-zinc-500 hover:text-kuma-gold transition-all duration-300 group px-3 py-2 rounded-xl hover:bg-white/5 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline font-black uppercase tracking-widest text-[10px]">Volver a Aplicaciones</span>
          </Link>
          <span className="hidden sm:flex text-kuma-gold font-bold uppercase tracking-[0.2em] text-xs drop-shadow-md items-center gap-2 font-serif">
            姿勢 <span className="text-white/60">KUMA STANCES</span>
          </span>
        </div>

        {isConnecting ? (
          <div className="w-full max-w-md bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-8 text-center backdrop-blur-md flex flex-col items-center justify-center space-y-4 shadow-2xl min-h-[250px]">
            <RefreshCw className="w-8 h-8 text-kuma-gold animate-spin" />
            <p className="font-body text-sm text-zinc-400">Cargando catálogo oficial de posturas...</p>
          </div>
        ) : (
          <div className={`w-full flex flex-col xl:flex-row gap-4 sm:gap-8 bg-zinc-900/40 border border-white/10 shadow-2xl rounded-[2rem] p-3 sm:p-8 md:p-10 min-h-[580px] backdrop-blur-md transition-all duration-300 ${
            cameraActive ? "max-xl:p-0 max-xl:border-none max-xl:rounded-none max-xl:min-h-screen" : ""
          }`}>
            
            {/* Camera Evaluation Window */}
            <div className={`flex-1 flex flex-col items-center justify-center bg-black/95 relative min-h-[480px] transition-all duration-300 ${
              cameraActive ? "max-xl:p-0 max-xl:border-none max-xl:w-full max-xl:h-full" : "border border-neutral-850 p-2 sm:p-4 rounded-xl"
            }`}>
              
              <video 
                ref={videoRef}
                style={{ position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }}
                width="640"
                height="480"
                playsInline
                muted
                autoPlay
              />

              <div 
                className="relative w-full max-w-[960px] bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300"
                style={{ aspectRatio: aspectRatio }}
              >
                <canvas 
                  ref={canvasRef}
                  width="640"
                  height="480"
                  className="w-full h-full"
                />

                {cameraActive && (
                  <button
                    type="button"
                    onClick={() => {
                      const nextMode = facingMode === "user" ? "environment" : "user";
                      setFacingMode(nextMode);
                      speak(`Cambiando a cámara ${nextMode === "user" ? "frontal" : "trasera"}`);
                    }}
                    className="absolute top-4 left-4 p-3 bg-zinc-950/80 hover:bg-zinc-900 border border-white/15 rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 group z-20 cursor-pointer"
                    title="Cambiar Cámara"
                  >
                    <RefreshCw className="w-4 h-4 text-kuma-gold group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white">
                      Cámara: {facingMode === "user" ? "Frontal" : "Trasera"}
                    </span>
                  </button>
                )}

                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/95 text-center p-6 space-y-4 z-20">
                    <Camera className="w-12 h-12 text-zinc-400 animate-pulse" />
                    <div>
                      <p className="font-body text-sm font-semibold text-white">Práctica de Espejo Local</p>
                      <p className="font-body text-xs text-zinc-500 max-w-sm mt-1.5 leading-relaxed">
                        Kuma Stances procesa tu video localmente. Enciende tu cámara web para comenzar a evaluar tus posturas.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setCameraActive(true)}
                      className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-white rounded-xl text-xs font-bold tracking-widest px-8 py-3.5 hover:opacity-95 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    >
                      ACTIVAR EVALUADOR EN VIVO
                    </button>
                  </div>
                )}
              </div>

              {/* Live HUD Feedback Overlay */}
              {cameraActive && alignmentMetrics.score > 0 && (
                <div className="absolute top-8 right-8 bg-zinc-950/80 border border-white/10 p-4 rounded-xl space-y-1 font-body text-xs z-10 backdrop-blur-sm">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">PRECISIÓN DE ALINEACIÓN</span>
                  <div className="flex justify-between gap-6 pt-1 border-t border-white/5">
                    <span className="text-zinc-400">Coincidencia:</span>
                    <span className={`font-bold ${alignmentMetrics.aligned ? "text-emerald-500" : "text-amber-500"}`}>
                      {alignmentMetrics.score}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Controls */}
            <div className="w-full xl:w-[360px] shrink-0 border border-white/10 bg-zinc-900/40 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between space-y-6 backdrop-blur-md shadow-2xl">
              
              <div className="space-y-6">
                
                {/* Header */}
                <div className="border-b border-white/5 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-amber-500/30 text-amber-400 bg-amber-950/30 rounded-lg">
                      PRÁCTICA INDIVIDUAL
                    </span>
                    <h2 className="font-impact-condensed text-xl text-white tracking-wide mt-1">
                      KUMA STANCES
                    </h2>
                  </div>

                  {/* Audio Toggle button */}
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`p-2 border border-white/10 rounded-xl transition-all hover:bg-white/5 ${audioEnabled ? 'text-kuma-gold border-kuma-gold/30' : 'text-zinc-500'}`}
                    title={audioEnabled ? "Silenciar audio" : "Activar audio de voz"}
                  >
                    {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                {/* Stance Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-kuma-gold block">
                    Selecciona una Postura
                  </label>
                  {presets.length > 0 ? (
                    <select
                      value={selectedPresetId}
                      onChange={(e) => handlePresetChange(e.target.value)}
                      className="w-full px-4 py-3 border border-white/10 rounded-2xl bg-zinc-950 font-body text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-kuma-gold/50 transition-all cursor-pointer"
                      style={{ color: "#ffffff", backgroundColor: "#09090b" }}
                    >
                      {presets.map((preset) => (
                        <option key={preset._id} value={preset._id}>
                          {preset.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-body text-xs text-zinc-500 italic">No hay posturas en el catálogo oficial.</p>
                  )}
                </div>

                {/* Active Stance Description card */}
                <div className="bg-zinc-950/60 border border-white/5 p-4 rounded-2xl space-y-3">
                  <h3 className="text-[10px] font-bold uppercase text-kuma-gold tracking-wider">
                    Postura Seleccionada
                  </h3>
                  {currentPreset ? (
                    <div className="space-y-2">
                      <p className="font-impact-condensed text-base text-white tracking-wide">
                        {currentPreset.name}
                      </p>
                      <p className="font-body text-[11px] text-zinc-400 font-light leading-relaxed">
                        Colócate en el campo de visión de tu cámara a una distancia aproximada de 2 a 3 metros. La silueta fantasma en color cian indica la posición guía.
                      </p>
                      {currentPreset.angles && (
                        <div className="text-[10px] font-body text-zinc-500 pt-1 border-t border-white/5 flex flex-wrap gap-2">
                          <span>Modo: <strong className="text-zinc-300 uppercase">{currentPreset.category || "Cuerpo completo"}</strong></span>
                          <span>•</span>
                          <span>L: <strong className="text-zinc-300">{currentPreset.angles.left}°</strong></span>
                          <span>•</span>
                          <span>R: <strong className="text-zinc-300">{currentPreset.angles.right}°</strong></span>
                          {currentPreset.angles.leftKnee !== undefined && (
                            <>
                              <span>•</span>
                              <span>LK: <strong className="text-zinc-300">{currentPreset.angles.leftKnee}°</strong></span>
                              <span>•</span>
                              <span>RK: <strong className="text-zinc-300">{currentPreset.angles.rightKnee}°</strong></span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ) : localCapture ? (
                    <div className="space-y-2">
                      <p className="font-impact-condensed text-base text-amber-500 tracking-wide">
                        Captura Local Activa
                      </p>
                      <p className="font-body text-[11px] text-amber-500/80 font-light leading-relaxed">
                        Has congelado tu propia postura como referencia. Intenta replicar la silueta dorada en pantalla.
                      </p>
                    </div>
                  ) : (
                    <p className="font-body text-[11px] text-zinc-500 italic">Selecciona una postura del catálogo superior para comenzar.</p>
                  )}
                </div>

                {/* Local Capture Section */}
                <div className="bg-zinc-950/60 border border-white/5 p-4 rounded-2xl space-y-3">
                  <h3 className="text-[10px] font-bold uppercase text-kuma-gold tracking-wider">
                    Capturar Posición
                  </h3>
                  <p className="font-body text-[11px] text-zinc-400 font-light leading-relaxed">
                    Congela tu postura actual detectada en la cámara como silueta guía dorada.
                  </p>
                  
                  {localCapture ? (
                    <button
                      type="button"
                      onClick={() => {
                        localCaptureRef.current = null;
                        setLocalCapture(null);
                        hasTriggeredAlignRef.current = false;
                        speak("Captura de referencia limpia.");
                      }}
                      className="w-full bg-zinc-800 text-white border border-white/10 rounded-xl text-xs font-bold tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all cursor-pointer"
                    >
                      Limpiar Captura
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!cameraActive || !latestPoseLandmarksRef.current}
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
                          speak("Posición capturada. Intenta replicar la silueta dorada.");
                        }
                      }}
                      className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white rounded-xl text-xs font-bold tracking-widest py-3 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
                    >
                      CAPTURAR POSICIÓN
                    </button>
                  )}
                </div>

                {/* Analysis Mode Selector */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase text-[#E52B34] tracking-wider flex items-center gap-1.5 font-serif">
                    <Maximize2 className="w-4 h-4" /> Zona de Análisis
                  </h3>
                  <div className="flex border border-white/10 divide-x divide-white/10 bg-zinc-950 rounded-xl overflow-hidden">
                    {([
                      { value: "superior" as const, label: "Tren Superior", desc: "Codos" },
                      { value: "inferior" as const, label: "Tren Inferior", desc: "Rodillas" },
                      { value: "completo" as const, label: "Completo", desc: "Todo" }
                    ]).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAnalysisMode(opt.value)}
                        className={`flex-1 px-1 py-2 text-center transition-all cursor-pointer ${
                          analysisMode === opt.value
                            ? "bg-[#E52B34] text-white"
                            : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        }`}
                      >
                        <span className="block text-[9px] font-bold uppercase tracking-wider">
                          {opt.label}
                        </span>
                        <span className={`block text-[8px] mt-0.5 ${
                          analysisMode === opt.value ? "text-white/70" : "text-zinc-400"
                        }`}>
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tolerance range slider */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase text-[#E52B34] tracking-wider flex items-center gap-1.5 font-serif">
                    <SlidersHorizontal className="w-4 h-4" /> Tolerancia: {tolerance}°
                  </h3>
                  <input 
                    type="range"
                    min={5}
                    max={35}
                    step={1}
                    value={tolerance}
                    onChange={(e) => setTolerance(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[9px] font-body text-zinc-500">
                    <span>Exigente (5°)</span>
                    <span>Permisivo (35°)</span>
                  </div>
                </div>

              </div>

              {/* Instructions and tips */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                {connectionError && (
                  <div className="bg-red-950/20 border border-red-500/20 text-red-400 px-3.5 py-2.5 rounded-xl font-body text-xs flex gap-2 items-center">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{connectionError}</span>
                  </div>
                )}

                <div className="text-[10px] font-body text-zinc-500 leading-relaxed flex gap-2 items-start">
                  <HelpCircle className="w-3.5 h-3.5 shrink-0 text-zinc-400 mt-0.5" />
                  <span>
                    El evaluador utiliza la distancia entre tus hombros para redimensionar la silueta a tu estatura actual. Asegúrate de que tu cuerpo completo sea visible para que MediaPipe funcione correctamente.
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
