import { createEmptyInputFrame, type InputFrame, type InputButtons } from '@boomerang/netcode';

export interface KeyboardProfile {
  playerId: number;
  up: string;
  down: string;
  left: string;
  right: string;
  dash: string;
  melee: string;
  throw: string;
  recall: string;
}

const DEFAULT_PROFILES: KeyboardProfile[] = [
  {
    playerId: 0,
    up: 'KeyW',
    down: 'KeyS',
    left: 'KeyA',
    right: 'KeyD',
    dash: 'ShiftLeft',
    melee: 'KeyE',
    throw: 'Space',
    recall: 'KeyR',
  },
  {
    playerId: 1,
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    dash: 'Numpad0',
    melee: 'Numpad1',
    throw: 'Numpad2',
    recall: 'Numpad3',
  },
];

export class LocalInputMux {
  private frame = 0;
  private readonly keys = new Map<string, boolean>();
  private readonly profiles: KeyboardProfile[];
  private readonly gamepads: (Gamepad | null)[] = [];
  readonly maxPlayers = 6;

  constructor(profiles: KeyboardProfile[] = DEFAULT_PROFILES) {
    this.profiles = profiles;
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => this.keys.set(e.code, true));
      window.addEventListener('keyup', (e) => this.keys.set(e.code, false));
    }
  }

  poll(playerCount: number): InputFrame[] {
    this.frame += 1;
    const frames: InputFrame[] = [];
    const count = Math.min(playerCount, this.maxPlayers);

    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      const pads = navigator.getGamepads();
      for (let i = 0; i < pads.length; i++) {
        this.gamepads[i] = pads[i] ?? null;
      }
    }

    for (let id = 0; id < count; id++) {
      const profile = this.profiles.find((p) => p.playerId === id);
      const pad = this.gamepads[id];

      if (pad) {
        frames.push(this.pollGamepad(id, pad));
      } else if (profile) {
        frames.push(this.pollKeyboard(id, profile));
      } else {
        frames.push(createEmptyInputFrame(this.frame, id));
      }
    }

    return frames;
  }

  private pollKeyboard(playerId: number, profile: KeyboardProfile): InputFrame {
    let moveX = 0;
    let moveY = 0;
    if (this.keys.get(profile.left)) moveX -= 1;
    if (this.keys.get(profile.right)) moveX += 1;
    if (this.keys.get(profile.up)) moveY -= 1;
    if (this.keys.get(profile.down)) moveY += 1;

    const len = Math.hypot(moveX, moveY);
    const aimX = len > 0 ? moveX / len : 1;
    const aimY = len > 0 ? moveY / len : 0;

    const buttons: InputButtons = {
      dash: this.keys.get(profile.dash) ?? false,
      melee: this.keys.get(profile.melee) ?? false,
      throw: this.keys.get(profile.throw) ?? false,
      throwHeld: this.keys.get(profile.throw) ?? false,
      recall: this.keys.get(profile.recall) ?? false,
    };

    return { frame: this.frame, playerId, moveX, moveY, aimX, aimY, buttons };
  }

  private pollGamepad(playerId: number, pad: Gamepad): InputFrame {
    const lx = pad.axes[0] ?? 0;
    const ly = pad.axes[1] ?? 0;
    const rx = pad.axes[2] ?? lx;
    const ry = pad.axes[3] ?? ly;

    const moveLen = Math.hypot(lx, ly);
    const aimLen = Math.hypot(rx, ry);

    return {
      frame: this.frame,
      playerId,
      moveX: moveLen > 0.15 ? lx : 0,
      moveY: moveLen > 0.15 ? ly : 0,
      aimX: aimLen > 0.15 ? rx : (moveLen > 0.15 ? lx : 1),
      aimY: aimLen > 0.15 ? ry : (moveLen > 0.15 ? ly : 0),
      buttons: {
        dash: pad.buttons[0]?.pressed ?? false,
        melee: pad.buttons[2]?.pressed ?? false,
        throw: pad.buttons[1]?.pressed ?? false,
        throwHeld: pad.buttons[1]?.pressed ?? false,
        recall: pad.buttons[3]?.pressed ?? false,
      },
    };
  }
}
