import type { ArenaData, TiledArenaExport, TrapPrefab, TrapPrefabId } from '@boomerang/content';
import Matter from 'matter-js';
import Phaser from 'phaser';
import { ARENA_REGISTRY, DEFAULT_ARENA_ID } from '../arenas/registry';
import type { PlayerEntity } from '../entities/Player';

export class ArenaLoader {
  load(id: string): ArenaData {
    return ARENA_REGISTRY[id] ?? (ARENA_REGISTRY[DEFAULT_ARENA_ID] as ArenaData);
  }

  listIds(): string[] {
    return Object.keys(ARENA_REGISTRY);
  }

  /** Parse Tiled JSON export into ArenaData */
  fromTiled(tiled: TiledArenaExport): ArenaData {
    const objects = tiled.layers.flatMap((l) => l.objects ?? []);
    const props = tiled.properties ?? [];
    const idProp = props.find((p) => p.name === 'arenaId');
    const nameProp = props.find((p) => p.name === 'arenaName');
    const themeProp = props.find((p) => p.name === 'theme');

    const spawnPoints: ArenaData['spawnPoints'] = [];
    const hazards: TrapPrefab[] = [];
    const killVolumes: ArenaData['killVolumes'] = [];
    const disguiseProps: string[] = [];

    for (const obj of objects) {
      const type = (obj.type ?? obj.name ?? '').toLowerCase();
      const cx = obj.x + (obj.width ?? 0) / 2;
      const cy = obj.y + (obj.height ?? 0) / 2;

      if (type === 'spawn' || type.startsWith('spawn')) {
        spawnPoints.push({ x: cx, y: cy });
        continue;
      }

      if (type === 'disguiseprop') {
        const propName = getObjProp(obj, 'propType') as string | undefined;
        if (propName) disguiseProps.push(propName);
        continue;
      }

      const trapType = mapTiledTypeToTrap(type);
      if (trapType) {
        if (trapType === 'water' || trapType === 'void' || trapType === 'oobBoundary') {
          killVolumes.push({
            type: trapType === 'oobBoundary' ? 'void' : trapType,
            x: obj.x,
            y: obj.y,
            width: obj.width ?? 32,
            height: obj.height ?? 32,
            scoresKill: trapType !== 'water',
          });
        } else {
          hazards.push({
            id: `tiled-${obj.id}`,
            type: trapType,
            x: cx,
            y: cy,
            width: obj.width,
            height: obj.height,
            properties: readObjProperties(obj),
          });
        }
      }
    }

    return {
      id: String(idProp?.value ?? 'tiled-arena'),
      name: String(nameProp?.value ?? 'Tiled Arena'),
      theme: String(themeProp?.value ?? 'custom'),
      width: tiled.width * tiled.tilewidth,
      height: tiled.height * tiled.tileheight,
      tileSize: tiled.tilewidth,
      collisionPolys: [],
      spawnPoints: spawnPoints.length >= 2 ? spawnPoints : [{ x: 150, y: 300 }, { x: 650, y: 300 }],
      hazards,
      killVolumes,
      disguiseProps: disguiseProps.length >= 3 ? disguiseProps : ['prop-a', 'prop-b', 'prop-c'],
    };
  }
}

function mapTiledTypeToTrap(type: string): TrapPrefabId | null {
  const map: Record<string, TrapPrefabId> = {
    movingplatform: 'movingPlatform',
    spinner: 'spinner',
    crusher: 'crusher',
    teleporter: 'teleporter',
    switchdoor: 'switchDoor',
    foliagehide: 'foliageHide',
    breakable: 'breakable',
    water: 'water',
    void: 'void',
    oobboundary: 'oobBoundary',
  };
  return map[type.replace(/[^a-z]/gi, '').toLowerCase()] ?? null;
}

function getObjProp(
  obj: NonNullable<TiledArenaExport['layers'][0]['objects']>[0],
  name: string,
): string | number | boolean | undefined {
  const p = obj.properties?.find((x) => x.name === name);
  return p?.value;
}

function readObjProperties(
  obj: NonNullable<TiledArenaExport['layers'][0]['objects']>[0],
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const p of obj.properties ?? []) {
    out[p.name] = p.value;
  }
  return out;
}

export class TrapSystem {
  private readonly traps: TrapPrefab[] = [];
  private readonly killVolumes: ArenaData['killVolumes'] = [];
  private readonly breakableDestroyed = new Set<string>();
  private readonly doorOpen = new Map<string, boolean>();
  private readonly trapSprites = new Map<string, Phaser.GameObjects.Rectangle>();
  private readonly oobGraceMs = new Map<number, number>();
  private time = 0;
  private teleCooldown = new Map<number, number>();

  constructor(private readonly scene: Phaser.Scene & { players?: PlayerEntity[] }) {}

  loadArena(arena: ArenaData): void {
    this.traps.length = 0;
    this.killVolumes.length = 0;
    this.breakableDestroyed.clear();
    this.doorOpen.clear();
    this.oobGraceMs.clear();
    for (const sprite of this.trapSprites.values()) sprite.destroy();
    this.trapSprites.clear();
    this.traps.push(...arena.hazards);
    for (const trap of arena.hazards) {
      if (trap.type === 'oobBoundary') {
        this.killVolumes.push({
          type: 'oobBoundary',
          x: (trap.x ?? 0) - (trap.width ?? 40) / 2,
          y: (trap.y ?? 0) - (trap.height ?? 40) / 2,
          width: trap.width ?? 40,
          height: trap.height ?? 40,
          scoresKill: true,
        });
      }
    }
    this.killVolumes.push(...arena.killVolumes);
    this.renderTraps(arena);
  }

  private renderTraps(arena: ArenaData): void {
    for (const trap of arena.hazards) {
      if (trap.type === 'oobBoundary') {
        const w = trap.width ?? 40;
        const h = trap.height ?? 40;
        const rect = this.scene.add.rectangle(trap.x, trap.y, w, h, 0xff0000, 0.15);
        rect.setStrokeStyle(2, 0xff6666, 0.9);
        this.trapSprites.set(trap.id, rect);
        continue;
      }
      if (trap.properties?.isDoor && !this.doorOpen.get(String(trap.properties.doorId ?? trap.id))) {
        const w = trap.width ?? 40;
        const h = trap.height ?? 40;
        const rect = this.scene.add.rectangle(trap.x, trap.y, w, h, 0x444444, 0.9);
        rect.setStrokeStyle(2, 0xaaaaaa);
        this.trapSprites.set(trap.id, rect);
      } else if (!trap.properties?.isDoor) {
        const color = trapColor(trap.type);
        const w = trap.width ?? 40;
        const h = trap.height ?? 40;
        const rect = this.scene.add.rectangle(trap.x, trap.y, w, h, color, 0.5);
        rect.setStrokeStyle(1, color);
        this.trapSprites.set(trap.id, rect);
      }
    }
    for (const kv of arena.killVolumes) {
      const color = kv.type === 'water' ? 0x2244aa : kv.type === 'void' ? 0x111111 : 0xff0000;
      this.scene.add.rectangle(kv.x + kv.width / 2, kv.y + kv.height / 2, kv.width, kv.height, color, 0.3);
    }
    this.scene.add
      .rectangle(arena.width / 2, arena.height / 2, arena.width - 40, arena.height - 40, 0x2d4a3e, 1)
      .setStrokeStyle(4, 0x8b7355);
  }

  update(dt: number): void {
    this.time += dt;
    for (const trap of this.traps) {
      this.updateTrap(trap);
    }
    this.checkKillVolumes();
    this.checkTrapContacts();
  }

  private updateTrap(trap: TrapPrefab): void {
    const sprite = this.trapSprites.get(trap.id);
    switch (trap.type) {
      case 'movingPlatform': {
        const originX = (trap.properties?.originX as number) ?? trap.x;
        const offset = Math.sin(this.time / 1000) * 60;
        trap.x = originX + offset;
        sprite?.setPosition(trap.x, trap.y);
        break;
      }
      case 'spinner': {
        if (sprite) sprite.setRotation(this.time / 180);
        break;
      }
      case 'crusher': {
        const period = (trap.properties?.periodMs as number) ?? 2000;
        const phase = (this.time % period) / period;
        trap.y = (trap.properties?.originY as number) ?? trap.y;
        if (phase > 0.45 && phase < 0.55) {
          this.damageInRect(trap.x, trap.y, trap.width ?? 80, trap.height ?? 40);
        }
        break;
      }
      case 'switchDoor': {
        if (trap.properties?.isDoor) return;
        const doorId = String(trap.properties?.doorId ?? '');
        if (doorId) this.doorOpen.set(doorId, Boolean(trap.properties?.open));
        break;
      }
      default:
        break;
    }
  }

  private checkTrapContacts(): void {
    const players = this.scene.players ?? [];
    for (const player of players) {
      if (!player.alive) continue;
      const px = player.body.position.x;
      const py = player.body.position.y;
      const pid = player.id;
      const cd = this.teleCooldown.get(pid) ?? 0;
      if (cd > 0) {
        this.teleCooldown.set(pid, cd - 16);
        continue;
      }

      for (const trap of this.traps) {
        if (!this.pointInTrap(px, py, trap)) continue;

        if (trap.type === 'teleporter') {
          const pairId = trap.properties?.pairId as string | undefined;
          const pair = this.traps.find((t) => t.id === pairId);
          if (pair) {
            Matter.Body.setPosition(player.body as Matter.Body, { x: pair.x, y: pair.y });
            this.teleCooldown.set(pid, 500);
          }
        } else if (trap.type === 'spinner') {
          player.takeHit(null, 'environment');
        } else if (trap.type === 'breakable' && !this.breakableDestroyed.has(trap.id)) {
          this.breakableDestroyed.add(trap.id);
        } else if (trap.type === 'switchDoor' && !trap.properties?.isDoor) {
          const doorId = String(trap.properties?.doorId ?? '');
          this.doorOpen.set(doorId, !this.doorOpen.get(doorId));
        } else if (trap.type === 'foliageHide' && player.disguised) {
          player.tryMatchDisguise?.();
        }
      }
    }
  }

  private damageInRect(cx: number, cy: number, w: number, h: number): void {
    for (const player of this.scene.players ?? []) {
      if (!player.alive) continue;
      if (this.pointInTrap(player.body.position.x, player.body.position.y, {
        x: cx,
        y: cy,
        width: w,
        height: h,
      })) {
        player.takeHit(null, 'environment');
      }
    }
  }

  private pointInTrap(px: number, py: number, trap: { x: number; y: number; width?: number; height?: number }): boolean {
    const hw = (trap.width ?? 40) / 2;
    const hh = (trap.height ?? 40) / 2;
    return px >= trap.x - hw && px <= trap.x + hw && py >= trap.y - hh && py <= trap.y + hh;
  }

  private checkKillVolumes(): void {
    const players = this.scene.players ?? [];
    const dt = 16;
    for (const player of players) {
      if (!player.alive) continue;
      const px = player.body.position.x;
      const py = player.body.position.y;
      let inOob = false;
      for (const kv of this.killVolumes) {
        if (px < kv.x || px > kv.x + kv.width || py < kv.y || py > kv.y + kv.height) continue;
        if (kv.type === 'oobBoundary') {
          inOob = true;
          const grace = (this.oobGraceMs.get(player.id) ?? 0) + dt;
          this.oobGraceMs.set(player.id, grace);
          if (grace >= 1200) player.takeHit(null, 'environment');
        } else {
          player.takeHit(null, 'environment');
        }
      }
      if (!inOob) this.oobGraceMs.delete(player.id);
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
