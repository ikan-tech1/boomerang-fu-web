import Matter from 'matter-js';
import type { InputFrame } from '@boomerang/netcode';

const PLAYER_RADIUS = 20;
const BASE_SPEED = 220;
const ARENA_W = 800;
const ARENA_H = 600;

export interface SimPlayer {
  id: number;
  body: Matter.Body;
  alive: boolean;
  kills: number;
  characterId: string;
}

/** Headless Matter.js authoritative simulation for Colyseus rooms */
export class AuthoritativeSim {
  readonly engine: Matter.Engine;
  readonly players = new Map<number, SimPlayer>();

  constructor() {
    this.engine = Matter.Engine.create({ enableSleeping: false });
    this.engine.gravity.x = 0;
    this.engine.gravity.y = 0;
  }

  addPlayer(id: number, characterId: string, x: number, y: number): void {
    const body = Matter.Bodies.circle(x, y, PLAYER_RADIUS, {
      frictionAir: 0.05,
      mass: 1,
      label: `player-${id}`,
    });
    Matter.World.add(this.engine.world, body);
    this.players.set(id, { id, body, alive: true, kills: 0, characterId });
  }

  removePlayer(id: number): void {
    const p = this.players.get(id);
    if (!p) return;
    Matter.World.remove(this.engine.world, p.body);
    this.players.delete(id);
  }

  applyInputs(inputs: InputFrame[]): void {
    for (const input of inputs) {
      const player = this.players.get(input.playerId);
      if (!player || !player.alive) continue;

      const len = Math.hypot(input.moveX, input.moveY);
      let vx = 0;
      let vy = 0;
      if (len > 0.01) {
        vx = (input.moveX / len) * BASE_SPEED;
        vy = (input.moveY / len) * BASE_SPEED;
      }

      if (input.buttons.dash && len > 0.01) {
        vx *= 2.5;
        vy *= 2.5;
      }

      Matter.Body.setVelocity(player.body, { x: vx, y: vy });
    }
  }

  step(dtMs = 1000 / 60): void {
    Matter.Engine.update(this.engine, dtMs);
    this.clampToArena();
  }

  private clampToArena(): void {
    const margin = 30;
    for (const player of this.players.values()) {
      if (!player.alive) continue;
      const { x, y } = player.body.position;
      const cx = Math.max(margin, Math.min(ARENA_W - margin, x));
      const cy = Math.max(margin, Math.min(ARENA_H - margin, y));
      if (cx !== x || cy !== y) {
        Matter.Body.setPosition(player.body, { x: cx, y: cy });
      }
    }
  }

  snapshot(): Array<{ id: number; x: number; y: number; vx: number; vy: number; alive: boolean; kills: number; characterId: string }> {
    return [...this.players.values()].map((p) => ({
      id: p.id,
      x: p.body.position.x,
      y: p.body.position.y,
      vx: p.body.velocity.x,
      vy: p.body.velocity.y,
      alive: p.alive,
      kills: p.kills,
      characterId: p.characterId,
    }));
  }
}
