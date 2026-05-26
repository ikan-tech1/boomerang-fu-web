import { Client, type Room } from 'colyseus.js';
import type { InputFrame } from '@boomerang/netcode';

export interface OnlineRoomInfo {
  roomCode: string;
  sessionId: string;
  playerId: number;
}

export class OnlineClient {
  private client: Client | null = null;
  private room: Room | null = null;

  get connected(): boolean {
    return this.room !== null;
  }

  get roomInfo(): OnlineRoomInfo | null {
    if (!this.room) return null;
    const meta = this.room.metadata as { roomCode?: string } | undefined;
    return {
      roomCode: meta?.roomCode ?? this.room.roomId.slice(0, 6).toUpperCase(),
      sessionId: this.room.sessionId,
      playerId: this.room.state?.players?.size
        ? [...this.room.state.players.keys()].indexOf(this.room.sessionId)
        : 0,
    };
  }

  async connect(endpoint: string, options?: { mode?: string; arenaId?: string; characterId?: string }): Promise<OnlineRoomInfo> {
    this.client = new Client(endpoint);
    this.room = await this.client.joinOrCreate('game', {
      mode: options?.mode ?? 'freeForAll',
      arenaId: options?.arenaId ?? 'kitchen-classic',
      characterId: options?.characterId ?? 'avocado',
    });

    const meta = this.room.metadata as { roomCode?: string };
    return {
      roomCode: meta?.roomCode ?? '------',
      sessionId: this.room.sessionId,
      playerId: this.room.state?.players?.get(this.room.sessionId) ? 0 : this.room.state?.players?.size ?? 0,
    };
  }

  async joinByCode(endpoint: string, roomCode: string, options?: { characterId?: string }): Promise<OnlineRoomInfo> {
    this.client = new Client(endpoint);
    const rooms = await this.client.getAvailableRooms('game');
    const match = rooms.find((r) => (r.metadata as { roomCode?: string })?.roomCode === roomCode.toUpperCase());
    if (!match) {
      throw new Error(`No room found for code ${roomCode}`);
    }
    this.room = await this.client.joinById(match.roomId, {
      characterId: options?.characterId ?? 'avocado',
    });
    const meta = this.room.metadata as { roomCode?: string };
    return {
      roomCode: meta?.roomCode ?? roomCode,
      sessionId: this.room.sessionId,
      playerId: this.room.state?.players?.size ?? 0,
    };
  }

  sendInput(input: InputFrame): void {
    this.room?.send('input', input);
  }

  onStateChange(handler: (state: unknown) => void): void {
    this.room?.onStateChange(handler);
  }

  disconnect(): void {
    void this.room?.leave();
    this.room = null;
    this.client = null;
  }
}

export function getColyseusEndpoint(): string {
  return import.meta.env.VITE_COLYSEUS_URL ?? 'ws://localhost:2567';
}
