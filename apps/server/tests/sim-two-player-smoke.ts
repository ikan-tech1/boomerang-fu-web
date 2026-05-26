import assert from 'node:assert/strict';
import type { InputFrame } from '@boomerang/netcode';
import { AuthoritativeSim } from '../src/sim/AuthoritativeSim.js';

const sim = new AuthoritativeSim();
sim.addPlayer(0, 'avocado', 150, 300);
sim.addPlayer(1, 'banana', 650, 300);

const inputA: InputFrame = {
  playerId: 0,
  tick: 1,
  moveX: 1,
  moveY: 0,
  aimX: 1,
  aimY: 0,
  buttons: { dash: false, melee: false, throw: false, recall: false },
};

const inputB: InputFrame = {
  playerId: 1,
  tick: 1,
  moveX: -1,
  moveY: 0,
  aimX: -1,
  aimY: 0,
  buttons: { dash: false, melee: false, throw: false, recall: false },
};

for (let i = 0; i < 90; i++) {
  sim.applyInputs([inputA, inputB]);
  sim.step();
}

const snap = sim.snapshot();
assert.equal(snap.length, 2);
const p0 = snap.find((p) => p.id === 0);
const p1 = snap.find((p) => p.id === 1);
assert.ok(p0 && p1);
assert.ok(p0.x > 150, 'player 0 should move right');
assert.ok(p1.x < 650, 'player 1 should move left');
assert.notEqual(p0.x, p1.x);

console.log('✓ authoritative sim two-player smoke (90 ticks, diverging positions)');
