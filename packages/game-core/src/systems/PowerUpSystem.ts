import type { PowerUpId } from '@boomerang/content';
import { balance } from '@boomerang/content';
import Phaser from 'phaser';
import type { PlayerEntity } from '../entities/Player';
import { POWER_UP_COLORS, POWER_UP_LABELS, randomPowerUpType } from './PowerUpInventory';

export interface WorldPowerUp {
  id: string;
  type: PowerUpId;
  x: number;
  y: number;
  sprite: Phaser.GameObjects.Container;
}

export class PowerUpSystem {
  private readonly pickups: WorldPowerUp[] = [];
  private spawnTimer = 0;
  private readonly scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.spawnTimer = balance.match.powerUpSpawnIntervalSec * 1000;
  }

  update(dt: number, players: PlayerEntity[]): void {
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnRandom(players);
      this.spawnTimer = balance.match.powerUpSpawnIntervalSec * 1000;
    }

    for (const player of players) {
      if (!player.alive) continue;
      for (let i = this.pickups.length - 1; i >= 0; i--) {
        const p = this.pickups[i];
        if (!p) continue;
        const dx = player.body.position.x - p.x;
        const dy = player.body.position.y - p.y;
        const pickupRadius = player.inventory.has('magnet')
          ? balance.match.powerUpPickupRadiusPx * 3
          : balance.match.powerUpPickupRadiusPx;
        if (Math.hypot(dx, dy) < pickupRadius) {
          if (player.addPowerUp(p.type)) {
            this.applyImmediateEffect(player, p.type);
            p.sprite.destroy();
            this.pickups.splice(i, 1);
          }
        }
      }
    }
  }

  private applyImmediateEffect(player: PlayerEntity, type: PowerUpId): void {
    switch (type) {
      case 'teleport':
        player.body.position.x += player.aimX * 120;
        player.body.position.y += player.aimY * 120;
        break;
      case 'decoy':
        this.spawnDecoy(player);
        break;
      case 'disguise':
        player.disguised = true;
        break;
      case 'golden':
        player.hasGoldenBoomerang = true;
        break;
      case 'ice':
        break;
      case 'fire':
        break;
      default:
        break;
    }
  }

  private spawnDecoy(player: PlayerEntity): void {
    const decoy = this.scene.add.circle(
      player.body.position.x + 40,
      player.body.position.y,
      balance.player.radiusPx,
      0x888888,
      0.5,
    );
    this.scene.time.delayedCall(3000, () => decoy.destroy());
  }

  private spawnRandom(players: PlayerEntity[]): void {
    const bounds = (this.scene as Phaser.Scene & { arenaBounds?: { w: number; h: number } }).arenaBounds;
    if (!bounds) return;
    const margin = 60;
    const x = Phaser.Math.Between(margin, bounds.w - margin);
    const y = Phaser.Math.Between(margin, bounds.h - margin);

    for (const p of players) {
      if (Math.hypot(p.body.position.x - x, p.body.position.y - y) < 80) return;
    }

    const type = randomPowerUpType();
    const color = POWER_UP_COLORS[type] ?? 0xffffff;
    const gfx = this.scene.add.circle(0, 0, 12, color);
    const label = this.scene.add.text(0, 0, POWER_UP_LABELS[type]?.slice(0, 1) ?? '?', {
      fontSize: '10px',
      color: '#000',
    }).setOrigin(0.5);
    const container = this.scene.add.container(x, y, [gfx, label]);
    this.pickups.push({
      id: `pu-${Date.now()}`,
      type,
      x,
      y,
      sprite: container,
    });
  }

  getPickupCount(): number {
    return this.pickups.length;
  }

  destroy(): void {
    for (const p of this.pickups) p.sprite.destroy();
    this.pickups.length = 0;
  }
}

/** Apply on-hit power-up effects */
export function applyHitPowerUps(
  attacker: PlayerEntity,
  victim: PlayerEntity,
  scene: Phaser.Scene,
): void {
  if (attacker.inventory.has('fire')) {
    victim.takeHit(attacker, 'boomerang');
    spreadFire(scene, victim.body.position.x, victim.body.position.y);
  } else if (attacker.inventory.has('ice')) {
    victim.frozen = true;
    victim.body.velocity.x = 0;
    victim.body.velocity.y = 0;
    scene.time.delayedCall(3000, () => {
      victim.frozen = false;
    });
  } else if (attacker.inventory.has('explosive')) {
    explodeAt(scene, victim.body.position.x, victim.body.position.y, attacker);
  } else {
    victim.takeHit(attacker, 'boomerang');
  }

  if (victim.disguised) {
    victim.disguised = false;
  }
}

function spreadFire(scene: Phaser.Scene, x: number, y: number): void {
  const flame = scene.add.circle(x, y, 20, 0xff4400, 0.6);
  scene.tweens.add({ targets: flame, alpha: 0, scale: 2, duration: 400, onComplete: () => flame.destroy() });
}

function explodeAt(scene: Phaser.Scene, x: number, y: number, attacker: PlayerEntity): void {
  const boom = scene.add.circle(x, y, 30, 0xff8800, 0.7);
  scene.tweens.add({ targets: boom, alpha: 0, scale: 3, duration: 300, onComplete: () => boom.destroy() });
  const players = (scene as Phaser.Scene & { players?: PlayerEntity[] }).players ?? [];
  for (const p of players) {
    if (!p.alive) continue;
    const dist = Math.hypot(p.body.position.x - x, p.body.position.y - y);
    if (dist < 60) p.takeHit(attacker, 'explosion');
  }
}
