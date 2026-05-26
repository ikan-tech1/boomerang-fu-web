import type { ArenaData, KillVolume, TrapPrefab } from '@boomerang/content';
import kitchenClassic from '../arenas/kitchen-classic.json';
import jungleTemple from '../arenas/jungle-temple.json';
import bambooBridge from '../arenas/bamboo-bridge.json';

const ARENAS: Record<string, ArenaData> = {
  'kitchen-classic': kitchenClassic as ArenaData,
  'jungle-temple': jungleTemple as ArenaData,
  'bamboo-bridge': bambooBridge as ArenaData,
};

export class ArenaLoader {
  load(id: string): ArenaData {
    const arena = ARENAS[id];
    if (!arena) {
      return ARENAS['kitchen-classic'] as ArenaData;
    }
    return arena;
  }

  listIds(): string[] {
    return Object.keys(ARENAS);
  }

  /** Parse Tiled JSON export into ArenaData (stub — sample arenas are pre-converted) */
  fromTiled(_tiledJson: unknown): ArenaData {
    return ARENAS['kitchen-classic'] as ArenaData;
  }
}

export class TrapSystem {
  private readonly traps: TrapPrefab[] = [];
  private readonly killVolumes: KillVolume[] = [];
  private time = 0;

  constructor(private readonly scene: Phaser.Scene & { players?: import('../entities/Player').PlayerEntity[] }) {}

  loadArena(arena: ArenaData): void {
    this.traps.length = 0;
    this.killVolumes.length = 0;
    this.traps.push(...arena.hazards);
    this.killVolumes.push(...arena.killVolumes);
    this.renderTraps(arena);
  }

  private renderTraps(arena: ArenaData): void {
    for (const trap of arena.hazards) {
      const color = trapColor(trap.type);
      const w = trap.width ?? 40;
      const h = trap.height ?? 40;
      const rect = this.scene.add.rectangle(trap.x, trap.y, w, h, color, 0.5);
      rect.setStrokeStyle(1, color);
    }
    for (const kv of arena.killVolumes) {
      const color = kv.type === 'water' ? 0x2244aa : kv.type === 'void' ? 0x111111 : 0xff0000;
      this.scene.add.rectangle(kv.x + kv.width / 2, kv.y + kv.height / 2, kv.width, kv.height, color, 0.3);
    }
    // Arena floor
    this.scene.add.rectangle(arena.width / 2, arena.height / 2, arena.width - 40, arena.height - 40, 0x2d4a3e, 1)
      .setStrokeStyle(4, 0x8b7355);
  }

  update(dt: number): void {
    this.time += dt;
    for (const trap of this.traps) {
      this.updateTrap(trap);
    }
    this.checkKillVolumes();
  }

  private updateTrap(trap: TrapPrefab): void {
    switch (trap.type) {
      case 'spinner':
        // Visual rotation handled in render; damage stub
        break;
      case 'movingPlatform': {
        const offset = Math.sin(this.time / 1000) * 60;
        trap.x = (trap.properties?.originX as number ?? trap.x) + offset;
        break;
      }
      case 'crusher':
        break;
      case 'teleporter':
        break;
      default:
        break;
    }
  }

  private checkKillVolumes(): void {
    const players = this.scene.players ?? [];
    for (const player of players) {
      if (!player.alive) continue;
      for (const kv of this.killVolumes) {
        const px = player.body.position.x;
        const py = player.body.position.y;
        if (
          px >= kv.x &&
          px <= kv.x + kv.width &&
          py >= kv.y &&
          py <= kv.y + kv.height
        ) {
          player.takeHit(null, 'environment');
        }
      }
    }
  }
}

function trapColor(type: string): number {
  const map: Record<string, number> = {
    spinner: 0xff4444,
    movingPlatform: 0x888888,
    crusher: 0x666666,
    teleporter: 0xaa44ff,
    switchDoor: 0xaaaaaa,
    foliageHide: 0x228822,
    breakable: 0xcc8844,
    water: 0x2244aa,
    void: 0x111111,
    oobBoundary: 0xff0000,
  };
  return map[type] ?? 0xffffff;
}

export const arenaLoader = new ArenaLoader();
