import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { createServer } from 'node:http';
import { GameRoom } from './rooms/GameRoom.js';

const PORT = Number(process.env.PORT ?? 2567);

const httpServer = createServer();
const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

gameServer.define('game', GameRoom);

httpServer.listen(PORT, () => {
  console.log(`Colyseus server listening on ws://localhost:${PORT}`);
});
