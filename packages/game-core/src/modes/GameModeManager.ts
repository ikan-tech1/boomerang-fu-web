import { balance } from '@boomerang/content';

export type GameModeId = 'freeForAll' | 'teams' | 'goldenBoomerang' | 'hideAndSeek';

export interface ModeState {
  phase: string;
  roundTimerMs: number;
  goldenSpawned: boolean;
  hidePhase: boolean;
}

export class GameModeManager {
  readonly mode: GameModeId;
  state: ModeState;

  constructor(mode: GameModeId) {
    this.mode = mode;
    this.state = {
      phase: 'countdown',
      roundTimerMs: balance.match.defaultRoundTimerSec * 1000,
      goldenSpawned: false,
      hidePhase: mode === 'hideAndSeek',
    };
  }

  update(dt: number): void {
    if (this.state.phase !== 'playing') return;

    this.state.roundTimerMs = Math.max(0, this.state.roundTimerMs - dt);

    if (this.mode === 'hideAndSeek') {
      const hideMs = (balance.modes.hideAndSeek as { hidePhaseSec: number }).hidePhaseSec * 1000;
      const totalMs = balance.match.defaultRoundTimerSec * 1000;
      this.state.hidePhase = this.state.roundTimerMs > totalMs - hideMs;
    }

    if (this.mode === 'goldenBoomerang' && !this.state.goldenSpawned) {
      const spawnDelay =
        (balance.modes.goldenBoomerang as { spawnDelaySec: number }).spawnDelaySec * 1000;
      const elapsed = balance.match.defaultRoundTimerSec * 1000 - this.state.roundTimerMs;
      if (elapsed >= spawnDelay) {
        this.state.goldenSpawned = true;
      }
    }
  }

  startRound(): void {
    this.state.phase = 'playing';
    this.state.roundTimerMs = balance.match.defaultRoundTimerSec * 1000;
    this.state.goldenSpawned = false;
    this.state.hidePhase = this.mode === 'hideAndSeek';
  }

  isRoundOver(): boolean {
    return this.state.roundTimerMs <= 0;
  }

  canFriendlyFire(attackerTeam?: number, victimTeam?: number): boolean {
    if (this.mode === 'freeForAll') return false;
    if (this.mode === 'teams' && attackerTeam !== undefined && victimTeam !== undefined) {
      return attackerTeam === victimTeam;
    }
    return false;
  }

  getModeLabel(): string {
    const labels: Record<GameModeId, string> = {
      freeForAll: 'Free-for-All',
      teams: 'Teams',
      goldenBoomerang: 'Golden Boomerang',
      hideAndSeek: 'Hide & Seek',
    };
    return labels[this.mode];
  }
}
