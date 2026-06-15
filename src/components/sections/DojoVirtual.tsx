"use client";

import { useState, useEffect, useRef } from "react";
import { PrimalTitle } from "@/components/ui/PrimalTitle";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Users, 
  Lock, 
  ShieldAlert, 
  CheckCircle, 
  HelpCircle, 
  Play, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle, 
  Save, 
  Sliders,
  ChevronRight,
  Eye,
  LogOut,
  SlidersHorizontal,
  Trash2,
  Pencil,
  X,
  Crosshair,
  XCircle,
  Maximize2
} from "lucide-react";

interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

interface PosePreset {
  _id: string;
  name: string;
  category: "superior" | "inferior";
  angles: { left: number; right: number };
  landmarks: PoseLandmark[];
}

export default function DojoVirtual() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL Room Code Check
  const urlCode = searchParams.get("code")?.toUpperCase() || "";

  // Core Connection States
  const [roomCode, setRoomCode] = useState<string>(urlCode);
  const [role, setRole] = useState<"student" | "sensei" | null>(null);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string>("");

  // Student Inputs
  const [studentInputCode, setStudentInputCode] = useState("");
  const [studentInputName, setStudentInputName] = useState("");

  // Sensei Inputs
  const [targetStudentName, setTargetStudentName] = useState("");

  // Sync / Active Data
  const [studentPoseData, setStudentPoseData] = useState<any>(null);
  const [presets, setPresets] = useState<PosePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [guidedMode, setGuidedMode] = useState(true);
  const [tolerance, setTolerance] = useState(15);
  const [analysisMode, setAnalysisMode] = useState<"superior" | "inferior" | "completo">("completo");
  const [newPoseName, setNewPoseName] = useState("");
  const [isSavingPose, setIsSavingPose] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [meetLinkInput, setMeetLinkInput] = useState("");
  // PeerJS P2P Connection States
  const [peerjsLoaded, setPeerjsLoaded] = useState(false);
  const [isP2PConnected, setIsP2PConnected] = useState(false);
  const [senseiPeerId, setSenseiPeerId] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [studentVideoStream, setStudentVideoStream] = useState<MediaStream | null>(null);
  const studentVideoStreamRef = useRef<MediaStream | null>(null);
  const senseiVideoElRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    studentVideoStreamRef.current = studentVideoStream;
    // Bind stream to video element imperatively (avoids React re-mounting)
    if (senseiVideoElRef.current) {
      if (studentVideoStream) {
        senseiVideoElRef.current.srcObject = studentVideoStream;
        senseiVideoElRef.current.style.opacity = "1";
      } else {
        // Don't clear srcObject immediately — let last frame persist to avoid black flash
        senseiVideoElRef.current.style.opacity = "0";
      }
    }
  }, [studentVideoStream]);

  // Session-only captured pose (Sensei captures, both sides see ghost)
  const [sessionCapture, setSessionCapture] = useState<{
    landmarks: PoseLandmark[];
    angles: { left: number; right: number; leftKnee?: number; rightKnee?: number };
    mode: "superior" | "inferior" | "completo";
  } | null>(null);
  const sessionCaptureRef = useRef<typeof sessionCapture>(null);
  useEffect(() => {
    sessionCaptureRef.current = sessionCapture;
  }, [sessionCapture]);

  // Refs for tracking student alignment triggers (TTS audio beep)
  const hasTriggeredAlignRef = useRef(false);
  const isGuidedModeRef = useRef(guidedMode);
  
  // Student Camera & Pose Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const poseInstanceRef = useRef<any>(null);
  const cameraInstanceRef = useRef<any>(null);
  const latestPoseLandmarksRef = useRef<PoseLandmark[] | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Active sync presets for Student
  const currentPresetRef = useRef<PosePreset | null>(null);

  // Sensei Smooth Rendering Refs
  const targetLandmarksRef = useRef<PoseLandmark[] | null>(null);
  const previousLandmarksRef = useRef<PoseLandmark[] | null>(null);
  const lastUpdateTimestampRef = useRef<number>(0);
  const interpolatedLandmarksRef = useRef<PoseLandmark[] | null>(null);
  const studentPoseDataRef = useRef<any>(null);
  const toleranceRef = useRef(tolerance);
  const selectedPresetIdRef = useRef(selectedPresetId);
  const presetsRef = useRef(presets);
  const analysisModeRef = useRef(analysisMode);

  // PeerJS Refs
  const peerInstanceRef = useRef<any>(null);
  const peerConnRef = useRef<any>(null);
  const isP2PConnectedRef = useRef(isP2PConnected);
  const senseiPeerIdRef = useRef<string>("");

  useEffect(() => {
    isP2PConnectedRef.current = isP2PConnected;
  }, [isP2PConnected]);

  useEffect(() => {
    senseiPeerIdRef.current = senseiPeerId;
  }, [senseiPeerId]);

  // Load PeerJS CDN script dynamically
  useEffect(() => {
    if (!role) return;
    
    // Check if script already exists
    if (document.querySelector('script[src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"]')) {
      setPeerjsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";
    script.async = true;
    script.onload = () => {
      setPeerjsLoaded(true);
    };
    script.onerror = () => {
      console.warn("Failed loading PeerJS CDN. Falling back to HTTP polling.");
    };
    document.body.appendChild(script);

    return () => {
      // Avoid removing if other instances need it
    };
  }, [role]);

  // STUDENT P2P SETUP: Init PeerJS client instance
  useEffect(() => {
    if (role !== "student" || !peerjsLoaded) return;

    const PeerClass = (window as any).Peer;
    if (!PeerClass) return;

    console.log("Student: Initializing PeerJS P2P Client...");
    const peer = new PeerClass();
    peerInstanceRef.current = peer;

    peer.on("open", (id: string) => {
      console.log("Student PeerJS opened with client ID:", id);
    });

    peer.on("error", (err: any) => {
      console.warn("Student PeerJS instance error:", err);
      setIsP2PConnected(false);
    });

    return () => {
      if (peerConnRef.current) {
        try { peerConnRef.current.close(); } catch {}
      }
      if (peerInstanceRef.current) {
        try { peerInstanceRef.current.destroy(); } catch {}
      }
    };
  }, [role, peerjsLoaded]);

  // STUDENT P2P CONNECTION: Connect when senseiPeerId changes
  useEffect(() => {
    if (role !== "student" || !peerInstanceRef.current || !senseiPeerId) return;

    const connectToSensei = (targetId: string) => {
      if (peerConnRef.current && peerConnRef.current.peer === targetId && peerConnRef.current.open) {
        return; // Already connected
      }

      if (peerConnRef.current) {
        try { peerConnRef.current.close(); } catch {}
      }

      console.log("Student: Connecting to Sensei Peer ID:", targetId);
      const conn = peerInstanceRef.current.connect(targetId, {
        serialization: "json"
      });
      peerConnRef.current = conn;

      conn.on("open", () => {
        setIsP2PConnected(true);
        console.log("P2P connected directly to Sensei!");
      });

      conn.on("close", () => {
        setIsP2PConnected(false);
        console.log("P2P connection closed.");
      });

      conn.on("error", (err: any) => {
        console.warn("P2P Connection error:", err);
        setIsP2PConnected(false);
      });
    };

    connectToSensei(senseiPeerId);
  }, [role, senseiPeerId]);

  // STUDENT P2P RECONNECTION LOOP: Check and retry every 5s if disconnected
  useEffect(() => {
    if (role !== "student") return;

    const reconnectInterval = setInterval(() => {
      if (!isP2PConnectedRef.current && senseiPeerIdRef.current && peerInstanceRef.current && !peerInstanceRef.current.destroyed) {
        console.log("Student: P2P disconnected. Retrying connection to Sensei Peer ID:", senseiPeerIdRef.current);
        
        if (peerConnRef.current) {
          try { peerConnRef.current.close(); } catch {}
        }

        const conn = peerInstanceRef.current.connect(senseiPeerIdRef.current, {
          serialization: "json"
        });
        peerConnRef.current = conn;

        conn.on("open", () => {
          setIsP2PConnected(true);
          console.log("P2P reconnected directly to Sensei!");
        });

        conn.on("close", () => {
          setIsP2PConnected(false);
          console.log("P2P connection closed.");
        });

        conn.on("error", (err: any) => {
          console.warn("P2P Connection error during retry:", err);
          setIsP2PConnected(false);
        });
      }
    }, 5000);

    return () => clearInterval(reconnectInterval);
  }, [role]);

  // STUDENT VIDEO STREAM P2P CALL: Send video stream to Sensei
  useEffect(() => {
    if (role !== "student" || !isP2PConnected || !cameraActive || !peerInstanceRef.current || !senseiPeerId) return;

    let mediaCall: any = null;

    const startWebStream = () => {
      const localStream = videoRef.current?.srcObject as MediaStream;
      if (localStream && peerInstanceRef.current) {
        console.log("Student: Initiating video call to Sensei Peer:", senseiPeerId);
        mediaCall = peerInstanceRef.current.call(senseiPeerId, localStream);
      } else {
        // If stream is not yet bound to video element, retry in 1 second
        setTimeout(startWebStream, 1000);
      }
    };

    const timer = setTimeout(startWebStream, 1500);

    return () => {
      clearTimeout(timer);
      if (mediaCall) {
        try { mediaCall.close(); } catch {}
      }
    };
  }, [role, isP2PConnected, cameraActive, senseiPeerId]);

  // SENSEI P2P SETUP: Init PeerJS as Host with random ID to avoid conflict, and save it in MongoDB
  useEffect(() => {
    if (role !== "sensei" || !peerjsLoaded || !roomCode) return;

    const PeerClass = (window as any).Peer;
    if (!PeerClass) return;

    console.log("Sensei: Initializing PeerJS P2P Host with dynamic ID...");
    const peer = new PeerClass();
    peerInstanceRef.current = peer;

    peer.on("open", (id: string) => {
      console.log("Sensei PeerJS is listening for student. Peer ID:", id);
      setSenseiPeerId(id);
      
      // Update room in database with the dynamic Peer ID
      fetch("/api/dojo/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode,
          role: "sensei",
          senseiPeerId: id
        })
      }).catch(err => console.error("Error saving senseiPeerId:", err));
    });

    peer.on("call", (call: any) => {
      console.log("Sensei: Incoming video call from student...");
      call.answer(); // Answer without sending video back
      call.on("stream", (remoteStream: any) => {
        console.log("Sensei: Received student remote stream!");
        setStudentVideoStream(remoteStream);
      });
      // Don't null the stream on transient call close/error — keeps last video frame visible
      call.on("close", () => {
        console.log("P2P media call closed.");
      });
      call.on("error", (err: any) => {
        console.warn("P2P media call error:", err);
      });
    });

    peer.on("connection", (conn: any) => {
      peerConnRef.current = conn;
      setIsP2PConnected(true);
      console.log("Student connected to Sensei via P2P!");

      conn.on("data", (data: any) => {
        // Update both the state and the ref for smooth rendering
        setStudentPoseData(data);
        studentPoseDataRef.current = data;
        if (data && data.landmarks) {
          if (targetLandmarksRef.current) {
            previousLandmarksRef.current = targetLandmarksRef.current;
          } else {
            previousLandmarksRef.current = data.landmarks;
          }
          targetLandmarksRef.current = data.landmarks;
          lastUpdateTimestampRef.current = Date.now();
        }
      });

      conn.on("close", () => {
        setIsP2PConnected(false);
        console.log("Student disconnected from P2P.");
      });

      conn.on("error", (err: any) => {
        console.warn("Sensei P2P Connection error:", err);
        setIsP2PConnected(false);
      });
    });

    peer.on("error", (err: any) => {
      console.warn("Sensei PeerJS host error:", err);
      setIsP2PConnected(false);
    });

    return () => {
      setStudentVideoStream(null);
      if (peerConnRef.current) {
        try { peerConnRef.current.close(); } catch {}
      }
      if (peerInstanceRef.current) {
        try { peerInstanceRef.current.destroy(); } catch {}
      }
    };
  }, [role, peerjsLoaded, roomCode]);

  useEffect(() => {
    toleranceRef.current = tolerance;
  }, [tolerance]);

  useEffect(() => {
    selectedPresetIdRef.current = selectedPresetId;
  }, [selectedPresetId]);

  useEffect(() => {
    presetsRef.current = presets;
  }, [presets]);

  useEffect(() => {
    analysisModeRef.current = analysisMode;
  }, [analysisMode]);

  // Load presets list (Sensei only)
  useEffect(() => {
    if (role === "sensei") {
      fetch("/api/presets")
        .then((res) => res.json())
        .then((data) => {
          const list = Array.isArray(data) ? data : (data.presets || []);
          setPresets(list);
        })
        .catch((err) => console.error("Error loading presets:", err));
    }
  }, [role]);

  // Handle URL Code changes
  useEffect(() => {
    if (urlCode && !role) {
      // Auto fill or trigger connection
      setStudentInputCode(urlCode);
    }
  }, [urlCode, role]);

  // TTS Voice helper
  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-MX";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const speakRef = useRef(speak);
  useEffect(() => {
    speakRef.current = speak;
  });

  // Handle room creation (Sensei)
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setConnectionError("");

    try {
      const res = await fetch("/api/dojo/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName: targetStudentName || "Alumno" })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear la sala");

      setRoomCode(data.roomCode);
      setRoomInfo(data);
      setRole("sensei");
      router.push(`/resources/aplicaciones/dojo-virtual?code=${data.roomCode}`);
    } catch (err: any) {
      setConnectionError(err.message || "Error al conectar");
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle room joining (Student)
  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInputCode) return;

    setIsConnecting(true);
    setConnectionError("");

    try {
      const res = await fetch(`/api/dojo/room?code=${studentInputCode.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Código de sala no válido");

      setRoomCode(data.roomCode);
      setRoomInfo(data);
      if (data.senseiPeerId) {
        setSenseiPeerId(data.senseiPeerId);
      }
      setRole("student");
      
      // Save student custom name if given
      if (studentInputName) {
        setRoomInfo((prev: any) => ({ ...prev, studentName: studentInputName }));
      }
      
      router.push(`/resources/aplicaciones/dojo-virtual?code=${data.roomCode}`);
      speak("Conectado al dojo virtual. Esperando instrucciones de tu Sensei.");
    } catch (err: any) {
      setConnectionError(err.message || "Error al conectar");
    } finally {
      setIsConnecting(false);
    }
  };

  // Load MediaPipe scripts dynamically (Student only)
  useEffect(() => {
    if (role !== "student") return;

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
        console.error("Error cargando scripts de MediaPipe:", err);
        setConnectionError("No se pudieron cargar las librerías de visión artificial.");
      });
  }, [role]);

  // Calculations (reused from KihonOnline.tsx)
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

  // Helper Drawing functions (reused from KihonOnline.tsx)
  const drawGhostSkeleton = (ctx: CanvasRenderingContext2D, lms: PoseLandmark[], w: number, h: number, color: string, thickness: number) => {
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
        ctx.moveTo((1 - ptA.x) * w, ptA.y * h);
        ctx.lineTo((1 - ptB.x) * w, ptB.y * h);
        ctx.stroke();
      }
    };

    // Body connections
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
        ctx.arc((1 - pt.x) * w, pt.y * h, 4, 0, 2 * Math.PI);
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
    rightKneeColor?: string
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
        ctx.moveTo((1 - ptA.x) * w, ptA.y * h);
        ctx.lineTo((1 - ptB.x) * w, ptB.y * h);
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
          ctx.arc((1 - pt.x) * w, pt.y * h, radius + 4, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc((1 - pt.x) * w, pt.y * h, radius, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc((1 - pt.x) * w, pt.y * h, radius, 0, 2 * Math.PI);
          ctx.fill();
        }
        ctx.restore();
      }
    };

    // Tronco y hombros
    drawJointLine(11, 12, "rgba(255, 255, 255, 0.85)", 3);
    drawJointLine(11, 23, "rgba(255, 255, 255, 0.8)", 3);
    drawJointLine(12, 24, "rgba(255, 255, 255, 0.8)", 3);
    drawJointLine(23, 24, "rgba(255, 255, 255, 0.85)", 3);

    if (mode === "completo") {
      // All limbs get color
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

      // Highlight all key joints
      drawPoint(13, leftJointColor, 7, true);
      drawPoint(14, rightJointColor, 7, true);
      drawPoint(25, lkColor, 7, true);
      drawPoint(26, rkColor, 7, true);
    } else if (mode === "superior") {
      // Brazos color dinámico
      drawJointLine(11, 13, leftJointColor, 4);
      drawJointLine(13, 15, leftJointColor, 4);
      drawJointLine(12, 14, rightJointColor, 4);
      drawJointLine(14, 16, rightJointColor, 4);

      // Piernas blancas estáticas
      drawJointLine(23, 25, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(25, 27, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(24, 26, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(26, 28, "rgba(255, 255, 255, 0.6)", 3);
      
      // Resaltar codos
      drawPoint(13, leftJointColor, 7, true);
      drawPoint(14, rightJointColor, 7, true);
    } else {
      // Brazos blancos estáticos
      drawJointLine(11, 13, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(13, 15, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(12, 14, "rgba(255, 255, 255, 0.6)", 3);
      drawJointLine(14, 16, "rgba(255, 255, 255, 0.6)", 3);

      // Piernas color dinámico
      drawJointLine(23, 25, leftJointColor, 4);
      drawJointLine(25, 27, leftJointColor, 4);
      drawJointLine(24, 26, rightJointColor, 4);
      drawJointLine(26, 28, rightJointColor, 4);
      
      // Resaltar rodillas
      drawPoint(25, leftJointColor, 7, true);
      drawPoint(26, rightJointColor, 7, true);
    }

    // Dibujar el resto de articulaciones con puntos blancos
    [11, 12, 15, 16, 23, 24, 27, 28].forEach((idx) => drawPoint(idx, "rgba(255, 255, 255, 0.8)", 4));
    
    ctx.restore();
  };

  // Draw Center of Gravity (COG)
  const drawCenterOfGravity = (ctx: CanvasRenderingContext2D, lms: PoseLandmark[], w: number, h: number) => {
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

      const drawComX = (1 - comX) * w;
      const drawTorsoTopY = torsoTopY * h;
      const drawFloorY = baseFloorY * h;
      const drawAnkleLX = (1 - ankleL.x) * w;
      const drawAnkleRX = (1 - ankleR.x) * w;

      const isStable = comX >= Math.min(ankleL.x, ankleR.x) && comX <= Math.max(ankleL.x, ankleR.x);
      const balanceColor = isStable ? "rgba(34, 197, 94, 0.85)" : "rgba(239, 68, 68, 0.9)";

      ctx.save();
      // Draw COG Plumb Line
      ctx.strokeStyle = balanceColor;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]); 
      ctx.shadowBlur = 8;
      ctx.shadowColor = balanceColor;
      ctx.beginPath();
      ctx.moveTo(drawComX, drawTorsoTopY);
      ctx.lineTo(drawComX, drawFloorY);
      ctx.stroke();

      // Draw Base of Support
      ctx.setLineDash([]); 
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(drawAnkleLX, drawFloorY);
      ctx.lineTo(drawAnkleRX, drawFloorY);
      ctx.stroke();

      // Draw indicator dot on the floor
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

  // Draw texts for angles
  const drawAnglesOnSkeleton = (ctx: CanvasRenderingContext2D, lms: PoseLandmark[], w: number, h: number, currentAngles: any, mode: string) => {
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 4;
    ctx.shadowColor = "#000000";

    if (mode === "completo" || mode === "superior") {
      const elbowL = lms[13];
      const elbowR = lms[14];
      if (elbowL) ctx.fillText(`${currentAngles.left}°`, (1 - elbowL.x) * w + 10, elbowL.y * h);
      if (elbowR) ctx.fillText(`${currentAngles.right}°`, (1 - elbowR.x) * w - 35, elbowR.y * h);
    }
    if (mode === "completo" || mode === "inferior") {
      const kneeL = lms[25];
      const kneeR = lms[26];
      const leftVal = mode === "completo" ? currentAngles.leftKnee : currentAngles.left;
      const rightVal = mode === "completo" ? currentAngles.rightKnee : currentAngles.right;
      if (kneeL) ctx.fillText(`${leftVal}°`, (1 - kneeL.x) * w + 10, kneeL.y * h);
      if (kneeR) ctx.fillText(`${rightVal}°`, (1 - kneeR.x) * w - 35, kneeR.y * h);
    }
  };

  // Student Main Pose Handling
  const handlePoseResults = (results: any) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw video frame
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    if (results.image) {
      // Mirror camera
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(results.image, 0, 0, width, height);
      ctx.restore();
    }

    const landmarks = results.poseLandmarks;
    if (!landmarks) {
      latestPoseLandmarksRef.current = null;
      return;
    }

    latestPoseLandmarksRef.current = landmarks;

    // Read current analysis mode from state (controlled by Sensei)
    const mode = analysisModeRef.current || "completo";
    const currentAngles = calculateCurrentAngles(landmarks, mode);

    // Setup Target Alignment variables
    let targetLeft: number | null = null;
    let targetRight: number | null = null;

    if (currentPresetRef.current) {
      targetLeft = currentPresetRef.current.angles.left;
      targetRight = currentPresetRef.current.angles.right;
    }

    let leftColor = "rgba(255, 0, 0, 0.8)"; // Red default
    let rightColor = "rgba(255, 0, 0, 0.8)";
    const tol = tolerance; 
    let score = 0;
    let aligned = false;

    if (targetLeft !== null && targetRight !== null) {
      const diffL = Math.abs(currentAngles.left - targetLeft);
      const diffR = Math.abs(currentAngles.right - targetRight);

      if (diffL <= tol) leftColor = "rgba(34, 197, 94, 0.85)"; // Green
      if (diffR <= tol) rightColor = "rgba(34, 197, 94, 0.85)";

      const maxDiff = 60;
      const scoreL = Math.max(0, 100 - (diffL / maxDiff) * 100);
      const scoreR = Math.max(0, 100 - (diffR / maxDiff) * 100);
      score = Math.round((scoreL + scoreR) / 2);

      aligned = diffL <= tol && diffR <= tol;

      // Audio trigger
      if (aligned && !hasTriggeredAlignRef.current) {
        hasTriggeredAlignRef.current = true;
        speak("¡Alineación correcta!");
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
      } else if (score < 80) {
        hasTriggeredAlignRef.current = false;
      }
    }

    // 1. Draw reference ghost silhouette (catalog preset)
    if (currentPresetRef.current) {
      const normalizedLms = normalizeReferenceLandmarks(landmarks, currentPresetRef.current.landmarks);
      drawGhostSkeleton(ctx, normalizedLms, width, height, "rgba(6, 182, 212, 0.35)", 5);
    }

    // 1b. Draw session capture ghost (gold/yellow, from Sensei live capture)
    const sessionCap = sessionCaptureRef.current;
    if (sessionCap && sessionCap.landmarks && sessionCap.landmarks.length > 0) {
      const normalizedSession = normalizeReferenceLandmarks(landmarks, sessionCap.landmarks);
      drawGhostSkeleton(ctx, normalizedSession, width, height, "rgba(250, 204, 21, 0.4)", 5);

      // Override color evaluation against session capture
      const capDiffL = Math.abs(currentAngles.left - sessionCap.angles.left);
      const capDiffR = Math.abs(currentAngles.right - sessionCap.angles.right);
      if (capDiffL <= tol) leftColor = "rgba(34, 197, 94, 0.85)";
      if (capDiffR <= tol) rightColor = "rgba(34, 197, 94, 0.85)";
    }

    // 2. Draw active skeleton
    drawActiveSkeleton(ctx, landmarks, width, height, leftColor, rightColor, mode);

    // 3. Draw Center of Gravity
    drawCenterOfGravity(ctx, landmarks, width, height);

    // 4. Draw joints angles text
    drawAnglesOnSkeleton(ctx, landmarks, width, height, currentAngles, mode);

    // Save calculation metrics locally so sync loop can read them
    const poseObj = {
      landmarks: landmarks,
      angles: currentAngles,
      alignmentScore: score,
      isAligned: aligned,
      mode: mode
    };
    (window as any).lastStudentPose = poseObj;

    // Send real-time pose via PeerJS P2P DataChannel if active
    if (peerConnRef.current && peerConnRef.current.open) {
      peerConnRef.current.send(poseObj);
    }
  };

  // Student MediaPipe Initialization Effect
  useEffect(() => {
    if (!scriptsLoaded || role !== "student" || !cameraActive) return;
    if (!videoRef.current || !canvasRef.current) return;

    const PoseClass = (window as any).Pose;
    const CameraClass = (window as any).Camera;

    if (!PoseClass || !CameraClass) return;

    const pose = new PoseClass({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 2,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.4
    });

    pose.onResults(handlePoseResults);
    poseInstanceRef.current = pose;

    const camera = new CameraClass(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await pose.send({ image: videoRef.current });
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
  }, [scriptsLoaded, role, cameraActive]);

  // STUDENT SYNC POLLING LOOP (polls dynamically based on connection status)
  useEffect(() => {
    if (role !== "student") return;

    let isActive = true;

    const syncLoop = async () => {
      if (!isActive) return;

      const cachedPose = (window as any).lastStudentPose || {
        landmarks: [],
        angles: { left: 0, right: 0 },
        alignmentScore: 0,
        isAligned: false,
        mode: "superior"
      };

      try {
        const res = await fetch("/api/dojo/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomCode,
            role: "student",
            studentPose: cachedPose
          })
        });

        const data = await res.json();
        if (res.ok) {
          if (data.senseiPeerId) {
            setSenseiPeerId(data.senseiPeerId);
          }
          if (data.control) {
            setGuidedMode(data.control.guidedMode);
            setTolerance(data.control.tolerance);
            if (data.control.analysisMode) {
              setAnalysisMode(data.control.analysisMode);
            }
            if (data.meetLink !== undefined) {
              setMeetLink(data.meetLink);
            }

            // If Sensei has changed the reference Preset ID
            if (data.control.presetId) {
              if (!currentPresetRef.current || currentPresetRef.current._id !== data.control.presetId) {
                // Fetch preset details
                const presetRes = await fetch(`/api/presets`);
                const presetData = await presetRes.json();
                if (presetRes.ok) {
                  const list = Array.isArray(presetData) ? presetData : (presetData.presets || []);
                  const found = list.find((p: any) => p._id === data.control.presetId);
                  if (found) {
                    currentPresetRef.current = found;
                    setSelectedPresetId(found._id);
                    speak(`Tu Sensei ha colocado la postura de referencia: ${found.name}`);
                  }
                }
              }
            } else {
              currentPresetRef.current = null;
              setSelectedPresetId("");
            }

            // Handle reset pose remotely
            if (data.control.command === "reset_pose") {
              currentPresetRef.current = null;
              setSelectedPresetId("");
              speak("Posición de referencia reiniciada.");
            }
          }

          // Handle session capture from Sensei (ghost overlay for this session)
          if (data.sessionCapture !== undefined) {
            if (data.sessionCapture && data.sessionCapture.landmarks && data.sessionCapture.landmarks.length > 0) {
              setSessionCapture(data.sessionCapture);
            } else {
              setSessionCapture(null);
            }
          }
        }
      } catch (err) {
        console.error("Error syncing student loop:", err);
      }

      // Poll again: 3000ms if P2P is connected (saves bandwidth), 200ms fallback for real-time
      const delay = isP2PConnectedRef.current ? 3000 : 200;
      setTimeout(syncLoop, delay);
    };

    syncLoop();

    return () => {
      isActive = false;
    };
  }, [role, roomCode]);

  // SENSEI SYNC POLLING LOOP (polls dynamically based on connection status)
  useEffect(() => {
    if (role !== "sensei") return;

    let isActive = true;

    const syncLoop = async () => {
      if (!isActive) return;

      try {
        const res = await fetch("/api/dojo/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomCode,
            role: "sensei"
          })
        });

        const data = await res.json();
        if (res.ok) {
          if (data.studentPose) {
            setStudentPoseData(data.studentPose);
            studentPoseDataRef.current = data.studentPose;
            if (data.studentPose.landmarks) {
              // Store old target as previous to interpolate from
              if (targetLandmarksRef.current) {
                previousLandmarksRef.current = targetLandmarksRef.current;
              } else {
                previousLandmarksRef.current = data.studentPose.landmarks;
              }
              targetLandmarksRef.current = data.studentPose.landmarks;
              lastUpdateTimestampRef.current = Date.now();
            }
          }

          if (data.meetLink !== undefined) {
            setMeetLink(data.meetLink);
            setMeetLinkInput(data.meetLink);
          }

          if (data.poseSaved) {
            setSaveSuccessMessage("¡Postura del alumno guardada con éxito en la base de datos!");
            setNewPoseName("");
            setTimeout(() => setSaveSuccessMessage(""), 5000);
          }
        }
      } catch (err) {
        console.error("Error syncing sensei loop:", err);
      }

      // Poll again: 3000ms if P2P is connected, 200ms fallback for real-time
      const delay = isP2PConnectedRef.current ? 3000 : 200;
      setTimeout(syncLoop, delay);
    };

    syncLoop();

    return () => {
      isActive = false;
    };
  }, [role, roomCode]);

  // SENSEI 60FPS SMOOTH RENDERING LOOP (with linear interpolation / LERP based on time)
  useEffect(() => {
    if (role !== "sensei") return;

    let animationFrameId: number;

    const render = () => {
      const canvas = document.getElementById("sensei-canvas") as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;

          // Clear canvas — always transparent so <video> element behind shows through
          ctx.clearRect(0, 0, w, h);

          const poseData = studentPoseDataRef.current;
          const targetLms = targetLandmarksRef.current;
          const prevLms = previousLandmarksRef.current;

          if (!poseData || !targetLms || targetLms.length === 0) {
            // Show waiting indicator
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.font = "12px monospace";
            ctx.textAlign = "center";
            ctx.fillText("Esperando que el alumno active su cámara...", w / 2, h / 2);
          } else {
            // Calculate progress (0 to 1) based on time elapsed since the last update
            const elapsed = Date.now() - lastUpdateTimestampRef.current;
            const interpolationWindow = isP2PConnectedRef.current ? 40 : 200; // 40ms for real-time P2P stream, 200ms for polling fallback
            const progress = Math.min(1, elapsed / interpolationWindow);

            // Initialize or Interpolate landmarks
            if (!interpolatedLandmarksRef.current || interpolatedLandmarksRef.current.length !== targetLms.length) {
              interpolatedLandmarksRef.current = targetLms.map((pt) => ({ ...pt }));
            } else {
              for (let i = 0; i < targetLms.length; i++) {
                const targetPt = targetLms[i];
                const prevPt = prevLms && prevLms[i] ? prevLms[i] : targetPt;
                const interpPt = interpolatedLandmarksRef.current[i];
                if (targetPt && prevPt && interpPt) {
                  interpPt.x = prevPt.x + (targetPt.x - prevPt.x) * progress;
                  interpPt.y = prevPt.y + (targetPt.y - prevPt.y) * progress;
                  if (targetPt.z !== undefined && prevPt.z !== undefined && interpPt.z !== undefined) {
                    interpPt.z = prevPt.z + (targetPt.z - prevPt.z) * progress;
                  }
                }
              }
            }

            const lms = interpolatedLandmarksRef.current;
            const mode = analysisModeRef.current || "completo";
            const tol = toleranceRef.current;
            const currentAngles = calculateCurrentAngles(lms, mode);
            
            // Evaluation colors (left/right for arms, leftKnee/rightKnee for legs)
            let leftColor = "rgba(255, 0, 0, 0.8)";
            let rightColor = "rgba(255, 0, 0, 0.8)";
            let leftKneeColor = "rgba(255, 0, 0, 0.8)";
            let rightKneeColor = "rgba(255, 0, 0, 0.8)";

            // Check catalog preset first
            const senseiActivePreset = presetsRef.current.find((p) => p._id === selectedPresetIdRef.current);
            if (senseiActivePreset) {
              const diffL = Math.abs(currentAngles.left - senseiActivePreset.angles.left);
              const diffR = Math.abs(currentAngles.right - senseiActivePreset.angles.right);

              if (diffL <= tol) leftColor = "rgba(34, 197, 94, 0.85)";
              if (diffR <= tol) rightColor = "rgba(34, 197, 94, 0.85)";

              // Draw reference silhouette in light cyan
              const normalizedLms = normalizeReferenceLandmarks(lms, senseiActivePreset.landmarks);
              drawGhostSkeleton(ctx, normalizedLms, w, h, "rgba(6, 182, 212, 0.25)", 4);
            }

            // Draw session capture ghost (takes priority visually, drawn on top)
            const capture = sessionCaptureRef.current;
            if (capture && capture.landmarks && capture.landmarks.length > 0) {
              const normalizedCapture = normalizeReferenceLandmarks(lms, capture.landmarks);
              drawGhostSkeleton(ctx, normalizedCapture, w, h, "rgba(250, 204, 21, 0.4)", 5);

              // Evaluate against session capture for color feedback
              const capDiffL = Math.abs(currentAngles.left - capture.angles.left);
              const capDiffR = Math.abs(currentAngles.right - capture.angles.right);
              if (capDiffL <= tol) leftColor = "rgba(34, 197, 94, 0.85)";
              if (capDiffR <= tol) rightColor = "rgba(34, 197, 94, 0.85)";

              // Knee evaluation for completo mode
              if (mode === "completo" && (currentAngles as any).leftKnee !== undefined && capture.angles) {
                const capAngles = calculateCurrentAngles(capture.landmarks, "completo");
                const capDiffLK = Math.abs((currentAngles as any).leftKnee - (capAngles as any).leftKnee);
                const capDiffRK = Math.abs((currentAngles as any).rightKnee - (capAngles as any).rightKnee);
                if (capDiffLK <= tol) leftKneeColor = "rgba(34, 197, 94, 0.85)";
                if (capDiffRK <= tol) rightKneeColor = "rgba(34, 197, 94, 0.85)";
              }
            }

            // Draw active wireframe
            drawActiveSkeleton(ctx, lms, w, h, leftColor, rightColor, mode, leftKneeColor, rightKneeColor);

            // Draw center of gravity
            drawCenterOfGravity(ctx, lms, w, h);

            // Draw angle text labels
            drawAnglesOnSkeleton(ctx, lms, w, h, currentAngles, mode);

            // Draw details in overlay HUD
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.font = "bold 9px monospace";
            ctx.textAlign = "left";
            ctx.fillText(`ALINEADO: ${poseData.isAligned ? "SÍ" : "NO"}`, 15, 25);
            ctx.fillText(`PRECISIÓN: ${poseData.alignmentScore}%`, 15, 40);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [role]);

  // Push controller changes from Sensei to MongoDB
  const updateSenseiControls = async (updatedFields: any) => {
    try {
      // Build the payload
      const payload: any = {
        roomCode,
        role: "sensei",
        meetLink: updatedFields.meetLink !== undefined ? updatedFields.meetLink : meetLink,
        control: {
          presetId: updatedFields.presetId !== undefined ? updatedFields.presetId : selectedPresetId,
          guidedMode: updatedFields.guidedMode !== undefined ? updatedFields.guidedMode : guidedMode,
          tolerance: updatedFields.tolerance !== undefined ? updatedFields.tolerance : tolerance,
          analysisMode: updatedFields.analysisMode !== undefined ? updatedFields.analysisMode : analysisMode,
          command: updatedFields.command || "none",
          newPoseName: updatedFields.newPoseName || ""
        }
      };

      // Attach session capture data if present
      if (updatedFields.command === "session_capture" && updatedFields.sessionCaptureLandmarks) {
        payload.sessionCapture = JSON.parse(updatedFields.sessionCaptureLandmarks);
      } else if (updatedFields.command === "clear_session_capture") {
        payload.sessionCapture = null;
      }

      const res = await fetch("/api/dojo/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) console.warn("Failed pushing Sensei controls to room.");
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Save Pose on the student remotely
  const triggerRemoteSavePose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoseName.trim()) return;
    setIsSavingPose(true);
    updateSenseiControls({
      command: "save_pose",
      newPoseName: newPoseName.trim()
    }).finally(() => {
      setIsSavingPose(false);
    });
  };

  // Leave room reset
  const handleExitRoom = () => {
    if (cameraInstanceRef.current) {
      try { cameraInstanceRef.current.stop(); } catch {}
    }
    if (poseInstanceRef.current) {
      try { poseInstanceRef.current.close(); } catch {}
    }
    setRole(null);
    setRoomCode("");
    setRoomInfo(null);
    setStudentPoseData(null);
    setCameraActive(false);
    router.push("/resources/aplicaciones/dojo-virtual");
  };

  // Delete preset by ID from database (Sensei only)
  const handleDeletePresetById = async (presetId: string) => {
    if (!presetId) return;
    const presetToDelete = presets.find((p) => p._id === presetId);
    if (!presetToDelete) return;

    if (!confirm(`¿Estás seguro de que deseas eliminar la postura "${presetToDelete.name}" del catálogo oficial?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/presets?presetId=${presetId}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar la postura");

      // Reset locally
      setPresets((prev) => prev.filter((p) => p._id !== presetId));
      if (selectedPresetId === presetId) {
        setSelectedPresetId("");
        updateSenseiControls({ presetId: "" });
      }

      setSaveSuccessMessage(`Postura "${presetToDelete.name}" eliminada correctamente.`);
      setTimeout(() => setSaveSuccessMessage(""), 5000);
    } catch (err: any) {
      alert(err.message || "Error al eliminar la postura");
    }
  };

  // Start editing a preset name
  const handleStartEditPreset = (preset: PosePreset) => {
    setEditingPresetId(preset._id);
    setEditingName(preset.name);
  };

  // Save the updated preset name
  const handleSaveEditPreset = async (presetId: string) => {
    if (!editingName.trim()) return;

    try {
      const res = await fetch("/api/presets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetId, name: editingName.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar la postura");

      // Update state locally
      setPresets((prev) => prev.map((p) => p._id === presetId ? { ...p, name: editingName.trim() } : p));
      setEditingPresetId(null);
      setEditingName("");

      setSaveSuccessMessage("Postura renombrada correctamente.");
      setTimeout(() => setSaveSuccessMessage(""), 5000);
    } catch (err: any) {
      alert(err.message || "Error al renombrar la postura");
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-start items-center overflow-x-hidden bg-zinc-950 text-white min-h-screen pt-12 pb-20">
      
      {/* Background Watermark */}
      <div className="absolute right-10 top-[12%] text-[24vw] md:text-[14vw] font-black text-white/[0.03] select-none pointer-events-none leading-none z-0 font-serif">
        道場
      </div>

      <div className="relative z-20 w-full max-w-[99vw] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 flex flex-col justify-start items-center pt-0">
        
        {/* Compact Navigation and Title Bar */}
        <div className="w-full flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <Link
            href="/resources/aplicaciones"
            className="flex items-center gap-2 text-zinc-500 hover:text-kuma-gold transition-all duration-300 group px-3 py-2 rounded-xl hover:bg-white/5 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-black uppercase tracking-widest text-[10px]">Volver a Aplicaciones</span>
          </Link>
          <span className="text-kuma-gold font-bold uppercase tracking-[0.2em] text-xs drop-shadow-md flex items-center gap-2 font-serif">
            道場 <span className="text-white/60">Dojo Virtual</span>
          </span>
        </div>

        {/* LOBBY: Choice between joining as student or creating as instructor */}
        <AnimatePresence mode="wait">
          {role === null && (
            <motion.div 
              key="lobby"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900/40 border border-white/10 shadow-2xl rounded-[2.5rem] p-6 sm:p-8 md:p-10 backdrop-blur-md transition-all hover:border-white/15"
            >
              {/* Left Side: JOIN AS STUDENT (Lobby) */}
              <div className="space-y-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0 md:pr-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Camera className="w-5 h-5 text-[#E52B34]" />
                    <h2 className="font-impact-condensed text-xl sm:text-2xl text-white tracking-wider">
                      CONECTARSE COMO ALUMNO
                    </h2>
                  </div>
                  <p className="font-body text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-4">
                    Ingresa a la clase en vivo. Necesitarás encender tu cámara web y colocar el código alfanumérico que tu Sensei te haya asignado.
                  </p>
                </div>

                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-kuma-gold block mb-1">
                      Nombre del Practicante
                    </label>
                    <input 
                      type="text" 
                      placeholder="Tu nombre (ej. Juan)" 
                      value={studentInputName}
                      onChange={(e) => setStudentInputName(e.target.value)}
                      className="w-full px-4 py-3 border border-white/10 rounded-2xl bg-zinc-950 font-body text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-kuma-gold/50 focus:ring-1 focus:ring-kuma-gold/50 transition-all"
                      style={{ color: "#ffffff", backgroundColor: "#09090b" }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-kuma-gold block mb-1">
                      Código de la Sala *
                    </label>
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      placeholder="Ej: AB12XY" 
                      value={studentInputCode}
                      onChange={(e) => setStudentInputCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border border-white/10 rounded-2xl bg-zinc-950 font-body text-sm font-semibold tracking-widest text-white placeholder-zinc-500 focus:outline-none focus:border-kuma-gold/50 focus:ring-1 focus:ring-kuma-gold/50 transition-all"
                      style={{ color: "#ffffff", backgroundColor: "#09090b" }}
                    />
                  </div>

                  {connectionError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-none font-body text-xs flex gap-2 items-center">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{connectionError}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isConnecting}
                    className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white rounded-xl text-xs font-bold tracking-widest py-3.5 flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] active:scale-98"
                  >
                    {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    CONECTAR CAMARA AL DOJO
                  </button>
                </form>
              </div>

              {/* Right Side: CREATE ROOM AS SENSEI (Instructor only) */}
              <div className="space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-white" />
                    <h2 className="font-impact-condensed text-xl sm:text-2xl text-white tracking-wider">
                      MODO INSTRUCTOR (SENSEI)
                    </h2>
                  </div>
                  <p className="font-body text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-4">
                    Abre una sala para tu alumno. Podrás supervisar su postura, seleccionar la silueta que debe copiar y guardar sus mejores posiciones directamente.
                  </p>
                </div>

                {(session?.user as any)?.role === "admin" || (session?.user as any)?.role === "super_admin" ? (
                  <form onSubmit={handleCreateRoom} className="space-y-4 pt-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-kuma-gold block mb-1">
                        Nombre del Alumno a Evaluar
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ej. Juan Pérez" 
                        value={targetStudentName}
                        onChange={(e) => setTargetStudentName(e.target.value)}
                        className="w-full px-4 py-3 border border-white/10 rounded-2xl bg-zinc-950 font-body text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-kuma-gold/50 focus:ring-1 focus:ring-kuma-gold/50 transition-all"
                        style={{ color: "#ffffff", backgroundColor: "#09090b" }}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isConnecting}
                      className="w-full bg-zinc-800 text-white border border-white/10 rounded-xl text-xs font-bold tracking-widest py-3.5 flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all shadow-lg active:scale-98"
                    >
                      {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                      CREAR NUEVA SALA DE CLASE
                    </button>
                  </form>
                ) : (
                  <div className="bg-zinc-900/60 border border-white/5 p-5 rounded-[2rem] space-y-4 flex-1 flex flex-col justify-center items-center text-center">
                    <Lock className="w-8 h-8 text-zinc-500" />
                    <div>
                      <p className="font-body text-xs font-bold text-zinc-300">Acceso exclusivo para Instructores</p>
                      <p className="font-body text-[11px] text-zinc-500 font-light mt-1 max-w-[280px]">
                        Por favor, inicia sesión con un correo de administrador para poder abrir y controlar salas.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* VIEW: ALUMNO / STUDENT camera section */}
          {role === "student" && (
            <motion.div 
              key="student-panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex flex-col xl:flex-row gap-8 bg-zinc-900/40 border border-white/10 shadow-2xl rounded-[2.5rem] p-6 sm:p-8 md:p-10 min-h-[580px] backdrop-blur-md"
            >
              {/* Camera Area */}
              <div className="flex-1 flex flex-col items-center justify-center bg-black/95 border border-neutral-800 p-4 relative min-h-[480px]">
                
                {/* Hidden video element for MediaPipe input */}
                <video 
                  ref={videoRef}
                  style={{ display: "none" }}
                  width="640"
                  height="480"
                  playsInline
                  muted
                />

                {/* Main Overlay Canvas */}
                <canvas 
                  ref={canvasRef}
                  width="640"
                  height="480"
                  className="w-full max-w-[960px] aspect-[4/3] bg-neutral-900 border border-white/10 rounded-2xl shadow-xl"
                />

                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/90 text-center p-6 space-y-4 z-20">
                    <Camera className="w-10 h-10 text-zinc-400 animate-pulse" />
                    <div>
                      <p className="font-body text-sm font-semibold text-white">Cámara Inactiva</p>
                      <p className="font-body text-xs text-zinc-500 max-w-sm mt-1 leading-relaxed">
                        Se requieren permisos de cámara web. Actívala a continuación para comenzar a transmitir tu postura al Sensei.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setCameraActive(true)}
                      className="bg-gradient-to-r from-[#E52B34] via-[#FF4D55] to-[#B81B22] text-white rounded-none text-xs font-bold font-sans-condensed tracking-widest px-8 py-3 hover:opacity-95"
                    >
                      ENCENDER CAMARA EN VIVO
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar student status panel */}
              <div className="w-full xl:w-[320px] shrink-0 border border-white/10 bg-zinc-900/40 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between backdrop-blur-md shadow-2xl">
                
                <div className="space-y-6">
                  {/* Status header */}
                  <div className="border-b border-white/5 pb-4 flex items-center justify-between">
                    <div>
                      <div className="flex gap-1.5 items-center">
                        <span className="text-[9px] font-bold font-title-serif uppercase px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-950/30 rounded-lg">
                          CONECTADO
                        </span>
                        {isP2PConnected ? (
                          <span className="text-[9px] font-bold font-title-serif uppercase px-2 py-0.5 border border-cyan-500/30 text-cyan-400 bg-cyan-950/30 rounded-lg flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span> EN VIVO P2P
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold font-title-serif uppercase px-2 py-0.5 border border-amber-500/30 text-amber-400 bg-amber-950/30 rounded-lg">
                            SONDEO HTTP
                          </span>
                        )}
                      </div>
                      <h2 className="font-impact-condensed text-xl text-white tracking-wide mt-1">
                        SALA: {roomCode}
                      </h2>
                    </div>
                    
                    <button 
                      onClick={handleExitRoom}
                      className="p-2 border border-white/10 hover:border-red-200 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-none transition-all"
                      title="Salir del Dojo"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mode Info */}
                  <div className="space-y-3 font-body text-xs text-zinc-300">
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="font-medium text-zinc-400">Alumno:</span>
                      <span className="font-bold text-zinc-200">{roomInfo?.studentName || "Estudiante"}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="font-medium text-zinc-400">Sensei:</span>
                      <span className="font-bold text-zinc-200">{roomInfo?.senseiName}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="font-medium text-zinc-400">Modo Guiado:</span>
                      <span className="font-bold text-zinc-200">{guidedMode ? "Activo" : "Experto"}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="font-medium text-zinc-400">Tolerancia:</span>
                      <span className="font-bold text-[#E52B34]">{tolerance}°</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="font-medium text-zinc-400">Zona:</span>
                      <span className="font-bold text-zinc-200">
                        {analysisMode === "superior" ? "Tren Superior" : analysisMode === "inferior" ? "Tren Inferior" : "Cuerpo Completo"}
                      </span>
                    </div>
                  </div>

                  {/* Silhouette reference panel */}
                  <div className="bg-zinc-950/60 border border-white/5 p-4 rounded-2xl space-y-3">
                    <h3 className="text-[10px] font-bold font-title-serif uppercase text-[#E52B34] tracking-wider">
                      Postura de Referencia
                    </h3>
                    {selectedPresetId ? (
                      <div className="space-y-2">
                        <p className="font-impact-condensed text-sm text-white tracking-wide">
                          {currentPresetRef.current?.name || "Cargando..."}
                        </p>
                        <p className="font-body text-[11px] text-zinc-500 font-light leading-relaxed">
                          La silueta fantasma en pantalla indica la posición oficial asignada de forma remota por tu instructor.
                        </p>
                      </div>
                    ) : sessionCapture ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-0.5 bg-yellow-400 inline-block"></span>
                          <p className="font-impact-condensed text-sm text-amber-700 tracking-wide">
                            Captura de Sesión Activa
                          </p>
                        </div>
                        <p className="font-body text-[11px] text-amber-600 font-light leading-relaxed">
                          Tu Sensei capturó tu posición como referencia. Ajusta tu postura para alinearte con la silueta dorada.
                        </p>
                        <p className="font-body text-[10px] text-zinc-500">
                          {sessionCapture.mode === "superior" ? "Codos" : "Rodillas"}: {sessionCapture.angles.left}°L / {sessionCapture.angles.right}°R
                        </p>
                      </div>
                    ) : (
                      <p className="font-body text-[11px] text-zinc-400 font-light italic">
                        Esperando que tu Sensei inyecte una postura de referencia...
                      </p>
                    )}
                  </div>

                </div>
 
                <div className="space-y-4 pt-6 border-t border-neutral-100">
                  <div className="bg-amber-950/20 border border-amber-500/20 p-3 rounded-2xl flex gap-2 items-start text-[10px] font-body text-amber-400 leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-bold block uppercase text-[9px] mb-0.5">Pantalla en Primer Plano:</span>
                      Mantén esta pestaña **visible y activa** en tu pantalla. Si minimizas esta ventana o cambias de pestaña, el navegador pausará la cámara y el Sensei no podrá recibir tu postura ni tu transmisión de video.
                    </div>
                  </div>

                  <div className="text-[10px] font-body text-zinc-400 leading-normal flex gap-2 items-start">
                    <HelpCircle className="w-3.5 h-3.5 shrink-0 text-neutral-300 mt-0.5" />
                    <span>Colócate a 2 metros de distancia para que MediaPipe logre identificar tu cuerpo completo.</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* VIEW: SENSEI / INSTRUCTOR dashboard section */}
          {role === "sensei" && (
            <motion.div 
              key="sensei-panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex flex-col xl:flex-row gap-8 bg-zinc-900/40 border border-white/10 shadow-2xl rounded-[2.5rem] p-6 sm:p-8 md:p-10 min-h-[580px] backdrop-blur-md"
            >
              {/* Left Panel: Real-Time Wireframe Canvas rendering student skeleton */}
              <div className="flex-1 flex flex-col items-center justify-center bg-[#0c0f12] border border-neutral-800 p-4 relative min-h-[480px]">
                
                <div className="relative w-full max-w-[960px] aspect-[4/3] bg-[#0c0f12] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  {/* Real-Time Student Video Stream — ALWAYS mounted to prevent DOM flicker */}
                  <video
                    ref={senseiVideoElRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ opacity: studentVideoStream ? 1 : 0, transition: "opacity 0.15s ease" }}
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  />

                  {/* Cyber Grid Canvas (drawn on top of video) */}
                  <canvas 
                    id="sensei-canvas"
                    width="640"
                    height="480"
                    className="absolute inset-0 w-full h-full z-10 bg-transparent"
                  />
                </div>

                {/* Accuracy HUD metrics */}
                {studentPoseData && (
                  <div className="absolute top-8 right-8 bg-black/80 border border-neutral-850 p-4 space-y-1 font-body text-xs rounded-none z-10 backdrop-blur-sm">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">MÉTRICA ALUMNO</span>
                    <div className="flex justify-between gap-6 pt-1 border-t border-neutral-800">
                      <span className="text-zinc-400">Coincidencia:</span>
                      <span className={`font-bold ${studentPoseData.isAligned ? "text-emerald-500" : "text-amber-500"}`}>
                        {studentPoseData.alignmentScore}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel: Controls (Presets, Tolerance, Mode, Save Pose) */}
              <div className="w-full xl:w-[380px] shrink-0 border border-white/10 bg-zinc-900/40 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between space-y-6 backdrop-blur-md shadow-2xl">
                
                <div className="space-y-6">
                  {/* Status header */}
                  <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
                    <div>
                      <div className="flex gap-1.5 items-center">
                        <span className="text-[9px] font-bold font-title-serif uppercase px-2 py-0.5 border border-amber-500/30 text-amber-400 bg-amber-950/30 rounded-lg">
                          MONITOR ACTIVADO
                        </span>
                        {isP2PConnected ? (
                          <span className="text-[9px] font-bold font-title-serif uppercase px-2 py-0.5 border border-cyan-500/30 text-cyan-400 bg-cyan-950/30 rounded-lg flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span> EN VIVO P2P
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold font-title-serif uppercase px-2 py-0.5 border border-amber-500/30 text-amber-600 bg-amber-50">
                            SONDEO HTTP
                          </span>
                        )}
                      </div>
                      <h2 className="font-impact-condensed text-xl text-white tracking-wide mt-1">
                        SALA: {roomCode}
                      </h2>
                    </div>
                    
                    <button 
                      onClick={handleExitRoom}
                      className="p-2 border border-neutral-200 hover:border-red-200 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-none transition-all"
                      title="Cerrar Sala"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Student profile details */}
                  <div className="font-body text-xs text-zinc-300 space-y-2 border-b border-neutral-100 pb-4">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Alumno en Línea:</span>
                      <span className="font-bold text-white">{roomInfo?.studentName || "Buscando..."}</span>
                    </div>
                  </div>

                  {/* Integrated WebRTC P2P Video Stream Status & Info */}
                  <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-none text-xs text-neutral-300 space-y-3">
                    <h4 className="font-title-serif font-extrabold uppercase text-[#FF4D55] tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#FF4D55]" /> Guía de Conexión Integrada
                    </h4>
                    <p className="font-body text-[11px] text-zinc-400 font-light leading-relaxed">
                      El video y los vectores del Alumno se transmiten de forma directa (P2P) y segura entre navegadores sin intermediarios.
                    </p>
                    <ol className="list-decimal pl-4 space-y-2 font-body text-[11px] text-zinc-400 font-light">
                      <li>Comparte el código de la sala con tu alumno.</li>
                      <li>Una vez que el alumno se conecte, la transmisión de video WebRTC comenzará automáticamente.</li>
                      <li>Verás al alumno en la pantalla de la izquierda con su esqueleto vectorizado superpuesto en tiempo real.</li>
                    </ol>
                  </div>

                  {/* 1. ANALYSIS MODE SELECTOR */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-title-serif font-extrabold uppercase text-[#E52B34] tracking-wider flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4" /> Zona de Análisis
                    </h3>
                    <div className="flex border border-white/10 divide-x divide-white/10 bg-zinc-950 rounded-xl overflow-hidden">
                      {([
                        { value: "superior" as const, label: "Tren Superior", desc: "Codos" },
                        { value: "inferior" as const, label: "Tren Inferior", desc: "Rodillas" },
                        { value: "completo" as const, label: "Cuerpo Completo", desc: "Todo" }
                      ]).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setAnalysisMode(opt.value);
                            updateSenseiControls({ analysisMode: opt.value });
                          }}
                          className={`flex-1 px-2 py-2.5 text-center transition-all cursor-pointer ${
                            analysisMode === opt.value
                              ? "bg-[#E52B34] text-white"
                              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                          }`}
                        >
                          <span className="block text-[10px] font-bold font-title-serif uppercase tracking-wider">
                            {opt.label}
                          </span>
                          <span className={`block text-[9px] mt-0.5 ${
                            analysisMode === opt.value ? "text-white/70" : "text-zinc-400"
                          }`}>
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] font-body text-zinc-400 font-light leading-relaxed">
                      {analysisMode === "superior" && "Se miden ángulos de codos. Los brazos se iluminan con colores dinámicos."}
                      {analysisMode === "inferior" && "Se miden ángulos de rodillas. Las piernas se iluminan con colores dinámicos."}
                      {analysisMode === "completo" && "Se miden los 4 ángulos: codos y rodillas. Todo el cuerpo se ilumina con retroalimentación."}
                    </p>
                  </div>

                  {/* 2. LIVE TOLERANCE CONTROLLER */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-title-serif font-extrabold uppercase text-[#E52B34] tracking-wider flex items-center gap-1.5">
                      <SlidersHorizontal className="w-4 h-4" /> Tolerancia de Postura: {tolerance}°
                    </h3>
                    <input 
                      type="range"
                      min={5}
                      max={35}
                      step={1}
                      value={tolerance}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setTolerance(val);
                        updateSenseiControls({ tolerance: val });
                      }}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="flex justify-between text-[9px] font-body text-zinc-400">
                      <span>Exigente (5°)</span>
                      <span>Permisivo (35°)</span>
                    </div>
                  </div>

                  {/* 3. SESSION CAPTURE (live ghost overlay, not saved to DB) */}
                  <div className="bg-zinc-950/60 border border-white/5 p-4 sm:p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-title-serif font-extrabold uppercase text-[#E52B34] tracking-wider flex items-center gap-1.5">
                      <Crosshair className="w-4 h-4" /> Capturar Posición de Sesión
                    </h3>
                    
                    <p className="font-body text-[11px] text-zinc-500 font-light leading-relaxed">
                      Captura la posición actual del alumno como silueta fantasma dorada. Ambos verán la referencia en tiempo real durante esta sesión.
                    </p>

                    {sessionCapture ? (
                      <div className="space-y-3">
                        <div className="bg-amber-950/20 border border-amber-500/20 px-3.5 py-2.5 rounded-2xl font-body text-[11px] text-amber-400 flex gap-2 items-center">
                          <CheckCircle className="w-4 h-4 shrink-0 text-amber-600" />
                          <div>
                            <span className="font-bold block text-[10px] uppercase">Posición Capturada ({analysisMode === "superior" ? "Tren Superior" : analysisMode === "inferior" ? "Tren Inferior" : "Cuerpo Completo"})</span>
                            <span className="text-[10px] text-amber-600">
                              {(analysisMode === "superior" || analysisMode === "completo") && `Codos: ${sessionCapture.angles.left}°L / ${sessionCapture.angles.right}°R`}
                              {analysisMode === "completo" && (sessionCapture as any).angles?.leftKnee !== undefined && ` • Rodillas: ${(sessionCapture as any).angles.leftKnee}°L / ${(sessionCapture as any).angles.rightKnee}°R`}
                              {analysisMode === "inferior" && `Rodillas: ${sessionCapture.angles.left}°L / ${sessionCapture.angles.right}°R`}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSessionCapture(null);
                            updateSenseiControls({ command: "clear_session_capture" });
                          }}
                          className="w-full bg-zinc-800 text-white border border-white/10 rounded-xl text-xs font-bold tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          LIMPIAR CAPTURA DE SESIÓN
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={!studentPoseData?.landmarks || studentPoseData.landmarks.length === 0}
                        onClick={() => {
                          if (studentPoseData?.landmarks && studentPoseData.landmarks.length > 0) {
                            const mode = analysisMode;
                            const angles = calculateCurrentAngles(studentPoseData.landmarks, mode);
                            const captured = {
                              landmarks: [...studentPoseData.landmarks],
                              angles: { ...angles },
                              mode: mode
                            };
                            setSessionCapture(captured);
                            // Send to student via sync
                            updateSenseiControls({ command: "session_capture", sessionCaptureLandmarks: JSON.stringify(captured) });
                          }
                        }}
                        className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white rounded-xl text-xs font-bold tracking-widest py-3 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      >
                        <Crosshair className="w-4 h-4" />
                        CAPTURAR POSICIÓN ACTUAL
                      </button>
                    )}

                    {saveSuccessMessage && (
                      <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 px-3.5 py-2 rounded-2xl font-body text-[10px] flex gap-1.5 items-center">
                        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{saveSuccessMessage}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-neutral-100">
                  <div className="bg-amber-50 border border-amber-250 p-3 rounded-none flex gap-2 items-start text-[10px] font-body text-amber-800 leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-bold block uppercase text-[9px] mb-0.5">Nota sobre Congelamientos:</span>
                      Si ves que el esqueleto del alumno se congela, pídele que mantenga la pestaña de Dojo Virtual **en primer plano y activa** en su pantalla. Los navegadores suspenden la cámara web de las pestañas que se quedan en segundo plano.
                    </div>
                  </div>

                  <div className="text-[10px] font-body text-zinc-400 leading-normal flex gap-2 items-start">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-neutral-300 mt-0.5" />
                    <span>Tu sesión de instructor es 100% segura. Los cambios en el selector se aplican al alumno al instante.</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
