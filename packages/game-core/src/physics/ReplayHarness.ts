import Matter from 'matter-js';
import { balance } from '@boomerang/content';

export interface ReplayFrame {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Deterministic physics replay for tuning regression (no Phaser) */
export function runReplayFrames(frameCount: number, seed: number): ReplayFrame[] {
  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.gravity.x = 0;
  engine.gravity.y = 0;

  const body = Matter.Bodies.circle(400, 300, balance.player.radiusPx, {
    frictionAir: 0.05,
    mass: balance.player.mass,
  });
  Matter.World.add(engine.world, [body]);

  const frames: ReplayFrame[] = [];
  let rng = seed;

  for (let f = 0; f < frameCount; f++) {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    const moveX = ((rng % 200) / 100 - 1) * 0.8;
    const moveY = (((rng >> 8) % 200) / 100 - 1) * 0.8;

    const speed = balance.player.baseSpeed;
    Matter.Body.setVelocity(body, {
      x: moveX * speed * (1 / 60),
      y: moveY * speed * (1 / 60),
    });

    Matter.Engine.update(engine, 1000 / 60);

    frames.push({
      x: Math.round(body.position.x * 1000) / 1000,
      y: Math.round(body.position.y * 1000) / 1000,
      vx: Math.round(body.velocity.x * 1000) / 1000,
      vy: Math.round(body.velocity.y * 1000) / 1000,
    });
  }

  return frames;
}

export function framesEqual(a: ReplayFrame[], b: ReplayFrame[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const fa = a[i];
    const fb = b[i];
    if (!fa || !fb) return false;
    if (fa.x !== fb.x || fa.y !== fb.y || fa.vx !== fb.vx || fa.vy !== fb.vy) return false;
  }
  return true;
}
