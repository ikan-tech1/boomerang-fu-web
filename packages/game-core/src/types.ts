import type { GameModeId } from './modes/GameModeManager';

export interface GameLaunchOptions {
  width?: number;
  height?: number;
  debug?: boolean;
  mode?: GameModeId;
  arenaId?: string;
  playerCount?: number;
  botCount?: number;
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
