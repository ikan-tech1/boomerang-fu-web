# Animation Inventory

> Per-character animation set. All 20 food characters share hitbox; unique silhouettes/colors.

## Core Animation Set (per character)

| Animation | Frames | FPS | Notes |
|-----------|--------|-----|-------|
| idle | 4 | 8 | subtle bounce |
| run | 6 | 12 | directional |
| dash | 3 | 20 | stretch squash |
| throw_windup | 4 | 15 | charge scales windup |
| throw_release | 2 | 20 | — |
| melee | 3 | 18 | arc swing |
| hit | 2 | 12 | flinch |
| death_slice | 8 | 24 | food split + pieces fly |
| death_stone | 4 | 15 | avocado stone variant |
| pickup | 3 | 12 | power-up collect |
| frozen | 1 | — | ice overlay |
| disguised | 1 | — | prop sprite swap |

## Death VFX Variants

- **Standard slice**: body splits into 2–4 food pieces with physics
- **Stone/pit**: special prop (e.g., avocado stone) rolls away
- **Explosion**: fire/explosive power-up death particles
- **Freeze shatter**: ice death breaks into shards

## Character Roster (20)

### Base (12)

avocado, banana, apple, orange, watermelon, pineapple, strawberry, cherry, lemon, grape, coconut, peach

### Just Desserts DLC (8)

donut, cupcake, cookie, icecream, popsicle, cake, muffin, pie

## Silhouette Test Gate

At 720p, each character identifiable in <0.5s during 6-player chaos.

## Placeholder Strategy (Phase 1)

Colored geometric shapes with character ID label until art pipeline (Aseprite → atlas) is ready.
