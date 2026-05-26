import type { PowerUpId } from '@boomerang/content';
import { balance } from '@boomerang/content';
import type { InputButtons } from '@boomerang/netcode';
import Phaser from 'phaser';
import { audioManager } from '../audio/AudioManager';
import { characterRegistry } from '../characters/CharacterRegistry';
import type { BoomerangState } from '../types';
import { BoomerangEntity } from './Boomerang';
import { PowerUpInventory } from '../systems/PowerUpInventory';

export class PlayerEntity {
  readonly id: number;
  readonly characterId: string;
  readonly isBot: boolean;
  team?: number;

  body: MatterJS.BodyType;
  sprite: Phaser.GameObjects.Container;
  label: Phaser.GameObjects.Text;
  boomerang: BoomerangEntity;

  alive = true;
  kills = 0;
  score = 0;

  moveX = 0;
  moveY = 0;
  aimX = 1;
  aimY = 0;

  private dashTimer = 0;
  private dashCooldown = 0;
  private meleeTimer = 0;
  private throwCharge = 0;
  private throwHeld = false;
  respawnTimer = 0;
  private iFrames = 0;

  readonly inventory = new PowerUpInventory();
  private readonly scene: Phaser.Scene;
  private readonly matter: Phaser.Physics.Matter.MatterPhysics;

  frozen = false;
  disguised = false;
  hasGoldenBoomerang = false;

  constructor(
    scene: Phaser.Scene,
    matter: Phaser.Physics.Matter.MatterPhysics,
    config: { id: number; characterId: string; x: number; y: number; isBot?: boolean; team?: number },
  ) {
    this.scene = scene;
    this.matter = matter;
    this.id = config.id;
    this.characterId = config.characterId;
    this.isBot = config.isBot ?? false;
    this.team = config.team;

    const char = characterRegistry.get(config.characterId);
    const r = balance.player.radiusPx;

    this.body = matter.add.circle(config.x, config.y, r, {
      label: `player-${config.id}`,
      frictionAir: 0.05,
      mass: balance.player.mass,
    });

    const gfx = scene.add.circle(0, 0, r, char.colorHex);
    gfx.setStrokeStyle(2, 0xffffff);
    this.label = scene.add.text(0, -r - 8, char.name.slice(0, 3), {
      fontSize: '10px',
      color: '#fff',
    }).setOrigin(0.5);

    this.sprite = scene.add.container(config.x, config.y, [gfx, this.label]);
    this.boomerang = new BoomerangEntity(scene, matter, this);
  }

  applyInput(buttons: InputButtons, dt: number): void {
    if (!this.alive || this.frozen) return;

    if (buttons.dash && this.dashCooldown <= 0) {
      this.startDash();
    }
    if (buttons.melee && this.meleeTimer <= 0) {
      this.startMelee();
    }
    if (buttons.throwHeld) {
      this.throwHeld = true;
      this.throwCharge = Math.min(
        this.throwCharge + dt,
        balance.controls.throwChargeMaxMs,
      );
    } else if (this.throwHeld && buttons.throw) {
      this.releaseThrow();
    } else if (buttons.throw && !this.throwHeld) {
      this.releaseThrow(true);
    }
    if (buttons.recall) {
      this.boomerang.recall();
    }

    this.throwHeld = buttons.throwHeld;
  }

  setMovement(mx: number, my: number, ax: number, ay: number): void {
    this.moveX = mx;
    this.moveY = my;
    if (Math.hypot(ax, ay) > balance.controls.stickDeadzone) {
      this.aimX = ax;
      this.aimY = ay;
    }
  }

  update(dt: number, onMeleeHit: (player: PlayerEntity, target: PlayerEntity) => void): void {
    this.dashCooldown = Math.max(0, this.dashCooldown - dt);
    this.dashTimer = Math.max(0, this.dashTimer - dt);
    this.meleeTimer = Math.max(0, this.meleeTimer - dt);
    this.respawnTimer = Math.max(0, this.respawnTimer - dt);
    this.iFrames = Math.max(0, this.iFrames - dt);

    this.inventory.update(dt);
    if (this.inventory.has('spamDash')) {
      this.dashCooldown = 0;
    }

    if (!this.alive) {
      if (this.respawnTimer <= 0) {
        this.respawn();
      }
      return;
    }

    this.boomerang.update(dt);
    this.applyMovement(dt);

    if (this.meleeTimer > balance.controls.meleeActiveMs - 20 && this.meleeTimer <= balance.controls.meleeActiveMs) {
      this.checkMeleeHit(onMeleeHit);
    }

    this.sprite.setPosition(this.body.position.x, this.body.position.y);
    const angle = Math.atan2(this.aimY, this.aimX);
    this.sprite.setRotation(angle);
  }

  private applyMovement(dt: number): void {
    const dtSec = dt / 1000;
    let speed = balance.player.baseSpeed;
    if (this.dashTimer > 0) {
      speed *= balance.controls.dashSpeedMultiplier;
    }
    if (this.hasGoldenBoomerang) {
      speed *= 0.7;
    }

    const len = Math.hypot(this.moveX, this.moveY);
    let vx = 0;
    let vy = 0;
    if (len > 0.01) {
      vx = (this.moveX / len) * speed;
      vy = (this.moveY / len) * speed;
    }

    if (this.dashTimer > 0 && len <= 0.01) {
      vx = this.aimX * speed;
      vy = this.aimY * speed;
    }

    const body = this.body;
    this.matter.body.setVelocity(body, { x: vx, y: vy });
  }

  private startDash(): void {
    this.dashTimer = balance.controls.dashDurationMs;
    this.dashCooldown = this.inventory.has('spamDash')
      ? 0
      : balance.controls.dashCooldownMs;
    this.iFrames = balance.controls.dashIFramesMs;
    audioManager.play('dash');
  }

  private startMelee(): void {
    this.meleeTimer = balance.controls.meleeActiveMs;
    audioManager.play('melee');
  }

  private releaseThrow(tap = false): void {
    const charge = tap ? 0 : this.throwCharge / balance.controls.throwChargeMaxMs;
    this.throwCharge = 0;
    this.boomerang.throw(this.aimX, this.aimY, charge);
    audioManager.play('throw');

    if (this.inventory.has('multiThrow')) {
      this.inventory.consumeUse('multiThrow');
      setTimeout(() => this.boomerang.throw(this.aimX, this.aimY, charge * 0.8), 50);
      setTimeout(() => this.boomerang.throw(this.aimX, this.aimY, charge * 0.6), 100);
    }
    if (this.inventory.has('explosive')) {
      this.inventory.consumeUse('explosive');
    }
  }

  private checkMeleeHit(onMeleeHit: (player: PlayerEntity, target: PlayerEntity) => void): void {
    const scene = this.scene as Phaser.Scene & { players?: PlayerEntity[] };
    const players = scene.players ?? [];
    const range = balance.controls.meleeRangePx;
    const arc = (balance.controls.meleeArcDeg * Math.PI) / 180;
    const facing = Math.atan2(this.aimY, this.aimX);

    for (const other of players) {
      if (other.id === this.id || !other.alive) continue;
      const dx = other.body.position.x - this.body.position.x;
      const dy = other.body.position.y - this.body.position.y;
      const dist = Math.hypot(dx, dy);
      if (dist > range) continue;
      const angle = Math.atan2(dy, dx);
      let diff = angle - facing;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      if (Math.abs(diff) <= arc / 2) {
        onMeleeHit(this, other);
        other.boomerang.deflect(this.aimX, this.aimY);
      }
    }
  }

  takeHit(killer: PlayerEntity | null, source: 'boomerang' | 'melee' | 'explosion' | 'environment'): void {
    if (!this.alive || this.iFrames > 0) return;
    if (this.inventory.consumeShield()) return;

    this.alive = false;
    this.respawnTimer = balance.player.respawnDelayMs;
    this.iFrames = 0;
    this.sprite.setVisible(false);
    this.boomerang.onOwnerDeath();

    if (killer && source !== 'environment') {
      killer.kills += 1;
      killer.score += this.hasGoldenBoomerang ? 3 : 1;
    }

    audioManager.play('kill');
    this.spawnDeathVfx();
  }

  private spawnDeathVfx(): void {
    const char = characterRegistry.get(this.characterId);
    const x = this.body.position.x;
    const y = this.body.position.y;
    for (let i = 0; i < 4; i++) {
      const piece = this.scene.add.circle(
        x + Phaser.Math.Between(-10, 10),
        y + Phaser.Math.Between(-10, 10),
        6,
        char.colorHex,
      );
      this.scene.tweens.add({
        targets: piece,
        x: x + Phaser.Math.Between(-60, 60),
        y: y + Phaser.Math.Between(-60, 60),
        alpha: 0,
        duration: 600,
        onComplete: () => piece.destroy(),
      });
    }
  }

  respawn(x?: number, y?: number): void {
    this.alive = true;
    this.sprite.setVisible(true);
    this.iFrames = balance.player.respawnIFramesMs;
    this.frozen = false;
    this.disguised = false;
    const px = x ?? this.body.position.x;
    const py = y ?? this.body.position.y;
    this.matter.body.setPosition(this.body, { x: px, y: py });
    this.matter.body.setVelocity(this.body, { x: 0, y: 0 });
    this.boomerang.reset();
  }

  addPowerUp(type: PowerUpId): boolean {
    const added = this.inventory.add(type);
    if (added) audioManager.play('pickup');
    return added;
  }

  isInvulnerable(): boolean {
    return this.iFrames > 0;
  }

  getStateLabel(): string {
    const parts: string[] = [];
    if (this.dashTimer > 0) parts.push('DASH');
    if (this.meleeTimer > 0) parts.push('MELEE');
    parts.push(this.boomerang.state.toUpperCase());
    if (this.frozen) parts.push('FROZEN');
    return parts.join('|');
  }

  destroy(): void {
    this.boomerang.destroy();
    this.sprite.destroy();
    this.matter.world.remove(this.body);
  }
}
