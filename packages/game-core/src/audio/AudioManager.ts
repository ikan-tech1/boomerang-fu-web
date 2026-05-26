import { Howl } from 'howler';

/** Stub audio manager — maps game events to Howler sprites (no assets yet) */
export class AudioManager {
  private enabled = true;
  private readonly stubs = new Map<string, Howl>();

  constructor() {
    // Placeholder silent howls for future asset swap
    const events = [
      'throw',
      'catch',
      'melee',
      'dash',
      'pickup',
      'explosion',
      'freeze',
      'kill',
      'ui_click',
      'round_sting',
      'music_menu',
      'music_round',
    ];
    for (const id of events) {
      this.stubs.set(
        id,
        new Howl({
          src: [
            'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
          ],
          volume: 0,
        }),
      );
    }
  }

  play(event: string): void {
    if (!this.enabled) return;
    this.stubs.get(event)?.play();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /** Future: load sprite banks from assets/build/ */
  loadBank(_bankId: string, _url: string): void {
    // stub
  }
}

export const audioManager = new AudioManager();
