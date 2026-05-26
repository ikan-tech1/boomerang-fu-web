import type { GameModeId } from './modes/GameModeManager';

import type { BotDifficulty } from './ai/BotBrain';
import type { OnlineSyncBridge } from './net/OnlineSyncController';

export interface GameLaunchOptions {
  width?: number;
  height?: number;
  debug?: boolean;
  mode?: GameModeId;
  arenaId?: string;
  playerCount?: number;
  botCount?: number;
  botDifficulty?: BotDifficulty;
  characterId?: string;
  friendlyFire?: boolean;
  shieldsForLosers?: boolean;
  powerUpSpawnRate?: number;
  onlineBridge?: OnlineSyncBridge;
  localPlayerId?: number;
}

export type BoomerangState =
  | 'held'
  | 'thrown'
  | 'bouncing'
  | 'returning'
  | 'dropped'
  | 'recalled';

export interface Vec2 {
  x: number;
  y: number;
}

export interface PlayerConfig {
  id: number;
  characterId: string;
  x: number;
  y: number;
  isBot?: boolean;
  team?: number;
  color?: number;
}
