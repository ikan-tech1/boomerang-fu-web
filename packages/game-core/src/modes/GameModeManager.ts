import { balance } from '@boomerang/content';
import type { PlayerEntity } from '../entities/Player';

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
  friendlyFire = false;

  constructor(mode: GameModeId, options?: { friendlyFire?: boolean }) {
    this.mode = mode;
    this.friendlyFire = options?.friendlyFire ?? false;
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

  canScoreKill(): boolean {
    if (this.mode === 'hideAndSeek' && this.state.hidePhase) return false;
    return true;
  }

  canFriendlyFire(attackerTeam?: number, victimTeam?: number): boolean {
    if (this.mode === 'freeForAll') return false;
    if (this.mode === 'teams') {
      if (this.friendlyFire) return false;
      if (attackerTeam !== undefined && victimTeam !== undefined) {
        return attackerTeam === victimTeam;
      }
    }
    return false;
  }

  getPhaseLabel(): string {
    if (this.mode === 'hideAndSeek') {
      return this.state.hidePhase ? 'Hide Phase' : 'Seek Phase';
    }
    if (this.mode === 'goldenBoomerang' && !this.state.goldenSpawned) {
      return 'Golden spawns soon…';
    }
    return '';
  }

  getTeamScores(players: PlayerEntity[]): { team: number; kills: number; name: string }[] {
    const teamNames = (balance.modes.teams as { teamNames: string[] }).teamNames;
    const scores = new Map<number, number>();
    for (const p of players) {
      const team = p.team ?? 0;
      scores.set(team, (scores.get(team) ?? 0) + p.kills);
    }
    return [...scores.entries()]
      .sort(([a], [b]) => a - b)
      .map(([team, kills]) => ({
        team,
        kills,
        name: teamNames[team] ?? `Team ${team + 1}`,
      }));
  }

  getWinnerLabel(players: PlayerEntity[]): string {
    if (this.mode === 'teams') {
      const teams = this.getTeamScores(players);
      const winner = teams.sort((a, b) => b.kills - a.kills)[0];
      return winner ? `${winner.name} wins (${winner.kills} kills)` : 'Draw';
    }
    const sorted = [...players].sort((a, b) => b.kills - a.kills);
    const winner = sorted[0];
    return winner ? `P${winner.id + 1} wins (${winner.kills} kills)` : 'Draw';
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

  shouldSpawnGoldenPickup(): boolean {
    return this.mode === 'goldenBoomerang' && this.state.goldenSpawned;
  }
}
