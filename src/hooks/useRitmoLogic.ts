import { useState, useRef, useEffect } from "react";

type Status = "listo" | "grabando" | "reproduciendo" | "pausado";
type Punto = { id: number; tiempo: number; tipo: "fluido" | "pulso"; estado?: "inicio" | "final" };

export const useRitmoLogic = (
    initAudio: () => void,
    playPulse: () => void,
    startContinuousTone: () => void,
    stopContinuousTone: () => void,
    renderRadar: () => void
) => {
    const [status, setStatus] = useState<Status>("listo");
    const [timer, setTimer] = useState(0);
    const [hasRecordedData, setHasRecordedData] = useState(false);
    const [canSave, setCanSave] = useState(false);

    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const puntosRef = useRef<Punto[]>([]);
    const timerRef = useRef(0);
    const lastTriggeredTimeRef = useRef<number>(-1);
    const lastStateUpdateRef = useRef<number>(0);

    const recordingLoop = (time: number) => {
        const delta = time - startTimeRef.current;
        timerRef.current = Math.floor(delta / 10);
        
        // Throttled UI state updates to prevent 120fps React re-renders while keeping canvas at native 60/120fps
        if (time - lastStateUpdateRef.current > 35) {
            setTimer(timerRef.current);
            lastStateUpdateRef.current = time;
        }

        renderRadar();
        requestRef.current = requestAnimationFrame(recordingLoop);
    };

    const playbackLoop = (time: number) => {
        const delta = time - startTimeRef.current;
        const currentT = Math.floor(delta / 10);
        const prevT = lastTriggeredTimeRef.current;

        puntosRef.current.forEach(p => {
            if (p.tiempo > prevT && p.tiempo <= currentT) {
                if (p.tipo === "pulso") {
                    playPulse();
                    if (typeof navigator !== "undefined" && navigator.vibrate) {
                        try { navigator.vibrate(20); } catch (e) {}
                    }
                }
                if (p.tipo === "fluido") {
                    if (p.estado === "inicio") startContinuousTone();
                    else stopContinuousTone();
                }
            }
        });

        lastTriggeredTimeRef.current = currentT;
        timerRef.current = currentT;

        // Throttled UI state updates
        if (time - lastStateUpdateRef.current > 35) {
            setTimer(currentT);
            lastStateUpdateRef.current = time;
        }

        renderRadar();

        const maxTime = puntosRef.current.length > 0 ? puntosRef.current[puntosRef.current.length - 1].tiempo : 0;
        if (currentT > maxTime + 100) {
            pauseAll();
            timerRef.current = 0;
            setTimer(0);
            return;
        }

        requestRef.current = requestAnimationFrame(playbackLoop);
    };

    // Mobile / Touch action helpers with haptic feedback
    const recordPulseAction = () => {
        if (status !== "grabando") return;
        playPulse();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            try { navigator.vibrate(25); } catch (e) {}
        }
        puntosRef.current.push({ id: Date.now(), tiempo: timerRef.current, tipo: "pulso" });
    };

    const startFluidAction = () => {
        if (status !== "grabando") return;
        startContinuousTone();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            try { navigator.vibrate(15); } catch (e) {}
        }
        puntosRef.current.push({ id: Date.now(), tiempo: timerRef.current, tipo: "fluido", estado: "inicio" });
    };

    const stopFluidAction = () => {
        if (status !== "grabando") return;
        stopContinuousTone();
        puntosRef.current.push({ id: Date.now(), tiempo: timerRef.current, tipo: "fluido", estado: "final" });
    };

    const startRecording = () => {
        initAudio();
        setStatus("grabando");
        setHasRecordedData(false);
        setCanSave(true);
        puntosRef.current = [];
        timerRef.current = 0;
        setTimer(0);
        lastStateUpdateRef.current = performance.now();
        startTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(recordingLoop);
    };

    const startPlayback = () => {
        if (puntosRef.current.length === 0) return;
        initAudio();
        setStatus("reproduciendo");
        lastTriggeredTimeRef.current = -1;
        lastStateUpdateRef.current = performance.now();
        startTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(playbackLoop);
    };

    const stopAll = () => {
        const deltaData = puntosRef.current.length > 0;
        cancelAnimationFrame(requestRef.current);
        setStatus("listo");
        stopContinuousTone();
        setTimer(timerRef.current);
        if (deltaData) setHasRecordedData(true);
    };

    const pauseAll = () => {
        cancelAnimationFrame(requestRef.current);
        setStatus("pausado");
        stopContinuousTone();
        setTimer(timerRef.current);
    };

    const clearSession = () => {
        stopAll();
        puntosRef.current = [];
        setTimer(0);
        timerRef.current = 0;
        setHasRecordedData(false);
        setTimeout(renderRadar, 50);
    };

    useEffect(() => {
        return () => {
            cancelAnimationFrame(requestRef.current);
            stopContinuousTone();
        };
    }, []);

    const seekTo = (seekTime: number) => {
        const safeT = Math.max(0, seekTime);
        timerRef.current = safeT;
        setTimer(safeT);
        if (status === "reproduciendo") {
            startTimeRef.current = performance.now() - (safeT * 10);
            lastTriggeredTimeRef.current = safeT - 1;
        }
        renderRadar();
    };

    return {
        status,
        timer,
        hasRecordedData,
        canSave,
        puntosRef,
        timerRef,
        startRecording,
        startPlayback,
        stopAll,
        pauseAll,
        clearSession,
        recordPulseAction,
        startFluidAction,
        stopFluidAction,
        seekTo,
        setHasRecordedData,
        setCanSave,
        setTimer,
        setStatus
    };
};
