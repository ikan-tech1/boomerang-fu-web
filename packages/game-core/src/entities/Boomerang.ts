import { balance } from '@boomerang/content';
import Phaser from 'phaser';
import type { BoomerangState } from '../types';
import type { PlayerEntity } from './Player';

export class BoomerangEntity {
  state: BoomerangState = 'held';
  private bounceCount = 0;

  body: MatterJS.BodyType | null = null;
  sprite: Phaser.GameObjects.Rectangle | null = null;

  private vx = 0;
  private vy = 0;
  private readonly scene: Phaser.Scene;
  private readonly matter: Phaser.Physics.Matter.MatterPhysics;
  private readonly owner: PlayerEntity;

  constructor(
    scene: Phaser.Scene,
    matter: Phaser.Physics.Matter.MatterPhysics,
    owner: PlayerEntity,
  ) {
    this.scene = scene;
    this.matter = matter;
    this.owner = owner;
  }

  throw(aimX: number, aimY: number, charge: number): void {
    if (!this.owner.alive || this.state !== 'held') return;

    const speed =
      balance.boomerang.minThrowSpeed +
      charge * (balance.boomerang.maxThrowSpeed - balance.boomerang.minThrowSpeed);

    const len = Math.hypot(aimX, aimY) || 1;
    this.vx = (aimX / len) * speed;
    this.vy = (aimY / len) * speed;

    this.state = 'thrown';
    this.bounceCount = 0;

    if (!this.body) {
      this.body = this.matter.add.rectangle(
        this.owner.body.position.x + aimX * 24,
        this.owner.body.position.y + aimY * 24,
        16,
        8,
        { label: `boomerang-${this.owner.id}`, frictionAir: 0, restitution: balance.boomerang.wallRestitution },
      );
      this.sprite = this.scene.add.rectangle(
        this.owner.body.position.x,
        this.owner.body.position.y,
        16,
        8,
        0xcccccc,
      );
    }

    this.matter.body.setVelocity(this.body, { x: this.vx, y: this.vy });
    if (this.sprite) this.sprite.setVisible(true);
  }

  recall(): void {
    if (this.state === 'held' || this.state === 'dropped') return;
    this.state = 'recalled';
  }

  deflect(fromX: number, fromY: number): void {
    if (this.state === 'held') return;
    const speed = Math.hypot(this.vx, this.vy) || balance.boomerang.minThrowSpeed;
    this.vx = fromX * speed;
    this.vy = fromY * speed;
    this.state = 'bouncing';
    if (this.body) {
      this.matter.body.setVelocity(this.body, { x: this.vx, y: this.vy });
    }
  }

  update(dt: number): void {
    if (this.state === 'held' || !this.body || !this.sprite) return;

    const dtSec = dt / 1000;
    const pos = this.body.position;

    // Wall bounce detection via velocity reflection (simplified)
    const speed = Math.hypot(this.vx, this.vy);
    if (speed < 50 && this.state !== 'dropped') {
      this.state = 'returning';
    }

    if (this.state === 'returning' || this.state === 'recalled') {
      const ox = this.owner.body.position.x;
      const oy = this.owner.body.position.y;
      const dx = ox - pos.x;
      const dy = oy - pos.y;
      const dist = Math.hypot(dx, dy);
      const homing = this.state === 'recalled'
        ? balance.boomerang.returnHomingStrength + balance.controls.recallHomingBoost
        : balance.boomerang.returnHomingStrength;

      if (dist < balance.boomerang.pickupRadiusPx && this.owner.alive) {
        this.catch();
        return;
      }

      const returnSpeed = this.state === 'recalled'
        ? balance.boomerang.returnSpeed * 1.2
        : balance.boomerang.returnSpeed;
      this.vx = Phaser.Math.Linear(this.vx, (dx / (dist || 1)) * returnSpeed, homing);
      this.vy = Phaser.Math.Linear(this.vy, (dy / (dist || 1)) * returnSpeed, homing);
    }

    // Self-hit on return
    if (
      balance.boomerang.selfHitOnReturn &&
      (this.state === 'returning' || this.state === 'recalled') &&
      this.owner.alive
    ) {
      const dx = this.owner.body.position.x - pos.x;
      const dy = this.owner.body.position.y - pos.y;
      if (Math.hypot(dx, dy) < balance.player.radiusPx + 8) {
        // Caught — no self hit if within pickup radius handled above
      }
    }

    this.matter.body.setVelocity(this.body, { x: this.vx, y: this.vy });
    this.sprite.setPosition(pos.x, pos.y);
    this.sprite.setRotation(this.sprite.rotation + balance.boomerang.spinRateDegPerSec * dtSec * (Math.PI / 180));

    // Out of bounds → drop
    const bounds = (this.scene as Phaser.Scene & { arenaBounds?: { w: number; h: number } }).arenaBounds;
    if (bounds && (pos.x < 0 || pos.y < 0 || pos.x > bounds.w || pos.y > bounds.h)) {
      this.drop();
    }
  }

  catch(): void {
    this.state = 'held';
    this.vx = 0;
    this.vy = 0;
    if (this.body) {
      this.matter.world.remove(this.body);
      this.body = null;
    }
    if (this.sprite) {
      this.sprite.setVisible(false);
    }
  }

  drop(): void {
    this.state = 'dropped';
    this.vx *= balance.boomerang.dropFriction;
    this.vy *= balance.boomerang.dropFriction;
  }

  onOwnerDeath(): void {
    if (this.state === 'held') return;
    this.drop();
  }

  reset(): void {
    this.catch();
    this.bounceCount = 0;
  }

  checkHit(target: PlayerEntity): boolean {
    if (!this.body || this.state === 'held' || this.state === 'dropped') return false;
    if (target.id === this.owner.id && this.state !== 'bouncing' && this.state !== 'thrown') {
      // Allow self-hit only during early throw phase
      if (this.state === 'returning' || this.state === 'recalled') {
        if (!balance.boomerang.selfHitOnReturn) return false;
      } else {
        return false;
      }
    }
    const dx = target.body.position.x - this.body.position.x;
    const dy = target.body.position.y - this.body.position.y;
    return Math.hypot(dx, dy) < balance.player.radiusPx + 10;
  }

  destroy(): void {
    if (this.body) this.matter.world.remove(this.body);
    this.sprite?.destroy();
  }
}
