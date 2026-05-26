import { Schema, type, MapSchema } from '@colyseus/schema';

export class PlayerSchema extends Schema {
  @type('number') x = 400;
  @type('number') y = 300;
  @type('number') vx = 0;
  @type('number') vy = 0;
  @type('boolean') alive = true;
  @type('number') kills = 0;
  @type('string') characterId = 'avocado';
}

export class GameStateSchema extends Schema {
  @type('number') tick = 0;
  @type('string') roomCode = '';
  @type('string') mode = 'freeForAll';
  @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
}
