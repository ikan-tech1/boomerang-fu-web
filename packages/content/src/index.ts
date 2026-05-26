import balanceJson from '../balance.json';

export type PowerUpId = keyof typeof balanceJson.powerUps;

export interface BalanceConfig {
  controls: {
    stickDeadzone: number;
    dashDurationMs: number;
    dashCooldownMs: number;
    dashIFramesMs: number;
    dashSpeedMultiplier: number;
    meleeArcDeg: number;
    meleeRangePx: number;
    meleeActiveMs: number;
    throwChargeMaxMs: number;
    recallHomingBoost: number;
  };
  player: {
    baseSpeed: number;
    acceleration: number;
    friction: number;
    radiusPx: number;
    mass: number;
    respawnDelayMs: number;
    respawnIFramesMs: number;
  };
  boomerang: {
    minThrowSpeed: number;
    maxThrowSpeed: number;
    spinRateDegPerSec: number;
    wallRestitution: number;
    returnHomingStrength: number;
    returnSpeed: number;
    pickupRadiusPx: number;
    maxBounces: number;
    dropFriction: number;
    selfHitOnReturn: boolean;
  };
  combat: {
    oneHitKill: boolean;
    hitstopMs: number;
    killKnockback: number;
    droppedBoomerangKill: boolean;
  };
  match: {
    defaultRoundTimerSec: number;
    countdownSec: number;
    maxPlayers: number;
    maxPowerUpStack: number;
    powerUpSpawnIntervalSec: number;
    powerUpPickupRadiusPx: number;
  };
  modes: Record<string, unknown>;
  powerUps: Record<
    string,
    {
      id: string;
      name: string;
      maxUses: number;
      conflicts?: string[];
      durationSec?: number;
    }
  >;
  characters: Array<{ id: string; name: string; source: string; color: string }>;
  arenas: Array<{ id: string; name: string; theme: string; status: string }>;
}

export const balance = balanceJson as BalanceConfig;

export function getPowerUpIds(): PowerUpId[] {
  return Object.keys(balance.powerUps) as PowerUpId[];
}

export * from './schemas/arena';
