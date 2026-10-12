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
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume().catch(() => {});
        }
    };

    const playPulse = () => {
        initAudio();
        if (!audioCtxRef.current || !masterGainRef.current) return;
        
        const now = audioCtxRef.current.currentTime;
        const osc = audioCtxRef.current.createOscillator();
        const subOsc = audioCtxRef.current.createOscillator();
        const g = audioCtxRef.current.createGain();
        
        // Impact punch: high transient dropping to fundamental body
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

        // Sub thud for tactile feel
        subOsc.type = "triangle";
        subOsc.frequency.setValueAtTime(220, now);
        subOsc.frequency.exponentialRampToValueAtTime(60, now + 0.1);

        g.gain.setValueAtTime(0.7 * volume, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(g);
        subOsc.connect(g);
        g.connect(masterGainRef.current);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + 0.12);
        subOsc.stop(now + 0.12);
    };

    const startContinuousTone = () => {
        initAudio();
        if (!audioCtxRef.current || !masterGainRef.current || oscillatorRef.current) return;
        
        const now = audioCtxRef.current.currentTime;
        const osc = audioCtxRef.current.createOscillator();
        const g = audioCtxRef.current.createGain();
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(329.63, now); // E4 harmonic
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.35 * volume, now + 0.05);

        osc.connect(g);
        g.connect(masterGainRef.current);
        osc.start(now);
        oscillatorRef.current = osc;
    };

    const stopContinuousTone = () => {
        if (oscillatorRef.current && audioCtxRef.current) {
            try {
                oscillatorRef.current.stop();
            } catch (e) {}
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
