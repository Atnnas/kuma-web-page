// Zero-dependency sound effects generator using Web Audio API

class SoundEffects {
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;

    constructor() {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("kuma_didactic_muted");
            this.isMuted = saved === "true";
        }
    }

    private initContext() {
        if (!this.ctx && typeof window !== "undefined") {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        if (typeof window !== "undefined") {
            localStorage.setItem("kuma_didactic_muted", String(this.isMuted));
        }
        return this.isMuted;
    }

    public getMuted(): boolean {
        return this.isMuted;
    }

    public playClick() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    public playCorrect() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major triad fanfare)

        notes.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.12, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.25);
        });
    }

    public playWoodBreak() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. Heavy explosive bass punch impact (240Hz -> 35Hz)
        const thudOsc = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        thudOsc.type = "triangle";
        thudOsc.frequency.setValueAtTime(240, now);
        thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.16);
        thudGain.gain.setValueAtTime(0.35, now);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        thudOsc.connect(thudGain);
        thudGain.connect(this.ctx.destination);
        thudOsc.start(now);
        thudOsc.stop(now + 0.18);

        // 2. High crisp wood rupture snaps
        const snapOsc1 = this.ctx.createOscillator();
        const snapGain1 = this.ctx.createGain();
        snapOsc1.type = "sawtooth";
        snapOsc1.frequency.setValueAtTime(1400, now);
        snapOsc1.frequency.exponentialRampToValueAtTime(280, now + 0.09);
        snapGain1.gain.setValueAtTime(0.22, now);
        snapGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        snapOsc1.connect(snapGain1);
        snapGain1.connect(this.ctx.destination);
        snapOsc1.start(now);
        snapOsc1.stop(now + 0.09);

        const snapOsc2 = this.ctx.createOscillator();
        const snapGain2 = this.ctx.createGain();
        snapOsc2.type = "triangle";
        snapOsc2.frequency.setValueAtTime(2800, now + 0.012);
        snapOsc2.frequency.exponentialRampToValueAtTime(350, now + 0.08);
        snapGain2.gain.setValueAtTime(0.18, now + 0.012);
        snapGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        snapOsc2.connect(snapGain2);
        snapGain2.connect(this.ctx.destination);
        snapOsc2.start(now + 0.012);
        snapOsc2.stop(now + 0.08);

        // 3. High harmonic martial slice ring (bright cartoon energy ping)
        const pingOsc = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        pingOsc.type = "sine";
        pingOsc.frequency.setValueAtTime(1760, now + 0.02);
        pingOsc.frequency.exponentialRampToValueAtTime(880, now + 0.22);
        pingGain.gain.setValueAtTime(0.12, now + 0.02);
        pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        pingOsc.connect(pingGain);
        pingGain.connect(this.ctx.destination);
        pingOsc.start(now + 0.02);
        pingOsc.stop(now + 0.22);
    }

    public playWrong() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.28);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.28);
    }

    public playStreak() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73];

        notes.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);

            gain.gain.setValueAtTime(0.1, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.2);
        });
    }

    public playComplete() {
        if (this.isMuted) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Fanfare: C4, G4, C5, E5, G5, C6
        const chord = [261.63, 392.00, 523.25, 659.25, 783.99, 1046.50];

        chord.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = idx >= 4 ? "triangle" : "sine";
            osc.frequency.setValueAtTime(freq, now + idx * 0.09);

            gain.gain.setValueAtTime(0.14, now + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.5);
        });
    }
}

export const didacticSound = new SoundEffects();
