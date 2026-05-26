import Phaser from 'phaser';
import { SandboxScene } from './scenes/SandboxScene';
import type { GameLaunchOptions } from './types';

export type { GameLaunchOptions } from './types';
export { SandboxScene } from './scenes/SandboxScene';
export { LocalInputMux } from './input/LocalInputMux';
export { CharacterRegistry } from './characters/CharacterRegistry';
export { AudioManager } from './audio/AudioManager';
export { GameModeManager, type GameModeId } from './modes/GameModeManager';
export { ArenaLoader } from './arena/ArenaLoader';

export function createGame(
  parent: HTMLElement | string,
  options: GameLaunchOptions = {},
): Phaser.Game {
  const {
    width = 960,
    height = 540,
    debug = false,
    mode = 'freeForAll',
    arenaId = 'kitchen-classic',
    botCount = 1,
    characterId = 'avocado',
    friendlyFire = false,
  } = options;

  return new Phaser.Game({
    type: Phaser.AUTO,
    width,
    height,
    parent,
    backgroundColor: '#1a1a2e',
    physics: {
      default: 'matter',
      matter: {
        gravity: { x: 0, y: 0 },
        debug: debug,
      },
    },
    scene: [SandboxScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    callbacks: {
      preBoot: (game) => {
        game.registry.set('launchOptions', {
          debug,
          mode,
          arenaId,
          botCount,
          characterId,
          friendlyFire,
        });
      },
    },
  });
}
