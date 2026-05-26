# Arena Catalog Template

> Target: 50+ arenas (12 base themes + DLC). This document tracks parity status.

## Schema

Each arena entry follows:

```yaml
id: string           # kebab-case unique ID
name: string         # display name
theme: string        # kitchen | jungle | bamboo | clouds | dessert | ...
source: string       # base | just-desserts-dlc
spawnPoints: number  # 2-6
hazards: string[]    # trap prefab IDs used
disguiseProps: string[]  # for Hide & Seek
killVolumes: string[]    # water | void | oob
status: stub | sample | complete
```

## Sample Arenas (Phase 3) — 15 shipped

| ID | Name | Theme | Primary trap | Status |
|----|------|-------|--------------|--------|
| kitchen-classic | Kitchen Classic | kitchen | spinner | sample |
| jungle-temple | Jungle Temple | jungle | teleporter, crusher | sample |
| bamboo-bridge | Bamboo Bridge | bamboo | movingPlatform, water | sample |
| switchdoor-vault | Switchdoor Vault | kitchen | switchDoor | sample |
| foliage-garden | Foliage Garden | jungle | foliageHide | sample |
| breakable-barn | Breakable Barn | bamboo | breakable | sample |
| spinner-gauntlet | Spinner Gauntlet | kitchen | spinner | sample |
| platform-skyway | Platform Skyway | clouds | movingPlatform | sample |
| crusher-cavern | Crusher Cavern | jungle | crusher | sample |
| tele-maze | Tele Maze | jungle | teleporter | sample |
| water-cove | Water Cove | bamboo | water | sample |
| void-pit | Void Pit | clouds | void | sample |
| oob-arena | OOB Arena | kitchen | oobBoundary | sample |
| dessert-donut-dash | Donut Dash | dessert | spinner, breakable | sample |
| cloud-castle | Cloud Castle | clouds | movingPlatform, teleporter | sample |

## Trap Prefab Catalog

| Prefab ID | Description |
|-----------|-------------|
| movingPlatform | Horizontal/vertical platform |
| spinner | Rotating hazard blade |
| crusher | Timed crushing block |
| teleporter | Paired teleport pads |
| switchDoor | Toggle door via switch |
| foliageHide | Hide & Seek foliage cluster |
| breakable | Destructible prop |
| water | Kill volume, no score |
| void | Instant kill pit |
| oobBoundary | Dotted line + delayed kill |

## Themed Batches (future)

1. **Batch 1**: Kitchen (6 arenas) — baseline traps
2. **Batch 2**: Jungle/Temple (8 arenas) — teleporters, crushers
3. **Batch 3**: Bamboo/Clouds (8 arenas) — moving platforms
4. **Batch 4**: Just Desserts DLC (8 arenas) — dessert props
5. **Batch 5+**: Remaining base + variants to 50+

## Validator Checks

- ≥2 spawn points, ≤6
- Spawn points not inside kill volumes
- Teleporter pairs matched
- Hide & Seek: ≥3 disguise props per arena
