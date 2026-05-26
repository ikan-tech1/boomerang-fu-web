/** Snapshot interpolation for remote player rendering (Colyseus → Phaser) */

export interface InterpolatedState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
}

export class SnapshotInterpolator {
  private readonly buffer = new Map<string, { x: number; y: number; vx: number; vy: number; alive: boolean; at: number }>();
  private readonly delayMs: number;

  constructor(delayMs = 100) {
    this.delayMs = delayMs;
  }

  push(key: string, snapshot: InterpolatedState): void {
    this.buffer.set(key, { ...snapshot, at: performance.now() });
  }

  sample(key: string, now = performance.now()): InterpolatedState | null {
    const current = this.buffer.get(key);
    if (!current) return null;

    const renderTime = now - this.delayMs;
    const alpha = Math.min(1, Math.max(0, (renderTime - (current.at - 16)) / 16));

    return {
      x: current.x,
      y: current.y,
      vx: current.vx * alpha,
      vy: current.vy * alpha,
      alive: current.alive,
    };
  }

  lerpPosition(
    key: string,
    prev: InterpolatedState,
    next: InterpolatedState,
    t: number,
  ): InterpolatedState {
    const x = prev.x + (next.x - prev.x) * t;
    const y = prev.y + (next.y - prev.y) * t;
    const out = { x, y, vx: next.vx, vy: next.vy, alive: next.alive };
    this.buffer.set(key, { ...out, at: performance.now() });
    return out;
  }

  clear(key?: string): void {
    if (key) this.buffer.delete(key);
    else this.buffer.clear();
  }
}
