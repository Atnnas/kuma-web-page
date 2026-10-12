"use client";

import { useRef, useCallback, useEffect } from "react";

/**
 * Hook centralizado para feedback sonoro mediante Web Audio API.
 * Genera tonos sintetizados de alta fidelidad con cero latencia y sin cargar archivos mp3 externos.
 */
export function useExerciseAudio(enabled = true) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
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
  }, []);

  // Beep de repetición válida / alineación correcta (880 Hz A5)
  const playBeep = useCallback((freq = 880, duration = 0.15) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, [enabled, getAudioContext]);

  // Alerta de corrección / buzzer suave de advertencia (220 Hz A3)
  const playWarningBeep = useCallback((freq = 220, duration = 0.28) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, [enabled, getAudioContext]);

  // Chime al alcanzar profundidad / punto de inflexión del ejercicio (523.25 Hz C5)
  const playDepthBeep = useCallback((freq = 523.25, duration = 0.25) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, [enabled, getAudioContext]);

  // Acorde triunfal al completar serie o kata (Acorde C Mayor)
  const playSuccessChord = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startT = ctx.currentTime + idx * 0.08;
        const endT = startT + 0.45;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0.06, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, endT);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startT);
        osc.stop(endT);
      });
    } catch {}
  }, [enabled, getAudioContext]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close().catch(() => {});
        } catch {}
      }
    };
  }, []);

  return {
    playBeep,
    playWarningBeep,
    playDepthBeep,
    playSuccessChord,
    getAudioContext
  };
}
