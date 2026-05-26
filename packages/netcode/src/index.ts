/** Per-frame player input sent to server or processed locally */
export interface InputFrame {
  frame: number;
  playerId: number;
  moveX: number;
  moveY: number;
  aimX: number;
  aimY: number;
  buttons: InputButtons;
}

export interface InputButtons {
  dash: boolean;
  melee: boolean;
  throw: boolean;
  throwHeld: boolean;
  recall: boolean;
}

export const EMPTY_INPUT: InputButtons = {
  dash: false,
  melee: false,
  throw: false,
  throwHeld: false,
  recall: false,
};

/** Authoritative game state snapshot (stub for Colyseus sync) */
export interface GameStateSnapshot {
  tick: number;
  players: PlayerStateSnapshot[];
  boomerangs: BoomerangStateSnapshot[];
  powerUps: PowerUpStateSnapshot[];
  mode: string;
  roundTimerMs: number;
}

export interface PlayerStateSnapshot {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
  kills: number;
  powerUps: string[];
  characterId: string;
  team?: number;
}

export interface BoomerangStateSnapshot {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: string;
  ownerId: number;
}

export interface PowerUpStateSnapshot {
  id: string;
  type: string;
  x: number;
  y: number;
}

export { SnapshotInterpolator, type InterpolatedState } from './interpolation.js';

export function createEmptyInputFrame(frame: number, playerId: number): InputFrame {
  return {
    frame,
    playerId,
    moveX: 0,
    moveY: 0,
    aimX: 1,
    aimY: 0,
    buttons: { ...EMPTY_INPUT },
  };
}
