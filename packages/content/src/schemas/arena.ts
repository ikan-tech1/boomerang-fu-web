export type TrapPrefabId =
  | 'movingPlatform'
  | 'spinner'
  | 'crusher'
  | 'teleporter'
  | 'switchDoor'
  | 'foliageHide'
  | 'breakable'
  | 'water'
  | 'void'
  | 'oobBoundary';

export interface SpawnPoint {
  x: number;
  y: number;
  team?: number;
}

export interface TrapPrefab {
  id: string;
  type: TrapPrefabId;
  x: number;
  y: number;
  width?: number;
  height?: number;
  properties?: Record<string, string | number | boolean>;
}

export interface KillVolume {
  type: 'water' | 'void' | 'oobBoundary';
  x: number;
  y: number;
  width: number;
  height: number;
  scoresKill?: boolean;
}

export interface ArenaData {
  id: string;
  name: string;
  theme: string;
  width: number;
  height: number;
  tileSize: number;
  collisionPolys: Array<Array<{ x: number; y: number }>>;
  spawnPoints: SpawnPoint[];
  hazards: TrapPrefab[];
  killVolumes: KillVolume[];
  disguiseProps: string[];
}

export interface TiledArenaExport {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: Array<{
    name: string;
    type: string;
    objects?: Array<{
      id: number;
      name: string;
      type?: string;
      x: number;
      y: number;
      width?: number;
      height?: number;
      polygon?: Array<{ x: number; y: number }>;
      properties?: Array<{ name: string; value: string | number | boolean }>;
    }>;
  }>;
  properties?: Array<{ name: string; value: string }>;
}
