# Physics Reference Spec

> Traceability: public gameplay footage frame analysis, Wikipedia mechanics summary.

## Player Movement

| Constant | Value | Unit | Reference |
|----------|-------|------|-----------|
| baseSpeed | 220 | px/s | footage pacing |
| acceleration | 1800 | px/s² | snappy start |
| friction | 1200 | px/s² | quick stop |
| playerRadius | 20 | px | hitbox estimate |
| playerMass | 1.0 | Matter units | baseline |

## Boomerang

| Constant | Value | Unit | Reference |
|----------|-------|------|-----------|
| minThrowSpeed | 400 | px/s | tap throw |
| maxThrowSpeed | 900 | px/s | full charge |
| spinRate | 720 | deg/s | visual reference |
| wallRestitution | 0.85 | 0–1 | bouncy walls |
| returnHomingStrength | 0.12 | lerp/frame | curves toward owner |
| returnSpeed | 650 | px/s | return phase |
| pickupRadius | 32 | px | floor pickup |
| maxBounces | 8 | count | before drop |
| dropFriction | 0.95 | 0–1 | sliding on floor |

## Boomerang State Machine

```
HELD → THROWN → (BOUNCING)* → RETURNING → HELD
              ↘ DROP ↗ (pickup)
THROWN/RETURNING → RECALL (forced return)
Any airborne → DEFLECTED (melee hit, reverses velocity + adds spin)
```

## Combat

| Constant | Value | Notes |
|----------|-------|-------|
| oneHitKill | true | shield is only exception |
| hitstopDuration | 50 | ms freeze on kill |
| killKnockback | 300 | px/s on death |
| selfHitOnReturn | true | can kill thrower on return path |
| droppedBoomerangKill | true | loose boomerang still lethal |

## Dash Physics

See controls.md — dash overrides friction, grants i-frames.

## Environmental

| Kill Volume | Scores Kill? | Reference |
|-------------|--------------|-----------|
| Water | No (environmental) | Wikipedia |
| Void/Pit | No | arena traps |
| OOB boundary | Yes after timer | dotted line + delay |

## Tuning Target

Side-by-side reference clips should match within **±5%** on throw speed, return timing, and dash distance.
