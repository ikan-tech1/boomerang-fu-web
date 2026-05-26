import { Room, Client } from '@colyseus/core';
import type { GameStateSnapshot, InputFrame } from '@boomerang/netcode';

/** Authoritative game room stub — accepts input frames, broadcasts state snapshots */
export class GameRoom extends Room<{ snapshot: GameStateSnapshot }> {
  maxClients = 6;
  private tick = 0;
  private inputQueue: InputFrame[] = [];

  onCreate(): void {
    this.setState({
      snapshot: {
        tick: 0,
        players: [],
        boomerangs: [],
        powerUps: [],
        mode: 'freeForAll',
        roundTimerMs: 120000,
      },
    });

    this.setSimulationInterval(() => this.step(), 1000 / 60);

    this.onMessage('input', (client, input: InputFrame) => {
      input.playerId = this.clients.indexOf(client);
      this.inputQueue.push(input);
    });
  }

  onJoin(_client: Client): void {
    // Player joined
  }

  onLeave(_client: Client): void {
    // Player left
  }

  private step(): void {
    this.tick += 1;
    this.state.snapshot.tick = this.tick;
    this.inputQueue.length = 0;
  }
}
