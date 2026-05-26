# Controls Reference Spec

> Traceability: Wikipedia, Steam store page, gameplay reviews, public footage analysis.
> All numeric values mirrored in `packages/content/balance.json`.

## Input Map

| Action | Keyboard (P1 default) | Gamepad |
|--------|----------------------|---------|
| Move | WASD / Arrow keys | Left stick |
| Aim | Mouse / Right stick | Right stick |
| Dash | Shift | A / Cross |
| Melee | E | X / Square |
| Throw | Space (hold to charge) | B / Circle (hold) |
| Recall | R | Y / Triangle |

## Stick / Aim

- **Deadzone**: 0.15 (15% radial deadzone before aim vector registers)
- **Aim smoothing**: none in reference; instant vector update
- **Facing**: character sprite flips to aim direction when stationary; movement direction when moving without aim input

## Dash

- **Duration**: 180ms burst
- **Cooldown**: 600ms from dash end
- **I-frames**: first 120ms of dash (immune to boomerang hits)
- **Speed multiplier**: 2.8× base move speed during dash
- **Collision**: passes through other players during i-frames; blocked by walls

## Melee

- **Arc**: 120° cone in front of character
- **Range**: 48px from center
- **Active frames**: 80ms
- **Effects**: knocks back targets; can deflect incoming boomerang; disarms holder on hit

## Throw

- **Tap throw**: min speed, no charge
- **Charge time**: 0–800ms maps to throw speed/distance
- **Charge curve**: linear 0→1 over 800ms
- **Recall**: boomerang returns on button press while airborne; slight homing boost

## Reference Notes

- Store page: "fast-paced physics party game" with dash, melee, throw, recall
- Wikipedia: one-hit kills, boomerang returns to thrower
- Reviews emphasize dodge-timing and recall mastery as core skill loop
