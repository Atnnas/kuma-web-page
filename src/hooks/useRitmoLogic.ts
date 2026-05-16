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

    const recordingLoop = (time: number) => {
        const delta = time - startTimeRef.current;
        timerRef.current = Math.floor(delta / 10);
        setTimer(timerRef.current);
        renderRadar();
        requestRef.current = requestAnimationFrame(recordingLoop);
    };

    const playbackLoop = (time: number) => {
        const delta = time - startTimeRef.current;
        const currentT = Math.floor(delta / 10);
        const prevT = lastTriggeredTimeRef.current;

        puntosRef.current.forEach(p => {
            if (p.tiempo > prevT && p.tiempo <= currentT) {
                if (p.tipo === "pulso") playPulse();
                if (p.tipo === "fluido") {
                    if (p.estado === "inicio") startContinuousTone();
                    else stopContinuousTone();
                }
            }
        });

        lastTriggeredTimeRef.current = currentT;
        timerRef.current = currentT;
        setTimer(currentT);
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

    const startRecording = () => {
        initAudio();
        setStatus("grabando");
        setHasRecordedData(false);
        setCanSave(true);
        puntosRef.current = [];
        timerRef.current = 0;
        setTimer(0);
        startTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(recordingLoop);
    };

    const startPlayback = () => {
        if (puntosRef.current.length === 0) return;
        initAudio();
        setStatus("reproduciendo");
        lastTriggeredTimeRef.current = -1;
        startTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(playbackLoop);
    };

    const stopAll = () => {
        const deltaData = puntosRef.current.length > 0;
        cancelAnimationFrame(requestRef.current);
        setStatus("listo");
        stopContinuousTone();
        if (deltaData) setHasRecordedData(true);
    };

    const pauseAll = () => {
        cancelAnimationFrame(requestRef.current);
        setStatus("pausado");
        stopContinuousTone();
    };

    const clearSession = () => {
        stopAll();
        puntosRef.current = [];
        setTimer(0);
        timerRef.current = 0;
        setHasRecordedData(false);
        setTimeout(renderRadar, 50);
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
        setHasRecordedData,
        setCanSave,
        setTimer,
        setStatus
    };
};
