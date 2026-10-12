class CosmicSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private heartbeatInterval: number | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private currentUrl: string = '';

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setCustomMusicUrl(url: string) {
    if (!url || url === this.currentUrl) return;
    this.currentUrl = url;
    if (this.customAudio) {
      this.customAudio.src = url;
      this.customAudio.load();
      if (!this.isMuted) {
        this.customAudio.play().catch(() => {});
      }
    }
  }

  public startMusic(url?: string) {
    const targetUrl = url || this.currentUrl;
    if (!targetUrl) {
      this.startCosmicSynth();
      return;
    }

    this.currentUrl = targetUrl;
    if (!this.customAudio) {
      this.customAudio = new Audio();
      this.customAudio.src = targetUrl;
      this.customAudio.loop = true;
      this.customAudio.volume = 0.52;
      this.customAudio.preload = 'auto';

      this.customAudio.addEventListener('ended', () => {
        if (!this.isMuted && this.customAudio) {
          this.customAudio.currentTime = 0;
          this.customAudio.play().catch(() => {});
        }
      });
    }

    if (!this.isMuted) {
      this.customAudio.play().catch(() => {
        // Fallback to synth if browser blocks media or network error
        this.startCosmicSynth();
      });
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.customAudio) {
      if (this.isMuted) {
        this.customAudio.pause();
      } else {
        this.customAudio.play().catch(() => {});
      }
    }

    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.08,
        this.ctx.currentTime
      );
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isPlaying(): boolean {
    return !!(this.customAudio && !this.customAudio.paused);
  }

  public startCosmicSynth() {
    if (this.isAmbientPlaying || typeof window === 'undefined') return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.06,
        ctx.currentTime
      );
      this.ambientGain.connect(ctx.destination);

      const freqs = [130.81, 196.0, 246.94, 329.63, 392.0];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(
          freq + (Math.random() - 0.5) * 1.5,
          ctx.currentTime
        );

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        osc.connect(filter);
        filter.connect(this.ambientGain!);

        osc.start();
      });

      this.isAmbientPlaying = true;
    } catch {}
  }

  public playHeartbeat(bpm: number = 72, volumeMultiplier: number = 1.0) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const playThump = (
      freq: number,
      decay: number,
      delay: number,
      gainVal: number
    ) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(32, now + decay);

          const finalGain = Math.min(0.5 * volumeMultiplier, 0.8) * gainVal;
          gain.gain.setValueAtTime(finalGain, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + decay);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + decay);
        } catch {}
      }, delay);
    };

    playThump(68, 0.16, 0, 1.0);
    playThump(54, 0.22, 140, 0.75);
  }

  public startHeartbeatLoop(bpm: number = 72, volume: number = 1.0) {
    this.stopHeartbeatLoop();
    const intervalMs = (60 / bpm) * 1000;
    this.playHeartbeat(bpm, volume);
    this.heartbeatInterval = window.setInterval(() => {
      this.playHeartbeat(bpm, volume);
    }, intervalMs);
  }

  public stopHeartbeatLoop() {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  public playCosmicChime() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 1.2);
        } catch {}
      }, i * 110);
    });
  }

  public playStepSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }
}

export const cosmicAudio = new CosmicSoundEngine();
