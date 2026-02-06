"use client";

class AudioTrainer {
    private synth: SpeechSynthesis | null = null;
    private audioCtx: AudioContext | null = null;
    private voice: SpeechSynthesisVoice | null = null;

    constructor() {
        if (typeof window !== "undefined") {
            this.synth = window.speechSynthesis;
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Initialize voices
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = () => this.loadVoice();
            }
            this.loadVoice();
        }
    }

    private loadVoice() {
        if (!this.synth) return;
        const voices = this.synth.getVoices();

        // Priority: Mexican Spanish > Latin American Spanish > Spanish > Any
        this.voice = voices.find(v => v.lang === 'es-MX') ||
            voices.find(v => v.lang === 'es-419') ||
            voices.find(v => v.lang.startsWith('es')) ||
            null;
    }

    public speak(text: string) {
        if (!this.synth || !this.voice) {
            // Try loading again if voice wasn't ready
            this.loadVoice();
            if (!this.synth) return;
        }

        // Cancel previous speech to avoid queue buildup
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (this.voice) utterance.voice = this.voice;

        // Adjust for a more energetic "trainer" feel
        utterance.rate = 1.1;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        this.synth.speak(utterance);
    }

    public playTone(frequency: number = 440, duration: number = 0.1, type: OscillatorType = "sine") {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }

    public playBeep() {
        this.playTone(880, 0.1, "sine"); // High pitch beep
    }

    public playCountdown() {
        this.playTone(660, 0.15, "square"); // Distinct countdown beep
    }

    public playStart() {
        // Ascending chime
        setTimeout(() => this.playTone(440, 0.1), 0);
        setTimeout(() => this.playTone(554, 0.1), 100);
        setTimeout(() => this.playTone(659, 0.4), 200);
    }

    public playWin() {
        // Victory fanfare snippet
        this.playTone(523.25, 0.1); // C5
        setTimeout(() => this.playTone(659.25, 0.1), 150); // E5
        setTimeout(() => this.playTone(783.99, 0.1), 300); // G5
        setTimeout(() => this.playTone(1046.50, 0.4), 450); // C6
    }
}

// Singleton instance
export const audioTrainer = new AudioTrainer();
