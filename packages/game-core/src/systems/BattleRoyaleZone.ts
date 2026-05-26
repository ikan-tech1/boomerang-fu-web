import { balance } from '@boomerang/content';
import Phaser from 'phaser';
import type { PlayerEntity } from '../entities/Player';

export class BattleRoyaleZone {
  private active = false;
  private centerX = 0;
  private centerY = 0;
  private radius = 0;
  private readonly minRadius: number;
  private shrinkPerSec: number;
  private ring: Phaser.GameObjects.Graphics | null = null;
  private dangerRing: Phaser.GameObjects.Graphics | null = null;

  constructor(
    private readonly scene: Phaser.Scene,
    bounds: { w: number; h: number },
  ) {
    this.centerX = bounds.w / 2;
    this.centerY = bounds.h / 2;
    this.radius = Math.min(bounds.w, bounds.h) * 0.45;
    this.minRadius = Math.min(bounds.w, bounds.h) * 0.12;
    this.shrinkPerSec = this.radius / (balance.match.defaultRoundTimerSec * 0.75);
  }

  activate(): void {
    if (this.active) return;
    this.active = true;
    this.ring = this.scene.add.graphics().setDepth(50);
    this.dangerRing = this.scene.add.graphics().setDepth(49);
  }

  isActive(): boolean {
    return this.active;
  }

  update(dt: number, players: PlayerEntity[]): void {
    if (!this.active || !this.ring || !this.dangerRing) return;

    const dtSec = dt / 1000;
    this.radius = Math.max(this.minRadius, this.radius - this.shrinkPerSec * dtSec);

    this.ring.clear();
    this.ring.lineStyle(3, 0xff0044, 0.9);
    this.ring.strokeCircle(this.centerX, this.centerY, this.radius);

    this.dangerRing.clear();
    this.dangerRing.fillStyle(0xff0044, 0.08);
    this.dangerRing.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    this.dangerRing.fillStyle(0x000000, 0);
    this.dangerRing.fillCircle(this.centerX, this.centerY, this.radius);

    for (const player of players) {
      if (!player.alive) continue;
      const dist = Math.hypot(
        player.body.position.x - this.centerX,
        player.body.position.y - this.centerY,
      );
      if (dist > this.radius) {
        player.takeHit(null, 'environment');
      }
    }
  }

  destroy(): void {
    this.ring?.destroy();
    this.dangerRing?.destroy();
    this.ring = null;
    this.dangerRing = null;
  }
}
