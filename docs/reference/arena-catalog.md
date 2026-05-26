# Arena Catalog

> **52 arenas** registered in `ARENA_REGISTRY` (procedural batches + 15 flagship layouts).
> Last generated: 2026-05-26

## Trap coverage (distinct archetypes)

- **movingPlatform**: 9 arenas
- **teleporter**: 8 arenas
- **spinner**: 8 arenas
- **breakable**: 7 arenas
- **foliageHide**: 6 arenas
- **crusher**: 6 arenas
- **switchDoor**: 6 arenas
- **oobBoundary**: 1 arenas

All **10 trap prefab IDs** are represented across the catalog: movingPlatform, spinner, crusher, teleporter, switchDoor, foliageHide, breakable, water, void, oobBoundary.

## Schema

Each arena entry follows:

```yaml
id: string           # kebab-case unique ID
name: string         # display name
theme: string        # kitchen | jungle | bamboo | clouds | dessert
spawnPoints: number  # 2-6 (4 on batch arenas)
hazards: string[]    # trap prefab IDs used
disguiseProps: string[]  # for Hide & Seek
killVolumes: string[]    # water | void | oobBoundary
status: sample         # procedural JSON; hand Tiled art pending
```

## Full arena list (52)

| ID | Name | Theme | Traps | Kill volumes |
|----|------|-------|-------|--------------|
| bamboo-bamboo-blitz | Bamboo Blitz | bamboo | foliageHide | void |
| bamboo-bridge-battle | Bridge Battle | bamboo | crusher | — |
| bamboo-bridge | Bamboo Bridge | bamboo | movingPlatform | water |
| bamboo-lantern-lane | Lantern Lane | bamboo | teleporter | — |
| bamboo-panda-pass | Panda Pass | bamboo | breakable | — |
| bamboo-pond-peril | Pond Peril | bamboo | spinner | — |
| bamboo-river-run | River Run | bamboo | movingPlatform | void |
| bamboo-shrine-scramble | Shrine Scramble | bamboo | crusher | void |
| bamboo-zen-garden | Zen Garden | bamboo | switchDoor | void |
| breakable-barn | Breakable Barn | bamboo | breakable | — |
| cloud-castle | Cloud Castle | clouds | movingPlatform, teleporter | water |
| clouds-aurora-arena | Aurora Arena | clouds | teleporter | void |
| clouds-cumulus-clash | Cumulus Clash | clouds | breakable | void |
| clouds-nimbus-nest | Nimbus Nest | clouds | crusher | void |
| clouds-rainbow-ridge | Rainbow Ridge | clouds | foliageHide | void |
| clouds-sky-fort | Sky Fort | clouds | teleporter | — |
| clouds-storm-station | Storm Station | clouds | spinner | — |
| clouds-thunder-trail | Thunder Trail | clouds | movingPlatform | — |
| clouds-wind-walk | Wind Walk | clouds | switchDoor | — |
| crusher-cavern | Crusher Cavern | jungle | crusher | — |
| dessert-candy-canyon | Candy Canyon | dessert | movingPlatform | — |
| dessert-donut-dash | Donut Dash | dessert | spinner, breakable | — |
| dessert-frosting-fight | Frosting Fight | dessert | breakable | void |
| dessert-gelato-gauntlet | Gelato Gauntlet | dessert | foliageHide | — |
| dessert-pie-panic | Pie Panic | dessert | teleporter | void |
| dessert-sugar-rush | Sugar Rush | dessert | switchDoor | — |
| foliage-garden | Foliage Garden | jungle | foliageHide | — |
| jungle-canopy-chase | Canopy Chase | jungle | crusher | — |
| jungle-monkey-maze | Monkey Maze | jungle | foliageHide | — |
| jungle-moss-maze | Moss Maze | jungle | movingPlatform | void |
| jungle-ruin-rush | Ruin Rush | jungle | switchDoor | void |
| jungle-snake-pit | Snake Pit | jungle | spinner | void |
| jungle-temple-ruins | Temple Ruins | jungle | movingPlatform | — |
| jungle-temple | Jungle Temple | jungle | spinner | — |
| jungle-totem-trial | Totem Trial | jungle | breakable | — |
| jungle-vine-valley | Vine Valley | jungle | teleporter | void |
| kitchen-blender-blitz | Blender Blitz | kitchen | foliageHide | — |
| kitchen-classic | Kitchen Classic | kitchen | — | — |
| kitchen-counter-clash | Counter Clash | kitchen | switchDoor | — |
| kitchen-fridge-frenzy | Fridge Frenzy | kitchen | movingPlatform | — |
| kitchen-oven-outpost | Oven Outpost | kitchen | breakable | void |
| kitchen-pantry-panic | Pantry Panic | kitchen | crusher | void |
| kitchen-sink-showdown | Sink Showdown | kitchen | teleporter | void |
| kitchen-spice-rack | Spice Rack | kitchen | spinner | — |
| kitchen-toaster-tussle | Toaster Tussle | kitchen | spinner | void |
| oob-arena | OOB Arena | kitchen | oobBoundary | — |
| platform-skyway | Platform Skyway | clouds | movingPlatform | void |
| spinner-gauntlet | Spinner Gauntlet | kitchen | spinner | — |
| switchdoor-vault | Switchdoor Vault | kitchen | switchDoor | — |
| tele-maze | Tele Maze | jungle | teleporter | — |
| void-pit | Void Pit | clouds | — | void |
| water-cove | Water Cove | bamboo | — | water |

## Trap Prefab Catalog

| Prefab ID | Description | Runtime behavior |
|-----------|-------------|------------------|
| movingPlatform | Horizontal/vertical platform | Sinusoidal X offset from originX |
| spinner | Rotating hazard blade | Contact kill + spinning visual |
| crusher | Timed crushing block | Damage window at crush phase |
| teleporter | Paired teleport pads | pairId warp + 500ms cooldown |
| switchDoor | Toggle door via switch | Switch toggles door open state |
| foliageHide | Hide & Seek foliage cluster | disguise match while disguised |
| breakable | Destructible prop | One-shot destroy on contact |
| water | Kill volume, no score | Instant environment kill |
| void | Instant kill pit | Instant environment kill |
| oobBoundary | Dotted line + delayed kill | 1.2s grace then kill |

## Validator Checks

- ≥2 spawn points, ≤6
- Spawn points not inside kill volumes
- Teleporter pairs matched (pairId)
- Hide & Seek: ≥3 disguise props per arena

## Tiled loader

Use `ArenaLoader.fromTiled()` with object types: spawn, disguiseProp, movingPlatform, spinner, crusher, teleporter, switchDoor, foliageHide, breakable, water, void, oobBoundary.
