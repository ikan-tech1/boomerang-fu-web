#!/usr/bin/env node
/**
 * Generates showcase arena JSON (one primary trap archetype per arena).
 * Run: node tools/arena-batch/generate-arenas.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../../packages/game-core/src/arenas');

const spawns4 = [
  { x: 120, y: 300 },
  { x: 680, y: 300 },
  { x: 400, y: 120 },
  { x: 400, y: 480 },
];

const arenas = [
  {
    id: 'switchdoor-vault',
    name: 'Switchdoor Vault',
    theme: 'kitchen',
    width: 800,
    height: 600,
    hazards: [
      { id: 'switch-1', type: 'switchDoor', x: 400, y: 300, width: 60, height: 20, properties: { doorId: 'door-1', open: false } },
      { id: 'door-1', type: 'switchDoor', x: 400, y: 200, width: 100, height: 16, properties: { isDoor: true, open: false } },
    ],
    killVolumes: [],
    disguiseProps: ['pot', 'pan', 'jar'],
  },
  {
    id: 'foliage-garden',
    name: 'Foliage Garden',
    theme: 'jungle',
    width: 900,
    height: 650,
    hazards: [
      { id: 'hide-1', type: 'foliageHide', x: 200, y: 400, width: 80, height: 60 },
      { id: 'hide-2', type: 'foliageHide', x: 700, y: 250, width: 80, height: 60 },
      { id: 'hide-3', type: 'foliageHide', x: 450, y: 500, width: 80, height: 60 },
    ],
    killVolumes: [],
    disguiseProps: ['bush', 'fern', 'statue'],
  },
  {
    id: 'breakable-barn',
    name: 'Breakable Barn',
    theme: 'bamboo',
    width: 850,
    height: 500,
    hazards: [
      { id: 'brk-1', type: 'breakable', x: 300, y: 250, width: 50, height: 50, properties: { hp: 1 } },
      { id: 'brk-2', type: 'breakable', x: 550, y: 250, width: 50, height: 50, properties: { hp: 1 } },
    ],
    killVolumes: [],
    disguiseProps: ['crate', 'barrel', 'hay'],
  },
  {
    id: 'spinner-gauntlet',
    name: 'Spinner Gauntlet',
    theme: 'kitchen',
    width: 800,
    height: 600,
    hazards: [
      { id: 'spin-1', type: 'spinner', x: 250, y: 300, width: 48, height: 48 },
      { id: 'spin-2', type: 'spinner', x: 550, y: 300, width: 48, height: 48 },
    ],
    killVolumes: [],
    disguiseProps: ['pot', 'knife-block', 'plate'],
  },
  {
    id: 'platform-skyway',
    name: 'Platform Skyway',
    theme: 'clouds',
    width: 900,
    height: 550,
    hazards: [
      { id: 'plat-1', type: 'movingPlatform', x: 450, y: 275, width: 140, height: 24, properties: { originX: 450, axis: 'x' } },
    ],
    killVolumes: [{ type: 'void', x: 350, y: 450, width: 200, height: 60, scoresKill: false }],
    disguiseProps: ['cloud', 'balloon', 'kite'],
  },
  {
    id: 'crusher-cavern',
    name: 'Crusher Cavern',
    theme: 'jungle',
    width: 850,
    height: 600,
    hazards: [
      { id: 'crush-1', type: 'crusher', x: 425, y: 280, width: 100, height: 40, properties: { periodMs: 2000 } },
    ],
    killVolumes: [],
    disguiseProps: ['rock', 'moss', 'vine'],
  },
  {
    id: 'tele-maze',
    name: 'Tele Maze',
    theme: 'jungle',
    width: 800,
    height: 700,
    hazards: [
      { id: 'tele-a', type: 'teleporter', x: 150, y: 150, width: 40, height: 40, properties: { pairId: 'tele-b' } },
      { id: 'tele-b', type: 'teleporter', x: 650, y: 550, width: 40, height: 40, properties: { pairId: 'tele-a' } },
      { id: 'tele-c', type: 'teleporter', x: 650, y: 150, width: 40, height: 40, properties: { pairId: 'tele-d' } },
      { id: 'tele-d', type: 'teleporter', x: 150, y: 550, width: 40, height: 40, properties: { pairId: 'tele-c' } },
    ],
    killVolumes: [],
    disguiseProps: ['statue', 'torch', 'pot'],
  },
  {
    id: 'water-cove',
    name: 'Water Cove',
    theme: 'bamboo',
    width: 900,
    height: 520,
    hazards: [],
    killVolumes: [{ type: 'water', x: 0, y: 400, width: 900, height: 120, scoresKill: false }],
    disguiseProps: ['lily', 'dock', 'buoy'],
  },
  {
    id: 'void-pit',
    name: 'Void Pit',
    theme: 'clouds',
    width: 750,
    height: 650,
    hazards: [],
    killVolumes: [{ type: 'void', x: 275, y: 275, width: 200, height: 200, scoresKill: false }],
    disguiseProps: ['cloud', 'star', 'moon'],
  },
  {
    id: 'oob-arena',
    name: 'OOB Arena',
    theme: 'kitchen',
    width: 700,
    height: 700,
    hazards: [
      { id: 'oob-top', type: 'oobBoundary', x: 0, y: 0, width: 700, height: 24 },
      { id: 'oob-bot', type: 'oobBoundary', x: 0, y: 676, width: 700, height: 24 },
    ],
    killVolumes: [],
    disguiseProps: ['table', 'chair', 'rug'],
  },
  {
    id: 'dessert-donut-dash',
    name: 'Donut Dash',
    theme: 'dessert',
    width: 820,
    height: 580,
    hazards: [
      { id: 'spin-d', type: 'spinner', x: 410, y: 290, width: 44, height: 44 },
      { id: 'brk-d', type: 'breakable', x: 200, y: 400, width: 40, height: 40, properties: { hp: 1 } },
    ],
    killVolumes: [],
    disguiseProps: ['donut', 'cupcake', 'cookie'],
  },
  {
    id: 'cloud-castle',
    name: 'Cloud Castle',
    theme: 'clouds',
    width: 880,
    height: 620,
    hazards: [
      { id: 'plat-c', type: 'movingPlatform', x: 440, y: 310, width: 120, height: 20, properties: { originX: 440 } },
      { id: 'tele-c1', type: 'teleporter', x: 120, y: 310, width: 36, height: 36, properties: { pairId: 'tele-c2' } },
      { id: 'tele-c2', type: 'teleporter', x: 760, y: 310, width: 36, height: 36, properties: { pairId: 'tele-c1' } },
    ],
    killVolumes: [{ type: 'water', x: 0, y: 520, width: 880, height: 100, scoresKill: false }],
    disguiseProps: ['cloud', 'castle-turret', 'flag'],
  },
];

mkdirSync(outDir, { recursive: true });

for (const a of arenas) {
  const doc = {
    id: a.id,
    name: a.name,
    theme: a.theme,
    width: a.width,
    height: a.height,
    tileSize: 32,
    collisionPolys: [],
    spawnPoints: spawns4,
    hazards: a.hazards,
    killVolumes: a.killVolumes,
    disguiseProps: a.disguiseProps,
  };
  const path = resolve(outDir, `${a.id}.json`);
  writeFileSync(path, `${JSON.stringify(doc, null, 2)}\n`);
  console.log('wrote', path);
}

console.log(`Generated ${arenas.length} arenas`);
