import type { InputFrame } from '@boomerang/netcode';
import { SnapshotInterpolator } from '@boomerang/netcode';
import Matter from 'matter-js';
import type { PlayerEntity } from '../entities/Player';

export interface OnlinePlayerSnapshot {
  sessionKey: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
  characterId: string;
  kills: number;
}

export interface OnlineSyncBridge {
  sendInput(input: InputFrame): void;
  onStateChange(handler: (state: unknown) => void): void;
  getLocalSessionId(): string | null;
}

/** Applies authoritative Colyseus snapshots with interpolation for remote players */
export class OnlineSyncController {
  private readonly interpolator = new SnapshotInterpolator(100);
  private readonly prevPositions = new Map<string, { x: number; y: number }>();
  private localSessionId: string | null = null;
  private frame = 0;

  constructor(private readonly bridge: OnlineSyncBridge) {
    this.localSessionId = bridge.getLocalSessionId();
    bridge.onStateChange((state) => this.applyState(state));
  }

  pollLocalInput(playerId: number, moveX: number, moveY: number, aimX: number, aimY: number, buttons: InputFrame['buttons']): void {
    this.frame += 1;
    this.bridge.sendInput({
      frame: this.frame,
      playerId,
      moveX,
      moveY,
      aimX,
      aimY,
      buttons,
    });
  }

  syncRemotePlayers(players: PlayerEntity[], snapshots: OnlinePlayerSnapshot[]): void {
    for (const snap of snapshots) {
      if (snap.sessionKey === this.localSessionId) continue;
      const player = players.find((p) => p.id === Number(snap.sessionKey) || String(p.id) === snap.sessionKey);
      if (!player) continue;

      const prev = this.prevPositions.get(snap.sessionKey) ?? { x: snap.x, y: snap.y };
      const t = 0.35;
      const x = prev.x + (snap.x - prev.x) * t;
      const y = prev.y + (snap.y - prev.y) * t;
      this.prevPositions.set(snap.sessionKey, { x: snap.x, y: snap.y });

      this.interpolator.push(snap.sessionKey, { x, y, vx: snap.vx, vy: snap.vy, alive: snap.alive });
      const sample = this.interpolator.sample(snap.sessionKey);
      if (!sample) continue;

      Matter.Body.setPosition(player.body as Matter.Body, { x: sample.x, y: sample.y });
      Matter.Body.setVelocity(player.body as Matter.Body, { x: sample.vx, y: sample.vy });
      player.alive = sample.alive;
      player.sprite.setVisible(sample.alive);
      player.kills = snap.kills;
    }
  }

  syncLocalPlayer(player: PlayerEntity, snap: OnlinePlayerSnapshot): void {
    const prev = this.prevPositions.get(snap.sessionKey) ?? { x: snap.x, y: snap.y };
    const x = prev.x + (snap.x - prev.x) * 0.5;
    const y = prev.y + (snap.y - prev.y) * 0.5;
    this.prevPositions.set(snap.sessionKey, { x: snap.x, y: snap.y });
    Matter.Body.setPosition(player.body as Matter.Body, { x, y });
    player.alive = snap.alive;
    player.sprite.setVisible(snap.alive);
    player.kills = snap.kills;
  }

  private applyState(state: unknown): void {
    const s = state as { players?: Map<string, { x: number; y: number; vx: number; vy: number; alive: boolean; characterId: string; kills: number }> };
    if (!s?.players) return;
    for (const [key, ps] of s.players.entries()) {
      this.interpolator.push(key, {
        x: ps.x,
        y: ps.y,
        vx: ps.vx,
        vy: ps.vy,
        alive: ps.alive,
      });
    }
  }

  parseSnapshots(state: unknown): OnlinePlayerSnapshot[] {
    const s = state as { players?: Map<string, { x: number; y: number; vx: number; vy: number; alive: boolean; characterId: string; kills: number }> };
    if (!s?.players) return [];
    return [...s.players.entries()].map(([sessionKey, ps]) => ({
      sessionKey,
      x: ps.x,
      y: ps.y,
      vx: ps.vx,
      vy: ps.vy,
      alive: ps.alive,
      characterId: ps.characterId,
      kills: ps.kills,
    }));
  }
}
