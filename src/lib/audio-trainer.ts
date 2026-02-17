"use client";

class AudioTrainer {
    private synth: SpeechSynthesis | null = null;
    private audioCtx: AudioContext | null = null;
    private voice: SpeechSynthesisVoice | null = null;
    private continuousOsc: OscillatorNode | null = null;
    private continuousGain: GainNode | null = null;

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

    private async resumeContext() {
        if (this.audioCtx && this.audioCtx.state === "suspended") {
            await this.audioCtx.resume();
        }
    }

    public async playTone(frequency: number = 440, duration: number = 0.1, type: OscillatorType = "sine") {
        if (!this.audioCtx) return;
        await this.resumeContext();

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

    public async startContinuousTone(frequency: number = 330, type: OscillatorType = "sawtooth") {
        if (!this.audioCtx || this.continuousOsc) return;
        await this.resumeContext();

        this.continuousOsc = this.audioCtx.createOscillator();
        this.continuousGain = this.audioCtx.createGain();

        this.continuousOsc.type = type;
        this.continuousOsc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

        this.continuousGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        this.continuousGain.gain.linearRampToValueAtTime(0.05, this.audioCtx.currentTime + 0.1);

        this.continuousOsc.connect(this.continuousGain);
        this.continuousGain.connect(this.audioCtx.destination);

        this.continuousOsc.start();
    }

    public stopContinuousTone() {
        if (!this.audioCtx || !this.continuousOsc || !this.continuousGain) return;

        const now = this.audioCtx.currentTime;
        this.continuousGain.gain.cancelScheduledValues(now);
        this.continuousGain.gain.setValueAtTime(this.continuousGain.gain.value, now);
        this.continuousGain.gain.linearRampToValueAtTime(0, now + 0.1);

        const osc = this.continuousOsc;
        setTimeout(() => {
            try {
                osc.stop();
                osc.disconnect();
            } catch (e) { }
        }, 150);

        this.continuousOsc = null;
        this.continuousGain = null;
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
