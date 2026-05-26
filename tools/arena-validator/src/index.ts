import type { ArenaData, TrapPrefab } from '@boomerang/content';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ValidationResult {
  arenaId: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateArena(arena: ArenaData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (arena.spawnPoints.length < 2) {
    errors.push('Need at least 2 spawn points');
  }
  if (arena.spawnPoints.length > 6) {
    errors.push('Max 6 spawn points');
  }

  for (const sp of arena.spawnPoints) {
    for (const kv of arena.killVolumes) {
      if (
        sp.x >= kv.x &&
        sp.x <= kv.x + kv.width &&
        sp.y >= kv.y &&
        sp.y <= kv.y + kv.height
      ) {
        errors.push(`Spawn (${sp.x},${sp.y}) inside kill volume ${kv.type}`);
      }
    }
  }

  const teleporters = arena.hazards.filter((h: TrapPrefab) => h.type === 'teleporter');
  for (const t of teleporters) {
    const pairId = t.properties?.pairId;
    if (!pairId || !teleporters.some((other: TrapPrefab) => other.id === pairId)) {
      warnings.push(`Teleporter ${t.id} missing pair: ${String(pairId)}`);
    }
  }

  if (arena.disguiseProps.length < 3) {
    warnings.push('Hide & Seek: recommend ≥3 disguise props');
  }

  return { arenaId: arena.id, valid: errors.length === 0, errors, warnings };
}

// CLI stub
const arenaPath = process.argv[2];
if (arenaPath) {
  const raw = readFileSync(resolve(arenaPath), 'utf-8');
  const arena = JSON.parse(raw) as ArenaData;
  const result = validateArena(arena);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.valid ? 0 : 1);
} else {
  // Validate bundled sample arenas
  const samples = [
    'kitchen-classic', 'jungle-temple', 'bamboo-bridge',
    'switchdoor-vault', 'foliage-garden', 'breakable-barn',
    'spinner-gauntlet', 'platform-skyway', 'crusher-cavern',
    'tele-maze', 'water-cove', 'void-pit', 'oob-arena',
    'dessert-donut-dash', 'cloud-castle',
  ];
  for (const id of samples) {
    const path = resolve(__dirname, `../../../packages/game-core/src/arenas/${id}.json`);
    const arena = JSON.parse(readFileSync(path, 'utf-8')) as ArenaData;
    const result = validateArena(arena);
    console.log(`${result.valid ? '✓' : '✗'} ${id}`, result.errors, result.warnings);
  }
}
