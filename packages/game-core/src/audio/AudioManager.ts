import { Howl } from 'howler';

type SfxPreset = { freq: number; duration: number; type: OscillatorType; gain?: number };

/** Procedural SFX via Web Audio — audible interim until asset banks ship */
export class AudioManager {
  private enabled = true;
  private ctx: AudioContext | null = null;
  private readonly presets = new Map<string, SfxPreset>();

  constructor() {
    const events: Record<string, SfxPreset> = {
      throw: { freq: 520, duration: 0.08, type: 'square', gain: 0.12 },
      catch: { freq: 680, duration: 0.06, type: 'sine', gain: 0.1 },
      melee: { freq: 180, duration: 0.1, type: 'sawtooth', gain: 0.14 },
      dash: { freq: 320, duration: 0.12, type: 'triangle', gain: 0.1 },
      pickup: { freq: 880, duration: 0.07, type: 'sine', gain: 0.11 },
      explosion: { freq: 90, duration: 0.25, type: 'sawtooth', gain: 0.18 },
      freeze: { freq: 1200, duration: 0.15, type: 'sine', gain: 0.08 },
      kill: { freq: 240, duration: 0.2, type: 'square', gain: 0.15 },
      ui_click: { freq: 640, duration: 0.04, type: 'sine', gain: 0.08 },
      round_sting: { freq: 440, duration: 0.35, type: 'triangle', gain: 0.12 },
      disguise_match: { freq: 400, duration: 0.1, type: 'sine', gain: 0.09 },
    };
    for (const [id, preset] of Object.entries(events)) {
      this.presets.set(id, preset);
    }
  }

  private ensureContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  play(event: string): void {
    const preset = this.presets.get(event);
    if (!preset) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = preset.type;
    osc.frequency.setValueAtTime(preset.freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(preset.freq * 0.5, ctx.currentTime + preset.duration);
    gain.gain.setValueAtTime(preset.gain ?? 0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + preset.duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + preset.duration);
  }

  private musicOsc: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;

  playMusic(track: 'menu' | 'match'): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.stopMusic();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const base = track === 'menu' ? 220 : 280;
    osc.frequency.setValueAtTime(base, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    this.musicOsc = osc;
    this.musicGain = gain;
  }

  stopMusic(): void {
    try {
      this.musicOsc?.stop();
    } catch {
      /* already stopped */
    }
    this.musicOsc = null;
    this.musicGain = null;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  loadBank(_bankId: string, _url: string): void {
    // Future: load Howler sprite banks from assets/build/
  }
}

export const audioManager = new AudioManager();
