import { useRef, useEffect } from "react";

export const useRitmoAudio = (volume: number) => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);

    const initAudio = () => {
        if (typeof window === "undefined") return;
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            masterGainRef.current = audioCtxRef.current.createGain();
            masterGainRef.current.connect(audioCtxRef.current.destination);
            masterGainRef.current.gain.value = volume;
        }
    };

    const playPulse = () => {
        if (!audioCtxRef.current || !masterGainRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const g = audioCtxRef.current.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime);
        g.gain.setValueAtTime(0.5 * volume, audioCtxRef.current.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.1);
        osc.connect(g);
        g.connect(masterGainRef.current);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.1);
    };

    const startContinuousTone = () => {
        if (!audioCtxRef.current || !masterGainRef.current || oscillatorRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const g = audioCtxRef.current.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, audioCtxRef.current.currentTime);
        g.gain.setValueAtTime(0.3 * volume, audioCtxRef.current.currentTime);
        osc.connect(g);
        g.connect(masterGainRef.current);
        osc.start();
        oscillatorRef.current = osc;
    };

    const stopContinuousTone = () => {
        if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current = null;
        }
    };

    useEffect(() => {
        if (masterGainRef.current && audioCtxRef.current) {
            masterGainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.05);
        }
    }, [volume]);

    return { initAudio, playPulse, startContinuousTone, stopContinuousTone, audioCtxRef };
};
