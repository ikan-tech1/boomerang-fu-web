import type { ArenaData } from '@boomerang/content';
import Phaser from 'phaser';
import type { PlayerEntity } from '../entities/Player';

export interface DisguisePropInstance {
  id: string;
  propType: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sprite: Phaser.GameObjects.Rectangle;
}

/** Hide & Seek prop matching — players align with arena disguise props */
export class PropDisguiseSystem {
  private props: DisguisePropInstance[] = [];
  private readonly matchRadius = 36;

  constructor(private readonly scene: Phaser.Scene) {}

  loadArena(arena: ArenaData): void {
    this.clear();
    const types = arena.disguiseProps;
    const positions = [
      { x: arena.width * 0.2, y: arena.height * 0.35 },
      { x: arena.width * 0.75, y: arena.height * 0.4 },
      { x: arena.width * 0.5, y: arena.height * 0.65 },
      { x: arena.width * 0.3, y: arena.height * 0.55 },
      { x: arena.width * 0.65, y: arena.height * 0.25 },
    ];
    types.forEach((propType, i) => {
      const pos = positions[i % positions.length];
      if (!pos) return;
      const w = 44;
      const h = 44;
      const color = propColor(propType);
      const sprite = this.scene.add.rectangle(pos.x, pos.y, w, h, color, 0.85);
      sprite.setStrokeStyle(2, 0xffffff, 0.6);
      this.scene.add
        .text(pos.x, pos.y, propType.slice(0, 3), { fontSize: '9px', color: '#fff' })
        .setOrigin(0.5);
      this.props.push({
        id: `prop-${i}`,
        propType,
        x: pos.x,
        y: pos.y,
        width: w,
        height: h,
        sprite,
      });
    });
  }

  /** Try to match player to nearest prop of their chosen disguise type */
  tryMatchProp(player: PlayerEntity, propType?: string): boolean {
    if (!player.disguised) return false;
    const want = propType ?? player.disguisePropType;
    if (!want) return false;

    const px = player.body.position.x;
    const py = player.body.position.y;
    let best: DisguisePropInstance | null = null;
    let bestDist = this.matchRadius;

    for (const prop of this.props) {
      if (prop.propType !== want) continue;
      const d = Math.hypot(px - prop.x, py - prop.y);
      if (d < bestDist) {
        bestDist = d;
        best = prop;
      }
    }

    if (!best) return false;
    player.disguisePropType = best.propType;
    player.disguiseMatched = true;
    player.sprite.setAlpha(0.15);
    player.sprite.setScale(0.75);
    return true;
  }

  revealPlayer(player: PlayerEntity): void {
    player.disguised = false;
    player.disguiseMatched = false;
    player.disguisePropType = undefined;
    player.sprite.setAlpha(1);
    player.sprite.setScale(1);
  }

  assignRandomPropType(player: PlayerEntity, arena: ArenaData): void {
    const pick = arena.disguiseProps[Math.floor(Math.random() * arena.disguiseProps.length)];
    if (pick) player.disguisePropType = pick;
    player.disguiseMatched = false;
  }

  clear(): void {
    for (const p of this.props) {
      p.sprite.destroy();
    }
    this.props.length = 0;
  }
}

function propColor(type: string): number {
  const hash = type.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const palette = [0x6b8e23, 0x8b4513, 0x4682b4, 0xcd853f, 0x708090, 0xdaa520];
  return palette[hash % palette.length] ?? 0x888888;
}
