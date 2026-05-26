import type { ArenaData } from '@boomerang/content';
import bambooBridge from './bamboo-bridge.json';
import breakableBarn from './breakable-barn.json';
import cloudCastle from './cloud-castle.json';
import crusherCavern from './crusher-cavern.json';
import dessertDonutDash from './dessert-donut-dash.json';
import foliageGarden from './foliage-garden.json';
import jungleTemple from './jungle-temple.json';
import kitchenClassic from './kitchen-classic.json';
import oobArena from './oob-arena.json';
import platformSkyway from './platform-skyway.json';
import spinnerGauntlet from './spinner-gauntlet.json';
import switchdoorVault from './switchdoor-vault.json';
import teleMaze from './tele-maze.json';
import voidPit from './void-pit.json';
import waterCove from './water-cove.json';

/** All bundled arena JSON keyed by id */
export const ARENA_REGISTRY: Record<string, ArenaData> = {
  'kitchen-classic': kitchenClassic as unknown as ArenaData,
  'jungle-temple': jungleTemple as unknown as ArenaData,
  'bamboo-bridge': bambooBridge as unknown as ArenaData,
  'switchdoor-vault': switchdoorVault as unknown as ArenaData,
  'foliage-garden': foliageGarden as unknown as ArenaData,
  'breakable-barn': breakableBarn as unknown as ArenaData,
  'spinner-gauntlet': spinnerGauntlet as unknown as ArenaData,
  'platform-skyway': platformSkyway as unknown as ArenaData,
  'crusher-cavern': crusherCavern as unknown as ArenaData,
  'tele-maze': teleMaze as unknown as ArenaData,
  'water-cove': waterCove as unknown as ArenaData,
  'void-pit': voidPit as unknown as ArenaData,
  'oob-arena': oobArena as unknown as ArenaData,
  'dessert-donut-dash': dessertDonutDash as unknown as ArenaData,
  'cloud-castle': cloudCastle as unknown as ArenaData,
};

export const DEFAULT_ARENA_ID = 'kitchen-classic';
