#!/usr/bin/env node
/**
 * Generates 52 showcase arenas + registry.ts + balance.json arena list.
 * Run: node tools/arena-batch/generate-arenas.mjs
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../../packages/game-core/src/arenas');
const balancePath = resolve(__dirname, '../../packages/content/balance.json');
const registryPath = resolve(outDir, 'registry.ts');

const spawns4 = [
  { x: 120, y: 300 },
  { x: 680, y: 300 },
  { x: 400, y: 120 },
  { x: 400, y: 480 },
];

const themes = ['kitchen', 'jungle', 'bamboo', 'clouds', 'dessert'];
const themeProps = {
  kitchen: ['pot', 'pan', 'jar', 'table', 'chair', 'rug', 'knife-block', 'plate'],
  jungle: ['statue', 'torch', 'pot', 'rock', 'moss', 'vine', 'fern', 'bush'],
  bamboo: ['crate', 'barrel', 'hay', 'lily', 'dock', 'buoy', 'bridge', 'lantern'],
  clouds: ['cloud', 'balloon', 'kite', 'star', 'moon', 'castle-turret', 'flag', 'rainbow'],
  dessert: ['donut', 'cupcake', 'cookie', 'candy', 'sundae', 'waffle', 'brownie', 'macaron'],
};

const trapArchetypes = [
  { type: 'spinner', make: (i) => [{ id: `spin-${i}`, type: 'spinner', x: 250 + (i % 3) * 150, y: 300, width: 48, height: 48 }] },
  { type: 'movingPlatform', make: (i) => [{ id: `plat-${i}`, type: 'movingPlatform', x: 450, y: 275 + (i % 2) * 40, width: 140, height: 24, properties: { originX: 450, axis: 'x' } }] },
  { type: 'crusher', make: (i) => [{ id: `crush-${i}`, type: 'crusher', x: 425, y: 280, width: 100, height: 40, properties: { periodMs: 1800 + (i % 4) * 200 } }] },
  { type: 'teleporter', make: (i) => [
    { id: `tele-a-${i}`, type: 'teleporter', x: 150, y: 150, width: 40, height: 40, properties: { pairId: `tele-b-${i}` } },
    { id: `tele-b-${i}`, type: 'teleporter', x: 650, y: 550, width: 40, height: 40, properties: { pairId: `tele-a-${i}` } },
  ] },
  { type: 'switchDoor', make: (i) => [
    { id: `switch-${i}`, type: 'switchDoor', x: 400, y: 300, width: 60, height: 20, properties: { doorId: `door-${i}`, open: false } },
    { id: `door-${i}`, type: 'switchDoor', x: 400, y: 200, width: 100, height: 16, properties: { isDoor: true, open: false } },
  ] },
  { type: 'foliageHide', make: (i) => [
    { id: `hide-1-${i}`, type: 'foliageHide', x: 200, y: 400, width: 80, height: 60 },
    { id: `hide-2-${i}`, type: 'foliageHide', x: 700, y: 250, width: 80, height: 60 },
  ] },
  { type: 'breakable', make: (i) => [
    { id: `brk-1-${i}`, type: 'breakable', x: 300, y: 250, width: 50, height: 50, properties: { hp: 1 } },
    { id: `brk-2-${i}`, type: 'breakable', x: 550, y: 250, width: 50, height: 50, properties: { hp: 1 } },
  ] },
];

const killArchetypes = [
  [],
  [{ type: 'water', x: 0, y: 400, width: 900, height: 120, scoresKill: false }],
  [{ type: 'void', x: 275, y: 275, width: 200, height: 200, scoresKill: false }],
  [{ id: 'oob-top', type: 'oobBoundary', x: 0, y: 0, width: 700, height: 24 }, { id: 'oob-bot', type: 'oobBoundary', x: 0, y: 676, width: 700, height: 24 }],
];

/** Hand-crafted flagship arenas (first 15) */
const flagship = [
  { id: 'kitchen-classic', name: 'Kitchen Classic', theme: 'kitchen', width: 800, height: 600, hazards: [], killVolumes: [] },
  { id: 'jungle-temple', name: 'Jungle Temple', theme: 'jungle', width: 900, height: 650, hazards: [{ id: 'spin-j', type: 'spinner', x: 450, y: 325, width: 48, height: 48 }], killVolumes: [] },
  { id: 'bamboo-bridge', name: 'Bamboo Bridge', theme: 'bamboo', width: 850, height: 500, hazards: [{ id: 'plat-b', type: 'movingPlatform', x: 425, y: 250, width: 160, height: 24, properties: { originX: 425 } }], killVolumes: [{ type: 'water', x: 0, y: 380, width: 850, height: 120, scoresKill: false }] },
  { id: 'switchdoor-vault', name: 'Switchdoor Vault', theme: 'kitchen', width: 800, height: 600, hazards: [
    { id: 'switch-1', type: 'switchDoor', x: 400, y: 300, width: 60, height: 20, properties: { doorId: 'door-1', open: false } },
    { id: 'door-1', type: 'switchDoor', x: 400, y: 200, width: 100, height: 16, properties: { isDoor: true, open: false } },
  ], killVolumes: [] },
  { id: 'foliage-garden', name: 'Foliage Garden', theme: 'jungle', width: 900, height: 650, hazards: [
    { id: 'hide-1', type: 'foliageHide', x: 200, y: 400, width: 80, height: 60 },
    { id: 'hide-2', type: 'foliageHide', x: 700, y: 250, width: 80, height: 60 },
    { id: 'hide-3', type: 'foliageHide', x: 450, y: 500, width: 80, height: 60 },
  ], killVolumes: [] },
  { id: 'breakable-barn', name: 'Breakable Barn', theme: 'bamboo', width: 850, height: 500, hazards: [
    { id: 'brk-1', type: 'breakable', x: 300, y: 250, width: 50, height: 50, properties: { hp: 1 } },
    { id: 'brk-2', type: 'breakable', x: 550, y: 250, width: 50, height: 50, properties: { hp: 1 } },
  ], killVolumes: [] },
  { id: 'spinner-gauntlet', name: 'Spinner Gauntlet', theme: 'kitchen', width: 800, height: 600, hazards: [
    { id: 'spin-1', type: 'spinner', x: 250, y: 300, width: 48, height: 48 },
    { id: 'spin-2', type: 'spinner', x: 550, y: 300, width: 48, height: 48 },
  ], killVolumes: [] },
  { id: 'platform-skyway', name: 'Platform Skyway', theme: 'clouds', width: 900, height: 550, hazards: [{ id: 'plat-1', type: 'movingPlatform', x: 450, y: 275, width: 140, height: 24, properties: { originX: 450, axis: 'x' } }], killVolumes: [{ type: 'void', x: 350, y: 450, width: 200, height: 60, scoresKill: false }] },
  { id: 'crusher-cavern', name: 'Crusher Cavern', theme: 'jungle', width: 850, height: 600, hazards: [{ id: 'crush-1', type: 'crusher', x: 425, y: 280, width: 100, height: 40, properties: { periodMs: 2000 } }], killVolumes: [] },
  { id: 'tele-maze', name: 'Tele Maze', theme: 'jungle', width: 800, height: 700, hazards: [
    { id: 'tele-a', type: 'teleporter', x: 150, y: 150, width: 40, height: 40, properties: { pairId: 'tele-b' } },
    { id: 'tele-b', type: 'teleporter', x: 650, y: 550, width: 40, height: 40, properties: { pairId: 'tele-a' } },
    { id: 'tele-c', type: 'teleporter', x: 650, y: 150, width: 40, height: 40, properties: { pairId: 'tele-d' } },
    { id: 'tele-d', type: 'teleporter', x: 150, y: 550, width: 40, height: 40, properties: { pairId: 'tele-c' } },
  ], killVolumes: [] },
  { id: 'water-cove', name: 'Water Cove', theme: 'bamboo', width: 900, height: 520, hazards: [], killVolumes: [{ type: 'water', x: 0, y: 400, width: 900, height: 120, scoresKill: false }] },
  { id: 'void-pit', name: 'Void Pit', theme: 'clouds', width: 750, height: 650, hazards: [], killVolumes: [{ type: 'void', x: 275, y: 275, width: 200, height: 200, scoresKill: false }] },
  { id: 'oob-arena', name: 'OOB Arena', theme: 'kitchen', width: 700, height: 700, hazards: [
    { id: 'oob-top', type: 'oobBoundary', x: 0, y: 0, width: 700, height: 24 },
    { id: 'oob-bot', type: 'oobBoundary', x: 0, y: 676, width: 700, height: 24 },
  ], killVolumes: [] },
  { id: 'dessert-donut-dash', name: 'Donut Dash', theme: 'dessert', width: 820, height: 580, hazards: [
    { id: 'spin-d', type: 'spinner', x: 410, y: 290, width: 44, height: 44 },
    { id: 'brk-d', type: 'breakable', x: 200, y: 400, width: 40, height: 40, properties: { hp: 1 } },
  ], killVolumes: [] },
  { id: 'cloud-castle', name: 'Cloud Castle', theme: 'clouds', width: 880, height: 620, hazards: [
    { id: 'plat-c', type: 'movingPlatform', x: 440, y: 310, width: 120, height: 20, properties: { originX: 440 } },
    { id: 'tele-c1', type: 'teleporter', x: 120, y: 310, width: 36, height: 36, properties: { pairId: 'tele-c2' } },
    { id: 'tele-c2', type: 'teleporter', x: 760, y: 310, width: 36, height: 36, properties: { pairId: 'tele-c1' } },
  ], killVolumes: [{ type: 'water', x: 0, y: 520, width: 880, height: 100, scoresKill: false }] },
];

const arenaNames = {
  kitchen: ['Spice Rack', 'Pantry Panic', 'Counter Clash', 'Oven Outpost', 'Fridge Frenzy', 'Sink Showdown', 'Blender Blitz', 'Toaster Tussle'],
  jungle: ['Temple Ruins', 'Vine Valley', 'Monkey Maze', 'Snake Pit', 'Canopy Chase', 'Ruin Rush', 'Totem Trial', 'Moss Maze'],
  bamboo: ['Bridge Battle', 'Zen Garden', 'Panda Pass', 'River Run', 'Lantern Lane', 'Bamboo Blitz', 'Pond Peril', 'Shrine Scramble'],
  clouds: ['Sky Fort', 'Rainbow Ridge', 'Storm Station', 'Nimbus Nest', 'Wind Walk', 'Cumulus Clash', 'Thunder Trail', 'Aurora Arena'],
  dessert: ['Sugar Rush', 'Frosting Fight', 'Candy Canyon', 'Pie Panic', 'Gelato Gauntlet', 'Sprinkle Sprint', 'Truffle Tussle', 'Mousse Mayhem'],
};

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pickProps(theme, idx) {
  const pool = themeProps[theme] ?? themeProps.kitchen;
  return [pool[idx % pool.length], pool[(idx + 2) % pool.length], pool[(idx + 4) % pool.length]];
}

/** Generate procedural arenas 16–52 */
function generateProcedural() {
  const out = [];
  let n = 0;
  for (const theme of themes) {
    const names = arenaNames[theme];
    for (let i = 0; i < names.length; i++) {
      const trap = trapArchetypes[(n + i) % trapArchetypes.length];
      const killIdx = (n + i) % killArchetypes.length;
      const w = 780 + (n % 5) * 30;
      const h = 520 + (n % 4) * 35;
      out.push({
        id: `${theme}-${slugify(names[i])}`,
        name: names[i],
        theme,
        width: w,
        height: h,
        hazards: trap.make(n),
        killVolumes: killIdx === 3
          ? [{ type: 'void', x: w * 0.35, y: h * 0.4, width: w * 0.3, height: h * 0.25, scoresKill: false }]
          : killArchetypes[killIdx].filter((k) => k.type !== 'oobBoundary').map((k) => ({
            ...k,
            width: k.width ?? w,
            x: k.x ?? 0,
            y: k.y ?? h - 120,
          })),
      });
      n += 1;
    }
  }
  return out.slice(0, 37);
}

const allArenas = [...flagship, ...generateProcedural()];

mkdirSync(outDir, { recursive: true });

const balanceEntries = [];

for (const a of allArenas) {
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
    killVolumes: a.killVolumes ?? [],
    disguiseProps: pickProps(a.theme, allArenas.indexOf(a)),
  };
  const path = resolve(outDir, `${a.id}.json`);
  writeFileSync(path, `${JSON.stringify(doc, null, 2)}\n`);
  balanceEntries.push({ id: a.id, name: a.name, theme: a.theme, status: 'generated' });
}

const importLines = allArenas.map((a) => {
  const varName = a.id.replace(/-/g, '_');
  return `import ${varName} from './${a.id}.json';`;
});

const registryEntries = allArenas.map((a) => {
  const varName = a.id.replace(/-/g, '_');
  return `  '${a.id}': ${varName} as unknown as ArenaData,`;
});

const registryTs = `import type { ArenaData } from '@boomerang/content';
${importLines.join('\n')}

/** Auto-generated arena registry (${allArenas.length} maps) */
export const ARENA_REGISTRY: Record<string, ArenaData> = {
${registryEntries.join('\n')}
};

export const DEFAULT_ARENA_ID = 'kitchen-classic';
`;

writeFileSync(registryPath, registryTs);

const balance = JSON.parse(readFileSync(balancePath, 'utf8'));
balance.arenas = balanceEntries;
writeFileSync(balancePath, `${JSON.stringify(balance, null, 2)}\n`);

console.log(`Generated ${allArenas.length} arenas + registry.ts + balance.json`);
