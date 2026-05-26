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

## Sample Arenas (Phase 3)

| ID | Name | Theme | Hazards | Status |
|----|------|-------|---------|--------|
| kitchen-classic | Kitchen Classic | kitchen | spinner, oob | sample |
| jungle-temple | Jungle Temple | jungle | teleporter, crusher | sample |
| bamboo-bridge | Bamboo Bridge | bamboo | movingPlatform, water | sample |

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
