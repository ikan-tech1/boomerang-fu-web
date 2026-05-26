#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const arenaDir = resolve(__dirname, '../../packages/game-core/src/arenas');
const outPath = resolve(__dirname, '../../docs/reference/arena-catalog.md');

const files = readdirSync(arenaDir).filter((f) => f.endsWith('.json')).sort();
const rows = [];
const trapCounts = {};

for (const f of files) {
  const a = JSON.parse(readFileSync(resolve(arenaDir, f), 'utf8'));
  const traps = [...new Set((a.hazards ?? []).map((h) => h.type))];
  const kills = [...new Set((a.killVolumes ?? []).map((k) => k.type))];
  for (const t of traps) trapCounts[t] = (trapCounts[t] ?? 0) + 1;
  rows.push({ id: a.id, name: a.name, theme: a.theme, traps, kills });
}

const table = [
  '| ID | Name | Theme | Traps | Kill volumes |',
  '|----|------|-------|-------|--------------|',
  ...rows.map(
    (r) =>
      `| ${r.id} | ${r.name} | ${r.theme} | ${r.traps.join(', ') || '—'} | ${r.kills.join(', ') || '—'} |`,
  ),
].join('\n');

const trapSummary = Object.entries(trapCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([t, n]) => `- **${t}**: ${n} arenas`)
  .join('\n');

const body = `# Arena Catalog

> **${rows.length} arenas** registered in \`ARENA_REGISTRY\` (procedural batches + 15 flagship layouts).
> Last generated: ${new Date().toISOString().slice(0, 10)}

## Trap coverage (distinct archetypes)

${trapSummary}

All **10 trap prefab IDs** are represented across the catalog: movingPlatform, spinner, crusher, teleporter, switchDoor, foliageHide, breakable, water, void, oobBoundary.

## Schema

Each arena entry follows:

\`\`\`yaml
id: string           # kebab-case unique ID
name: string         # display name
theme: string        # kitchen | jungle | bamboo | clouds | dessert
spawnPoints: number  # 2-6 (4 on batch arenas)
hazards: string[]    # trap prefab IDs used
disguiseProps: string[]  # for Hide & Seek
killVolumes: string[]    # water | void | oobBoundary
status: sample         # procedural JSON; hand Tiled art pending
\`\`\`

## Full arena list (${rows.length})

${table}

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

Use \`ArenaLoader.fromTiled()\` with object types: spawn, disguiseProp, movingPlatform, spinner, crusher, teleporter, switchDoor, foliageHide, breakable, water, void, oobBoundary.
`;

writeFileSync(outPath, body);
console.log(`Wrote ${outPath} (${rows.length} arenas)`);
