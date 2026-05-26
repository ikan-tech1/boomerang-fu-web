import { balance } from '@boomerang/content';
import type { PlayerEntity } from '../entities/Player';

const TELEKINESIS_RADIUS_PX = 180;
const STEER_STRENGTH = 0.18;

/** Steer airborne boomerangs within radius for players with active telekinesis. */
export class TelekinesisSystem {
  update(players: PlayerEntity[]): void {
    for (const controller of players) {
      if (!controller.alive || !controller.inventory.has('telekinesis')) continue;
      if (Math.hypot(controller.aimX, controller.aimY) < balance.controls.stickDeadzone) continue;

      const cx = controller.body.position.x;
      const cy = controller.body.position.y;

      for (const owner of players) {
        const b = owner.boomerang;
        if (!b.body || b.state === 'held' || b.state === 'dropped') continue;
        const dx = b.body.position.x - cx;
        const dy = b.body.position.y - cy;
        if (Math.hypot(dx, dy) > TELEKINESIS_RADIUS_PX) continue;

        b.steerToward(controller.aimX, controller.aimY, STEER_STRENGTH);
      }
    }
  }
}
