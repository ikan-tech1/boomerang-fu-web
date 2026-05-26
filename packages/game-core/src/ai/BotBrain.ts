import type { InputButtons } from '@boomerang/netcode';
import { balance } from '@boomerang/content';
import type { PlayerEntity } from '../entities/Player';

export type BotDifficulty = 'easy' | 'medium' | 'hard';

const REACTION_MS: Record<BotDifficulty, number> = {
  easy: 400,
  medium: 200,
  hard: 80,
};

export class BotBrain {
  private thinkTimer = 0;
  private targetId: number | null = null;

  constructor(
    private readonly player: PlayerEntity,
    private readonly difficulty: BotDifficulty = 'medium',
  ) {}

  update(dt: number, players: PlayerEntity[]): InputButtons {
    this.thinkTimer -= dt;
    if (this.thinkTimer <= 0) {
      this.thinkTimer = REACTION_MS[this.difficulty];
      this.pickTarget(players);
    }

    const target = players.find((p) => p.id === this.targetId && p.alive);
    if (!target) {
      return { dash: false, melee: false, throw: false, throwHeld: false, recall: false };
    }

    const dx = target.body.position.x - this.player.body.position.x;
    const dy = target.body.position.y - this.player.body.position.y;
    const dist = Math.hypot(dx, dy);
    const nx = dx / (dist || 1);
    const ny = dy / (dist || 1);

    this.player.setMovement(nx, ny, nx, ny);

    const throwRange = balance.boomerang.maxThrowSpeed * 0.5;
    const shouldThrow = dist > 80 && dist < throwRange && Math.random() > 0.3;
    const shouldDash = dist < 100 && Math.random() > 0.6;
    const shouldMelee = dist < balance.controls.meleeRangePx && Math.random() > 0.5;
    const shouldRecall =
      this.player.boomerang.state === 'returning' ||
      this.player.boomerang.state === 'bouncing';

    return {
      dash: shouldDash,
      melee: shouldMelee,
      throw: shouldThrow,
      throwHeld: shouldThrow,
      recall: shouldRecall && Math.random() > 0.4,
    };
  }

  private pickTarget(players: PlayerEntity[]): void {
    let best: PlayerEntity | null = null;
    let bestDist = Infinity;
    for (const p of players) {
      if (p.id === this.player.id || !p.alive) continue;
      const dist = Math.hypot(
        p.body.position.x - this.player.body.position.x,
        p.body.position.y - this.player.body.position.y,
      );
      if (dist < bestDist) {
        bestDist = dist;
        best = p;
      }
    }
    this.targetId = best?.id ?? null;
  }
}
