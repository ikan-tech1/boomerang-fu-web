import type { InputButtons } from '@boomerang/netcode';
import { balance } from '@boomerang/content';
import type { PlayerEntity } from '../entities/Player';

export type BotDifficulty = 'easy' | 'medium' | 'hard';

const REACTION_MS: Record<BotDifficulty, number> = {
  easy: 450,
  medium: 220,
  hard: 90,
};

const AIM_ERROR: Record<BotDifficulty, number> = {
  easy: 0.45,
  medium: 0.22,
  hard: 0.08,
};

const AGGRESSION: Record<BotDifficulty, number> = {
  easy: 0.25,
  medium: 0.45,
  hard: 0.7,
};

export class BotBrain {
  private thinkTimer = 0;
  private targetId: number | null = null;
  private aimOffsetX = 0;
  private aimOffsetY = 0;

  constructor(
    private readonly player: PlayerEntity,
    private readonly difficulty: BotDifficulty = 'medium',
  ) {}

  update(dt: number, players: PlayerEntity[], mode?: string): InputButtons {
    this.thinkTimer -= dt;
    if (this.thinkTimer <= 0) {
      this.thinkTimer = REACTION_MS[this.difficulty];
      this.pickTarget(players, mode);
      const err = AIM_ERROR[this.difficulty];
      this.aimOffsetX = (Math.random() - 0.5) * err * 2;
      this.aimOffsetY = (Math.random() - 0.5) * err * 2;
    }

    const target = players.find((p) => p.id === this.targetId && p.alive);
    if (!target) {
      return { dash: false, melee: false, throw: false, throwHeld: false, recall: false };
    }

    const dx = target.body.position.x - this.player.body.position.x;
    const dy = target.body.position.y - this.player.body.position.y;
    const dist = Math.hypot(dx, dy);
    let nx = dx / (dist || 1) + this.aimOffsetX;
    let ny = dy / (dist || 1) + this.aimOffsetY;
    const nlen = Math.hypot(nx, ny) || 1;
    nx /= nlen;
    ny /= nlen;

    this.player.setMovement(nx, ny, nx, ny);

    const agg = AGGRESSION[this.difficulty];
    const throwRange = balance.boomerang.maxThrowSpeed * 0.5;
    const shouldThrow = dist > 80 && dist < throwRange && Math.random() < agg * 0.6;
    const shouldDash = dist < 100 && Math.random() < agg * 0.5;
    const shouldMelee = dist < balance.controls.meleeRangePx && Math.random() < agg * 0.55;
    const shouldRecall =
      this.player.boomerang.state === 'returning' ||
      this.player.boomerang.state === 'bouncing';

    if (mode === 'goldenBoomerang') {
      const goldenHolder = players.find((p) => p.hasGoldenBoomerang && p.alive);
      if (goldenHolder && goldenHolder.id !== this.player.id) {
        this.targetId = goldenHolder.id;
      }
    }

    if (mode === 'hideAndSeek') {
      const seeker = players.find((p) => p.isSeeker);
      if (seeker && this.player.isSeeker === false && seeker.id === this.player.id) {
        const hiders = players.filter((p) => !p.isSeeker && p.alive);
        const nearest = hiders.sort((a, b) =>
          Math.hypot(a.body.position.x - this.player.body.position.x, a.body.position.y - this.player.body.position.y) -
          Math.hypot(b.body.position.x - this.player.body.position.x, b.body.position.y - this.player.body.position.y),
        )[0];
        if (nearest) this.targetId = nearest.id;
      }
    }

    return {
      dash: shouldDash,
      melee: shouldMelee,
      throw: shouldThrow,
      throwHeld: shouldThrow,
      recall: shouldRecall && Math.random() > 0.35,
    };
  }

  private pickTarget(players: PlayerEntity[], mode?: string): void {
    let best: PlayerEntity | null = null;
    let bestDist = Infinity;
    for (const p of players) {
      if (p.id === this.player.id || !p.alive) continue;
      if (mode === 'hideAndSeek' && this.player.isSeeker && !p.isSeeker) continue;
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
