import assert from 'node:assert/strict';
import { framesEqual, runReplayFrames } from '../src/physics/ReplayHarness.js';

const a = runReplayFrames(120, 42);
const b = runReplayFrames(120, 42);
const c = runReplayFrames(120, 99);

assert.ok(framesEqual(a, b), 'Replay must be deterministic for same seed');
assert.ok(!framesEqual(a, c), 'Different seeds must diverge');
console.log('✓ replay determinism (120 frames, seed 42)');
