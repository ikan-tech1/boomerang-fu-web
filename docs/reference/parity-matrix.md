# Parity Matrix

> Track feature parity between reference (commercial Boomerang Fu) and web recreation.
> Last updated: 2026-05-27 (extended push session)

| Feature | Reference | Web | Status | Est. % |
|---------|-----------|-----|--------|--------|
| Move/aim controls | ✓ | ✓ | Implemented | 92% |
| Dash + i-frames | ✓ | ✓ | Implemented | 86% |
| Melee arc/deflect | ✓ | ✓ | Implemented | 82% |
| Throw + charge | ✓ | ✓ | Implemented | 86% |
| Recall | ✓ | ✓ | Implemented | 86% |
| Boomerang bounce/return | ✓ | ✓ | Tuned homing | 80% |
| One-hit kill | ✓ | ✓ | Implemented | 90% |
| Shield power-up | ✓ | ✓ | Implemented | 90% |
| Fire power-up | ✓ | ✓ | Basic VFX spread | 72% |
| Ice power-up | ✓ | ✓ | Freeze + dash break | 76% |
| Explosive power-up | ✓ | ✓ | Implemented | 82% |
| Teleport power-up | ✓ | ✓ | Implemented | 76% |
| Telekinesis | ✓ | ✓ | Radius steer sim | 72% |
| Disguise | ✓ | ✓ | Prop match + foliage | 74% |
| Decoy | ✓ | ✓ | Basic clone | 62% |
| Battle Royale zone | ✓ | ✓ | Shrinking ring + OOB kill | 72% |
| Spam Dash | ✓ | ✓ | Implemented | 86% |
| Golden Boomerang | ✓ | ✓ | Steal on kill + slow | 78% |
| Magnet | ✓ | ✓ | Implemented | 82% |
| Multi Throw | ✓ | ✓ | Implemented | 76% |
| Free-for-All mode | ✓ | ✓ | Implemented | 86% |
| Teams mode | ✓ | ✓ | Team scoring + revives | 76% |
| Golden Boomerang mode | ✓ | ✓ | Timer spawn + steal | 78% |
| Hide & Seek mode | ✓ | ✓ | Seeker tag + prop matching | 74% |
| 20 characters | ✓ | ◐ | Procedural food silhouettes | 52% |
| 50+ arenas | ✓ | ◐ | **52 arenas** (procedural batches) | 72% |
| Bot AI | ✓ | ✓ | Easy/med/hard reaction + aim error | 72% |
| Local 6P | ✓ | ◐ | Keyboard 2P + gamepad mux | 48% |
| Online multiplayer | ✓ | ◐ | Colyseus + snapshot interpolation | 58% |
| SFX/Music | ✓ | ◐ | Web Audio procedural + music loop | 52% |
| Rules editor | ✓ | ◐ | Lobby toggles (FF, shields, spawn rate) | 55% |
| XP/unlocks | ✓ | ◐ | IndexedDB profile + char unlocks | 45% |
| Map select | ✓ | ✓ | Lobby dropdown (52 maps) | 88% |
| Death slice VFX | ✓ | ✓ | Basic particles | 52% |
| Debug overlays | — | ✓ | Implemented | 95% |
| Playwright QA | — | ✓ | Smoke + visual snapshots + 52-map check | 55% |
| Tiled arena loader | — | ✓ | fromTiled() object layers | 55% |

**Legend**: ✓ Complete · ◐ Partial/Stub · ✗ Not started

## Domain Summary (2026-05-27 extended push)

| Domain | Est. Complete |
|--------|---------------|
| Combat / physics | **82%** |
| Power-ups (13) | **76%** |
| Game modes (4) | **78%** |
| Arenas / traps | **72%** |
| Characters / art | **52%** |
| Multiplayer | **52%** |
| Audio | **52%** |
| UI / meta | **62%** |
| QA / fidelity | **55%** |
| **Overall** | **~68%** |

## Deployment Status

| Component | URL / Status |
|-----------|--------------|
| Web (Vercel) | https://boomerang-fu-web.vercel.app |
| Colyseus server | `render.yaml` + Dockerfile ready; deploy blocked: `npx @railway/cli whoami` → Unauthorized |
| Env | `VITE_COLYSEUS_URL` set via Vercel CLI (production/preview) |

## Remaining to true 100%

1. Hand-authored Tiled art for all 52+ arenas (currently procedural JSON)
2. Character sprite atlases + costume/hat layers
3. Full SFX/music asset banks (replace procedural interim)
4. Colyseus server live deploy + full combat sync (throws/hits authoritative)
5. Local 6P gamepad assignment UI
6. Playwright physics replay per mode

## Tuning Targets

- Throw speed: ±5% of reference
- Dash distance: ±5% of reference
- Return timing: ±5% of reference
- Replay harness: deterministic 120-frame Matter seed test (`pnpm test:unit`)
