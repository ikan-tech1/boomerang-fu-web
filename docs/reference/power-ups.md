# Power-Up Matrix

> Source: [Wikipedia Boomerang Fu power-up table](https://en.wikipedia.org/wiki/Boomerang_Fu)
> Implementation: `packages/content/balance.json` → `powerUps`

## Stacking Rules

- **Max stack**: 3 power-ups per player
- **Fire + Ice exclusion**: cannot hold both simultaneously; newer pickup replaces conflicting type
- **HUD**: icons stack left-to-right in pickup order

## All 13 Power-Ups

| ID | Name | Effect | Duration | Conflicts |
|----|------|--------|----------|-----------|
| shield | Shield | Blocks one boomerang hit | Until consumed | — |
| fire | Fire | Boomerang ignites targets; spread on kill | Until death | ice |
| ice | Ice | Freezes hit targets in place | Until death | fire |
| explosive | Explosive | Boomerang explodes on hit/wall | 3 throws | — |
| teleport | Teleport | Blink to aim point | 3 uses | — |
| telekinesis | Telekinesis | Remote boomerang control in radius | 5s active | — |
| disguise | Disguise | Appear as arena prop | Until hit | — |
| decoy | Decoy | Spawn fake clone | 1 use | — |
| battleRoyale | Battle Royale | Shrinking zone after pickup | Match | — |
| spamDash | Spam Dash | Zero dash cooldown | 8s | — |
| golden | Golden Boomerang | Slow heavy boomerang; bonus points | Mode-specific | — |
| magnet | Magnet | Attract nearby power-ups | 10s | — |
| multiThrow | Multi Throw | Throw 3 boomerangs at once | 3 throws | — |

## Interaction Matrix (selected)

| A | B | Result |
|---|---|--------|
| fire | ice | Mutual exclusion on pickup |
| explosive | teleport | Explosion cancels teleport mid-blink (stub: explosion wins) |
| shield | any hit | Shield consumed, no kill |
| ice | spamDash | Frozen player can spam-dash to break free |
| telekinesis | recall | Recall overrides telekinesis control |
| disguise | melee | Melee hit reveals disguise |

## Pickup Rules

- Spawn interval: configurable (default 8s)
- Spawn locations: random valid floor tile
- Pickup radius: 28px
- VFX: sparkle burst on collect
