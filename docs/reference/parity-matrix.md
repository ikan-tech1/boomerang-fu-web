# Parity Matrix

> Track feature parity between reference (commercial Boomerang Fu) and web recreation.
> Last updated: 2026-05-27

| Feature | Reference | Web | Status | Est. % |
|---------|-----------|-----|--------|--------|
| Move/aim controls | ✓ | ✓ | Implemented | 90% |
| Dash + i-frames | ✓ | ✓ | Implemented | 85% |
| Melee arc/deflect | ✓ | ✓ | Implemented | 80% |
| Throw + charge | ✓ | ✓ | Implemented | 85% |
| Recall | ✓ | ✓ | Implemented | 85% |
| Boomerang bounce/return | ✓ | ✓ | Implemented | 75% |
| One-hit kill | ✓ | ✓ | Implemented | 90% |
| Shield power-up | ✓ | ✓ | Implemented | 90% |
| Fire power-up | ✓ | ✓ | Basic VFX spread | 70% |
| Ice power-up | ✓ | ✓ | Freeze + dash break | 75% |
| Explosive power-up | ✓ | ✓ | Implemented | 80% |
| Teleport power-up | ✓ | ✓ | Implemented | 75% |
| Telekinesis | ✓ | ✓ | Radius steer sim | 70% |
| Disguise | ✓ | ✓ | Alpha/scale + reveal | 65% |
| Decoy | ✓ | ✓ | Basic clone | 60% |
| Battle Royale zone | ✓ | ✓ | Shrinking ring + OOB kill | 70% |
| Spam Dash | ✓ | ✓ | Implemented | 85% |
| Golden Boomerang | ✓ | ✓ | Mode spawn + slow | 65% |
| Magnet | ✓ | ✓ | Implemented | 80% |
| Multi Throw | ✓ | ✓ | Implemented | 75% |
| Free-for-All mode | ✓ | ✓ | Implemented | 85% |
| Teams mode | ✓ | ✓ | Team scoring + FF toggle | 70% |
| Golden Boomerang mode | ✓ | ✓ | Timer spawn + bonus pts | 65% |
| Hide & Seek mode | ✓ | ✓ | Hide/seek phases + disguise | 60% |
| 20 characters | ✓ | ◐ | Color circles, all in data | 25% |
| 50+ arenas | ✓ | ◐ | 3 JSON samples + traps | 8% |
| Bot AI | ✓ | ✓ | Chase/throw + difficulty tiers | 55% |
| Local 6P | ✓ | ◐ | Keyboard 2P + gamepad mux | 45% |
| Online multiplayer | ✓ | ◐ | Colyseus room stub | 15% |
| SFX/Music | ✓ | ◐ | Howler stub keys | 20% |
| Rules editor | ✓ | ◐ | Lobby toggles | 35% |
| XP/unlocks | ✓ | ◐ | IndexedDB profile + char unlocks | 40% |
| Map select | ✓ | ✓ | Lobby dropdown | 80% |
| Death slice VFX | ✓ | ✓ | Basic particles | 50% |
| Debug overlays | — | ✓ | Implemented | 95% |
| Playwright QA | — | ✓ | Smoke test | 30% |

**Legend**: ✓ Complete · ◐ Partial/Stub · ✗ Not started

## Domain Summary (2026-05-27)

| Domain | Est. Complete |
|--------|---------------|
| Combat / physics | **78%** |
| Power-ups (13) | **74%** |
| Game modes (4) | **70%** |
| Arenas / traps | **12%** |
| Characters / art | **25%** |
| Multiplayer | **30%** |
| Audio | **20%** |
| UI / meta | **55%** |
| QA / fidelity | **30%** |
| **Overall** | **~42%** |

## Tuning Targets

- Throw speed: ±5% of reference
- Dash distance: ±5% of reference
- Return timing: ±5% of reference

## Next Priority

1. Physics tuning pass against reference footage
2. Authoritative Colyseus server sim + room codes
3. Arena batch pipeline (10 trap archetypes)
4. Character sprite atlases + silhouette readability
5. SFX/music bank recreation
