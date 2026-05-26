import type { PowerUpId } from '@boomerang/content';
import { balance, getPowerUpIds } from '@boomerang/content';

export interface ActivePowerUp {
  type: PowerUpId;
  usesRemaining: number;
  durationMs: number;
}

export class PowerUpInventory {
  private readonly stack: ActivePowerUp[] = [];

  add(type: PowerUpId): boolean {
    const def = balance.powerUps[type];
    if (!def) return false;

    // Fire/ice exclusion
    for (const conflict of def.conflicts ?? []) {
      this.remove(conflict as PowerUpId);
    }
    for (const active of this.stack) {
      const activeDef = balance.powerUps[active.type];
      if (activeDef?.conflicts?.includes(type)) {
        this.remove(active.type);
      }
    }

    if (this.stack.length >= balance.match.maxPowerUpStack) {
      this.stack.shift();
    }

    const uses = def.maxUses === -1 ? 999 : def.maxUses;
    const durationMs = (def.durationSec ?? 0) * 1000;
    this.stack.push({ type, usesRemaining: uses, durationMs });
    return true;
  }

  remove(type: PowerUpId): void {
    const idx = this.stack.findIndex((p) => p.type === type);
    if (idx >= 0) this.stack.splice(idx, 1);
  }

  has(type: PowerUpId): boolean {
    return this.stack.some((p) => p.type === type);
  }

  consumeUse(type: PowerUpId): boolean {
    const item = this.stack.find((p) => p.type === type);
    if (!item) return false;
    if (item.usesRemaining > 0 && item.usesRemaining < 999) {
      item.usesRemaining -= 1;
      if (item.usesRemaining <= 0) this.remove(type);
    }
    return true;
  }

  consumeShield(): boolean {
    if (!this.has('shield')) return false;
    this.remove('shield');
    return true;
  }

  update(dt: number): void {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const item = this.stack[i];
      if (!item || item.durationMs <= 0) continue;
      item.durationMs -= dt;
      if (item.durationMs <= 0) this.stack.splice(i, 1);
    }
  }

  getAll(): PowerUpId[] {
    return this.stack.map((p) => p.type);
  }

  clear(): void {
    this.stack.length = 0;
  }
}

export function randomPowerUpType(): PowerUpId {
  const ids = getPowerUpIds();
  const idx = Math.floor(Math.random() * ids.length);
  return ids[idx] ?? 'shield';
}

export const POWER_UP_COLORS: Record<string, number> = {
  shield: 0x4488ff,
  fire: 0xff4400,
  ice: 0x44ccff,
  explosive: 0xff8800,
  teleport: 0xaa44ff,
  telekinesis: 0xff44aa,
  disguise: 0x88aa44,
  decoy: 0xaaaaaa,
  battleRoyale: 0xff0044,
  spamDash: 0xffff00,
  golden: 0xffd700,
  magnet: 0x888888,
  multiThrow: 0x44ff88,
};

export const POWER_UP_LABELS: Record<string, string> = Object.fromEntries(
  getPowerUpIds().map((id: PowerUpId) => [id, balance.powerUps[id]?.name ?? id]),
);
