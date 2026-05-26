import { Room, Client } from '@colyseus/core';
import type { InputFrame } from '@boomerang/netcode';

/** Authoritative game room stub — accepts input frames, broadcasts state snapshots */
export class GameRoom extends Room {
  override maxClients = 6;
  private tick = 0;
  private inputQueue: InputFrame[] = [];

  override onCreate(): void {
    this.setSimulationInterval(() => this.step(), 1000 / 60);

    this.onMessage('input', (client, input: InputFrame) => {
      input.playerId = this.clients.indexOf(client);
      this.inputQueue.push(input);
    });
  }

  override onJoin(_client: Client): void {
    // Player joined — bot backfill stub for empty slots
  }

  override onLeave(_client: Client): void {
    // Player left
  }

  private step(): void {
    this.tick += 1;
    // Stub: real implementation runs Matter sim server-side and broadcasts state
    this.inputQueue.length = 0;
  }
}
