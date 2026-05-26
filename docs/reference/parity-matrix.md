# Parity Matrix

> Track feature parity between reference (commercial Boomerang Fu) and web recreation.
> Last updated: 2026-05-27 (iteration 2)

| Feature | Reference | Web | Status | Est. % |
|---------|-----------|-----|--------|--------|
| Move/aim controls | ✓ | ✓ | Implemented | 90% |
| Dash + i-frames | ✓ | ✓ | Implemented | 85% |
| Melee arc/deflect | ✓ | ✓ | Implemented | 80% |
| Throw + charge | ✓ | ✓ | Implemented | 85% |
| Recall | ✓ | ✓ | Implemented | 85% |
| Boomerang bounce/return | ✓ | ✓ | Tuned homing | 78% |
| One-hit kill | ✓ | ✓ | Implemented | 90% |
| Shield power-up | ✓ | ✓ | Implemented | 90% |
| Fire power-up | ✓ | ✓ | Basic VFX spread | 70% |
| Ice power-up | ✓ | ✓ | Freeze + dash break | 75% |
| Explosive power-up | ✓ | ✓ | Implemented | 80% |
| Teleport power-up | ✓ | ✓ | Implemented | 75% |
| Telekinesis | ✓ | ✓ | Radius steer sim | 70% |
| Disguise | ✓ | ✓ | Prop match + foliage | 72% |
| Decoy | ✓ | ✓ | Basic clone | 60% |
| Battle Royale zone | ✓ | ✓ | Shrinking ring + OOB kill | 70% |
| Spam Dash | ✓ | ✓ | Implemented | 85% |
| Golden Boomerang | ✓ | ✓ | Mode spawn + slow | 65% |
| Magnet | ✓ | ✓ | Implemented | 80% |
| Multi Throw | ✓ | ✓ | Implemented | 75% |
| Free-for-All mode | ✓ | ✓ | Implemented | 85% |
| Teams mode | ✓ | ✓ | Team scoring + FF toggle | 70% |
| Golden Boomerang mode | ✓ | ✓ | Timer spawn + bonus pts | 65% |
| Hide & Seek mode | ✓ | ✓ | Phases + prop matching | 68% |
| 20 characters | ✓ | ◐ | Procedural food silhouettes | 48% |
| 50+ arenas | ✓ | ◐ | 15 arenas, all trap archetypes | 30% |
| Bot AI | ✓ | ✓ | Chase/throw + difficulty tiers | 55% |
| Local 6P | ✓ | ◐ | Keyboard 2P + gamepad mux | 45% |
| Online multiplayer | ✓ | ◐ | Colyseus Matter sim + room codes | 42% |
| SFX/Music | ✓ | ◐ | Web Audio procedural SFX | 45% |
| Rules editor | ✓ | ◐ | Lobby toggles | 35% |
| XP/unlocks | ✓ | ◐ | IndexedDB profile + char unlocks | 40% |
| Map select | ✓ | ✓ | Lobby dropdown (15 maps) | 85% |
| Death slice VFX | ✓ | ✓ | Basic particles | 50% |
| Debug overlays | — | ✓ | Implemented | 95% |
| Playwright QA | — | ✓ | Smoke + replay unit test | 38% |
| Tiled arena loader | — | ✓ | fromTiled() object layers | 55% |

**Legend**: ✓ Complete · ◐ Partial/Stub · ✗ Not started

## Domain Summary (2026-05-27)

| Domain | Est. Complete |
|--------|---------------|
| Combat / physics | **80%** |
| Power-ups (13) | **74%** |
| Game modes (4) | **72%** |
| Arenas / traps | **30%** |
| Characters / art | **48%** |
| Multiplayer | **42%** |
| Audio | **45%** |
| UI / meta | **58%** |
| QA / fidelity | **38%** |
| **Overall** | **~52%** |

## Tuning Targets

- Throw speed: ±5% of reference
- Dash distance: ±5% of reference
- Return timing: ±5% of reference
- Replay harness: deterministic 120-frame Matter seed test (`pnpm test:unit`)

## Next Priority

1. Client-side state interpolation from Colyseus snapshots
2. Arena batches 16–50 (themed Tiled source maps)
3. Real SFX/music sprite banks (replace procedural interim)
4. Character atlases + costumes
5. Full Playwright fidelity suite (physics replay + visual snapshots)
