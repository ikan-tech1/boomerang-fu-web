import { Room, Client } from '@colyseus/core';
import type { InputFrame } from '@boomerang/netcode';
import { AuthoritativeSim } from '../sim/AuthoritativeSim.js';
import { GameStateSchema, PlayerSchema } from '../schema/GameStateSchema.js';

function randomRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Authoritative Colyseus room — Matter sim + state sync + join codes */
export class GameRoom extends Room<{ state: GameStateSchema }> {
  override maxClients = 6;
  private tick = 0;
  private readonly inputQueue: InputFrame[] = [];
  private sim = new AuthoritativeSim();

  override onCreate(options: { mode?: string; arenaId?: string }): void {
    const state = new GameStateSchema();
    state.roomCode = randomRoomCode();
    state.mode = options.mode ?? 'freeForAll';
    this.setState(state);

    this.setMetadata({
      roomCode: state.roomCode,
      arenaId: options.arenaId ?? 'kitchen-classic',
      mode: state.mode,
    });

    this.setSimulationInterval(() => this.step(), 1000 / 60);

    this.onMessage('input', (client, input: InputFrame) => {
      const playerId = this.clients.indexOf(client);
      if (playerId < 0) return;
      input.playerId = playerId;
      this.inputQueue.push(input);
    });
  }

  override onJoin(client: Client, options?: { characterId?: string }): void {
    const playerId = this.clients.indexOf(client);
    const spawnX = 150 + playerId * 100;
    const spawnY = 300;
    const characterId = options?.characterId ?? 'avocado';

    this.sim.addPlayer(playerId, characterId, spawnX, spawnY);

    const ps = new PlayerSchema();
    ps.x = spawnX;
    ps.y = spawnY;
    ps.characterId = characterId;
    this.state.players.set(String(playerId), ps);
  }

  override onLeave(client: Client): void {
    const playerId = this.clients.indexOf(client);
    this.sim.removePlayer(playerId);
    this.state.players.delete(String(playerId));
  }

  private step(): void {
    this.tick += 1;
    this.state.tick = this.tick;

    this.sim.applyInputs(this.inputQueue);
    this.inputQueue.length = 0;
    this.sim.step();

    for (const snap of this.sim.snapshot()) {
      const ps = this.state.players.get(String(snap.id));
      if (!ps) continue;
      ps.x = snap.x;
      ps.y = snap.y;
      ps.vx = snap.vx;
      ps.vy = snap.vy;
      ps.alive = snap.alive;
      ps.kills = snap.kills;
      ps.characterId = snap.characterId;
    }
  }
}
