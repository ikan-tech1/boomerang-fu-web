# Parity Matrix

> Track feature parity between reference (commercial Boomerang Fu) and web recreation.
> Update status as features ship.

| Feature | Reference | Web | Status |
|---------|-----------|-----|--------|
| Move/aim controls | ✓ | ✓ | Implemented |
| Dash + i-frames | ✓ | ✓ | Implemented |
| Melee arc/deflect | ✓ | ✓ | Implemented |
| Throw + charge | ✓ | ✓ | Implemented |
| Recall | ✓ | ✓ | Implemented |
| Boomerang bounce/return | ✓ | ✓ | Implemented |
| One-hit kill | ✓ | ✓ | Implemented |
| Shield power-up | ✓ | ✓ | Implemented |
| Fire power-up | ✓ | ✓ | Stub VFX |
| Ice power-up | ✓ | ✓ | Implemented |
| Explosive power-up | ✓ | ✓ | Implemented |
| Teleport power-up | ✓ | ✓ | Implemented |
| Telekinesis | ✓ | ◐ | Inventory only |
| Disguise | ✓ | ◐ | Flag only |
| Decoy | ✓ | ✓ | Basic clone |
| Battle Royale zone | ✓ | ◐ | Inventory only |
| Spam Dash | ✓ | ✓ | Implemented |
| Golden Boomerang | ✓ | ◐ | Mode + pickup |
| Magnet | ✓ | ✓ | Implemented |
| Multi Throw | ✓ | ✓ | Implemented |
| Free-for-All mode | ✓ | ✓ | Implemented |
| Teams mode | ✓ | ◐ | Mode shell |
| Golden Boomerang mode | ✓ | ◐ | Timer spawn |
| Hide & Seek mode | ✓ | ◐ | Phase timer |
| 20 characters | ✓ | ◐ | Placeholder sprites |
| 50+ arenas | ✓ | ◐ | 3 samples |
| Bot AI | ✓ | ✓ | Basic chase/throw |
| Local 6P | ✓ | ◐ | 2P keyboard + gamepad |
| Online multiplayer | ✓ | ◐ | Colyseus stub |
| SFX/Music | ✓ | ◐ | Howler stub |
| Rules editor | ✓ | ◐ | Lobby toggles |
| XP/unlocks | ✓ | ✗ | Not started |
| Map select | ✓ | ✓ | Lobby dropdown |
| Death slice VFX | ✓ | ✓ | Basic particles |
| Debug overlays | — | ✓ | Implemented |
| Playwright QA | — | ✓ | Smoke test |

**Legend**: ✓ Complete · ◐ Partial/Stub · ✗ Not started

## Tuning Targets

- Throw speed: ±5% of reference
- Dash distance: ±5% of reference
- Return timing: ±5% of reference

## Next Priority

1. Physics tuning pass against reference footage
2. Telekinesis + Battle Royale zone simulation
3. Full Teams/Hide & Seek mode logic
4. Authoritative server sim
5. Asset pipeline (atlases, audio banks)
