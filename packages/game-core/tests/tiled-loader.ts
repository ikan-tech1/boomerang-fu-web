import assert from 'node:assert/strict';
import { ArenaLoader } from '../src/arena/ArenaLoader.js';

const loader = new ArenaLoader();

const tiled = {
  width: 25,
  height: 19,
  tilewidth: 32,
  tileheight: 32,
  properties: [
    { name: 'arenaId', value: 'test-tiled' },
    { name: 'arenaName', value: 'Test Tiled' },
    { name: 'theme', value: 'kitchen' },
  ],
  layers: [
    {
      name: 'objects',
      type: 'objectgroup',
      objects: [
        { id: 1, name: 'spawn1', type: 'spawn', x: 64, y: 128, width: 0, height: 0 },
        { id: 2, name: 'spawn2', type: 'spawn', x: 640, y: 128, width: 0, height: 0 },
        { id: 3, name: 'spin', type: 'spinner', x: 300, y: 200, width: 48, height: 48 },
        {
          id: 4,
          name: 'tele-a',
          type: 'teleporter',
          x: 100,
          y: 400,
          width: 40,
          height: 40,
          properties: [{ name: 'pairId', value: 'tele-b' }],
        },
        { id: 5, name: 'water', type: 'water', x: 0, y: 500, width: 800, height: 80 },
      ],
    },
  ],
};

const arena = loader.fromTiled(tiled);

assert.equal(arena.id, 'test-tiled');
assert.equal(arena.spawnPoints.length, 2);
assert.equal(arena.hazards.length, 2);
assert.equal(arena.hazards[0]?.type, 'spinner');
assert.equal(arena.killVolumes.length, 1);
assert.equal(arena.killVolumes[0]?.type, 'water');

console.log('✓ Tiled arena loader (spawn, spinner, teleporter, water kill volume)');
